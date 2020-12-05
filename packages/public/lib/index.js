
require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')

const { bootstrap } = require('@internal/utils')

const app = new Koa()

app.use(logger())

const gatewayIdHeader = 'x-app-id'

app.use((ctx, next) => {
  // @TODO check gateway-id

  const gatewayId = ctx.request.header[gatewayIdHeader]

  if (!gatewayId || gatewayId !== process.env.GATEWAY_ID) {
    ctx.body = 'Not allowed.'
    ctx.status = 401
    return
  }

  ctx.body = 'public response.'
  ctx.status = 200
})

bootstrap(
  (err) => {
    console.error('Error bootstrapping public api')
    console.error(err)
  },
  (config) => {
    const port = process.env.PORT
    app.listen(port, () => {
      console.log('Listening on', port)
    })
  }
)
