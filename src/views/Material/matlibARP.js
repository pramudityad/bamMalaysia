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
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE
} from "../../helper/asyncFunction";
import ModalDelete from "../Component/ModalDelete";
import {numToSSColumn} from '../../helper/basicFunction'
import { connect } from 'react-redux';

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const modul_name = "ARP";
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";

class MatARP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      dropdownOpen: new Array(3).fill(false),
      PPForm: new Array(11).fill(""),
      createModal: false,
      modal_loading: false,
      action_status: null,
      action_message: null,
      rowsXLS: [],
      vendor_list: [],
      danger: false,
      selected_id: "",
      selected_name: "",
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      modalEdit: false,
      material_list: [],
      material_list_all : [],
      selected_vendor: ""
    };
    this.toggle = this.toggle.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
    this.togglePPForm = this.togglePPForm.bind(this);
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
        // const vendor_data = items.map((a) => a.Name);
        this.setState({ vendor_list: items });
      }
    });
  }

  getMaterialListAll() {
    getDatafromAPINODE(
      '/mmCode/getMm?q={"Material_Type": "'+modul_name+'"}' +
        "&noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ material_list_all: items });
      }
    });
  }

  getMaterialList() {
    getDatafromAPINODE(
      '/mmCode/getMm?q={"Material_Type": "'+modul_name+'"}' +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage,
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ material_list: items, totalData: totalData }, ()=>console.log(items.map(e=>e._id)));
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
      "Vendor_ID",
      "Unit_Price",
      "Currency",
      "UoM",           
      "Remarks_or_Acceptance",      
      "ZERV_(18)",
      "ZEXT_(40)",
      "Note",
    ];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + '1').fill = { type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
      bgColor:{argb:'A9A9A9'}};
    }

    ws.addRow([
      modul_name,
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
    const res = await postDatatoAPINODE(
      "/mmCode/createMmCode",
      {
        mm_data: BulkXLSX,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
      window.location.reload();
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
        "MM_Code",
        "MM_Description",
        "UoM",
        "Unit_Price",
        "BB",
        "BB_Sub",
        "Region",
        "FTV_or_SSO_SLA_or_SSO_Lite_SLA_or_CBO",
        "Remarks_or_Acceptance",
        "Vendor_ID",
        "Vendor_Name",
        "ZERV_(18)",
        "ZEXT_(40)",
        "Note",
      ],
      [
        modul_name,
        this.state.PPForm[1],
        this.state.PPForm[2],
        this.state.PPForm[3],
        this.state.PPForm[4],
        this.state.PPForm[5],
        this.state.PPForm[6],
        this.state.PPForm[7],
        this.state.PPForm[8],
        this.state.PPForm[9],
        this.state.PPForm[10],
        this.findVendorName(this.state.PPForm[10]),
        this.state.PPForm[11],
        this.state.PPForm[12],
        this.state.PPForm[13],
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

  handleChangeForm = (e) => {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.PPForm;
    dataForm[parseInt(index)] = value;
    this.setState({ PPForm: dataForm }, () => console.log(this.state.PPForm));
  };

  togglePPForm() {
    this.setState((prevState) => ({
      modalPPForm: !prevState.modalPPForm,
    }));
  }

  downloadAll = async () => {
    let download_all = [];
    let getAll_nonpage = this.state.material_list_all;

    if (getAll_nonpage !== undefined) {
      download_all = getAll_nonpage;
    }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = [
      "MM_Code",
      "MM_Description",
      "Vendor_ID",
      "Unit_Price",
      "Currency",
      "UoM",           
      "Remarks_or_Acceptance",      
      "ZERV_(18)",
      "ZEXT_(40)",
      "Note",
    ];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + '1').fill = { type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
      bgColor:{argb:'A9A9A9'}};
    }

    for (let i = 0; i < download_all.length; i++) {
      let e = download_all[i];
      ws.addRow([
        e.MM_Code,
        e.MM_Description,
        e.Vendor_ID,
        e.Unit_Price,
        e.Currency,
        e.UoM,
        e.Remarks_or_Acceptance,
        e.ZERV_18,
        e.ZEXT_40,
        e.Note,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All " + modul_name + ".xlsx");
  };

  findVendorName = (vendor_id) => {
    let vendordata = this.state.vendor_list.find(element => element.Vendor_Code === vendor_id);
    if(vendordata !== undefined){
      return vendordata.Name
    }else{
      return null
    }
    
  }

  toggleDelete=(e) => {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      const name = this.state.material_list_all.find(e => e._id === _id)
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
        selected_name: name.MM_Code,
        selected_vendor: name.Vendor_ID
      });
    } else {
      this.setState({
        danger: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  }

  DeleteData = async () => {
    const objData = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    const DelData = deleteDataFromAPINODE2(
      "/mmCode/deleteMmCode", this.state.tokenUser, {data:[objData]}
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
  }

  toggleEdit = (e) => {
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.material_list.find((e) => e._id === value);
      let dataForm = this.state.PPForm;

      dataForm[2] = aEdit.MM_Description;
      dataForm[3] = aEdit.UoM;
      dataForm[4] = aEdit.Unit_Price;
      dataForm[5] = aEdit.Currency;
      dataForm[6] = aEdit.Remarks_or_Acceptance;
      dataForm[7] = aEdit.Vendor_ID;
      dataForm[8] = aEdit.Vendor_Name;
      dataForm[9] = aEdit.ZERV_18;
      dataForm[10] = aEdit.ZEXT_40;
      dataForm[11] = aEdit.Note;
      this.setState({ PPForm: dataForm, selected_id: value });
    } else {
      this.setState({ PPForm: new Array(11).fill("") });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  }

  saveUpdate = async () => {
    this.toggleEdit();
    this.toggleLoading();
    let dataForm =      
      {
        _id: this.state.selected_id,
        MM_Description: this.state.PPForm[2],
        UoM: this.state.PPForm[3],
        Unit_Price: this.state.PPForm[4],
        Currency: this.state.PPForm[5],
        Info_Rec: this.state.PPForm[6],
        Vendor_ID: this.state.PPForm[7],
        Vendor_Name: this.findVendorName(this.state.PPForm[7]),
        Valid_To: this.state.PPForm[8],
        Created_On: this.state.PPForm[9],
        Status_Price_in_SAP: this.state.PPForm[10],
        Note: this.state.PPForm[11],
      }
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
  }

  render() {
    const NROForm = this.state.NROForm;
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
                    <div >
                      <Table striped hover bordered responsive size="sm">
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
                            <th colspan="2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.material_list !== undefined &&
                            this.state.material_list !== null &&
                            this.state.material_list.map((e) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr
                                  // style={{ backgroundColor: "#d3d9e7" }}
                                  // className="fixbody"
                                  key={e._id}
                                >
                                  <td style={{ textAlign: "center" }}>
                                    {e.MM_Code}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.MM_Description}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.UoM}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Unit_Price}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Currency}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Remarks_or_Acceptance}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Vendor_ID}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                  {this.findVendorName(e.Vendor_ID)}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e["ZERV_(18)"]}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e["ZEXT_(40)"]}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {e.Note}
                                  </td>
                                  <td>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      value={e._id}
                                      onClick={this.toggleEdit}
                                      title="Edit"
                                    >
                                      <i className="fa fa-edit" aria-hidden="true"></i>
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
                    </div>
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
          <ModalHeader>Form {modul_name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                {/* <FormGroup>
                  <Label>Material_Type</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder=""
                    value={this.state.PPForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup> */}
                <FormGroup>
                  <Label>MM_Code</Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.PPForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>                
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Description</Label>
                      <Input
                        type="text"
                        name="2"
                        placeholder=""
                        value={this.state.PPForm[2]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>UoM</Label>
                      <Input
                        type="text"
                        name="3"
                        placeholder=""
                        value={this.state.PPForm[3]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Remarks_or_Acceptance</Label>
                  <Input
                    type="text"
                    name="6"
                    placeholder=""
                    value={this.state.PPForm[6]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor_ID</Label>
                  <Input
                    type="select"
                    name="7"
                    placeholder=""
                    value={this.state.PPForm[7]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">
                      Select Vendor
                    </option>
                    {this.state.vendor_list.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Vendor_Code}-{asp.Name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>ZERV_(18)</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ZEXT_(40)</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
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

        
        {/* Modal Update */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form {modul_name}</ModalHeader>
          <ModalBody>
          <Row>
              <Col sm="12">
                {/* <FormGroup>
                  <Label>Material_Type</Label>
                  <Input
                    type="text"
                    name="0"
                    placeholder=""
                    value={this.state.PPForm[0]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>MM_Code</Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.PPForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup> */}
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Description</Label>
                      <Input
                        type="text"
                        name="2"
                        placeholder=""
                        value={this.state.PPForm[2]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>UoM</Label>
                      <Input
                        type="text"
                        name="3"
                        placeholder=""
                        value={this.state.PPForm[3]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Remarks_or_Acceptance</Label>
                  <Input
                    type="text"
                    name="6"
                    placeholder=""
                    value={this.state.PPForm[6]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor_ID</Label>
                  <Input
                    type="select"
                    name="7"
                    placeholder=""
                    value={this.state.PPForm[7]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">
                      Select Vendor
                    </option>
                    {this.state.vendor_list.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Vendor_Code}-{asp.Name}</option>
                    ))}
                  </Input>
                </FormGroup>     
                <FormGroup>
                  <Label>ZERV_(18)</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ZEXT_(40)</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
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

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title={"Delete "+ this.state.selected_name+ " for " + this.findVendorName(this.state.selected_vendor)}
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
    dataLogin : state.loginData,
    SidebarMinimize : state.minimizeSidebar
  }
}

export default connect(mapStateToProps)(MatARP);
