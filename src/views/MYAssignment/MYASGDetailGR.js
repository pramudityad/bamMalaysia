import React, { Component, Fragment } from "react";
import {
  Form,
  FormGroup,
  Label,
  FormText,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
  Input,
} from "reactstrap";
import axios from "axios";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { convertDateFormat } from "../../helper/basicFunction";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameBAM = "adminbamidsuper";
const passwordBAM = "F760qbAg2sml";

// const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

// const API_URL_NODE = 'http://localhost:5012/bammyapi';
const API_URL_NODE = "https://api-dev.bam-my.e-dpm.com/bammyapi";

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";
class MYASGDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      // tokenUser: this.props.dataLogin.token,
      tokenUser: BearerToken,
      lmr_child_form: {},
      modal_loading: false,
      modalAddChild: false,
      lmr_detail: [],
      lmr_lvl2: {},
      data_prpo: [],
      data_cpo: null,
      data_cpo_db: [],
      rowsXLS: [],
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
      action_message: null,
      action_status: null,
      collapse_add_child: false,
      creation_lmr_child_form: [],
      Dataform: {
        Plant: "",
        Request_Type: "",
        PO_Number: "",
        PO_Item: "",
        PO_Price: "",
        PO_Qty: "",
        Required_GR_Qty: "",
        DN_No: "",
        WCN_Link: "",
        Item_Status: "",
        Work_Status: "",
      },
      ChildForm: [],
    };
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.postGRChild = this.postGRChild.bind(this);

    this.toggleAddChild = this.toggleAddChild.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.deleteGR = this.deleteGR.bind(this);
    this.addLMR = this.addLMR.bind(this);
    this.toggleaddGR = this.toggleaddGR.bind(this);
    this.createLMRChild = this.createLMRChild.bind(this);
    this.handleChangeFormLMRChildMultiple = this.handleChangeFormLMRChildMultiple.bind(
      this
    );
    this.addGR = this.addGR.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  addGR() {
    this.setState({
      ChildForm: this.state.ChildForm.concat([
        {
          Plant: "MY",
          Request_Type: "",
          PO_Number: "",
          PO_Item: "",
          PO_Price: "",
          PO_Qty: "",
          Required_GR_Qty: "",
          DN_No: "",
          WCN_Link: "",
          Item_Status: "Waiting for GR",
          Work_Status: "Submit",
        },
      ]),
    });
  }

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleCollapse() {
    this.setState({ collapse_add_child: !this.state.collapse_add_child });
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggleAddChild() {
    this.setState((prevState) => ({
      modalAddChild: !prevState.modalAddChild,
    }));
  }

  checkValue(props) {
    // if value undefined return null
    if (typeof props === "undefined") {
      return null;
    } else {
      return props;
    }
  }

  async getDatafromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  async postDatatoAPINODE(url, data) {
    try {
      let respond = await axios.post(API_URL_NODE + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        // console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      // console.log("respond Post Data err", err);
      return respond;
    }
  }

  async patchDatatoAPINODE(url, data) {
    try {
      let respond = await axios.patch(API_URL_NODE + url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  async deleteDatafromAPINODE(url) {
    try {
      let respond = await axios.delete(API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  fileHandlerMaterial = (input) => {
    const file = input.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    console.log("rABS");
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

  ArrayEmptytoNull(dataXLS) {
    let newDataXLS = [];
    for (let i = 0; i < dataXLS.length; i++) {
      let col = [];
      for (let j = 0; j < dataXLS[0].length; j++) {
        if (typeof dataXLS[i][j] === "object") {
          let dataObject = this.checkValue(JSON.stringify(dataXLS[i][j]));
          if (dataObject !== null) {
            dataObject = dataObject.replace(/"/g, "");
          }
          col.push(dataObject);
        } else {
          col.push(this.checkValue(dataXLS[i][j]));
        }
      }
      if (i === 0) {
        col.push("id_lmr_doc");
      } else {
        col.push(this.props.match.params.id);
      }
      newDataXLS.push(col);
    }
    this.setState({
      rowsXLS: newDataXLS,
    });
  }

  getLMRDetailData(_id) {
    this.getDatafromAPINODE("/aspassignment/getGrByLmrChild/" + _id).then(
      (res) => {
        // console.log('cpo db id', res.data.data.cpoDetail)
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState({ lmr_detail: dataLMRDetail});
        }
        console.log('gr data', this.state.lmr_detail)
      }
    );
  }

  getLMRlvl2(_id) {
    this.getDatafromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        // console.log('cpo db id', res.data.data.cpoDetail)
        if (res.data !== undefined) {
          const datalvl2 = res.data.data;
          this.setState({ lmr_lvl2: datalvl2});
        }
        // console.log('gr data', this.state.lmr_detail)
      }
    );
  }

  getPRPO(_id ){
    this.getDatafromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState({ data_prpo: dataLMRDetail });
        }
      }
    );
  }


  addLMRChildBulk = async () => {
    this.toggleLoading();
    const childbulkXLS = this.state.rowsXLS;
    const _id = this.props.match.params.id;
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createChild",
      { asp_data: childbulkXLS }
    );
    if (
      respondSaveLMRChild.data !== undefined &&
      respondSaveLMRChild.status >= 200 &&
      respondSaveLMRChild.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        respondSaveLMRChild.response !== undefined &&
        respondSaveLMRChild.response.data !== undefined &&
        respondSaveLMRChild.response.data.error !== undefined
      ) {
        if (respondSaveLMRChild.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error.message
            ),
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error
            ),
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  };

  exportCPODetail = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataCPO = this.state.data_cpo;

    ws.addRow(["PO Number", dataCPO.PO_Number]);
    ws.addRow(["Payment Terms", dataCPO.payment_terms]);
    ws.addRow(["Currency", dataCPO.currency]);
    ws.addRow(["Contract", dataCPO.contract]);
    ws.addRow(["Contact", dataCPO.contact]);

    ws.addRow([""]);

    ws.addRow([
      "Description",
      "MM ID",
      "Need By Date",
      "Qty",
      "Unit",
      "Price",
      "Total Price",
      "Match Status",
    ]);
    this.state.data_cpo_db.map((e) =>
      ws.addRow([
        e.description,
        e.mmid,
        e.need_by_date,
        e.qty,
        e.unit,
        e.price,
        e.total_price,
        e.match_status,
      ])
    );

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "CPO " + dataCPO.PO_Number + " Detail.xlsx");
  };

  exportFormatCPO_level2 = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow([
      "config_id",
      "description",
      "mm_id",
      "need_by_date",
      "qty",
      "unit",
      "price",
    ]);
    ws.addRow([
      "INSTALL:CONFIG SERVICE 11_1105A",
      "3416315 |  INSTALL:CONFIG SERVICE 11_1105A  | YYYY:2019 | MM:12",
      "desc",
      "2020-08-21",
      1,
      "Performance Unit",
      1000000,
    ]);
    ws.addRow([
      "Cov_2020_Config-4a",
      "330111 | Cov_2020_Config-4a | YYYY : 2020 | MM : 04",
      "desc",
      "2020-12-12",
      200,
      "Performance Unit",
      15000000,
    ]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "CPO Level 2 Template.xlsx");
  };

  exportFormatCPO_level2 = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow([
      "config_id",
      "description",
      "mm_id",
      "need_by_date",
      "qty",
      "unit",
      "price",
    ]);
    ws.addRow([
      "INSTALL:CONFIG SERVICE 11_1105A",
      "3416315 |  INSTALL:CONFIG SERVICE 11_1105A  | YYYY:2019 | MM:12",
      "desc",
      "2020-08-21",
      1,
      "Performance Unit",
      1000000,
    ]);
    ws.addRow([
      "Cov_2020_Config-4a",
      "330111 | Cov_2020_Config-4a | YYYY : 2020 | MM : 04",
      "desc",
      "2020-12-12",
      200,
      "Performance Unit",
      15000000,
    ]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "CPO Level 2 Template.xlsx");
  };

  exportFormatCPO_level2Update = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow([
      "config_id",
      "description",
      "mm_id",
      "need_by_date",
      "qty",
      "unit",
      "price",
    ]);
    this.state.data_cpo_db.map((e) =>
      ws.addRow([
        e.config_id,
        e.description,
        e.mmid,
        e.need_by_date,
        e.qty,
        e.unit,
        e.price,
      ])
    );

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "CPO Level 2 Template.xlsx");
  };

  async postGRChild() {
    const dataChild = this.state.ChildForm;
    // const dataChild = {
    //   Plant: dataForm.Plant,
    //   Request_Type: dataForm.Request_Type,
    //   PO_Number: dataForm.PO_Number,
    //   PO_Item: dataForm.PO_Item,
    //   PO_Price: dataForm.PO_Price,
    //   PO_Qty: dataForm.PO_Qty,
    //   Required_GR_Qty: dataForm.Required_GR_Qty,
    //   DN_No: dataForm.DN_No,
    //   WCN_Link: dataForm.WCN_Link,
    //   Item_Status: dataForm.Item_Status,
    //   Work_Status: dataForm.Work_Status,
    // };
    console.log("dataChild", dataChild);
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createGrForm/" + this.props.match.params.lmr,
      { gr_data: dataChild }
    );
    if (
      respondSaveLMRChild.data !== undefined &&
      respondSaveLMRChild.status >= 200 &&
      respondSaveLMRChild.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        respondSaveLMRChild.response !== undefined &&
        respondSaveLMRChild.response.data !== undefined &&
        respondSaveLMRChild.response.data.error !== undefined
      ) {
        if (respondSaveLMRChild.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error.message
            ),
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error
            ),
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  downloadFormatNewChild = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataCPO = this.state.cpo_all;

    let headerRow = [
      "nw",
      "activity",
      "material",
      "description",
      "site_id",
      "qty",
      "unit_price",
      "tax_code",
      "delivery_date",
      "total_price",
      "total_value",
      "currency",
    ];
    ws.addRow(headerRow);

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "New Format Child.xlsx");
  };

  componentDidMount() {
    // console.log("getLMRDetailData ", this.props.match.params.id);
    if (this.props.match.params.lmr === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.lmr);
      this.getLMRlvl2(this.props.match.params.id);

    }
    document.title = "LMR Detail | BAM";
  }

  handleInput(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState(
      (prevState) => ({
        Dataform: {
          ...prevState.Dataform,
          [name]: value,
        },
      }),
      () => console.log(this.state.Dataform)
    );
  }

  handleInputchild = (idx) => (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const newChild = this.state.ChildForm.map((child_data, sidx) => {
      if (idx !== sidx) return child_data;
      return { ...child_data, [name]: value, [name]: value, [name]: value };
    });

    this.setState(
      {
        ChildForm: newChild,
      },
      () => console.log(this.state.ChildForm)
    );
  };


  async deleteGR(e) {
    this.toggleLoading();
    const value = e.currentTarget.value;
    const respondDelLMRChild = await this.deleteDatafromAPINODE(
      "/aspassignment/deleteGr/" + value
    );
    if (
      respondDelLMRChild.data !== undefined &&
      respondDelLMRChild.status >= 200 &&
      respondDelLMRChild.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        respondDelLMRChild.response !== undefined &&
        respondDelLMRChild.response.data !== undefined &&
        respondDelLMRChild.response.data.error !== undefined
      ) {
        if (respondDelLMRChild.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondDelLMRChild.response.data.error.message
            ),
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondDelLMRChild.response.data.error
            ),
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  }

  addLMR() {
    let dataLMR = this.state.creation_lmr_child_form;
    dataLMR.push({});
    this.setState({ creation_lmr_child_form: dataLMR });
  }

  toggleaddGR() {
    this.setState((prevState) => ({
      modalAddChild: !prevState.modalAddChild,
    }));
  }

  handleChangeFormLMRChildMultiple(e) {
    let dataLMR = this.state.creation_lmr_child_form;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];
    dataLMR[parseInt(idx)][field] = value;
    this.setState({ creation_lmr_child_form: dataLMR });
  }

  async createLMRChild() {
    this.toggleLoading();
    const dataChildForm = this.state.creation_lmr_child_form;
    let dummryRow = [];
    let headerRow = [
      "nw",
      "activity",
      "material",
      "description",
      "site_id",
      "qty",
      "unit_price",
      "tax_code",
      "delivery_date",
      "total_price",
      "total_value",
      "currency",
      "pr",
      "item",
      "id_lmr_doc",
    ];
    dummryRow.push(headerRow);
    for (let i = 0; i < dataChildForm.length; i++) {
      let rowChild = [
        dataChildForm[i].so_or_nw,
        dataChildForm[i].activity,
        dataChildForm[i].material,
        dataChildForm[i].description,
        dataChildForm[i].site_id,
        parseFloat(dataChildForm[i].quantity),
        parseFloat(dataChildForm[i].price),
        dataChildForm[i].tax_code,
        dataChildForm[i].delivery_date,
        parseFloat(dataChildForm[i].total_price),
        parseFloat(dataChildForm[i].total_value),
        dataChildForm[i].currency,
        dataChildForm[i].pr,
        parseFloat(dataChildForm[i].item),
        this.props.match.params.id,
      ];
      dummryRow.push(rowChild);
    }
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createChild",
      { asp_data: dummryRow }
    );
    if (
      respondSaveLMRChild.data !== undefined &&
      respondSaveLMRChild.status >= 200 &&
      respondSaveLMRChild.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        respondSaveLMRChild.response !== undefined &&
        respondSaveLMRChild.response.data !== undefined &&
        respondSaveLMRChild.response.data.error !== undefined
      ) {
        if (respondSaveLMRChild.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error.message
            ),
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(
              respondSaveLMRChild.response.data.error
            ),
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
    console.log("dummryRow", JSON.stringify(dummryRow));
  }

  render() {
    const Dataform = this.state.Dataform;
    return (
      <div>
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2", fontSize: "17px" }}>
                  {" "}
                  GR Detail{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown
                      isOpen={this.state.dropdownOpen[0]}
                      toggle={() => {
                        this.toggle(0);
                      }}
                    >
                      <DropdownToggle caret color="light">
                        Download Template
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>File</DropdownItem>
                        <DropdownItem onClick={this.downloadFormatNewChild}>
                          {" "}
                          New LMR Child Format
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  {/* <Button color="success" size="sm" onClick={this.toggleaddGR}>
                    <i className="fa fa-wpforms" aria-hidden="true">
                      {" "}
                    </i>{" "}
                    &nbsp;Create GR
                  </Button> */}
                </div>
              </CardHeader>
              <Collapse isOpen={this.state.collapse_add_child}>
                <Card style={{ margin: "10px 10px 5px 10px" }}>
                  <CardBody>
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
                  </CardBody>
                  <CardFooter>
                    <Button
                      color="success"
                      size="sm"
                      disabled={this.state.rowsXLS.length === 0}
                      onClick={this.addLMRChildBulk}
                    >
                      {" "}
                      <i className="fa fa-save" aria-hidden="true">
                        {" "}
                      </i>{" "}
                      &nbsp;Add Child{" "}
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      style={{ float: "right" }}
                      onClick={this.toggleAddChild}
                    >
                      {" "}
                      <i className="fa fa-wpforms" aria-hidden="true">
                        {" "}
                      </i>{" "}
                      &nbsp;Form{" "}
                    </Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody className="card-UploadBoq">
                <Row>
                  <Col sm="12" md="12">
                    <table style={{ width: "100%", marginBottom: "0px" }}>
                      <tbody>
                        <tr style={{ fontWeight: "425", fontSize: "23px" }}>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              marginBottom: "10px",
                              fontWeight: "500",
                            }}
                          >
                            GR Detail
                          </td>
                        </tr>
                        {/* <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              marginBottom: "10px",
                              fontWeight: "500",
                            }}
                          >
                            LMR ID : {this.state.lmr_detail.LMR_Number}
                          </td>
                        </tr> */}
                        {this.state.data_cpo !== null && (
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td
                              colSpan="2"
                              style={{
                                textAlign: "center",
                                marginBottom: "10px",
                                fontWeight: "500",
                              }}
                            >
                              PO Number : {this.state.data_cpo.PO_Number}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <hr
                      style={{
                        borderStyle: "double",
                        borderWidth: "0px 0px 3px 0px",
                        borderColor: " rgba(174,213,129 ,1)",
                        marginTop: "5px",
                      }}
                    ></hr>
                  </Col>
                </Row>
                <div style={{ padding: "10px", fontSize: "15px" }}>
                  <Row>
                    <Col sm="6" md="6">
                      <table className="table-header">
                        <tbody>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td
                              colSpan="4"
                              style={{
                                textAlign: "center",
                                marginBottom: "10px",
                                fontWeight: "500",
                              }}
                            >
                              <b>GR INFORMATION</b>
                            </td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>LMR ID</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.lmr_id}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Project</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.project_name}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Vendor</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.vendor_name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </div>

                <div class="divtable">
                  <Table hover bordered responsive size="sm" >
                    <thead class="table-commercial__header">
                      <tr>
                        <th></th>
                        <th>Plant</th>
                        <th style={{width: '12%'}}>Request Type</th>
                        <th>PO Number</th>
                        <th>PO Item</th>
                        <th>PO Price</th>
                        <th>PO Qty</th>
                        <th>Required GR Qty</th>
                        <th>DN No</th>
                        <th>WCN_Link</th>
                        <th style={{width: '12%'}}>Item_Status</th>
                        <th>Work_Status</th>
                        {/* <th>Error_Message</th>
                        <th>Error_Type</th>
                        <th>Total_GR_Qty</th>
                        <th>GR_Document_No</th>
                        <th>GR_Document_Date</th>
                        <th>GR_Document_Qty</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.lmr_detail !== undefined ? (
                        this.state.lmr_detail.map((e) => (
                          <tr>
                            <td>
                              <Button
                                color="danger"
                                size="sm"
                                value={e._id}
                                onClick={this.deleteGR}
                              >
                                <i className="fa fa-eraser"></i>
                              </Button>
                            </td>
                            <td>{e.Plant}</td>
                            <td>{e.Request_Type}</td>
                            <td>{e.PO_Number}</td>
                            <td>{e.PO_Item}</td>
                            <td>{e.PO_Price}</td>
                            <td>{e.PO_Qty}</td>
                            <td>{e.Required_GR_Qty}</td>
                            <td>{e.DN_No}</td>
                            <td>{e.WCN_Link}</td>
                            <td>{e.Item_Status}</td>
                            <td>{e.Work_Status}</td>
                          </tr>
                        ))
                      ) : (
                        <Fragment></Fragment>
                      )}
                      {this.state.ChildForm.map((child_data, idx) => (
                        <tr>
                          <td></td>
                          <td>
                            <Input
                              type="text"
                              name="Plant"
                              id="Plant"
                              value={child_data.Plant}
                              onChange={this.handleInputchild(idx)}
                              readOnly
                            />
                          </td>
                          <td>
                            <Input
                              type="select"
                              name="Request_Type"
                              id="Request_Type"
                              value={child_data.Request_Type}
                              onChange={this.handleInputchild(idx)}
                              // style={{ width: "200" }}
                            >
                              {/* <option value="" disabled selected hidden>
                                Select Request Type
                              </option> */}
                              <option value="Add GR">
                                Add GR
                              </option>
                              <option value="Delete GR">
                                Delete GR
                              </option>
                            </Input>
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="PO_Number"
                              id="PO_Number"
                              value={child_data.PO_Number}
                              onChange={this.handleInputchild(idx)}
                              
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="PO_Item"
                              id="PO_Item"
                              value={child_data.PO_Item}
                              onChange={this.handleInputchild(idx)}
                              
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="PO_Price"
                              id="PO_Price"
                              value={child_data.PO_Price}
                              onChange={this.handleInputchild(idx)}
                              
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="PO_Qty"
                              id="PO_Qty"
                              value={child_data.PO_Qty}
                              onChange={this.handleInputchild(idx)}
                              
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              name="Required_GR_Qty"
                              id="Required_GR_Qty"
                              value={child_data.Required_GR_Qty}
                              onChange={this.handleInputchild(idx)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="DN_No"
                              id="DN_No"
                              value={child_data.DN_No}
                              onChange={this.handleInputchild(idx)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="WCN_Link"
                              id="WCN_Link"
                              value={child_data.WCN_Link}
                              onChange={this.handleInputchild(idx)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="Item_Status"
                              id="Item_Status"
                              value={child_data.Item_Status}
                              onChange={this.handleInputchild(idx)}
                              readOnly
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name="Work_Status"
                              id="Work_Status"
                              value={child_data.Work_Status}
                              onChange={this.handleInputchild(idx)}
                              readOnly
                            />
                          </td>
                        </tr>                        
                      ))}
                      {this.state.ChildForm.length !== 0 && (
                        <tr>
                        <td colSpan="15" style={{ textAlign: "right" }}>
                          <Button
                            color="success"
                            size="sm"
                            onClick={this.postGRChild}
                          >
                            <i
                              className="fa fa-plus-square"
                              style={{ marginRight: "8px" }}
                            ></i>
                            Save GR Child
                          </Button>
                        </td>
                      </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                <div>
                  <Button color="primary" size="sm" onClick={this.addGR}>
                    <i className="fa fa-plus">&nbsp;</i> GR Child
                  </Button>
                </div>
              </CardBody>
              <CardFooter>
                <Row></Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* Modal Loading */}
        <Modal
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm " + this.props.className + " loading-modal"}
        >
          <ModalBody>
            <div style={{ textAlign: "center" }}>
              <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>Loading ...</div>
            <div style={{ textAlign: "center" }}>System is processing ...</div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Loading */}
        <Modal
          isOpen={this.state.toggleShowGroup}
          toggle={this.showGroupToggle}
          className={"modal-sm " + this.props.className + " loading-modal"}
        >
          <ModalBody>
            <div style={{ textAlign: "center" }}>
              <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>Loading ...</div>
            <div style={{ textAlign: "center" }}>System is processing ...</div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Create LMR Child */}
        <Modal
          isOpen={this.state.modalAddChild}
          toggle={this.toggleAddChild}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggleAddChild}>Create GR</ModalHeader>
          <ModalBody>
            <div>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Plant</Label>
                      <Input
                        type="text"
                        name="Plant"
                        id="Plant"
                        value={Dataform.Plant}
                        onChange={this.handleInput}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Request Type</Label>
                      <Input
                        type="select"
                        name="Request_Type"
                        id="Request_Type"
                        value={Dataform.Request_Type}
                        onChange={this.handleInput}
                      >
                        <option value="" disabled selected hidden>
                          Select Request Type
                        </option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>PO Number</Label>
                      <Input
                        type="text"
                        name="PO_Number"
                        id="PO_Number"
                        value={Dataform.PO_Number}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>PO Item</Label>
                      <Input
                        type="text"
                        name="PO_Item"
                        id="PO_Item"
                        value={Dataform.PO_Item}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>PO Price</Label>
                      <Input
                        type="number"
                        name="PO_Price"
                        id="PO_Price"
                        value={Dataform.PO_Price}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>PO Qty</Label>
                      <Input
                        type="number"
                        name="PO_Qty"
                        id="PO_Qty"
                        value={Dataform.PO_Qty}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Requited GR Qty</Label>
                      <Input
                        type="number"
                        name="Required_GR_Qty"
                        id="Required_GR_Qty"
                        value={Dataform.Required_GR_Qty}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>DN No</Label>
                      <Input
                        type="text"
                        name="DN_No"
                        id="DN_No"
                        value={Dataform.DN_No}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>WCN Link</Label>
                      <Input
                        type="file"
                        name="WCN_Link"
                        id="WCN_Link"
                        value={Dataform.WCN_Link}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Item Status</Label>
                      <Input
                        type="text"
                        name="Item_Status"
                        id="Item_Status"
                        value={Dataform.Item_Status}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Work Status</Label>
                      <Input
                        type="text"
                        name="Work_Status"
                        id="Work_Status"
                        value={Dataform.Work_Status}
                        onChange={this.handleInput}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-success"
              style={{ float: "right", margin: "8px" }}
              color="success"
              onClick={this.postGR}
            >
              <i className="fa fa-save">&nbsp;&nbsp;</i>
              Create
            </Button>
          </ModalFooter>
        </Modal>
        {/* End Modal Create LMR Child */}
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     dataLogin: state.loginData,
//   };
// };

// export default connect(mapStateToProps)(MYASGDetail);
export default MYASGDetail;
