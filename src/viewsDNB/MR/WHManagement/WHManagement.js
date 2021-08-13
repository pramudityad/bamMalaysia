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

import ModalDelete from "../../components/ModalDelete";
import Loading from '../../components/Loading'
import {getDatafromAPIEXEL ,getDatafromAPINODE, postDatatoAPINODE, patchDatatoAPINODE, deleteDataFromAPINODE} from '../../../helper/asyncFunction'
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

class WHManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      search: null,
      filter_name: "",
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
      dataForm[8] = aEdit.factory_code;
      dataForm[9] = aEdit.wh_type;
      dataForm[10] = aEdit.city;
      dataForm[11] = aEdit.region;
      dataForm[12] = aEdit.post_code;
      this.setState({ DataForm: dataForm, selected_id: value });
    } else {
      this.setState({ DataForm: new Array(6).fill(null) });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  }

  toggleMatStockForm() {
    this.getASPList();
    this.setState((prevState) => ({
      modalMatStockForm: !prevState.modalMatStockForm,
    }));
  }

  togglecreateModal() {
    this.setState({
      createModal: !this.state.createModal,
    });
  }

  changeFilterName(value) {
    this.getWHStockList();
  }

  handleChangeFilter = (e) => {
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    this.setState({ filter_name: value }, () => {
      this.changeFilterName(value);
    });
  };

  getWHStockList() {
    this.toggleLoading();
    let filter = '{"$regex" : "", "$options" : "i"}';
    if (this.state.filter_name !== "") {
      filter = '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    }
    // let filter = this.state.filter_name === ""  ? '{"$exists" : 1}' : '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    let whereOr = '{"$or" : [{"wh_name": ' + filter + '}, {"owner_name": ' + filter + '}]}';
    getDatafromAPINODE(
      "/whManagement/warehouse?q=" +
        whereOr +
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
    getDatafromAPIEXEL("/vendor_data_non_page").then((res) => {
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
    this.getWHStockList();
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
    // const BulkData = await this.getMatStockFormat(BulkXLSX);
    const res = await postDatatoAPINODE("/whManagement/createWarehouse", {
      managementData: BulkXLSX,
    }, this.props.dataLogin.token);
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
    const res = await postDatatoAPINODE(
      "/whManagement/createWhManagementTruncate",
      {
        managementData: BulkXLSX,
      }, this.props.dataLogin.token
    );
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
    let dataForm = this.state.DataForm;
    dataForm[parseInt(index)] = value;
    this.setState({ DataForm: dataForm });
  }

  async saveUpdate() {
    let respondSaveEdit = undefined;
    const dataWHEdit = this.state.DataForm;
    const objData = this.state.selected_id;
    // console.log('obj data ', objData);
    let WH = {
      wh_name: dataWHEdit[0],
      wh_id: dataWHEdit[1],
      wh_manager: dataWHEdit[2],
      address: dataWHEdit[3],
      owner: dataWHEdit[4],
      latitude: dataWHEdit[6],
      longitude: dataWHEdit[7],
      factory_code: dataWHEdit[8],
      wh_type: dataWHEdit[9],
      city : dataWHEdit[10],
      region: dataWHEdit[11],
      post_code : dataWHEdit[12],
    };
    this.toggleLoading();
    this.toggleEdit();
    console.log("WH Management Edit", JSON.stringify(WH));
    let patchData = await patchDatatoAPINODE(
      "/whManagement/UpdateOneWarehouse/" + objData,
      { data: WH }, this.props.dataLogin.token
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
    let respondSaveNew = undefined;
    const dataWHEdit = this.state.DataForm;
    let WH = {
      wh_name: dataWHEdit[0],
      wh_id: dataWHEdit[1],
      wh_manager: dataWHEdit[2],
      address: dataWHEdit[3],
      owner: dataWHEdit[4],
      wh_type: dataWHEdit[5],
      latitude: dataWHEdit[6],
      longitude: dataWHEdit[7],
      factory_code: dataWHEdit[8],
      city : dataWHEdit[10],
      region: dataWHEdit[11],
      post_code : dataWHEdit[12],
    };
    poData.push(WH);
    let postData = await postDatatoAPINODE(
      "/whManagement/createOneWarehouse",
      {
        managementData: WH,
      }, this.props.dataLogin.token
    ).then((res) => {
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
      "City",
      "Region",
      "Post Code",
      "Latitude",
      "Longitude",
      "Owner",
      "WH Type",
      "EF Code",
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
        list.city,
        list.region,
        list.post_code,
        list.latitude,
        list.longitude,
        list.owner,
        list.wh_type,
        list.factory_code,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All List.xlsx");
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

  exportMatStatus = async () => {

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();
    const aspData = this.state.asp_data;

    ws.addRow([
      "wh_name",
      "wh_id",
      "wh_manager",
      "address",
      "city",
      "region",
      "post_code",
      "latitude",
      "longitude",
      "owner",
      "wh_type",
      "factory_code",
    ]);
    ws.addRow(["Jakarta", "JKT1", "Asep", "Priuk","JKT","Jabo","12351", 0, 0, "EID", "Internal","EF6"]);
    ws.addRow(["Jakarta2", "JKT1", "Asep", "Priuk","JKT","Jabo","12351", 0, 0, "2000175941", "dsp","EF6"]);
    ws.addRow(["Jakarta3", "JKT1", "Asep", "Priuk","JKT","Jabo","12351", 0, 0, "2000175941", "asp","EF6"]);

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
                  WH Management{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                    {this.state.userRole.includes("Flow-PublicInternal") !==
                    true ? (
                      <div>
                        <Dropdown
                          isOpen={this.state.dropdownOpen[0]}
                          toggle={() => {
                            this.toggle(0);
                          }}
                        >
                          <DropdownToggle block color="success">
                            <i className="fa fa-plus-square" aria-hidden="true">
                              {" "}
                              &nbsp;{" "}
                            </i>{" "}
                            Create New
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={this.toggleMatStockForm}>
                              > Form{" "}
                            </DropdownItem>
                            <DropdownItem onClick={this.togglecreateModal}>
                              > Bulk{" "}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    ) : (
                      ""
                    )}
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
                        <DropdownItem onClick={this.exportMatStatus}>
                          {" "}
                          WH Management Template
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
              ></Collapse>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: "10px" }}>
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
                      placeholder="Search "
                      onChange={this.handleChangeFilter}
                      value={this.state.filter_name}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div >
                      <Table size="sm">
                        <thead
                          // style={{ backgroundColor: "#73818f" }}
                          className="fixed-whman"
                        >
                          <tr align="center">
                          <th><Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_name')}
                              >
                                <b>Warehouse Name</b>
                              </Button></th>
                              <th><Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_id')}
                              >
                                <b>Warehouse ID</b>
                              </Button></th>
                            <th style={{ width: '100px'}}>WH Manager</th>
                            <th>Address</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Owner</th>
                            <th>WH Type</th>
                            <th>FF Code</th>
                            <th colspan="2"></th>
                            {/* <th></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {all_data
                            .map((e) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr
                                  style={{ backgroundColor: "#d3d9e7" }}
                                  className="fixbody"
                                  key={e._id}
                                >
                                  <td style={{ textAlign: "center" }}>
                                    {e.wh_name}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.wh_id}
                                  </td>
                                  <td >
                                    {e.wh_manager}
                                  </td>
                                  <td >
                                    {e.address}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.latitude}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.longitude}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.owner_name}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.wh_type}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.factory_code}
                                  </td>
                                  <td>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      value={e._id}
                                      onClick={this.toggleEdit}
                                      title="Edit"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Button>
                                  </td>
                                  <td>
                                    <Button
                                      size="sm"
                                      color="danger"
                                      value={e._id}
                                      name={e.wh_id}
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
        {/* dont need */}

        {/* Modal New PO */}
        <Modal
          isOpen={this.state.modalMatStockForm}
          toggle={this.toggleMatStockForm}
          className="modal--form-e"
        >
          <ModalHeader>Form WH Management</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="wh_name">Warehouse Name</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder="Warehouse Name"
                    value={this.state.DataForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <Row>
                <Col sm="8">
                  <FormGroup>
                    <Label htmlFor="wh_id">Warehouse ID </Label>
                    <Input
                      type="text"
                      name="1"
                      placeholder="Warehouse ID"
                      value={this.state.DataForm[1]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="wh_id">FF Code</Label>
                    <Input
                      type="text"
                      name="8"
                      placeholder="Factory Code"
                      value={this.state.DataForm[8]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="wh_manager">WH Manager</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder="WH Manager"
                    value={this.state.DataForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder="Address"
                    value={this.state.DataForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">City</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder="City"
                    value={this.state.DataForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <Row>
                <Col sm="8">
                  <FormGroup>
                    <Label htmlFor="wh_id">Region</Label>
                    <Input
                      type="text"
                      name="11"
                      placeholder="Region"
                      value={this.state.DataForm[11]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="wh_id">Post Code</Label>
                    <Input
                      type="text"
                      name="12"
                      placeholder="Post Code"
                      value={this.state.DataForm[12]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    type="number"
                    step="0.1"
                    name="6"
                    placeholder="Latitude"
                    value={this.state.DataForm[6]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    type="number"
                    step="0.1"
                    name="7"
                    placeholder="Longitude"
                    value={this.state.DataForm[7]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="owner type">Owner Type</Label>
                  <Input
                    type="select"
                    name="5"
                    placeholder=""
                    value={this.state.DataForm[5]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">Select Owner Type</option>
                    <option value="ASP">ASP</option>
                    <option value="DSP">DSP</option>
                    <option value="Internal">Internal</option>
                  </Input>
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
                    <option selected="true" disabled="disabled">Select Owner</option>
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
            <Button color="success" onClick={this.saveNew} disabled={!this.state.DataForm}>
              Create
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PO*/}

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
                <Row>
                  <Col sm="8">
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
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <Label htmlFor="wh_id">EF Code</Label>
                      <Input
                        type="text"
                        name="8"
                        placeholder="Factory Code"
                        value={this.state.DataForm[8]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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
                  <Label htmlFor="address">City</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder="City"
                    value={this.state.DataForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <Row>
                <Col sm="8">
                  <FormGroup>
                    <Label htmlFor="wh_id">Region</Label>
                    <Input
                      type="text"
                      name="11"
                      placeholder="Region"
                      value={this.state.DataForm[11]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="wh_id">Post Code</Label>
                    <Input
                      type="text"
                      name="12"
                      placeholder="Post Code"
                      value={this.state.DataForm[12]}
                      onChange={this.handleChangeForm}
                    />
                  </FormGroup>
                </Col>
                </Row>
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

export default connect(mapStateToProps)(WHManagement);
