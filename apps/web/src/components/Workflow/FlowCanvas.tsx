import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { Background, Controls, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { PlatformDrawer } from './PlatformDrawer';
import type { Platform } from '../../types/workflow';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onAddFirstStep: () => void;
  isPlatformDrawerOpen: boolean;
  onOpenPlatformDrawer: () => void;
  onClosePlatformDrawer: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  platforms: Platform[];
  onPlatformSelect: (platform: string) => void;
}

export const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddFirstStep,
  isPlatformDrawerOpen,
  onOpenPlatformDrawer,
  onClosePlatformDrawer,
  searchQuery,
  onSearchChange,
  platforms,
  onPlatformSelect,
}: FlowCanvasProps) => {
  return (
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
            onClick={onAddFirstStep}
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
            onClick={onOpenPlatformDrawer}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-110"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      <PlatformDrawer
        isOpen={isPlatformDrawerOpen}
        onClose={onClosePlatformDrawer}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        platforms={platforms}
        onPlatformSelect={onPlatformSelect}
      />
    </div>
  );
};
