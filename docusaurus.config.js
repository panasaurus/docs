// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.nightOwl;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Panasaurus',
  tagline: 'The dino-strong game server platform — panel, Wings daemon, and images',
  favicon: 'img/favicon.ico',

  url: process.env.URL || 'https://panasaurus.com',
  baseUrl: process.env.BASE_URL || '/',

  organizationName: 'panasaurus',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'manifest', href: '/site.webmanifest' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#0b1210' },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'Documentation for Panasaurus — the dino-strong game server platform. Docker-native panel with Blueprint built in, a Rust Wings daemon, and container images on ghcr.io.',
      },
    },
    {
      tagName: 'meta',
      attributes: { property: 'og:description', content: 'Documentation for Panasaurus — the dino-strong game server platform.' },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/panasaurus/docs/edit/main/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/og.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'eggs',
        content:
          'Grab ready-to-run eggs at <a target="_blank" rel="noopener noreferrer" href="https://eggs.panasaurus.com">eggs.panasaurus.com</a> &nbsp;&middot;&nbsp; Need a hand? Join the <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/tszvW9zKN7">Discord</a>',
        backgroundColor: '#0f2a1f',
        textColor: '#9fe8c6',
        isCloseable: true,
      },
      navbar: {
        title: 'Panasaurus',
        logo: {
          alt: 'Panasaurus logo',
          src: 'img/panasaurus.svg',
        },
        hideOnScroll: false,
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'main',
            position: 'left',
            label: 'Docs',
          },
          { to: 'docs/installer', label: 'Installer', position: 'left' },
          { to: 'docs/eggs', label: 'Images & Eggs', position: 'left' },
          {
            href: 'https://eggs.panasaurus.com',
            label: 'Eggs Marketplace',
            position: 'right',
          },
          {
            href: 'https://discord.gg/tszvW9zKN7',
            className: 'navbar-discord',
            'aria-label': 'Discord community',
            position: 'right',
          },
          {
            href: 'https://github.com/panasaurus',
            className: 'navbar-github',
            'aria-label': 'GitHub organization',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Introduction', to: '/docs/intro' },
              { label: 'Automated installer', to: '/docs/installer' },
              { label: 'Panel installation', to: '/docs/panel/installation' },
              { label: 'Wings installation', to: '/docs/wings/installation' },
            ],
          },
          {
            title: 'Platform',
            items: [
              { label: 'Panasaurus Images', to: '/docs/images' },
              { label: 'Eggs marketplace', href: 'https://eggs.panasaurus.com' },
              { label: 'Migrating to Panasaurus', to: '/docs/migration' },
              { label: 'install.sh', href: 'https://panasaurus.com/install.sh' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Discord', href: 'https://discord.gg/tszvW9zKN7' },
              { label: 'GitHub organization', href: 'https://github.com/panasaurus' },
              { label: 'Panel source', href: 'https://github.com/panasaurus/panel' },
              { label: 'Wings source', href: 'https://github.com/panasaurus/wings' },
            ],
          },
        ],
        copyright: `Copyright &copy; ${new Date().getFullYear()} Panasaurus. Built on the shoulders of Pterodactyl, Pyrodactyl, Blueprint, and Calagopus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rust', 'php', 'docker', 'ini'],
      },
      mermaid: {},
    }),
};

module.exports = config;
