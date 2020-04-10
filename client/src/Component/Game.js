import { dom } from "rolled";
import Map from "./Map/index.js";
import Shop from "./Ui/Shop.js";
import { reactiveMount, c, useEffect } from "rolled/src/hook/basic";
const { fragment, h } = dom;
export const Game = (props, context) => {
    const $dom = h`
        <div>    
            <style>
                .flex-row {
                    display:flex;
                    flex-direction:row;
                }
                .flex-item {
                    height: 100%;
                }
                .shop-ui {
                    outline: 1px solid  #bebebe;
                    display:inline-flex;   
                }
            </style>
            <div #root></div>
        </div>
    `;
    useEffect(
        context,
        () => {
            reactiveMount(context, "root", [
                c(Map, {}, null),
                c(Shop, {}, null),
            ]);
        },
        []
    );
    return $dom;
};
export default Game;
