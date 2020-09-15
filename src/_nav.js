export default {
  items: [
    {
      name: 'Assignment LMR',
      icon: 'icon-folder-alt',
      roles : ["BAM-CPM", "BAM-IM", "BAM-IE Lead", "BAM-MP", "BAM-PA", "BAM-Sourcing"],
      children: [
        {
          name: 'LMR',
          url: '/lmr-list',
          icon: 'icon-folder',
          roles : ["BAM-CPM", "BAM-IM", "BAM-IE Lead", "BAM-MP", "BAM-PA", "BAM-Sourcing"],
        },        
      ]
    },
    {
      name: 'MM Data',
      icon: 'icon-folder-alt',
      roles : ["BAM-Sourcing"],
      children: [
        {
          name: 'NDO',
          url: '/mm-data-ndo',
          icon: 'icon-list',
          roles : ["BAM-Sourcing"],
        },
        {
          name: 'NRO',
          url: '/mm-data-nro',
          icon: 'icon-list',
          roles : ["BAM-Sourcing"],
        },
        {
          name: 'HW',
          url: '/mm-data-hw',
          icon: 'icon-list',
          roles : ["BAM-Sourcing"],
        },
        {
          name: 'ARP',
          url: '/mm-data-arp',
          icon: 'icon-list',
          roles : ["BAM-Sourcing"],
        },
      ]
    },
  ]
};
