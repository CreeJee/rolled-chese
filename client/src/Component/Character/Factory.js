import { h } from "rolled/src/base";
import { Characters } from "../Assets.js";
import { useDrag } from "../../Hooks/Base/UseDragDrop.js";
import { ImageFactory, ImageTemplate } from "../Base/ImageFactory.js";
export const CharacterFactory = (props, context) => {
    const $dom = ImageFactory(
        { ...props, group: "Characters", extra: "draggable #root" },
        context
    );
    useDrag(
        context,
        "root",
        () => props.name,
        (context) => {
            // @ts-ignore
            context.remove();
        }
    );
    return $dom;
};
export const CharacterTemplate = (name) =>
    ImageTemplate(name, "Characters", "draggable");
export default CharacterFactory;
