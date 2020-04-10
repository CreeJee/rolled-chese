import { dom, hook, renderer, syntheticEvents } from "rolled";
import Game from "./Component/Game.js";
const { fragment, h } = dom;
const { render } = renderer;
const { c, useGlobalHook, reactiveMount } = hook;
render(document.getElementById("app"), c(Game, {}, null));
