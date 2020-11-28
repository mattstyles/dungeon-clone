
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const { validate } = require('graphql/validation')

const file = args._[0]

if (!file) {
  console.error('Supply a file to validate')
  process.exit(1)
}

const getFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      reject(err)
    }

    resolve(data)
  })
})

const validateFile = contents => new Promise((resolve, reject) => {
  try {
    validate(contents)
    resolve()
  } catch (err) {
    reject(err)
  }
})

const onSuccess = () => {
  console.log('Validated. Carry on doing the good work 👍')
}

const onErr = err => {
  console.error(err)
  process.exit(1)
}

getFile(file)
  .then(validateFile)
  .then(onSuccess)
  .catch(onErr)
