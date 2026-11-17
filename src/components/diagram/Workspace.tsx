import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '../../store/useDiagramStore';
import { CustomNode } from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

let id = 0;
export const getId = () => `node_${id++}`;

export const Workspace = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const onNodesChange = useDiagramStore((state) => state.onNodesChange);
  const onEdgesChange = useDiagramStore((state) => state.onEdgesChange);
  const onConnect = useDiagramStore((state) => state.onConnect);
  const addNode = useDiagramStore((state) => state.addNode);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Convert screen coordinate to react flow coordinate
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Default dimensions
      const width = type === 'text' ? 100 : 120;
      const height = type === 'text' ? 40 : 60;
      
      // Center the node on the mouse
      position.x -= width / 2;
      position.y -= height / 2;

      const newNode = {
        id: getId(),
        type: 'custom',
        position,
        style: { width, height },
        data: { 
          label: label,
          shape: type,
          style: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1,
            fontSize: 14,
            color: '#000000'
          }
        },
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  // Global hotkeys for Undo/Redo can be added here or in AppLayout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          useDiagramStore.temporal.getState().redo();
        } else {
          useDiagramStore.temporal.getState().undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        useDiagramStore.temporal.getState().redo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 h-full bg-white relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={[10, 10]}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};



