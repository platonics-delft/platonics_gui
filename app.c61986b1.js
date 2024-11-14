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
})({"../node_modules/object-assign/index.js":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};
},{}],"../node_modules/roslib/src/mixin.js":[function(require,module,exports) {
/**
 * Mixin a feature to the core/Ros prototype.
 * For example, mixin(Ros, ['Topic'], {Topic: <Topic>})
 * will add a topic bound to any Ros instances so a user
 * can call `var topic = ros.Topic({name: '/foo'});`
 *
 * @author Graeme Yeates - github.com/megawac
 */
module.exports = function (Ros, classes, features) {
  classes.forEach(function (className) {
    var Class = features[className];
    Ros.prototype[className] = function (options) {
      options.ros = this;
      return new Class(options);
    };
  });
};
},{}],"../node_modules/roslib/src/util/shim/WebSocket.js":[function(require,module,exports) {
module.exports = typeof window !== 'undefined' ? window.WebSocket : WebSocket;
},{}],"../node_modules/webworkify/index.js":[function(require,module,exports) {
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
    var wkey;
    var cacheKeys = Object.keys(cache);

    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        var exp = cache[key].exports;
        // Using babel as a transpiler to use esmodule, the export will always
        // be an object with the default export as a property of it. To ensure
        // the existing api and babel esmodule exports are both supported we
        // check for both
        if (exp === fn || exp && exp.default === fn) {
            wkey = key;
            break;
        }
    }

    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            'function(require,module,exports){' + fn + '(self); }',
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        'function(require,module,exports){' +
            // try to call default if defined to also support babel esmodule exports
            'var f = require(' + stringify(wkey) + ');' +
            '(f.default ? f.default : f)(self);' +
        '}',
        scache
    ];

    var workerSources = {};
    resolveSources(skey);

    function resolveSources(key) {
        workerSources[key] = true;

        for (var depPath in sources[key][1]) {
            var depKey = sources[key][1][depPath];
            if (!workerSources[depKey]) {
                resolveSources(depKey);
            }
        }
    }

    var src = '(' + bundleFn + ')({'
        + Object.keys(workerSources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var blob = new Blob([src], { type: 'text/javascript' });
    if (options && options.bare) { return blob; }
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    worker.objectURL = workerUrl;
    return worker;
};

},{}],"../node_modules/webworkify-webpack/index.js":[function(require,module,exports) {
function webpackBootstrapFunc (modules) {
/******/  // The module cache
/******/  var installedModules = {};

/******/  // The require function
/******/  function __webpack_require__(moduleId) {

/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;

/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };

/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/    // Flag the module as loaded
/******/    module.l = true;

/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }

/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;

/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;

/******/  // identity function for calling harmony imports with the correct context
/******/  __webpack_require__.i = function(value) { return value; };

/******/  // define getter function for harmony exports
/******/  __webpack_require__.d = function(exports, name, getter) {
/******/    if(!__webpack_require__.o(exports, name)) {
/******/      Object.defineProperty(exports, name, {
/******/        configurable: false,
/******/        enumerable: true,
/******/        get: getter
/******/      });
/******/    }
/******/  };

/******/  // define __esModule on exports
/******/  __webpack_require__.r = function(exports) {
/******/    Object.defineProperty(exports, '__esModule', { value: true });
/******/  };

/******/  // getDefaultExport function for compatibility with non-harmony modules
/******/  __webpack_require__.n = function(module) {
/******/    var getter = module && module.__esModule ?
/******/      function getDefault() { return module['default']; } :
/******/      function getModuleExports() { return module; };
/******/    __webpack_require__.d(getter, 'a', getter);
/******/    return getter;
/******/  };

/******/  // Object.prototype.hasOwnProperty.call
/******/  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "/";

/******/  // on error function for async loading
/******/  __webpack_require__.oe = function(err) { console.error(err); throw err; };

  var f = __webpack_require__(__webpack_require__.s = ENTRY_MODULE)
  return f.default || f // try to call default if defined to also support babel esmodule exports
}

var moduleNameReqExp = '[\\.|\\-|\\+|\\w|\/|@]+'
var dependencyRegExp = '\\(\\s*(\/\\*.*?\\*\/)?\\s*.*?(' + moduleNameReqExp + ').*?\\)' // additional chars when output.pathinfo is true

// http://stackoverflow.com/a/2593661/130442
function quoteRegExp (str) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

function isNumeric(n) {
  return !isNaN(1 * n); // 1 * n converts integers, integers as string ("123"), 1e3 and "1e3" to integers and strings to NaN
}

function getModuleDependencies (sources, module, queueName) {
  var retval = {}
  retval[queueName] = []

  var fnString = module.toString()
  var wrapperSignature = fnString.match(/^function\s?\w*\(\w+,\s*\w+,\s*(\w+)\)/)
  if (!wrapperSignature) return retval
  var webpackRequireName = wrapperSignature[1]

  // main bundle deps
  var re = new RegExp('(\\\\n|\\W)' + quoteRegExp(webpackRequireName) + dependencyRegExp, 'g')
  var match
  while ((match = re.exec(fnString))) {
    if (match[3] === 'dll-reference') continue
    retval[queueName].push(match[3])
  }

  // dll deps
  re = new RegExp('\\(' + quoteRegExp(webpackRequireName) + '\\("(dll-reference\\s(' + moduleNameReqExp + '))"\\)\\)' + dependencyRegExp, 'g')
  while ((match = re.exec(fnString))) {
    if (!sources[match[2]]) {
      retval[queueName].push(match[1])
      sources[match[2]] = __webpack_require__(match[1]).m
    }
    retval[match[2]] = retval[match[2]] || []
    retval[match[2]].push(match[4])
  }

  // convert 1e3 back to 1000 - this can be important after uglify-js converted 1000 to 1e3
  var keys = Object.keys(retval);
  for (var i = 0; i < keys.length; i++) {
    for (var j = 0; j < retval[keys[i]].length; j++) {
      if (isNumeric(retval[keys[i]][j])) {
        retval[keys[i]][j] = 1 * retval[keys[i]][j];
      }
    }
  }

  return retval
}

function hasValuesInQueues (queues) {
  var keys = Object.keys(queues)
  return keys.reduce(function (hasValues, key) {
    return hasValues || queues[key].length > 0
  }, false)
}

function getRequiredModules (sources, moduleId) {
  var modulesQueue = {
    main: [moduleId]
  }
  var requiredModules = {
    main: []
  }
  var seenModules = {
    main: {}
  }

  while (hasValuesInQueues(modulesQueue)) {
    var queues = Object.keys(modulesQueue)
    for (var i = 0; i < queues.length; i++) {
      var queueName = queues[i]
      var queue = modulesQueue[queueName]
      var moduleToCheck = queue.pop()
      seenModules[queueName] = seenModules[queueName] || {}
      if (seenModules[queueName][moduleToCheck] || !sources[queueName][moduleToCheck]) continue
      seenModules[queueName][moduleToCheck] = true
      requiredModules[queueName] = requiredModules[queueName] || []
      requiredModules[queueName].push(moduleToCheck)
      var newModules = getModuleDependencies(sources, sources[queueName][moduleToCheck], queueName)
      var newModulesKeys = Object.keys(newModules)
      for (var j = 0; j < newModulesKeys.length; j++) {
        modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]] || []
        modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]].concat(newModules[newModulesKeys[j]])
      }
    }
  }

  return requiredModules
}

module.exports = function (moduleId, options) {
  options = options || {}
  var sources = {
    main: __webpack_modules__
  }

  var requiredModules = options.all ? { main: Object.keys(sources.main) } : getRequiredModules(sources, moduleId)

  var src = ''

  Object.keys(requiredModules).filter(function (m) { return m !== 'main' }).forEach(function (module) {
    var entryModule = 0
    while (requiredModules[module][entryModule]) {
      entryModule++
    }
    requiredModules[module].push(entryModule)
    sources[module][entryModule] = '(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })'
    src = src + 'var ' + module + ' = (' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(entryModule)) + ')({' + requiredModules[module].map(function (id) { return '' + JSON.stringify(id) + ': ' + sources[module][id].toString() }).join(',') + '});\n'
  })

  src = src + 'new ((' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(moduleId)) + ')({' + requiredModules.main.map(function (id) { return '' + JSON.stringify(id) + ': ' + sources.main[id].toString() }).join(',') + '}))(self);'

  var blob = new window.Blob([src], { type: 'text/javascript' })
  if (options.bare) { return blob }

  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  var workerUrl = URL.createObjectURL(blob)
  var worker = new window.Worker(workerUrl)
  worker.objectURL = workerUrl

  return worker
}

},{}],"../node_modules/roslib/src/util/workerSocketImpl.js":[function(require,module,exports) {
var WebSocket = WebSocket || require('ws');
module.exports = function (self) {
  var socket = null;
  function handleSocketMessage(ev) {
    var data = ev.data;
    if (data instanceof ArrayBuffer) {
      // binary message, transfer for speed
      self.postMessage(data, [data]);
    } else {
      // JSON message, copy string
      self.postMessage(data);
    }
  }
  function handleSocketControl(ev) {
    self.postMessage({
      type: ev.type
    });
  }
  self.addEventListener('message', function (ev) {
    var data = ev.data;
    if (typeof data === 'string') {
      // JSON message from ROSLIB
      socket.send(data);
    } else {
      // control message
      if (data.hasOwnProperty('close')) {
        socket.close();
        socket = null;
      } else if (data.hasOwnProperty('uri')) {
        var uri = data.uri;
        socket = new WebSocket(uri);
        socket.binaryType = 'arraybuffer';
        socket.onmessage = handleSocketMessage;
        socket.onclose = handleSocketControl;
        socket.onopen = handleSocketControl;
        socket.onerror = handleSocketControl;
      } else {
        throw 'Unknown message to WorkerSocket';
      }
    }
  });
};
},{"ws":"../node_modules/roslib/src/util/shim/WebSocket.js"}],"../node_modules/roslib/src/util/workerSocket.js":[function(require,module,exports) {
try {
  var work = require('webworkify');
} catch (ReferenceError) {
  // webworkify raises ReferenceError when required inside webpack
  var work = require('webworkify-webpack');
}
var workerSocketImpl = require('./workerSocketImpl');
function WorkerSocket(uri) {
  this.socket_ = work(workerSocketImpl);
  this.socket_.addEventListener('message', this.handleWorkerMessage_.bind(this));
  this.socket_.postMessage({
    uri: uri
  });
}
WorkerSocket.prototype.handleWorkerMessage_ = function (ev) {
  var data = ev.data;
  if (data instanceof ArrayBuffer || typeof data === 'string') {
    // binary or JSON message from rosbridge
    this.onmessage(ev);
  } else {
    // control message from the wrapped WebSocket
    var type = data.type;
    if (type === 'close') {
      this.onclose(null);
    } else if (type === 'open') {
      this.onopen(null);
    } else if (type === 'error') {
      this.onerror(null);
    } else {
      throw 'Unknown message from workersocket';
    }
  }
};
WorkerSocket.prototype.send = function (data) {
  this.socket_.postMessage(data);
};
WorkerSocket.prototype.close = function () {
  this.socket_.postMessage({
    close: true
  });
};
module.exports = WorkerSocket;
},{"webworkify":"../node_modules/webworkify/index.js","webworkify-webpack":"../node_modules/webworkify-webpack/index.js","./workerSocketImpl":"../node_modules/roslib/src/util/workerSocketImpl.js"}],"../node_modules/roslib/src/util/shim/canvas.js":[function(require,module,exports) {
/* global document */
module.exports = function Canvas() {
  return document.createElement('canvas');
};
},{}],"../node_modules/roslib/src/util/shim/decompressPng.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Graeme Yeates - github.com/megawac
 */

'use strict';

var Canvas = require('canvas');
var Image = Canvas.Image || window.Image;

/**
 * If a message was compressed as a PNG image (a compression hack since
 * gzipping over WebSockets * is not supported yet), this function places the
 * "image" in a canvas element then decodes the * "image" as a Base64 string.
 *
 * @private
 * @param data - An object containing the PNG data.
 * @param callback - Function with the following params:
 * @param callback.data - The uncompressed data.
 */
function decompressPng(data, callback) {
  // Uncompresses the data before sending it through (use image/canvas to do so).
  var image = new Image();
  // When the image loads, extracts the raw data (JSON message).
  image.onload = function () {
    // Creates a local canvas to draw on.
    var canvas = new Canvas();
    var context = canvas.getContext('2d');

    // Sets width and height.
    canvas.width = image.width;
    canvas.height = image.height;

    // Prevents anti-aliasing and loosing data
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    // Puts the data into the image.
    context.drawImage(image, 0, 0);
    // Grabs the raw, uncompressed data.
    var imageData = context.getImageData(0, 0, image.width, image.height).data;

    // Constructs the JSON.
    var jsonData = '';
    for (var i = 0; i < imageData.length; i += 4) {
      // RGB
      jsonData += String.fromCharCode(imageData[i], imageData[i + 1], imageData[i + 2]);
    }
    callback(JSON.parse(jsonData));
  };
  // Sends the image data to load.
  image.src = 'data:image/png;base64,' + data;
}
module.exports = decompressPng;
},{"canvas":"../node_modules/roslib/src/util/shim/canvas.js"}],"../node_modules/cbor-js/cbor.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Patrick Gansterer <paroga@paroga.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(global, undefined) { "use strict";
var POW_2_24 = Math.pow(2, -24),
    POW_2_32 = Math.pow(2, 32),
    POW_2_53 = Math.pow(2, 53);

function encode(value) {
  var data = new ArrayBuffer(256);
  var dataView = new DataView(data);
  var lastLength;
  var offset = 0;

  function ensureSpace(length) {
    var newByteLength = data.byteLength;
    var requiredLength = offset + length;
    while (newByteLength < requiredLength)
      newByteLength *= 2;
    if (newByteLength !== data.byteLength) {
      var oldDataView = dataView;
      data = new ArrayBuffer(newByteLength);
      dataView = new DataView(data);
      var uint32count = (offset + 3) >> 2;
      for (var i = 0; i < uint32count; ++i)
        dataView.setUint32(i * 4, oldDataView.getUint32(i * 4));
    }

    lastLength = length;
    return dataView;
  }
  function write() {
    offset += lastLength;
  }
  function writeFloat64(value) {
    write(ensureSpace(8).setFloat64(offset, value));
  }
  function writeUint8(value) {
    write(ensureSpace(1).setUint8(offset, value));
  }
  function writeUint8Array(value) {
    var dataView = ensureSpace(value.length);
    for (var i = 0; i < value.length; ++i)
      dataView.setUint8(offset + i, value[i]);
    write();
  }
  function writeUint16(value) {
    write(ensureSpace(2).setUint16(offset, value));
  }
  function writeUint32(value) {
    write(ensureSpace(4).setUint32(offset, value));
  }
  function writeUint64(value) {
    var low = value % POW_2_32;
    var high = (value - low) / POW_2_32;
    var dataView = ensureSpace(8);
    dataView.setUint32(offset, high);
    dataView.setUint32(offset + 4, low);
    write();
  }
  function writeTypeAndLength(type, length) {
    if (length < 24) {
      writeUint8(type << 5 | length);
    } else if (length < 0x100) {
      writeUint8(type << 5 | 24);
      writeUint8(length);
    } else if (length < 0x10000) {
      writeUint8(type << 5 | 25);
      writeUint16(length);
    } else if (length < 0x100000000) {
      writeUint8(type << 5 | 26);
      writeUint32(length);
    } else {
      writeUint8(type << 5 | 27);
      writeUint64(length);
    }
  }
  
  function encodeItem(value) {
    var i;

    if (value === false)
      return writeUint8(0xf4);
    if (value === true)
      return writeUint8(0xf5);
    if (value === null)
      return writeUint8(0xf6);
    if (value === undefined)
      return writeUint8(0xf7);
  
    switch (typeof value) {
      case "number":
        if (Math.floor(value) === value) {
          if (0 <= value && value <= POW_2_53)
            return writeTypeAndLength(0, value);
          if (-POW_2_53 <= value && value < 0)
            return writeTypeAndLength(1, -(value + 1));
        }
        writeUint8(0xfb);
        return writeFloat64(value);

      case "string":
        var utf8data = [];
        for (i = 0; i < value.length; ++i) {
          var charCode = value.charCodeAt(i);
          if (charCode < 0x80) {
            utf8data.push(charCode);
          } else if (charCode < 0x800) {
            utf8data.push(0xc0 | charCode >> 6);
            utf8data.push(0x80 | charCode & 0x3f);
          } else if (charCode < 0xd800) {
            utf8data.push(0xe0 | charCode >> 12);
            utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
            utf8data.push(0x80 | charCode & 0x3f);
          } else {
            charCode = (charCode & 0x3ff) << 10;
            charCode |= value.charCodeAt(++i) & 0x3ff;
            charCode += 0x10000;

            utf8data.push(0xf0 | charCode >> 18);
            utf8data.push(0x80 | (charCode >> 12)  & 0x3f);
            utf8data.push(0x80 | (charCode >> 6)  & 0x3f);
            utf8data.push(0x80 | charCode & 0x3f);
          }
        }

        writeTypeAndLength(3, utf8data.length);
        return writeUint8Array(utf8data);

      default:
        var length;
        if (Array.isArray(value)) {
          length = value.length;
          writeTypeAndLength(4, length);
          for (i = 0; i < length; ++i)
            encodeItem(value[i]);
        } else if (value instanceof Uint8Array) {
          writeTypeAndLength(2, value.length);
          writeUint8Array(value);
        } else {
          var keys = Object.keys(value);
          length = keys.length;
          writeTypeAndLength(5, length);
          for (i = 0; i < length; ++i) {
            var key = keys[i];
            encodeItem(key);
            encodeItem(value[key]);
          }
        }
    }
  }
  
  encodeItem(value);

  if ("slice" in data)
    return data.slice(0, offset);
  
  var ret = new ArrayBuffer(offset);
  var retView = new DataView(ret);
  for (var i = 0; i < offset; ++i)
    retView.setUint8(i, dataView.getUint8(i));
  return ret;
}

function decode(data, tagger, simpleValue) {
  var dataView = new DataView(data);
  var offset = 0;
  
  if (typeof tagger !== "function")
    tagger = function(value) { return value; };
  if (typeof simpleValue !== "function")
    simpleValue = function() { return undefined; };

  function read(value, length) {
    offset += length;
    return value;
  }
  function readArrayBuffer(length) {
    return read(new Uint8Array(data, offset, length), length);
  }
  function readFloat16() {
    var tempArrayBuffer = new ArrayBuffer(4);
    var tempDataView = new DataView(tempArrayBuffer);
    var value = readUint16();

    var sign = value & 0x8000;
    var exponent = value & 0x7c00;
    var fraction = value & 0x03ff;
    
    if (exponent === 0x7c00)
      exponent = 0xff << 10;
    else if (exponent !== 0)
      exponent += (127 - 15) << 10;
    else if (fraction !== 0)
      return fraction * POW_2_24;
    
    tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
    return tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return read(dataView.getFloat32(offset), 4);
  }
  function readFloat64() {
    return read(dataView.getFloat64(offset), 8);
  }
  function readUint8() {
    return read(dataView.getUint8(offset), 1);
  }
  function readUint16() {
    return read(dataView.getUint16(offset), 2);
  }
  function readUint32() {
    return read(dataView.getUint32(offset), 4);
  }
  function readUint64() {
    return readUint32() * POW_2_32 + readUint32();
  }
  function readBreak() {
    if (dataView.getUint8(offset) !== 0xff)
      return false;
    offset += 1;
    return true;
  }
  function readLength(additionalInformation) {
    if (additionalInformation < 24)
      return additionalInformation;
    if (additionalInformation === 24)
      return readUint8();
    if (additionalInformation === 25)
      return readUint16();
    if (additionalInformation === 26)
      return readUint32();
    if (additionalInformation === 27)
      return readUint64();
    if (additionalInformation === 31)
      return -1;
    throw "Invalid length encoding";
  }
  function readIndefiniteStringLength(majorType) {
    var initialByte = readUint8();
    if (initialByte === 0xff)
      return -1;
    var length = readLength(initialByte & 0x1f);
    if (length < 0 || (initialByte >> 5) !== majorType)
      throw "Invalid indefinite length element";
    return length;
  }

  function appendUtf16data(utf16data, length) {
    for (var i = 0; i < length; ++i) {
      var value = readUint8();
      if (value & 0x80) {
        if (value < 0xe0) {
          value = (value & 0x1f) <<  6
                | (readUint8() & 0x3f);
          length -= 1;
        } else if (value < 0xf0) {
          value = (value & 0x0f) << 12
                | (readUint8() & 0x3f) << 6
                | (readUint8() & 0x3f);
          length -= 2;
        } else {
          value = (value & 0x0f) << 18
                | (readUint8() & 0x3f) << 12
                | (readUint8() & 0x3f) << 6
                | (readUint8() & 0x3f);
          length -= 3;
        }
      }

      if (value < 0x10000) {
        utf16data.push(value);
      } else {
        value -= 0x10000;
        utf16data.push(0xd800 | (value >> 10));
        utf16data.push(0xdc00 | (value & 0x3ff));
      }
    }
  }

  function decodeItem() {
    var initialByte = readUint8();
    var majorType = initialByte >> 5;
    var additionalInformation = initialByte & 0x1f;
    var i;
    var length;

    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }

    length = readLength(additionalInformation);
    if (length < 0 && (majorType < 2 || 6 < majorType))
      throw "Invalid length";

    switch (majorType) {
      case 0:
        return length;
      case 1:
        return -1 - length;
      case 2:
        if (length < 0) {
          var elements = [];
          var fullArrayLength = 0;
          while ((length = readIndefiniteStringLength(majorType)) >= 0) {
            fullArrayLength += length;
            elements.push(readArrayBuffer(length));
          }
          var fullArray = new Uint8Array(fullArrayLength);
          var fullArrayOffset = 0;
          for (i = 0; i < elements.length; ++i) {
            fullArray.set(elements[i], fullArrayOffset);
            fullArrayOffset += elements[i].length;
          }
          return fullArray;
        }
        return readArrayBuffer(length);
      case 3:
        var utf16data = [];
        if (length < 0) {
          while ((length = readIndefiniteStringLength(majorType)) >= 0)
            appendUtf16data(utf16data, length);
        } else
          appendUtf16data(utf16data, length);
        return String.fromCharCode.apply(null, utf16data);
      case 4:
        var retArray;
        if (length < 0) {
          retArray = [];
          while (!readBreak())
            retArray.push(decodeItem());
        } else {
          retArray = new Array(length);
          for (i = 0; i < length; ++i)
            retArray[i] = decodeItem();
        }
        return retArray;
      case 5:
        var retObject = {};
        for (i = 0; i < length || length < 0 && !readBreak(); ++i) {
          var key = decodeItem();
          retObject[key] = decodeItem();
        }
        return retObject;
      case 6:
        return tagger(decodeItem(), length);
      case 7:
        switch (length) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return undefined;
          default:
            return simpleValue(length);
        }
    }
  }

  var ret = decodeItem();
  if (offset !== data.byteLength)
    throw "Remaining bytes";
  return ret;
}

var obj = { encode: encode, decode: decode };

if (typeof define === "function" && define.amd)
  define("cbor/cbor", obj);
else if (typeof module !== 'undefined' && module.exports)
  module.exports = obj;
else if (!global.CBOR)
  global.CBOR = obj;

})(this);

},{}],"../node_modules/roslib/src/util/cborTypedArrayTags.js":[function(require,module,exports) {
'use strict';

var UPPER32 = Math.pow(2, 32);
var warnedPrecision = false;
function warnPrecision() {
  if (!warnedPrecision) {
    warnedPrecision = true;
    console.warn('CBOR 64-bit integer array values may lose precision. No further warnings.');
  }
}

/**
 * Unpack 64-bit unsigned integer from byte array.
 * @param {Uint8Array} bytes
*/
function decodeUint64LE(bytes) {
  warnPrecision();
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var arrLen = byteLen / 8;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  var uint32View = new Uint32Array(buffer);
  var arr = new Array(arrLen);
  for (var i = 0; i < arrLen; i++) {
    var si = i * 2;
    var lo = uint32View[si];
    var hi = uint32View[si + 1];
    arr[i] = lo + UPPER32 * hi;
  }
  return arr;
}

/**
 * Unpack 64-bit signed integer from byte array.
 * @param {Uint8Array} bytes
*/
function decodeInt64LE(bytes) {
  warnPrecision();
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var arrLen = byteLen / 8;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  var uint32View = new Uint32Array(buffer);
  var int32View = new Int32Array(buffer);
  var arr = new Array(arrLen);
  for (var i = 0; i < arrLen; i++) {
    var si = i * 2;
    var lo = uint32View[si];
    var hi = int32View[si + 1];
    arr[i] = lo + UPPER32 * hi;
  }
  return arr;
}

/**
 * Unpack typed array from byte array.
 * @param {Uint8Array} bytes
 * @param {type} ArrayType - Desired output array type
*/
function decodeNativeArray(bytes, ArrayType) {
  var byteLen = bytes.byteLength;
  var offset = bytes.byteOffset;
  var buffer = bytes.buffer.slice(offset, offset + byteLen);
  return new ArrayType(buffer);
}

/**
 * Supports a subset of draft CBOR typed array tags:
 *     <https://tools.ietf.org/html/draft-ietf-cbor-array-tags-00>
 *
 * Only supports little-endian tags for now.
 */
var nativeArrayTypes = {
  64: Uint8Array,
  69: Uint16Array,
  70: Uint32Array,
  72: Int8Array,
  77: Int16Array,
  78: Int32Array,
  85: Float32Array,
  86: Float64Array
};

/**
 * We can also decode 64-bit integer arrays, since ROS has these types.
 */
var conversionArrayTypes = {
  71: decodeUint64LE,
  79: decodeInt64LE
};

/**
 * Handle CBOR typed array tags during decoding.
 * @param {Uint8Array} data
 * @param {Number} tag
 */
function cborTypedArrayTagger(data, tag) {
  if (tag in nativeArrayTypes) {
    var arrayType = nativeArrayTypes[tag];
    return decodeNativeArray(data, arrayType);
  }
  if (tag in conversionArrayTypes) {
    return conversionArrayTypes[tag](data);
  }
  return data;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cborTypedArrayTagger;
}
},{}],"../node_modules/roslib/src/core/SocketAdapter.js":[function(require,module,exports) {
/**
 * Socket event handling utilities for handling events on either
 * WebSocket and TCP sockets
 *
 * Note to anyone reviewing this code: these functions are called
 * in the context of their parent object, unless bound
 * @fileOverview
 */
'use strict';

var decompressPng = require('../util/decompressPng');
var CBOR = require('cbor-js');
var typedArrayTagger = require('../util/cborTypedArrayTags');
var BSON = null;
if (typeof bson !== 'undefined') {
  BSON = bson().BSON;
}

/**
 * Event listeners for a WebSocket or TCP socket to a JavaScript
 * ROS Client. Sets up Messages for a given topic to trigger an
 * event on the ROS client.
 *
 * @namespace SocketAdapter
 * @private
 */
function SocketAdapter(client) {
  var decoder = null;
  if (client.transportOptions.decoder) {
    decoder = client.transportOptions.decoder;
  }
  function handleMessage(message) {
    if (message.op === 'publish') {
      client.emit(message.topic, message.msg);
    } else if (message.op === 'service_response') {
      client.emit(message.id, message);
    } else if (message.op === 'call_service') {
      client.emit(message.service, message);
    } else if (message.op === 'status') {
      if (message.id) {
        client.emit('status:' + message.id, message);
      } else {
        client.emit('status', message);
      }
    }
  }
  function handlePng(message, callback) {
    if (message.op === 'png') {
      decompressPng(message.data, callback);
    } else {
      callback(message);
    }
  }
  function decodeBSON(data, callback) {
    if (!BSON) {
      throw 'Cannot process BSON encoded message without BSON header.';
    }
    var reader = new FileReader();
    reader.onload = function () {
      var uint8Array = new Uint8Array(this.result);
      var msg = BSON.deserialize(uint8Array);
      callback(msg);
    };
    reader.readAsArrayBuffer(data);
  }
  return {
    /**
     * Emit a 'connection' event on WebSocket connection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onopen: function onOpen(event) {
      client.isConnected = true;
      client.emit('connection', event);
    },
    /**
     * Emit a 'close' event on WebSocket disconnection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onclose: function onClose(event) {
      client.isConnected = false;
      client.emit('close', event);
    },
    /**
     * Emit an 'error' event whenever there was an error.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onerror: function onError(event) {
      client.emit('error', event);
    },
    /**
     * Parse message responses from rosbridge and send to the appropriate
     * topic, service, or param.
     *
     * @param {Object} data - The raw JSON message from rosbridge.
     * @memberof SocketAdapter
     */
    onmessage: function onMessage(data) {
      if (decoder) {
        decoder(data.data, function (message) {
          handleMessage(message);
        });
      } else if (typeof Blob !== 'undefined' && data.data instanceof Blob) {
        decodeBSON(data.data, function (message) {
          handlePng(message, handleMessage);
        });
      } else if (data.data instanceof ArrayBuffer) {
        var decoded = CBOR.decode(data.data, typedArrayTagger);
        handleMessage(decoded);
      } else {
        var message = JSON.parse(typeof data === 'string' ? data : data.data);
        handlePng(message, handleMessage);
      }
    }
  };
}
module.exports = SocketAdapter;
},{"../util/decompressPng":"../node_modules/roslib/src/util/shim/decompressPng.js","cbor-js":"../node_modules/cbor-js/cbor.js","../util/cborTypedArrayTags":"../node_modules/roslib/src/util/cborTypedArrayTags.js"}],"../node_modules/roslib/src/core/ServiceResponse.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - balexander@willowgarage.com
 */

var assign = require('object-assign');

/**
 * A ServiceResponse is returned from the service call.
 *
 * @constructor
 * @param {Object} values - Object matching the fields defined in the .srv definition file.
 */
function ServiceResponse(values) {
  assign(this, values);
}
module.exports = ServiceResponse;
},{"object-assign":"../node_modules/object-assign/index.js"}],"../node_modules/roslib/src/core/ServiceRequest.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - balexander@willowgarage.com
 */

var assign = require('object-assign');

/**
 * A ServiceRequest is passed into the service call.
 *
 * @constructor
 * @param {Object} values - Object matching the fields defined in the .srv definition file.
 */
function ServiceRequest(values) {
  assign(this, values);
}
module.exports = ServiceRequest;
},{"object-assign":"../node_modules/object-assign/index.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"../node_modules/eventemitter2/lib/eventemitter2.js":[function(require,module,exports) {
var process = require("process");
var define;
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {
  var hasOwnProperty= Object.hasOwnProperty;
  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;
  var nextTickSupported= typeof process=='object' && typeof process.nextTick=='function';
  var symbolsSupported= typeof Symbol==='function';
  var reflectSupported= typeof Reflect === 'object';
  var setImmediateSupported= typeof setImmediate === 'function';
  var _setImmediate= setImmediateSupported ? setImmediate : setTimeout;
  var ownKeys= symbolsSupported? (reflectSupported && typeof Reflect.ownKeys==='function'? Reflect.ownKeys : function(obj){
    var arr= Object.getOwnPropertyNames(obj);
    arr.push.apply(arr, Object.getOwnPropertySymbols(obj));
    return arr;
  }) : Object.keys;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);

      if(conf.maxListeners!==undefined){
          this._maxListeners= conf.maxListeners;
      }

      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this._newListener = conf.newListener);
      conf.removeListener && (this._removeListener = conf.removeListener);
      conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);
      conf.ignoreErrors && (this.ignoreErrors = conf.ignoreErrors);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function logPossibleMemoryLeak(count, eventName) {
    var errorMsg = '(node) warning: possible EventEmitter memory ' +
        'leak detected. ' + count + ' listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';

    if(this.verboseMemoryLeak){
      errorMsg += ' Event name: ' + eventName + '.';
    }

    if(typeof process !== 'undefined' && process.emitWarning){
      var e = new Error(errorMsg);
      e.name = 'MaxListenersExceededWarning';
      e.emitter = this;
      e.count = count;
      process.emitWarning(e);
    } else {
      console.error(errorMsg);

      if (console.trace){
        console.trace();
      }
    }
  }

  var toArray = function (a, b, c) {
    var n = arguments.length;
    switch (n) {
      case 0:
        return [];
      case 1:
        return [a];
      case 2:
        return [a, b];
      case 3:
        return [a, b, c];
      default:
        var arr = new Array(n);
        while (n--) {
          arr[n] = arguments[n];
        }
        return arr;
    }
  };

  function toObject(keys, values) {
    var obj = {};
    var key;
    var len = keys.length;
    var valuesCount = values ? values.length : 0;
    for (var i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = i < valuesCount ? values[i] : undefined;
    }
    return obj;
  }

  function TargetObserver(emitter, target, options) {
    this._emitter = emitter;
    this._target = target;
    this._listeners = {};
    this._listenersCount = 0;

    var on, off;

    if (options.on || options.off) {
      on = options.on;
      off = options.off;
    }

    if (target.addEventListener) {
      on = target.addEventListener;
      off = target.removeEventListener;
    } else if (target.addListener) {
      on = target.addListener;
      off = target.removeListener;
    } else if (target.on) {
      on = target.on;
      off = target.off;
    }

    if (!on && !off) {
      throw Error('target does not implement any known event API');
    }

    if (typeof on !== 'function') {
      throw TypeError('on method must be a function');
    }

    if (typeof off !== 'function') {
      throw TypeError('off method must be a function');
    }

    this._on = on;
    this._off = off;

    var _observers= emitter._observers;
    if(_observers){
      _observers.push(this);
    }else{
      emitter._observers= [this];
    }
  }

  Object.assign(TargetObserver.prototype, {
    subscribe: function(event, localEvent, reducer){
      var observer= this;
      var target= this._target;
      var emitter= this._emitter;
      var listeners= this._listeners;
      var handler= function(){
        var args= toArray.apply(null, arguments);
        var eventObj= {
          data: args,
          name: localEvent,
          original: event
        };
        if(reducer){
          var result= reducer.call(target, eventObj);
          if(result!==false){
            emitter.emit.apply(emitter, [eventObj.name].concat(args))
          }
          return;
        }
        emitter.emit.apply(emitter, [localEvent].concat(args));
      };


      if(listeners[event]){
        throw Error('Event \'' + event + '\' is already listening');
      }

      this._listenersCount++;

      if(emitter._newListener && emitter._removeListener && !observer._onNewListener){

        this._onNewListener = function (_event) {
          if (_event === localEvent && listeners[event] === null) {
            listeners[event] = handler;
            observer._on.call(target, event, handler);
          }
        };

        emitter.on('newListener', this._onNewListener);

        this._onRemoveListener= function(_event){
          if(_event === localEvent && !emitter.hasListeners(_event) && listeners[event]){
            listeners[event]= null;
            observer._off.call(target, event, handler);
          }
        };

        listeners[event]= null;

        emitter.on('removeListener', this._onRemoveListener);
      }else{
        listeners[event]= handler;
        observer._on.call(target, event, handler);
      }
    },

    unsubscribe: function(event){
      var observer= this;
      var listeners= this._listeners;
      var emitter= this._emitter;
      var handler;
      var events;
      var off= this._off;
      var target= this._target;
      var i;

      if(event && typeof event!=='string'){
        throw TypeError('event must be a string');
      }

      function clearRefs(){
        if(observer._onNewListener){
          emitter.off('newListener', observer._onNewListener);
          emitter.off('removeListener', observer._onRemoveListener);
          observer._onNewListener= null;
          observer._onRemoveListener= null;
        }
        var index= findTargetIndex.call(emitter, observer);
        emitter._observers.splice(index, 1);
      }

      if(event){
        handler= listeners[event];
        if(!handler) return;
        off.call(target, event, handler);
        delete listeners[event];
        if(!--this._listenersCount){
          clearRefs();
        }
      }else{
        events= ownKeys(listeners);
        i= events.length;
        while(i-->0){
          event= events[i];
          off.call(target, event, listeners[event]);
        }
        this._listeners= {};
        this._listenersCount= 0;
        clearRefs();
      }
    }
  });

  function resolveOptions(options, schema, reducers, allowUnknown) {
    var computedOptions = Object.assign({}, schema);

    if (!options) return computedOptions;

    if (typeof options !== 'object') {
      throw TypeError('options must be an object')
    }

    var keys = Object.keys(options);
    var length = keys.length;
    var option, value;
    var reducer;

    function reject(reason) {
      throw Error('Invalid "' + option + '" option value' + (reason ? '. Reason: ' + reason : ''))
    }

    for (var i = 0; i < length; i++) {
      option = keys[i];
      if (!allowUnknown && !hasOwnProperty.call(schema, option)) {
        throw Error('Unknown "' + option + '" option');
      }
      value = options[option];
      if (value !== undefined) {
        reducer = reducers[option];
        computedOptions[option] = reducer ? reducer(value, reject) : value;
      }
    }
    return computedOptions;
  }

  function constructorReducer(value, reject) {
    if (typeof value !== 'function' || !value.hasOwnProperty('prototype')) {
      reject('value must be a constructor');
    }
    return value;
  }

  function makeTypeReducer(types) {
    var message= 'value must be type of ' + types.join('|');
    var len= types.length;
    var firstType= types[0];
    var secondType= types[1];

    if (len === 1) {
      return function (v, reject) {
        if (typeof v === firstType) {
          return v;
        }
        reject(message);
      }
    }

    if (len === 2) {
      return function (v, reject) {
        var kind= typeof v;
        if (kind === firstType || kind === secondType) return v;
        reject(message);
      }
    }

    return function (v, reject) {
      var kind = typeof v;
      var i = len;
      while (i-- > 0) {
        if (kind === types[i]) return v;
      }
      reject(message);
    }
  }

  var functionReducer= makeTypeReducer(['function']);

  var objectFunctionReducer= makeTypeReducer(['object', 'function']);

  function makeCancelablePromise(Promise, executor, options) {
    var isCancelable;
    var callbacks;
    var timer= 0;
    var subscriptionClosed;

    var promise = new Promise(function (resolve, reject, onCancel) {
      options= resolveOptions(options, {
        timeout: 0,
        overload: false
      }, {
        timeout: function(value, reject){
          value*= 1;
          if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
            reject('timeout must be a positive number');
          }
          return value;
        }
      });

      isCancelable = !options.overload && typeof Promise.prototype.cancel === 'function' && typeof onCancel === 'function';

      function cleanup() {
        if (callbacks) {
          callbacks = null;
        }
        if (timer) {
          clearTimeout(timer);
          timer = 0;
        }
      }

      var _resolve= function(value){
        cleanup();
        resolve(value);
      };

      var _reject= function(err){
        cleanup();
        reject(err);
      };

      if (isCancelable) {
        executor(_resolve, _reject, onCancel);
      } else {
        callbacks = [function(reason){
          _reject(reason || Error('canceled'));
        }];
        executor(_resolve, _reject, function (cb) {
          if (subscriptionClosed) {
            throw Error('Unable to subscribe on cancel event asynchronously')
          }
          if (typeof cb !== 'function') {
            throw TypeError('onCancel callback must be a function');
          }
          callbacks.push(cb);
        });
        subscriptionClosed= true;
      }

      if (options.timeout > 0) {
        timer= setTimeout(function(){
          var reason= Error('timeout');
          reason.code = 'ETIMEDOUT'
          timer= 0;
          promise.cancel(reason);
          reject(reason);
        }, options.timeout);
      }
    });

    if (!isCancelable) {
      promise.cancel = function (reason) {
        if (!callbacks) {
          return;
        }
        var length = callbacks.length;
        for (var i = 1; i < length; i++) {
          callbacks[i](reason);
        }
        // internal callback to reject the promise
        callbacks[0](reason);
        callbacks = null;
      };
    }

    return promise;
  }

  function findTargetIndex(observer) {
    var observers = this._observers;
    if(!observers){
      return -1;
    }
    var len = observers.length;
    for (var i = 0; i < len; i++) {
      if (observers[i]._target === observer) return i;
    }
    return -1;
  }

  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i, typeLength) {
    if (!tree) {
      return null;
    }

    if (i === 0) {
      var kind = typeof type;
      if (kind === 'string') {
        var ns, n, l = 0, j = 0, delimiter = this.delimiter, dl = delimiter.length;
        if ((n = type.indexOf(delimiter)) !== -1) {
          ns = new Array(5);
          do {
            ns[l++] = type.slice(j, n);
            j = n + dl;
          } while ((n = type.indexOf(delimiter, j)) !== -1);

          ns[l++] = type.slice(j);
          type = ns;
          typeLength = l;
        } else {
          type = [type];
          typeLength = 1;
        }
      } else if (kind === 'object') {
        typeLength = type.length;
      } else {
        type = [type];
        typeLength = 1;
      }
    }

    var listeners= null, branch, xTree, xxTree, isolatedBranch, endReached, currentType = type[i],
        nextType = type[i + 1], branches, _listeners;

    if (i === typeLength) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //

      if(tree._listeners) {
        if (typeof tree._listeners === 'function') {
          handlers && handlers.push(tree._listeners);
          listeners = [tree];
        } else {
          handlers && handlers.push.apply(handlers, tree._listeners);
          listeners = [tree];
        }
      }
    } else {

      if (currentType === '*') {
        //
        // If the event emitted is '*' at this part
        // or there is a concrete match at this patch
        //
        branches = ownKeys(tree);
        n = branches.length;
        while (n-- > 0) {
          branch = branches[n];
          if (branch !== '_listeners') {
            _listeners = searchListenerTree(handlers, type, tree[branch], i + 1, typeLength);
            if (_listeners) {
              if (listeners) {
                listeners.push.apply(listeners, _listeners);
              } else {
                listeners = _listeners;
              }
            }
          }
        }
        return listeners;
      } else if (currentType === '**') {
        endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));
        if (endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = searchListenerTree(handlers, type, tree, typeLength, typeLength);
        }

        branches = ownKeys(tree);
        n = branches.length;
        while (n-- > 0) {
          branch = branches[n];
          if (branch !== '_listeners') {
            if (branch === '*' || branch === '**') {
              if (tree[branch]._listeners && !endReached) {
                _listeners = searchListenerTree(handlers, type, tree[branch], typeLength, typeLength);
                if (_listeners) {
                  if (listeners) {
                    listeners.push.apply(listeners, _listeners);
                  } else {
                    listeners = _listeners;
                  }
                }
              }
              _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
            } else if (branch === nextType) {
              _listeners = searchListenerTree(handlers, type, tree[branch], i + 2, typeLength);
            } else {
              // No match on this one, shift into the tree but not in the type array.
              _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
            }
            if (_listeners) {
              if (listeners) {
                listeners.push.apply(listeners, _listeners);
              } else {
                listeners = _listeners;
              }
            }
          }
        }
        return listeners;
      } else if (tree[currentType]) {
        listeners = searchListenerTree(handlers, type, tree[currentType], i + 1, typeLength);
      }
    }

      xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i + 1, typeLength);
    }

    xxTree = tree['**'];
    if (xxTree) {
      if (i < typeLength) {
        if (xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
        }

        // Build arrays of matching next branches and others.
        branches= ownKeys(xxTree);
        n= branches.length;
        while(n-->0){
          branch= branches[n];
          if (branch !== '_listeners') {
            if (branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i + 2, typeLength);
            } else if (branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i + 1, typeLength);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, {'**': isolatedBranch}, i + 1, typeLength);
            }
          }
        }
      } else if (xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
      } else if (xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength, typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener, prepend) {
    var len = 0, j = 0, i, delimiter = this.delimiter, dl= delimiter.length, ns;

    if(typeof type==='string') {
      if ((i = type.indexOf(delimiter)) !== -1) {
        ns = new Array(5);
        do {
          ns[len++] = type.slice(j, i);
          j = i + dl;
        } while ((i = type.indexOf(delimiter, j)) !== -1);

        ns[len++] = type.slice(j);
      }else{
        ns= [type];
        len= 1;
      }
    }else{
      ns= type;
      len= type.length;
    }

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    if (len > 1) {
      for (i = 0; i + 1 < len; i++) {
        if (ns[i] === '**' && ns[i + 1] === '**') {
          return;
        }
      }
    }



    var tree = this.listenerTree, name;

    for (i = 0; i < len; i++) {
      name = ns[i];

      tree = tree[name] || (tree[name] = {});

      if (i === len - 1) {
        if (!tree._listeners) {
          tree._listeners = listener;
        } else {
          if (typeof tree._listeners === 'function') {
            tree._listeners = [tree._listeners];
          }

          if (prepend) {
            tree._listeners.unshift(listener);
          } else {
            tree._listeners.push(listener);
          }

          if (
              !tree._listeners.warned &&
              this._maxListeners > 0 &&
              tree._listeners.length > this._maxListeners
          ) {
            tree._listeners.warned = true;
            logPossibleMemoryLeak.call(this, tree._listeners.length, name);
          }
        }
        return true;
      }
    }

    return true;
  }

  function collectTreeEvents(tree, events, root, asArray){
     var branches= ownKeys(tree);
     var i= branches.length;
     var branch, branchName, path;
     var hasListeners= tree['_listeners'];
     var isArrayPath;

     while(i-->0){
         branchName= branches[i];

         branch= tree[branchName];

         if(branchName==='_listeners'){
             path= root;
         }else {
             path = root ? root.concat(branchName) : [branchName];
         }

         isArrayPath= asArray || typeof branchName==='symbol';

         hasListeners && events.push(isArrayPath? path : path.join(this.delimiter));

         if(typeof branch==='object'){
             collectTreeEvents.call(this, branch, events, path, isArrayPath);
         }
     }

     return events;
  }

  function recursivelyGarbageCollect(root) {
    var keys = ownKeys(root);
    var i= keys.length;
    var obj, key, flag;
    while(i-->0){
      key = keys[i];
      obj = root[key];

      if(obj){
          flag= true;
          if(key !== '_listeners' && !recursivelyGarbageCollect(obj)){
             delete root[key];
          }
      }
    }

    return flag;
  }

  function Listener(emitter, event, listener){
    this.emitter= emitter;
    this.event= event;
    this.listener= listener;
  }

  Listener.prototype.off= function(){
    this.emitter.off(this.event, this.listener);
    return this;
  };

  function setupListener(event, listener, options){
      if (options === true) {
        promisify = true;
      } else if (options === false) {
        async = true;
      } else {
        if (!options || typeof options !== 'object') {
          throw TypeError('options should be an object or true');
        }
        var async = options.async;
        var promisify = options.promisify;
        var nextTick = options.nextTick;
        var objectify = options.objectify;
      }

      if (async || nextTick || promisify) {
        var _listener = listener;
        var _origin = listener._origin || listener;

        if (nextTick && !nextTickSupported) {
          throw Error('process.nextTick is not supported');
        }

        if (promisify === undefined) {
          promisify = listener.constructor.name === 'AsyncFunction';
        }

        listener = function () {
          var args = arguments;
          var context = this;
          var event = this.event;

          return promisify ? (nextTick ? Promise.resolve() : new Promise(function (resolve) {
            _setImmediate(resolve);
          }).then(function () {
            context.event = event;
            return _listener.apply(context, args)
          })) : (nextTick ? process.nextTick : _setImmediate)(function () {
            context.event = event;
            _listener.apply(context, args)
          });
        };

        listener._async = true;
        listener._origin = _origin;
      }

    return [listener, objectify? new Listener(this, event, listener): this];
  }

  function EventEmitter(conf) {
    this._events = {};
    this._newListener = false;
    this._removeListener = false;
    this.verboseMemoryLeak = false;
    configure.call(this, conf);
  }

  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  EventEmitter.prototype.listenTo= function(target, events, options){
    if(typeof target!=='object'){
      throw TypeError('target musts be an object');
    }

    var emitter= this;

    options = resolveOptions(options, {
      on: undefined,
      off: undefined,
      reducers: undefined
    }, {
      on: functionReducer,
      off: functionReducer,
      reducers: objectFunctionReducer
    });

    function listen(events){
      if(typeof events!=='object'){
        throw TypeError('events must be an object');
      }

      var reducers= options.reducers;
      var index= findTargetIndex.call(emitter, target);
      var observer;

      if(index===-1){
        observer= new TargetObserver(emitter, target, options);
      }else{
        observer= emitter._observers[index];
      }

      var keys= ownKeys(events);
      var len= keys.length;
      var event;
      var isSingleReducer= typeof reducers==='function';

      for(var i=0; i<len; i++){
        event= keys[i];
        observer.subscribe(
            event,
            events[event] || event,
            isSingleReducer ? reducers : reducers && reducers[event]
        );
      }
    }

    isArray(events)?
        listen(toObject(events)) :
        (typeof events==='string'? listen(toObject(events.split(/\s+/))): listen(events));

    return this;
  };

  EventEmitter.prototype.stopListeningTo = function (target, event) {
    var observers = this._observers;

    if(!observers){
      return false;
    }

    var i = observers.length;
    var observer;
    var matched= false;

    if(target && typeof target!=='object'){
      throw TypeError('target should be an object');
    }

    while (i-- > 0) {
      observer = observers[i];
      if (!target || observer._target === target) {
        observer.unsubscribe(event);
        matched= true;
      }
    }

    return matched;
  };

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    if (n !== undefined) {
      this._maxListeners = n;
      if (!this._conf) this._conf = {};
      this._conf.maxListeners = n;
    }
  };

  EventEmitter.prototype.getMaxListeners = function() {
    return this._maxListeners;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn, options) {
    return this._once(event, fn, false, options);
  };

  EventEmitter.prototype.prependOnceListener = function(event, fn, options) {
    return this._once(event, fn, true, options);
  };

  EventEmitter.prototype._once = function(event, fn, prepend, options) {
    return this._many(event, 1, fn, prepend, options);
  };

  EventEmitter.prototype.many = function(event, ttl, fn, options) {
    return this._many(event, ttl, fn, false, options);
  };

  EventEmitter.prototype.prependMany = function(event, ttl, fn, options) {
    return this._many(event, ttl, fn, true, options);
  };

  EventEmitter.prototype._many = function(event, ttl, fn, prepend, options) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      return fn.apply(this, arguments);
    }

    listener._origin = fn;

    return this._on(event, listener, prepend, options);
  };

  EventEmitter.prototype.emit = function() {
    if (!this._events && !this._all) {
      return false;
    }

    this._events || init.call(this);

    var type = arguments[0], ns, wildcard= this.wildcard;
    var args,l,i,j, containsSymbol;

    if (type === 'newListener' && !this._newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    if (wildcard) {
      ns= type;
      if(type!=='newListener' && type!=='removeListener'){
        if (typeof type === 'object') {
          l = type.length;
          if (symbolsSupported) {
            for (i = 0; i < l; i++) {
              if (typeof type[i] === 'symbol') {
                containsSymbol = true;
                break;
              }
            }
          }
          if (!containsSymbol) {
            type = type.join(this.delimiter);
          }
        }
      }
    }

    var al = arguments.length;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, arguments);
        }
      }
    }

    if (wildcard) {
      handler = [];
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0, l);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this.ignoreErrors && !this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {
    if (!this._events && !this._all) {
      return false;
    }

    this._events || init.call(this);

    var type = arguments[0], wildcard= this.wildcard, ns, containsSymbol;
    var args,l,i,j;

    if (type === 'newListener' && !this._newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    if (wildcard) {
      ns= type;
      if(type!=='newListener' && type!=='removeListener'){
        if (typeof type === 'object') {
          l = type.length;
          if (symbolsSupported) {
            for (i = 0; i < l; i++) {
              if (typeof type[i] === 'symbol') {
                containsSymbol = true;
                break;
              }
            }
          }
          if (!containsSymbol) {
            type = type.join(this.delimiter);
          }
        }
      }
    }

    var promises= [];

    var al = arguments.length;
    var handler;

    if (this._all) {
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, arguments));
        }
      }
    }

    if (wildcard) {
      handler = [];
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      handler = handler.slice();
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this.ignoreErrors && !this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener, options) {
    return this._on(type, listener, false, options);
  };

  EventEmitter.prototype.prependListener = function(type, listener, options) {
    return this._on(type, listener, true, options);
  };

  EventEmitter.prototype.onAny = function(fn) {
    return this._onAny(fn, false);
  };

  EventEmitter.prototype.prependAny = function(fn) {
    return this._onAny(fn, true);
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype._onAny = function(fn, prepend){
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if (!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    if(prepend){
      this._all.unshift(fn);
    }else{
      this._all.push(fn);
    }

    return this;
  };

  EventEmitter.prototype._on = function(type, listener, prepend, options) {
    if (typeof type === 'function') {
      this._onAny(type, listener);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    var returnValue= this, temp;

    if (options !== undefined) {
      temp = setupListener.call(this, type, listener, options);
      listener = temp[0];
      returnValue = temp[1];
    }

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    if (this._newListener) {
      this.emit('newListener', type, listener);
    }

    if (this.wildcard) {
      growListenerTree.call(this, type, listener, prepend);
      return returnValue;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else {
      if (typeof this._events[type] === 'function') {
        // Change to array.
        this._events[type] = [this._events[type]];
      }

      // If we've already got an array, just add
      if(prepend){
        this._events[type].unshift(listener);
      }else{
        this._events[type].push(listener);
      }

      // Check for listener leak
      if (
        !this._events[type].warned &&
        this._maxListeners > 0 &&
        this._events[type].length > this._maxListeners
      ) {
        this._events[type].warned = true;
        logPossibleMemoryLeak.call(this, this._events[type].length, type);
      }
    }

    return returnValue;
  };

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
      if(!leafs) return this;
    } else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        if (this._removeListener)
          this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
        if (this._removeListener)
          this.emit("removeListener", type, listener);
      }
    }

    this.listenerTree && recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          if (this._removeListener)
            this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      if (this._removeListener) {
        for(i = 0, l = fns.length; i < l; i++)
          this.emit("removeListenerAny", fns[i]);
      }
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function (type) {
    if (type === undefined) {
      !this._events || init.call(this);
      return this;
    }

    if (this.wildcard) {
      var leafs = searchListenerTree.call(this, null, type, this.listenerTree, 0), leaf, i;
      if (!leafs) return this;
      for (i = 0; i < leafs.length; i++) {
        leaf = leafs[i];
        leaf._listeners = null;
      }
      this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
    } else if (this._events) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function (type) {
    var _events = this._events;
    var keys, listeners, allListeners;
    var i;
    var listenerTree;

    if (type === undefined) {
      if (this.wildcard) {
        throw Error('event name required for wildcard emitter');
      }

      if (!_events) {
        return [];
      }

      keys = ownKeys(_events);
      i = keys.length;
      allListeners = [];
      while (i-- > 0) {
        listeners = _events[keys[i]];
        if (typeof listeners === 'function') {
          allListeners.push(listeners);
        } else {
          allListeners.push.apply(allListeners, listeners);
        }
      }
      return allListeners;
    } else {
      if (this.wildcard) {
        listenerTree= this.listenerTree;
        if(!listenerTree) return [];
        var handlers = [];
        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
        searchListenerTree.call(this, handlers, ns, listenerTree, 0);
        return handlers;
      }

      if (!_events) {
        return [];
      }

      listeners = _events[type];

      if (!listeners) {
        return [];
      }
      return typeof listeners === 'function' ? [listeners] : listeners;
    }
  };

  EventEmitter.prototype.eventNames = function(nsAsArray){
    var _events= this._events;
    return this.wildcard? collectTreeEvents.call(this, this.listenerTree, [], null, nsAsArray) : (_events? ownKeys(_events) : []);
  };

  EventEmitter.prototype.listenerCount = function(type) {
    return this.listeners(type).length;
  };

  EventEmitter.prototype.hasListeners = function (type) {
    if (this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers.length > 0;
    }

    var _events = this._events;
    var _all = this._all;

    return !!(_all && _all.length || _events && (type === undefined ? ownKeys(_events).length : _events[type]));
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  EventEmitter.prototype.waitFor = function (event, options) {
    var self = this;
    var type = typeof options;
    if (type === 'number') {
      options = {timeout: options};
    } else if (type === 'function') {
      options = {filter: options};
    }

    options= resolveOptions(options, {
      timeout: 0,
      filter: undefined,
      handleError: false,
      Promise: Promise,
      overload: false
    }, {
      filter: functionReducer,
      Promise: constructorReducer
    });

    return makeCancelablePromise(options.Promise, function (resolve, reject, onCancel) {
      function listener() {
        var filter= options.filter;
        if (filter && !filter.apply(self, arguments)) {
          return;
        }
        self.off(event, listener);
        if (options.handleError) {
          var err = arguments[0];
          err ? reject(err) : resolve(toArray.apply(null, arguments).slice(1));
        } else {
          resolve(toArray.apply(null, arguments));
        }
      }

      onCancel(function(){
        self.off(event, listener);
      });

      self._on(event, listener, false);
    }, {
      timeout: options.timeout,
      overload: options.overload
    })
  };

  function once(emitter, name, options) {
    options= resolveOptions(options, {
      Promise: Promise,
      timeout: 0,
      overload: false
    }, {
      Promise: constructorReducer
    });

    var _Promise= options.Promise;

    return makeCancelablePromise(_Promise, function(resolve, reject, onCancel){
      var handler;
      if (typeof emitter.addEventListener === 'function') {
        handler=  function () {
          resolve(toArray.apply(null, arguments));
        };

        onCancel(function(){
          emitter.removeEventListener(name, handler);
        });

        emitter.addEventListener(
            name,
            handler,
            {once: true}
        );
        return;
      }

      var eventListener = function(){
        errorListener && emitter.removeListener('error', errorListener);
        resolve(toArray.apply(null, arguments));
      };

      var errorListener;

      if (name !== 'error') {
        errorListener = function (err){
          emitter.removeListener(name, eventListener);
          reject(err);
        };

        emitter.once('error', errorListener);
      }

      onCancel(function(){
        errorListener && emitter.removeListener('error', errorListener);
        emitter.removeListener(name, eventListener);
      });

      emitter.once(name, eventListener);
    }, {
      timeout: options.timeout,
      overload: options.overload
    });
  }

  var prototype= EventEmitter.prototype;

  Object.defineProperties(EventEmitter, {
    defaultMaxListeners: {
      get: function () {
        return prototype._maxListeners;
      },
      set: function (n) {
        if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
          throw TypeError('n must be a non-negative number')
        }
        prototype._maxListeners = n;
      },
      enumerable: true
    },
    once: {
      value: once,
      writable: true,
      configurable: true
    }
  });

  Object.defineProperties(prototype, {
      _maxListeners: {
          value: defaultMaxListeners,
          writable: true,
          configurable: true
      },
      _observers: {value: null, writable: true, configurable: true}
  });

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // global for any kind of environment.
    var _global= new Function('','return this')();
    _global.EventEmitter2 = EventEmitter;
  }
}();

},{"process":"../node_modules/process/browser.js"}],"../node_modules/roslib/src/core/Service.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var ServiceResponse = require('./ServiceResponse');
var ServiceRequest = require('./ServiceRequest');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * A ROS service client.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.name - The service name, like '/add_two_ints'.
 * @param {string} options.serviceType - The service type, like 'rospy_tutorials/AddTwoInts'.
 */
function Service(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
  this.serviceType = options.serviceType;
  this.isAdvertised = false;
  this._serviceCallback = null;
}
Service.prototype.__proto__ = EventEmitter2.prototype;
/**
 * Call the service. Returns the service response in the
 * callback. Does nothing if this service is currently advertised.
 *
 * @param {ServiceRequest} request - The ROSLIB.ServiceRequest to send.
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.response - The response from the service request.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Service.prototype.callService = function (request, callback, failedCallback) {
  if (this.isAdvertised) {
    return;
  }
  var serviceCallId = 'call_service:' + this.name + ':' + ++this.ros.idCounter;
  if (callback || failedCallback) {
    this.ros.once(serviceCallId, function (message) {
      if (message.result !== undefined && message.result === false) {
        if (typeof failedCallback === 'function') {
          failedCallback(message.values);
        }
      } else if (typeof callback === 'function') {
        callback(new ServiceResponse(message.values));
      }
    });
  }
  var call = {
    op: 'call_service',
    id: serviceCallId,
    service: this.name,
    type: this.serviceType,
    args: request
  };
  this.ros.callOnConnection(call);
};

/**
 * Advertise the service. This turns the Service object from a client
 * into a server. The callback will be called with every request
 * that's made on this service.
 *
 * @param {function} callback - This works similarly to the callback for a C++ service and should take the following params:
 * @param {ServiceRequest} callback.request - The service request.
 * @param {Object} callback.response - An empty dictionary. Take care not to overwrite this. Instead, only modify the values within.
 *     It should return true if the service has finished successfully,
 *     i.e., without any fatal errors.
 */
Service.prototype.advertise = function (callback) {
  if (this.isAdvertised || typeof callback !== 'function') {
    return;
  }
  this._serviceCallback = callback;
  this.ros.on(this.name, this._serviceResponse.bind(this));
  this.ros.callOnConnection({
    op: 'advertise_service',
    type: this.serviceType,
    service: this.name
  });
  this.isAdvertised = true;
};
Service.prototype.unadvertise = function () {
  if (!this.isAdvertised) {
    return;
  }
  this.ros.callOnConnection({
    op: 'unadvertise_service',
    service: this.name
  });
  this.isAdvertised = false;
};
Service.prototype._serviceResponse = function (rosbridgeRequest) {
  var response = {};
  var success = this._serviceCallback(rosbridgeRequest.args, response);
  var call = {
    op: 'service_response',
    service: this.name,
    values: new ServiceResponse(response),
    result: success
  };
  if (rosbridgeRequest.id) {
    call.id = rosbridgeRequest.id;
  }
  this.ros.callOnConnection(call);
};
module.exports = Service;
},{"./ServiceResponse":"../node_modules/roslib/src/core/ServiceResponse.js","./ServiceRequest":"../node_modules/roslib/src/core/ServiceRequest.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/core/Ros.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var WebSocket = require('ws');
var WorkerSocket = require('../util/workerSocket');
var socketAdapter = require('./SocketAdapter.js');
var Service = require('./Service');
var ServiceRequest = require('./ServiceRequest');
var assign = require('object-assign');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *  * 'error' - There was an error with ROS.
 *  * 'connection' - Connected to the WebSocket server.
 *  * 'close' - Disconnected to the WebSocket server.
 *  * &#60;topicName&#62; - A message came from rosbridge with the given topic name.
 *  * &#60;serviceID&#62; - A service response came from rosbridge with the given ID.
 *
 * @constructor
 * @param {Object} options
 * @param {string} [options.url] - The WebSocket URL for rosbridge or the node server URL to connect using socket.io (if socket.io exists in the page). Can be specified later with `connect`.
 * @param {boolean} [options.groovyCompatibility=true] - Don't use interfaces that changed after the last groovy release or rosbridge_suite and related tools.
 * @param {string} [options.transportLibrary=websocket] - One of 'websocket', 'workersocket', 'socket.io' or RTCPeerConnection instance controlling how the connection is created in `connect`.
 * @param {Object} [options.transportOptions={}] - The options to use when creating a connection. Currently only used if `transportLibrary` is RTCPeerConnection.
 */
function Ros(options) {
  options = options || {};
  var that = this;
  this.socket = null;
  this.idCounter = 0;
  this.isConnected = false;
  this.transportLibrary = options.transportLibrary || 'websocket';
  this.transportOptions = options.transportOptions || {};
  this._sendFunc = function (msg) {
    that.sendEncodedMessage(msg);
  };
  if (typeof options.groovyCompatibility === 'undefined') {
    this.groovyCompatibility = true;
  } else {
    this.groovyCompatibility = options.groovyCompatibility;
  }

  // Sets unlimited event listeners.
  this.setMaxListeners(0);

  // begin by checking if a URL was given
  if (options.url) {
    this.connect(options.url);
  }
}
Ros.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Connect to the specified WebSocket.
 *
 * @param {string} url - WebSocket URL or RTCDataChannel label for rosbridge.
 */
Ros.prototype.connect = function (url) {
  if (this.transportLibrary === 'socket.io') {
    this.socket = assign(io(url, {
      'force new connection': true
    }), socketAdapter(this));
    this.socket.on('connect', this.socket.onopen);
    this.socket.on('data', this.socket.onmessage);
    this.socket.on('close', this.socket.onclose);
    this.socket.on('error', this.socket.onerror);
  } else if (this.transportLibrary.constructor.name === 'RTCPeerConnection') {
    this.socket = assign(this.transportLibrary.createDataChannel(url, this.transportOptions), socketAdapter(this));
  } else if (this.transportLibrary === 'websocket') {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      var sock = new WebSocket(url);
      sock.binaryType = 'arraybuffer';
      this.socket = assign(sock, socketAdapter(this));
    }
  } else if (this.transportLibrary === 'workersocket') {
    this.socket = assign(new WorkerSocket(url), socketAdapter(this));
  } else {
    throw 'Unknown transportLibrary: ' + this.transportLibrary.toString();
  }
};

/**
 * Disconnect from the WebSocket server.
 */
Ros.prototype.close = function () {
  if (this.socket) {
    this.socket.close();
  }
};

/**
 * Send an authorization request to the server.
 *
 * @param {string} mac - MAC (hash) string given by the trusted source.
 * @param {string} client - IP of the client.
 * @param {string} dest - IP of the destination.
 * @param {string} rand - Random string given by the trusted source.
 * @param {Object} t - Time of the authorization request.
 * @param {string} level - User level as a string given by the client.
 * @param {Object} end - End time of the client's session.
 */
Ros.prototype.authenticate = function (mac, client, dest, rand, t, level, end) {
  // create the request
  var auth = {
    op: 'auth',
    mac: mac,
    client: client,
    dest: dest,
    rand: rand,
    t: t,
    level: level,
    end: end
  };
  // send the request
  this.callOnConnection(auth);
};

/**
 * Send an encoded message over the WebSocket.
 *
 * @param {Object} messageEncoded - The encoded message to be sent.
 */
Ros.prototype.sendEncodedMessage = function (messageEncoded) {
  var emitter = null;
  var that = this;
  if (this.transportLibrary === 'socket.io') {
    emitter = function (msg) {
      that.socket.emit('operation', msg);
    };
  } else {
    emitter = function (msg) {
      that.socket.send(msg);
    };
  }
  if (!this.isConnected) {
    that.once('connection', function () {
      emitter(messageEncoded);
    });
  } else {
    emitter(messageEncoded);
  }
};

/**
 * Send the message over the WebSocket, but queue the message up if not yet
 * connected.
 *
 * @param {Object} message - The message to be sent.
 */
Ros.prototype.callOnConnection = function (message) {
  if (this.transportOptions.encoder) {
    this.transportOptions.encoder(message, this._sendFunc);
  } else {
    this._sendFunc(JSON.stringify(message));
  }
};

/**
 * Send a set_level request to the server.
 *
 * @param {string} level - Status level (none, error, warning, info).
 * @param {number} [id] - Operation ID to change status level on.
 */
Ros.prototype.setStatusLevel = function (level, id) {
  var levelMsg = {
    op: 'set_level',
    level: level,
    id: id
  };
  this.callOnConnection(levelMsg);
};

/**
 * Retrieve a list of action servers in ROS as an array of string.
 *
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.actionservers - Array of action server names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getActionServers = function (callback, failedCallback) {
  var getActionServers = new Service({
    ros: this,
    name: '/rosapi/action_servers',
    serviceType: 'rosapi/GetActionServers'
  });
  var request = new ServiceRequest({});
  if (typeof failedCallback === 'function') {
    getActionServers.callService(request, function (result) {
      callback(result.action_servers);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    getActionServers.callService(request, function (result) {
      callback(result.action_servers);
    });
  }
};

/**
 * Retrieve a list of topics in ROS as an array.
 *
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.result - The result object with the following params:
 * @param {string[]} callback.result.topics - Array of topic names.
 * @param {string[]} callback.result.types - Array of message type names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getTopics = function (callback, failedCallback) {
  var topicsClient = new Service({
    ros: this,
    name: '/rosapi/topics',
    serviceType: 'rosapi/Topics'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function') {
    topicsClient.callService(request, function (result) {
      callback(result);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    topicsClient.callService(request, function (result) {
      callback(result);
    });
  }
};

/**
 * Retrieve a list of topics in ROS as an array of a specific type.
 *
 * @param {string} topicType - The topic type to find.
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.topics - Array of topic names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getTopicsForType = function (topicType, callback, failedCallback) {
  var topicsForTypeClient = new Service({
    ros: this,
    name: '/rosapi/topics_for_type',
    serviceType: 'rosapi/TopicsForType'
  });
  var request = new ServiceRequest({
    type: topicType
  });
  if (typeof failedCallback === 'function') {
    topicsForTypeClient.callService(request, function (result) {
      callback(result.topics);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    topicsForTypeClient.callService(request, function (result) {
      callback(result.topics);
    });
  }
};

/**
 * Retrieve a list of active service names in ROS.
 *
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.services - Array of service names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getServices = function (callback, failedCallback) {
  var servicesClient = new Service({
    ros: this,
    name: '/rosapi/services',
    serviceType: 'rosapi/Services'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function') {
    servicesClient.callService(request, function (result) {
      callback(result.services);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    servicesClient.callService(request, function (result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieve a list of services in ROS as an array as specific type.
 *
 * @param {string} serviceType - The service type to find.
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.topics - Array of service names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getServicesForType = function (serviceType, callback, failedCallback) {
  var servicesForTypeClient = new Service({
    ros: this,
    name: '/rosapi/services_for_type',
    serviceType: 'rosapi/ServicesForType'
  });
  var request = new ServiceRequest({
    type: serviceType
  });
  if (typeof failedCallback === 'function') {
    servicesForTypeClient.callService(request, function (result) {
      callback(result.services);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    servicesForTypeClient.callService(request, function (result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieve the details of a ROS service request.
 *
 * @param {string} type - The type of the service.
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.result - The result object with the following params:
 * @param {string[]} callback.result.typedefs - An array containing the details of the service request.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getServiceRequestDetails = function (type, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros: this,
    name: '/rosapi/service_request_details',
    serviceType: 'rosapi/ServiceRequestDetails'
  });
  var request = new ServiceRequest({
    type: type
  });
  if (typeof failedCallback === 'function') {
    serviceTypeClient.callService(request, function (result) {
      callback(result);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    serviceTypeClient.callService(request, function (result) {
      callback(result);
    });
  }
};

/**
 * Retrieve the details of a ROS service response.
 *
 * @param {string} type - The type of the service.
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.result - The result object with the following params:
 * @param {string[]} callback.result.typedefs - An array containing the details of the service response.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getServiceResponseDetails = function (type, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros: this,
    name: '/rosapi/service_response_details',
    serviceType: 'rosapi/ServiceResponseDetails'
  });
  var request = new ServiceRequest({
    type: type
  });
  if (typeof failedCallback === 'function') {
    serviceTypeClient.callService(request, function (result) {
      callback(result);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    serviceTypeClient.callService(request, function (result) {
      callback(result);
    });
  }
};

/**
 * Retrieve a list of active node names in ROS.
 *
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.nodes - Array of node names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getNodes = function (callback, failedCallback) {
  var nodesClient = new Service({
    ros: this,
    name: '/rosapi/nodes',
    serviceType: 'rosapi/Nodes'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function') {
    nodesClient.callService(request, function (result) {
      callback(result.nodes);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    nodesClient.callService(request, function (result) {
      callback(result.nodes);
    });
  }
};

/**
 * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
 * <br>
 * These are the parameters if failedCallback is <strong>defined</strong>.
 *
 * @param {string} node - Name of the node.
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.subscriptions - Array of subscribed topic names.
 * @param {string[]} callback.publications - Array of published topic names.
 * @param {string[]} callback.services - Array of service names hosted.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 *
 * @also
 *
 * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
 * <br>
 * These are the parameters if failedCallback is <strong>undefined</strong>.
 *
 * @param {string} node - Name of the node.
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.result - The result object with the following params:
 * @param {string[]} callback.result.subscribing - Array of subscribed topic names.
 * @param {string[]} callback.result.publishing - Array of published topic names.
 * @param {string[]} callback.result.services - Array of service names hosted.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getNodeDetails = function (node, callback, failedCallback) {
  var nodesClient = new Service({
    ros: this,
    name: '/rosapi/node_details',
    serviceType: 'rosapi/NodeDetails'
  });
  var request = new ServiceRequest({
    node: node
  });
  if (typeof failedCallback === 'function') {
    nodesClient.callService(request, function (result) {
      callback(result.subscribing, result.publishing, result.services);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    nodesClient.callService(request, function (result) {
      callback(result);
    });
  }
};

/**
 * Retrieve a list of parameter names from the ROS Parameter Server.
 *
 * @param {function} callback - Function with the following params:
 * @param {string[]} callback.params - Array of param names.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getParams = function (callback, failedCallback) {
  var paramsClient = new Service({
    ros: this,
    name: '/rosapi/get_param_names',
    serviceType: 'rosapi/GetParamNames'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function') {
    paramsClient.callService(request, function (result) {
      callback(result.names);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    paramsClient.callService(request, function (result) {
      callback(result.names);
    });
  }
};

/**
 * Retrieve the type of a ROS topic.
 *
 * @param {string} topic - Name of the topic.
 * @param {function} callback - Function with the following params:
 * @param {string} callback.type - The type of the topic.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getTopicType = function (topic, callback, failedCallback) {
  var topicTypeClient = new Service({
    ros: this,
    name: '/rosapi/topic_type',
    serviceType: 'rosapi/TopicType'
  });
  var request = new ServiceRequest({
    topic: topic
  });
  if (typeof failedCallback === 'function') {
    topicTypeClient.callService(request, function (result) {
      callback(result.type);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    topicTypeClient.callService(request, function (result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieve the type of a ROS service.
 *
 * @param {string} service - Name of the service.
 * @param {function} callback - Function with the following params:
 * @param {string} callback.type - The type of the service.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getServiceType = function (service, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros: this,
    name: '/rosapi/service_type',
    serviceType: 'rosapi/ServiceType'
  });
  var request = new ServiceRequest({
    service: service
  });
  if (typeof failedCallback === 'function') {
    serviceTypeClient.callService(request, function (result) {
      callback(result.type);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    serviceTypeClient.callService(request, function (result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieve the details of a ROS message.
 *
 * @param {string} message - The name of the message type.
 * @param {function} callback - Function with the following params:
 * @param {string} callback.details - An array of the message details.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getMessageDetails = function (message, callback, failedCallback) {
  var messageDetailClient = new Service({
    ros: this,
    name: '/rosapi/message_details',
    serviceType: 'rosapi/MessageDetails'
  });
  var request = new ServiceRequest({
    type: message
  });
  if (typeof failedCallback === 'function') {
    messageDetailClient.callService(request, function (result) {
      callback(result.typedefs);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    messageDetailClient.callService(request, function (result) {
      callback(result.typedefs);
    });
  }
};

/**
 * Decode a typedef array into a dictionary like `rosmsg show foo/bar`.
 *
 * @param {Object[]} defs - Array of type_def dictionary.
 */
Ros.prototype.decodeTypeDefs = function (defs) {
  var that = this;
  var decodeTypeDefsRec = function (theType, hints) {
    // calls itself recursively to resolve type definition using hints.
    var typeDefDict = {};
    for (var i = 0; i < theType.fieldnames.length; i++) {
      var arrayLen = theType.fieldarraylen[i];
      var fieldName = theType.fieldnames[i];
      var fieldType = theType.fieldtypes[i];
      if (fieldType.indexOf('/') === -1) {
        // check the fieldType includes '/' or not
        if (arrayLen === -1) {
          typeDefDict[fieldName] = fieldType;
        } else {
          typeDefDict[fieldName] = [fieldType];
        }
      } else {
        // lookup the name
        var sub = false;
        for (var j = 0; j < hints.length; j++) {
          if (hints[j].type.toString() === fieldType.toString()) {
            sub = hints[j];
            break;
          }
        }
        if (sub) {
          var subResult = decodeTypeDefsRec(sub, hints);
          if (arrayLen === -1) {
            typeDefDict[fieldName] = subResult; // add this decoding result to dictionary
          } else {
            typeDefDict[fieldName] = [subResult];
          }
        } else {
          that.emit('error', 'Cannot find ' + fieldType + ' in decodeTypeDefs');
        }
      }
    }
    return typeDefDict;
  };
  return decodeTypeDefsRec(defs[0], defs);
};

/**
 * Retrieve a list of topics and their associated type definitions.
 *
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.result - The result object with the following params:
 * @param {string[]} callback.result.topics - Array of topic names.
 * @param {string[]} callback.result.types - Array of message type names.
 * @param {string[]} callback.result.typedefs_full_text - Array of full definitions of message types, similar to `gendeps --cat`.
 * @param {function} [failedCallback] - The callback function when the service call failed with params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Ros.prototype.getTopicsAndRawTypes = function (callback, failedCallback) {
  var topicsAndRawTypesClient = new Service({
    ros: this,
    name: '/rosapi/topics_and_raw_types',
    serviceType: 'rosapi/TopicsAndRawTypes'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function') {
    topicsAndRawTypesClient.callService(request, function (result) {
      callback(result);
    }, function (message) {
      failedCallback(message);
    });
  } else {
    topicsAndRawTypesClient.callService(request, function (result) {
      callback(result);
    });
  }
};
module.exports = Ros;
},{"ws":"../node_modules/roslib/src/util/shim/WebSocket.js","../util/workerSocket":"../node_modules/roslib/src/util/workerSocket.js","./SocketAdapter.js":"../node_modules/roslib/src/core/SocketAdapter.js","./Service":"../node_modules/roslib/src/core/Service.js","./ServiceRequest":"../node_modules/roslib/src/core/ServiceRequest.js","object-assign":"../node_modules/object-assign/index.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/core/Message.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var assign = require('object-assign');

/**
 * Message objects are used for publishing and subscribing to and from topics.
 *
 * @constructor
 * @param {Object} values - An object matching the fields defined in the .msg definition file.
 */
function Message(values) {
  assign(this, values);
}
module.exports = Message;
},{"object-assign":"../node_modules/object-assign/index.js"}],"../node_modules/roslib/src/core/Topic.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Message = require('./Message');

/**
 * Publish and/or subscribe to a topic in ROS.
 *
 * Emits the following events:
 *  * 'warning' - If there are any warning during the Topic creation.
 *  * 'message' - The message data from rosbridge.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.name - The topic name, like '/cmd_vel'.
 * @param {string} options.messageType - The message type, like 'std_msgs/String'.
 * @param {string} [options.compression=none] - The type of compression to use, like 'png', 'cbor', or 'cbor-raw'.
 * @param {number} [options.throttle_rate=0] - The rate (in ms in between messages) at which to throttle the topics.
 * @param {number} [options.queue_size=100] - The queue created at bridge side for re-publishing webtopics.
 * @param {boolean} [options.latch=false] - Latch the topic when publishing.
 * @param {number} [options.queue_length=0] - The queue length at bridge side used when subscribing.
 * @param {boolean} [options.reconnect_on_close=true] - The flag to enable resubscription and readvertisement on close event.
 */
function Topic(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
  this.messageType = options.messageType;
  this.isAdvertised = false;
  this.compression = options.compression || 'none';
  this.throttle_rate = options.throttle_rate || 0;
  this.latch = options.latch || false;
  this.queue_size = options.queue_size || 100;
  this.queue_length = options.queue_length || 0;
  this.reconnect_on_close = options.reconnect_on_close !== undefined ? options.reconnect_on_close : true;

  // Check for valid compression types
  if (this.compression && this.compression !== 'png' && this.compression !== 'cbor' && this.compression !== 'cbor-raw' && this.compression !== 'none') {
    this.emit('warning', this.compression + ' compression is not supported. No compression will be used.');
    this.compression = 'none';
  }

  // Check if throttle rate is negative
  if (this.throttle_rate < 0) {
    this.emit('warning', this.throttle_rate + ' is not allowed. Set to 0');
    this.throttle_rate = 0;
  }
  var that = this;
  if (this.reconnect_on_close) {
    this.callForSubscribeAndAdvertise = function (message) {
      that.ros.callOnConnection(message);
      that.waitForReconnect = false;
      that.reconnectFunc = function () {
        if (!that.waitForReconnect) {
          that.waitForReconnect = true;
          that.ros.callOnConnection(message);
          that.ros.once('connection', function () {
            that.waitForReconnect = false;
          });
        }
      };
      that.ros.on('close', that.reconnectFunc);
    };
  } else {
    this.callForSubscribeAndAdvertise = this.ros.callOnConnection;
  }
  this._messageCallback = function (data) {
    that.emit('message', new Message(data));
  };
}
Topic.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Every time a message is published for the given topic, the callback
 * will be called with the message object.
 *
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.message - The published message.
 */
Topic.prototype.subscribe = function (callback) {
  if (typeof callback === 'function') {
    this.on('message', callback);
  }
  if (this.subscribeId) {
    return;
  }
  this.ros.on(this.name, this._messageCallback);
  this.subscribeId = 'subscribe:' + this.name + ':' + ++this.ros.idCounter;
  this.callForSubscribeAndAdvertise({
    op: 'subscribe',
    id: this.subscribeId,
    type: this.messageType,
    topic: this.name,
    compression: this.compression,
    throttle_rate: this.throttle_rate,
    queue_length: this.queue_length
  });
};

/**
 * Unregister as a subscriber for the topic. Unsubscribing will stop
 * and remove all subscribe callbacks. To remove a callback, you must
 * explicitly pass the callback function in.
 *
 * @param {function} [callback] - The callback to unregister, if
 *     provided and other listeners are registered the topic won't
 *     unsubscribe, just stop emitting to the passed listener.
 */
Topic.prototype.unsubscribe = function (callback) {
  if (callback) {
    this.off('message', callback);
    // If there is any other callbacks still subscribed don't unsubscribe
    if (this.listeners('message').length) {
      return;
    }
  }
  if (!this.subscribeId) {
    return;
  }
  // Note: Don't call this.removeAllListeners, allow client to handle that themselves
  this.ros.off(this.name, this._messageCallback);
  if (this.reconnect_on_close) {
    this.ros.off('close', this.reconnectFunc);
  }
  this.emit('unsubscribe');
  this.ros.callOnConnection({
    op: 'unsubscribe',
    id: this.subscribeId,
    topic: this.name
  });
  this.subscribeId = null;
};

/**
 * Register as a publisher for the topic.
 */
Topic.prototype.advertise = function () {
  if (this.isAdvertised) {
    return;
  }
  this.advertiseId = 'advertise:' + this.name + ':' + ++this.ros.idCounter;
  this.callForSubscribeAndAdvertise({
    op: 'advertise',
    id: this.advertiseId,
    type: this.messageType,
    topic: this.name,
    latch: this.latch,
    queue_size: this.queue_size
  });
  this.isAdvertised = true;
  if (!this.reconnect_on_close) {
    var that = this;
    this.ros.on('close', function () {
      that.isAdvertised = false;
    });
  }
};

/**
 * Unregister as a publisher for the topic.
 */
Topic.prototype.unadvertise = function () {
  if (!this.isAdvertised) {
    return;
  }
  if (this.reconnect_on_close) {
    this.ros.off('close', this.reconnectFunc);
  }
  this.emit('unadvertise');
  this.ros.callOnConnection({
    op: 'unadvertise',
    id: this.advertiseId,
    topic: this.name
  });
  this.isAdvertised = false;
};

/**
 * Publish the message.
 *
 * @param {Message} message - A ROSLIB.Message object.
 */
Topic.prototype.publish = function (message) {
  if (!this.isAdvertised) {
    this.advertise();
  }
  this.ros.idCounter++;
  var call = {
    op: 'publish',
    id: 'publish:' + this.name + ':' + this.ros.idCounter,
    topic: this.name,
    msg: message,
    latch: this.latch
  };
  this.ros.callOnConnection(call);
};
module.exports = Topic;
},{"eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js","./Message":"../node_modules/roslib/src/core/Message.js"}],"../node_modules/roslib/src/core/Param.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var Service = require('./Service');
var ServiceRequest = require('./ServiceRequest');

/**
 * A ROS parameter.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.name - The param name, like max_vel_x.
 */
function Param(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
}

/**
 * Fetch the value of the param.
 *
 * @param {function} callback - Function with the following params:
 * @param {Object} callback.value - The value of the param from ROS.
 * @param {function} [failedCallback] - Function when the service call failed with the following params:
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Param.prototype.get = function (callback, failedCallback) {
  var paramClient = new Service({
    ros: this.ros,
    name: '/rosapi/get_param',
    serviceType: 'rosapi/GetParam'
  });
  var request = new ServiceRequest({
    name: this.name
  });
  paramClient.callService(request, function (result) {
    var value = JSON.parse(result.value);
    callback(value);
  }, failedCallback);
};

/**
 * Set the value of the param in ROS.
 *
 * @param {Object} value - The value to set param to.
 * @param {function} [callback] - The callback function.
 * @param {function} [failedCallback] - The callback function when the service call failed.
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Param.prototype.set = function (value, callback, failedCallback) {
  var paramClient = new Service({
    ros: this.ros,
    name: '/rosapi/set_param',
    serviceType: 'rosapi/SetParam'
  });
  var request = new ServiceRequest({
    name: this.name,
    value: JSON.stringify(value)
  });
  paramClient.callService(request, callback, failedCallback);
};

/**
 * Delete this parameter on the ROS server.
 *
 * @param {function} [callback] - The callback function when the service call succeeded.
 * @param {function} [failedCallback] - The callback function when the service call failed.
 * @param {string} failedCallback.error - The error message reported by ROS.
 */
Param.prototype.delete = function (callback, failedCallback) {
  var paramClient = new Service({
    ros: this.ros,
    name: '/rosapi/delete_param',
    serviceType: 'rosapi/DeleteParam'
  });
  var request = new ServiceRequest({
    name: this.name
  });
  paramClient.callService(request, callback, failedCallback);
};
module.exports = Param;
},{"./Service":"../node_modules/roslib/src/core/Service.js","./ServiceRequest":"../node_modules/roslib/src/core/ServiceRequest.js"}],"../node_modules/roslib/src/core/index.js":[function(require,module,exports) {
var mixin = require('../mixin');
var core = module.exports = {
  Ros: require('./Ros'),
  Topic: require('./Topic'),
  Message: require('./Message'),
  Param: require('./Param'),
  Service: require('./Service'),
  ServiceRequest: require('./ServiceRequest'),
  ServiceResponse: require('./ServiceResponse')
};
mixin(core.Ros, ['Param', 'Service', 'Topic'], core);
},{"../mixin":"../node_modules/roslib/src/mixin.js","./Ros":"../node_modules/roslib/src/core/Ros.js","./Topic":"../node_modules/roslib/src/core/Topic.js","./Message":"../node_modules/roslib/src/core/Message.js","./Param":"../node_modules/roslib/src/core/Param.js","./Service":"../node_modules/roslib/src/core/Service.js","./ServiceRequest":"../node_modules/roslib/src/core/ServiceRequest.js","./ServiceResponse":"../node_modules/roslib/src/core/ServiceResponse.js"}],"../node_modules/roslib/src/actionlib/ActionClient.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action client.
 *
 * Emits the following events:
 *  * 'timeout' - If a timeout occurred while sending a goal.
 *  * 'status' - The status messages received from the action server.
 *  * 'feedback' - The feedback messages received from the action server.
 *  * 'result' - The result returned from the action server.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.serverName - The action server name, like '/fibonacci'.
 * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
 * @param {number} [options.timeout] - The timeout length when connecting to the action server.
 * @param {boolean} [options.omitFeedback] - The flag to indicate whether to omit the feedback channel or not.
 * @param {boolean} [options.omitStatus] - The flag to indicate whether to omit the status channel or not.
 * @param {boolean} [options.omitResult] - The flag to indicate whether to omit the result channel or not.
 */
function ActionClient(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  this.serverName = options.serverName;
  this.actionName = options.actionName;
  this.timeout = options.timeout;
  this.omitFeedback = options.omitFeedback;
  this.omitStatus = options.omitStatus;
  this.omitResult = options.omitResult;
  this.goals = {};

  // flag to check if a status has been received
  var receivedStatus = false;

  // create the topics associated with actionlib
  this.feedbackListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/feedback',
    messageType: this.actionName + 'Feedback'
  });
  this.statusListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/status',
    messageType: 'actionlib_msgs/GoalStatusArray'
  });
  this.resultListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/result',
    messageType: this.actionName + 'Result'
  });
  this.goalTopic = new Topic({
    ros: this.ros,
    name: this.serverName + '/goal',
    messageType: this.actionName + 'Goal'
  });
  this.cancelTopic = new Topic({
    ros: this.ros,
    name: this.serverName + '/cancel',
    messageType: 'actionlib_msgs/GoalID'
  });

  // advertise the goal and cancel topics
  this.goalTopic.advertise();
  this.cancelTopic.advertise();

  // subscribe to the status topic
  if (!this.omitStatus) {
    this.statusListener.subscribe(function (statusMessage) {
      receivedStatus = true;
      statusMessage.status_list.forEach(function (status) {
        var goal = that.goals[status.goal_id.id];
        if (goal) {
          goal.emit('status', status);
        }
      });
    });
  }

  // subscribe the the feedback topic
  if (!this.omitFeedback) {
    this.feedbackListener.subscribe(function (feedbackMessage) {
      var goal = that.goals[feedbackMessage.status.goal_id.id];
      if (goal) {
        goal.emit('status', feedbackMessage.status);
        goal.emit('feedback', feedbackMessage.feedback);
      }
    });
  }

  // subscribe to the result topic
  if (!this.omitResult) {
    this.resultListener.subscribe(function (resultMessage) {
      var goal = that.goals[resultMessage.status.goal_id.id];
      if (goal) {
        goal.emit('status', resultMessage.status);
        goal.emit('result', resultMessage.result);
      }
    });
  }

  // If timeout specified, emit a 'timeout' event if the action server does not respond
  if (this.timeout) {
    setTimeout(function () {
      if (!receivedStatus) {
        that.emit('timeout');
      }
    }, this.timeout);
  }
}
ActionClient.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Cancel all goals associated with this ActionClient.
 */
ActionClient.prototype.cancel = function () {
  var cancelMessage = new Message();
  this.cancelTopic.publish(cancelMessage);
};

/**
 * Unsubscribe and unadvertise all topics associated with this ActionClient.
 */
ActionClient.prototype.dispose = function () {
  this.goalTopic.unadvertise();
  this.cancelTopic.unadvertise();
  if (!this.omitStatus) {
    this.statusListener.unsubscribe();
  }
  if (!this.omitFeedback) {
    this.feedbackListener.unsubscribe();
  }
  if (!this.omitResult) {
    this.resultListener.unsubscribe();
  }
};
module.exports = ActionClient;
},{"../core/Topic":"../node_modules/roslib/src/core/Topic.js","../core/Message":"../node_modules/roslib/src/core/Message.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/actionlib/ActionListener.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Justin Young - justin@oodar.com.au
 * @author Russell Toris - rctoris@wpi.edu
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action listener.
 *
 * Emits the following events:
 *  * 'status' - The status messages received from the action server.
 *  * 'feedback' - The feedback messages received from the action server.
 *  * 'result' - The result returned from the action server.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.serverName - The action server name, like '/fibonacci'.
 * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
 */
function ActionListener(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  this.serverName = options.serverName;
  this.actionName = options.actionName;

  // create the topics associated with actionlib
  var goalListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/goal',
    messageType: this.actionName + 'Goal'
  });
  var feedbackListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/feedback',
    messageType: this.actionName + 'Feedback'
  });
  var statusListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/status',
    messageType: 'actionlib_msgs/GoalStatusArray'
  });
  var resultListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/result',
    messageType: this.actionName + 'Result'
  });
  goalListener.subscribe(function (goalMessage) {
    that.emit('goal', goalMessage);
  });
  statusListener.subscribe(function (statusMessage) {
    statusMessage.status_list.forEach(function (status) {
      that.emit('status', status);
    });
  });
  feedbackListener.subscribe(function (feedbackMessage) {
    that.emit('status', feedbackMessage.status);
    that.emit('feedback', feedbackMessage.feedback);
  });

  // subscribe to the result topic
  resultListener.subscribe(function (resultMessage) {
    that.emit('status', resultMessage.status);
    that.emit('result', resultMessage.result);
  });
}
ActionListener.prototype.__proto__ = EventEmitter2.prototype;
module.exports = ActionListener;
},{"../core/Topic":"../node_modules/roslib/src/core/Topic.js","../core/Message":"../node_modules/roslib/src/core/Message.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/actionlib/Goal.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib goal that is associated with an action server.
 *
 * Emits the following events:
 *  * 'timeout' - If a timeout occurred while sending a goal.
 *
 * @constructor
 * @param {Object} options
 * @param {ActionClient} options.actionClient - The ROSLIB.ActionClient to use with this goal.
 * @param {Object} options.goalMessage - The JSON object containing the goal for the action server.
 */
function Goal(options) {
  var that = this;
  this.actionClient = options.actionClient;
  this.goalMessage = options.goalMessage;
  this.isFinished = false;

  // Used to create random IDs
  var date = new Date();

  // Create a random ID
  this.goalID = 'goal_' + Math.random() + '_' + date.getTime();
  // Fill in the goal message
  this.goalMessage = new Message({
    goal_id: {
      stamp: {
        secs: 0,
        nsecs: 0
      },
      id: this.goalID
    },
    goal: this.goalMessage
  });
  this.on('status', function (status) {
    that.status = status;
  });
  this.on('result', function (result) {
    that.isFinished = true;
    that.result = result;
  });
  this.on('feedback', function (feedback) {
    that.feedback = feedback;
  });

  // Add the goal
  this.actionClient.goals[this.goalID] = this;
}
Goal.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Send the goal to the action server.
 *
 * @param {number} [timeout] - A timeout length for the goal's result.
 */
Goal.prototype.send = function (timeout) {
  var that = this;
  that.actionClient.goalTopic.publish(that.goalMessage);
  if (timeout) {
    setTimeout(function () {
      if (!that.isFinished) {
        that.emit('timeout');
      }
    }, timeout);
  }
};

/**
 * Cancel the current goal.
 */
Goal.prototype.cancel = function () {
  var cancelMessage = new Message({
    id: this.goalID
  });
  this.actionClient.cancelTopic.publish(cancelMessage);
};
module.exports = Goal;
},{"../core/Message":"../node_modules/roslib/src/core/Message.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/actionlib/SimpleActionServer.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Laura Lindzey - lindzey@gmail.com
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action server client.
 *
 * Emits the following events:
 *  * 'goal' - Goal sent by action client.
 *  * 'cancel' - Action client has canceled the request.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} options.serverName - The action server name, like '/fibonacci'.
 * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
 */
function SimpleActionServer(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  this.serverName = options.serverName;
  this.actionName = options.actionName;

  // create and advertise publishers
  this.feedbackPublisher = new Topic({
    ros: this.ros,
    name: this.serverName + '/feedback',
    messageType: this.actionName + 'Feedback'
  });
  this.feedbackPublisher.advertise();
  var statusPublisher = new Topic({
    ros: this.ros,
    name: this.serverName + '/status',
    messageType: 'actionlib_msgs/GoalStatusArray'
  });
  statusPublisher.advertise();
  this.resultPublisher = new Topic({
    ros: this.ros,
    name: this.serverName + '/result',
    messageType: this.actionName + 'Result'
  });
  this.resultPublisher.advertise();

  // create and subscribe to listeners
  var goalListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/goal',
    messageType: this.actionName + 'Goal'
  });
  var cancelListener = new Topic({
    ros: this.ros,
    name: this.serverName + '/cancel',
    messageType: 'actionlib_msgs/GoalID'
  });

  // Track the goals and their status in order to publish status...
  this.statusMessage = new Message({
    header: {
      stamp: {
        secs: 0,
        nsecs: 100
      },
      frame_id: ''
    },
    status_list: []
  });

  // needed for handling preemption prompted by a new goal being received
  this.currentGoal = null; // currently tracked goal
  this.nextGoal = null; // the one that'll be preempting

  goalListener.subscribe(function (goalMessage) {
    if (that.currentGoal) {
      that.nextGoal = goalMessage;
      // needs to happen AFTER rest is set up
      that.emit('cancel');
    } else {
      that.statusMessage.status_list = [{
        goal_id: goalMessage.goal_id,
        status: 1
      }];
      that.currentGoal = goalMessage;
      that.emit('goal', goalMessage.goal);
    }
  });

  // helper function to determine ordering of timestamps
  // returns t1 < t2
  var isEarlier = function (t1, t2) {
    if (t1.secs > t2.secs) {
      return false;
    } else if (t1.secs < t2.secs) {
      return true;
    } else if (t1.nsecs < t2.nsecs) {
      return true;
    } else {
      return false;
    }
  };

  // TODO: this may be more complicated than necessary, since I'm
  // not sure if the callbacks can ever wind up with a scenario
  // where we've been preempted by a next goal, it hasn't finished
  // processing, and then we get a cancel message
  cancelListener.subscribe(function (cancelMessage) {
    // cancel ALL goals if both empty
    if (cancelMessage.stamp.secs === 0 && cancelMessage.stamp.secs === 0 && cancelMessage.id === '') {
      that.nextGoal = null;
      if (that.currentGoal) {
        that.emit('cancel');
      }
    } else {
      // treat id and stamp independently
      if (that.currentGoal && cancelMessage.id === that.currentGoal.goal_id.id) {
        that.emit('cancel');
      } else if (that.nextGoal && cancelMessage.id === that.nextGoal.goal_id.id) {
        that.nextGoal = null;
      }
      if (that.nextGoal && isEarlier(that.nextGoal.goal_id.stamp, cancelMessage.stamp)) {
        that.nextGoal = null;
      }
      if (that.currentGoal && isEarlier(that.currentGoal.goal_id.stamp, cancelMessage.stamp)) {
        that.emit('cancel');
      }
    }
  });

  // publish status at pseudo-fixed rate; required for clients to know they've connected
  var statusInterval = setInterval(function () {
    var currentTime = new Date();
    var secs = Math.floor(currentTime.getTime() / 1000);
    var nsecs = Math.round(1000000000 * (currentTime.getTime() / 1000 - secs));
    that.statusMessage.header.stamp.secs = secs;
    that.statusMessage.header.stamp.nsecs = nsecs;
    statusPublisher.publish(that.statusMessage);
  }, 500); // publish every 500ms
}
SimpleActionServer.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Set action state to succeeded and return to client.
 *
 * @param {Object} result - The result to return to the client.
 */
SimpleActionServer.prototype.setSucceeded = function (result) {
  var resultMessage = new Message({
    status: {
      goal_id: this.currentGoal.goal_id,
      status: 3
    },
    result: result
  });
  this.resultPublisher.publish(resultMessage);
  this.statusMessage.status_list = [];
  if (this.nextGoal) {
    this.currentGoal = this.nextGoal;
    this.nextGoal = null;
    this.emit('goal', this.currentGoal.goal);
  } else {
    this.currentGoal = null;
  }
};

/**
 * Set action state to aborted and return to client.
 *
 * @param {Object} result - The result to return to the client.
 */
SimpleActionServer.prototype.setAborted = function (result) {
  var resultMessage = new Message({
    status: {
      goal_id: this.currentGoal.goal_id,
      status: 4
    },
    result: result
  });
  this.resultPublisher.publish(resultMessage);
  this.statusMessage.status_list = [];
  if (this.nextGoal) {
    this.currentGoal = this.nextGoal;
    this.nextGoal = null;
    this.emit('goal', this.currentGoal.goal);
  } else {
    this.currentGoal = null;
  }
};

/**
 * Send a feedback message.
 *
 * @param {Object} feedback - The feedback to send to the client.
 */
SimpleActionServer.prototype.sendFeedback = function (feedback) {
  var feedbackMessage = new Message({
    status: {
      goal_id: this.currentGoal.goal_id,
      status: 1
    },
    feedback: feedback
  });
  this.feedbackPublisher.publish(feedbackMessage);
};

/**
 * Handle case where client requests preemption.
 */
SimpleActionServer.prototype.setPreempted = function () {
  this.statusMessage.status_list = [];
  var resultMessage = new Message({
    status: {
      goal_id: this.currentGoal.goal_id,
      status: 2
    }
  });
  this.resultPublisher.publish(resultMessage);
  if (this.nextGoal) {
    this.currentGoal = this.nextGoal;
    this.nextGoal = null;
    this.emit('goal', this.currentGoal.goal);
  } else {
    this.currentGoal = null;
  }
};
module.exports = SimpleActionServer;
},{"../core/Topic":"../node_modules/roslib/src/core/Topic.js","../core/Message":"../node_modules/roslib/src/core/Message.js","eventemitter2":"../node_modules/eventemitter2/lib/eventemitter2.js"}],"../node_modules/roslib/src/actionlib/index.js":[function(require,module,exports) {
var Ros = require('../core/Ros');
var mixin = require('../mixin');
var action = module.exports = {
  ActionClient: require('./ActionClient'),
  ActionListener: require('./ActionListener'),
  Goal: require('./Goal'),
  SimpleActionServer: require('./SimpleActionServer')
};
mixin(Ros, ['ActionClient', 'SimpleActionServer'], action);
},{"../core/Ros":"../node_modules/roslib/src/core/Ros.js","../mixin":"../node_modules/roslib/src/mixin.js","./ActionClient":"../node_modules/roslib/src/actionlib/ActionClient.js","./ActionListener":"../node_modules/roslib/src/actionlib/ActionListener.js","./Goal":"../node_modules/roslib/src/actionlib/Goal.js","./SimpleActionServer":"../node_modules/roslib/src/actionlib/SimpleActionServer.js"}],"../node_modules/roslib/src/math/Vector3.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David Gossow - dgossow@willowgarage.com
 */

/**
 * A 3D vector.
 *
 * @constructor
 * @param {Object} options
 * @param {number} [options.x=0] - The x value.
 * @param {number} [options.y=0] - The y value.
 * @param {number} [options.z=0] - The z value.
 */
function Vector3(options) {
  options = options || {};
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.z = options.z || 0;
}

/**
 * Set the values of this vector to the sum of itself and the given vector.
 *
 * @param {Vector3} v - The vector to add with.
 */
Vector3.prototype.add = function (v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
};

/**
 * Set the values of this vector to the difference of itself and the given vector.
 *
 * @param {Vector3} v - The vector to subtract with.
 */
Vector3.prototype.subtract = function (v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
};

/**
 * Multiply the given Quaternion with this vector.
 *
 * @param {Quaternion} q - The quaternion to multiply with.
 */
Vector3.prototype.multiplyQuaternion = function (q) {
  var ix = q.w * this.x + q.y * this.z - q.z * this.y;
  var iy = q.w * this.y + q.z * this.x - q.x * this.z;
  var iz = q.w * this.z + q.x * this.y - q.y * this.x;
  var iw = -q.x * this.x - q.y * this.y - q.z * this.z;
  this.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
  this.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
  this.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
};

/**
 * Clone a copy of this vector.
 *
 * @returns {Vector3} The cloned vector.
 */
Vector3.prototype.clone = function () {
  return new Vector3(this);
};
module.exports = Vector3;
},{}],"../node_modules/roslib/src/math/Quaternion.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David Gossow - dgossow@willowgarage.com
 */

/**
 * A Quaternion.
 *
 * @constructor
 * @param {Object} options
 * @param {number} [options.x=0] - The x value.
 * @param {number} [options.y=0] - The y value.
 * @param {number} [options.z=0] - The z value.
 * @param {number} [options.w=1] - The w value.
 */
function Quaternion(options) {
  options = options || {};
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.z = options.z || 0;
  this.w = typeof options.w === 'number' ? options.w : 1;
}

/**
 * Perform a conjugation on this quaternion.
 */
Quaternion.prototype.conjugate = function () {
  this.x *= -1;
  this.y *= -1;
  this.z *= -1;
};

/**
 * Return the norm of this quaternion.
 */
Quaternion.prototype.norm = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

/**
 * Perform a normalization on this quaternion.
 */
Quaternion.prototype.normalize = function () {
  var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  if (l === 0) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
  } else {
    l = 1 / l;
    this.x = this.x * l;
    this.y = this.y * l;
    this.z = this.z * l;
    this.w = this.w * l;
  }
};

/**
 * Convert this quaternion into its inverse.
 */
Quaternion.prototype.invert = function () {
  this.conjugate();
  this.normalize();
};

/**
 * Set the values of this quaternion to the product of itself and the given quaternion.
 *
 * @param {Quaternion} q - The quaternion to multiply with.
 */
Quaternion.prototype.multiply = function (q) {
  var newX = this.x * q.w + this.y * q.z - this.z * q.y + this.w * q.x;
  var newY = -this.x * q.z + this.y * q.w + this.z * q.x + this.w * q.y;
  var newZ = this.x * q.y - this.y * q.x + this.z * q.w + this.w * q.z;
  var newW = -this.x * q.x - this.y * q.y - this.z * q.z + this.w * q.w;
  this.x = newX;
  this.y = newY;
  this.z = newZ;
  this.w = newW;
};

/**
 * Clone a copy of this quaternion.
 *
 * @returns {Quaternion} The cloned quaternion.
 */
Quaternion.prototype.clone = function () {
  return new Quaternion(this);
};
module.exports = Quaternion;
},{}],"../node_modules/roslib/src/math/Pose.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');

/**
 * A Pose in 3D space. Values are copied into this object.
 *
 * @constructor
 * @param {Object} options
 * @param {Vector3} options.position - The ROSLIB.Vector3 describing the position.
 * @param {Quaternion} options.orientation - The ROSLIB.Quaternion describing the orientation.
 */
function Pose(options) {
  options = options || {};
  // copy the values into this object if they exist
  this.position = new Vector3(options.position);
  this.orientation = new Quaternion(options.orientation);
}

/**
 * Apply a transform against this pose.
 *
 * @param {Transform} tf - The transform to be applied.
 */
Pose.prototype.applyTransform = function (tf) {
  this.position.multiplyQuaternion(tf.rotation);
  this.position.add(tf.translation);
  var tmp = tf.rotation.clone();
  tmp.multiply(this.orientation);
  this.orientation = tmp;
};

/**
 * Clone a copy of this pose.
 *
 * @returns {Pose} The cloned pose.
 */
Pose.prototype.clone = function () {
  return new Pose(this);
};

/**
 * Multiply this pose with another pose without altering this pose.
 *
 * @returns {Pose} The result of the multiplication.
 */
Pose.prototype.multiply = function (pose) {
  var p = pose.clone();
  p.applyTransform({
    rotation: this.orientation,
    translation: this.position
  });
  return p;
};

/**
 * Compute the inverse of this pose.
 *
 * @returns {Pose} The inverse of the pose.
 */
Pose.prototype.getInverse = function () {
  var inverse = this.clone();
  inverse.orientation.invert();
  inverse.position.multiplyQuaternion(inverse.orientation);
  inverse.position.x *= -1;
  inverse.position.y *= -1;
  inverse.position.z *= -1;
  return inverse;
};
module.exports = Pose;
},{"./Vector3":"../node_modules/roslib/src/math/Vector3.js","./Quaternion":"../node_modules/roslib/src/math/Quaternion.js"}],"../node_modules/roslib/src/math/Transform.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');

/**
 * A Transform in 3-space. Values are copied into this object.
 *
 * @constructor
 * @param {Object} options
 * @param {Vector3} options.translation - The ROSLIB.Vector3 describing the translation.
 * @param {Quaternion} options.rotation - The ROSLIB.Quaternion describing the rotation.
 */
function Transform(options) {
  options = options || {};
  // Copy the values into this object if they exist
  this.translation = new Vector3(options.translation);
  this.rotation = new Quaternion(options.rotation);
}

/**
 * Clone a copy of this transform.
 *
 * @returns {Transform} The cloned transform.
 */
Transform.prototype.clone = function () {
  return new Transform(this);
};
module.exports = Transform;
},{"./Vector3":"../node_modules/roslib/src/math/Vector3.js","./Quaternion":"../node_modules/roslib/src/math/Quaternion.js"}],"../node_modules/roslib/src/math/index.js":[function(require,module,exports) {
module.exports = {
  Pose: require('./Pose'),
  Quaternion: require('./Quaternion'),
  Transform: require('./Transform'),
  Vector3: require('./Vector3')
};
},{"./Pose":"../node_modules/roslib/src/math/Pose.js","./Quaternion":"../node_modules/roslib/src/math/Quaternion.js","./Transform":"../node_modules/roslib/src/math/Transform.js","./Vector3":"../node_modules/roslib/src/math/Vector3.js"}],"../node_modules/roslib/src/tf/TFClient.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var ActionClient = require('../actionlib/ActionClient');
var Goal = require('../actionlib/Goal');
var Service = require('../core/Service.js');
var ServiceRequest = require('../core/ServiceRequest.js');
var Topic = require('../core/Topic.js');
var Transform = require('../math/Transform');

/**
 * A TF Client that listens to TFs from tf2_web_republisher.
 *
 * @constructor
 * @param {Object} options
 * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
 * @param {string} [options.fixedFrame=base_link] - The fixed frame.
 * @param {number} [options.angularThres=2.0] - The angular threshold for the TF republisher.
 * @param {number} [options.transThres=0.01] - The translation threshold for the TF republisher.
 * @param {number} [options.rate=10.0] - The rate for the TF republisher.
 * @param {number} [options.updateDelay=50] - The time (in ms) to wait after a new subscription
 *     to update the TF republisher's list of TFs.
 * @param {number} [options.topicTimeout=2.0] - The timeout parameter for the TF republisher.
 * @param {string} [options.serverName=/tf2_web_republisher] - The name of the tf2_web_republisher server.
 * @param {string} [options.repubServiceName=/republish_tfs] - The name of the republish_tfs service (non groovy compatibility mode only).
 */
function TFClient(options) {
  options = options || {};
  this.ros = options.ros;
  this.fixedFrame = options.fixedFrame || 'base_link';
  this.angularThres = options.angularThres || 2.0;
  this.transThres = options.transThres || 0.01;
  this.rate = options.rate || 10.0;
  this.updateDelay = options.updateDelay || 50;
  var seconds = options.topicTimeout || 2.0;
  var secs = Math.floor(seconds);
  var nsecs = Math.floor((seconds - secs) * 1000000000);
  this.topicTimeout = {
    secs: secs,
    nsecs: nsecs
  };
  this.serverName = options.serverName || '/tf2_web_republisher';
  this.repubServiceName = options.repubServiceName || '/republish_tfs';
  this.currentGoal = false;
  this.currentTopic = false;
  this.frameInfos = {};
  this.republisherUpdateRequested = false;
  this._subscribeCB = null;
  this._isDisposed = false;

  // Create an Action Client
  this.actionClient = new ActionClient({
    ros: options.ros,
    serverName: this.serverName,
    actionName: 'tf2_web_republisher/TFSubscriptionAction',
    omitStatus: true,
    omitResult: true
  });

  // Create a Service Client
  this.serviceClient = new Service({
    ros: options.ros,
    name: this.repubServiceName,
    serviceType: 'tf2_web_republisher/RepublishTFs'
  });
}

/**
 * Process the incoming TF message and send them out using the callback
 * functions.
 *
 * @param {Object} tf - The TF message from the server.
 */
TFClient.prototype.processTFArray = function (tf) {
  var that = this;
  tf.transforms.forEach(function (transform) {
    var frameID = transform.child_frame_id;
    if (frameID[0] === '/') {
      frameID = frameID.substring(1);
    }
    var info = this.frameInfos[frameID];
    if (info) {
      info.transform = new Transform({
        translation: transform.transform.translation,
        rotation: transform.transform.rotation
      });
      info.cbs.forEach(function (cb) {
        cb(info.transform);
      });
    }
  }, this);
};

/**
 * Create and send a new goal (or service request) to the tf2_web_republisher
 * based on the current list of TFs.
 */
TFClient.prototype.updateGoal = function () {
  var goalMessage = {
    source_frames: Object.keys(this.frameInfos),
    target_frame: this.fixedFrame,
    angular_thres: this.angularThres,
    trans_thres: this.transThres,
    rate: this.rate
  };

  // if we're running in groovy compatibility mode (the default)
  // then use the action interface to tf2_web_republisher
  if (this.ros.groovyCompatibility) {
    if (this.currentGoal) {
      this.currentGoal.cancel();
    }
    this.currentGoal = new Goal({
      actionClient: this.actionClient,
      goalMessage: goalMessage
    });
    this.currentGoal.on('feedback', this.processTFArray.bind(this));
    this.currentGoal.send();
  } else {
    // otherwise, use the service interface
    // The service interface has the same parameters as the action,
    // plus the timeout
    goalMessage.timeout = this.topicTimeout;
    var request = new ServiceRequest(goalMessage);
    this.serviceClient.callService(request, this.processResponse.bind(this));
  }
  this.republisherUpdateRequested = false;
};

/**
 * Process the service response and subscribe to the tf republisher
 * topic.
 *
 * @param {Object} response - The service response containing the topic name.
 */
TFClient.prototype.processResponse = function (response) {
  // Do not setup a topic subscription if already disposed. Prevents a race condition where
  // The dispose() function is called before the service call receives a response.
  if (this._isDisposed) {
    return;
  }

  // if we subscribed to a topic before, unsubscribe so
  // the republisher stops publishing it
  if (this.currentTopic) {
    this.currentTopic.unsubscribe(this._subscribeCB);
  }
  this.currentTopic = new Topic({
    ros: this.ros,
    name: response.topic_name,
    messageType: 'tf2_web_republisher/TFArray'
  });
  this._subscribeCB = this.processTFArray.bind(this);
  this.currentTopic.subscribe(this._subscribeCB);
};

/**
 * Subscribe to the given TF frame.
 *
 * @param {string} frameID - The TF frame to subscribe to.
 * @param {function} callback - Function with the following params:
 * @param {Transform} callback.transform - The transform data.
 */
TFClient.prototype.subscribe = function (frameID, callback) {
  // remove leading slash, if it's there
  if (frameID[0] === '/') {
    frameID = frameID.substring(1);
  }
  // if there is no callback registered for the given frame, create empty callback list
  if (!this.frameInfos[frameID]) {
    this.frameInfos[frameID] = {
      cbs: []
    };
    if (!this.republisherUpdateRequested) {
      setTimeout(this.updateGoal.bind(this), this.updateDelay);
      this.republisherUpdateRequested = true;
    }
  }
  // if we already have a transform, callback immediately
  else if (this.frameInfos[frameID].transform) {
    callback(this.frameInfos[frameID].transform);
  }
  this.frameInfos[frameID].cbs.push(callback);
};

/**
 * Unsubscribe from the given TF frame.
 *
 * @param {string} frameID - The TF frame to unsubscribe from.
 * @param {function} callback - The callback function to remove.
 */
TFClient.prototype.unsubscribe = function (frameID, callback) {
  // remove leading slash, if it's there
  if (frameID[0] === '/') {
    frameID = frameID.substring(1);
  }
  var info = this.frameInfos[frameID];
  for (var cbs = info && info.cbs || [], idx = cbs.length; idx--;) {
    if (cbs[idx] === callback) {
      cbs.splice(idx, 1);
    }
  }
  if (!callback || cbs.length === 0) {
    delete this.frameInfos[frameID];
  }
};

/**
 * Unsubscribe and unadvertise all topics associated with this TFClient.
 */
TFClient.prototype.dispose = function () {
  this._isDisposed = true;
  this.actionClient.dispose();
  if (this.currentTopic) {
    this.currentTopic.unsubscribe(this._subscribeCB);
  }
};
module.exports = TFClient;
},{"../actionlib/ActionClient":"../node_modules/roslib/src/actionlib/ActionClient.js","../actionlib/Goal":"../node_modules/roslib/src/actionlib/Goal.js","../core/Service.js":"../node_modules/roslib/src/core/Service.js","../core/ServiceRequest.js":"../node_modules/roslib/src/core/ServiceRequest.js","../core/Topic.js":"../node_modules/roslib/src/core/Topic.js","../math/Transform":"../node_modules/roslib/src/math/Transform.js"}],"../node_modules/roslib/src/tf/index.js":[function(require,module,exports) {
var Ros = require('../core/Ros');
var mixin = require('../mixin');
var tf = module.exports = {
  TFClient: require('./TFClient')
};
mixin(Ros, ['TFClient'], tf);
},{"../core/Ros":"../node_modules/roslib/src/core/Ros.js","../mixin":"../node_modules/roslib/src/mixin.js","./TFClient":"../node_modules/roslib/src/tf/TFClient.js"}],"../node_modules/roslib/src/urdf/UrdfTypes.js":[function(require,module,exports) {
module.exports = {
  URDF_SPHERE: 0,
  URDF_BOX: 1,
  URDF_CYLINDER: 2,
  URDF_MESH: 3
};
},{}],"../node_modules/roslib/src/urdf/UrdfBox.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Vector3 = require('../math/Vector3');
var UrdfTypes = require('./UrdfTypes');

/**
 * A Box element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfBox(options) {
  this.dimension = null;
  this.type = UrdfTypes.URDF_BOX;

  // Parse the xml string
  var xyz = options.xml.getAttribute('size').split(' ');
  this.dimension = new Vector3({
    x: parseFloat(xyz[0]),
    y: parseFloat(xyz[1]),
    z: parseFloat(xyz[2])
  });
}
module.exports = UrdfBox;
},{"../math/Vector3":"../node_modules/roslib/src/math/Vector3.js","./UrdfTypes":"../node_modules/roslib/src/urdf/UrdfTypes.js"}],"../node_modules/roslib/src/urdf/UrdfColor.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A Color element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfColor(options) {
  // Parse the xml string
  var rgba = options.xml.getAttribute('rgba').split(' ');
  this.r = parseFloat(rgba[0]);
  this.g = parseFloat(rgba[1]);
  this.b = parseFloat(rgba[2]);
  this.a = parseFloat(rgba[3]);
}
module.exports = UrdfColor;
},{}],"../node_modules/roslib/src/urdf/UrdfCylinder.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfTypes = require('./UrdfTypes');

/**
 * A Cylinder element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfCylinder(options) {
  this.type = UrdfTypes.URDF_CYLINDER;
  this.length = parseFloat(options.xml.getAttribute('length'));
  this.radius = parseFloat(options.xml.getAttribute('radius'));
}
module.exports = UrdfCylinder;
},{"./UrdfTypes":"../node_modules/roslib/src/urdf/UrdfTypes.js"}],"../node_modules/roslib/src/urdf/UrdfMaterial.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfColor = require('./UrdfColor');

/**
 * A Material element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfMaterial(options) {
  this.textureFilename = null;
  this.color = null;
  this.name = options.xml.getAttribute('name');

  // Texture
  var textures = options.xml.getElementsByTagName('texture');
  if (textures.length > 0) {
    this.textureFilename = textures[0].getAttribute('filename');
  }

  // Color
  var colors = options.xml.getElementsByTagName('color');
  if (colors.length > 0) {
    // Parse the RBGA string
    this.color = new UrdfColor({
      xml: colors[0]
    });
  }
}
UrdfMaterial.prototype.isLink = function () {
  return this.color === null && this.textureFilename === null;
};
var assign = require('object-assign');
UrdfMaterial.prototype.assign = function (obj) {
  return assign(this, obj);
};
module.exports = UrdfMaterial;
},{"./UrdfColor":"../node_modules/roslib/src/urdf/UrdfColor.js","object-assign":"../node_modules/object-assign/index.js"}],"../node_modules/roslib/src/urdf/UrdfMesh.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Vector3 = require('../math/Vector3');
var UrdfTypes = require('./UrdfTypes');

/**
 * A Mesh element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfMesh(options) {
  this.scale = null;
  this.type = UrdfTypes.URDF_MESH;
  this.filename = options.xml.getAttribute('filename');

  // Check for a scale
  var scale = options.xml.getAttribute('scale');
  if (scale) {
    // Get the XYZ
    var xyz = scale.split(' ');
    this.scale = new Vector3({
      x: parseFloat(xyz[0]),
      y: parseFloat(xyz[1]),
      z: parseFloat(xyz[2])
    });
  }
}
module.exports = UrdfMesh;
},{"../math/Vector3":"../node_modules/roslib/src/math/Vector3.js","./UrdfTypes":"../node_modules/roslib/src/urdf/UrdfTypes.js"}],"../node_modules/roslib/src/urdf/UrdfSphere.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfTypes = require('./UrdfTypes');

/**
 * A Sphere element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfSphere(options) {
  this.type = UrdfTypes.URDF_SPHERE;
  this.radius = parseFloat(options.xml.getAttribute('radius'));
}
module.exports = UrdfSphere;
},{"./UrdfTypes":"../node_modules/roslib/src/urdf/UrdfTypes.js"}],"../node_modules/roslib/src/urdf/UrdfVisual.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Pose = require('../math/Pose');
var Vector3 = require('../math/Vector3');
var Quaternion = require('../math/Quaternion');
var UrdfCylinder = require('./UrdfCylinder');
var UrdfBox = require('./UrdfBox');
var UrdfMaterial = require('./UrdfMaterial');
var UrdfMesh = require('./UrdfMesh');
var UrdfSphere = require('./UrdfSphere');

/**
 * A Visual element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfVisual(options) {
  var xml = options.xml;
  this.origin = null;
  this.geometry = null;
  this.material = null;
  this.name = options.xml.getAttribute('name');

  // Origin
  var origins = xml.getElementsByTagName('origin');
  if (origins.length === 0) {
    // use the identity as the default
    this.origin = new Pose();
  } else {
    // Check the XYZ
    var xyz = origins[0].getAttribute('xyz');
    var position = new Vector3();
    if (xyz) {
      xyz = xyz.split(' ');
      position = new Vector3({
        x: parseFloat(xyz[0]),
        y: parseFloat(xyz[1]),
        z: parseFloat(xyz[2])
      });
    }

    // Check the RPY
    var rpy = origins[0].getAttribute('rpy');
    var orientation = new Quaternion();
    if (rpy) {
      rpy = rpy.split(' ');
      // Convert from RPY
      var roll = parseFloat(rpy[0]);
      var pitch = parseFloat(rpy[1]);
      var yaw = parseFloat(rpy[2]);
      var phi = roll / 2.0;
      var the = pitch / 2.0;
      var psi = yaw / 2.0;
      var x = Math.sin(phi) * Math.cos(the) * Math.cos(psi) - Math.cos(phi) * Math.sin(the) * Math.sin(psi);
      var y = Math.cos(phi) * Math.sin(the) * Math.cos(psi) + Math.sin(phi) * Math.cos(the) * Math.sin(psi);
      var z = Math.cos(phi) * Math.cos(the) * Math.sin(psi) - Math.sin(phi) * Math.sin(the) * Math.cos(psi);
      var w = Math.cos(phi) * Math.cos(the) * Math.cos(psi) + Math.sin(phi) * Math.sin(the) * Math.sin(psi);
      orientation = new Quaternion({
        x: x,
        y: y,
        z: z,
        w: w
      });
      orientation.normalize();
    }
    this.origin = new Pose({
      position: position,
      orientation: orientation
    });
  }

  // Geometry
  var geoms = xml.getElementsByTagName('geometry');
  if (geoms.length > 0) {
    var geom = geoms[0];
    var shape = null;
    // Check for the shape
    for (var i = 0; i < geom.childNodes.length; i++) {
      var node = geom.childNodes[i];
      if (node.nodeType === 1) {
        shape = node;
        break;
      }
    }
    // Check the type
    var type = shape.nodeName;
    if (type === 'sphere') {
      this.geometry = new UrdfSphere({
        xml: shape
      });
    } else if (type === 'box') {
      this.geometry = new UrdfBox({
        xml: shape
      });
    } else if (type === 'cylinder') {
      this.geometry = new UrdfCylinder({
        xml: shape
      });
    } else if (type === 'mesh') {
      this.geometry = new UrdfMesh({
        xml: shape
      });
    } else {
      console.warn('Unknown geometry type ' + type);
    }
  }

  // Material
  var materials = xml.getElementsByTagName('material');
  if (materials.length > 0) {
    this.material = new UrdfMaterial({
      xml: materials[0]
    });
  }
}
module.exports = UrdfVisual;
},{"../math/Pose":"../node_modules/roslib/src/math/Pose.js","../math/Vector3":"../node_modules/roslib/src/math/Vector3.js","../math/Quaternion":"../node_modules/roslib/src/math/Quaternion.js","./UrdfCylinder":"../node_modules/roslib/src/urdf/UrdfCylinder.js","./UrdfBox":"../node_modules/roslib/src/urdf/UrdfBox.js","./UrdfMaterial":"../node_modules/roslib/src/urdf/UrdfMaterial.js","./UrdfMesh":"../node_modules/roslib/src/urdf/UrdfMesh.js","./UrdfSphere":"../node_modules/roslib/src/urdf/UrdfSphere.js"}],"../node_modules/roslib/src/urdf/UrdfLink.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfVisual = require('./UrdfVisual');

/**
 * A Link element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfLink(options) {
  this.name = options.xml.getAttribute('name');
  this.visuals = [];
  var visuals = options.xml.getElementsByTagName('visual');
  for (var i = 0; i < visuals.length; i++) {
    this.visuals.push(new UrdfVisual({
      xml: visuals[i]
    }));
  }
}
module.exports = UrdfLink;
},{"./UrdfVisual":"../node_modules/roslib/src/urdf/UrdfVisual.js"}],"../node_modules/roslib/src/urdf/UrdfJoint.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author David V. Lu!! - davidvlu@gmail.com
 */

var Pose = require('../math/Pose');
var Vector3 = require('../math/Vector3');
var Quaternion = require('../math/Quaternion');

/**
 * A Joint element in a URDF.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 */
function UrdfJoint(options) {
  this.name = options.xml.getAttribute('name');
  this.type = options.xml.getAttribute('type');
  var parents = options.xml.getElementsByTagName('parent');
  if (parents.length > 0) {
    this.parent = parents[0].getAttribute('link');
  }
  var children = options.xml.getElementsByTagName('child');
  if (children.length > 0) {
    this.child = children[0].getAttribute('link');
  }
  var limits = options.xml.getElementsByTagName('limit');
  if (limits.length > 0) {
    this.minval = parseFloat(limits[0].getAttribute('lower'));
    this.maxval = parseFloat(limits[0].getAttribute('upper'));
  }

  // Origin
  var origins = options.xml.getElementsByTagName('origin');
  if (origins.length === 0) {
    // use the identity as the default
    this.origin = new Pose();
  } else {
    // Check the XYZ
    var xyz = origins[0].getAttribute('xyz');
    var position = new Vector3();
    if (xyz) {
      xyz = xyz.split(' ');
      position = new Vector3({
        x: parseFloat(xyz[0]),
        y: parseFloat(xyz[1]),
        z: parseFloat(xyz[2])
      });
    }

    // Check the RPY
    var rpy = origins[0].getAttribute('rpy');
    var orientation = new Quaternion();
    if (rpy) {
      rpy = rpy.split(' ');
      // Convert from RPY
      var roll = parseFloat(rpy[0]);
      var pitch = parseFloat(rpy[1]);
      var yaw = parseFloat(rpy[2]);
      var phi = roll / 2.0;
      var the = pitch / 2.0;
      var psi = yaw / 2.0;
      var x = Math.sin(phi) * Math.cos(the) * Math.cos(psi) - Math.cos(phi) * Math.sin(the) * Math.sin(psi);
      var y = Math.cos(phi) * Math.sin(the) * Math.cos(psi) + Math.sin(phi) * Math.cos(the) * Math.sin(psi);
      var z = Math.cos(phi) * Math.cos(the) * Math.sin(psi) - Math.sin(phi) * Math.sin(the) * Math.cos(psi);
      var w = Math.cos(phi) * Math.cos(the) * Math.cos(psi) + Math.sin(phi) * Math.sin(the) * Math.sin(psi);
      orientation = new Quaternion({
        x: x,
        y: y,
        z: z,
        w: w
      });
      orientation.normalize();
    }
    this.origin = new Pose({
      position: position,
      orientation: orientation
    });
  }
}
module.exports = UrdfJoint;
},{"../math/Pose":"../node_modules/roslib/src/math/Pose.js","../math/Vector3":"../node_modules/roslib/src/math/Vector3.js","../math/Quaternion":"../node_modules/roslib/src/math/Quaternion.js"}],"../node_modules/roslib/src/util/shim/@xmldom/xmldom.js":[function(require,module,exports) {
exports.DOMImplementation = window.DOMImplementation;
exports.XMLSerializer = window.XMLSerializer;
exports.DOMParser = window.DOMParser;
},{}],"../node_modules/roslib/src/urdf/UrdfModel.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfMaterial = require('./UrdfMaterial');
var UrdfLink = require('./UrdfLink');
var UrdfJoint = require('./UrdfJoint');
var DOMParser = require('@xmldom/xmldom').DOMParser;

// See https://developer.mozilla.org/docs/XPathResult#Constants
var XPATH_FIRST_ORDERED_NODE_TYPE = 9;

/**
 * A URDF Model can be used to parse a given URDF into the appropriate elements.
 *
 * @constructor
 * @param {Object} options
 * @param {Element} options.xml - The XML element to parse.
 * @param {string} options.string - The XML element to parse as a string.
 */
function UrdfModel(options) {
  options = options || {};
  var xmlDoc = options.xml;
  var string = options.string;
  this.materials = {};
  this.links = {};
  this.joints = {};

  // Check if we are using a string or an XML element
  if (string) {
    // Parse the string
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(string, 'text/xml');
  }

  // Initialize the model with the given XML node.
  // Get the robot tag
  var robotXml = xmlDoc.documentElement;

  // Get the robot name
  this.name = robotXml.getAttribute('name');

  // Parse all the visual elements we need
  for (var nodes = robotXml.childNodes, i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.tagName === 'material') {
      var material = new UrdfMaterial({
        xml: node
      });
      // Make sure this is unique
      if (this.materials[material.name] !== void 0) {
        if (this.materials[material.name].isLink()) {
          this.materials[material.name].assign(material);
        } else {
          console.warn('Material ' + material.name + 'is not unique.');
        }
      } else {
        this.materials[material.name] = material;
      }
    } else if (node.tagName === 'link') {
      var link = new UrdfLink({
        xml: node
      });
      // Make sure this is unique
      if (this.links[link.name] !== void 0) {
        console.warn('Link ' + link.name + ' is not unique.');
      } else {
        // Check for a material
        for (var j = 0; j < link.visuals.length; j++) {
          var mat = link.visuals[j].material;
          if (mat !== null && mat.name) {
            if (this.materials[mat.name] !== void 0) {
              link.visuals[j].material = this.materials[mat.name];
            } else {
              this.materials[mat.name] = mat;
            }
          }
        }

        // Add the link
        this.links[link.name] = link;
      }
    } else if (node.tagName === 'joint') {
      var joint = new UrdfJoint({
        xml: node
      });
      this.joints[joint.name] = joint;
    }
  }
}
module.exports = UrdfModel;
},{"./UrdfMaterial":"../node_modules/roslib/src/urdf/UrdfMaterial.js","./UrdfLink":"../node_modules/roslib/src/urdf/UrdfLink.js","./UrdfJoint":"../node_modules/roslib/src/urdf/UrdfJoint.js","@xmldom/xmldom":"../node_modules/roslib/src/util/shim/@xmldom/xmldom.js"}],"../node_modules/roslib/src/urdf/index.js":[function(require,module,exports) {
module.exports = require('object-assign')({
  UrdfBox: require('./UrdfBox'),
  UrdfColor: require('./UrdfColor'),
  UrdfCylinder: require('./UrdfCylinder'),
  UrdfLink: require('./UrdfLink'),
  UrdfMaterial: require('./UrdfMaterial'),
  UrdfMesh: require('./UrdfMesh'),
  UrdfModel: require('./UrdfModel'),
  UrdfSphere: require('./UrdfSphere'),
  UrdfVisual: require('./UrdfVisual')
}, require('./UrdfTypes'));
},{"object-assign":"../node_modules/object-assign/index.js","./UrdfBox":"../node_modules/roslib/src/urdf/UrdfBox.js","./UrdfColor":"../node_modules/roslib/src/urdf/UrdfColor.js","./UrdfCylinder":"../node_modules/roslib/src/urdf/UrdfCylinder.js","./UrdfLink":"../node_modules/roslib/src/urdf/UrdfLink.js","./UrdfMaterial":"../node_modules/roslib/src/urdf/UrdfMaterial.js","./UrdfMesh":"../node_modules/roslib/src/urdf/UrdfMesh.js","./UrdfModel":"../node_modules/roslib/src/urdf/UrdfModel.js","./UrdfSphere":"../node_modules/roslib/src/urdf/UrdfSphere.js","./UrdfVisual":"../node_modules/roslib/src/urdf/UrdfVisual.js","./UrdfTypes":"../node_modules/roslib/src/urdf/UrdfTypes.js"}],"../node_modules/roslib/src/RosLib.js":[function(require,module,exports) {
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * If you use roslib in a browser, all the classes will be exported to a global variable called ROSLIB.
 *
 * If you use nodejs, this is the variable you get when you require('roslib').
 */
var ROSLIB = this.ROSLIB || {
  /**
   * @default
   * @description Library version
   */
  REVISION: '1.4.1'
};
var assign = require('object-assign');

// Add core components
assign(ROSLIB, require('./core'));
assign(ROSLIB, require('./actionlib'));
assign(ROSLIB, require('./math'));
assign(ROSLIB, require('./tf'));
assign(ROSLIB, require('./urdf'));
module.exports = ROSLIB;
},{"object-assign":"../node_modules/object-assign/index.js","./core":"../node_modules/roslib/src/core/index.js","./actionlib":"../node_modules/roslib/src/actionlib/index.js","./math":"../node_modules/roslib/src/math/index.js","./tf":"../node_modules/roslib/src/tf/index.js","./urdf":"../node_modules/roslib/src/urdf/index.js"}],"audio/error.mp3":[function(require,module,exports) {
module.exports = "/error.1c1e3d08.mp3";
},{}],"audio/success.mp3":[function(require,module,exports) {
module.exports = "/success.4c1ff5a8.mp3";
},{}],"audio/paused.mp3":[function(require,module,exports) {
module.exports = "/paused.cc590cbf.mp3";
},{}],"app.ts":[function(require,module,exports) {
"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var roslib_1 = require("roslib");
var error_mp3_1 = __importDefault(require("./audio/error.mp3"));
var success_mp3_1 = __importDefault(require("./audio/success.mp3"));
var paused_mp3_1 = __importDefault(require("./audio/paused.mp3"));
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
var App = /** @class */function () {
  function App(ipAddress) {
    this.ipAddressElement = document.getElementById("ipAddressElement");
    this.loadAudioSnippets();
    this.debugTopicDisplayElement = document.getElementById("debug_topic_display");
    if (!this.debugTopicDisplayElement) {
      throw new Error("Element with ID debug_topic_display not found.");
    }
    this.cameraElement = document.getElementById("ros_img");
    if (!this.cameraElement) {
      throw new Error("Element with ID ros_img not found.");
    }
    this.templatesDropdownElement = document.getElementById("template_dropdown");
    this.cameraCorrectionElement = document.getElementById("img_corrections");
    if (!this.cameraCorrectionElement) {
      throw new Error("Element with ID img_corrections not found.");
    }
    this.trashBin = document.getElementById("trash-bin");
    this.localize_button = document.getElementById("localize_button");
    this.automatic_template_button = document.getElementById("automatic_template");
    this.templateRecordElement = document.getElementById("template_name_record");
    this.speedFactorElement = document.getElementById("speed_factor");
    this.statusRecordingElement = document.getElementById("statusRecording");
    this.statusExecutingElement = document.getElementById("statusExecuting");
    this.statusPausedElement = document.getElementById("statusPaused");
    this.statusSpiralingElement = document.getElementById("statusSpiraling");
    this.statusCameraFeedbackElement = document.getElementById("statusCameraFeedback");
    this.statusStiffnessElement = document.getElementById("statusStiffness");
    this.statusGripperElement = document.getElementById("statusGripper");
    this.trajectoriesDropdownElement = document.getElementById("trajectories_dropdown");
    this.skillsDropdownElement = document.getElementById("skills_dropdown");
    if (!this.trajectoriesDropdownElement) {
      throw new Error("Element with ID trajectories_dropdown not found.");
    }
    this.availableTrajectories = [];
    this.availableSkills = [];
    this.availableTemplates = [];
    this.record_text_field = document.getElementById("recording_name");
    this.startApp(ipAddress);
  }
  App.prototype.startApp = function (ipAddress) {
    var _this = this;
    var rosUrl = "ws://" + ipAddress + ":9090";
    console.log("Connecting to ROS at " + rosUrl);
    this.ros = new roslib_1.Ros({
      url: rosUrl
    });
    this.debug_topic = new roslib_1.Topic({
      ros: this.ros,
      name: "/debug",
      messageType: "std_msgs/String"
    });
    this.recording_topic = new roslib_1.Topic({
      ros: this.ros,
      name: "/recording",
      messageType: "std_msgs/Bool"
    });
    this.camera_topic = new roslib_1.Topic({
      ros: this.ros,
      name: '/camera/color/image_raw/compressed',
      messageType: 'sensor_msgs/CompressedImage'
    });
    this.camera_correction_topic_compressed = new roslib_1.Topic({
      ros: this.ros,
      name: '/sift_compressed/compressed',
      messageType: 'sensor_msgs/CompressedImage'
    });
    this.order_menu = document.getElementById("menuContainer");
    this.setupRosTopic();
    this.setupCameraRosTopic();
    this.setupCameraCorrectionsRosTopic();
    // home client
    this.home_client = new roslib_1.ActionClient({
      ros: this.ros,
      serverName: '/lfdHome',
      actionName: 'skills_manager/LfdHomeAction'
    });
    this.home_goal = new roslib_1.Goal({
      actionClient: this.home_client,
      goalMessage: {
        height: 0.25,
        side: 0.0,
        front: 0.46
      }
    });
    this.home_goal.on('result', function () {
      _this.homing = false;
      _this.enable_all_main_buttons();
    }, this.home_byod_goal = new roslib_1.Goal({
      actionClient: this.home_client,
      goalMessage: {
        height: 0.15,
        side: 0.0,
        front: 0.45
      }
    }));
    this.home_byod_goal.on('result', function () {
      _this.homing = false;
      _this.enable_all_main_buttons();
    }
    // record client
    ,
    // record client
    this.record_client = new roslib_1.ActionClient({
      ros: this.ros,
      serverName: '/lfdRecord',
      actionName: 'skills_manager/LfdRecordAction'
    }));
    this.record_goal = new roslib_1.Goal({
      actionClient: this.record_client,
      goalMessage: {
        skill_name: "default"
      }
    });
    this.record_goal.on('result', function () {
      _this.recording = false;
      _this.refreshTrajectories();
      _this.enable_all_main_buttons();
      _this.statusRecordingElement.classList.remove("status-active");
    }, this.record_goal.on('feedback', function (feedback) {
      if (feedback.paused === true) {
        _this.playSnippet('paused');
        _this.statusPausedElement.classList.add("status-active");
      }
      if (feedback.spiraling === true) {
        _this.statusSpiralingElement.classList.add("status-active");
      }
      if (feedback.camera_feedback === true) {
        _this.statusCameraFeedbackElement.classList.add("status-active");
      }
      if (feedback.stiffness === true) {
        _this.statusStiffnessElement.classList.add("status-active");
      }
      if (feedback.gripper === true) {
        _this.statusGripperElement.classList.add("status-active");
      }
      if (feedback.paused === false) {
        _this.statusPausedElement.classList.remove("status-active");
      }
      if (feedback.spiraling === false) {
        _this.statusSpiralingElement.classList.remove("status-active");
      }
      if (feedback.camera_feedback === false) {
        _this.statusCameraFeedbackElement.classList.remove("status-active");
      }
      if (feedback.stiffness === false) {
        _this.statusStiffnessElement.classList.remove("status-active");
      }
      if (feedback.gripper === false) {
        _this.statusGripperElement.classList.remove("status-active");
      }
    }
    // execute client
    ,
    // execute client
    this.execute_client = new roslib_1.ActionClient({
      ros: this.ros,
      serverName: '/lfdExecuteSkillSequence',
      actionName: 'skills_manager/LfdExecuteSkillSequenceAction'
    })));
    this.execute_goal = new roslib_1.Goal({
      actionClient: this.execute_client,
      goalMessage: {
        skill_names: [],
        localize_box: false,
        speed_factor: 1,
        template_name: {
          data: "default"
        }
      }
    });
    this.execute_goal.on('result', function () {
      _this.executing = false;
      _this.enable_all_main_buttons();
      _this.statusExecutingElement.classList.remove("status-active");
    }, this.execute_goal.on('feedback', function (feedback) {
      if (feedback.spiraling === true) {
        _this.statusSpiralingElement.classList.add("status-active");
      }
      if (feedback.camera_feedback === true) {
        _this.statusCameraFeedbackElement.classList.add("status-active");
      }
      if (feedback.stiffness === true) {
        _this.statusStiffnessElement.classList.add("status-active");
      }
      if (feedback.gripper === true) {
        _this.statusGripperElement.classList.add("status-active");
      }
      if (feedback.spiraling === false) {
        _this.statusSpiralingElement.classList.remove("status-active");
      }
      if (feedback.camera_feedback === false) {
        _this.statusCameraFeedbackElement.classList.remove("status-active");
      }
      if (feedback.stiffness === false) {
        _this.statusStiffnessElement.classList.remove("status-active");
      }
      if (feedback.gripper === false) {
        _this.statusGripperElement.classList.remove("status-active");
      }
    }
    // execute client
    ,
    // execute client
    this.execute_skill_client = new roslib_1.ActionClient({
      ros: this.ros,
      serverName: '/lfdExecuteSkill',
      actionName: 'skills_manager/LfdExecuteSkillAction'
    })));
    this.execute_skill_goal = new roslib_1.Goal({
      actionClient: this.execute_skill_client,
      goalMessage: {
        skill_name: [],
        localize_box: false,
        template_name: "default"
      }
    });
    this.execute_skill_goal.on('result', function () {
      _this.executing = false;
      _this.enable_all_main_buttons();
      _this.statusExecutingElement.classList.remove("status-active");
    }, this.executing = false);
    this.recording = false;
    this.homing = false;
    this.abort_gripper_client = new roslib_1.ActionClient({
      ros: this.ros,
      serverName: '/abort_gripper',
      actionName: 'skills_manager/AbortGripperAction'
    });
    this.abort_gripper_goal = new roslib_1.Goal({
      actionClient: this.abort_gripper_client,
      goalMessage: {
        open: false
      }
    });
    this.save_sift_template = new roslib_1.Service({
      ros: this.ros,
      name: '/saving_sift_template',
      serviceType: 'platonics_vision/SavingTemplate'
    });
    this.list_trajectories = new roslib_1.Service({
      ros: this.ros,
      name: '/list_trajectories',
      serviceType: 'skills_manager/ListTrajectories'
    });
    this.list_templates = new roslib_1.Service({
      ros: this.ros,
      name: '/list_templates',
      serviceType: 'skills_manager/ListTemplates'
    });
    this.list_skills = new roslib_1.Service({
      ros: this.ros,
      name: '/list_skills',
      serviceType: 'skills_manage/ListSkills'
    });
    this.reset_transformation = new roslib_1.Service({
      ros: this.ros,
      name: '/reset_transformation',
      serviceType: 'std_srvs/Trigger'
    });
    this.refreshTemplates();
  };
  App.prototype.restartApp = function () {
    var ip_address = this.ipAddressElement.value;
    this.ros.close();
    this.startApp(ip_address);
  };
  App.prototype.cancel = function () {
    this.playSnippet('error');
    this.execute_client.cancel();
    this.record_client.cancel();
    this.home_client.cancel();
    this.enable_all_main_buttons();
  };
  App.prototype.home_gripper = function () {
    this.abort_gripper_client.cancel();
    this.log("Homing gripper");
    this.abort_gripper_goal.goalMessage.goal.open = true;
    this.abort_gripper_goal.send();
  };
  App.prototype.abort_gripper = function () {
    this.abort_gripper_client.cancel();
    this.log("Aborting gripper");
    this.abort_gripper_goal.goalMessage.goal.open = false;
    this.abort_gripper_goal.send();
  };
  App.prototype.selectTrajectory = function () {
    var skill_name = this.trajectoriesDropdownElement.value;
    var newItem = document.createElement("div");
    newItem.classList.add("menu-item");
    newItem.setAttribute("draggable", "true");
    newItem.textContent = skill_name;
    this.order_menu.appendChild(newItem);
    this.addDragAndDropHandlers(newItem);
  };
  App.prototype.selectSkill = function () {
    var skill_name = this.skillsDropdownElement.value;
    var newItem = document.createElement("div");
    newItem.classList.add("menu-item");
    newItem.setAttribute("draggable", "true");
    newItem.textContent = skill_name;
    this.order_menu.appendChild(newItem);
    this.addDragAndDropHandlers(newItem);
  };
  App.prototype.clearMenu = function () {
    this.order_menu.innerHTML = "";
  };
  App.prototype.selectTemplate = function () {
    this.refreshTrajectories();
    this.refreshSkills();
  };
  App.prototype.addDragAndDropHandlers = function (item) {
    var _this = this;
    item.addEventListener("dragstart", function () {
      _this.draggedItem = item;
      setTimeout(function () {
        item.classList.add("dragging");
      }, 0);
    });
    item.addEventListener("dragend", function () {
      setTimeout(function () {
        item.classList.remove("dragging");
        _this.draggedItem = null;
      }, 0);
    });
    item.addEventListener("dragover", function (e) {
      e.preventDefault();
      item.classList.add("over");
    });
    item.addEventListener("dragleave", function () {
      item.classList.remove("over");
    });
    item.addEventListener("drop", function () {
      item.classList.remove("over");
      if (_this.draggedItem !== item) {
        var menu = item.parentNode;
        var siblings = __spreadArray([], menu.children, true);
        var targetIndex = siblings.indexOf(item);
        var draggedIndex = siblings.indexOf(_this.draggedItem);
        if (targetIndex < draggedIndex) {
          menu.insertBefore(_this.draggedItem, item);
        } else {
          menu.insertBefore(_this.draggedItem, item.nextSibling);
        }
      }
    });
    this.trashBin.addEventListener("dragover", function (e) {
      e.preventDefault();
      _this.trashBin.classList.add("over-trash");
    });
    this.trashBin.addEventListener("dragleave", function () {
      _this.trashBin.classList.remove("over-trash");
    });
    this.trashBin.addEventListener("drop", function () {
      _this.trashBin.classList.remove("over-trash");
      // Remove the dragged item from the DOM when dropped into the trash bin
      if (_this.draggedItem) {
        _this.draggedItem.remove();
        _this.draggedItem = null;
      }
    });
  };
  App.prototype.saveSiftTemplate = function () {
    var request = {
      template_name: {
        data: this.templateRecordElement.value
      }
    };
    this.save_sift_template.callService(request, function (result) {
      console.log("Saving template: " + result.success);
    });
  };
  App.prototype.playSnippet = function (snippetKey) {
    var audio = this.audioSnippets[snippetKey];
    if (audio) {
      audio.currentTime = 0; // Reset playback to the beginning
      audio.play();
    } else {
      console.error("Audio snippet ".concat(snippetKey, " not found"));
    }
  };
  App.prototype.loadAudioSnippets = function () {
    this.audioSnippets = {
      success: new Audio(success_mp3_1.default),
      error: new Audio(error_mp3_1.default),
      paused: new Audio(paused_mp3_1.default)
    };
  };
  App.prototype.refreshTrajectories = function () {
    var _this = this;
    var request = new roslib_1.ServiceRequest({});
    request.template_name = this.templatesDropdownElement.value;
    this.list_trajectories.callService(request, function (result) {
      _this.availableTrajectories = result.trajectories;
      _this.availableTrajectories.unshift("---select---");
      _this.updateTrajectoriesDropdown();
    });
  };
  App.prototype.refreshSkills = function () {
    var _this = this;
    var request = new roslib_1.ServiceRequest({});
    request.template_name = this.templatesDropdownElement.value;
    this.list_skills.callService(request, function (result) {
      _this.availableSkills = result.skills;
      _this.availableSkills.unshift("---select---");
      _this.updateSkillsDropdown();
    });
  };
  App.prototype.refreshTemplates = function () {
    var _this = this;
    this.list_templates.callService(new roslib_1.ServiceRequest({}), function (result) {
      _this.availableTemplates = result.templates;
      _this.availableTemplates.unshift("---select---");
      _this.updateTemplatesDropdown();
    });
    //this.emptyMenu();
  };
  App.prototype.resetTransformation = function () {
    this.reset_transformation.callService(new roslib_1.ServiceRequest({}), function (result) {
      console.log("Reset transformation");
    });
  };
  App.prototype.updateTemplatesDropdown = function () {
    var _this = this;
    var sortedTemplates = __spreadArray([], this.availableTemplates, true).sort();
    this.templatesDropdownElement.innerHTML = '';
    sortedTemplates.forEach(function (template) {
      var option = document.createElement('option');
      option.value = template;
      option.textContent = template;
      _this.templatesDropdownElement.appendChild(option);
    });
  };
  App.prototype.updateTrajectoriesDropdown = function () {
    var _this = this;
    var sortedTrajectories = __spreadArray([], this.availableTrajectories, true).sort();
    this.trajectoriesDropdownElement.innerHTML = '';
    sortedTrajectories.forEach(function (trajectory) {
      var option = document.createElement('option');
      option.value = trajectory;
      option.textContent = trajectory;
      _this.trajectoriesDropdownElement.appendChild(option);
    });
  };
  App.prototype.updateSkillsDropdown = function () {
    var _this = this;
    var sortedSkills = __spreadArray([], this.availableSkills, true).sort();
    this.skillsDropdownElement.innerHTML = '';
    sortedSkills.forEach(function (skill) {
      var option = document.createElement('option');
      option.value = skill;
      option.textContent = skill;
      _this.skillsDropdownElement.appendChild(option);
    });
  };
  App.prototype.disable_all_main_buttons = function () {
    var buttons = document.getElementsByClassName("main-button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("disabled", "true");
    }
  };
  App.prototype.enable_all_main_buttons = function () {
    var buttons = document.getElementsByClassName("main-button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeAttribute("disabled");
    }
  };
  App.prototype.sendHome = function () {
    this.disable_all_main_buttons();
    this.homing = true;
    this.home_goal.send();
  };
  App.prototype.sendHomeBYOD = function () {
    this.disable_all_main_buttons();
    this.homing = true;
    this.home_byod_goal.send();
  };
  App.prototype.execute_skill = function () {
    var items = document.getElementsByClassName("menu-item");
    console.log("executing skill");
    this.execute_skill_goal.goalMessage.goal.skill_name = items[0].textContent;
    console.log(items[0].textContent);
    if (this.automatic_template_button.checked) {
      this.execute_skill_goal.goalMessage.goal.template_name = "";
    } else {
      this.execute_skill_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
    }
    this.execute_skill_goal.goalMessage.goal.localize_box = this.localize_button.checked;
    //this.localize_button.checked;
    this.disable_all_main_buttons();
    this.execute_skill_goal.send();
  };
  App.prototype.execute = function () {
    this.statusExecutingElement.classList.add("status-active");
    var items = document.getElementsByClassName("menu-item");
    var skill_names = [];
    for (var i = 0; i < items.length; i++) {
      skill_names.push(items[i].textContent || ""); // Ensure textContent is not null
    }
    this.execute_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
    this.execute_goal.goalMessage.goal.skill_names = skill_names;
    // convert string to float
    this.execute_goal.goalMessage.goal.speed_factor = parseFloat(this.speedFactorElement.value);
    this.execute_goal.goalMessage.goal.localize_box = this.localize_button.checked;
    this.disable_all_main_buttons();
    this.execute_goal.send();
  };
  App.prototype.record = function () {
    this.disable_all_main_buttons();
    this.statusRecordingElement.classList.add("status-active");
    this.record_goal.goalMessage.goal.skill_name = this.record_text_field.value;
    this.record_goal.goalMessage.goal.template_name = this.templatesDropdownElement.value;
    this.record_goal.send();
  };
  App.prototype.setupCameraRosTopic = function () {
    var _this = this;
    this.camera_topic.subscribe(function (message) {
      _this.cameraElement.src = 'data:image/jpeg;base64,' + message.data;
    });
  };
  App.prototype.setupCameraCorrectionsRosTopic = function () {
    var _this = this;
    this.camera_correction_topic_compressed.subscribe(function (message) {
      console.log("Received camera correction");
      //console.log(message.data);
      _this.cameraCorrectionElement.src = 'data:image/jpeg;base64,' + message.data;
    });
  };
  App.prototype.setupRosTopic = function () {
    var _this = this;
    this.debug_topic.subscribe(function (message) {
      // Create a new message element
      var newMessage = document.createElement('div');
      newMessage.classList.add('debug-message');
      newMessage.textContent = message.data;
      // Prepend the new message to the debug window (at the top)
      _this.debugTopicDisplayElement.prepend(newMessage);
      // Get all message elements
      var allMessages = _this.debugTopicDisplayElement.querySelectorAll('.debug-message');
      // If more than 3 messages, fade out the oldest one
      if (allMessages.length > 3) {
        var oldestMessage_1 = allMessages[allMessages.length - 1];
        oldestMessage_1.style.opacity = '0'; // Fade out
        setTimeout(function () {
          return oldestMessage_1.remove();
        }, 500); // Remove after fading out
      }
    });
  };
  App.prototype.startDataRecord = function () {
    this.recording_topic.publish({
      data: true
    });
  };
  App.prototype.stopDataRecord = function () {
    this.recording_topic.publish({
      data: false
    });
  };
  App.prototype.log = function (message) {
    this.debug_topic.publish({
      data: message
    });
  };
  return App;
}();
// Instantiate the App class when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  var app = new App("172.16.0.3");
  // Expose the app instance to the global scope for the button's onclick handler
  window.app = app;
});
},{"roslib":"../node_modules/roslib/src/RosLib.js","./audio/error.mp3":"audio/error.mp3","./audio/success.mp3":"audio/success.mp3","./audio/paused.mp3":"audio/paused.mp3"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46567" + '/');
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
      });

      // Enable HMR for CSS by default.
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map