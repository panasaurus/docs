import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createElement } from 'react';
import { icons } from 'lucide-react';
import PanasaurusLogo from '@/components/ui/PanasaurusLogo';
import WingsLogo from '@/components/ui/WingsLogo';
import BlueprintLogo from '@/components/ui/BlueprintLogo';

// `loader()` also assign a URL to your pages
// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      return
    }
    switch (icon) {
      case 'panasaurus':
        return PanasaurusLogo();
      case 'blueprint':
        return BlueprintLogo();
      case 'wings':
        return WingsLogo();
    }

    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
