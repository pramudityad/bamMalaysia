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
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Pagination from "react-js-pagination";
import debounce from "lodash.debounce";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import { connect } from "react-redux";
import * as XLSX from "xlsx";
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import Select from 'react-select';


import ModalDelete from "../../components/ModalDelete";
import Loading from '../../components/Loading'
import {getDatafromAPIEXEL,getDatafromAPINODE, postDatatoAPINODE, patchDatatoAPINODE, deleteDataFromAPINODE} from '../../../helper/asyncFunction'
import {convertDMSToDD} from '../../../helper/basicFunction'
import "../MatStyle.css";

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

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

class ASPUserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      search: null,
      filter_name: null,
      perPage: 10,
      prevPage: 1,
      activePage: 1,
      total_data_PO: 0,
      pp_all: [],
      rowsXLS: [],
      data_array: [],
      action_status: null,
      action_message: null,
      all_data: [],
      asp_data: [],
      data_PO: [],
      asp_list : [],
      packageSelected: [],
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalMatStockForm: false,
      modalEdit: false,
      DataForm: new Array(8).fill(null),
      collapse: false,
      danger: false,
      activeItemName: "",
      activeItemId: null,
      createModal: false,
      selected_id: "",
      selected_wh_name: "",
      selected_wh_id: "",
      sortType: 0,
      sortField: "",
      selected_vendor_code: null,
      selected_vendor_name: null,
      list_asp_user: [],
    };
    this.toggleMatStockForm = this.toggleMatStockForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changeFilterName = debounce(this.changeFilterName, 500);
    this.toggle = this.toggle.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.saveNew = this.saveNew.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
    this.requestSort = this.requestSort.bind(this);
    this.handleChangeLimit = this.handleChangeLimit.bind(this);
    this.handleSelectUser = this.handleSelectUser.bind(this);
    this.handlechangevendor = this.handlechangevendor.bind(this);
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

  toggleDelete(e) {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      const name = e.currentTarget.name;
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
        selected_wh_id: name,
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

  resettogglecreateModal() {
    this.setState({
      rowsXLS: [],
    });
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggleEdit(e) {
    this.getASPList();
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.all_data.find((e) => e._id === value);
      let dataForm = this.state.DataForm;
      dataForm[0] = aEdit.wh_name;
      dataForm[1] = aEdit.wh_id;
      dataForm[2] = aEdit.wh_manager;
      dataForm[3] = aEdit.address;
      dataForm[4] = aEdit.owner;
      dataForm[6] = aEdit.latitude;
      dataForm[7] = aEdit.longitude;
      this.setState({ DataForm: dataForm, selected_id: value });
    } else {
      this.setState({ DataForm: new Array(6).fill(null) });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  }

  togglecreateModal() {
    this.setState({
      createModal: !this.state.createModal,
    });
  }

  loadOptionsASP() {
    getDatafromAPIEXEL('/vendor_data_non_page', this.state.tokenUser).then(res => {
      if(res.data !== undefined) {
        const items = res.data._items;
        this.setState({asp_list : items});
      }
    })
  }

  getASPUser() {
    getDatafromAPINODE("/vendorManagement/getAllUser", this.props.dataLogin.token).then((res) => {
      if (res.data !== undefined) {
        const data_user = res.data.data;
        let list_asp_select = [];
        data_user.map(i => list_asp_select.push({'label' : i.email, 'value' : i._id}))
        this.setState({ list_asp_user: list_asp_select,
          });
      } else {
        this.setState({ list_asp_user: [] });
      }
    });
  }

  toggleMatStockForm() {
    this.getASPUser();
    this.loadOptionsASP();
    // this.getASPList();
    this.setState((prevState) => ({
      modalMatStockForm: !prevState.modalMatStockForm,
    }));
  }

  changeFilterName(value) {
    this.getWHStockList();
  }

  // handleChangeFilter = (e) => {
  //   let value = e.target.value;
  //   if (value.length === 0) {
  //     value = null;
  //   }
  //   this.setState({ filter_name: value }, () => {
  //     this.changeFilterName(value);
  //   });
  // };

  handleChangeFilter = (e) => {
    let keyword = e.target.value;
    this.setState({ filter_name: keyword });
  };

  getWHStockList() {
    this.toggleLoading();
    let filter_wh_name =
      this.state.filter_name === null
        ? '{"$exists" : 1}'
        : '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    let whereAnd = '{"wh_name": ' + filter_wh_name + "}";
    getDatafromAPINODE(
      "/whManagement/warehouse?q=" +
        whereAnd +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage, this.props.dataLogin.token
    ).then((res) => {
      // console.log("all data ", res.data);
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

  getASPList() {
    // switch (this.props.dataLogin.account_id) {
    //   case "xl":
    getDatafromAPINODE('/vendorManagement/viewAllVendor', this.props.dataLogin.token).then((res) => {
      // console.log("asp data ", res.data);
      if (res.data !== undefined) {
        this.setState({ asp_data: res.data.data });
      } else {
        this.setState({ asp_data: [] });
      }
    });
    //     break;
    //   default:
    //     break;
    // }
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
    // console.log("rABS");
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
      console.log('col ', col)
      for (let j = 0; j < dataXLS[0].length; j++) {
        if (typeof dataXLS[i][j] === "object") {
          let dataObject = this.checkValue(JSON.stringify(dataXLS[i][j]));
          if (dataObject !== null) {
            dataObject = dataObject.replace(/"/g, "");
          }
          console.log('dataObject ', dataObject)
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
    // console.log("here ur dataLogin", this.props.dataLogin);
    // console.log('token from asycn ', this.props.dataLogin.token);
    // this.getWHStockList();
    this.getASPList();
    document.title = "Warehouse Management | BAM";
  }

  handleChangeChecklist(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const mrList = this.state.assignment_list;
    let dataMRChecked = this.state.data_asg_checked;
    if (isChecked === true) {
      const getMR = mrList.find((e) => e._id === item);
      dataMRChecked.push(getMR);
    } else {
      dataMRChecked = dataMRChecked.filter(function (e) {
        return e._id !== item;
      });
    }
    this.setState({ data_asg_checked: dataMRChecked });
    this.setState((prevState) => ({
      asg_checked: prevState.asg_checked.set(item, isChecked),
    }));
  }

  handleChangeChecklistAll(e) {
    const isChecked = e.target.checked;
    const mrList = this.state.assignment_all;
    let dataMRChecked = this.state.data_asg_checked;
    if (isChecked === true) {
      for (let i = 0; i < mrList.length; i++) {
        if (this.state.asg_checked.get(mrList[i]._id) !== true) {
          dataMRChecked.push(mrList[i]);
        }
        this.setState((prevState) => ({
          asg_checked: prevState.asg_checked.set(mrList[i]._id, true),
        }));
      }
      this.setState({
        data_asg_checked: dataMRChecked,
        asg_checked_all: isChecked,
      });
    } else {
      this.setState({ asg_checked: new Map(), data_asg_checked: [] });
      this.setState({ asg_checked_all: isChecked });
    }
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
          this.getWHStockList();
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
          this.getWHStockList();
        });
        break;
      default:
        // nothing
        break;
    }
  }

  saveMatStockWHBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    console.log("xlsx data", JSON.stringify(BulkXLSX));
    // const BulkData = await this.getMatStockFormat(BulkXLSX);
    const res = await postDatatoAPINODE("/whManagement/createWarehouse", {
      managementData: BulkXLSX,
    }, this.props.dataLogin.token);
    console.log("res bulk ", res.response);
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
    } else {
      if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
        if (res.response.data.error.message !== undefined) {

          this.setState({ action_status: 'failed', action_message: res.response.data.error.message });
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
    console.log("xlsx data", JSON.stringify(BulkXLSX));
    const res = await postDatatoAPINODE(
      "/whManagement/createWhManagementTruncate",
      {
        managementData: BulkXLSX,
      }, this.props.dataLogin.token
    );
    console.log("res bulk ", res);
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
    } else {
      this.setState({ action_status: "failed" }, () => {
        this.toggleLoading();
      });
    }
  };

  handleChangeForm(e) {
    const value = e.target.value;
    const index = e.target.name;
    console.log("value ", value, index);
    let dataForm = this.state.DataForm;
    dataForm[parseInt(index)] = value;
    this.setState({ DataForm: dataForm });
  }

  async saveUpdate() {
    let respondSaveEdit = undefined;
    const dataPPEdit = this.state.DataForm;
    const objData = this.state.selected_id;
    // console.log('obj data ', objData);
    let pp = {
      wh_name: dataPPEdit[0],
      wh_id: dataPPEdit[1],
      wh_manager: dataPPEdit[2],
      address: dataPPEdit[3],
      owner: dataPPEdit[4],
      latitude: dataPPEdit[6],
      longitude: dataPPEdit[7],
    };
    this.toggleLoading();
    this.toggleEdit();
    let patchData = await patchDatatoAPINODE(
      "/whManagement/UpdateOneWarehouse/" + objData,
      { data: pp }, this.props.dataLogin.token
    );
    console.log("patch data ", pp);
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
      if (patchData.response !== undefined && patchData.response.data !== undefined && patchData.response.data.error !== undefined) {
        if (patchData.response.data.error.message !== undefined) {
          this.setState({ action_status: 'failed', action_message: patchData.response.data.error.message });
        } else {
          this.setState({ action_status: 'failed', action_message: patchData.response.data.error });
        }
      } else {
        this.setState({ action_status: 'failed' });
      }
    }
  }

  async saveNew() {
    this.toggleMatStockForm();
    this.toggleLoading();
    let poData = [];
    for (let i = 0; i < this.state.id_email_selected.length; i++) {
      poData.push({
        id: this.state.id_email_selected[i],
        vendor_code: this.state.selected_vendor_code,
      });
    }
    // poData.push(pp);
    let postData = await patchDatatoAPINODE(
      "/vendorManagement/assignVendor",
      {
        data: poData,
      }, this.props.dataLogin.token
    ).then((res) => {
      console.log("res save ", res);
      if (res.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          this.toggleLoading();
        });
      } else {
        if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
          if (res.response.data.error.message !== undefined) {
            this.setState({ action_status: 'failed', action_message: res.response.data.error.message });
          } else {
            this.setState({ action_status: 'failed', action_message: res.response.data.error });
          }
        } else {
          this.setState({ action_status: 'failed' });
        }
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
    let download_all = [];
    let getAll_nonpage = await getDatafromAPINODE(
      "/whManagement/warehouse?noPg=1", this.props.dataLogin.token
    );
    if (getAll_nonpage.data !== undefined) {
      download_all = getAll_nonpage.data.data;
    }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let headerRow = [
      "Warehouse Name",
      "Warehouse ID",
      "WH Manager",
      "Address",
      "Latitude",
      "Longitude",
      "Owner",
      "WH Type",
    ];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + "1").font = { size: 11, bold: true };
    }

    for (let i = 0; i < download_all.length; i++) {
      let list = download_all[i];
      ws.addRow([
        list.wh_name,
        list.wh_id,
        list.wh_manager,
        list.address,
        list.latitude,
        list.longitude,
        list.owner,
        list.wh_type,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All Warehouse.xlsx");
  }

  exportMatStatus = async () => {

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();
    const aspData = this.state.asp_data;
    // console.log('aspData ', aspData);

    ws.addRow([
      "wh_name",
      "wh_id",
      "wh_manager",
      "address",
      "latitude",
      "longitude",
      "owner",
      "wh_type",
    ]);
    ws.addRow(["Jakarta", "JKT1", "Asep", "Priuk", 0, 0, "EID", "Internal"]);
    ws.addRow(["Jakarta2", "JKT1", "Asep", "Priuk", 0, 0, "2000175941", "dsp"]);
    ws.addRow(["Jakarta3", "JKT1", "Asep", "Priuk", 0, 0, "2000175941", "asp"]);

    ws2.addRow(["Vendor Name", "Vendor Code"]);
    ws2.addRow(["EID", "Internal"]);
    for (let i = 0; i < aspData.length; i++) {
      // const element = aspData[i];
      ws2.addRow([aspData[i].Name, aspData[i].Vendor_Code]);
    }


    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "WH Management Template.xlsx");
  };

  getListSort() {
    this.toggleLoading();
    getDatafromAPINODE(
      "/whManagement/warehouse?srt=" +
        this.state.sortField +
        ":" +
        this.state.sortType +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage, this.props.dataLogin.token
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

  handleSelectUser = (newValue) => {
    if (newValue !== null) {
      const selectPriority = [];
      newValue.forEach( i => {
        selectPriority.push(i.value)
      })
      console.log('selectPriority ',selectPriority)
      this.setState({id_email_selected : selectPriority});
      // this.priorityToXLSCreation(selectPriority)
    } else {
      this.setState({id_email_selected : []});
      // this.priorityToXLSCreation([])
    }
    return newValue;
  }

  DeleteData = async () => {
    const objData = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    const DelData = deleteDataFromAPINODE(
      "/whManagement/deleteWarehouse/" + objData, this.props.dataLogin.token
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.getWHStockList();
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    });
  };

  requestSort(e) {
    let sortType = this.state.sortType;
    if (sortType === 0) {
      sortType = 1;
    }
    let sort = e;
    const ascending = 1;
    const descending = -1;
    if (sortType === -1) {
      this.setState({ sortType: ascending, sortField: sort }, () => {
        this.getListSort();
      });
    } else {
      this.setState({ sortType: descending, sortField: sort }, () => {
        this.getListSort();
      });
    }
  }

  async handlechangevendor(e) {
    const code = e.target.value;
    // console.log('code ', code);
    // const name = e.target.value;
    // const value = e.target.value;
    this.setState({ selected_vendor_code: code }, () => {
      console.log(this.state.selected_vendor_code)
    });
  }

  render() {
    const {all_data} = this.state;
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
                  {" "}
                  Vendor List{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                        <Button color="success" onClick={this.toggleMatStockForm}>
                        <i className="fa fa-plus-square" aria-hidden="true">
                              {" "}
                              &nbsp;{" "}
                            </i>{" "}
                            New User
                        </Button>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                </div>
              </CardHeader>
              <Collapse
                isOpen={this.state.collapse}
                onEntering={this.onEntering}
                onEntered={this.onEntered}
                onExiting={this.onExiting}
                onExited={this.onExited}
              ></Collapse>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: "10px" }}>
                    {/* <div
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
                      </div> */}
                      <div
                        style={{
                          float: "left",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      ></div>
                    </div>
                    <input
                      className="search-box-material"
                      type="text"
                      name="filter"
                      placeholder="Search"
                      onChange={(e) => this.handleChangeFilter(e)}
                      // value={this.state.filter_name}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div >
                      <Table hover size="sm">
                        <thead
                          // style={{ backgroundColor: "#73818f" }}
                          className="fixed-whman"
                        >
                          <tr align="center">
                          <th>
                            {/* <Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_name')}
                              > */}
                                <b>Vendor Name</b>
                              {/* </Button> */}
                              </th>
                              <th>
                                {/* <Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_id')}
                              > */}
                                <b>Vendor Code</b>
                              {/* </Button> */}
                              </th>
                            <th ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.asp_data
                           .filter((e) => {
                            if (this.state.filter_name === null) {
                              return e;
                            } else if (
                              e.Name
                                .toLowerCase()
                                .includes(this.state.filter_name.toLowerCase())
                            ) {
                              return e;
                            }
                          })
                            .map((e) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr
                                  // style={{ backgroundColor: "#d3d9e7" }}
                                  className="fixbody"
                                  key={e._id}
                                >
                                  <td style={{ textAlign: "center" }}>
                                    {e.Name}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Vendor_Code}
                                  </td>
                                  <td>
                                  <Link to={'/asp-user-management/' + e.Vendor_Code}>
                                    <Button color="primary" size="sm" style={{ marginRight: '10px' }}> <i className="fa fa-info-circle" aria-hidden="true">&nbsp;</i> Detail</Button>
                                  </Link>
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
        {/* dont need */}

        {/* Modal New PO */}
        <Modal
          isOpen={this.state.modalMatStockForm}
          toggle={this.toggleMatStockForm}
          className="modal--form-e"
        >
          <ModalHeader>Vendor Management</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  {/* single */}
                  <Label htmlFor="wh_name">Email</Label>
                  <Select
                    isMulti
                    name="priority"
                    options={this.state.list_asp_user}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleSelectUser}
                    // isDisabled = {this.state.list_asp_user.length==0}
                                />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor Name</Label>
                  <Input type="select" name="14" onChange={this.handlechangevendor}>
                          <option value="" disabled selected hidden>Select Vendor</option>
                          {this.state.asp_data.map((list, i) =>
                            <option value={list.Vendor_Code}>{list.Name}</option>
                          )}
                        </Input>
                </FormGroup>
                </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNew}>
              Save
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal Edit PP */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form Update WH Management</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="wh_name">Warehouse Name</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder=""
                    value={this.state.DataForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="wh_id">Warehouse ID </Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.DataForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="wh_manager">WH Manager</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder=""
                    value={this.state.DataForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.DataForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    type="select"
                    name="4"
                    placeholder=""
                    value={this.state.DataForm[4]}
                    onChange={this.handleChangeForm}
                  >
                    {this.state.asp_data.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Name}</option>
                    ))}
                    <option value="Internal">Internal</option>
                  </Input>
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

        {/* Modal create New */}
        <Modal
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
        >
          <ModalHeader toggle={this.togglecreateModal}>
            Create New WareHouse
          </ModalHeader>
          <ModalBody>
            <CardBody>
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
            </CardBody>
          </ModalBody>
          <ModalFooter>
            {/* <Button
              block
              color="link"
              className="btn-pill"
              onClick={this.exportMatStatus}
            >
              Download Template
            </Button>{" "} */}
            <Button
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveMatStockWHBulk}
            >
              Save
            </Button>{" "}
            {/* <Button
              block
              color="secondary"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveTruncateBulk}
            >
              Truncate
            </Button> */}
          </ModalFooter>
        </Modal>

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title={"Delete WH "+ this.state.selected_wh_id}
          body={"Are you sure ?"}
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>

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

export default connect(mapStateToProps)(ASPUserManagement);
