import { h } from "rolled/src";
import * as Groups from "../Assets.js";
import { Context } from "rolled/src/hook/basic";
const getImage = (name, group) => {
    const Collections = Groups[group];
    if (typeof Collections !== "object") {
        throw new Error(`Collections is not object`);
    }
    if (!(name in Collections)) {
        throw new Error(`${name} is not included Collection`);
    }
    return Collections[name];
};
/**
 * @typedef {{name: string, group: keyof Groups| string, extra: string}} FactoryTemplate
 * @param {FactoryTemplate} props
 * @param {Context<FactoryTemplate>} context
 */
export const ImageFactory = (props, context) => {
    const $dom = h`${ImageTemplate(props.name, props.group, props.extra)}`;
    props["path"] = getImage(props.name, props.group);
    return $dom;
};
/**
 *
 * @param {string} name
 * @param {string} group
 * @param {string} extra
 */
export const ImageTemplate = (name, group, extra) => {
    return `<img src="${getImage(name, group)}" ${extra}/>`;
};
export default ImageFactory;
