import React, { Component, Fragment, PureComponent } from "react";
import {
  Alert,
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
import { getDatafromAPINODE, getDatafromAPIMY } from "../../helper/asyncFunctionDigi";
import { connect } from "react-redux";
import Select from "react-select";
import { convertDateFormat } from "../../helper/basicFunction";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const date = new Date();
const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

class MYASGDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      // tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      tokenUser: this.props.dataLogin.token,
      lmr_child_form: {},
      modal_loading: false,
      modalAddChild: false,
      lmr_detail: {},
      modal_material: false,
      modal_material_NRO: false,
      modal_material_HW: false,
      modal_material_ARP: false,
      data_cpo: null,
      data_cpo_db: [],
      modal_postgr: false,
      modal_grbulk: false,
      dn_no: "",
      file_upload: null,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      rowsXLS: [],
      rowsXLSGR: [],
      dropdownOpen: new Array(6).fill(false),
      modalPOForm: false,
      POForm: new Array(5).fill(null),
      collapse: false,
      action_message: null,
      action_status: null,
      collapse_add_child: false,
      creation_lmr_child_form: [],
      current_material_select: null,
      material_list: [],
      list_cd_id: [],
      list_pr_po: [],
      filter_list: new Array(7).fill(""),
      change_lmr: false,
      lmr_form: {
        pgr: "MP2",
        gl_account: "402102",
        lmr_issued_by: this.props.dataLogin.userName,
        plant: "MY",
        customer: "CELCOM",
        request_type: "Delete LMR",
      },
      check_prpo: {},
      list_project: [],
      cd_id_project: "",
      matfilter: {
        mat_type: "",
        region: "",
      },
      hide_region: false,
      gr_error_log: null,
      vendor_code: "",
      list_cd_id: [],
      cd_id_selected: "",
      po_fully_approved: false
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
    this.deleteLMR = this.deleteLMR.bind(this);
    this.handleMaterialFilter = this.handleMaterialFilter.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  decideToggleMaterial = (number_child_form) => {
    let Mat_type = this.state.creation_lmr_child_form[number_child_form]
      .Per_Site_Material_Type;
    console.log(Mat_type);
    switch (Mat_type) {
      case "NRO":
        this.toggleMaterialNRO(number_child_form);
        break;
      case "NDO":
        this.toggleMaterial(number_child_form);
        break;
      case "HW":
        this.toggleMaterialHW(number_child_form);
        break;
      case "ARP":
        this.toggleMaterialARP(number_child_form);
        break;
      default:
        break;
    }
  };

  toggleMaterial = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.getMaterialList(number_child_form);
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material: !prevState.modal_material,
    }));
  };

  toggleMaterialNRO = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.getMaterialListNRO(number_child_form);
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_NRO: !prevState.modal_material_NRO,
    }));
  };

  toggleMaterialHW = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.getMaterialListHW(number_child_form);
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_HW: !prevState.modal_material_HW,
    }));
  };

  toggleMaterialARP = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.getMaterialListARP(number_child_form);
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_ARP: !prevState.modal_material_ARP,
    }));
  };

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
      "/aspassignment/UpdateAll",
      { data: [{ header: dataLMR, child: dataLMRCHild }] }
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

  toggleGRPost = () => {
    this.setState({
      modal_postgr: !this.state.modal_postgr,
    });
  }

  toggleGRBulk = () => {
    this.setState({
      modal_grbulk: !this.state.modal_grbulk,
    });
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

  fileInputHandle = (e) => {
    let fileUpload = null;
    if (
      e !== undefined &&
      e.target !== undefined &&
      e.target.files !== undefined
    ) {
      fileUpload = e.target.files[0];
      this.setState({ file_upload: fileUpload });
    }
  };

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

  handleChangeMaterial(e) {
    const value = e.target.value;
    const data_material = this.state.material_list.find(
      (e) => e.MM_Code === value
    );
    let dataLMR = this.state.creation_lmr_child_form;
    dataLMR[parseInt(this.state.current_material_select)]["material_code_doc"] =
      data_material._id;
    dataLMR[parseInt(this.state.current_material_select)]["material"] =
      data_material.MM_Code;
    dataLMR[parseInt(this.state.current_material_select)]["description"] =
      data_material.MM_Description;
    dataLMR[parseInt(this.state.current_material_select)]["price"] =
      data_material.Unit_Price;
    dataLMR[parseInt(this.state.current_material_select)]["quantity"] = 0;
    this.setState({ creation_lmr_child_form: dataLMR });
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

  fileHandlerGR = (input) => {
    const file = input.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    console.log("rABS", rABS);
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        cellDates: true,
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, devfal: null });
      /* Update state */
      this.ArrayEmptytoNullGR(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }

  ArrayEmptytoNullGR(dataXLS) {
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
      newDataXLS.push(col);
    }
    this.setState({ rowsXLSGR: newDataXLS }, () => console.log('isi excel gr', this.state.rowsXLSGR));
  }

  uploadGRBulk = async () => {
    this.toggleGRBulk();
    let gr_bulk = this.state.rowsXLSGR.splice(1);
    let gr_to_be_saved = [], failed_gr = [];
    for (let i = 0; i < gr_bulk.length; i++) {
      const pr_po = this.state.list_pr_po.find((e) => e.id_child_doc === gr_bulk[i][0]);
      let prev_gr_qty = 0;
      await getDatafromAPINODE("/aspassignment/getGrByLmrChild/" + gr_bulk[i][0], this.state.tokenUser).then((res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          prev_gr_qty = dataLMRDetail.reduce((n, { Required_GR_Qty }) => n + Required_GR_Qty, 0);
        }
      });
      let gr = {
        DN_No: "",
        Item_Status: pr_po.Item_Status,
        GR_Amount: gr_bulk[i][19] * pr_po.Price,
        PO_Item: pr_po.PO_Item,
        PO_Number: pr_po.PO_Number,
        PO_Qty: pr_po.PO_Qty,
        Plant: pr_po.Plant,
        Request_Type: "Add GR",
        Required_GR_Qty: gr_bulk[i][19],
        WCN_Link: "https://digi.pdb.e-dpm.com/grmenu/list/",
        Work_Status: "Waiting for GR",
        created_by_gr: this.props.dataLogin.userName,
        fileDocument: [],
        id_child: pr_po.id_child_doc
      }
      if (gr_bulk[i][19] === 0) {
        failed_gr.push(`Required GR Qty cannot be 0 on row ${i + 2}`);
      } else if (pr_po.Qty >= prev_gr_qty + gr_bulk[i][19]) {
        gr_to_be_saved.push(gr);
      } else {
        failed_gr.push(`Required GR Qty exceeds material qty on row ${i + 2}`);
      }
      if (i + 1 === gr_bulk.length || gr_bulk[i][0] !== gr_bulk[i + 1][0]) {
        const params_gr_save = pr_po.LMR_No + " /// " + pr_po.CDID + " /// " + pr_po.id_child_doc;
        localStorage.setItem(params_gr_save, JSON.stringify(gr_to_be_saved));
        console.log(JSON.parse(localStorage.getItem(params_gr_save)));
        gr_to_be_saved.splice(0, gr_to_be_saved.length);
      }
    }
    if (failed_gr.length > 0) {
      this.setState({
        gr_error_log: failed_gr.join("\r\n"),
      });
    } else {
      this.setState({
        action_status: "success",
        action_message: "GR has been saved as draft",
      });
    }
  }

  getProjectList() {
    getDatafromAPIMY("/project_data").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ list_project: items });
      }
    });
  }

  getMaterialList(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.vendor_code !== "" &&
      filter_array.push('"Vendor_ID":"' + this.state.vendor_code + '"');
    this.state.matfilter.mat_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.matfilter.mat_type +
        '", "$options" : "i"}'
      );
    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"BB":{"$regex" : "' +
        this.state.filter_list[0] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"BB_Sub":{"$regex" : "' +
        this.state.filter_list[1] +
        '", "$options" : "i"}'
      );
    // this.state.filter_list[2] !== "" &&
    //   filter_array.push(
    //     '"MM_Code":{"$regex" : "' +
    //       this.state.filter_list[2] +
    //       '", "$options" : "i"}'
    //   );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"SoW_Description":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    this.state.matfilter.region === "All" &&
      filter_array.push('"Region": {"$exists" : 1}');
    this.state.matfilter.region !== "" &&
      this.state.matfilter.region !== "All" &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.matfilter.region +
        '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.filter_list[2] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/mmCode/getMm?q=" +
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
        this.setState({ material_list: items, totalData: totalData }, () =>
          console.log(this.state.material_list)
        );
      }
    });
  }

  getMaterialListHW(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.vendor_code !== "" &&
      filter_array.push('"Vendor_ID":"' + this.state.vendor_code + '"');
    this.state.matfilter.mat_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.matfilter.mat_type +
        '", "$options" : "i"}'
      );

    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[0] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[1] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"Unit_Price":{"$regex" : "' +
        this.state.filter_list[2] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"Currency":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"Info_Rec":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"Valid_To":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"Created_On":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/mmCode/getMm?q=" +
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
        this.setState({ material_list: items, totalData: totalData }, () =>
          console.log(this.state.material_list)
        );
      }
    });
  }

  getMaterialListARP(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.vendor_code !== "" &&
      filter_array.push('"Vendor_ID":"' + this.state.vendor_code + '"');
    this.state.matfilter.mat_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.matfilter.mat_type +
        '", "$options" : "i"}'
      );

    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[0] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list[1] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[2] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"Unit_Price":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"Currency":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"Remarks_or_Acceptance":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/mmCode/getMm?q=" +
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
        this.setState({ material_list: items, totalData: totalData }, () =>
          console.log(this.state.material_list)
        );
      }
    });
  }

  getMaterialListNRO(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.vendor_code !== "" &&
      filter_array.push(
        '"Vendor_List.Vendor_Code":"' + this.state.vendor_code + '"'
      );
    this.state.matfilter.mat_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.matfilter.mat_type +
        '", "$options" : "i"}'
      );
    this.state.filter_list[0] !== "" &&
      filter_array.push(
        '"BB":{"$regex" : "' +
        this.state.filter_list[0] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[1] !== "" &&
      filter_array.push(
        '"BB_Sub":{"$regex" : "' +
        this.state.filter_list[1] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[2] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[2] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"SoW_Description":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    this.state.matfilter.region === "All" &&
      filter_array.push('"Region": {"$exists" : 1}');
    this.state.matfilter.region !== "" &&
      this.state.matfilter.region !== "All" &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.matfilter.region +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/mmCode/getMm?q=" +
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
        this.setState({ material_list: items, totalData: totalData });
      }
    });
  }

  decideFilter(type_material) {
    switch (type_material) {
      case "NRO":
        this.getMaterialListNRO();
        break;
      case "NDO":
        this.getMaterialList();
        break;
      case "HW":
        this.getMaterialListHW();
        break;
      case "ARP":
        this.getMaterialListARP();
        break;
      default:
        break;
    }
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
    });
  }

  onChangeDebounced(e) {
    this.getMaterialList();
  }

  getLMRDetailData(_id) {
    this.getDatafromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState({ lmr_detail: dataLMRDetail, vendor_code: dataLMRDetail.vendor_code_actual }, () => {
            this.getDataPRPO(dataLMRDetail.lmr_id);
            this.checkPOStatus();
          }
          );
        }
      }
    );
  }

  getDataPRPO(LMR_ID) {
    getDatafromAPIMY(
      '/prpo_data?where={"LMR_No" : "' + LMR_ID + '"}'
    ).then((res) => {
      if (res.data !== undefined) {
        const dataLMRDetailPRPO = res.data._items;
        this.setState({
          list_pr_po: dataLMRDetailPRPO,
          check_prpo:
            dataLMRDetailPRPO[0] !== undefined ? dataLMRDetailPRPO[0] : {},
        });
        // console.log('0 ', this.state.list_pr_po[0])
      }
    });
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

  numToSSColumn(num) {
    var s = '', t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t) / 26 | 0;
    }
    return s || undefined;
  }

  downloadGRBulkTemplate = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const list_pr_po = this.state.list_pr_po;

    let headerRow = [
      "LMR Child ID",
      "Project Name",
      "WP ID",
      "CD ID",
      "Site ID",
      "SO / NW",
      "Activity",
      "Tax Code",
      "Material",
      "Material Description",
      "Price",
      "Quantity",
      "Total Price",
      "Delivery Date",
      "Item Status",
      "Work Status",
      "PO Number",
      "PO Item",
      "PO Qty",
      "Required GR Qty"
    ];
    ws.addRow(headerRow);

    for (let i = 1; i <= headerRow.length; i++) {
      ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
    }

    for (let i = 0; i < list_pr_po.length; i++) {
      let childRow = [
        list_pr_po[i].id_child_doc,
        list_pr_po[i].Project,
        list_pr_po[i].WP_ID,
        list_pr_po[i].CDID,
        list_pr_po[i].Item_Text_Site_Id,
        list_pr_po[i].NW,
        list_pr_po[i].NW_Activity,
        list_pr_po[i].Tax_Code,
        list_pr_po[i].Material_Code,
        list_pr_po[i].Description,
        list_pr_po[i].Price,
        list_pr_po[i].Qty,
        list_pr_po[i].Total_Amount,
        list_pr_po[i].Request_Delivery_Date,
        list_pr_po[i].Item_Status,
        list_pr_po[i].Work_Status,
        list_pr_po[i].PO_Number,
        list_pr_po[i].PO_Item,
        list_pr_po[i].PO_Qty,
        0
      ]
      ws.addRow(childRow);
    }

    for (let i = 1; i <= list_pr_po.length + 1; i++) {
      for (let j = 1; j <= headerRow.length; j++) {
        if (j === 20) {
          ws.getCell(this.numToSSColumn(j) + i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: 'FFFF00'
            }
          };
        } else {
          ws.getCell(this.numToSSColumn(j) + i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: '808080'
            }
          };
        }
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "GR Bulk Template.xlsx");
  }

  componentDidMount() {
    if (this.props.match.params.id === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.id);
    }
    // const dataChild = JSON.parse(state_lmr.detail.map(id => localStorage.getItem(lmr_id + "///" + id.cdid)))
    // console.log(dataChild)
    // this.getMaterialList();
    // this.getDataCD();
    // this.getProjectList();
    document.title = "LMR Detail | BAM";
  }

  postAllGR_draft = async () => {
    this.toggleLoading();
    this.toggleGRPost();
    const state_lmr = this.state.lmr_detail;
    const lmr_id = state_lmr["lmr_id"];
    let fileDocument = new FormData();
    const dataChild = state_lmr.detail.map((id) =>
      JSON.parse(
        localStorage.getItem(lmr_id + " /// " + id.cdid + " /// " + id._id)
      )
    );

    console.log(dataChild);
    const merge_dataChild = [].concat(...dataChild).filter((gr) => gr !== null);
    console.log(merge_dataChild);

    await fileDocument.append("fileDocument", this.state.file_upload);
    await fileDocument.append("dn_no", JSON.stringify(this.state.dn_no));
    await fileDocument.append("gr_data", JSON.stringify(merge_dataChild));
    const respondSaveLMRChild = await this.postDatatoAPINODE(
      "/aspassignment/createGrForm1/",
      fileDocument
    );
    if (
      respondSaveLMRChild.data !== undefined &&
      respondSaveLMRChild.status >= 200 &&
      respondSaveLMRChild.status <= 300
    ) {
      let remove_gr = state_lmr.detail.map(
        (id) => lmr_id + " /// " + id.cdid + " /// " + id._id
      );
      for (let i = 0; i < remove_gr.length; i++) {
        const element = remove_gr[i];
        localStorage.removeItem(element);
      }
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
    // setTimeout(function () {
    //   window.location.reload();
    // }, 1500);
  };

  getDataCD() {
    getDatafromAPIMY("/cdid_data").then((resCD) => {
      if (resCD.data !== undefined) {
        this.setState({ list_cd_id: resCD.data._items });
      }
    });
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
    dataLMR.push({
      tax_code: "I0",
      currency: "MYR",
      item_status: "Submit",
      work_status: "Waiting for PR-PO creation",
      request_type: "Add LMR",
    });
    this.setState({ creation_lmr_child_form: dataLMR });
    if (this.state.material_list.length === 0) {
      this.getMaterialList();
    }
    if (this.state.list_cd_id.length === 0) {
      this.getDataCD();
    }
  }

  deleteLMR(e) {
    let index = e.currentTarget.value;
    let dataChild = this.state.creation_lmr_child_form;
    if (index !== undefined) {
      dataChild.splice(parseInt(index), 1);
      this.setState({ creation_lmr_child_form: [] }, () => {
        this.setState({ creation_lmr_child_form: dataChild });
      });
    }
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
      "plant",
      "customer",
      "request_type",
      "item_category",
      "lmr_type",
      "plan_cost_reduction",
      "cdid",
      "per_site_material_type",
      "item_status",
      "work_status",
      // "id_project_doc",
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
        "Add LMR",
        dataChild[0].item_category,
        dataChild[0].lmr_type,
        dataChild[0].plan_cost_reduction,
        dataChildForm[i].cd_id_selected,
        dataChildForm[i].Per_Site_Material_Type,
        "Submit",
        "Waiting for PR-PO creation",
        // dataChild[0].id_project_doc,
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
      // setTimeout(function(){ window.location.reload(); }, 1500);
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
          <div className="controls" style={{ width: "150px" }}>
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
                value={this.state.filter_list[i]}
                name={i}
                size="sm"
              />
            </InputGroup>
          </div>
        </td>
      );
    }
    return searchBar;
  };

  handleMaterialFilter(e) {
    let value = e.target.value;
    let name = e.target.name;
    let dataLMR = this.state.creation_lmr_child_form;
    let type_material =
      dataLMR[parseInt(this.state.current_material_select)][
      "Per_Site_Material_Type"
      ];
    // console.log()
    this.setState(
      (prevState) => ({
        matfilter: {
          ...prevState.matfilter,
          [name]: value,
        },
      }),
      () => {
        this.hideRegion();
        this.decideFilter(type_material);
      }
    );
  }

  hideRegion() {
    if (
      this.state.matfilter.mat_type === "Hardware" ||
      this.state.matfilter.mat_type === "ARP"
    ) {
      this.setState({ hide_region: true });
    } else {
      this.setState({ hide_region: false });
    }
  }

  handleChangeFormLMRChildMultiple(e) {
    let dataLMR = this.state.creation_lmr_child_form;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];
    dataLMR[parseInt(idx)][field] = value;
    if (field === "cd_id") {
      let cdData = this.state.list_cd_id.find((e) => e.CD_ID === value);
      dataLMR[parseInt(idx)]["site_id"] = cdData.Site_Name;
      dataLMR[parseInt(idx)]["so_or_nw"] = cdData.Network_Element_Name;
      dataLMR[parseInt(idx)]["activity"] = cdData.Network_Element_Name;
      dataLMR[parseInt(idx)]["project_name"] = cdData.Project;
      this.setState({ cd_id_project: dataLMR[parseInt(idx)]["project_name"] });
    }
    if (field === "quantity" && isNaN(dataLMR[parseInt(idx)].price) === false) {
      dataLMR[parseInt(idx)]["total_amount"] =
        value * dataLMR[parseInt(idx)].price;
    }
    this.setState({ creation_lmr_child_form: dataLMR }, () =>
      console.log(this.state.creation_lmr_child_form)
    );
  }

  handleChangeForm = (e) => {
    const value = e.target.value;
    // const index = e.target.name;
    // let dataForm = this.state.PPForm;
    // dataForm[parseInt(index)] = value;
    this.setState({ dn_no: value });
  };

  handleChangeCDFormLMRChild = (e, action) => {
    let dataLMR = this.state.creation_lmr_child_form;
    let dataparentLMR_GL = this.state.lmr_detail.gl_account;
    let idxField = action.name.split(" /// ");
    let value = e.value;
    console.log("cd ", value);
    let idx = idxField[0];
    let field = idxField[1];
    // if (field === "cd_id" && this.state.lmr_detail.LMR_Type === "Per Site") {
    //   let cdData = this.state.list_cd_id.find((e) => e.CD_ID === value);
    //   let custom_site_display = cdData.LOC_ID + "_" + cdData.Site_Name;
    //   dataLMR[parseInt(idx)]["custom_site_display"] = custom_site_display;
    //   dataLMR[parseInt(idx)]["site_id"] = cdData.Site_Name;
    //   dataLMR[parseInt(idx)]["project_name"] = cdData.Project;
    //   dataLMR[parseInt(idx)]["cd_id"] = value;
    //   if (dataparentLMR_GL === "Transport - 402102") {
    //     dataLMR[parseInt(idx)]["so_or_nw"] = "";
    //     dataLMR[parseInt(idx)]["activity"] = "803X";
    //   }
    //   if (dataparentLMR_GL === "NRO service - 402603") {
    //     dataLMR[parseInt(idx)]["so_or_nw"] = cdData.NW_NRO;
    //     dataLMR[parseInt(idx)]["activity"] = "5640";
    //   }
    //   if (dataparentLMR_GL === "NRO local material - 402201") {
    //     dataLMR[parseInt(idx)]["so_or_nw"] = cdData.NW_HWAC;
    //     dataLMR[parseInt(idx)]["activity"] = "2000";
    //   }
    //   if (dataparentLMR_GL === "NDO service - 402603") {
    //     dataLMR[parseInt(idx)]["so_or_nw"] = cdData.NW_NDO;
    //     dataLMR[parseInt(idx)]["activity"] = "5200";
    //   }
    //   if (dataparentLMR_GL === "3PP Hardware - 402201") {
    //     dataLMR[parseInt(idx)]["so_or_nw"] = cdData.NW_HWAC;
    //     dataLMR[parseInt(idx)]["activity"] = "2000";
    //   }
    //   this.setState({
    //     cd_id_selected: value,
    //   }, ()=> console.log(this.state.cd_id_selected));
    // }
    this.setState({ cd_id_selected: value }, () =>
      console.log(this.state.cd_id_selected)
    );
  };

  getOptionbyRole2 = (role) => {
    if (role !== undefined) {
      if (
        role.includes("BAM-CPM") === true ||
        role.includes("BAM-Sourcing") === true
      ) {
        return (
          <>
            <option value="" selected></option>
            <option value="NRO">NRO</option>
            <option value="NDO">NDO</option>
            <option value="HW">HW</option>
            <option value="ARP">ARP</option>
          </>
        );
      }
      if (role.includes("BAM-IM") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="NRO">NRO</option>
          </>
        );
      }
      if (role.includes("BAM-IE Lead") === true) {
        return (
          <>
            <option value="" selected></option>

            <option value="NRO">NRO</option>
            <option value="NRO">NRO</option>
          </>
        );
      }
      if (role.includes("BAM-MP") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="HW">HW</option>
          </>
        );
      }
      if (role.includes("BAM-PA") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="ARP">ARP</option>
          </>
        );
      }
    }
  };

  checkPOStatus = () => {
    getDatafromAPIMY('/po_status_data?where={"Quotation_LMR_No" : "' + this.state.lmr_detail.lmr_id + '"}').then((res) => {
      if (res.data !== undefined && res.data._items.length > 0) {
        this.setState({ po_fully_approved: true });
      }
    });
  }

  render() {
    const cd_id_list = [];
    this.state.list_cd_id.map((e) =>
      cd_id_list.push({ label: e.CD_ID, value: e.CD_ID })
    );
    const prpo = this.state.list_pr_po;
    const matfilter = this.state.matfilter;
    return (
      <div>
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xl="12">
            <Alert color="danger" style={{ whiteSpace: "pre", maxHeight: "200px", overflowY: "scroll" }} hidden={this.state.gr_error_log === null}>
              {this.state.gr_error_log}
            </Alert>
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2", fontSize: "17px" }}>LMR Detail</span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  {this.state.roleUser.includes("BAM-CPM") === true || this.state.roleUser.includes("BAM-GR PA") === true && (
                    // use this one later
                    // <div style={{ marginRight: "16px" }} hidden={this.state.list_pr_po.length === 0 || this.state.list_pr_po[0].PO_Number === null || this.state.list_pr_po[0].PO_Item === null || this.state.list_pr_po[0].updated_on.substr(0, 10) === currentDate || this.state.po_fully_approved === false}>
                    <div style={{ marginRight: "16px" }} hidden={this.state.list_pr_po.length === 0 || this.state.list_pr_po[0].PO_Number === null || this.state.list_pr_po[0].PO_Item === null || this.state.list_pr_po[0].updated_on.substr(0, 10) === currentDate}>
                      <Dropdown
                        isOpen={this.state.dropdownOpen[0]}
                        toggle={() => { this.toggle(0); }}
                      >
                        <DropdownToggle caret color="light">GR Bulk</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.downloadGRBulkTemplate}>Download GR Bulk Template</DropdownItem>
                          <DropdownItem onClick={this.toggleGRBulk}>Upload GR Bulk</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  )}
                  {/* <Button
                    block
                    color="success"
                    size="sm"
                    onClick={this.toggleCollapse}
                    id="toggleCollapse2"
                  >
                    Add Child
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    color="danger"
                    size="sm"
                    onClick={this.togglechangeLMR}
                  >
                    <i className="fa fa-eraser">&nbsp; Delete</i>
                  </Button>
                  &nbsp;&nbsp;&nbsp; */}
                  {this.state.roleUser !== "Public" ? (
                    <>
                      <Link to={"/lmr-edit/" + this.props.match.params.id}>
                        <Button color="warning">
                          <i className="fa fa-wpforms" aria-hidden="true"></i>&nbsp; Duplicate
                        </Button>
                      </Link>
                      &nbsp;&nbsp;
                      {this.state.list_pr_po[0] !== undefined &&
                        this.state.list_pr_po[0].PO_Number !== null ? (
                        <Button color="success" onClick={this.toggleGRPost}>
                          <i class="fa fa-paper-plane" aria-hidden="true"></i>&nbsp; Post GR
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          onClick={this.toggleGRPost}
                          disabled
                        >
                          <i class="fa fa-paper-plane" aria-hidden="true"></i>&nbsp; Post GR
                        </Button>
                      )}
                    </>
                  ) : (
                    ""
                  )}
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
                            Customer : {this.state.lmr_detail.customer}
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
                <div
                  style={{
                    padding: "10px",
                    fontSize: "15px",
                    marginBottom: "10px",
                  }}
                >
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
                            <td>{this.state.lmr_detail.gl_account_actual}</td>
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
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Grand Total Amount</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.total_price}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    {/* <Col sm="5" md="5"> */}
                    <div
                      style={{
                        "max-height": "calc(100vh - 210px)",
                        "overflow-y": "auto",
                      }}
                    >
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
                          </tr>
                          <tr style={{ fontWeight: "425", fontSize: "15px" }}>
                            <td>Request Type</td>
                            <td>:</td>
                            <td>{this.state.lmr_detail.request_type}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* </Col> */}
                  </Row>
                </div>

                <div class="divtable">
                  <Table hover bordered responsive size="sm" width="100%" id="asg-detail-table">
                    <thead class="table-commercial__header">
                      <tr>
                        <th>GR</th>
                        <th>Request Type</th>
                        <th>Project Name</th>
                        <th>WP ID</th>
                        <th>CD ID</th>
                        <th>Site ID</th>
                        <th>SO / NW</th>
                        <th>Activity</th>
                        <th>Tax Code</th>
                        <th>Material</th>
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
                            {this.state.roleUser.includes("BAM-CPM") === true || this.state.roleUser.includes("BAM-GR PA") === true ? (
                              <td>
                                {/* use this one later */}
                                {/* {this.state.list_pr_po.find((f) => f.id_child_doc === e._id) !== undefined &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).PO_Number !== null &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).PO_Item !== null &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).updated_on.substr(0, 10) !== currentDate &&
                                  this.state.po_fully_approved === true ? (
                                  <Link to={"/lmr-detail/" + this.props.match.params.id + "/gr-detail/" + e._id}>
                                    <Button color="info">
                                      <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp;GR
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button color="info" disabled>
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp;GR
                                  </Button>
                                )} */}
                                {this.state.list_pr_po.find((f) => f.id_child_doc === e._id) !== undefined &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).PO_Number !== null &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).PO_Item !== null &&
                                  this.state.list_pr_po.find((f) => f.id_child_doc === e._id).updated_on.substr(0, 10) !== currentDate ? (
                                  <Link to={"/lmr-detail/" + this.props.match.params.id + "/gr-detail/" + e._id}>
                                    <Button color="info">
                                      <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp;GR
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button color="info" disabled>
                                    <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp;GR
                                  </Button>
                                )}
                              </td>
                            ) : (
                              <td></td>
                            )}
                            <td>{e.request_type}</td>
                            <td>{e.project_name}</td>
                            <td>{e.wp_id}</td>
                            <td>{e.cdid}</td>
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
                            {this.state.list_pr_po.find(
                              (f) => f.id_child_doc === e._id
                            ) !== undefined ? (
                              <React.Fragment>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).Item_Status
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).Work_Status
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).PO_Number
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).PO_Item
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).PO_Qty
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).Error_Message
                                  }
                                </td>
                                <td>
                                  {
                                    this.state.list_pr_po.find(
                                      (f) => f.id_child_doc === e._id
                                    ).Error_Type
                                  }
                                </td>
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
                            ) : (
                              <td>
                                {/* <Button
                                color="danger"
                                size="sm"
                                value={e._id}
                                onClick={this.deleteChild}
                              >
                                <i className="fa fa-eraser"></i>
                              </Button> */}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <Fragment></Fragment>
                      )}
                      <tr>
                        {/* <td colSpan="22" style={{ textAlign: "left" }}>
                          {this.state.check_prpo.PO_Number === null ||
                          this.state.check_prpo.PO_Number === undefined ? (
                            this.state.lmr_detail.request_type === "Add LMR" ? (
                              <Button
                                color="primary"
                                size="sm"
                                onClick={this.addLMR}
                              >
                                <i className="fa fa-plus">&nbsp;</i> LMR CHild
                              </Button>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </td> */}
                      </tr>
                      {this.state.creation_lmr_child_form.map((lmr, i) => (
                        <tr className="form-lmr-child">
                          <td>
                            <Button
                              value={i}
                              onClick={this.deleteLMR}
                              color="danger"
                              size="sm"
                              style={{ marginLeft: "5px" }}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </td>
                          {/* <td></td> */}
                          <td>
                            <Input
                              type="text"
                              name={i + " /// request_type"}
                              id={i + " /// request_type"}
                              value={lmr.request_type}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              readOnly
                            // style={{ width: "100%" }}
                            />

                            <Input
                              type="select"
                              name={i + " /// Per_Site_Material_Type"}
                              id={i + " /// Per_Site_Material_Type"}
                              value={lmr.Per_Site_Material_Type}
                              onChange={this.handleChangeFormLMRChildMultiple}
                            // style={{ width: "100%" }}
                            >
                              {this.getOptionbyRole2(this.state.roleUser)}
                            </Input>
                          </td>
                          {/* <td>
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
                            <option value="NRO">NRO</option>
                            <option value="NDO">NDO</option>
                            <option value="HW">HW</option>
                            <option value="ARP">ARP</option>
                            </Input>
                          </td> */}

                          <td>
                            {this.state.lmr_detail.LMR_Type ===
                              "Cost Collector" ? (
                              <Input
                                type="select"
                                name={i + " /// project_name"}
                                id={i + " /// project_name"}
                                value={lmr.project_name}
                                onChange={this.handleChangeFormLMRChildMultiple}
                              >
                                <option value="" disabled selected hidden>
                                  Select Project Name
                                </option>
                                {this.state.list_project.map((e) => (
                                  <option value={e.Project}>{e.Project}</option>
                                ))}
                              </Input>
                            ) : (
                              <Input
                                type="text"
                                name={i + " /// project_name"}
                                id={i + " /// project_name"}
                                value={lmr.project_name}
                                readOnly
                              />
                            )}
                            {/* <Input
                              type="select"
                              name={i + " /// project_name"}
                              id={i + " /// project_name"}
                              value={lmr.project_name}
                              onChange={this.handleChangeFormLMRChildMultiple}
                              // style={{ width: "100%" }}
                            >
                              <option value="" disabled selected hidden>
                                Select Project
                              </option>
                              {this.state.list_project.map((e) => (
                                <option value={e.Project}>{e.Project}</option>
                              ))}
                            </Input> */}
                          </td>
                          <td>
                            <Select
                              cacheOptions
                              name={i + " /// cd_id"}
                              id={i + " /// cd_id"}
                              value={lmr.cd_id}
                              options={cd_id_list}
                              onChange={this.handleChangeCDFormLMRChild}
                              isDisabled={
                                this.state.lmr_detail.LMR_Type ===
                                "Cost Collector"
                              }
                            />
                            {/* <Input
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
                              {this.state.list_cd_id.map((e) => (
                                <option value={e.CD_ID}>{e.CD_ID}</option>
                              ))}
                            </Input> */}
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={i + " /// site_id"}
                              id={i + " /// site_id"}
                              value={lmr.site_id}
                              placeholder="Site ID / Text ID"
                              onChange={this.handleChangeFormLMRChildMultiple}
                              disabled={
                                this.state.lmr_detail.LMR_Type ===
                                "Cost Collector"
                              }
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
                              onClick={() => this.decideToggleMaterial(i)}
                              onChange={this.handleChangeFormLMRChildMultiple}
                            // style={{ width: "100%" }}
                            />
                          </td>
                          <td>
                            <Input
                              readOnly
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
                              readOnly
                              type="text"
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
                              <option value="MYR" selected>
                                MYR
                              </option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
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
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={1}>
                &nbsp;&nbsp;&nbsp;
                {this.state.hide_region !== true ? (
                  <FormGroup>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden></option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="OKV">OKV</option>
                      <option value="ER">ER</option>
                      <option value="EM">EM</option>
                    </Input>
                  </FormGroup>
                ) : (
                  ""
                )}
              </Row>
            </div>
            <div class="table-container">
              <Table responsive striped bordered size="sm">
                <thead>
                  <th></th>
                  <th>BB</th>
                  <th>BB Sub</th>
                  <th>Region</th>
                  <th>MM Code</th>
                  <th>MM Description</th>
                  <th>SoW</th>
                  <th>UoM</th>
                  <th>Unit Price</th>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {this.loopSearchBar()}
                  </tr>
                  {this.state.material_list !== null &&
                    this.state.material_list !== undefined &&
                    this.state.material_list.map((e) => (
                      <tr>
                        <td>
                          <Button
                            color={"primary"}
                            size="sm"
                            value={e.MM_Code}
                            onClick={this.handleChangeMaterial}
                          >
                            Select
                          </Button>
                        </td>
                        <td>{e.BB}</td>
                        <td>{e.BB_Sub}</td>
                        <td>{e.Region}</td>
                        <td>{e.MM_Code}</td>
                        <td>{e.MM_Description}</td>
                        <td>{e.SoW_Description}</td>
                        <td>{e.UoM}</td>
                        <td>{e.Unit_Price}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalData}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleMaterial}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Material NRO */}
        <Modal
          isOpen={this.state.modal_material_NRO}
          toggle={this.toggleMaterialNRO}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={1}>
                &nbsp;&nbsp;&nbsp;
                {this.state.hide_region !== true ? (
                  <FormGroup>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden></option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="OKV">OKV</option>
                      <option value="ER">ER</option>
                      <option value="EM">EM</option>
                    </Input>
                  </FormGroup>
                ) : (
                  ""
                )}
              </Row>
            </div>
            <div class="table-container">
              <Table responsive striped bordered size="sm">
                <thead>
                  <th></th>
                  <th>BB</th>
                  <th>BB Sub</th>
                  <th>Region</th>
                  <th>MM Code</th>
                  <th>MM Description</th>
                  <th>SoW</th>
                  <th>UoM</th>
                  <th>Unit_Price</th>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {this.loopSearchBar()}
                  </tr>
                  {this.state.material_list !== null &&
                    this.state.material_list !== undefined &&
                    this.state.material_list.map((e) => (
                      <tr>
                        <td>
                          <Button
                            color={"primary"}
                            size="sm"
                            value={e.MM_Code}
                            onClick={this.handleChangeMaterial}
                          >
                            Select
                          </Button>
                        </td>
                        <td>{e.BB}</td>
                        <td>{e.BB_Sub}</td>
                        <td>{e.Region}</td>
                        <td>{e.MM_Code}</td>
                        <td>{e.MM_Description}</td>
                        <td>{e.SoW_Description}</td>
                        <td>{e.UoM}</td>
                        <td>{e.Unit_Price}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalData}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleMaterialNRO}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Material HW */}
        <Modal
          isOpen={this.state.modal_material_HW}
          toggle={this.toggleMaterialHW}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={1}>&nbsp;&nbsp;&nbsp;</Row>
            </div>
            <div class="table-container">
              <Table responsive striped bordered size="sm">
                <thead>
                  <th></th>
                  <th>MM_Code</th>
                  <th>UoM</th>
                  <th>Unit_Price</th>
                  <th>Currency</th>
                  <th>Info_Rec</th>
                  <th>Valid_To</th>
                  <th>Created_On</th>
                  <th>Created_By</th>
                  <th>Status_Price_in_SAP</th>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {this.loopSearchBar()}
                  </tr>
                  {this.state.material_list !== null &&
                    this.state.material_list !== undefined &&
                    this.state.material_list.map((e) => (
                      <tr>
                        <td>
                          <Button
                            color={"primary"}
                            size="sm"
                            value={e.MM_Code}
                            onClick={this.handleChangeMaterial}
                          >
                            Select
                          </Button>
                        </td>
                        <td>{e.MM_Code}</td>
                        <td>{e.UoM}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Currency}</td>
                        <td>{e.Info_Rec}</td>
                        <td>{convertDateFormat(e.Valid_To)}</td>
                        <td>{convertDateFormat(e.Created_On)}</td>
                        <td>{e.created_by}</td>
                        <td>{e.Status_Price_in_SAP}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalData}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleMaterialHW}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modal_postgr}
          toggle={this.toggleGRPost}
          className="modal--form"
        >
          <ModalHeader>Form GR</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="8">
                <FormGroup row>
                  <Col xs="8">
                    <FormGroup>
                      <Label>DN No</Label>
                      <Input
                        type="text"
                        name=""
                        placeholder="Input DN No"
                        value={this.state.dn_no}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
              <Col sm="8">
                <FormGroup row>
                  <Col xs="8">
                    <FormGroup>
                      <Label>Input File</Label>
                      <input
                        type="file"
                        onChange={this.fileInputHandle.bind(this)}
                        style={{ padding: "10px", visiblity: "hidden" }}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={this.postAllGR_draft}
              disabled={
                this.state.dn_no === "" && this.state.rowsXLS.length === 0
              }
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal GR Bulk */}
        <Modal
          isOpen={this.state.modal_grbulk}
          toggle={this.toggleGRBulk}
          className="modal--form"
        >
          <ModalHeader>Upload GR Bulk Template</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="8">
                <FormGroup row>
                  <Col xs="8">
                    <FormGroup>
                      <Label>Input File</Label>
                      <input
                        type="file"
                        onChange={this.fileHandlerGR.bind(this)}
                        style={{ padding: "10px", visiblity: "hidden" }}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={this.uploadGRBulk}
              disabled={this.state.rowsXLSGR.length === 0}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal Material ARP */}
        <Modal
          isOpen={this.state.modal_material_ARP}
          toggle={this.toggleMaterialARP}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={1}>&nbsp;&nbsp;&nbsp;</Row>
            </div>
            <div class="table-container">
              <Table responsive striped bordered size="sm">
                <thead>
                  <th></th>
                  <th>MM_Code</th>
                  <th>MM_Description</th>
                  <th>UoM</th>
                  <th>Unit_Price</th>
                  <th>Currency</th>
                  <th>Remarks_or_Acceptance</th>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {this.loopSearchBar()}
                  </tr>
                  {this.state.material_list !== null &&
                    this.state.material_list !== undefined &&
                    this.state.material_list.map((e) => (
                      <tr>
                        <td>
                          <Button
                            color={"primary"}
                            size="sm"
                            value={e.MM_Code}
                            onClick={this.handleChangeMaterial}
                          >
                            Select
                          </Button>
                        </td>
                        <td>{e.MM_Code}</td>
                        <td>{e.MM_Description}</td>
                        <td>{e.UoM}</td>
                        <td>{e.UoM}</td>
                        <td>{e.UoM}</td>
                        <td>{e.UoM}</td>
                        <td>{e.UoM}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Currency}</td>
                        <td>{e.Remarks_or_Acceptance}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.perPage}
              totalItemsCount={this.state.totalData}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleMaterialARP}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
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

export default connect(mapStateToProps)(MYASGDetail);