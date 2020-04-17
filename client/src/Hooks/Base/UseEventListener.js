import { hook } from "rolled";
const { c } = hook;
export const useEventListener = (context, ref, eventName, handler) => {
    const collectedRef = context.$self.collect();
    context.useEffect(() => {
        if (!(ref in collectedRef)) {
            throw new Error(`${ref} is not found`);
        }
        collectedRef[ref].addEventListener(eventName, handler);
        return () => {
            collectedRef[ref].removeEventListener(eventName, handler);
        };
    }, []);
};
export const useEventListeners = (context, refSet) => {
    context.useEffect(() => {
        const collectedRef = context.$self.collect();
        for (const [ref, eventName, handler] of refSet) {
            if (!(ref in collectedRef)) {
                throw new Error(`${ref} is not found`);
            }
            collectedRef[ref].addEventListener(eventName, handler);
        }
        return () => {
            for (const [ref, eventName, handler] of refSet) {
                collectedRef[ref].removeEventListener(eventName, handler);
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
