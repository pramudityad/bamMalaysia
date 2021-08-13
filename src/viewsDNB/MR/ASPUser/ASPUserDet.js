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
import {getDatafromAPIEXEL ,getDatafromAPINODE, postDatatoAPINODE, patchDatatoAPINODE, deletemanyDataFromAPINODE} from '../../../helper/asyncFunction'
import {convertDMSToDD} from '../../../helper/basicFunction'
// import "../MatStyle.css";

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

class ASPUserDet extends React.Component {
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
      Accounts_data: [],
      data_PO: [],
      list_asp_user: [],
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
      vendor_data: {},
      id_email_selected: []
    };
    this.toggleMatStockForm = this.toggleMatStockForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changeFilterName = debounce(this.changeFilterName, 500);
    this.toggle = this.toggle.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
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

  toggleMatStockForm() {
    this.getASPUser();
    // this.getASPList();
    this.setState((prevState) => ({
      modalMatStockForm: !prevState.modalMatStockForm,
    }));
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

  getASPList(_id) {
    getDatafromAPINODE("/vendorManagement/viewVendor/"+ _id, this.props.dataLogin.token).then((res) => {
      if (res.data !== undefined) {                
        this.setState({ Accounts_data: res.data.data.Accounts, vendor_data: res.data.data 
          });
          console.log('vendor data ',this.state.vendor_data)
      } else {
        this.setState({ Accounts_data: null, vendor_data:{} });
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
    if (this.props.match.params.id === undefined) {
      this.getASPList();
    } else {
      this.getASPList(this.props.match.params.id);
    }
    // console.log(this.state.tokenUser)
    document.title = "Vendor Management | BAM";
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
    const dataPPEdit = this.state.DataForm;
      poData.push({
        id: this.state.id_email_selected.map(e=> e),
        vendor_code: this.props.match.params.id,
      });
    // poData.push(pp);
    console.log("post data ", poData);
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

  DeleteData = async () => {
    const _id = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    let pp = {
      id: _id
    }
    const DelData = deletemanyDataFromAPINODE(
      "/vendorManagement/deleteVendor", this.state.tokenUser, {data: [pp] }
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    });
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
                  Vendor Management{" "}{this.state.vendor_data.Vendor_Name}
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
                    {/* <input
                      className="search-box-material"
                      type="text"
                      name="filter"
                      placeholder="Search "
                      onChange={this.handleChangeFilter}
                      value={this.state.filter_name}
                    /> */}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div >
                      <Table striped size="sm">
                        <thead
                          // style={{ backgroundColor: "#73818f" }}
                          // className="fixed-whman"
                        >
                          <tr>
                          {/* <th><Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_name')}
                              >
                                <b>User Name</b>
                              </Button></th> */}
                              <th>User Name</th>
                              {/* <th><Button color="ghost-dark"
                                onClick={() => this.requestSort('wh_id')}
                              >
                                <b>Vendor Code</b>
                              </Button></th> */}
                            <th>Fist Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Accounts_data !== null ? 
                            this.state.Accounts_data.map((e) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr
                                  // style={{ backgroundColor: "#d3d9e7" }}
                                  // className="fixbody"
                                  key={e._id}
                                >
                                  <td>
                                    {e.username}
                                  </td>
                                  <td>
                                    {e.first_name}
                                  </td>
                                  <td >
                                    {e.last_name}
                                  </td>    
                                  <td >
                                    {e.email}
                                  </td>  
                                  <td>
                                    <Button
                                      size="sm"
                                      color="danger"
                                      value={e._id}
                                      name={e.username}
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
                            )) : (
                            <tr>
                            <td colSpan="15">No User Available</td>
                          </tr>)}
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
          title={"Delete User "+ this.state.selected_wh_id}
          body={"From vendor "+ this.state.vendor_data.Vendor_Name+". Are you sure ?"}
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>

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
                </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNew}>
              Save
            </Button>
          </ModalFooter>
        </Modal>

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

export default connect(mapStateToProps)(ASPUserDet);
