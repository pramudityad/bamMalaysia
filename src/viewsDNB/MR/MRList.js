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
} from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import debounce from "lodash.debounce";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { connect } from "react-redux";
import ActionType from "../../redux/reducer/globalActionType";
import {
  convertDateFormatfull,
  convertDateFormat,
} from "../../helper/basicFunction";
import { getDatafromAPIEXEL } from "../../helper/asyncFunction";

import Loading from "../components/Loading";

const API_URL = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const username = "bamidadmin@e-dpm.com";
const password = "F760qbAg2sml";

class MRList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      vendor_name: this.props.dataLogin.vendor_name,
      vendor_code: this.props.dataLogin.vendor_code,
      mr_list: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      filter_list: new Array(14).fill(""),
      mr_all: [],
      modal_loading: false,
      dropdownOpen: new Array(1).fill(false),
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.downloadMRlist = this.downloadMRlist.bind(this);
    this.getMRList = this.getMRList.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.downloadAllMRMigration = this.downloadAllMRMigration.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // this.getAllMR = this.getAllMR.bind(this);
  }

  toggleDropdown(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: username,
          password: password,
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

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
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

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  getMRList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"mr_id":{"$regex" : "' +
          this.state.filter_list[0] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"project_name":{"$regex" : "' +
          this.state.filter_list[1] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"cust_del.cd_id":{"$regex" : "' +
          this.state.filter_list[2] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"site_info.site_id":{"$regex" : "' +
          this.state.filter_list[3] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"site_info.site_name":{"$regex" : "' +
          this.state.filter_list[4] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"current_mr_status":{"$regex" : "' +
          this.state.filter_list[5] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"current_milestones":{"$regex" : "' +
          this.state.filter_list[6] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"site_info.site_region":{"$regex" : "' +
          this.state.filter_list[7] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[8] !== "" &&
      filter_array.push(
        '"dsp_company":{"$regex" : "' +
          this.state.filter_list[8] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[9] !== "" &&
      filter_array.push(
        '"eta":{"$regex" : "' +
          this.state.filter_list[9] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[10] !== "" &&
      filter_array.push(
        '"creator":{"$regex" : "' +
          this.state.filter_list[10] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[11] !== "" &&
      filter_array.push(
        '"updated_on":{"$regex" : "' +
          this.state.filter_list[11] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[12] !== "" &&
      filter_array.push(
        '"created_on":{"$regex" : "' +
          this.state.filter_list[12] +
          '", "$options" : "i"}'
      );
    this.props.match.params.whid !== undefined &&
      filter_array.push(
        '"origin.value" : "' + this.props.match.params.whid + '"'
      );
    if (
      (this.state.userRole.findIndex((e) => e === "BAM-ASP") !== -1 ||
        this.state.userRole.findIndex((e) => e === "BAM-ASP Management") !==
          -1 ||
        this.state.userRole.findIndex((e) => e === "BAM-Mover") !== -1) &&
      this.state.userRole.findIndex((e) => e === "Admin") === -1
    ) {
      filter_array.push(
        '"$or" : [{"dsp_company_code" : "' +
          this.state.vendor_code +
          '"}, {"dsp_company" : "' +
          this.state.vendor_name +
          '"}]'
      );
    }
    filter_array.push(
      '"$and" : [{"mr_delivery_type_code" : {"$ne" : "A1"}}, {"mr_delivery_type_code" : {"$ne" : "A2"}}, {"mr_delivery_type_code" : {"$ne" : "B1"}}, {"mr_delivery_type_code" : {"$ne" : "C1"}}]'
    );
    let whereAnd = "{" + filter_array.join(",") + "}";
    this.getDataFromAPINODE(
      "/matreq?srt=_id:-1&q=" + whereAnd + "&lmt=" + maxPage + "&pg=" + page
    ).then((res) => {
      console.log("MR List Sorted", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ mr_list: items, totalData: totalData });
      }
    });
  }

  async getAllMR() {
    let mrList = [];
    let filter_array = [];
    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"mr_id":{"$regex" : "' +
          this.state.filter_list[0] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"project_name":{"$regex" : "' +
          this.state.filter_list[1] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"cust_del.cd_id":{"$regex" : "' +
          this.state.filter_list[2] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"site_info.site_id":{"$regex" : "' +
          this.state.filter_list[3] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"site_info.site_name":{"$regex" : "' +
          this.state.filter_list[4] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"current_mr_status":{"$regex" : "' +
          this.state.filter_list[5] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"current_milestones":{"$regex" : "' +
          this.state.filter_list[6] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"site_info.site_region":{"$regex" : "' +
          this.state.filter_list[7] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[8] !== "" &&
      filter_array.push(
        '"dsp_company":{"$regex" : "' +
          this.state.filter_list[8] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[9] !== "" &&
      filter_array.push(
        '"eta":{"$regex" : "' +
          this.state.filter_list[9] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[10] !== "" &&
      filter_array.push(
        '"creator":{"$regex" : "' +
          this.state.filter_list[10] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[11] !== "" &&
      filter_array.push(
        '"updated_on":{"$regex" : "' +
          this.state.filter_list[11] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[12] !== "" &&
      filter_array.push(
        '"created_on":{"$regex" : "' +
          this.state.filter_list[12] +
          '", "$options" : "i"}'
      );
    this.props.match.params.whid !== undefined &&
      filter_array.push(
        '"origin.value" : "' + this.props.match.params.whid + '"'
      );
    filter_array.push(
      '"$and" : [{"mr_delivery_type_code" : {"$ne" : "A1"}}, {"mr_delivery_type_code" : {"$ne" : "A2"}}, {"mr_delivery_type_code" : {"$ne" : "B1"}}, {"mr_delivery_type_code" : {"$ne" : "C1"}}]'
    );
    let whereAnd = "{" + filter_array.join(",") + "}";
    let res = await this.getDataFromAPINODE(
      "/matreq?srt=_id:-1&noPg=1&q=" + whereAnd
    );
    if (res.data !== undefined) {
      const items = res.data.data;
      mrList = res.data.data;
      return mrList;
      // this.setState({ mr_all: items });
    } else {
      return [];
    }
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

  async getDataCDID(data_mr) {
    let arrayCD = [];
    arrayCD = data_mr
      .filter((e) => e.cust_del !== undefined)
      .map((e) => e.cust_del)
      .reduce((l, n) => l.concat(n), []);
    let array_cd_id = [...new Set(arrayCD.map(({ cd_id }) => cd_id))];
    let dataCDID = [];
    let getNumberPage = Math.ceil(array_cd_id.length / 20);
    for (let i = 0; i < getNumberPage; i++) {
      let DataPaginationWPID = array_cd_id.slice(i * 20, (i + 1) * 20);
      let array_in_cdid = '"' + DataPaginationWPID.join('", "') + '"';
      let projection =
        '&projection={"WP_ID" : 1, "C1003_WBS_HW" : 1, "C1008_WBS_HWAC" : 1, "C1013_WBS_LCM" : 1, "C1018_WBS_PNRO" : 1, "C1024_WBS_PNDO" : 1, "C1032_WBS_HW_Bulk" : 1, "C1033_WBS_LCM_Bulk" : 1, "C1034_WBS_PowHW_Site_Basis" : 1, "C1035_WBS_PowLCM_Site_Basis" : 1, "C1036_WBS_Kathrein" : 1}';
      const getWPID = await getDatafromAPIEXEL(
        '/custdel_sorted?where={"WP_ID":{"$in" : [' +
          array_in_cdid +
          "]}}" +
          projection,
        this.state.tokenUser
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        dataCDID = dataCDID.concat(getWPID.data._items);
      }
    }
    return dataCDID;
  }

  async downloadMRlist() {
    this.toggleLoading();
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const allMR = await this.getAllMR();

    const dataCDID = await this.getDataCDID(allMR);

    let headerRow = [
      "MR ID",
      "MR MITT ID",
      "MR Type",
      "MR Delivery Type",
      "Project Name",
      "CD ID",
      "Tower ID",
      "Tower Name",
      "Current Status",
      "Current Milestone",
      "DSP",
      "ETA",
      "MR MITT Created On",
      "MR MITT Created By",
      "Updated On",
      "Created On",
      "WP ID for WBS",
      "WBS HW for GI",
      "WBS HWAC (License)",
      "WBS LCM",
      "WBS PNRO",
      "WBS PNDO",
      "WBS HW Bulk",
      "WBS LCM Bulk for GI",
      "WBS PowHW Site Basis",
      "WBS PowLCM Site Basis",
      "WBS Kathrein",
    ];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + "1").font = { size: 11, bold: true };
    }

    for (let i = 0; i < allMR.length; i++) {
      let dataCDIDIdx = {};
      if (
        allMR[i].cust_del !== undefined &&
        allMR[i].cust_del[0] !== undefined
      ) {
        dataCDIDIdx = dataCDID.filter((dc) =>
          allMR[i].cust_del.map((cdm) => cdm.cd_id).includes(dc.WP_ID)
        );
        if (dataCDIDIdx.length !== 0) {
          let dataCDID_5 = dataCDIDIdx.find((dci) => /_5$/.test(dci.WP_ID));
          if (dataCDID_5 === undefined) {
            dataCDIDIdx = dataCDIDIdx[0];
          } else {
            dataCDIDIdx = dataCDID_5;
          }
        } else {
          dataCDIDIdx = {};
        }
      }

      const creator_mr_mitt = allMR[i].mr_status.find(
        (e) =>
          e.mr_status_name === "PLANTSPEC" &&
          e.mr_status_value === "NOT ASSIGNED"
      );
      ws.addRow([
        allMR[i].mr_id,
        allMR[i].mr_mitt_no,
        allMR[i].mr_type,
        allMR[i].mr_delivery_type,
        allMR[i].project_name,
        allMR[i].cust_del !== undefined
          ? allMR[i].cust_del.map((cd) => cd.cd_id).join(", ")
          : allMR[i].cd_id,
        allMR[i].site_info[0] !== undefined
          ? allMR[i].site_info[0].site_id
          : null,
        allMR[i].site_info[0] !== undefined
          ? allMR[i].site_info[0].site_name
          : null,
        allMR[i].current_mr_status,
        allMR[i].current_milestones,
        allMR[i].dsp_company,
        new Date(allMR[i].eta),
        creator_mr_mitt !== undefined
          ? new Date(creator_mr_mitt.mr_status_date)
          : null,
        creator_mr_mitt !== undefined
          ? creator_mr_mitt.mr_status_updater
          : null,
        new Date(allMR[i].updated_on),
        new Date(allMR[i].created_on),
        dataCDIDIdx.WP_ID,
        dataCDIDIdx.C1003_WBS_HW,
        dataCDIDIdx.C1008_WBS_HWAC,
        dataCDIDIdx.C1013_WBS_LCM,
        dataCDIDIdx.C1018_WBS_PNRO,
        dataCDIDIdx.C1024_WBS_PNDO,
        dataCDIDIdx.C1032_WBS_HW_Bulk,
        dataCDIDIdx.C1033_WBS_LCM_Bulk,
        dataCDIDIdx.C1034_WBS_PowHW_Site_Basis,
        dataCDIDIdx.C1035_WBS_PowLCM_Site_Basis,
        dataCDIDIdx.C1036_WBS_Kathrein,
      ]);
      const getRowLast = ws.lastRow._number;
      ws.getCell("M" + getRowLast).numFmt = "YYYY-MM-DD";
      ws.getCell("O" + getRowLast).numFmt = "YYYY-MM-DD";
      ws.getCell("P" + getRowLast).numFmt = "YYYY-MM-DD";
      if (creator_mr_mitt !== undefined && creator_mr_mitt !== null) {
        ws.getCell("L" + getRowLast).numFmt = "YYYY-MM-DD";
      }
    }
    this.toggleLoading();
    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "MR List.xlsx");
  }

  componentDidMount() {
    this.props.SidebarMinimizer(true);
    this.getMRList();
    // this.getAllMR();
    document.title = "MR List | BAM";
  }

  componentWillUnmount() {
    this.props.SidebarMinimizer(false);
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getMRList();
    });
  }

  handleFilterList(e) {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list;
    dataFilter[parseInt(index)] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    });
  }

  async downloadAllMRMigration() {
    let allMRList = [];
    let getMR = await this.getDataFromAPINODE(
      '/matreq?noPg=1&srt=_id:-1&q={"mr_mitt_no" : {"$exists" : 1}, "mr_mitt_no" : {"$ne" : null}}'
    );
    if (getMR.data !== undefined) {
      allMRList = getMR.data.data;
    }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let headerRow = [
      "mr_bam_id",
      "mr_mitt_no",
      "ps_mitt_no",
      "plantspec_assigned_date",
      "plantspec_assigned_by",
      "mr_requested_date",
      "mr_requested_by",
      "mr_approved_date",
      "mr_approved_by",
      "order_processing_finish_date",
      "order_processing_finish_by",
      "rtd_confirmed_date",
      "rtd_confirmed_by",
      "joint_check_finish_date",
      "joint_check_finish_by",
      "loading_process_finish_date",
      "loading_process_finish_by",
      "mr_dispatch_date",
      "mr_dispatch_by",
      "mr_on_site_date",
      "mr_on_site_by",
    ];
    ws.addRow(headerRow);

    for (let i = 0; i < allMRList.length; i++) {
      let rowAdded = [allMRList[i].mr_id, allMRList[i].mr_mitt_no];
      ws.addRow(rowAdded);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "MR List For Status Migration from SH Template.xlsx"
    );
  }

  onChangeDebounced(e) {
    this.getMRList();
    // this.getAllMR();
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 13; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ width: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                placeholder="Search"
                onChange={this.handleFilterList}
                value={this.state.filter_list[i]}
                name={i}
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
                  ></i>{" "}
                  MR List
                </span>
                {this.state.userRole.findIndex((e) => e === "BAM-ASP") === -1 &&
                  this.state.userRole.findIndex(
                    (e) => e === "BAM-ASP Management"
                  ) === -1 &&
                  this.state.userRole.findIndex((e) => e === "BAM-Mover") ===
                    -1 && (
                    <React.Fragment>
                      {this.state.userRole.findIndex(
                        (e) => e === "BAM-Engineering"
                      ) === -1 &&
                        this.state.userRole.findIndex(
                          (e) => e === "BAM-Project Planner"
                        ) === -1 &&
                        this.state.userRole.findIndex(
                          (e) => e === "BAM-Warehouse"
                        ) === -1 &&
                        this.state.userRole.findIndex(
                          (e) => e === "BAM-LDM"
                        ) === -1 && (
                          <React.Fragment>
                            <Link to={"/mr-creation"}>
                              <Button
                                color="success"
                                style={{ float: "right" }}
                                size="sm"
                              >
                                <i
                                  className="fa fa-plus-square"
                                  style={{ marginRight: "8px" }}
                                ></i>
                                Create MR
                              </Button>
                            </Link>
                            <Link to={"/bulk-mr-creation"}>
                              <Button
                                color="success"
                                style={{ float: "right", marginRight: "8px" }}
                                size="sm"
                              >
                                <i
                                  className="fa fa-plus-square"
                                  style={{ marginRight: "8px" }}
                                ></i>
                                Create MR Bulk
                              </Button>
                            </Link>
                          </React.Fragment>
                        )}
                      <Link to={"/mr-report"}>
                        <Button
                          outline
                          color="info"
                          size="sm"
                          style={{ float: "right", marginRight: "10px" }}
                        >
                          MR Report
                        </Button>
                      </Link>
                    </React.Fragment>
                  )}
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>MR ID</th>
                      <th>Project Name</th>
                      <th>CD ID</th>
                      <th>Site ID</th>
                      <th>Site Name</th>
                      <th>Current Status</th>
                      <th>Current Milestone</th>
                      <th>Region</th>
                      <th>DSP</th>
                      <th>ETA</th>
                      <th>Created By</th>
                      <th>Updated On</th>
                      <th>Created On</th>
                    </tr>
                    <tr>{this.loopSearchBar()}</tr>
                  </thead>
                  <tbody>
                    {this.state.mr_list.length === 0 && (
                      <tr>
                        <td colSpan="15">No Data Available</td>
                      </tr>
                    )}
                    {this.state.mr_list.map((list, i) => (
                      <tr key={list._id}>
                        <td>
                          <Link to={"/mr-detail/" + list._id}>
                            {list.mr_id}
                          </Link>
                        </td>
                        <td>{list.project_name}</td>
                        <td>
                          {list.cust_del !== undefined &&
                            list.cust_del
                              .map((custdel) => custdel.cd_id)
                              .join(" , ")}
                        </td>
                        <td>
                          {list.site_info !== undefined &&
                            list.site_info
                              .map((site_info) => site_info.site_id)
                              .join(" , ")}
                        </td>
                        <td>
                          {list.site_info !== undefined &&
                            list.site_info
                              .map((site_info) => site_info.site_name)
                              .join(" , ")}
                        </td>
                        <td>{list.current_mr_status}</td>
                        <td>{list.current_milestones}</td>
                        <td>
                          {list.site_info !== undefined &&
                            list.site_info
                              .map((site_info) => site_info.site_region)
                              .join(" , ")}
                        </td>
                        <td>{list.dsp_company}</td>
                        <td>{convertDateFormat(list.eta)}</td>
                        <td>{list.creator.map((e) => e.email)}</td>
                        <td>{convertDateFormatfull(list.updated_on)}</td>
                        <td>{convertDateFormatfull(list.created_on)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>
                    Showing {this.state.perPage} entries from{" "}
                    {this.state.totalData} data
                  </small>
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
        <Loading
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}
        ></Loading>
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

const mapDispatchToProps = (dispatch) => {
  return {
    SidebarMinimizer: (minimize) =>
      dispatch({
        type: ActionType.MINIMIZE_SIDEBAR,
        minimize_sidebar: minimize,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MRList);
