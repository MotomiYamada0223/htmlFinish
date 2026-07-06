import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import { Pathfinder } from './pathfinder.js';

export class EnemyA {
    constructor(scene, mapGrid, mapWidth, mapHeight, keySpawns) {
        this.scene = scene;
        this.mapGrid = mapGrid;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.keySpawns = keySpawns;

        // Visual representation: ホラー風（黒い影と赤い目）
        this.mesh = new THREE.Group();
        this.mesh.position.y = 1;

        // 体（細長い黒い影）
        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 16);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 1.0 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        this.mesh.add(body);

        // 目（赤く強く発光する）
        const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const eyeMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            emissive: 0xff0000,
            emissiveIntensity: 5.0 
        });
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        // Z = -1 が正面
        eye.position.set(0, 0.7, -0.35); 
        this.mesh.add(eye);

        // 目の周囲の不気味な赤いモヤ
        const auraGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const auraMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.position.copy(eye.position);
        this.mesh.add(aura);

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


        // Raycaster for line of sight
        this.raycaster = new THREE.Raycaster();

        // Pathfinding
        this.pathfinder = new Pathfinder(this.mapGrid, this.mapWidth, this.mapHeight);
        this.currentPath = [];

        this.patrolIndex = 0;
    }

    setNextPatrolTarget() {
        if (this.keySpawns.length === 0) return;
        const spawn = this.keySpawns[this.patrolIndex % this.keySpawns.length];
        this.targetPosition.set(
            spawn.x * CONSTANTS.GRID_SCALE,
            1,
            spawn.y * CONSTANTS.GRID_SCALE
        );
        this.patrolIndex++;
        this.calculatePath();
    }

    calculatePath() {
        const startX = this.mesh.position.x / CONSTANTS.GRID_SCALE;
        const startZ = this.mesh.position.z / CONSTANTS.GRID_SCALE;
        const goalX = this.targetPosition.x / CONSTANTS.GRID_SCALE;
        const goalZ = this.targetPosition.z / CONSTANTS.GRID_SCALE;
        this.currentPath = this.pathfinder.findPath(startX, startZ, goalX, goalZ);
    }

    update(delta, player, camera) {
        const distToPlayer = this.mesh.position.distanceTo(player.position);
        
        // 1. Check if player is looking at the enemy (Frustum check)
        const isBeingLookedAt = this.checkIfLookedAt(camera);
        
        // 2. Check if enemy can sense player (Sight or Sound)
        const canSeePlayer = this.checkSight(player.position, distToPlayer);
        const canHearPlayer = this.checkSound(player.position, player.footstepRadius, distToPlayer);

        if (canSeePlayer || canHearPlayer) {
            this.state = 'CHASE';
            this.chasePatienceTimer = CONSTANTS.AI_CHASE_PATIENCE_TIME / 1000;
            
            // ターゲットが大きく動いた時、または経路が無い時だけ再計算（スタック防止）
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
                this.calculatePath(); // 最後に確認した地点までの経路
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
                this.setNextPatrolTarget();
            }
        }

        // Move towards target if NOT being looked at while chasing, or if patrolling
        if (this.state === 'PATROL' || this.state === 'SEARCH' || (this.state === 'CHASE' && !isBeingLookedAt)) {
            let speed = this.state === 'CHASE' ? CONSTANTS.ENEMY_A_SPEED : CONSTANTS.ENEMY_A_PATROL_SPEED;
            if (this.state === 'SEARCH') speed = CONSTANTS.ENEMY_A_PATROL_SPEED;

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
                    this.currentPath.shift(); // 到達したので次のノードへ
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
                    this.setNextPatrolTarget();
                }
            }
        }
    }

    checkIfLookedAt(camera) {
        // Frustum culling check
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(projScreenMatrix);

        // this.mesh は Group なので、最初の子要素（bodyメッシュ）で交差判定を行う
        if (!frustum.intersectsObject(this.mesh.children[0])) {
            return false;
        }

        // Raycast to ensure no walls are blocking the view
        const dir = new THREE.Vector3().subVectors(this.mesh.position, camera.position).normalize();
        this.raycaster.set(camera.position, dir);
        
        // This requires wall meshes to be added to scene.
        // For grid-based, we can do a simple grid raycast (DDA algorithm) or just rely on Frustum for prototype.
        // Simplified: returning true if in Frustum.
        return true;
    }

    checkSight(playerPosition, distToPlayer) {
        if (distToPlayer > CONSTANTS.ENEMY_A_VISION_RANGE) return false;
        // Check FOV
        const dirToPlayer = new THREE.Vector3().subVectors(playerPosition, this.mesh.position).normalize();
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion);
        const angle = forward.angleTo(dirToPlayer);
        
        if (angle >= CONSTANTS.ENEMY_A_VISION_FOV) return false;

        // Check Line of Sight (Raycast to ensure no walls are blocking)
        const startX = this.mesh.position.x / CONSTANTS.GRID_SCALE;
        const startZ = this.mesh.position.z / CONSTANTS.GRID_SCALE;
        const endX = playerPosition.x / CONSTANTS.GRID_SCALE;
        const endZ = playerPosition.z / CONSTANTS.GRID_SCALE;

        return this.pathfinder.hasLineOfSight(startX, startZ, endX, endZ);
    }

    checkSound(playerPosition, footstepRadius, distToPlayer) {
        // If sound radius intersects with hearing range
        return distToPlayer <= (CONSTANTS.ENEMY_A_HEARING_RANGE + footstepRadius) && footstepRadius > 0;
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
