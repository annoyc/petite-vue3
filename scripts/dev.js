/*
 * @Author       : zhangyc
 * @Date         : 2022-04-26 21:48:36
 * @LastEditors  : zhangyc
 * @LastEditTime : 2022-04-27 21:51:25
 */
const minimist = require('minimist');
const execa = require('execa');

// 执行命令时打包的文件
const args = minimist(process.argv.slice(2)); // 获取命令行参数
const target = args._.length ? args._[0] : 'reactivity'; // 获取打包目标文件夹
const formats = args.f; // 获取打包格式
const sourcemap = args.s || false; // 获取是否生成sourcemap

execa('rollup', [
    '-wc', // --watch --config
    '--environment',
    [
      `TARGET:${target}`,
      `FORMATS:${formats}`,
      `SOURCE_MAP:${sourcemap}`,
      `NODE_ENV:development`,
      `LOG_FORMAT:pretty`,
      `LOG_DATE_FORMAT:yyyy-MM-dd HH:mm:ss`
    ].filter(Boolean).join(','),
], {
  stdio: 'inherit' // 输出到终端
})