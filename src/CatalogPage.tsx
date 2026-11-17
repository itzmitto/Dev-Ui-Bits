import { memo, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Bookmark, Code2, Play, RotateCcw, Square, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registry } from './registry';
import { catalogCategories } from './catalogNames';
import { useLibrary } from './storage';
import { useFavorites } from './catalogState';
import { FavoriteButton, StatusBadge } from './CatalogUI';
import { PlannedComponentPreview } from './PlannedComponentPreview';
import { categorySlug, componentPath, type CatalogEntry, type Category, type CustomComponent, type Definition } from './types';

type Item = CatalogEntry | CustomComponent;
const collator = new Intl.Collator('en', { numeric: true });
const statusOf = (item: Item) => 'status' in item ? item.status : 'ready';
function ReadyPreview({ item }: { item: Definition }) {
  const host = useRef<HTMLDivElement>(null), [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div className="catalog-live-host" ref={host}>{visible && <Suspense fallback={<span className="catalog-loading">Loading preview…</span>}><div className="catalog-live-demo"><item.preview {...item.defaults}/></div></Suspense>}</div>;
}
const CatalogCard = memo(function CatalogCard({ item, active, onPreview }: { item: Item; active: boolean; onPreview: (id: string | null) => void }) {
  const planned = 'status' in item && item.status === 'planned', builtin = 'status' in item && item.status === 'ready';
  return <article className="collection-card catalog-card" data-status={statusOf(item)} data-component-id={item.id}>
    <div className={`catalog-card-art ${planned ? 'is-planned' : 'is-ready'}`}>
      {planned ? <Link className="planned-art-link" to={componentPath(item)} tabIndex={-1} aria-hidden="true"><PlannedComponentPreview item={item} compact/></Link> : active && builtin ? <ReadyPreview item={item}/> : <Link className="ready-art-link" to={componentPath(item)} tabIndex={-1} aria-hidden="true"><span className="ready-art-symbol"><Code2 size={28}/></span><span>{item.name}</span><small>{builtin ? 'Live preview & source available' : 'Saved in this browser'}</small></Link>}
      {builtin && <button className={`card-live-button ${active ? 'is-playing' : ''}`} aria-label={`${active ? 'Stop' : 'Preview'} ${item.name}`} aria-pressed={active} onClick={() => onPreview(active ? null : item.id)}>{active ? <Square size={11}/> : <Play size={11}/>} {active ? 'Stop preview' : 'Live preview'}</button>}
    </div>
    <div className="catalog-card-info"><Link className="catalog-card-link" to={componentPath(item)}><h2>{item.name}<ArrowUpRight size={14}/></h2><span className="catalog-card-category">{item.category}</span></Link><FavoriteButton item={item}/></div>
    <div className="catalog-card-bottom"><StatusBadge status={statusOf(item)}/>{'files' in item && <span className="catalog-local">LOCAL</span>}</div>
  </article>;
});

export default function CatalogPage({ category, favoritesOnly = false }: { category?: Category; favoritesOnly?: boolean }) {
  const { custom } = useLibrary(), favorites = useFavorites(state => state.ids);
  const [params, setParams] = useSearchParams(), navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const selectedCategory = category ?? catalogCategories.find(value => categorySlug(value) === params.get('category'));
  const status = ['ready', 'planned'].includes(params.get('status') ?? '') ? params.get('status')! : 'all';
  const sort = ['name-asc', 'name-desc', 'ready-first'].includes(params.get('sort') ?? '') ? params.get('sort')! : 'catalog';
  const all = useMemo(() => [...registry, ...custom], [custom]);
  const available = useMemo(() => favoritesOnly ? all.filter(item => favorites.includes(item.id)) : all, [all, favoritesOnly, favorites]);
  const items = useMemo(() => {
    const filtered = available.filter(item => (!selectedCategory || item.category === selectedCategory) && (status === 'all' || statusOf(item) === status));
    if (sort === 'name-asc') filtered.sort((a,b) => collator.compare(a.name,b.name));
    if (sort === 'name-desc') filtered.sort((a,b) => collator.compare(b.name,a.name));
    if (sort === 'ready-first') filtered.sort((a,b) => Number(statusOf(b) === 'ready') - Number(statusOf(a) === 'ready'));
    return filtered;
  }, [available, selectedCategory, status, sort]);
  useEffect(() => { document.title = `${favoritesOnly ? 'Favorites' : selectedCategory ?? 'Components'} — DevUI Bits`; }, [favoritesOnly, selectedCategory]);
  useEffect(() => { setPreview(null); }, [selectedCategory, status, sort, favoritesOnly]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'all' || value === 'catalog') next.delete(key); else next.set(key,value);
    if (category && key === 'category') navigate(`/browse${next.size ? `?${next}` : ''}`);
    else setParams(next, { replace: true });
  };
  const ready = available.filter(item => statusOf(item) === 'ready').length;
  return <section className="catalog-page" aria-labelledby="catalog-title">
    <div className="catalog-heading"><div><div className="catalog-title-line"><h1 id="catalog-title">{favoritesOnly ? 'Favorites' : selectedCategory ?? 'Components'}</h1><span className="catalog-total" aria-label={`${available.length} total components`}>{available.length}</span></div><p>{favoritesOnly ? 'Your saved ideas, kept in this browser.' : 'Explore the library. Try what’s ready, and see what’s coming next.'}</p></div><Link className="catalog-guide-link" to="/get-started/introduction">How it works <ArrowUpRight size={13}/></Link></div>
    <div className="catalog-toolbar"><div className="catalog-status-filters" aria-label="Component status"><button aria-pressed={status === 'all'} onClick={() => update('status','all')}>All <span>{available.length}</span></button><button aria-pressed={status === 'ready'} onClick={() => update('status','ready')}>Ready <span>{ready}</span></button><button aria-pressed={status === 'planned'} onClick={() => update('status','planned')}>Planned <span>{available.length - ready}</span></button></div><div className="catalog-selects"><label><span>Category</span><select aria-label="Filter category" value={selectedCategory ? categorySlug(selectedCategory) : 'all'} onChange={event => update('category',event.target.value)}><option value="all">All categories</option>{catalogCategories.map(value => <option key={value} value={categorySlug(value)}>{value}</option>)}</select></label><label><span>Sort</span><select aria-label="Sort components" value={sort} onChange={event => update('sort',event.target.value)}><option value="catalog">Catalog order</option><option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option><option value="ready-first">Ready first</option></select></label></div></div>
    <div className="catalog-results-line"><p className="collection-count" data-testid="catalog-count" data-count={items.length} data-total={available.length}>{items.length} of {available.length} components{selectedCategory ? ` · ${selectedCategory}` : ''}</p>{(selectedCategory || status !== 'all' || sort !== 'catalog') && <button className="text-button" onClick={() => navigate(favoritesOnly ? '/favorites' : '/browse')}><RotateCcw size={12}/> Reset filters</button>}</div>
    {items.length ? <div className="collection-grid catalog-grid">{items.map(item => <CatalogCard key={item.id} item={item} active={preview === item.id} onPreview={setPreview}/>)}</div> : <div className="catalog-empty"><Bookmark size={28}/><h2>{favoritesOnly && !available.length ? 'Keep a little inspiration.' : 'No components in this selection.'}</h2><p>{favoritesOnly && !available.length ? 'Use the bookmark on a component to save it here. Favorites stay on this device.' : 'Try a different category or status.'}</p><Link className="small-button" to="/browse">Browse components <ArrowRight size={14}/></Link></div>}
    {preview && <button className="stop-catalog-preview" onClick={() => setPreview(null)}><X size={13}/> Stop live preview</button>}
  </section>;
}
