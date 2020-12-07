
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const bent = require('bent')
const chalk = require('chalk')

const { cache } = require('./memcache')
const { isAuthenticated } = require('./middleware')
const { log } = require('./utils')

const gatewayId = process.env.GATEWAY_KEY

exports.notfound = () => async (ctx) => {
  ctx.body = 'Not found.'
  ctx.status = 404
}

exports.createRouter = () => {
  const router = new Router()
  const config = cache.get('config')

  if (!config) {
    throw new Error('Can not find configuration')
  }

  for (const [, service] of Object.entries(config)) {
    const middleware = [bodyParser]

    log('Adding route', chalk.magenta(service.name))
    log(JSON.stringify(service, null, '  '))

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
          const res = await request(ctx.request.url, ctx.request.body, {
            'x-gateway-id': gatewayId,
            ...ctx.request.headers
          })

          const body = await res.json()

          ctx.body = body
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
