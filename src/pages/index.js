import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const installCmd = `curl -fsSL https://panasaurus.com/install.sh | bash`;

const components = [
  {
    name: 'Panel',
    href: '/docs/panel/installation',
    tagline: 'The control plane.',
    points: [
      'Laravel 12 + React 19, OPcache JIT out of the box',
      'Blueprint extension framework pre-installed',
      'Marketplace, extension CLI, and /api/health built in',
      'One compose stack: panel, MariaDB, Redis',
    ],
  },
  {
    name: 'Wings',
    href: '/docs/wings/installation',
    tagline: 'The node daemon, in Rust.',
    points: [
      'Drop-in compatible with the Wings v1.13.3 API',
      'Native TLS with automatic ACME certificates',
      'SFTP with rate limits and a sandboxed shell',
      'Six backup drivers, per-server bandwidth limits',
    ],
  },
  {
    name: 'Images',
    href: '/docs/images',
    tagline: 'The yolks, maintained.',
    points: [
      'One namespace: ghcr.io/panasaurus/images',
      'Java 8-26, Node 12-24, Python 3.7-3.13, Go, Rust, .NET',
      'Multi-arch builds, rebuilt monthly',
      'Single linted CI pipeline for all 58 images',
    ],
  },
];

const ecosystem = [
  {
    title: 'Eggs marketplace',
    href: 'https://eggs.panasaurus.com',
    text: 'Curated, tested eggs for popular games — import one JSON file and deploy.',
    cta: 'Browse eggs',
  },
  {
    title: 'Discord',
    href: 'https://discord.gg/tszvW9zKN7',
    text: 'Install help, Wings networking questions, egg requests, and extension talk.',
    cta: 'Join the server',
  },
  {
    title: 'GitHub',
    href: 'https://github.com/panasaurus',
    text: 'Panel, Wings, images, and these docs — all open source under one org.',
    cta: 'panasaurus on GitHub',
  },
];

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.hero)}>
      <div className="container">
        <img
          className={styles.heroLogo}
          src="/img/panasaurus.svg"
          alt="Panasaurus logo"
        />
        <h1 className={clsx('hero__title', styles.heroTitle)}>Panasaurus</h1>
        <p className={clsx('hero__subtitle', styles.heroTagline)}>
          The dino-strong game server platform. Panel, Wings daemon, and images
          that install themselves — starting with one command.
        </p>
        <div className={styles.installBox}>
          <CodeBlock language="bash" showLineNumbers={false}>
            {installCmd}
          </CodeBlock>
        </div>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the docs
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/installer"
          >
            Installer reference
          </Link>
        </div>
        <p className={styles.heroHint}>
          Runs on Ubuntu 22.04+ and Debian 12. Installs the panel, Wings, or
          both — ask it anything with{' '}
          <code>bash install.sh --help</code>.
        </p>
      </div>
    </header>
  );
}

function ComponentGrid() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Three parts, one platform</h2>
        <p className={styles.sectionLead}>
          Each piece works on its own and drops into existing Pterodactyl
          setups — together they cover everything from the control plane to the
          container your servers run in.
        </p>
        <div className={styles.grid}>
          {components.map((c) => (
            <Link key={c.name} to={c.href} className={styles.card}>
              <h3 className={styles.cardName}>{c.name}</h3>
              <p className={styles.cardTagline}>{c.tagline}</p>
              <ul className={styles.cardList}>
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <span className={styles.cardCta}>{`Documentation ->`}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Around the platform</h2>
        <div className={styles.ecoRow}>
          {ecosystem.map((e) => (
            <a
              key={e.title}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ecoCard}
            >
              <h3 className={styles.ecoTitle}>{e.title}</h3>
              <p className={styles.ecoText}>{e.text}</p>
              <span className={styles.cardCta}>{e.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Panasaurus Docs"
      description="The dino-strong game server platform — Docker-native panel with Blueprint built in, a Rust Wings daemon, and container images on ghcr.io."
    >
      <Hero />
      <main>
        <ComponentGrid />
        <Ecosystem />
      </main>
    </Layout>
  );
}
