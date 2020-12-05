
import React, { useState } from 'react'
import { render, Text, Box, useInput } from 'ink'

import { useQuery } from './utils'
import { queryGetAllGames, queryGetAllUsers, mutationAddUserToGame } from './utils/query'

const routes = {
  setGame: 'setGame',
  setUser: 'setUser',
  addUserToGame: 'addUserToGame',
  fin: 'fin'
}

const Router = ({ route, setRoute, appState, setAppState }) => {
  if (route === routes.setGame) {
    return <SetGame setRoute={setRoute} appState={appState} setAppState={setAppState} />
  }

  if (route === routes.setUser) {
    return <SetUser setRoute={setRoute} appState={appState} setAppState={setAppState} />
  }

  if (route === routes.addUserToGame) {
    return <AddUser setRoute={setRoute} appState={appState} setAppState={setAppState} />
  }

  if (route === routes.fin) {
    return <Text>Done.</Text>
  }

  return <Text>Something unexpected happened...</Text>
}

const SetGame = ({ setRoute, appState, setAppState }) => {
  const [games] = useQuery({
    query: queryGetAllGames,
    resolver: response => {
      return response.data.allGames.data
    }
  })
  const [selectedIndex, setIndex] = useState(0)
  useInput((input, key) => {
    if (key.upArrow && selectedIndex > 0) {
      setIndex(selectedIndex - 1)
    }

    if (key.downArrow && selectedIndex < games.length - 1) {
      setIndex(selectedIndex + 1)
    }

    if (key.return) {
      setAppState({
        ...appState,
        game: selectedGame._id,
        gameName: selectedGame.name
      })
      setRoute(routes.setUser)
    }
  })

  if (!games) {
    return <Text>Generating computational matrix...</Text>
  }

  const selectedGame = games[selectedIndex]

  return (
    <>
      <Text>Current users in games</Text>
      <Box>
        <Box flexDirection='column' minWidth={20} borderStyle='single'>
          <Text>Games</Text>
          <Text>---</Text>
          {games.map((game, index) => {
            return (
              <Text key={game._id} inverse={index === selectedIndex}>
                <Text>{game.name + ' '}</Text>
                <Text color='gray'>{' ' + game._id}</Text>
              </Text>
            )
          })}
        </Box>
        <Box flexDirection='column' minWidth={20} borderStyle='single'>
          <Text>Users in game</Text>
          <Text>---</Text>
          {selectedGame.users.data.map(user => {
            return (
              <Text key={user._id}>
                {user.name}
              </Text>
            )
          })}
        </Box>
      </Box>
    </>
  )
}

const SetUser = ({ setRoute, appState, setAppState }) => {
  const [users] = useQuery({
    query: queryGetAllUsers,
    resolver: response => {
      return response.data.allUsers.data
    }
  })
  const [selectedIndex, setIndex] = useState(0)

  useInput((input, key) => {
    if (key.upArrow && selectedIndex > 0) {
      setIndex(selectedIndex - 1)
    }

    if (key.downArrow && selectedIndex < users.length - 1) {
      setIndex(selectedIndex + 1)
    }

    if (key.return) {
      setAppState({
        ...appState,
        user: selectedUser._id
      })
      setRoute(routes.addUserToGame)
    }
  })

  if (!users) {
    return <Text>Extruding transmutational phalanges...</Text>
  }

  const selectedUser = users[selectedIndex]

  return (
    <>
      <Text>All current users:</Text>
      <Box flexDirection='column' minWidth={20} borderStyle='single'>
        {users.map((user, index) => {
          return (
            <Text key={user._id} inverse={selectedIndex === index}>
              {user.name}
            </Text>
          )
        })}
      </Box>
    </>
  )
}

const AddUser = ({ setRoute, appState, setAppState }) => {
  const [data] = useQuery({
    query: mutationAddUserToGame,
    variables: {
      user: appState.user,
      game: appState.game,
      gameName: appState.gameName
    },
    resolver: res => {
      if (res.data) {
        return {
          game: res.data.updateGame,
          users: res.data.updateGame.users.data
        }
      }
      return res
    }
  })

  useInput((input, key) => {
    if (key.return) {
      setRoute(routes.fin)
    }
  })

  // @TODO use suspense and error boundaries
  if (!data) {
    return <Text>Conflagrating simplex regions...</Text>
  }

  if (data.errors && data.errors.length) {
    return (
      <Box flexDirection='column' minWidth={20}>
        {data.errors.map((err, i) => {
          return <Text key={`err.${i}`}>{JSON.stringify(err, null, '  ')}</Text>
        })}
      </Box>
    )
  }

  return (
    <>
      <Text>{`Game updated: ${data.game.name}`}</Text>
      <Box flexDirection='column' minWidth={20}>
        <Text>Players:</Text>
        {data.users.map(user => {
          return <Text key={user._id}>{user.name}</Text>
        })}
      </Box>
      <Text>Hit enter to complete.</Text>
    </>
  )
}

const App = () => {
  const [route, setRoute] = useState('setGame')
  const [appState, setAppState] = useState({})
  return <Router route={route} setRoute={setRoute} appState={appState} setAppState={setAppState} />
}

render(<App />)
