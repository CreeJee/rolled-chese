import { dom, syntheticEvents, hook } from "rolled";

import { Tiles } from "../../Assets.js";
import { childMount } from "../../../Hooks/Base/Mount.js";
import { CharacterFactory } from "../../Character/Factory.js";
import { useDrop } from "../../../Hooks/Base/UseDragDrop.js";
import { ImageTemplate } from "../../Base/ImageFactory.js";
import { posToVector } from "../Generator/Base.js";

const { getHook } = hook;
const { setupSyntheticEvent, addEventListener } = syntheticEvents;
const { fragment, h } = dom;

// setupSyntheticEvent("drop");
// setupSyntheticEvent("dragover");
export const Tile = ({ disabled, type, nth, biome, text }, context) => {
    const tileClass = disabled
        ? "disabled"
        : type === "player"
        ? "player"
        : "victim";
    const $dom = h`
        <div class="hex ${tileClass}" title="${text}" alt="${text}">
            <div class="hex-item" #tile>
            </div>
            ${
                typeof biome === "string" && type
                    ? ImageTemplate(biome, "Tiles", `class="hex-biome"`)
                    : ""
            }
        </div>
    `;
    if (!disabled && type === "player") {
        const [state, setState] = childMount(
            context,
            "tile",
            CharacterFactory,
            `${nth}/${context.ownedChannelName}/Character`
        );
        useDrop(
            context,
            "tile",
            (name) => {
                setState([{ name }]);
            },
            () => {
                return state.value.length === 0;
            }
        );
    }
    return $dom;
};
export default Tile;
