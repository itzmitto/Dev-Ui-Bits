import { create } from 'zustand';

const favoriteKey = 'devui-favorites-v1';
function readFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(favoriteKey) ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string'))] : [];
  } catch { return []; }
}
export const useFavorites = create<{ ids: string[]; toggle: (id: string) => void }>((set) => ({
  ids: readFavorites(),
  toggle(id) {
    set(state => {
      const ids = state.ids.includes(id) ? state.ids.filter(value => value !== id) : [...state.ids, id];
      try { localStorage.setItem(favoriteKey, JSON.stringify(ids)); } catch { /* Browser-session favorites still work. */ }
      return { ids };
    });
  },
}));
