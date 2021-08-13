import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Button,
} from "reactstrap";
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { Link } from "react-router-dom";
import Widget from "./Widget";
import "../wh_css.css";
import { connect } from "react-redux";
import axios from "axios";
import Loading from '../../components/Loading'

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

class WarehouseDashboardExt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      vendor_name : this.props.dataLogin.vendor_name,
      vendor_code : this.props.dataLogin.vendor_code,
      collapse: true,
      fadeIn: true,
      timeout: 300,
      search: null,
      all_data: [],
      wh_id: null,
      wh_name: null,
      wh_manager: null,
      wh_address: null,
      wh_owner: null,
      modal_loading: false,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => {
      return { fadeIn: !prevState };
    });
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  SearchFilter = (e) => {
    let keyword = e.target.value;
    this.setState({ search: keyword });
  };

  componentDidMount() {
    this.getWHStockList();
    document.title = "Warehouse Dashboard | BAM";
  }

  //* API CALL
  async getDatafromAPIEXEL(url) {
    try {
      let respond = await axios.get(API_URL_XL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameXL,
          password: passwordXL,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Get Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
    }
  }

  async getDatafromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  async postDatatoAPINODE(url, data) {
    try {
      let respond = await axios.post(API_URL_NODE + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        // console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      // console.log("respond Post Data err", err);
      return respond;
    }
  }

  async patchDatatoAPINODE(url, data) {
    try {
      let respond = await axios.patch(API_URL_NODE + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond patch Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond patch Data err", err);
      return respond;
    }
  }

  async deleteDataFromAPINODE(url) {
    try {
      let respond = await axios.delete(API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond delete Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond delete Data err", err);
      return respond;
    }
  }

  // * Get Data

  getASPList() {
    // switch (this.props.dataLogin.account_id) {
    //   case "xl":
    this.getDatafromAPIEXEL("/vendor_data_non_page").then((res) => {
      // console.log("asp data ", res.data);
      if (res.data !== undefined) {
        this.setState({ asp_data: res.data._items });
      } else {
        this.setState({ asp_data: [] });
      }
    });
    //     break;
    //   default:
    //     break;
    // }
  }

  getWHStockList() {
    this.toggleLoading();
    let filter_array = [];
    filter_array.push('"$or" : [{"wh_type":{"$regex" : "asp", "$options" : "i"}}, {"wh_type":{"$regex" : "dsp", "$options" : "i"}} ]');
    if((this.state.userRole.findIndex(e => e === "BAM-ASP") !== -1 || this.state.userRole.findIndex(e => e === "BAM-ASP Management") !== -1 || this.state.userRole.findIndex(e => e === "BAM-Mover") !== -1) && this.state.userRole.findIndex(e => e === "BAM-ASPWarehouse") !== -1 && this.state.userRole.findIndex(e => e === "Admin") === -1){
      filter_array.push('"owner" : "'+this.state.vendor_code+'"');
    }
    let whereAnd = '{' + filter_array.join(',') + '}';
    this.getDatafromAPINODE('/whManagement/warehouse?noPg=1&q='+whereAnd).then((res) => {
      if (res.data !== undefined) {
        this.setState({
          all_data: res.data.data,
          prevPage: this.state.activePage,
          total_dataParent: res.data.totalResults,
        });
        this.toggleLoading();
      } else {
        this.setState({
          all_data: [],
          total_dataParent: 0,
          prevPage: this.state.activePage,
        });
        this.toggleLoading();
      }
    });
  }

  // loading = () => (
  //   <div className="animated fadeIn pt-1 text-center">Loading...</div>
  // );

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <Row>
              <Col>
                <InputGroup className="input-prepend">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText
                      style={{
                        backgroundColor: "rgba(100,181,246 ,1)",
                        borderColor: "rgba(144,164,174 ,1)",
                      }}
                    >
                      <i className="fa fa-search"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    className="search-box-whdashboard"
                    type="text"
                    name="filter"
                    placeholder="Filter Warehouse"
                    onChange={(e) => this.SearchFilter(e)}
                  />
                </InputGroup>
              </Col>
            </Row>
          </CardHeader>
        </Card>

        <Row>
          {this.state.all_data
            .filter((e) => {
              if (this.state.search === null) {
                return e;
              } else if (
                e.wh_name
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) ||
                e.wh_id
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) ||
                e.wh_manager
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) ||
                e.address
                  .toLowerCase()
                  .includes(this.state.search.toLowerCase()) ||
                e.owner.toLowerCase().includes(this.state.search.toLowerCase())
              ) {
                return e;
              }
            })
            .map((e) => (
              <React.Fragment key={e._id + "frag"}>
                <Col xs="12" sm="6" md="4">
                  <Card>
                    <CardHeader>
                      <Link
                        to={{
                          pathname:
                            "/wh-dashboard-ext/wh-dashboard-ext-det/" +
                            e.wh_id
                        }}
                      >
                        {/* <a href="wh-dashboard-eid"> */}
                        <h6>
                          {e.wh_name} {e.wh_id}
                        </h6>
                        {/* </a> */}
                      </Link>
                      {/* <div className="card-header-actions">
                        <a
                          className="card-header-action btn btn-minimize"
                          data-target="#collapseExample"
                          onClick={this.toggle}
                        >
                          <i className="icon-arrow-up"></i>
                        </a>
                      </div> */}
                    </CardHeader>
                    <Collapse isOpen={this.state.collapse} id="collapseExample">
                      <CardBody>
                        <p>
                          <strong>WH Manager</strong>
                        </p>{" "}
                        <p>{e.wh_manager}</p>
                        <p>
                          <strong>WH Address</strong>
                        </p>{" "}
                        <p>{e.address}</p>
                        <p>
                          <strong>Owner</strong>
                        </p>{" "}
                        <p>{e.owner}</p>
                      </CardBody>
                      <CardFooter>
                        <Row className="align-items-center">
                          <Col col="2" xl className="mb-3 mb-xl-0">
                          <Link
                              to={{
                                // pathname:"/wh-gr-eid/" +e.wh_id,
                                pathname: "wh-dashboard-ext/wh-gr-ext-per-wh/"+e.wh_id
                              }}>
                            <Button
                              block
                              color="success"
                              size="sm"
                              className="btn-pill"
                            >
                              GR
                            </Button>
                            </Link>
                          </Col>

                          <Col col="2" xl className="mb-3 mb-xl-0">
                          <Link
                              to={{
                                // pathname:"/wh-gi-eid/" +e.wh_id,
                                pathname: "wh-dashboard-ext/wh-gi-ext-per-wh/"+e.wh_id
                              }}>
                            <Button
                              block
                              color="warning"
                              size="sm"
                              className="btn-pill"
                            >
                              GI
                            </Button>
                            </Link>
                          </Col>
                        </Row>
                      </CardFooter>
                    </Collapse>
                  </Card>
                </Col>
              </React.Fragment>
            ))}
        </Row>
        {/* Modal Loading */}
        <Loading isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}>
        </Loading>
        {/* end Modal Loading */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(WarehouseDashboardExt);
