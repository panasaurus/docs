import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Card, Cards } from 'fumadocs-ui/components/card';
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { ArrowUpRight, MessageCircle, GitPullRequest } from 'lucide-react';
import DocsOverview from '@/components/docs/overview';
import styles from '../docs.module.css';

interface PageParams {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page({ params }: PageParams) {
  const { slug } = await params;
  const page = await source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;
  const isOverview = slug?.length === 1 && slug[0] === 'panasaurus';

  return (
    <DocsPage
      container={{ className: styles.page, style: { paddingTop: 'var(--fd-tocnav-height)' } }}
      article={{ className: styles.article }}
      breadcrumb={{ includeRoot: true, includePage: true }}
      toc={page.data.toc}
      tableOfContent={{
        enabled: true,
        style: 'clerk',
        footer: (
          <div className={styles.tocFooter}>
            <a href="https://discord.gg/tszvW9zKN7" target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Ask the community<ArrowUpRight aria-hidden="true" /></a>
            <a href="https://github.com/panasaurus/docs" target="_blank" rel="noopener noreferrer"><GitPullRequest aria-hidden="true" />Improve these docs<ArrowUpRight aria-hidden="true" /></a>
          </div>
        ),
      }}
      lastUpdate={page.data.lastModified ? new Date(page.data.lastModified) : undefined}
      editOnGithub={{
        owner: 'panasaurus',
        repo: 'docs',
        sha: 'main',
        path: `content/docs/${page.file.path}`,
      }}
      full={page.data.full}
    >
      <div className={styles.articleHeader}>
        <DocsTitle className={`${styles.title} ${isOverview ? styles.overviewTitle : ''}`}>{isOverview ? 'Your next server starts here.' : page.data.title}</DocsTitle>
        <DocsDescription className={styles.description}>{page.data.description}</DocsDescription>
      </div>
      <DocsBody className={styles.body}>
        <MDXContent
          components={{
            ...defaultMdxComponents,
            a: createRelativeLink(source, page),
            Tabs,
            Tab,
            Card,
            Cards,
            DocsOverview,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const page = await source.getPage(slug);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
