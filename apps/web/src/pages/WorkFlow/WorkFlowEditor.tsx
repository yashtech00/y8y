import { useState, useCallback, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { createWorkflow, fetchCredentials } from "../../utils/Api";
import CredentialsModal from "./CredentialModel";

const initialNodes: any[] = [];
const initialEdges: any[] = [];

export default function WorkFlowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [openTriggerDrawer, setOpenTriggerDrawer] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [, setCredentials] = useState([]);

  const token = localStorage.getItem("token") || "";

  // Load credentials on component mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const data = await fetchCredentials(token);
        setCredentials(data.credentials || []);
      } catch (err) {
        console.error("Failed to load credentials:", err);
      }
    };
    loadCredentials();
  }, [token]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = (label?: string, credentialId?: string) => {
    const id = `n${nodes.length + 1}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { 
          label: label || `Node ${nodes.length + 1}`,
          credentialId: credentialId || null
        },
      },
    ]);
  };

  const handleTriggerSelect = (trigger: string) => {
    // Check if credentials are required for this trigger
    const requiresCredentials = ['Resend Email', 'Telegram', 'Gemini'].includes(trigger);
    
    if (requiresCredentials) {
      setSelectedTrigger(trigger);
      setShowCredModal(true);
    } else {
      addNode(trigger);
      setOpenTriggerDrawer(false);
    }
  };

  const handleCredentialSave = async (credentialData: any) => {
    try {
      // Add the node with the credential
      addNode(selectedTrigger, credentialData.id);
      setOpenTriggerDrawer(false);
      setShowCredModal(false);
      setSelectedTrigger("");
      
      // Refresh credentials list
      const data = await fetchCredentials(token);
      setCredentials(data.credentials || []);
    } catch (err) {
      console.error("Failed to save credential:", err);
    }
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      const data = await createWorkflow(
        {
          title: title || "My workflow",
          nodes,
          connections: edges,
          triggerType: "Manual",
          enabled: true,
        },
        token
      );
      alert("✅ Workflow saved successfully!");
      console.log("Saved workflow:", data);
    } catch (err: any) {
      alert("❌ Error saving workflow: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-screen h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-card border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Workflow Editor</h1>
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-primary-foreground transition-colors ${
            saving
              ? "bg-muted cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {saving ? "Saving..." : "Save Workflow"}
        </button>
      </div>

      {/* Title Input */}
      <div className="flex justify-center items-center bg-card border-b border-border p-4 gap-4">
        {title.length > 0 && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
        <input
          type="text"
          placeholder="Workflow Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors w-64"
        />
      </div>

      {/* Flow Canvas */}
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* Show Add First Step */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setOpenTriggerDrawer(true)}
              className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-card/80 transition-colors"
            >
              + Add first step...
            </button>
          </div>
        )}

        {/* Floating + button */}
        {nodes.length > 0 && (
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => setOpenTriggerDrawer(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl shadow-primary hover:bg-primary/90 transition-colors"
            >
              +
            </button>
          </div>
        )}

        {/* Trigger Drawer */}
        {openTriggerDrawer && (
          <div className="absolute top-0 right-0 w-64 h-full bg-card border-l border-border shadow-card z-50 p-4 animate-slide-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Choose Trigger</h2>
            <ul className="space-y-2">
              {["Gmail", "Webhook", "Telegram", "Resend Email", "Gemini"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleTriggerSelect(item)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-foreground"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpenTriggerDrawer(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredModal}
        onClose={() => {
          setShowCredModal(false);
          setSelectedTrigger("");
        }}
        selectedTrigger={selectedTrigger}
        onSave={handleCredentialSave}
      />

      {/* Animations */}
      <style>{`
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}
