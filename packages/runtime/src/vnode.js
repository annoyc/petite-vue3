/*
 * @Author       : zhangyc
 * @Date         : 2022-05-06 22:06:54
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-08 21:39:29
 */
import { isString, isNumber, isArray } from '@vue/shared'
export const ShapeFlags = {
	ELEMENT: 1, // 00000001
	TEXT: 1 << 1, // 00000010
	FRAGMENT: 1 << 2, // 00000100
	COMPONENT: 1 << 3, // 00001000
	TEXT_CHILDREN: 1 << 4, // 00010000
	ARRAY_CHILDREN: 1 << 5, // 00100000
	CHILDREN: (1 << 4) | (1 << 5), // 00010000 | 00100000
}

export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')
/**
 *
 * @param {string | Object | Text | Fragment} type
 * @param {Object | null} props
 * @param {string | number | Array | null} children
 * @returns {VNode}
 */
export function h(type, props, children) {
	let shapeFlag = 0
	if (isString(type)) {
		shapeFlag = ShapeFlags.ELEMENT
	} else if (type === Text) {
		shapeFlag = ShapeFlags.TEXT
	} else if (type === Fragment) {
		shapeFlag = ShapeFlags.FRAGMENT
	} else {
		shapeFlag = ShapeFlags.COMPONENT
	}

	if (isString(children) || isNumber(children)) {
		shapeFlag |= ShapeFlags.TEXT_CHILDREN
		children = String(children)
	} else if (isArray(children)) {
		shapeFlag |= ShapeFlags.ARRAY_CHILDREN
	}

	return {
		type,
		props,
		children,
		shapeFlag,
		el: null,
		ancher: null,
	}
}
