
const gen = num => num * 1e10 >>> 1

const seed = Math.random()
const hash = gen(seed)
let count = 0

exports.generateUuid = () => (hash + gen(++count)).toString(36)
