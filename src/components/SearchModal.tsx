import { useEffect, useRef, useState } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';

const SEARCH_FEEDS = [
  { key: 'hero',    label: 'Gündem' },
  { key: 'siyaset', label: 'Siyaset' },
  { key: 'dunya',   label: 'Dünya' },
  { key: 'savunma', label: 'Savunma' },
  { key: 'ekonomi', label: 'Ekonomi' },
];

const RSS_FEEDS: Record<string, string> = {
  hero:    'https://www.ensonhaber.com/rss/ensonhaber.xml',
  siyaset: 'https://www.ahaber.com.tr/rss/gundem.xml',
  dunya:   'https://feeds.bbci.co.uk/turkce/rss.xml',
  savunma: 'https://mavisavunma.com/feed/',
  ekonomi: 'https://www.bloomberght.com/rss',
};

async function fetchFeed(key: string) {
  const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS_FEEDS[key]);
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  if (json.status !== 'ok') return [];
  return (json.items || []).slice(0, 20).map((item: Record<string, unknown>) => ({
    title: (item.title as string) || '',
    link: (item.link as string) || '',
    description: ((item.description as string) || '').replace(/<[^>]*>/g, '').substring(0, 150),
    feed: key,
  }));
}

interface SearchResult {
  title: string;
  link: string;
  description: string;
  feed: string;
  label: string;
}

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal = ({ onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useQueries({
    queries: SEARCH_FEEDS.map(({ key }) => ({
      queryKey: ['rss', key],
      queryFn: () => fetchFeed(key),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const allItems: SearchResult[] = results.flatMap((r, i) =>
    (r.data ?? []).map((item) => ({ ...item, label: SEARCH_FEEDS[i].label }))
  );

  const filtered = query.trim().length < 2
    ? []
    : allItems.filter((item) => {
        const q = query.toLocaleLowerCase('tr');
        return (
          item.title.toLocaleLowerCase('tr').includes(q) ||
          item.description.toLocaleLowerCase('tr').includes(q)
        );
      }).slice(0, 20);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(regex, '<mark class="bg-primary/20 text-primary font-semibold">$1</mark>');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed top-0 left-0 right-0 z-50 bg-card shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Haberlerde ara..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse shrink-0">Yükleniyor...</span>
          )}
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {query.trim().length < 2 && (
            <p className="text-center text-muted-foreground text-sm py-12">
              Aramak istediğiniz kelimeyi yazın
            </p>
          )}
          {query.trim().length >= 2 && !isLoading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-12">
              "{query}" için sonuç bulunamadı
            </p>
          )}
          {filtered.length > 0 && (
            <ul className="divide-y divide-border max-w-screen-md mx-auto px-4 md:px-6">
              {filtered.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-start gap-3 py-4 hover:bg-surface-low transition-colors group -mx-4 md:-mx-6 px-4 md:px-6"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="category-tag mb-1 inline-block">{item.label}</span>
                      <h3
                        className="font-bold text-sm md:text-base leading-snug group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: highlight(item.title) }}
                      />
                      {item.description && (
                        <p
                          className="text-xs text-muted-foreground mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: highlight(item.description) }}
                        />
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
            {filtered.length} sonuç bulundu
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModal;
