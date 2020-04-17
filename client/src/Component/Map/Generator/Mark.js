import { Tiles } from "../../Assets";
import { createPosition } from "./Base";

export const biome = (biome, x, y, { ...extra } = {}) => {
    if (!(biome in Tiles)) {
        throw new Error(`${biome} is not contains Biome Marked Tile`);
    }
    return { biome, ...createPosition(x, y), ...extra };
};
export const mountain = (x, y) => biome("Mountain", x, y);
export const river = (x, y) => biome("River", x, y);
export const sand = (x, y) => biome("Sand", x, y);
export const wall = (x, y) => biome("Wall", x, y, { isBlock: true });
