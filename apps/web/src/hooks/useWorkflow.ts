import { useReducer, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowState, WorkflowAction } from '../types/workflow';

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  title: '',
  isSaving: false,
  isPlatformDrawerOpen: false,
  showCredModal: false,
  selectedPlatform: '',
  searchQuery: '',
  credentials: [],
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_EDGES':
      return { ...state, edges: action.payload };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_PLATFORM_DRAWER_OPEN':
      return { ...state, isPlatformDrawerOpen: action.payload };
    case 'SET_SHOW_CRED_MODAL':
      return { ...state, showCredModal: action.payload };
    case 'SET_SELECTED_PLATFORM':
      return { ...state, selectedPlatform: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CREDENTIALS':
      return { ...state, credentials: action.payload };
    default:
      return state;
  }
}

export const useWorkflow = () => {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const setNodes = useCallback((nodes: Node[]) => {
    dispatch({ type: 'SET_NODES', payload: nodes });
  }, []);

  const setEdges = useCallback((edges: Edge[]) => {
    dispatch({ type: 'SET_EDGES', payload: edges });
  }, []);

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title });
  }, []);

  const setSaving = useCallback((isSaving: boolean) => {
    dispatch({ type: 'SET_SAVING', payload: isSaving });
  }, []);

  const setPlatformDrawerOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_PLATFORM_DRAWER_OPEN', payload: isOpen });
  }, []);

  const setShowCredModal = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_CRED_MODAL', payload: show });
  }, []);

  const setSelectedPlatform = useCallback((platform: string) => {
    dispatch({ type: 'SET_SELECTED_PLATFORM', payload: platform });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setCredentials = useCallback((credentials: any[]) => {
    dispatch({ type: 'SET_CREDENTIALS', payload: credentials });
  }, []);

  return {
    state,
    actions: {
      setNodes,
      setEdges,
      setTitle,
      setSaving,
      setPlatformDrawerOpen,
      setShowCredModal,
      setSelectedPlatform,
      setSearchQuery,
      setCredentials,
    },
  };
};
