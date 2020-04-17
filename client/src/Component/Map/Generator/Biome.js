import { mountain, river, baseTown } from "./Template.js";
import { sand, river as riverMark } from "./Mark.js";
import { posToVector } from "./Base.js";
import { search } from "./BehaviorTree/AStar.js";
function TemplateReducer(accr, { x, y, ...extra }) {
    if (!(y in accr)) {
        accr[y] = {};
    }
    accr[y][x] = extra;
    return accr;
}
function createTemplate(defaultTile, ...map) {
    return {
        tile: defaultTile,
        biome: map.reduce(TemplateReducer, {}),
    };
}
export const Worlds = [
    // createTemplate(sand, ...mountain(5, 0)),
    // createTemplate(sand, ...river(0, 0)),
    createTemplate(sand, ...baseTown(5, 0)),
];
/**
 * @param {{x:number,y:number}[][]} mapData
 */
export function applyBiome(mapData) {
    const map = [...mapData];
    // const world = Worlds[Math.floor(Math.random() * Worlds.length)];
    const astarData = search({ x: 0, y: 0 }, { x: 1, y: 3 }, mapData);
    const biomeData = astarData.map(({ x, y }) => riverMark(x, y));
    const world = createTemplate(sand, ...biomeData);
    const defaultTile = world.tile;
    const tileData = world.biome;
    for (let index = 0; index < map.length; index++) {
        const item = map[index];
        const { x, y } = posToVector(index);
        const currentTile =
            y in tileData && x in tileData[y]
                ? tileData[y][x]
                : defaultTile(x, y);
        const { biome, isBlock = false, ...extra } = currentTile;
        Object.assign(item, {
            biome,
            biomeSettings: extra,
            disabled: isBlock,
        });
    }
    return map;
}
