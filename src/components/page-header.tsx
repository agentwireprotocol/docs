import { MarkdownCopyButton } from 'fumadocs-ui/layouts/docs/page';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** The home page's larger header, with the orb. */
  hero?: boolean;
  /** The page as Markdown (src/lib/llms.ts), for Copy Markdown. */
  markdownUrl: string;
}

// The page title and description, and a button that copies the page as
// Markdown.
export function PageHeader({ title, description, hero, markdownUrl }: PageHeaderProps) {
  return (
    <header className={cn('not-prose', hero ? 'holler-hero' : 'mb-8')}>
      {hero && <span className="orb" aria-hidden="true" />}
      <h1 className="holler-title">{title}</h1>
      {description && <p className="holler-lede">{description}</p>}
      <div className="page-actions">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
      </div>
    </header>
  );
}
