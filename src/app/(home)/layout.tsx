import type { ReactNode } from 'react';
import { jakarta } from '@/lib/fonts';
import BrandIntro from './brand-intro';
import styles from './home.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`dark ${jakarta.className} ${styles.home}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
            if(window.__panasaurusIntroInitialized)return;
            window.__panasaurusIntroInitialized=true;
            var root=document.documentElement;
            if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
            root.setAttribute('data-panasaurus-intro','pending');
            setTimeout(function(){root.removeAttribute('data-panasaurus-intro');},10000);
          })();`,
        }}
      />
      <BrandIntro>{children}</BrandIntro>
    </div>
  );
}
