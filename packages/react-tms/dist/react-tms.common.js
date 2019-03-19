'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var Tms = _interopDefault(require('@fmfe/tms.js'));

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
function createContext(Store) {
    var defaultValue = {
        count: 0,
        store: null
    };
    var Context = React.createContext(defaultValue);
    return {
        getProvider: function getProvider(Component) {
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
                        var C = Component;
                        return React.createElement(Context.Provider, { value: this.state }, React.createElement(C, _extends({}, this.props)));
                    }
                }]);
                return Provider;
            }(React.Component);

            if (typeof Store.getReactTmsProvider === 'function') {
                Store.getReactTmsProvider(Component);
            }
            hoistNonReactStatics(Provider, Component);
            return Provider;
        },
        getProps: function getProps(Component, _getProps) {
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

                        return React.createElement(Context.Consumer, null, function (_ref) {
                            var store = _ref.store;

                            if (!store) return null;
                            var props = _getProps(store);
                            return React.createElement(Component, _extends({}, _this3.props, props));
                        });
                    }
                }]);
                return GetProps;
            }(React.Component);

            hoistNonReactStatics(GetProps, Component);
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

exports.forEachTms = forEachTms;
exports.createContext = createContext;
exports.command = command;
