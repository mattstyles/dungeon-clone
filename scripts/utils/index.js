
import { useEffect, useState } from 'react'
import bent from 'bent'

export const get = bent(
  'https://graphql.fauna.com',
  'POST',
  {
    Authorization: `Bearer ${process.env.FAUNA_KEY}`
  }
)

const identity = _ => _

export const useQuery = (
  { query, variables, resolver = identity },
  dependencies = []
) => {
  const [state, setState] = useState(null)
  useEffect(() => {
    get('/graphql', {
      query,
      variables
    })
      .then(res => res.json())
      .then(data => setState(resolver(data)))
      .catch(err => {
        console.error(err)
        console.error(
          'Error within useQuery',
          JSON.stringify(query, null, '  '),
          JSON.stringify(variables, null, '  ')
        )
      })
  }, dependencies)

  return [state]
}

export const sendQuery = (
  { query, variables, resolver = identity }
) => {
  return new Promise((resolve, reject) => {
    get('/graphql', {
      query,
      variables
    })
      .then(res => res.json())
      .then(data => resolve(resolver(data)))
      .catch(err => {
        console.error(
          'Error within sendQuery',
          JSON.stringify(query, null, '  '),
          JSON.stringify(variables, null, '  ')
        )
        reject(err)
      })
  })
}
