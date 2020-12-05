
const Router = require('@koa/router')

const { cache } = require('./memcache')
const { isAuthenticated } = require('./middleware')

exports.notfound = () => (ctx) => {
  ctx.response.body = 'Not found.'
  ctx.response.status = 404
}

exports.createRouter = () => {
  const router = new Router()
  const config = cache.get('config')

  if (!config) {
    throw new Error('Can not find configuration')
  }

  router.get('/public', (ctx) => {
    ctx.body = 'public response'
    ctx.status = 200
  })
  router.get('/private', isAuthenticated(), (ctx) => {
    ctx.body = 'private response'
    ctx.status = 200
  })

  return router
}
