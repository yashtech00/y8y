import { LayoutDashboard, Workflow, Users, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Heading */}
      <div className="p-6 text-2xl font-bold tracking-wide border-b border-gray-700">
        Y8Y
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/workflows"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Workflow size={20} />
          <span>Workflows</span>
        </Link>

        <Link
          to="/users"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Users size={20} />
          <span>Users</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
