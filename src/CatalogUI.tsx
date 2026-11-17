import { Bookmark, Check, Clock3 } from 'lucide-react';
import { useFavorites } from './catalogState';
import type { ComponentMetadata } from './types';

export function StatusBadge({ status }: { status: 'ready' | 'planned' }) {
  return <span className={`status-badge status-${status}`}>{status === 'ready' ? <Check size={10}/> : <Clock3 size={10}/>} {status === 'ready' ? 'Ready' : 'Planned'}</span>;
}
export function FavoriteButton({ item }: { item: Pick<ComponentMetadata, 'id' | 'name'> }) {
  const saved = useFavorites(state => state.ids.includes(item.id));
  const toggle = useFavorites(state => state.toggle);
  return <button className={`favorite-button ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Remove' : 'Save'} ${item.name} ${saved ? 'from' : 'to'} favorites`} aria-pressed={saved} title={saved ? 'Remove from favorites' : 'Save to favorites'} onClick={() => toggle(item.id)}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'}/></button>;
}
