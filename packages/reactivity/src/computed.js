import { isFunction } from '@vue/shared'
import { effect, track, trigger } from './effect'
/*
 * @Author       : zhangyc
 * @Date         : 2022-05-06 00:04:55
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-06 21:19:53
 */
export function computed(getterOrOption) {
	let getter, setter
	if (isFunction(getterOrOption)) {
		getter = getterOrOption
		setter = () => {
			console.warn('computed is readonly')
		}
	} else {
		getter = getterOrOption.get
		setter = getterOrOption.set
	}
	return new ComputedImpl(getter, setter)
}

class ComputedImpl {
	constructor(getter, setter) {
		this._setter = setter
		this._value = undefined
		this._dirty = true
		this.effect = effect(getter, {
			// 首次不执行effectFn
			lazy: true,
			// 新值更新后执行的是scheduler函数
			scheduler: () => {
				if (!this._dirty) {
					this._dirty = true
					trigger(this, 'value')
				}
			},
		})
	}

	get value() {
		if (this._dirty) {
			// 此处this._value为getter函数的返回结果
			this._value = this.effect()
			this._dirty = false
			track(this, 'value')
		}
		return this._value
	}

	set value(newValue) {
		this._setter(newValue)
	}
}
