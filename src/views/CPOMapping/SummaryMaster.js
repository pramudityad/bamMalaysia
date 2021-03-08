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
  apiSendEmail,
} from "../../helper/asyncFunction";
import ModalCreateNew from "../Component/ModalCreateNew";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import { numToSSColumn } from "../../helper/basicFunction";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "../../helper/config";
import "./cpomapping.css";
const DefaultNotif = React.lazy(() => import("../DefaultView/DefaultNotif"));
const modul_name = "Summary Master";
const header = [
  "",
  "Type",
  "Deal_Name",
  "Hammer",
  "Project_Description",
  "Po_Number",
  "Po",
  "Line_Item",
  "Description",
  "Qty",
  "Used",
  "Balance",
  "Unit_Price",
  "Total_Price",
  "Assigned_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "Discounted_Assigned_Price",
  "Hammer_1_Hd",
  "Pcode",
  "Pcode_Used",
  "Commodity",
];
const header_model = [
  "type_summary",
  "Deal_Name",
  "Hammer",
  "Project_Description",
  "Po_Number",
  "Po",
  "Line_Item",
  "Description",
  "Qty",
  "Used",
  "Balance",
  "Unit_Price",
  "Total_Price",
  "Assigned_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "Discounted_Assigned_Price",
  "Hammer_1_Hd",
  "Pcode",
  "Pcode_Used",
  "Commodity",
];

const header_materialmapping = [
  "hw_svc",
  "Deal_Name",
  "Hammer",
  "Project_Description",
  "Po_Number",
  "Po",
  "Line_Item",
  "Description",
  "Qty",
  // "Used",
  // "Balance",
  "Unit_Price",
  // "Total_Price",
  // "Assigned_Price",
  "Discounted_Unit_Price",
  // "Discounted_Po_Price",
  // "Discounted_Assigned_Price",
  "Hammer_1_Hd",
  "Pcode",
  "Pcode_Used",
  "Commodity",
];

const td_value = [];

class SVCMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      userMail: this.props.dataLogin.email,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      all_data_line: [],
      createModal: false,
      rowsXLS: [],
      modal_loading: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      CPOForm: {},
      modalEdit: false,
      action_status: null,
      action_message: null,
      filter_list: {},
      all_data_mapping: [],
    };
  }

  componentDidMount() {
    // console.log(global.config.role);
    // console.log("header", header.length);
    // console.log("model_header", header_model.length);
    this.getList();
    this.getListAll();
  }

  getList() {
    let filter_array = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/summaryMaster/getSummaryMaster?q=" +
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
        this.setState({ all_data: items, totalData: totalData }, () =>
          this.getMapping()
        );
      }
    });
  }

  getListAll() {
    getDatafromAPINODE(
      "/summaryMaster/getSummaryMaster?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ all_data_line: items });
      }
    });
  }

  getMapping() {
    getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items2 = res.data.data;
        this.setState({ all_data_mapping: items2 });
      }
    });
  }

  exportTemplate = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_materialmapping);
    for (let i = 1; i < header_materialmapping.length + 1; i++) {
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

  fileHandlerSVCMaster = (event) => {
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

  trim = (words) => {
    let edited = words.replace(/^,|,$/g, "");
    return edited;
  };

  saveBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    const res = await postDatatoAPINODE(
      "/summaryMaster/createSummaryMaster",
      {
        // line_item_type: "svc",
        line_item_data: this.state.rowsXLS,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      if (res.data.data.length !== 0) {
        // new Data
        const new_table_header = Object.keys(res.data.data[0]).slice(2, -8);
        const new_Data = res.data.data;
        let value = "row.";
        const body_new =
          "<br/><span>The following " +
          modul_name +
          " data has been successfully created </span><br/><br/><table><tr>" +
          new_table_header.map((tab, i) => "<th>" + tab + "</th>").join(" ") +
          "</tr>" +
          new_Data
            .map(
              (row, j) =>
                "<tr key={" +
                j +
                "}>" +
                new_table_header
                  .map((td) => "<td>" + eval(value + td) + "</td>")
                  .join(" ") +
                "</tr>"
            )
            .join(" ") +
          "</table>";
        // updated Data
        if (res.data.updateData.length !== 0) {
          const updated_table_header = Object.keys(
            res.data.updateData[0]
          ).slice(0, -3);
          const update_Data = res.data.updateData;
          const body_updated =
            "<br/><span>Please be notified that the following " +
            modul_name +
            " data has been updated </span><br/><br/><table><tr>" +
            updated_table_header
              .map((tab, i) => "<th>" + tab + "</th>")
              .join(" ") +
            "</tr>" +
            update_Data
              .map(
                (row, j) =>
                  "<tr key={" +
                  j +
                  "}>" +
                  updated_table_header
                    .map((td) => "<td>" + eval(value + td) + "</td>")
                    .join(" ") +
                  "</tr>"
              )
              .join(" ") +
            "</table>";

          const bodyEmail =
            "<h2>DPM - BAM Notification</h2>" + body_new + body_updated;
          let dataEmail = {
            // "to": creatorEmail,
            to: "pramudityad@student.telkomuniversity.ac.id",
            // to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          // console.log(sendEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
          // // setTimeout(function () {
          // //   window.location.reload();
          // // }, 1500);
        } else {
          const bodyEmail = "<h2>DPM - BAM Notification</h2>" + body_new;
          let dataEmail = {
            // "to": creatorEmail,
            to: "pramudityad@student.telkomuniversity.ac.id",
            // to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          // console.log(sendEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
        }
      } else {
        // updated Data
        const updated_table_header = Object.keys(res.data.updateData[0]).slice(
          0,
          -3
        );
        const update_Data = res.data.updateData;
        let value = "row.";
        const body_updated =
          "<br/><span>Please be notified that the following " +
          modul_name +
          " data has been updated </span><br/><br/><table><tr>" +
          updated_table_header
            .map((tab, i) => "<th>" + tab + "</th>")
            .join(" ") +
          "</tr>" +
          update_Data
            .map(
              (row, j) =>
                "<tr key={" +
                j +
                "}>" +
                updated_table_header
                  .map((td) => "<td>" + eval(value + td) + "</td>")
                  .join(" ") +
                "</tr>"
            )
            .join(" ") +
          "</table>";

        const bodyEmail = "<h2>DPM - BAM Notification</h2>" + body_updated;
        let dataEmail = {
          // "to": creatorEmail,
          // to: "pramudityad@student.telkomuniversity.ac.id",
          to: global.config.role.cpm,
          subject: "[NOTIFY to CPM] " + modul_name,
          body: bodyEmail,
        };
        const sendEmail = await apiSendEmail(dataEmail);
        // console.log(sendEmail);
        this.setState({ action_status: "success" });
        this.toggleLoading();
        // setTimeout(function () {
        //   window.location.reload();
        // }, 1500);
      }
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
      "/lineItem/updateLineItem1",
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
      "/summaryMaster/getSummaryMaster?noPg=1",
      this.state.tokenUser
    );

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

    if (download_all_A.data !== undefined) {
      for (let i = 0; i < download_all_A.data.data.length; i++) {
        let e = download_all_A.data.data[i];
        ws.addRow([
          e.type_summary,
          e.Deal_Name,
          e.Hammer,
          e.Project_Description,
          e.Po_Number,
          e.Po,
          e.Line_Item,
          e.Description,
          e.Qty,
          this.countUsed(e.Po, e.Line_Item),
          e.Qty - this.countUsed(e.Po, e.Line_Item),
          e.Unit_Price,
          e.Qty * e.Unit_Price,
          e.Assigned_Price,
          e.Discounted_Unit_Price,
          e.Discounted_Po_Price,
          e.Discounted_Assigned_Price,
          this.countUsed(e.Po, e.Line_Item) * e.Unit_Price,
          e.Pcode,
          e.Pcode_Used,
          e.Commodity,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All Data " + modul_name + ".xlsx");
    this.toggleLoading();
  };

  downloadAll_B = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/summaryMaster/getSummaryMaster?noPg=1",
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
    // console.log("dataFilter[index]", dataFilter[index], index);
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
      // console.log(this.state.filter_list);
    });
  };

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < header_model.length; i++) {
      searchBar.push(
        <td>
          {/* {i !== 1 && i !== 3 && i !== 5 && i !== 7 && i !== 8 ? (
            ""
          ) : ( */}
          <div className="controls" style={{ width: "150px" }}>
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
          {/* )} */}
        </td>
      );
    }
    return searchBar;
  };

  countBalance = (qty, used) => {
    return qty - used;
  };

  countUsed = (po, line_item) => {
    let sum_used = this.state.all_data_mapping
      .filter((element) => element.Po === po && element.Line === line_item)
      .reduce((a, { Qty }) => a + Qty, 0);
    return sum_used;
  };

  handleChangeLimit = (e) => {
    let limitpg = e.currentTarget.value;
    this.setState({ perPage: limitpg }, () => this.getList());
  };

  countheaderNaN = (params_field) => {
    let value = "element." + params_field;
    let sumheader = this.state.all_data_line.filter(
      (element) => eval(value) !== null && eval(value) !== ""
    );
    // console.log(params_field, sumheader);

    return sumheader.length;
  };

  countheader = (params_field) => {
    let value = "curr." + params_field;
    let sumheader = this.state.all_data_line.reduce(
      (acc, curr) => acc + eval(value),
      0
    );
    // console.log(sumheader);
    return Math.round((sumheader + Number.EPSILON) * 100) / 100;
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
                    {role.includes("BAM-MAT PLANNER") === true ||
                    role.includes("BAM-PFM") === true ? (
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
                          {role.includes("BAM-IM") === true ||
                          role.includes("BAM-PFM") === true
                            ? "Update"
                            : "New"}
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
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
                        <DropdownItem onClick={this.exportTemplate}>
                          {" "}
                          {modul_name} Template
                        </DropdownItem>
                        <DropdownItem onClick={this.downloadAll_A}>
                          {" "}
                          All {modul_name} Data
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                {/* <Row></Row> */}
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
                    </div>
                  </Col>
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
                          <tr align="center">
                            <th></th>
                            {header_model.map((head, j) =>
                              head === "Qty" ||
                              head === "Used" ||
                              head === "Balance" ||
                              head === "Unit_Price" ||
                              head === "Total_Price" ||
                              head === "Assigned_Price" ||
                              head === "Total_Po_Amount" ? (
                                <th>{this.countheader(head)}</th>
                              ) : (
                                <th>{this.countheaderNaN(head)}</th>
                              )
                            )}
                          </tr>
                          <tr align="center">
                            <td></td>
                            {this.loopSearchBar()}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.all_data !== undefined &&
                            this.state.all_data.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr key={e._id} align="center">
                                  <td>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      title="Edit"
                                      value={e._id}
                                      onClick={this.toggleEdit}
                                    >
                                      <i
                                        className="fa fa-edit"
                                        aria-hidden="true"
                                      ></i>
                                    </Button>
                                  </td>
                                  <td>{e.type_summary.toUpperCase()}</td>
                                  <td>{e.Deal_Name}</td>
                                  <td>{e.Hammer}</td>
                                  <td>{e.Project_Description}</td>
                                  <td>{e.Po_Number}</td>
                                  <td>{e.Po}</td>
                                  <td>{e.Line_Item}</td>
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>{e.Used}</td>
                                  <td>{e.Balance}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
                                  <td>{e.Assigned_Price}</td>
                                  <td>{e.Discounted_Unit_Price}</td>
                                  <td>{e.Discounted_Po_Price}</td>
                                  <td>{e.Discounted_Assigned_Price}</td>
                                  <td>{e.Hammer_1_Hd}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Pcode_Used}</td>
                                  <td>{e.Commodity}</td>
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
          size="lg"
        >
          <ModalHeader>Form Update {CPOForm.unique_code}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup row>
                  <Col>
                    <FormGroup>
                      <Label>Po</Label>
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
                  <Col>
                    <FormGroup>
                      <Label>Line_Item</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Line_Item"
                        placeholder=""
                        value={CPOForm.Line_Item}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Description"
                        placeholder=""
                        value={CPOForm.Description}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        name="Qty"
                        placeholder=""
                        value={CPOForm.Qty}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="Unit_Price"
                        placeholder=""
                        value={CPOForm.Unit_Price}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Assigned_Price</Label>
                      <Input
                        type="number"
                        name="Assigned_Price"
                        placeholder=""
                        value={CPOForm.Assigned_Price}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm="12">
                <FormGroup row>
                  <Col>
                    <FormGroup>
                      <Label>Pcode</Label>
                      <Input
                        type="text"
                        name="Pcode"
                        placeholder=""
                        value={CPOForm.Pcode}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Type</Label>
                      <Input
                        type="text"
                        name="Type"
                        placeholder=""
                        value={CPOForm.Type}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>PSP_Remarks</Label>
                      <Input
                        type="text"
                        name="PSP_Remarks"
                        placeholder=""
                        value={CPOForm.PSP_Remarks}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <Label>Wbs</Label>
                      <Input
                        type="text"
                        name="Wbs"
                        placeholder=""
                        value={CPOForm.Wbs}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Remarks</Label>
                      <Input
                        type="text"
                        name="Remarks"
                        placeholder=""
                        value={CPOForm.Remarks}
                        onChange={this.handleChangeForm}
                      />
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
                      onChange={this.fileHandlerSVCMaster.bind(this)}
                      style={{ padding: "10px", visiblity: "hidden" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ModalFooter>
            {/* {role.includes("BAM-IM") === true ||
            role.includes("BAM-PFM") === true ? (
              <Button
                size="sm"
                block
                color="secondary"
                className="btn-pill"
                disabled={this.state.rowsXLS.length === 0}
                onClick={this.saveUpdate}
                style={{ height: "30px", width: "100px" }}
              >
                Update
              </Button>
            ) : ( */}
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
            </Button>
            {/* )} */}
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

export default connect(mapStateToProps)(SVCMaster);
