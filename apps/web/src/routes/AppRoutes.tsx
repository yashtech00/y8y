import { Route, Routes } from "react-router";


export default function AppRoutes() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/workflows" element={<WorkflowDashboard />} />
                <Route path="/workflow" element={<WorkFlow/>} />
            </Routes>
        </div>
    )
}