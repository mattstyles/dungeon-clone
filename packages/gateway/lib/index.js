
require('dotenv').config()
const Koa = require('koa')
const cors = require('@koa/cors')
const logger = require('koa-logger')

const { bootstrap } = require('@internal/utils')
const { log } = require('./utils')
const { setAppId, setAuthenticated } = require('./middleware')
const { cache } = require('./memcache')
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
  (config) => {
    cache.set('config', config)

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
