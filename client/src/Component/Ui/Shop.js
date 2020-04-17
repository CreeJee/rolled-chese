import { SHOP_CHANNEL } from "../Config.js";
import { childMount } from "../../Hooks/Base/Mount.js";
import CharacterGrid from "./CharacterGrid.js";
import { h, fragment } from "rolled/src/base";

const sampleMockCharacter = {
    name: "Tank",
    lv: 1,
};
export const Shop = (props, context) => {
    childMount(
        context,
        "root",
        CharacterGrid,
        SHOP_CHANNEL,
        Array.from({ length: 5 }, (v, k) => ({
            ...sampleMockCharacter,
            nth: k,
        }))
    );
    return h`
        <div class="flex-row shop-ui" #root>
        </div>
    `;
};
export default Shop;
