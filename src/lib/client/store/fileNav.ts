import { create } from 'zustand';

type FileNavStore = {
  ids: string[];
  current: string | null;

  setFiles: (fileIds: string[]) => void;
  setCurrent: (fileId: string | null) => void;
  clear: () => void;
  goPrev: () => void;
  goNext: () => void;
};

export const useFileNavStore = create<FileNavStore>()((set) => ({
  ids: [],
  current: null,

  setFiles: (fileIds) =>
    set((state) => {
      if (!state.current || fileIds.includes(state.current)) {
        return { ids: fileIds };
      }

      return {
        ids: fileIds,
        current: null,
      };
    }),

  setCurrent: (fileId) => set({ current: fileId }),

  clear: () => set({ ids: [], current: null }),

  goPrev: () =>
    set((state) => {
      if (!state.current) return state;

      const currentIndex = state.ids.indexOf(state.current);
      if (currentIndex <= 0) return state;

      return {
        current: state.ids[currentIndex - 1],
      };
    }),

  goNext: () =>
    set((state) => {
      if (!state.current) return state;

      const currentIndex = state.ids.indexOf(state.current);
      if (currentIndex < 0 || currentIndex >= state.ids.length - 1) return state;

      return {
        current: state.ids[currentIndex + 1],
      };
    }),
}));
