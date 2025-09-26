import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Background, Controls, ReactFlow } from "@xyflow/react";

const WorkflowLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className=" ">
           
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkflowLayout;