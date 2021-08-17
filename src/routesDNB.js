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

const WHManagement = React.lazy(() =>
  import("./viewsDNB/MR/WHManagement/WHManagement")
);

const MRList = React.lazy(() => import("./viewsDNB/MR/MRList"));
const MRNAList = React.lazy(() => import("./viewsDNB/MR/MRNAList"));
const MRCreation = React.lazy(() => import("./viewsDNB/MR/MRCreation"));
const BulkMRCreation = React.lazy(() => import("./viewsDNB/MR/BulkMR"));
const MRDetail = React.lazy(() => import("./viewsDNB/MR/MRDetail"));
const PSUpload = React.lazy(() => import("./viewsDNB/MR/PSUpload"));
const MRProgress = React.lazy(() => import("./viewsDNB/MR/MRProgress"));
const MRDashboardGlob = React.lazy(() =>
  import("./viewsDNB/MR/Dashboard/MRDashboardGlob")
);

const OrderReceived = React.lazy(() =>
  import("./viewsDNB/Warehouse/OrderReceived")
);
const OrderProcessing = React.lazy(() =>
  import("./viewsDNB/Warehouse/OrderProcessing")
);
const ReadyToDeliver = React.lazy(() =>
  import("./viewsDNB/Warehouse/ReadyToDeliver")
);
const JointCheck = React.lazy(() => import("./viewsDNB/Warehouse/JointCheck"));
const LoadingProcess = React.lazy(() =>
  import("./viewsDNB/Warehouse/LoadingProcess")
);
const WaitingDispatch = React.lazy(() =>
  import("./viewsDNB/Warehouse/WaitingDispatch")
);
const MaterialDispatch = React.lazy(() =>
  import("./viewsDNB/Warehouse/MaterialDispatch")
);
const ProjectDashboard = React.lazy(() =>
  import("./viewsDNB/Project/ProjectDashboard")
);
const OrderCreated = React.lazy(() =>
  import("./viewsDNB/Project/OrderCreated")
);
const LOMList = React.lazy(() => import("./viewsDNB/MR/LOMList"));
const MatLOMList = React.lazy(() => import("./viewsDNB/MR/MatLOMList"));
const BulkRequest = React.lazy(() => import("./viewsDNB/MR/BulkRequest"));

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
  { path: "/ps-bom", exact: true, name: "Plant Spec BOM", component: TssrBOM },

  { path: "/ps-list/:id", name: "Plant Spec BOM", component: TssrBOMDetail },
  {
    path: "/wh-management",
    exact: true,
    name: "Warehouse Management",
    component: WHManagement,
  },

  { path: "/mr-list", exact: true, name: "MR List", component: MRList },
  {
    path: "/mr-na-list",
    exact: true,
    name: "MR List Not Assign",
    component: MRNAList,
  },
  {
    path: "/mr-creation",
    exact: true,
    name: "Create MR",
    component: MRCreation,
  },
  {
    path: "/mr-detail/:id",
    exact: true,
    name: "MR Detail",
    component: MRDetail,
    roles: ["BAM-ASP"],
  },
  {
    path: "/bulk-mr-creation",
    name: "Bulk MR Creation",
    component: BulkMRCreation,
  },
  { path: "/bulk-mr-request", name: "Bulk MR Request", component: BulkRequest },
  // { path: '/bulk-mr-change-approval', name: 'Bulk MR Change Approval', component: BulkChangeApproval },
  // { path: '/bulk-mr-approval', name: 'Bulk MR Approval', component: BulkApproval },
  { path: "/ps-upload/:id", exact: true, name: "MR List", component: PSUpload },
  {
    path: "/mr-progress/:id",
    exact: true,
    name: "MR Progress",
    component: MRProgress,
  },

  {
    path: "/order-received",
    exact: true,
    name: "Order Received",
    component: OrderReceived,
  },
  {
    path: "/order-processing",
    exact: true,
    name: "Order Processing",
    component: OrderProcessing,
  },
  {
    path: "/ready-to-deliver",
    exact: true,
    name: "Ready To Deliver",
    component: ReadyToDeliver,
  },
  {
    path: "/joint-check",
    exact: true,
    name: "Joint Check",
    component: JointCheck,
  },
  {
    path: "/loading-process",
    exact: true,
    name: "Loading Process",
    component: LoadingProcess,
  },
  {
    path: "/waiting-dispatch",
    exact: true,
    name: "Material Dispatch",
    component: WaitingDispatch,
    roles: ["BAM-ASP"],
  },
  {
    path: "/material-dispatch",
    exact: true,
    name: "Material Dispatch",
    component: MaterialDispatch,
    roles: ["BAM-ASP"],
  },
  {
    path: "/project-dashboard",
    exact: true,
    name: "Project Dashboard",
    component: ProjectDashboard,
  },
  {
    path: "/order-created",
    exact: true,
    name: "Order Created",
    component: OrderCreated,
  },
  { path: "/lom-list", exact: true, name: "LOM List", component: LOMList },
  {
    path: "/matlom-list",
    exact: true,
    name: "Material LOM List",
    component: MatLOMList,
  },
];

export default routes;
