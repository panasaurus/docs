import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Blocks, Egg, Feather, Gamepad2, Server, Terminal } from 'lucide-react';
import CopyCommand from './copy-command';
import styles from '@/app/docs/docs.module.css';

const guides = [
  { title: 'Bring a node online', description: 'Install Wings and connect your first game server node.', href: '/docs/wings/installation', icon: Feather },
  { title: 'Build beyond the basics', description: 'Extend your panel with Blueprint themes and extensions.', href: '/docs/blueprint', icon: Blocks },
  { title: 'Find your next game', description: 'Pick a community egg. Make room for something new.', href: 'https://eggs.panasaurus.com', icon: Egg, external: true },
];

export default function DocsOverview() {
  return (
    <div className={`${styles.overview} not-prose`}>
      <div className={styles.startGrid}>
        <section className={styles.installPanel} aria-labelledby="install-panel-heading">
          <div className={styles.installHeading}><h2 id="install-panel-heading">Start with a fresh install.</h2><Terminal aria-hidden="true" /></div>
          <p className={styles.installDescription}>One guided script. Your own infrastructure.</p>
          <CopyCommand />
          <Link href="/docs/panasaurus/installation" className={styles.installLink}>Read the installation guide<ArrowRight aria-hidden="true" /></Link>
        </section>
        <section className={styles.architecture} aria-labelledby="architecture-heading">
          <h2 id="architecture-heading">A small stack. A lot of possibility.</h2>
          <p>Here’s how it all connects.</p>
          <div className={styles.architectureNodes}>
            <Link href="/docs/panasaurus/configuration" className={styles.architectureNode}><Server aria-hidden="true" /><span>Panel<small>Your control plane</small></span></Link>
            <span className={styles.architectureLine} aria-hidden="true" />
            <Link href="/docs/wings" className={styles.architectureNode}><Feather aria-hidden="true" /><span>Wings<small>Your node daemon</small></span></Link>
            <span className={styles.architectureLine} aria-hidden="true" />
            <div className={styles.architectureGames}><Gamepad2 aria-hidden="true" /><span>Your game servers</span></div>
          </div>
        </section>
      </div>
      <div className={styles.guideHeading}><h2>Keep building.</h2><span>A few good places to go next.</span></div>
      <div className={styles.guideGrid}>
        {guides.map(({ title, description, href, icon: Icon, external }) => (
          <Link key={href} href={href} className={styles.guideCard} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <div className={styles.guideCardTop}><Icon aria-hidden="true" />{external ? <ArrowUpRight aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</div>
            <h3>{title}</h3><p>{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
