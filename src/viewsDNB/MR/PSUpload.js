import React, { Component, Fragment } from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col, Button, Input } from 'reactstrap';
import { Form, FormGroup, Label } from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

const API_URL_BMS_Phil = 'https://api-dev.smart.pdb.e-dpm.com/smartapi';
const usernamePhilApi = 'pdbdash';
const passwordPhilApi = 'rtkO6EZLkxL1';

const API_URL_BAM = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const usernameBAM = 'bamidadmin@e-dpm.com';
const passwordBAM = 'F760qbAg2sml';

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, inValue="", disabled= false}) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={inValue} className="checkmark-dash" disabled={disabled}/>
);

class PSUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole : this.props.dataLogin.role,
      userId : this.props.dataLogin._id,
      userName : this.props.dataLogin.userName,
      userEmail : this.props.dataLogin.email,
      tokenUser : this.props.dataLogin.token,
        data_mr : null,
        list_tssr : [],
        list_tssr_for_selection : [],
        id_tssr_selected : null,
        data_tssr : null,
        data_tssr_sites_item : [],
        data_tssr_sites : [],
        tssr_site_NE : null,
        tssr_site_FE : null,
        list_pp_material_tssr : [],
        mr_type : "RBS",
        qty_ne : new Map(),
        qty_fe : new Map(),
        redirectSign : false,
        action_status : null,
        action_message : null,
        material_wh : [],
        material_inbound : [],
        cd_id_to_tssr_selected : new Map(),
        cd_id_to_tssr : [],
        list_tssr_from_ps : [],
        list_cd_id_mr : [],
        modal_assign_ps : false,
        wbs_cd_id_data : [],
    };
    this.handleChangeTSSR = this.handleChangeTSSR.bind(this);
    this.getQtyTssrPPNE = this.getQtyTssrPPNE.bind(this);
    this.getQtyTssrPPFE = this.getQtyTssrPPFE.bind(this);
    this.editQtyNE = this.editQtyNE.bind(this);
    this.editQtyFE = this.editQtyFE.bind(this);
    this.connectMRtoTSSR = this.connectMRtoTSSR.bind(this);
    this.getDataWarehouse = this.getDataWarehouse.bind(this);
    this.getDataInbound = this.getDataInbound.bind(this);
    this.handleChangeCDIDtoTSSR = this.handleChangeCDIDtoTSSR.bind(this);
    this.toggleAssign = this.toggleAssign.bind(this);
  }

  async getDataFromAPINODEWithParams(url) {
    try {
      let respond = await axios({
        method : "get",
        url : API_URL_NODE+url,
        headers : {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
        params :{

        }
      })
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

  async getDatafromAPIBMS(url){
    try {
      let respond = await axios.get(API_URL_BMS_Phil +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi
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

  async getDatafromAPIBAM(url){
    try {
      let respond = await axios.get(API_URL_BAM +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameBAM,
          password: passwordBAM
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

  async postDatatoAPIBAM(url, data){
    try {
      let respond = await axios.post(API_URL_BAM +url, data, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameBAM,
          password: passwordBAM
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Post Data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async patchDatatoAPIBAM(url, data, _etag){
    try {
      let respond = await axios.patch(API_URL_BAM +url, data, {
        headers : {'Content-Type':'application/json', "If-Match" : _etag},
        auth: {
          username: usernameBAM,
          password: passwordBAM
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Patch data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Patch data", err);
      return respond;
    }
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE+url, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      });
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond data node", respond);
      }
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data node", err);
      return respond;
    }
  }

  async patchDatatoAPINODE(url, data){
    try {
      let respond = await axios.patch(API_URL_NODE +url, data, {
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

  async postDatatoAPINODE(url, data) {
    try {
      let respond = await axios.post(API_URL_NODE+url, data, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+this.state.tokenUser
        },
      })
      if(respond.status >= 200 && respond.status < 300) {
        console.log("respond post data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond post data", err.response);
      return respond;
    }
  }

  async getDatafromAPIXL(url){
    try {
      let respond = await axios.get(API_URL_XL +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameXL,
          password: passwordXL
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

  toggleAssign(e) {
    this.setState((prevState) => ({
      modal_assign_ps: !prevState.modal_assign_ps,
    }));
  }

  getListTssrAll(){
    this.getDataFromAPINODE('/plantspec?q={"id_mr_doc" : null, "submission_status" : "SUBMITTED", "site_info.site_id" : "'+this.state.data_mr.site_info[0].site_id+'" }').then( res => {
    // this.getDatafromAPIBAM('/tssr_sorted_nonpage?projection={"project_name" : 1, "no_tssr_boq" : 1, "_id" : 1, "version" : 1 }').then( res => {
      if(res.data !== undefined){
        const items = res.data.data;
        this.setState({ list_tssr : items }, () => {
          this.prepareSelectionTSSR(items);
        });
      }
    })
  }

  prepareSelectionTSSR(list_tssr){
    //Make list tssr from API to format for "Select" from React-select
    const list_tssr_selection = [];
    const list_tssr_filter = list_tssr.filter(i =>
      i.no_plantspec.toLowerCase().includes(("PS").toLowerCase())
    )
    list_tssr_filter.map(tssr =>
        list_tssr_selection.push({'label' : tssr.no_plantspec, 'value' : tssr._id})
    )
    this.setState({ list_tssr_for_selection : list_tssr_selection});
  }

  handleChangeTSSR = (newValue) => {
    const _id_tssr = newValue.value;
    this.setState({id_tssr_selected : _id_tssr, data_tssr : null,tssr_site_NE : null, tssr_site_FE : null }, () => {
      this.getDataTssr(_id_tssr);
    });
  }

  getDataMR(_id_MR){
    this.getDataFromAPINODE('/matreq/' + _id_MR).then(resMR => {
      if(resMR.data !== undefined){
        this.setState({ data_mr : resMR.data }, () => {
          this.getListTssrAll();
          if(resMR.data.cust_del !== undefined){
            this.setState({list_cd_id_mr : resMR.data.cust_del }, () => {
              this.getDataCDID(resMR.data.cust_del.map(e => e.cd_id));
            })
          }else{
            this.setState({list_cd_id_mr : [] })
          }
        });
      }
    })
  }

  async getDataCDID(array_cd_id){
    if(array_cd_id.length !== 0){
      let array_in_cdid = '"'+array_cd_id.join('", "')+'"';
      const getWPID = await this.getDatafromAPIXL('/custdel_sorted?where={"WP_ID":{"$in" : ['+array_in_cdid+']}}');
      if(getWPID !== undefined && getWPID.data !== undefined) {
        this.setState({ wbs_cd_id_data : getWPID.data._items});
      }
    }
  }

  getDataTssr(_id_tssr){
    this.getDataFromAPINODE('/plantspec/'+_id_tssr).then( resTssr => {
      if(resTssr.data !== undefined){
        this.setState({ data_tssr : resTssr.data.data });
        this.prepareView(resTssr.data.data)
      }
    })
  }

  prepareView(dataTSSR){
    const dataMR = this.state.data_mr;
    let listSku = [];
    const dataTSSRMaterial = dataTSSR.packages.map(pp => pp.materials.map(material => listSku.push(material.material_id)));
    let dataTechUniq = [];
    dataTSSR.packages.map(pp =>
      dataTechUniq.find(e => e.id_tssr_boq_site_doc === pp.id_tssr_boq_site_doc) === undefined ? dataTechUniq.push({"id_tssr_boq_site_doc" : pp.id_tssr_boq_site_doc, "no_tssr_boq_site" : pp.no_tssr_boq_site}) : null
    )
    console.log("dataTechUniq", dataTechUniq);
    this.setState({list_tssr_from_ps : dataTechUniq});
    listSku = [...new Set(listSku)];
    let site_mr_NE = dataMR.site_info.find(e => e.site_title === "NE");
    let site_mr_FE = dataMR.site_info.find(e => e.site_title === "FE");
    let site_NE;
    let site_FE;
    if(site_mr_NE !== undefined){
      site_NE = dataTSSR.site_info.find(e => e.site_id === site_mr_NE.site_id);
    }
    if(site_mr_FE !== undefined){
      site_FE = dataTSSR.site_info.find(e => e.site_id === site_mr_FE.site_id);
    }
    if(site_NE !== undefined){
      this.setState({tssr_site_NE : site_NE})
    }
    if(site_FE !== undefined){
      this.setState({tssr_site_FE : site_FE})
    }
    this.getDataWarehouse(listSku);
    this.getDataInbound(listSku);
  }

  async getDataWarehouse(listSku) {
    if(listSku !== null && listSku !== undefined) {
      let skuData = {
        "sku" : listSku
      }
      const respondSKU = await this.postDatatoAPINODE('/whStock/getWhStockbySku', skuData);
      if(respondSKU.data !== undefined && respondSKU.status >= 200 && respondSKU.status <= 300 ){
        let array_sku = [];
        respondSKU.data.data.map(sku => sku.map(sku2 => array_sku.push({"sku":sku2.sku, "qty_sku":sku2.qty_sku})));
        this.setState({ material_wh : array_sku });
      }
    }
  }

  async getDataInbound(listSku) {
    // let listSku = [];
    if(listSku !== null && listSku !== undefined) {
      // data_tssr.map(pp => pp.material_detail.map(material => listSku.push(material.material_id)));
      // listSku = [...new Set(listSku)];
      let skuData = {
        "sku" : listSku
      }
      const respondSKU = await this.postDatatoAPINODE('/whInboundPlan/getWhInboundPlanbySku', skuData);
      if(respondSKU.data !== undefined && respondSKU.status >= 200 && respondSKU.status <= 300 ){
        let array_sku = [];
        respondSKU.data.data.map(sku => sku.map(sku2 => array_sku.push({"sku":sku2.sku, "qty_sku":sku2.qty_sku})));
        this.setState({ material_inbound : array_sku });
      }
    }
  }

  async getPSAllocated(){
    const data_tssr_id = this.state.id_tssr_selected;
    const getDataMR = await this.getDatafromAPIBAM('/mr_op?where={"id_tssr_doc" : "'+data_tssr_id+'"}');
    if(getDataMR.data !== undefined){
      const dataIDMR = getDataMR.data._items.map(e => e._id);
      if(dataIDMR.length !== 0){
        const getDataMR = await this.getDatafromAPIBAM('/mr_pp_op?where={"id_mr_doc" : {"$in" : ['+dataIDMR+']}}');
        if(getDataMR.data !== undefined){

        }
      }
    }
  }

  countPSAllocated(data_mr_pp){
    let site_NE = this.state.data_tssr_sites.find(e => e.site_title === "NE");
    let site_FE = this.state.data_tssr_sites.find(e => e.site_title === "FE");
    // const
  }

  async getPPandMaterial(array_id_package){
    let dataPP = [];
    let arrayDataPP = array_id_package;
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for(let i = 0 ; i < getNumberPage; i++){
        let dataPaginationPP = arrayDataPP.slice(i * 25, (i+1)*25);
        let arrayIdPP = '"'+dataPaginationPP.join('", "')+'"';
        let where_id_PP = '?where={"_id" : {"$in" : ['+arrayIdPP+']}}';
        let resPP = await this.getDatafromAPIBAM('/pp_sorted_nonpage'+where_id_PP);
        if(resPP !== undefined){
            if(resPP.data !== undefined){
              // eslint-disable-next-line
              dataPP = dataPP.concat(resPP.data._items);
            }
        }
    }
    this.getDataMaterial(dataPP);
  }


  async getDataMaterial(data_pp){
    let dataMat = [];
    let arrayDataPP = data_pp.map(e => e._id);
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for(let i = 0 ; i < getNumberPage; i++){
        let dataPaginationPP = arrayDataPP.slice(i * 25, (i+1)*25);
        let arrayIdPP = '"'+dataPaginationPP.join('", "')+'"';
        let where_id_PP = '?where={"id_pp_doc" : {"$in" : ['+arrayIdPP+']}}';
        let resMat = await this.getDatafromAPIBAM('/mc_op'+where_id_PP);
        if(resMat !== undefined){
            if(resMat.data !== undefined){
              // eslint-disable-next-line
              dataMat = dataMat.concat(resMat.data._items);
            }
        }
    }
    this.prepareDataPP(data_pp, dataMat);
  }

  prepareDataPP(data_pp, data_material){
    let product_package = data_pp;
    const material_catalogue = data_material;
    for(let i = 0; i < product_package.length; i++){
      const material = material_catalogue.filter(e => e.pp_id === product_package[i].pp_id);
      product_package[i]["list_of_material"] = material;
    }
    this.setState({list_pp_material_tssr : product_package});
  }

  getQtyTssrPPNE(pp_id){
    const itemTssrBom = this.state.tssr_site_NE.list_of_site_items;
    const getDataPPTssr = itemTssrBom.find(e => e.pp_id === pp_id);
    if(getDataPPTssr !== undefined){
      return getDataPPTssr.qty;
    }else{
      return 0;
    }
  }

  getQtyTssrPPFE(pp_id){
    const itemTssrBom = this.state.tssr_site_FE.list_of_site_items;
    const getDataPPTssr = itemTssrBom.find(e => e.pp_id === pp_id);
    if(getDataPPTssr !== undefined){
      return getDataPPTssr.qty;
    }else{
      return 0;
    }
  }

  async connectMRtoTSSR(){
    const dataMRParent = this.state.data_mr;
    const dataPS = this.state.data_tssr;
    const dataCDID = this.state.wbs_cd_id_data;
    const selectedCD = this.state.cd_id_to_tssr;
    let matOBDStat = [];
    dataPS.packages.forEach((pp) => {
      let wbsSite = null;
      const dataCDSite = selectedCD.find(sc => sc.id_tssr_boq_site_doc === pp.id_tssr_boq_site_doc);
      wbsSite = dataCDID.find(wbs => wbs.WP_ID === dataCDSite.cd_id);
      if(wbsSite !== undefined){
        wbsSite = wbsSite.C1003_WBS_HW;
      }
      pp.materials.forEach((mat) => {
        const dataOBD = {
           "MRF": dataMRParent.mr_id,
           "Submit_by": dataMRParent.mr_status[0].mr_status_updater,
           "Network_Order": null,
           "Material": mat.material_id,
           "Plant": dataMRParent.origin.value,
           "Storage_Location": dataMRParent.origin.value,
           "WBS_Element_from": wbsSite,
           "WBS_Element_to": wbsSite,
           "Qty": mat.qty,
           "Delivery_Date": dataMRParent.etd.toString().slice(0,10),
           "Shipping_point": null,
           "Work_Status": null,
           "OBD": null,
           "Material_document": null,
           "Error_Message": null,
        };
        matOBDStat.push(dataOBD);
      });
    });
    this.setState({modal_assign_ps : false})
    let dataTSSR = {};
    if(this.state.cd_id_to_tssr.length !== 0){
      dataTSSR = {
        "data" : this.state.cd_id_to_tssr
      }
    }
    this.patchDatatoAPINODE('/matreq/assignPlantSpecByTssr2/'+dataMRParent._id+'/ps/'+this.state.id_tssr_selected, dataTSSR).then(res => {
      if(res.data !== undefined){
        this.patchDatatoAPINODE("/matreq/requestMatreq/" + dataMRParent._id).then(res => {
          this.setState({ action_status : "success" });
        })
      }else{
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
    })
  }

  editQtyNE = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({ qty_ne : prevState.qty_ne.set(name, value) }));
  }

  editQtyFE = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({ qty_fe : prevState.qty_fe.set(name, value) }));
  }

  componentDidMount(){
    this.getDataMR(this.props.match.params.id);

  }

  handleChangeCDIDtoTSSR(e){
    const name = e.target.name;
    const value = e.target.value;
    let dataCDSelected = this.state.list_cd_id_mr.find(e => e.id_cd_doc === value)
    let cd_id_to_tssr = this.state.cd_id_to_tssr;
    let indexCurrent = cd_id_to_tssr.findIndex(e => e.id_tssr_boq_site_doc === name);
    if(dataCDSelected !== undefined){
        if( indexCurrent === -1){
	      cd_id_to_tssr.push({
	  			"id_tssr_boq_site_doc" : name,
	  			"id_cd_doc" : dataCDSelected.id_cd_doc,
	  			"cd_id" : dataCDSelected.cd_id
	  		})
	    }else{
	      cd_id_to_tssr[indexCurrent] = {
	  			"id_tssr_boq_site_doc" : name,
	  			"id_cd_doc" : dataCDSelected.id_cd_doc,
	  			"cd_id" : dataCDSelected.cd_id
	  		}
	    }
    }else{
    	if( indexCurrent === -1){

	    }else{
	    	cd_id_to_tssr.splice(indexCurrent,1);
	    }
    }
    this.setState({cd_id_to_tssr : cd_id_to_tssr})
    this.setState((prevState) => ({
      cd_id_to_tssr_selected: prevState.cd_id_to_tssr_selected.set(name, value),
    }));
  }

  render() {
    if(this.state.redirectSign !== false){
      return (<Redirect to={'/mr-detail/'+this.state.redirectSign} />);
    }
    let qty_wh = undefined, qty_inbound = undefined;
    return (
      <div>
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
        <Col xl="12">
        <Card>
          <CardHeader>
            <span style={{lineHeight :'2', fontSize : '17px'}} >Assign PS</span>
            <Button color='success' style={{float : 'right'}} disabled={this.state.list_tssr_from_ps.length === 0} onClick={this.toggleAssign}>Assign</Button>
          </CardHeader>
          <CardBody>
            <table>
              <tbody>
                <tr>
                  <td style={{width : '150px'}}>PlantSpec Group</td>
                  <td>:</td>
                  <td style={{width : '300px'}}>
                    <Select
                      cacheOptions
                      options={this.state.list_tssr_for_selection}
                      onChange={this.handleChangeTSSR}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <table style={{width : '100%', marginBottom : '0px', fontSize : '20px', fontWeight : '500'}}>
              <tbody>
                <tr>
                  <td colSpan="4" style={{textAlign : 'center', color : 'rgba(59,134,134,1)', fontSize : '21px'}}>MR DETAIL</td>
                </tr>
                {this.state.data_mr !== null && (
                  <Fragment>
                  <tr>
                    <td colSpan="4" style={{fontSize : '15px', textAlign : 'center', color : 'rgba(59,134,134,1)'}}>MR ID : {this.state.data_mr.mr_id}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{fontSize : '15px', textAlign : 'center', color : 'rgba(59,134,134,1)'}}>Project Name : {this.state.data_mr.project_name}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{fontSize : '15px', textAlign : 'center', color : 'rgba(59,134,134,1)'}}>SOW Type : {this.state.data_mr.sow_type}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{fontSize : '15px', textAlign : 'center', color : 'rgba(59,134,134,1)'}}>MR Site NE : {this.state.data_mr.site_info[0].site_id}</td>
                  </tr>
                  </Fragment>
                )}
              </tbody>
            </table>
            <hr style={{borderStyle : 'double', borderWidth: '0px 0px 3px 0px', borderColor : 'rgba(59,134,134,1)', marginTop: '5px'}}></hr>
            <Fragment>
            <Row>
            {(this.state.data_tssr !== null && this.state.data_mr !== null )&& (
              <Fragment>
                <Col md="4">
                <table className="table-header">
                  <tbody>
                    <Fragment>
                      {this.state.data_mr.mr_type === "Relocation" || this.state.data_mr.mr_type === "Return" ? (
                        <tr>
                          <td style={{width : '200px'}}>Destination {this.state.data_mr.destination.title}</td>
                          <td>:</td>
                          <td style={{width : '200px'}}>{this.state.data_mr.destination.value}</td>
                        </tr>
                      ) : (
                        <Fragment>
                        <tr>
                          <td style={{width : '200px'}}>TSSR Site ID NE</td>
                          <td>:</td>
                          <td>{this.state.data_tssr.siteList !== undefined ? this.state.data_tssr.siteList[0].site_info.site_id : ""}</td>
                        </tr>
                        <tr>
                          <td style={{width : '200px'}}>TSSR Site Name NE</td>
                          <td>:</td>
                          <td>{this.state.data_tssr.siteList !== undefined ? this.state.data_tssr.siteList[0].site_info.site_name : ""}</td>
                        </tr>
                        </Fragment>
                      )}
                    </Fragment>
                  </tbody>
                </table>
                </Col>
                {this.state.tssr_site_FE !== null && this.state.data_mr.mr_type !== "Relocation" && this.state.data_mr.mr_type !== "Return" ? (
                  <Col md="4">
                  <table className="table-header">
                    <tbody>
                      <tr>
                        <td>Site ID FE</td>
                        <td>: &nbsp;</td>
                        <td style={{paddingLeft:'10px'}}>{this.state.tssr_site_FE.site_info.site_id}</td>
                      </tr>
                      <tr>
                        <td>Site Name FE</td>
                        <td>:</td>
                        <td style={{paddingLeft:'10px'}}>{this.state.tssr_site_FE.site_info.site_name}</td>
                      </tr>
                    </tbody>
                  </table>
                  </Col>
                ) : (<Fragment></Fragment>)}
              </Fragment>
            )}
            </Row>
              <hr className="upload-line-ordering"></hr>
              {this.state.data_mr !== null ?
                this.state.data_mr.sow_type === "RBS" && this.state.tssr_site_FE !== null ? (
                  <span style={{color : 'red'}}>You just can choose Plant Spec with same SOW type</span>
                ) : this.state.data_mr.sow_type === "TRM" && this.state.tssr_site_FE === null ? (
                  <span style={{color : 'red'}}>You just can choose Plant Spec with same SOW type</span>
                ) : (<Fragment></Fragment> ) : (<Fragment></Fragment>
              )}
              <div className='divtable2'>
                <Table hover bordered striped responsive size="sm">
                  <thead style={{backgroundColor : '#0B486B', color : 'white'}}>
                    <tr>
                      <th rowSpan="2" className="fixedhead" style={{width : '200px', verticalAlign : 'middle'}}>PS No. (Program)</th>
                      <th rowSpan="2" className="fixedhead" style={{width : '200px', verticalAlign : 'middle'}}>PP / Material Code</th>
                      <th rowSpan="2" className="fixedhead" style={{verticalAlign : 'middle'}}>PP / Material Name</th>
                      <th rowSpan="2" className="fixedhead" style={{verticalAlign : 'middle'}}>Program</th>
                      <th rowSpan="2" className="fixedhead" style={{width : '75px', verticalAlign : 'middle'}}>Unit</th>
                      <th colSpan="3" className="fixedhead" style={{width : '100px', verticalAlign : 'middle'}}>Total Qty per PP</th>
                      <th rowSpan="2" className="fixedhead" style={{width : '75px', verticalAlign : 'middle'}}>Availability</th>
                    </tr>
                    {this.state.data_mr !== null ?
                      this.state.data_mr.mr_type !== "Relocation" && this.state.data_mr.mr_type !== "Return" ? (
                        <tr>
                          <th className="fixedhead" style={{width : '100px', verticalAlign : 'middle'}}>Site NE</th>
                          {this.state.tssr_site_FE !== null ? (
                            <th className="fixedhead" style={{width : '100px', verticalAlign : 'middle'}}>SITE FE</th>
                          ):(<Fragment></Fragment>)}
                          <th className="fixedhead" style={{width : '100px', verticalAlign : 'middle'}}>WH Stock</th>
                          <th className="fixedhead" style={{width : '100px', verticalAlign : 'middle'}}>WH Plan</th>
                        </tr>
                      ) : <Fragment></Fragment> : <Fragment></Fragment>}
                  </thead>
                  <tbody>
                  {this.state.data_tssr !== null ? (
                    <Fragment>
                      {this.state.data_tssr.packages.map( pp =>
                        <Fragment>
                          <tr style={{backgroundColor : '#E5FCC2'}} className="fixbody">
                            <td style={{textAlign : 'left'}}>{pp.no_tssr_boq_site +" ("+ pp.program +")"}</td>
                            <td style={{textAlign : 'left'}}>{pp.pp_id}</td>
                            <td>{pp.product_name}</td>
                            <td>{pp.program}</td>
                            <td>{pp.uom}</td>
                            <td>{pp.qty.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          {pp.materials.map(material =>
                            <tr style={{backgroundColor : 'rgba(248,246,223, 0.5)'}} className="fixbody">
                              <td style={{textAlign : 'right'}}></td>
                              <td style={{textAlign : 'right'}}>{material.material_id}</td>
                              <td style={{textAlign : 'left'}}>{material.material_name}</td>
                              <td></td>
                              <td>{material.uom}</td>
                              <td align='center'>{(material.qty).toFixed(2)}</td>
                              <td align='center'>{qty_wh = this.state.material_wh.find(e => e.sku === material.material_id) !== undefined ? this.state.material_wh.find(e => e.sku === material.material_id).qty_sku.toFixed(2) : 0}</td>
                              <td align='center'>{qty_inbound = this.state.material_inbound.find(e => e.sku === material.material_id) !== undefined ? this.state.material_inbound.find(e => e.sku === material.material_id).qty_sku.toFixed(2) : 0}</td>
                              <td align='center'>{material.qty < qty_wh ? "OK":"NOK"}</td>
                            </tr>
                          ) }
                        </Fragment>)}
                    </Fragment>
                  ): (<Fragment></Fragment>)}
                  </tbody>
                </Table>
              </div>
            </Fragment>
          </CardBody>
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
        {/* Modal Assign */}
        <Modal isOpen={this.state.modal_assign_ps} toggle={this.toggleAssign} className={'modal-md ' + this.props.className}>
          <ModalBody>
            <div>
              <Table responsive striped bordered size="sm">
                <thead>
                  <tr>
                    <th>PS No.</th>
                    <th>CD ID</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.list_tssr_from_ps.map(tssr =>
                    <tr>
                      <td style={{paddingTop : '10px'}}>
                        {tssr.no_tssr_boq_site}
                      </td>
                      <td>
                        <Input type="select" name={tssr.id_tssr_boq_site_doc} value={this.state.cd_id_to_tssr_selected.get(tssr.id_tssr_boq_site_doc)} onChange={this.handleChangeCDIDtoTSSR}>
                          <option></option>
                          {this.state.list_cd_id_mr.map(e =>
                            <option value={e.id_cd_doc}>{e.cd_id}</option>
                          )}
                        </Input>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>Close</Button>
            <Button color='success' style={{float : 'right'}} disabled={this.state.cd_id_to_tssr.length !== this.state.list_tssr_from_ps.length} onClick={this.connectMRtoTSSR}>Assign</Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Assign */}
      </div>

    );
  }
}


const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData
  }
}

export default connect(mapStateToProps)(PSUpload);
