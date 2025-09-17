import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const navigate = useNavigate();

  useEffect(() => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUser);
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');

    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between px-8 py-6 fixed top-0 left-0 right-0 z-40 bg-[#f4f4f577] backdrop-blur-md">
      <div>
        <h1 className="text-2xl font-bold"><Link to="/">Libxcel.</Link></h1>
        {isAdmin && (
          <div>
            Prof. Amol Warad
          </div>
        )}
      </div>

      {
        isLoggedIn && (
          <div className="flex gap-8 text-zinc-600">
            <Link to="/books">Books</Link>
            <Link to="/issue-book">Issue Books</Link>
            <Link to="/students">Students</Link>
            <Link to="/view-issued-books">View Issued Books</Link>
          </div>
        )
      }

      {
        isLoggedIn && (
          <button className="px-8 py-2 rounded-sm bg-zinc-800 text-zinc-50 cursor-pointer hover:bg-zinc-600 transition duration-300" onClick={handleLogout}>Logout</button>
        )
      }
    </header>
  )
}

export default Header