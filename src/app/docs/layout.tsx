import type { ReactNode } from 'react';
import { NavProvider } from 'fumadocs-ui/contexts/layout';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { source } from '@/lib/source';
import DocsShell from '@/components/docs/shell';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <TreeContextProvider tree={source.pageTree}>
      <NavProvider>
        <DocsShell>{children}</DocsShell>
      </NavProvider>
    </TreeContextProvider>
  );
}
