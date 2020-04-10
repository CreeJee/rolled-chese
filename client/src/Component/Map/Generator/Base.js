import { MAP } from "./Config";

const defaultFill = () => Object.create(null);
function mapGenerate(v, k) {
    // victim
    const base = {
        nth: k,
        disabled: false,
    };
    if (MAP.playerRectStart <= k && k <= MAP.playerRectEnd) {
        base.type = "player";
    }
    if (MAP.victimRectStart <= k && k <= MAP.victimRectEnd) {
        base.type = "victim";
    }
    if (
        k < MAP.width ||
        (MAP.middleStartHeight < k && k < MAP.middleEndHeight) ||
        (MAP.bottomStartHeight < k && k < MAP.bottomEndHeight)
    ) {
        base.disabled = true;
    }
    return base;
}
export function createMap(length, fn) {
    return Array.from({ length }, typeof fn === "function" ? fn : defaultFill);
}
export function createWorld() {
    return createMap(MAP.width * MAP.height, mapGenerate);
}
