import { hasChanged, isObject, isRef } from '../../shared/src'
import { track, trigger } from './effect'
import { reactive } from './reactive'

/*
 * @Author       : zhangyc
 * @Date         : 2022-05-05 23:06:04
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-06 00:02:25
 */
export function ref(value) {
	if (isRef(value)) {
		return value
	}

	return new RefImpl(value)
}

class RefImpl {
	constructor(value) {
		this.__isRef = true
		this._value = convert(value)
	}

	get value() {
		track(this, 'value')
		return this._value
	}

	set value(newValue) {
		if (hasChanged(newValue, this._value)) {
			this._value = convert(newValue)
			trigger(this, 'value')
		}
	}
}

function convert(value) {
	return isObject(value) ? reactive(value) : value
}
