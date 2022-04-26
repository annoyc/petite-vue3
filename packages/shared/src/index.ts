/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 21:35:14
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-04-26 21:40:54
 */
export function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object';
}