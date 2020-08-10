import React from "react";
import {
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
import { Col, FormGroup, Label, Row, Table, Input } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import * as XLSX from "xlsx";
import ModalCreateNew from "../Component/ModalCreateNew";
import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import { getDatafromAPIMY, postDatatoAPINODE } from "../../helper/asyncFunction";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const modul_name = "ARP";
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";
const MaterialDB = [
  {
    MM_Code: "MM Code",
    BB_Sub: "BB_sub",
    SoW_Description: "SoW Description",
    UoM: "UoM",
    Region: "Region",
    Unit_Price: 100,
    MM_Description: "MM Description",
    Acceptance: "Acceptance",
    Vendor_List: [
      {
        Vendor_Name: "TUMPAT SOLUTIONS",
        Identifier: 0,
      },

      {
        Vendor_Name: "FA FRONTLINERS SDN BHD",
        Identifier: 1,
      },
    ],
  },
  {
    MM_Code: "MM Code1",
    BB_Sub: "BB_sub1",
    SoW_Description: "SoW Description1",
    UoM: "UoM1",
    Region: "Region1",
    Unit_Price: 200,
    MM_Description: "MM Description1",
    Acceptance: "Acceptance1",
    Vendor_List: [
      {
        Vendor_Name: "TUMPAT SOLUTIONS",
        Identifier: 1,
      },

      {
        Vendor_Name: "FA FRONTLINERS SDN BHD",
        Identifier: 0,
      },
    ],
  },
];

class MatARP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: BearerToken,
      dropdownOpen: new Array(3).fill(false),
      createModal: false,
      modal_loading: false,
      action_status: null,
      action_message: null,
      rowsXLS: [],
      vendor_list: [],      
    };
    this.toggle = this.toggle.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
  }

  componentDidMount() {
    this.getVendorList();
    this.getMaterialList();
  }

  getVendorList() {
    getDatafromAPIMY("/vendor_data_non_page?sort=[('Name',-1)]").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        const vendor_data = items.map((a) => a.Name);
        this.setState({ vendor_list: vendor_data });
      }
    });
  }

  getMaterialList() {
    let whereAnd =
      '{ "Material_Type":{"$regex" : "' + modul_name + '", "$options" : "i"}}';
    getDatafromAPIMY(
      "/mm_code_data?where=" +
        whereAnd +
        "&max_results=" +
        this.state.perPage +
        "&page=" +
        this.state.activePage
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        const totalData = res.data._meta.total;
        this.setState({ material_list: items, totalData: totalData });
      }
    });
  }

  exportMatStatus = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = [
      "Material_Type",
      "MM_Code",
      "MM_Description",
      "UoM",
      "Unit_Price",
      "Currency", "Remarks_or_Acceptance", "Vendor_ID", "Vendor_Name", "ZERV_(18)", "ZEXT_(40)",
      "Note",
    ];

    ws.addRow(header);

    ws.addRow([
      modul_name,
      "MM_Code",
      "MM_Description",
      "UoM",
      "Unit_Price",
      "Currency", "Remarks_or_Acceptance", "Vendor_ID", "Vendor_Name", "ZERV_(18)", "ZEXT_(40)",
      "Note"
    ]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "Material " + modul_name + " Template.xlsx");
  };

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  togglecreateModal() {
    this.setState({
      createModal: !this.state.createModal,
    });
  }

  resettogglecreateModal() {
    this.setState({
      rowsXLS: [],
    });
  }

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState({
            rowsXLS: rest.rows,
          });
        }
      });
    }
  };

  saveMatStockWHBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    const res = await postDatatoAPINODE("/mmCode/createMmCode", {
      mm_data: BulkXLSX,
    }, this.state.tokenUser);
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
    } else {
      if (
        res.response !== undefined &&
        res.response.data !== undefined &&
        res.response.data.error !== undefined
      ) {
        if (res.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: res.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: res.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
      this.toggleLoading();
    }
  };

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                <span style={{ marginTop: "8px", position: "absolute" }}>
                  {" "}
                  List MM Data{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                    <div>
                      <Button
                        block
                        color="success"
                        onClick={this.togglecreateModal}
                        size="sm"
                        // id="toggleCollapse1"
                      >
                        <i className="fa fa-plus-square" aria-hidden="true">
                          {" "}
                          &nbsp;{" "}
                        </i>{" "}
                        New
                      </Button>
                    </div>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <Dropdown
                      isOpen={this.state.dropdownOpen[1]}
                      toggle={() => {
                        this.toggle(1);
                      }}
                    >
                      <DropdownToggle block color="warning" size="sm">
                        <i className="fa fa-download" aria-hidden="true">
                          {" "}
                          &nbsp;{" "}
                        </i>{" "}
                        Export
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        <DropdownItem onClick={this.exportMatStatus}>
                          {" "}
                          Material Template
                        </DropdownItem>
                        <DropdownItem onClick={this.downloadAll}>
                          Download All{" "}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          float: "left",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      >
                        <Input
                          type="select"
                          name="select"
                          id="selectLimit"
                          onChange={this.handleChangeLimit}
                        >
                          <option value={"10"}>10</option>
                          <option value={"25"}>25</option>
                          <option value={"50"}>50</option>
                          <option value={"100"}>100</option>
                          <option value={"noPg=1"}>All</option>
                        </Input>
                      </div>
                      <div
                        style={{
                          float: "right",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      >
                        <input
                          className="search-box-material"
                          type="text"
                          name="filter"
                          placeholder="Search Material"
                          onChange={this.handleChangeFilter}
                          value={this.state.filter_list}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="divtable">
                      <Table responsive bordered size="sm">
                        <thead
                        // style={{ backgroundColor: "#73818f" }}
                        // className="fixed-matlib"
                        >
                          <tr align="center">
                            <th>MM_Code</th>
                            <th>MM_Description</th>
                            <th>UoM</th>
                            <th>Unit_Price</th>
                            <th>Currency</th>
                            <th>Remarks_or_Acceptance</th>
                            <th>Vendor_ID</th>
                            <th>Vendor_Name</th>
                            <th>ZERV_(18)</th>
                            <th>ZEXT_(40)</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.material_list !== undefined && this.state.material_list !== null && this.state.material_list.map((e) => (
                            <React.Fragment key={e._id + "frag"}>
                              <tr
                                style={{ backgroundColor: "#d3d9e7" }}
                                className="fixbody"
                                key={e._id}
                              >
                            <td style={{ textAlign: "center" }}>{e.MM_Code}</td>
                            <td style={{ textAlign: "center" }}>{e.MM_Description}</td>
                            <td style={{ textAlign: "center" }}>{e.UoM}</td>
                            <td style={{ textAlign: "center" }}>{e.Unit_Price}</td>
                            <td style={{ textAlign: "center" }}>{e.Currency}</td>
                            <td style={{ textAlign: "center" }}>{e.Remarks_or_Acceptance}</td>
                            <td style={{ textAlign: "center" }}>{e.Vendor_ID}</td>
                            <td style={{ textAlign: "center" }}>{e.Vendor_Name}</td>
                            <td style={{ textAlign: "center" }}>{e["ZERV_(18)"]}</td>
                            <td style={{ textAlign: "center" }}>{e["ZEXT_(40)"]}</td>
                            <td style={{ textAlign: "center" }}>{e.Note}</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total_dataParent}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal create New */}
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
          title={"Create " + modul_name}
        >
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Upload File</td>
                  <td>:</td>
                  <td>
                    <input
                      type="file"
                      onChange={this.fileHandlerMaterial.bind(this)}
                      style={{ padding: "10px", visiblity: "hidden" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ModalFooter>
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveMatStockWHBulk}
              style={{ height: "30px", width: "100px" }}
            >
              Save
            </Button>{" "}
          </ModalFooter>
        </ModalCreateNew>

        {/* Modal Loading */}
        <Loading
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}
        ></Loading>
        {/* end Modal Loading */}
      </div>
    );
  }
}

export default MatARP;