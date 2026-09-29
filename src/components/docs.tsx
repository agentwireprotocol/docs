import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/docs/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import { Braces, Compass } from 'lucide-react';
import { SiPython, SiTypescript } from '@icons-pack/react-simple-icons';
import SearchDialog from './search';
import { Gopher } from './gopher';
import { Logo } from './logo';
import { PageHeader, type PageHeaderProps } from './page-header';

// The sections are the root folders of content/docs, one tab each: the
// gopher and the Simple Icons marks for the languages, plain icons for the
// rest, all in the text colour. They live here rather than in the page
// tree, since React nodes cannot cross the Astro island boundary inside it.
const sections: Record<string, ReactNode> = {
  '/': <Compass />,
  '/reference': <Braces />,
  '/go': <Gopher />,
  '/python': <SiPython />,
  '/typescript': <SiTypescript />,
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
            const icon = sections[option.url];
            if (!icon) return option;
            return {
              ...option,
              title: <span className="font-semibold text-fd-foreground">{option.title}</span>,
              icon: <div className="flex size-full items-center justify-center [&_svg]:size-5 md:[&_svg]:size-4">{icon}</div>,
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
