import { useEffect, useState } from "react";
import {
  fetchWorkflows,
  updateWorkflow,
  fetchCredentials,
  createCredential,
} from "../../utils/api";
import { Link } from "react-router-dom";
import CredentialsModal from "./CredentialModel";

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
  const [showCredTypeModal, setShowCredTypeModal] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);
  const [selectedCredType, setSelectedCredType] = useState("");

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

  const handleCreateCredential = async (credentialData: any) => {
    try {
      await createCredential(credentialData, token);
      setCredentials((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          name: credentialData.title, 
          type: credentialData.platform, 
          createdAt: new Date().toISOString() 
        },
      ]);
      setShowCredModal(false);
      setSelectedCredType("");
    } catch (err: any) {
      alert("❌ Failed to create credential: " + err.message);
    }
  };

  const handleCreateCredentialClick = () => {
    setShowCredTypeModal(true);
  };

  const handleCredTypeSelect = (credType: string) => {
    setSelectedCredType(credType);
    setShowCredTypeModal(false);
    setShowCredModal(true);
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
            onClick={handleCreateCredentialClick}
            className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground transition-colors"
          >
            Create Credential
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

      {/* Credential Type Selection Modal */}
      {showCredTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-foreground">
                Add new credential
              </h2>
              <button
                onClick={() => setShowCredTypeModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-4">
                Select an app or service to connect to
              </p>
              
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for app..."
                  className="w-full px-3 py-2 pl-10 pr-4 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Service List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {["Resend Email", "Telegram", "Gemini"].map((service) => (
                  <button
                    key={service}
                    onClick={() => handleCredTypeSelect(service)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                  >
                    <div className="flex items-center gap-3">
                      {service === "Resend Email" && (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {service === "Telegram" && (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                      {service === "Gemini" && (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                      <span className="font-medium">{service}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredModal}
        onClose={() => {
          setShowCredModal(false);
          setSelectedCredType("");
        }}
        selectedTrigger={selectedCredType}
        onSave={handleCreateCredential}
      />
    </div>
  );
}
