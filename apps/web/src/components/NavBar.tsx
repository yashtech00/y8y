import { Link } from "react-router-dom"


export const NavBar = () => {
    return (
        <div>
            <div className="flex justify-between p-4">
                <h1>My N8n</h1>
                <div className="flex gap-4">
                    <Link to="/signIn" className="bg-blue-500 px-4 py-2 rounded text-white">Sign In</Link>
                    <Link to="/signUp" className="bg-blue-500 px-4 py-2 rounded text-white">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}