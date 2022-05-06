/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 22:00:50
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-05-06 21:43:59
 */

import path from 'path'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const packageFormats = process.env.FORMATS
const sourcemap = process.env.SOURCE_MAP
const target = process.env.TARGET

// find the corresponding packages dirs to be rolluped
const packageDirs = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packageDirs, target) // the dir to be rolluped

const resolveFile = p => path.resolve(packageDir, p) // resolve file path
const pkg = require(resolveFile('package.json')) // package.json

const external = ['debug', ...Object.keys(pkg.dependencies || {})] // external dependencies

const outputConfig = {
	'esm-bundler': {
		format: 'es',
		file: resolveFile(`dist/${pkg.name}.esm-bundler.js`),
		sourcemap,
	},
	'cjs-bundler': {
		format: 'cjs',
		file: resolveFile(`dist/${pkg.name}.cjs-bundler.js`),
		sourcemap,
	},
	global: {
		file: resolveFile(`dist/${pkg.name}.global.js`),
		format: 'iife',
		sourcemap,
	},
}

const packageConfigs =
	packageFormats === 'undefined'
		? pkg.buildOptions.formats
		: packageFormats.split(',')

const createConfig = output => ({
	input: resolveFile(`src/index.js`),
	output: {
		...output,
		name: output.format === 'iife' ? pkg.buildOptions.name : pkg.name,
	},
	externa: output.format === 'iife' ? [] : external,
	plugins: [json(), commonjs(), nodeResolve()],
})
console.log(packageConfigs.map(format => createConfig(outputConfig[format])))
export default packageConfigs.map(format => createConfig(outputConfig[format]))
