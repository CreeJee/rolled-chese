import { mountain, river } from "./Template.js";
import { sand } from "./Mark.js";
import { MAP } from "./Config.js";
function TemplateReducer(accr, { x, y, biome }) {
    if (!(y in accr)) {
        accr[y] = {};
    }
    accr[y][x] = biome;
    return accr;
}
function createTemplate(defaultTile, ...map) {
    return {
        tile: defaultTile,
        biome: map.reduce(TemplateReducer, {}),
    };
}
export const Worlds = [
    createTemplate(sand, ...mountain(5, 0)),
    createTemplate(sand, ...river(0, 0)),
];
export function applyBiome(mapData) {
    const map = [...mapData];
    const { tile, biome } = Worlds[Math.floor(Math.random() * Worlds.length)];
    for (let index = 0; index < map.length; index++) {
        const item = map[index];
        const x = index % MAP.width;
        const y = Math.floor(index / MAP.width);
        const currentBiome =
            y in biome && x in biome[y] ? biome[y][x] : tile(x, y).biome;
        Object.assign(item, {
            biome: currentBiome,
        });
    }
    console.log(map);
    return map;
}
