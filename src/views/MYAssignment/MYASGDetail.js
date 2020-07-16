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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Pagination from "react-js-pagination";
import axios from "axios";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "./LMRMY.css";

import {
  convertDateFormatfull,
  convertDateFormat,
} from "../../helper/basicFunction";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const API_URL_MAS = "https://api-dev.mas.pdb.e-dpm.com/masapi";
const usernameMAS = "mybotprpo";
const passwordMAS = "mybotprpo2020";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameBAM = "adminbamidsuper";
const passwordBAM = "F760qbAg2sml";

// const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

// const API_URL_NODE = 'http://localhost:5012/bammyapi';
const API_URL_NODE = "https://api-dev.bam-my.e-dpm.com/bammyapi";

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";

const MaterialDB = [
  {
    "MM_Code" : "MM Code",
    "BB_Sub" : "BB_sub",
    "SoW_Description" : "SoW Description",
    "UoM" : "UoM",
    "Region" : "Region",
    "Unit_Price" : 100,
    "MM_Description" : "MM Description",
    "Acceptance" : "Acceptance"
  },
  {
    "MM_Code" : "MM Code1",
    "BB_Sub" : "BB_sub1",
    "SoW_Description" : "SoW Description1",
    "UoM" : "UoM1",
    "Region" : "Region1",
    "Unit_Price" : 200,
    "MM_Description" : "MM Description1",
    "Acceptance" : "Acceptance1"
  }
]

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
      lmr_detail: {},
      modal_material: false,
      data_cpo: null,
      data_cpo_db: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      rowsXLS: [],
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
      action_message: null,
      action_status: null,
      collapse_add_child: false,
      creation_lmr_child_form: [],
      current_material_select : null,
      material_list: [],
      list_cd_id : [],
      list_pr_po : [],
      filter_list: new Array(7).fill(""),
      change_lmr : false,
      lmr_form: {
        pgr: "MP2",
        gl_account: "402102",
        lmr_issued_by: this.props.dataUser.preferred_username,
        plant: "MY",
        customer: "CELCOM",
        request_type: "Delete LMR",
      },
    };
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);

    this.handleChangeFormLMRChild = this.handleChangeFormLMRChild.bind(this);
    this.addLMRChildForm = this.addLMRChildForm.bind(this);
    this.toggleMaterial = this.toggleMaterial.bind(this);
    this.toggleAddChild = this.toggleAddChild.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.togglechangeLMR = this.togglechangeLMR.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.addLMR = this.addLMR.bind(this);
    this.createLMRChild = this.createLMRChild.bind(this);
    this.handleChangeMaterial = this.handleChangeMaterial.bind(this);
    this.handleChangeFormLMRChildMultiple = this.handleChangeFormLMRChildMultiple.bind(
      this
    );
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  toggleMaterial(number_child_form) {
    if(number_child_form !== undefined && isNaN(number_child_form) === false){
      this.setState({current_material_select : number_child_form});
    }else{
      this.setState({current_material_select : null});
    }
    this.setState((prevState) => ({
      modal_material: !prevState.modal_material,
    }));
  }

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleCollapse() {
    this.setState({ collapse_add_child: !this.state.collapse_add_child });
  }

  // togglechangeLMR(){
  //   this.setState({ change_lmr: !this.state.change_lmr });
  // }

  async togglechangeLMR() {
    const dataForm = this.state.lmr_form;
    const dataChildForm = this.state.lmr_detail.detail;
    // console.log(this.state.creation_lmr_child_form);
    const dataLMR = {
      _id: this.props.match.params.id,
      lmr_id: this.state.lmr_detail.lmr_id,
      plant: this.state.lmr_form.plant,
      customer: this.state.lmr_form.customer,
      request_type: this.state.lmr_form.request_type,
      item_category: this.state.lmr_form.Item_Category,
      lmr_type: this.state.lmr_form.LMR_Type,
      plan_cost_reduction: this.state.lmr_form.Plan_Cost_Reduction,
      lmr_issued_by: this.state.lmr_form.lmr_issued_by,
      pgr: this.state.lmr_form.pgr,
      gl_account: this.state.lmr_form.gl_account,
      id_project_doc: this.state.lmr_form.id_project_doc,
      project_name: this.state.lmr_detail.project_name,
      header_text: this.state.lmr_form.header_text,
      payment_term: this.state.lmr_form.payment_term,
      vendor_name: this.state.lmr_form.vendor_name,
      vendor_address: this.state.lmr_form.vendor_email,
      l1_approver: this.state.lmr_form.l1_approver,
      l2_approver: this.state.lmr_form.l2_approver,
      l3_approver: this.state.lmr_form.l3_approver,
      l4_approver: this.state.lmr_form.l4_approver,
      l5_approver: this.state.lmr_form.l5_approver,
    };
    let dataLMRCHild = [];
    for (let i = 0; i < this.state.lmr_detail.detail.length; i++) {
      // const dataChild = this.state.lmr_detail.detail.map((e, i) => detail){      
      const dataChild = {
        _id: dataChildForm[i]._id,
        project_name: this.state.lmr_detail.project_name,
        nw: dataChildForm[i].so_or_nw,
        activity: dataChildForm[i].activity,
        id_project_doc: this.state.lmr_form.id_project_doc,
        material_code_doc: dataChildForm[i].material_code_doc,
        material: dataChildForm[i].material,
        description: dataChildForm[i].description,
        site_id: dataChildForm[i].site_id,
        qty: dataChildForm[i].quantity,
        unit_price: dataChildForm[i].price,
        tax_code: dataChildForm[i].tax_code,
        delivery_date: dataChildForm[i].delivery_date,
        total_price: dataChildForm[i].total_amount,
        total_value: dataChildForm[i].total_amount,
        currency: dataChildForm[i].currency,
        pr: "",
        item: 0,
        request_type: this.state.lmr_form.request_type,
        item_category: this.state.lmr_form.Item_Category,
        lmr_type: this.state.lmr_form.LMR_Type,
        plan_cost_reduction: this.state.lmr_form.Plan_Cost_Reduction,
        cdid: dataChildForm[i].cd_id,
        per_site_material_type: dataChildForm[i].Per_Site_Material_Type,
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        plant: this.state.lmr_form.plant,
        customer: this.state.lmr_form.customer,
      };
      // if (
      //   dataChildForm[i].site_id === undefined ||
      //   dataChildForm[i].site_id === null
      // ) {
        dataLMRCHild.push(dataChild);
      // }
    }
    console.log("dataLMR", dataLMR);
    console.log("dataLMRChild", dataLMRCHild);
    const respondSaveLMR = await this.patchDatatoAPINODE(
      "/aspassignment/UpdateAll", {data: [{ header: dataLMR, child: dataLMRCHild }]}
      
    );
    if (
      respondSaveLMR.data !== undefined &&
      respondSaveLMR.status >= 200 &&
      respondSaveLMR.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        respondSaveLMR.response !== undefined &&
        respondSaveLMR.response.data !== undefined &&
        respondSaveLMR.response.data.error !== undefined
      ) {
        if (respondSaveLMR.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: respondSaveLMR.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: respondSaveLMR.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
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

  async getDatafromAPIMY(url) {
    try {
      let respond = await axios.get(API_URL_MAS + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameMAS,
          password: passwordMAS,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Get Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
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

  handleChangeMaterial(e){
    const value = e.target.value;
    const data_material = this.state.material_list.find(e => e.MM_Code === value);
    let dataLMR = this.state.creation_lmr_child_form;
    dataLMR[parseInt(this.state.current_material_select)]["material_code_doc"] = data_material._id;
    dataLMR[parseInt(this.state.current_material_select)]["material"] = data_material.MM_Code;
    dataLMR[parseInt(this.state.current_material_select)]["description"] = data_material.MM_Description;
    dataLMR[parseInt(this.state.current_material_select)]["price"] = data_material.Unit_Price;
    dataLMR[parseInt(this.state.current_material_select)]["quantity"] = 0;
    this.setState({creation_lmr_child_form : dataLMR});
    this.toggleMaterial();
  }

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

  
  getMaterialList() {
    let filter_array = [];
    this.state.filter_list[0] !== "" && (filter_array.push('"MM_Code":{"$regex" : "' + this.state.filter_list[0] + '", "$options" : "i"}'));
    this.state.filter_list[1] !== "" && (filter_array.push('"Material_type":{"$regex" : "' + this.state.filter_list[1] + '", "$options" : "i"}'));
    this.state.filter_list[2] !== "" && (filter_array.push('"SoW_Description":{"$regex" : "' + this.state.filter_list[2] + '", "$options" : "i"}'));
    this.state.filter_list[3] !== "" && (filter_array.push('"UoM":{"$regex" : "' + this.state.filter_list[3] + '", "$options" : "i"}'));
    this.state.filter_list[4] !== "" && (filter_array.push('"Region":{"$regex" : "' + this.state.filter_list[4] + '", "$options" : "i"}'));
    this.state.filter_list[5] !== "" && (filter_array.push('"Unit_Price":{"$regex" : "' + this.state.filter_list[5] + '", "$options" : "i"}'));
    this.state.filter_list[6] !== "" && (filter_array.push('"MM_Description":{"$regex" : "' + this.state.filter_list[6] + '", "$options" : "i"}'));
    let whereAnd = '{' + filter_array.join(',') + '}';
    // let filter = '"mm_code":{"$regex" : "' + this.state.filter_list + '", "$options" : "i"}';
    this.getDatafromAPIMY(
      "/mm_code_data?where="+whereAnd+"&max_results=" +
        this.state.perPage +
        "&page=" +
        this.state.activePage
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        const totalData = res.data.totalResults;
        this.setState({ material_list: items, totalData: totalData });
      }
    });
  }

  handleFilterList(e) {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list;
    dataFilter[parseInt(index)] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    })
  }

  onChangeDebounced(e) {
    this.getMaterialList();
  }

  getLMRDetailData(_id) {
    this.getDatafromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState({ lmr_detail: dataLMRDetail }, () => {
            this.getDataPRPO(dataLMRDetail.lmr_id)
          });
        }
      }
    );
  }

  getDataPRPO(LMR_ID){
    this.getDatafromAPIMY('/prpo_data?where={"LMR_No" : "'+LMR_ID+'"}').then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetailPRPO = res.data._items;
          this.setState({ list_pr_po: dataLMRDetailPRPO });
        }
      }
    );
  }

  getCPO2Format = async (dataImport) => {
    const dataHeader = dataImport[0];
    const onlyParent = dataImport
      .map((e) => e)
      .filter((e) =>
        this.checkValuetoString(e[this.getIndex(dataHeader, "PO Number")])
      );
    let cpo_array = [];
    if (onlyParent !== undefined && onlyParent.length !== 0) {
      for (let i = 1; i < onlyParent.length; i++) {
        const cpo = {
          po_number: this.checkValue(
            onlyParent[i][this.getIndex(dataHeader, "PO Number")]
          ),
          po_year: this.checkValue(
            onlyParent[i][this.getIndex(dataHeader, "Year")]
          ),
          currency: this.checkValue(
            onlyParent[i][this.getIndex(dataHeader, "Currency")]
          ),
          value: this.checkValue(
            onlyParent[i][this.getIndex(dataHeader, "Price")]
          ),
          number_of_sites: this.checkValue(
            onlyParent[i][this.getIndex(dataHeader, "Number of Sites")]
          ),
        };
        if (cpo.po_number !== undefined && cpo.po_number !== null) {
          cpo["po_number"] = cpo.po_number.toString();
        }
        if (cpo.year !== undefined && cpo.year !== null) {
          cpo["po_year"] = cpo.year.toString();
        }
        if (cpo.currency !== undefined && cpo.currency !== null) {
          cpo["currency"] = cpo.currency.toString();
        }
        cpo_array.push(cpo);
      }
      // console.log(JSON.stringify(cpo_array));
      return cpo_array;
    } else {
      this.setState(
        { action_status: "failed", action_message: "Please check your format" },
        () => {
          this.toggleLoading();
        }
      );
    }
  };

  saveCPO2Bulk = async () => {
    this.toggleLoading();
    const cpobulkXLS = this.state.rowsXLS;
    const _id = this.props.match.params.id;
    const res = await this.postDatatoAPINODE(
      "/cpodb/createCpoDbDetail/" + _id,
      { detailData: cpobulkXLS }
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success", action_message: null });
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

    ws.addRow(["PO Number", dataCPO.po_number]);
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
    saveAs(new Blob([PPFormat]), "CPO " + dataCPO.po_number + " Detail.xlsx");
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

  async addLMRChildForm() {
    const dataChildForm = this.state.lmr_child_form;
    const dataChild = {
      nw: dataChildForm.so_or_nw,
      activity: dataChildForm.activity,
      material: dataChildForm.material,
      description: dataChildForm.description,
      site_id: dataChildForm.site_id,
      qty: dataChildForm.quantity,
      unit_price: dataChildForm.price,
      tax_code: dataChildForm.tax_code,
      delivery_date: dataChildForm.delivery_date,
      total_price: dataChildForm.total_price,
      total_value: dataChildForm.total_value,
      currency: dataChildForm.currency,
    };
    console.log("dataChild", dataChild);
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createOneChild/" + this.props.match.params.id,
      { asp_data: dataChild }
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
    if (this.props.match.params.id === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.id);
    }
    this.getMaterialList();
    document.title = "LMR Detail | BAM";
  }

  handleChangeFormLMRChild(e) {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_child_form = this.state.lmr_child_form;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    lmr_child_form[name.toString()] = value;
    this.setState({ lmr_child_form: lmr_child_form });
  }

  async deleteChild(e) {
    this.toggleLoading();
    const value = e.currentTarget.value;
    const respondDelLMRChild = await this.deleteDatafromAPINODE(
      "/aspassignment/deleteChild/" + value
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
    dataLMR.push({"tax_code" : "I0", "currency" : "MYR", "item_status" : "Submit", "work_status" : "Waiting for PR-PO creation"});
    this.setState({ creation_lmr_child_form: dataLMR });
    if(this.state.material_list.length === 0){
      this.getMaterialList();
    }
    if(this.state.list_cd_id.length === 0){
      this.getDataCD();
    }
  }

  // getMaterialList() {
  //   this.getDatafromAPIMY("/mm_code_data").then((res) => {
  //     if (res.data !== undefined) {
  //       const items = res.data._items;
  //       this.setState({ material_list: items });
  //     }
  //   });
  // }

  getDataCD() {
    this.getDatafromAPIMY("/cdid_data").then((resCD) => {
      if (resCD.data !== undefined) {
        this.setState({ list_cd_id: resCD.data._items });
      }
    });
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
    const dataChild = this.state.lmr_detail.detail;
    const dataChildForm = this.state.creation_lmr_child_form;
    let dummryRow = [];
    let headerRow = [
      "nw",
      "activity",
      "material_code_doc",
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
      "plant","customer","request_type","item_category","lmr_type","plan_cost_reduction","cdid","per_site_material_type","item_status","work_status",
      "id_project_doc",
      "id_lmr_doc",
    ];
    dummryRow.push(headerRow);
    for (let i = 0; i < dataChildForm.length; i++) {
      let rowChild = [
        dataChildForm[i].so_or_nw,
        dataChildForm[i].activity,
        dataChildForm[i].material_code_doc,
        dataChildForm[i].material,
        dataChildForm[i].description,
        dataChildForm[i].site_id,
        parseFloat(dataChildForm[i].quantity),
        parseFloat(dataChildForm[i].price),
        dataChildForm[i].tax_code,
        dataChildForm[i].delivery_date,
        parseFloat(dataChildForm[i].total_amount),
        parseFloat(dataChildForm[i].total_amount),
        dataChildForm[i].currency,
        "",
        0,
        "MY",
        "CELCOM",
        dataChild[0].request_type,
        dataChild[0].item_category,
        dataChild[0].lmr_type,
        dataChild[0].plan_cost_reduction,
        dataChildForm[i].cd_id,
        dataChildForm[i].Per_Site_Material_Type,
        "Submit",
        "Waiting for PR-PO creation",
        dataChild[0].id_project_doc,
        this.props.match.params.id,
      ];
      dummryRow.push(rowChild);
    }
    console.log("childNew", dummryRow);
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

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 7; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ width: '150px' }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><i className="fa fa-search"></i></InputGroupText>
              </InputGroupAddon>
              <Input type="text" placeholder="Search" onChange={this.handleFilterList} value={this.state.filter_list[i]} name={i} size="sm" />
            </InputGroup>
          </div>
        </td>
      )
    }
    return searchBar;
  }

  render() {
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
                  LMR Detail{" "}
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
                  <Button
                    block
                    color="success"
                    size="sm"
                    onClick={this.toggleCollapse}
                    id="toggleCollapse2"
                  >
                    Add Child
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button color="danger" size="sm" onClick={this.togglechangeLMR}>
                  <i className="fa fa-eraser">
                      {" "}
                    </i>{" "}
                    &nbsp;Delete LMR
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Link to={
                                  "/lmr-edit/" +
                                  this.props.match.params.id
                                }>
                  <Button color="warning" size="sm">
                    <i className="fa fa-wpforms" aria-hidden="true">
                      {" "}
                    </i>{" "}
                    &nbsp;Change LMR
                  </Button>
                  </Link>                  
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
                    {/* <Button color="success" size="sm" style={{float : 'right'}} onClick={this.toggleAddChild}> <i className="fa fa-wpforms" aria-hidden="true"> </i> &nbsp;Form </Button> */}
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
                            LMR Detail
                          </td>
                        </tr>
                        <tr style={{ fontWeight: "425", fontSize: "17px" }}>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              marginBottom: "10px",
                              fontWeight: "500",
                            }}
                          >
                            LMR ID : {this.state.lmr_detail.lmr_id}
                          </td>
                        </tr>
                        <tr style={{ fontWeight: "425", fontSize: "12px" }}>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              marginBottom: "10px",
                              fontWeight: "500",
                            }}
                          >
                            CU : MY
                          </td>
                        </tr>
                        <tr style={{ fontWeight: "425", fontSize: "12px" }}>
                          <td
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              marginBottom: "10px",
                              fontWeight: "500",
                            }}
                          >
                            Customer : CELCOM
                          </td>
                        </tr>
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
                <div style={{ padding: "10px", fontSize: "15px", marginBottom : '10px' }}>
                  <Row>
                    <Col sm="7" md="7">
                      <table className="table-header">
                        <tbody>
                          {/* <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td
                              colSpan="4"
                              style={{
                                textAlign: "center",
                                marginBottom: "10px",
                                fontWeight: "500",
                              }}
                            >
                              LMR INFORMATION
                            </td>
                          </tr> */}
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td style={{ width: "150px" }}>Payment Terms </td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.payment_term}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>GL Account</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.gl_account}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Vendor</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.vendor_name}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Project</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.project_name}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Header Text</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.header_text}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col sm="5" md="5">
                      <table className="table-header">
                        <tbody>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Requisitioner</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.lmr_issued_by}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td style={{ width: "150px" }}>L1 Approver </td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.l1_approver}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>L2 Approver</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.l2_approver}</td>
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>L3 Approver</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.l3_approver}</td>
                          </tr><tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Request Type</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.request_type}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </div>

                <div class="divtable">
                  <Table hover bordered responsive size="sm" width="100%">
                    <thead class="table-commercial__header">
                      <tr>
                        <th style={{width: '70%'}}></th>
                        <th>CD_ID</th>
                        <th>Per Site Material Type</th>
                        <th>Site ID</th>
                        <th>SO # /NW #</th>
                        <th>Activity</th>
                        <th>Tax Code</th>
                        <th>Material #</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Currency</th>
                        <th>Delivery Date</th>
                        <th>Item Status</th>
                        <th>Work Status</th>
                        <th>PO Number</th>
                        <th>PO Item</th>
                        <th>PO Qty</th>
                        <th>Error Message</th>
                        <th>Error Type</th>
                        <th></th>                      
                        {/* }<th>PR</th>
                        <th>PO</th>
                        <th>PO Item</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.lmr_detail.detail !== undefined ? (
                        this.state.lmr_detail.detail.map((e) => (
                          <tr>
                            <td>
                              <Link
                                to={
                                  "/lmr-detail/" +
                                  this.props.match.params.id +
                                  "/gr-detail/" +
                                  e._id
                                }
                              >
                                <Button color="info" size="sm">
                                <i className="fa fa-info-circle" aria-hidden="true">&nbsp;</i>&nbsp;GR
                                </Button>
                              </Link>
                            </td>
                            <td>{e.cdid}</td>
                            <td>{e.per_site_material_type }</td>
                            <td>{e.site_id}</td>
                            <td>{e.nw}</td>
                            <td>{e.activity}</td>
                            <td>{e.tax_code}</td>
                            <td>{e.material}</td>
                            <td>{e.description}</td>
                            <td>{e.unit_price}</td>
                            <td>{e.qty}</td>
                            <td>{e.total_value}</td>
                            <td>{e.currency}</td>
                            <td>{convertDateFormat(e.delivery_date)}</td>
                            {this.state.list_pr_po.find(f=> f.id_child_doc === e._id) !== undefined ? (
                              <React.Fragment>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).Item_Status }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).Work_Status }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).PO_Number }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).PO_Item }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).PO_Qty }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).Error_Message }</td>
                              <td>{this.state.list_pr_po.find(f=> f.id_child_doc === e._id).Error_Type }</td>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              </React.Fragment>
                            )}
                            {this.state.change_lmr !== true ? (
                              <td></td>
                            ): (<td>
                              {/* <Button
                                color="danger"
                                size="sm"
                                value={e._id}
                                onClick={this.deleteChild}
                              >
                                <i className="fa fa-eraser"></i>
                              </Button> */}
                            </td> )}
                                                  
                            {/*}<td>{e.pr}</td>
                          <td>{e.po}</td>
                          <td>{e.item}</td>*/}
                          </tr>
                        ))
                      ) : (
                        <Fragment></Fragment>
                      )}
                      <tr>
                        <td colSpan="22" style={{ textAlign: "left" }}>
                          {this.state.change_lmr !== false ? (<Button
                            color="primary"
                            size="sm"
                            onClick={this.addLMR}
                          >
                            <i className="fa fa-plus">&nbsp;</i> LMR CHild
                          </Button>):("")}
                          
                        </td>
                      </tr>
                      {this.state.creation_lmr_child_form.map((lmr, i) => (
                        <tr className="form-lmr-child">
                          <td></td>
                          {/* <td></td> */}
                          <td>
                            <Input
                              type="select"
                              name={i + " /// cd_id"}
                              id={i + " /// cd_id"}
                              value={lmr.cd_id}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            >
                              <option value="" disabled selected hidden>
                                Select CD ID
                              </option>
                              {this.state.list_cd_id.map(e => 
                                <option value={e.CD_ID}>{e.CD_ID}</option>
                              )}
                            </Input>
                          </td>
                          <td>
                            <Input
                              type="select"
                              name={i + " /// Per_Site_Material_Type"}
                              id={i + " /// Per_Site_Material_Type"}
                              value={lmr.Per_Site_Material_Type}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            >
                              <option value="" disabled selected hidden>
                                Select Material Type
                              </option>
                              <option value="NRO Service">NRO Service</option>
                              <option value="NRO LM">NRO LM</option>
                              <option value="NDO Service">NDO Service</option>
                            </Input>
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// site_id"}
                            id={i + " /// site_id"}
                            value={lmr.site_id}
                              placeholder="Site ID"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// so_or_nw"}
                            id={i + " /// so_or_nw"}
                            value={lmr.so_or_nw}
                              placeholder="SO # /NW #"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// activity"}
                            id={i + " /// activity"}
                            value={lmr.activity}
                              placeholder="Activity"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// tax_code"}
                            id={i + " /// tax_code"}
                            value={lmr.tax_code}
                              placeholder="Tax Code"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// material"}
                            id={i + " /// material"}
                            value={lmr.material}
                              placeholder="Material"
                              onClick={() => this.toggleMaterial(i)}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="textarea"
                              name={i + " /// description"}
                            id={i + " /// description"}
                            value={lmr.description}
                              placeholder="Description"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              style={{ width: "200px" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              name={i + " /// price"}
                            id={i + " /// price"}
                            value={lmr.price}
                              placeholder="Price"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              name={i + " /// quantity"}
                              id={i + " /// quantity"}
                              placeholder="QTY"
                              value={lmr.quantity}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              style={{ width: "75px" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="number"
                              name={i + " /// total_amount"}
                            id={i + " /// total_amount"}
                              placeholder="Total Price"
                              value={lmr.total_amount}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              type="select"
                              name={i + " /// currency"}
                            id={i + " /// currency"}
                              placeholder="Currency"
                              value={lmr.currency}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            >
                              <option value="MYR" selected >
                            MYR
                          </option>
                          <option value="USD" >
                            USD
                          </option>
                          <option value="EUR" >
                            EUR
                          </option>
                        </Input>
                          </td>
                          <td>
                            <Input
                              type="date"
                              name={i + " /// delivery_date"}
                              id={i + " /// delivery_date"}
                              placeholder="Delivery Date"
                              value={lmr.delivery_date}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              style={{ width: "100%" }}
                            />
                          </td>
                          {/* <td>
                            <Input
                              type="text"
                              name={i + " /// item_status"}
                              id={i + " /// item_status"}
                              placeholder="Item Status"
                              value={lmr.item_status}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                              readOnly
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// work_status"}
                              id={i + " /// work_status"}
                              placeholder="Work Status"
                              value={lmr.work_status}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                              readOnly
                            />
                          </td> */}
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          {/*  */}                          
                        </tr>
                      ))}
                      {this.state.creation_lmr_child_form.length !== 0 && (
                        <Fragment>
                          {/* <tr>
                            <td colSpan="15" style={{ textAlign: "right" }}>
                              &nbsp;
                            </td>
                          </tr> */}
                          <tr>
                            <td colSpan="22" style={{ textAlign: "right" }}>
                              <Button
                                color="success"
                                size="sm"
                                onClick={this.createLMRChild}
                              >
                                <i
                                  className="fa fa-plus-square"
                                  style={{ marginRight: "8px" }}
                                ></i>
                                Save LMR Child
                              </Button>
                            </td>
                          </tr>
                        </Fragment>
                      )}
                    </tbody>
                  </Table>
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

        {/* Modal Create LMR Child */}
        <Modal
          isOpen={this.state.modalAddChild}
          toggle={this.toggleAddChild}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={this.toggleAddChild}>LMR Child</ModalHeader>
          <ModalBody>
            <div>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>SO / NW</Label>
                      <Input
                        type="text"
                        name="so_or_nw"
                        id="so_or_nw"
                        value={this.state.lmr_child_form.so_or_nw}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Activity</Label>
                      <Input
                        type="text"
                        name="activity"
                        id="activity"
                        value={this.state.lmr_child_form.activity}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Material</Label>
                      <Input
                        type="text"
                        name="material"
                        id="material"
                        value={this.state.lmr_child_form.material}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        value={this.state.lmr_child_form.description}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Site ID</Label>
                      <Input
                        type="text"
                        name="site_id"
                        id="site_id"
                        value={this.state.lmr_child_form.site_id}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={this.state.lmr_child_form.quantity}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                  {/*}<Col md={6}>
                    <FormGroup>
                      <Label>Unit</Label>
                      <Input type="text" name="item" id="item" value={this.state.lmr_child_form.item} onChange={this.handleChangeFormLMRChild}/>
                    </FormGroup>
                  </Col> */}
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name="price"
                        id="price"
                        value={this.state.lmr_child_form.price}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Tax Code</Label>
                      <Input
                        type="text"
                        name="tax_code"
                        id="tax_code"
                        value={this.state.lmr_child_form.tax_code}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Delivery Date</Label>
                      <Input
                        type="date"
                        name="delivery_date"
                        id="delivery_date"
                        value={this.state.lmr_child_form.delivery_date}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Total Price</Label>
                      <Input
                        type="number"
                        name="total_price"
                        id="total_price"
                        value={this.state.lmr_child_form.total_price}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Total Value</Label>
                      <Input
                        type="number"
                        name="total_value"
                        id="total_value"
                        value={this.state.lmr_child_form.total_value}
                        onChange={this.handleChangeFormLMRChild}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input
                        type="text"
                        name="currency"
                        id="currency"
                        value={this.state.lmr_child_form.currency}
                        onChange={this.handleChangeFormLMRChild}
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
              onClick={this.addLMRChildForm}
            >
              <i className="fa fa-save">&nbsp;&nbsp;</i>
              Add
            </Button>
          </ModalFooter>
        </Modal>
        {/* End Modal Create LMR Child */}

        {/* Modal Material Dasboard */}
        <Modal
          isOpen={this.state.modal_material}
          toggle={this.toggleMaterial}
          className={"modal-lg"}
        >
          <ModalBody>
            <Table responsive striped bordered size="sm">
              <thead>
                <th></th><th>MM Code</th><th>BB Sub</th><th>SoW</th><th>UoM</th><th>Region</th><th>Unit Price</th><th>MM Description</th>
              </thead>
              <tbody>
              <tr>
              <td></td>
                  {/* <td> */}
                    {/* <div className="controls" style={{ width: "150px" }}>
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-search"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Search"
                          onChange={this.handleFilterList}
                          value={this.state.filter_list}
                          size="sm"
                        />
                      </InputGroup>
                    </div> */}
                    {this.loopSearchBar()}
                  {/* </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td> */}
                </tr>
                {this.state.material_list.map(e => 
                  <tr>
                    <td>
                      <Button color={"primary"} size="sm" value={e.MM_Code} onClick={this.handleChangeMaterial}>Select</Button>
                    </td>
                    <td>{e.MM_Code}</td>
                    <td>{e.BB_Sub}</td>
                    <td>{e.SoW_Description}</td>
                    <td>{e.UoM}</td>
                    <td>{e.Region}</td>
                    <td>{e.Unit_Price}</td>
                    <td>{e.MM_Description}</td>
                  </tr>
                )}
                
              </tbody>
              <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalData}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleMaterial}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default MYASGDetail;
