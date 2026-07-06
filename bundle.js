/* --- js/constants.js --- */
// 7. 実装向け定数定義（マジックナンバーの排除）

const CONSTANTS = {
    // プレイヤーの速度設定
    MOVE_SPEED_NORMAL: 3.0,     // 通常移動速度
    MOVE_SPEED_DASH: 6.0,       // 走行移動速度
    MOVE_SPEED_SLOW: 1.5,       // 低速移動速度（横移動や後退など）

    // プレイヤーの音範囲（聴覚センサー用トリガー半径）
    FOOTSTEP_RADIUS_WALK: 0.0,  // 歩行時は無音または非常に狭い
    FOOTSTEP_RADIUS_DASH: 15.0, // 走行時の足音範囲（敵Aが感知する範囲）

    // 敵A（だるまさんがころんだ・音感知）
    ENEMY_A_SPEED: 7.5,         // プレイヤーの走行速度より高速
    ENEMY_A_PATROL_SPEED: 1.0,  // 徘徊時の極めて遅い速度
    ENEMY_A_HEARING_RANGE: 15.0,// 聴覚センサーの基本感知範囲（足音範囲と交差で検知）
    ENEMY_A_VISION_RANGE: 30.0, // 視覚センサーの距離
    ENEMY_A_VISION_FOV: Math.PI / 2, // 視界の角度 (真横まで見える 90度)

    // 敵B（ランダム巡回・ゴール強襲）
    ENEMY_B_SPEED: 4.5,         // プレイヤーの通常速度より速く、走行速度より遅い
    ENEMY_B_PATROL_SPEED: 1.0,  // 徘徊時の極めて遅い速度
    ENEMY_B_VISION_RANGE: 25.0, // 視覚センサーの距離
    ENEMY_B_VISION_FOV: Math.PI / 2, // 視界の角度 (真横まで見える 90度)

    // AI共通
    AI_FIND_LOOK_TIME: 3000,    // (ms) 索敵時に周囲を見渡す時間
    AI_LOST_LOOK_TIME: 5000,    // (ms) 見失った後、最後に検知した場所で留まる時間
    AI_CHASE_PATIENCE_TIME: 5000, // (ms) 視界から消えた後もプレイヤーの位置を推測して追跡を続ける猶予時間

    // マップ設定
    MAP_BLOCKS_X: 4,            // 全体マップのX方向ブロック数
    MAP_BLOCKS_Y: 4,            // 全体マップのY方向ブロック数
    BLOCK_SIZE: 15,             // 1ブロックあたりのグリッドサイズ（15x15）
    GRID_SCALE: 2.0,            // 1グリッドの3D空間での実寸サイズ

    // プレイヤー・カメラ設定
    PLAYER_HEIGHT: 1.5,         // カメラの高さ
    PLAYER_RADIUS: 0.5,         // プレイヤーの当たり判定半径

    // 鍵の種類（色で代用）
    KEY_TYPES: [
        { id: 'red', color: 0xff0000 },
        { id: 'blue', color: 0x0000ff },
        { id: 'green', color: 0x00ff00 },
        { id: 'yellow', color: 0xffff00 }
    ]
};

/* --- js/blockPatterns.js --- */
// ブロックの構造を定義するファイル
// 1 = 壁, 0 = 通路（床）, 2 = 鍵の配置候補（床）
// CONSTANTS.BLOCK_SIZE の数（現在は15）に合わせて、縦15行・横15文字でデザインしてください。
// ここに定義したパターンの中からランダムに選ばれてマップ上に配置されます。

const CUSTOM_BLOCK_PATTERNS = [
    // パターン1: 中央が空いた基本的な部屋
    [
        "111111111111111",
        "100000000002001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "111111000111111"
    ],

    // パターン2: 柱がある部屋
    [
        "111111111111111",
        "100000000020001",
        "101110111011101",
        "100000000000001",
        "101110111011101",
        "100000000000001",
        "101110111011101",
        "100000000000001",
        "101110111011101",
        "100000000000001",
        "101110111011101",
        "100000000000001",
        "101110111011101",
        "100000000000001",
        "111111000111111"
    ],

    // パターン3: 全て壁（ここを書き換えて自由にデザインしてください）
    // 注意: 入り口から繋がらない孤立した空間を作ると、マップ生成時の検証(BFS)で弾かれ再生成されます。
    [
        "111111111111111",
        "102000000000001",
        "100000000000001",
        "100000000000001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "111111000111111"
    ],

    // 注意: 入り口から繋がらない孤立した空間を作ると、マップ生成時の検証(BFS)で弾かれ再生成されます。
    [
        "111111111111111",
        "111111111111111",
        "100021111102001",
        "100001111100001",
        "100001111100001",
        "100001111100001",
        "100000000000001",
        "100000000000001",
        "100000000000001",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111"
    ],

    [
        "111111111111111",
        "111111111111111",
        "111111111102001",
        "111111111100001",
        "111111111100001",
        "111111111100001",
        "110000000000001",
        "110000000000001",
        "110000000000021",
        "110000111111111",
        "110000111111111",
        "110000111111111",
        "110000111111111",
        "110000111111111",
        "110000111111111"
    ],

    [
        "111111111111111",
        "111111111111111",
        "110000000002001",
        "110000000000001",
        "110000000000001",
        "110000000000001",
        "110000111100001",
        "110000111100001",
        "110000111100001",
        "110000111120001",
        "110000111111111",
        "110000111111111",
        "110000111111111",
        "110000111111111",
        "110000111111111"
    ],

    [
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "000000000000000",
        "000000000000000",
        "000000020000000",
        "000000000000000",
        "000000000000000",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111",
        "111110000011111"
    ],
];

/* --- js/pathfinder.js --- */
class Pathfinder {
    constructor(mapGrid, mapWidth, mapHeight) {
        this.mapGrid = mapGrid;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    // 視界が通っているか (Bresenham's Line Algorithm)
    // startX, startZ, endX, endZ はグリッド座標
    hasLineOfSight(startX, startZ, endX, endZ) {
        let x0 = Math.floor(startX);
        let y0 = Math.floor(startZ);
        const x1 = Math.floor(endX);
        const y1 = Math.floor(endZ);

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            // Check out of bounds
            if (x0 < 0 || x0 >= this.mapWidth || y0 < 0 || y0 >= this.mapHeight) return false;
            // Check wall (1 is wall)
            if (this.mapGrid[y0][x0] === 1) return false;

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        return true;
    }

    // A* パスファインディング
    // startX, startZ, goalX, goalZ はグリッド座標。
    // {x, z} の配列として経路を返す（最初が次の移動先）。到達不可能な場合は空配列。
    findPath(startX, startZ, goalX, goalZ) {
        const startNode = { x: Math.floor(startX), z: Math.floor(startZ) };
        const goalNode = { x: Math.floor(goalX), z: Math.floor(goalZ) };

        if (startNode.x === goalNode.x && startNode.z === goalNode.z) {
            return []; // Already at goal
        }

        if (goalNode.x < 0 || goalNode.x >= this.mapWidth || goalNode.z < 0 || goalNode.z >= this.mapHeight || this.mapGrid[goalNode.z][goalNode.x] === 1) {
            return []; // Goal is wall or out of bounds
        }

        const openSet = [];
        const closedSet = new Set();
        const cameFrom = new Map();

        const gScore = new Map();
        const fScore = new Map();

        const hash = (node) => `${node.x},${node.z}`;

        openSet.push(startNode);
        gScore.set(hash(startNode), 0);
        fScore.set(hash(startNode), this.heuristic(startNode, goalNode));

        while (openSet.length > 0) {
            // Get node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                const nodeHash = hash(openSet[i]);
                const currHash = hash(current);
                if ((fScore.get(nodeHash) || Infinity) < (fScore.get(currHash) || Infinity)) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }

            if (current.x === goalNode.x && current.z === goalNode.z) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(currentIndex, 1);
            closedSet.add(hash(current));

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (closedSet.has(hash(neighbor))) continue;

                const distanceToNeighbor = (Math.abs(neighbor.x - current.x) === 1 && Math.abs(neighbor.z - current.z) === 1) ? 1.414 : 1;
                const tentativeGScore = gScore.get(hash(current)) + distanceToNeighbor;
                
                if (!openSet.some(n => n.x === neighbor.x && n.z === neighbor.z)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(hash(neighbor)) || Infinity)) {
                    continue; // Not a better path
                }

                cameFrom.set(hash(neighbor), current);
                gScore.set(hash(neighbor), tentativeGScore);
                fScore.set(hash(neighbor), tentativeGScore + this.heuristic(neighbor, goalNode));
            }
        }

        return []; // No path found
    }

    heuristic(a, b) {
        // Euclidean distance is better if diagonal movement is allowed
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    getNeighbors(node) {
        const neighbors = [];
        const dirs = [
            { x: 0, z: -1 }, { x: 0, z: 1 }, { x: -1, z: 0 }, { x: 1, z: 0 },
            { x: -1, z: -1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: 1, z: 1 }
        ];

        for (const d of dirs) {
            const nx = node.x + d.x;
            const nz = node.z + d.z;

            if (nx >= 0 && nx < this.mapWidth && nz >= 0 && nz < this.mapHeight) {
                if (this.mapGrid[nz][nx] !== 1) { 
                    // Corner check for diagonals
                    if (Math.abs(d.x) === 1 && Math.abs(d.z) === 1) {
                        if (this.mapGrid[node.z][nx] === 1 || this.mapGrid[nz][node.x] === 1) {
                            continue; // Corner is blocked
                        }
                    }
                    neighbors.push({ x: nx, z: nz });
                }
            }
        }
        return neighbors;
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        const hash = (node) => `${node.x},${node.z}`;
        
        while (cameFrom.has(hash(current))) {
            current = cameFrom.get(hash(current));
            path.push(current);
        }
        path.reverse();
        path.shift(); // Remove starting node
        return path;
    }
}

/* --- js/mapGenerator.js --- */



class MapGenerator {
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

/* --- js/player.js --- */



class Player {
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

/* --- js/enemyA.js --- */




class EnemyA {
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

/* --- js/enemyB.js --- */




class EnemyB {
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

/* --- js/uiManager.js --- */


class UIManager {
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

/* --- js/main.js --- */








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

