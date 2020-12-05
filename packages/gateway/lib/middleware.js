
const { log } = require('./utils')

/**
 * App ID middleware check
 */

const getAppIds = () => {
  const idString = process.env.APP_ID
  return idString.split(',')
}

const appIds = getAppIds()
const appIdHeader = 'x-app-id'

exports.setAppId = () => async (ctx, next) => {
  const appId = ctx.request.header[appIdHeader]
  log('AppID:', appId)

  if (!appIds.includes(appId)) {
    log('AppID not authorised')
    ctx.response.body = 'Unauthorised.'
    ctx.response.status = 401
    return
  }

  await next()
}

/**
 * Auth token for private APIs check
 */

const getAuthToken = auth => {
  if (!auth) {
    return null
  }

  const authSplit = auth.split('Bearer ')

  if (!authSplit || authSplit[0] !== '') {
    return null
  }

  return authSplit[1]
}

// Hard-coded for now
const checkAuthToken = (token) => {
  const isValid = token === 'authToken'
  log('Checking token', token, isValid)
  return isValid
}

exports.setAuthenticated = () => async (ctx, next) => {
  const token = getAuthToken(ctx.request.header.authorization)

  if (!token) {
    ctx.isAuthenticated = false
    return await next()
  }

  ctx.isAuthenticated = checkAuthToken(token)
  await next()
}

exports.isAuthenticated = () => (ctx, next) => {
  if (ctx.isAuthenticated) {
    next()
    return
  }

  ctx.body = 'Not allowed.'
  ctx.status = 401
}
