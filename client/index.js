import { render } from "rolled/src/hook";
import { fragment, h } from "rolled/src";
import { c, reactiveMount } from "rolled/src/hook/basic";

import { childMount } from "./src/Hooks/Base/Mount.js";
const Child = (props) => {
    return h`
        <p>
            <span>#name</span>
            <span>#id</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
        </p>
    `;
};
const Parent = ({ item }, context) => {
    const [slot, setSlot] = childMount(context, "slot-1", Child, "slot-1", [
        { name: 1, id: 1 },
        { name: 1, id: 1 },
        { name: 1, id: 1 },
        { name: 1, id: 1 },
    ]);
    childMount(context, "slot-2", Child, "slot-2", [{ name: 1, id: 1 }]);
    setTimeout(() => {
        console.warn("start");
        setSlot([
            { name: 1, id: 1 },
            { name: 1, id: 1 },
        ]);
    }, 3000);
    return h`<div class='parent'>
        <div #slot-1></div>
        <div #slot-2></div>
    </div>`;
};

render(document.getElementById("app"), c(Parent, {}, null));
