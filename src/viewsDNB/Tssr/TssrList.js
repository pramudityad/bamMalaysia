import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import {connect} from 'react-redux';
import ActionType from '../../redux/reducer/globalActionType';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';

const API_URL = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const username = 'bamidadmin@e-dpm.com';
const password = 'F760qbAg2sml';

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

const arrayFilter = ["no_plantspec", "project_name", "tower_id", "cd_id", "region", "current_status", "submission_status", "mr_id"]

class TssrList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole : this.props.dataLogin.role,
      userId : this.props.dataLogin._id,
      userName : this.props.dataLogin.userName,
      userEmail : this.props.dataLogin.email,
      tokenUser : this.props.dataLogin.token,
      tssr_list : [],
      data_tower : [],
      prevPage : 0,
      activePage : 1,
      totalData : 0,
      perPage : 10,
      filter_list : {},
      tssr_all : [],
      modal_loading : false
    }
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.getTssrListMigration = this.getTssrListMigration.bind(this);
    this.printExcel = this.printExcel.bind(this);
    this.printExcelListPS = this.printExcelListPS.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggleLoading() {
    this.setState(prevState => ({
      modal_loading: !prevState.modal_loading
    }));
  }

  async getDataFromAPIBAM(url) {
    try {
      let respond = await axios.get(API_URL+url, {
        headers: {'Content-Type':'application/json'},
        auth: {
          username: username,
          password: password
        }
      });
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
      return respond;
    } catch(err) {
      let respond = err;
      console.log("respond data", err);
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
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
    }
  }

  getTssrList(){
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    (this.state.filter_list["no_plantspec"] !== null && this.state.filter_list["no_plantspec"] !== undefined) && (filter_array.push('"no_plantspec":{"$regex" : "' + this.state.filter_list["no_plantspec"] + '", "$options" : "i"}'));
    (this.state.filter_list["project_name"] !== null && this.state.filter_list["project_name"] !== undefined) && (filter_array.push('"project_name":{"$regex" : "' + this.state.filter_list["project_name"] + '", "$options" : "i"}'));
    (this.state.filter_list["tower_id"] !== null && this.state.filter_list["tower_id"] !== undefined) && (filter_array.push('"site_info.site_id":{"$regex" : "' + this.state.filter_list["tower_id"] + '", "$options" : "i"}'));
    (this.state.filter_list["cd_id"] !== null && this.state.filter_list["cd_id"] !== undefined) && (filter_array.push('"site_info.cd_id":{"$regex" : "' + this.state.filter_list["cd_id"] + '", "$options" : "i"}'));
    (this.state.filter_list["region"] !== null && this.state.filter_list["region"] !== undefined) && (filter_array.push('"site_info.region":{"$regex" : "' + this.state.filter_list["region"] + '", "$options" : "i"}'));
    (this.state.filter_list["current_status"] !== null && this.state.filter_list["current_status"] !== undefined) && (filter_array.push('"current_status":{"$regex" : "' + this.state.filter_list["current_status"] + '", "$options" : "i"}'));
    (this.state.filter_list["submission_status"] !== null && this.state.filter_list["submission_status"] !== undefined) && (filter_array.push('"submission_status":{"$regex" : "' + this.state.filter_list["submission_status"] + '", "$options" : "i"}'));
    (this.state.filter_list["mr_id"] !== null && this.state.filter_list["mr_id"] !== undefined) && (filter_array.push('"mr_id":{"$regex" : "' + this.state.filter_list["mr_id"] + '", "$options" : "i"}'));
    // this.getDataFromAPINODE('/tssrall?q='+whereAnd+'&lmt='+maxPage+'&pg='+page).then(res => {
    let whereAnd = '{' + filter_array.join(',') + '}';
    this.getDataFromAPINODE('/plantspec?srt=_id:-1&q=' + whereAnd + '&lmt=' + maxPage + '&pg=' + page).then(res => {
    // this.getDataFromAPIBAM('/tssr_sorted?'+'max_results='+this.state.perPage+'&page='+page).then(res => {
      if(res.data !== undefined){
        let siteIDArray = [];
        res.data.data.map(lst => lst.site_info.map(st => siteIDArray.push(st.site_id)))
        this.getDataTower(siteIDArray)
        const totalData = res.data.totalResults;
        this.setState({tssr_list : res.data.data, totalData : totalData})
      }
    })
  }

  async getTssrListMigration(){
    const page = this.state.activePage;
    const maxPage = 20;
    let arrayIDTSSR = [];
    let filter_array = [];
    // (this.state.filter_list["no_plantspec"] !== null && this.state.filter_list["no_plantspec"] !== undefined) && (filter_array.push('"no_plantspec":{"$regex" : "' + this.state.filter_list["no_plantspec"] + '", "$options" : "i"}'));
    // (this.state.filter_list["project_name"] !== null && this.state.filter_list["project_name"] !== undefined) && (filter_array.push('"project_name":{"$regex" : "' + this.state.filter_list["project_name"] + '", "$options" : "i"}'));
    // (this.state.filter_list["tower_id"] !== null && this.state.filter_list["tower_id"] !== undefined) && (filter_array.push('"site_info.site_id":{"$regex" : "' + this.state.filter_list["tower_id"] + '", "$options" : "i"}'));
    // (this.state.filter_list["current_status"] !== null && this.state.filter_list["current_status"] !== undefined) && (filter_array.push('"current_status":{"$regex" : "' + this.state.filter_list["current_status"] + '", "$options" : "i"}'));
    // (this.state.filter_list["submission_status"] !== null && this.state.filter_list["submission_status"] !== undefined) && (filter_array.push('"submission_status":{"$regex" : "' + this.state.filter_list["submission_status"] + '", "$options" : "i"}'));
    // (this.state.filter_list["mr_id"] !== null && this.state.filter_list["mr_id"] !== undefined) && (filter_array.push('"mr_id":{"$regex" : "' + this.state.filter_list["mr_id"] + '", "$options" : "i"}'));
    // filter_array.push('"migration":true')
    let whereAnd = '{' + filter_array.join(',') + '}';
    // noPg=1&
    // srt=_id:-1&
    // + '&lmt=' + maxPage + '&pg=' + page
    let dataMigrationTSSR = await this.getDataFromAPINODE('/plantspec?noPg=1&q=' + whereAnd +'&v={"_id" : 1}')
    if(dataMigrationTSSR.data !== undefined){
      arrayIDTSSR = dataMigrationTSSR.data.data;
      return arrayIDTSSR;
    }
  }

  async printExcel(){
    this.toggleLoading();
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTSSRMigration = await this.getTssrListMigration();

    ws.addRow(["bam_id", "tssr_id", "tower_id", "plant_spec_number", "config_id", "bundle_id", "bundle_name", "bundle_qty", "program", "material_id_plan", "material_name_plan", "material_id_actual", "material_name_actual", "uom", "qty", "material_type", "material_origin"]);

    for(let a = 0; a < dataTSSRMigration.length; a++){
      const ps = await this.getDataFromAPINODE('/plantspec/'+dataTSSRMigration[a]._id)
      if(ps !== undefined && ps.data !== undefined && ps.data.data){
        const dataItemTSSR = ps.data.data.packages;

        for(let i = 0; i < dataItemTSSR.length; i++){
          for(let j = 0; j < dataItemTSSR[i].materials.length; j++){
            let dataMatIdx = dataItemTSSR[i].materials[j];
            ws.addRow([dataMatIdx._id, dataItemTSSR[i].no_tssr_boq_site, dataItemTSSR[i].site_id, dataItemTSSR[i].no_plantspec, dataItemTSSR[i].config_id, dataItemTSSR[i].pp_id, dataItemTSSR[i].product_name, dataItemTSSR[i].qty, dataItemTSSR[i].program, dataMatIdx.material_id_plan, dataMatIdx.material_name_plan, dataMatIdx.material_id, dataMatIdx.material_name, dataMatIdx.uom, dataMatIdx.qty, dataItemTSSR[i].product_type, dataMatIdx.material_origin ]);
          }
        }

      }
    }
    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Material TSSR Migration.xlsx');
    this.toggleLoading();
  }

  async getPSListReport(){
    const page = this.state.activePage;
    const maxPage = 20;
    let arrayIDTSSR = [];
    let filter_array = [];
    // (this.state.filter_list["no_plantspec"] !== null && this.state.filter_list["no_plantspec"] !== undefined) && (filter_array.push('"no_plantspec":{"$regex" : "' + this.state.filter_list["no_plantspec"] + '", "$options" : "i"}'));
    // (this.state.filter_list["project_name"] !== null && this.state.filter_list["project_name"] !== undefined) && (filter_array.push('"project_name":{"$regex" : "' + this.state.filter_list["project_name"] + '", "$options" : "i"}'));
    // (this.state.filter_list["tower_id"] !== null && this.state.filter_list["tower_id"] !== undefined) && (filter_array.push('"site_info.site_id":{"$regex" : "' + this.state.filter_list["tower_id"] + '", "$options" : "i"}'));
    // (this.state.filter_list["current_status"] !== null && this.state.filter_list["current_status"] !== undefined) && (filter_array.push('"current_status":{"$regex" : "' + this.state.filter_list["current_status"] + '", "$options" : "i"}'));
    // (this.state.filter_list["submission_status"] !== null && this.state.filter_list["submission_status"] !== undefined) && (filter_array.push('"submission_status":{"$regex" : "' + this.state.filter_list["submission_status"] + '", "$options" : "i"}'));
    // (this.state.filter_list["mr_id"] !== null && this.state.filter_list["mr_id"] !== undefined) && (filter_array.push('"mr_id":{"$regex" : "' + this.state.filter_list["mr_id"] + '", "$options" : "i"}'));
    // filter_array.push('"migration":true')
    let whereAnd = '{' + filter_array.join(',') + '}';
    // noPg=1&
    // srt=_id:-1&
    // + '&lmt=' + maxPage + '&pg=' + page
    let dataMigrationTSSR = await this.getDataFromAPINODE('/plantspec?noPg=1&srt=_id:-1&q=' + whereAnd)
    if(dataMigrationTSSR.data !== undefined){
      arrayIDTSSR = dataMigrationTSSR.data.data;
      return arrayIDTSSR;
    }
  }

  async printExcelListPS(){
    this.toggleLoading();
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTSSRMigration = await this.getPSListReport();

    ws.addRow(["PS Group No.", "Project Name", "Tower ID", "Tower Name", "Region", "Current Status", "Submission Status", "MR Related","Created By"]);

    for(let i = 0; i < dataTSSRMigration.length; i++){
      let CreatedBy = null;
      let dataSite = {};
      if(dataTSSRMigration[i].plantspec_status !== undefined){
        CreatedBy = dataTSSRMigration[i].plantspec_status.find(pst => pst.status_value === "CREATED");
        if(CreatedBy !== undefined){
          CreatedBy = CreatedBy.status_updater;
        }else{
          CreatedBy = null;
        }
      }
      if(dataTSSRMigration[i].site_info !== undefined && dataTSSRMigration[i].site_info.length !== 0){
        dataSite = dataTSSRMigration[i].site_info[0];
      }
      ws.addRow([dataTSSRMigration[i].no_plantspec, dataTSSRMigration[i].project_name, dataSite.site_id, dataSite.site_name, dataSite.region, dataTSSRMigration[i].current_status, dataTSSRMigration[i].submission_status, dataTSSRMigration[i].mr_id, CreatedBy]);
    }
    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'PS List Report.xlsx');
    this.toggleLoading();
  }

  getDataTower(array_tower_id){
    console.log("array_tower_id", array_tower_id)
    let array_tower = '"'+array_tower_id.join('", "')+'"';
    this.getDatafromAPIXL('/tower_site_op?where={"tower_id" :{"$in" : ['+array_tower+']}}&projection={"tower_id":1,"region":1}').then( res => {
      if(res.data !== undefined){
          this.setState({ data_tower : res.data._items })
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

  componentDidMount() {
    this.getTssrList();
    document.title = 'TSSR List | BAM';
  }

  componentWillUnmount(){
    this.props.SidebarMinimizer(false);
  }

  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber}, () => {
      this.getTssrList();
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < arrayFilter.length; i++) {
      searchBar.push(
        <td>
          <div className="controls">
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fa fa-search"></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[arrayFilter[i]]} name={arrayFilter[i]} size="sm" />
            </InputGroup>
          </div>
        </td>
      )
    }
    return searchBar;
  }

  handleFilterList(e) {
    const index = e.target.name;
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    let dataFilter = this.state.filter_list;
    dataFilter[index] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    })
  }

  onChangeDebounced(e) {
    this.getTssrList();
    // this.getAllMR();
  }

  render() {

    const downloadMR = {
      float: 'right',
      marginRight: '10px'
    }

    const tableWidth = {
      width: '150px'
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{lineHeight :'2'}}>
                  <i className="fa fa-align-justify" style={{marginRight: "8px"}}></i> Plant Spec Group List
                </span>
                <Link to={'/ps-bom'}><Button color="success" style={{float : 'right'}} size="sm">Create PS</Button></Link>
                {this.state.userRole.findIndex(e => e === "Admin") !== -1 && (
                  <Button color="success" style={{float : 'right', marginRight : '10px'}} size="sm" onClick={this.printExcel}>Download PS Migration</Button>
                )}
                {this.state.userRole.findIndex(e => e === "Admin") !== -1 && (
                  <Button color="success" style={{float : 'right', marginRight : '10px'}} size="sm" onClick={this.printExcelListPS}>Download PS List</Button>
                )}
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>No PS Group</th>
                      <th>Project</th>
                      <th>Tower ID</th>
                      <th>CD ID</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Submission Status</th>
                      <th>MR Related</th>
                      <th rowSpan="2">Action</th>
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.tssr_list.map((list, i) =>
                      <tr key={list._id}>
                        <td>{list.no_plantspec}</td>
                        <td>{list.project_name}</td>
                        {list.site_info[0] !== undefined ? (
                          <React.Fragment>
                            <td>{list.site_info[0].site_id}</td>
                            <td>{list.site_info !== undefined ? list.site_info.map(si => si.cd_id) : null }</td>
                            <td>{list.site_info[0].region}</td>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <td></td>
                            <td></td>
                            <td></td>
                          </React.Fragment>
                        )}
                        <td>{list.current_status}</td>
                        <td>{list.submission_status}</td>
                        <td>
                          <Link to={'/mr-detail/'+list.id_mr_doc}>
                            {list.mr_id}
                          </Link>
                        </td>
                        <td>
                          <Link to={'/ps-list/'+list._id}>
                            <Button color="info" size="sm" outline>Detail</Button>
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }} className="pagination">
                  <small>Showing {this.state.perPage} entries from {this.state.totalData} data</small>
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
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm ' + this.props.className}>
          <ModalBody>
            <div style={{textAlign : 'center'}}>
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <div style={{textAlign : 'center'}}>
              Loading ...
            </div>
            <div style={{textAlign : 'center'}}>
              System is processing ...
            </div>
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
    dataLogin : state.loginData,
    SidebarMinimize : state.minimizeSidebar
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SidebarMinimizer : (minimize) => dispatch({type : ActionType.MINIMIZE_SIDEBAR, minimize_sidebar : minimize }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TssrList);
