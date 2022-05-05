/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 21:35:14
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-05 22:32:07
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
