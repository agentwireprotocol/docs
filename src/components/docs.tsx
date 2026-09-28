import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/layouts/docs/page';
import type { Root } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from 'fumadocs-ui/provider/astro';
import type { AstroProviderProps } from 'fumadocs-core/framework/astro';
import SearchDialog from './search';
import { Logo } from './logo';
import { PageHeader, type PageHeaderProps } from './page-header';

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
