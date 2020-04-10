import { Tile } from "./Base/Tile.js";
import { childMount } from "../../Hooks/Base/Mount.js";
import { TILE_CHANNEL, TILE_QUEUE_CHANNEL } from "../Config.js";
import { shadow } from "rolled/src/hook";

import fs from "fs";
import { generateMap } from "./Generator/index.js";
// import css from "../../Assets/Css/MapLayout.css";

const css = fs.readFileSync(
    __dirname + "../../../Assets/Css/MapLayout.css",
    "utf8"
);

export const Map = (props, context) => {
    const mapData = generateMap();
    const queueData = Array.from({ length: 9 }, (v, k) => ({
        nth: k,
        type: "player",
        disabled: false,
    }));
    childMount(context, "hex-map", Tile, TILE_CHANNEL, mapData);
    childMount(context, "hex-slot", Tile, TILE_QUEUE_CHANNEL, queueData);

    //  <link rel="stylesheet" type="text/css" href="${css}">
    return shadow`
        <style>
            ${css}
            .disabled {
                background-color: #bebebe !important;
            }
            .victim {
                background-color: #5142f5 !important;
            }
            .hex {
                position:relative;
            }
            .hex .hex-item {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index:1;
            }
            .hex-item img {
                width: 100%;
                height: 100%;
            }
            .hex .hex-biome {
                width:100%;
                height:100%;
                z-index:0;
            }
            .hex-root {
                height: auto;
            }
        </style>
        <div class="map-layer hex-root">
            <div class="hex-crop">
                <div class="hex-container" #hex-map>
                </div>
            </div>
            <div class="hex-crop">
                <div class="hex-container" #hex-slot>
                </div> 
            </div>
        </div>
    `;
};
export default Map;
