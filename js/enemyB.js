import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import { Pathfinder } from './pathfinder.js';

export class EnemyB {
    constructor(scene, mapGrid, mapWidth, mapHeight, goalPosition) {
        this.scene = scene;
        this.mapGrid = mapGrid;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.goalPosition = goalPosition;

        // Visual representation: ホラー風（浮遊する多面体と青白いコア）
        this.mesh = new THREE.Group();
        this.mesh.position.y = 1;

        // 棘々しい外殻（Icosahedronのワイヤーフレーム）
        const shellGeo = new THREE.IcosahedronGeometry(0.6, 0);
        const shellMat = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            roughness: 0.2, 
            metalness: 0.8,
            wireframe: true 
        });
        this.shell = new THREE.Mesh(shellGeo, shellMat);
        this.mesh.add(this.shell);

        // 内側の黒い殻
        const shellGeo2 = new THREE.IcosahedronGeometry(0.4, 1);
        const shellMat2 = new THREE.MeshStandardMaterial({ 
            color: 0x020202, 
            roughness: 0.9, 
        });
        this.shell2 = new THREE.Mesh(shellGeo2, shellMat2);
        this.mesh.add(this.shell2);

        // 中心で強く光るコア
        const coreGeo = new THREE.OctahedronGeometry(0.2);
        const coreMat = new THREE.MeshStandardMaterial({ 
            color: 0x00aaff, 
            emissive: 0x00aaff,
            emissiveIntensity: 5.0 
        });
        this.core = new THREE.Mesh(coreGeo, coreMat);
        this.mesh.add(this.core);

        // 足元を照らす赤い光（接近の警告・難易度緩和用）
        const glowLight = new THREE.PointLight(0xff0000, 10.0, 15);
        glowLight.position.set(0, -0.8, 0);
        this.mesh.add(glowLight);

        this.scene.add(this.mesh);

        // State Machine
        // 'PATROL', 'CHASE', 'SEARCH'
        this.state = 'PATROL';
        this.targetPosition = new THREE.Vector3();
        this.lastKnownPlayerPosition = new THREE.Vector3();
        this.searchTimer = 0;
        this.chasePatienceTimer = 0;

        this.isKeyFound = false; // Switches patrol mode
        
        // Pathfinding
        this.pathfinder = new Pathfinder(this.mapGrid, this.mapWidth, this.mapHeight);
        this.currentPath = [];

    }

    setRandomPatrolTarget() {
        let x, z;
        if (this.isKeyFound) {
            // Patrol near goal
            const radius = 10;
            do {
                x = this.goalPosition.x + Math.floor(Math.random() * radius * 2 - radius);
                z = this.goalPosition.y + Math.floor(Math.random() * radius * 2 - radius);
            } while (z < 0 || z >= this.mapHeight || x < 0 || x >= this.mapWidth || this.mapGrid[z][x] !== 0);
        } else {
            // Patrol completely randomly
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                z = Math.floor(Math.random() * this.mapHeight);
            } while (this.mapGrid[z][x] !== 0);
        }
        
        this.targetPosition.set(
            x * CONSTANTS.GRID_SCALE,
            1,
            z * CONSTANTS.GRID_SCALE
        );
        this.calculatePath();
    }

    calculatePath() {
        const startX = this.mesh.position.x / CONSTANTS.GRID_SCALE;
        const startZ = this.mesh.position.z / CONSTANTS.GRID_SCALE;
        const goalX = this.targetPosition.x / CONSTANTS.GRID_SCALE;
        const goalZ = this.targetPosition.z / CONSTANTS.GRID_SCALE;
        this.currentPath = this.pathfinder.findPath(startX, startZ, goalX, goalZ);
    }

    onCorrectKeyPickedUp() {
        this.isKeyFound = true;
        if (this.state === 'PATROL') {
            this.setRandomPatrolTarget();
        }
    }

    update(delta, player) {
        // アニメーション（回転と脈動）
        if (this.shell && this.shell2 && this.core) {
            this.shell.rotation.x += delta * 1.5;
            this.shell.rotation.y += delta * 1.2;
            this.shell2.rotation.x -= delta * 0.8;
            this.shell2.rotation.z += delta * 1.0;
            
            const time = Date.now() * 0.005;
            const scale = 1.0 + Math.sin(time) * 0.2;
            this.core.scale.set(scale, scale, scale);
        }

        const distToPlayer = this.mesh.position.distanceTo(player.position);
        
        // 2. Check if enemy can sense player (Sight ONLY)
        const canSeePlayer = this.checkSight(player.position, distToPlayer);

        if (canSeePlayer) {
            this.state = 'CHASE';
            this.chasePatienceTimer = CONSTANTS.AI_CHASE_PATIENCE_TIME / 1000;
            
            // ターゲットが大きく動いた時、または経路が無い時だけ再計算
            if (this.targetPosition.distanceTo(player.position) > 1.0 || this.currentPath.length === 0) {
                this.lastKnownPlayerPosition.copy(player.position);
                this.targetPosition.copy(player.position);
                this.calculatePath(); 
            }
        } else if (this.state === 'CHASE') {
            if (this.chasePatienceTimer > 0) {
                // 視界からは消えたが、推測して追い続ける（猶予期間）
                this.chasePatienceTimer -= delta;
                if (this.targetPosition.distanceTo(player.position) > 1.0 || this.currentPath.length === 0) {
                    this.lastKnownPlayerPosition.copy(player.position);
                    this.targetPosition.copy(player.position);
                    this.calculatePath();
                }
            } else {
                // 完全に追跡をロストした
                this.state = 'SEARCH';
                this.searchTimer = CONSTANTS.AI_LOST_LOOK_TIME / 1000;
                this.targetPosition.copy(this.lastKnownPlayerPosition);
                this.calculatePath(); // 見失った位置までのパス
            }
        }

        if (this.state === 'SEARCH') {
            this.searchTimer -= delta;
            if (this.searchTimer <= 0) {
                // Done searching, go back to patrol
                this.searchTimer = CONSTANTS.AI_FIND_LOOK_TIME / 1000;
                this.state = 'LOOK_AROUND';
            }
        } else if (this.state === 'LOOK_AROUND') {
            this.searchTimer -= delta;
            if (this.searchTimer <= 0) {
                this.state = 'PATROL';
                this.setRandomPatrolTarget();
            }
        }

        // Move towards target
        let speed = this.state === 'CHASE' ? CONSTANTS.ENEMY_B_SPEED : CONSTANTS.ENEMY_B_PATROL_SPEED;
        if (this.state === 'SEARCH') speed = CONSTANTS.ENEMY_B_PATROL_SPEED;

        if (this.currentPath.length > 0) {
            const nextNode = this.currentPath[0];
            const targetPoint = new THREE.Vector3(
                nextNode.x * CONSTANTS.GRID_SCALE,
                this.mesh.position.y,
                nextNode.z * CONSTANTS.GRID_SCALE
            );

            const direction = new THREE.Vector3().subVectors(targetPoint, this.mesh.position);
            direction.y = 0;
            const dist = direction.length();
            
            if (dist > 0.1) {
                direction.normalize();
                const moveDist = Math.min(speed * delta, dist);
                this.moveWithCollision(direction, moveDist);
            } else {
                this.currentPath.shift();
            }
        } else {
            // 経路がない（同じグリッドにいるなど）場合のフォールバック移動
            if (this.state === 'CHASE' || this.state === 'SEARCH') {
                const direction = new THREE.Vector3().subVectors(this.targetPosition, this.mesh.position);
                direction.y = 0;
                const dist = direction.length();
                if (dist > 0.1) {
                    direction.normalize();
                    const moveDist = Math.min(speed * delta, dist);
                    this.moveWithCollision(direction, moveDist);
                }
            } else if (this.state === 'PATROL') {
                this.setRandomPatrolTarget();
            }
        }
    }

    checkSight(playerPosition, distToPlayer) {
        if (distToPlayer > CONSTANTS.ENEMY_B_VISION_RANGE) return false;
        // Check FOV
        const dirToPlayer = new THREE.Vector3().subVectors(playerPosition, this.mesh.position).normalize();
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion);
        const angle = forward.angleTo(dirToPlayer);
        
        if (angle >= CONSTANTS.ENEMY_B_VISION_FOV) return false;

        // Check Line of Sight
        const startX = this.mesh.position.x / CONSTANTS.GRID_SCALE;
        const startZ = this.mesh.position.z / CONSTANTS.GRID_SCALE;
        const endX = playerPosition.x / CONSTANTS.GRID_SCALE;
        const endZ = playerPosition.z / CONSTANTS.GRID_SCALE;

        return this.pathfinder.hasLineOfSight(startX, startZ, endX, endZ);
    }

    moveWithCollision(direction, distance) {
        // 先に移動を適用する
        this.mesh.position.x += direction.x * distance;
        this.mesh.position.z += direction.z * distance;
        
        // 移動後に衝突判定と押し出しを行う
        let px = this.mesh.position.x;
        let pz = this.mesh.position.z;
        const radius = 0.5; // 敵の衝突半径

        const gridX = Math.floor(px / CONSTANTS.GRID_SCALE + 0.5);
        const gridZ = Math.floor(pz / CONSTANTS.GRID_SCALE + 0.5);

        for (let z = gridZ - 1; z <= gridZ + 1; z++) {
            for (let x = gridX - 1; x <= gridX + 1; x++) {
                let isWall = false;
                if (z < 0 || z >= this.mapHeight || x < 0 || x >= this.mapWidth) {
                    isWall = true; // マップ外は壁として扱う
                } else if (this.mapGrid[z][x] === 1) { // 1 is wall
                    isWall = true;
                }

                if (isWall) {
                    const wallCenterX = x * CONSTANTS.GRID_SCALE;
                    const wallCenterZ = z * CONSTANTS.GRID_SCALE;
                    const halfScale = CONSTANTS.GRID_SCALE / 2;

                    const minX = wallCenterX - halfScale;
                    const maxX = wallCenterX + halfScale;
                    const minZ = wallCenterZ - halfScale;
                    const maxZ = wallCenterZ + halfScale;

                    let closestX = Math.max(minX, Math.min(px, maxX));
                    let closestZ = Math.max(minZ, Math.min(pz, maxZ));

                    const distanceX = px - closestX;
                    const distanceZ = pz - closestZ;
                    const distanceSquared = distanceX * distanceX + distanceZ * distanceZ;

                    if (distanceSquared < radius * radius) {
                        // めり込みを検知したので押し出す
                        const dist = Math.sqrt(distanceSquared);
                        if (dist === 0) continue;
                        const overlap = radius - dist;
                        px += (distanceX / dist) * overlap;
                        pz += (distanceZ / dist) * overlap;
                    }
                }
            }
        }

        // 押し出し結果を適用
        this.mesh.position.x = px;
        this.mesh.position.z = pz;

        // 向いている方向を更新
        const targetLook = new THREE.Vector3(this.mesh.position.x + direction.x, this.mesh.position.y, this.mesh.position.z + direction.z);
        this.mesh.lookAt(targetLook);
    }
}
