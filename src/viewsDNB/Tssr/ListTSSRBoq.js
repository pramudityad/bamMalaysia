import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { Redirect, Route, Switch, Link } from "react-router-dom";
import { Form, FormGroup, Label } from "reactstrap";
import axios from "axios";
import Pagination from "react-js-pagination";
import "./tssrModule.css";
import { connect } from "react-redux";
import debounce from "lodash.debounce";

const Checkbox = ({
  type = "checkbox",
  name,
  checked = false,
  onChange,
  inValue = "",
}) => (
  <input
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    value={inValue}
    className="checkmark-dash"
  />
);

const array_field = [
  "no_tssr_boq",
  "project_name",
  "creator",
  "version",
  "current_status",
];

class ListTSSRBoq extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      list_tech_boq: [],
      modal_delete: false,
      Tech_All: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      filter_list: new Array(8).fill(null),
      filter_createdBy: [],
      activity_list: [],
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
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

  numberToAlphabet(number) {
    const num = Number(number) + 1;
    if (num > 26) {
      let mod = ((num % 26) + 9).toString(36).toUpperCase();
      return "Z" + mod;
    } else {
      return (num + 9).toString(36).toUpperCase();
    }
  }

  getTechBoqList() {
    let filter_array = [];
    for (let i = 0; i < array_field.length; i++) {
      if (
        this.state.filter_list[array_field[i]] !== undefined &&
        this.state.filter_list[array_field[i]] !== null
      ) {
        filter_array.push(
          '"' +
            array_field[i] +
            '":{"$regex" : "' +
            this.state.filter_list[array_field[i]] +
            '", "$options" : "i"}'
        );
      }
    }
    let where = "q={" + filter_array.join(",") + "}";
    this.getDataFromAPINODE(
      "/tssr/getTssr?srt=_id:-1&" +
        where +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({
          list_tech_boq: res.data.data,
          prevPage: this.state.activePage,
          totalData: res.data.totalResults,
        });
      } else {
        this.setState({
          list_tech_boq: [],
          prevPage: this.state.activePage,
          totalData: 0,
        });
      }
    });
  }

  componentDidMount() {
    this.getTechBoqList();
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getTechBoqList();
    });
  }

  handleFilterList(e) {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list;
    dataFilter[index] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    });
  }

  onChangeDebounced(e) {
    this.getTechBoqList();
  }

  compareDate(input) {
    const dateIn = input + " GMT+0000";
    const date = new Date(dateIn);
    const DateNow =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    const NowDate = new Date();
    const now_date =
      NowDate.getFullYear() +
      "/" +
      (NowDate.getMonth() + 1) +
      "/" +
      NowDate.getDate();
    return DateNow;
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < array_field.length; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ width: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                placeholder="Search"
                onChange={this.handleFilterList}
                value={this.state.filter_list[array_field[i]]}
                name={array_field[i]}
                size="sm"
              />
            </InputGroup>
          </div>
        </td>
      );
    }
    return searchBar;
  };

  render() {
    return (
      <div>
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                <React.Fragment>
                  <span style={{ marginTop: "8px" }}>TSSR BOQ List</span>
                </React.Fragment>
              </CardHeader>
              <CardBody className="card-UploadBoq">
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>TSSR No.</th>
                      <th>Project</th>
                      <th>Creator</th>
                      <th>Ver.</th>
                      <th style={{ width: "200px", textAlign: "center" }}>
                        TSSR Status
                      </th>
                      <th>Action</th>
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list_tech_boq.map((boq, i) => (
                      <tr key={boq._id}>
                        <td style={{ verticalAlign: "middle" }}>
                          {boq.no_tssr_boq}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {boq.project_name}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {boq.creator[0].email}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {boq.version}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {boq.current_status}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <Link to={"/list-tssr-boq/detail/" + boq._id}>
                            <Button
                              color="primary"
                              size="sm"
                              style={{ marginRight: "10px" }}
                            >
                              {" "}
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              >
                                &nbsp;
                              </i>{" "}
                              Detail
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <nav>
                  <div>
                    <div style={{ margin: "8px 0px" }} className="pagination">
                      <small>
                        Showing {this.state.perPage} entries from{" "}
                        {this.state.totalData} data
                      </small>
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
                  </div>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(ListTSSRBoq);
