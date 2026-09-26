import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** The home page's larger header, with the orb. */
  hero?: boolean;
  /** The page as Markdown (src/lib/llms.ts), for the page actions. */
  markdownUrl: string;
  /** The page's source file on GitHub. */
  githubUrl: string;
}

// The page title and description, and the page actions: copy the page as
// Markdown, or open it in GitHub, as Markdown, or in an AI chat.
export function PageHeader({ title, description, hero, markdownUrl, githubUrl }: PageHeaderProps) {
  return (
    <header className={cn('not-prose', hero ? 'holler-hero' : 'mb-8')}>
      {hero && <span className="orb" aria-hidden="true" />}
      <h1 className="holler-title">{title}</h1>
      {description && <p className="holler-lede">{description}</p>}
      <div className="page-actions">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
    </header>
  );
}
