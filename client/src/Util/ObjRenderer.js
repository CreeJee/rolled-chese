import { virtual, VirtualComponent } from "rolled/src/hook/basic";
/**
 * @implements {VirtualComponent}
 */
class ShapeRenderComponent extends VirtualComponent {
    constructor(metaData) {
        //render what???
        if (
            typeof metaData.update === "function" &&
            typeof metaData.remove === "function"
        ) {
            this.update = metaData.update;
            this.remove = metaData.remove;
        } else {
            throw new Error("need update,remove cycle");
        }
    }
}
export const create3dComponent = (component, props, children) => {
    virtual(ShapeRenderComponent, component, props, children);
};
