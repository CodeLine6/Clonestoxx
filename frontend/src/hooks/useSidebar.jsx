import { create } from 'zustand';

const useSidebar = create((set) => ({
    isMinimized: false,
    toggle: () => set((state) => ({ isMinimized: !state.isMinimized }))
}));

export default useSidebar