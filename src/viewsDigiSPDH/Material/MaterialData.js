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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { Col, FormGroup, Label, Row, Table, Input } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import * as XLSX from "xlsx";
import ModalCreateNew from "../Component/ModalCreateNew";
import ModalDelete from "../Component/ModalDelete";
import { connect } from "react-redux";

import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import {
  getDatafromAPIMY,
  getDatafromAPINODE,
  postDatatoAPINODE,
  deleteDataFromAPINODE2,
  patchDatatoAPINODE,
} from "../../helper/asyncFunctionDigiSPDH";
import { numToSSColumn } from "../../helper/basicFunction";
import '../MYAssignment/LMRMY.css';

const DefaultNotif = React.lazy(() =>
  import("../DefaultView/DefaultNotif")
);

const module_name = "NDO";

const header_model = [
  "BB",
  "BB_Sub",
  "SoW_Description_or_Site_Type",
  "Sla",
  "UoM",
  "Unit_Price",
  "Region",
  "MM_Code",
  "MM_Description",
  "Vendor_ID",
  "Vendor_Name",
  "Remarks",
];

class MaterialData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      dropdownOpen: new Array(3).fill(false),
      createModal: false,
      modal_loading: false,
      action_status: null,
      action_message: null,
      rowsXLS: [],
      vendor_list: [],
      PPForm: new Array(11).fill(""),
      danger: false,
      selected_id: "",
      selected_name: "",
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      modalEdit: false,
      material_list: [],
      material_list_all: [],
      filter_list: {},
    };
    this.toggle = this.toggle.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
  }

  componentDidMount() {
    this.getVendorList();
    this.getMaterialList();
    this.getMaterialListAll();
  }

  getVendorList() {
    getDatafromAPIMY("/vendor_data_non_page?sort=[('Name',-1)]").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ vendor_list: items });
      }
    });
  }

  getMaterialListAll() {
    getDatafromAPINODE('/mmCode/getMm?srt=_id:1&q={"Material_Type": "' + module_name + '"}' + "&noPg=1", this.state.tokenUser).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ material_list_all: items });
      }
    });
  }

  getMaterialList() {
    let filter_array = [];
    filter_array.push(
      '"Material_Type":{"$regex" : "' + module_name + '", "$options" : "i"}'
    );
    this.state.filter_list["BB"] !== null &&
      this.state.filter_list["BB"] !== undefined &&
      filter_array.push(
        '"BB":{"$regex" : "' +
        this.state.filter_list["BB"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["BB_Sub"] !== null &&
      this.state.filter_list["BB_Sub"] !== undefined &&
      filter_array.push(
        '"BB_Sub":{"$regex" : "' +
        this.state.filter_list["BB_Sub"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["SoW_Description_or_Site_Type"] !== null &&
      this.state.filter_list["SoW_Description_or_Site_Type"] !== undefined &&
      filter_array.push(
        '"SoW_Description_or_Site_Type":{"$regex" : "' +
        this.state.filter_list["SoW_Description_or_Site_Type"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["sla"] !== null &&
      this.state.filter_list["sla"] !== undefined &&
      filter_array.push(
        '"sla":{"$regex" : "' +
        this.state.filter_list["sla"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["UoM"] !== null &&
      this.state.filter_list["UoM"] !== undefined &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list["UoM"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Unit_Price"] !== null &&
      this.state.filter_list["Unit_Price"] !== undefined &&
      filter_array.push(
        '"Unit_Price":{"$regex" : "' +
        this.state.filter_list["Unit_Price"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Region"] !== null &&
      this.state.filter_list["Region"] !== undefined &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.filter_list["Region"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["MM_Code"] !== null &&
      this.state.filter_list["MM_Code"] !== undefined &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list["MM_Code"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["MM_Description"] !== null &&
      this.state.filter_list["MM_Description"] !== undefined &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list["MM_Description"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Vendor_ID"] !== null &&
      this.state.filter_list["Vendor_ID"] !== undefined &&
      filter_array.push(
        '"Vendor_ID":{"$regex" : "' +
        this.state.filter_list["Vendor_ID"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Vendor_Name"] !== null &&
      this.state.filter_list["Vendor_Name"] !== undefined &&
      filter_array.push(
        '"Vendor_Name":{"$regex" : "' +
        this.state.filter_list["Vendor_Name"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Remarks"] !== null &&
      this.state.filter_list["Remarks"] !== undefined &&
      filter_array.push(
        '"Remarks":{"$regex" : "' +
        this.state.filter_list["Remarks"] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";

    getDatafromAPINODE(
      "/mmCode/getMm?srt=_id:1&q=" +
      whereAnd +
      "&lmt=" +
      this.state.perPage +
      "&pg=" +
      this.state.activePage,
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState(
          {
            material_list: items,
            totalData: totalData
          },
          () => console.log(items.map((e) => e.SLA))
        );
      }
    });
  }

  exportMatStatus = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = [
      "Material_Type",
      "Material_Sub_Type",
      "BB",
      "BB_Sub",
      "SoW_Description_or_Site_Type",
      "SLA",
      "UoM",
      "Unit_Price",
      "Region",
      "MM_Code",
      "MM_Description",
      "Vendor_ID",
      "Vendor_Name",
      "Remarks",
    ];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
      ws.getCell(numToSSColumn(i) + "1").font = {
        bold: true
      };
    }

    ws.addRow([module_name, module_name]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "Material " + module_name + " Template.xlsx");
  };

  downloadAll = async () => {
    let download_all = [];
    let getAll_nonpage = this.state.material_list_all;

    if (getAll_nonpage !== undefined) {
      download_all = getAll_nonpage;
    }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let headerRow = [
      "Material_Type",
      "Material_Sub_Type",
      "BB",
      "BB_Sub",
      "SoW_Description_or_Site_Type",
      "SLA",
      "UoM",
      "Unit_Price",
      "Region",
      "MM_Code",
      "MM_Description",
      "Vendor_ID",
      "Vendor_Name",
      "Remarks",
    ];
    ws.addRow(headerRow);
    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
      ws.getCell(numToSSColumn(i) + "1").font = {
        bold: true
      };
    }

    for (let i = 0; i < download_all.length; i++) {
      let e = download_all[i];
      ws.addRow([
        e.Material_Type,
        e.Material_Sub_Type,
        e.BB,
        e.BB_Sub,
        e.SoW_Description_or_Site_Type,
        e.SLA,
        e.UoM,
        e.Unit_Price,
        e.Region,
        e.MM_Code,
        e.MM_Description,
        e.Vendor_ID,
        e.Vendor_Name,
        e.Remarks,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All " + module_name + " Materials.xlsx");
  }

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
          console.log("rest.rows", rest.rows);
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
    const res = await postDatatoAPINODE(
      "/mmCode/createMmCode",
      {
        mm_data: BulkXLSX,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success", action_message: "Materials have been uploaded!" });
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

  saveNew = async () => {
    this.togglePPForm();
    this.toggleLoading();
    let dataForm = [
      [
        "Material_Type",
        "Material_Sub_Type",
        "MM_Code",
        "BB",
        "BB_Sub",
        "MM_Description",
        "UoM",
        "Unit_Price",
        "Region",
        "SLA",
        "SoW_Description_or_Site_Type",
        "Vendor_ID",
        "Vendor_Name",
        "Note",
      ],
      [
        module_name,
        module_name,
        this.state.PPForm[7],
        this.state.PPForm[2],
        this.state.PPForm[3],
        this.state.PPForm[4],
        this.state.PPForm[5],
        this.state.PPForm[6],
        this.state.PPForm[8],
        this.state.PPForm[9],
        this.state.PPForm[10],
        this.state.PPForm[11],
        this.findVendorName(this.state.PPForm[11]),
        this.state.PPForm[12],
      ],
    ];
    const res = await postDatatoAPINODE(
      "/mmCode/createMmCode",
      {
        mm_data: dataForm,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.toggleLoading();
      this.setState({ action_status: "success", action_message: "Material has been created, please check in Material List!" });
    } else {
      if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
        if (res.response.data.error.message !== undefined) {
          this.toggleLoading();
          this.setState({
            action_status: "failed",
            action_message: res.response.data.error.message,
          });
        } else {
          this.toggleLoading();
          this.setState({
            action_status: "failed",
            action_message: res.response.data.error,
          });
        }
      } else {
        this.toggleLoading();
        this.setState({ action_status: "failed" });
      }
    }
  };

  handleChangeForm = (e) => {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.PPForm;
    dataForm[parseInt(index)] = value;
    this.setState({ PPForm: dataForm }, () => console.log(this.state.PPForm));
  };

  togglePPForm = () => {
    this.setState((prevState) => ({
      modalPPForm: !prevState.modalPPForm,
    }));
  };

  findVendorName = (vendor_id) => {
    let vendordata = this.state.vendor_list.find(
      (element) => element.Vendor_Code === vendor_id
    );
    if (vendordata !== undefined) {
      return vendordata.Name;
    } else {
      return null;
    }
  };

  toggleDelete = (e) => {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      const name = this.state.material_list_all.find((e) => e._id === _id);
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
        selected_name: name.MM_Code,
        selected_vendor: name.Vendor_ID,
      });
    } else {
      this.setState({
        danger: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  };

  DeleteData = async () => {
    const objData = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    const DelData = deleteDataFromAPINODE2(
      "/mmCode/deleteMmCode",
      this.state.tokenUser,
      { data: [objData] }
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber }, () => {
      this.getMaterialList();
    });
  };

  toggleEdit = (e) => {
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.material_list.find((e) => e._id === value);
      let dataForm = this.state.PPForm;

      dataForm[2] = aEdit.BB;
      dataForm[3] = aEdit.BB_Sub;
      dataForm[4] = aEdit.MM_Description;
      dataForm[5] = aEdit.UoM;
      dataForm[6] = aEdit.Unit_Price;
      dataForm[7] = aEdit.MM_Code;
      dataForm[8] = aEdit.Region;
      dataForm[9] = aEdit.SLA;
      dataForm[10] = aEdit.SoW_Description_or_Site_Type;
      dataForm[11] = aEdit.Vendor_ID;
      dataForm[12] = aEdit.Note;
      this.setState({ PPForm: dataForm, selected_id: value });
    } else {
      this.setState({ PPForm: new Array(11).fill("") });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  saveUpdate = async () => {
    this.toggleEdit();
    this.toggleLoading();
    let dataForm = {
      _id: this.state.selected_id,
      BB: this.state.PPForm[2],
      BB_Sub: this.state.PPForm[3],
      MM_Description: this.state.PPForm[4],
      UoM: this.state.PPForm[5],
      Unit_Price: this.state.PPForm[6],
      MM_Code: this.state.PPForm[7],
      Region: this.state.PPForm[8],
      SLA: this.state.PPForm[9],
      SoW_Description_or_Site_Type: this.state.PPForm[10],
      Vendor_ID: this.state.PPForm[11],
      Vendor_Name: this.findVendorName(this.state.PPForm[11]),
      Note: this.state.PPForm[12],
    };
    const res = await patchDatatoAPINODE(
      "/mmCode/updateMmCode",
      {
        data: [dataForm],
      },
      this.state.tokenUser
    );
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

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 12; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                // className="col-sm-3"
                type="text"
                placeholder="Search"
                onChange={this.handleFilterList}
                value={this.state.filter_list[header_model[i]]}
                name={header_model[i]}
                size="sm"
              />
            </InputGroup>
          </div>
        </td>
      );
    }
    return searchBar;
  };

  handleFilterList = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    let dataFilter = this.state.filter_list;
    dataFilter[index] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    });
  };

  onChangeDebounced(e) {
    this.getMaterialList();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
          redirect={this.state.redirect}
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
                      <Dropdown
                        isOpen={this.state.dropdownOpen[2]}
                        toggle={() => {
                          this.toggle(2);
                        }}
                      >
                        <DropdownToggle block color="success" size="sm">
                          <i className="fa fa-plus-square" aria-hidden="true">
                            {" "}
                            &nbsp;{" "}
                          </i>{" "}
                          New
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.togglecreateModal}>
                            {" "}
                            Bulk
                          </DropdownItem>
                          <DropdownItem onClick={this.togglePPForm}>
                            Form{" "}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
                      <DropdownToggle block color="warning" size="sm"><i className="fa fa-download" aria-hidden="true" style={{ marginRight: 4 }}></i>Export</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        <DropdownItem onClick={this.exportMatStatus}>Material Template</DropdownItem>
                        <DropdownItem onClick={this.downloadAll}>Download All</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <Row>
                  {/* <Col>
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
                  </Col> */}
                </Row>
                <Row>
                  <Col>
                    <Table striped hover bordered responsive size="sm">
                      <thead>
                        <tr align="center">
                          <th>BB</th>
                          <th>BB_Sub</th>
                          <th>SoW_Description_or_Site_Type</th>
                          <th>SLA</th>
                          <th>UoM</th>
                          <th>Unit_Price</th>
                          <th>Region</th>
                          <th>MM_Code</th>
                          <th>MM_Description</th>
                          <th>Vendor_ID</th>
                          <th>Vendor_Name</th>
                          <th>Remarks</th>
                          <th colSpan="2" rowSpan="2" style={{ verticalAlign: "middle" }}>Action</th>
                        </tr>
                        <tr>
                          {this.loopSearchBar()}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.material_list !== undefined &&
                          this.state.material_list !== null &&
                          this.state.material_list.map((e) => (
                            <React.Fragment key={e._id + "frag"}>
                              <tr key={e._id}>
                                <td style={{ textAlign: "center" }}>
                                  {e.BB}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.BB_Sub}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.SoW_Description_or_Site_Type}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.SLA}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.UoM}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.Unit_Price}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.Region}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.MM_Code}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.MM_Description}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.Vendor_ID}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {this.findVendorName(e.Vendor_ID)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e.Remarks}
                                </td>
                                <td>
                                  <Button
                                    size="sm"
                                    color="secondary"
                                    value={e._id}
                                    onClick={this.toggleEdit}
                                    title="Edit"
                                  >
                                    <i
                                      className="fa fa-edit"
                                      aria-hidden="true"
                                    ></i>
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    size="sm"
                                    color="danger"
                                    value={e._id}
                                    name={e.MM_Code}
                                    onClick={this.toggleDelete}
                                    title="Delete"
                                  >
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </Button>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <div style={{ margin: "8px 0px" }}>
                  <small>Showing {this.state.totalData} entries</small>
                </div>
                <Row>
                  <Col>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.totalData}
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

        {/* Modal New Single PP */}
        <Modal
          isOpen={this.state.modalPPForm}
          toggle={this.togglePPForm}
          className="modal--form"
        >
          <ModalHeader>Form {module_name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label>BB</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder=""
                    value={this.state.PPForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>BB_Sub</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.PPForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Code</Label>
                      <Input
                        type="text"
                        name="7"
                        placeholder=""
                        value={this.state.PPForm[7]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Description</Label>
                      <Input
                        type="text"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>UoM</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="6"
                        placeholder=""
                        value={this.state.PPForm[6]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Region</Label>
                  <Input
                    type="text"
                    name="8"
                    placeholder=""
                    value={this.state.PPForm[8]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SLA</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SoW_Description_or_Site_Type</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor</Label>
                  <Input
                    type="select"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">
                      Select Vendor
                    </option>
                    {this.state.vendor_list.map((asp) => (
                      <option value={asp.Vendor_Code}>
                        {asp.Vendor_Code}-{asp.Name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="12"
                    placeholder=""
                    value={this.state.PPForm[12]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNew}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PP*/}

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form {module_name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label>BB</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder=""
                    value={this.state.PPForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>BB_Sub</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.PPForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Description</Label>
                      <Input
                        type="text"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Code</Label>
                      <Input
                        readOnly
                        type="text"
                        name="7"
                        placeholder=""
                        value={this.state.PPForm[7]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>UoM</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="6"
                        placeholder=""
                        value={this.state.PPForm[6]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Region</Label>
                  <Input
                    type="text"
                    name="8"
                    placeholder=""
                    value={this.state.PPForm[8]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SLA</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SoW_Description_or_Site_Type</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor</Label>
                  <Input
                    type="select"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">
                      Select Vendor
                    </option>
                    {this.state.vendor_list.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="12"
                    placeholder=""
                    value={this.state.PPForm[12]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveUpdate}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PP*/}

        {/* Modal create New */}
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
          title={"Create " + module_name}
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

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title={
            "Delete " +
            this.state.selected_name +
            " for " +
            this.findVendorName(this.state.selected_vendor)
          }
          body={"Are you sure ?"}
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>
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

export default connect(mapStateToProps)(MaterialData);
