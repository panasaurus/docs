import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Getting started",
      link: {
        type: "doc",
        id: "getting-started/getting-started-index",
      },
      collapsed: false,
      items: [
        "getting-started/quick-start",
        "getting-started/panel-install",
        "getting-started/daemon-install",
        "getting-started/first-node",
      ],
    },
    {
      type: "category",
      label: "Panel",
      link: {
        type: "doc",
        id: "panel/panel-index",
      },
      items: [
        "panel/extensions",
        "panel/marketplace",
        "panel/panel-https",
        "panel/panel-updating",
        "panel/panel-troubleshooting",
      ],
    },
    {
      type: "category",
      label: "Daemon",
      link: {
        type: "doc",
        id: "daemon/daemon-index",
      },
      items: [
        "daemon/daemon-configuration",
        "daemon/daemon-tls",
        "daemon/daemon-features",
        "daemon/daemon-sftp",
      ],
    },
    {
      type: "category",
      label: "Images",
      link: {
        type: "doc",
        id: "images/images-index",
      },
      items: ["images/images-tags", "images/images-migration"],
    },
    "community",
  ],
};

export default sidebars;
