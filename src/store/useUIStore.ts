import { create } from 'zustand';

interface UIState {
  isGridVisible: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  activeFormatTab: 'style' | 'text' | 'arrange';
  
  toggleGrid: () => void;
  setActiveFormatTab: (tab: 'style' | 'text' | 'arrange') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isGridVisible: true,
  leftPanelWidth: 240,
  rightPanelWidth: 300,
  activeFormatTab: 'style',

  toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
  setActiveFormatTab: (tab) => set({ activeFormatTab: tab }),
}));
