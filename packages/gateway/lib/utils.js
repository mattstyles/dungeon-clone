
const chalk = require('chalk')
const pkg = require('../package.json')

const pre = chalk.cyan(`[${pkg.name}@${pkg.version}]`)

exports.log = function () {
  console.log(pre, ...arguments)
}
