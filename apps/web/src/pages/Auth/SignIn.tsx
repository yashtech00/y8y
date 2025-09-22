import { useState } from "react";
import { SignInAPI } from "../../constants/Api";
import { useNavigate } from "react-router";


export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(SignInAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log(data);
            const authHeader = res.headers.get('Authorization') || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
            if (!token) {
                throw new Error('No token found in response headers');
            }
            localStorage.setItem("token", token);
            navigate("/workflows");
        }catch (e) {
            console.log(e);
            throw e;
        }
    }

    return (
        <div>
            <h1>SignIn</h1>
            <form onSubmit={handelSubmit}>
                <input type="text" placeholder="Email"
                    value={email}
                    className="border border-gray-300 rounded p-2"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password" placeholder="Password"
                    value={password}
                    className="border border-gray-300 rounded p-2"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >Sign In</button>
            </form>
        </div>
    )
}