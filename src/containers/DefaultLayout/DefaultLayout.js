import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import {connect} from 'react-redux';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';

// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: "",
      navMenu : navigation,
      routes : this.props.dataLogin.account_id,
      userRole : this.props.dataLogin.role,
      minimize : this.props.SidebarMinimize,
      vendor_name : this.props.dataLogin.vendor_name,
      vendor_code : this.props.dataLogin.vendor_code,
    };
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    localStorage.clear();
    this.props.keycloak.logout();
    this.props.history.push('/');
  }

  componentDidMount(){
    this.showMenuByRole();
  }

  showMenuByRole(){
    console.log("showByRole", this.state.userRole);
    let rolesUser = this.props.dataLogin.role;
    let dataMenu = this.state.navMenu.items;
    let dataMenuRoles = [];
    if(this.state.vendor_code !== undefined && this.state.vendor_code !== null && this.state.vendor_code.length !== 0){
      rolesUser.push("BAM-ASP");
    }
    if(dataMenu !== undefined && dataMenu.length !== 0 && rolesUser.indexOf("Admin") === -1){
      for(let i = 0; i < dataMenu.length; i++){
        let dataMenuIndex = Object.assign({}, dataMenu[i])
        if(dataMenu[i].roles !== undefined){
          let allowed = dataMenu[i].roles.some(e => rolesUser.includes(e));
          if(allowed === false){
            // dataMenuIndex.splice(i,1);
          }else{
            dataMenuRoles.push(dataMenuIndex);
            if(dataMenu[i].children !== undefined && dataMenu[i].children.length > 0){
              for(let j = 0; j < dataMenu[i].children.length; j++){
                if(dataMenu[i].children[j].roles !== undefined){
                  let allowedChild = dataMenu[i].children[j].roles.some(e => rolesUser.includes(e));
                  if(allowedChild === false){
                    // dataMenuIndex.children.splice(j,1);
                    dataMenuIndex.children = dataMenuIndex.children.filter(e => e.name !== dataMenu[i].children[j].name);
                  }
                }
              }
            }
          }
        }
      }
      this.setState({navMenu : {items : dataMenuRoles}});
    }
  }

  componentDidUpdate(){
    if(this.state.minimize !== this.props.SidebarMinimize){
      this.setState({minimize : this.props.SidebarMinimize});
    }
  }


  render() {
    console.log("this.props", this.props);
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)} DataName={this.props.DataName}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={this.state.navMenu} {...this.props} router={router}/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} dataUser = {this.props.dataUser}/>
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/lmr-list" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData,
    SidebarMinimize : state.minimizeSidebar
  }
}

export default connect(mapStateToProps)(DefaultLayout);
