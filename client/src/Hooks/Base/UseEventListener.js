import { hook } from "rolled";
const { c } = hook;
export const useEventListener = (context, domRef, eventName, handler) => {
    context.useEffect(() => {
        if (!(domRef instanceof HTMLElement)) {
            throw new Error("domRef is must HTMLElement");
        }
        domRef.addEventListener(eventName, handler);
        return () => {
            domRef.removeEventListener(eventName, handler);
        };
    }, []);
};
export const useEventListeners = (context, refSet) => {
    context.useEffect(() => {
        for (const [ref, eventName, handler] of refSet) {
            if (!(ref instanceof HTMLElement)) {
                throw new Error("domRef is must HTMLElement");
            }
            ref.addEventListener(eventName, handler);
        }
        return () => {
            for (const [ref, eventName, handler] of refSet) {
                ref.removeEventListener(eventName, handler);
            }
        };
    }, []);
};
export const mount = (context) => ({
    useEventListener: (refName, Component, channelName = refName) => {
        return useEventListener(context, refName, Component, channelName);
    },
});
export default mount;
