import { CONSTANTS } from './constants.js';

export class UIManager {
    constructor(mapWidth, mapHeight) {
        this.mapUI = document.getElementById('map-ui');
        this.mapCanvas = document.getElementById('map-canvas');
        this.ctx = this.mapCanvas.getContext('2d');
        
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.gameClearScreen = document.getElementById('game-clear-screen');
        
        this.doorUI = document.getElementById('door-ui');
        this.doorMessage = document.getElementById('door-message');
        this.requiredKeyIcon = document.getElementById('required-key-icon');
        
        this.currentKeyText = document.getElementById('current-key');

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        
        this.cellSize = Math.min(600 / this.mapWidth, 600 / this.mapHeight);

        this.isMapVisible = false;

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                this.toggleMap();
            }
        });
    }

    toggleMap() {
        this.isMapVisible = !this.isMapVisible;
        if (this.isMapVisible) {
            this.mapUI.classList.remove('hidden');
        } else {
            this.mapUI.classList.add('hidden');
        }
    }

    drawMap(mapGrid, player, keys, goalPosition) {
        if (!this.isMapVisible) return;

        this.ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);

        // Draw Map Grid
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (mapGrid[y][x] === 1) {
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                } else {
                    this.ctx.fillStyle = '#111';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        // Draw Keys
        keys.forEach(k => {
            if (!k.pickedUp) {
                this.ctx.fillStyle = 'yellow';
                this.ctx.font = `${this.cellSize}px Arial`;
                this.ctx.fillText('★', k.x * this.cellSize, (k.y + 1) * this.cellSize);
            }
        });

        // Draw Goal
        if (goalPosition) {
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(goalPosition.x * this.cellSize, goalPosition.y * this.cellSize, this.cellSize, this.cellSize);
        }

        // Draw Player
        const pGridX = Math.floor(player.position.x / CONSTANTS.GRID_SCALE);
        const pGridZ = Math.floor(player.position.z / CONSTANTS.GRID_SCALE);
        
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(
            pGridX * this.cellSize + this.cellSize / 2, 
            pGridZ * this.cellSize + this.cellSize / 2, 
            this.cellSize / 2, 
            0, Math.PI * 2
        );
        this.ctx.fill();

        // Optional: Draw enemies for debug (Should be disabled in actual game)
        // Leaving it out to respect horror elements
    }

    updateInventory(keyId) {
        if (keyId) {
            this.currentKeyText.textContent = keyId;
            const keyDef = CONSTANTS.KEY_TYPES.find(k => k.id === keyId);
            if (keyDef) {
                this.currentKeyText.style.color = '#' + keyDef.color.toString(16).padStart(6, '0');
            }
        } else {
            this.currentKeyText.textContent = 'なし';
            this.currentKeyText.style.color = 'white';
        }
    }

    showDoorUI(requiredKeyId, isUnlocked) {
        this.doorUI.classList.remove('hidden');
        if (isUnlocked) {
            this.doorMessage.textContent = "扉の鍵が開いた！(クリックで脱出)";
            this.requiredKeyIcon.style.display = 'none';
        } else {
            this.doorMessage.textContent = "この鍵穴に合う鍵が必要だ。";
            this.requiredKeyIcon.style.display = 'block';
            const keyDef = CONSTANTS.KEY_TYPES.find(k => k.id === requiredKeyId);
            if (keyDef) {
                this.requiredKeyIcon.style.backgroundColor = '#' + keyDef.color.toString(16).padStart(6, '0');
            }
        }
    }

    hideDoorUI() {
        this.doorUI.classList.add('hidden');
    }

    showGameOver() {
        document.exitPointerLock();
        this.gameOverScreen.classList.add('active');
    }

    showGameClear() {
        document.exitPointerLock();
        this.gameClearScreen.classList.add('active');
    }

    hideStartScreen() {
        this.startScreen.classList.remove('active');
    }
}
