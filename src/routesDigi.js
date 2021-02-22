import React from "react";

const Dashboard = React.lazy(() => import("./viewsDigi/Dashboard"));

const MatNDO = React.lazy(() => import("./viewsDigi/Material/matlibNDO"));
const MatNRO = React.lazy(() => import("./viewsDigi/Material/matlibNRO"));
const MatHW = React.lazy(() => import("./viewsDigi/Material/matlibHW"));
const MatARP = React.lazy(() => import("./viewsDigi/Material/matlibARP"));
const Package = React.lazy(() => import("./viewsDigi/Material/package"));

const LMRCreation = React.lazy(() => import("./viewsDigi/MYAssignment/MYASGCreation"));
const LMREdit = React.lazy(() => import("./viewsDigi/MYAssignment/MYASGEdit2"));
const LMRDetail = React.lazy(() => import("./viewsDigi/MYAssignment/MYASGDetail"));
const LMRDetailGR = React.lazy(() => import("./viewsDigi/MYAssignment/MYASGDetailGR"));
const LMRList = React.lazy(() => import("./viewsDigi/MYAssignment/MYASGList"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/mm-data-ndo", exact: true, name: "MM Code Data NDO", component: MatNDO },
  { path: "/mm-data-nro", exact: true, name: "MM Code Data NRO", component: MatNRO },
  { path: "/mm-data-hw", exact: true, name: "MM Code Data HW", component: MatHW },
  { path: "/mm-data-arp", exact: true, name: "MM Code Data ARP", component: MatARP },
  { path: "/package", exact: true, name: "Package List", component: Package },

  { path: "/lmr-list", exact: true, name: "Assignment LMR List", component: LMRList },
  { path: "/lmr-creation", exact: true, name: "Assignment LMR Creation", component: LMRCreation },
  { path: "/lmr-detail/:id", exact: true, name: "Assignment LMR Detail", component: LMRDetail },
  { path: "/lmr-edit/:id", exact: true, name: "Edit LMR Detail", component: LMREdit },
  { path: "/lmr-detail/:id/gr-detail/:lmr", exact: true, name: "Assignment LMR Detail GR", component: LMRDetailGR },
];

export default routes;
