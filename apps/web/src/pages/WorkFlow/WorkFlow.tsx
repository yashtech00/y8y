import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function WorkFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token") || ""; // adjust auth

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Save workflow to backend
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
          title: "My workflow",
          nodes,
          connections: edges,
          triggerType: "Manual", // or "Webhook"
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
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-semibold">Workflow Editor</h1>
        <button
          onClick={saveWorkflow}
          disabled={saving}
          className={`px-4 py-2 rounded-md ${
            saving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {saving ? "Saving..." : "Save Workflow"}
        </button>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  );
}
