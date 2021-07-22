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
      url: "/mm-data",
      icon: "icon-folder-alt",
      roles: ["BAM-Sourcing"]
    }
  ],
};
