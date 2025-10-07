import type { Node, Edge } from '@xyflow/react';

export interface Platform {
  name: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
}

export interface WorkflowData {
  id: string;
  label: string;
  credentialId: string | null;
  config: Record<string, any>;
  type: string;
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  title: string;
  isSaving: boolean;
  isPlatformDrawerOpen: boolean;
  showCredModal: boolean;
  selectedPlatform: string;
  searchQuery: string;
  credentials: any[];
}

export type WorkflowAction =
  | { type: 'SET_NODES'; payload: Node[] }
  | { type: 'SET_EDGES'; payload: Edge[] }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_PLATFORM_DRAWER_OPEN'; payload: boolean }
  | { type: 'SET_SHOW_CRED_MODAL'; payload: boolean }
  | { type: 'SET_SELECTED_PLATFORM'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CREDENTIALS'; payload: any[] };
