
const Router = require('@koa/router')
const bent = require('bent')

const { cache } = require('./memcache')
const { isAuthenticated } = require('./middleware')

const gatewayId = process.env.GATEWAY_KEY

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

  for (const [, service] of Object.entries(config)) {
    const middleware = []

    if (service.private) {
      middleware.push(isAuthenticated)
    }

    router.all(
      service.name,
      service.route,
      ...middleware.map(fn => fn()),
      // Proxy through to service
      async ctx => {
        try {
          const request = bent(ctx.request.method, service.url)
          const res = await request(ctx.request.url, null, {
            'x-gateway-id': gatewayId,
            ...ctx.request.headers
          })

          ctx.body = await res.json()
          ctx.status = res.status
        } catch (err) {
          console.error(err)
          ctx.status = 500
        }
      }
    )
  }

  return router
}
