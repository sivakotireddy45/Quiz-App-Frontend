// 📄 File: src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🧠 QuizApp
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/quiz" className="hover:underline">
              Quiz
            </Link>
            <Link to="/results" className="hover:underline">
              Results
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
