import { MAP } from "../Config.js";
import { vectorToPos, createPosition } from "../Base.js";
const NODE_COST = 1;
class PriorityQueue {
    constructor(onHash) {
        this.items = new Map();
        //map은 ref저장도 지원하는대 굳이 hash가 필요할까?????
        this.onHash = onHash;
        this.queue = [];
    }
    push(item, priority = this.queue.length) {
        const hash = this.onHash(item);
        if (!this.items.has(hash)) {
            const element = { item, priority };
            this.queue.splice(priority, 0, element);
            this.items.set(hash, this.queue.indexOf(element));
            return element;
        } else {
            return this.queue[this.items.get(hash)];
        }
    }
    remove(item) {
        const hash = this.onHash(item);
        const nth = this.items.get(hash);
        if (!nth) {
            throw new Error("this element is not contains node");
        }
        this.items.delete(hash);
        this.queue.splice(nth, 1)[0];
    }
    pop(nth = 0) {
        const queue = this.queue;
        if (nth in queue) {
            const clearedMemory = queue.splice(0, nth + 1);
            const { item } = clearedMemory[clearedMemory.length - 1];
            this.items.delete(this.onHash(item));
            return item;
        } else if (nth < this.queue.length) {
            return this.pop(nth + 1);
        } else {
            return null;
        }
    }
    getPriority(item) {
        return this.queue[this.items.get(this.onHash(item))].priority;
    }
    has(item) {
        return this.items.has(this.onHash(item));
    }
    get isEmpty() {
        return this.items.size <= 0;
    }
}
function __isDisabledTile(x, y, mapData) {
    const item = mapData[vectorToPos(x, y)];
    return item ? item.disabled : false;
}
function __createHeuristicNode(
    pos,
    end,
    g,
    parent = null,
    h = heuristic(pos, end)
) {
    return { ...pos, closed: false, g, h, f: g + h, visited: false, parent };
}
function __createStruct(x, y, end, parent, mapData) {
    const pos = createPosition(x, y);
    return __createHeuristicNode(
        pos,
        end,
        parent.g +
            getCost({
                ...pos,
                ...mapData[vectorToPos(x, y)],
            }),
        parent
    );
}
function calcNeighbors(end, parent, mapData) {
    const neighbors = [];
    const { x, y } = parent;
    const ableDirection = {
        px: x < MAP.width - 1, // left
        mx: x > 0, // bottom
        py: y < MAP.height - 1, // right
        my: y > 0, // top
    };
    const solvedTiles = {
        upLeft: ableDirection.my && !__isDisabledTile(x, y - 1, mapData),
        left: ableDirection.mx && !__isDisabledTile(x - 1, y, mapData),
        downLeft:
            ableDirection.mx &&
            ableDirection.py &&
            !__isDisabledTile(x - 1, y + 1, mapData),
        upRight:
            ableDirection.px &&
            ableDirection.my &&
            !__isDisabledTile(x + 1, y - 1, mapData),
        right: ableDirection.px && !__isDisabledTile(x + 1, y, mapData),
        downRight: ableDirection.py && !__isDisabledTile(x, y + 1, mapData),
        // down: ableDirection.py && !__isDisabledTile(x, y + 1, mapData),
        // up: ableDirection.my && !__isDisabledTile(x, y - 1, mapData),
    };
    // if (solvedTiles.up) {
    //     neighbors.push(__createStruct(x, y - 1, end, parent, mapData));
    // }
    // if (solvedTiles.down) {
    //     neighbors.push(__createStruct(x, y + 1, end, parent, mapData));
    // }
    if (solvedTiles.upLeft) {
        neighbors.push(__createStruct(x, y - 1, end, parent, mapData));
    }
    if (solvedTiles.left) {
        neighbors.push(__createStruct(x - 1, y, end, parent, mapData));
    }
    if (solvedTiles.downLeft) {
        neighbors.push(__createStruct(x - 1, y + 1, end, parent, mapData));
    }
    if (solvedTiles.upRight) {
        neighbors.push(__createStruct(x + 1, y - 1, end, parent, mapData));
    }
    if (solvedTiles.right) {
        neighbors.push(__createStruct(x + 1, y, end, parent, mapData));
    }
    if (solvedTiles.downRight) {
        neighbors.push(__createStruct(x, y + 1, end, parent, mapData));
    }
    return neighbors;
}
function onHash({ x, y }) {
    return vectorToPos(x, y);
}
//state a, state b
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function getPath(foundPath) {
    let node = foundPath;
    let path = [];
    do {
        path.push(createPosition(node.x, node.y));
    } while ((node = node.parent) && typeof node === "object");
    return path;
}
function getCost(node) {
    return NODE_COST;
}
export function search(start, end, mapData) {
    if (!("x" in start) || !("y" in start)) {
        throw new Error("start is must position");
    }

    if (!("x" in end) || !("y" in end)) {
        throw new Error("end is must position");
    }
    if (!Array.isArray(mapData)) {
        throw new Error("map is munst Array");
    }
    const openQueue = new PriorityQueue(onHash);
    const closedList = [];
    const maxValue = heuristic(start, end);

    let closestNode = __createHeuristicNode(start, end, 0, maxValue);
    openQueue.push(closestNode, maxValue);

    while (!openQueue.isEmpty) {
        const currentNode = openQueue.pop();
        if (currentNode.x === end.x && currentNode.y === end.y) {
            return getPath(currentNode);
        }
        closedList.push(currentNode);
        for (const neighbor of calcNeighbors(end, currentNode, mapData)) {
            if (closedList.includes(neighbor)) {
                continue;
            }
            const gScore = currentNode.g + getCost(neighbor);
            const beenVisited = neighbor.visited;
            if (!beenVisited || gScore < neighbor.g) {
                neighbor.visited = true;
                neighbor.parent = currentNode;
                // neighbor.h = neighbor.h || heuristic(neighbor, end);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                if (
                    neighbor.h < closestNode.h ||
                    (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
                ) {
                    closestNode = neighbor;
                }
                if (!beenVisited) {
                    openQueue.push(neighbor, neighbor.f);
                } else {
                    openQueue.remove(neighbor);
                    openQueue.push(neighbor, neighbor.g);
                }
            }
        }
    }
    return [];
}
