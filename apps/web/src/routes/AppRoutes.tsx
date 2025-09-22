import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import WorkFlowDashboard from "../pages/WorkFlowDashboard";
import WorkFlow from "../pages/WorkFlow";
    

export default function AppRoutes() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/workflows" element={<WorkFlowDashboard />} />
                <Route path="/workflow" element={<WorkFlow/>} />
            </Routes>
        </div>
    )
}