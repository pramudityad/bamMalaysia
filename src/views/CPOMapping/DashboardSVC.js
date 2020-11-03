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
import { all } from "core-js/fn/promise";
import { reduce } from "core-js/fn/array";

const header = [
  "LINE",
  "DESCRIPTION",
  "UNIT PRICE",
  "REGION",
  "NEW LOC ID",
  "NEW SITE NAME",
  "Sum of QTY",
  "Sum of TOTAL PRICE",
  "Sum of 80% of billable QTY",
  "Sum of 80% of billing upon HW COA",
];

const td_value = [
  "e.Line",
  "e.Description",
  "e.Unit_Price",
  "e.Region",
  "e.New_Loc_Id",
  "e.New_Site_Name",
  "e.Qty",
  "e.Total_Price",
];

const dashboard_filter = "25.06.2020_80% billing upon SSO COA_batch_1";

class ReportSVC extends React.Component {
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
    };
  }

  componentDidMount() {
    // console.log("header", header.length);
    // console.log("model_header", header_model.length);
    this.getList();
  }

  getList() {
    getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        const filter_items = items
          .filter((item) => item.Billing_Upon_Sso_80 === dashboard_filter)
          .sort((a, b) => a.Line - b.Line);
        console.log(filter_items.length);
        console.log(filter_items);

        console.log(
          "id",
          items.map((i) => i._id)
        );
        this.setState({ all_data: filter_items }, () =>
          this.PivotTable(filter_items)
        );
      }
    });
  }

  PivotTable = (all_data) => {
    const result = [
      ...all_data
        .reduce((a, b) => {
          const key = b.Region + "-" + b.New_Loc_Id + "-" + b.New_Site_Name;
          const item = a.get(key) || Object.assign({}, b, { Total_Price: 0 });

          item.Total_Price += b.Total_Price;

          return a.set(key, item);
        }, new Map())
        .values(),
    ];
    this.setState({ pivot_data: result });
  };

  render() {
    return (
      <div>
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
                  </tr>
                </thead>
                <tbody>
                  {this.state.all_data !== undefined &&
                    this.state.all_data.map((e, i) => (
                      <React.Fragment key={e._id + "frag"}>
                        <tr key={e._id}>
                          {td_value.map((name, ndex) => (
                            <td>{eval(name)}</td>
                          ))}
                          <td>{(8 * e.Qty) / 10}</td>
                          <td>{(8 * e.Total_Price) / 10}</td>
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
                    <td>
                      {" "}
                      {this.state.all_data !== undefined &&
                        this.state.all_data.reduce((a, { Qty }) => a + Qty, 0)}
                    </td>
                    <td>
                      {" "}
                      {this.state.all_data !== undefined &&
                        this.state.all_data.reduce(
                          (a, { Total_Price }) => a + Total_Price,
                          0
                        )}
                    </td>
                    <td>
                      {" "}
                      {this.state.all_data !== undefined &&
                        this.state.all_data.reduce(
                          (a, { Qty }) => a + Qty * 0.8,
                          0
                        )}
                    </td>
                    <td>
                      {" "}
                      {this.state.all_data !== undefined &&
                        this.state.all_data.reduce(
                          (a, { Total_Price }) => a + Total_Price * 0.8,
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
                  {this.state.pivot_data !== undefined &&
                    this.state.pivot_data.map((u) => (
                      <React.Fragment key={u._id + "frag"}>
                        <tr key={u._id}>
                          <td>{u.Region}</td>
                          <td>{u.New_Loc_Id}</td>
                          <td>{u.New_Site_Name}</td>
                          <td>{(8 * u.Total_Price) / 10}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  <tr style={{ backgroundColor: "#c5f0ed" }}>
                    <td>Grand Total</td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.pivot_data !== undefined &&
                        this.state.pivot_data.reduce(
                          (a, { Total_Price }) => a + Total_Price * 0.8,
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

export default connect(mapStateToProps)(ReportSVC);
