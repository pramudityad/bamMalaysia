export default {
  items: [
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
    {
      name: "Package",
      url: "/package",
      icon: "icon-list",
      roles: ["BAM-CPM", "BAM-GR PA"],
    },
  ],
};
