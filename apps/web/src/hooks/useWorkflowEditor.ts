import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Edge, Connection, Node } from '@xyflow/react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';

import type { FlowNodeData, WorkflowInput } from '../types/workflow';
import { flowToWorkflowNodes, flowToWorkflowConnections, workflowToFlowNodes, workflowToFlowEdges } from '../types/workflow';
import { createWorkflow, fetchWorkflowById, updateWorkflow } from '../utils/api';

export function useWorkflowEditor(id?: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadWorkflow = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkflowById(id);
        setNodes(workflowToFlowNodes(data.workflow));
        setEdges(workflowToFlowEdges(data.workflow));
        setData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load workflow:', err);
        setIsLoading(false);
      }
    };
    loadWorkflow();
  }, [id]);

  const workflow = useMemo(() => {
    if (!data?.workflow) return null;
    return {
      ...data.workflow,
      form: data.workflow.form || []
    };
  }, [data?.workflow]);

  const CreateWorkflow = async (workflowData: WorkflowInput) => {
    try {
      setIsLoading(true);
      const res = await createWorkflow(workflowData);
      setIsLoading(false);
      return res;
    } catch (err) {
      console.error('Failed to create workflow:', err);
      setIsLoading(false);
      throw err;
    }
  };
  
  const UpdateWorkflow = async (workflowId: string, workflowData: WorkflowInput) => {
    try {
      setIsLoading(true);
      const res = await updateWorkflow(workflowId, workflowData);
      setIsLoading(false);
      return res;
    } catch (err) {
      console.error('Failed to update workflow:', err);
      setIsLoading(false);
      throw err;
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const saveWorkflow = useCallback(
    async (title: string, triggerType: 'Manual' | 'Webhook', webhookConfig?: any) => {
      const workflowNodes = flowToWorkflowNodes(nodes);
      const workflowConnections = flowToWorkflowConnections(edges);

      const workflowData: WorkflowInput = {
        title,
        triggerType,
        nodes: workflowNodes,
        connections: workflowConnections,
        enabled: true,
        ...(webhookConfig && { webhook: webhookConfig }),
      };
      
      if (id) {
        const updated = await UpdateWorkflow(id, workflowData);
        return updated;
      } else {
        const created = await CreateWorkflow(workflowData);
        return created;
      }
    },
    [nodes, edges, id],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveWorkflow,
    isLoading,
    workflow,
  };
}