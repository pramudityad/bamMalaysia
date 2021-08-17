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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import debounce from "lodash.debounce";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { connect } from "react-redux";
import {
  convertDateFormatfull,
  convertDateFormat,
} from "../../helper/basicFunction";
import {
  getDatafromAPINODE,
  patchDatatoAPINODE,
} from "../../helper/asyncFunction";

const API_URL = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const username = "bamidadmin@e-dpm.com";
const password = "F760qbAg2sml";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameISAT = "adminbamidsuper";
const passwordISAT = "F760qbAg2sml";

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const Checkbox = ({
  type = "checkbox",
  name,
  checked = false,
  onChange,
  value,
}) => (
  <input
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    value={value}
    className="checkmark-dash"
  />
);

class LoadingProcess extends Component {
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
      action_status: null,
      action_message: "",
      mr_checked: new Map(),
      mr_data_selected: [],
      shipment_detail: {},
      validation_form: {},
      modal_loading: false,
      asp_list: [],
      no_filter_dsp: false,
      id_mr_request_change: null,
      change_mover_to: null,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.downloadMRlist = this.downloadMRlist.bind(this);
    this.getMRList = this.getMRList.bind(this);
    this.getAllMR = this.getAllMR.bind(this);
    this.proceedMilestone = this.proceedMilestone.bind(this);
    this.proceedShipment = this.proceedShipment.bind(this);
    this.handleChangeChecklist = this.handleChangeChecklist.bind(this);
    this.handleChangeShipmentDetail =
      this.handleChangeShipmentDetail.bind(this);
    this.handleCheckingForm = this.handleCheckingForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handleChangeFilterDSP = this.handleChangeFilterDSP.bind(this);
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
    filter_array.push('"current_milestones":"MS_JOINT_CHECK"');
    filter_array.push('"current_mr_status":"JOINT CHECK FINISH"');
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
    if (this.state.no_filter_dsp === true) {
      filter_array.push(
        '"$or" : [{"dsp_company_code" : {"$regex" : "' +
          this.state.shipment_detail.transporter +
          '", "$options" : "i"}}, {"dsp_company":{"$regex" : "' +
          this.state.shipment_detail.transporter_name +
          '", "$options" : "i"}}]'
      );
    }
    this.props.match.params.whid !== undefined &&
      filter_array.push(
        '"origin.value" : "' + this.props.match.params.whid + '"'
      );
    filter_array.push(
      '"$and" : [{"mr_delivery_type_code" : {"$ne" : "A1"}}, {"mr_delivery_type_code" : {"$ne" : "A2"}}, {"mr_delivery_type_code" : {"$ne" : "B1"}}, {"mr_delivery_type_code" : {"$ne" : "C1"}}]'
    );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/matreq?srt=_id:-1&q=" + whereAnd + "&lmt=" + maxPage + "&pg=" + page,
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ mr_list: items, totalData: totalData });
      }
    });
  }

  async getAllMR() {
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
    filter_array.push('"current_milestones":"MS_JOINT_CHECK"');
    filter_array.push('"current_mr_status":"JOINT CHECK FINISH"');
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
    filter_array.push(
      '"$and" : [{"mr_delivery_type_code" : {"$ne" : "A1"}}, {"mr_delivery_type_code" : {"$ne" : "A2"}}, {"mr_delivery_type_code" : {"$ne" : "B1"}}, {"mr_delivery_type_code" : {"$ne" : "C1"}}]'
    );
    let whereAnd = "{" + filter_array.join(",") + "}";
    let mrList = [];
    let res = await getDatafromAPINODE(
      "/matreq?srt=_id:-1&noPg=1&q=" + whereAnd,
      this.state.tokenUser
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
    arrayCD = data_mr.map((e) => e.cust_del).reduce((l, n) => l.concat(n), []);
    let array_cd_id = [...new Set(arrayCD.map(({ cd_id }) => cd_id))];
    let dataCDID = [];
    let getNumberPage = Math.ceil(array_cd_id.length / 20);
    for (let i = 0; i < getNumberPage; i++) {
      let DataPaginationWPID = array_cd_id.slice(i * 20, (i + 1) * 20);
      let array_in_cdid = '"' + DataPaginationWPID.join('", "') + '"';
      let projection =
        '&projection={"WP_ID" : 1, "C1043_WBS_HW" : 1, "C1023_WBS_HWAC" : 1, "C1033_WBS_LCM" : 1, "C1003_WBS_PNRO" : 1, "C1053_WBS_SW" : 1, "C1063_C1053_WBS_PS" : 1, "C1066_C1053_WBS_ANC" : 1, "C1034_WBS_PowHW_Site_Basis" : 1, "C1035_WBS_PowLCM_Site_Basis" : 1, "C1036_WBS_Kathrein" : 1}';
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
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const allMR = await this.getAllMR();

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
    ];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + "1").font = { size: 11, bold: true };
    }

    for (let i = 0; i < allMR.length; i++) {
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
      ]);
      const getRowLast = ws.lastRow._number;
      ws.getCell("M" + getRowLast).numFmt = "YYYY-MM-DD";
      ws.getCell("O" + getRowLast).numFmt = "YYYY-MM-DD";
      ws.getCell("P" + getRowLast).numFmt = "YYYY-MM-DD";
      if (creator_mr_mitt !== undefined && creator_mr_mitt !== null) {
        ws.getCell("L" + getRowLast).numFmt = "YYYY-MM-DD";
      }
    }
    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "MR List.xlsx");
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
    const id_doc = e.currentTarget.id;
    let res = await patchDatatoAPINODE(
      "/matreq/loadingProcess/" + id_doc,
      this.state.tokenUser
    );
    if (res !== undefined) {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        });
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
      }
    } else {
      this.setState({ action_status: "failed" });
    }
  }

  handleCheckingForm() {
    const inputanDetailShipment = this.state.shipment_detail;
    let dataValidate = {};
    let form_id = [
      "shipment_number",
      "transporter",
      "driver_name",
      "driver_phone_number",
      "truck_number",
      "truck_type",
    ];
    let checkerror = [];
    for (let i = 0; i < form_id.length; i++) {
      if (
        inputanDetailShipment[form_id[i]] === undefined ||
        inputanDetailShipment[form_id[i]] === null
      ) {
        dataValidate[form_id[i]] = false;
        checkerror.push(false);
      }
    }
    if (checkerror.length !== 0) {
      this.setState({ validation_form: dataValidate });
    } else {
      this.setState({ validation_form: dataValidate });
      this.proceedShipment();
    }
  }

  async proceedShipment() {
    this.toggleLoading();
    const inputanDetailShipment = this.state.shipment_detail;
    const dataMRSelected = this.state.mr_data_selected;
    let list_mr_shipment = [];
    for (let i = 0; i < dataMRSelected.length; i++) {
      list_mr_shipment.push({ mrId: dataMRSelected[i].mr_id });
    }
    let getDataTransporter = this.state.asp_list.find(
      (e) => e.Vendor_Code === inputanDetailShipment.transporter
    );
    let nameTransporter = inputanDetailShipment.transporter;
    if (getDataTransporter !== undefined) {
      nameTransporter = getDataTransporter.Name;
    }
    const dataShipment = {
      mrList: list_mr_shipment,
      shipmentNumber: inputanDetailShipment.shipment_number,
      dspData: {
        dsp_transporter_code: inputanDetailShipment.transporter,
        dsp_transporter: nameTransporter,
        dsp_destination: inputanDetailShipment.destination_address,
        dsp_note: inputanDetailShipment.shipment_note,
        dsp_name: inputanDetailShipment.driver_name,
        dsp_phone: inputanDetailShipment.driver_phone_number,
        dsp_truck: inputanDetailShipment.truck_number,
        dsp_truck_type:
          inputanDetailShipment.truck_type === "Other"
            ? inputanDetailShipment.other_truck_type
            : inputanDetailShipment.truck_type,
      },
    };
    let res = await patchDatatoAPINODE(
      "/matreq/loadingProcess",
      dataShipment,
      this.state.tokenUser
    );
    if (res !== undefined) {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        });
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
      }
    } else {
      this.setState({ action_status: "failed" });
    }
    this.toggleLoading();
  }

  componentDidMount() {
    this.getMRList();
    this.loadOptionsASP();
    // this.getAllMR();
    document.title = "Loading Process | BAM";
  }

  loadOptionsASP() {
    getDatafromAPINODE("/vendor_data_non_page").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ asp_list: items });
      }
    });
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

  handleChangeShipmentDetail(e) {
    const name = e.target.name;
    let value = e.target.value;
    let dataShipment = this.state.shipment_detail;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    if (name.toString() === "transporter") {
      const indexOpt = e.target.selectedIndex;
      const textOpt = e.target[indexOpt].text;
      dataShipment[name.toString() + "_name"] = textOpt;
      if (value === "All") {
        this.setState({ no_filter_dsp: false }, () => {
          this.getMRList();
        });
      } else {
        this.setState({ no_filter_dsp: true }, () => {
          this.getMRList();
        });
      }
      this.setState({ mr_data_selected: [], mr_checked: new Map() });
    }
    dataShipment[name.toString()] = value;
    this.setState({ shipment_detail: dataShipment });
  }

  handleChangeChecklist(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const dataMR = this.state.mr_list;
    let MRSelected = this.state.mr_data_selected;
    if (isChecked === true) {
      const getMR = dataMR.find((mr) => mr._id === item);
      MRSelected.push(getMR);
    } else {
      MRSelected = MRSelected.filter(function (mr) {
        return mr._id !== item;
      });
    }
    this.setState({ mr_data_selected: MRSelected });
    this.setState((prevState) => ({
      mr_checked: prevState.mr_checked.set(item, isChecked),
    }));
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

  handleChangeFilterDSP() {
    this.setState(
      (prevState) => ({
        no_filter_dsp: !prevState.no_filter_dsp,
      }),
      () => {
        this.getMRList();
      }
    );
  }

  toggleChangeMover = (e) => {
    if (e !== undefined) {
      const id_doc = e.currentTarget.id;
      this.setState({ id_mr_request_change: id_doc, change_mover_to: null });
    } else {
      this.setState({ id_mr_request_change: null, change_mover_to: null });
    }
    this.setState((prevState) => ({
      modal_change_mover: !prevState.modal_change_mover,
    }));
  };

  handleChangeMover = (e) => {
    this.setState({ change_mover_to: e.target.value });
  };

  saveChangeMover = async () => {
    const newMover = {
      data: {
        newMover: this.state.change_mover_to,
      },
    };
    const resPatch = await patchDatatoAPINODE(
      "/matreq/requestChangeMover/" + this.state.id_mr_request_change,
      newMover,
      this.state.tokenUser
    );
    if (resPatch.data !== undefined) {
      this.setState({ action_status: "success" });
    } else {
      if (
        resPatch.response !== undefined &&
        resPatch.response.data !== undefined &&
        resPatch.response.data.error !== undefined
      ) {
        if (resPatch.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: resPatch.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: resPatch.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleChangeMover();
  };

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
        <AlertProcess
          alertAct={this.state.action_status}
          messageAct={this.state.action_message}
        />
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                Shipment Detail
                <Button
                  onClick={this.handleCheckingForm}
                  size="sm"
                  style={{ float: "right" }}
                  color="success"
                  disabled={
                    this.state.mr_data_selected.length === 0 ||
                    this.state.shipment_detail.transporter === "All"
                  }
                >
                  <i class="fa fa-plus" aria-hidden="true">
                    &nbsp;
                  </i>{" "}
                  Ship
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row size="sm">
                      <Col md="2">
                        <Label htmlFor="shipment_number">
                          Shipment Number*
                        </Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="text"
                            name="0"
                            placeholder=""
                            name="shipment_number"
                            onChange={this.handleChangeShipmentDetail}
                            value={this.state.shipment_detail.shipment_number}
                          />
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="transporter">Transporter*</Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="select"
                            placeholder=""
                            name="transporter"
                            onChange={this.handleChangeShipmentDetail}
                            value={
                              this.state.shipment_detail.transporter ===
                              undefined
                                ? ""
                                : this.state.shipment_detail.transporter
                            }
                          >
                            <option value="" disabled selected hidden>
                              Select Transporter
                            </option>
                            <option value={"All"}>
                              {"All Transporter (Just For Show)"}
                            </option>
                            {this.state.asp_list.map((list, i) => (
                              <option value={list.Vendor_Code}>
                                {list.Name}
                              </option>
                            ))}
                          </Input>
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_type">Truck Type*</Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="select"
                            placeholder=""
                            name="truck_type"
                            onChange={this.handleChangeShipmentDetail}
                            value={
                              this.state.shipment_detail.truck_type ===
                              undefined
                                ? ""
                                : this.state.shipment_detail.truck_type
                            }
                          >
                            <option value="" disabled hidden>
                              Select Truct Type
                            </option>
                            <option value="CD1">CD1</option>
                            <option value="CD2">CD2</option>
                            <option value="CD3">CD3</option>
                            <option value="CD4">CD4</option>
                            <option value="Other">Other</option>
                          </Input>
                          {this.state.shipment_detail.truck_type ===
                            "Other" && (
                            <Input
                              style={{ marginLeft: "5px" }}
                              type="text"
                              name="10"
                              placeholder="Other Type"
                              name="other_truck_type"
                              onChange={this.handleChangeShipmentDetail}
                              value={
                                this.state.shipment_detail.other_truck_type
                              }
                            />
                          )}
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_type">Destination Address</Label>
                      </Col>
                      <Col md="8">
                        <Input
                          type="text"
                          name="3"
                          placeholder=""
                          name="destination_address"
                          onChange={this.handleChangeShipmentDetail}
                          value={this.state.shipment_detail.destination_address}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_number">Truck No*</Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="text"
                            name="2"
                            placeholder=""
                            name="truck_number"
                            onChange={this.handleChangeShipmentDetail}
                            value={this.state.shipment_detail.truck_number}
                          />
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_name">Driver Name*</Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="text"
                            name="4"
                            placeholder=""
                            name="driver_name"
                            onChange={this.handleChangeShipmentDetail}
                            value={this.state.shipment_detail.driver_name}
                          />
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_phone_number">
                          Driver Phone*
                        </Label>
                      </Col>
                      <Col md="8">
                        <div
                          style={{ display: "flex", "align-items": "baseline" }}
                        >
                          <Input
                            type="text"
                            name="5"
                            placeholder=""
                            name="driver_phone_number"
                            onChange={this.handleChangeShipmentDetail}
                            value={
                              this.state.shipment_detail.driver_phone_number
                            }
                          />
                          {this.state.validation_form.truck_number ===
                            false && (
                            <i
                              class="fa fa-exclamation-triangle"
                              aria-hidden="true"
                              style={{
                                color: "rgba(255,61,0 ,1)",
                                paddingLeft: "10px",
                              }}
                            ></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_phone_number">Note</Label>
                      </Col>
                      <Col md="8">
                        <Input
                          type="text"
                          name="5"
                          placeholder=""
                          name="shipment_note"
                          onChange={this.handleChangeShipmentDetail}
                          value={this.state.shipment_detail.shipment_note}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" lg="6">
                    <h6>MR ID Shipment</h6>
                    <Table responsive striped bordered size="sm">
                      <thead>
                        <tr>
                          <th>MR ID</th>
                          <th>Project</th>
                          <th>Total Box</th>
                          <th>Box ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.mr_data_selected.map((mr) => (
                          <tr>
                            <td style={{ textAlign: "left" }}>{mr.mr_id}</td>
                            <td>{mr.project_name}</td>
                            <td>{mr.total_boxes}</td>
                            <td>
                              {mr.list_of_box_id !== undefined
                                ? mr.list_of_box_id.map((e) =>
                                    typeof e === "string"
                                      ? e + " , "
                                      : e.box_id + " , "
                                  )
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2" }}>
                  <i
                    className="fa fa-align-justify"
                    style={{ marginRight: "8px" }}
                  ></i>{" "}
                  Loading Process
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
                      <th>Tower ID</th>
                      <th>Tower Name</th>
                      <th>Current Status</th>
                      <th>Current Milestone</th>
                      <th>DSP</th>
                      <th>ETA</th>
                      <th>Created By</th>
                      <th>Updated On</th>
                      <th>Created On</th>
                      <th rowSpan="2">Action</th>
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
                          <Checkbox
                            name={list._id}
                            checked={this.state.mr_checked.get(list._id)}
                            onChange={this.handleChangeChecklist}
                            value={list}
                          />
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
                        <td>{list.creator.map((e) => e.email)}</td>
                        <td>{convertDateFormatfull(list.updated_on)}</td>
                        <td>{convertDateFormatfull(list.created_on)}</td>
                        <Button
                          outline
                          color="warning"
                          size="sm"
                          style={{ width: "90px" }}
                          id={list._id}
                          onClick={this.toggleChangeMover}
                        >
                          Change Mover
                        </Button>
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
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}
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
          <ModalFooter></ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        <Modal
          isOpen={this.state.modal_change_mover}
          toggle={this.toggleChangeMover}
          className={"modal-sm modal--box-input modal__delivery--ldm-approve"}
        >
          <ModalHeader>Request Change Mover</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="total_box">Change Delivery Company to</Label>
              <Input
                type="select"
                className=""
                placeholder=""
                onChange={this.handleChangeMover}
                name={this.state.change_mover_to}
              >
                <option value="" disabled selected hidden></option>
                <option value="ASP">ASP</option>
                <option value="DSP">DSP</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={this.toggleChangeMover}
              style={{ float: "right", marginRight: "10px" }}
              size="sm"
            >
              Close
            </Button>
            <Button
              color="success"
              onClick={this.saveChangeMover}
              style={{ float: "right", marginRight: "10px" }}
              size="sm"
            >
              <i className="icon-check icons"></i> Change
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(LoadingProcess);
