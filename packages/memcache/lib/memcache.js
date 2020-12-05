
const { generateUuid } = require('@internal/utils')

const defaultOptions = {
  expiryTime: 1000 * 60 * 24
}

class Memcache {
  constructor (options) {
    const opts = { ...defaultOptions, ...options }
    this.expiryTime = opts.expiryTime
    this.cache = {}
    this.expiry = {}
    this.index = {}
  }

  static of (options) {
    return new Memcache(options)
  }

  remove (path) {
    const key = this.index[path]

    if (!key) {
      delete this.index[path]
    }

    delete this.expiry[key]
    delete this.cache[key]
  }

  get (path, def) {
    const key = this.index[path]

    if (!key) {
      return def
    }

    const expires = this.expiry[key]

    if (expires < Date.now()) {
      this.remove(path)
      return def
    }

    const value = this.cache[key]

    return typeof value === 'undefined' || value === null
      ? def
      : value
  }

  set (path, value, options = {}) {
    const expiryTime = options.expiry || this.expiryTime

    const key = this.index[path] || generateUuid()

    this.index[path] = key
    this.expiry[key] = Date.now() + expiryTime
    this.cache[key] = value

    return value
  }
}

module.exports = {
  Memcache
}
