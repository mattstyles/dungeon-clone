
import { prompt } from 'inquirer'

import { sendQuery } from './utils'
import { mutationCreateGame } from './utils/query'

prompt([
  {
    name: 'gamename',
    message: 'Enter new game name:'
  }
])
  .then(({ gamename }) => {
    return sendQuery({
      query: mutationCreateGame,
      variables: {
        name: gamename
      },
      resolver: response => {
        return response.data.createGame
      }
    })
  })
  .then(response => {
    if (response.errors && response.errors.length) {
      console.error('Error with creating new game')
      response.errors.forEach(error => {
        console.error(error.message)
      })

      process.exit(1)
    }

    console.log('Game created')
    console.log(JSON.stringify(response, null, '  '))
  })
  .catch(err => {
    console.error('Error with creating new game')
    console.error(err)
  })
