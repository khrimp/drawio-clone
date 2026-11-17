import React from 'react';
import { Menu, Undo, Redo, ZoomIn, ZoomOut, Download, Upload, Image as ImageIcon } from 'lucide-react';
import { useDiagramStore } from '../../store/useDiagramStore';
import * as htmlToImage from 'html-to-image';

export const Header = () => {
  const undo = () => useDiagramStore.temporal.getState().undo();
  const redo = () => useDiagramStore.temporal.getState().redo();

  const handleExportPNG = () => {
    const reactFlowEl = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowEl) return;
    
    htmlToImage.toPng(reactFlowEl, { backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        link.click();
      });
  };

  const handleSaveJSON = () => {
    const { nodes, edges } = useDiagramStore.getState();
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'diagram.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.nodes && data.edges) {
          useDiagramStore.getState().setDiagram(data.nodes, data.edges);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be loaded again if needed
    e.target.value = '';
  };

  return (
    <div className="h-12 border-b bg-white flex items-center px-4 justify-between select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-blue-600 font-bold text-xl gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 rounded" />
          draw.io
        </div>
        <div className="flex text-sm text-gray-600 gap-4">
          <div className="group relative">
            <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer block">File</span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50">
              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                <Upload size={14} className="mr-2" /> Load JSON
                <input type="file" accept=".json" className="hidden" onChange={handleLoadJSON} />
              </label>
              <div 
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={handleSaveJSON}
              >
                <Download size={14} className="mr-2" /> Save JSON
              </div>
              <div className="border-t my-1"></div>
              <div 
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={handleExportPNG}
              >
                <ImageIcon size={14} className="mr-2" /> Export PNG
              </div>
            </div>
          </div>
          <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">View</span>
          <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Arrange</span>
          <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Extras</span>
          <span className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Help</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <button onClick={undo} className="p-1.5 hover:bg-gray-100 rounded active:bg-gray-200"><Undo size={18} /></button>
        <button onClick={redo} className="p-1.5 hover:bg-gray-100 rounded active:bg-gray-200"><Redo size={18} /></button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button className="p-1.5 hover:bg-gray-100 rounded active:bg-gray-200"><ZoomOut size={18} /></button>
        <span className="text-sm w-12 text-center">100%</span>
        <button className="p-1.5 hover:bg-gray-100 rounded active:bg-gray-200"><ZoomIn size={18} /></button>
      </div>
    </div>
  );
};


