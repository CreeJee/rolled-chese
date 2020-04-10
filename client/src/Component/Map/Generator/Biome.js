import { mountain, river, baseTown } from "./Template.js";
import { sand } from "./Mark.js";
import { MAP } from "./Config.js";
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
    createTemplate(sand, ...baseTown(0, 0)),
];
export function applyBiome(mapData) {
    const map = [...mapData];
    const world = Worlds[Math.floor(Math.random() * Worlds.length)];
    const defaultTile = world.tile;
    const tileData = world.biome;
    for (let index = 0; index < map.length; index++) {
        const item = map[index];
        const x = index % MAP.width;
        const y = Math.floor(index / MAP.width);
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
    console.log(map);
    return map;
}
