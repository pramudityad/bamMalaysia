export default {
  items: [
    {
      name: "Product",
      icon: "icon-folder-alt",
      roles: [
        "BAM-CPM",
        "BAM-IM",
        "BAM-IE Lead",
        "BAM-GR PA",
        "BAM-Sourcing",
        "BAM-EPC",
      ],
      children: [
        {
          name: "Bundle Manager",
          url: "/product-package",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
        {
          name: "Additional Material",
          url: "/additional-material-package",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
        {
          name: "Config Manager",
          url: "/config-manager",
          icon: "icon-doc",
          roles: [
            "BAM-CPM",
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
      ],
    },
    {
      name: "BOQ",
      icon: "icon-folder-alt",
      roles: ["BAM-IM", "BAM-IE Lead", "BAM-GR PA", "BAM-Sourcing", "BAM-EPC"],
      children: [
        {
          name: "Technical BOQ",
          url: "/list-technical",
          icon: "icon-docs",
          roles: [
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
        {
          name: "TSSR BOQ",
          url: "/list-tssr-boq",
          icon: "icon-docs",
          roles: [
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
      ],
    },
    {
      name: "Plant Spec List",
      url: "/ps-list",
      icon: "icon-menu",
      roles: ["BAM-IM", "BAM-IE Lead", "BAM-GR PA", "BAM-Sourcing", "BAM-EPC"],
    },
    {
      name: "Assignment LMR",
      icon: "icon-folder-alt",
      roles: [
        "BAM-CPM",
        "BAM-IM",
        "BAM-IE Lead",
        "BAM-GR PA",
        "BAM-Sourcing",
        "BAM-EPC",
      ],
      children: [
        {
          name: "LMR",
          url: "/lmr-list",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            "BAM-IM",
            "BAM-IE Lead",
            "BAM-GR PA",
            "BAM-Sourcing",
            "BAM-EPC",
          ],
        },
      ],
    },
    {
      name: "MM Data",
      icon: "icon-folder-alt",
      roles: ["BAM-Sourcing"],
      children: [
        {
          name: "NRO",
          url: "/mm-data-nro",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
        {
          name: "NDO",
          url: "/mm-data-ndo",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
        {
          name: "Integration",
          url: "/mm-data-integration",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
      ],
    },
  ],
};
