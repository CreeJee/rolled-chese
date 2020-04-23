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
    extra = {},
    h = heuristic(pos, end)
) {
    return {
        ...pos,
        closed: false,
        g,
        h,
        f: g + h,
        visited: false,
        parent,
        ...extra,
    };
}
function __createStruct(x, y, end, parent, direction = "NONE", mapData) {
    const pos = createPosition(x, y);
    return __createHeuristicNode(
        pos,
        end,
        parent.g +
            getCost({
                ...pos,
                ...mapData[vectorToPos(x, y)],
            }),
        parent,
        {
            direction,
        }
    );
}
function calcNeighbors(end, parent, mapData) {
    const neighbors = [];
    const { x, y } = parent;
    const isEven = x % 2 === 0;
    const ableDirection = {
        px: x < MAP.width - 1, // left
        mx: x > 0, // bottom
        py: y < MAP.height - 1, // right
        my: y > 0, // top
        oddTop: {
            mx: x > 1, // bottom
        },
    };
    const solvedTiles = {
        left: ableDirection.mx && !__isDisabledTile(x - 1, y, mapData),
        right: ableDirection.px && !__isDisabledTile(x + 1, y, mapData),
        odd: {
            upLeft: ableDirection.my && !__isDisabledTile(x, y - 1, mapData),
            downLeft:
                ableDirection.mx &&
                ableDirection.py &&
                !__isDisabledTile(x - 1, y + 1, mapData),
            upRight:
                ableDirection.px &&
                ableDirection.my &&
                !__isDisabledTile(x + 1, y - 1, mapData),
            downRight: ableDirection.py && !__isDisabledTile(x, y + 1, mapData),
        },
        even: {
            upLeft:
                ableDirection.my &&
                ableDirection.mx &&
                !__isDisabledTile(x - 1, y - 1, mapData),
            downLeft:
                ableDirection.oddTop.mx &&
                ableDirection.py &&
                !__isDisabledTile(x - 2, y + 1, mapData),
            upRight: ableDirection.my && !__isDisabledTile(x, y - 1, mapData),
            downRight:
                ableDirection.mx &&
                ableDirection.py &&
                !__isDisabledTile(x - 1, y + 1, mapData),
        },
    };
    if (solvedTiles.left) {
        neighbors.push(__createStruct(x - 1, y, end, parent, "left", mapData));
    }
    if (solvedTiles.right) {
        neighbors.push(__createStruct(x + 1, y, end, parent, "right", mapData));
    }
    if (isEven) {
        if (solvedTiles.even.upLeft) {
            neighbors.push(
                __createStruct(x - 1, y - 1, end, parent, "upLeft", mapData)
            );
        }
        if (solvedTiles.even.downLeft) {
            neighbors.push(
                __createStruct(x - 2, y + 1, end, parent, "downLeft", mapData)
            );
        }
        if (solvedTiles.even.upRight) {
            neighbors.push(
                __createStruct(x, y - 1, end, parent, "upRight", mapData)
            );
        }
        if (solvedTiles.even.downRight) {
            neighbors.push(
                __createStruct(x - 1, y + 1, end, parent, "downRight", mapData)
            );
        }
    } else {
        if (solvedTiles.odd.upLeft) {
            neighbors.push(
                __createStruct(x, y - 1, end, parent, "upLeft", mapData)
            );
        }
        if (solvedTiles.odd.downLeft) {
            neighbors.push(
                __createStruct(x - 1, y + 1, end, parent, "downLeft", mapData)
            );
        }
        if (solvedTiles.odd.upRight) {
            neighbors.push(
                __createStruct(x + 1, y - 1, end, parent, "upRight", mapData)
            );
        }
        if (solvedTiles.odd.downRight) {
            neighbors.push(
                __createStruct(x, y + 1, end, parent, "downRight", mapData)
            );
        }
    }
    return neighbors;
}
function onHash({ x, y }) {
    return vectorToPos(x, y);
}
//state a, state b
function heuristic(a, b) {
    const x1 = a.x,
        x2 = b.x,
        y1 = a.y,
        y2 = b.y,
        du = x2 - x1,
        dv = y2 + Math.floor(x2 / 2) - (y1 + Math.floor(x1 / 2));
    // return Math.max(
    //     Math.abs(x1 - x2),
    //     Math.abs(y1 - y2),
    //     Math.abs(-x1 + -y1 - (-x2 + -y2))
    // );
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    // return Math.max(
    //     Math.abs(x1 - x2),
    //     Math.abs(y1 + Math.floor(x1 / 2) - (y2 + Math.floor(x2 / 2)))
    // );
    // return du >= 0 && dv >= 0
    //     ? Math.max(Math.abs(du), Math.abs(dv))
    //     : Math.abs(du) + Math.abs(dv);
}
function getPath(foundPath) {
    let node = foundPath;
    let path = [];
    do {
        path.push(createPosition(node.x, node.y));
    } while ((node = node.parent) && typeof node === "object");
    return path.reverse();
}
function getCost(currentNode) {
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
            const gScore = currentNode.g + getCost(currentNode, neighbor);
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
                    neighbor.g = gScore;
                    openQueue.push(neighbor, neighbor.f);
                }
            }
        }
    }
    return [];
}
