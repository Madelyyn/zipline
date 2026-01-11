import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Field = 'name' | 'originalName' | 'tags' | 'type' | 'size' | 'createdAt' | 'favorite' | 'views';

export const defaultFields: FieldSettings[] = [
  { field: 'name', visible: true },
  { field: 'originalName', visible: false },
  { field: 'tags', visible: true },
  { field: 'type', visible: true },
  { field: 'size', visible: true },
  { field: 'createdAt', visible: true },
  { field: 'favorite', visible: true },
  { field: 'views', visible: true },
];

export type FieldSettings = {
  field: Field;
  visible: boolean;
};

export type FileTableSettings = {
  fields: FieldSettings[];

  setVisible: (field: FieldSettings['field'], visible: boolean) => void;
  setIndex: (field: FieldSettings['field'], index: number) => void;
  reset: () => void;
};

export const useFileTableSettingsStore = create<FileTableSettings>()(
  persist(
    (set) => ({
      fields: defaultFields,

      setVisible: (field, visible) =>
        set((state) => ({
          fields: state.fields.map((f) => (f.field === field ? { ...f, visible } : f)),
        })),

      setIndex: (field, index) =>
        set((state) => {
          const currentIndex = state.fields.findIndex((f) => f.field === field);
          if (currentIndex === -1 || index < 0 || index >= state.fields.length) return state;

          const newFields = [...state.fields];
          const [movedField] = newFields.splice(currentIndex, 1);
          newFields.splice(index, 0, movedField);

          return { fields: newFields };
        }),

      reset: () => set({ fields: defaultFields }),
    }),
    {
      name: 'zipline-file-table-settings',
    },
  ),
);
