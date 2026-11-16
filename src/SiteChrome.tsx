import { Code2, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from './theme';
export const GITHUB_URL = 'https://github.com/itzmitto/Dev-Ui-Bits';
// Official GitHub silhouette; Lucide does not distribute brand icons.
export function GithubIcon() {
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.09 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18A11 11 0 0 1 12 6.04c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.12 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.14c0 .31.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>;
}
export function HeaderActions() {
  const { theme, toggleTheme } = useTheme();
  return <div className="header-right"><a className="icon-button github-button" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="DevUI Bits on GitHub" title="View source on GitHub"><GithubIcon/></a><span className="action-divider"/><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}</button></div>;
}
export function SiteFooter() {
  return <footer className="site-footer"><Link className="brand" to="/"><Code2 size={20}/> DevUI Bits</Link><span>Small details. Remarkable interfaces.</span><nav aria-label="Footer"><Link to="/browse">Components</Link><Link to="/categories">Categories</Link><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a><a href="/third-party-notices.txt" target="_blank" rel="noopener noreferrer">Licenses</a></nav></footer>;
}
