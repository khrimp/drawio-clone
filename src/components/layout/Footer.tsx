import React from 'react';
import { Plus } from 'lucide-react';

export const Footer = () => {
  return (
    <div className="h-8 border-t bg-gray-50 flex items-center px-2 text-sm text-gray-600 select-none">
      <div className="flex h-full">
        <div className="px-4 flex items-center border-r bg-white border-t-2 border-t-blue-500 cursor-pointer">
          Page-1
        </div>
        <button className="px-2 hover:bg-gray-200 flex items-center justify-center">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1" />
      <div className="px-4">Ready</div>
    </div>
  );
};
