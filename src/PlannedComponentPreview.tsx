import { useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categorySlug, type PlannedDefinition } from './types';
import { FavoriteButton, StatusBadge } from './CatalogUI';

export function PlannedComponentPreview({ item, compact = false }: { item: PlannedDefinition; compact?: boolean }) {
  return <div className={`planned-preview ${compact ? 'planned-preview-compact' : ''}`} data-testid="planned-preview">
    <span className="planned-symbol" aria-hidden="true"><Clock3 size={compact ? 20 : 28}/></span>
    <span className="planned-kicker">COMING SOON</span>
    {compact ? <span className="planned-card-title">{item.name}</span> : <h2>{item.name}</h2>}
    <p>{item.description}</p>
  </div>;
}
export function PlannedComponentPage({ item }: { item: PlannedDefinition }) {
  useEffect(() => { document.title = `${item.name} — DevUI Bits`; }, [item.name]);
  return <div className="planned-component-page">
    <div className="component-heading"><Link className="breadcrumb" to={`/${categorySlug(item.category)}`}>{item.category} <span>/</span></Link><div className="title-line"><h1>{item.name}</h1><StatusBadge status={item.status}/><FavoriteButton item={item}/></div><p>{item.description}</p></div>
    <div className="planned-page-toolbar"><span><BookOpen size={15}/> Component preview</span><StatusBadge status={item.status}/></div>
    <section className="planned-preview-frame" aria-label="Planned component preview"><PlannedComponentPreview item={item}/></section>
    <p className="planned-note">Live preview, source code and customization will be available when this component is ready.</p>
    <Link className="small-button planned-back" to="/browse"><ArrowLeft size={14}/> Back to Components</Link>
  </div>;
}
