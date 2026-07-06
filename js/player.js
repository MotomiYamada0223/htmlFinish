import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

export class Player {
    constructor(camera, mapGrid, startX, startY) {
        this.camera = camera;
        this.mapGrid = mapGrid;
        
        // Initial Position
        this.position = new THREE.Vector3(
            startX * CONSTANTS.GRID_SCALE,
            CONSTANTS.PLAYER_HEIGHT,
            startY * CONSTANTS.GRID_SCALE
        );
        this.camera.position.copy(this.position);

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Input state
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isDashing = false;
        
        // Camera rotation variables
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.mouseSensitivity = 0.002;

        this.footstepRadius = CONSTANTS.FOOTSTEP_RADIUS_WALK;
        this.currentSpeed = 0;

        // Inventory
        this.hasKey = null;

        this.setupInput();
    }

    setupInput() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this.moveForward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyD': this.moveRight = true; break;
            case 'ShiftLeft': 
            case 'ShiftRight': 
                this.isDashing = true; 
                break;
            case 'KeyQ':
                // 180 degree turn
                this.euler.y += Math.PI;
                this.camera.quaternion.setFromEuler(this.euler);
                break;
        }
    }

    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this.moveForward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyD': this.moveRight = false; break;
            case 'ShiftLeft': 
            case 'ShiftRight': 
                this.isDashing = false; 
                break;
        }
    }

    onMouseMove(event) {
        if (document.pointerLockElement !== document.body) return;

        this.euler.setFromQuaternion(this.camera.quaternion);

        this.euler.y -= event.movementX * this.mouseSensitivity;
        this.euler.x -= event.movementY * this.mouseSensitivity;

        // Clamp vertical rotation
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));

        this.camera.quaternion.setFromEuler(this.euler);
    }

    update(delta) {
        // Calculate movement direction
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize(); // Ensure consistent speed in all directions

        // Determine speed
        let speed = 0;
        this.footstepRadius = CONSTANTS.FOOTSTEP_RADIUS_WALK;

        if (this.moveForward && !this.moveBackward) {
            // Moving forward or diagonally forward
            speed = this.isDashing ? CONSTANTS.MOVE_SPEED_DASH : CONSTANTS.MOVE_SPEED_NORMAL;
            if (this.isDashing) {
                this.footstepRadius = CONSTANTS.FOOTSTEP_RADIUS_DASH;
            }
        } else if (this.direction.lengthSq() > 0) {
            // Strafing or moving backwards (always slow)
            speed = CONSTANTS.MOVE_SPEED_SLOW;
        }

        this.currentSpeed = speed;

        if (this.moveForward || this.moveBackward) {
            this.velocity.z = -this.direction.z * speed * delta;
        } else {
            this.velocity.z = 0;
        }

        if (this.moveLeft || this.moveRight) {
            this.velocity.x = this.direction.x * speed * delta;
        } else {
            this.velocity.x = 0;
        }

        // Apply rotation to velocity
        this.camera.translateX(this.velocity.x);
        this.camera.translateZ(this.velocity.z);

        // Simple Collision Detection with grid
        this.checkCollisions();

        // Lock Y position
        this.camera.position.y = CONSTANTS.PLAYER_HEIGHT;
        this.position.copy(this.camera.position);
    }

    checkCollisions() {
        const px = this.camera.position.x;
        const pz = this.camera.position.z;
        const radius = CONSTANTS.PLAYER_RADIUS;

        // Get surrounding grid coordinates
        const gridX = Math.floor(px / CONSTANTS.GRID_SCALE + 0.5);
        const gridZ = Math.floor(pz / CONSTANTS.GRID_SCALE + 0.5);

        for (let z = gridZ - 1; z <= gridZ + 1; z++) {
            for (let x = gridX - 1; x <= gridX + 1; x++) {
                let isWall = false;
                if (z < 0 || z >= this.mapGrid.length || x < 0 || x >= this.mapGrid[0].length) {
                    isWall = true; // マップ外は壁として扱う
                } else if (this.mapGrid[z][x] === 1) { // 1 is wall
                    isWall = true;
                }

                if (isWall) {
                    const wallCenterX = x * CONSTANTS.GRID_SCALE;
                    const wallCenterZ = z * CONSTANTS.GRID_SCALE;
                    const halfScale = CONSTANTS.GRID_SCALE / 2;

                    // AABB vs Circle collision
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
                        // Collision occurred, push player out
                        const distance = Math.sqrt(distanceSquared);
                        if (distance === 0) continue;
                        const overlap = radius - distance;
                        this.camera.position.x += (distanceX / distance) * overlap;
                        this.camera.position.z += (distanceZ / distance) * overlap;
                    }
                }
            }
        }
    }
}
