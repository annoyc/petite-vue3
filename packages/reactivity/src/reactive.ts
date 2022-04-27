import { isObject } from "@vue/shared"

const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
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


function createReactiveObject(target: object) {
  if(!isObject(target)) {
    return target
  }

  const proxy = new Proxy(target, mutableHandlers)
  return proxy
}


export function reactive(target: object) {
  return createReactiveObject(target)
}
