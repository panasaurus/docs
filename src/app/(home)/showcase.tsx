'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Moon,
  Server,
  Store,
  Terminal,
  X,
} from 'lucide-react';
import styles from './home.module.css';

const screenshots = [
  {
    tab: 'Console',
    title: 'Server console & hibernation',
    src: '/home/screenshots/hibernation.png',
    alt: 'Panasaurus server console showing Minecraft resource usage and the sleeping hibernation state',
    width: 1440,
    height: 1000,
    icon: Terminal,
  },
  {
    tab: 'Marketplace',
    title: 'The built-in extension marketplace',
    src: '/home/screenshots/marketplace.png',
    alt: 'Panasaurus marketplace with Blueprint extensions, search, category filters, and installed status',
    width: 1920,
    height: 1080,
    icon: Store,
  },
  {
    tab: 'Servers',
    title: 'Your server library',
    src: '/home/screenshots/servers.png',
    alt: 'Panasaurus server library showing game servers and their resource usage',
    width: 1440,
    height: 1000,
    icon: Server,
  },
];

const wrap = (index: number) => (index + screenshots.length) % screenshots.length;

export default function Showcase() {
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = screenshots[selected];
  const enlarged = screenshots[lightboxIndex];

  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  function openScreenshot(index: number) {
    setLightboxIndex(index);
    dialog.current?.showModal();
    setOpen(true);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = wrap(index + 1); break;
      case 'ArrowLeft': next = wrap(index - 1); break;
      case 'Home': next = 0; break;
      case 'End': next = screenshots.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  function showMarketplace() {
    setSelected(1);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('panel-preview')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    tabs.current[1]?.focus({ preventScroll: true });
  }

  return (
    <>
      <section
        id="panel-preview"
        className={`${styles.container} ${styles.product}`}
        aria-labelledby="panel-title"
      >
        <h2 id="panel-title" className="sr-only">Meet the Panasaurus panel</h2>
        <div className={styles.panelToolbar}>
          <div className={styles.panelTabs} role="tablist" aria-label="Panel screenshots">
            {screenshots.map(({ tab, icon: Icon }, index) => (
              <button
                key={tab}
                ref={(element) => { tabs.current[index] = element; }}
                type="button"
                role="tab"
                id={`panel-tab-${index}`}
                aria-controls="panel-view"
                aria-selected={selected === index}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                <Icon aria-hidden="true" />{tab}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`${styles.textLink} ${styles.expandButton}`}
            onClick={() => openScreenshot(selected)}
            aria-label={`View ${active.title.toLowerCase()} at full size`}
          >
            <span>View full size</span><ExternalLink aria-hidden="true" />
          </button>
        </div>
        <div
          className={styles.panelView}
          id="panel-view"
          role="tabpanel"
          aria-labelledby={`panel-tab-${selected}`}
        >
          <button
            type="button"
            className={styles.screenshotButton}
            onClick={() => openScreenshot(selected)}
            aria-label={`Enlarge ${active.title.toLowerCase()}`}
          >
            <Image
              className={styles.screenshot}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              priority
            />
          </button>
        </div>
        <div className={styles.panelCaption}>
          <span aria-live="polite"><span className={styles.statusDot} />{active.title}</span>
          <span>Actual product interface</span>
        </div>
      </section>

      <section id="features" className={styles.features} aria-labelledby="features-title">
        <div className={styles.sectionHeading}>
          <h2 id="features-title">More built in.</h2>
          <p>The familiar tools, with a few things we wanted ourselves.</p>
        </div>
        <div className={styles.mainFeatures}>
          <article className={styles.feature}>
            <Moon aria-hidden="true" />
            <h3>Let idle servers sleep.</h3>
            <p>
              Empty Minecraft servers save their world and hibernate after a
              configurable idle period. A player connection wakes them back up.
              Every state, right there in your console.
            </p>
            <button type="button" className={styles.textLink} onClick={() => openScreenshot(0)}>
              See hibernation in action<ExternalLink aria-hidden="true" />
            </button>
          </article>
          <article className={styles.feature}>
            <Store aria-hidden="true" />
            <h3>Make the panel yours.</h3>
            <p>
              Discover Blueprint extensions and themes without leaving your admin
              panel. Browse the marketplace, filter by category, and keep track of
              what you have installed.
            </p>
            <button type="button" className={styles.textLink} onClick={showMarketplace}>
              Explore the marketplace<ArrowRight aria-hidden="true" />
            </button>
          </article>
        </div>
        <div className={styles.essentials}>
          <div>
            <h3><Link href="/docs/blueprint">Blueprint included<ArrowRight aria-hidden="true" /></Link></h3>
            <p>Your extensions, your themes. Manage them from the admin area or CLI.</p>
          </div>
          <div>
            <h3>All the everyday controls</h3>
            <p>Console, files, backups, schedules, and granular permissions for your team.</p>
          </div>
          <div>
            <h3><Link href="/docs/wings">Powered by Rust Wings<ArrowRight aria-hidden="true" /></Link></h3>
            <p>A native node daemon with SFTP, TLS, and Docker at its core.</p>
          </div>
        </div>
      </section>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-labelledby="lightbox-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialog.current?.close();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            const direction = event.key === 'ArrowLeft' ? -1 : 1;
            setLightboxIndex((index) => wrap(index + direction));
          }
        }}
      >
        <div className={styles.lightboxToolbar}>
          <div><span className={styles.statusDot} /><h2 id="lightbox-title">{enlarged.title}</h2></div>
          <button type="button" className={styles.lightboxControl} onClick={() => dialog.current?.close()} aria-label="Close screenshot" autoFocus>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={styles.lightboxImage}>
          <Image src={enlarged.src} alt={enlarged.alt} width={enlarged.width} height={enlarged.height} />
        </div>
        <div className={styles.lightboxFooter}>
          <span>Actual Panasaurus panel</span>
          <div>
            <button type="button" className={styles.lightboxControl} aria-label="Previous screenshot" onClick={() => setLightboxIndex((index) => wrap(index - 1))}>
              <ArrowLeft aria-hidden="true" />
            </button>
            <span aria-live="polite">{lightboxIndex + 1} / {screenshots.length}</span>
            <button type="button" className={styles.lightboxControl} aria-label="Next screenshot" onClick={() => setLightboxIndex((index) => wrap(index + 1))}>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <span className={styles.lightboxHint}>Arrow keys to browse · Esc to close</span>
        </div>
      </dialog>
    </>
  );
}
