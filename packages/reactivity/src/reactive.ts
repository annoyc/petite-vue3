import { isObject } from "@vue/shared"

const enum ReactiveFlags {
  IS_REACTIVE = '_v_isReactive',
}

const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if(key===ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    const res = Reflect.get(target, key, receiver)
    // don't return the raw reactive object as it can still be mutable
    return res
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    // trigger(target, key)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    if (res) {
      // trigger(target, key)
    }
    return res
  }
}

const reactiveMap = new WeakMap() // WeakMao弱引用，key必须是对象，如果key未被引用可以自动被回收

function createReactiveObject(target: object) {

  if ((target as any)[ReactiveFlags.IS_REACTIVE]) {
    return target
  }
  if(!isObject(target)) {
    return target
  }

  const existingProxy = reactiveMap.get(target)
  if(existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}


export function reactive(target: object) {
  return createReactiveObject(target)
}
