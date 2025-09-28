import { Outlet } from "react-router-dom";

const WorkflowLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

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