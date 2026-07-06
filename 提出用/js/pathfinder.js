export class Pathfinder {
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
