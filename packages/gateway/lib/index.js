
require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const logger = require('koa-logger')

const { log } = require('./utils')
const { useAppId, useIsAuthenticated } = require('./middleware')

const app = new Koa()

app.use(logger())
app.use(cors())

app.use(useAppId())
app.use(useIsAuthenticated())

app.use((ctx, next) => {
  if (ctx.request.path !== '/public') {
    return next()
  }

  log('Public route')
  ctx.response.body = 'Public response'
  ctx.status = 200
})

app.use((ctx, next) => {
  if (ctx.request.path !== '/private') {
    return next()
  }

  log('Private response.', 'Authentication', ctx.isAuthenticated)
  if (!ctx.isAuthenticated) {
    ctx.response.body = 'Not allowed.'
    ctx.status = 401
    return
  }

  ctx.response.body = 'Private response'
  ctx.status = 200
})

app.use((ctx) => {
  log('Not found.')
  ctx.response.body = 'Not found.'
  ctx.response.status = 404
})

const port = process.env.PORT
app.listen(port, () => {
  log(`Listening on ${port}`)
})
