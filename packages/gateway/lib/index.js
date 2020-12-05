
require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const logger = require('koa-logger')

const { log } = require('./utils')
const { setAppId, setAuthenticated } = require('./middleware')
const { bootstrap } = require('./bootstrap')
const { notfound, createRouter } = require('./router')

const app = new Koa()

app.use(logger())
app.use(cors())

app.use(setAppId())
app.use(setAuthenticated())

/**
 * bootstrap sets up the memory cache for the config used by the router
 */
bootstrap(
  (err) => {
    console.error('Error bootstrapping gateway')
    console.error(err)
  },
  () => {
    // app.use((ctx, next) => {
    //   if (ctx.request.path !== '/public') {
    //     return next()
    //   }
    //
    //   log('Public route')
    //   ctx.response.body = 'Public response'
    //   ctx.status = 200
    // })
    //
    // app.use((ctx, next) => {
    //   if (ctx.request.path !== '/private') {
    //     return next()
    //   }
    //
    //   log('Private response.', 'Authentication', ctx.isAuthenticated)
    //   if (!ctx.isAuthenticated) {
    //     ctx.response.body = 'Not allowed.'
    //     ctx.status = 401
    //     return
    //   }
    //
    //   ctx.response.body = 'Private response'
    //   ctx.status = 200
    // })

    const router = createRouter()
    app.use(router.routes())
    app.use(router.allowedMethods())

    app.use(notfound())

    const port = process.env.PORT
    app.listen(port, () => {
      log(`Listening on ${port}`)
    })
  }
)
