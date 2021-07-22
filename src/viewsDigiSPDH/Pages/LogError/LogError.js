import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import SSOLogin from '../../../containers/DefaultLayout/LoginSSO';
import { Redirect } from 'react-router-dom';

class LogError extends Component {

  constructor(props) {
    super(props);
  }

  signOut(e) {
    e.preventDefault();
    localStorage.clear();
    this.props.history.push('/');
    if(this.props.keycloak !== undefined){
      this.props.keycloak.logout();
    }
  }

  render() {
    console.log("this.props.keycloak 11", this.props.keycloak);
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <span className="clearfix">
                <h1 className="float-left display-3 mr-4">OPPS</h1>
                <h4 className="pt-3">You dont have permission</h4>
                <p className="text-muted float-left">please login again using correct user</p>
              </span>
              <Row className="justify-content-center">
                <Button onClick={e=>this.signOut(e)} color="primary" className="justify-content-center">Login</Button>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LogError;
