'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PageTree } from 'fumadocs-core/server';
import { useSidebar } from 'fumadocs-ui/contexts/sidebar';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { Sidebar, SidebarHeader, SidebarFooter, SidebarViewport, SidebarPageTree, SidebarItem } from 'fumadocs-ui/components/layout/sidebar';
import { RootToggle } from 'fumadocs-ui/components/layout/root-toggle';
import { LargeSearchToggle, SearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import { ThemeToggle } from 'fumadocs-ui/components/layout/theme-toggle';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ArrowRightLeft, ArrowUpRight, Blocks, BookOpenText, Boxes, Code2, Download, Egg, Feather, FileText, FolderKey, Menu, MessageCircle, Server, Settings2, ShieldCheck, Terminal, X } from 'lucide-react';
import PanasaurusLogo from '@/components/ui/PanasaurusLogo';
import styles from '@/app/docs/docs.module.css';

const products = [
  { title: 'Panel', url: '/docs/panasaurus', description: 'Your game server control plane', icon: Server },
  { title: 'Wings', url: '/docs/wings', description: 'The Rust-powered node daemon', icon: Feather },
  { title: 'Blueprint', url: '/docs/blueprint', description: 'Build extensions for your panel', icon: Blocks },
];
const options = products.map(({ icon: Icon, ...product }) => ({ ...product, icon: <Icon aria-hidden="true" /> }));
const pageIcons = {
  panasaurus: BookOpenText, wings: BookOpenText, blueprint: BookOpenText,
  automated: Terminal, installation: Download, configuration: Settings2,
  extensions: Blocks, eggs: Egg, images: Boxes, migration: ArrowRightLeft,
  community: MessageCircle, tls: ShieldCheck, sftp: FolderKey, writing: Code2,
};

function NavigationItem({ item }: { item: PageTree.Item }) {
  const key = item.url.split('/').filter(Boolean).at(-1) ?? '';
  const Icon = pageIcons[key as keyof typeof pageIcons] ?? FileText;
  return <SidebarItem href={item.url} external={item.external} icon={<Icon aria-hidden="true" />}>{item.name}</SidebarItem>;
}
const treeComponents = { Item: NavigationItem };

export default function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { root } = useTreeContext();
  const header = useRef<HTMLElement>(null);
  const main = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const current = products.find((product) => pathname.startsWith(product.url)) ?? products[0];
  const hasOverview = root.children.some((item) => item.type === 'page' && item.url === current.url);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const media = window.matchMedia('(max-width: 767px)');
    if (!media.matches) { setOpen(false); return; }
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if (main.current) main.current.inert = true;
    if (header.current) header.current.inert = true;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key !== 'Tab') return;
      const items = document.querySelector('#nd-sidebar-mobile')?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (!media.matches) setOpen(false); };
    frame = requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('#nd-sidebar-mobile [data-close-navigation]')?.focus());
    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', onResize);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = previousOverflow;
      if (main.current) main.current.inert = false;
      if (header.current) header.current.inert = false;
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', onResize);
      menu.current?.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#docs-content">Skip to content</a>
      <nav className={styles.productRail} aria-label="Product documentation">
        <Link href="/" className={styles.railBrand} aria-label="Panasaurus home"><PanasaurusLogo className={styles.railLogo} /></Link>
        <div className={styles.railProducts}>
          {products.map(({ title, url, icon: Icon }) => (
            <Link key={url} href={url} className={styles.railItem} data-active={pathname.startsWith(url)} aria-label={`${title} documentation`} aria-current={pathname.startsWith(url) ? 'page' : undefined}>
              <Icon aria-hidden="true" /><span className={styles.railTooltip}>{title}</span>
            </Link>
          ))}
          <span className={styles.railDivider} />
          <a href="https://eggs.panasaurus.com" target="_blank" rel="noopener noreferrer" className={styles.railItem} aria-label="Eggs marketplace"><Egg aria-hidden="true" /><span className={styles.railTooltip}>Game eggs</span></a>
        </div>
        <a href="https://github.com/panasaurus" target="_blank" rel="noopener noreferrer" className={`${styles.railItem} ${styles.railBottom}`} aria-label="Panasaurus on GitHub"><GitHubLogoIcon aria-hidden="true" /><span className={styles.railTooltip}>GitHub</span></a>
      </nav>

      <Sidebar className={styles.sidebar} collapsible={false} aria-label={`${current.title} navigation`}>
        <SidebarHeader className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>
            <Link href="/" className={styles.brandName}>Panasaurus<span>.</span></Link><span className={styles.docsBadge}>Docs</span>
            <button type="button" className={styles.closeNavigation} data-close-navigation aria-label="Close documentation navigation" onClick={() => setOpen(false)}><X aria-hidden="true" /></button>
          </div>
          <div className={styles.sidebarTools}>
            <LargeSearchToggle className={styles.sidebarSearch} aria-label="Search documentation" />
            <RootToggle options={options} className={styles.projectSwitcher} aria-label="Choose documentation product" />
          </div>
        </SidebarHeader>
        <SidebarViewport className={styles.sidebarViewport}>
          <p className={styles.sidebarLabel}>{current.title} documentation</p>
          {!hasOverview && <SidebarItem href={current.url} icon={<BookOpenText aria-hidden="true" />}>Overview</SidebarItem>}
          <SidebarPageTree components={treeComponents} />
          <p className={styles.sidebarLabel}>Resources</p>
          <SidebarItem href="https://github.com/panasaurus/docs" external icon={<Code2 aria-hidden="true" />}>Contribute to the docs</SidebarItem>
          <SidebarItem href="https://eggs.panasaurus.com" external icon={<Egg aria-hidden="true" />}>Eggs marketplace</SidebarItem>
        </SidebarViewport>
        <SidebarFooter className={styles.sidebarFooter}>
          <a href="https://discord.gg/tszvW9zKN7" target="_blank" rel="noopener noreferrer" className={styles.communityLink}>
            <span className={styles.communityIcon}><MessageCircle aria-hidden="true" /></span>
            <span>Better with a community.<small>Get a hand. Share what you build.</small></span><ArrowUpRight aria-hidden="true" />
          </a>
        </SidebarFooter>
      </Sidebar>

      <header ref={header} className={styles.workspaceHeader}>
        <div className={styles.workspaceBreadcrumb}>
          <button ref={menu} type="button" className={styles.mobileMenu} aria-label="Open documentation navigation" aria-expanded={open} aria-controls="nd-sidebar-mobile" onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
          <Link href="/" className={styles.mobileBrand} aria-label="Panasaurus home"><PanasaurusLogo className={styles.brandLogo} /></Link>
          <BookOpenText className={styles.breadcrumbIcon} aria-hidden="true" />
          <span>Documentation</span><span className={styles.breadcrumbSlash}>/</span><span className={styles.breadcrumbCurrent}>{current.title}</span>
        </div>
        <div className={styles.headerActions}>
          <SearchToggle className={styles.mobileSearch} />
          <a href="https://github.com/panasaurus" target="_blank" rel="noopener noreferrer" className={styles.githubLink}><GitHubLogoIcon aria-hidden="true" /><span>GitHub</span><ArrowUpRight aria-hidden="true" /></a>
          <span className={styles.actionDivider} />
          <ThemeToggle className={styles.themeToggle} aria-label="Toggle color theme" />
        </div>
        <div className={styles.readingProgress} aria-hidden="true"><div ref={progress} /></div>
      </header>
      <main ref={main} id="docs-content" className={styles.workspaceMain} tabIndex={-1}>{children}</main>
    </div>
  );
}
