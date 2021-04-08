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
import ModalDelete from "../Component/ModalDelete";

import "../../helper/config";
import "./cpomapping.css";
const DefaultNotif = React.lazy(() => import("../DefaultView/DefaultNotif"));
const modul_name = "Summary Master";
const header = [
  // "",
  "Type",
  "Deal_Name",
  "Hammer",
  "Project_Description",
  "Po_Number",
  "Po",
  "Line_Item",
  "LINE ITEM SAP CELCOM",
  "MATERIAL CODE",
  "Description",
  "Qty",
  // "Used",
  "RESERVED",
  "CALLOFF",
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
  "Line_Item_Sap",
  "Material_Code",
  "Description",
  "Qty",
  // "Used",
  "Reserve",
  "Called_Off",
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
  "Line_Item_Sap",
  "Material_Code",
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
      selected_id: null,
      selected_name: null,
      selected_vendor: null,
      danger: false,
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
            to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } else {
          const bodyEmail = "<h2>DPM - BAM Notification</h2>" + body_new;
          let dataEmail = {
            to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
          setTimeout(function () {
            window.location.reload();
          }, 1500);
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
        const dataEmail = {
          to: global.config.role.cpm,
          subject: "[NOTIFY to CPM] " + modul_name,
          body: bodyEmail,
        };
        const sendEmail = await apiSendEmail(dataEmail);
        this.setState({ action_status: "success" });
        this.toggleLoading();
        setTimeout(function () {
          window.location.reload();
        }, 1500);
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
          e.Line_Item_Sap,
          e.Material_Code,
          e.Description,
          e.Qty,
          e.Reserve,
          e.Called_Off,
          // this.countUsed(e.Po, e.Line_Item),
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
    if (
      params_field === "Qty" ||
      params_field === "Used" ||
      params_field === "Balance"
    ) {
      return Math.round((sumheader + Number.EPSILON) * 100) / 100;
    }
    return this.formatMoney(sumheader);
  };

  toggleDelete = (e) => {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      const name = this.state.all_data.find((e) => e._id === _id);
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
        selected_name: name.unique_code,
        // selected_vendor: name.Vendor_ID,
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
    const DelData = await deleteDataFromAPINODE2(
      "/summaryMaster/deleteSummaryMaster",
      this.state.tokenUser,
      { data: [objData] }
    );
    if (DelData.data !== undefined) {
      const table_header = Object.keys(DelData.data.updateData[0]);
      const update_Data = DelData.data.updateData;
      const new_table_header = table_header.slice(0, -2);
      // update_Data.map((row, k) => console.log(row));
      console.log(table_header);
      let value = "row.";
      const bodyEmail =
        "<h2>DPM - BAM Notification</h2><br/><span>Please be notified that the following " +
        modul_name +
        " data has been updated <br/><br/><table><tr>" +
        new_table_header.map((tab, i) => "<th>" + tab + "</th>").join(" ") +
        "</tr>" +
        update_Data
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
    } else {
      this.setState({ action_status: "failed" }, () => {
        this.toggleLoading();
      });
    }
  };

  Logic_Price(num) {
    if (num === null || num === 0) {
      return "-";
    }
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  }

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
                            <th></th>
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
                              head === "Total_Po_Amount" ||
                              head === "Discounted_Unit_Price" ||
                              head === "Discounted_Po_Price" ||
                              head === "Discounted_Assigned_Price" ? (
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
                                    <Link to={"/summary-master/" + e._id}>
                                      <Button
                                        size="sm"
                                        color="secondary"
                                        title="Edit"
                                        // value={e._id}
                                        // onClick={this.toggleEdit}
                                      >
                                        <i
                                          className="fa fa-edit"
                                          aria-hidden="true"
                                        ></i>
                                      </Button>
                                    </Link>{" "}
                                    <Button
                                      size="sm"
                                      color="danger"
                                      value={e._id}
                                      name={e.unique_code}
                                      onClick={this.toggleDelete}
                                      title="Delete"
                                    >
                                      <i
                                        className="fa fa-trash"
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
                                  <td>{e.Line_Item_Sap}</td>
                                  <td>{e.Material_Code}</td>

                                  <td>{e.Description}</td>

                                  <td>{e.Qty}</td>
                                  <td>{e.Reserve}</td>
                                  <td>{e.Called_Off}</td>

                                  <td>{e.Balance}</td>
                                  <td>{this.formatMoney(e.Unit_Price)}</td>
                                  <td>{this.formatMoney(e.Total_Price)}</td>
                                  <td>{this.formatMoney(e.Assigned_Price)}</td>
                                  <td>
                                    {this.formatMoney(e.Discounted_Unit_Price)}
                                  </td>
                                  <td>
                                    {this.formatMoney(e.Discounted_Po_Price)}
                                  </td>
                                  <td>
                                    {this.formatMoney(
                                      e.Discounted_Assigned_Price
                                    )}
                                  </td>
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

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title={"Delete " + this.state.selected_name}
          body={"Are you sure ?"}
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>

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
