import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Row,
  Table,
  FormGroup,
  Label,
} from "reactstrap";

import './loader.css'

class LoaderPage extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <div class="spinner-box"></div>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default LoaderPage;
