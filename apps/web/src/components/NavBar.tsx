import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          My N8n
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link
            to="/signIn"
            className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signUp"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};
