import type { Metadata } from 'next';
import Link from 'next/link';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ArrowRight, ExternalLink } from 'lucide-react';
import HomeLogo from './home-logo';
import Showcase from './showcase';
import styles from './home.module.css';

export const metadata: Metadata = {
	metadataBase: new URL('https://panasaurus.com'),
	title: "Panasaurus — Game Server Management Platform",
	description:
		"Panasaurus is an open-source game server management platform with a Docker-based panel, built-in Blueprint extension support, a Rust Wings daemon, and maintained runtime images.",
	openGraph: {
		title: "Panasaurus — Game Server Management Platform",
		description:
			"A Docker-based panel with Blueprint built in, a Rust Wings daemon, and container runtime images on GHCR.",
		images: [{ url: "/og.png" }],
	},
};


export default function Page() {
  return (
    <>
      <a className={styles.skipLink} href="#overview">Skip to content</a>
      <header className={`${styles.container} ${styles.header}`}>
        <Link className={styles.brand} href="/" aria-label="Panasaurus home" data-home-brand>
          <HomeLogo className={styles.brandMark} />
          <span>Panasaurus<span className={styles.brandPeriod}>.</span></span>
        </Link>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a href="#panel-preview">The panel</a>
          <a href="#features">Features</a>
          <Link href="/docs/panasaurus">Documentation</Link>
        </nav>
        <a className={styles.sourceLink} href="https://github.com/panasaurus/panel" target="_blank" rel="noopener noreferrer">
          <GitHubLogoIcon aria-hidden="true" /><span>Open source</span><ExternalLink className={styles.externalIcon} aria-hidden="true" />
        </a>
      </header>

      <main id="overview" tabIndex={-1}>
        <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.status}>
            <span className={styles.statusDot} />Self-hosted
            <span className={styles.statusDivider} />Free &amp; open source
          </div>
          <div className={styles.heroCopy}>
            <h1 id="hero-title">Game server<br />management.</h1>
            <div className={styles.heroSummary}>
              <p>
                Your servers. Your rules. An open-source panel with custom
                Minecraft hibernation, a built-in marketplace, and Blueprint
                extensions. Ready for your infrastructure.
              </p>
              <div className={styles.heroActions}>
                <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/docs/panasaurus/installation">
                  Get started<ArrowRight aria-hidden="true" />
                </Link>
                <a className={styles.textLink} href="#panel-preview">
                  Explore the panel<ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <Showcase />
      </main>

      <div className={styles.footerShell}>
			<footer className="w-full border-t border-black/5 bg-gray-50 py-10 dark:border-white/5 dark:bg-[#111]">
				<div className="container flex flex-col items-start justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 md:flex-row md:items-center">
					<span className="flex items-center gap-2">
						<HomeLogo className={styles.footerMark} />
						Panasaurus Game Server Platform
					</span>
					<span>
						Built on{" "}
						<a className="text-brand hover:underline" href="https://pterodactyl.io" target="_blank" rel="noopener noreferrer">Pterodactyl</a>,{" "}
						<a className="text-brand hover:underline" href="https://pyrodactyl.dev" target="_blank" rel="noopener noreferrer">Pyrodactyl</a>, and{" "}
						<a className="text-brand hover:underline" href="https://blueprint.zip" target="_blank" rel="noopener noreferrer">Blueprint</a>.
					</span>
				</div>
			</footer>
      </div>
    </>
  );
}
