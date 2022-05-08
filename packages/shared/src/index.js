/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 21:35:14
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-08 16:26:04
 */
export function isObject(value) {
	return value !== null && typeof value === 'object'
}

export function isReactive(target) {
	return !!(target && target.__isReactive)
}

export function hasChanged(oldValue, value) {
	return oldValue !== value && !(Number.isNaN(oldValue) && Number.isNaN(value))
}

export function isArray(target) {
	return Array.isArray(target)
}

export function isString(target) {
	return typeof target === 'string'
}

export function isBoolean(target) {
	return typeof target === 'boolean'
}

export function isNumber(target) {
	return typeof target === 'number'
}

export function isRef(value) {
	return !!(value && value.__isRef)
}

export function isFunction(target) {
	return typeof target === 'function'
}
