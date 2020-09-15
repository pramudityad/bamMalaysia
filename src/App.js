import React, { Component } from 'react';
import { HashRouter, Route, Switch, BrowserRouter, Redirect, Router } from 'react-router-dom';
import './App.scss';
import axios from 'axios';
import Keycloak from 'keycloak-js';
import { connect } from 'react-redux';
import ActionType from './redux/reducer/globalActionType';
import SSOLogin from './containers/DefaultLayout/LoginSSO';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
const LogError = React.lazy(() => import('./views/Pages/LogError'));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.keycloak,
      authenticated: false,
      dataLogin : this.props.LoginData,
      token : this.props.token,
    };
  }

  componentDidMount(){

  }

  render() {
    console.log("LOGIN SUKSES", this.props.authenticated);
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route exact path="/LoginError" name="Login Error" render={props => <LogError {...props} keycloak={this.state.key}/>} />
              <Route path="/LoginSSO" name="Login SSO" render={props => <SSOLogin {...props}/>}/>
              {this.props.authenticatedBAM === false && (
                <Redirect from='/' to='/LoginError'/>
              )}
              {this.props.token === undefined || this.state.key === undefined? (
                <Route path="/" name="Login SSO" render={props => <SSOLogin {...props}/>}/>
              ) : (
                <Route path="/" name="Home" render={props => <DefaultLayout {...props} keycloak={this.state.key} dataLogin={this.state.dataLogin}/>} />
              )}
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData,
    SidebarMinimize : state.minimizeSidebar
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataUser : (dataUser) => dispatch({type : ActionType.LOGIN_DATA, data_user : dataUser }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
