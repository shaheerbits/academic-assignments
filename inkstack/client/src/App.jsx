import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './pages/auth/AuthLayout'
import LoginPage from './pages/auth/auth_pages/LoginPage'
import RegisterPage from './pages/auth/auth_pages/RegisterPage'
import RootLayout from './pages/root/RootLayout'
import NewStoryPage from './pages/root/root_pages/NewStoryPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<div>Main App</div>} />
          <Route path="/new-story" element={<NewStoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
