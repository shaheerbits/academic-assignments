import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './pages/auth/AuthLayout'
import LoginPage from './pages/auth/auth_pages/LoginPage'
import RegisterPage from './pages/auth/auth_pages/RegisterPage'
import RootLayout from './pages/root/RootLayout'
import NewStoryPage from './pages/root/root_pages/NewStoryPage'
import Home from './pages/root/root_pages/Home'
import ProfilePage from './pages/root/root_pages/ProfilePage'
import PublicProfilePage from './pages/root/root_pages/PublicProfilePage'
import StoryReadingPage from './pages/root/root_pages/StoryReadingPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new-story" element={<NewStoryPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/:userId' element={<PublicProfilePage />} />
          <Route path='/story/:storyId' element={<StoryReadingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
