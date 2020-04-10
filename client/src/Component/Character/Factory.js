import { h } from "rolled/src";
import { Characters } from "../Assets.js";
import { useDrag } from "../../Hooks/Base/UseDragDrop.js";
import { ImageFactory, ImageTemplate } from "../Base/ImageFactory.js";
export const CharacterFactory = (props, context) => {
    const $dom = ImageFactory(
        { ...props, group: "Characters", extra: "draggable" },
        context
    );
    useDrag(
        context,
        $dom,
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
