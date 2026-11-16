import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Eye,
  Grid2X2,
  Layers,
  Maximize,
  Menu,
  Monitor,
  MousePointer2,
  RotateCcw,
  Settings2,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
  Type,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { builtinFiles, registry, findComponent } from "./registry";
import {
  categories,
  categorySlug,
  componentPath,
  type Category,
  type CustomComponent,
  type Definition,
  type EffectProps,
  type FileMap,
} from "./types";
import {
  useLibrary,
  slugify,
  validateImport,
  validateProperties,
  validateSchema,
  validateDependencies,
} from "./storage";
import { download, exportJSON, exportProject } from "./export";
import { Controls } from "./Controls";
import { Field } from "./effects/Field";
import { starterFiles } from "./templates";
import HomePage, { CategoriesPage } from "./HomePage";
import { HeaderActions, SiteFooter } from "./SiteChrome";
const Editor = lazy(() => import("./Editor"));
const icons = [Type, Sparkles, Layers, Grid2X2, MousePointer2];

type Notify = (message: string) => void;
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h2>Something interrupted the preview.</h2>
        <p>Reload this page to try again. Your saved components are safe.</p>
        <button onClick={() => location.reload()}>Reload</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const { custom, load, storageError } = useLibrary();
  const [mobileOpen, setMobileOpen] = useState(false), [toast, setToast] = useState("");
  const location = useLocation(), menuButton = useRef<HTMLButtonElement>(null);
  const home = location.pathname === "/", all = [...registry, ...custom];
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setMobileOpen(false); window.scrollTo(0, 0); if (mobileOpen) menuButton.current?.focus(); }, [location.pathname]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 3300); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); menuButton.current?.focus(); }
      if (event.key === "Tab") {
        const elements = [...document.querySelectorAll<HTMLElement>(".topbar a, .topbar button, .sidebar a, .mobile-home-nav a")].filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const desktop = matchMedia("(min-width: 840px)");
    const resize = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", resize);
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previousOverflow; desktop.removeEventListener("change", resize); window.removeEventListener("keydown", key); };
  }, [mobileOpen]);
  const notify: Notify = message => setToast(message);
  const mainNav = <><NavLink to="/" end>Home</NavLink><NavLink to="/browse">Components</NavLink><NavLink to="/categories">Categories</NavLink></>;
  return <ErrorBoundary>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark"><Code2 size={24}/></span>DevUI <span className="brand-light">Bits</span></Link>
      <span className="header-divider">/</span><nav className="header-nav" aria-label="Main navigation">{mainNav}</nav><HeaderActions/>
      <button ref={menuButton} className="mobile-menu icon-button" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation"} aria-expanded={mobileOpen} aria-controls={home ? "mobile-navigation" : "component-navigation"} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
    </header>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => { setMobileOpen(false); menuButton.current?.focus(); }}/>}
    {home && mobileOpen && <nav className="mobile-home-nav" id="mobile-navigation" aria-label="Mobile navigation">{mainNav}</nav>}
    <div className={home ? "home-layout" : "library-layout"}>
      {!home && <aside id="component-navigation" className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Component navigation">
        <nav className="mobile-library-links" aria-label="Mobile navigation">{mainNav}</nav>
        <div className="sidebar-tools"><NavLink className="browse-button" to="/browse"><Grid2X2 size={15}/> Browse all components <span>{all.length}</span></NavLink><div className="category-icons">{categories.map((category, index) => { const Icon = icons[index]; return <NavLink key={category} to={`/${categorySlug(category)}`} title={category} aria-label={category}><Icon size={17}/></NavLink>; })}</div></div>
        <nav className="component-list">{categories.map((category, index) => { const Icon = icons[index]; return <section key={category}><Link className="category-label" to={`/${categorySlug(category)}`}><Icon size={13}/>{category}<ChevronDown size={12}/></Link>{all.filter(item => item.category === category).map(item => <NavLink className="component-link" title={item.name} key={item.id} to={componentPath(item)}><span>{item.name}</span>{"isNew" in item && item.isNew ? <span className="new-badge">NEW</span> : "files" in item ? <span className="local-dot" title="Locally saved"/> : null}</NavLink>)}</section>; })}</nav>
        <div className="sidebar-footer"><Link to="/guide"><Terminal size={15}/> Installation guide <ArrowUpRight size={14}/></Link><span><i/> Original code. Open possibilities.</span></div>
      </aside>}
      <main className={home ? "home-main" : "main-content"} id="main">
        {storageError && <div role="alert" className="notice">{storageError}</div>}
        <Routes><Route path="/" element={<HomePage/>}/><Route path="/categories" element={<CategoriesPage/>}/><Route path="/browse" element={<Browse/>}/><Route path="/guide" element={<Guide notify={notify}/>}/><Route path="/create" element={<Workshop notify={notify}/>}/><Route path="/edit/:id" element={<WorkshopRoute notify={notify}/>}/><Route path="/:category/:slug" element={<ComponentRoute notify={notify}/>}/><Route path="/:category" element={<Browse/>}/><Route path="*" element={<NotFound/>}/></Routes>
        <SiteFooter/>
      </main>
      {!home && <RightRail/>}
    </div>
    {toast && <div className="toast" role="status"><Check size={15}/>{toast}</div>}
  </ErrorBoundary>;
}
function RightRail() {
  const { pathname } = useLocation();
  const current =
    registry.find((c) => componentPath(c) === pathname) ?? registry[0];
  const relatives = registry
    .filter((c) => c.category === current.category && c.id !== current.id)
    .slice(0, 3);
  return (
    <aside className="right-rail">
      <span className="rail-eyebrow">A LITTLE INSPIRATION</span>
      <Link className="featured-card" to="/backgrounds/animated-gradient">
        <div className="featured-art">
          <Field
            mode="gradient"
            color="#9333ea"
            secondary="#4f46e5"
            background="#15101f"
            speed={0.3}
            scale={0.7}
          />
          <span>
            Make something
            <br />
            <b>remarkable.</b>
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="featured-caption">
          <span>
            <Sparkles size={13} /> Featured component
          </span>
          <ArrowUpRight size={14} />
        </div>
      </Link>
      <div className="rail-section">
        <h3>
          Related components <span>{relatives.length}</span>
        </h3>
        {relatives
          .map((c) => ({
            title: c.name,
            sub: c.category,
            url: componentPath(c),
            icon: icons[categories.indexOf(c.category)],
          }))
          .map((item) => (
            <Link className="rail-link" key={item.url} to={item.url}>
              <span className="rail-icon">
                <item.icon size={16} />
              </span>
              <span>
                {item.title}
                <small>{item.sub}</small>
              </span>
              <ArrowUpRight size={13} />
            </Link>
          ))}
      </div>
      <div className="rail-note">
        <span className="note-icon">
          <Code2 size={19} />
        </span>
        <h3>
          A starting point.
          <br />
          Not a limitation.
        </h3>
        <p>
          Take the code. Change the colors. Break a few rules. Make it yours.
        </p>
        <Link to="/guide">
          Installation guide <ArrowRight size={13} />
        </Link>
      </div>
      <div className="rail-foot">
        <span className="purple-dot" /> 100% free. Endlessly customizable.
      </div>
    </aside>
  );
}
function NotFound() {
  return (
    <div className="empty-state">
      <span className="eyebrow">OFF THE GRID</span>
      <h1>Nothing here. Yet.</h1>
      <p>Find your next idea in the component collection.</p>
      <Link className="primary-button" to="/browse">
        Browse components <ArrowRight size={14} />
      </Link>
    </div>
  );
}
function ComponentRoute({ notify }: { notify: Notify }) {
  const { category = "", slug = "" } = useParams(),
    { custom, loaded } = useLibrary();
  const builtin = findComponent(category, slug);
  const own = custom.find(
    (c) => categorySlug(c.category) === category && c.slug === slug,
  );
  if (builtin)
    return <ComponentPage key={builtin.id} item={builtin} notify={notify} />;
  if (own)
    return (
      <ComponentPage key={own.id + own.updatedAt} item={own} notify={notify} />
    );
  return loaded ? (
    <NotFound />
  ) : (
    <div className="loading-state">Loading your library…</div>
  );
}
function customFiles(item: CustomComponent, values: EffectProps): FileMap {
  return {
    ...item.files,
    [`/App.${item.language}`]: `import Component from './Component.${item.language}';\nimport './styles.css';\nexport default function App() { return <Component {...${JSON.stringify(values, null, 2)}} />; }`,
  };
}
function ComponentPage({
  item,
  notify,
}: {
  item: Definition | CustomComponent;
  notify: Notify;
}) {
  const own = "files" in item;
  const [tab, setTab] = useState("preview"),
    [values, setValues] = useState({ ...item.defaults }),
    [revision, setRevision] = useState(0),
    [viewport, setViewport] = useState("desktop"),
    [fullscreen, setFullscreen] = useState(false),
    [previewBg, setPreviewBg] = useState("#120f17"),
    [showContent, setShowContent] = useState(false);
  const files = own ? customFiles(item, values) : builtinFiles(item, values);
  const deps = item.dependencies ?? {};
  useEffect(() => {
    document.title = `${item.name} — DevUI Bits`;
    return () => {
      document.title = "DevUI Bits";
    };
  }, [item.name]);
  useEffect(() => {
    if (!fullscreen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", key);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = previous;
    };
  }, [fullscreen]);
  const reset = () => {
    setValues({ ...item.defaults });
    setPreviewBg(String(item.defaults.background ?? "#120f17"));
    setRevision((r) => r + 1);
    notify("Default settings restored");
  };
  const related = registry
    .filter((c) => c.category === item.category && c.id !== item.id)
    .slice(0, 3);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard");
    } catch {
      notify("Clipboard unavailable. Open Code and select the text.");
    }
  };
  return (
    <>
      <div className="component-heading">
        <Link className="breadcrumb" to={`/${categorySlug(item.category)}`}>
          {item.category} <span>/</span>
        </Link>
        <div className="title-line">
          <h1>{item.name}</h1>
          {!own && item.isNew && <span className="title-badge">NEW</span>}
          {own && <span className="title-badge">YOUR COMPONENT</span>}
        </div>
        <p>{item.description}</p>
      </div>
      <div className="preview-toolbar">
        <div className="tabs" role="tablist" aria-label="Component view">
          {[
            { id: "preview", label: "Preview", icon: Eye },
            { id: "code", label: "Code", icon: Code2 },
            { id: "editor", label: "Editor", icon: Terminal },
          ].map((t) => (
            <button
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="component-panel"
              key={t.id}
              onClick={() => setTab(t.id)}
              className={tab === t.id ? "active" : ""}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="preview-actions">
          {tab === "preview" && (
            <div className="viewport-buttons">
              {[
                { id: "desktop", label: "Desktop viewport", icon: Monitor },
                { id: "tablet", label: "Tablet viewport", icon: Tablet },
                { id: "mobile", label: "Mobile viewport", icon: Smartphone },
              ].map((v) => (
                <button
                  className={viewport === v.id ? "active" : ""}
                  key={v.id}
                  aria-label={v.label}
                  aria-pressed={viewport === v.id}
                  onClick={() => setViewport(v.id)}
                >
                  <v.icon size={15} />
                </button>
              ))}
            </div>
          )}
          <button
            className="icon-button"
            aria-label="Copy component code"
            title="Copy component code"
            onClick={() =>
              void copy(
                own
                  ? files[`/Component.${item.language}`]
                  : files[`/effects/${item.source}.tsx`],
              )
            }
          >
            <Copy size={15} />
          </button>
          {own && (
            <Link className="small-button" to={`/edit/${item.id}`}>
              Edit
            </Link>
          )}
        </div>
      </div>
      <div id="component-panel" role="tabpanel" className="component-panel">
        {tab === "preview" ? (
          <>
            <section
              className={`preview-frame ${fullscreen ? "fullscreen-preview" : ""}`}
              aria-label="Live component preview"
            >
              <div className="preview-top-controls">
                <label className="preview-bg" title="Preview background">
                  <input
                    type="color"
                    aria-label="Preview background color"
                    value={previewBg}
                    onChange={(e) => {
                      setPreviewBg(e.target.value);
                      if ("background" in values)
                        setValues({ ...values, background: e.target.value });
                    }}
                  />
                </label>
                {item.category === "Backgrounds" && (
                  <button
                    className={`icon-button ${showContent ? "active" : ""}`}
                    title="Toggle sample content"
                    aria-label="Toggle sample content"
                    aria-pressed={showContent}
                    onClick={() => setShowContent(!showContent)}
                  >
                    <Type size={14} />
                  </button>
                )}
                <button
                  className="icon-button"
                  aria-label="Restart animation"
                  title="Restart animation"
                  onClick={() => setRevision((r) => r + 1)}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  className="icon-button"
                  aria-label={
                    fullscreen ? "Close fullscreen" : "Fullscreen preview"
                  }
                  onClick={() => setFullscreen(!fullscreen)}
                >
                  {fullscreen ? <X size={15} /> : <Maximize size={15} />}
                </button>
              </div>
              <div
                className={`preview-device device-${viewport}`}
                style={{ background: previewBg }}
                data-testid="preview-device"
              >
                {own ? (
                  <Suspense
                    fallback={
                      <div className="loading-state">
                        Loading isolated preview…
                      </div>
                    }
                  >
                    <Editor
                      key={revision + JSON.stringify(values)}
                      files={files}
                      name={item.name}
                      dependencies={deps}
                      previewOnly
                      tailwind={item.styling === "tailwind"}
                    />
                  </Suspense>
                ) : (
                  <item.preview
                    key={revision}
                    {...values}
                    background={
                      "background" in values ? values.background : previewBg
                    }
                  />
                )}{" "}
                {showContent && (
                  <div className="sample-content">
                    <span>BEYOND THE ORDINARY</span>
                    <h2>
                      A little motion.
                      <br />A whole new feeling.
                    </h2>
                    <p>Build something worth exploring.</p>
                    <button
                      onClick={() =>
                        notify(
                          "You found your spark. Make it yours in the editor.",
                        )
                      }
                    >
                      Find your spark <ArrowUpRight size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="preview-bottom">
                <span>
                  <i /> LIVE PREVIEW
                </span>
                <span>
                  {viewport === "desktop"
                    ? "Responsive canvas"
                    : viewport === "tablet"
                      ? "768 px"
                      : "375 px"}{" "}
                  <span className="preview-hint">
                    ·{" "}
                    {own
                      ? "Isolated React sandbox"
                      : item.category === "Backgrounds"
                        ? "Move your cursor to interact"
                        : "Made to interact"}
                  </span>
                </span>
              </div>
            </section>
            <Controls
              schema={item.schema}
              values={values}
              onChange={(p) => {
                setValues(p);
                if (item.slug === "animated-toggle") setRevision((r) => r + 1);
              }}
              onReset={reset}
              presets={!own ? item.presets : undefined}
            />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="loading-state">Loading code workspace…</div>
            }
          >
            {tab === "code" ? (
              <div className="source-section">
                <div className="code-intro">
                  <span>
                    <Code2 size={15} />{" "}
                    {own ? item.language.toUpperCase() : "React TSX"}{" "}
                    <span className="tag">
                      {own && item.styling === "tailwind" ? "Tailwind" : "CSS"}
                    </span>
                  </span>
                  <button
                    className="text-button"
                    onClick={() => setTab("editor")}
                  >
                    Open live editor <ArrowUpRight size={13} />
                  </button>
                </div>
                <Editor
                  files={files}
                  name={item.name}
                  dependencies={deps}
                  readOnly
                />
                <div className="source-actions">
                  <p>Original source. All supporting files included.</p>
                  <button
                    className="small-button"
                    onClick={() =>
                      exportProject(
                        files,
                        item.name,
                        deps,
                        own && item.styling === "tailwind",
                      )
                    }
                  >
                    <ArrowDownToLine size={13} /> Export project
                  </button>
                </div>
              </div>
            ) : (
              <Editor
                files={files}
                name={item.name}
                dependencies={deps}
                tailwind={own && item.styling === "tailwind"}
                notify={notify}
                onSave={
                  own
                    ? async (updated) => {
                        await useLibrary
                          .getState()
                          .save({
                            ...item,
                            files: updated,
                            updatedAt: Date.now(),
                          });
                        notify("Component saved to your library");
                      }
                    : undefined
                }
              />
            )}
          </Suspense>
        )}
      </div>
      <section className="installation" id="installation">
        <div className="section-title">
          <span className="section-icon">
            <Terminal size={17} />
          </span>
          <div>
            <h2>Make it yours</h2>
            <p>A few files. Endless possibilities.</p>
          </div>
        </div>
        <div className="install-step">
          <span className="step-count">01</span>
          <div>
            <h3>
              {Object.keys(deps).length
                ? "Install the dependency"
                : "No extra dependencies"}
            </h3>
            <p>
              {Object.keys(deps).length
                ? "Start with a React project and add the animation library."
                : "This component only needs React. You’re ready to go."}
            </p>
            {Object.keys(deps).length > 0 && (
              <div className="command">
                <span>
                  <span className="command-dollar">$</span> npm install{" "}
                  {Object.keys(deps).join(" ")}
                </span>
                <button
                  aria-label="Copy installation command"
                  onClick={() =>
                    void copy(`npm install ${Object.keys(deps).join(" ")}`)
                  }
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="install-step">
          <span className="step-count">02</span>
          <div>
            <h3>Copy the source. Add your own touch.</h3>
            <p>
              Use the Code tab for the component and its styles, or export a
              ready-to-run Vite project.
            </p>
            <button
              className="small-button"
              onClick={() =>
                exportProject(
                  files,
                  item.name,
                  deps,
                  own && item.styling === "tailwind",
                )
              }
            >
              <ArrowDownToLine size={13} /> Download source
            </button>
          </div>
        </div>
      </section>
      <section className="properties">
        <div className="section-bar">
          <h2>Properties</h2>
          <span className="muted">
            {item.schema.length} customizable controls
          </span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {item.schema.map((s) => (
                <tr key={s.key}>
                  <td>
                    <code>{s.key}</code>
                  </td>
                  <td>{typeof item.defaults[s.key]}</td>
                  <td>
                    <code>{String(item.defaults[s.key])}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="related">
        <div className="section-bar">
          <h2>Keep exploring</h2>
          <Link to={`/${categorySlug(item.category)}`}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="related-grid">
          {related.map((c) => (
            <Link key={c.id} to={componentPath(c)}>
              <span className="related-mini">
                <Sparkles size={26} />
              </span>
              <h3>
                {c.name} <ArrowUpRight size={13} />
              </h3>
              <p>{c.category}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
function Browse() {
  const { category } = useParams(),
    { custom } = useLibrary();
  const selected = categories.find((c) => categorySlug(c) === category);
  if (category && !selected) return <NotFound />;
  const items = [...registry, ...custom].filter(
    (c) =>
      (!selected || c.category === selected),
  );
  return (
    <>
      <div className="component-heading">
        <span className="eyebrow">THE COLLECTION</span>
        <h1>{selected || "Small bits. Big possibilities."}</h1>
        <p>
          {selected
            ? `Explore ${selected.toLowerCase()} that make your next interface feel alive.`
            : "Original React components. Ready to explore, customize, and make your own."}
        </p>
      </div>
      <div className="browse-filters">
        <div className="tabs">
          <Link className={!selected ? "active" : ""} to="/browse">
            All
          </Link>
          {categories.map((c, i) => {
            const Icon = icons[i];
            return (
              <Link
                className={selected === c ? "active" : ""}
                key={c}
                to={`/${categorySlug(c)}`}
                title={c}
              >
                <Icon size={15} />
                <span>{c}</span>
              </Link>
            );
          })}
        </div>

      </div>
      <p className="collection-count">
        {items.length} components to make your own
      </p>
      <div className="collection-grid">
        {items.map((c, i) => (
          <Link className="collection-card" key={c.id} to={componentPath(c)}>
            <div className={`collection-art art-${i % 4}`}>
              <span>
                {c.category === "Text Animations" ? (
                  c.name === "Glitch Text" ? (
                    "G̷L̷I̷T̷C̷H̷"
                  ) : (
                    "Make it move."
                  )
                ) : c.category === "Backgrounds" ? (
                  <div className="mini-slats" />
                ) : c.category === "Micro Interactions" ? (
                  <div className="mini-toggle" />
                ) : (
                  <span className="collection-symbol">✳</span>
                )}
              </span>
              <ArrowUpRight size={16} />
            </div>
            <h3>
              {c.name}
              <span>{"files" in c ? "LOCAL" : c.category}</span>
            </h3>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
      {items.length === 0 && (
        <div className="empty-state">No components in this category yet.</div>
      )}
    </>
  );
}
function Guide({ notify }: { notify: Notify }) {
  return (
    <>
      <div className="component-heading">
        <span className="eyebrow">GET STARTED</span>
        <h1>Your next idea starts here.</h1>
        <p>
          Independent components, written to be understood and made your own.
        </p>
      </div>
      <div className="guide-content">
        {[
          {
            title: "Start with React",
            text: "Use a React application with Vite and TypeScript. DevUI Bits exports include a complete Vite project, so you can also start directly from a component.",
          },
          {
            title: "Find your bit",
            text: "Browse five categories, try the live previews, and adjust the controls. Your current settings are included in the exported App file.",
          },
          {
            title: "Take the source",
            text: "Open the Code tab to inspect the actual component source and CSS. Download the ZIP, run npm install, then npm run dev. Motion components list their dependency on the component page.",
          },
          {
            title: "Build on the registry",
            text: "Develop your own effects in VS Code. Add their metadata, properties and controls to src/registry.ts; the navigation and component pages follow automatically.",
          },
          {
            title: "Keep your work",
            text: "Your custom components live in this browser’s IndexedDB. Use Library export to create a JSON backup. Import it in another browser to carry your work with you.",
          },
        ].map((s, i) => (
          <section key={s.title}>
            <span className="step-count">0{i + 1}</span>
            <div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </div>
          </section>
        ))}
        <div className="guide-actions">
          <Link className="primary-button" to="/browse">
            Explore components <ArrowRight size={14} />
          </Link>
          <button
            className="small-button"
            onClick={() => {
              download(
                "devui-bits-quickstart.md",
                "# DevUI Bits\n\n1. Open a component and download its source ZIP.\n2. Extract the ZIP.\n3. Run npm install.\n4. Run npm run dev.\n\nCustom components are stored in IndexedDB. Back up with JSON export.",
                "text/markdown",
              );
              notify("Quickstart downloaded");
            }}
          >
            Download quickstart
          </button>
        </div>
      </div>
    </>
  );
}
function WorkshopRoute({ notify }: { notify: Notify }) {
  const { id } = useParams(),
    { custom, loaded } = useLibrary();
  const item = custom.find((c) => c.id === id);
  return item ? (
    <Workshop key={item.id} existing={item} notify={notify} />
  ) : loaded ? (
    <NotFound />
  ) : (
    <div className="loading-state">Loading your component…</div>
  );
}
function Workshop({
  notify,
  existing,
}: {
  notify: Notify;
  existing?: CustomComponent;
}) {
  const { custom, save, importAll, remove } = useLibrary(),
    navigate = useNavigate();
  const [name, setName] = useState(existing?.name ?? "My Component"),
    [category, setCategory] = useState<Category>(
      existing?.category ?? "Components",
    ),
    [description, setDescription] = useState(
      existing?.description ?? "A little idea, brought to life.",
    ),
    [language, setLanguage] = useState<"tsx" | "jsx">(
      existing?.language ?? "tsx",
    ),
    [styling, setStyling] = useState<"css" | "tailwind">(
      existing?.styling ?? "css",
    ),
    [template, setTemplate] = useState("Animated card"),
    [started, setStarted] = useState(Boolean(existing)),
    [files, setFiles] = useState<FileMap>(existing?.files ?? {}),
    [defaults, setDefaults] = useState(
      JSON.stringify(
        existing?.defaults ?? {
          text: "Hello, possibilities.",
          color: "#a855f7",
        },
        null,
        2,
      ),
    ),
    [dependencies, setDependencies] = useState(
      JSON.stringify(existing?.dependencies ?? {}, null, 2),
    ),
    [schema, setSchema] = useState(
      JSON.stringify(
        existing?.schema ?? [
          { key: "text", label: "Text", type: "text" },
          { key: "color", label: "Primary color", type: "color" },
        ],
        null,
        2,
      ),
    ),
    [error, setError] = useState(""),
    [deleting, setDeleting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const validate = () => {
    if (!name.trim() || name.length > 80)
      throw new Error("Give your component a name of 1–80 characters.");
    const d = validateProperties(JSON.parse(defaults));
    return {
      d,
      s: validateSchema(JSON.parse(schema), d),
      deps: validateDependencies(JSON.parse(dependencies)),
    };
  };
  const start = () => {
    try {
      validate();
      setFiles(starterFiles(language, styling, template));
      setStarted(true);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid properties.");
    }
  };
  const doSave = async (updated: FileMap) => {
    try {
      const { d, s, deps } = validate(),
        id = existing?.id ?? crypto.randomUUID();
      const component: CustomComponent = {
        id,
        name: name.trim(),
        slug: existing?.slug ?? `${slugify(name)}-${id.slice(0, 8)}`,
        category,
        description,
        defaults: d,
        schema: s,
        files: updated,
        language,
        styling,
        dependencies: deps,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      };
      await save(component);
      notify("Saved locally. Your component is now in the sidebar.");
      navigate(componentPath(component));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not save component.";
      setError(message);
      throw new Error(message);
    }
  };
  return (
    <>
      <div className="component-heading">
        <span className="eyebrow">YOUR IDEAS, IN MOTION</span>
        <h1>
          {existing ? "Make it even more yours." : "Create something new."}
        </h1>
        <p>Your code. Your canvas. A new addition to your component library.</p>
      </div>
      <div className="workshop-top">
        <span>
          <WandSparkles size={15} /> Component workshop
        </span>
        <div>
          <input
            type="file"
            accept="application/json,.json"
            hidden
            ref={importRef}
            aria-label="Import components file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 2_000_000)
                  throw new Error("Choose a JSON file smaller than 2 MB.");
                const imported = validateImport(JSON.parse(await file.text()));
                await importAll(imported);
                notify(`${imported.length} components imported`);
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Import failed.");
              } finally {
                e.target.value = "";
              }
            }}
          />
          <button
            className="text-button"
            onClick={() => importRef.current?.click()}
          >
            <Upload size={13} /> Import JSON
          </button>
          <button className="text-button" onClick={() => exportJSON(custom)}>
            <ArrowDownToLine size={13} /> Export library ({custom.length})
          </button>
        </div>
      </div>
      <div className="workshop-form">
        <div className="form-row">
          <label>
            Component name
            <input
              aria-label="Component name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Category
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Description
          <input
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="form-row three">
          <label>
            React template
            <select
              aria-label="React template"
              disabled={started}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option>Animated card</option>
              <option>Interactive counter</option>
            </select>
          </label>
          <label>
            Language
            <select
              aria-label="Language"
              disabled={started}
              value={language}
              onChange={(e) => setLanguage(e.target.value as "tsx" | "jsx")}
            >
              <option value="tsx">React TSX</option>
              <option value="jsx">React JSX</option>
            </select>
          </label>
          <label>
            Styling
            <select
              aria-label="Styling"
              disabled={started}
              value={styling}
              onChange={(e) => setStyling(e.target.value as "css" | "tailwind")}
            >
              <option value="css">CSS</option>
              <option value="tailwind">Tailwind CSS</option>
            </select>
          </label>
        </div>
        <details className="property-config">
          <summary>
            <Settings2 size={14} /> Component properties{" "}
            <span>Define your Customize controls</span>
            <ChevronDown size={13} />
          </summary>
          <p>
            Define simple defaults and controls using the same keys. Controls
            support text, color, toggle, select, number, and range. Numeric
            controls need min, max, and step; selects need options.
          </p>
          <div className="form-row">
            <label>
              Default properties (JSON)
              <textarea
                aria-label="Default properties JSON"
                value={defaults}
                onChange={(e) => setDefaults(e.target.value)}
                spellCheck={false}
              />
            </label>
            <label>
              Controls schema (JSON)
              <textarea
                aria-label="Controls schema JSON"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                spellCheck={false}
              />
            </label>
          </div>
          <label className="dependency-field">
            Dependencies (JSON, optional)
            <textarea
              aria-label="Dependencies JSON"
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              spellCheck={false}
            />
          </label>
        </details>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {!started && (
          <button className="primary-button" onClick={start}>
            <Code2 size={15} /> Open workspace <ArrowRight size={14} />
          </button>
        )}
      </div>
      {started && (
        <Suspense
          fallback={
            <div className="loading-state">Opening your workspace…</div>
          }
        >
          <Editor
            files={files}
            name={name}
            dependencies={(() => {
              try {
                return validateDependencies(JSON.parse(dependencies));
              } catch {
                return {};
              }
            })()}
            tailwind={styling === "tailwind"}
            notify={notify}
            onSave={doSave}
          />
        </Suspense>
      )}
      <div className="local-storage-note">
        <span className="purple-dot" />
        <p>
          Saved in this browser with IndexedDB. Export your library to keep a
          backup or move it to another device.
        </p>
      </div>
      {existing && (
        <div className="component-management">
          <button
            className="text-button"
            onClick={() => exportJSON([existing])}
          >
            <ArrowDownToLine size={13} /> Export this component as JSON
          </button>
          {!deleting ? (
            <button className="danger-button" onClick={() => setDeleting(true)}>
              Delete component
            </button>
          ) : (
            <div className="delete-confirm">
              <span>Remove this local component?</span>
              <button
                onClick={async () => {
                  try {
                    await remove(existing.id);
                    notify(
                      "Component removed. Import your JSON backup to restore it.",
                    );
                    navigate("/browse");
                  } catch {
                    notify("Could not remove this component.");
                  }
                }}
              >
                Delete
              </button>
              <button onClick={() => setDeleting(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
