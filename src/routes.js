import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

const MatNDO = React.lazy(() => import("./views/Material/matlibNDO"));
const MatNRO = React.lazy(() => import("./views/Material/matlibNRO"));
const MatHW = React.lazy(() => import("./views/Material/matlibHW"));
const MatARP = React.lazy(() => import("./views/Material/matlibARP"));

const HWMapping = React.lazy(() => import("./views/CPOMapping/HW"));
const HWMaster = React.lazy(() => import("./views/CPOMapping/HWMaster"));
const SVCMapping = React.lazy(() => import("./views/CPOMapping/SVC"));
const SVCMaster = React.lazy(() => import("./views/CPOMapping/SVCMaster"));

const SVCEdit = React.lazy(() => import("./views/CPOMapping/SVCedit"));
const HWEdit = React.lazy(() => import("./views/CPOMapping/HWedit"));

const HWDashboard = React.lazy(() => import("./views/CPOMapping/DashboardHW"));
const SVCDashboard = React.lazy(() =>
  import("./views/CPOMapping/DashboardSVC")
);

const LMRCreation = React.lazy(() =>
  import("./views/MYAssignment/MYASGCreation")
);
const LMREdit = React.lazy(() => import("./views/MYAssignment/MYASGEdit"));
const LMRDetail = React.lazy(() => import("./views/MYAssignment/MYASGDetail"));
const LMRDetailGR = React.lazy(() =>
  import("./views/MYAssignment/MYASGDetailGR")
);
const LMRList = React.lazy(() => import("./views/MYAssignment/MYASGList"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  {
    path: "/mm-data-ndo",
    exact: true,
    name: "MM Code Dat NDO",
    component: MatNDO,
  },
  {
    path: "/mm-data-nro",
    exact: true,
    name: "MM Code Dat NRO",
    component: MatNRO,
  },
  {
    path: "/mm-data-hw",
    exact: true,
    name: "MM Code Data HW",
    component: MatHW,
  },
  {
    path: "/mm-data-arp",
    exact: true,
    name: "MM Code Data ARP",
    component: MatARP,
  },

  {
    path: "/hw-cpo",
    exact: true,
    name: "HW CPO Mapping",
    component: HWMapping,
  },
  {
    path: "/hw-master",
    exact: true,
    name: "HW Summary Master",
    component: HWMaster,
  },
  {
    path: "/hw-dashboard",
    exact: true,
    name: "HW Dashboard",
    component: HWDashboard,
  },
  {
    path: "/svc-dashboard",
    exact: true,
    name: "SVC Dashboard",
    component: SVCDashboard,
  },
  {
    path: "/svc-cpo",
    exact: true,
    name: "SVC CPO Mapping",
    component: SVCMapping,
  },
  {
    path: "/svc-master",
    exact: true,
    name: "HW Summary Master",
    component: SVCMaster,
  },
  {
    path: "/svc-cpo/:id",
    exact: true,
    name: "SVC CPO Edit",
    component: SVCEdit,
  },
  {
    path: "/hw-cpo/:id",
    exact: true,
    name: "HW CPO Edit",
    component: HWEdit,
  },
  {
    path: "/lmr-list",
    exact: true,
    name: "Assignment LMR List",
    component: LMRList,
  },
  {
    path: "/lmr-creation",
    exact: true,
    name: "Assignment LMR Creation",
    component: LMRCreation,
  },
  {
    path: "/lmr-detail/:id",
    exact: true,
    name: "Assignment LMR Detail",
    component: LMRDetail,
  },
  {
    path: "/lmr-edit/:id",
    exact: true,
    name: "Edit LMR Detail",
    component: LMREdit,
  },
  {
    path: "/lmr-detail/:id/gr-detail/:lmr",
    exact: true,
    name: "Assignment LMR Detail GR",
    component: LMRDetailGR,
  },
];

export default routes;
