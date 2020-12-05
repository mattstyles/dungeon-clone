
const chalk = require('chalk')
const pkg = require('../package.json')

const pre = chalk.cyan(`[${pkg.name}@${pkg.version}]`)

exports.log = function () {
  console.log(pre, ...arguments)
}

const gen = num => num * 1e10 >>> 1

const seed = Math.random()
const hash = gen(seed)
let count = 0

exports.generateUuid = () => (hash + gen(++count)).toString(36)
