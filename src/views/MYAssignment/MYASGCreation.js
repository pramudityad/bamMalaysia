import React, { Component, Fragment } from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col, Button, Input, CardFooter } from 'reactstrap';
import { Form, FormGroup, Label, FormText } from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import './LMRMY.css'

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

const API_URL_MAS = 'https://api-dev.mas.pdb.e-dpm.com/masapi';
const usernameMAS = 'mybotprpo';
const passwordMAS = 'mybotprpo2020';

// const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

// const API_URL_NODE = 'http://localhost:5012/bammyapi';
const API_URL_NODE = 'https://api-dev.bam-my.e-dpm.com/bammyapi';

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, inValue="", disabled= false}) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={inValue} className="checkmark-dash" disabled={disabled}/>
);

const projectList = [
  {
    "project_name" : "Project DEMO 1",
    "_id" : "5dedc5c1280eb4f3d96e0713"
  },
  {
    "project_name" : "Project DEMO 2",
    "_id" : "5dedc5c1280eb4f3d96e0714"
  }
];

const vendorList = [
        {
            "_id": "5edf4b3836c2b6fd90858d26",
            "Name": "Bharti",
            "Vendor_Code": "12",
            "Email": "",
            "created_on": "2020-05-06 07:54:27",
            "updated_on": "2020-05-06 07:54:27",
            "_etag": "9e63333bd40166971ed8a4e1fd47f9996876edc9"
        },
        {
            "_id": "5ee084b7bb1141f864a300da",
            "Name": "Vendor Test 1",
            "Vendor_Code": "VendorTest1",
            "Email": "",
            "created_on": "2020-05-08 06:16:29",
            "updated_on": "2020-05-08 06:16:29",
            "_etag": "58f11185cc2708c5c33ade202691aa0937e8d478"
        }
    ]

class MYASGCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // tokenUser: this.props.dataLogin.token,
      tokenUser : BearerToken,
      lmr_form : {},
      modal_loading : false,
      list_project : [],
      creation_lmr_child_form : [],

      list_tower : [],
      list_tower_selection : [],
      list_project_selection : [],
      list_warehouse : [],
      form_checking : {},
        list_cd_id : [],
        cd_id_selected : null,
        data_cd_id_selected : null,
        project_selected : null,
        project_name_selected : null,
        list_tssr : [],
        list_tssr_for_selection : [],
        id_tssr_selected : null,
        data_tssr_selected : null,
        tssr_BOM_data_NE : null,
        tssr_BOM_data_FE : null,
        list_pp_material_tssr : [],
        redirectSign : false,
        action_status : null,
        action_message : null,
        toggle_display : "new",
        identifier_by : "tower_id",
        tower_selected_id : null,
        vendor_list : [],
        validation_form : {},
    };
    this.handleChangeFormMRCreation = this.handleChangeFormMRCreation.bind(this);
    this.handleChangeMRType = this.handleChangeMRType.bind(this);
    this.handleChangeProject = this.handleChangeProject.bind(this);
    this.handleChangeCD = this.handleChangeCD.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleChangeProjectXL = this.handleChangeProjectXL.bind(this);
    this.handleChangeTowerXL = this.handleChangeTowerXL.bind(this);
    this.handleChangeIdentifierBy = this.handleChangeIdentifierBy.bind(this);
    this.loadOptionsTowerID = this.loadOptionsTowerID.bind(this);
    this.loadOptionsCDID = this.loadOptionsCDID.bind(this);

    this.handleChangeFormLMR = this.handleChangeFormLMR.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.createLMR = this.createLMR.bind(this);
    this.handleChangeVendor = this.handleChangeVendor.bind(this);
    this.addLMR = this.addLMR.bind(this);
    this.handleChangeFormLMRChild = this.handleChangeFormLMRChild.bind(this);
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  async postDatatoAPINODE(url, data){
    try {
      let respond = await axios.post(API_URL_NODE +url, data, {
        headers : {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Post Data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      this.setState({action_status : 'failed', action_message : 'Sorry, There is something error, please refresh page and try again'})
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async getDatafromAPIXL(url){
    try {
      let respond = await axios.get(API_URL_MAS +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameMAS,
          password: passwordMAS
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Get Data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
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

  getDataCD(){
    this.getDatafromAPIXL('/custdel_op').then( resCD => {
      if(resCD.data !== undefined){
        this.setState({ list_cd_id : resCD.data._items })
      }
    })
  }

  getDataCDProject(){
    const project_id = this.state.data_cd_id_selected.CD_Info_Project;
    this.getDatafromAPIXL('/project_op/'+project_id).then( resCD => {
      if(resCD.data !== undefined){
        this.setState({ project_selected : resCD.data._id, project_name_selected : resCD.data.Project })
      }
    })
  }

  handleChangeIdentifierBy(e){
    const value = e.target.value;
    this.setState({identifier_by : value});
  }

  handleChangeTSSR = (newValue) => {
    const _id_tssr = newValue.value;
    const data_tssr_selection = this.state.list_tssr.find(e => e._id === _id_tssr);
    this.setState({id_tssr_selected : _id_tssr, data_tssr_selected : data_tssr_selection }, () => {
      this.getTSSRBOM();
    });
  }

  handleChangeMRType(e) {
    const value = e.target.value;
    this.setState({mr_type : value });
  }

  handleChangeFormMRCreation(e){
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.create_mr_form;
    dataForm[parseInt(index)] = value;
    const indexOpt = e.target.selectedIndex;
    if(indexOpt !== undefined){
      let dataFormName = this.state.create_mr_name_form;
      const textOpt = e.target[indexOpt].text;
      dataFormName[parseInt(index)] = textOpt;
      this.setState({create_mr_name_form : dataFormName});
    }
    this.setState({create_mr_form : dataForm}, () => {
      console.log("PPForm", this.state.create_mr_form, this.state.create_mr_name_form);
    });
  }

  preparingDataMR(){
    const dateNow = new Date();
    const dataRandom = Math.floor(Math.random() * 100).toString().padStart(4, '0');
    const numberTSSR = dateNow.getFullYear().toString()+(dateNow.getMonth()+1).toString().padStart(2, '0')+dateNow.getDate().toString().padStart(2, '0')+dataRandom.toString();
    return numberTSSR;
  }

  selectedDatetoFormat(date){
    let dateSplit = date.split("-");
    return dateSplit[0]+"-"+dateSplit[1]+"-"+dateSplit[2]
  }

  handleCheckingForm() {
    const dataForm = this.state.create_mr_form;
    const dataFormName = this.state.create_mr_name_form;
    let dataValidate = {};
    let checkerror = [];
    let dataFormHeader = ["project_name", "mr_type", "mr_delivery_type", "origin_warehouse", "etd", "eta", "deliver_by", "created_based", "identifier"];
    let dataFormInputan = [this.state.project_name_selected, dataForm[3], dataForm[4], dataForm[8], dataForm[5], dataForm[6], dataForm[7], this.state.identifier_by, this.state.tower_selected_id];
    for (let i = 0; i < dataFormHeader.length; i++) {
      if (dataFormInputan[i] === undefined || dataFormInputan[i] === null) {
        dataValidate[dataFormHeader[i]] = false;
        checkerror.push(false);
      }
    }
    this.setState({ validation_form: dataValidate });
    console.log("dataValidate", dataValidate);
    if (checkerror.length !== 0) {
      return true
    } else {
      return false
    }
  }

  componentDidMount(){
    this.getVendorList();
    this.getDataProject();
    document.title = "LMR Creation | BAM"
  }

  getVendorList() {
    this.getDatafromAPIXL('/vendor_data').then(res => {
      if(res.data !== undefined) {
        const items = res.data._items;
        this.setState({vendor_list : items});
      }
    })
    // this.setState({vendor_list : vendorList});
  }

  getDataTower(){
    this.getDatafromAPIXL('/tower_site_sorted_non_page?projection={"tower_id" : 1}').then( resTower => {
      if(resTower.data !== undefined){
        this.setState({ list_tower : resTower.data._items }, () => {
          this.filterDataTower("");
        })
      }
    })
  }

  getDataProject(){
    // this.getDatafromAPIXL('/project_sorted_non_page').then( resProject => {
    //   if(resProject.data !== undefined){
    //     this.setState({ list_project : resProject.data._items }, () => {
    //       this.filterDataProject("");
    //     })
    //   }
    // })
    this.setState({list_project : projectList})
  }

  filterDataTower = (inputValue) => {
    const list = [];
    this.state.list_tower.map(i =>
        list.push({'label' : i.tower_id, 'value' : i.tower_id})
    )
    this.setState({list_tower_selection : list})
    if(inputValue.length === 0){
      return list;
    }else{
      return this.state.list_tower_selection.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  filterDataProject = (inputValue) => {
    const list = [];
    this.state.list_project.map(i =>
        list.push({'label' : i.Project, 'value' : i.Project})
    )
    this.setState({list_project_selection : list})
    if(inputValue.length === 0){
      return list;
    }else{
      return this.state.list_project_selection.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  handleChangeProjectXL(e){
    this.setState({project_selected : e.value, project_name_selected : e.value })
    return e;
  }

  handleChangeProject(e){
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    let lmr_form = this.state.lmr_form;
    lmr_form["project_name"] = text;
    lmr_form["id_project_doc"] = value;
    this.setState({lmr_form : lmr_form});
    console.log("lmr_form", lmr_form);
  }

  handleChangeVendor(e){
    const value = e.target.value;
    let lmr_form = this.state.lmr_form;
    let dataVendor = this.state.vendor_list.find(e => e.Vendor_Code === value)
    lmr_form["vendor_code"] = dataVendor.Vendor_Code;
    lmr_form["vendor_name"] = dataVendor.Name;
    lmr_form["vendor_address"] = dataVendor.vendor_address;
    this.setState({lmr_form : lmr_form});
  }

  handleChangeCD(e){
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    const data_CD = this.state.list_cd_id.find(e => e._id === value);
    this.setState({cd_id_selected : value, data_cd_id_selected : data_CD}, () => {
      this.getDataCDProject();
    });
  }

  async loadOptionsTowerID(inputValue) {
    if(!inputValue || inputValue.length < 3 ) {
      return [];
    } else {
      let tower_id_list = [];
      // const getSSOWID = await this.getDatafromAPIXL('/ssow_sorted_nonpage?where={"ssow_id":{"$regex":"'+inputValue+'", "$options":"i"}, "sow_type":"'+this.state.list_activity_selected.CD_Info_SOW_Type +'"}');
      const getTowerID = await this.getDatafromAPIXL('/tower_site_sorted_non_page?where={"tower_id":{"$regex":"'+inputValue+'", "$options":"i"}}');
      if(getTowerID !== undefined && getTowerID.data !== undefined) {
        getTowerID.data._items.map(tower =>
          tower_id_list.push({'label' : tower.tower_id, 'value' : tower.tower_id}))
      }
      return tower_id_list;
    }
  }

  async loadOptionsCDID(inputValue) {
    if(!inputValue) {
      return [];
    } else {
      let wp_id_list = [];
      // const getSSOWID = await this.getDatafromAPIXL('/ssow_sorted_nonpage?where={"ssow_id":{"$regex":"'+inputValue+'", "$options":"i"}, "sow_type":"'+this.state.list_activity_selected.CD_Info_SOW_Type +'"}');
      const getWPID = await this.getDatafromAPIXL('/custdel_sorted_non_page?where={"WP_ID":{"$regex":"'+inputValue+'", "$options":"i"}}');
      if(getWPID !== undefined && getWPID.data !== undefined) {
        getWPID.data._items.map(wp =>
          wp_id_list.push({'value' : wp.WP_ID , 'label' : wp.WP_ID +" ( "+wp.WP_Name+" )"}))
      }
      return wp_id_list;
    }
  }

  handleChangeTowerXL(e){
    console.log(" e.value",  e.value);
    this.setState({tower_selected_id : e.value});
    return e
  }

  showHide(e) {
    if(e.target.value === "Relocation") {
      this.setState({toggle_display : "relocation"});
    } else if(e.target.value === "Return") {
      this.setState({toggle_display : "return"});
    } else {
      this.setState({toggle_display : "new"});
    }
  }

  selectMRType(TypeDel){
    let delType = null;
    switch(TypeDel) {
      case "New":
        delType = 1;
        break;
      case "Upgrade":
        delType = 2;
        break;
      case "Relocation":
        delType = 3;
        break;
      case "Return":
        delType = 4;
        break;
      default:
        delType = 1;
    }
    return delType
  }

  selectDeliveryType(TypeDel){
    let delType = null;
    switch(TypeDel) {
      case "Warehouse to Site":
        delType = 1;
        break;
      case "Site to Warehouse":
        delType = 2;
        break;
      case "Site to Site":
        delType = 3;
        break;
      case "Warehouse to Warehouse":
        delType = 4;
        break;
      default:
        delType = 1;
    }
    return delType
  }

  handleChangeFormLMR(e) {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_form = this.state.lmr_form;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    lmr_form[name.toString()] = value;
    this.setState({ lmr_form: lmr_form });
  }

  async createLMR(){
    const dataForm = this.state.lmr_form;
    const dataChildForm = this.state.creation_lmr_child_form;
    const dataLMR = {
      "lmr_issued_by": this.state.lmr_form.lmr_issued_by,
      "pgr": this.state.lmr_form.pgr,
      "gl_account": this.state.lmr_form.gl_account,
      "project_name": this.state.lmr_form.project_name,
      "id_project_doc": this.state.lmr_form.id_project_doc === undefined ? null : this.state.lmr_form.id_project_doc,
      "header_text": this.state.lmr_form.header_text,
      "payment_term": this.state.lmr_form.payment_term,
      "vendor_code": this.state.lmr_form.vendor_code,
      "vendor_name": this.state.lmr_form.vendor_name,
      "vendor_address": this.state.lmr_form.vendor_address,
      "l1_approver": this.state.lmr_form.l1_approver,
      "l2_approver": this.state.lmr_form.l2_approver,
      "l3_approver": this.state.lmr_form.l3_approver
    }
    let dataLMRCHild = [];
    for(let i = 0; i < dataChildForm.length; i++){
      const dataChild = {
          "nw": dataChildForm[i].so_or_nw,
          "activity": dataChildForm[i].activity,
          "material": dataChildForm[i].material,
          "description": dataChildForm[i].description,
          "site_id": dataChildForm[i].site_id,
          "qty": parseFloat(dataChildForm[i].quantity),
          "unit_price": parseFloat(dataChildForm[i].price),
          "tax_code": dataChildForm[i].tax_code,
          "delivery_date": dataChildForm[i].delivery_date,
          "total_price": parseFloat(dataChildForm[i].total_price),
          "total_value": parseFloat(dataChildForm[i].total_value),
          "currency": dataChildForm[i].currency,
          "pr": dataChildForm[i].pr,
          "item": parseFloat(dataChildForm[i].item)
      }
      dataLMRCHild.push(dataChild);
    }
    console.log("dataLMR", dataLMR);
    console.log("dataLMRChild", dataLMRCHild);
    const respondSaveLMR = await this.postDatatoAPINODE('/aspassignment/createOneAspAssignment', {"asp_data" : dataLMR, "asp_data_child" : dataLMRCHild });
    if(respondSaveLMR.data !== undefined && respondSaveLMR.status >= 200 && respondSaveLMR.status <= 300 ) {
      this.setState({ action_status : 'success' });
    } else{
      if(respondSaveLMR.response !== undefined && respondSaveLMR.response.data !== undefined && respondSaveLMR.response.data.error !== undefined){
        if(respondSaveLMR.response.data.error.message !== undefined){
          this.setState({ action_status: 'failed', action_message: respondSaveLMR.response.data.error.message });
        }else{
          this.setState({ action_status: 'failed', action_message: respondSaveLMR.response.data.error });
        }
      }else{
        this.setState({ action_status: 'failed' });
      }
    }
  }

  addLMR(){
    let dataLMR = this.state.creation_lmr_child_form;
    dataLMR.push({});
    this.setState({creation_lmr_child_form : dataLMR});
  }

  handleChangeFormLMRChild(e){
    let dataLMR = this.state.creation_lmr_child_form;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];
    dataLMR[parseInt(idx)][field] = value;
    this.setState({creation_lmr_child_form : dataLMR})
  }

  render() {
    if(this.state.redirectSign !== false){
      return (<Redirect to={'/mr-detail/'+this.state.redirectSign} />);
    }
    return (
      <div>
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
        <Col xl="12">
        <Card>
          <CardHeader>
            <span style={{lineHeight :'2', fontSize : '17px'}}><i className="fa fa-edit" style={{marginRight: "8px"}}></i>Assignment LMR Creation </span>
          </CardHeader>
          <CardBody>
            <Form>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>LMR Issued By</Label>
                    <Input type="text" name="lmr_issued_by" id="lmr_issued_by" value={this.state.lmr_form.lmr_issued_by} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>PGr</Label>
                    <Input type="text" name="pgr" id="pgr" value={this.state.lmr_form.pgr} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>GL Account</Label>
                    <Input type="text" name="gl_account" id="gl_account" value={this.state.lmr_form.gl_account} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>Project Name</Label>
                    <Input type="text" name="project_name" id="project_name" value={this.state.lmr_form.project_name} onChange={this.handleChangeFormLMR} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Header Text</Label>
                    <Input type="text" name="header_text" id="header_text" value={this.state.lmr_form.header_text} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Payment Term</Label>
                    <Input type="text" name="payment_term" id="payment_term" value={this.state.lmr_form.payment_term} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>Vendor Name</Label>
                    <Input type="select" name="vendor_name" id="vendor_name" value={this.state.lmr_form.vendor_code} onChange={this.handleChangeVendor} >
                      <option value={null}></option>
                      {this.state.vendor_list.map(e =>
                        <option value={e.Vendor_Code}>{e.Name}</option>
                      )}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Vendor Code</Label>
                    <Input type="text" name="vendor_code" id="vendor_code" value={this.state.lmr_form.vendor_code} onChange={this.handleChangeFormLMR} readOnly/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Vendor Address</Label>
                    <Input type="textarea" name="vendor_address" id="vendor_address" value={this.state.lmr_form.vendor_address} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>L1 Approver / PM</Label>
                    <Input type="text" name="l1_approver" id="l1_approver" value={this.state.lmr_form.l1_approver} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>L2 Approver / PM</Label>
                    <Input type="text" name="l2_approver" id="l2_approver" value={this.state.lmr_form.l2_approver} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>L3 Approver / PM</Label>
                    <Input type="text" name="l3_approver" id="l3_approver" value={this.state.lmr_form.l3_approver} onChange={this.handleChangeFormLMR}/>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
            <hr className="upload-line--lmr"></hr>
            <h5 style={{marginTop: "16px"}}>LMR Child</h5>
            <hr className="upload-line--lmr"></hr>
            {this.state.creation_lmr_child_form.map((lmr,i) =>
              <Form>
                <Row form>
                  <Col md={2}>
                    <FormGroup>
                      <Label>SO / NW</Label>
                      <Input type="text" name={i+" /// so_or_nw"} id={i+" /// so_or_nw"} value={lmr.so_or_nw} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Activity</Label>
                      <Input type="text" name={i+" /// activity"} id={i+" /// activity"} value={lmr.activity} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Material</Label>
                      <Input type="text" name={i+" /// material"} id={i+" /// material"} value={lmr.material} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input type="textarea" name={i+" /// description"} id={i+" /// description"} value={lmr.description} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Site ID</Label>
                      <Input type="text" name={i+" /// site_id"} id={i+" /// site_id"} value={lmr.site_id} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Quantity</Label>
                      <Input type="number" name={i+" /// quantity"} id={i+" /// quantity"} value={lmr.quantity} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input type="number" name={i+" /// price"} id={i+" /// price"} value={lmr.price} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Label>Tax Code</Label>
                      <Input type="text" name={i+" /// tax_code"} id={i+" /// tax_code"} value={lmr.tax_code} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Delivery Date</Label>
                      <Input type="date" name={i+" /// delivery_date"} id={i+" /// delivery_date"} value={lmr.delivery_date} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Total Price</Label>
                      <Input type="number" name={i+" /// total_price"} id={i+" /// total_price"} value={lmr.total_price} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Total Value</Label>
                      <Input type="number" name={i+" /// total_value"} id={i+" /// total_value"} value={lmr.total_value} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input type="text" name={i+" /// currency"} id={i+" /// currency"} value={lmr.currency} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Label>Item</Label>
                      <Input type="number" name={i+" /// item"} id={i+" /// item"} value={lmr.item} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Label>PR</Label>
                      <Input type="text" name={i+" /// pr"} id={i+" /// pr"} value={lmr.pr} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col>
                </Row>
                <hr className="upload-line--lmr"></hr>
              </Form>
            )}
            <div>
              <Button color="primary" size="sm" onClick={this.addLMR}>
                <i className="fa fa-plus">&nbsp;</i> LMR
              </Button>
            </div>
          </CardBody>
          <CardFooter>
            <Button color='success' size="sm" style={{float : 'right'}} onClick={this.createLMR}><i className="fa fa-plus-square" style={{marginRight: "8px"}}></i>Create LMR ASG</Button>
          </CardFooter>
        </Card>
        </Col>
        </Row>
        {/* Modal Loading */}
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm ' + this.props.className}>
          <ModalBody>
            <div style={{textAlign : 'center'}}>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <div style={{textAlign : 'center'}}>
              Loading ...
            </div>
            <div style={{textAlign : 'center'}}>
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

export default MYASGCreation;
