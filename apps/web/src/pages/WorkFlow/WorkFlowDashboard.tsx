import { useEffect, useState } from "react";
import {
  fetchWorkflows,
  updateWorkflow,
  fetchCredentials,
  createCredential,
} from "../../utils/Api";
import { Link } from "react-router-dom";

interface Workflow {
  id: string;
  title: string;
  triggerType: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Credential {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

export default function WorkFlowDashboard() {
  const [activeTab, setActiveTab] = useState("Workflows");

  // workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [wfLoading, setWfLoading] = useState(true);
  const [wfError, setWfError] = useState("");

  // credentials
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credLoading, setCredLoading] = useState(false);
  const [credError, setCredError] = useState("");
  const [showCredForm, setShowCredForm] = useState(false);
  const [credName, setCredName] = useState("");
  const [credType, setCredType] = useState("API Key");

  const token = localStorage.getItem("token") || "";

  // load workflows
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const data = await fetchWorkflows(token);
        setWorkflows(data.workflows || []);
      } catch (err: any) {
        setWfError(err.message);
      } finally {
        setWfLoading(false);
      }
    };
    loadWorkflows();
  }, [token]);

  // load credentials when tab active
  useEffect(() => {
    if (activeTab === "Credentials") {
      setCredLoading(true);
      fetchCredentials(token)
        .then((data) => setCredentials(data.credentials || []))
        .catch((err: any) => setCredError(err.message))
        .finally(() => setCredLoading(false));
    }
  }, [activeTab, token]);

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
    } catch {
      alert("Failed to update workflow");
    }
  };

  const handleCreateCredential = async () => {
    try {
      await createCredential({ name: credName, type: credType }, token);
      setCredentials((prev) => [
        ...prev,
        { id: Date.now().toString(), name: credName, type: credType, createdAt: new Date().toISOString() },
      ]);
      setShowCredForm(false);
      setCredName("");
      setCredType("API Key");
    } catch (err: any) {
      alert("❌ Failed to create credential: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        {activeTab === "Workflows" && (
          <Link to="/workflow/editor">
            <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground transition-colors">
              Create Workflow
            </button>
          </Link>
        )}
        {activeTab === "Credentials" && (
          <button
            onClick={() => setShowCredForm(true)}
            className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground transition-colors"
          >
            Add Credential
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {["Workflows", "Credentials"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Workflows list */}
      {activeTab === "Workflows" && (
        <>
          {wfLoading ? (
            <p className="text-muted-foreground">Loading workflows...</p>
          ) : wfError ? (
            <p className="text-destructive">{wfError}</p>
          ) : workflows.length === 0 ? (
            <p className="text-muted-foreground">No workflows found.</p>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-card border border-border rounded-lg p-4 flex justify-between items-center mb-3 hover:bg-card/80 transition-colors"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{workflow.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {new Date(workflow.updatedAt).toLocaleDateString()} | Created{" "}
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Status: {workflow.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleWorkflow(workflow)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      workflow.enabled
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {workflow.enabled ? "Disable" : "Enable"}
                  </button>
                  <Link to="/workflow/editor">
                    <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded-md text-sm transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Credentials list */}
      {activeTab === "Credentials" && (
        <>
          {credLoading ? (
            <p className="text-muted-foreground">Loading credentials...</p>
          ) : credError ? (
            <p className="text-destructive">{credError}</p>
          ) : credentials.length === 0 ? (
            <p className="text-muted-foreground">No credentials found.</p>
          ) : (
            credentials.map((cred) => (
              <div
                key={cred.id}
                className="bg-card border border-border rounded-lg p-4 flex justify-between items-center mb-3 hover:bg-card/80 transition-colors"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{cred.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Type: {cred.type} | Created{" "}
                    {new Date(cred.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Modal for adding credential */}
      {showCredForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-foreground">Add Credential</h2>
            <input
              type="text"
              placeholder="Credential Name"
              value={credName}
              onChange={(e) => setCredName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            <select
              value={credType}
              onChange={(e) => setCredType(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option>API Key</option>
              <option>OAuth2</option>
              <option>Database</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCredForm(false)}
                className="px-3 py-2 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCredential}
                className="px-3 py-2 rounded bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
