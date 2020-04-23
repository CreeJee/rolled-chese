import {
    virtual,
    VirtualComponent,
    DomComponent,
} from "rolled/src/hook/virtual";
import * as THREE from "three";
import { getHook } from "rolled/src/hook/basic";
class ObjRenderComponent extends VirtualComponent {
    constructor(obj, context) {
        super(obj, context);
        //render what???
        if (
            typeof obj.onUpdate === "function" &&
            typeof obj.onRemove === "function"
        ) {
            this.onUpdate = obj.onUpdate;
            this.onRemove = obj.onRemove;
        } else {
            throw new Error("need onUpdate,onRemove cycle");
        }
    }
}
class SceneRenderer extends DomComponent {
    constructor(ref, context) {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        super(renderer.domElement, context);
        this.renderer = renderer;
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            10
        );
        this.scene = new THREE.Scene();
        this.camera.position.z = 5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const animate = () => {
            requestAnimationFrame(animate);
            for (const $child of context.$children) {
                const $hook = getHook($child);
                $hook.$self.onUpdate($hook.props);
            }
            this.renderer.render(this.scene, this.camera);
            () => {
                cancelAnimationFrame(animate);
            };
        };
        animate();
    }
}
export const create3dComponent = (component, props, children) => {
    return virtual(ObjRenderComponent, component, props, children);
};
export const createRendererComponent = (component, props, children) => {
    return virtual(SceneRenderer, component, props, children);
};
