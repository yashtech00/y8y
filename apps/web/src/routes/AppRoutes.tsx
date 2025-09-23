import { Route, Routes, Navigate } from "react-router";
import Home from "../pages/Home";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import WorkFlowDashboard from "../pages/WorkFlow/WorkFlowDashboard";
import WorkFlow from "../pages/WorkFlow/WorkFlow";
import WorkflowLayout from "../pages/WorkFlow/workflowLayout";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes with Workflow Layout */}
            <Route element={<WorkflowLayout />}>
                <Route path="/workflows" element={<WorkFlowDashboard />} />
                <Route path="/workflow" element={<WorkFlow />} />
                
                {/* Add more workflow-related routes here */}
                <Route path="/dashboard" element={<Navigate to="/workflows" replace />} />
            </Route>
            
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}