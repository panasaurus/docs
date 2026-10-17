import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Panasaurus",
  tagline: "The dino-strong game server platform.",
  favicon: "/favicon.ico",

  url: "https://panasaurus.com",
  baseUrl: "/",
  trailingSlash: false,

  organizationName: "panasaurus",
  projectName: "docs",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  onDuplicateRoutes: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/panasaurus/docs/edit/main/",
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/logo.svg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Panasaurus",
      logo: {
        alt: "Panasaurus logo",
        src: "img/logo.svg",
      },
      hideOnScroll: true,
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          to: "/docs/panel",
          label: "Panel",
          position: "left",
        },
        {
          to: "/docs/daemon",
          label: "Daemon",
          position: "left",
        },
        {
          to: "/docs/images",
          label: "Images",
          position: "left",
        },
        {
          href: "https://eggs.panasaurus.com",
          label: "Eggs",
          position: "right",
        },
        {
          href: "https://github.com/panasaurus",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://discord.gg/tszvW9zKN7",
          className: "navbar-discord",
          "aria-label": "Discord",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Getting started",
              to: "/docs/quick-start",
            },
            {
              label: "Panel",
              to: "/docs/panel",
            },
            {
              label: "Daemon",
              to: "/docs/daemon",
            },
            {
              label: "Images",
              to: "/docs/images",
            },
          ],
        },
        {
          title: "Ecosystem",
          items: [
            {
              label: "Panel on GitHub",
              href: "https://github.com/panasaurus/panel",
            },
            {
              label: "Daemon on GitHub",
              href: "https://github.com/panasaurus/daemon",
            },
            {
              label: "Images on GitHub",
              href: "https://github.com/panasaurus/images",
            },
            {
              label: "Egg marketplace",
              href: "https://eggs.panasaurus.com",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/tszvW9zKN7",
            },
            {
              label: "Report an issue",
              href: "https://github.com/panasaurus/panel/issues",
            },
            {
              label: "Blueprint extensions",
              href: "https://blueprint.zip",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Panasaurus. Built on the shoulders of Pterodactyl, Pyrodactyl, Blueprint and Calagopus giants.`,
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["docker", "ini", "systemd", "bash"],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
      ],
    },
    announcementBar: {
      id: "eggs-marketplace",
      content:
        'New: the <a href="https://eggs.panasaurus.com" target="_blank" rel="noopener">Panasaurus egg marketplace</a>, grab ready-to-run eggs for every image. Questions? <a href="https://discord.gg/tszvW9zKN7" target="_blank" rel="noopener">Join the Discord</a>.',
      backgroundColor: "#0e2a1f",
      textColor: "#9ff5cd",
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,

};

export default config;
