import React, { Component } from "react";
import { Form, FormGroup, Label, FormText, Card, CardHeader, CardBody, CardFooter, Table, Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse, Input } from 'reactstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
import { ExcelRenderer } from 'react-excel-renderer';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import * as XLSX from 'xlsx';

const DefaultNotif = React.lazy(() => import('../../DefaultView/DefaultNotif'));

const API_URL_XL = 'https://api-dev.xl.pdb.e-dpm.com/xlpdbapi';
const usernameBAM = 'adminbamidsuper';
const passwordBAM = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

class CPODatabaseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      data_cpo : null,
      data_cpo_db : [],
      rowsXLS: [],
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
    }
    this.toggleLoading = this.toggleLoading.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.downloadAllCPO2 = this.downloadAllCPO2.bind(this);
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

    toggleLoading() {
    this.setState(prevState => ({
      modal_loading: !prevState.modal_loading
    }));
  }

  checkValue(props) {
    // if value undefined return null
    if (typeof props === 'undefined') {
      return null;
    } else {
      return props;
    }
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

  // fileHandlerMaterial = (event) => {
  //   // this.toggleLoading();
  //   let fileObj = event.target.files[0];
  //   if (fileObj !== undefined) {
  //     ExcelRenderer(fileObj, (err, rest) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //       else {
  //         this.setState({ rowsXLS: rest.rows })
  //       }
  //     });
  //   }
  // }

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

  getPODataList(_id) {
    this.getDatafromAPINODE('/cpodb/getCpoDb/'+_id)
      .then(res => {
      // console.log('cpo db id', res.data.data.cpoDetail)
      if (res.data !== undefined) {
        const dataCPO = res.data.data;
        const dataCPOdet = res.data.data.cpoDetail;
        this.setState({ data_cpo_db: dataCPOdet, data_cpo: dataCPO});
      }
    })
  }

  downloadAllCPO2= async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataCPO = this.state.cpo_all;

    let headerRow = ["PO Number", "Year", "Currency", "Price", "Number of Sites"]
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
    }

    for (let i = 0; i < dataCPO.length; i++) {
      ws.addRow([dataCPO[i].pp_id, dataCPO[i].product_name, "", "", dataCPO[i].uom, "", "", "", dataCPO[i].pp_cust_number, dataCPO[i].pp_group, dataCPO[i].physical_group, dataCPO[i].product_type, dataCPO[i].note])
      let getlastrow = ws.lastRow._number;
      ws.mergeCells('B' + getlastrow + ':D' + getlastrow);
      for (let j = 0; j < dataCPO[i].list_of_material.length; j++) {
        let matIndex = dataCPO[i].list_of_material[j];
        ws.addRow(["", "", matIndex.material_id, matIndex.material_name, matIndex.uom, matIndex.qty, matIndex.material_price, matIndex.material_type, "", "", "", "", ""])
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'CPO Detail All.xlsx');
  }

  getCPO2Format = async (dataImport) => {
    const dataHeader = dataImport[0];
    const onlyParent = dataImport.map(e => e).filter(e => (this.checkValuetoString(e[this.getIndex(dataHeader, 'PO Number')])));
    let cpo_array = [];
    if (onlyParent !== undefined && onlyParent.length !== 0) {
      for (let i = 1; i < onlyParent.length; i++) {
        const cpo = {
          "po_number": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'PO Number')]),
          "po_year": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'Year')]),
          "currency": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'Currency')]),
          "value": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'Price')]),
          "number_of_sites": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'Number of Sites')]),
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

  saveCPO2Bulk = async () => {
    this.toggleLoading();
    const cpobulkXLS = this.state.rowsXLS;
    const _id = this.props.match.params.id;
    const res = await this.postDatatoAPINODE('/cpodb/createCpoDbDetail/'+_id, { 'detailData': cpobulkXLS })
    if (res.data !== undefined) {
      this.setState({ action_status: 'success' });
      this.toggleLoading();
    } else {
      const err_arr = res.response.data["_issues"];
      let err = [];
      for( err in err_arr){
        console.log('res data err', err);
      }
      this.setState({ action_status: 'failed' }, () => {
        this.toggleLoading();
      });
    }
  }

  exportCPODetail = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataCPO = this.state.data_cpo;

    ws.addRow(["PO Number", dataCPO.po_number]);
    ws.addRow(["Payment Terms", dataCPO.payment_terms]);
    ws.addRow(["Currency", dataCPO.currency]);
    ws.addRow(["Contract", dataCPO.contract]);
    ws.addRow(["Contact", dataCPO.contact]);

    ws.addRow([""]);

    ws.addRow(["Description", "MM ID", "Need By Date", "Qty", "Unit", "Price", "Total Price", "Match Status"]);
    this.state.data_cpo_db.map(e =>
      ws.addRow([e.description, e.mmid, e.need_by_date, e.qty, e.unit, e.price, e.total_price, e.match_status])
    )

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'CPO '+dataCPO.po_number+' Detail.xlsx');
  }


  exportFormatCPO_level2 = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(["config_id", "description", "mm_id", "need_by_date", "qty", "unit", "price"]);
    ws.addRow(["INSTALL:CONFIG SERVICE 11_1105A","3416315 |  INSTALL:CONFIG SERVICE 11_1105A  | YYYY:2019 | MM:12","desc","2020-08-21",1,"Performance Unit",1000000]);
		ws.addRow(["Cov_2020_Config-4a","330111 | Cov_2020_Config-4a | YYYY : 2020 | MM : 04","desc","2020-12-12",200,"Performance Unit",15000000]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'CPO Level 2 Template.xlsx');
  }

  exportFormatCPO_level2 = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(["config_id", "description", "mm_id", "need_by_date", "qty", "unit", "price"]);
    ws.addRow(["INSTALL:CONFIG SERVICE 11_1105A","3416315 |  INSTALL:CONFIG SERVICE 11_1105A  | YYYY:2019 | MM:12","desc","2020-08-21",1,"Performance Unit",1000000]);
		ws.addRow(["Cov_2020_Config-4a","330111 | Cov_2020_Config-4a | YYYY : 2020 | MM : 04","desc","2020-12-12",200,"Performance Unit",15000000]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'CPO Level 2 Template.xlsx');
  }

  exportFormatCPO_level2Update = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(["config_id", "description", "mm_id", "need_by_date", "qty", "unit", "price"]);
    this.state.data_cpo_db.map(e =>
      ws.addRow([e.config_id, e.description, e.mmid, e.need_by_date, e.qty, e.unit, e.price])
    )

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'CPO Level 2 Template.xlsx');
  }

  componentDidMount() {
    if (this.props.match.params.id === undefined) {
      this.getPODataList();
    } else {
      this.getPODataList(this.props.match.params.id);
    }
    document.title = 'CPO Database Detail | BAM';
  }

  render() {

    return (
      <div>
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: '2', fontSize: '17px' }}> CPO Database Detail </span>
                <div className="card-header-actions" style={{ display: 'inline-flex' }}>
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                      <DropdownToggle caret color="light">
                        Download Template
                        </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>File</DropdownItem>
                        <DropdownItem onClick={this.exportCPODetail}> CPO Detail File</DropdownItem>
                        {this.state.data_cpo !== null && this.state.data_cpo_db.length === 0 ? (
                          <DropdownItem onClick={this.exportFormatCPO_level2}> CPO Level 2 Template</DropdownItem>
                        ) : ("")}
                        {/* }<DropdownItem onClick={this.exportFormatCPO_level2Update}> CPO Level 2 Template Update</DropdownItem> */}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div>
                    {this.state.data_cpo !== null && this.state.data_cpo_db.length === 0 ? (
                      <div>
                        <Button block color="success" onClick={this.toggleAddNew} id="toggleCollapse1">
                          <i className="fa fa-plus-square" aria-hidden="true"> &nbsp; </i> New
                          </Button>
                      </div>
                    ) : ("")}
                  </div>
                </div>
                {/* {this.state.data_comm_boq !== null && (
                    <React.Fragment>
                      <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {this.toggleDropdown(0);}} style={{float : 'right', marginRight : '10px'}}>
                        <DropdownToggle caret color="secondary">
                          <i className="fa fa-download" aria-hidden="true"> &nbsp; </i>Download Commercial File
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header> Commercial File</DropdownItem>
                          <DropdownItem onClick={this.exportCommercial}> <i className="fa fa-file-text-o" aria-hidden="true"></i>Commercial File</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </React.Fragment>
                  )} */}
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
                    <Button color="success" disabled={this.state.rowsXLS.length === 0} onClick={this.saveCPO2Bulk}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;SAVE </Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody className='card-UploadBoq'>
                <Row>
                  <Col sm="12" md="12">
                    <table style={{ width: '100%', marginBottom: '0px' }}>
                      <tbody>
                        <tr style={{ fontWeight: '425', fontSize: '23px' }}>
                          <td colSpan="2" style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '500' }}>
                            {this.props.match.params.id === undefined ? "CREATE" : ""} CPO Database
                          </td>
                        </tr>
                        {this.state.data_cpo !== null && (
                          <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                            <td colSpan="2" style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '500' }}>
                               PO Number : {this.state.data_cpo.po_number}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <hr style={{ borderStyle: 'double', borderWidth: '0px 0px 3px 0px', borderColor: ' rgba(174,213,129 ,1)', marginTop: '5px' }}></hr>
                  </Col>
                </Row>
                {/* Display CPO detail information  */}
                <div style={{ padding: "10px", fontSize: '15px' }}>
                  {/* {this.state.data_comm_boq !== null && ( */}
                  {/* <React.Fragment> */}
                  {this.state.data_cpo !== null && (
                    <Row>
                      <Col sm="6" md="6">
                        <table className="table-header">
                          <tbody>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td colSpan="4" style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '500' }}>CPO INFORMATION</td>
                            </tr>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td style={{ width: '150px' }}>Payment Terms </td>
                              <td>:</td>
                              <td>{this.state.data_cpo.payment_terms}</td>
                            </tr>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td>Currency</td>
                              <td>:</td>
                              <td>{this.state.data_cpo.currency}</td>
                            </tr>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td>Contract</td>
                              <td>:</td>
                              <td>{this.state.data_cpo.contract}</td>
                            </tr>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td>Contact</td>
                              <td>:</td>
                              <td>{this.state.data_cpo.contact}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  )}
                  {/* </React.Fragment> */}
                  {/* )} */}
                </div>

                <div class='divtable'>
                  <Table hover bordered responsive size="sm" width="100%">
                    <thead class="table-commercial__header--fixed">
                      <tr>
                        <th>Config ID</th>
                        <th>Description</th>
                        <th>MM ID</th>
                        <th>Need By Date</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Match Status</th>
                        {/* <th>Unit Price after Incentive (USD)</th>
                          <th>Unit Price after Incentive (IDR)</th>
                          <th>Total Price after Incentive (USD)</th>
                          <th>Total Price after Incentive (IDR)</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.data_cpo_db.map(e =>
                      <tr>
                      <td>{e.config_id}</td>
                      <td>{e.description}</td>
                      <td>{e.mmid}</td>
                      <td>{e.need_by_date}</td>
                      <td>{e.qty}</td>
                      <td>{e.unit}</td>
                      <td>{e.price}</td>
                      <td>{e.total_price}</td>
                      <td>{e.match_status}</td>

                      </tr>
                    )}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <Row>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* Modal Loading */}
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm ' + this.props.className + ' loading-modal'}>
          <ModalBody>
            <div style={{ textAlign: 'center' }}>
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
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

        {/* Modal Loading */}
        <Modal isOpen={this.state.toggleShowGroup} toggle={this.showGroupToggle} className={'modal-sm ' + this.props.className + ' loading-modal'}>
          <ModalBody>
            <div style={{ textAlign: 'center' }}>
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
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

        {/* Modal Edit Commercial */}
        <Modal isOpen={this.state.modalEdit} toggle={this.toggleEdit} className={this.props.className}>
          <ModalHeader toggle={this.toggleEdit}>Checkout</ModalHeader>
          <ModalBody>
            <div>
              <Row><Col md="12">
                <Form className="form-horizontal">
                  <FormGroup row style={{ "padding-left": "10px" }}>
                    <Col md="2">
                      <Label style={{ marginTop: "10px" }}>Project</Label>
                    </Col>
                    <Col xs="12" md="10">
                      <Input name="project" type="select">
                        <option value=""></option>
                        <option value="Demo 1">Project Demo 1</option>
                        <option value="Demo 1">Project Demo 2</option>
                      </Input>
                      <FormText className="help-block">Please Select Project</FormText>
                    </Col>
                    <Col xs="12" md="6">
                    </Col>
                  </FormGroup>
                </Form>
              </Col></Row>
              <Row><Col md="12">
                <input type="file" style={{ "padding": "10px", "visiblity": "hidden" }} />
              </Col></Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-success" style={{ 'float': 'right', margin: '8px' }} color="success">
              <i className="fa fa-save">&nbsp;&nbsp;</i>
                Revision and Save Project
              </Button>
            <Button className="btn-success" style={{ 'float': 'right', margin: '8px' }} color="success">
              <i className="fa fa-save">&nbsp;&nbsp;</i>
                Revision BOQ
              </Button>
          </ModalFooter>
        </Modal>
        {/* End Modal Edit Commercial */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData
  }
}

export default connect(mapStateToProps)(CPODatabaseDetail);
