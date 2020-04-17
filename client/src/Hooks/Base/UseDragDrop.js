import { hook } from "rolled";
import { useEventListeners } from "./UseEventListener.js";
import { HookContext, invokeEvent } from "rolled/src/hook/basic";
import { boundEvent, clearEvent } from "rolled/src/hook/event";
/**
 * @template T
 * @type {HookContext<T> | null}
 */
let draggedContext = null;
const eventName = "onDragComplete";
/**
 * @template T
 * @param {HookContext<T>} context
 * @param {string} ref
 * @param {() => string} sendData
 * @param {(context: HookContext<T>) => void} onComplete
 */
export const useDrag = (context, ref, sendData, onComplete) => {
    useEventListeners(context, [
        [
            ref,
            "dragstart",
            (e) => {
                e.dataTransfer.setData("text/plain", sendData());
            },
        ],
        [
            ref,
            "dragover",
            (e) => {
                draggedContext = context;
                clearEvent(draggedContext, eventName);
                boundEvent(draggedContext, eventName, onComplete);
            },
        ],
    ]);
};
/**
 * @template T
 * @param {HookContext<T>} context
 * @param {string} ref
 * @param {(data: string) => void} onDrop
 * @param {() => boolean} beforeTarget
 */
export const useDrop = (context, ref, onDrop, beforeTarget) => {
    useEventListeners(context, [
        [
            ref,
            "drop",
            (e) => {
                const data = e.dataTransfer.getData("text/plain");
                if (data.length > 0 && draggedContext !== null) {
                    onDrop(data);
                    invokeEvent(draggedContext, eventName);
                    draggedContext = null;
                }
            },
        ],
        [
            ref,
            "dragover",
            (e) => {
                if (beforeTarget()) {
                    e.preventDefault();
                }
            },
        ],
    ]);
};
