import { describe, expect, it } from 'vitest';
import { catalogNames, plannedDescription } from './catalogNames';
import { registry, readyComponents, findComponent } from './registry';
import { componentPath, categorySlug } from './types';

const originalRoutes = [
  '/backgrounds/micro-slats', '/text-animations/blur-text', '/text-animations/split-text',
  '/text-animations/glitch-text', '/text-animations/typewriter-text', '/animations/fade-in',
  '/animations/scroll-reveal', '/animations/magnet-effect', '/animations/animated-list',
  '/components/tilt-card', '/components/spotlight-card', '/components/animated-carousel',
  '/components/magnetic-button', '/backgrounds/particle-background', '/backgrounds/animated-gradient',
  '/backgrounds/interactive-grid', '/backgrounds/wave-background', '/micro-interactions/animated-toggle',
  '/micro-interactions/hover-button', '/micro-interactions/ripple-effect', '/micro-interactions/interactive-cursor',
  '/components/advanced-mega-menu', '/components/3d-interactive-card', '/micro-interactions/morphing-button',
  '/components/animated-tabs', '/components/magnetic-navigation', '/backgrounds/interactive-particle-background',
  '/animations/scroll-storytelling-section', '/components/advanced-image-gallery',
];
describe('phase 4 catalog and route compatibility', () => {
  it('registers all 217 requested names in their category and requested order', () => {
    expect(catalogNames.map(group => group.names.length)).toEqual([33,38,48,34,64]);
    for (const {category,names} of catalogNames) {
      const entries = registry.filter(item => item.category === category);
      expect(entries.slice(0,names.length).map(item => item.name)).toEqual(names);
      for (const name of names) expect(registry.filter(item => item.name === name)).toHaveLength(1);
    }
    expect(registry).toHaveLength(239);
    expect(readyComponents).toHaveLength(45);
    expect(registry.filter(item => item.status === 'planned')).toHaveLength(194);
  });
  it('retains every original ready route, including moved-category aliases', () => {
    for (const route of originalRoutes) {
      const [,category,slug] = route.split('/');
      expect(findComponent(category,slug)?.status,route).toBe('ready');
    }
    expect(findComponent('animations','scroll-reveal')).toBe(findComponent('text-animations','scroll-reveal'));
    expect(findComponent('animations','animated-list')).toBe(findComponent('components','animated-list'));
  });
  it('has unique names, IDs, slugs and routes, and every entry resolves to itself', () => {
    for (const key of ['name','id','slug'] as const) expect(new Set(registry.map(item => item[key])).size).toBe(registry.length);
    const routes = registry.flatMap(item => [componentPath(item), ...item.aliases ?? []]);
    expect(new Set(routes).size).toBe(routes.length);
    for (const item of registry) expect(findComponent(categorySlug(item.category),item.slug)).toBe(item);
    expect(findComponent('components','not-a-component')).toBeUndefined();
  });
  it('keeps planned components honest and separate from executable/source metadata', () => {
    for (const item of registry.filter(item => item.status === 'planned')) {
      expect(item.description).toBe(plannedDescription);
      for (const key of ['preview','schema','source','defaults','dependencies']) expect(item).not.toHaveProperty(key);
    }
    expect(findComponent('animations','ripple-distortion')).toMatchObject({name:'Ripple Distortion',status:'planned'});
    for (const slug of ['text-type','tilted-card','carousel','magnet','particles','waves']) expect(registry.find(item => item.slug === slug)?.status).toBe('planned');
  });
});
