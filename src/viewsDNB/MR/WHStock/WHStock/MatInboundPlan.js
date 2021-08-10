import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse } from 'reactstrap';
import { Col, FormGroup, Label, Row, Table, Input } from 'reactstrap';
import { ExcelRenderer } from 'react-excel-renderer';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import debounce from 'lodash.debounce';
import Select from 'react-select';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

import '../MatStyle.css';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, value }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={value} className="checkmark-dash" />
);

const DefaultNotif = React.lazy(() => import('../../DefaultView/DefaultNotif'));

const API_URL_XL = 'https://api-dev.xl.pdb.e-dpm.com/xlpdbapi';
const usernameBAM = 'adminbamidsuper';
const passwordBAM = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';


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
      rowsXLS: [],
      cpo_array: [],
      action_status: null,
      action_message: null,
      all_data: [],
      data_PO: [],
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
    }
    this.togglePOForm = this.togglePOForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changeFilterDebounce = debounce(this.changeFilterName, 500);
    this.toggle = this.toggle.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.saveNewPO = this.saveNewPO.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  async getDatafromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
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
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
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
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
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


  changeFilterName(value) {
    this.getWHInboundList();
  }

  handleChangeFilter = (e) => {
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    this.setState({ filter_name: value }, () => {
      this.changeFilterDebounce(value);
    });
  }

  getWHInboundList() {
    // let po_number = this.state.filter_name === null ? '"po_number":{"$exists" : 1}' : '"po_number":{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    // this.getDatatoAPIEXEL('/po_op?max_results=' + this.state.perPage + '&page=' + this.state.activePage + '&where={' + po_number + '}')
    this.getDatafromAPINODE('/whInboundPlan/getWhInboundPlan')
      .then(res => {
        // console.log('all cpoDB', res.data)
        if (res.data !== undefined) {
          this.setState({ all_data: res.data.data })
        } else {
          this.setState({ all_data: []});
        }
      })
  }

  isSameValue(element, value) {
    //function for FindIndex
    return this.checkValuetoString(element).toLowerCase() === this.checkValuetoString(value).toLowerCase();
  }

  getIndex(data, value) {
    //get index of value in Array
    return data.findIndex(e => this.isSameValue(e, value));
  }

  checkValue(props) {
    // if value undefined return null
    if (typeof props === 'undefined') {
      return null;
    } else {
      return props;
    }
  }

  checkValuetoString(props) {
    // if value undefined return ""
    if (typeof props === 'undefined' || props === null) {
      return "";
    } else {
      return props;
    }
  }

  checkValueReturn(value1, value2) {
    // if value undefined or null return Value2
    if (typeof value1 !== 'undefined' && value1 !== null) {
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
      const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array', cellDates:true});
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {header:1, devfal : null});
      /* Update state */
      this.ArrayEmptytoNull(data);
    };
    if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }

  ArrayEmptytoNull(dataXLS){
    let newDataXLS = [];
    for(let i = 0; i < dataXLS.length; i++){
      let col = [];
      for(let j = 0; j < dataXLS[0].length; j++){
        if(typeof dataXLS[i][j] === "object"){
          let dataObject = this.checkValue(JSON.stringify(dataXLS[i][j]));
          if(dataObject !== null){
            dataObject = dataObject.replace(/"/g, "");
          }
          col.push(dataObject);
        }else{
          col.push(this.checkValue(dataXLS[i][j]));
        }
      }
      newDataXLS.push(col);
    }
    this.setState({
      rowsXLS: newDataXLS
    });
  }

  componentDidMount() {
    this.getWHInboundList();
    document.title = 'Material Inbound Plan | BAM';
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getWHInboundList();
    });
  }

  toggleLoading() {
    this.setState(prevState => ({
      modal_loading: !prevState.modal_loading
    }));
  }

  togglePOForm() {
    this.setState(prevState => ({
      modalPOForm: !prevState.modalPOForm
    }));
  }

  handleChangeForm(e) {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.POForm;
    dataForm[parseInt(index)] = value;
    this.setState({ POForm: dataForm });
  }

  async getMatInboundFormat(dataImport) {
    const dataHeader = dataImport[0];
    const onlyParent = dataImport.map(e => e).filter(e => (this.checkValuetoString(e[this.getIndex(dataHeader, 'po_number')])));
    let cpo_array = [];
    if (onlyParent !== undefined && onlyParent.length !== 0) {
      for (let i = 1; i < onlyParent.length; i++) {
        const cpo = {
          "po_number": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'po_number')]),
          "date": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'date')]),
          "currency": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'currency')]),
          "payment_terms": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'payment_terms')]),
          "shipping_terms": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'shipping_terms')]),
          "contract": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'contract')]),
          "contact": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'contact')]),
        }
        if (cpo.po_number !== undefined && cpo.po_number !== null) {
          cpo["po_number"] = cpo.po_number.toString();
        }
        if (cpo.year !== undefined && cpo.year !== null) {
          cpo["po_year"] = cpo.year.toString();
        }
        if (cpo.currency !== undefined && cpo.currency !== null) {
          cpo["currency"] = cpo.currency.toString();
        }
        cpo_array.push(cpo);
      }
      // console.log(JSON.stringify(cpo_array));
      return cpo_array;
    } else {
      this.setState({ action_status: 'failed', action_message: 'Please check your format' }, () => {
        this.toggleLoading();
      });
    }
  }

  saveCPOBulk = async () => {
    this.toggleLoading();
    const BulkXLSX = this.state.rowsXLS;
    // const cpoData = await this.getMatInboundFormat(BulkXLSX);
    const res = await this.postDatatoAPINODE('/whInboundPlan/createWhInboundPlan', { 'inboundPlanData': BulkXLSX });
    if (res.data !== undefined) {
      this.setState({ action_status: 'success' });
      this.toggleLoading();
    } else {
      this.setState({ action_status: 'failed' }, () => {
        this.toggleLoading();
      });
    }
  }

  async saveNewPO() {
    this.togglePOForm();
    this.toggleLoading();
    let poData = [];
    let respondSaveNew = undefined;
    const dataPPNew = this.state.POForm;
    const ppcountID = Math.floor(Math.random() * 1000).toString().padStart(6, '0');
    const po_num = dataPPNew[0];
    let pp = {
      "po_number": po_num.toString(),
      "po_year": dataPPNew[1],
      "currency": dataPPNew[2],
      "value": dataPPNew[3],
      "number_of_sites": dataPPNew[4]
    }
    poData.push(pp);
    let postData = await this.postDatatoAPIEXEL('/po_op', pp)
      .then(res => {
        if (res.data !== undefined) {
          this.toggleLoading();
        } else {
          this.setState({ action_status: 'failed', action_message: res.response.data.error });
          this.toggleLoading();
        }
      });
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

  exportMatInbound = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(["owner_id","po_number","arrival_date","id_project_doc","sku"]);
    ws.addRow(["DDP-XLCOM","PO0001","2020-04-17","5df99ce5face981b7ace8822","1"]);
    ws.addRow(["XLCOM","PO0002","2020-04-17","5df99ce5face981b7ace8823","2"]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'Material Inbound Template.xlsx');
  }


  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                <span style={{ marginTop: '8px', position: 'absolute' }}>Material Inbound Plan</span>
                <div className="card-header-actions" style={{ display: 'inline-flex' }}>
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                      <DropdownToggle caret color="light">
                        Download Template
                        </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        <DropdownItem onClick={this.exportMatInbound}> Material Inbound Template</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div>
                    {this.state.userRole.includes('Flow-PublicInternal') !== true ? (
                      <div>
                        <Button block color="success" onClick={this.toggleAddNew} id="toggleCollapse1">
                          <i className="fa fa-plus-square" aria-hidden="true"> &nbsp; </i> New
                          </Button>
                      </div>
                    ) : ("")}
                  </div>
                </div>
                {/* <div>
                  <Button color="primary" style={{ float: 'right' }} onClick={this.togglePOForm}>
                    <i className="fa fa-file-text-o" aria-hidden="true"> </i> &nbsp;Form
                  </Button>
                </div> */}

              </CardHeader>
              <Collapse isOpen={this.state.collapse} onEntering={this.onEntering} onEntered={this.onEntered} onExiting={this.onExiting} onExited={this.onExited}>
                <Card style={{ margin: '10px 10px 5px 10px' }}>
                  <CardBody>
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td>Upload File</td>
                            <td>:</td>
                            <td>
                              <input type="file" onChange={this.fileHandlerMaterial.bind(this)} style={{ "padding": "10px", "visiblity": "hidden" }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button color="success" disabled={this.state.rowsXLS.length === 0} onClick={this.saveCPOBulk}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;SAVE </Button>
                    {/* <Button color="primary" style={{ float: 'right' }} onClick={this.togglePOForm}> <i className="fa fa-file-text-o" aria-hidden="true"> </i> &nbsp;Form</Button> */}
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '500' }}>Material Inbound List</span>
                      <div style={{ float: 'right', margin: '5px', display: 'inline-flex' }}>
                        <input className="search-box-material" type="text" name='filter' placeholder="Search Material" onChange={this.handleChangeFilter} value={this.state.filter_name} />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='divtable'>
                      <table hover bordered responsive size="sm" width='100%'>
                        <thead style={{ backgroundColor: '#73818f' }} className='fixed'>
                          <tr align="center">
                            <th style={{ minWidth: '150px' }}> Owner ID</th>
                            <th>PO Number</th>
                            <th>SKU</th>
                            <th>SKU Desc</th>
                            <th>Qty</th>
                            {/* <th></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.all_data.map(e =>
                            <React.Fragment key={e._id + "frag"}>
                              <tr style={{ backgroundColor: '#d3d9e7' }} className='fixbody' key={e._id}>
                                <td style={{ textAlign: 'center' }}>{e.owner_id}</td>
                                <td style={{ textAlign: 'center' }}>{e.po_number}</td>
                                <td style={{ textAlign: 'center' }}>{e.sku}</td>
                                <td style={{ textAlign: 'center' }}>{e.sku_description}</td>
                                <td style={{ textAlign: 'center' }}>{e.qty}</td>
                                {/* <td style={{ textAlign: 'center' }}>
                                  <Link to={'/detail-list-cpo-database/' + e._id}>
                                    <Button color="primary" size="sm" style={{ marginRight: '10px' }}> <i className="fa fa-info-circle" aria-hidden="true">&nbsp;</i> Detail</Button>
                                  </Link>
                                </td> */}
                              </tr>
                            </React.Fragment>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total_data_PO}
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

        {/* Modal New PO */}
        <Modal isOpen={this.state.modalPOForm} toggle={this.togglePOForm} className="modal--form-e">
          <ModalHeader>Form CPO</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="po_number">PO Number</Label>
                  <Input type="text" name="0" placeholder="" value={this.state.POForm[0]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="po_year" >Year</Label>
                  <Input type="text" name="1" placeholder="" value={this.state.POForm[1]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="currency" >Currency</Label>
                  <Input type="text" name="2" placeholder="" value={this.state.POForm[2]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="value" >Price</Label>
                  <Input type="number" min="0" name="3" placeholder="" value={this.state.POForm[3]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="number_of_sites" >Number of Sites</Label>
                  <Input type="number" min="0" name="4" placeholder="" value={this.state.POForm[4]} onChange={this.handleChangeForm} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNewPO}>Submit</Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PO*/}

        {/* Modal Loading */}
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm modal--loading '}>
          <ModalBody>
            <div style={{ textAlign: 'center' }}>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              Loading ...
            </div>
            <div style={{ textAlign: 'center' }}>
              System is processing ...
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>Close</Button>
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

export default connect(mapStateToProps)(MatInboundPlan);
