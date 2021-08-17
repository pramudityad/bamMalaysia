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
    {
      name: "Material Request",
      icon: "fas fa-tools",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-MAT PLANNER",
      ],
      children: [
        {
          name: "MR Dashboard",
          url: "/mr-dashboard-global",
          icon: "icon-speedometer",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "MR List",
          url: "/mr-list",
          icon: "icon-list",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "MR PS Not Assigned",
          url: "/mr-na-list",
          icon: "icon-list",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Bulk MR Request",
          url: "/bulk-mr-request",
          icon: "icon-plus",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-MAT PLANNER",
          ],
        },
        // {
        //   name: 'MRA List',
        //   url: '/mra-list',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
        // },
        // {
        //   name: 'MRA Need Confirm',
        //   url: '/mra-list-need-confirm',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
        // },
        // {
        //   name: 'Request Change Mover',
        //   url: '/request-change-mover',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
        // },
        // {
        //   name: 'Approval Change Mover',
        //   url: '/approval-change-mover',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-LDM"],
        // },
        // {
        //   name: 'POD List',
        //   url: '/pod-list',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-ASP"],
        // },
        // {
        //   name: 'MR DSA Report',
        //   url: '/report/mr',
        //   icon: 'icon-list',
        //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-ASP", "BAM Warehouse", "BAM-Mover"],
        // },
      ],
    },
    // {
    //   name: 'MR Return/Dismantle',
    //   icon: "fas fa-tools",
    //   roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //   children: [
    //     {
    //       name: 'PS SRN',
    //       url: '/srn/ps-srn-list',
    //       icon: 'icon-list',
    //       roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //     },
    //     {
    //       name: 'MRA List',
    //       url: '/srn/mr-srn-list',
    //       icon: 'icon-list',
    //       roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //     },
    //     {
    //       name: 'MRA Assign PS SRN',
    //       url: '/srn/mr-srn-na-list',
    //       icon: 'icon-list',
    //       roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //     },
    //     {
    //       name: 'MRA Approval LDM',
    //       url: '/srn/mr-srn-need-approval-ldm-list',
    //       icon: 'icon-list',
    //       roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //     },
    //     {
    //       name: 'MRA Warehouse Confirm',
    //       url: '/srn/mr-srn-need-confirm-list',
    //       icon: 'icon-list',
    //       roles : ["BAM-Implementation Manager", "BAM-Implementation Coordinator", "BAM-Warehouse"],
    //     },
    //   ]
    // },
    {
      name: "Warehouse",
      icon: "fas fa-boxes",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-ASPWarehouse",
        "BAM-MAT PLANNER",
      ],
      children: [
        {
          name: "Dashboard EID",
          url: "/wh-dashboard-eid",
          icon: "icon-speedometer",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Dashboard ASP/DSP",
          url: "/wh-dashboard-ext",
          icon: "icon-speedometer",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-ASPWarehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Warehouse Management",
          url: "/wh-management",
          icon: "fas fa-pallet",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-ASPWarehouse",
            "BAM-MAT PLANNER",
          ],
        },
        // {
        //   name: 'ASP User Management',
        //   url: '/asp-user-management',
        //   icon: 'icon-list',
        // },
      ],
    },
    {
      title: true,
      name: "MR Process",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-MAT PLANNER",
      ],
      wrapper: {
        // optional wrapper object
        element: "", // required valid HTML5 element tag
        attributes: {}, // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: "", // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: "Order Created",
      url: "/order-created",
      icon: "icon-envelope-open",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-MAT PLANNER",
      ],
    },
    {
      name: "MR Milestones",
      icon: "icon-paper-plane",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-ASP Management",
        "BAM-ASP",
        "BAM-MAT PLANNER",
      ],
      children: [
        {
          name: "Order Received",
          url: "/order-received",
          icon: "fa fa-warehouse",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Order Processing",
          url: "/order-processing",
          icon: "fa fa-clipboard-list",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Ready to Deliver",
          url: "/ready-to-deliver",
          icon: "fa fa-arrow-right",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Joint Check",
          url: "/joint-check",
          icon: "fa fa-box-open",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Loading Process",
          url: "/loading-process",
          icon: "fa fa-truck-loading",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Waiting Dispatch",
          url: "/waiting-dispatch",
          icon: "fa fa-truck-moving",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-ASP Management",
            "BAM-ASP",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Material Dispatch",
          url: "/material-dispatch",
          icon: "fa fa-truck-moving",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-ASP Management",
            "BAM-ASP",
            "BAM-MAT PLANNER",
          ],
        },
        {
          name: "Shipment",
          url: "/shipment-list",
          icon: "fa fa-truck-moving",
          roles: [
            "BAM-Implementation Manager",
            "BAM-Implementation Coordinator",
            "BAM-Warehouse",
            "BAM-MAT PLANNER",
          ],
        },
      ],
    },
    {
      name: "LOM List",
      url: "/lom-list",
      icon: "fa fa-stop-circle",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-MAT PLANNER",
      ],
    },
    {
      name: "Material LOM List",
      url: "/matlom-list",
      icon: "fa fa-stop-circle",
      roles: [
        "BAM-Implementation Manager",
        "BAM-Implementation Coordinator",
        "BAM-Warehouse",
        "BAM-MAT PLANNER",
      ],
    },
  ],
};
