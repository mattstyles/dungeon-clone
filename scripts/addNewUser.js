
import { prompt } from 'inquirer'

import { sendQuery } from './utils'
import { mutationCreateUser } from './utils/query'

prompt([
  {
    name: 'username',
    message: 'Enter new user name:'
  },
  {
    name: 'password',
    message: 'Enter new user password:',
    type: 'password'
  }
])
  .then(({ username, password }) => {
    return sendQuery({
      query: mutationCreateUser,
      variables: {
        name: username,
        pass: password
      },
      resolver: response => {
        return response.data.createUser
      }
    })
  })
  .then(response => {
    if (response.errors && response.errors.length) {
      console.error('Error with creating new user')
      response.errors.forEach(error => {
        console.error(error.message)
      })

      process.exit(1)
    }

    console.log('User created')
    console.log(JSON.stringify(response, null, '  '))
  })
  .catch(err => {
    console.error('Error with creating new user')
    console.error(err)
  })
