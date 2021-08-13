import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Table, FormGroup, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';

const API_URL = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const username = 'bamidadmin@e-dpm.com';
const password = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, value }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={value} className="checkmark-dash" />
);

class ShipmentDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole : this.props.dataLogin.role,
      userId : this.props.dataLogin._id,
      userName : this.props.dataLogin.userName,
      userEmail : this.props.dataLogin.email,
      tokenUser : this.props.dataLogin.token,
      mr_list : [],
      prevPage : 0,
      activePage : 1,
      totalData : 0,
      perPage : 10,
      filter_list : new Array(14).fill(""),
      mr_all : [],
      action_status : null,
      action_message : "",
      mr_checked : new Map(),
      mr_data_selected : [],
      shipment_detail : {},
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
  }

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL+url, {
        headers: {'Content-Type':'application/json'},
        auth: {
          username: username,
          password: password
        }
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE+url, {
        headers : {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
      return respond;
    }
  }

  async patchDatatoAPINODE(url, data) {
    try {
      let respond = await axios.patch(API_URL_NODE+url, data, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      })
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Patch data", err.response);
      return respond;
    }
  }

  getMRList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_mr_id = this.state.filter_list[0] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[0]+'", "$options" : "i"}';
    let filter_implementation_id = this.state.filter_list[1] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[1]+'", "$options" : "i"}';
    let filter_project_name = this.state.filter_list[2] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[2]+'", "$options" : "i"}';
    let filter_cd_id = this.state.filter_list[3] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[3]+'", "$options" : "i"}';
    let filter_site_id = this.state.filter_list[4] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[4]+'", "$options" : "i"}';
    let filter_site_name = this.state.filter_list[5] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[5]+'", "$options" : "i"}';
    let filter_current_status = this.state.filter_list[6] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[6]+'", "$options" : "i"}';
    let filter_current_milestones = this.state.filter_list[7] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[7]+'", "$options" : "i"}';
    let filter_dsp = this.state.filter_list[8] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[8]+'", "$options" : "i"}';
    let filter_asp = this.state.filter_list[9] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[9]+'", "$options" : "i"}';
    let filter_eta = this.state.filter_list[10] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[10]+'", "$options" : "i"}';
    let filter_created_by = this.state.filter_list[11] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[11]+'", "$options" : "i"}';
    let filter_updated_on = this.state.filter_list[12] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[12]+'", "$options" : "i"}';
    let filter_created_on = this.state.filter_list[13] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[13]+'", "$options" : "i"}';
    let whereAnd = '{"mr_id": '+filter_mr_id+',"current_milestones": "MS_JOINT_CHECK"}';
    // let whereAnd = '{"mr_id": '+filter_mr_id+', "implementation_id": '+filter_implementation_id+', "project_name":'+filter_project_name+', "cd_id": '+filter_cd_id+', "current_mr_status": '+filter_current_status+', "current_milestones": "MS_LOADING_PROCESS", "dsp_company": '+filter_dsp+', "eta": '+filter_eta+', "updated_on": '+filter_updated_on+', "created_on": '+filter_created_on+'}';
    this.getDataFromAPINODE('/matreq?q='+whereAnd+'&lmt='+maxPage+'&pg='+page).then(res => {
      console.log("MR List Sorted", res);
      if(res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({mr_list : items, totalData: totalData});
      }
    })
  }

  getAllMR() {
    let filter_mr_id = this.state.filter_list[0] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[0]+'", "$options" : "i"}';
    let filter_implementation_id = this.state.filter_list[1] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[1]+'", "$options" : "i"}';
    let filter_project_name = this.state.filter_list[2] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[2]+'", "$options" : "i"}';
    let filter_cd_id = this.state.filter_list[3] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[3]+'", "$options" : "i"}';
    let filter_site_id = this.state.filter_list[4] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[4]+'", "$options" : "i"}';
    let filter_site_name = this.state.filter_list[5] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[5]+'", "$options" : "i"}';
    let filter_current_status = this.state.filter_list[6] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[6]+'", "$options" : "i"}';
    let filter_current_milestones = this.state.filter_list[7] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[7]+'", "$options" : "i"}';
    let filter_dsp = this.state.filter_list[8] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[8]+'", "$options" : "i"}';
    let filter_asp = this.state.filter_list[9] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[9]+'", "$options" : "i"}';
    let filter_eta = this.state.filter_list[10] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[10]+'", "$options" : "i"}';
    let filter_created_by = this.state.filter_list[11] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[11]+'", "$options" : "i"}';
    let filter_updated_on = this.state.filter_list[12] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[12]+'", "$options" : "i"}';
    let filter_created_on = this.state.filter_list[13] === "" ? '{"$exists" : 1}' : '{"$regex" : "'+this.state.filter_list[13]+'", "$options" : "i"}';
    let whereAnd = '{"mr_id": '+filter_mr_id+', "implementation_id": '+filter_implementation_id+', "project_name":'+filter_project_name+', "cd_id": '+filter_cd_id+', "site_info.site_id": '+filter_site_id+', "site_info.site_name": '+filter_site_name+', "current_mr_status": '+filter_current_status+', "current_milestones": "MS_JOINT_CHECK", "dsp_company": '+filter_dsp+', "asp_company": '+filter_asp+', "eta": '+filter_eta+', "updated_on": '+filter_updated_on+', "created_on": '+filter_created_on+'}';
    // let whereAnd = '{"mr_id": '+filter_mr_id+', "implementation_id": '+filter_implementation_id+', "project_name":'+filter_project_name+', "cd_id": '+filter_cd_id+', "current_mr_status": '+filter_current_status+', "current_milestones": "MS_LOADING_PROCESS", "dsp_company": '+filter_dsp+', "eta": '+filter_eta+', "updated_on": '+filter_updated_on+', "created_on": '+filter_created_on+'}';
    this.getDataFromAPI('/mr_sorted_nonpage?where='+whereAnd).then(res => {
      console.log("MR List All", res);
      if(res.data !== undefined) {
        const items = res.data._items;
        this.setState({mr_all : items});
      }
    })
  }

  numToSSColumn(num){
    var s = '', t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t)/26 | 0;
    }
    return s || undefined;
  }

  async downloadMRlist() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const allMR = this.state.mr_all;

    let headerRow = ["MR ID", "Implementation ID", "Project Name", "CD ID", "Site ID", "Site Name", "Current Status", "Current Milestone", "DSP", "ASP", "ETA", "Created By", "Updated On", "Created On"];
    ws.addRow(headerRow);

    for(let i = 1; i < headerRow.length+1; i++){
      ws.getCell(this.numToSSColumn(i)+'1').font  = { size: 11, bold : true };
    }

    for(let i = 0; i < allMR.length; i++){
      ws.addRow([allMR[i].mr_id, allMR[i].implementation_id, allMR[i].project_name, allMR[i].cd_id, "", "", allMR[i].current_mr_status, allMR[i].current_milestones, allMR[i].dsp_company, "", allMR[i].eta, "", allMR[i].updated_on, allMR[i].created_on])
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Loading Process.xlsx');
  }

  async patchDataToAPI(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL+url, data, {
        headers: {
          'Content-Type':'application/json',
          'If-Match': _etag
        },
        auth: {
          username: username,
          password: password
        }
      })
      if(respond.status >= 200 && respond.status < 300) {
        console.log('respond patch data', respond);
      }
      return respond;
    } catch(err) {
      let respond = undefined;
      this.setState({action_status: 'failed', action_message: 'Sorry, there is something wrong, please try again!'});
      console.log('respond patch data', err);
      return respond;
    }
  }

  async proceedMilestone(e) {
    const newDate = new Date();
    const dateNow = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds();
    const _etag = e.target.value;
    const id_doc = e.currentTarget.id;
    let res = await this.patchDatatoAPINODE('/matreq/loadingProcess/'+id_doc);
    if(res !== undefined) {
      if(res.data !== undefined) {
        this.setState({action_status : "success"}, () => {
          setTimeout(function(){ window.location.reload(); }, 2000);
        });
      }else{
        if(res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined){
          if(res.response.data.error.message !== undefined){
            this.setState({ action_status: 'failed', action_message: res.response.data.error.message });
          }else{
            this.setState({ action_status: 'failed', action_message: res.response.data.error });
          }
        }else{
          this.setState({ action_status: 'failed' });
        }
      }
    }else{
      this.setState({ action_status: 'failed' });
    }
  }

  async proceedShipment(e) {
    const newDate = new Date();
    const dateNow = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds();
    const id_doc = e.currentTarget.id;
    const inputanDetailShipment = this.state.shipment_detail;
    const dataMRSelected = this.state.mr_data_selected;
    let list_mr_shipment = [];
    for(let i = 0; i < dataMRSelected.length; i++){
      list_mr_shipment.push({"mrId": dataMRSelected[i].mr_id});
    }
    const dataShipment = {
      "mrList" : list_mr_shipment,
      "shipmentNumber" : inputanDetailShipment.shipment_number,
      "dspData": {
      	  "dsp_transporter": inputanDetailShipment.transporter,
          "dsp_name": inputanDetailShipment.driver_name,
          "dsp_phone": inputanDetailShipment.driver_phone_number,
          "dsp_truck": inputanDetailShipment.truck_number,
          "dsp_truck_type": inputanDetailShipment.truck_type
      }
    }
    let res = await this.patchDatatoAPINODE('/matreq/loadingProcess', dataShipment);
    if(res !== undefined) {
      if(res.data !== undefined) {
        this.setState({action_status : "success"}, () => {
          setTimeout(function(){ window.location.reload(); }, 2000);
        });
      }else{
        if(res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined){
          if(res.response.data.error.message !== undefined){
            this.setState({ action_status: 'failed', action_message: res.response.data.error.message });
          }else{
            this.setState({ action_status: 'failed', action_message: res.response.data.error });
          }
        }else{
          this.setState({ action_status: 'failed' });
        }
      }
    }else{
      this.setState({ action_status: 'failed' });
    }
  }

  componentDidMount() {
    this.getMRList();
    // this.getAllMR();
    document.title = 'Loading Process | BAM';
  }

  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber}, () => {
      this.getMRList();
    });
  }

  handleFilterList(e) {
    const index = e.target.name;
    let value = e.target.value;
    if(value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list;
    dataFilter[parseInt(index)] = value;
    this.setState({filter_list : dataFilter, activePage: 1}, () => {
      this.onChangeDebounced(e);
    })
  }

  onChangeDebounced(e) {
    this.getMRList();
    // this.getAllMR();
  }

  handleChangeShipmentDetail(e){
    const name = e.target.name;
    let value = e.target.value;
    let dataShipment = this.state.shipment_detail;
    if(value !== (null && undefined)){
      value = value.toString();
    }
    dataShipment[name.toString()] = value;
    console.log("dataShipment", dataShipment);
    this.setState({shipment_detail : dataShipment});
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
    console.log("MRSelected", MRSelected);
    this.setState(prevState => ({ mr_checked: prevState.mr_checked.set(item, isChecked) }));
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    function AlertProcess(props){
      const alert = props.alertAct;
      const message = props.messageAct;
      if(alert === 'failed'){
        return (
          <div className="alert alert-danger" role="alert">
            {message.length !== 0 ? message : 'Sorry, there was an error when we tried to save it, please reload your page and try again'}
          </div>
        )
      } else{
        if(alert === 'success'){
          return (
            <div className="alert alert-success" role="alert">
              {message}
              Your action was success, please reload your page
            </div>
          )
        } else{
          return (
            <div></div>
          )
        }
      }
    }

    const downloadMR = {
      float: 'right'
    }

    const tableWidth = {
      width: '150px'
    }

    return (
      <div className="animated fadeIn">
        <AlertProcess alertAct={this.state.action_status} messageAct={this.state.action_message}/>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                Shipment Detail
                <Button onClick={this.proceedShipment} size="sm" style={{float : 'right'}} color="success">
                  <i class="fa fa-plus" aria-hidden="true">&nbsp;</i> Ship
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row size="sm">
                      <Col md="2">
                        <Label htmlFor="shipment_number" >Shipment Number</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="0" placeholder="" name="shipment_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.shipment_number}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="transporter" >Transporter</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="1" placeholder="" name="transporter" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.transporter}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_type" >Truck Type</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="3" placeholder="" name="truck_type" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.truck_type}/>
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs="6" lg="6" md="6">
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="truck_number" >Truck No</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="2" placeholder="" name="truck_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.truck_number}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_name" >Driver Name</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="4" placeholder="" name="driver_name" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.driver_name}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label htmlFor="driver_phone_number" >Driver Phone</Label>
                      </Col>
                      <Col md="8">
                        <Input type="text" name="5" placeholder="" name="driver_phone_number" onChange={this.handleChangeShipmentDetail} value={this.state.shipment_detail.driver_phone_number}/>
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
                          <th>
                            MR ID
                          </th>
                          <th>
                            Project
                          </th>
                          <th>
                            Total Box
                          </th>
                          <th>
                            Box ID
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.mr_data_selected.map(mr =>
                          <tr>
                            <td style={{textAlign : 'left'}}>
                              {mr.mr_id}
                            </td>
                            <td>
                              {mr.project_name}
                            </td>
                            <td>
                              {mr.total_boxes}
                            </td>
                            <td>
                              {mr.list_of_box_id !== undefined ? mr.list_of_box_id.map(e => e+', ') : ''}
                            </td>
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
                <span style={{lineHeight :'2'}}>
                  <i className="fa fa-align-justify" style={{marginRight: "8px"}}></i> Loading Process
                </span>
                <Button style={downloadMR} outline color="success" onClick={this.downloadMRlist} size="sm"><i className="fa fa-download" style={{marginRight: "8px"}}></i>Download MR List</Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{verticalAlign: "middle"}}>Action</th>
                      <th>MR ID</th>
                      <th>Project Name</th>
                      <th>CD ID</th>
                      <th>Site ID</th>
                      <th>Site Name</th>
                      <th>Current Status</th>
                      <th>Current Milestone</th>
                      <th>DSP</th>
                      <th>ASP</th>
                      <th>ETA</th>
                      <th>Created By</th>
                      <th>Updated On</th>
                      <th>Created On</th>
                    </tr>
                    <tr>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[0]} name={0} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[2]} name={2} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[3]} name={3} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[4]} name={4} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[5]} name={5} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[6]} name={6} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[7]} name={7} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[8]} name={8} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[9]} name={9} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[10]} name={10} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[11]} name={11} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[12]} name={12} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
                      <td>
                        <div className="controls" style={tableWidth}>
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[13]} name={13} size="sm"/>
                          </InputGroup>
                        </div>
                      </td>
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
                        <td><Link to={'/mr-detail/'+list._id}>{list.mr_id}</Link></td>
                        <td>{list.project_name}</td>
                        <td>{list.cd_id}</td>
                        <td>{list.site_info[0].site_id}</td>
                        <td>{list.site_info[0].site_name}</td>
                        <td>{list.current_mr_status}</td>
                        <td>{list.current_milestones}</td>
                        <td>{list.dsp_company}</td>
                        <td>{list.asp_company}</td>
                        <td>{list.eta}</td>
                        <td></td>
                        <td>{list.updated_on}</td>
                        <td>{list.created_on}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData
  }
}

export default connect(mapStateToProps)(ShipmentDetail);
