import React from "react";
import {
  Col,
  FormGroup,
  Label,
  Row,
  Table,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
} from "reactstrap";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
} from "../../helper/asyncFunction";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import { numToSSColumn } from "../../helper/basicFunction";
import { connect } from "react-redux";
import Select from "react-select";

const header = [
  "LINE",
  "DESCRIPTION",
  "PREMR NO.",
  "UNIT PRICE",
  "REGION",
  "NEW LOC ID",
  "NEW SITE NAME",
  "Sum of QTY",
  "Sum of TOTAL PRICE",
];

const td_value = [
  "e.Line",
  "e.Description",
  "e.Premr_No",
  "e.Unit_Price",
  "e.Region",
  "e.New_Loc_Id",
  "e.New_Site_Name",
  "e.Qty",
  "e.Total_Price",
];

class ReportHW extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      pivot_data: [],
      createModal: false,
      rowsXLS: [],
      modal_loading: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      multiply: 0,
      po_list: [],
      dashboard_filter: {
        po_select: "",
        billing_select: "",
        billvalue_select: "",
      },
      billing_list: [],
      billvalue_list: [],
      pivot_data1: [],
      pivot_data2: [],
      header_name: "",
    };
  }

  componentDidMount() {
    // console.log("header", header.length);
    // console.log("model_header", header_model.length);
    this.getList();
  }

  getList() {
    getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ all_data: items }, () => this.loadPOlist(items));
      }
    });
  }
  PivotTable1 = (all_data) => {
    let dashboard_filter = this.state.dashboard_filter;
    let billing_select = "item." + dashboard_filter["billing_select"];
    const filter_items = all_data
      .filter(
        (item) =>
          item.Po === dashboard_filter["po_select"] &&
          eval(billing_select) === dashboard_filter["billvalue_select"]
      )
      .sort((a, b) => a.Line - b.Line);
    this.setState({ pivot_data1: filter_items }, () =>
      this.PivotTable2(filter_items)
    );
  };

  PivotTable2 = (filter_items) => {
    const result = [
      ...filter_items
        .reduce((a, b) => {
          const key = b.Region + "-" + b.New_Loc_Id + "-" + b.New_Site_Name;
          const item = a.get(key) || Object.assign({}, b, { Total_Price: 0 });

          item.Total_Price += b.Total_Price;

          return a.set(key, item);
        }, new Map())
        .values(),
    ];
    this.setState({ pivot_data2: result });
  };

  loadPOlist = (items) => {
    let po_options = [];
    const po_list = [...new Set(items.map((item) => item.Po))];
    po_list.map((po) => po_options.push({ label: po, value: po }));
    this.setState({ po_list: po_options });
  };

  hanldeChangePO = (e) => {
    let dashboard_filter = this.state.dashboard_filter;
    dashboard_filter["po_select"] = e.value;
    this.setState({ dashboard_filter: dashboard_filter }, () =>
      this.loadBilling()
    );
  };

  loadBilling = () => {
    let billing_options = [
      {
        label: "100% BILLING UPON HW COA",
        value: "Billing_Upon_Hw_Coa_100",
        multiply: 1,
      },
      {
        label: "20% BILLING UPON SSO",
        value: "Billing_Upon_Hw_Coa_40",
        multiply: 0.2,
      },
      {
        label: "80% BILLING UPON HW COA",
        value: "Billing_Upon_Hw_Coa_80",
        multiply: 0.8,
      },
      {
        label: "20% BILLING UPON NI",
        value: "Billing_Upon_Ni_20",
        multiply: 0.2,
      },
      {
        label: "40% BILLING UPON COA NI",
        value: "Billing_Upon_Ni_40",
        multiply: 0.4,
      },
      {
        label: "20% BILLING UPON SSO",
        value: "Billing_Upon_Sso_20",
        multiply: 0.2,
      },
      {
        label: "20% BILLING UPON SSO_1",
        value: "Billing_Upon_Sso_20_1",
        multiply: 0.2,
      },
    ];
    this.setState({ billing_list: billing_options });
  };

  hanldeChangeBilling = (e) => {
    let dashboard_filter = this.state.dashboard_filter;
    let multiply = e.multiply;
    let header_name = e.label;
    dashboard_filter["billing_select"] = e.value;
    this.setState(
      {
        dashboard_filter: dashboard_filter,
        multiply: multiply,
        header_name: header_name,
      },
      () => this.loadBillingValue(this.state.all_data)
    );
  };

  loadBillingValue = (items) => {
    let billvalue_options = [];
    let dashboard_filter = this.state.dashboard_filter;
    let billing_select = "item." + dashboard_filter["billing_select"];
    const billvalue_list = [
      ...new Set(items.map((item) => eval(billing_select))),
    ];
    billvalue_list.map((bill) =>
      billvalue_options.push({ label: bill, value: bill })
    );
    billvalue_options.filter((val) => val.label !== null);
    console.log(billvalue_options);
    this.setState({ billvalue_list: billvalue_options });
  };

  hanldeChangeBillingValue = (e) => {
    let dashboard_filter = this.state.dashboard_filter;
    dashboard_filter["billvalue_select"] = e.value;
    this.setState({ dashboard_filter: dashboard_filter }, () =>
      this.PivotTable1(this.state.all_data)
    );
  };

  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>PO</Label>
              <Select
                options={this.state.po_list}
                onChange={this.hanldeChangePO}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Select
                options={this.state.billing_list}
                onChange={this.hanldeChangeBilling}
              />{" "}
              <Select
                options={this.state.billvalue_list}
                onChange={this.hanldeChangeBillingValue}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <Table hover bordered responsive size="sm">
                <thead
                // style={{ backgroundColor: "#73818f" }}
                // className="fixed-matlib"
                >
                  <tr align="center">
                    {header.map((head) => (
                      <th>{head}</th>
                    ))}
                    <th>Sum of {this.state.multiply * 100}% of billable QTY</th>
                    <th>{this.state.header_name}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pivot_data1 !== undefined &&
                    this.state.pivot_data1.map((e, i) => (
                      <React.Fragment key={e._id + "frag"}>
                        <tr key={e._id}>
                          {td_value.map((name, ndex) => (
                            <td>{eval(name)}</td>
                          ))}
                          <td>{e.Qty * this.state.multiply}</td>
                          <td>{e.Total_Price * this.state.multiply}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  <tr style={{ backgroundColor: "#c5f0ed" }}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {" "}
                      {this.state.pivot_data1 !== undefined &&
                        this.state.pivot_data1.reduce(
                          (a, { Qty }) => a + Qty,
                          0
                        )}
                    </td>
                    <td>
                      {" "}
                      {this.state.pivot_data1 !== undefined &&
                        this.state.pivot_data1.reduce(
                          (a, { Total_Price }) => a + Total_Price,
                          0
                        )}
                    </td>
                    <td>
                      {" "}
                      {this.state.pivot_data1 !== undefined &&
                        this.state.pivot_data1.reduce(
                          (a, { Qty }) => a + Qty * this.state.multiply,
                          0
                        )}
                    </td>
                    <td>
                      {" "}
                      {this.state.pivot_data1 !== undefined &&
                        this.state.pivot_data1.reduce(
                          (a, { Total_Price }) =>
                            a + Total_Price * this.state.multiply,
                          0
                        )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div>
              <Table>
                <thead>
                  <tr>
                    <th>Sum Region</th>
                    <th>NEW LOC ID</th>
                    <th>NEW SITE NAME</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pivot_data2 !== undefined &&
                    this.state.pivot_data2.map((u) => (
                      <React.Fragment key={u._id + "frag"}>
                        <tr key={u._id}>
                          <td>{u.Region}</td>
                          <td>{u.New_Loc_Id}</td>
                          <td>{u.New_Site_Name}</td>
                          <td>{u.Total_Price * this.state.multiply}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  <tr style={{ backgroundColor: "#c5f0ed" }}>
                    <td>Grand Total</td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.pivot_data2 !== undefined &&
                        this.state.pivot_data2.reduce(
                          (a, { Total_Price }) =>
                            a + Total_Price * this.state.multiply,
                          0
                        )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
    SidebarMinimize: state.minimizeSidebar,
  };
};

export default connect(mapStateToProps)(ReportHW);
