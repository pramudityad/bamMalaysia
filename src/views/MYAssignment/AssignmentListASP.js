import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';

const API_URL_tsel = 'https://api-dev.tsel.pdb.e-dpm.com/tselpdbapi';
const username_tsel = 'adminbamidsuper';
const password_tsel = 'F760qbAg2sml';

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

class AssignmentListASP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      assignment_list: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      filter_list: new Array(8).fill(""),
    }
    this.handlePageChange = this.handlePageChange.bind(this);
    this.getAssignmentList = this.getAssignmentList.bind(this);
    this.downloadASGList = this.downloadASGList.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.getAssignmentList = this.getAssignmentList.bind(this);
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

  async getDataFromAPI(url) {
    try {
      let respond = await axios.get(API_URL_tsel + url, {
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: username_tsel,
          password: password_tsel
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

  getAssignmentList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list[0] !== "" && (filter_array.push('"Assignment_No":{"$regex" : "' + this.state.filter_list[0] + '", "$options" : "i"}'));
    this.state.filter_list[1] !== "" && (filter_array.push('"Account_Name":{"$regex" : "' + this.state.filter_list[1] + '", "$options" : "i"}'));
    this.state.filter_list[2] !== "" && (filter_array.push('"Project":{"$regex" : "' + this.state.filter_list[2] + '", "$options" : "i"}'));
    this.state.filter_list[3] !== "" && (filter_array.push('"Vendor_Name":{"$regex" : "' + this.state.filter_list[3] + '", "$options" : "i"}'));
    this.state.filter_list[4] !== "" && (filter_array.push('"Payment_Terms":{"$regex" : "' + this.state.filter_list[4] + '", "$options" : "i"}'));
    this.state.filter_list[5] !== "" && (filter_array.push('"Current_Status":{"$regex" : "' + this.state.filter_list[5] + '", "$options" : "i"}'));
    this.state.filter_list[6] !== "" && (filter_array.push('"Work_Status":{"$regex" : "' + this.state.filter_list[6] + '", "$options" : "i"}'));
    let whereAnd = '{' + filter_array.join(',') + '}';
    this.getDataFromAPINODE('/aspAssignment/aspassign?q=' + whereAnd + '&lmt=' + maxPage + '&pg=' + page).then(res => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ assignment_list: items, totalData: totalData });
      }
    })
  }

  componentDidMount() {
    this.getAssignmentList();
    document.title = 'Assignment List | BAM';
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getAssignmentList();
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
    this.getAssignmentList();
  }

  async downloadASGList() {
    let listASGAll = [];
    let getASG = await this.getDataFromAPI('/asp_assignment_sorted_non_page');
    if (getASG.data !== undefined) {
      listASGAll = getASG.data._items;
    }
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let headerRow = ["Assignment ID", "Account Name", " Project Name", " SOW Type", " NW  NW Activity Terms of Payment", " Item Status Work Status"];
    ws.addRow(headerRow);

    for (let i = 0; i < listASGAll.length; i++) {
      let list = listASGAll[i];
      ws.addRow([list.Assignment_No, list.Account_Name, list.Project, list.SOW_Type, list.NW, list.NW_Activity, list.Payment_Terms, list.Item_Status, list.Work_Status])
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Assignment List.xlsx');
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 7; i++) {
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
    const downloadAssignment = {
      float: 'right',
      marginRight: '10px'
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: '2' }}>
                  <i className="fa fa-align-justify" style={{ marginRight: "8px" }}></i> Assignment List
                </span>
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{ verticalAlign: "middle" }}>Action</th>
                      <th>Assignment ID</th>
                      <th>Account Name</th>
                      <th>Project Name</th>
                      <th>Vendor Name Type</th>
                      <th>Terms of Payment</th>
                      <th>Assignment Status</th>
                      <th>Work Status</th>
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.assignment_list.length === 0 && (
                      <tr>
                        <td colSpan="10">No Data Available</td>
                      </tr>
                    )}
                    {this.state.assignment_list.map((list, i) =>
                      <tr key={list._id}>
                        <td>
                          <Link to={'/assignment-detail-asp/' + list._id}>
                            <Button style={{ width: "90px" }} outline color="info" size="sm">Detail</Button>
                          </Link>
                        </td>
                        <td>{list.Assignment_No}</td>
                        <td>{list.Account_Name}</td>
                        <td>{list.Project}</td>
                        <td>{list.Vendor_Name}</td>
                        <td>{list.Payment_Terms}</td>
                        <td>{list.Current_Status}</td>
                        <td>{list.Work_Status}</td>
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
    SidebarMinimize: state.minimizeSidebar
  }
}

export default connect(mapStateToProps)(AssignmentListASP);
