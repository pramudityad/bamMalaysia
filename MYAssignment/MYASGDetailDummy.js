import React, { Component } from "react";
import { Form, FormGroup, Label, FormText, Card, CardHeader, CardBody, CardFooter, Table, Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse, Input } from 'reactstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
import { ExcelRenderer } from 'react-excel-renderer';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import * as XLSX from 'xlsx';

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

const API_URL_XL = 'https://api-dev.xl.pdb.e-dpm.com/xlpdbapi';
const usernameBAM = 'adminbamidsuper';
const passwordBAM = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

class MYASGDetailDummy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      lmr_child_form : {},
      modal_loading : false,
      modalAddChild : false,

      data_cpo : null,
      data_cpo_db : [],
      rowsXLS: [],
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
      action_message : null,
      action_status : null,
      collapse_add_child : false,
    }
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleChangeFormLMRChild = this.handleChangeFormLMRChild.bind(this);
    this.addLMRChildForm = this.addLMRChildForm.bind(this);

    this.toggleAddChild = this.toggleAddChild.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
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

  toggleCollapse() {
    this.setState({ collapse_add_child: !this.state.collapse_add_child });
  }

  toggleLoading() {
    this.setState(prevState => ({
      modal_loading: !prevState.modal_loading
    }));
  }

  toggleAddChild() {
    this.setState(prevState => ({
      modalAddChild: !prevState.modalAddChild
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
      this.setState({ action_status: 'success', action_message : null });
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
  }

  updateCPODetailBulk = async () => {
    this.toggleLoading();
    const cpobulkXLS = this.state.rowsXLS;
    const _id = this.props.match.params.id;
    const res = await this.patchDatatoAPINODE('/cpodb/UpdateCpoDbDetail/'+_id, { 'data': cpobulkXLS })
    if (res.data !== undefined) {
      this.setState({ action_status: 'success', action_message : null });
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

  addLMRChildForm(){
    const dataChildForm = this.state.lmr_child_form;
    const dataChild = {
            "nw": dataChildForm.so_or_nw,
            "activity": dataChildForm.activity,
            "material": dataChildForm.material,
            "description": dataChildForm.description,
            "site_id": dataChildForm.site_id,
            "qty": dataChildForm.quantity,
            "unit_price": dataChildForm.price,
            "tax_code": dataChildForm.tax_code,
            "delivery_date": dataChildForm.delivery_date,
            "total_price": dataChildForm.total_price,
            "total_value": dataChildForm.total_value,
            "currency": dataChildForm.currency,
            "item": dataChildForm.item,
        }
    console.log("dataChild", dataChild);
  }

  downloadFormatNewChild= async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataCPO = this.state.cpo_all;

    let headerRow = ["nw","activity","material","description","site_id","qty","unit_price","tax_code", "delivery_date", "total_price", "total_value", "currency", "item"];
    ws.addRow(headerRow);

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'New Format Child.xlsx');
  }

  componentDidMount() {
    if (this.props.match.params.id === undefined) {
      this.getPODataList();
    } else {
      // this.getPODataList(this.props.match.params.id);
    }
    document.title = 'LMR Detail | BAM';
  }

  handleChangeFormLMRChild(e) {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_child_form = this.state.lmr_child_form;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    lmr_child_form[name.toString()] = value;
    this.setState({ lmr_child_form: lmr_child_form });
  }

  render() {

    return (
      <div>
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: '2', fontSize: '17px' }}> LMR Detail </span>
                <div className="card-header-actions" style={{ display: 'inline-flex' }}>
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                      <DropdownToggle caret color="light">
                        Download Template
                        </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>File</DropdownItem>
                        <DropdownItem onClick={this.downloadFormatNewChild}> New LMR Child Format</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <Button block color="success" size="sm" onClick={this.toggleCollapse} id="toggleCollapse2">
                    Add Child
                  </Button>
                </div>
              </CardHeader>
              <Collapse isOpen={this.state.collapse_add_child}>
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
                    <Button color="success" size="sm" disabled={this.state.rowsXLS.length === 0} onClick={this.updateCPODetailBulk}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;Add Child </Button>
                    <Button color="success" size="sm" style={{float : 'right'}} onClick={this.toggleAddChild}> <i className="fa fa-wpforms" aria-hidden="true"> </i> &nbsp;Form </Button>
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
                            LMR Detail
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
                <div style={{ padding: "10px", fontSize: '15px' }}>
                  {this.state.data_cpo !== null && (
                    <Row>
                      <Col sm="6" md="6">
                        <table className="table-header">
                          <tbody>
                            <tr style={{ fontWeight: '425', fontSize: '15px' }}>
                              <td colSpan="4" style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '500' }}>LMR INFORMATION</td>
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
                </div>

                <div class='divtable'>
                  <Table hover bordered responsive size="sm" width="100%">
                    <thead class="table-commercial__header--fixed">
                      <tr>
                        <th>SO # /NW #</th>
                        <th>Activity</th>
                        <th>Material #</th>
                        <th>Description</th>
                        <th>Site ID</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Tax Code</th>
                        <th>Delivery Date</th>
                        <th>Total price</th>
                        <th>Total Value</th>
                        <th>Currency</th>
                        <th>PR</th>
                        <th>PO</th>
                        <th>Item</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.data_cpo_db.map(e =>
                      <tr>
                        <td>SO # /NW #</td>
                        <td>Activity</td>
                        <td>Material #</td>
                        <td>Description</td>
                        <td>Site ID</td>
                        <td>Quantity</td>
                        <td>Unit</td>
                        <td>Price</td>
                        <td>Tax Code</td>
                        <td>Delivery Date</td>
                        <td>Total price</td>
                        <td>Total Value</td>
                        <td>Currency</td>
                        <td>PR</td>
                        <td>PO</td>
                        <td>Item</td>
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

        {/* Modal Create LMR Child */}
        <Modal isOpen={this.state.modalAddChild} toggle={this.toggleAddChild} className={this.props.className} size="lg">
          <ModalHeader toggle={this.toggleAddChild}>LMR Child</ModalHeader>
          <ModalBody>
            <div>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>SO / NW</Label>
                      <Input type="text" name="so_or_nw" id="so_or_nw" value={this.state.lmr_child_form.so_or_nw} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Activity</Label>
                      <Input type="text" name="activity" id="activity" value={this.state.lmr_child_form.activity} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Material</Label>
                      <Input type="text" name="material" id="material" value={this.state.lmr_child_form.material} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input type="text" name="description" id="description" value={this.state.lmr_child_form.description} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Site ID</Label>
                      <Input type="text" name="site_id" id="site_id" value={this.state.lmr_child_form.site_id} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Quantity</Label>
                      <Input type="number" name="quantity" id="quantity" value={this.state.lmr_child_form.quantity} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Unit</Label>
                      <Input type="text" name="item" id="item" value={this.state.lmr_child_form.item} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input type="number" name="price" id="price" value={this.state.lmr_child_form.price} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Tax Code</Label>
                      <Input type="text" name="tax_code" id="tax_code" value={this.state.lmr_child_form.tax_code} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Delivery Date</Label>
                      <Input type="text" name="delivery_date" id="delivery_date" value={this.state.lmr_child_form.delivery_date} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Total Price</Label>
                      <Input type="number" name="total_price" id="total_price" value={this.state.lmr_child_form.total_price} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Total Value</Label>
                      <Input type="number" name="total_value" id="total_value" value={this.state.lmr_child_form.total_value} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input type="text" name="currency" id="currency" value={this.state.lmr_child_form.currency} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-success" style={{ 'float': 'right', margin: '8px' }} color="success" onClick={this.addLMRChildForm}>
              <i className="fa fa-save">&nbsp;&nbsp;</i>
                Add
            </Button>
          </ModalFooter>
        </Modal>
        {/* End Modal Create LMR Child */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData
  }
}

export default connect(mapStateToProps)(MYASGDetailDummy);
