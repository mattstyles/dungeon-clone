
require('dotenv').config()

const gql = require('graphql-tag')
const { GraphQLClient } = require('graphql-request')

const getAllGamesQuery = gql`
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

const client = new GraphQLClient(process.env.FAUNA_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.FAUNA_KEY}`
  }
})

async function run () {
  const res = await client.request(getAllGamesQuery)

  // console.log(JSON.stringify(res, null, '  '))

  res.allGames.data.forEach(game => {
    console.log(game.name)
    game.users.data.forEach(user => {
      console.log(`  ${user.name}`)
    })
  })
}

run()
