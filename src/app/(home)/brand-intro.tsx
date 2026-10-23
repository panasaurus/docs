'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import HomeLogo from './home-logo';
import styles from './home.module.css';

type Phase = 'pending' | 'revealing' | 'done';

export default function BrandIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('pending');
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const finishIntro = useRef<() => void>(() => {});

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const page = content.current;
    const intro = overlay.current;
    const brand = wordmark.current;

    if (document.documentElement.dataset.panasaurusIntro !== 'pending' ||
        motion.matches || !page || !intro || !brand || !brand.animate) {
      document.documentElement.removeAttribute('data-panasaurus-intro');
      setPhase('done');
      return;
    }

    let active = true;
    let target: HTMLAnchorElement | null = null;
    let move: Animation | null = null;
    let observer: MutationObserver | null = null;
    let cancelWait: (() => void) | null = null;
    const animations: Animation[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousRestoration = history.scrollRestoration;
    const startedAt = performance.now();
    root.style.overflow = 'hidden';
    history.scrollRestoration = 'manual';
    page.inert = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    const blockScroll = (event: Event) => {
      if (active && event.cancelable) event.preventDefault();
    };
    const keepAtTop = () => {
      if (active && (window.scrollX !== 0 || window.scrollY !== 0)) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });
    window.addEventListener('scroll', keepAtTop, { passive: true });

    const restore = () => {
      page.inert = false;
      root.style.overflow = previousOverflow;
      history.scrollRestoration = previousRestoration;
    };
    const stop = () => {
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('scroll', keepAtTop);
      observer?.disconnect();
      cancelWait?.();
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.cancel());
    };
    const finish = () => {
      if (!active) return;
      active = false;
      const hadFocus = intro.contains(document.activeElement);
      stop();
      restore();
      root.removeAttribute('data-panasaurus-intro');
      setPhase('done');
      if (hadFocus) target?.focus({ preventScroll: true });
      if (window.location.hash) {
        let anchor: string;
        try { anchor = decodeURIComponent(window.location.hash.slice(1)); }
        catch { return; }
        requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
      }
    };
    finishIntro.current = finish;

    const frames = (): Keyframe[] => {
      const bounds = target!.getBoundingClientRect();
      const scale = getComputedStyle(brand).getPropertyValue('--intro-scale').trim() || '2.1';
      return [
        { transform: `translate(-50%, -50%) scale(${scale})` },
        { transform: `translate(${bounds.left - innerWidth / 2}px, ${bounds.top - innerHeight / 2}px) scale(1)` },
      ];
    };
    const onResize = () => {
      // Browser chrome and font loading can resize the viewport during startup.
      // Retarget the landing position instead of dismissing the intro.
      if (active && target && move?.effect instanceof KeyframeEffect) {
        move.effect.setKeyframes(frames());
      }
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!active) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        finish();
      } else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) &&
          !(event.key === ' ' && event.target instanceof Element && event.target.closest('button, a'))) {
        event.preventDefault();
      }
    };
    const onMotionChange = () => { if (motion.matches) finish(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    motion.addEventListener('change', onMotionChange);
    timers.push(setTimeout(finish, 10000));

    const delay = (duration: number) => new Promise<void>((resolve) => {
      timers.push(setTimeout(resolve, duration));
    });
    async function play() {
      // Next can hydrate this layout before its streamed page has arrived.
      // Keep the same splash on screen until the real navbar exists.
      target = await new Promise<HTMLAnchorElement | null>((resolve) => {
        const find = () => {
          const node = page!.querySelector<HTMLAnchorElement>('[data-home-brand]');
          if (node) { observer?.disconnect(); resolve(node); }
        };
        cancelWait = () => resolve(null);
        observer = new MutationObserver(find);
        observer.observe(page!, { childList: true, subtree: true });
        find();
      });
      if (!active || !target) return;
      await Promise.race([
        Promise.all([
          document.fonts.ready,
          brand!.querySelector('img')!.decode().catch(() => {}),
        ]),
        delay(1500),
      ]);
      await delay(Math.max(0, 1600 - (performance.now() - startedAt)));
      if (!active) return;

      setPhase('revealing');
      move = brand!.animate(frames(), {
        duration: 1100,
        easing: 'cubic-bezier(.76,0,.24,1)',
        fill: 'forwards',
      });
      animations.push(move);
      animations.push(intro!.querySelector('[data-intro-backdrop]')!.animate([
        { opacity: 1 }, { opacity: 0 },
      ], { duration: 850, easing: 'ease', fill: 'forwards' }));
      animations.push(intro!.querySelector('button')!.animate([
        { opacity: 1 }, { opacity: 0 },
      ], { duration: 180, fill: 'forwards' }));
      await move.finished;
      if (active) finish();
    }
    void play().catch(() => { if (active) finish(); });

    return () => {
      active = false;
      stop();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      motion.removeEventListener('change', onMotionChange);
      finishIntro.current = () => {};
      restore();
    };
  }, []);

  return (
    <div className={[
      phase !== 'done' ? styles.introPending : '',
      phase === 'revealing' ? styles.introRevealing : '',
    ].join(' ')}>
      {phase !== 'done' && (
        <div ref={overlay} id="panasaurus-brand-intro" className={styles.introOverlay} role="dialog" aria-modal="true" aria-label="Panasaurus introduction">
          <div className={styles.introBackdrop} data-intro-backdrop aria-hidden="true">
            <div className={styles.introAura} />
          </div>
          <div ref={wordmark} className={`${styles.brand} ${styles.introWordmark}`} aria-hidden="true">
            <HomeLogo className={styles.brandMark} />
            <span className={styles.introName} data-intro-name>Panasaurus<span className={styles.brandPeriod}>.</span></span>
          </div>
          <button type="button" className={styles.introSkip} onClick={() => finishIntro.current()}>
            Skip intro<span>Esc</span>
          </button>
        </div>
      )}
      <div ref={content} id="panasaurus-home-content" className={styles.pageContent}>{children}</div>
    </div>
  );
}
