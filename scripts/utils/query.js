
export const queryGetAllGames = `
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

export const queryGetAllUsers = `
query GetAllUsers {
  allUsers {
    data {
      _id
      name
    }
  }
}
`

export const mutationCreateUser = `
mutation CreateUser ($name: String!, $pass: String!) {
  createUser(data: {
    name: $name,
    password: $pass
  }) {
    _id
    name
  }
}
`

export const mutationCreateGame = `
mutation CreateGame ($name: String!) {
  createGame(data: {
    name: $name
  }) {
    _id
    name
  }
}
`

export const mutationAddUserToGame = `
mutation AddUserToGame ($game: ID!, $user: [ID], $gameName: String!) {
  updateGame(id: $game, data: {
    name: $gameName,
    users: {
      connect: $user
    }
  }) {
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
`
