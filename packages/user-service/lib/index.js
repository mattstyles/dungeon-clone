
require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const { bootstrap, useGatewayCheck } = require('@internal/utils')
const { log } = require('./utils')

const app = new Koa()

app.use(logger())

app.use(useGatewayCheck())
app.use(bodyParser())

app.use(async (ctx, next) => {
  ctx.body = { body: 'public response.' }
  ctx.status = 200
})

app.use(async (ctx) => {
  ctx.body = {}
  ctx.status = 404
})

bootstrap(
  (err) => {
    console.error('Error bootstrapping user-service api')
    console.error(err)
  },
  (config) => {
    const port = process.env.PORT
    app.listen(port, () => {
      log('Listening on', port)
    })
  }
)
