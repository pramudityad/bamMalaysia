import React, { Component, Fragment } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Table, Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse, Input} from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import './boqTechnical.css';
import { saveAs } from 'file-saver';
import Pagination from "react-js-pagination";
import Select from 'react-select';
import {connect} from 'react-redux';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

class TechnicalBoqApproval extends Component {
    constructor(props) {
      super(props);

      this.state = {
        userRole : this.props.dataLogin.role,
        userId : this.props.dataLogin._id,
        userName : this.props.dataLogin.userName,
        userEmail : this.props.dataLogin.email,
        tokenUser : this.props.dataLogin.token,
        action_message : null,
        action_status : null,
        data_tech_boq : null,
        data_tech_boq_sites : [],
        view_tech_header_table : {"config_id" : [], "type" : []},
        rowsXLS : [],
        perPage : 25,
        prevPage : 1,
        activePage : 1,
        collapse: false,
        status : null,
        dropdownOpen: new Array(1).fill(false),
        fieldNoteChange : new Array(8).fill(null),
      };
      this.approvalTechnical = this.approvalTechnical.bind(this);
      this.toggleDropdown = this.toggleDropdown.bind(this);
      this.toggleUpload = this.toggleUpload.bind(this);
      this.onEntering = this.onEntering.bind(this);
      this.onEntered = this.onEntered.bind(this);
      this.onExiting = this.onExiting.bind(this);
      this.onExited = this.onExited.bind(this);
    }

    numberToAlphabet(number){
      const num = Number(number)+1
      if(num > 26){
        let mod = (num%26 + 9).toString(36).toUpperCase();
        return 'Z'+mod;
      }else{
        return (num + 9).toString(36).toUpperCase();
      }
    }

    toggleUpload() {
      this.setState({ collapse: !this.state.collapse });
    }

    toggleDropdown(i) {
      const newArray = this.state.dropdownOpen.map((element, index) => {
        return (index === i ? !element : false);
      });
      this.setState({
        dropdownOpen: newArray,
      });
    }

    onEntering() {
      this.setState({ status: 'Opening...' });
    }

    onEntered() {
      this.setState({ status: 'Opened' });
    }

    onExiting() {
      this.setState({ status: 'Closing...' });
    }

    onExited() {
      this.setState({ status: 'Closed' });
    }

    checkValuetoZero(props){
      //Swap undefined or null to 0
      if( typeof props == 'undefined' || props == null ) {
        return 0;
      }else{
        return props;
      }
    }

    checkValuetoString(props){
      //Swap undefined or null to ""
      if( typeof props == 'undefined' || props == null ) {
        return "";
      }else{
        return props;
      }
    }

    comparerDiffSites(otherArray){
      //Compare Different between 2 array
      return function(current){
        return otherArray.filter(function(other){
          return other.site_id == current.site_id
        }).length == 0;
      }
    }

    isSameValue(element,value){
      //function for FindIndex
      return element === value;
    }

    getIndex(data, value){
      //get index of value in Array
      return data.findIndex(e => this.isSameValue(e,value));
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

    componentDidMount(){
      // this.getAllSites();
      this.getTechBoqData(this.props.match.params.id);
    }

    getTechBoqData(_id_tech){
      this.getDataFromAPINODE('/techBoq/'+_id_tech).then(res => {
        if(res.data !== undefined){
          const dataTech = res.data;
          console.log("res.data", res.data.data);
          this.setState({data_tech_boq : dataTech.data});
          if(res.data.data !== undefined){
            console.log("res.data sites", dataTech.data.techBoqSite);
            this.setState({data_tech_boq_sites : dataTech.data.techBoqSite, list_version : new Array(parseInt(dataTech.data.version)+1).fill("0")}, () => {
              console.log("res.data version", this.state.list_version);
              this.viewTechBoqData(dataTech.data.techBoqSite);
            });
          }
        }
      })
    }

    viewTechBoqData(data_sites){
      if(data_sites.length !== 0){
        const configId = data_sites[0].siteItemConfig.map(e => e.config_id);
        const typeHeader = data_sites[0].siteItemConfig.map(e => "CONFIG");
        this.setState({view_tech_header_table : {"config_id" : configId, "type" : typeHeader }});
      }
    }

    async approvalTechnical(e){
      let currValue = e.currentTarget.value;
      if(currValue !== undefined){
        currValue = parseInt(currValue);
      }
      let patchData = await this.patchDatatoAPINODE('/techBoq/approval/'+this.state.data_tech_boq._id, {"operation":currValue})
      if(patchData.data !== undefined){
        this.setState({action_status : 'success'});
      }else{
        if(patchData.response !== undefined){
          if(patchData.response.data !== undefined){
            this.setState({action_status : 'failed', action_message : patchData.response.data.error })
          }else{
            this.setState({action_status : 'failed'});
          }
        }else{
          this.setState({action_status : 'failed'});
        }
      }
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

    render() {
      return (
        <div>
          <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
          <Row>
            <Col xl="12">
              <Card>
                <CardHeader>
                  <React.Fragment>
                    <span style={{marginTop:'8px', position:'absolute'}}>Detail Technical BOQ</span>
                    <div className="card-header-actions" style={{display:'inline-flex'}}>
                    <Col>
                      <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {this.toggleDropdown(0);}}>
                        <DropdownToggle caret color="secondary">
                          <i className="fa fa-download" aria-hidden="true"> &nbsp; </i>Download Technical File
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header> Technical File</DropdownItem>
                          <DropdownItem > <i className="fa fa-file-text-o" aria-hidden="true"></i> Technical Report</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                    </div>
                  </React.Fragment>
                </CardHeader>
                <CardBody className='card-UploadBoq'>
                  <React.Fragment>
                  {this.state.data_tech_boq !== null && (
                    <React.Fragment>
                    <Row>
                      <Col sm="12" md="12">
                      <table style={{width : '100%', marginBottom : '0px', marginLeft : '10px'}}>
                        <tbody>
                          <tr style={{fontWeight : '425', fontSize : '23px'}}>
                            <td colSpan="2" style={{textAlign : 'center', marginBottom: '10px', fontWeight : '500'}}>TECHNICAL BOQ</td>
                          </tr>
                          <tr style={{fontWeight : '390', fontSize : '15px', fontStyle:'oblique'}}>
                            <td colSpan="2" style={{textAlign : 'center', marginBottom: '10px', fontWeight : '500'}}>Doc : {this.state.data_tech_boq.no_tech_boq}</td>
                          </tr>
                        </tbody>
                      </table>
                      <hr style={{borderStyle : 'double', borderWidth: '0px 0px 3px 0px', borderColor : ' rgba(174,213,129 ,1)', marginTop: '5px'}}></hr>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6" md="6">
                      <div style={{marginLeft : '10px'}}>
                      <table style={{width : '100%', marginBottom : '5px'}} className="table-header">
                        <tbody>
                          <tr style={{fontWeight : '425', fontSize : '15px'}}>
                            <td style={{textAlign : 'left'}}>Version</td>
                            <td style={{textAlign : 'left'}}>:</td>
                            <td style={{textAlign : 'left'}} colspan={2}>{this.state.data_tech_boq.version}</td>
                          </tr>
                          <tr style={{fontWeight : '425', fontSize : '15px'}}>
                            <td style={{textAlign : 'left'}}>Created On &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td style={{textAlign : 'left'}}>:</td>
                            <td style={{textAlign : 'left'}} colspan={2}>{this.state.data_tech_boq.created_on}</td>
                          </tr>
                          <tr style={{fontWeight : '425', fontSize : '15px'}}>
                              <td>&nbsp; </td>
                              <td></td>
                              <td></td>
                              <td style={{paddingLeft:'5px'}}></td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                      </Col>
                      <Col sm="6" md="6">
                      <div style={{marginTop: '3px', marginLeft : '10px'}}>
                      <table style={{width : '100%', marginBottom : '5px'}} className="table-header">
                        <tbody>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                            <td style={{textAlign : 'left'}}>Project </td>
                            <td style={{textAlign : 'left'}}>:</td>
                            <td style={{textAlign : 'left'}} colspan={2}>{this.state.data_tech_boq.project_name}</td>
                          </tr>
                          <tr style={{fontWeight : '425', fontSize : '15px'}}>
                            <td style={{textAlign : 'left'}}>Updated On </td>
                            <td style={{textAlign : 'left'}}>:</td>
                            <td style={{textAlign : 'left'}} colspan={2}>{this.state.data_tech_boq.updated_on}</td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                      </Col>
                    </Row>
                    </React.Fragment>
                    )}
                  <div>
                  </div>
                  </React.Fragment>
                  {/*<div style={{display : 'inline-flex', marginBottom : '5px'}}>
                    <span style={{padding: '4px'}}>Show per Page : </span>
                    <Input className="select-per-page" name="PO" type="select" onChange={this.handleChangeShow} value={this.state.perPage} >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value={this.state.data_item.length}>All</option>
                    </Input>
                  </div> */}
                    <Table hover bordered striped responsive size="sm">
                      <thead>
                        <tr>
                          <th rowSpan="2" style={{verticalAlign : "middle"}}>
                            Tower ID
                          </th>
                          <th rowSpan="2" style={{verticalAlign : "middle"}}>
                            Tower Name
                          </th>
                          {this.state.view_tech_header_table.type.map(type =>
                            <th>{type}</th>
                          )}
                        </tr>
                        <tr>
                          {this.state.view_tech_header_table.config_id.map(conf =>
                            <th>{conf}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.data_tech_boq_sites.map(site =>
                        <tr>
                          <td>{site.site_id}</td>
                          <td>{site.site_name}</td>
                          {site.siteItemConfig.map(conf =>
                            <td>{conf.qty}</td>
                          )}
                        </tr>
                      )}
                      </tbody>
                    </Table>
                    {/*}<nav>
                      <div>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.perPage}
                            totalItemsCount={10}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                      </div>
                    </nav> */}
                </CardBody>
                <CardFooter>
                {this.state.data_tech_boq !== null ?
                this.state.data_tech_boq.approval_status === "REQUEST FOR APPROVAL" ? (
                  <div>
                    <Button color="success" size="sm" value="2" onClick={this.approvalTechnical}>Approve</Button>
                    <Button color="danger" size="sm" style={{marginLeft : '10px'}} value="3" onClick={this.approvalTechnical}>Reject</Button>
                  </div>
                ) : <div></div> : <div></div>}
                </CardFooter>
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

  export default connect(mapStateToProps)(TechnicalBoqApproval);
