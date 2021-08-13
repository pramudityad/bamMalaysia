import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Widget from './Widget';
import './project_css.css';
import axios from 'axios';

const API_URL = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const username = 'bamidadmin@e-dpm.com';
const password = 'F760qbAg2sml';

class ProjectDashboard extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
    }
  }

  componentDidMount() {
    document.title = 'Project Dashboard | BAM';
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Customer Order" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Order Created" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="ASP Assigned" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="3">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Order Received" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Material Preparation" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Material Dispatch" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="ASP Ready To Site" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Material Handover" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Installation Start" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#">
              <Widget color="primary" variant="inverse" header="99" mainText="Installation Finish" imageSource="../../assets/icon/dashboard/order-received.png"/>
            </a>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ProjectDashboard;