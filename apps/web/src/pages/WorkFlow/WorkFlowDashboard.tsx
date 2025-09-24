import { useEffect, useState } from "react";
import { fetchWorkflows, updateWorkflow } from "../../utils/Api";
import { useNavigate } from "react-router";

interface Workflow {
  id: string;
  title: string;
  triggerType: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WorkFlowDashboard() {
  const [activeTab, setActiveTab] = useState("Workflows");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const navigate=useNavigate();

  const token = localStorage.getItem("token") || ""; // adjust auth handling

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const data = await fetchWorkflows(token);
        setWorkflows(data.workflows);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWorkflows();
  }, [token]);

  const toggleWorkflow = async (workflow: Workflow) => {
    try {
      await updateWorkflow(
        workflow.id,
        { enabled: !workflow.enabled },
        token
      );
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflow.id ? { ...w, enabled: !w.enabled } : w
        )
      );
    } catch (err: any) {
      alert("Failed to update workflow");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <button
        onClick={() => navigate("/workflow/create")}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
      >
        Create Workflow
      </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-700 mb-4">
        {["Workflows", "Credentials", "Executions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-red-500 font-semibold"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Workflows list */}
      {activeTab === "Workflows" && (
        <div className="space-y-4">
          {workflows.length === 0 ? (
            <p className="text-gray-400">No workflows found.</p>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{workflow.title}</h2>
                  <p className="text-xs text-gray-400">
                    Last updated {new Date(workflow.updatedAt).toLocaleDateString()} | Created{" "}
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-gray-400">
                    Trigger: {workflow.triggerType}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    onClick={() => toggleWorkflow(workflow)}
                    className={`cursor-pointer px-3 py-1 text-xs rounded-md ${
                      workflow.enabled
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {workflow.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
