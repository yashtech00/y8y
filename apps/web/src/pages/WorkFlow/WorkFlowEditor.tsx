import { useCallback, useEffect, useState } from 'react';
import { type Connection, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { fetchCredentials } from '../../utils/api';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useWorkflowEditor } from '../../hooks/useWorkflowEditor';
import { Header } from '../../components/Workflow/Header';
import { TitleInput } from '../../components/Workflow/TitleInput';
import { FlowCanvas } from '../../components/Workflow/FlowCanvas';
import CredentialsModal from './CredentialModel';

interface Platform {
    name: string;
    description: string;
    icon: string;
    requiresAuth: boolean;
}

const platforms: Platform[] = [
  { name: 'Gmail', description: 'Send and receive emails', icon: '📧', requiresAuth: false },
  { name: 'Webhook', description: 'Trigger via HTTP requests', icon: '🔗', requiresAuth: false },
  { name: 'Telegram', description: 'Send messages via Telegram bot', icon: '✈️', requiresAuth: true },
  { name: 'Resend Email', description: 'Send transactional emails', icon: '📨', requiresAuth: true },
  { name: 'Gemini', description: 'AI-powered responses', icon: '🤖', requiresAuth: true },
];

export default function WorkFlowEditor() {
  const { state, actions } = useWorkflow();
  const {
    title,
    isSaving,
    isPlatformDrawerOpen,
    showCredModal,
    selectedPlatform,
    searchQuery,
    credentials,
  } = state;

  // Use the workflow editor hook for flow management
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveWorkflow: saveWorkflowFromHook,
  } = useWorkflowEditor();

  const [triggerType,setTriggerType] = useState<'Manual' | 'Webhook'>('Manual');


  // Load credentials on component mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const data = await fetchCredentials();
        actions.setCredentials(data.credentials || []);
      } catch (err) {
        console.error('Failed to load credentials:', err);
      }
    };
    loadCredentials();
  }, [ actions]);

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
    (platform: string) => {
      const nodeNumber = nodes.length + 1;
      const nodeId = `node${nodeNumber}`;
      const newNode = {
        id: nodeId,
        type: 'custom',
        position: getNextPosition(),
        data: {
          id: nodeId,
          label: platform,
          credentialId: null,
          config: {},
          type: platform,
        },
      };
      
      // Add the new node
      onNodesChange([
        {
          type: 'add',
          item: newNode,
        },
      ]);
      
      // If there's a previous node, create an edge connecting them
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const newEdge: Edge = {
          id: `edge-${lastNode.id}-${nodeId}`,
          source: lastNode.id,
          target: nodeId,
          type: 'smoothstep',
        };
        
        // Add the new edge
        onEdgesChange([
          {
            type: 'add',
            item: newEdge,
          },
        ]);
      }
    },
    [nodes, getNextPosition, onNodesChange, onEdgesChange]
  );

  const handlePlatformSelect = (platform: string) => {
    const platformData = platforms.find(p => p.name === platform);
    const requiresCredentials = platformData?.requiresAuth || false;

    if (requiresCredentials) {
      actions.setSelectedPlatform(platform);
      actions.setShowCredModal(true);
    } else {
      addNode(platform);
      actions.setPlatformDrawerOpen(false);
      actions.setSearchQuery('');
    }
  };

  const handleCredentialSave = async () => {
    try {
      addNode(selectedPlatform);
      actions.setPlatformDrawerOpen(false);
      actions.setShowCredModal(false);
      actions.setSelectedPlatform('');
      actions.setSearchQuery('');

      const data = await fetchCredentials();
      actions.setCredentials(data.credentials || []);
    } catch (err) {
      console.error('Failed to save credential:', err);
    }
  };

  const saveWorkflow = async () => {
    actions.setSaving(true);
    try {
      await saveWorkflowFromHook(
        title || 'My Workflow',
        triggerType || 'Manual',
      );
      alert('✅ Workflow saved successfully!');
    } catch (err: any) {
      alert('❌ Error saving workflow: ' + err.message);
    } finally {
      actions.setSaving(false);
    }
  };

  const filteredPlatforms = platforms.filter(
    platform =>
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen h-screen flex flex-col bg-background text-foreground">
      <Header  />

      <TitleInput
        title={title}
        onTitleChange={actions.setTitle}
        onSave={saveWorkflow} 
        isSaving={isSaving}
      />

      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onAddFirstStep={() => actions.setPlatformDrawerOpen(true)}
        isPlatformDrawerOpen={isPlatformDrawerOpen}
        onOpenPlatformDrawer={() => actions.setPlatformDrawerOpen(true)}
        onClosePlatformDrawer={() => {
          actions.setPlatformDrawerOpen(false);
          actions.setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={actions.setSearchQuery}
        platforms={filteredPlatforms}
        onPlatformSelect={handlePlatformSelect}
        triggerType={triggerType}
        setTriggerType={setTriggerType}
      />

      <CredentialsModal
        isOpen={showCredModal}
        onClose={() => {
          actions.setShowCredModal(false);
          actions.setSelectedPlatform('');
        }}
        selectedTrigger={selectedPlatform}
        onSave={handleCredentialSave}
      />

      <style jsx global>{`
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