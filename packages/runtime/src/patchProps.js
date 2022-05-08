/*
 * @Author       : zhangyc
 * @Date         : 2022-05-08 17:30:39
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-08 17:32:12
 */

export function patchProps(oldProps, newProps, el) {
	if (oldProps === newProps) {
		return
	}
	// 这里不使用es6的参数默认值是因为oldProps可能为null， oldProps={}则不会生效
	oldProps = oldProps || {}
	newProps = newProps || {}
	for (const key in newProps) {
		const next = newProps[key]
		const prev = oldProps[key]
		if (next !== prev) {
			patchDomProps(prev, next, el, key)
		}
	}
	// 如果oldProps中有没有newProps中的属性，则移除
	for (const key in oldProps) {
		if (!(key in newProps)) {
			patchDomProps(oldProps[key], null, el, key)
		}
	}
}

const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted|disabled)$/

function patchDomProps(prev, next, el, key) {
	switch (key) {
		case 'class':
			el.className = next || ''
			break
		case 'style':
			for (const styleKey in next) {
				el.style[styleKey] = next[styleKey]
			}
			// prev{color: 'red'} next{border: '1px solid'} 此时需移除prev.color
			if (prev) {
				for (const styleKey in prev) {
					if (!next || !next.hasOwnProperty(styleKey)) {
						el.style[styleKey] = ''
					}
				}
			}
			break
		default:
			// 判断on开头事件
			if (/^on[^a-z]/.test(key)) {
				const evtName = key.toLowerCase().substring(2)
				if (prev) {
					el.removeEventListener(evtName, prev)
				}
				if (next) {
					el.addEventListener(evtName, next)
				}
			} else if (domPropsRE.test(key)) {
				// { checked: ''} 或 { checked: false }会被解析为string类型的"false"
				if (next === '' && typeof el[key] === 'boolean') {
					next = true
				}
				el[key] = next
			} else {
				// 如果自定义属性{custom: ''}，则移除该属性
				if (next == null || next === false) {
					el.removeAttribute(key)
				} else {
					el.setAttribute(key, next)
				}
			}
			break
	}
}
