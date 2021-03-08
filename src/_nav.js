export default {
  items: [
    {
      name: "Assignment LMR",
      icon: "icon-folder-alt",
      roles: [
        "BAM-CPM",
        "BAM-IM",
        "BAM-IE Lead",
        "BAM-MP",
        "BAM-PA",
        "BAM-Sourcing",
        "BAM-GR-PA",
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
            "BAM-MP",
            "BAM-PA",
            "BAM-Sourcing",
            "BAM-GR-PA",
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
          name: "NDO",
          url: "/mm-data-ndo",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
        {
          name: "NRO",
          url: "/mm-data-nro",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
        {
          name: "HW",
          url: "/mm-data-hw",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
        {
          name: "ARP",
          url: "/mm-data-arp",
          icon: "icon-list",
          roles: ["BAM-Sourcing"],
        },
      ],
    },
    {
      name: "CPO Mapping",
      icon: "icon-folder-alt",
      roles: [
        "BAM-CPM",
        // "BAM-IM",
        // "BAM-IE Lead",
        // "BAM-MP",
        // "BAM-PA",
        // "BAM-Sourcing",
        // "BAM-GR-PA",
        "BAM-MAT PLANNER",
        "BAM-PFM",
        "BAM-ADMIN",
      ],
      children: [
        {
          name: "Summary Master",
          url: "/summary-master",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            // "BAM-IM",
            // "BAM-IE Lead",
            // "BAM-MP",
            // "BAM-PA",
            // "BAM-Sourcing",
            // "BAM-GR-PA",
            "BAM-MAT PLANNER",
            "BAM-PFM",
            "BAM-ADMIN",
          ],
        },
        {
          name: "HW Maping",
          url: "/hw-cpo",
          icon: "icon-list",
          roles: [
            "BAM-CPM",
            // "BAM-IM",
            // "BAM-IE Lead",
            // "BAM-MP",
            // "BAM-PA",
            // "BAM-Sourcing",
            // "BAM-GR-PA",
            "BAM-MAT PLANNER",
            "BAM-PFM",
            "BAM-ADMIN",
          ],
        },
        {
          name: "SVC Maping",
          url: "/svc-cpo",
          icon: "icon-list",
          roles: [
            "BAM-CPM",
            // "BAM-IM",
            // "BAM-IE Lead",
            // "BAM-MP",
            // "BAM-PA",
            // "BAM-Sourcing",
            // "BAM-GR-PA",
            "BAM-MAT PLANNER",
            "BAM-PFM",
            "BAM-ADMIN",
          ],
        },
      ],
    },
    {
      name: "Dashboard",
      icon: "icon-speedometer",
      roles: [
        "BAM-CPM",
        // "BAM-IM",
        // "BAM-IE Lead",
        // "BAM-MP",
        // "BAM-PA",
        // "BAM-Sourcing",
        // "BAM-GR-PA",
        "BAM-MAT PLANNER",
        "BAM-PFM",
        "BAM-ADMIN",
      ],
      children: [
        {
          name: "HW",
          url: "/hw-dashboard",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            // "BAM-IM",
            // "BAM-IE Lead",
            // "BAM-MP",
            // "BAM-PA",
            // "BAM-Sourcing",
            // "BAM-GR-PA",
            "BAM-MAT PLANNER",
            "BAM-PFM",
            "BAM-ADMIN",
          ],
        },
        {
          name: "SVC",
          url: "/svc-dashboard",
          icon: "icon-folder",
          roles: [
            "BAM-CPM",
            // "BAM-IM",
            // "BAM-IE Lead",
            // "BAM-MP",
            // "BAM-PA",
            // "BAM-Sourcing",
            // "BAM-GR-PA",
            "BAM-MAT PLANNER",
            "BAM-PFM",
            "BAM-ADMIN",
          ],
        },
      ],
    },
  ],
};
