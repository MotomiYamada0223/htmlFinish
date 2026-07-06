import { CONSTANTS } from './constants.js';
import { CUSTOM_BLOCK_PATTERNS } from './blockPatterns.js';

export class MapGenerator {
    constructor() {
        this.gridSizeX = CONSTANTS.MAP_BLOCKS_X * CONSTANTS.BLOCK_SIZE + (CONSTANTS.MAP_BLOCKS_X + 1) * 2;
        this.gridSizeY = CONSTANTS.MAP_BLOCKS_Y * CONSTANTS.BLOCK_SIZE + (CONSTANTS.MAP_BLOCKS_Y + 1) * 2;
        // 0: floor, 1: wall
        this.grid = [];
        this.keySpawns = [];
        this.goalPosition = null;
        this.playerSpawn = null;
    }

    generate() {
        let isValid = false;
        let attempts = 0;

        while (!isValid && attempts < 10) {
            this.initGrid();
            this.placeCorridors();
            this.placeBlocks();
            this.placeSpawns();
            
            isValid = this.validateMap();
            attempts++;
            if(!isValid) {
                console.warn("Map validation failed. Retrying...");
            }
        }
        
        if (!isValid) {
            console.error("Failed to generate a valid map after 10 attempts.");
        } else {
            console.log("Map generated successfully in " + attempts + " attempts.");
        }
        
        return {
            grid: this.grid,
            width: this.gridSizeX,
            height: this.gridSizeY,
            keySpawns: this.keySpawns,
            goalPosition: this.goalPosition,
            playerSpawn: this.playerSpawn
        };
    }

    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSizeY; y++) {
            let row = [];
            for (let x = 0; x < this.gridSizeX; x++) {
                row.push(1); // Fill with walls initially
            }
            this.grid.push(row);
        }
    }

    placeCorridors() {
        // Place thick corridors (2 cells wide) between blocks and on outer edges
        for (let bx = 0; bx <= CONSTANTS.MAP_BLOCKS_X; bx++) {
            let cx = bx * (CONSTANTS.BLOCK_SIZE + 2);
            for (let y = 0; y < this.gridSizeY; y++) {
                this.grid[y][cx] = 0;
                this.grid[y][cx + 1] = 0;
            }
        }

        for (let by = 0; by <= CONSTANTS.MAP_BLOCKS_Y; by++) {
            let cy = by * (CONSTANTS.BLOCK_SIZE + 2);
            for (let x = 0; x < this.gridSizeX; x++) {
                this.grid[cy][x] = 0;
                this.grid[cy + 1][x] = 0;
            }
        }
    }

    placeBlocks() {
        // ユーザー定義のブロックパターンを数値配列に変換して使用
        const blockPatterns = CUSTOM_BLOCK_PATTERNS.map(patternStrArr => {
            let block = [];
            for (let y = 0; y < CONSTANTS.BLOCK_SIZE; y++) {
                let row = [];
                for (let x = 0; x < CONSTANTS.BLOCK_SIZE; x++) {
                    row.push(parseInt(patternStrArr[y][x], 10));
                }
                block.push(row);
            }
            return block;
        });

        for (let by = 0; by < CONSTANTS.MAP_BLOCKS_Y; by++) {
            for (let bx = 0; bx < CONSTANTS.MAP_BLOCKS_X; bx++) {
                let startX = bx * (CONSTANTS.BLOCK_SIZE + 2) + 2;
                let startY = by * (CONSTANTS.BLOCK_SIZE + 2) + 2;
                
                let pattern = blockPatterns[Math.floor(Math.random() * blockPatterns.length)];
                
                // 90度単位でランダムに回転
                let rotations = Math.floor(Math.random() * 4);
                let rotatedPattern = this.rotateBlock(pattern, rotations);
                
                for (let y = 0; y < CONSTANTS.BLOCK_SIZE; y++) {
                    for (let x = 0; x < CONSTANTS.BLOCK_SIZE; x++) {
                        this.grid[startY + y][startX + x] = rotatedPattern[y][x];
                    }
                }
                
                // Make entrances from corridors
                this.grid[startY + Math.floor(CONSTANTS.BLOCK_SIZE/2)][startX - 1] = 0; // Left entrance
                this.grid[startY + Math.floor(CONSTANTS.BLOCK_SIZE/2)][startX - 2] = 0; // Connect to left corridor
                
                this.grid[startY - 1][startX + Math.floor(CONSTANTS.BLOCK_SIZE/2)] = 0; // Top entrance
                this.grid[startY - 2][startX + Math.floor(CONSTANTS.BLOCK_SIZE/2)] = 0; // Connect to top corridor
            }
        }
    }

    rotateBlock(block, rotations) {
        let rotated = block;
        let size = CONSTANTS.BLOCK_SIZE;
        for (let r = 0; r < rotations; r++) {
            let newBlock = [];
            for (let y = 0; y < size; y++) {
                newBlock[y] = [];
                for (let x = 0; x < size; x++) {
                    newBlock[y][x] = rotated[size - 1 - x][y];
                }
            }
            rotated = newBlock;
        }
        return rotated;
    }


    placeSpawns() {
        this.keySpawns = [];
        this.goalPosition = null;
        this.playerSpawn = null;

        // Player spawn (center of map corridor)
        this.playerSpawn = {
            x: Math.floor(this.gridSizeX / 2),
            y: Math.floor(this.gridSizeY / 2)
        };
        // Ensure player is on floor
        if (this.grid[this.playerSpawn.y][this.playerSpawn.x] !== 0) {
            this.grid[this.playerSpawn.y][this.playerSpawn.x] = 0;
        }

        // Place Goal Door on the outer edge (bottom wall)
        let goalX = Math.floor(this.gridSizeX / 2);
        let goalY = this.gridSizeY - 1;
        this.grid[goalY][goalX] = 0; // Make an opening
        this.goalPosition = { x: goalX, y: goalY };

        // Place keys randomly in candidate spots (marked as 2)
        let availableSpots = [];
        for (let y = 1; y < this.gridSizeY - 1; y++) {
            for (let x = 1; x < this.gridSizeX - 1; x++) {
                if (this.grid[y][x] === 2) {
                    availableSpots.push({x, y});
                    // 鍵の配置候補地を抽出した後は、通常の床(0)に戻しておく
                    this.grid[y][x] = 0;
                }
            }
        }

        // Shuffle spots
        for (let i = availableSpots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableSpots[i], availableSpots[j]] = [availableSpots[j], availableSpots[i]];
        }

        // Spawning one of each key type
        for(let i=0; i<CONSTANTS.KEY_TYPES.length; i++) {
            let spot = availableSpots.pop();
            this.keySpawns.push({
                x: spot.x,
                y: spot.y,
                type: CONSTANTS.KEY_TYPES[i]
            });
        }
    }

    validateMap() {
        // Use BFS from player spawn to check if all keys and goal are reachable
        let queue = [this.playerSpawn];
        let visited = new Set();
        let visitedKey = (x, y) => `${x},${y}`;
        
        visited.add(visitedKey(this.playerSpawn.x, this.playerSpawn.y));

        let reachableKeys = 0;
        let goalReachable = false;

        const dirs = [[0,1],[1,0],[0,-1],[-1,0]];

        while (queue.length > 0) {
            let curr = queue.shift();

            // Check if goal
            if (Math.abs(curr.x - this.goalPosition.x) <= 1 && Math.abs(curr.y - this.goalPosition.y) <= 1) {
                goalReachable = true;
            }

            // Check if key
            for (let k of this.keySpawns) {
                if (curr.x === k.x && curr.y === k.y) {
                    reachableKeys++;
                }
            }

            for (let d of dirs) {
                let nx = curr.x + d[0];
                let ny = curr.y + d[1];

                if (nx >= 0 && nx < this.gridSizeX && ny >= 0 && ny < this.gridSizeY) {
                    if (this.grid[ny][nx] === 0 && !visited.has(visitedKey(nx, ny))) {
                        visited.add(visitedKey(nx, ny));
                        queue.push({x: nx, y: ny});
                    }
                }
            }
        }

        return goalReachable && (reachableKeys === this.keySpawns.length);
    }
}
