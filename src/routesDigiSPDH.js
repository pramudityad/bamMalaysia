import React from "react";

const Dashboard = React.lazy(() => import("./viewsDigiSPDH/Dashboard"));

const MaterialData = React.lazy(() => import("./viewsDigiSPDH/Material/MaterialData"));

const LMRCreation = React.lazy(() => import("./viewsDigiSPDH/MYAssignment/MYASGCreation"));
const LMREdit = React.lazy(() => import("./viewsDigiSPDH/MYAssignment/MYASGEdit"));
const LMRDetail = React.lazy(() => import("./viewsDigiSPDH/MYAssignment/MYASGDetail"));
const LMRDetailGR = React.lazy(() => import("./viewsDigiSPDH/MYAssignment/MYASGDetailGR"));
const LMRList = React.lazy(() => import("./viewsDigiSPDH/MYAssignment/MYASGList"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/mm-data", exact: true, name: "MM Data", component: MaterialData },

  { path: "/lmr-list", exact: true, name: "Assignment LMR List", component: LMRList },
  { path: "/lmr-creation", exact: true, name: "Assignment LMR Creation", component: LMRCreation },
  { path: "/lmr-detail/:id", exact: true, name: "Assignment LMR Detail", component: LMRDetail },
  { path: "/lmr-edit/:id", exact: true, name: "Approve LMR", component: LMREdit },
  { path: "/lmr-detail/:id/gr-detail/:lmr", exact: true, name: "Assignment LMR Detail GR", component: LMRDetailGR },
];

export default routes;
