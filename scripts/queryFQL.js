
require('dotenv').config()
const faunadb = require('faunadb')
// const inquirer = require('inquirer')

const q = faunadb.query

const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

const onError = err => {
  console.error(err)
  process.exit(1)
}

const findUsers = () => {
  return new Promise((resolve, reject) => {
    client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('User'))),
        q.Lambda(x => q.Get(x))
      )
    )
      .then(res => {
        // res.data.forEach(user => {
        //   console.log(JSON.stringify(user, null, '  '))
        //   console.log('---')
        // })
        resolve(res.data.map(user => {
          return {
            _id: user.ref.id,
            name: user.data.name
          }
        }))
      })
      .catch(reject)
  })
}

const findGames = () => {
  return new Promise((resolve, reject) => {
    client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('Game'))),
        q.Lambda(x => q.Get(x))
      )
    )
      .then(res => {
        res.data.forEach(game => {
          console.log(JSON.stringify(game, null, '  '))
          console.log('---')
        })
        resolve(res.data.map(game => {
          return {
            _id: game.ref.id,
            name: game.data.name
          }
        }))
      })
      .catch(reject)
  })
}

findUsers().then(res => console.log(res)).catch(onError)
findGames().then(res => console.log(res)).catch(onError)
