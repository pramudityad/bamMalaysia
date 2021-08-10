import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
} from "reactstrap";
import { Col, FormGroup, Label, Row, Table, Input } from "reactstrap";
import { ExcelRenderer } from "react-excel-renderer";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import Pagination from "react-js-pagination";
import debounce from "lodash.debounce";
import Select from "react-select";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import { connect } from "react-redux";
import { Redirect, Route, Switch, Link } from "react-router-dom";
import * as XLSX from "xlsx";

import "../MatStyle.css";

import ModalCreateNew from "../../components/ModalCreateNew";
import ModalDelete from "../../components/ModalDelete";
import Loading from "../../components/Loading";

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

const DefaultNotif = React.lazy(() => import("../../DefaultView/DefaultNotif"));

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameBAM = "adminbamidsuper";
const passwordBAM = "F760qbAg2sml";

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

class MatInboundPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      filter_name: null,
      perPage: 10,
      prevPage: 1,
      activePage: 1,
      total_data_PO: 0,
      selected_wh: null,
      pp_all: [],
      rowsXLS: [],
      cpo_array: [],
      action_status: null,
      action_message: null,
      danger: false,
      all_data: [],
      data_PO: [],
      wh_data: {},
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalMatStockForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
      modalMatStockEdit: false,
      MatStockForm: new Array(6).fill(null),
      createModal: false,
      sortType: 0,
      sortField: "",
      filter_search : {},
    };
    this.togglePOForm = this.togglePOForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changeFilterName = debounce(this.changeFilterName, 1000);
    this.toggle = this.toggle.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleChangeLimit = this.handleChangeLimit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
    this.requestSort = this.requestSort.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  togglecreateModal() {
    this.setState({
      createModal: !this.state.createModal,
    });
  }

  resettogglecreateModal() {
    this.setState({
      rowsXLS: [],
    });
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
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggleDelete(e) {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
      });
    } else {
      this.setState({
        danger: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  }

  changeFilterName(value) {
    this.getWHInboundListNext();
  }

  handleChangeFilter = (e) => {
    let search = this.state.filter_search;
    let field = e.target.name;
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    search[field] = value;
    this.setState({ filter_search: search }, () => {
      this.changeFilterName(value);
    });
  };

  getWHInboundListNext() {
    this.toggleLoading();
    // let get_wh_id = new URLSearchParams(window.location.search).get("wh_id");
    let filter_sku =
      this.state.filter_search.sku !== null && this.state.filter_search.sku !== undefined
        ? '{"$regex" : "' + this.state.filter_search.sku + '", "$options" : "i"}'
        : '{"$exists" : 1}';
    let filter_project =
      this.state.filter_search.project !== null && this.state.filter_search.project !== undefined
        ? '{"$regex" : "' + this.state.filter_search.project + '", "$options" : "i"}'
        : '{"$exists" : 1}';
    let filter_owner =
      this.state.filter_search.owner !== null && this.state.filter_search.owner !== undefined
        ? '{"$regex" : "' + this.state.filter_search.owner + '", "$options" : "i"}'
        : '{"$exists" : 1}';
    let getbyWH =
      '{"wh_id":"' +
      this.props.match.params.slug +'","project_name":' +filter_project+',"owner_id":'+filter_owner+',"sku":'+filter_sku+'}';
    this.getDatafromAPINODE(
      "/whInboundPlan/getWhInboundPlan?q=" +
        getbyWH +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage
    ).then((res) => {
      // console.log('all data based on ', get_wh_id, res.data)
      if (res.data !== undefined) {
        this.setState({
          all_data: res.data.data,
          prevPage: this.state.activePage,
          total_dataParent: res.data.totalResults,
          selected_wh: this.props.match.params.slug,
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

  getWHManagementID() {
    // let _id = new URLSearchParams(window.location.search).get("_id");
    this.getDatafromAPINODE(
      '/whManagement/warehouse?q={"wh_id":"' +
        this.props.match.params.slug +
        '"}'
    ).then((res) => {
      // console.log("all data ", res.data);
      if (res.data !== undefined) {
        if (res.data.data !== undefined) {
          this.setState({ wh_data: res.data.data[0] });
        }
      } else {
        this.setState({ wh_data: {} });
      }
    });
  }

  isSameValue(element, value) {
    //function for FindIndex
    return (
      this.checkValuetoString(element).toLowerCase() ===
      this.checkValuetoString(value).toLowerCase()
    );
  }

  getIndex(data, value) {
    //get index of value in Array
    return data.findIndex((e) => this.isSameValue(e, value));
  }

  checkValue(props) {
    // if value undefined return null
    if (typeof props === "undefined") {
      return null;
    } else {
      return props;
    }
  }

  checkValuetoString(props) {
    // if value undefined return ""
    if (typeof props === "undefined" || props === null) {
      return "";
    } else {
      return props;
    }
  }

  checkValueReturn(value1, value2) {
    // if value undefined or null return Value2
    if (typeof value1 !== "undefined" && value1 !== null) {
      return value1;
    } else {
      return value2;
    }
  }

  fileHandlerMaterial = (input) => {
    const file = input.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    console.log("rABS");
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        cellDates: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, devfal: null });
      /* Update state */
      this.ArrayEmptytoNull(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  ArrayEmptytoNull(dataXLS) {
    let newDataXLS = [];
    for (let i = 0; i < dataXLS.length; i++) {
      let col = [];
      for (let j = 0; j < dataXLS[0].length; j++) {
        if (typeof dataXLS[i][j] === "object") {
          let dataObject = this.checkValue(JSON.stringify(dataXLS[i][j]));
          if (dataObject !== null) {
            dataObject = dataObject.replace(/"/g, "");
          }
          col.push(dataObject);
        } else {
          col.push(this.checkValue(dataXLS[i][j]));
        }
      }
      newDataXLS.push(col);
    }
    this.setState({
      rowsXLS: newDataXLS,
    });
  }

  componentDidMount() {
    this.getWHInboundListNext();
    this.getWHManagementID();
    document.title = "Material Inbound Plan | BAM";
  }

  handleChangeLimit(e) {
    let limitpg = e.currentTarget.value;
    let sortType = this.state.sortType;
    switch (sortType) {
      case 1:
        this.setState({ perPage: limitpg }, () => {
          this.getListSort();
        });
        break;
      case -1:
        this.setState({ perPage: limitpg }, () => {
          this.getListSort();
        });
        break;
      case 0:
        this.setState({ perPage: limitpg }, () => {
          this.getWHInboundListNext();
        });
        break;
      default:
        // nothing
        break;
    }
  }


  handlePageChange(pageNumber) {
    let sortType = this.state.sortType;
    // console.log("page handle sort ", sortType);
    switch (sortType) {
      case 1:
        this.setState({ activePage: pageNumber }, () => {
          this.getListSort();
        });
        break;
      case -1:
        this.setState({ activePage: pageNumber }, () => {
          this.getListSort();
        });
        break;
      case 0:
        this.setState({ activePage: pageNumber }, () => {
          this.getWHInboundListNext();
        });
        break;
      default:
        // nothing
        break;
    }
  }

  toggleEdit(e) {
    const modalMatStockEdit = this.state.modalMatStockEdit;
    if (modalMatStockEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.all_data.find((e) => e.owner_id === value);
      let dataForm = this.state.POForm;
      dataForm[0] = aEdit.owner_id;
      dataForm[1] = aEdit.po_number;
      dataForm[2] = aEdit.arrival_date;
      dataForm[3] = aEdit.project_name;
      dataForm[4] = aEdit.sku;
      this.setState({ POForm: dataForm });
    } else {
      this.setState({ POForm: new Array(6).fill(null) });
    }
    this.setState((prevState) => ({
      modalMatStockEdit: !prevState.modalMatStockEdit,
    }));
  }

  togglePOForm() {
    this.setState((prevState) => ({
      modalMatStockForm: !prevState.modalMatStockForm,
    }));
  }

  saveCPOBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    // const cpoData = await this.getMatInboundFormat(BulkXLSX);
    const res = await this.postDatatoAPINODE(
      "/whInboundPlan/createWhInboundPlan",
      { inboundPlanData: BulkXLSX }
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
    } else {
      if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
        if (res.response.data.error.message !== undefined) {
          this.setState({ action_status: 'failed', action_message: res.response.data.error.message.message });
        } else {
          this.setState({ action_status: 'failed', action_message: res.response.data.error });
        }
      } else {
        this.setState({ action_status: 'failed' });
      }
      this.toggleLoading();
    }
  };

  saveTruncateBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    // const BulkData = await this.getMatStockFormat(BulkXLSX);
    // console.log("xlsx data", JSON.stringify(BulkXLSX));
    const res = await this.postDatatoAPINODE(
      "/whInboundPlan/createWhInboundPlanTruncate",
      {
        inboundPlanData: BulkXLSX,
      }
    );
    // console.log("res bulk ", res);
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
    } else {
      if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
        if (res.response.data.error.message !== undefined) {
          this.setState({ action_status: 'failed', action_message: res.response.data.error.message.message });
        } else {
          this.setState({ action_status: 'failed', action_message: res.response.data.error });
        }
      } else {
        this.setState({ action_status: 'failed' });
      }
      this.toggleLoading();
    }
  };

  handleChangeForm(e) {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.MatStockForm;
    dataForm[parseInt(index)] = value;
    this.setState({ MatStockForm: dataForm });
  }

  convertDateFormat(jsondate) {
    let date = new Date(jsondate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  }

  async saveUpdate() {
    let respondSaveEdit = undefined;
    const dataPPEdit = this.state.MatStockForm;
    const dataPP = this.state.all_data.find(
      (e) => e.owner_id === dataPPEdit[0]
    );
    const objData = this.state.all_data.find((e) => e._id);
    let pp = {
      owner_id: dataPPEdit[0],
      po_number: dataPPEdit[1],
      arrival_date: dataPPEdit[2],
      project_name: dataPPEdit[3],
      sku: dataPPEdit[4],
    };
    this.toggleLoading();
    this.toggleEdit();
    let patchData = await this.patchDatatoAPINODE(
      "/whInboundPlan/UpdateOneWhInboundPlanwithDelete/" + objData._id,
      { data: [pp] }
    );
    if (patchData === undefined) {
      patchData = {};
      patchData["data"] = undefined;
    }
    if (patchData.data !== undefined) {
      this.setState({ action_status: "success" }, () => {
        this.toggleLoading();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      });
    } else {
      this.toggleLoading();
      this.setState({ action_status: "failed" });
    }
  }

  async saveNew() {
    this.toggleMatStockForm();
    this.toggleLoading();
    let poData = [];
    let respondSaveNew = undefined;
    const dataPPEdit = this.state.MatStockForm;
    const ppcountID = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(6, "0");
    let pp = {
      owner_id: dataPPEdit[0],
      po_number: dataPPEdit[1],
      arrival_date: dataPPEdit[2],
      project_name: dataPPEdit[3],
      sku: dataPPEdit[4],
    };
    poData.push(pp);
    let postData = await this.postDatatoAPINODE(
      "/whInboundPlan/createOneWhInboundPlan",
      pp
    ).then((res) => {
      if (res.data !== undefined) {
        this.toggleLoading();
      } else {
        this.setState({
          action_status: "failed",
          action_message: res.response.data.error,
        });
        this.toggleLoading();
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

  async downloadAll() {
    let download_all = this.state.all_data;
    // let getAll_nonpage = await this.getDatafromAPINODE(
    //   "/whInboundPlan/getWhInboundPlan?noPg=1"
    // );
    // if (getAll_nonpage.data !== undefined) {
    //   download_all = getAll_nonpage.data.data;
    // }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let headerRow = [
      "Owner ID",
      "WH ID",
      "PO Number",
      "Project Name",
      "Arrival Date",
      "SKU",
      "SKU Desc",
      "Qty",
      "Aging",
      "Serial Number",
      "Box Number",
      "Condition",
      "Notes",
    ];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + "1").font = { size: 11, bold: true };
    }

    for (let i = 0; i < download_all.length; i++) {
      let list = download_all[i];
      ws.addRow([
        list.owner_id,
        this.state.selected_wh,
        list.po_number,
        list.project_name,
        list.sku,
        list.sku_description,
        list.arrival_date,
        list.qty,
        list.ageing,
        list.serial_number,
        list.box_number,
        list.condition,
        list.notes,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All Material Inbound "+this.state.selected_wh+".xlsx");
  }

  DeleteData = async () => {
    const objData = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    const DelData = this.deleteDataFromAPINODE(
      "/whInboundPlan/deleteWhInboundPlan/" + objData
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.getWHInboundListNext();
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    });
  };

  exportMatInbound = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow([
      "owner_id",
      "po_number",
      "arrival_date",
      "project_name",
      "sku",
      "sku_description",
      "qty",
      "wh_id",
      "serial_number",
      "box_number",
      "condition",
      "notes",
    ]);
    ws.addRow([
      "Jabo",
      "PO0001",
      "2020-04-17",
      "XL BAM DEMO 2021",
      "1",
      "sku_description",
      100,
      this.state.selected_wh,
      "serial_number",
      "box_number",
      "condition",
      "notes",
    ]);
    ws.addRow([
      "CJ",
      "PO0001",
      "2020-04-17",
      "XL BAM DEMO 2021",
      "1",
      "sku_description",
      100,
      this.state.selected_wh,
      "serial_number",
      "box_number",
      "condition",
      "notes",
    ]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "Material Inbound Template.xlsx");
  };

  getListSort() {
    this.toggleLoading();
    this.getDatafromAPINODE(
      "/whInboundPlan/getWhInboundPlan?srt=" +
        this.state.sortField +
        ":" +
        this.state.sortType +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({
          all_data: res.data.data,
          prevPage: this.state.activePage,
          total_dataParent: res.data.totalResults,
          // sortType: -1
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

  requestSort(e) {
    let sortType = this.state.sortType;
    // console.log('sortType atas', this.state.sortType)
    let sort = e;
    const ascending = 1;
    const descending = -1;
    if (sortType === -1) {
      this.setState({ sortType: ascending, sortField: sort }, () => {
        // console.log('sortType 1 ', this.state.sortType)
        this.getListSort();
      });
    } else {
      this.setState({ sortType: descending, sortField: sort }, () => {
        // console.log('sortType -1 ', this.state.sortType)
        this.getListSort();
      });
    }

  }

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                <span style={{ marginTop: "8px", position: "absolute" }}>
                  Material Inbound Plan {this.state.wh_data.wh_id} -{" "}
                  {this.state.wh_data.wh_name}{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                    {/* Open modal for create new */}
                    {this.state.userRole.includes("Flow-PublicInternal") !==
                    true ? (
                      <div>
                        <Button
                          block
                          color="success"
                          onClick={this.togglecreateModal}
                          // id="toggleCollapse1"
                        >
                          <i className="fa fa-plus-square" aria-hidden="true">
                            {" "}
                            &nbsp;{" "}
                          </i>{" "}
                          New
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <Button
                      block
                      color="info"
                      onClick={this.toggleAddNew}
                      id="toggleCollapse1"
                    >
                      <i className="icon-info" aria-hidden="true">
                        {" "}
                        &nbsp;{" "}
                      </i>{" "}
                      Info
                    </Button>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown
                      isOpen={this.state.dropdownOpen[1]}
                      toggle={() => {
                        this.toggle(1);
                      }}
                    >
                      <DropdownToggle block color="ghost-warning">
                        <i className="fa fa-download" aria-hidden="true">
                          {" "}
                          &nbsp;{" "}
                        </i>{" "}
                        Export
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        <DropdownItem onClick={this.exportMatInbound}>
                          {" "}
                          Material Inbound Template
                        </DropdownItem>
                        <DropdownItem onClick={this.downloadAll}>
                          > Download All{" "}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardHeader>
              <Collapse
                isOpen={this.state.collapse}
                onEntering={this.onEntering}
                onEntered={this.onEntered}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <Card style={{ margin: "10px 10px 5px 10px" }}>
                  <CardBody>
                    <div>
                      <table>
                        <tbody>
                        <tr>
                            <td><b>Warehouse Name</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.wh_name}</td>
                          </tr>
                          <tr>
                            <td><b>Warehouse ID</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.wh_id}</td>
                          </tr>
                          <tr>
                            <td><b>Warehouse Manager</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.wh_manager}</td>
                          </tr>
                          <tr>
                            <td><b>Warehouse Address</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.address}</td>
                          </tr>
                          <tr>
                            <td><b>Latitude</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.latitude}</td>
                          </tr>
                          <tr>
                            <td><b>Longitude</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.longitude}</td>
                          </tr>
                          <tr>
                            <td><b>Warehouse Owner</b></td>
                            <td>:</td>
                            <td>{this.state.wh_data.owner}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Collapse>
              <CardBody>
                <Row>
                  <Col>
                  <div
                        style={{
                          float: "left",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      >
                        <Input
                          type="select"
                          name="select"
                          id="selectLimit"
                          onChange={this.handleChangeLimit}
                        >
                          <option value={"10"}>10</option>
                          <option value={"25"}>25</option>
                          <option value={"50"}>50</option>
                          <option value={"100"}>100</option>
                          <option value={"noPg=1"}>All</option>
                        </Input>
                      </div>
                    <div style={{
                          float: "right",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      >
                      <input
                        style={{marginLeft : '10px', marginRight : '10px'}}
                        className="search-box-material"
                        type="text"
                        name="owner"
                        placeholder="Search Owner ID"
                        // onChange={(e) => this.SearchFilter(e)}
                        onChange={this.handleChangeFilter}
                        value={this.state.filter_search.owner}
                      />
                      <input
                        style={{marginLeft : '10px',marginRight : '10px'}}
                        className="search-box-material"
                        type="text"
                        name="project"
                        placeholder="Search Project Name"
                        // onChange={(e) => this.SearchFilter(e)}
                        onChange={this.handleChangeFilter}
                        value={this.state.filter_search.project}
                      />
                      <input
                        style={{marginLeft : '10px',marginRight : '10px'}}
                        className="search-box-material"
                        type="text"
                        name="sku"
                        placeholder="Search SKU"
                        // onChange={(e) => this.SearchFilter(e)}
                        onChange={this.handleChangeFilter}
                        value={this.state.filter_search.sku}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="divtable">
                      <Table responsive size="sm">
                        <thead
                          style={{ backgroundColor: "#73818f" }}
                          className="fixed"
                        >
                          <tr align="center">
                            <th> Owner ID</th>
                            <th> WH ID</th>
                            <th>PO Number</th>
                            <th>Project Name</th>
                            <th>Arrival Date</th>
                            <th>SKU</th>
                            <th>SKU Desc</th>
                            <th>Qty</th>
                            <th>Aging</th>
                            <th>Serial Number</th>
                            <th>Box Number</th>
                            <th>Condition</th>
                            <th>Notes</th>
                            {/* <th></th> */}
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.all_data.map((e) => (
                            <React.Fragment key={e._id + "frag"}>
                              <tr
                                style={{ backgroundColor: "#d3d9e7" }}
                                className="fixbody"
                                key={e._id}
                              >
                                <td style={{ textAlign: "center" }}>
                                  {e.owner_id}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.wh_id}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.po_number}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.project_name}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {this.convertDateFormat(e.arrival_date)}
                                </td>
                                <td style={{ textAlign: "center" }}>{e.sku}</td>
                                <td style={{ textAlign: "center" }}>
                                  {e.sku_description}
                                </td>
                                <td style={{ textAlign: "center" }}>{e.qty}</td>
                                <td style={{ textAlign: "center" }}>
                                  {e.ageing}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.serial_number}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.box_number}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.condition}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.notes}
                                </td>
                                <td>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    value={e._id}
                                    onClick={this.toggleDelete}
                                    title="Delete"
                                  >
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </Button>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total_dataParent}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title="Delete Inbound"
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>

        {/* Modal create New */}
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
          title="Create Plan"
        >
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Upload File</td>
                  <td>:</td>
                  <td>
                    <input
                      type="file"
                      onChange={this.fileHandlerMaterial.bind(this)}
                      style={{ padding: "10px", visiblity: "hidden" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ModalFooter>
            {/* <Button
              block
              color="link"
              className="btn-pill"
              onClick={this.exportMatInbound}
              size="sm"
            >
              Download Template
            </Button>{" "} */}
            <Button
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveCPOBulk}
            >
              Save
            </Button>{" "}
            <Button
              block
              color="secondary"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveTruncateBulk}
            >
              Truncate
            </Button>
          </ModalFooter>
        </ModalCreateNew>

        {/* Modal New PO */}
        <Modal
          isOpen={this.state.modalMatStockForm}
          toggle={this.togglePOForm}
          className="modal--form-e"
        >
          <ModalHeader>Form CPO</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="po_number">Owner ID</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder=""
                    value={this.state.POForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="po_year">PO Number</Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.POForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="arrival_date">Arrival Date</Label>
                  <Input
                    type="datetime-local"
                    placeholder=""
                    value={this.state.POForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.POForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    type="text"
                    min="0"
                    name="4"
                    placeholder=""
                    value={this.state.POForm[4]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNew}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PO*/}

        {/* Modal Edit PP */}
        <Modal
          isOpen={this.state.modalMatStockEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form Update Product Package</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="po_number">Owner ID</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder=""
                    value={this.state.POForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="po_year">PO Number</Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.POForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="arrival_date">Arrival Date</Label>
                  <Input
                    type="datetime-local"
                    placeholder=""
                    value={this.state.POForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.POForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    type="text"
                    min="0"
                    name="4"
                    placeholder=""
                    value={this.state.POForm[4]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveUpdate}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal Edit PP*/}

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

export default connect(mapStateToProps)(MatInboundPlan);
