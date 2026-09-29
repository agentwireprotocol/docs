import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/docs/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { CSSProperties, ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import { BookText, ScrollText } from 'lucide-react';
import { SiGo, SiPython, SiTypescript } from '@icons-pack/react-simple-icons';
import SearchDialog from './search';
import { Logo } from './logo';
import { PageHeader, type PageHeaderProps } from './page-header';

// The sections are the root folders of content/docs, one tab each. The
// languages get their own marks in their own colours; the rest plain
// icons in the text colour. They live here rather than in the page tree,
// since React nodes cannot cross the Astro island boundary inside it.
const sections: Record<string, { icon: ReactNode; color?: string }> = {
  '/': { icon: <BookText /> },
  '/reference': { icon: <ScrollText /> },
  '/go': { icon: <SiGo />, color: 'var(--go-color)' },
  '/python': { icon: <SiPython />, color: 'var(--python-color)' },
  '/typescript': { icon: <SiTypescript />, color: 'var(--typescript-color)' },
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
              title: <span className="font-semibold tracking-[-0.01em]">{option.title}</span>,
              icon: (
                <div
                  className="size-full [&_svg]:size-full text-(--tab-color,currentColor)"
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
