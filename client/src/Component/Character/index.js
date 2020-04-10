import { dom, syntheticEvents, hook } from "rolled";
import { CHARACTER_CHANNEL, TILE_CHANNEL } from "../Config.js";
import { childMount } from "../../Hooks/Base/Mount.js";
import Factory from "./Factory.js";
const { setupSyntheticEvent, addEventListener } = syntheticEvents;
const { fragment, h } = dom;
export const Character = (props, context) => {
    childMount(context, "character", Factory, CHARACTER_CHANNEL);
    const dom = h`<div class="character-layer" #character>
    </div>`;

    return dom;
};
export default Character;
