import { hasChanged, isArray, isObject, isReactive } from '../../shared/src'
import { track, trigger } from './effect'

const proxyMap = new WeakMap()

export function reactive(target) {
	if (!isObject(target)) {
		return target
	}
	// 特例：reactive(reactive(target))
	if (isReactive(target)) {
		return target
	}
	// 特例：let a = reactive(obj), b = reactive(obj) => a!==b
	if (proxyMap.has(target)) {
		return proxyMap.get(target)
	}

	const proxy = new Proxy(target, {
		get(target, key, receiver) {
			if (key === '__isReactive') {
				return true
			}
			const res = Reflect.get(target, key, receiver)
			track(target, key)
			// 特例：处理深层对象代理
			return isObject(res) ? reactive(res) : res
		},
		set(target, key, value, receiver) {
			const oldValue = target[key]
			const oldLength = target.length
			const res = Reflect.set(target, key, value, receiver)
			// 特例：代理对象的值hasChanged不会重复执行effectFn
			if (hasChanged(oldValue, value)) {
				trigger(target, key)
				if (isArray(target) && hasChanged(oldLength, target.length)) {
					trigger(target, 'length')
				}
			}
			return res
		},
	})

	proxyMap.set(target, proxy)
	return proxy
}
