// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  main: [
    {
      type: 'doc',
      label: 'Introduction',
      id: 'intro',
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'installer',
        'panel/installation',
        'wings/installation',
      ],
    },
    {
      type: 'category',
      label: 'Panel',
      items: [
        'panel/configuration',
        'panel/extensions',
      ],
    },
    {
      type: 'category',
      label: 'Wings daemon',
      items: [
        'wings/configuration',
        'wings/tls',
        'wings/sftp',
      ],
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        'images',
        'eggs',
        'migration',
      ],
    },
    {
      type: 'doc',
      label: 'Community & support',
      id: 'community',
    },
  ],
};

module.exports = sidebars;
