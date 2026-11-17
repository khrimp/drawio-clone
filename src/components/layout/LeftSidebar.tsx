import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { useUIStore } from '../../store/useUIStore';
import { useDiagramStore } from '../../store/useDiagramStore';
import { getId } from '../diagram/Workspace';

const SHAPES = [
  { type: 'rectangle', label: 'Rectangle' },
  { type: 'rounded', label: 'Rounded Rect' },
  { type: 'ellipse', label: 'Ellipse' },
  { type: 'diamond', label: 'Diamond' },
  { type: 'text', label: 'Text' },
];

export const LeftSidebar = () => {
  const leftPanelWidth = useUIStore((state) => state.leftPanelWidth);
  const addNode = useDiagramStore((state) => state.addNode);
  const { screenToFlowPosition } = useReactFlow();

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClickShape = (type: string, label: string) => {
    // Determine center of the screen
    const centerPosition = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const width = type === 'text' ? 100 : 120;
    const height = type === 'text' ? 40 : 60;

    centerPosition.x -= width / 2;
    centerPosition.y -= height / 2;

    const newNode = {
      id: getId(),
      type: 'custom',
      position: centerPosition,
      style: { width, height },
      data: {
        label: label,
        shape: type,
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          fontSize: 14,
          color: '#000000',
        },
      },
    };

    addNode(newNode as any);
  };

  return (
    <div 
      className="border-r bg-gray-50 flex flex-col select-none"
      style={{ width: leftPanelWidth }}
    >
      <div className="p-2 border-b font-medium text-sm text-gray-700">General</div>
      <div className="p-2 grid grid-cols-2 gap-2">
        {SHAPES.map((shape) => (
          <div
            key={shape.type}
            className="border bg-white p-2 flex items-center justify-center cursor-grab hover:border-blue-500 rounded text-xs text-center hover:bg-blue-50 active:cursor-grabbing"
            draggable
            onDragStart={(e) => onDragStart(e, shape.type, shape.label)}
            onClick={() => onClickShape(shape.type, shape.label)}
          >
            {shape.label}
          </div>
        ))}
      </div>
    </div>
  );
};

