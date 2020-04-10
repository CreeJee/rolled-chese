// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/rolled/src/syntheticEvents.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEventListener = addEventListener;
exports.setupSyntheticEvent = setupSyntheticEvent;

const generateEvent = name => `__${name}__`;

const nativeToSyntheticEvent = (event, name) => {
  const eventKey = generateEvent(name);
  let dom = event.target;

  while (dom !== null) {
    const eventHandler = dom[eventKey];

    if (eventHandler) {
      eventHandler(event);
      return undefined;
    }

    dom = dom.parentNode;
  }
};

const CONFIGURED_SYNTHETIC_EVENTS = {};

function addEventListener($dom, name, fn) {
  $dom[generateEvent(name)] = fn;
}

function setupSyntheticEvent(name) {
  if (name in CONFIGURED_SYNTHETIC_EVENTS) {
    return;
  } // TODO : support multiple events


  document.addEventListener(name, event => nativeToSyntheticEvent(event, name));
  CONFIGURED_SYNTHETIC_EVENTS[name] = true;
}
},{}],"../node_modules/rolled/src/styles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = styles;
exports.keyframes = keyframes;
exports.default = void 0;
const styleElement = document.createElement("style");
const styleSheet = styleElement.sheet;
styleElement.id = "rolled-style";
document.head.appendChild(styleElement);
const memorizedStyle = new Map();
const memorizedAnim = new Map(); // why using css class like ID?

/**
 * @param {{ [x: string]: any; }} stylesObj
 */

function styles(stylesObj) {
  for (let selector in stylesObj) {
    const classStyles = stylesObj[selector];

    if (!memorizedStyle.has(selector)) {
      throw new Error(`styles already defined object:${JSON.stringify({
        [selector]: classStyles
      })}`);
    }

    const ruleIdx = styleSheet.insertRule(`${selector} {}`, styleSheet.cssRules.length);
    const ruleStyle = styleSheet.cssRules[ruleIdx].style;

    for (let rule in classStyles) {
      if (rule[0] === ":" || rule[0] === " ") {
        const pseudoRuleIdx = styleSheet.insertRule(`${selector}${rule} {}`, styleSheet.cssRules.length);
        const pseudoRuleStyle = styleSheet.cssRules[pseudoRuleIdx].style;
        Object.assign(pseudoRuleStyle, classStyles[rule]);
        delete classStyles[rule];
      }
    }

    Object.assign(ruleStyle, classStyles); // well...? it does not need :)

    stylesObj[selector] = selector;
  }

  return stylesObj;
} // TODO : return 맞추기


function keyframes(framesObj) {
  for (let name in framesObj) {
    const frames = framesObj[name];

    if (!memorizedAnim.has(name)) {
      throw new Error(`styles already defined object:${JSON.stringify({
        [name]: frames
      })}`);
    }

    const framesIdx = styleSheet.insertRule(`@keyframes ${name} {}`, styleSheet.cssRules.length);
    const framesSheet = styleSheet.cssRules[framesIdx];

    for (let percent in frames) {
      framesSheet.appendRule(`${percent}% {}`);
      const frameIdx = framesSheet.cssRules.length - 1;
      const frameStyle = framesSheet.cssRules[frameIdx].style;
      Object.assign(frameStyle, frames[percent]);
    }
  }

  return framesObj;
}

var _default = styles;
exports.default = _default;
},{}],"../node_modules/rolled/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.fragment = exports.h = exports.extractFragment = exports.classListNodeType = void 0;

class Ref {
  constructor(idx, ref) {
    this.idx = idx;
    this.ref = ref;
  }

}

const classListNodeType = "classList";
exports.classListNodeType = classListNodeType;
const attributeClassTable = {
  update(value) {
    const current = this.classList.item(this.nth);

    if (current.length > 0) {
      this.classList.replace(current, value);
    } else {
      this.classList.add(value);
      this.nth = this.classList.length - 1;
    }
  },

  nodeType: classListNodeType
};

const createClassAttribute = (classList, nth) => Object.assign(Object.create(null), {
  classList,
  nth
}, attributeClassTable);

const compilerTemplate = document.createElement("template");

const collector = node => {
  const refSet = [];

  if (node.nodeType !== Node.TEXT_NODE) {
    const attribute = node.attributes;
    const size = attribute.length;

    if (attribute !== undefined) {
      for (let index = 0; index < size; index++) {
        const {
          name,
          value
        } = attribute[index];
        const valueMapper = name === "class" ? value.split(" ") : [value];

        if (name[0] === "#") {
          let rName = name.slice(1);
          node.removeAttribute(name); // todo: legacy & remove

          node.setAttribute(rName, "");
          refSet.push(name.slice(1));
        }

        for (let index = 0; index < valueMapper.length; index++) {
          const mappedValue = valueMapper[index];

          if (mappedValue[0] === "#") {
            // captured
            refSet.push(Object.assign(mappedValue.slice(1), {
              nth: index,
              name
            }));
          }
        } // TODO: attribute mapper

      }
    }
  } else {
    const nodeData = node.nodeValue;

    if (nodeData[0] === "#") {
      node.nodeValue = "";
      refSet.push(nodeData.slice(1));
    }
  }

  return refSet;
};

const __default__handler = () => false;

const genPathRecursive = (node, handler = __default__handler, path = [], indices = [], root = node) => {
  const childNodes = node.childNodes;
  const collect = collector(node);

  if (Array.isArray(collect) && collect.length > 0) {
    for (let index = 0; index < collect.length; index++) {
      indices.push(new Ref(path, collect[index]));
    }
  }

  for (const idx of childNodes.keys()) {
    const child = childNodes[idx];
    genPathRecursive(child, handler, path.concat(idx), indices, node);

    if (handler() || __default__handler()) {
      break;
    }
  }

  return indices;
};

const genPath = (node, handler = __default__handler) => {
  return genPathRecursive(node, handler);
};

const genFragmentPath = node => {
  const parent = node.parentNode;
  const siblings = parent !== null ? Array.from(parent.childNodes) : [];
  return genPath(node, () => !node.isSameNode(node) && siblings.includes(node));
};

const roll = (node, idx) => {
  for (const k of idx) {
    node = node.childNodes[k];
  }

  return node;
};

function walker(node = this) {
  const refs = {};

  for (const x of this._refPaths) {
    const ref = x.ref;
    const idx = x.idx;
    const rolled = roll(node, idx);
    refs[ref] = typeof ref === "object" ? ref.name === "class" ? createClassAttribute(rolled.classList, ref.nth) : rolled.attributes[ref.name] : rolled;
  }

  return refs;
}

const extractFragment = (strings, ...args) => {
  const template = String.raw(strings, ...args).replace(/>\n+/g, ">").replace(/\s+</g, "<").replace(/>\s+/g, ">").replace(/\n\s+/g, ""); // .replace(/\n\s+/g, "<!-- -->");

  compilerTemplate.innerHTML = template;
  return compilerTemplate.content;
};

exports.extractFragment = extractFragment;

const compile = node => {
  node._refPaths = genPath(node);
  node.collect = walker;
};

const h = (strings, ...args) => {
  const content = extractFragment(strings, ...args).firstChild;
  compile(content);
  return content;
};

exports.h = h;

const fragmentCompile = node => {
  for (const self of node.childNodes) {
    self._refPaths = genFragmentPath(self);
    self.collect = walker;
  }
};

const fragmentCollect = function (node = this) {
  const refs = {};

  for (const self of node.childNodes) {
    Object.assign(refs, self.collect(self));
  }

  return refs;
};

const fragment = (strings, ...args) => {
  const content = extractFragment(strings, ...args);
  fragmentCompile(content);
  content.collect = fragmentCollect.bind({
    childNodes: Array.from(content.childNodes)
  });
  return content;
};

exports.fragment = fragment;
var _default = h;
exports.default = _default;
},{}],"../node_modules/rolled/src/hook/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasHook = hasHook;
exports.getHook = getHook;
exports.setHook = setHook;
exports.removeHook = removeHook;
exports.useGlobalHook = useGlobalHook;
exports.bindGlobalHook = bindGlobalHook;
exports.hookSymbol = exports.HookError = exports.LayoutGenError = exports.StateObject = exports.Context = exports.hooksMiddleWare = void 0;
const hooksMiddleWare = [];
exports.hooksMiddleWare = hooksMiddleWare;

const __Context_Getter = (target, prop) => {
  const pureValue = target.value;
  return Reflect.get(prop in target ? target : typeof pureValue === "object" && prop in pureValue ? target.value : target, prop);
};

const __Context_Apply = (target, thisArg, argumentsList) => Reflect.apply(target, thisArg, argumentsList);

class Context {
  constructor(value, nth) {
    this.value = value;
    this.nth = nth;
    return new Proxy(this, {
      get: __Context_Getter,
      apply: __Context_Apply
    });
  }

  toString() {
    return this.value.toString();
  }

  valueOf() {
    return this.value;
  }

  [Symbol.toPrimitive]() {
    return this.value;
  }

  static convert(value, nth) {
    return new Context(value, nth);
  }

}

exports.Context = Context;

class StateObject {
  constructor(getter, dispatcher) {
    Object.defineProperties(this, {
      0: {
        get: getter
      },
      1: {
        get: () => dispatcher
      },
      length: {
        value: 2
      }
    });
  }

  *[Symbol.iterator]() {
    yield this[0];
    yield this[1];
  }

} // Errors


exports.StateObject = StateObject;

class LayoutGenError extends Error {
  constructor(msg) {
    super(msg);
  }

}

exports.LayoutGenError = LayoutGenError;

class HookError extends Error {
  constructor(...args) {
    super(...args);
  }

} //hook


exports.HookError = HookError;
const hookSymbol = Symbol("@@Hook");
exports.hookSymbol = hookSymbol;

function hasHook(component) {
  return hookSymbol in component;
}

function getHook(component) {
  return component[hookSymbol];
}

function setHook(component, hook) {
  hook.$self = component;
  return component[hookSymbol] = hook;
}

function removeHook(component) {
  let hook = component[hookSymbol];
  delete hook.$self;
  delete component[hookSymbol];
  hook = null;
}

function useGlobalHook(hook) {
  if (typeof hook !== "function") {
    throw new HookError("custom hook middleware is must function");
  }

  hooksMiddleWare.push(hook);
}

function bindGlobalHook(hook) {
  return hooksMiddleWare.reduce((accr, handler) => {
    const initResult = handler(hook) || {};
    const handlers = Object.values(initResult);

    if (typeof initResult === "object" && handlers.every(v => typeof v === "function")) {
      Object.assign(accr, initResult);
    } else {
      throw new HookError("custom hook middleware result is must object & each element is must function");
    }

    return accr;
  }, {});
}
},{}],"../node_modules/rolled/src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.longestPositiveIncreasingSubsequence = longestPositiveIncreasingSubsequence;
exports.noOpUpdate = void 0;

// Picked from
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L368
// return an array of the indices of ns that comprise the longest increasing subsequence within ns
function longestPositiveIncreasingSubsequence(ns, newStart) {
  var seq = [],
      is = [],
      l = -1,
      pre = new Array(ns.length);

  for (var i = newStart, len = ns.length; i < len; i++) {
    var n = ns[i];
    if (n < 0) continue;
    var j = findGreatestIndexLEQ(seq, n);
    if (j !== -1) pre[i] = is[j];

    if (j === l) {
      l++;
      seq[l] = n;
      is[l] = i;
    } else if (n < seq[j + 1]) {
      seq[j + 1] = n;
      is[j + 1] = i;
    }
  }

  for (i = is[l]; l >= 0; i = pre[i], l--) {
    seq[l] = i;
  }

  return seq;
}

function findGreatestIndexLEQ(seq, n) {
  // invariant: lo is guaranteed to be index of a value <= n, hi to be >
  // therefore, they actually start out of range: (-1, last + 1)
  var lo = -1,
      hi = seq.length; // fast path for simple increasing sequences

  if (hi > 0 && seq[hi - 1] <= n) return hi - 1;

  while (hi - lo > 1) {
    var mid = Math.floor((lo + hi) / 2);

    if (seq[mid] > n) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return lo;
} // just for utils


const noOpUpdate = (a, b) => {};

exports.noOpUpdate = noOpUpdate;
},{}],"../node_modules/rolled/src/base/reconcile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconcile = reconcile;
exports.default = void 0;

var _utils = require("../utils.js");

// This is almost straightforward implementation of reconcillation algorithm
// based on ivi documentation:
// https://github.com/localvoid/ivi/blob/2c81ead934b9128e092cc2a5ef2d3cabc73cb5dd/packages/ivi/src/vdom/implementation.ts#L1366
// With some fast paths from Surplus implementation:
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L86
//
// How this implementation differs from others, is that it's working with data directly,
// without maintaining nodes arrays, and uses dom props firstChild/lastChild/nextSibling
// for markers moving.
function reconcile(parent, renderedValues, data, createFn, noOp = _utils.noOpUpdate, beforeNode, afterNode) {
  // Fast path for clear
  if (data.length === 0) {
    if (beforeNode !== undefined || afterNode !== undefined) {
      let node = beforeNode !== undefined ? beforeNode.nextSibling : parent.firstChild,
          tmp;
      if (afterNode === undefined) afterNode = null;

      while (node !== afterNode) {
        tmp = node.nextSibling;
        parent.removeChild(node);
        node = tmp;
      }
    } else {
      parent.textContent = "";
    }

    return;
  } // Fast path for create


  if (renderedValues.length === 0) {
    let node,
        mode = afterNode !== undefined ? 1 : 0;

    for (let i = 0, len = data.length; i < len; i++) {
      node = createFn(data[i], i);
      mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
    }

    return;
  }

  let prevStart = 0,
      newStart = 0,
      loop = true,
      prevEnd = renderedValues.length - 1,
      newEnd = data.length - 1,
      a,
      b,
      prevStartNode = beforeNode ? beforeNode.nextSibling : parent.firstChild,
      newStartNode = prevStartNode,
      prevEndNode = afterNode ? afterNode.previousSibling : parent.lastChild;

  fixes: while (loop) {
    loop = false;

    let _node; // Skip prefix


    a = renderedValues[prevStart], b = data[newStart];

    while (a === b) {
      noOp(prevStartNode, b);
      prevStart++;
      newStart++;
      newStartNode = prevStartNode = prevStartNode.nextSibling;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevStart];
      b = data[newStart];
    } // Skip suffix


    a = renderedValues[prevEnd], b = data[newEnd];

    while (a === b) {
      noOp(prevEndNode, b);
      prevEnd--;
      newEnd--;
      afterNode = prevEndNode;
      prevEndNode = prevEndNode.previousSibling;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevEnd];
      b = data[newEnd];
    } // Fast path to swap backward


    a = renderedValues[prevEnd], b = data[newStart];

    while (a === b) {
      loop = true;
      noOp(prevEndNode, b);
      _node = prevEndNode.previousSibling;
      parent.insertBefore(prevEndNode, newStartNode);
      prevEndNode = _node;
      newStart++;
      prevEnd--;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevEnd];
      b = data[newStart];
    } // Fast path to swap forward


    a = renderedValues[prevStart], b = data[newEnd];

    while (a === b) {
      loop = true;
      noOp(prevStartNode, b);
      _node = prevStartNode.nextSibling;
      parent.insertBefore(prevStartNode, afterNode);
      prevStart++;
      afterNode = prevStartNode;
      prevStartNode = _node;
      newEnd--;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevStart];
      b = data[newEnd];
    }
  } // Fast path for shrink


  if (newEnd < newStart) {
    if (prevStart <= prevEnd) {
      let next;

      while (prevStart <= prevEnd) {
        if (prevEnd === 0) {
          parent.removeChild(prevEndNode);
        } else {
          next = prevEndNode.previousSibling;
          parent.removeChild(prevEndNode);
          prevEndNode = next;
        }

        prevEnd--;
      }
    }

    return;
  } // Fast path for add


  if (prevEnd < prevStart) {
    if (newStart <= newEnd) {
      let node,
          mode = afterNode ? 1 : 0;

      while (newStart <= newEnd) {
        node = createFn(data[newStart], newStart);
        mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
        newStart++;
      }
    }

    return;
  } // Positions for reusing nodes from current DOM state


  const P = new Array(newEnd + 1 - newStart);

  for (let i = newStart; i <= newEnd; i++) P[i] = -1; // Index to resolve position from current to new


  const I = new Map();

  for (let i = newStart; i <= newEnd; i++) I.set(data[i], i);

  let reusingNodes = newStart + data.length - 1 - newEnd,
      toRemove = [];

  for (let i = prevStart; i <= prevEnd; i++) {
    if (I.has(renderedValues[i])) {
      P[I.get(renderedValues[i])] = i;
      reusingNodes++;
    } else {
      toRemove.push(i);
    }
  } // Fast path for full replace


  if (reusingNodes === 0) {
    if (beforeNode !== undefined || afterNode !== undefined) {
      let node = beforeNode !== undefined ? beforeNode.nextSibling : parent.firstChild,
          tmp;
      if (afterNode === undefined) afterNode = null;

      while (node !== afterNode) {
        tmp = node.nextSibling;
        parent.removeChild(node);
        node = tmp;
        prevStart++;
      }
    } else {
      parent.textContent = "";
    }

    let node,
        mode = afterNode ? 1 : 0;

    for (let i = newStart; i <= newEnd; i++) {
      node = createFn(data[i], i);
      mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
    }

    return;
  } // What else?


  const longestSeq = (0, _utils.longestPositiveIncreasingSubsequence)(P, newStart); // Collect nodes to work with them

  const nodes = [];
  let tmpC = prevStartNode;

  for (let i = prevStart; i <= prevEnd; i++) {
    nodes[i] = tmpC;
    tmpC = tmpC.nextSibling;
  }

  for (let i = 0; i < toRemove.length; i++) parent.removeChild(nodes[toRemove[i]]);

  let lisIdx = longestSeq.length - 1,
      tmpD;

  for (let i = newEnd; i >= newStart; i--) {
    if (longestSeq[lisIdx] === i) {
      afterNode = nodes[P[longestSeq[lisIdx]]];
      noOp(afterNode, data[i]);
      lisIdx--;
    } else {
      if (P[i] === -1) {
        tmpD = createFn(data[i], i);
      } else {
        tmpD = nodes[P[i]];
        noOp(tmpD, data[i]);
      }

      parent.insertBefore(tmpD, afterNode);
      afterNode = tmpD;
    }
  }
}

var _default = reconcile;
exports.default = _default;
},{"../utils.js":"../node_modules/rolled/src/utils.js"}],"../node_modules/rolled/src/base/reuseNodes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reuseNodes = reuseNodes;
exports.default = void 0;

var _utils = require("../utils.js");

function reuseNodes(parent, renderedValues, data, createFn, noOp = _utils.noOpUpdate, beforeNode, afterNode) {
  if (data.length === 0) {
    if (beforeNode !== undefined || afterNode !== undefined) {
      let node = beforeNode !== undefined ? beforeNode.nextSibling : parent.firstChild,
          tmp;
      if (afterNode === undefined) afterNode = null;

      while (node !== afterNode) {
        tmp = node.nextSibling;
        parent.removeChild(node);
        node = tmp;
      }
    } else {
      parent.textContent = "";
    }

    return;
  }

  if (renderedValues.length > data.length) {
    let i = renderedValues.length,
        tail = afterNode !== undefined ? afterNode.previousSibling : parent.lastChild,
        tmp;

    while (i > data.length) {
      tmp = tail.previousSibling;
      parent.removeChild(tail);
      tail = tmp;
      i--;
    }
  }

  let _head = beforeNode ? beforeNode.nextSibling : parent.firstChild;

  if (_head === afterNode) _head = undefined;

  let _mode = afterNode ? 1 : 0;

  for (let i = 0, item, head = _head, mode = _mode; i < data.length; i++) {
    item = data[i];

    if (head) {
      noOp(head, item);
    } else {
      head = createFn(item, i);
      mode ? parent.insertBefore(head, afterNode) : parent.appendChild(head);
    }

    head = head.nextSibling;
    if (head === afterNode) head = null;
  }
}

var _default = reuseNodes;
exports.default = _default;
},{"../utils.js":"../node_modules/rolled/src/utils.js"}],"../node_modules/rolled/src/hook/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectEvent = expectEvent;
exports.invokeEvent = invokeEvent;
exports.boundEvent = boundEvent;
exports.clearEvent = clearEvent;
exports.SYSTEM_EVENT_NAME = exports.EVENT_NAME = exports.EventError = void 0;
const lifeCycleSymbol = "$";

function __generateLifeCycleName(name) {
  return lifeCycleSymbol + name;
}

function __isLifeCycleEvent(name) {
  return name[0] === lifeCycleSymbol;
}

class EventError extends Error {
  constructor(...args) {
    super(...args);
  }

}

exports.EventError = EventError;
const EVENT_NAME = {
  unMount: "unMount",
  mount: "mount",
  watch: Symbol("WATCHED_EVENT")
};
exports.EVENT_NAME = EVENT_NAME;
const SYSTEM_EVENT_NAME = {
  $mount: __generateLifeCycleName("mount"),
  $unMount: __generateLifeCycleName("unMount")
};
exports.SYSTEM_EVENT_NAME = SYSTEM_EVENT_NAME;

function expectEvent(context, eventName) {
  if (context && typeof context === "object" && context !== null && (eventName in EVENT_NAME || eventName in SYSTEM_EVENT_NAME)) {
    return;
  }

  throw new EventError(`${eventName.toString()} is not supported Event`);
}

function invokeEvent(hookContext, eventName) {
  expectEvent(hookContext, eventName);
  const events = hookContext.events;
  const item = events[eventName];

  if (typeof item === "function") {
    return item(hookContext);
  }

  if (Array.isArray(item)) {
    for (let index = 0; index < item.length; index++) {
      item[index](hookContext);
    }
  }

  if (!__isLifeCycleEvent(eventName)) {
    invokeEvent(hookContext, lifeCycleSymbol + eventName);
  }
}

function boundEvent(context, eventName, value) {
  expectEvent(context, eventName);
  const events = context.events;
  const item = events[eventName];

  if (Array.isArray(item)) {
    //TODO: use scheduler task
    if (typeof value === "function") {
      item.push(value);
    } else {
      throw new EventError(`event is must function!!!`);
    }
  } else {
    events[eventName] = value;
  }
}

function clearEvent(context, eventName) {
  expectEvent(context, eventName);
  const events = context.events;
  const item = events[eventName];

  if (Array.isArray(item)) {
    item.splice(0);
  } else {
    events[eventName] = () => {};
  }
}
},{}],"../node_modules/rolled/src/hook/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__generateChildren = exports.__forceGenerateTags = exports.__generateComponent = exports.__bindDom = void 0;

var _core = require("./core.js");

var _reconcile = require("../base/reconcile.js");

var _reuseNodes = require("../base/reuseNodes.js");

var _index = require("../index.js");

var _event = require("./event.js");

const onUpdate = (node, current, key) => {
  switch (node.nodeType) {
    // case Node.ELEMENT_NODE:
    //     node.setAttribute(key, current);
    //     break;
    case Node.TEXT_NODE:
    case Node.ATTRIBUTE_NODE:
      node.nodeValue = current;
      break;

    case _index.classListNodeType:
      node.update(current);
      break;

    default:
      throw new _core.LayoutGenError("unaccepted data");
  }
};

const noOpCond = (current, before) => true;

const valueOf = value => typeof value === "object" ? value.valueOf() : value;

const updater = (old, view, isUpdate = noOpCond) => {
  //needs bound self
  return function __nestedUpdate__(item) {
    const collector = view.collect(this);

    for (const key in collector) {
      const current = valueOf(item[key]);
      const before = valueOf(old[key]);

      if (current !== before && isUpdate(current, before)) {
        onUpdate(collector[key], current, key);
        old[key] = current;
      }
    }
  };
};

const __bindDom = ({ ...item
}, itemGroup) => {
  switch (itemGroup.nodeType) {
    case Node.DOCUMENT_FRAGMENT_NODE:
      let rootChild = itemGroup.firstChild;

      if (rootChild !== null) {
        do {
          rootChild.update = updater(item, rootChild);
          updater({}, rootChild).call(rootChild, item);
        } while (rootChild = rootChild.nextSibling);
      }

      break;

    case Node.ELEMENT_NODE:
      itemGroup.update = updater(item, itemGroup);
      updater({}, itemGroup).call(itemGroup, item);
      break;

    default:
      throw new _core.LayoutGenError("unacceptable nodes");
  }

  return itemGroup;
};

exports.__bindDom = __bindDom;

const __generateComponent = (item, component) => {
  let view = component(item);

  if (view instanceof Promise) {
    throw new _core.LayoutGenError("lazy is not Promise (use rolled.lazy)");
  }

  const hook = (0, _core.getHook)(view);
  const isHook = (0, _core.hasHook)(view);

  const rendered = __bindDom(isHook ? hook.props : item, view);

  if (isHook) {
    (0, _event.invokeEvent)((0, _core.getHook)(view), "mount");
  }

  return rendered;
};

exports.__generateComponent = __generateComponent;

const __forceGenerateTags = (parent, renderedItems, childs, refCollector = [], renderer = _reconcile.reconcile) => {
  renderer(parent, renderedItems, childs, (hoc, nth) => {
    const view = __generateComponent({}, hoc); // tricky solution
    // @ts-ignore


    if (view.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      throw new _core.LayoutGenError("slot is must not fragment");
    }

    refCollector.splice(nth, 0, view);
    return view;
  }, (node, item) => node.update(item));
  return refCollector;
};

exports.__forceGenerateTags = __forceGenerateTags;

const __generateChildren = (parent, childs, renderer = _reconcile.reconcile) => {
  let renderedItems = [];
  let components = [];

  if (Array.isArray(childs)) {
    if (!("update" in parent)) {
      parent.update = function (data) {
        renderer(parent, renderedItems, childs, (hoc, nth) => {
          const view = __generateComponent({}, hoc);

          components[nth] = view;
          return view;
        }, (node, item) => node.update(item));
        renderedItems = childs.slice();
      };
    }

    parent.update(childs.slice());
  }

  return components;
};

exports.__generateChildren = __generateChildren;
},{"./core.js":"../node_modules/rolled/src/hook/core.js","../base/reconcile.js":"../node_modules/rolled/src/base/reconcile.js","../base/reuseNodes.js":"../node_modules/rolled/src/base/reuseNodes.js","../index.js":"../node_modules/rolled/src/index.js","./event.js":"../node_modules/rolled/src/hook/event.js"}],"../node_modules/rolled/src/hook/taskQueue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIdleQueue = exports.getTimerQueue = exports.getAnimationQueue = void 0;

class Timer {
  // @ts-ignore
  constructor(addTimer, removeTimer) {
    this.timer = -1;
    this.addTimer = addTimer;
    this.removeTimer = removeTimer;
  }

  boundTask(task) {
    if (this.timer >= 0) {
      this.removeTimer(this.timer);
    }

    this.timer = this.addTimer(task);
  }

}

class AnimationTimer extends Timer {
  constructor() {
    super(fn => window.requestAnimationFrame(fn), timer => window.cancelAnimationFrame(timer));
  }

}

class StateTimer extends Timer {
  constructor() {
    super(fn => window.setTimeout(fn, 0), timer => window.clearTimeout(timer));
  }

}

class IdleTimer extends Timer {
  constructor() {
    super(fn => window.requestIdleCallback(fn), timer => window.cancelIdleCallback(timer));
  }

}

class TaskQueue {
  constructor(timer) {
    this.tasks = [];
    this.timer = timer;
    this.boundExec = this.exec.bind(this);
  }

  add(task, ...param) {
    if (typeof task !== "function") {
      //@TODO: taskQueue must contains Own Error
      throw new Error("[TaskQueue] Task is must Function");
    }

    this.tasks.push({
      task,
      param
    });
    this.timer.boundTask(this.boundExec);
  }

  exec() {
    for (const {
      task,
      param
    } of this.tasks.splice(0)) {
      task(...param);
    }
  }

}

const getAnimationQueue = () => new TaskQueue(new AnimationTimer());

exports.getAnimationQueue = getAnimationQueue;

const getTimerQueue = () => new TaskQueue(new StateTimer());

exports.getTimerQueue = getTimerQueue;

const getIdleQueue = () => new TaskQueue(new IdleTimer());

exports.getIdleQueue = getIdleQueue;
},{}],"../node_modules/rolled/src/hook/basic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  combineReducers: true,
  useState: true,
  useLayoutState: true,
  useEffect: true,
  useContext: true,
  useReducer: true,
  useChannel: true,
  reactiveMount: true,
  memo: true,
  LazyComponent: true,
  lazy: true,
  bindHook: true,
  __compileComponent: true,
  c: true
};
exports.combineReducers = combineReducers;
exports.useState = useState;
exports.useLayoutState = useLayoutState;
exports.useEffect = useEffect;
exports.useContext = useContext;
exports.useReducer = useReducer;
exports.useChannel = useChannel;
exports.reactiveMount = reactiveMount;
exports.memo = memo;
exports.lazy = lazy;
exports.bindHook = bindHook;
exports.__compileComponent = __compileComponent;
exports.c = exports.LazyComponent = void 0;

var _dom = require("./dom.js");

var _core = require("./core.js");

Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _core[key];
    }
  });
});

var _index = require("../index.js");

var _taskQueue2 = require("./taskQueue.js");

var _event = require("./event.js");

Object.keys(_event).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _event[key];
    }
  });
});
//d.ts 잠제적 migrate
const stateTask = (0, _taskQueue2.getIdleQueue)();
const layoutTask = (0, _taskQueue2.getAnimationQueue)();

const __channelMap = new Map(); //effects layout


function __stateLayout(context, initValue, setter) {
  const nth = context.state.length;
  const temp = new _core.StateObject(() => context.state[nth], function __dispatch(val) {
    if (Array.isArray(context.state)) {
      let value = val instanceof _core.Context ? val.value : val;
      let contextValue = context.state[nth];
      contextValue.value = value;

      if (typeof setter === "function") {
        setter(contextValue);
      }
    } else {
      throw new Error("dispatch only actived Context");
    }
  });

  if (!(nth in context.state)) {
    context.state[nth] = _core.Context.convert(initValue || undefined, nth);
  }

  return temp;
}

function _lazySetter__useEffect(value) {
  return value;
}

function __stateEffect(context, initValue, _lazySetter = typeof initValue === "function" ? initValue : _lazySetter__useEffect, _taskQueue = stateTask) {
  return __stateLayout(context, initValue, contextValue => {
    _taskQueue.add(() => {
      contextValue.value = _lazySetter(contextValue.value);
      (0, _event.invokeEvent)(context, _event.EVENT_NAME.mount);
    });

    return contextValue;
  });
} //cycle


function __cycleEffects(cycle, nextCycle) {
  let cycleResult = null;

  if (typeof cycle === "function") {
    cycleResult = cycle(nextCycle);
  }

  if (typeof nextCycle === "function") {
    nextCycle(cycleResult);
  }
}

function __unMountCycle(context) {
  return () => {
    if (!context.isMemo) {
      for (const k of Object.keys(_event.EVENT_NAME)) {
        (0, _event.clearEvent)(context, k);
      }

      context.state.splice(0);

      for (const child of context.$children.splice(0)) {
        if ((0, _core.hasHook)(child)) {
          (0, _event.invokeEvent)((0, _core.getHook)(child), _event.EVENT_NAME.unMount);
        }
      }

      (0, _core.removeHook)(context.$self);

      for (const k in context) {
        delete context[k];
      }
    }

    context.isMounted = false;
  };
}

function __onMountCycle(context) {
  return () => {
    const $dom = context.$dom;

    for (const $item of $dom) {
      $item.update(context.props);
    }

    context.isMounted = true;
  };
}

function invokeReducer(reducer, state = {}, param = {}) {
  return reducer(state, param);
}

function combineReducers(reducerObject) {
  const entryKeys = Object.keys(reducerObject);
  return () => {
    const temp = Object.create(null);

    for (let index = 0; index < entryKeys.length; index++) {
      const key = entryKeys[index];
      temp[key] = invokeReducer(reducerObject[key]);
    }

    return temp;
  };
} // hooks


function useState(context, initValue, _lazySetter) {
  const state = __stateEffect(context, initValue, _lazySetter); // const __dispatch = state[1];
  // __dispatch(initValue);


  return state;
}

function useLayoutState(context, initValue, _lazySetter) {
  const state = __stateEffect(context, initValue, _lazySetter, layoutTask);

  const __dispatch = state[1];

  __dispatch(initValue);

  return state;
}

function useEffect(context, onCycle, depArray = []) {
  if (!Array.isArray(depArray)) {
    throw new _core.HookError("dep is must Array or null");
  }

  const deps = depArray.filter(dep => dep instanceof _core.Context);

  const event = context => {
    const isChange = context.isMounted ? // 비교필요
    !depArray.every((el, nth) => el.value === deps[nth]) : true;

    if (isChange) {
      __cycleEffects(onCycle, unMount => {
        typeof unMount === "function" && (0, _event.boundEvent)(context, _event.EVENT_NAME.unMount, unMount);
      });
    }
  };

  (0, _event.boundEvent)(context, _event.EVENT_NAME.mount, event);
}

function useContext(value) {
  return _core.Context.convert(value);
}

function useReducer(context, reducer, initState, init) {
  const baseState = typeof init === "function" ? init(initState) : initState;

  const contextedState = __stateEffect(context, baseState);

  const [currentState, __dispatch] = contextedState;

  const dispatcher = param => {
    const result = invokeReducer(reducer, currentState, param);

    __dispatch(result);
  };

  return new _core.StateObject(() => currentState, dispatcher);
} // export function useMemo(context, onCycle, deps) {}
//gc에 대해서 해결할 필요가이씀


class ChannelStruct extends Array {
  constructor(context, initValue) {
    super();
    this.ownedContext = context;
    this.state = useState(context, initValue);
  }

}

function useChannel(context, channel, initValue = null, onObserve) {
  let channelObj = null;

  if (!__channelMap.has(channel)) {
    const channelObj = new ChannelStruct(context, initValue);
    useEffect(context, () => {
      const [state] = channelObj.state;

      for (let index = 0; index < channelObj.length; index++) {
        const handler = channelObj[index];
        handler(state.value);
      }

      return () => {};
    }, [channelObj.state[0]]);

    __channelMap.set(channel, channelObj);
  }

  channelObj = __channelMap.get(channel);

  if (typeof onObserve === "function") {
    channelObj.push(onObserve);
  } // state는 특정 context에 종속되어 만들때 사용된 context가 아니면 사용및 effect를 발생시키지 못한다
  // 아이러니한건 이 동작이 마치 UB마냥 행해질것같은대 이거에 대한 생각을 해봐야함


  return channelObj.state;
} //generic dom util


function reactiveMount(context, refName, componentTree) {
  if (context.$self === null) {
    throw new _core.LayoutGenError("current context is not mounted dom");
  }

  const refs = context.$self.collect();
  const reactiveSymbol = Symbol.for(`@@reactiveMountedTag`);
  refName = refName.toLowerCase();

  if (!(refName in refs)) {
    throw new _core.LayoutGenError(`Ref "${refName}" must contains component`);
  }

  if (!Array.isArray(componentTree)) {
    throw new _core.LayoutGenError(`ComponentTree is must Array`);
  }

  const refTag = refs[refName];

  if (!Array.isArray(refTag[reactiveSymbol])) {
    Object.defineProperty(refTag, reactiveSymbol, {
      writable: false,
      enumerable: false,
      configurable: false,
      value: []
    });
  }

  const renderedItems = refTag[reactiveSymbol];

  try {
    const unMountedRef = renderedItems.splice(0, renderedItems.length, ...(0, _dom.__forceGenerateTags)(refTag, refTag[reactiveSymbol], componentTree));
  } catch (e) {
    if (e instanceof _core.LayoutGenError) {
      throw new _core.LayoutGenError(`[ReactiveMount] ${e.message}`);
    }
  }
} //hook utils


function memo(component, memorizedSymbol = Symbol.for("@@Memo")) {
  if (typeof component !== "function") {
    throw new Error(`memorized component should be function`);
  } // TODO: use Map


  if (typeof component[memorizedSymbol] !== "object") {
    component[memorizedSymbol] = new Map();
  }

  return (...arg) => {
    const memo = component[memorizedSymbol]; // 재대로된 serialize방식을 가질것

    const key = JSON.stringify(arg);

    if (memo.has(key)) {
      return memo.get(key);
    } else {
      const value = component(...arg);

      if ((0, _core.hasHook)(value)) {
        (0, _core.getHook)(value).isMemo = true;
      }

      memo.set(key, value);
      return value;
    }
  };
}

class LazyComponent {
  constructor(load, loadingComponent) {
    load.then(LoadedComponent => {
      const $parent = this.current.parentNode;
      const isHook = (0, _core.hasHook)(this.current);
      const hook = isHook ? (0, _core.getHook)(this.current) : null;
      let current = isHook ? __moveHook(hook, LoadedComponent) : LoadedComponent(...this.props);
      $parent.insertBefore(current, this.current);
      this.current.remove();
      this.current = current;
    });

    if (typeof loadingComponent !== "function") {
      throw new _core.LayoutGenError("loading component must function");
    }

    this.loading = (...args) => {
      this.props = args;
      return this.current = loadingComponent(...args);
    };
  }

}

exports.LazyComponent = LazyComponent;

function __defaultLazy() {
  //TODO: generate component
  return (0, _index.h)`<div style="display:none;"></div>`;
}

function lazy(load, loading = __defaultLazy) {
  return new LazyComponent(Promise.resolve(load()), loading);
} //bound hooks


function bindHook(props = {}, children) {
  const hookContext = {
    state: [],
    props,
    children,
    isMemo: false,
    isMounted: false,
    $dom: [],
    $children: [],
    $self: null,
    $slot: null,
    events: {
      [_event.EVENT_NAME.mount]: [],
      [_event.EVENT_NAME.unMount]: [],
      [_event.SYSTEM_EVENT_NAME.$mount]: [],
      [_event.SYSTEM_EVENT_NAME.$unMount]: [],
      [_event.EVENT_NAME.watch]: []
    },

    useState(value) {
      return useState(hookContext, value);
    },

    useEffect(...arg) {
      return useEffect(hookContext, ...arg);
    },

    useReducer(...arg) {
      return useReducer(hookContext, ...arg);
    },

    useHook(fn) {
      return Object.assign(hookContext, fn(hookContext));
    },

    useChannel(channel, initValue, onObserve) {
      return useChannel(hookContext, channel, initValue, onObserve);
    },

    reactiveMount(refName, componentTree) {
      return reactiveMount(hookContext, refName, componentTree);
    }

  };
  const events = hookContext.events;

  events[_event.SYSTEM_EVENT_NAME.$mount].push(__onMountCycle(hookContext));

  events[_event.SYSTEM_EVENT_NAME.$unMount].push(__unMountCycle(hookContext));

  return Object.assign(hookContext, (0, _core.bindGlobalHook)(hookContext));
}

function __compileComponent(component, tagProps, hookContext, children) {
  const current = component(tagProps, hookContext);
  const needChild = Array.isArray(children);

  if (!(current instanceof Node)) {
    throw new _core.HookError("render function is must node");
  }

  if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    hookContext.$dom = Array.from(current.childNodes);

    if (needChild && children.length > 0) {
      throw new _core.HookError("fragment-child is not support");
    }
  } else {
    hookContext.$dom = [current];

    if (needChild) {
      let slot = current.collect().children;

      switch (typeof slot === "object" && "nodeType" in slot ? slot.nodeType : -Infinity) {
        case Node.TEXT_NODE:
          let parent = slot.parentElement;
          slot.remove();
          slot = parent;

          if (slot.hasChildNodes()) {
            throw new _core.LayoutGenError("fragemnt-layout-generate is yet supported");
          }

          break;

        case Node.ELEMENT_NODE:
          break;

        default:
          slot = current;
          break;
      }

      hookContext.$slot = slot;
      hookContext.$children = (0, _dom.__generateChildren)(slot, children);
    }
  }

  return current;
}

function __moveHook(oldHook, component) {
  const generated = (0, _dom.__bindDom)({ ...oldHook.props
  }, c(component, oldHook.props, oldHook.children)());
  return generated;
}

const c = (component, props = {}, children) => {
  const hoc = item => {
    const tagProps = { ...props
    };
    const hookContext = bindHook(tagProps, children);

    const current = __compileComponent(component instanceof LazyComponent ? component.loading : component, tagProps, hookContext, children);

    (0, _core.setHook)(current, hookContext);
    return current;
  };

  return hoc;
};

exports.c = c;
},{"./dom.js":"../node_modules/rolled/src/hook/dom.js","./core.js":"../node_modules/rolled/src/hook/core.js","../index.js":"../node_modules/rolled/src/index.js","./taskQueue.js":"../node_modules/rolled/src/hook/taskQueue.js","./event.js":"../node_modules/rolled/src/hook/event.js"}],"../node_modules/rolled/src/hook/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shadow = exports.render = void 0;

var _dom = require("./dom.js");

var _reuseNodes = require("../base/reuseNodes.js");

var _basic = require("./basic.js");

var _index = require("../index.js");

//JUST global render do not duplicated renderer
const __renderObserver = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    const {
      removedNodes
    } = mutation;

    if (removedNodes.length > 0) {
      for (const node of removedNodes) {
        if ((0, _basic.hasHook)(node)) {
          (0, _basic.invokeEvent)((0, _basic.getHook)(node), "unMount");
        }

        delete node.update; // TODO : unMount ref logic from './index.js'
      }
    }
  }
});

const config = {
  childList: true,
  subtree: true
};

const bindDomMutation = parent => {
  __renderObserver.observe(parent, config);

  return parent;
};

const render = (parent, component) => {
  let renderedItems = [];
  bindDomMutation(parent);

  parent.update = function (data) {
    (0, _reuseNodes.reuseNodes)(parent, renderedItems, data, item => (0, _dom.__generateComponent)(item, component), (node, item) => node.update(item));
    renderedItems = data.slice();
  };

  parent.update([{}]);
  return parent;
};

exports.render = render;
const rootTag = "div";

const shadow = (strings, ...args) => {
  //1.tree를 iterate돌릴때 parent 가 붙지않는다
  //  그리되니까 ref가 iterate가 안돔
  //  결국 root는 ref를 못가져옴
  //
  //2.그러면 fragment로함
  //  그럴때 root는 자동생성되서 업데이트 할수없음
  //  root와 child-zone이 따로하게됨
  //      이부분의 사이드이팩트는 예상안감
  //  대신 fragment로 root없이 태그를 부착가능
  const result = (0, _index.fragment)(strings, ...args);
  const root = document.createElement(rootTag);
  const shadow = root.attachShadow({
    mode: "open"
  });
  bindDomMutation(shadow);
  shadow.appendChild(result);

  root.collect = ($dom = result) => result.collect.call(null, shadow);

  return root;
};

exports.shadow = shadow;
},{"./dom.js":"../node_modules/rolled/src/hook/dom.js","../base/reuseNodes.js":"../node_modules/rolled/src/base/reuseNodes.js","./basic.js":"../node_modules/rolled/src/hook/basic.js","../index.js":"../node_modules/rolled/src/index.js"}],"../node_modules/rolled/src/base/keyed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyed = keyed;
exports.default = void 0;

var _utils = require("../utils.js");

// This is almost straightforward implementation of reconcillation algorithm
// based on ivi documentation:
// https://github.com/localvoid/ivi/blob/2c81ead934b9128e092cc2a5ef2d3cabc73cb5dd/packages/ivi/src/vdom/implementation.ts#L1366
// With some fast paths from Surplus implementation:
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L86
//
// How this implementation differs from others, is that it's working with data directly,
// without maintaining nodes arrays, and uses dom props firstChild/lastChild/nextSibling
// for markers moving.
function keyed(key, parent, renderedValues, data, createFn, noOp = _utils.noOpUpdate, beforeNode, afterNode) {
  // Fast path for clear
  if (data.length === 0) {
    if (beforeNode !== undefined || afterNode !== undefined) {
      let node = beforeNode !== undefined ? beforeNode.nextSibling : parent.firstChild,
          tmp;
      if (afterNode === undefined) afterNode = null;

      while (node !== afterNode) {
        tmp = node.nextSibling;
        parent.removeChild(node);
        node = tmp;
      }
    } else {
      parent.textContent = "";
    }

    return;
  } // Fast path for create


  if (renderedValues.length === 0) {
    let node,
        mode = afterNode !== undefined ? 1 : 0;

    for (let i = 0, len = data.length; i < len; i++) {
      node = createFn(data[i], i);
      mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
    }

    return;
  }

  let prevStart = 0,
      newStart = 0,
      loop = true,
      prevEnd = renderedValues.length - 1,
      newEnd = data.length - 1,
      a,
      b,
      prevStartNode = beforeNode ? beforeNode.nextSibling : parent.firstChild,
      newStartNode = prevStartNode,
      prevEndNode = afterNode ? afterNode.previousSibling : parent.lastChild;

  fixes: while (loop) {
    loop = false;

    let _node; // Skip prefix


    a = renderedValues[prevStart], b = data[newStart];

    while (a[key] === b[key]) {
      noOp(prevStartNode, b);
      prevStart++;
      newStart++;
      newStartNode = prevStartNode = prevStartNode.nextSibling;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevStart];
      b = data[newStart];
    } // Skip suffix


    a = renderedValues[prevEnd], b = data[newEnd];

    while (a[key] === b[key]) {
      noOp(prevEndNode, b);
      prevEnd--;
      newEnd--;
      afterNode = prevEndNode;
      prevEndNode = prevEndNode.previousSibling;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevEnd];
      b = data[newEnd];
    } // Fast path to swap backward


    a = renderedValues[prevEnd], b = data[newStart];

    while (a[key] === b[key]) {
      loop = true;
      noOp(prevEndNode, b);
      _node = prevEndNode.previousSibling;
      parent.insertBefore(prevEndNode, newStartNode);
      prevEndNode = _node;
      newStart++;
      prevEnd--;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevEnd];
      b = data[newStart];
    } // Fast path to swap forward


    a = renderedValues[prevStart], b = data[newEnd];

    while (a[key] === b[key]) {
      loop = true;
      noOp(prevStartNode, b);
      _node = prevStartNode.nextSibling;
      parent.insertBefore(prevStartNode, afterNode);
      prevStart++;
      afterNode = prevStartNode;
      prevStartNode = _node;
      newEnd--;
      if (prevEnd < prevStart || newEnd < newStart) break fixes;
      a = renderedValues[prevStart];
      b = data[newEnd];
    }
  } // Fast path for shrink


  if (newEnd < newStart) {
    if (prevStart <= prevEnd) {
      let next;

      while (prevStart <= prevEnd) {
        if (prevEnd === 0) {
          parent.removeChild(prevEndNode);
        } else {
          next = prevEndNode.previousSibling;
          parent.removeChild(prevEndNode);
          prevEndNode = next;
        }

        prevEnd--;
      }
    }

    return;
  } // Fast path for add


  if (prevEnd < prevStart) {
    if (newStart <= newEnd) {
      let node,
          mode = afterNode ? 1 : 0;

      while (newStart <= newEnd) {
        node = createFn(data[newStart], newStart);
        mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
        newStart++;
      }
    }

    return;
  } // Positions for reusing nodes from current DOM state


  const P = new Array(newEnd + 1 - newStart);

  for (let i = newStart; i <= newEnd; i++) P[i] = -1; // Index to resolve position from current to new


  const I = new Map();

  for (let i = newStart; i <= newEnd; i++) I.set(data[i][key], i);

  let reusingNodes = newStart + data.length - 1 - newEnd,
      toRemove = [];

  for (let i = prevStart; i <= prevEnd; i++) {
    if (I.has(renderedValues[i][key])) {
      P[I.get(renderedValues[i][key])] = i;
      reusingNodes++;
    } else {
      toRemove.push(i);
    }
  } // Fast path for full replace


  if (reusingNodes === 0) {
    if (beforeNode !== undefined || afterNode !== undefined) {
      let node = beforeNode !== undefined ? beforeNode.nextSibling : parent.firstChild,
          tmp;
      if (afterNode === undefined) afterNode = null;

      while (node !== afterNode) {
        tmp = node.nextSibling;
        parent.removeChild(node);
        node = tmp;
        prevStart++;
      }
    } else {
      parent.textContent = "";
    }

    let node,
        mode = afterNode ? 1 : 0;

    for (let i = newStart; i <= newEnd; i++) {
      node = createFn(data[i], i);
      mode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
    }

    return;
  } // What else?


  const longestSeq = (0, _utils.longestPositiveIncreasingSubsequence)(P, newStart); // Collect nodes to work with them

  const nodes = [];
  let tmpC = prevStartNode;

  for (let i = prevStart; i <= prevEnd; i++) {
    nodes[i] = tmpC;
    tmpC = tmpC.nextSibling;
  }

  for (let i = 0; i < toRemove.length; i++) parent.removeChild(nodes[toRemove[i]]);

  let lisIdx = longestSeq.length - 1,
      tmpD;

  for (let i = newEnd; i >= newStart; i--) {
    if (longestSeq[lisIdx] === i) {
      afterNode = nodes[P[longestSeq[lisIdx]]];
      noOp(afterNode, data[i]);
      lisIdx--;
    } else {
      if (P[i] === -1) {
        tmpD = createFn(data[i], i);
      } else {
        tmpD = nodes[P[i]];
        noOp(tmpD, data[i]);
      }

      parent.insertBefore(tmpD, afterNode);
      afterNode = tmpD;
    }
  }
}

var _default = keyed;
exports.default = _default;
},{"../utils.js":"../node_modules/rolled/src/utils.js"}],"../node_modules/rolled/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.reuseNodes = exports.reconcile = exports.keyed = exports.renderer = exports.hook = exports.dom = exports.styles = exports.syntheticEvents = void 0;

var _syntheticEvents = _interopRequireWildcard(require("./src/syntheticEvents.js"));

var _styles = _interopRequireWildcard(require("./src/styles.js"));

var _dom = _interopRequireWildcard(require("./src/index.js"));

var _hook = _interopRequireWildcard(require("./src/hook/basic.js"));

var _renderer = _interopRequireWildcard(require("./src/hook/index.js"));

var _keyed = _interopRequireWildcard(require("./src/base/keyed.js"));

var _reconcile = _interopRequireWildcard(require("./src/base/reconcile.js"));

var _reuseNodes = _interopRequireWildcard(require("./src/base/reuseNodes.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const syntheticEvents = _syntheticEvents;
exports.syntheticEvents = syntheticEvents;
const styles = _styles;
exports.styles = styles;
const dom = _dom;
exports.dom = dom;
const hook = _hook;
exports.hook = hook;
const renderer = _renderer;
exports.renderer = renderer;
const keyed = _keyed;
exports.keyed = keyed;
const reconcile = _reconcile;
exports.reconcile = reconcile;
const reuseNodes = _reuseNodes;
exports.reuseNodes = reuseNodes;
var _default = {
  syntheticEvents,
  styles,
  dom,
  hook,
  renderer,
  keyed,
  reconcile,
  reuseNodes
};
exports.default = _default;
},{"./src/syntheticEvents.js":"../node_modules/rolled/src/syntheticEvents.js","./src/styles.js":"../node_modules/rolled/src/styles.js","./src/index.js":"../node_modules/rolled/src/index.js","./src/hook/basic.js":"../node_modules/rolled/src/hook/basic.js","./src/hook/index.js":"../node_modules/rolled/src/hook/index.js","./src/base/keyed.js":"../node_modules/rolled/src/base/keyed.js","./src/base/reconcile.js":"../node_modules/rolled/src/base/reconcile.js","./src/base/reuseNodes.js":"../node_modules/rolled/src/base/reuseNodes.js"}],"src/Assets/Img/Character/Tank.svg":[function(require,module,exports) {
module.exports = "/Tank.88939132.svg";
},{}],"src/Assets/Img/Tile/Sand.svg":[function(require,module,exports) {
module.exports = "/Sand.ca959d4d.svg";
},{}],"src/Assets/Img/Tile/River.svg":[function(require,module,exports) {
module.exports = "/River.3ea87912.svg";
},{}],"src/Assets/Img/Tile/Mountain.svg":[function(require,module,exports) {
module.exports = "/Mountain.4ec0d1f2.svg";
},{}],"src/Component/Assets.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tiles = exports.Characters = void 0;

var _Tank = _interopRequireDefault(require("../Assets/Img/Character/Tank.svg"));

var _Sand = _interopRequireDefault(require("../Assets/Img/Tile/Sand.svg"));

var _River = _interopRequireDefault(require("../Assets/Img/Tile/River.svg"));

var _Mountain = _interopRequireDefault(require("../Assets/Img/Tile/Mountain.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
var Characters = {
  Tank: _Tank.default
};
exports.Characters = Characters;
var Tiles = {
  Sand: _Sand.default,
  River: _River.default,
  Mountain: _Mountain.default
};
exports.Tiles = Tiles;
},{"../Assets/Img/Character/Tank.svg":"src/Assets/Img/Character/Tank.svg","../Assets/Img/Tile/Sand.svg":"src/Assets/Img/Tile/Sand.svg","../Assets/Img/Tile/River.svg":"src/Assets/Img/Tile/River.svg","../Assets/Img/Tile/Mountain.svg":"src/Assets/Img/Tile/Mountain.svg"}],"src/Hooks/Base/Mount.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.mount = exports.childMount = void 0;

var _rolled = require("rolled");

var _basic = require("rolled/src/hook/basic");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var c = _rolled.hook.c;

var _childMount = function childMount(context, refName, Component) {
  var channelName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : refName;
  var initValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var state = (0, _basic.useChannel)(context, channelName, initValue, function () {});

  var _state = _slicedToArray(state, 2),
      items = _state[0],
      setItems = _state[1];

  (0, _basic.useEffect)(context, function () {
    (0, _basic.reactiveMount)(context, refName, items.value.map(function (item, nth) {
      return c(function (props, ownedContext) {
        ownedContext.useHook(function () {
          return {
            update: function update(item) {
              var cloned = _toConsumableArray(items.value);

              cloned.splice(nth, 1, item);
              setItems(cloned);
            },
            remove: function remove() {
              var cloned = _toConsumableArray(items.value);

              cloned.splice(nth, 1);
              setItems(cloned);
            },
            ownedChannelName: channelName
          };
        });
        return Component(props, ownedContext);
      }, _objectSpread({}, item), null);
    }));
  }, [items]);
  return state;
};

exports.childMount = _childMount;

var mount = function mount(context) {
  return {
    childMount: function childMount(refName, Component) {
      var channelName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : refName;
      return _childMount(context, refName, Component, channelName);
    }
  };
};

exports.mount = mount;
var _default = mount;
exports.default = _default;
},{"rolled":"../node_modules/rolled/index.js","rolled/src/hook/basic":"../node_modules/rolled/src/hook/basic.js"}],"src/Hooks/Base/UseEventListener.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.mount = exports.useEventListeners = exports.useEventListener = void 0;

var _rolled = require("rolled");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var c = _rolled.hook.c;

var _useEventListener = function useEventListener(context, domRef, eventName, handler) {
  context.useEffect(function () {
    if (!(domRef instanceof HTMLElement)) {
      throw new Error("domRef is must HTMLElement");
    }

    domRef.addEventListener(eventName, handler);
    return function () {
      domRef.removeEventListener(eventName, handler);
    };
  }, []);
};

exports.useEventListener = _useEventListener;

var useEventListeners = function useEventListeners(context, refSet) {
  context.useEffect(function () {
    var _iterator = _createForOfIteratorHelper(refSet),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 3),
            ref = _step$value[0],
            eventName = _step$value[1],
            handler = _step$value[2];

        if (!(ref instanceof HTMLElement)) {
          throw new Error("domRef is must HTMLElement");
        }

        ref.addEventListener(eventName, handler);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return function () {
      var _iterator2 = _createForOfIteratorHelper(refSet),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 3),
              ref = _step2$value[0],
              eventName = _step2$value[1],
              handler = _step2$value[2];

          ref.removeEventListener(eventName, handler);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
  }, []);
};

exports.useEventListeners = useEventListeners;

var mount = function mount(context) {
  return {
    useEventListener: function useEventListener(refName, Component) {
      var channelName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : refName;
      return _useEventListener(context, refName, Component, channelName);
    }
  };
};

exports.mount = mount;
var _default = mount;
exports.default = _default;
},{"rolled":"../node_modules/rolled/index.js"}],"src/Hooks/Base/UseDragDrop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDrop = exports.useDrag = void 0;

var _rolled = require("rolled");

var _UseEventListener = require("./UseEventListener.js");

var _basic = require("rolled/src/hook/basic");

var draggedContext = null;
var onDragComplete = null;
/**
 * @template T
 * @param {import("rolled/src/hook/basic").HookContext<T>} context
 * @param {import("rolled/src").hElement} $ref
 * @param {() => string} sendData
 * @param {(context: import("rolled/src/hook/basic").HookContext<T>) => void} onComplete
 */

var useDrag = function useDrag(context, $ref, sendData, onComplete) {
  (0, _UseEventListener.useEventListeners)(context, [[$ref, "dragstart", function (e) {
    e.dataTransfer.setData("text/plain", sendData());
  }], [$ref, "dragover", function (e) {
    draggedContext = context;
    onDragComplete = onComplete;
  }]]);
};

exports.useDrag = useDrag;

var useDrop = function useDrop(context, $ref, onDrop, beforeTarget) {
  (0, _UseEventListener.useEventListeners)(context, [[$ref, "drop", function (e) {
    var data = e.dataTransfer.getData("text/plain");

    if (data.length > 0) {
      onDrop(data);
      onDragComplete(draggedContext);
      draggedContext = null;
      onDragComplete = null;
    }
  }], [$ref, "dragover", function (e) {
    if (beforeTarget()) {
      e.preventDefault();
    }
  }]]);
};

exports.useDrop = useDrop;
},{"rolled":"../node_modules/rolled/index.js","./UseEventListener.js":"src/Hooks/Base/UseEventListener.js","rolled/src/hook/basic":"../node_modules/rolled/src/hook/basic.js"}],"src/Component/Base/ImageFactory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ImageTemplate = exports.ImageFactory = void 0;

var _src = require("rolled/src");

var Groups = _interopRequireWildcard(require("../Assets.js"));

var _basic = require("rolled/src/hook/basic");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getImage = function getImage(name, group) {
  var Collections = Groups[group];

  if (_typeof(Collections) !== "object") {
    throw new Error("Collections is not object");
  }

  if (!(name in Collections)) {
    throw new Error("".concat(name, " is not included Collection"));
  }

  return Collections[name];
};
/**
 * @typedef {{name: string, group: keyof Groups| string, extra: string}} FactoryTemplate
 * @param {FactoryTemplate} props
 * @param {Context<FactoryTemplate>} context
 */


var ImageFactory = function ImageFactory(props, context) {
  var $dom = (0, _src.h)(_templateObject(), ImageTemplate(props.name, props.group, props.extra));
  props["path"] = getImage(props.name, props.group);
  return $dom;
};
/**
 *
 * @param {string} name
 * @param {string} group
 * @param {string} extra
 */


exports.ImageFactory = ImageFactory;

var ImageTemplate = function ImageTemplate(name, group, extra) {
  return "<img src=\"".concat(getImage(name, group), "\" ").concat(extra, "/>");
};

exports.ImageTemplate = ImageTemplate;
var _default = ImageFactory;
exports.default = _default;
},{"rolled/src":"../node_modules/rolled/src/index.js","../Assets.js":"src/Component/Assets.js","rolled/src/hook/basic":"../node_modules/rolled/src/hook/basic.js"}],"src/Component/Character/Factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CharacterTemplate = exports.CharacterFactory = void 0;

var _src = require("rolled/src");

var _Assets = require("../Assets.js");

var _UseDragDrop = require("../../Hooks/Base/UseDragDrop.js");

var _ImageFactory = require("../Base/ImageFactory.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CharacterFactory = function CharacterFactory(props, context) {
  var $dom = (0, _ImageFactory.ImageFactory)(_objectSpread({}, props, {
    group: "Characters",
    extra: "draggable"
  }), context);
  (0, _UseDragDrop.useDrag)(context, $dom, function () {
    return props.name;
  }, function (context) {
    // @ts-ignore
    context.remove();
  });
  return $dom;
};

exports.CharacterFactory = CharacterFactory;

var CharacterTemplate = function CharacterTemplate(name) {
  return (0, _ImageFactory.ImageTemplate)(name, "Characters", "draggable");
};

exports.CharacterTemplate = CharacterTemplate;
var _default = CharacterFactory;
exports.default = _default;
},{"rolled/src":"../node_modules/rolled/src/index.js","../Assets.js":"src/Component/Assets.js","../../Hooks/Base/UseDragDrop.js":"src/Hooks/Base/UseDragDrop.js","../Base/ImageFactory.js":"src/Component/Base/ImageFactory.js"}],"src/Component/Map/Base/Tile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Tile = void 0;

var _rolled = require("rolled");

var _Assets = require("../../Assets.js");

var _Mount = require("../../../Hooks/Base/Mount.js");

var _Factory = require("../../Character/Factory.js");

var _UseDragDrop = require("../../../Hooks/Base/UseDragDrop.js");

var _ImageFactory = require("../../Base/ImageFactory.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div class=\"hex #classref\">\n            <div class=\"hex-item\" #tile>\n            </div>\n            ", "\n        </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getHook = _rolled.hook.getHook;
var setupSyntheticEvent = _rolled.syntheticEvents.setupSyntheticEvent,
    addEventListener = _rolled.syntheticEvents.addEventListener;
var fragment = _rolled.dom.fragment,
    h = _rolled.dom.h; // setupSyntheticEvent("drop");
// setupSyntheticEvent("dragover");

var Tile = function Tile(_ref, context) {
  var disabled = _ref.disabled,
      type = _ref.type,
      nth = _ref.nth,
      biome = _ref.biome;
  var tileClass = disabled ? "disabled" : type === "player" ? "player" : "victim";
  var $dom = h(_templateObject(), typeof biome === "string" && type ? (0, _ImageFactory.ImageTemplate)(biome, "Tiles", "class=\"hex-biome\"") : "");

  var _$dom$collect = $dom.collect(),
      tile = _$dom$collect.tile,
      classref = _$dom$collect.classref;

  classref.update(tileClass);

  if (!disabled && type === "player") {
    var _childMount = (0, _Mount.childMount)(context, "tile", _Factory.CharacterFactory, "".concat(nth, "/").concat(context.ownedChannelName, "/Character")),
        _childMount2 = _slicedToArray(_childMount, 2),
        state = _childMount2[0],
        setState = _childMount2[1];

    (0, _UseDragDrop.useDrop)(context, tile, function (name) {
      setState([{
        name: name
      }]);
    }, function () {
      return state.value.length === 0;
    });
  }

  return $dom;
};

exports.Tile = Tile;
var _default = Tile;
exports.default = _default;
},{"rolled":"../node_modules/rolled/index.js","../../Assets.js":"src/Component/Assets.js","../../../Hooks/Base/Mount.js":"src/Hooks/Base/Mount.js","../../Character/Factory.js":"src/Component/Character/Factory.js","../../../Hooks/Base/UseDragDrop.js":"src/Hooks/Base/UseDragDrop.js","../../Base/ImageFactory.js":"src/Component/Base/ImageFactory.js"}],"src/Component/Config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHOP_CHANNEL = exports.TILE_QUEUE_CHANNEL = exports.TILE_CHANNEL = exports.CHARACTER_CHANNEL = void 0;
var CHARACTER_CHANNEL = "character";
exports.CHARACTER_CHANNEL = CHARACTER_CHANNEL;
var TILE_CHANNEL = "tile";
exports.TILE_CHANNEL = TILE_CHANNEL;
var TILE_QUEUE_CHANNEL = "tile/queue";
exports.TILE_QUEUE_CHANNEL = TILE_QUEUE_CHANNEL;
var SHOP_CHANNEL = "shop";
exports.SHOP_CHANNEL = SHOP_CHANNEL;
},{}],"../node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"src/Component/Map/Generator/Config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MAP = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MAPInfo = {
  width: 16,
  height: 11,
  middleHeight: 0,
  middleStartHeight: 0,
  middleEndHeight: 0,
  bottomStartHeight: 0,
  bottomEndHeight: 0,
  victimRectStart: 0,
  victimRectEnd: 0,
  playerRectStart: 0,
  playerRectEnd: 0
};
MAPInfo.middleHeight = Math.ceil(MAPInfo.height / 2);
MAPInfo.middleStartHeight = MAPInfo.width * (MAPInfo.middleHeight - 1) - 1;
MAPInfo.middleEndHeight = MAPInfo.width * MAPInfo.middleHeight;
MAPInfo.bottomStartHeight = MAPInfo.width * (MAPInfo.height - 1) - 1;
MAPInfo.bottomEndHeight = MAPInfo.width * MAPInfo.height;
MAPInfo.playerRectStart = MAPInfo.middleEndHeight;
MAPInfo.playerRectEnd = MAPInfo.bottomStartHeight;
MAPInfo.victimRectStart = MAPInfo.width;
MAPInfo.victimRectEnd = MAPInfo.middleStartHeight;

var MAP = _objectSpread({}, MAPInfo);

exports.MAP = MAP;
var _default = {
  MAP: MAP
};
exports.default = _default;
},{}],"src/Component/Map/Generator/Mark.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sand = exports.river = exports.mountain = exports.biome = void 0;

var _Assets = require("../../Assets");

var biome = function biome(_biome, x, y) {
  if (!(_biome in _Assets.Tiles)) {
    throw new Error("".concat(_biome, " is not contains Biome Marked Tile"));
  }

  return {
    biome: _biome,
    x: x,
    y: y
  };
};

exports.biome = biome;

var mountain = function mountain(x, y) {
  return biome("Mountain", x, y);
};

exports.mountain = mountain;

var river = function river(x, y) {
  return biome("River", x, y);
};

exports.river = river;

var sand = function sand(x, y) {
  return biome("Sand", x, y);
};

exports.sand = sand;
},{"../../Assets":"src/Component/Assets.js"}],"src/Component/Map/Generator/Template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mountain = exports.river = void 0;

var _Mark = require("./Mark.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var river = function river(x, y) {
  return [(0, _Mark.river)(x, y), (0, _Mark.river)(x, y + 1), (0, _Mark.river)(x, y + 2), (0, _Mark.river)(x, y + 3)];
};

exports.river = river;

var mountain = function mountain(x, y) {
  return [(0, _Mark.mountain)(x, y), (0, _Mark.mountain)(x + 1, y), (0, _Mark.mountain)(x, y + 1), (0, _Mark.mountain)(x + 1, y + 1)].concat(_toConsumableArray(river(x, y + 2)));
};

exports.mountain = mountain;
},{"./Mark.js":"src/Component/Map/Generator/Mark.js"}],"src/Component/Map/Generator/Biome.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyBiome = applyBiome;
exports.Worlds = void 0;

var _Template = require("./Template.js");

var _Mark = require("./Mark.js");

var _Config = require("./Config.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function TemplateReducer(accr, _ref) {
  var x = _ref.x,
      y = _ref.y,
      biome = _ref.biome;

  if (!(y in accr)) {
    accr[y] = {};
  }

  accr[y][x] = biome;
  return accr;
}

function createTemplate(defaultTile) {
  for (var _len = arguments.length, map = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    map[_key - 1] = arguments[_key];
  }

  return {
    tile: defaultTile,
    biome: map.reduce(TemplateReducer, {})
  };
}

var Worlds = [createTemplate.apply(void 0, [_Mark.sand].concat(_toConsumableArray((0, _Template.mountain)(5, 0)))), createTemplate.apply(void 0, [_Mark.sand].concat(_toConsumableArray((0, _Template.river)(0, 0))))];
exports.Worlds = Worlds;

function applyBiome(mapData) {
  var map = _toConsumableArray(mapData);

  var _Worlds$Math$floor = Worlds[Math.floor(Math.random() * Worlds.length)],
      tile = _Worlds$Math$floor.tile,
      biome = _Worlds$Math$floor.biome;

  for (var index = 0; index < map.length; index++) {
    var item = map[index];
    var x = index % _Config.MAP.width;
    var y = Math.floor(index / _Config.MAP.width);
    var currentBiome = y in biome && x in biome[y] ? biome[y][x] : tile(x, y).biome;
    Object.assign(item, {
      biome: currentBiome
    });
  }

  console.log(map);
  return map;
}
},{"./Template.js":"src/Component/Map/Generator/Template.js","./Mark.js":"src/Component/Map/Generator/Mark.js","./Config.js":"src/Component/Map/Generator/Config.js"}],"src/Component/Map/Generator/Base.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMap = createMap;
exports.createWorld = createWorld;

var _Config = require("./Config");

var defaultFill = function defaultFill() {
  return Object.create(null);
};

function mapGenerate(v, k) {
  // victim
  var base = {
    nth: k,
    disabled: false
  };

  if (_Config.MAP.playerRectStart <= k && k <= _Config.MAP.playerRectEnd) {
    base.type = "player";
  }

  if (_Config.MAP.victimRectStart <= k && k <= _Config.MAP.victimRectEnd) {
    base.type = "victim";
  }

  if (k < _Config.MAP.width || _Config.MAP.middleStartHeight < k && k < _Config.MAP.middleEndHeight || _Config.MAP.bottomStartHeight < k && k < _Config.MAP.bottomEndHeight) {
    base.disabled = true;
  }

  return base;
}

function createMap(length, fn) {
  return Array.from({
    length: length
  }, typeof fn === "function" ? fn : defaultFill);
}

function createWorld() {
  return createMap(_Config.MAP.width * _Config.MAP.height, mapGenerate);
}
},{"./Config":"src/Component/Map/Generator/Config.js"}],"src/Component/Map/Generator/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMap = generateMap;

var _Config = require("./Config.js");

var _Biome = require("./Biome.js");

var _Base = require("./Base.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function generateMap() {
  var mapData = (0, _Base.createWorld)();
  mapData.splice.apply(mapData, [_Config.MAP.victimRectStart, 0].concat(_toConsumableArray((0, _Biome.applyBiome)(mapData.splice(_Config.MAP.victimRectStart, _Config.MAP.victimRectEnd + 1 - _Config.MAP.victimRectStart)))));
  mapData.splice.apply(mapData, [_Config.MAP.playerRectStart, 0].concat(_toConsumableArray((0, _Biome.applyBiome)(mapData.splice(_Config.MAP.playerRectStart, _Config.MAP.playerRectEnd + 1 - _Config.MAP.playerRectStart)))));
  return mapData;
}
},{"./Config.js":"src/Component/Map/Generator/Config.js","./Biome.js":"src/Component/Map/Generator/Biome.js","./Base.js":"src/Component/Map/Generator/Base.js"}],"src/Component/Map/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Map = void 0;

var _Tile = require("./Base/Tile.js");

var _Mount = require("../../Hooks/Base/Mount.js");

var _Config = require("../Config.js");

var _hook = require("rolled/src/hook");

var _fs = _interopRequireDefault(require("fs"));

var _index = require("./Generator/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <style>\n            ", "\n            .disabled {\n                background-color: #bebebe !important;\n            }\n            .victim {\n                background-color: #5142f5 !important;\n            }\n            .hex {\n                position:relative;\n            }\n            .hex .hex-item {\n                position: absolute;\n                width: 100%;\n                height: 100%;\n                z-index:1;\n            }\n            .hex-item img {\n                width: 100%;\n                height: 100%;\n            }\n            .hex .hex-biome {\n                width:100%;\n                height:100%;\n                z-index:0;\n            }\n            .hex-root {\n                height: auto;\n            }\n        </style>\n        <div class=\"map-layer hex-root\">\n            <div class=\"hex-crop\">\n                <div class=\"hex-container\" #hex-map>\n                </div>\n            </div>\n            <div class=\"hex-crop\">\n                <div class=\"hex-container\" #hex-slot>\n                </div> \n            </div>\n        </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import css from "../../Assets/Css/MapLayout.css";
var css = ".hex-root{height:11.9103030303em;width:20em}.hex-root .hex-crop{position:relative;overflow:visible}.hex-root .hex-container{display:grid;justify-items:auto;align-items:auto;height:11.9103030303em;width:20em;grid-template-columns:repeat(33,1fr);grid-template-rows:repeat(11,.3503030303em .7006060606em) .3503030303em}.hex-root .hex-container .hex{display:none;align-items:center;justify-content:center}.hex-root .hex-container .hex:nth-child(1){grid-row-start:1;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(2){grid-row-start:1;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(3){grid-row-start:1;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(4){grid-row-start:1;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(5){grid-row-start:1;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(6){grid-row-start:1;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(7){grid-row-start:1;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(8){grid-row-start:1;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(9){grid-row-start:1;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(10){grid-row-start:1;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(11){grid-row-start:1;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(12){grid-row-start:1;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(13){grid-row-start:1;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(14){grid-row-start:1;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(15){grid-row-start:1;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(16){grid-row-start:1;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(17){grid-row-start:3;grid-row-end:span 3;grid-column-start:2;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(18){grid-row-start:3;grid-row-end:span 3;grid-column-start:4;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(19){grid-row-start:3;grid-row-end:span 3;grid-column-start:6;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(20){grid-row-start:3;grid-row-end:span 3;grid-column-start:8;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(21){grid-row-start:3;grid-row-end:span 3;grid-column-start:10;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(22){grid-row-start:3;grid-row-end:span 3;grid-column-start:12;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(23){grid-row-start:3;grid-row-end:span 3;grid-column-start:14;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(24){grid-row-start:3;grid-row-end:span 3;grid-column-start:16;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(25){grid-row-start:3;grid-row-end:span 3;grid-column-start:18;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(26){grid-row-start:3;grid-row-end:span 3;grid-column-start:20;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(27){grid-row-start:3;grid-row-end:span 3;grid-column-start:22;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(28){grid-row-start:3;grid-row-end:span 3;grid-column-start:24;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(29){grid-row-start:3;grid-row-end:span 3;grid-column-start:26;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(30){grid-row-start:3;grid-row-end:span 3;grid-column-start:28;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(31){grid-row-start:3;grid-row-end:span 3;grid-column-start:30;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(32){grid-row-start:3;grid-row-end:span 3;grid-column-start:32;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(33){grid-row-start:5;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(34){grid-row-start:5;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(35){grid-row-start:5;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(36){grid-row-start:5;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(37){grid-row-start:5;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(38){grid-row-start:5;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(39){grid-row-start:5;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(40){grid-row-start:5;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(41){grid-row-start:5;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(42){grid-row-start:5;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(43){grid-row-start:5;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(44){grid-row-start:5;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(45){grid-row-start:5;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(46){grid-row-start:5;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(47){grid-row-start:5;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(48){grid-row-start:5;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(49){grid-row-start:7;grid-row-end:span 3;grid-column-start:2;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(50){grid-row-start:7;grid-row-end:span 3;grid-column-start:4;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(51){grid-row-start:7;grid-row-end:span 3;grid-column-start:6;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(52){grid-row-start:7;grid-row-end:span 3;grid-column-start:8;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(53){grid-row-start:7;grid-row-end:span 3;grid-column-start:10;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(54){grid-row-start:7;grid-row-end:span 3;grid-column-start:12;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(55){grid-row-start:7;grid-row-end:span 3;grid-column-start:14;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(56){grid-row-start:7;grid-row-end:span 3;grid-column-start:16;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(57){grid-row-start:7;grid-row-end:span 3;grid-column-start:18;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(58){grid-row-start:7;grid-row-end:span 3;grid-column-start:20;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(59){grid-row-start:7;grid-row-end:span 3;grid-column-start:22;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(60){grid-row-start:7;grid-row-end:span 3;grid-column-start:24;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(61){grid-row-start:7;grid-row-end:span 3;grid-column-start:26;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(62){grid-row-start:7;grid-row-end:span 3;grid-column-start:28;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(63){grid-row-start:7;grid-row-end:span 3;grid-column-start:30;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(64){grid-row-start:7;grid-row-end:span 3;grid-column-start:32;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(65){grid-row-start:9;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(66){grid-row-start:9;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(67){grid-row-start:9;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(68){grid-row-start:9;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(69){grid-row-start:9;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(70){grid-row-start:9;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(71){grid-row-start:9;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(72){grid-row-start:9;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(73){grid-row-start:9;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(74){grid-row-start:9;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(75){grid-row-start:9;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(76){grid-row-start:9;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(77){grid-row-start:9;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(78){grid-row-start:9;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(79){grid-row-start:9;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(80){grid-row-start:9;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(81){grid-row-start:11;grid-row-end:span 3;grid-column-start:2;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(82){grid-row-start:11;grid-row-end:span 3;grid-column-start:4;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(83){grid-row-start:11;grid-row-end:span 3;grid-column-start:6;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(84){grid-row-start:11;grid-row-end:span 3;grid-column-start:8;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(85){grid-row-start:11;grid-row-end:span 3;grid-column-start:10;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(86){grid-row-start:11;grid-row-end:span 3;grid-column-start:12;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(87){grid-row-start:11;grid-row-end:span 3;grid-column-start:14;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(88){grid-row-start:11;grid-row-end:span 3;grid-column-start:16;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(89){grid-row-start:11;grid-row-end:span 3;grid-column-start:18;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(90){grid-row-start:11;grid-row-end:span 3;grid-column-start:20;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(91){grid-row-start:11;grid-row-end:span 3;grid-column-start:22;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(92){grid-row-start:11;grid-row-end:span 3;grid-column-start:24;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(93){grid-row-start:11;grid-row-end:span 3;grid-column-start:26;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(94){grid-row-start:11;grid-row-end:span 3;grid-column-start:28;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(95){grid-row-start:11;grid-row-end:span 3;grid-column-start:30;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(96){grid-row-start:11;grid-row-end:span 3;grid-column-start:32;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(97){grid-row-start:13;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(98){grid-row-start:13;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(99){grid-row-start:13;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(100){grid-row-start:13;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(101){grid-row-start:13;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(102){grid-row-start:13;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(103){grid-row-start:13;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(104){grid-row-start:13;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(105){grid-row-start:13;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(106){grid-row-start:13;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(107){grid-row-start:13;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(108){grid-row-start:13;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(109){grid-row-start:13;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(110){grid-row-start:13;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(111){grid-row-start:13;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(112){grid-row-start:13;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(113){grid-row-start:15;grid-row-end:span 3;grid-column-start:2;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(114){grid-row-start:15;grid-row-end:span 3;grid-column-start:4;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(115){grid-row-start:15;grid-row-end:span 3;grid-column-start:6;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(116){grid-row-start:15;grid-row-end:span 3;grid-column-start:8;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(117){grid-row-start:15;grid-row-end:span 3;grid-column-start:10;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(118){grid-row-start:15;grid-row-end:span 3;grid-column-start:12;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(119){grid-row-start:15;grid-row-end:span 3;grid-column-start:14;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(120){grid-row-start:15;grid-row-end:span 3;grid-column-start:16;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(121){grid-row-start:15;grid-row-end:span 3;grid-column-start:18;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(122){grid-row-start:15;grid-row-end:span 3;grid-column-start:20;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(123){grid-row-start:15;grid-row-end:span 3;grid-column-start:22;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(124){grid-row-start:15;grid-row-end:span 3;grid-column-start:24;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(125){grid-row-start:15;grid-row-end:span 3;grid-column-start:26;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(126){grid-row-start:15;grid-row-end:span 3;grid-column-start:28;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(127){grid-row-start:15;grid-row-end:span 3;grid-column-start:30;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(128){grid-row-start:15;grid-row-end:span 3;grid-column-start:32;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(129){grid-row-start:17;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(130){grid-row-start:17;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(131){grid-row-start:17;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(132){grid-row-start:17;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(133){grid-row-start:17;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(134){grid-row-start:17;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(135){grid-row-start:17;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(136){grid-row-start:17;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(137){grid-row-start:17;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(138){grid-row-start:17;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(139){grid-row-start:17;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(140){grid-row-start:17;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(141){grid-row-start:17;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(142){grid-row-start:17;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(143){grid-row-start:17;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(144){grid-row-start:17;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(145){grid-row-start:19;grid-row-end:span 3;grid-column-start:2;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(146){grid-row-start:19;grid-row-end:span 3;grid-column-start:4;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(147){grid-row-start:19;grid-row-end:span 3;grid-column-start:6;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(148){grid-row-start:19;grid-row-end:span 3;grid-column-start:8;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(149){grid-row-start:19;grid-row-end:span 3;grid-column-start:10;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(150){grid-row-start:19;grid-row-end:span 3;grid-column-start:12;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(151){grid-row-start:19;grid-row-end:span 3;grid-column-start:14;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(152){grid-row-start:19;grid-row-end:span 3;grid-column-start:16;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(153){grid-row-start:19;grid-row-end:span 3;grid-column-start:18;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(154){grid-row-start:19;grid-row-end:span 3;grid-column-start:20;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(155){grid-row-start:19;grid-row-end:span 3;grid-column-start:22;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(156){grid-row-start:19;grid-row-end:span 3;grid-column-start:24;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(157){grid-row-start:19;grid-row-end:span 3;grid-column-start:26;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(158){grid-row-start:19;grid-row-end:span 3;grid-column-start:28;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(159){grid-row-start:19;grid-row-end:span 3;grid-column-start:30;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(160){grid-row-start:19;grid-row-end:span 3;grid-column-start:32;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(161){grid-row-start:21;grid-row-end:span 3;grid-column-start:1;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(162){grid-row-start:21;grid-row-end:span 3;grid-column-start:3;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(163){grid-row-start:21;grid-row-end:span 3;grid-column-start:5;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(164){grid-row-start:21;grid-row-end:span 3;grid-column-start:7;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(165){grid-row-start:21;grid-row-end:span 3;grid-column-start:9;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(166){grid-row-start:21;grid-row-end:span 3;grid-column-start:11;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(167){grid-row-start:21;grid-row-end:span 3;grid-column-start:13;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(168){grid-row-start:21;grid-row-end:span 3;grid-column-start:15;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(169){grid-row-start:21;grid-row-end:span 3;grid-column-start:17;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(170){grid-row-start:21;grid-row-end:span 3;grid-column-start:19;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(171){grid-row-start:21;grid-row-end:span 3;grid-column-start:21;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(172){grid-row-start:21;grid-row-end:span 3;grid-column-start:23;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(173){grid-row-start:21;grid-row-end:span 3;grid-column-start:25;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(174){grid-row-start:21;grid-row-end:span 3;grid-column-start:27;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(175){grid-row-start:21;grid-row-end:span 3;grid-column-start:29;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(176){grid-row-start:21;grid-row-end:span 3;grid-column-start:31;grid-column-end:span 2;display:flex}.hex-root .hex-container .hex:nth-child(1){background-image:url(none)}.hex-root .hex-container .hex{-webkit-clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);background-color:#48a999;background-size:cover;margin:1px}";

var Map = function Map(props, context) {
  var mapData = (0, _index.generateMap)();
  var queueData = Array.from({
    length: 9
  }, function (v, k) {
    return {
      nth: k,
      type: "player",
      disabled: false
    };
  });
  (0, _Mount.childMount)(context, "hex-map", _Tile.Tile, _Config.TILE_CHANNEL, mapData);
  (0, _Mount.childMount)(context, "hex-slot", _Tile.Tile, _Config.TILE_QUEUE_CHANNEL, queueData); //  <link rel="stylesheet" type="text/css" href="${css}">

  return (0, _hook.shadow)(_templateObject(), css);
};

exports.Map = Map;
var _default = Map;
exports.default = _default;
},{"./Base/Tile.js":"src/Component/Map/Base/Tile.js","../../Hooks/Base/Mount.js":"src/Hooks/Base/Mount.js","../Config.js":"src/Component/Config.js","rolled/src/hook":"../node_modules/rolled/src/hook/index.js","fs":"../node_modules/parcel-bundler/src/builtins/_empty.js","./Generator/index.js":"src/Component/Map/Generator/index.js"}],"src/Component/Ui/CharacterGrid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CharacterGrid = void 0;

var _src = require("rolled/src");

var _Factory = require("../Character/Factory.js");

var _UseEventListener = require("../../Hooks/Base/UseEventListener.js");

var _UseDragDrop = require("../../Hooks/Base/UseDragDrop.js");

function _templateObject() {
  var data = _taggedTemplateLiteral(["<div class=\"flex-item character-item\" draggable #root>\n        ", "\n    </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CharacterGrid = function CharacterGrid(_ref, context) {
  var name = _ref.name;
  var characterName = "Tank";
  var shopSlot = "\n        ".concat((0, _Factory.CharacterTemplate)(characterName), "\n        <div class=\"flex-item\">\n            #children\n        </div>\n    ");
  var $dom = (0, _src.h)(_templateObject(), !!name ? shopSlot : "");

  var _$dom$collect = $dom.collect(),
      root = _$dom$collect.root;

  (0, _UseDragDrop.useDrag)(context, root, function () {
    return characterName;
  }, function (context) {
    // @ts-ignore
    context.update({});
  });
  return $dom;
};

exports.CharacterGrid = CharacterGrid;
var _default = CharacterGrid;
exports.default = _default;
},{"rolled/src":"../node_modules/rolled/src/index.js","../Character/Factory.js":"src/Component/Character/Factory.js","../../Hooks/Base/UseEventListener.js":"src/Hooks/Base/UseEventListener.js","../../Hooks/Base/UseDragDrop.js":"src/Hooks/Base/UseDragDrop.js"}],"src/Component/Ui/Shop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Shop = void 0;

var _Config = require("../Config.js");

var _Mount = require("../../Hooks/Base/Mount.js");

var _CharacterGrid = _interopRequireDefault(require("./CharacterGrid.js"));

var _src = require("rolled/src");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div class=\"flex-row shop-ui\" #root>\n        </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sampleMockCharacter = {
  name: "Tank",
  lv: 1
};

var Shop = function Shop(props, context) {
  (0, _Mount.childMount)(context, "root", _CharacterGrid.default, _Config.SHOP_CHANNEL, Array.from({
    length: 5
  }, function (v, k) {
    return _objectSpread({}, sampleMockCharacter, {
      nth: k
    });
  }));
  return (0, _src.h)(_templateObject());
};

exports.Shop = Shop;
var _default = Shop;
exports.default = _default;
},{"../Config.js":"src/Component/Config.js","../../Hooks/Base/Mount.js":"src/Hooks/Base/Mount.js","./CharacterGrid.js":"src/Component/Ui/CharacterGrid.js","rolled/src":"../node_modules/rolled/src/index.js"}],"src/Component/Game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Game = void 0;

var _rolled = require("rolled");

var _index = _interopRequireDefault(require("./Map/index.js"));

var _Shop = _interopRequireDefault(require("./Ui/Shop.js"));

var _basic = require("rolled/src/hook/basic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div>    \n            <style>\n                .flex-row {\n                    display:flex;\n                    flex-direction:row;\n                }\n                .flex-item {\n                    height: 100%;\n                }\n                .shop-ui {\n                    outline: 1px solid  #bebebe;\n                    display:inline-flex;   \n                }\n            </style>\n            <div #root></div>\n        </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fragment = _rolled.dom.fragment,
    h = _rolled.dom.h;

var Game = function Game(props, context) {
  var $dom = h(_templateObject());
  (0, _basic.useEffect)(context, function () {
    (0, _basic.reactiveMount)(context, "root", [(0, _basic.c)(_index.default, {}, null), (0, _basic.c)(_Shop.default, {}, null)]);
  }, []);
  return $dom;
};

exports.Game = Game;
var _default = Game;
exports.default = _default;
},{"rolled":"../node_modules/rolled/index.js","./Map/index.js":"src/Component/Map/index.js","./Ui/Shop.js":"src/Component/Ui/Shop.js","rolled/src/hook/basic":"../node_modules/rolled/src/hook/basic.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _rolled = require("rolled");

var _Game = _interopRequireDefault(require("./Component/Game.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fragment = _rolled.dom.fragment,
    h = _rolled.dom.h;
var render = _rolled.renderer.render;
var c = _rolled.hook.c,
    useGlobalHook = _rolled.hook.useGlobalHook,
    reactiveMount = _rolled.hook.reactiveMount;
render(document.getElementById("app"), c(_Game.default, {}, null));
},{"rolled":"../node_modules/rolled/index.js","./Component/Game.js":"src/Component/Game.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58763" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map