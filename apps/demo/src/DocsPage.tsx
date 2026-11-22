import { useEffect, useState } from "react";
import { DOC_PAGES } from "./docs.js";

function getPageFromHash(): string {
  const match = window.location.hash.match(/^#docs\/(.+)$/);
  return match ? match[1] : DOC_PAGES[0].id;
}

export default function DocsPage() {
  const [active, setActive] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setActive(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = DOC_PAGES.find((p) => p.id === active) ?? DOC_PAGES[0];

  return (
    <div className="docs">
      <nav className="docs-tabs" aria-label="Platforms">
        {DOC_PAGES.map((p) => (
          <a
            key={p.id}
            href={`#docs/${p.id}`}
            className={
              p.id === active ? "docs-tab docs-tab-active" : "docs-tab"
            }
          >
            {p.label}
          </a>
        ))}
      </nav>

      <article className="docs-content">
        {page.sections.map((section, i) => (
          <section key={i} className="docs-section">
            <h2>{section.heading}</h2>
            {section.body ? <p>{section.body}</p> : null}
            {section.code ? (
              <pre className="docs-code">
                <code>{section.code}</code>
              </pre>
            ) : null}
          </section>
        ))}
      </article>
    </div>
  );
}
