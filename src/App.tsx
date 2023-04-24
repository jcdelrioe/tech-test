import { useState, useEffect, useRef } from 'react'
import './App.css'
import { type User } from './types'
import { UsersList } from './components/UsersList'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState(null)

  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => { setSortByCountry(prevState => !prevState) }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const filteredUsers = filterCountry !== null && filterCountry.length > 0
  ? users.filter((user) => {
    return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
  })
  : users

  const sortedUsers = sortByCountry
    ? filteredUsers.toSorted((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    })
    : filteredUsers

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  return (
    <div className='App'>
      <h1>Prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>{sortByCountry ? 'No ordenar por pais' : 'Ordenar por pais'}</button>
        <button onClick={handleReset}>Resetear estado</button>
        <input placeholder='Filtra por pais' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />
      </header>
      <main>
        <UsersList deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </div>

  )
}

export default App
