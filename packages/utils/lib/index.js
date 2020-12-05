
require('dotenv').config()
const bent = require('bent')

/**
 * Generate a uuid
 */
const gen = num => num * 1e10 >>> 1

const seed = Math.random()
const hash = gen(seed)
let count = 0

exports.generateUuid = () => (hash + gen(++count)).toString(36)

/**
 * Each microservice wants to know about the app config
 */
const getConfig = bent(process.env.CONFIG_PORT, 'json')

exports.bootstrap = async (onFailure, onSuccess) => {
  try {
    const config = await getConfig()
    onSuccess(config)
  } catch (err) {
    onFailure(err)
  }
}

/**
 * Standard method to only allow the gateway key to access
 */
const gatewayIdHeader = 'x-gateway-id'
const isFromGateway = (headers) => {
  return headers[gatewayIdHeader] === process.env.GATEWAY_ID
}

exports.isFromGateway = isFromGateway

exports.useGatewayCheck = () => (ctx, next) => {
  if (!isFromGateway(ctx.request.header)) {
    ctx.body = 'Not allowed.'
    ctx.status = 401
    return
  }

  next()
}
