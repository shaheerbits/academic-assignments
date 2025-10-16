import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const RootLayout = () => {
  return (
    <main className="bg-light--aura min-h-screen text-dark--soul">
      <header className="flex justify-between items-center p-6">
        <h1 className='uppercase text-3xl font-bold'>Inkstack</h1>
        <div>
          <Link to="/new-story" className="bg-accent--ink text-light--aura px-4 py-2 rounded-md hover:opacity-90 transition-opacity">New Story</Link>
        </div>
      </header>
      <Outlet />
      <ToastContainer />
    </main>
  )
}

export default RootLayout
