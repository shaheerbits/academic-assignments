import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'

const RootLayout = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const readUserFromStorage = () => {
      try {
        const raw = localStorage.getItem('user')
        if (raw) setUser(JSON.parse(raw))
        else setUser(null)
      } catch (err) {
        console.error('Failed to parse user from localStorage', err)
      }
    }

    readUserFromStorage()

    const onUserUpdated = () => readUserFromStorage()
    const onStorage = (e) => {
      if (!e || e.key === 'user') readUserFromStorage()
    }

    window.addEventListener('user-updated', onUserUpdated)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('user-updated', onUserUpdated)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const initial = () => {
    const name = user?.name || user?.username || ''
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  return (
    <main className="bg-light--aura min-h-screen text-dark--soul">
      <header className="flex justify-between items-center p-6">
        <Link to="/"><h1 className='uppercase text-3xl font-bold'>Inkstack</h1></Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link to="/new-story" className="bg-accent--ink text-light--aura px-4 py-2 rounded-md hover:opacity-90 transition-opacity">New Story</Link>
          )}

          {user ? (
            <Link to="/profile" aria-label="Profile" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:opacity-90 transition-opacity overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name || user.username || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {initial()}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="bg-accent--ink text-light--aura px-3 py-2 rounded-md hover:opacity-90 transition-opacity">Login</Link>
          )}
        </div>
      </header>
      <Outlet />
      <ToastContainer />
    </main>
  )
}

export default RootLayout
