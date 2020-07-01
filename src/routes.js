import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));


const LMRCreation = React.lazy(() => import('./views/MYAssignment/MYASGCreation'));
const LMRDetailDummy = React.lazy(() => import('./views/MYAssignment/MYASGDetail'));
const LMRDetailGR = React.lazy(() => import('./views/MYAssignment/MYASGDetailGR'));
const LMRList = React.lazy(() => import('./views/MYAssignment/MYASGList'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },


  { path: '/lmr-list', exact: true, name: 'Assignment LMR List', component: LMRList },
  { path: '/lmr-creation', exact: true, name: 'Assignment LMR Creation', component: LMRCreation },
  { path: '/lmr-detail/:id', exact: true, name: 'Assignment LMR Detail', component: LMRDetailDummy },
  { path: '/lmr-detail/:id/gr-detail/:grid', exact: true, name: 'Assignment LMR Detail GR', component: LMRDetailGR },
];

export default routes;
