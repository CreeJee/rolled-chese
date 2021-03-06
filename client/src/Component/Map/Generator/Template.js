import {
    mountain as mountainBiome,
    river as riverBiome,
    wall,
} from "./Mark.js";
export const river = (x, y) => {
    return [
        riverBiome(x, y),
        riverBiome(x, y + 1),
        riverBiome(x, y + 2),
        riverBiome(x, y + 3),
    ];
};
export const mountain = (x, y) => {
    return [
        mountainBiome(x, y),
        mountainBiome(x + 1, y),
        mountainBiome(x, y + 1),
        mountainBiome(x + 1, y + 1),
        ...river(x, y + 2),
    ];
};
export const baseTown = (x, y) => {
    return [
        mountainBiome(x, y),
        mountainBiome(x + 1, y),
        mountainBiome(x, y + 1),
        mountainBiome(x + 1, y + 1),
        wall(x, y + 2),
        wall(x + 1, y + 2),
    ];
};
