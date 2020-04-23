import { create3dComponent, createRendererComponent } from "./ObjRenderer.js";
import { useState, useEffect } from "rolled/src/hook/basic";
import { render } from "rolled/src/hook";
import { virtualChildMount } from "../../client/src/Hooks/Base/Mount";

import * as THREE from "three";

export function SceneComponent(props, context) {
    const [slot, setSlot] = virtualChildMount(
        context,
        create3dComponent,
        Obj,
        "virtual-object",
        [],
        {
            get scene() {
                return context.$self.scene;
            },
        }
    );
    setSlot([{}]);
    return {};
}
export function Obj(props, context) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    useEffect(
        context,
        () => {
            context.scene.add(cube);
            return () => {
                context.scene.remove(cube);
            };
        },
        []
    );
    // component cycle edit
    return {
        onUpdate(props) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        },
        onRemove() {},
    };
}
render(
    document.querySelector("#app"),
    createRendererComponent(SceneComponent, {}, [])
);
