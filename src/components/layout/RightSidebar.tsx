import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useDiagramStore } from '../../store/useDiagramStore';
import { MarkerType } from '@xyflow/react';

export const RightSidebar = () => {
  const rightPanelWidth = useUIStore((state) => state.rightPanelWidth);
  const activeFormatTab = useUIStore((state) => state.activeFormatTab);
  const setActiveFormatTab = useUIStore((state) => state.setActiveFormatTab);

  // Retrieve the first selected node
  const selectedNode = useDiagramStore((state) => state.nodes.find((n) => n.selected));
  const selectedEdge = useDiagramStore((state) => state.edges.find((e) => e.selected));
  
  const updateNodeStyle = useDiagramStore((state) => state.updateNodeStyle);
  const updateEdge = useDiagramStore((state) => state.updateEdge);
  const bringToFront = useDiagramStore((state) => state.bringToFront);
  const sendToBack = useDiagramStore((state) => state.sendToBack);

  const tabs = [
    { id: 'style', label: 'Style' },
    { id: 'text', label: 'Text' },
    { id: 'arrange', label: 'Arrange' },
  ] as const;

  const nodeStyle = selectedNode?.data?.style as any || {};
  const edgeStyle = selectedEdge?.style || {};

  const handleNodeStyleChange = (key: string, value: any) => {
    if (selectedNode) updateNodeStyle(selectedNode.id, { [key]: value });
  };

  const handleEdgeStyleChange = (key: string, value: any) => {
    if (selectedEdge) updateEdge(selectedEdge.id, { style: { [key]: value } });
  };

  const handleEdgeTypeChange = (type: string) => {
    if (selectedEdge) updateEdge(selectedEdge.id, { type });
  };

  const handleEdgeMarkerChange = (end: 'start' | 'end', type: 'none' | 'arrow') => {
    if (!selectedEdge) return;
    const markerUpdate = type === 'arrow' 
      ? { type: MarkerType.ArrowClosed } 
      : undefined;
    
    if (end === 'start') {
      updateEdge(selectedEdge.id, { markerStart: markerUpdate });
    } else {
      updateEdge(selectedEdge.id, { markerEnd: markerUpdate });
    }
  };

  return (
    <div 
      className="border-l bg-gray-50 flex flex-col select-none"
      style={{ width: rightPanelWidth }}
    >
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFormatTab(tab.id)}
            className={`flex-1 py-2 text-sm font-medium ${
              activeFormatTab === tab.id 
                ? 'bg-white border-t-2 border-t-blue-500 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {!selectedNode && !selectedEdge ? (
          <div className="text-sm text-gray-500">
            Select an element to edit its properties.
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-sm">
            {activeFormatTab === 'style' && (
              <>
                {selectedNode && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Fill Color</label>
                      <input 
                        type="color" 
                        value={nodeStyle.fill || '#ffffff'} 
                        onChange={(e) => handleNodeStyleChange('fill', e.target.value)}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Stroke Color</label>
                      <input 
                        type="color" 
                        value={nodeStyle.stroke || '#000000'} 
                        onChange={(e) => handleNodeStyleChange('stroke', e.target.value)}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Stroke Width</label>
                      <input 
                        type="number" 
                        value={nodeStyle.strokeWidth || 1}
                        min={0}
                        max={20}
                        onChange={(e) => handleNodeStyleChange('strokeWidth', parseInt(e.target.value))}
                        className="w-full p-1 border rounded"
                      />
                    </div>
                  </>
                )}

                {selectedEdge && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Line Color</label>
                      <input 
                        type="color" 
                        value={edgeStyle.stroke || '#000000'} 
                        onChange={(e) => handleEdgeStyleChange('stroke', e.target.value)}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Line Width</label>
                      <input 
                        type="number" 
                        value={edgeStyle.strokeWidth || 1}
                        min={1}
                        max={20}
                        onChange={(e) => handleEdgeStyleChange('strokeWidth', parseInt(e.target.value))}
                        className="w-full p-1 border rounded"
                      />
                    </div>
                    
                    <div className="border-t my-2" />
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-600">Line Type</label>
                      <select 
                        value={selectedEdge.type || 'default'}
                        onChange={(e) => handleEdgeTypeChange(e.target.value)}
                        className="w-full p-1 border rounded bg-white"
                      >
                        <option value="default">Curved (Bezier)</option>
                        <option value="straight">Straight</option>
                        <option value="step">Orthogonal (Step)</option>
                        <option value="smoothstep">Orthogonal (Smooth)</option>
                      </select>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-gray-600 text-xs">Start Arrow</label>
                        <select 
                          value={selectedEdge.markerStart ? 'arrow' : 'none'}
                          onChange={(e) => handleEdgeMarkerChange('start', e.target.value as any)}
                          className="w-full p-1 border rounded bg-white"
                        >
                          <option value="none">None</option>
                          <option value="arrow">Arrow</option>
                        </select>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-gray-600 text-xs">End Arrow</label>
                        <select 
                          value={selectedEdge.markerEnd ? 'arrow' : 'none'}
                          onChange={(e) => handleEdgeMarkerChange('end', e.target.value as any)}
                          className="w-full p-1 border rounded bg-white"
                        >
                          <option value="none">None</option>
                          <option value="arrow">Arrow</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeFormatTab === 'text' && selectedNode && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600">Text Color</label>
                  <input 
                    type="color" 
                    value={nodeStyle.color || '#000000'} 
                    onChange={(e) => handleNodeStyleChange('color', e.target.value)}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-600">Font Size</label>
                  <input 
                    type="number" 
                    value={nodeStyle.fontSize || 14}
                    min={8}
                    max={72}
                    onChange={(e) => handleNodeStyleChange('fontSize', parseInt(e.target.value))}
                    className="w-full p-1 border rounded"
                  />
                </div>
              </>
            )}

            {activeFormatTab === 'arrange' && selectedNode && (
              <div className="flex gap-2">
                <button 
                  onClick={() => bringToFront(selectedNode.id)}
                  className="flex-1 p-2 border rounded hover:bg-gray-100"
                >
                  To Front
                </button>
                <button 
                  onClick={() => sendToBack(selectedNode.id)}
                  className="flex-1 p-2 border rounded hover:bg-gray-100"
                >
                  To Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

