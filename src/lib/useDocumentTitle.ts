import { useEffect } from 'react';

const BASE = 'Rogue Defense Encyclopedia';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
}
