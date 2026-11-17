import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: any) => void;
  updateNodeStyle: (id: string, style: any) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  setDiagram: (nodes: Node[], edges: Edge[]) => void;
}

export const useDiagramStore = create<DiagramState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge({
            ...connection, 
            type: 'default',
            style: { stroke: '#000000', strokeWidth: 1 }
          }, get().edges),
        });
      },
      addNode: (node: Node) => {
        set({
          nodes: [...get().nodes, node],
        });
      },
      updateNodeData: (id: string, data: any) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },
      updateNodeStyle: (id: string, style: any) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  style: { ...(node.data.style as any), ...style },
                },
              };
            }
            return node;
          }),
        });
      },
      updateEdge: (id: string, updates: Partial<Edge>) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              return {
                ...edge,
                ...updates,
                style: { ...edge.style, ...updates.style },
              };
            }
            return edge;
          })
        });
      },
      bringToFront: (id: string) => {
        const nodes = get().nodes;
        const targetNode = nodes.find((n) => n.id === id);
        if (!targetNode) return;
        const filteredNodes = nodes.filter((n) => n.id !== id);
        set({ nodes: [...filteredNodes, targetNode] });
      },
      sendToBack: (id: string) => {
        const nodes = get().nodes;
        const targetNode = nodes.find((n) => n.id === id);
        if (!targetNode) return;
        const filteredNodes = nodes.filter((n) => n.id !== id);
        set({ nodes: [targetNode, ...filteredNodes] });
      },
      setDiagram: (nodes: Node[], edges: Edge[]) => {
        set({ nodes, edges });
      },
    }),
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
    }
  )
);

