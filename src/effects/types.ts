export type EffectProps = Record<string, string | number | boolean>;
export const num = (p: EffectProps, k: string, fallback: number) => typeof p[k] === 'number' ? Number(p[k]) : fallback;
export const str = (p: EffectProps, k: string, fallback: string) => typeof p[k] === 'string' ? String(p[k]) : fallback;
