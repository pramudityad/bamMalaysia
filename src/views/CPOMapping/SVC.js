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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Excel from "exceljs";
import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
} from "../../helper/asyncFunction";
import ModalCreateNew from "../Component/ModalCreateNew";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import { numToSSColumn } from "../../helper/basicFunction";
import { connect } from "react-redux";
import "./cpomapping.css";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);
const modul_name = "SVC Mapping";
const header = [
  "",
  "Link",
  "LOOKUP REFERENCE",
  "REGION",
  "REFERENCE LOC ID",
  "NEW LOC ID",
  "SITE NAME",
  "NEW SITE NAME",
  "CONFIG",
  "PO#",
  "LINE",
  "DESCRIPTION",
  "QTY",
  "CNI DATE",
  "MAPPING DATE",
  "REMARKS",
  "CELCOM USER",
  "PCODE",
  "UNIT PRICE",
  "TOTAL PRICE",
  "DISCOUNTED UNIT PRICE",
  "DISCOUNTED PO PRICE",
  "TYPE",
  "SO LINE ITEM DESCRIPTION",
  "SO NO.",
  "WBS  NO.",
  "100% BILLING",
  "ATP COA DATE RECEIVED",
  "80% BILLING UPON ATP",
  "80% INVOICING NO.",
  "80% INVOICING DATE",
  "Cancelled",
  "COA NI DATE RECEIVED",
  "20% BILLING UPON NI",
  "20% INVOICING NO.",
  "20% INVOICING DATE",
  "COA SSO RCVD DATE",
  "80% BILLING UPON SSO",
  "80% INVOICING NO.",
  "80% INVOICING DATE",
  "COA PSP RCVD DATE 20%",
  "20% BILLING UPON PSP",
  "20% INVOICING NO.",
  "20% INVOICING DATE",
  "COA SSO RCVD DATE 100%",
  "100% BILLING UPON SSO",
  "100% INVOICING NO.",
  "100% INVOICING DATE",
  "COA NI RCVD DATE 100%",
  "100% BILLING UPON NI",
  "100% INVOICING NO.",
  "100% INVOICING DATE",
  "SES NO.",
  "SES STATUS",
  "LINK",
  "NI COA SUBMISSION STATUS",
];

const header_model = [
  "Link",
  "Lookup_Reference",
  "Region",
  "Reference_Loc_Id",
  "New_Loc_Id",
  "Site_Name",
  "New_Site_Name",
  "Config",
  "Po",
  "Line",
  "Description",
  "Qty",
  "CNI_Date",
  "Mapping_Date",
  "Remarks",
  "Celcom_User",
  "Pcode",
  "Unit_Price",
  "Total_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "Type",
  "So_Line_Item_Description",
  "So_No",
  "Wbs_No",
  "Billing_100",
  "Atp_Coa_Received_Date_80",
  "Billing_Upon_Atp_Coa_80",
  "Invoicing_No_Atp_Coa_80",
  "Invoicing_Date_Atp_Coa_80",
  "Cancelled_Atp_Coa_80",
  "Ni_Coa_Date_20",
  "Billing_Upon_Ni_20",
  "Invoicing_No_Ni_20",
  "Invoicing_Date_Ni_20",
  "Sso_Coa_Date_80",
  "Billing_Upon_Sso_80",
  "Invoicing_No_Sso_80",
  "Invoicing_Date_Sso_80",
  "Coa_Psp_Received_Date_20",
  "Billing_Upon_Coa_Psp_20",
  "Invoicing_No_Coa_Psp_20",
  "Invoicing_Date_Coa_Psp_20",
  "Sso_Coa_Date_100",
  "Billing_Upon_Sso_Coa_100",
  "Invoicing_No_Sso_Coa_100",
  "Invoicing_Date_Sso_Coa_100",
  "Coa_Ni_Date_100",
  "Billing_Upon_Coa_Ni_100",
  "Invoicing_No_Coa_Ni_100",
  "Invoicing_Date_Coa_Ni_100",
  "Ses_No",
  "Ses_Status",
  "Link_1",
  "Ni_Coa_Submission_Status",
];

const td_value = [
  "e.Link",
  "e.Lookup_Reference",
  "e.Region",
  "e.Reference_Loc_Id",
  "e.New_Loc_Id",
  "e.Site_Name",
  "e.New_Site_Name",
  "e.Config",
  "e.Po",
  "e.Line",
  "e.Description",
  "e.Qty",
  "e.CNI_Date",
  "e.Mapping_Date",
  "e.Remarks",
  "e.Celcom_User",
  "e.Pcode",
  "e.Unit_Price",
  "e.Total_Price",
  "e.Discounted_Unit_Price",
  "e.Discounted_Po_Price",
  "e.Type",
  "e.So_Line_Item_Description",
  "e.So_No",
  "e.Wbs_No",
  "e.Billing_100",
  "e.Atp_Coa_Received_Date_80",
  "e.Billing_Upon_Atp_Coa_80",
  "e.Invoicing_No_Atp_Coa_80",
  "e.Invoicing_Date_Atp_Coa_80",
  "e.Cancelled_Atp_Coa_80",
  "e.Ni_Coa_Date_20",
  "e.Billing_Upon_Ni_20",
  "e.Invoicing_No_Ni_20",
  "e.Invoicing_Date_Ni_20",
  "e.Sso_Coa_Date_80",
  "e.Billing_Upon_Sso_80",
  "e.Invoicing_No_Sso_80",
  "e.Invoicing_Date_Sso_80",
  "e.Coa_Psp_Received_Date_20",
  "e.Billing_Upon_Coa_Psp_20",
  "e.Invoicing_No_Coa_Psp_20",
  "e.Invoicing_Date_Coa_Psp_20",
  "e.Sso_Coa_Date_100",
  "e.Billing_Upon_Sso_Coa_100",
  "e.Invoicing_No_Sso_Coa_100",
  "e.Invoicing_Date_Sso_Coa_100",
  "e.Coa_Ni_Date_100",
  "e.Billing_Upon_Coa_Ni_100",
  "e.Invoicing_No_Coa_Ni_100",
  "e.Invoicing_Date_Coa_Ni_100",
  "e.Ses_No",
  "e.Ses_Status",
  "e.Link_1",
  "e.Ni_Coa_Submission_Status",
];

class MappingSVC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      createModal: false,
      rowsXLS: [],
      modal_loading: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      CPOForm: {},
      modalEdit: false,
      modal_loading: false,
      action_status: null,
      action_message: null,
      filter_list: {},
    };
  }

  componentDidMount() {
    // console.log("header", header.length);
    // console.log("model_header", header_model.length);
    this.getList();
  }

  getList() {
    let filter_array = [];
    this.state.filter_list["Region"] !== null &&
      this.state.filter_list["Region"] !== undefined &&
      filter_array.push(
        '"Region":{"$regex" : "' +
          this.state.filter_list["Region"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["New_Loc_Id"] !== null &&
      this.state.filter_list["New_Loc_Id"] !== undefined &&
      filter_array.push(
        '"New_Loc_Id":{"$regex" : "' +
          this.state.filter_list["New_Loc_Id"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["New_Site_Name"] !== null &&
      this.state.filter_list["New_Site_Name"] !== undefined &&
      filter_array.push(
        '"site_info.site_id":{"$regex" : "' +
          this.state.filter_list["New_Site_Name"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["Po"] !== null &&
      this.state.filter_list["Po"] !== undefined &&
      filter_array.push(
        '"site_info.Po":{"$regex" : "' +
          this.state.filter_list["Po"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["Line"] !== null &&
      this.state.filter_list["Line"] !== undefined &&
      filter_array.push(
        '"Line":{"$regex" : "' +
          this.state.filter_list["Line"] +
          '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?q=" +
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
        this.setState({ all_data: items, totalData: totalData });
      }
    });
  }

  exportTemplate = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_model);
    for (let i = 1; i < header_model.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), modul_name + " Template.xlsx");
  };

  togglecreateModal = () => {
    this.setState({
      createModal: !this.state.createModal,
    });
  };

  resettogglecreateModal = () => {
    this.setState({
      rowsXLS: [],
    });
  };

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState({
            rowsXLS: rest.rows,
          });
        }
      });
    }
  };

  toggle = (i) => {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  };

  saveBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo",
      {
        cpo_type: "svc",
        cpo_data: this.state.rowsXLS,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
      setTimeout(function () {
        window.location.reload();
      }, 1500);
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

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber }, () => {
      this.getList();
    });
  };

  toggleEdit = (e) => {
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.all_data.find((e) => e._id === value);
      this.setState({ CPOForm: aEdit, selected_id: value });
    } else {
      this.setState({ CPOForm: {} });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  handleChangeForm = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState(
      (prevState) => ({
        CPOForm: {
          ...prevState.CPOForm,
          [name]: value,
        },
      }),
      () => console.log(this.state.CPOForm)
    );
  };

  saveUpdate = async () => {
    this.toggleEdit();
    this.toggleLoading();
    const res = await patchDatatoAPINODE(
      "/cpoMapping/updateCpo",
      {
        cpo_type: "svc",
        data: [this.state.CPOForm],
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
      setTimeout(function () {
        window.location.reload();
      }, 1500);
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

  downloadAll_A = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = ["Line", "Po", "New_Loc_Id", "Config"];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A.data !== undefined) {
      for (let i = 0; i < download_all_A.data.data.length; i++) {
        let e = download_all_A.data.data[i];
        ws.addRow([e.Line, e.Po, e.New_Loc_Id, e.Config]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "Template " + modul_name + " Role A.xlsx");
    this.toggleLoading();
  };

  downloadAll_B = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = ["Line", "Po", "New_Loc_Id", "Qty"];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A.data !== undefined) {
      console.log(download_all_A.data.data.map((u) => u._id));

      for (let i = 0; i < download_all_A.data.data.length; i++) {
        let e = download_all_A.data.data[i];
        ws.addRow([e.Line, e.Po, e.New_Loc_Id, e.Qty]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "Template " + modul_name + " Role B.xlsx");
    this.toggleLoading();
  };

  onChangeDebounced = () => {
    this.getList();
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

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < header_model.length; i++) {
      searchBar.push(
        <td>
          {i !== 2 && i !== 4 && i !== 6 && i !== 8 && i !== 9 ? (
            ""
          ) : (
            <div className="controls" style={{ width: "150px" }}>
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  // className="w-25"
                  type="text"
                  placeholder="Search"
                  onChange={this.handleFilterList}
                  value={this.state.filter_list[header_model[i]]}
                  name={header_model[i]}
                  size="sm"
                />
              </InputGroup>
            </div>
          )}
        </td>
      );
    }
    return searchBar;
  };

  render() {
    const CPOForm = this.state.CPOForm;
    const role = this.state.roleUser;
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
                  List {modul_name}
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
                        size="sm"
                        onClick={this.togglecreateModal}
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
                        {role.includes("BAM-Sourcing") === true ? (
                          <DropdownItem onClick={this.exportTemplate}>
                            {" "}
                            Mapping Template
                          </DropdownItem>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-IM") === true ? (
                          <DropdownItem onClick={this.downloadAll_A}>
                            Template A{" "}
                          </DropdownItem>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-PA") === true ? (
                          <DropdownItem onClick={this.downloadAll_B}>
                            Template B{" "}
                          </DropdownItem>
                        ) : (
                          ""
                        )}
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
                    <div
                      style={{
                        "max-height": "calc(100vh - 210px)",
                        "overflow-y": "auto",
                      }}
                    >
                      <table class="table table-hover">
                        <thead class="thead-dark">
                          <tr align="center">
                            {header.map((head) => (
                              <th>{head}</th>
                            ))}
                          </tr>
                          <tr>
                            <td></td>
                            {this.loopSearchBar()}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.all_data !== undefined &&
                            this.state.all_data.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr key={e._id}>
                                  {role.includes("BAM-IM") === true ||
                                  role.includes("BAM-PA") === true ? (
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
                                  ) : (
                                    ""
                                  )}
                                  {td_value.map((name, ndex) => (
                                    <td>{eval(name)}</td>
                                  ))}
                                </tr>
                              </React.Fragment>
                            ))}
                        </tbody>
                      </table>
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

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form Update</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup row>
                  <Col xs="4">
                    <FormGroup>
                      <Label>Line</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Line"
                        placeholder=""
                        value={CPOForm.Line}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label>PO</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Po"
                        placeholder=""
                        value={CPOForm.Po}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label>NEW LOC ID</Label>
                      <Input
                        readOnly
                        type="text"
                        name="New_Loc_Id"
                        placeholder=""
                        value={CPOForm.New_Loc_Id}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Config</Label>
                      {role.includes("BAM-IM") === true ? (
                        <Input
                          type="text"
                          name="Config"
                          placeholder=""
                          value={CPOForm.Config}
                          onChange={this.handleChangeForm}
                        />
                      ) : (
                        <Input
                          readOnly
                          type="text"
                          name="Config"
                          placeholder=""
                          value={CPOForm.Config}
                          onChange={this.handleChangeForm}
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>QTY</Label>
                      {role.includes("BAM-IM") === true ? (
                        <Input
                          readOnly
                          type="number"
                          name="Qty"
                          placeholder=""
                          value={CPOForm.Qty}
                          onChange={this.handleChangeForm}
                        />
                      ) : (
                        <Input
                          type="number"
                          name="Qty"
                          placeholder=""
                          value={CPOForm.Qty}
                          onChange={this.handleChangeForm}
                        />
                      )}
                    </FormGroup>
                  </Col>
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
              onClick={this.saveBulk}
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

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
    SidebarMinimize: state.minimizeSidebar,
  };
};

export default connect(mapStateToProps)(MappingSVC);
