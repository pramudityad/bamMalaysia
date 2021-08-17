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
  ModalFooter,
  Modal,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import debounce from "lodash.debounce";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { connect } from "react-redux";
import "./project_css.css";
import { getDatafromAPINODE } from "../../helper/asyncFunction";
import Loading from "../components/Loading";

import ModalForm from "../components/ModalForm";
import {
  convertDateFormatfull,
  convertDateFormat,
} from "../../helper/basicFunction";

const API_URL = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const username = "bamidadmin@e-dpm.com";
const password = "F760qbAg2sml";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

class OrderCreated extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      mr_list: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      filter_list: new Array(14).fill(""),
      mr_all: [],
      asp_data: [],
      action_status: null,
      action_message: null,
      modal_approve_ldm: false,
      id_mr_selected: null,
      selected_dsp: "",
      data_mr_selected: null,
      modal_box_input: false,
      rejectNote: "",
      mot_type: null,
      modal_loading: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.downloadMRlist = this.downloadMRlist.bind(this);
    this.getMRList = this.getMRList.bind(this);
    this.getAllMR = this.getAllMR.bind(this);
    this.ApproveMR = this.ApproveMR.bind(this);
    this.rejectMR = this.rejectMR.bind(this);
    this.toggleModalapprove = this.toggleModalapprove.bind(this);
    this.toggleBoxInput = this.toggleBoxInput.bind(this);
    this.handleChangeNote = this.handleChangeNote.bind(this);
    this.handleMotType = this.handleMotType.bind(this);

    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggleBoxInput(e) {
    if (e !== undefined) {
      const id_doc = e.currentTarget.id;
      this.setState({ id_mr_selected: id_doc });
    }
    this.setState((prevState) => ({
      modal_box_input: !prevState.modal_box_input,
    }));
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  handleChangeNote = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (value !== null && value.length !== 0 && value !== 0) {
      this.setState({ rejectNote: value });
    }
  };

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
      let respond = await axios.get(API_URL_NODE + url, {
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

  async patchDatatoAPINODE(url, data) {
    try {
      let respond = await axios.patch(API_URL_NODE + url, data, {
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
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async getDatafromAPINODE(url) {
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

  toggleModalapprove(e) {
    this.getASPList();
    if (e !== undefined) {
      const id_doc = e.currentTarget.id;
      const dataMR = this.state.mr_list.find((e) => e._id === id_doc);
      if (
        dataMR !== undefined &&
        dataMR.dsp_company !== null &&
        dataMR.dsp_company !== undefined
      ) {
        this.setState({
          selected_dsp: {
            dsp_company_code: dataMR.dsp_company_code,
            dsp_company: dataMR.dsp_company,
          },
        });
      }
      this.setState({ id_mr_selected: id_doc, data_mr_selected: dataMR });
    } else {
      this.setState({ id_mr_selected: null, data_mr_selected: null });
    }
    this.setState((prevState) => ({
      modal_approve_ldm: !prevState.modal_approve_ldm,
    }));
  }

  getASPList() {
    // switch (this.props.dataLogin.account_id) {
    //   case "xl":
    this.getDatafromAPINODE('/vendor_data_non_page?where={"Type":"DSP"}').then(
      (res) => {
        console.log("asp data ", res.data);
        if (res.data !== undefined) {
          this.setState({ asp_data: res.data._items });
        } else {
          this.setState({ asp_data: [] });
        }
      }
    );
    //     break;
    //   default:
    //     break;
    // }
  }

  handleLDMapprove = (e) => {
    // this.getASPList();
    let value = e.target.value;
    let name = e.target.options[e.target.selectedIndex].text;
    let bodymrApprove = {
      dsp_company_code: value,
      dsp_company: name,
    };
    if (value !== 0) {
      this.setState({ selected_dsp: bodymrApprove });
    }
  };

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
    filter_array.push('"current_mr_status":"MR REQUESTED"');
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"current_milestones":{"$regex" : "' +
          this.state.filter_list[6] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"dsp_company":{"$regex" : "' +
          this.state.filter_list[7] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[8] !== "" &&
      filter_array.push(
        '"eta":{"$regex" : "' +
          this.state.filter_list[8] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[9] !== "" &&
      filter_array.push(
        '"creator":{"$regex" : "' +
          this.state.filter_list[9] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[10] !== "" &&
      filter_array.push(
        '"updated_on":{"$regex" : "' +
          this.state.filter_list[10] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[11] !== "" &&
      filter_array.push(
        '"created_on":{"$regex" : "' +
          this.state.filter_list[11] +
          '", "$options" : "i"}'
      );
    this.props.match.params.whid !== undefined &&
      filter_array.push(
        '"origin.value" : "' + this.props.match.params.whid + '"'
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
    filter_array.push('"current_mr_status":"MR REQUESTED"');
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"current_milestones":{"$regex" : "' +
          this.state.filter_list[6] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"dsp_company":{"$regex" : "' +
          this.state.filter_list[7] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[8] !== "" &&
      filter_array.push(
        '"eta":{"$regex" : "' +
          this.state.filter_list[8] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[9] !== "" &&
      filter_array.push(
        '"creator":{"$regex" : "' +
          this.state.filter_list[9] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[10] !== "" &&
      filter_array.push(
        '"updated_on":{"$regex" : "' +
          this.state.filter_list[10] +
          '", "$options" : "i"}'
      );
    this.state.filter_list[11] !== "" &&
      filter_array.push(
        '"created_on":{"$regex" : "' +
          this.state.filter_list[11] +
          '", "$options" : "i"}'
      );
    this.props.match.params.whid !== undefined &&
      filter_array.push(
        '"origin.value" : "' + this.props.match.params.whid + '"'
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
      const getWPID = await getDatafromAPINODE(
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
      "Site ID",
      "Site Name",
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
    saveAs(new Blob([allocexport]), "MR List Order Created.xlsx");
  }

  async patchDataToAPI(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL + url, data, {
        headers: {
          "Content-Type": "application/json",
          "If-Match": _etag,
        },
        auth: {
          username: username,
          password: password,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      this.setState({
        action_status: "failed",
        action_message: "Sorry, there is something wrong, please try again!",
      });
      console.log("respond patch data", err);
      return respond;
    }
  }

  async proceedMilestone(e) {
    const newDate = new Date();
    const dateNow =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1) +
      "-" +
      newDate.getDate() +
      " " +
      newDate.getHours() +
      ":" +
      newDate.getMinutes() +
      ":" +
      newDate.getSeconds();
    const _etag = e.target.value;
    const _id = e.target.id;
    let successUpdate = [];
    let updateMR = {};
    const dataMR = this.state.mr_list.find((e) => e._id === _id);
    if (dataMR.mr_type === "Relocation") {
      let currStatus = [
        {
          mr_status_name: "READY_TO_DELIVER",
          mr_status_value: "CONFIRMED",
          mr_status_date: dateNow,
          mr_status_updater: this.state.userEmail,
          mr_status_updater_id: this.state.userId,
        },
      ];
      let currMilestones = [
        {
          ms_name: "MS_READY_TO_DELIVER",
          ms_date: dateNow,
          ms_updater: this.state.userEmail,
          ms_updater_id: this.state.userId,
        },
      ];
      updateMR["current_milestones"] = "MS_READY_TO_DELIVER";
      updateMR["current_mr_status"] = "READY TO DELIVER";
      updateMR["mr_milestones"] = dataMR.mr_milestones.concat(currMilestones);
      updateMR["mr_status"] = dataMR.mr_status.concat(currStatus);
    } else {
      let currStatus = [
        {
          mr_status_name: "MATERIAL_REQUEST",
          mr_status_value: "APPROVED",
          mr_status_date: dateNow,
          mr_status_updater: this.state.userEmail,
          mr_status_updater_id: this.state.userId,
        },
      ];
      let currMilestones = [
        {
          ms_name: "MS_ORDER_RECEIVED",
          ms_date: dateNow,
          ms_updater: this.state.userEmail,
          ms_updater_id: this.state.userId,
        },
      ];
      updateMR["current_milestones"] = "MS_ORDER_RECEIVED";
      updateMR["current_mr_status"] = "MR APPROVED";
      updateMR["mr_milestones"] = dataMR.mr_milestones.concat(currMilestones);
      updateMR["mr_status"] = dataMR.mr_status.concat(currStatus);
    }
    let res = await this.patchDataToAPI("/mr_op/" + _id, updateMR, _etag);
    if (res !== undefined) {
      if (res.data !== undefined) {
        successUpdate.push(res.data);
      }
    }
    if (successUpdate.length !== 0) {
      this.setState({ action_status: "success" });
      this.getMRList();
      // setTimeout(function(){ window.location.reload(); }, 2000);
    }
  }

  ApproveMR(e) {
    const _id = this.state.id_mr_selected;
    let body = this.state.selected_dsp;
    body = { ...body, motType: this.state.mot_type };
    // console.log('_id ',_id);
    // console.log('body ',body);
    this.patchDatatoAPINODE("/matreq/approveMatreq/" + _id, body).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          this.getMRList();
          this.toggleModalapprove();
        } else {
          if (
            res.response !== undefined &&
            res.response.data !== undefined &&
            res.response.data.error !== undefined
          ) {
            if (res.response.data.error.message !== undefined) {
              this.setState({
                action_status: "failed",
                action_message: res.response.data.error.message,
              });
            } else {
              this.setState({
                action_status: "failed",
                action_message: res.response.data.error,
              });
            }
          } else {
            this.setState({ action_status: "failed" });
          }
          this.toggleModalapprove();
        }
      }
    );
  }

  rejectMR(e) {
    const id_doc = e.currentTarget.id;
    let reason = this.state.rejectNote;
    this.patchDatatoAPINODE("/matreq/rejectMatreq/" + id_doc, {
      rejectNote: reason,
    }).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.getMRList();
        this.toggleBoxInput();
      } else {
        if (
          res.response !== undefined &&
          res.response.data !== undefined &&
          res.response.data.error !== undefined
        ) {
          if (res.response.data.error.message !== undefined) {
            this.setState({
              action_status: "failed",
              action_message: res.response.data.error.message,
            });
          } else {
            this.setState({
              action_status: "failed",
              action_message: res.response.data.error,
            });
          }
        } else {
          this.setState({ action_status: "failed" });
        }
        this.toggleBoxInput();
      }
    });
  }

  componentDidMount() {
    this.getMRList();
    // this.getAllMR();
    document.title = "Order Created | BAM";
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

  onChangeDebounced(e) {
    this.getMRList();
    // this.getAllMR();
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 12; i++) {
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

  handleMotType(e) {
    this.setState({ mot_type: e.target.value });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    function AlertProcess(props) {
      const alert = props.alertAct;
      const message = props.messageAct;
      if (alert === "failed") {
        return (
          <div className="alert alert-danger" role="alert">
            {message.length !== 0
              ? message
              : "Sorry, there was an error when we tried to save it, please reload your page and try again"}
          </div>
        );
      } else {
        if (alert === "success") {
          return (
            <div className="alert alert-success" role="alert">
              {message}
              Your action was success, please reload your page
            </div>
          );
        } else {
          return <div></div>;
        }
      }
    }

    const downloadMR = {
      float: "right",
    };

    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2" }}>
                  <i
                    className="fa fa-align-justify"
                    style={{ marginRight: "8px" }}
                  ></i>{" "}
                  Order Created
                </span>
                <Button
                  style={downloadMR}
                  outline
                  color="success"
                  onClick={this.downloadMRlist}
                  size="sm"
                >
                  <i
                    className="fa fa-download"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Download MR List
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                        Action
                      </th>
                      <th>MR ID</th>
                      <th>Project Name</th>
                      <th>CD ID</th>
                      <th>Site ID</th>
                      <th>Site Name</th>
                      <th>Current Status</th>
                      <th>Current Milestone</th>
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
                          {/* <Button outline color="success" size="sm" className="btn-pill" style={{ width: "90px", marginBottom: "4px" }} id={list._id} value={list._etag} onClick={this.ApproveMR}><i className="fa fa-check" style={{ marginRight: "8px" }}></i>Approve</Button> */}
                          <Button
                            outline
                            color="success"
                            size="sm"
                            className="btn-pill"
                            style={{ width: "90px", marginBottom: "4px" }}
                            id={list._id}
                            value={list._etag}
                            onClick={this.toggleModalapprove}
                          >
                            <i
                              className="fa fa-check"
                              style={{ marginRight: "8px" }}
                            ></i>
                            Approve
                          </Button>
                          <Button
                            outline
                            color="danger"
                            size="sm"
                            className="btn-pill"
                            style={{ width: "90px" }}
                            id={list._id}
                            value={list._etag}
                            onClick={this.toggleBoxInput}
                          >
                            <i
                              className="fa fa-times"
                              style={{ marginRight: "8px" }}
                            ></i>
                            Reject
                          </Button>
                        </td>
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
                        <td>{list.dsp_company}</td>
                        <td>{convertDateFormat(list.eta)}</td>
                        <td>{list.creator.map((c) => c.email)}</td>
                        <td>{convertDateFormatfull(list.updated_on)}</td>
                        <td>{convertDateFormatfull(list.created_on)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>
                    Showing {this.state.mr_list.length} entries from{" "}
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
        <Modal
          isOpen={this.state.modal_box_input}
          toggle={this.toggleBoxInput}
          className={"modal-sm modal--box-input"}
        >
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label>Reject Note</Label>
                  <Input
                    type="text"
                    name={this.state.id_mr_selected}
                    placeholder="Write Reject Note"
                    onChange={this.handleChangeNote}
                    value={this.state.rejectNote}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!this.state.rejectNote}
              outline
              color="danger"
              size="sm"
              style={{ width: "80px" }}
              id={this.state.id_mr_selected}
              onClick={this.rejectMR}
            >
              Reject MR
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* modal form approve */}
        <ModalForm
          isOpen={this.state.modal_approve_ldm}
          toggle={this.toggleModalapprove}
          className={"modal-sm modal--box-input modal__delivery--ldm-approve"}
        >
          <Col>
            {this.state.data_mr_selected !== null &&
            this.state.data_mr_selected !== undefined &&
            this.state.data_mr_selected.dsp_company !== null ? (
              <React.Fragment>
                <FormGroup>
                  <Label htmlFor="total_box">Delivery Company</Label>
                  <Input
                    type="text"
                    className=""
                    placeholder=""
                    value={this.state.data_mr_selected.dsp_company}
                    readOnly
                  />
                </FormGroup>
                {this.state.data_mr_selected.deliver_by === "DSP" &&
                  this.state.asp_data.find(
                    (ad) =>
                      ad.Vendor_Code ===
                      this.state.data_mr_selected.dsp_company_code
                  ) && (
                    <FormGroup>
                      <Label htmlFor="total_box">MOT Type</Label>
                      <Input
                        type="select"
                        name={"0 /// sub_category"}
                        onChange={this.handleMotType}
                        value={this.state.mot_type}
                      >
                        <option value="" disabled selected hidden></option>
                        <option value="MOT-Land">MOT-Land</option>
                        <option value="MOT-Air">MOT-Air</option>
                        <option value="MOT-Sea">MOT-Sea</option>
                      </Input>
                    </FormGroup>
                  )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FormGroup>
                  <Label htmlFor="total_box">DSP Company</Label>
                  <Input
                    type="select"
                    className=""
                    placeholder=""
                    onChange={this.handleLDMapprove}
                    name={this.state.id_mr_selected}
                  >
                    <option value="" disabled selected hidden></option>
                    {this.state.asp_data.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="total_box">MOT Type</Label>
                  <Input
                    type="select"
                    name={"0 /// sub_category"}
                    onChange={this.handleMotType}
                    value={this.state.mot_type}
                  >
                    <option value="" disabled selected hidden></option>
                    <option value="MOT-Land">MOT-Land</option>
                    <option value="MOT-Air">MOT-Air</option>
                    <option value="MOT-Sea">MOT-Sea</option>
                  </Input>
                </FormGroup>
              </React.Fragment>
            )}
          </Col>
          <div style={{ justifyContent: "center", alignSelf: "center" }}>
            <Button
              color="success"
              onClick={this.ApproveMR}
              className="btn-pill"
            >
              <i className="icon-check icons"></i> Approve
            </Button>
          </div>
        </ModalForm>

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
  };
};

export default connect(mapStateToProps)(OrderCreated);
