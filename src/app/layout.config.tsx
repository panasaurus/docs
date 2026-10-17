import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import PanasaurusLogo from '@/components/ui/PanasaurusLogo';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <PanasaurusLogo className="h-6 w-6" />
        <span className="font-extrabold tracking-tight">Panasaurus</span>
      </>
    ),
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs/panasaurus',
      active: 'nested-url',
    },
    {
      text: 'Eggs',
      url: 'https://eggs.panasaurus.com',
      external: true,
    },
    {
      text: 'Discord',
      url: 'https://discord.gg/tszvW9zKN7',
      external: true,
    },
  ],
  githubUrl: 'https://github.com/panasaurus',
};
