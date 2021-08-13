import React from "react";

const Dashboard = React.lazy(() => import("./viewsDNB/Dashboard"));

const MatNRO = React.lazy(() => import("./viewsDNB/Material/matlibNRO"));
const MatNDO = React.lazy(() => import("./viewsDNB/Material/matlibNDO"));
const MatIntegration = React.lazy(() =>
  import("./viewsDNB/Material/matlibIntegration")
);
const MatHW = React.lazy(() => import("./viewsDNB/Material/matlibHW"));
const MatARP = React.lazy(() => import("./viewsDNB/Material/matlibARP"));
const Package = React.lazy(() => import("./viewsDNB/Material/package"));

const LMRCreation = React.lazy(() =>
  import("./viewsDNB/MYAssignment/MYASGCreation")
);
const LMREdit = React.lazy(() => import("./viewsDNB/MYAssignment/MYASGEdit"));
const LMRDetail = React.lazy(() =>
  import("./viewsDNB/MYAssignment/MYASGDetail")
);
const LMRDetailGR = React.lazy(() =>
  import("./viewsDNB/MYAssignment/MYASGDetailGR")
);
const LMRList = React.lazy(() => import("./viewsDNB/MYAssignment/MYASGList"));

// BOQ
const ListTSSRBoq = React.lazy(() => import("./viewsDNB/Tssr/ListTSSRBoq"));
const DetailTSSRBoq = React.lazy(() => import("./viewsDNB/Tssr/TSSRBoq"));

const ListTechnical = React.lazy(() =>
  import("./viewsDNB/Technical/ListTechnical")
);
const DetailTechnical = React.lazy(() =>
  import("./viewsDNB/Technical/TechnicalBoq")
);
const ApprovalTechnical = React.lazy(() =>
  import("./viewsDNB/Technical/TechnicalBoqApproval")
);

const ConfigManager = React.lazy(() =>
  import("./viewsDNB/ConfigManagement/ConfigUpload")
);

const ProductPackage = React.lazy(() =>
  import("./viewsDNB/ProductPackage/PackageUpload")
);

const TssrList = React.lazy(() => import("./viewsDNB/Tssr/TssrList"));
const TssrBOM = React.lazy(() => import("./viewsDNB/Tssr/TssrBOM"));
const TssrBOMDetail = React.lazy(() => import("./viewsDNB/Tssr/DetailTssr"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  { path: "/mm-data-nro", exact: true, name: "MM Data NRO", component: MatNRO },
  { path: "/mm-data-ndo", exact: true, name: "MM Data NDO", component: MatNDO },
  {
    path: "/mm-data-integration",
    exact: true,
    name: "MM Data Integration",
    component: MatIntegration,
  },
  { path: "/mm-data-hw", exact: true, name: "MM Data HW", component: MatHW },
  { path: "/mm-data-arp", exact: true, name: "MM Data ARP", component: MatARP },
  { path: "/package", exact: true, name: "Package List", component: Package },

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

  {
    path: "/list-tssr-boq",
    exact: true,
    name: "List TSSR BOQ",
    component: ListTSSRBoq,
  },
  {
    path: "/list-tssr-boq/detail/:id",
    exact: true,
    name: "CPO TSSR Detail",
    component: DetailTSSRBoq,
  },

  {
    path: "/list-technical",
    exact: true,
    name: "List Technical BOQ",
    component: ListTechnical,
  },
  {
    path: "/list-technical/detail/:id",
    exact: true,
    name: "Detail Technical BOQ",
    component: DetailTechnical,
  },
  {
    path: "/approval-technical/:id",
    exact: true,
    name: "Approval Technical BOQ",
    component: ApprovalTechnical,
  },
  {
    path: "/list-technical/new",
    exact: true,
    name: "Detail Technical BOQ",
    component: DetailTechnical,
  },

  {
    path: "/config-manager",
    exact: true,
    name: "Config Manager",
    component: ConfigManager,
  },
  {
    path: "/product-package",
    exact: true,
    name: "Product Package Manager",
    component: ProductPackage,
  },
  {
    path: "/ps-list",
    exact: true,
    name: "Plant Spec List",
    component: TssrList,
  },
  { path: "/ps-list/:id", name: "Plant Spec BOM", component: TssrBOMDetail },
];

export default routes;
