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
import { createWorkflow, fetchCredentials } from "../../utils/api";
import CredentialsModal from "./CredentialModel";

const initialNodes: any[] = [];
const initialEdges: any[] = [];

export default function WorkFlowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [openPlatform, setOpenPlatform] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
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

  const getNextPosition = useCallback(() => {
    const offset = 150;
    const existingPositions = nodes.map(node => node.position);
    const basePosition = { x: 250, y: 150 };

    let newPosition = { ...basePosition };
    while (existingPositions.some(pos => pos.x === newPosition.x && pos.y === newPosition.y)) {
      newPosition.x += offset;
      if (newPosition.x > 800) {
        newPosition.x = basePosition.x;
        newPosition.y += offset;
      }
    }
    return newPosition;
  }, [nodes]);



  const addNode = useCallback(
    (selectedPlatform: Platform) => {
      const nodeNumber = nodes.length + 1;
    const nodeId = `node${nodeNumber}`;
    setNodes((nds) => [
      ...nds,
      {
        id: nodeId,
        type: selectedPlatform,
        position: getNextPosition(),
        data: { 
          id: nodeId,
          label: `${selectedPlatform} ${nodeNumber}`,
          credentialId: null,
          config: {},
          type: selectedPlatform,
        },
      },
    ]);
  }, [nodes,setNodes]);

  const handlePlatformSelect = (platform: string) => {
    // Check if credentials are required for this trigger
    const requiresCredentials = ['Resend Email', 'Telegram', 'Gemini'].includes(platform);
    
    if (requiresCredentials) {
      setSelectedPlatform(platform);
      setShowCredModal(true);
    } else {
      addNode(platform);
      setOpenPlatform(false);
    }
  };

  const handleCredentialSave = async () => {
    try {
      // Add the node with the credential
      addNode(selectedPlatform);
      setOpenPlatform(false);
      setShowCredModal(false);
      setSelectedPlatform("");
      
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
              onClick={() => setOpenPlatform(true)}
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
              onClick={() => setOpenPlatform(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl shadow-primary hover:bg-primary/90 transition-colors"
            >
              +
            </button>
          </div>
        )}

        {/* Platform Drawer */}
        {openPlatform && (
          <div className="absolute top-0 right-0 w-64 h-full bg-card border-l border-border shadow-card z-50 p-4 animate-slide-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Choose Platform</h2>
            <ul className="space-y-2">
              {["Gmail", "Webhook", "Telegram", "Resend Email", "Gemini"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handlePlatformSelect(item)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-foreground"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpenPlatform(false)}
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
          setSelectedPlatform("");
        }}
        selectedTrigger={selectedPlatform}
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
