let activeEffect // 记录当前正在执行的副作用

// 特例：解决嵌套effect的问题
let effectStack = []

/**
 * { // 这是一个WeakMap
 *  [target]: {  // key是reactiveObject，value是一个Map
 *    [key]: [] // key是reactiveObject的键值，value是Set的数组集合
 *  }
 * }
 */
let targetMap = new WeakMap()
export function effect(fn, options = {}) {
	const effectFn = () => {
		try {
			activeEffect = effectFn
			effectStack.push(activeEffect)
			// return的数据用于计算属性
			return fn()
		} finally {
			effectStack.pop()
			activeEffect = effectStack[effectStack.length - 1]
		}
	}
	if (!options.lazy) {
		effectFn()
	}
	effectFn.scheduler = options.scheduler
	return effectFn
}

// proxy的get方法中调用
export function track(target, key) {
	if (!activeEffect) {
		return
	}
	// 存储reactiveObject取值时收集的属性
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}
	let deps = depsMap.get(key)
	if (!deps) {
		depsMap.set(key, (deps = new Set()))
	}

	deps.add(activeEffect)
}

// proxy的set方法中调用
export function trigger(target, key) {
	// 查找当前key所是收集的effectFn并依次执行
	const depsMap = targetMap.get(target)
	if (!depsMap) {
		return
	}
	const deps = depsMap.get(key)
	if (!deps) {
		return
	}
	deps.forEach(effectFn => {
		if (effectFn.scheduler) {
			effectFn.scheduler(effectFn)
		} else {
			effectFn()
		}
	})
}
