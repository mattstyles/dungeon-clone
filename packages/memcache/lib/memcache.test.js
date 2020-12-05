
const tape = require('tape')

const { Memcache } = require('./memcache')

tape('[memcache] get/set', t => {
  t.plan(3)

  const cache = Memcache.of()

  cache.set('foo', 'bar')
  t.equals(cache.get('foo'), 'bar', 'retrieves a flat value')
  t.equals(
    typeof cache.get('bar'),
    'undefined',
    'returns undefined for unset keys'
  )
  t.equals(cache.get('bar', 'quux'), 'quux', 'default value can be set')
})

tape('[memcache] remove', t => {
  t.plan(1)

  const cache = Memcache.of()

  cache.set('foo', 'bar')
  cache.remove('foo')
  t.equals(typeof cache.get('foo'), 'undefined', 'removes a key')
})

tape('[memcache] expiry', t => {
  t.plan(1)

  const cache = Memcache.of({
    expiryTime: 1
  })

  cache.set('foo', 'bar')
  setTimeout(() => {
    t.equals(typeof cache.get('foo'), 'undefined', 'after expiry value is removed')
  }, 10)
})
