import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Table, FormGroup, Label, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
import {convertDateFormatfull, convertDateFormat} from '../../helper/basicFunction'

const API_URL = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const username = 'bamidadmin@e-dpm.com';
const password = 'F760qbAg2sml';

const API_URL_XL = 'https://api-dev.xl.pdb.e-dpm.com/xlpdbapi';
const usernameXL = 'adminbamidsuper';
const passwordXL = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, value }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={value} className="checkmark-dash" />
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
    }
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.downloadMRlist = this.downloadMRlist.bind(this);
    this.getMRList = this.getMRList.bind(this);
    this.getAllMR = this.getAllMR.bind(this);
    this.proceedMilestone = this.proceedMilestone.bind(this);
    this.proceedShipment = this.proceedShipment.bind(this);
    this.handleChangeChecklist = this.handleChangeChecklist.bind(this);
    this.handleChangeShipmentDetail = this.handleChangeShipmentDetail.bind(this);
    this.handleCheckingForm = this.handleCheckingForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL + url, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: username,
          password: password
        }
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
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
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
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Patch data", err.response);
      return respond;
    }
  }

  async getDataFromAPIEXEL(url) {
    try {
      let respond = await axios.get(API_URL_XL + url, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: usernameXL,
          password: passwordXL
        },
      })
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

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  getMRList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list[0] !== "" && (filter_array.push('"mr_id":{"$regex" : "' + this.state.filter_list[0] + '", "$options" : "i"}'));
    this.state.filter_list[1] !== "" && (filter_array.push('"project_name":{"$regex" : "' + this.state.filter_list[1] + '", "$options" : "i"}'));
    this.state.filter_list[2] !== "" && (filter_array.push('"cust_del.cd_id":{"$regex" : "' + this.state.filter_list[2] + '", "$options" : "i"}'));
    this.state.filter_list[3] !== "" && (filter_array.push('"site_info.site_id":{"$regex" : "' + this.state.filter_list[3] + '", "$options" : "i"}'));
    this.state.filter_list[4] !== "" && (filter_array.push('"site_info.site_name":{"$regex" : "' + this.state.filter_list[4] + '", "$options" : "i"}'));
    this.state.filter_list[5] !== "" && (filter_array.push('"current_mr_status":{"$regex" : "' + this.state.filter_list[5] + '", "$options" : "i"}'));
    filter_array.push('"current_milestones":"MS_JOINT_CHECK"');
    this.state.filter_list[7] !== "" && (filter_array.push('"dsp_company":{"$regex" : "' + this.state.filter_list[7] + '", "$options" : "i"}'));
    this.state.filter_list[8] !== "" && (filter_array.push('"eta":{"$regex" : "' + this.state.filter_list[8] + '", "$options" : "i"}'));
    // this.state.filter_list[9] !== "" && (filter_array.push('"created_by":{"$regex" : "' + this.state.filter_list[9] + '", "$options" : "i"}'));
    this.state.filter_list[10] !== "" && (filter_array.push('"updated_on":{"$regex" : "' + this.state.filter_list[10] + '", "$options" : "i"}'));
    this.state.filter_list[11] !== "" && (filter_array.push('"created_on":{"$regex" : "' + this.state.filter_list[11] + '", "$options" : "i"}'));
    this.props.match.params.whid !== undefined && (filter_array.push('"origin.value" : "' + this.props.match.params.whid + '"'));
    let whereAnd = '{' + filter_array.join(',') + '}';
    this.getDataFromAPINODE('/matreq?srt=_id:-1&q=' + whereAnd + '&lmt=' + maxPage + '&pg=' + page).then(res => {
      console.log("MR List Sorted", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ mr_list: items, totalData: totalData });
      }
    })
  }

  getAllMR() {
    let filter_array = [];
    this.state.filter_list[0] !== "" && (filter_array.push('"mr_id":{"$regex" : "' + this.state.filter_list[0] + '", "$options" : "i"}'));
    this.state.filter_list[1] !== "" && (filter_array.push('"project_name":{"$regex" : "' + this.state.filter_list[1] + '", "$options" : "i"}'));
    this.state.filter_list[2] !== "" && (filter_array.push('"cust_del.cd_id":{"$regex" : "' + this.state.filter_list[2] + '", "$options" : "i"}'));
    this.state.filter_list[3] !== "" && (filter_array.push('"site_info.site_id":{"$regex" : "' + this.state.filter_list[3] + '", "$options" : "i"}'));
    this.state.filter_list[4] !== "" && (filter_array.push('"site_info.site_name":{"$regex" : "' + this.state.filter_list[4] + '", "$options" : "i"}'));
    this.state.filter_list[5] !== "" && (filter_array.push('"current_mr_status":{"$regex" : "' + this.state.filter_list[5] + '", "$options" : "i"}'));
    filter_array.push('"current_milestones":"MS_JOINT_CHECK"');
    this.state.filter_list[7] !== "" && (filter_array.push('"dsp_company":{"$regex" : "' + this.state.filter_list[7] + '", "$options" : "i"}'));
    this.state.filter_list[8] !== "" && (filter_array.push('"eta":{"$regex" : "' + this.state.filter_list[8] + '", "$options" : "i"}'));
    // this.state.filter_list[9] !== "" && (filter_array.push('"created_by":{"$regex" : "' + this.state.filter_list[9] + '", "$options" : "i"}'));
    this.state.filter_list[10] !== "" && (filter_array.push('"updated_on":{"$regex" : "' + this.state.filter_list[10] + '", "$options" : "i"}'));
    this.state.filter_list[11] !== "" && (filter_array.push('"created_on":{"$regex" : "' + this.state.filter_list[11] + '", "$options" : "i"}'));
    this.props.match.params.whid !== undefined && (filter_array.push('"origin.value" : "' + this.props.match.params.whid + '"'));
    let whereAnd = '{' + filter_array.join(',') + '}';
    this.getDataFromAPINODE('/matreq?noPg=1&q=' + whereAnd).then(res => {
      console.log("MR List All", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ mr_all: items });
      }
    })
  }

  numToSSColumn(num) {
    var s = '', t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t) / 26 | 0;
    }
    return s || undefined;
  }

  async downloadMRlist() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const allMR = this.state.mr_all;

    let headerRow = ["MR ID", "Project Name", "CD ID", "Site ID", "Site Name", "Current Status", "Current Milestone", "DSP", "ETA", "Created By", "Updated On", "Created On"];
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
    }

    for (let i = 0; i < allMR.length; i++) {
      ws.addRow([allMR[i].mr_id, allMR[i].project_name, allMR[i].cd_id, allMR[i].site_info[0].site_id, allMR[i].site_info[0].site_name, allMR[i].current_mr_status, allMR[i].current_milestones, allMR[i].dsp_company, allMR[i].eta, "", allMR[i].updated_on, allMR[i].created_on])
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Loading Process.xlsx');
  }

  async patchDataToAPI(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL + url, data, {
        headers: {
          'Content-Type': 'application/json',
          'If-Match': _etag
        },
        auth: {
          username: username,
          password: password
        }
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log('respond patch data', respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      this.setState({ action_status: 'failed', action_message: 'Sorry, there is something wrong, please try again!' });
      console.log('respond patch data', err);
      return respond;
    }
  }

  async proceedMilestone(e) {
    const newDate = new Date();
    const dateNow = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate() + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
    const _etag = e.target.value;
    const id_doc = e.currentTarget.id;
    let res = await this.patchDatatoAPINODE('/matreq/loadingProcess/' + id_doc);
    if (res !== undefined) {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () { window.location.reload(); }, 2000);
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
      }
    } else {
      this.setState({ action_status: 'failed' });
    }
  }

  handleCheckingForm() {
    const inputanDetailShipment = this.state.shipment_detail;
    let dataValidate = {};
    let form_id = ["shipment_number", "transporter", "driver_name", "driver_phone_number", "truck_number", "truck_type"];
    let checkerror = [];
    for (let i = 0; i < form_id.length; i++) {
      if (inputanDetailShipment[form_id[i]] === undefined || inputanDetailShipment[form_id[i]] === null) {
        dataValidate[form_id[i]] = false;
        checkerror.push(false);
      }
    }
    console.log("checkerror", checkerror);
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
      list_mr_shipment.push({ "mrId": dataMRSelected[i].mr_id });
    }
    let getDataTransporter = this.state.asp_list.find(e => e.Vendor_Code === inputanDetailShipment.transporter);
    let nameTransporter = inputanDetailShipment.transporter;
    if (getDataTransporter !== undefined) {
      nameTransporter = getDataTransporter.Name;
    }
    const dataShipment = {
      "mrList": list_mr_shipment,
      "shipmentNumber": inputanDetailShipment.shipment_number,
      "dspData": {
        "dsp_transporter_code": inputanDetailShipment.transporter,
        "dsp_transporter": nameTransporter,
        "dsp_destination": inputanDetailShipment.destination_address,
        "dsp_note": inputanDetailShipment.shipment_note,
        "dsp_name": inputanDetailShipment.driver_name,
        "dsp_phone": inputanDetailShipment.driver_phone_number,
        "dsp_truck": inputanDetailShipment.truck_number,
        "dsp_truck_type": inputanDetailShipment.truck_type === "Other" ? inputanDetailShipment.other_truck_type : inputanDetailShipment.truck_type
      }
    }
    let res = await this.patchDatatoAPINODE('/matreq/loadingProcess', dataShipment);
    if (res !== undefined) {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () { window.location.reload(); }, 2000);
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
      }
    } else {
      this.setState({ action_status: 'failed' });
    }
    this.toggleLoading();
  }

  componentDidMount() {
    this.getMRList();
    this.loadOptionsASP();
    // this.getAllMR();
    document.title = 'Loading Process | BAM';
  }

  loadOptionsASP() {
    this.getDataFromAPIEXEL('/vendor_data_non_page').then(res => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ asp_list: items });
      }
    })
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
    })
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
    dataShipment[name.toString()] = value;
    this.setState({ shipment_detail: dataShipment });
  }

  handleChangeChecklist(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const dataMR = this.state.mr_list;
    let MRSelected = this.state.mr_data_selected;
    if (isChecked === true) {
      const getMR = dataMR.find(mr => mr._id === item);
      MRSelected.push(getMR);
    } else {
      MRSelected = MRSelected.filter(function (mr) {
        return mr._id !== item;
      });
    }
    this.setState({ mr_data_selected: MRSelected });
    this.setState(prevState => ({ mr_checked: prevState.mr_checked.set(item, isChecked) }));
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 12; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ width: '150px' }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fa fa-search"></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[i]} name={i} size="sm" />
            </InputGroup>
          </div>
        </td>
      )
    }
    return searchBar;
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    function AlertProcess(props) {
      const alert = props.alertAct;
      const message = props.messageAct;
      if (alert === 'failed') {
        return (
          <div className="alert alert-danger" role="alert">
            {message.length !== 0 ? message : 'Sorry, there was an error when we tried to save it, please reload your page and try again'}
          </div>
        )
      } else {
        if (alert === 'success') {
          return (
            <div className="alert alert-success" role="alert">
              {message}
              Your action was success, please reload your page
            </div>
          )
        } else {
          return (
            <div></div>
          )
        }
      }
    }

    const downloadMR = {
      float: 'right'
    }

    return (
      <div className="animated fadeIn">
        <AlertProcess alertAct={this.state.action_status} messageAct={this.state.action_message} />
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                Shipment Detail
                <Button onClick={this.handleCheckingForm} size="sm" style={{ float: 'right' }} color="success" disabled={this.state.mr_data_selected.length === 0}>
                  <i class="fa fa-plus" aria-hidden="true">&nbsp;</i> Ship
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row size="sm">
                      <Col md="2">
                        <Label htmlFor="shipment_number" >Shipment Number*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="text" name="0" placeholder="" name="shipment_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.shipment_number} />
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="transporter" >Transporter*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="select" placeholder="" name="transporter" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.transporter === undefined ? "" : this.state.shipment_detail.transporter}>
                            <option value="" disabled selected hidden>Select ASP</option>
                            {this.state.asp_list.map((list, i) =>
                              <option value={list.Vendor_Code}>{list.Name}</option>
                            )}
                          </Input>
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_type" >Truck Type*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="select" placeholder="" name="truck_type" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.truck_type === undefined ? "" : this.state.shipment_detail.truck_type}>
                            <option value="" disabled hidden>Select Truct Type</option>
                            <option value="CD1">CD1</option>
                            <option value="CD2">CD2</option>
                            <option value="CD3">CD3</option>
                            <option value="CD4">CD4</option>
                            <option value="Other">Other</option>
                          </Input>
                          {this.state.shipment_detail.truck_type === "Other" && (
                            <Input style={{marginLeft : "5px"}} type="text" name="10" placeholder="Other Type" name="other_truck_type" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.other_truck_type} />
                          )}
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_type" >Destination Address</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="3" placeholder="" name="destination_address" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.destination_address} />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_number" >Truck No*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="text" name="2" placeholder="" name="truck_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.truck_number} />
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_name" >Driver Name*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="text" name="4" placeholder="" name="driver_name" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.driver_name} />
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_phone_number" >Driver Phone*</Label>
                      </Col>
                      <Col md="8">
                        <div style={{ display: 'flex', "align-items": "baseline" }}>
                          <Input type="text" name="5" placeholder="" name="driver_phone_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.driver_phone_number} />
                          {this.state.validation_form.truck_number === false && (
                            <i class="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: "rgba(255,61,0 ,1)", paddingLeft: '10px' }}></i>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_phone_number" >Note</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="5" placeholder="" name="shipment_note" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.shipment_note} />
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
                        {this.state.mr_data_selected.map(mr =>
                          <tr>
                            <td style={{ textAlign: 'left' }}>{mr.mr_id}</td>
                            <td>{mr.project_name}</td>
                            <td>{mr.total_boxes}</td>
                            <td>{mr.list_of_box_id !== undefined ? mr.list_of_box_id.map(e => typeof e === "string" ? e+" , " : e.box_id + " , ") : ''}</td>
                          </tr>
                        )}
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
                <span style={{ lineHeight: '2' }}>
                  <i className="fa fa-align-justify" style={{ marginRight: "8px" }}></i> Loading Process
                </span>
                
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{ verticalAlign: "middle" }}>Action</th>
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
                    <tr>
                      {this.loopSearchBar()}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.mr_list.length === 0 && (
                      <tr>
                        <td colSpan="15">No Data Available</td>
                      </tr>
                    )}
                    {this.state.mr_list.map((list, i) =>
                      <tr key={list._id}>
                        <td>
                          <Checkbox name={list._id} checked={this.state.mr_checked.get(list._id)} onChange={this.handleChangeChecklist} value={list} />
                        </td>
                        <td><Link to={'/mr-detail/' + list._id}>{list.mr_id}</Link></td>
                        <td>{list.project_name}</td>
                        <td>
                          {list.cust_del !== undefined && (list.cust_del.map(custdel => custdel.cd_id).join(' , '))}
                        </td>
                        <td>
                          {list.site_info !== undefined && (list.site_info.map(site_info => site_info.site_id).join(' , '))}
                        </td>
                        <td>
                          {list.site_info !== undefined && (list.site_info.map(site_info => site_info.site_name).join(' , '))}
                        </td>
                        <td>{list.current_mr_status}</td>
                        <td>{list.current_milestones}</td>
                        <td>{list.dsp_company}</td>
                        <td>{convertDateFormat(list.eta)}</td>
                        <td>{list.creator.map(c => c.email)}</td>
                        <td>{convertDateFormatfull(list.updated_on)}</td>
                        <td>{convertDateFormatfull(list.created_on)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>Showing {this.state.mr_list.length} entries from {this.state.totalData} data</small>
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
          <ModalFooter>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData
  }
}

export default connect(mapStateToProps)(LoadingProcess);
