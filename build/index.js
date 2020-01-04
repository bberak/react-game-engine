module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 
With thanks, https://github.com/FormidableLabs/react-game-kit/blob/master/src/native/utils/game-loop.js
*/

/*
The MIT License (MIT)

Copyright (c) 2013

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var DefaultTimer = function () {
  function DefaultTimer() {
    var _this = this;

    _classCallCheck(this, DefaultTimer);

    this.loop = function (time) {
      if (_this.loopId) {
        _this.subscribers.forEach(function (callback) {
          callback(time);
        });
      }

      _this.loopId = requestAnimationFrame(_this.loop);
    };

    this.subscribers = [];
    this.loopId = null;
  }

  _createClass(DefaultTimer, [{
    key: "start",
    value: function start() {
      if (!this.loopId) {
        this.loop();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.loopId) {
        cancelAnimationFrame(this.loopId);
        this.loopId = null;
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      if (this.subscribers.indexOf(callback) === -1) this.subscribers.push(callback);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(function (s) {
        return s !== callback;
      });
    }
  }]);

  return DefaultTimer;
}();

exports.default = DefaultTimer;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (entities, window) {
	if (!entities || !window) return null;

	return Object.keys(entities).filter(function (key) {
		return entities[key].renderer;
	}).map(function (key) {
		var entity = entities[key];
		if (_typeof(entity.renderer) === "object") return _react2.default.createElement(entity.renderer.type, _extends({
			key: key,
			window: window
		}, entity));else if (typeof entity.renderer === "function") return _react2.default.createElement(entity.renderer, _extends({ key: key, window: window }, entity));
	});
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _DefaultTimer = __webpack_require__(0);

var _DefaultTimer2 = _interopRequireDefault(_DefaultTimer);

var _DefaultRenderer = __webpack_require__(2);

var _DefaultRenderer2 = _interopRequireDefault(_DefaultRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getEntitiesFromProps = function getEntitiesFromProps(props) {
  return props.initState || props.initialState || props.state || props.initEntities || props.initialEntities || props.entities;
};

var isPromise = function isPromise(obj) {
  return !!(obj && obj.then && obj.then.constructor && obj.then.call && obj.then.apply);
};

var events = "onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp";

var GameEngine = function (_Component) {
  _inherits(GameEngine, _Component);

  function GameEngine(props) {
    var _this2 = this;

    _classCallCheck(this, GameEngine);

    var _this = _possibleConstructorReturn(this, (GameEngine.__proto__ || Object.getPrototypeOf(GameEngine)).call(this, props));

    _this.clear = function () {
      _this.input.length = 0;
      _this.events.length = 0;
      _this.previousTime = null;
      _this.previousDelta = null;
    };

    _this.start = function () {
      _this.clear();
      _this.timer.start();
      _this.dispatch({ type: "started" });
      _this.refs.container.focus();
    };

    _this.stop = function () {
      _this.timer.stop();
      _this.dispatch({ type: "stopped" });
    };

    _this.swap = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newEntities) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!isPromise(newEntities)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return newEntities;

              case 3:
                newEntities = _context.sent;

              case 4:

                _this.setState({ entities: newEntities || {} }, function () {
                  _this.clear();
                  _this.dispatch({ type: "swapped" });
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.defer = function (e) {
      _this.dispatch(e);
    };

    _this.dispatch = function (e) {
      setTimeout(function () {
        _this.events.push(e);
        if (_this.props.onEvent) _this.props.onEvent(e);
      }, 0);
    };

    _this.updateHandler = function (currentTime) {
      var args = {
        input: _this.input,
        window: window,
        events: _this.events,
        dispatch: _this.dispatch,
        defer: _this.defer,
        time: {
          current: currentTime,
          previous: _this.previousTime,
          delta: currentTime - (_this.previousTime || currentTime),
          previousDelta: _this.previousDelta
        }
      };

      var newState = _this.props.systems.reduce(function (state, sys) {
        return sys(state, args);
      }, _this.state.entities);

      _this.input.length = 0;
      _this.events.length = 0;
      _this.previousTime = currentTime;
      _this.previousDelta = args.time.delta;
      _this.setState({ entities: newState });
    };

    _this.inputHandlers = events.split(" ").map(function (name) {
      return {
        name: name,
        handler: function handler(payload) {
          payload.persist();
          _this.input.push({ name: name, payload: payload });
        }
      };
    }).reduce(function (acc, val) {
      acc[val.name] = val.handler;
      return acc;
    }, {});

    _this.state = {
      entities: null
    };
    _this.timer = props.timer || new _DefaultTimer2.default();
    _this.timer.subscribe(_this.updateHandler);
    _this.input = [];
    _this.previousTime = null;
    _this.previousDelta = null;
    _this.events = [];
    return _this;
  }

  _createClass(GameEngine, [{
    key: "componentDidMount",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this3 = this;

        var entities;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                entities = getEntitiesFromProps(this.props);

                if (!isPromise(entities)) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 4;
                return entities;

              case 4:
                entities = _context2.sent;

              case 5:

                this.setState({
                  entities: entities || {}
                }, function () {
                  if (_this3.props.running) _this3.start();
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _ref2.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stop();
      this.timer.unsubscribe(this.updateHandler);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.running !== this.props.running) {
        if (nextProps.running) this.start();else this.stop();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        _extends({
          ref: "container",
          style: _extends({}, css.container, this.props.style),
          className: this.props.className,
          tabIndex: 0
        }, this.inputHandlers),
        this.props.renderer(this.state.entities, window),
        this.props.children
      );
    }
  }]);

  return GameEngine;
}(_react.Component);

exports.default = GameEngine;


GameEngine.defaultProps = {
  systems: [],
  entities: {},
  renderer: _DefaultRenderer2.default,
  running: true
};

var css = {
  container: {
    flex: 1,
    outline: "none"
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _DefaultTimer = __webpack_require__(0);

var _DefaultTimer2 = _interopRequireDefault(_DefaultTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = "onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp";

var GameLoop = function (_Component) {
  _inherits(GameLoop, _Component);

  function GameLoop(props) {
    _classCallCheck(this, GameLoop);

    var _this = _possibleConstructorReturn(this, (GameLoop.__proto__ || Object.getPrototypeOf(GameLoop)).call(this, props));

    _this.start = function () {
      _this.input.length = 0;
      _this.previousTime = null;
      _this.previousDelta = null;
      _this.timer.start();
      _this.refs.container.focus();
    };

    _this.stop = function () {
      _this.timer.stop();
    };

    _this.updateHandler = function (currentTime) {
      var args = {
        input: _this.input,
        window: window,
        time: {
          current: currentTime,
          previous: _this.previousTime,
          delta: currentTime - (_this.previousTime || currentTime),
          previousDelta: _this.previousDelta
        }
      };

      if (_this.props.onUpdate) _this.props.onUpdate(args);

      _this.input.length = 0;
      _this.previousTime = currentTime;
      _this.previousDelta = args.time.delta;
    };

    _this.inputHandlers = events.split(" ").map(function (name) {
      return {
        name: name,
        handler: function handler(payload) {
          payload.persist();
          _this.input.push({ name: name, payload: payload });
        }
      };
    }).reduce(function (acc, val) {
      acc[val.name] = val.handler;
      return acc;
    }, {});

    _this.timer = props.timer || new _DefaultTimer2.default();
    _this.timer.subscribe(_this.updateHandler);
    _this.input = [];
    _this.previousTime = null;
    _this.previousDelta = null;
    return _this;
  }

  _createClass(GameLoop, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.running) this.start();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stop();
      this.timer.unsubscribe(this.updateHandler);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.running !== this.props.running) {
        if (nextProps.running) this.start();else this.stop();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        _extends({
          ref: "container",
          style: _extends({}, css.container, this.props.style),
          className: this.props.className,
          tabIndex: 0
        }, this.inputHandlers),
        this.props.children
      );
    }
  }]);

  return GameLoop;
}(_react.Component);

exports.default = GameLoop;


GameLoop.defaultProps = {
  running: true
};

var css = {
  container: {
    flex: 1,
    outline: "none"
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Timer = exports.DefaultTimer = exports.Renderer = exports.DefaultRenderer = exports.GameEngine = exports.GameLoop = undefined;

var _GameLoop = __webpack_require__(4);

var _GameLoop2 = _interopRequireDefault(_GameLoop);

var _GameEngine = __webpack_require__(3);

var _GameEngine2 = _interopRequireDefault(_GameEngine);

var _DefaultRenderer = __webpack_require__(2);

var _DefaultRenderer2 = _interopRequireDefault(_DefaultRenderer);

var _DefaultTimer = __webpack_require__(0);

var _DefaultTimer2 = _interopRequireDefault(_DefaultTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.GameLoop = _GameLoop2.default;
exports.GameEngine = _GameEngine2.default;
exports.DefaultRenderer = _DefaultRenderer2.default;
exports.Renderer = _DefaultRenderer2.default;
exports.DefaultTimer = _DefaultTimer2.default;
exports.Timer = _DefaultTimer2.default;

/***/ })
/******/ ]);