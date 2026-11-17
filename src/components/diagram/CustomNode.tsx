import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { useDiagramStore } from '../../store/useDiagramStore';

export const CustomNode = ({ id, data, selected }: NodeProps) => {
  const updateNodeData = useDiagramStore((state) => state.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState((data.label as string) || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const shape = data.shape as string;
  const style = (data.style as any) || {};

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      inputRef.current.setSelectionRange(text.length, text.length);
    }
  }, [isEditing, text]);

  const onBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label: text });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onBlur();
    }
  };

  const getShapeClasses = () => {
    switch (shape) {
      case 'ellipse':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-xl';
      case 'diamond':
        return '';
      case 'text':
        return 'border-none bg-transparent';
      default:
        return '';
    }
  };

  const getShapeStyles = () => {
    const base: React.CSSProperties = {
      backgroundColor: style.fill || '#ffffff',
      borderColor: style.stroke || '#000000',
      borderWidth: `${style.strokeWidth ?? 1}px`,
      borderStyle: 'solid',
    };
    
    if (shape === 'diamond') {
      // For diamond, we use an inner SVG to draw the borders properly
      base.backgroundColor = 'transparent';
      base.borderWidth = '0px';
    }
    if (shape === 'text') {
      base.backgroundColor = 'transparent';
      base.borderWidth = '0px';
    }
    return base;
  };

  // Improved Handles that appear on hover
  const handleClasses = "w-2.5 h-2.5 bg-blue-500 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity !z-20";

  return (
    <>
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={40} 
        minHeight={40} 
      />
      <div 
        className={`group w-full h-full flex items-center justify-center relative ${getShapeClasses()}`}
        style={getShapeStyles()}
        onDoubleClick={() => setIsEditing(true)}
      >
        {shape === 'diamond' && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 100"
          >
            <polygon 
              points="50,0 100,50 50,100 0,50" 
              fill={style.fill || '#ffffff'} 
              stroke={style.stroke || '#000000'} 
              strokeWidth={style.strokeWidth ?? 1} 
              vectorEffect="non-scaling-stroke" 
            />
          </svg>
        )}

        {isEditing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="w-full h-full bg-transparent text-center resize-none outline-none border-none overflow-hidden p-2 z-10 relative"
            style={{ 
              fontSize: `${style.fontSize || 14}px`, 
              color: style.color || '#000' 
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-center overflow-hidden whitespace-pre-wrap pointer-events-none p-2 z-10 relative"
            style={{ 
              fontSize: `${style.fontSize || 14}px`, 
              color: style.color || '#000' 
            }}
          >
            {data.label as React.ReactNode}
          </div>
        )}
        
        {/* Handles are inside the group to trigger hover opacity */}
        <Handle type="source" position={Position.Top} id="top" className={handleClasses} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={handleClasses} />
        <Handle type="source" position={Position.Left} id="left" className={handleClasses} />
        <Handle type="source" position={Position.Right} id="right" className={handleClasses} />
      </div>
    </>
  );
};


