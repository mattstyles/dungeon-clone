
require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')

const { bootstrap, useGatewayCheck } = require('@internal/utils')
const { log } = require('./utils')

const app = new Koa()

app.use(logger())

app.use(useGatewayCheck())

app.use((ctx, next) => {
  ctx.body = { body: 'public response.' }
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
      log('Listening on', port)
    })
  }
)
