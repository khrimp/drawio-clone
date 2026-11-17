import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { Workspace } from '../diagram/Workspace';

export const AppLayout = () => {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden text-gray-800 font-sans">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />
          <Workspace />
          <RightSidebar />
        </div>
        <Footer />
      </div>
    </ReactFlowProvider>
  );
};

