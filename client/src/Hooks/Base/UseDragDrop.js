import { hook } from "rolled";
import { useEventListeners } from "./UseEventListener.js";
import { Context } from "rolled/src/hook/basic";
let draggedContext = null;
let onDragComplete = null;
/**
 * @template T
 * @param {import("rolled/src/hook/basic").HookContext<T>} context
 * @param {import("rolled/src").hElement} $ref
 * @param {() => string} sendData
 * @param {(context: import("rolled/src/hook/basic").HookContext<T>) => void} onComplete
 */
export const useDrag = (context, $ref, sendData, onComplete) => {
    useEventListeners(context, [
        [
            $ref,
            "dragstart",
            (e) => {
                e.dataTransfer.setData("text/plain", sendData());
            },
        ],
        [
            $ref,
            "dragover",
            (e) => {
                draggedContext = context;
                onDragComplete = onComplete;
            },
        ],
    ]);
};
export const useDrop = (context, $ref, onDrop, beforeTarget) => {
    useEventListeners(context, [
        [
            $ref,
            "drop",
            (e) => {
                const data = e.dataTransfer.getData("text/plain");
                if (data.length > 0) {
                    onDrop(data);
                    onDragComplete(draggedContext);
                    draggedContext = null;
                    onDragComplete = null;
                }
            },
        ],
        [
            $ref,
            "dragover",
            (e) => {
                if (beforeTarget()) {
                    e.preventDefault();
                }
            },
        ],
    ]);
};
