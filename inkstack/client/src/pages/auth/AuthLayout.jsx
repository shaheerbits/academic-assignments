import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div>
      <main className="h-screen flex gap-8 p-8 bg-dark--soul text-light--aura">
        <div className="relative bg-[url('images/auth_page_art.jpg')] bg-cover bg-center h-full w-1/2 p-8 rounded-2xl">
          <h1 className='text-3xl font-bold uppercase'>Inkstack</h1>
          <div className="text-xl absolute left-0 bottom-8 text-center w-full"><q>A modern blogging platform <br />built for creators.</q></div>
        </div>

        <div className="h-full w-1/2 flex justify-center items-center">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
