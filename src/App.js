import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Keycloak from 'keycloak-js';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// // Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// // Pages

const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: null,
      username:'',
      email:'',
      id:'',
      userData: {},
      authenticated: false
    };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloakMY.json');
    keycloak.init({onLoad: 'login-required',checkLoginIframe : false}).then(authenticated => {
      this.setState({ key: keycloak, authenticated: authenticated });
    })
  }

  render() {
    if (this.state.key) {
      if (this.state.authenticated){
        localStorage.setItem('UserKey', this.state.key);
        this.state.key.loadUserInfo().then(userInfo => {
          if(this.state.id !== userInfo.sub){
            this.setState({username: userInfo.name, email: userInfo.email, id: userInfo.sub});
            this.setState({userData: userInfo});
            console.log("userInfo", userInfo);
          }
          
          localStorage.setItem('userName', userInfo.name);
          localStorage.setItem('userEmail', userInfo.email);
          });
        const userData = [{name:this.state.username, email:this.state.email, id:this.state.id}];
        localStorage.setItem('UserData', userData);
        return (
          <HashRouter>
              <React.Suspense fallback={loading()}>
                <Switch>
                  {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>}/> */}
                  <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
                  <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
                  <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
                  <Route path="/" name="Home" render={props => <DefaultLayout {...props} dataUser={this.state.userData} keycloak={this.state.key} UserData={this.state.data} DataName={this.state.username}/>} />
                </Switch>
              </React.Suspense>
          </HashRouter>
        );}
      else return (<div>Unable to authenticate!</div>)
    }
      return (
        // <div>Initializing Keycloak...</div>
        <div></div>
      );
  }
}

export default App;
