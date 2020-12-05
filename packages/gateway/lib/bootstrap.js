
const bent = require('bent')

const { cache } = require('./memcache')

const getConfig = bent(process.env.CONFIG_PORT, 'json')

exports.bootstrap = async (onFailure, onSuccess) => {
  try {
    const config = await getConfig()
    cache.set('config', config)
    onSuccess()
  } catch (err) {
    onFailure(err)
  }
}
