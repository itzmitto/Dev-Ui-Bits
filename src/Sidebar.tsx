import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bookmark, BookOpen, Box, ChevronDown, Code2, FileText, Grid2X2, History, Layers, LayoutTemplate, MousePointer2, PanelLeft, Plug, Sparkles, Type, WandSparkles } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { registry, findComponent } from './registry';
import { catalogCategories } from './catalogNames';
import { categorySlug, componentPath, type Category, type CustomComponent } from './types';

const categoryIcons = { 'Text Animations': Type, Animations: Sparkles, Components: Layers, 'Micro Interactions': MousePointer2, Backgrounds: Grid2X2 };
export const startLinks = [
  { label: 'Introduction', path: '/get-started/introduction', icon: BookOpen },
  { label: 'Installation', path: '/get-started/installation', icon: Code2 },
  { label: 'MCP', path: '/get-started/mcp', icon: Plug },
  { label: 'Changelog', path: '/get-started/changelog', icon: History },
  { label: 'Favorites', path: '/favorites', icon: Bookmark },
];
export const exploreLinks = [
  { label: 'Components', path: '/browse', icon: Layers },
  { label: 'Blocks', path: '/explore/blocks', icon: Box },
  { label: 'App UI', path: '/explore/app-ui', icon: PanelLeft },
  { label: 'Templates', path: '/explore/templates', icon: LayoutTemplate },
  { label: 'Skills', path: '/explore/skills', icon: WandSparkles },
];
export function Sidebar({ open, custom, mobileNav }: { open: boolean; custom: CustomComponent[]; mobileNav: ReactNode }) {
  const { pathname } = useLocation();
  const list = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState<Set<Category>>(() => new Set());
  const [, category, slug] = pathname.split('/');
  const current = findComponent(category, slug);
  const activeCategory = current?.category ?? custom.find(item => componentPath(item) === pathname)?.category;
  useEffect(() => {
    if (activeCategory) setCollapsed(previous => {
      if (!previous.has(activeCategory)) return previous;
      const next = new Set(previous); next.delete(activeCategory); return next;
    });
  }, [activeCategory, pathname]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = list.current, active = container?.querySelector<HTMLElement>('.component-link.active');
      if (!container || !active) return;
      const parent = container.getBoundingClientRect(), child = active.getBoundingClientRect();
      if (child.top < parent.top) container.scrollTop -= parent.top - child.top + 8;
      else if (child.bottom > parent.bottom) container.scrollTop += child.bottom - parent.bottom + 8;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, collapsed, open, custom.length]);
  return <aside id="component-navigation" className={`sidebar catalog-sidebar ${open ? 'is-open' : ''}`} aria-label="Component navigation">
    <nav className="mobile-library-links" aria-label="Mobile navigation">{mobileNav}</nav>
    <div className="sidebar-tools">
      <Link className="sidebar-brand" to="/"><Code2 size={18}/> DevUI Bits <span>LIBRARY</span></Link>
      <NavLink className="browse-button" to="/browse"><Grid2X2 size={14}/> Browse all components <span>{registry.length + custom.length}</span></NavLink>
      <nav className="category-icons" aria-label="Quick categories">{catalogCategories.map(category => { const Icon = categoryIcons[category]; return <NavLink key={category} to={`/${categorySlug(category)}`} title={category} aria-label={category}><Icon size={16}/></NavLink>; })}</nav>
    </div>
    <nav className="component-list" ref={list} aria-label="Library navigation">
      <div className="sidebar-link-group"><h2>GET STARTED</h2>{startLinks.map(({ label, path, icon: Icon }) => <NavLink className="sidebar-page-link" key={path} to={path}><Icon size={13}/>{label}</NavLink>)}</div>
      <div className="sidebar-link-group"><h2>EXPLORE</h2>{exploreLinks.map(({ label, path, icon: Icon }) => <NavLink className="sidebar-page-link" key={path} to={path}><Icon size={13}/>{label}</NavLink>)}</div>
      {catalogCategories.map(category => {
        const Icon = categoryIcons[category], isCollapsed = collapsed.has(category), id = `category-${categorySlug(category)}`;
        const items = [...registry.filter(item => item.category === category), ...custom.filter(item => item.category === category)];
        return <section className="sidebar-category" key={category}>
          <div className="category-heading"><Link className="category-label" to={`/${categorySlug(category)}`}><Icon size={13}/>{category}<span>{items.length}</span></Link><button className="category-collapse" aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${category}`} aria-expanded={!isCollapsed} aria-controls={id} onClick={() => setCollapsed(previous => { const next = new Set(previous); if (next.has(category)) next.delete(category); else next.add(category); return next; })}><ChevronDown size={13}/></button></div>
          <div id={id} hidden={isCollapsed}>{items.map(item => {
            const status = 'status' in item ? item.status : 'ready';
            const active = current?.id === item.id || componentPath(item) === pathname;
            return <Link className={`component-link ${active ? 'active' : ''}`} title={item.name} key={item.id} to={componentPath(item)} data-status={status} aria-label={item.name} aria-description={status === 'ready' ? 'Ready' : 'Planned'} aria-current={active ? 'page' : undefined}><span>{item.name}</span>{status === 'ready' ? <span className="sidebar-ready-dot" title="Ready"/> : <span className="sidebar-planned" title="Planned">Planned</span>}</Link>;
          })}</div>
        </section>;
      })}
    </nav>
    <div className="sidebar-footer"><span><FileText size={13}/> {registry.filter(item => item.status === 'ready').length + custom.length} ready · {registry.filter(item => item.status === 'planned').length} planned</span></div>
  </aside>;
}
