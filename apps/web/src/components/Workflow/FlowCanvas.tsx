import type { Node, Edge } from '@xyflow/react';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { PlatformDrawer } from './PlatformDrawer';
import type { Platform } from '../../types/platform';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onAddFirstStep: () => void;
  isPlatformDrawerOpen: boolean;
  onOpenPlatformDrawer: () => void;
  onClosePlatformDrawer: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  platforms: Platform[];
  onPlatformSelect: (platform: string) => void;
  triggerType: string;
  setTriggerType: (triggerType: string) => void;
}

export const FlowCanvas = ({
  nodes = [],
  edges = [],
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddFirstStep,
  isPlatformDrawerOpen,
  onOpenPlatformDrawer,
  onClosePlatformDrawer,
  searchQuery,
  onSearchChange,
  platforms = [],
  onPlatformSelect,
  triggerType,
  setTriggerType,

}: FlowCanvasProps) => {
  return (
    <div className="relative flex-1 bg-background text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background />
        <MiniMap style={{ backgroundColor: 'black', color: 'black', border: '1px solid black', borderRadius: '5px' }} />
        <Controls style={{ backgroundColor: 'black', color: 'black', border: '1px solid black', borderRadius: '5px' }} />  
      </ReactFlow>

      {/* Show Add First Step */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onAddFirstStep}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-32 h-32 bg-background border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all group-hover:scale-105">
              <span className="text-6xl font-light">+</span>
            </div>
            <span className="text-gray-600 font-medium group-hover:text-primary transition-colors">
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
            className="w-14 h-14 flex items-center justify-center rounded-full bg-background border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all group-hover:scale-105"
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
        triggerType={triggerType}
        setTriggerType={setTriggerType}
      />
    </div>
  );
};
