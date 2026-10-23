import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import PanasaurusLogo from '@/components/ui/PanasaurusLogo';
import styles from './docs/docs.module.css';

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
        <PanasaurusLogo className={styles.brandLogo} />
        <span className={styles.brandName}>Panasaurus<span>.</span></span>
        <span className={styles.docsBadge}>Docs</span>
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
