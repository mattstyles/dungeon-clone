
require('dotenv').config()
const Koa = require('koa')
const logger = require('koa-logger')

const { config } = require('./config')

const app = new Koa()

app.use(logger())

app.use((ctx, next) => {
  if (ctx.request.path !== '/') {
    next()
    return
  }

  ctx.body = config
  ctx.status = 200
})

app.use((ctx, next) => {
  ctx.body = 'Not found.'
  ctx.status = 404
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Config server listening on ${port}`)
})
