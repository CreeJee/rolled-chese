import { h } from "rolled/src/base";
import { CharacterTemplate } from "../Character/Factory.js";
import { useEventListener } from "../../Hooks/Base/UseEventListener.js";
import { useDrag } from "../../Hooks/Base/UseDragDrop.js";
export const CharacterGrid = ({ name }, context) => {
    const characterName = "Tank";
    const shopSlot = `
        ${CharacterTemplate(characterName)}
        <div class="flex-item">
            #children
        </div>
    `;
    const $dom = h`<div class="flex-item character-item" draggable #root>
        ${!!name ? shopSlot : ""}
    </div>`;
    useDrag(
        context,
        "root",
        () => characterName,
        (context) => {
            // @ts-ignore
            context.update({});
        }
    );
    return $dom;
};
export default CharacterGrid;
