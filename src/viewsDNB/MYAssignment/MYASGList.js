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
  Modal,
  ModalBody,
  Row,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { numToSSColumn } from "../../helper/basicFunction";
import {
  convertDateFormatfull,
  convertDateFormat,
} from "../../helper/basicFunction";
import { getDatafromAPINODE } from "../../helper/asyncFunctionDigi";
import { connect } from "react-redux";
import './LMRMY.css';

const header_model = [
  "lmr_id",
  "header_text",
  "po",
  "lmr_issued_by",
  "project_name",
  "vendor_name",
];

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
class MYASGList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roleUser: this.props.dataLogin.role,
      tokenUser: this.props.dataLogin.token,
      lmr_list: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      filter_list: {},
      mr_all: [],
      lmr_list_filter: [],
      lmr_list_pagination: [],
      modal_loading: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    // this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.downloadMRlist = this.downloadMRlist.bind(this);
    this.getMRList = this.getMRList.bind(this);
    this.getAllMR = this.getAllMR.bind(this);
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE_Digi + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  exportLMR = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const all_lmr = this.state.lmr_list_filter;

    let headerRow = [
      "LMR ID",
      "Header Text",
      "Payment Terms",
      "GL Account",
      "Vendor Name",
      "Project Name",
      "Grand Total Amount",
      "Requisitioner",
      "L1 Approver",
      "L2 Approver",
      "L3 Approver",
      "Request Type",
    ];
    ws.addRow(headerRow);
    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    for (let i = 0; i < all_lmr.length; i++) {
      let e = all_lmr[i];
      ws.addRow([
        e.lmr_id,
        e.header_text,
        e.payment_term,
        e.gl_account,
        e.vendor_name,
        e.project_name,
        e.total_price,
        e.lmr_issued_by,
        e.l1_approver,
        e.l2_approver,
        e.l3_approver,
        e.request_type,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All LMR.xlsx");
  };

  downloadLMRlist = async () => {
    this.toggleLoading();
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const all_lmr_list = await getDatafromAPINODE('/aspassignment/getAspAssignment?srt=_id:-1&noPg=1', this.state.tokenUser)

    if (all_lmr_list !== undefined) {
      const allLMR = all_lmr_list.data.data;

      let headerRow = [
        "LMR ID",
        "Header Text",
        "Payment Terms",
        "GL Account",
        "Vendor Name",
        "Project Name",
        "Grand Total Amount",
        "Requisitioner",
        "L1 Approver",
        "L2 Approver",
        "L3 Approver",
        "Request Type",
      ];
      ws.addRow(headerRow);

      for (let i = 1; i < headerRow.length + 1; i++) {
        ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
      }

      for (let i = 0; i < allLMR.length; i++) {
        let po_number = '';
        // await getDatafromAPITH('/prpo_data?where={"LMR_No":"' + allLMR[i].lmr_id + '"}').then((res) => {
        //   if (res.data !== undefined) {
        //     po_number = res.data._items[0].PO_Number;
        //   }
        // });
        ws.addRow([allLMR[i].lmr_id, allLMR[i].header_text, allLMR[i].payment_term, allLMR[i].gl_account, allLMR[i].vendor_name, allLMR[i].project_name, allLMR[i].total_price, allLMR[i].lmr_issued_by, allLMR[i].l1_approver, allLMR[i].l2_approver, allLMR[i].l3_approver, allLMR[i].request_type])
      }

      const allocexport = await wb.xlsx.writeBuffer();
      saveAs(new Blob([allocexport]), 'LMR List.xlsx');
    } else {
      this.setState({
        action_status: "failed",
        action_message: "Cannot get LMR Data!",
      });
    }

    this.toggleLoading();
  }

  getMRList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list["lmr_id"] !== null &&
      this.state.filter_list["lmr_id"] !== undefined &&
      filter_array.push(
        '"lmr_id":{"$regex" : "' +
        this.state.filter_list["lmr_id"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["header_text"] !== null &&
      this.state.filter_list["header_text"] !== undefined &&
      filter_array.push(
        '"header_text":{"$regex" : "' +
        this.state.filter_list["header_text"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["po"] !== null &&
      this.state.filter_list["po"] !== undefined &&
      filter_array.push(
        '"po":{"$regex" : "' +
        this.state.filter_list["po"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["lmr_issued_by"] !== null &&
      this.state.filter_list["lmr_issued_by"] !== undefined &&
      filter_array.push(
        '"lmr_issued_by":{"$regex" : "' +
        this.state.filter_list["lmr_issued_by"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["project_name"] !== null &&
      this.state.filter_list["project_name"] !== undefined &&
      filter_array.push(
        '"project_name":{"$regex" : "' +
        this.state.filter_list["project_name"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["vendor_name"] !== null &&
      this.state.filter_list["vendor_name"] !== undefined &&
      filter_array.push(
        '"vendor_name":{"$regex" : "' +
        this.state.filter_list["vendor_name"] +
        '", "$options" : "i"}'
      );
    if (this.state.roleUser.includes('BAM-IE Lead')) {
      filter_array.push('"gl_type":{"$nin":["NDO"]}');
    }
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE('/aspassignment/getAspAssignment?srt=_id:-1&q=' + whereAnd + '&lmt=' + maxPage + '&pg=' + page, this.state.tokenUser).then((res) => {
      console.log("MR List Sorted", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        // this.setState({ lmr_list: items, totalData: totalData }, () =>
        //   this.filterbyService(this.state.lmr_list, this.state.roleUser)
        // );
        this.setState({ lmr_list: items, totalData: totalData });
      }
    });
  }

  filterbyService(lmr_list, role) {
    console.log("role ", this.state.roleUser[1]);
    // const filter_list = this.state.lmr_list_filter
    const not_ie_lead = ["ITC + transport", "NDO", "Survey", "Integration"];
    const ie_lead = ["ITC + transport", "Survey", "Integration"];
    if (role.includes("BAM-IE Lead") === true) {
      lmr_list.filter((e) => ie_lead.includes(e.gl_type));
      this.setState({ lmr_list_filter: lmr_list }, () =>
        this.dataViewPagination(this.state.lmr_list_filter)
      );
    } else {
      lmr_list.filter((e) => not_ie_lead.includes(e.gl_type));
      this.setState({ lmr_list_filter: lmr_list }, () =>
        this.dataViewPagination(this.state.lmr_list_filter)
      );
    }
  }

  dataViewPagination(dataView) {
    let perPage = this.state.perPage;
    let dataPage = [];
    if (perPage !== dataView.length) {
      let pageNow = this.state.activePage - 1;
      dataPage = dataView.slice(pageNow * perPage, (pageNow + 1) * perPage);
    } else {
      dataPage = dataView;
    }
    console.log("dataPage", dataPage);
    this.setState({ lmr_list_pagination: dataPage });
  }

  getAllMR() {
    let filter_array = [];
    this.getDataFromAPINODE("/matreq?noPg=1").then((res) => {
      console.log("MR List All", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ mr_all: items });
      }
    });
  }

  numToSSColumn(num) {
    var s = "",
      t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = ((num - t) / 26) | 0;
    }
    return s || undefined;
  }

  async downloadMRlist() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const allMR = this.state.mr_all;

    let headerRow = [
      "MR ID",
      "Project Name",
      "CD ID",
      "Site ID",
      "Site Name",
      "Current Status",
      "Current Milestone",
      "DSP",
      "ETA",
      "Created By",
      "Updated On",
      "Created On",
    ];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + "1").font = { size: 11, bold: true };
    }

    for (let i = 0; i < allMR.length; i++) {
      ws.addRow([
        allMR[i].mr_id,
        allMR[i].project_name,
        allMR[i].cd_id,
        allMR[i].site_info[0].site_id,
        allMR[i].site_info[0].site_name,
        allMR[i].current_mr_status,
        allMR[i].current_milestones,
        allMR[i].dsp_company,
        allMR[i].eta,
        "",
        allMR[i].updated_on,
        allMR[i].created_on,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "MR List.xlsx");
  }

  componentDidMount() {
    this.getMRList();
    // this.getAllMR();
    // console.log('token ', this.props.dataLogin.token)
    document.title = "LMR List | BAM";
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getMRList();
    });
  }

  handleFilterList = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    let dataFilter = this.state.filter_list;
    dataFilter[index] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    });
  };

  onChangeDebounced(e) {
    this.getMRList();
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 6; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                // className="col-sm-3"
                type="text"
                placeholder="Search"
                onChange={this.handleFilterList}
                value={this.state.filter_list[header_model[i]]}
                name={header_model[i]}
                size="sm"
              />
            </InputGroup>
          </div>
        </td>
      );
    }
    return searchBar;
  };

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    const downloadMR = {
      float: "right",
      marginRight: "10px",
    };

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2" }}>
                  <i
                    className="fa fa-align-justify"
                    style={{ marginRight: "8px" }}
                  ></i>
                  LMR List Digi
                </span>
                <Link to={"/lmr-creation"}>
                  <Button
                    color="success"
                    style={{ float: "right", marginLeft: "8px" }}
                    size="sm"
                  >
                    <i
                      className="fa fa-plus-square"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Create LMR
                  </Button>
                </Link>
                &nbsp;&nbsp;&nbsp;
                <Button
                  color="warning"
                  style={{ float: "right", marginLeft: "8px" }}
                  size="sm"
                  onClick={this.downloadLMRlist}
                >
                  <i className="fa fa-download" style={{ marginRight: "8px" }}></i>Download LMR List
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead className="text-center">
                    <tr>
                      <th style={{ minWidth: "100px", verticalAlign: "middle" }} rowSpan="2">Action</th>
                      <th style={{ minWidth: "150px" }}>LMR ID</th>
                      <th style={{ minWidth: "150px" }}>Header Text</th>
                      <th style={{ minWidth: "150px" }}>PO</th>
                      <th style={{ minWidth: "150px" }}>Requisitioner</th>
                      <th style={{ minWidth: "150px" }}>Project Name</th>
                      <th style={{ minWidth: "150px" }}>Vendor Name</th>
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {this.state.lmr_list !== undefined &&
                      this.state.lmr_list.map((e) => (
                        <tr>
                          <td>
                            <Link to={"/lmr-detail/" + e._id}>
                              <Button color="info" size="sm">
                                <i className="fa fa-info-circle" style={{ marginRight: "8px" }}></i>Detail
                              </Button>
                            </Link>
                          </td>
                          <td>{e.lmr_id}</td>
                          <td>{e.header_text}</td>
                          <td>{e.po}</td>
                          <td>{e.lmr_issued_by}</td>
                          <td>{e.project_name}</td>
                          <td>{e.vendor_name}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>Showing {this.state.lmr_list.length > 0 ? this.state.activePage * 10 - 9 : "0"} to {this.state.activePage * 10 > this.state.totalData ? this.state.totalData : this.state.activePage * 10} of {this.state.totalData} entries</small>
                </div>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={this.state.perPage}
                  totalItemsCount={this.state.totalData}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal Loading */}
        <Modal
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm " + this.props.className}
        >
          <ModalBody>
            <div style={{ textAlign: "center" }}>
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>Loading ...</div>
            <div style={{ textAlign: "center" }}>System is processing ...</div>
          </ModalBody>
          {/* <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter> */}
        </Modal>
        {/* end Modal Loading */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
    SidebarMinimize: state.minimizeSidebar,
  };
};

export default connect(mapStateToProps)(MYASGList);
