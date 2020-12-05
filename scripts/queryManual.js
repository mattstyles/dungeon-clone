
require('dotenv').config()

const bent = require('bent')

const get = bent(
  process.env.FAUNA_ENDPOINT,
  'POST',
  {
    Authorization: `Bearer ${process.env.FAUNA_KEY}`
  }
)

const getAllGamesQuery = `
query GetAllGames {
  allGames {
    data {
      _id
      name
      users {
        data {
          _id
          name
        }
      }
    }
  }
}`

async function run () {
  try {
    const res = await get('/graphql', {
      query: getAllGamesQuery
    })
    // console.log(res)

    const data = await res.json()

    console.log(JSON.stringify(data, null, '  '))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
