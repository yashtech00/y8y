import { useState, useCallback, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Search, X, Zap } from "lucide-react";
import { createWorkflow, fetchCredentials } from "../../utils/api";
import CredentialsModal from "./CredentialModel";

interface Platform {
  name: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
}

interface WorkflowData {
  id: string;
  label: string;
  credentialId: string | null;
  config: Record<string, any>;
  type: string;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const platforms: Platform[] = [
  { name: "Gmail", description: "Send and receive emails", icon: "📧", requiresAuth: false },
  { name: "Webhook", description: "Trigger via HTTP requests", icon: "🔗", requiresAuth: false },
  { name: "Telegram", description: "Send messages via Telegram bot", icon: "✈️", requiresAuth: true },
  { name: "Resend Email", description: "Send transactional emails", icon: "📨", requiresAuth: true },
  { name: "Gemini", description: "AI-powered responses", icon: "🤖", requiresAuth: true },
];

export default function WorkFlowEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [saving, setSaving] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [openPlatform, setOpenPlatform] = useState<boolean>(false);
  const [showCredModal, setShowCredModal] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [credentials, setCredentials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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
    (selectedPlatform: string) => {
      const nodeNumber = nodes.length + 1;
      const nodeId = `node${nodeNumber}`;
      setNodes((nds) => [
        ...nds,
        {
          id: nodeId,
          type: 'custom',
          position: getNextPosition(),
          data: {
            id: nodeId,
            label: 'New Node',
            credentialId: null,
            config: {},
            type: selectedPlatform,
          },
        },
      ]);
    }, [nodes, getNextPosition]);

  const handlePlatformSelect = (platform: string) => {
    const platformData = platforms.find(p => p.name === platform);
    const requiresCredentials = platformData?.requiresAuth || false;
    
    if (requiresCredentials) {
      setSelectedPlatform(platform);
      setShowCredModal(true);
    } else {
      addNode(platform);
      setOpenPlatform(false);
      setSearchQuery("");
    }
  };

  const handleCredentialSave = async () => {
    try {
      addNode(selectedPlatform);
      setOpenPlatform(false);
      setShowCredModal(false);
      setSelectedPlatform("");
      setSearchQuery("");
      
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

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Workflow Editor</h1>
        </div>
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            saving
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
          }`}
        >
          {saving ? "Saving..." : "Save Workflow"}
        </button>
      </div>

      {/* Title Input */}
      <div className="flex justify-center items-center bg-white border-b border-gray-200 px-6 py-4 gap-4">
        {title.length > 0 && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
        <input
          type="text"
          placeholder="Enter workflow title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-80"
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
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all group-hover:scale-105">
                <span className="text-6xl font-light">+</span>
              </div>
              <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                Add first step
              </span>
            </button>
          </div>
        )}

        {/* Floating + button */}
        {nodes.length > 0 && (
          <div className="absolute bottom-8 right-8">
            <button
              onClick={() => setOpenPlatform(true)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-110"
            >
              +
            </button>
          </div>
        )}

        {/* Platform Drawer */}
        {openPlatform && (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => {
                setOpenPlatform(false);
                setSearchQuery("");
              }}
            />
            
            {/* Drawer */}
            <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Add Step</h2>
                  <button
                    onClick={() => {
                      setOpenPlatform(false);
                      setSearchQuery("");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Choose a platform to add to your workflow
                </p>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Platform List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {filteredPlatforms.length > 0 ? (
                  <div className="space-y-2">
                    {filteredPlatforms.map((platform) => (
                      <button
                        key={platform.name}
                        onClick={() => handlePlatformSelect(platform.name)}
                        className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{platform.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {platform.name}
                              </h3>
                              {platform.requiresAuth && (
                                <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                                  Auth
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">No platforms found</p>
                    <p className="text-sm text-gray-500">Try searching with different keywords</p>
                  </div>
                )}
              </div>
            </div>
          </>
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}