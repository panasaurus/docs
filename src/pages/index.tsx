import React, { useState } from "react";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

const INSTALL_CMD = "curl -fsSL https://panasaurus.com/install.sh | bash";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const el = document.createElement("textarea");
          el.value = text;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          el.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      aria-label="Copy install command"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

const cards = [
  {
    tag: "Panel",
    title: "Panasaurus Panel",
    text: "Laravel 12 + React 19 + Vite 7 under the hood, with the Blueprint extension framework pre-installed. Docker in, panel out — one command.",
    href: "/docs/panel",
    cta: "Install the panel",
  },
  {
    tag: "Daemon",
    title: "Panasaurus Daemon",
    text: "A Rust rewrite of Wings with the full v1.13.3 HTTP contract, native ACME TLS, real SFTP extensions and six backup drivers. Drop-in compatible.",
    href: "/docs/daemon",
    cta: "Install the daemon",
  },
  {
    tag: "Images",
    title: "Panasaurus Images",
    text: "58 multi-arch container images for Java, Node, Python, Go, .NET and more — one GHCR namespace, one CI workflow, rebuilt monthly.",
    href: "/docs/images",
    cta: "Browse images",
  },
];

function Hero() {
  return (
    <header className="hero-home">
      <div className="hero-grid-lines" />
      <div className="container">
        <div className="hero-eyebrow">v1.0 · Blueprint built in · Docker first</div>
        <h1 className="hero-title">
          Run game servers
          <br />
          <span className="grad">the dino-strong way.</span>
        </h1>
        <p className="hero-sub">
          Panasaurus is a game server management platform built on the proven
          Pterodactyl lineage — a modern panel, a Rust daemon and a maintained
          image catalog. One install command puts the whole stack on your
          machine.
        </p>

        <div className="hero-install">
          <code>
            <span className="prompt">$&nbsp;</span>
            {INSTALL_CMD}
          </code>
          <CopyButton text={INSTALL_CMD} />
        </div>
        <div style={{ fontSize: "0.85rem", color: "#7f93ad" }}>
          Works on Ubuntu 20.04+/Debian 11+ · installs the panel, the daemon, or
          both
        </div>

        <div className="hero-ctas">
          <Link className="btn-hero primary" to="/docs/quick-start">
            Get started
          </Link>
          <a
            className="btn-hero discord"
            href="https://discord.gg/tszvW9zKN7"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Discord
          </a>
          <a
            className="btn-hero ghost"
            href="https://eggs.panasaurus.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Egg marketplace
          </a>
        </div>

        <div className="hero-meta">
          <span>
            <strong>38</strong> API routes, wire-compatible
          </span>
          <span>
            <strong>58</strong> container images
          </span>
          <span>
            <strong>6</strong> backup drivers
          </span>
          <span>
            <strong>100%</strong> Blueprint compatible
          </span>
        </div>
      </div>
    </header>
  );
}

function Ecosystem() {
  return (
    <section className="pa-cards">
      <div className="container">
        <div className="pa-cards-grid">
          {cards.map((c) => (
            <Link key={c.tag} className="pa-card" to={c.href}>
              <span className="pa-card-tag">{c.tag}</span>
              <div>
                <span className="pa-card-icon" aria-hidden>
                  {c.icon}
                </span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <p style={{ marginTop: "0.9rem", color: "var(--pa-green)", fontWeight: 650, fontSize: "0.88rem" }}>
                {c.cta} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="pa-band">
      <div className="container">
        <h2>Get eggs. Get help. Get building.</h2>
        <p>
          Ready-to-run eggs for every image live at{" "}
          <a href="https://eggs.panasaurus.com" target="_blank" rel="noopener noreferrer">
            eggs.panasaurus.com
          </a>
          . For everything else — support, extension dev, image requests — the
          Discord is where it happens.
        </p>
        <div className="pa-band-actions">
          <a
            className="btn-hero primary"
            href="https://discord.gg/tszvW9zKN7"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord server
          </a>
          <a
            className="btn-hero ghost"
            href="https://eggs.panasaurus.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse eggs
          </a>
          <Link className="btn-hero ghost" to="/docs">
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Panasaurus"
      description={siteConfig.tagline}
    >
      <Head>
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <Hero />
        <Ecosystem />
        <Community />
      </main>
    </Layout>
  );
}
