/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 22:00:50
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-04-27 00:02:59
 */

import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const packageFormats =  process.env.FORMATS && process.env.FORMATS.split(',')
const sourcemap = process.env.SOURCE_MAP
const target = process.env.TARGET

// find the corresponding packages dirs to be rolluped
const packageDirs = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packageDirs, target) // the dir to be rolluped

const resolveFile = p => path.resolve(packageDir, p) // resolve file path
const pkg = require(resolveFile('package.json')) // package.json

const external = ['debug', ...Object.keys(pkg.dependencies || {})] // external dependencies

const outputConfig = {
  "esm-bundler": {
    format: 'es',
    file: resolveFile(`dist/${pkg.name}.esm-bundler.js`),
    sourcemap,
  },
  "cjs-bundler": {
    format: 'cjs',
    file: resolveFile(`dist/${pkg.name}.cjs-bundler.js`),
    sourcemap,
  },
  "iife": {
    file: resolveFile(`dist/${pkg.name}.global.js`),
    format: 'iife',
    sourcemap
  }
}


const createConfig = ({ file, format=pkg.buildOptions.formats, sourcemap }) => ({
  input: resolveFile(`src/index.ts`),
  output: {
    file,
    format,
    sourcemap,
    name: format === 'iife' ? pkg.buildOptions.name : pkg.name,
    externa: format === 'iife' ? [] : external,
    plugins: [
      json(),
      ts(),
      commonjs(),
      nodeResolve(),
      
    ],
  }
})
console.log('packageFormats', typeof process.env.FORMATS)
export default packageFormats.map(format => createConfig(outputConfig[format]))

