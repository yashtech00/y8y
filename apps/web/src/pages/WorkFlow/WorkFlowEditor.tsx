import { useState, useCallback } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: any[] = [];
const initialEdges: any[] = [];

export default function WorkFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);
  const [triggerType, setTriggerType] = useState("Manual");
  const [title, setTitle] = useState("");
  const [openTriggerDrawer, setOpenTriggerDrawer] = useState(false);

  const token = localStorage.getItem("token") || "";

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

  const addNode = (label?: string) => {
    const id = `n${nodes.length + 1}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: label || `Node ${nodes.length + 1}` },
      },
    ]);
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/workflow/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title || "My workflow",
          nodes,
          connections: edges,
          triggerType: "Manual",
          enabled: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save workflow");
      const data = await res.json();
      alert("✅ Workflow saved successfully!");
      console.log("Saved workflow:", data);
    } catch (err: any) {
      alert("❌ Error saving workflow: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-screen h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-semibold text-white">Workflow Editor</h1>
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-white ${
            saving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {saving ? "Saving..." : "Save Workflow"}
        </button>
      </div>

      {/* Title Input */}
      <div className="flex justify-center items-center bg-gray-800 p-4">
          {title.length > 0 && (
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          )}
        <input
          type="text"
          placeholder="Workflow Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-600 text-white"
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
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-dashed border-gray-400 hover:bg-gray-600"
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
              className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700"
            >
              +
            </button>
          </div>
        )}

        {/* Trigger Drawer */}
        {openTriggerDrawer && (
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl z-50 p-4 animate-slide-in">
            <h2 className="text-lg font-semibold mb-4">Choose Trigger</h2>
            <ul className="space-y-2">
              {["Gmail", "Webhook", "Telegram", "Resend Email"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      addNode(item);
                      setOpenTriggerDrawer(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-200"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpenTriggerDrawer(false)}
              className="mt-4 text-sm text-gray-600 underline"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
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
