(function (exports) {
  'use strict';

  function effect() {
  }

  /*
   * @Author       : zhangyc
   * @Date         : 2022-04-26 21:35:14
   * @LastEditors  : zhangyc
   * @LastEditTime : 2022-04-26 21:40:54
   */
  function isObject(value) {
      return value !== null && typeof value === 'object';
  }

  var mutableHandlers = {
      get: function (target, key, receiver) {
          var res = Reflect.get(target, key, receiver);
          // don't return the raw reactive object as it can still be mutable
          return res;
      },
      set: function (target, key, value, receiver) {
          var res = Reflect.set(target, key, value, receiver);
          // trigger(target, key)
          return res;
      },
      deleteProperty: function (target, key) {
          var res = Reflect.deleteProperty(target, key);
          return res;
      }
  };
  function createReactiveObject(target) {
      if (!isObject(target)) {
          return target;
      }
      new Proxy(target, mutableHandlers);
      console.log(target);
  }
  function reactive(target) {
      return createReactiveObject(target);
  }

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
