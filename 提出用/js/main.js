import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import { MapGenerator } from './mapGenerator.js';
import { Player } from './player.js';
import { EnemyA } from './enemyA.js';
import { EnemyB } from './enemyB.js';
import { UIManager } from './uiManager.js';

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        // ホラー演出: 背景を真っ黒にし、暗いFogを追加（近すぎるFogを緩和）
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 10, 80); // 視界を約2倍に広げる

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.keys = [];
        this.enemies = [];
        this.requiredKeyId = null;

        this.isGameRunning = false;
        this.isGameOver = false;
        this.isGameClear = false;

        this.setupLights();
        
        // Generate Map
        const mapGen = new MapGenerator();
        this.mapData = mapGen.generate();
        
        this.uiManager = new UIManager(this.mapData.width, this.mapData.height);

        this.buildMap3D();
        this.setupGameObjects();

        this.setupEventHandlers();

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLights() {
        // ホラー演出: 環境光を少し上げて、真っ暗すぎないようにする（シルエットがうっすら見える程度）
        const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.4);
        this.scene.add(ambientLight);

        // Player's flashlight: 照射角を約2倍に広げる
        this.flashlight = new THREE.SpotLight(0xffffee, 5, 80, Math.PI / 3, 0.6, 1);
        this.flashlight.position.set(0, 0, 0);
        this.camera.add(this.flashlight);
        this.flashlight.target.position.set(0, 0, -1);
        this.camera.add(this.flashlight.target);
        this.scene.add(this.camera);
    }

    buildMap3D() {
        const floorGeo = new THREE.PlaneGeometry(this.mapData.width * CONSTANTS.GRID_SCALE, this.mapData.height * CONSTANTS.GRID_SCALE);
        // 床の色を少し明るくして、ライトが反射するようにする
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.1 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(this.mapData.width * CONSTANTS.GRID_SCALE / 2, 0, this.mapData.height * CONSTANTS.GRID_SCALE / 2);
        this.scene.add(floor);

        const ceilingGeo = new THREE.PlaneGeometry(this.mapData.width * CONSTANTS.GRID_SCALE, this.mapData.height * CONSTANTS.GRID_SCALE);
        const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0 });
        const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(this.mapData.width * CONSTANTS.GRID_SCALE / 2, CONSTANTS.GRID_SCALE, this.mapData.height * CONSTANTS.GRID_SCALE / 2);
        this.scene.add(ceiling);

        const wallGeo = new THREE.BoxGeometry(CONSTANTS.GRID_SCALE, CONSTANTS.GRID_SCALE, CONSTANTS.GRID_SCALE);
        // 壁の色も少し明るくして質感を出す
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8, metalness: 0.2 });

        // InstancedMesh for performance
        let wallCount = 0;
        for (let z = 0; z < this.mapData.height; z++) {
            for (let x = 0; x < this.mapData.width; x++) {
                if (this.mapData.grid[z][x] === 1) wallCount++;
            }
        }

        const wallMesh = new THREE.InstancedMesh(wallGeo, wallMat, wallCount);
        let i = 0;
        const matrix = new THREE.Matrix4();
        for (let z = 0; z < this.mapData.height; z++) {
            for (let x = 0; x < this.mapData.width; x++) {
                if (this.mapData.grid[z][x] === 1) {
                    matrix.setPosition(x * CONSTANTS.GRID_SCALE, CONSTANTS.GRID_SCALE / 2, z * CONSTANTS.GRID_SCALE);
                    wallMesh.setMatrixAt(i++, matrix);
                }
            }
        }
        this.scene.add(wallMesh);
    }

    setupGameObjects() {
        this.player = new Player(this.camera, this.mapData.grid, this.mapData.playerSpawn.x, this.mapData.playerSpawn.y);

        // Keys
        const keyGeo = new THREE.OctahedronGeometry(0.3);
        this.mapData.keySpawns.forEach(spawn => {
            const mat = new THREE.MeshStandardMaterial({ 
                color: spawn.type.color,
                emissive: spawn.type.color,
                emissiveIntensity: 0.5
            });
            const mesh = new THREE.Mesh(keyGeo, mat);
            mesh.position.set(spawn.x * CONSTANTS.GRID_SCALE, 1, spawn.y * CONSTANTS.GRID_SCALE);
            this.scene.add(mesh);
            
            this.keys.push({
                x: spawn.x,
                y: spawn.y,
                type: spawn.type,
                mesh: mesh,
                pickedUp: false
            });
        });

        // Determine required key randomly
        const reqKeySpawn = this.mapData.keySpawns[Math.floor(Math.random() * this.mapData.keySpawns.length)];
        this.requiredKeyId = reqKeySpawn.type.id;
        
        // Goal Door
        const doorGeo = new THREE.BoxGeometry(CONSTANTS.GRID_SCALE, CONSTANTS.GRID_SCALE, 0.2);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x884400 });
        this.goalDoorMesh = new THREE.Mesh(doorGeo, doorMat);
        this.goalDoorMesh.position.set(
            this.mapData.goalPosition.x * CONSTANTS.GRID_SCALE,
            CONSTANTS.GRID_SCALE / 2,
            this.mapData.goalPosition.y * CONSTANTS.GRID_SCALE
        );
        this.scene.add(this.goalDoorMesh);

        // Enemies
        const enemyA = new EnemyA(this.scene, this.mapData.grid, this.mapData.width, this.mapData.height, this.mapData.keySpawns);
        const enemyB = new EnemyB(this.scene, this.mapData.grid, this.mapData.width, this.mapData.height, this.mapData.goalPosition);
        
        // Spawn them far from player
        let safeSpawn = (enemy) => {
            let validPositionFound = false;
            let tries = 0;
            while (!validPositionFound && tries < 100) {
                let rx = Math.floor(Math.random() * this.mapData.width);
                let rz = Math.floor(Math.random() * this.mapData.height);
                if (this.mapData.grid[rz][rx] === 0) {
                    enemy.mesh.position.set(rx * CONSTANTS.GRID_SCALE, 1, rz * CONSTANTS.GRID_SCALE);
                    let dist = enemy.mesh.position.distanceTo(this.player.position);
                    if (dist >= 20) {
                        validPositionFound = true;
                    }
                }
                tries++;
            }
            
            // プレイヤーから離れた場所が見つからなかった場合のフォールバック（最低限壁にめり込まない場所へ）
            if (!validPositionFound) {
                for (let z = 0; z < this.mapData.height; z++) {
                    for (let x = 0; x < this.mapData.width; x++) {
                        if (this.mapData.grid[z][x] === 0) {
                            enemy.mesh.position.set(x * CONSTANTS.GRID_SCALE, 1, z * CONSTANTS.GRID_SCALE);
                            validPositionFound = true;
                            break;
                        }
                    }
                    if (validPositionFound) break;
                }
            }
        };

        safeSpawn(enemyA);
        safeSpawn(enemyB);

        // 位置が確定した後に最初の目的地を設定し、経路計算を開始
        enemyA.setNextPatrolTarget();
        enemyB.setRandomPatrolTarget();

        this.enemies.push(enemyA);
        this.enemies.push(enemyB);
    }

    setupEventHandlers() {
        document.getElementById('start-screen').addEventListener('click', () => {
            document.body.requestPointerLock();
            this.uiManager.hideStartScreen();
            this.isGameRunning = true;
        });

        document.getElementById('retry-btn').addEventListener('click', () => {
            location.reload();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement !== document.body && this.isGameRunning && !this.isGameOver && !this.isGameClear) {
                // Paused
                this.isGameRunning = false;
                document.getElementById('start-screen').classList.add('active');
            } else if (document.pointerLockElement === document.body && !this.isGameOver && !this.isGameClear) {
                // Resumed
                this.isGameRunning = true;
                this.uiManager.hideStartScreen();
            }
        });

        document.addEventListener('click', () => {
            if (this.isGameRunning && document.pointerLockElement === document.body) {
                this.interact();
            }
        });
    }

    interact() {
        // Raycast from center of screen
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        // Check Goal Door
        const doorIntersects = raycaster.intersectObject(this.goalDoorMesh);
        if (doorIntersects.length > 0 && doorIntersects[0].distance < 3) {
            if (this.player.hasKey === this.requiredKeyId) {
                this.gameClear();
            }
        }
    }

    checkInteractions() {
        // Auto-pickup keys
        this.keys.forEach(k => {
            if (!k.pickedUp) {
                const dist = this.player.position.distanceTo(k.mesh.position);
                if (dist < 1.5) {
                    k.pickedUp = true;
                    this.scene.remove(k.mesh);
                    this.player.hasKey = k.type.id;
                    this.uiManager.updateInventory(k.type.id);

                    if (k.type.id === this.requiredKeyId) {
                        // Alert Enemy B
                        this.enemies.forEach(e => {
                            if (e instanceof EnemyB) {
                                e.onCorrectKeyPickedUp();
                            }
                        });
                    }
                }
            }
        });

        // Check Goal Door distance for UI
        const distToDoor = this.player.position.distanceTo(this.goalDoorMesh.position);
        if (distToDoor < 4) {
            this.uiManager.showDoorUI(this.requiredKeyId, this.player.hasKey === this.requiredKeyId);
        } else {
            this.uiManager.hideDoorUI();
        }

        // Check Enemy Collisions
        this.enemies.forEach(e => {
            const dist = this.player.position.distanceTo(e.mesh.position);
            if (dist < 1.0) {
                this.gameOver();
            }
        });
    }

    gameOver() {
        this.isGameRunning = false;
        this.isGameOver = true;
        this.uiManager.showGameOver();
    }

    gameClear() {
        this.isGameRunning = false;
        this.isGameClear = true;
        this.uiManager.showGameClear();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);

        const delta = Math.min(this.clock.getDelta(), 0.1);

        if (this.isGameRunning) {
            this.player.update(delta);
            
            this.enemies.forEach(enemy => {
                enemy.update(delta, this.player, this.camera);
            });

            this.checkInteractions();
            
            this.uiManager.drawMap(this.mapData.grid, this.player, this.keys, this.mapData.goalPosition);

            // Animate keys
            this.keys.forEach(k => {
                if (!k.pickedUp) {
                    k.mesh.rotation.y += delta;
                    k.mesh.position.y = 1 + Math.sin(Date.now() * 0.003) * 0.2;
                }
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Start game when page loads
window.onload = () => {
    new Game();
};
