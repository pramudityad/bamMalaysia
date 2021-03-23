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
import { getDatafromAPIMY } from "../../helper/asyncFunction";
import { connect } from "react-redux";
import { getDatafromAPINODEFile } from "../../helper/asyncFunction";
import "./LMRMY.css";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";
class MYASGDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      // tokenUser: this.props.dataLogin.token,
      tokenUser: this.props.dataLogin.token,
      lmr_child_form: {},
      modal_loading: false,
      modalAddChild: false,
      lmr_detail: [],
      lmr_lvl2: {},
      list_pr_po: [],
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
      filter_list: "",
      change_gr: false,
      editPO_num: false,
      editPO_item: false,
      editPO_price: false,
      editPO_qty: false,
      inputFile: [],
      toggle_draft: 0,
      max_gr_qty: null,
      prev_gr_qty: null,
      sum_gr_qty_child: 0,
      qty_formula: 0,
    };
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.postGRChild = this.postGRChild.bind(this);
    this.togglechangeGR = this.togglechangeGR.bind(this);
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
    this.handlePwdKeyUp = this.keyUpHandler.bind(this, "GRqtyinput");
  }

  keyUpHandler(refName, e) {
    let value = e.target.value;
    let qty_gr_max =
      this.state.list_pr_po[0] !== undefined ? this.state.list_pr_po[0].Qty : 0;
    if (value > qty_gr_max) {
      return null;
    }
    console.log(refName, value, e);
    return value;
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
    if (this.state.list_pr_po.length !== 0) {
      this.setState({
        ChildForm: this.state.ChildForm.concat([
          {
            id_child: this.state.lmr_lvl2._id,
            Plant: "2172",
            Request_Type: "Add GR",
            PO_Number: this.state.list_pr_po[0].PO_Number,
            PO_Item: this.state.list_pr_po[0].PO_Item,
            PO_Price: this.state.list_pr_po[0].PO_Price,
            PO_Qty: this.state.list_pr_po[0].PO_Qty,
            Required_GR_Qty: "",
            DN_No: "",
            WCN_Link: "https://mas.pdb.e-dpm.com/grmenu/list/",
            created_by_gr: this.props.dataLogin.userName,
            fileDocument: [],
            Work_Status: "Waiting for GR",
            Item_Status: "Submit",
          },
        ]),
      });
    } else {
      this.setState({
        ChildForm: this.state.ChildForm.concat([
          {
            id_child: this.state.lmr_lvl2._id,
            Plant: "2172",
            Request_Type: "Add GR",
            PO_Number: "",
            PO_Item: "",
            PO_Price: "",
            PO_Qty: "",
            Required_GR_Qty: "",
            DN_No: "",
            WCN_Link: "https://mas.pdb.e-dpm.com/grmenu/list/",
            created_by_gr: this.props.dataLogin.userName,
            fileDocument: [],
            Work_Status: "Waiting for GR",
            Item_Status: "Submit",
          },
        ]),
      });
    }
  }

  deleteSSOW = (idx) => () => {
    this.setState({
      ChildForm: this.state.ChildForm.filter((s, sidx) => idx !== sidx),
    });
  };

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleCollapse() {
    this.setState({ collapse_add_child: !this.state.collapse_add_child });
  }

  togglechangeGR() {
    this.setState({ change_gr: !this.state.change_gr });
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
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
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
      let respond = await axios.post(
        process.env.REACT_APP_API_URL_NODE + url,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.tokenUser,
          },
        }
      );
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
      let respond = await axios.patch(
        process.env.REACT_APP_API_URL_NODE + url,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.tokenUser,
          },
        }
      );
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
      let respond = await axios.delete(
        process.env.REACT_APP_API_URL_NODE + url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.tokenUser,
          },
        }
      );
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
          let prev_gr_qty = dataLMRDetail.reduce(
            (n, { Required_GR_Qty }) => n + Required_GR_Qty,
            0
          );
          this.setState(
            { lmr_detail: dataLMRDetail, prev_gr_qty: prev_gr_qty },
            () => console.log("prev_gr_qty", prev_gr_qty)
          );
        }
        // console.log("gr data", this.state.lmr_detail);
      }
    );
  }

  getLMRlvl2(_id) {
    const id_lmr = this.props.match.params.lmr;
    this.getDatafromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          // const datalvl2 = res.data.data.detail;
          const datalvl2 = res.data.data.detail.find((e) => e._id === id_lmr);
          // console.log('datalvl2 ', datalvl2);
          this.setState({ lmr_lvl2: datalvl2 }, () => this.checkDraft());
        }
        console.log("lmr_lvl2", this.state.lmr_lvl2);
        this.getDataPRPO(this.props.match.params.lmr);
      }
    );
  }

  getDataPRPO(child_id) {
    getDatafromAPIMY(
      '/prpo_data?where={"id_child_doc" : "' + child_id + '"}'
    ).then((res) => {
      if (res.data !== undefined) {
        const dataLMRDetailPRPO = res.data._items;
        if (res.data._items.length !== 0) {
          this.setState(
            {
              list_pr_po: dataLMRDetailPRPO,
              max_gr_qty: dataLMRDetailPRPO[0].Qty,
            },
            () => console.log("max_gr_qty", this.state.max_gr_qty)
          );
        }
      }
    });
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
    this.toggleLoading();
    let grContainer = [];
    let fileDocument = new FormData();
    const datepost = new Date();
    const dataChild = this.state.ChildForm;
    dataChild.map((e) =>
      grContainer.push({
        Plant: e.Plant,
        Request_Type: e.Request_Type,
        PO_Number: e.PO_Number,
        PO_Item: e.PO_Item,
        PO_Price: e.PO_Price,
        PO_Qty: e.PO_Qty,
        Required_GR_Qty: e.Required_GR_Qty,
        DN_No: e.DN_No,
        WCN_Link: "https://mas.pdb.e-dpm.com/grmenu/list/",
        created_by_gr: this.props.dataLogin.userName,
        // created_by_gr: "EHAYZUX",
        Work_Status: "Waiting for GR",
        Item_Status: "Submit",
        Error_Message: "",
        Error_Type: "",
        Total_GR_Qty: null,
        GR_Document_Qty: null,
      })
    );
    for (let i = 0; i < dataChild.length; i++) {
      await fileDocument.append("fileDocument", dataChild[i]["fileDocument"]);
    }
    await fileDocument.append("gr_data", JSON.stringify(grContainer));
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createGrForm1/" + this.props.match.params.lmr,
      fileDocument
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
    setTimeout(function () {
      window.location.reload();
    }, 1500);
  }

  saveGRdraf = () => {
    let grContainer = [];
    const dataChild = this.state.ChildForm;
    dataChild.map((e) =>
      grContainer.push({
        id_child: this.state.lmr_lvl2._id,
        Plant: e.Plant,
        Request_Type: e.Request_Type,
        PO_Number: e.PO_Number,
        PO_Item: e.PO_Item,
        PO_Price: e.PO_Price,
        PO_Qty: e.PO_Qty,
        Required_GR_Qty: e.Required_GR_Qty,
        // DN_No: e.DN_No,
        WCN_Link: "https://mas.pdb.e-dpm.com/grmenu/list/",
        created_by_gr: this.props.dataLogin.userName,
        // created_by_gr: "EHAYZUX",
        Work_Status: "Waiting for GR",
        Item_Status: "Submit",
        Error_Message: "",
        Error_Type: "",
        Total_GR_Qty: null,
        GR_Document_Qty: null,
      })
    );
    const params_gr_save =
      this.state.lmr_lvl2.lmr_id +
      " /// " +
      this.state.lmr_lvl2.cdid +
      " /// " +
      this.state.lmr_lvl2._id;
    localStorage.setItem(params_gr_save, JSON.stringify(dataChild));
    console.log(JSON.parse(localStorage.getItem(params_gr_save)));
    this.setState({
      action_status: "success",
      action_message: "GR " + params_gr_save + " saved as draft",
    });
  };

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

  checkDraft() {
    const params_gr_save =
      this.state.lmr_lvl2.lmr_id +
      " /// " +
      this.state.lmr_lvl2.cdid +
      " /// " +
      this.state.lmr_lvl2._id;
    const draft_gr = JSON.parse(localStorage.getItem(params_gr_save));
    draft_gr !== null
      ? this.setState(
          {
            ChildForm: draft_gr,
          },
          () => console.log(this.state.ChildForm)
        )
      : this.setState({ ChildForm: [] });
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

  disableGR_save = (qty_formula_) => {
    if (qty_formula_ > this.state.max_gr_qty) {
      this.setState({ toggle_draft: 0 });
    } else {
      this.setState({ toggle_draft: 1 });
    }
  };

  checkQTY_GR = () => {
    let after_gr2 = this.state.ChildForm.map((qty) =>
      parseFloat(qty.Required_GR_Qty)
    );
    let sum_after2 = after_gr2.reduce((a, b) => a + b, 0);
    this.setState({ sum_gr_qty_child: sum_after2 });
    let qty_formula = sum_after2 + this.state.prev_gr_qty;
    this.setState({ qty_formula: qty_formula }, () =>
      this.disableGR_save(qty_formula)
    );
  };

  handleInputchild = (idx) => (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (name === "Required_GR_Qty") {
      const newChild = this.state.ChildForm.map((child_data, sidx) => {
        if (idx !== sidx) return child_data;
        return { ...child_data, [name]: value };
      });
      this.setState(
        {
          ChildForm: newChild,
          // toggle_draft: 2,
        },
        () => this.checkQTY_GR()
      );
      if (this.state.qty_formula < this.state.max_gr_qty) {
        // console.log("qty_formula", this.state.qty_formula);
        this.setState({
          action_status: null,
        });
      } else {
        this.setState({
          action_status: "warning",
          action_message:
            "Required GR Qty is exceeded GR QTY " + this.state.max_gr_qty,
        });
      }
    } else {
      const newChild = this.state.ChildForm.map((child_data, sidx) => {
        if (idx !== sidx) return child_data;
        return { ...child_data, [name]: value };
      });
      this.setState(
        {
          ChildForm: newChild,
        },
        () => console.log(this.state.ChildForm)
      );
    }
  };

  async deleteGR(e) {
    // this.toggleLoading();
    const _id = e.currentTarget.value;
    const Data = this.state.lmr_detail.find((e) => e._id === _id);
    console.log("Data ", Data);
    const grdata = {
      _id: Data._id,
      ID_LMR_Doc: Data.ID_LMR_Doc,
      Plant: Data.Plant,
      Request_Type: "Delete GR",
      PO_Number: Data.PO_Number,
      PO_Item: Data.PO_Item,
      PO_Price: Data.PO_Price,
      PO_Qty: Data.PO_Qty,
      Required_GR_Qty: Data.Required_GR_Qty,
      DN_No: Data.DN_No,
      WCN_Link: Data.WCN_Link,
      Item_Status: "Stand By",
      Work_Status: "Stand By",
    };
    const respondDelLMRChild = await this.patchDatatoAPINODE(
      "/aspassignment/UpdateGr",
      { data: [grdata] }
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
    // this.toggleLoading();
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

  editPO_num = () => {
    this.setState({ editPO_num: true });
  };

  editPO_item = () => {
    this.setState({ editPO_item: true });
  };

  editPO_price = () => {
    this.setState({ editPO_price: true });
  };

  editPO_qty = () => {
    this.setState({ editPO_qty: true });
  };

  getGRFile = async (e) => {
    const i = e.target.name;
    const id = e.target.value;
    console.log(i, id);
    const data_gr = this.state.lmr_detail;
    console.log(data_gr[i]);
    if (data_gr[i] !== undefined) {
      const resFile = await getDatafromAPINODEFile(
        "/aspassignment/getDocumentGr/" +
          id +
          "/sn/" +
          data_gr[i].file_document[0].system_name,
        this.props.dataLogin.token,
        data_gr[i].file_document[0].mime_type
      );
      if (resFile !== undefined) {
        saveAs(
          new Blob([resFile.data], {
            type: data_gr[i].file_document[0].mime_type,
          }),
          data_gr[i].file_document[0].file_name
        );
      }
    }
    e.preventDefault();
    e.persist();
  };

  render() {
    const Dataform = this.state.Dataform;
    return (
      <div>
        <Row className="row-alert-fixed">
          <Col xs="12" lg="12">
            <DefaultNotif
              actionMessage={this.state.action_message}
              actionStatus={this.state.action_status}
            />
          </Col>
        </Row>
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2", fontSize: "17px" }}>
                  {" "}
                  GR Detail{" "}
                </span>
                {/* <div
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
                  <Button
                    color="warning"
                    size="sm"
                    onClick={this.togglechangeGR}
                  >
                    <i className="fa fa-wpforms" aria-hidden="true">
                      {" "}
                    </i>{" "}
                    &nbsp;Change GR
                  </Button>
                </div> */}
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
                            <td>CD_ID</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.cdid}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Site ID</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.site_id}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>SO # /NW #</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.nw}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Activity</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.activity}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Tax Code</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.tax_code}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col sm="6" md="6">
                      <table className="table-header">
                        <tbody>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Material</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.material}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Description</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.description}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Price</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.unit_price}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Quantity</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.qty}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Total Price</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.total_value}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Currency</td>
                            <td>:</td>
                            <td>{this.state.lmr_lvl2.currency}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </div>

                <div class="divtable">
                  <Table hover bordered responsive size="sm">
                    <thead class="table-commercial__header">
                      <tr>
                        {this.state.ChildForm.length !== 0 ? <th></th> : ""}
                        <th>Plant</th>
                        <th>Request Type</th>
                        <th>Created by</th>
                        <th>
                          PO Number{" "}
                          {/* {this.state.ChildForm.length !== 0 ? (
                            <Button size="sm" onClick={this.editPO_num}>
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </Button>
                          ) : (
                            ""
                          )} */}
                        </th>
                        <th>
                          PO Item{" "}
                          {/* {this.state.ChildForm.length !== 0 ? (
                            <Button size="sm" onClick={this.editPO_item}>
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </Button>
                          ) : (
                            ""
                          )} */}
                        </th>
                        <th>
                          PO Price{" "}
                          {/* {this.state.ChildForm.length !== 0 ? (
                            <Button size="sm" onClick={this.editPO_price}>
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </Button>
                          ) : (
                            ""
                          )} */}
                        </th>
                        <th>
                          PO Qty{" "}
                          {/* {this.state.ChildForm.length !== 0 ? (
                            <Button size="sm" onClick={this.editPO_qty}>
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </Button>
                          ) : (
                            ""
                          )} */}
                        </th>
                        <th>GR_Document_No</th>
                        <th>Required GR Qty</th>
                        <th>DN No</th>
                        <th style={{ width: "10%" }}>File</th>
                        <th>WCN_Link</th>
                        <th>Item_Status</th>
                        <th>Work_Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.lmr_detail !== undefined ? (
                        this.state.lmr_detail.map((e, i) => (
                          <tr>
                            {this.state.change_gr !== false ? (
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
                            ) : (
                              ""
                            )}
                            {this.state.ChildForm.length !== 0 ? <td></td> : ""}
                            <td>{e.Plant}</td>
                            {/* {this.state.change_gr !== false ? <td>Edit GR</td>: <td>{e.Request_Type}</td>} */}
                            <td>{e.Request_Type}</td>
                            <td>{e.created_by_gr}</td>
                            <td>{e.PO_Number}</td>
                            <td>{e.PO_Item}</td>
                            <td>{e.PO_Price}</td>
                            <td>{e.PO_Qty}</td>
                            <td>{e.GR_Document_No}</td>
                            <td>{e.Required_GR_Qty}</td>
                            <td>{e.DN_No}</td>
                            <td>
                              <Button
                                size="sm"
                                value={e._id}
                                name={i}
                                onClick={this.getGRFile}
                              >
                                <i className="fa fa-download"></i>
                              </Button>{" "}
                              {e.file_document !== null &&
                                e.file_document !== undefined &&
                                e.file_document[0].file_name}
                            </td>
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
                          {/* <td></td> */}
                          <div>
                            <Button
                              onClick={this.deleteSSOW(idx)}
                              color="danger"
                              size="sm"
                              style={{
                                marginLeft: "5px",
                                marginTop: "5px",
                                display: "inline-block",
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </div>
                          <td>
                            <input
                              disabled
                              type="text"
                              name="Plant"
                              id="Plant"
                              value={child_data.Plant}
                              readonly
                              // style={{ backgroundColor: "#bfbfbf" }}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              type="text"
                              name="Request_Type"
                              id="Request_Type"
                              value={child_data.Request_Type}
                              readonly
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              type="text"
                              name="created_by_gr"
                              id="created_by_gr"
                              value={child_data.created_by_gr}
                              readonly
                            />
                            {/* <option value="" disabled selected hidden>
                                Select Request Type
                              </option>
                              <option value="Add GR" >
                                Add GR
                              </option>
                              <option value="Delete GR" >
                                Delete GR
                              </option>
                            </Input> */}
                          </td>
                          {this.state.editPO_num === false ? (
                            <td>
                              <input
                                // key={prpo._id}
                                disabled
                                type="text"
                                name="PO_Number"
                                id={"PO_Number"}
                                value={child_data.PO_Number}
                                readonly
                              />
                            </td>
                          ) : (
                            <td style={{ width: "10%" }}>
                              <input
                                // key={prpo._id}
                                type="text"
                                name="PO_Number"
                                id={"PO_Number"}
                                value={child_data.PO_Number}
                                onChange={this.handleInputchild(idx)}
                                // style={{ width: "10%" }}
                              />
                            </td>
                          )}
                          {this.state.editPO_item === false ? (
                            <td>
                              <input
                                disabled
                                type="text"
                                name="PO_Item"
                                id={"PO_Item"}
                                value={child_data.PO_Item}
                                // onChange={this.handleInputchild(idx)}
                                // style={{ width: "10%" }}
                                readonly
                              />
                            </td>
                          ) : (
                            <td style={{ width: "10%" }}>
                              <input
                                // key={prpo._id}
                                type="text"
                                name="PO_Item"
                                id={"PO_Item"}
                                value={child_data.PO_Item}
                                onChange={this.handleInputchild(idx)}
                                // style={{ width: "10%" }}
                              />
                            </td>
                          )}
                          {this.state.editPO_price === false ? (
                            <td>
                              <input
                                disabled
                                type="text"
                                name="PO_Price"
                                id="PO_Price"
                                // onChange={this.handleInputchild(idx)}
                                value={child_data.PO_Price}
                                // style={{ width: "10%" }}
                                readonly
                              />
                            </td>
                          ) : (
                            <td style={{ width: "10%" }}>
                              <input
                                type="text"
                                name="PO_Price"
                                id="PO_Price"
                                onChange={this.handleInputchild(idx)}
                                value={child_data.PO_Price}
                                // style={{ width: "10%" }}
                              />
                            </td>
                          )}
                          {this.state.editPO_qty === false ? (
                            <td>
                              <input
                                disabled
                                // key={prpo._id}
                                type="text"
                                name="PO_Qty"
                                id={"PO_Qty"}
                                value={child_data.PO_Qty}
                                // onChange={this.handleInputchild(idx)}
                                // style={{ width: "10%" }}
                                readonly
                              />
                            </td>
                          ) : (
                            <td style={{ width: "10%" }}>
                              <input
                                // key={prpo._id}
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                name="PO_Qty"
                                id={"PO_Qty"}
                                value={child_data.PO_Qty}
                                onChange={this.handleInputchild(idx)}
                                // style={{ width: "10%" }}
                              />
                            </td>
                          )}
                          <td style={{ width: "10%" }}>
                            <input
                              type="text"
                              disabled
                              readonly
                              name="GR_Document_No"
                              id="GR_Document_No"
                              value={child_data.GR_Document_No}
                              // onChange={this.handleInputchild(idx)}
                              // style={{ width: "10%" }}
                            />
                          </td>
                          <td style={{ width: "10%" }}>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              name="Required_GR_Qty"
                              id="Required_GR_Qty"
                              value={child_data.Required_GR_Qty}
                              onChange={this.handleInputchild(idx)}
                              // style={{ width: "10%" }}
                            />
                          </td>
                          <td style={{ width: "10%" }}>
                            <input
                              disabled
                              readonly
                              type="text"
                              name="DN_No"
                              id="DN_No"
                              value={child_data.DN_No}
                              onChange={this.handleInputchild(idx)}
                              // style={{ width: "10%" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              readonly
                              // name="fileDocument"
                              // accept="application/msword, application/pdf"
                              // // id="fileDocument"
                              // // value={child_data.fileDocument}
                              // onChange={this.handleInputchild(idx)}
                              // style={{ width: "300" }}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              readonly
                              type="text"
                              name="WCN_Link"
                              id="WCN_Link"
                              value={child_data.WCN_Link}
                              // onChange={this.handleInputchild(idx)}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              readonly
                              type="text"
                              name="Item_Status"
                              id="Item_Status"
                              value={child_data.Item_Status}
                              // onChange={this.handleInputchild(idx)}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              readonly
                              type="text"
                              name="Work_Status"
                              id="Work_Status"
                              value={child_data.Work_Status}
                              // onChange={this.handleInputchild(idx)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div>
                  {/* {this.state.change_gr !== false ? 
                  (<Button color="primary" size="sm" onClick={this.addGR}>
                  <i className="fa fa-plus">&nbsp;</i> GR Child
                </Button>) : ("")} */}
                  <Button color="primary" size="sm" onClick={this.addGR}>
                    <i className="fa fa-plus">&nbsp;</i> GR Child
                  </Button>
                  {this.state.ChildForm.length !== 0 && (
                    <Button
                      color="success"
                      size="sm"
                      onClick={this.saveGRdraf}
                      disabled={this.state.toggle_draft === 0}
                      style={{ float: "right", marginLeft: "10px" }}
                    >
                      <i className="fa fa-plus-square"></i> Save GR Child
                    </Button>
                  )}
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
                        readOnly
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
                        readOnly
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
                        readOnly
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
                        readOnly
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

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(MYASGDetail);
// export default MYASGDetail;
