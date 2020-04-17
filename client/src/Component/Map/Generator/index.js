import { MAP } from "./Config.js";
import { applyBiome } from "./Biome.js";
import { createMap, createWorld } from "./Base.js";
import { search } from "./BehaviorTree/AStar.js";

export function generateMap() {
    const worldData = createWorld();
    const victimMapData = worldData.splice(
        MAP.victimRectStart,
        0,
        ...applyBiome(
            worldData.splice(
                MAP.victimRectStart,
                MAP.victimRectEnd + 1 - MAP.victimRectStart
            )
        )
    );
    const playerMapData = worldData.splice(
        MAP.playerRectStart,
        0,
        ...applyBiome(
            worldData.splice(
                MAP.playerRectStart,
                MAP.playerRectEnd + 1 - MAP.playerRectStart
            )
        )
    );

    return worldData;
}
