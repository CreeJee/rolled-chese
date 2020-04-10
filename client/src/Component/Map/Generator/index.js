import { MAP } from "./Config.js";
import { applyBiome } from "./Biome.js";
import { createMap, createWorld } from "./Base.js";

export function generateMap() {
    const mapData = createWorld();
    mapData.splice(
        MAP.victimRectStart,
        0,
        ...applyBiome(
            mapData.splice(
                MAP.victimRectStart,
                MAP.victimRectEnd + 1 - MAP.victimRectStart
            )
        )
    );
    mapData.splice(
        MAP.playerRectStart,
        0,
        ...applyBiome(
            mapData.splice(
                MAP.playerRectStart,
                MAP.playerRectEnd + 1 - MAP.playerRectStart
            )
        )
    );
    return mapData;
}
