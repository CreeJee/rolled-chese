import {
    useChannel,
    useEffect,
    reactiveMount,
    reactiveTagMount,
    c,
} from "rolled/src/hook/basic.js";
export const childMount = (
    context,
    refName,
    Component,
    channelName = refName,
    initValue = []
) => {
    const state = useChannel(context, channelName, initValue, () => {});
    const [items, setItems] = state;
    useEffect(
        context,
        () => {
            reactiveMount(
                context,
                refName,
                items.value.map((item, nth) => {
                    return c(
                        (props, ownedContext) => {
                            ownedContext.useHook(() => ({
                                update: (item) => {
                                    const cloned = [...items.value];
                                    cloned.splice(nth, 1, item);
                                    setItems(cloned);
                                },
                                remove: () => {
                                    const cloned = [...items.value];
                                    cloned.splice(nth, 1);
                                    setItems(cloned);
                                },
                                ownedChannelName: channelName,
                            }));
                            return Component(props, ownedContext);
                        },
                        { ...item },
                        null
                    );
                })
            );
        },
        [items]
    );
    return state;
};
export const virtualChildMount = (
    context,
    Renderer,
    Component,
    channelName = refName,
    initValue = [],
    customHooks = {}
) => {
    const state = useChannel(context, channelName, initValue, () => {});
    const [items, setItems] = state;
    useEffect(
        context,
        () => {
            reactiveTagMount(
                context.$self,
                items.value.map((item, nth) => {
                    return Renderer(
                        (props, ownedContext) => {
                            ownedContext.useHook(() => ({
                                update: (item) => {
                                    const cloned = [...items.value];
                                    cloned.splice(nth, 1, item);
                                    setItems(cloned);
                                },
                                remove: () => {
                                    const cloned = [...items.value];
                                    cloned.splice(nth, 1);
                                    setItems(cloned);
                                },
                                ownedChannelName: channelName,
                                ...customHooks,
                            }));
                            return Component(props, ownedContext);
                        },
                        { ...item },
                        null
                    );
                })
            );
        },
        [items]
    );
    return state;
};
export const mount = (context) => ({
    childMount: (refName, Component, channelName = refName) => {
        return childMount(context, refName, Component, channelName);
    },
});
export default mount;
