import { memo, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Code2, Grid2X2, Layers, MousePointer2, Sparkles, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { registry } from './registry';
import { categories, categorySlug, componentPath, type Definition } from './types';
import { InteractiveParticleBackground } from './effects/InteractiveParticleBackground';
import { useTheme } from './theme';
const icons = [Type, Sparkles, Layers, Grid2X2, MousePointer2];
const descriptions = ['Give every word a little personality.', 'Motion that makes an interface feel alive.', 'Thoughtful building blocks, ready to interact.', 'Set the scene with something unexpected.', 'Small moments. A lasting impression.'];
const featuredSlugs = ['micro-slats', 'blur-text', '3d-interactive-card', 'animated-tabs', 'morphing-button', 'spotlight-card'];
const featured = featuredSlugs.map(slug => registry.find(item => item.slug === slug)!);
function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null), [visible, setVisible] = useState(false), [visited, setVisited] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setVisited(true); }, { threshold: .05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible, visited };
}
const HeroBackground = memo(function HeroBackground() {
  const { theme } = useTheme();
  return <InteractiveParticleBackground color={theme === 'dark' ? '#a484ec' : '#8660ba'} secondary={theme === 'dark' ? '#d6c1ff' : '#9a7bc9'} background={theme === 'dark' ? '#120f17' : '#faf9fc'} density={85} speed={.45} connectionDistance={125} opacity={.65} interactive strength={.5} trail={0}/>;
});
export function CategoryCards() {
  return <div className="home-categories">{categories.map((category, index) => {
    const Icon = icons[index], count = registry.filter(item => item.category === category).length;
    return <Link className="home-category" key={category} to={`/${categorySlug(category)}`}><div className="category-card-top"><span className="category-card-icon"><Icon size={23}/></span><ArrowUpRight size={18}/></div><h3>{category}</h3><p>{descriptions[index]}</p><span className="category-count">{count} components <ArrowRight size={13}/></span></Link>;
  })}</div>;
}
const FeaturedCard = memo(function FeaturedCard({ item, index }: { item: Definition; index: number }) {
  const { ref, visible, visited } = useVisible<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  // Mount on first intersection and retain interaction state. Canvas loops and CSS
  // animations pause outside the viewport; only the active feature runs continuously.
  const animate = visible && (playing || index === 0);
  return <article className="home-feature" onMouseEnter={() => setPlaying(true)} onMouseLeave={() => setPlaying(false)} onFocus={() => setPlaying(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPlaying(false); }}>
    <div className="feature-preview" ref={ref} data-active={animate}>
      {visited && <div className="feature-demo" data-motion={animate ? 'play' : 'still'}><item.preview {...item.defaults} paused={!animate}/></div>}
    </div>
    <Link className="feature-link" to={componentPath(item)}><div><h3>{item.name}</h3><p>{item.category}</p></div><span className="feature-arrow"><ArrowUpRight size={17}/></span></Link>
  </article>;
});
export default function HomePage() {
  useEffect(() => { document.title = 'DevUI Bits — Animated React components'; }, []);
  return <>
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true"><HeroBackground/></div>
      <div className="hero-content"><Link className="hero-badge" to="/browse"><span className="purple-dot"/>{registry.length} components. Endless possibilities.<ArrowRight size={13}/></Link><h1 id="hero-title">Animated React Components<br className="hero-break"/> for <span>Creative Developers</span></h1><p>Explore interactive components, animated backgrounds, creative effects and reusable React code.</p><div className="hero-actions"><Link className="hero-primary" to="/browse">Explore Components <ArrowRight size={17}/></Link><Link className="hero-secondary" to="/categories">Browse Categories <Grid2X2 size={17}/></Link></div><div className="hero-meta"><span><Code2 size={14}/> React + TypeScript</span><i/><span>Open source</span><i/><span>Yours to customize</span></div></div>
      <div className="hero-bottom-line"><span>LESS BOILERPLATE. MORE POSSIBILITY.</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
    <section className="home-section" id="categories" aria-labelledby="library-title"><div className="home-section-heading"><div><span className="eyebrow">FIND YOUR NEXT IDEA</span><h2 id="library-title">Explore the Library<span className="heading-dot">.</span></h2></div><p>From a single word to an entire atmosphere.<br/>Find the right bit for your next build.</p></div><CategoryCards/></section>
    <section className="home-section featured-section" aria-labelledby="featured-title"><div className="home-section-heading"><div><span className="eyebrow">A FEW OF OUR FAVORITES</span><h2 id="featured-title">Small bits. Big impact<span className="heading-dot">.</span></h2></div><Link className="section-link" to="/browse">View all {registry.length} components <ArrowRight size={16}/></Link></div><div className="home-feature-grid">{featured.map((item, index) => <FeaturedCard key={item.id} item={item} index={index}/>)}</div><div className="library-bottom"><span><Code2 size={19}/> Real components. Real source code. Ready for your next idea.</span><Link to="/guide">Get started <ArrowRight size={15}/></Link></div></section>
  </>;
}
export function CategoriesPage() {
  useEffect(() => { document.title = 'Categories — DevUI Bits'; }, []);
  return <div className="categories-page"><div className="component-heading"><span className="eyebrow">FIVE WAYS TO MAKE IT MOVE</span><h1>Explore the Library.</h1><p>Browse all five categories of original React components.</p></div><CategoryCards/></div>;
}
