import React, { Component, Fragment } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Table, Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse, Input} from 'reactstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import ReactExport from "react-data-export";
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import './boqTechnical.css';
import Excel from 'exceljs/modern.browser';
import { saveAs } from 'file-saver';
import Pagination from "react-js-pagination";
import Select from 'react-select';

class TechnicalBoqUploader extends Component {
    constructor(props) {
      super(props);

      this.state = {
        userRole : JSON.parse(localStorage.getItem('user_Roles')),
        rowsXLS : [],
        perPage : 25,
        prevPage : 1,
        activePage : 1,
        collapse: false,
        status : null,
        dropdownOpen: new Array(1).fill(false),
        fieldNoteChange : new Array(8).fill(null),
      };
      this.toggleDropdown = this.toggleDropdown.bind(this);
      this.toggleUpload = this.toggleUpload.bind(this);
      this.onEntering = this.onEntering.bind(this);
      this.onEntered = this.onEntered.bind(this);
      this.onExiting = this.onExiting.bind(this);
      this.onExited = this.onExited.bind(this);
      this.handlePageChange = this.handlePageChange.bind(this);
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

    componentDidMount(){

    }


    fileHandlerTechnical = (event) => {
      let fileObj = event.target.files[0];
      const date = new Date();
      const DateNow = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
      if(fileObj !== undefined){
        ExcelRenderer(fileObj, (err, rest) => {
          if(err){
            console.log(err);
          }
          else{
            this.ArrayEmptytoNull(rest.rows, DateNow);
          }
        });
      }
    }

    ArrayEmptytoNull(dataXLS, DateNow){
      let newDataXLS = [];
      for(let i = 0; i < dataXLS.length; i++){
        let col = [];
        for(let j = 0; j < dataXLS[1].length; j++){
          col.push(this.checkValue(dataXLS[i][j]));
        }
        newDataXLS.push(col);
      }
      this.setState({
        rowsXLS: newDataXLS
      });
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
                  <Row>
                    <Col sm="12" md="12">
                    <table style={{width : '100%', marginBottom : '0px', marginLeft : '10px'}}>
                      <tbody>
                        <tr style={{fontWeight : '425', fontSize : '23px'}}>
                          <td colSpan="2" style={{textAlign : 'center', marginBottom: '10px', fontWeight : '500'}}>TECHNICAL BOQ</td>
                        </tr>
                        <tr style={{fontWeight : '390', fontSize : '15px', fontStyle:'oblique'}}>
                          <td colSpan="2" style={{textAlign : 'center', marginBottom: '10px', fontWeight : '500'}}>Doc : TECH-200120-0001</td>
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
                          <td style={{textAlign : 'left'}} colspan={2}>0</td>
                        </tr>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                          <td style={{textAlign : 'left'}}>Created by</td>
                          <td style={{textAlign : 'left'}}>:</td>
                          <td style={{textAlign : 'left'}} colspan={2}>bamid@bam.com</td>
                        </tr>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                          <td style={{textAlign : 'left'}}>Created Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td style={{textAlign : 'left'}}>:</td>
                          <td style={{textAlign : 'left'}} colspan={2}>2019-01-23 </td>
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
                          <td style={{textAlign : 'left'}} colspan={2}>LTE 2020</td>
                        </tr>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                          <td style={{textAlign : 'left'}}>Updated By </td>
                          <td style={{textAlign : 'left'}}>:</td>
                          <td style={{textAlign : 'left'}} colspan={2}>{this.state.API_Tech.updated_by.email}</td>
                        </tr>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                          <td style={{textAlign : 'left'}}>Updated On </td>
                          <td style={{textAlign : 'left'}}>:</td>
                          <td style={{textAlign : 'left'}} colspan={2}>{toTimeZone(this.state.API_Tech.updated_on)}</td>
                        </tr>
                        <tr style={{fontWeight : '425', fontSize : '15px'}}>
                          <td style={{textAlign : 'left'}}>Approved By</td>
                          <td style={{textAlign : 'left'}}>:</td>
                          <td style={{textAlign : 'left'}} colspan={2}> {this.state.API_Tech.rev === "PA "? "Pre Approved" : this.state.API_Tech.rev === "WA" ? "Waiting Approve" : this.state.API_Tech.rev_by !== null ? this.state.API_Tech.rev_by : "Pre Approved" }</td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                    </Col>
                  </Row>
                  <div>
                  </div>
                  </React.Fragment>
                    <div style={{display : 'inline-flex', marginBottom : '5px'}}>
                      <span style={{padding: '4px'}}>Show per Page : </span>
                      <Input className="select-per-page" name="PO" type="select" value={this.state.perPage} >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value={this.state.data_item.length}>All</option>
                      </Input>
                    </div>
                    <Table hover bordered striped responsive size="sm">
                      <thead>
                        <tr style={{backgroundColor : "#c6f569", fontWeight : "500"}}>
                            <th rowSpan="2">Site ID</th>
                            <th rowSpan="2">Site Name</th>
                            <th>HW</th>
                            <th>HW</th>
                            <th>HW</th>
                            <th>HW</th>
                            <th>SVC</th>
                            <th>SVC</th>
                        </tr>
                        <tr style={{backgroundColor: '#f8f6df'}}>
                          <th>pptest1</th>
                          <th>pptest2</th>
                          <th>pptest3</th>
                          <th>pptest4</th>
                          <th>pptest5</th>
                          <th>pptest6</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>FJ01</td>
                          <td>FJ Name 01</td>
                          <td>1</td>
                          <td>2</td>
                          <td>1</td>
                          <td>4</td>
                          <td>5</td>
                          <td>1</td>
                        </tr>
                        <tr>
                          <td>FJ02</td>
                          <td>FJ Name 02</td>
                          <td>2</td>
                          <td>2</td>
                          <td>1</td>
                          <td>4</td>
                          <td>5</td>
                          <td>4</td>
                        </tr>
                        <tr>
                          <td>FJ03</td>
                          <td>FJ Name 03</td>
                          <td>5</td>
                          <td>3</td>
                          <td>1</td>
                          <td>1</td>
                          <td>5</td>
                          <td>1</td>
                        </tr>
                      </tbody>
                    </Table>
                    <nav>
                      <div>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.perPage}
                            totalItemsCount={10}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                      </div>
                    </nav>
                  </React.Fragment>
                </CardBody>
                <CardFooter>
                  <div></div>
                </CardFooter>
              </Card>
            </Col>
          </Row>

        </div>
      );
    }
  }

  export default TechnicalBoqUploader;
