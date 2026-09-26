import type { ComponentProps } from 'react';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Code blocks are static HTML here: Astro hydrates only the docs layout, not
// the page content inside it, so Fumadocs' React copy button never works.
// This one is plain markup; src/scripts/copy-code.ts handles the click and
// global.css animates it.
export function CodeBlockPre(props: ComponentProps<'pre'>) {
  return (
    <CodeBlock
      {...(props as ComponentProps<typeof CodeBlock>)}
      allowCopy={false}
      Actions={({ className }) => (
        <div className={cn('empty:hidden', className)}>
          <CopyButton />
        </div>
      )}
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
}

function CopyButton() {
  return (
    <button type="button" className="copy-code" data-copy-code="" data-state="idle" aria-label="Copy code">
      <Copy className="copy-code-icon" aria-hidden />
      <svg className="copy-code-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6 9 17l-5-5" pathLength={1} />
      </svg>
    </button>
  );
}
