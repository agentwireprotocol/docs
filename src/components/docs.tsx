import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/docs/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { CSSProperties, ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import { BookOpen, Braces, Library, SquareTerminal } from 'lucide-react';
import SearchDialog from './search';
import { Logo } from './logo';
import { PageHeader, type PageHeaderProps } from './page-header';

// The sections are the root folders of content/docs, one tab each. Their
// icons and colours live here rather than in the page tree, since React
// nodes cannot cross the Astro island boundary inside the tree prop.
const sections: Record<string, { icon: ReactNode; color: string }> = {
  '/': { icon: <BookOpen />, color: 'var(--docs-color)' },
  '/reference': { icon: <Library />, color: 'var(--reference-color)' },
  '/go': { icon: <Braces />, color: 'var(--go-color)' },
  '/python': { icon: <SquareTerminal />, color: 'var(--python-color)' },
};

export const repoUrl = 'https://github.com/agentwireprotocol/awp';

export function Docs({
  tree,
  children,
  pathname,
  params,
  page,
  header,
}: {
  tree: Root;
  children: ReactNode;
  pathname: string;
  params: AstroProviderProps['params'];
  page?: DocsPageProps;
  header: PageHeaderProps;
}) {
  return (
    <RootProvider pathname={pathname} params={params} navigate={navigate} search={{ SearchDialog }}>
      <DocsLayout
        tree={tree}
        nav={{ title: <Logo />, url: '/' }}
        tabs={{
          transform(option) {
            const section = sections[option.url];
            if (!section) return option;
            return {
              ...option,
              icon: (
                <div
                  className="size-full rounded-lg text-(--tab-color) [&_svg]:size-full max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5"
                  style={{ '--tab-color': section.color } as CSSProperties}
                >
                  {section.icon}
                </div>
              ),
            };
          },
        }}
        githubUrl={repoUrl}
        links={[
          { text: 'Changelog', url: `${repoUrl}/blob/main/CHANGELOG.md`, external: true },
          { text: 'Spec', url: `${repoUrl}/blob/main/SPEC.md`, external: true },
        ]}
      >
        <DocsPage {...page}>
          <PageHeader {...header} />
          {children}
        </DocsPage>
      </DocsLayout>
    </RootProvider>
  );
}
