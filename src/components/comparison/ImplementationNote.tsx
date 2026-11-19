import { getImplementationNote } from "@/lib/data/implementation-notes";

/**
 * "Rolling this out at a company" note. Renders only on the few compare slugs
 * listed in implementation-notes.ts, otherwise nothing.
 */
export function ImplementationNote({ slug }: { slug: string }) {
  const note = getImplementationNote(slug);
  if (!note) return null;

  return (
    <aside
      aria-labelledby="implementation-note-heading"
      data-testid="implementation-note"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div className="bg-white border border-border rounded-2xl shadow-sm px-5 sm:px-7 py-5">
        <h2 id="implementation-note-heading" className="text-lg font-display font-bold text-text">
          Rolling this out at a company
        </h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-text-secondary">{note.body}</p>
        <p className="mt-3 text-sm sm:text-base">
          <a
            href={note.href}
            target="_blank"
            rel="noopener"
            className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {note.linkText}
          </a>
          <span className="text-text-secondary">
            {" "}
            (Goldenroz, the studio that builds A Versus B)
          </span>
        </p>
      </div>
    </aside>
  );
}
