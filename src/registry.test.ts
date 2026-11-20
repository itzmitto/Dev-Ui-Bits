import { describe, it, expect } from 'vitest';
import {registry, readyComponents, findComponent} from './registry';
import {builtinFiles} from './builtinFiles';
import { componentPath, categorySlug } from './types';
import { validateSchema } from './storage';

describe('extensible component registry', () => {
  it('retains all original component routes and registers eight additional implementations', () => {
    expect(readyComponents).toHaveLength(63);
    expect(new Set(readyComponents.map(componentPath)).size).toBe(63);
    for (const slug of ['micro-slats', 'blur-text', 'tilt-card', 'animated-toggle', 'scroll-reveal', 'particle-background']) expect(registry.find(c => c.slug === slug)).toBeDefined();
    for (const component of readyComponents) {
      expect(findComponent(categorySlug(component.category), component.slug)).toBe(component);
      expect(() => validateSchema(component.schema, component.defaults)).not.toThrow();
    }
  });
  it('exports actual modules, their styles and required supporting files', () => {
    for (const component of readyComponents) {
      const files = builtinFiles(component, component.defaults);
      expect(files[`/effects/${component.source}.tsx`]).toContain(`export function ${component.exportName}`);
      for (const [path, code] of Object.entries(files)) expect(typeof code === 'string' && code.length > 0, `${component.id}: ${path}`).toBe(true);
      for (const path of [...component.styles ?? [], ...component.supportingFiles ?? []]) expect(files[`/effects/${path}`]).toBeTruthy();
    }
  });
});
