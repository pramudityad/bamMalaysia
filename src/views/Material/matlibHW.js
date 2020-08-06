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

const modul_name = "HW";

class MatNDONRO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(3).fill(false),
      createModal: false,
      rowsXLS: [],
    };
    this.toggle = this.toggle.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
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

  fileHandlerMaterial = (input) => {
    const file = input.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    // console.log("rABS");
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        cellDates: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, devfal: null });
      /* Update state */
      this.ArrayEmptytoNull(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  exportMatStatus = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = [
        "MM_Code",
        "BB_Sub",
        "SoW_Description",
        "UoM",
        "Region",
        "Unit_Price"        
      ]

    ws.addRow(header);

    ws.addRow([
      "MM_Code",
      "BB_Sub",
      "SoW_Description",
      "UoM",
      "Region",
      100
    ]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "Material " + modul_name + " Template.xlsx");
  };

  render() {
    return (
      <div className="animated fadeIn">
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
                            <th>
                              <Button
                                color="ghost-dark"
                                onClick={() => this.requestSort("origin")}
                              >
                                <b>Material Type</b>
                              </Button>
                            </th>
                            <th>
                              <Button
                                color="ghost-dark"
                                onClick={() => this.requestSort("material_id")}
                              >
                                <b>MM Code</b>
                              </Button>
                            </th>
                            <th>
                              <Button
                                color="ghost-dark"
                                onClick={() =>
                                  this.requestSort("material_name")
                                }
                              >
                                <b>MM Description</b>
                              </Button>
                            </th>
                            <th>UoM</th>
                            <th>Price</th>
                            {/* <th></th> */}
                            {/* <th></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {/* {this.state.all_data.map((e) => (
                          <React.Fragment key={e._id + "frag"}>
                            <tr
                              style={{ backgroundColor: "#d3d9e7" }}
                              className="fixbody"
                              key={e._id}
                            >                              
                              <td style={{ textAlign: "center" }}>
                                {e.origin}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {e.material_id}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {e.material_name}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {e.description}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {e.category}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))} */}
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
            {/* <Button
          block
          color="link"
          className="btn-pill"
          onClick={this.exportMatStatus}
          size="sm"
        >
          Download Template
        </Button>{" "} */}
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveMatStockWHBulk}
              style={{height: '30px', width : '100px'}}
            >
              Save
            </Button>{" "}
          </ModalFooter>
        </ModalCreateNew>
      </div>
    );
  }
}

export default MatNDONRO;
