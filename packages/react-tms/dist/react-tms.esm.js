import { createContext, createElement, Component } from 'react';
import Tms from '@fmfe/tms.js';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var hoistNonReactStatics = require('hoist-non-react-statics');
var forEachTms = function forEachTms(store, fn) {
    Object.keys(store).forEach(function (k) {
        var cur = store[k];
        if (cur instanceof Tms) {
            fn(cur);
            forEachTms(cur, fn);
        }
    });
};
function createContext$1(Store) {
    var defaultValue = {
        count: 0,
        store: null
    };
    var Context = createContext(defaultValue);
    return {
        getProvider: function getProvider(Component$$1) {
            var Provider = function (_React$Component) {
                inherits(Provider, _React$Component);

                function Provider(props) {
                    classCallCheck(this, Provider);

                    var _this = possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props));

                    var S = Store;
                    var store = typeof S.getReactTmsStore === 'function' ? S.getReactTmsStore(_this.props) : new S();
                    _this.state = {
                        count: 0,
                        store: store
                    };
                    _this.onTmsChange = function () {
                        var count = _this.state.count + 1;
                        var store = _this.state.store;
                        _this.setState({
                            count: count,
                            store: store
                        });
                    };
                    _this.subscribe = function () {
                        forEachTms(_this.state, function (tms) {
                            tms.dep.addSub(_this.onTmsChange);
                        });
                    };
                    _this.unsubscribe = function () {
                        forEachTms(_this.state, function (tms) {
                            tms.dep.removeSub(_this.onTmsChange);
                        });
                    };
                    _this.subscribe();
                    return _this;
                }

                createClass(Provider, [{
                    key: 'componentWillUnmount',
                    value: function componentWillUnmount() {
                        this.unsubscribe();
                    }
                }, {
                    key: 'render',
                    value: function render() {
                        var C = Component$$1;
                        return createElement(Context.Provider, { value: this.state }, createElement(C, _extends({}, this.props)));
                    }
                }]);
                return Provider;
            }(Component);

            if (typeof Store.getReactTmsProvider === 'function') {
                Store.getReactTmsProvider(Component$$1);
            }
            hoistNonReactStatics(Provider, Component$$1);
            return Provider;
        },
        getProps: function getProps(Component$$1, _getProps) {
            var GetProps = function (_React$Component2) {
                inherits(GetProps, _React$Component2);

                function GetProps() {
                    classCallCheck(this, GetProps);
                    return possibleConstructorReturn(this, (GetProps.__proto__ || Object.getPrototypeOf(GetProps)).apply(this, arguments));
                }

                createClass(GetProps, [{
                    key: 'render',
                    value: function render() {
                        var _this3 = this;

                        return createElement(Context.Consumer, null, function (_ref) {
                            var store = _ref.store;

                            if (!store) return null;
                            var props = _getProps(store);
                            return createElement(Component$$1, _extends({}, _this3.props, props));
                        });
                    }
                }]);
                return GetProps;
            }(Component);

            hoistNonReactStatics(GetProps, Component$$1);
            return GetProps;
        }
    };
}
function command(store, path) {
    var paths = path.split('.');
    var len = paths.length - 1;
    var current = store;
    for (var i = 0; i < len; i++) {
        var name = paths[i];
        if (current[name] && current[name] instanceof Tms) {
            current = current[name];
        } else {
            throw new Error(path + ' \u7684 ' + name + ' class \u4E0D\u5B58\u5728');
        }
    }
    var fnName = paths[paths.length - 1];
    var fn = current[fnName];
    if (typeof fn === 'function') {
        for (var _len = arguments.length, payloads = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            payloads[_key - 2] = arguments[_key];
        }

        fn.call.apply(fn, [current].concat(payloads));
    } else {
        throw new Error(path + ' \u7684 ' + fnName + ' \u65B9\u6CD5\u4E0D\u5B58\u5728');
    }
}

var getType = function getType(payload) {
    return Object.prototype.toString.call(payload).replace(/^(.*?) |]$/g, '').toLowerCase();
};

var ReactTms = function (_Tms) {
    inherits(ReactTms, _Tms);

    function ReactTms() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, ReactTms);

        var _this = possibleConstructorReturn(this, (ReactTms.__proto__ || Object.getPrototypeOf(ReactTms)).call(this));

        _this.onList = [];
        _this.subs = [];
        _this.options = { isDebugLog: false };
        if (typeof options.isDebugLog === 'boolean') {
            _this.options.isDebugLog = options.isDebugLog;
        }
        return _this;
    }

    createClass(ReactTms, [{
        key: 'run',
        value: function run() {
            var _this2 = this;

            Object.defineProperty(this, 'subs', {
                enumerable: false
            });
            Object.defineProperty(this, 'onList', {
                enumerable: false
            });
            var observeTms = function observeTms(opts, paths) {
                Object.keys(opts).forEach(function (k) {
                    var item = opts[k];
                    if (item instanceof Tms) {
                        var onChage = function onChage(event) {
                            var position = '' + paths.concat([k, event.type]).join('.');
                            if (_this2.options.isDebugLog && console) {
                                // eslint-disable-next-line
                                console.log('position   ' + position + '(payload: ' + getType(event.payload) + ');', '\n\rpayload   ', _typeof(event.payload) === 'object' ? JSON.parse(JSON.stringify(event.payload)) : event.payload, '\n\rpayloads  ', JSON.parse(JSON.stringify(event.payloads)), '\n\rtarget    ', event.target, '\n\r---');
                            }
                            _this2.subs.forEach(function (fn) {
                                return fn(_extends({}, event, {
                                    position: position,
                                    time: Date.now()
                                }));
                            });
                        };
                        item.dep.addSub(onChage);
                        _this2.onList.push({
                            target: item,
                            onChage: onChage
                        });
                        observeTms(item, [].concat(toConsumableArray(paths), [k]));
                    }
                });
            };
            observeTms(this, []);
            return this;
        }
    }, {
        key: 'subscribe',
        value: function subscribe(fn) {
            this.subs.push(fn);
            return this;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(fn) {
            var index = this.subs.indexOf(fn);
            this.subs.splice(index, 1);
            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.onList.splice(0, this.onList.length);
            this.subs.splice(0, this.subs.length);
            return this;
        }
    }]);
    return ReactTms;
}(Tms);

export default ReactTms;
export { createContext$1 as createContext, forEachTms, command };
