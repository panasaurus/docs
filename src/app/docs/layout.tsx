import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions}
      tree={source.pageTree}
      links={[
        {
          text: 'GitHub',
          url: 'https://github.com/panasaurus/docs',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
