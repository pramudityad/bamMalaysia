import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import Widget from './Widget';
import "../wh_css.css";
import { connect } from 'react-redux';
import axios from 'axios';

const API_URL = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const username = 'bamidadmin@e-dpm.com';
const password = 'F760qbAg2sml';

const API_URL_Node = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';
// /bamidapi/updateBastNumber/

class WHDashboardDet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole : this.props.dataLogin.role,
      userId : this.props.dataLogin._id,
      userName : this.props.dataLogin.userName,
      userEmail : this.props.dataLogin.email,
      tokenUser : this.props.dataLogin.token,
      variant0: "inverse",
      variant1: "inverse",
      variant2: "inverse",
      variant3: "inverse",
      variant4: "inverse",
      variant5: "inverse",
      variant6: "inverse",
      variant7: "inverse",
      variant8: "inverse",
      variant9: "inverse",
      img_1: "fa fa-warehouse",
      img_2: "fa fa-clipboard-list",
      img_3: "fa fa-arrow-right",
      img_4: "fa fa-box-open",
      img_5: "fa fa-truck-loading",
      img_6: "fa fa-truck-moving",
      img_7: "fa fa-stop-circle",
      img_8: "fa fa-stop-circle",
      img_9: "fa fa-stop-circle",
      order_received: 0,
      order_processing: 0,
      ready_to_deliver: 0,
      joint_check: 0,
      loading_process: 0,
      material_dispatch: 0,
      material_on_hold: 0,
      wh_data: [],
    }

    this.updateHover1 = this.updateHover1.bind(this);
    this.getOrderCreated = this.getOrderCreated.bind(this);
    this.getOrderReceived = this.getOrderReceived.bind(this);
    this.getOrderProcessing = this.getOrderProcessing.bind(this);
    this.getReadyToDeliver = this.getReadyToDeliver.bind(this);
    this.getJointCheck = this.getJointCheck.bind(this);
    this.getLoadingProcess = this.getLoadingProcess.bind(this);
    this.getMaterialDispatch = this.getMaterialDispatch.bind(this);
    this.getMaterialOnHold = this.getMaterialOnHold.bind(this);
  }

  updateHover1(hover) {
    this.setState({
      variant1: hover
    })
  }

  updateHover2(hover) {
    this.setState({
      variant2: hover
    })
  }

  updateHover3(hover) {
    this.setState({
      variant3: hover
    })
  }

  updateHover4(hover) {
    this.setState({
      variant4: hover
    })
  }

  updateHover5(hover) {
    this.setState({
      variant5: hover
    })
  }

  updateHover6(hover) {
    this.setState({
      variant6: hover
    })
  }

  updateHover7(hover) {
    this.setState({
      variant7: hover
    })
  }

  updateHover8(hover) {
    this.setState({
      variant8: hover
    })
  }

  updateHover9(hover) {
    this.setState({
      variant9: hover
    })
  }

  componentDidMount() {
    this.getOrderCreated();
    this.getOrderReceived();
    this.getOrderProcessing();
    this.getReadyToDeliver();
    this.getJointCheck();
    this.getLoadingProcess();
    this.getMaterialDispatch();
    this.getMaterialOnHold();
    document.title = 'Warehouse Dashboard | BAM';
  }

  getWHManagementID() {
    let _id = new URLSearchParams(window.location.search).get("_id");
    this.getDataFromAPINODE("/whManagement/warehouse/" + _id).then((res) => {
      // console.log("all data ", res.data);
      if (res.data !== undefined) {
        this.setState({ wh_data: res.data.data });
      } else {
        this.setState({ wh_data: [] });
      }
    });
  }

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL+url, {
        headers: {'Content-Type':'application/json'},
        auth: {
          username: username,
          password: password
        }
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_Node+url, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }



    getOrderCreated() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_mr_status":"MR REQUESTED", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Order Created", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({order_created : items.totalResults});
        }
      })
    }

    getOrderReceived() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_mr_status": "MR APPROVED", "current_milestones":"MS_ORDER_RECEIVED", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Order Received", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({order_received : items.totalResults});
        }
      })
    }

    getOrderProcessing() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_mr_status": "ORDER PROCESSING START", "current_milestones": "MS_ORDER_RECEIVED", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Order Processing", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({order_processing : items.totalResults});
        }
      })
    }

    getReadyToDeliver() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"$or" : [{"current_mr_status": "LACK OF MATERIAL"}, {"current_mr_status": "LOM CONFIRMED (WAIT FOR COMPLETION)"}], "current_milestones": "MS_READY_TO_DELIVER"}, "origin.value" : "'+ this.props.match.params.slug +'"').then(res => {
        console.log("Ready To Deliver", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({ready_to_deliver : items.totalResults});
        }
      })
    }

    getJointCheck() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_milestones": "MS_READY_TO_DELIVER", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Joint Check", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({joint_check : items.totalResults});
        }
      })
    }

    getLoadingProcess() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_milestones": "MS_JOINT_CHECK", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Loading Process", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({loading_process : items.totalResults});
        }
      })
    }

    getMaterialDispatch() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_milestones":"MS_DISPATCH", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Material Dispatch", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({material_dispatch : items.totalResults});
        }
      })
    }

    getMaterialOnHold() {
      this.getDataFromAPINODE('/matreq?lmt=1&pg=1&q={"current_mr_status":"LACK OF MATERIAL", "origin.value" : "'+ this.props.match.params.slug +'"}').then(res => {
        console.log("Material On Hold", res);
        if(res.data !== undefined) {
          const items = res.data;
          this.setState({material_on_hold : items.totalResults});
        }
      })
    }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/order-received-per-wh/"+this.props.match.params.slug} onMouseEnter={() => this.updateHover1("")} onMouseLeave={() => this.updateHover1("inverse")}>
              <Widget color="primary" variant={this.state.variant1} header={this.state.order_received} mainText="Order Received" smallText="The initial status of the MR after being approved by the supply team and ready to be processed by the warehouse." imageSource={this.state.img_1}/>
            </Link>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/order-processing-per-wh/"+this.props.match.params.slug} href="order-processing" onMouseEnter={() => this.updateHover2("")} onMouseLeave={() => this.updateHover2("inverse")}>
              <Widget color="primary" variant={this.state.variant2} header={this.state.order_processing} mainText="Order Processing" smallText="The status in which the warehouse prepares the material and will send notification for the project team when there is lack of material." imageSource={this.state.img_2}/>
            </Link>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/ready-to-deliver-per-wh/"+this.props.match.params.slug} href="ready-to-deliver" onMouseEnter={() => this.updateHover3("")} onMouseLeave={() => this.updateHover3("inverse")}>
              <Widget color="primary" variant={this.state.variant3} header={this.state.ready_to_deliver} mainText="Ready To Deliver" smallText="The status after MR has been processed or in the warehouse staging area. The MR in this status should have either complete material or not complete confirmed by the project team." imageSource={this.state.img_3}/>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/joint-check-per-wh/"+this.props.match.params.slug} href="joint-check" onMouseEnter={() => this.updateHover4("")} onMouseLeave={() => this.updateHover4("inverse")}>
              <Widget color="primary" variant={this.state.variant4} header={this.state.joint_check} mainText="Joint Check" smallText="The status in which the warehouse team conduct a verification together with DSP and ASP to make sure that the MR will be delivered according to the plant specification." imageSource={this.state.img_4}/>
            </Link>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/loading-process-per-wh/"+this.props.match.params.slug} href="loading-process" onMouseEnter={() => this.updateHover5("")} onMouseLeave={() => this.updateHover5("inverse")}>
              <Widget color="primary" variant={this.state.variant5} header={this.state.loading_process} mainText="Loading Process" smallText="The status in which the MR will be delivered and has been loaded to the delivery truck. The DSP driver is only able to submit delivery information when the MR is in this status." imageSource={this.state.img_5}/>
            </Link>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Link to={"/material-dispatch-per-wh/"+this.props.match.params.slug} href="material-dispatch" onMouseEnter={() => this.updateHover6("")} onMouseLeave={() => this.updateHover6("inverse")}>
              <Widget color="primary" variant={this.state.variant6} header={this.state.material_dispatch} mainText="Material Dispatch" smallText="The status after the DSP driver submitted the delivery information to the server and the MR is being delivered by the DSP." imageSource={this.state.img_6}/>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="4">
            <a href="#" onMouseEnter={() => this.updateHover7("")} onMouseLeave={() => this.updateHover7("inverse")}>
              <Widget color="danger" variant={this.state.variant7} header={this.state.material_on_hold} mainText="Material On Hold" smallText="The status when the MR is in LOM and has not been confirmed by project whether to send with LOM or wait until it's completed" imageSource={this.state.img_7}/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#" onMouseEnter={() => this.updateHover8("")} onMouseLeave={() => this.updateHover8("inverse")}>
              <Widget color="danger" variant={this.state.variant8} header="999" mainText="Wait For Completed" smallText="The status when the MR is in LOM and needs to wait until the materials are completed" imageSource={this.state.img_8}/>
            </a>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <a href="#" onMouseEnter={() => this.updateHover9("")} onMouseLeave={() => this.updateHover9("inverse")}>
              <Widget color="danger" variant={this.state.variant9} header="999" mainText="Sent With LOM" smallText="The status when the MR is in LOM but the project decided to send with LOM" imageSource={this.state.img_9}/>
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData
  }
}

export default connect(mapStateToProps)(WHDashboardDet);
