import React, { Component } from "react";
import {
  HashRouter,
  Route,
  Switch,
  BrowserRouter,
  Redirect,
  Router,
} from "react-router-dom";
import axios from "axios";
import Keycloak from "keycloak-js";
import { connect } from "react-redux";
import ActionType from "../../redux/reducer/globalActionType";
import App from "../../App";
import "./LoginSSO.css";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import celcom from "../../assets/img/customer/celcom.png";
import digi from "../../assets/img/customer/digi.png";
import ericssonLogoBlack from "../../assets/img/brand/ERI_horizontal_RGB_BLACK.svg";
import { postDatatoAPILogin } from "../../helper/asyncFunction";
const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

class SSOLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null,
      userInfo: null,
      authenticated: false,
      dataLogin: null,
      token: null,
      authenticatedLoginBAM: null,
      authenticatedLoginBAMStatus: null,
    };
  }

  async getDataLogin(keycloak, account_id) {
    const dataReq = {
      account_id: "1", // please change back to account_id once pdb is available
      cas_id: keycloak.sub,
      data: {
        first_name: keycloak.given_name,
        last_name: keycloak.family_name,
        email: keycloak.email,
        username: keycloak.preferred_username,
      },
    };
    const getLogin = await postDatatoAPILogin("/loginUser", dataReq);
    if (getLogin.data !== undefined) {
      console.log("getLogin.data ", getLogin.data);
      localStorage.setItem("user_data_login", JSON.stringify(getLogin.data));
      this.setState({ dataLogin: getLogin.data, token: getLogin.data.token });
      let role_user = getLogin.data.listRole;
      if (
        getLogin.data.validUser.vendor_code !== undefined &&
        getLogin.data.validUser.vendor_code !== null &&
        getLogin.data.validUser.vendor_code.length !== 0
      ) {
        role_user.push("BAM-ASP");
      }
      this.props.saveDataUser({
        data_user: getLogin.data,
        _id_user: getLogin.data.validUser._id,
        email_user: getLogin.data.validUser.email,
        roles_user: role_user,
        user_name: getLogin.data.validUser.username,
        account_id: account_id,
        token: getLogin.data.token,
        sso_id: keycloak.sub,
        name:
          getLogin.data.validUser.first_name +
          " " +
          getLogin.data.validUser.last_name,
        vendor_code: getLogin.data.validUser.vendor_code,
        vendor_name: getLogin.data.validUser.vendor_name,
      });
      // console.log("getLogin.data",  getLogin.data.validUser.vendor_code);
      localStorage.setItem(
        "keycloack_data_login",
        JSON.stringify(this.state.key)
      );
      localStorage.setItem(
        "authenticated_data_login",
        this.state.authenticated
      );
      localStorage.setItem("account_selected", account_id);
      this.setState({
        key: this.state.key,
        authenticated: this.state.authenticated,
        authenticatedLoginBAM: true,
      });
    } else {
      const location = this.props.location.pathname;
      console.log(location);
      if (location.includes("lmr-detail")) {
        this.props.saveDataUser({
          // data_user: getLogin.data,
          // _id_user: getLogin.data.validUser._id,
          // email_user: getLogin.data.validUser.email,
          roles_user: "Public",
          // user_name: getLogin.data.validUser.username,
          // account_id: account_id,
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI0ZWU4MTQ2ZC05MGRmLTRlM2YtYWEwOS0zNmIzMGRjNjVlZjkiLCJyb2xlcyI6WyJCQU0tU3lzdGVtIiwiQkFNLVNvdXJjaW5nIl0sImFjY291bnQiOiIxIiwiaWF0IjoxNjAxNzUzNDc0fQ.wVW7c9lQ_3-3_bcHG9LbFaocOCYiz0a-fJtZtF6jIJE",
          // sso_id: keycloak.sub,
          name: "Guest",
        });
        this.setState({
          key: this.state.key,
          authenticated: this.state.authenticated,
          authenticatedLoginBAM: true,
        });
      } else {
        this.setState({
          key: this.state.key,
          authenticated: this.state.authenticated,
          authenticatedLoginBAM: false,
          authenticatedLoginBAMStatus: getLogin.response.data.error,
        });
      }
    }
  }

  loginKeycloack() {
    const keycloak = Keycloak("/keycloakMY.json");
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        keycloak.loadUserInfo().then((userInfo) => {
          this.setState({
            key: keycloak,
            authenticated: authenticated,
            userInfo: userInfo,
          });
          if (localStorage.getItem("user_data_login") === null) {
          } else {
            this.getDatafromLocalStorage(keycloak, authenticated);
          }
        });
      });
  }

  componentDidMount() {
    this.loginKeycloack();
  }

  getDatafromLocalStorage(keycloak, authenticated) {
    const dataLogin = JSON.parse(localStorage.getItem("user_data_login"));
    let role_user = dataLogin.listRole;
    if (
      dataLogin.validUser.vendor_code !== undefined &&
      dataLogin.validUser.vendor_code !== null &&
      dataLogin.validUser.vendor_code.length !== 0
    ) {
      role_user.push("BAM-ASP");
    }
    this.props.saveDataUser({
      data_user: dataLogin,
      _id_user: dataLogin.validUser._id,
      email_user: dataLogin.validUser.email,
      roles_user: role_user,
      user_name: dataLogin.validUser.username,
      account_id: localStorage.getItem("account_selected"),
      token: dataLogin.token,
      sso_id: keycloak.sub,
      name:
        dataLogin.validUser.first_name + " " + dataLogin.validUser.last_name,
      vendor_code: dataLogin.validUser.vendor_code,
      vendor_name: dataLogin.validUser.vendor_name,
    });
    // console.log("getLogin.data",  dataLogin.validUser.vendor_code);
    this.setState({ dataLogin: dataLogin });
    this.setState({ key: keycloak, authenticated: authenticated }, () => {
      if (dataLogin === null) {
        this.setState({ authenticatedLoginBAM: null });
      } else {
        this.setState({ authenticatedLoginBAM: true });
      }
    });
  }

  handleChangeAccount(account_id) {
    this.setState({ authenticatedLoginBAM: null });
    this.getDataLogin(this.state.userInfo, account_id);
  }

  render() {
    // console.log("authenticatedLoginBAM", this.state.authenticatedLoginBAM,  this.state.authenticatedLoginBAMStatus)
    if (
      this.state.key !== null &&
      this.state.key !== undefined &&
      this.state.authenticatedLoginBAM === true
    ) {
      return (
        <App
          token={this.state.token}
          LoginData={this.state.dataLogin}
          keycloak={this.state.key}
          authenticatedBAM={this.state.authenticatedLoginBAM}
        />
      );
    }

    if (
      this.state.key !== null &&
      this.state.key !== undefined &&
      (this.state.authenticatedLoginBAM === null ||
        this.state.authenticatedLoginBAM === false)
    ) {
      return (
        <React.Fragment>
          <div className="app flex-row align-items-center page--select-account">
            <Container className="background-container--login-page">
              <Row
                className="justify-content-center"
                style={{ display: "flex", width: "inherit" }}
              >
                <img
                  src={ericssonLogoBlack}
                  alt="Ericsson logo"
                  style={{ width: "170px", float: "right", marginLeft: "auto" }}
                />
              </Row>
              <Row className="justify-content-center">
                <span style={{ fontWeight: "900", fontSize: "25px" }}>
                  Welcome to BAM
                </span>
              </Row>
              <Row className="justify-content-center">
                <h3>Please Select Account :</h3>
              </Row>
              <Row className="justify-content-center">
                <Col md="6" lg="6" xl="6">
                  <div className="flex--card-account">
                    <div
                      className="card-account--celcom"
                      onClick={() => this.handleChangeAccount("1")}
                    >
                      <div>
                        <img
                          src={celcom}
                          alt="celcom logo"
                          style={{ width: "30%", marginTop: "5%" }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="6" lg="6" xl="6">
                  <div className="flex--card-account">
                    <div
                      className="card-account--digi"
                      onClick={() => this.handleChangeAccount("2")}
                    >
                      <div>
                        <img
                          src={digi}
                          alt="digi logo"
                          style={{ width: "30%", marginTop: "5%" }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              {this.state.authenticatedLoginBAM === false && (
                <Row className="justify-content-center">
                  <div className="card--error">
                    <h5>{this.state.authenticatedLoginBAMStatus}</h5>
                  </div>
                </Row>
              )}
            </Container>
          </div>
        </React.Fragment>
      );
    }

    return <div></div>;
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
    SidebarMinimize: state.minimizeSidebar,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataUser: (dataUser) =>
      dispatch({ type: ActionType.LOGIN_DATA, data_user: dataUser }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SSOLogin);
