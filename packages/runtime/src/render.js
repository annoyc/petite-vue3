/*
 * @Author       : zhangyc
 * @Date         : 2022-05-08 15:03:06
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-08 16:08:06
 */
import { ShapeFlags } from './vnode'
export function render(vnode, container) {
	mount(vnode, container)
}

function mount(vnode, container) {
	const { shapeFlag } = vnode
	if (shapeFlag & ShapeFlags.ELEMENT) {
		mountElement(vnode, container)
	} else if (shapeFlag & ShapeFlags.TEXT) {
		mountTextNode(vnode, container)
	} else if (shapeFlag & ShapeFlags.FRAGMENT) {
		mountFragment(vnode, container)
	} else if (shapeFlag & ShapeFlags.COMPONENT) {
		mountComponent(vnode, container)
	}
}

function mountElement(vnode, container) {
	const { type, props } = vnode
	const el = document.createElement(type)
	mountProps(el, props)
	mountChildren(vnode, el)
	container.appendChild(el)
}
function mountTextNode(vnode, container) {
	const textNode = document.createTextNode(vnode.children)
	container.appendChild(textNode)
}
function mountFragment(vnode, container) {
	mountChildren(vnode, container)
}
function mountComponent(vnode, container) {}

function mountChildren(vnode, container) {
	const { shapeFlag, children } = vnode
	if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
		mountTextNode(vnode, container)
	} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
		children.forEach(child => {
			mount(child, container)
		})
	}
}

const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted|disabled)$/
function mountProps(el, props) {
	for (const key in props) {
		let value = props[key]
		switch (key) {
			case 'class':
				el.className = value
				break
			case 'style':
				for (const styleKey in value) {
					el.style[styleKey] = value[styleKey]
				}
				break
			default:
				// 判断on开头事件
				if (/^on[^a-z]/.test(key)) {
					const evtName = key.toLowerCase().substring(2)
					el.addEventListener(evtName, value)
				} else if (domPropsRE.test(key)) {
					// { checked: ''} 或 { checked: false }会被解析为string类型的"false"
					if (value === '' && typeof el[key] === 'boolean') {
						value = true
					}
					el[key] = value
				} else {
					// 如果自定义属性{custom: ''}，则移除该属性
					if (value == null || value === false) {
						el.removeAttribute(key)
					} else {
						el.setAttribute(key, value)
					}
				}
				break
		}
	}
}
