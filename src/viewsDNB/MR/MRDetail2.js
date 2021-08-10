import React, { Component, Fragment } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Row,
  Col,
  Button,
  Input,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Form, FormGroup, Label } from "reactstrap";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import Select from "react-select";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { withScriptjs } from "react-google-maps";
import GMap from "./MapComponent";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { ExcelRenderer } from "react-excel-renderer";
import "./MatStyle.css";
import ModalForm from "../components/ModalForm";

import {convertDateFormatfull} from '../../helper/basicFunction'

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const API_URL_BMS_Phil = "https://api-dev.smart.pdb.e-dpm.com/smartapi";
const usernamePhilApi = "pdbdash";
const passwordPhilApi = "rtkO6EZLkxL1";

const API_URL_BAM = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const usernameBAM = "bamidadmin@e-dpm.com";
const passwordBAM = "F760qbAg2sml";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const Checkbox = ({
  type = "checkbox",
  name,
  checked = false,
  onChange,
  inValue = "",
  disabled = false,
}) => (
  <input
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    value={inValue}
    className="checkmark-dash"
    disabled={disabled}
  />
);

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

const status_can_edit_material = [ "PLANTSPEC ASSIGNED", "PLANTSPEC UPDATED", "MR REQUESTED", "MR CANCELED", "MR APPROVED", "MR REJECTED", "MR UPDATED", "ORDER PROCESSING START", "MR NEED REVISION", "PS NEED REVISION"];

class MRDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      list_mr_item: [],
      rowsXLS: [],
      data_mr: null,
      mr_site_NE: null,
      mr_site_FE: null,
      update_mr_form: new Array(9).fill(null),
      update_mr_name_form: new Array(9).fill(null),
      mr_pp: [],
      mr_md: [],
      mr_item: [],
      tabs_submenu: [true, false, false, false],
      edit_detail: false,
      action_status: null,
      action_message: null,
      material_wh: [],
      material_inbound: [],
      modal_approve_ldm: false,
      id_mr_selected: null,
      selected_dsp: "",
      asp_data: [],
      modal_revision: false,
      revision_note: "",
      wbs_cd_id_data : [],
    };
    this.getQtyMRPPNE = this.getQtyMRPPNE.bind(this);
    this.getQtyMRPPFE = this.getQtyMRPPFE.bind(this);
    this.getQtyMRMDNE = this.getQtyMRMDNE.bind(this);
    this.getQtyMRMDFE = this.getQtyMRMDFE.bind(this);
    this.changeTabsSubmenu = this.changeTabsSubmenu.bind(this);
    this.requestForApproval = this.requestForApproval.bind(this);
    this.ApproveMR = this.ApproveMR.bind(this);
    this.changeEditable = this.changeEditable.bind(this);
    this.handleChangeFormMRUpdate = this.handleChangeFormMRUpdate.bind(this);
    this.updateDataMR = this.updateDataMR.bind(this);
    this.downloadMaterialMRUpload = this.downloadMaterialMRUpload.bind(this);
    this.saveUpdateMaterial = this.saveUpdateMaterial.bind(this);
    this.downloadMaterialMRReport = this.downloadMaterialMRReport.bind(this);
    this.needReviseMR = this.needReviseMR.bind(this);
    this.toggleModalapprove = this.toggleModalapprove.bind(this);
    this.toggleModalRevision = this.toggleModalRevision.bind(this);
    this.handleRevisionNote = this.handleRevisionNote.bind(this);
    this.downloadMaterialMRTRACY = this.downloadMaterialMRTRACY.bind(this);
  }

  toggleModalapprove(e) {
    // const id_doc = e.currentTarget.id;
    // this.setState({ id_mr_selected: id_doc });
    this.setState((prevState) => ({
      modal_approve_ldm: !prevState.modal_approve_ldm,
    }));
  }

  toggleModalRevision(e) {
    this.setState((prevState) => ({
      modal_revision: !prevState.modal_revision
    }));
  }

  handleRevisionNote(e) {
    let value = e.target.value;
    this.setState({ revision_note: value })
  }

  async getDatafromAPIEXEL(url) {
    try {
      let respond = await axios.get(API_URL_XL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameXL,
          password: passwordXL,
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

  getASPList() {
    // switch (this.props.dataLogin.account_id) {
    //   case "xl":
    this.getDatafromAPIEXEL('/vendor_data_non_page?where={"Type":"DSP"}').then((res) => {
      // console.log("asp data ", res.data);
      if (res.data !== undefined) {
        this.setState({ asp_data: res.data._items });
      } else {
        this.setState({ asp_data: [] });
      }
    });
    //     break;
    //   default:
    //     break;
    // }
  }

  handleLDMapprove = (e) => {
    // this.getASPList();
    let value = e.target.value;
    let name = e.target.options[e.target.selectedIndex].text;
    let bodymrApprove = {
      dsp_company_code: value,
      dsp_company: name,
    };
    console.log("bodymrApprove ", bodymrApprove);
    if (value !== 0) {
      this.setState({ selected_dsp: bodymrApprove });
    }
  };

  checkValue(props) {
    //Swap undefined to null
    if (typeof props === "undefined") {
      return null;
    } else {
      return props;
    }
  }

  async getDatafromAPIBMS(url) {
    try {
      let respond = await axios.get(API_URL_BMS_Phil + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
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

  async getDatafromAPIBAM(url) {
    try {
      let respond = await axios.get(API_URL_BAM + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameBAM,
          password: passwordBAM,
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

  async postDatatoAPIBAM(url, data) {
    try {
      let respond = await axios.post(API_URL_BAM + url, data, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameBAM,
          password: passwordBAM,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async patchDatatoAPIBAM(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL_BAM + url, data, {
        headers: { "Content-Type": "application/json", "If-Match": _etag },
        auth: {
          username: usernameBAM,
          password: passwordBAM,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Patch data", err);
      return respond;
    }
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond data", err);
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
        console.log("respond post data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond post data", err.response);
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
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async getDatafromAPIXL(url){
    try {
      let respond = await axios.get(API_URL_XL +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameXL,
          password: passwordXL
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Get Data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
    }
  }

  checkValueReturn(value1, value2) {
    // if value undefined return Value2
    if (typeof value1 !== "undefined" && value1 !== null) {
      console.log("value1", value1);
      return value1;
    } else {
      console.log("value2", value2);
      return value2;
    }
  }

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          this.ArrayEmptytoNull(rest.rows);
        }
      });
    }
  };

  ArrayEmptytoNull(dataXLS) {
    let newDataXLS = [];
    for (let i = 0; i < dataXLS.length; i++) {
      let col = [];
      for (let j = 0; j < dataXLS[0].length; j++) {
        col.push(this.checkValue(dataXLS[i][j]));
      }
      newDataXLS.push(col);
    }
    this.setState({
      rowsXLS: newDataXLS,
    });
  }

  getDataMR(_id_MR) {
    this.getDataFromAPINODE("/matreq/" + _id_MR).then((resMR) => {
      if (resMR.data !== undefined) {
        if(resMR.data.dsp_company === null){
          this.getASPList();
        }
        this.setState({ data_mr: resMR.data }, () => {
          if(this.state.data_mr.cust_del !== undefined){
            this.getDataCDID(this.state.data_mr.cust_del.map(e => e.cd_id));
          }
          this.setState(
            { mr_pp: resMR.data.packages },
            () => {
              if (
                status_can_edit_material.includes(resMR.data.current_mr_status)
              ) {
                this.getDataWarehouse(resMR.data.packages);
                this.getDataInbound(resMR.data.packages);
              }
              this.prepareView();
            }
          );
        });
      }
    });
  }

  async getDataCDID(array_cd_id){
    let array_in_cdid = '"'+array_cd_id.join('", "')+'"';
    let projection = '&projection={"WP_ID" : 1, "C1003_WBS_HW" : 1, "C1008_WBS_HWAC" : 1, "C1013_WBS_LCM" : 1, "C1018_WBS_PNRO" : 1, "C1024_WBS_PNDO" : 1, "C1032_WBS_HW_Bulk" : 1, "C1033_WBS_LCM_Bulk" : 1, "C1034_WBS_PowHW_Site_Basis" : 1, "C1035_WBS_PowLCM_Site_Basis" : 1, "C1036_WBS_Kathrein" : 1}'
    const getWPID = await this.getDatafromAPIXL('/custdel_sorted?where={"WP_ID":{"$in" : ['+array_in_cdid+']}}'+projection);
    if(getWPID !== undefined && getWPID.data !== undefined) {
      this.setState({ wbs_cd_id_data : getWPID.data._items});
    }
  }

  async getDataWarehouse(data_ps) {
    let listSku = [];
    if (data_ps !== null && data_ps !== undefined) {
      data_ps.map((pp) =>
        pp.materials.map((material) => listSku.push(material.material_id))
      );
      listSku = [...new Set(listSku)];
      let skuData = {
        sku: listSku,
      };
      const respondSKU = await this.postDatatoAPINODE(
        "/whStock/getWhStockbySku",
        skuData
      );
      if (
        respondSKU.data !== undefined &&
        respondSKU.status >= 200 &&
        respondSKU.status <= 300
      ) {
        let array_sku = [];
        respondSKU.data.data.map((sku) =>
          sku.map((sku2) =>
            array_sku.push({ sku: sku2.sku, qty_sku: sku2.qty_sku })
          )
        );
        this.setState({ material_wh: array_sku });
      }
    }
  }

  async getDataInbound(data_ps) {
    let listSku = [];
    if (data_ps !== null && data_ps !== undefined) {
      data_ps.map((pp) =>
        pp.materials.map((material) => listSku.push(material.material_id))
      );
      listSku = [...new Set(listSku)];
      let skuData = {
        sku: listSku,
      };
      const respondSKU = await this.postDatatoAPINODE(
        "/whInboundPlan/getWhInboundPlanbySku",
        skuData
      );
      if (
        respondSKU.data !== undefined &&
        respondSKU.status >= 200 &&
        respondSKU.status <= 300
      ) {
        let array_sku = [];
        respondSKU.data.data.map((sku) =>
          sku.map((sku2) =>
            array_sku.push({ sku: sku2.sku, qty_sku: sku2.qty_sku })
          )
        );
        this.setState({ material_inbound: array_sku });
      }
    }
  }

  prepareView() {
    const mr_data = this.state.data_mr;
    const data_pp = this.state.mr_pp;
    // let list_mr_id_item = [...new Set(data_pp.map(({ pp_id}) => pp_id))];
    let list_mr_item = [];
    let site_NE = undefined;
    let site_FE = undefined;
    // const data_pp_uniq = [...new Set(data_pp.map(({ id_pp_doc}) => id_pp_doc))];
    // for(let i = 0; i < list_mr_id_item.length; i++){
    //   let idxItem = data_pp.find(e => e.pp_id === list_mr_id_item[i]);
    //   if(idxItem !== undefined){
    //     list_mr_item.push(idxItem);
    //   }
    // }
    this.setState({ list_mr_item: data_pp });
    if (mr_data.site_info.length !== 0) {
      site_NE = mr_data.site_info.find((e) => e.site_title === "NE");
      site_FE = mr_data.site_info.find((e) => e.site_title === "FE");
    }
    if (site_NE !== undefined) {
      let data_pp_NE = data_pp.filter((e) => e.site_id === site_NE.site_id);
      site_NE["mr_pp"] = data_pp_NE;
      this.setState({ mr_site_NE: site_NE });
    }
    if (site_FE !== undefined) {
      let data_pp_FE = data_pp.filter((e) => e.site_id === site_FE.site_id);
      site_FE["mr_pp"] = data_pp_FE;
      this.setState({ mr_site_FE: site_FE });
    }
  }

  getQtyMRPPNE(pp_id) {
    const itemMRBom = this.state.mr_site_NE.mr_pp;
    const getDataPPMR = itemMRBom.find((e) => e.pp_id === pp_id);
    if (getDataPPMR !== undefined) {
      return getDataPPMR.qty;
    } else {
      return 0;
    }
  }

  getQtyMRPPFE(pp_id) {
    const itemMRBom = this.state.mr_site_FE.mr_pp;
    const getDataPPMR = itemMRBom.find((e) => e.pp_id === pp_id);
    if (getDataPPMR !== undefined) {
      return getDataPPMR.qty;
    } else {
      return 0;
    }
  }

  getQtyMRMDNE(pp_id, mr_id) {
    const itemMRBom = this.state.mr_site_NE.mr_pp;
    const getDataPPMR = itemMRBom.find((e) => e.pp_id === pp_id);
    if (getDataPPMR !== undefined) {
      const getDataMDMR = getDataPPMR.materials.find(
        (e) => e.material_id === mr_id
      );
      if (getDataMDMR !== undefined) {
        return getDataMDMR.qty;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getQtyMRMDFE(pp_id, mr_id) {
    const itemMRBom = this.state.mr_site_FE.mr_pp;
    const getDataPPMR = itemMRBom.find((e) => e.pp_id === pp_id);
    if (getDataPPMR !== undefined) {
      const getDataMDMR = getDataPPMR.materials.find(
        (e) => e.material_id === mr_id
      );
      if (getDataMDMR !== undefined) {
        return getDataMDMR.qty;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  changeEditable(e) {
    this.setState((prevState) => ({
      edit_detail: !prevState.edit_detail,
    }));
  }

  changeTabsSubmenu(e) {
    console.log("tabs_submenu", e);
    let tab_submenu = new Array(4).fill(false);
    tab_submenu[parseInt(e)] = true;
    this.setState({ tabs_submenu: tab_submenu });
  }

  handleChangeFormMRUpdate(e) {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.update_mr_form;
    dataForm[parseInt(index)] = value;
    const indexOpt = e.target.selectedIndex;
    if (indexOpt !== undefined) {
      let dataFormName = this.state.update_mr_name_form;
      const textOpt = e.target[indexOpt].text;
      dataFormName[parseInt(index)] = textOpt;
      this.setState({ update_mr_name_form: dataFormName });
    }
    this.setState({ update_mr_form: dataForm }, () => {
      console.log(
        "PPForm",
        this.state.update_mr_form,
        this.state.update_mr_name_form
      );
    });
  }

  milestoneStat(ms_name, ms_status, ms_date, ms_updater, index) {
    return (
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date={convertDateFormatfull(ms_date)}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
      >
        <h3 className="vertical-timeline-element-title">
          {ms_name + " " + ms_status}
        </h3>
        <h4 className="vertical-timeline-element-subtitle">
          initiated by <b>{ms_updater}</b>
        </h4>
      </VerticalTimelineElement>
    );
  }

  componentDidMount() {
    this.getDataMR(this.props.match.params.id);
    document.title = "MR Detail | BAM";
  }

  // async plantSpecUnassigned(){
  //   const dataMR = this.state.data_mr;
  //   const dataMRPP = this.state.mr_pp;
  //   const dataMRMD = this.state.mr_md;
  //   for(let i = 0; i < dataMRMD.length; i++){
  //   }
  // }

  submitTSSR(_id_ps){
    this.patchDatatoAPINODE('/plantspec/submitPlantspec/'+_id_ps).then(res => {
      if(res.data !== undefined){
        // this.setState({ action_status : "success" });
      }else{
        // this.setState({ action_status : "failed" });
      }
    })
  }

  requestForApproval() {
    let dataMR = this.state.data_mr;
    this.patchDatatoAPINODE("/matreq/requestMatreq/" + dataMR._id).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
        } else {
          this.setState({ action_status: "failed" });
        }
      }
    );
  }

  ApproveMR(e) {
    const _id = this.props.match.params.id;
    let body = this.state.selected_dsp;
    if(this.state.data_mr.dsp_company !== null && this.state.data_mr.dsp_company !== undefined){
      body = {"dsp_company_code" : this.state.data_mr.dsp_company_code, "dsp_company": this.state.data_mr.dsp_company}
    }
    // console.log('_id ',_id);
    // console.log('body ',body);
    this.patchDatatoAPINODE("/matreq/approveMatreq/" + _id,  body ).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          this.toggleModalapprove();
        } else {
          if (res.response !== undefined && res.response.data !== undefined && res.response.data.error !== undefined) {
            if (res.response.data.error.message !== undefined) {
              this.setState({ action_status: 'failed', action_message: res.response.data.error.message });
            } else {
              this.setState({ action_status: 'failed', action_message: res.response.data.error });
            }
          } else {
            this.setState({ action_status: 'failed' });
          }
          this.toggleModalapprove();
        }
      }
    );
  }

  async updateDataMR() {
    const dataForm = this.state.update_mr_name_form;
    const dataMR = this.state.data_mr;
    const newDate = new Date();
    const dateNow =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1) +
      "-" +
      newDate.getDate() +
      " " +
      newDate.getHours() +
      ":" +
      newDate.getMinutes() +
      ":" +
      newDate.getSeconds();
    const dataStatus = [
      {
        mr_status_name: "MATERIAL_REQUEST",
        mr_status_value: "UPDATED",
        mr_status_date: dateNow,
        mr_status_updater: this.state.userEmail,
        mr_status_updater_id: this.state.userId,
      },
    ];
    let patchData = {};
    patchData["eta"] =
      dataForm[3] !== null ? dataForm[3] + " 23:59:59" : dataMR.eta;
    patchData["requested_eta"] =
      dataForm[3] !== null ? dataForm[3] + " 23:59:59" : dataMR.requested_eta;
    patchData["etd"] =
      dataForm[2] !== null ? dataForm[2] + " 23:59:59" : dataMR.etd;
    patchData["dsp_company"] =
      dataForm[1] !== null ? dataForm[1] : dataMR.dsp_company;
    patchData["current_mr_status"] = "MR UPDATED";
    patchData["mr_status"] = dataMR.mr_status.concat(dataStatus);
    const respondPatchMR = await this.patchDatatoAPIBAM(
      "/mr_op/" + dataMR._id,
      patchData,
      dataMR._etag
    );
    if (
      respondPatchMR.data !== undefined &&
      respondPatchMR.status >= 200 &&
      respondPatchMR.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      this.setState({ action_status: "failed" });
    }
  }

  CompareArrayObject(arr, prop) {
    return arr.sort(function (a, b) {
      var nameA = a[prop].toLowerCase(),
        nameB = b[prop].toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  async downloadMaterialMRUpload() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    let headerRow = [
      "bam_id",
      "ps_number",
      "bundle_id",
      "bundle_name",
      "program",
      "material_id_plan",
      "material_name_plan",
      "material_id_actual",
      "material_name_actual",
      "uom",
      "qty",
      "stock_warehouse",
      "inbound_warehouse",
      "availability",
      "source_material",
    ];
    ws.addRow(headerRow);
    let list_material_id = [];
    for (let i = 0; i < dataItemMR.length; i++) {
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        list_material_id.push(dataMatIdx.material_id);
        let qty_wh = stockWH.find((e) => e.sku === dataMatIdx.material_id);
        let qty_inbound = inboundWH.find(
          (e) => e.sku === dataMatIdx.material_id
        );
        qty_wh = qty_wh !== undefined ? qty_wh.qty_sku : 0;
        qty_inbound = qty_inbound !== undefined ? qty_inbound.qty_sku : 0;
        ws.addRow([
          dataMatIdx._id,
          dataItemMR[i].no_tssr_boq_site,
          dataItemMR[i].pp_id,
          dataItemMR[i].product_name,
          dataItemMR[i].program,
          dataMatIdx.material_id_plan,
          dataMatIdx.material_name_plan,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.material_unit,
          dataMatIdx.qty,
          qty_wh,
          qty_inbound,
          dataMatIdx.qty < qty_wh ? "OK" : "NOK",
          dataMatIdx.source_material,
        ]);
      }
    }

    let listMatId = [...new Set(list_material_id)];
    let matIdData = {
      "list_material_id" : listMatId
    }

    const getMaterialVariant = await this.postDatatoAPINODE(
      "/variants/materialId",
      matIdData
    );
    if (
      getMaterialVariant.data !== undefined &&
      getMaterialVariant.status >= 200 &&
      getMaterialVariant.status < 400
    ) {
      dataMaterialVariant = getMaterialVariant.data.data;
    }

    dataMaterialVariant = this.CompareArrayObject(
      dataMaterialVariant,
      "description"
    );

    // dataMaterialVariant.sort(function(a, b){return a.description.toLowerCase() - b.description.toLowerCase()});
    let sku_list = [];
    for (let j = 0; j < dataMaterialVariant.length; j++) {
      sku_list.push(dataMaterialVariant[j].material_id);
    }
    const list_qtySKU = [];
    const getQtyfromWHbySKU = await this.postDatatoAPINODE('/whStock/getWhStockbySku', {"sku": sku_list }).then((res) => {
      if(res.data !== undefined && res.status >= 200 && res.status < 400){
        const dataSKU = res.data.data;
        // console.log('dataSKU ', dataSKU);
        for (let i = 0; i < dataSKU.length; i++) {
          if (dataSKU[i][0] === undefined) {
            list_qtySKU.push(0);
          } else {
            list_qtySKU.push(dataSKU[i][0].qty_sku);
          }
        }
      }
    });

    ws2.addRow([
      "Origin",
      "Material ID",
      "Material Name",
      "Description",
      "Category",
      "Qty Available",
    ]);
    for (let j = 0; j < dataMaterialVariant.length; j++) {
      ws2.addRow([
        dataMaterialVariant[j].origin,
        dataMaterialVariant[j].material_id,
        dataMaterialVariant[j].material_name,
        dataMaterialVariant[j].description,
        dataMaterialVariant[j].category,
        list_qtySKU[j],
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Material MR " + dataMR.mr_id + " uploader.xlsx"
    );
  }

  async downloadMaterialMRReport() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    ws.addRow(["MR ID", dataMR.mr_id]);
    ws.addRow(["Project", dataMR.project_name]);
    ws.addRow(["Site", this.state.mr_site_NE.site_id]);

    let headerRow = [
      "Bundle ID",
      "Bundle Name",
      "Material ID",
      "Material Name",
      "Unit",
      "Qty",
      "Material Source",
      "CPO Number",
      "PS No.",
      "Program"
    ];
    ws.addRow(headerRow);
    ws.addRow([]);
    for (let i = 0; i < dataItemMR.length; i++) {
      ws.addRow([dataItemMR[i].pp_id, dataItemMR[i].product_name, null, null, dataItemMR[i].uom, null, null, null, dataItemMR[i].no_tssr_boq_site, dataItemMR[i].program]);
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        ws.addRow([
          null,
          null,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.uom,
          dataMatIdx.qty,
          dataMatIdx.source_material,
          dataMatIdx.cpo_number,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Material MR PS " + dataMR.mr_id + " Report.xlsx"
    );
  }

  async downloadMaterialMRTRACY() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    let headerRow = ["REC_TYPE", "FILLER", "COMP_CD", "CUST_DELIV_NO", "CUST_ID", "CUST_CNTRY_CD", "ETA_SHP_DT", "SHP_DT", "SITE_LOC_ID", "SITE_CNTRY_CD", "SEND_SYSTEM", "SEND_UNIT", "SALES_GRP", "PRNO ", "SHP_NO", "END_CUST_NM", "END_CUST_ID", "CUST_NM", "SALES_ORD_NO", "PACK_ID", "PURCH_ORD_NO", "SER_NO", "CIN", "GI_Type", "Shp_Pnt", "Plant_ID"];
    ws.addRow(headerRow);
    const dispatchData = dataMR.mr_status.find(e => e.mr_status_value === "DISPATCH");
    const dataSite = dataMR.site_info[0].site_id
    for (let i = 0; i < dataItemMR.length; i++) {
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        ws.addRow(["K", null, 2089, dataMR.mr_id, "XL", "ID", null, dispatchData.mr_status_date, dataMR.site_info[0].site_id,"ID", "DPM", 1105, null, dataMatIdx.material_id, dataMR.no_shipment, "XL Axiata", "XL", "XL Axiata", null, null, dataMatIdx.cpo_number, null, null, null, null, null]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "TRACY Material MR " + dataMR.mr_id + ".xlsx"
    );
  }

  async saveUpdateMaterial() {
    const dataXLS = this.state.rowsXLS;
    const dataMR = this.state.data_mr;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/updatePlantSpecWithVariant/" + dataMR._id,
      { identifier: "MR", data: dataXLS }
    );
    if(dataMR.id_plantspec_doc !== undefined){
      let submitPS = this.submitTSSR(dataMR.id_plantspec_doc);
    }
    if (
      patchDataMat.data !== undefined &&
      patchDataMat.status >= 200 &&
      patchDataMat.status <= 300
    ) {
      this.setState({ action_status: "success" });
    } else {
      if (
        patchDataMat.response !== undefined &&
        patchDataMat.response.data !== undefined &&
        patchDataMat.response.data.error !== undefined
      ) {
        if (patchDataMat.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: patchDataMat.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: patchDataMat.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  async needReviseMR() {
    const dataMR = this.state.data_mr;
    let patchDataMR = await this.patchDatatoAPINODE(
      "/matreq/needReviseMRFromWH/" + dataMR._id, {"note_value" : this.state.revision_note}
    );
    if (
      patchDataMR.data !== undefined &&
      patchDataMR.status >= 200 &&
      patchDataMR.status <= 300
    ) {
      this.setState({ action_status: "success", modal_revision : false });
    } else {
      if (
        patchDataMR.response !== undefined &&
        patchDataMR.response.data !== undefined &&
        patchDataMR.response.data.error !== undefined
      ) {
        if (patchDataMR.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: patchDataMR.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: patchDataMR.response.data.error,
            modal_revision : false
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  tableViewWBSCDID(cd_id){
    const dataCDWBS = this.state.wbs_cd_id_data;
    let dataCDWBSbyCDID = dataCDWBS.find(e => e.WP_ID === cd_id);
    if(dataCDWBSbyCDID !== undefined){
      return (
        <Fragment>
          <td>{dataCDWBSbyCDID.C1003_WBS_HW}</td>
          <td>{dataCDWBSbyCDID.C1008_WBS_HWAC}</td>
          <td>{dataCDWBSbyCDID.C1013_WBS_LCM}</td>
          <td>{dataCDWBSbyCDID.C1018_WBS_PNRO}</td>
          <td>{dataCDWBSbyCDID.C1024_WBS_PNDO}</td>
          <td>{dataCDWBSbyCDID.C1032_WBS_HW_Bulk}</td>
          <td>{dataCDWBSbyCDID.C1033_WBS_LCM_Bulk}</td>
          <td>{dataCDWBSbyCDID.C1034_WBS_PowHW_Site_Basis}</td>
          <td>{dataCDWBSbyCDID.C1035_WBS_PowLCM_Site_Basis}</td>
          <td>{dataCDWBSbyCDID.C1036_WBS_Kathrein}</td>
        </Fragment>
      )
    }else{
      return(
        <Fragment>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </Fragment>
      )
    }
  }

  render() {
    const background = {
      backgroundColor: "#e3e3e3",
    };

    const MapLoader = withScriptjs(GMap);

    let qty_wh = undefined,qty_inbound = undefined;
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
                  <i
                    className="fa fa-info-circle"
                    style={{ marginRight: "8px" }}
                  ></i>
                  MR Detail
                </span>
                {/* }<Button style={{float : 'right'}} color="warning" onClick={this.changeEditable}>Editable</Button> */}
                {this.state.edit_detail !== false && (
                  <Button
                    style={{ float: "right", marginRight: "10px" }}
                    color="success"
                    onClick={this.updateDataMR}
                  >
                    Save
                  </Button>
                )}
              </CardHeader>
              <CardBody>
                <div style={{ marginBottom: "10px" }}>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        href="#"
                        active={this.state.tabs_submenu[0]}
                        value="0"
                        onClick={this.changeTabsSubmenu.bind(this, 0)}
                      >
                        MR Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#"
                        active={this.state.tabs_submenu[1]}
                        value="1"
                        onClick={this.changeTabsSubmenu.bind(this, 1)}
                      >
                        MR Material
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#"
                        active={this.state.tabs_submenu[2]}
                        value="2"
                        onClick={this.changeTabsSubmenu.bind(this, 2)}
                      >
                        Progress Overview
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#"
                        active={this.state.tabs_submenu[3]}
                        value="2"
                        onClick={this.changeTabsSubmenu.bind(this, 3)}
                      >
                        Map View
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <table
                  style={{
                    width: "100%",
                    marginBottom: "0px",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          color: "rgba(59,134,134,1)",
                          fontSize: "21px",
                        }}
                      >
                        MR DETAIL
                      </td>
                    </tr>
                    {this.state.data_mr !== null && (
                      <Fragment>
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              fontSize: "15px",
                              textAlign: "center",
                              color: "rgba(59,134,134,1)",
                            }}
                          >
                            MR ID : {this.state.data_mr.mr_id}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              fontSize: "15px",
                              textAlign: "center",
                              color: "rgba(59,134,134,1)",
                            }}
                          >
                            Project Name : {this.state.data_mr.project_name}
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  </tbody>
                </table>
                <hr
                  style={{
                    borderStyle: "double",
                    borderWidth: "0px 0px 4px 0px",
                    borderColor: "rgba(59,134,134,1)",
                    marginTop: "5px",
                  }}
                ></hr>
                {this.state.tabs_submenu[0] === true && (
                  <Fragment>
                    {this.state.data_mr !== null && (
                      <Fragment>
                        <div className="mr-detail__body--flex">
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>CD ID</span>
                            </div>
                            <div>
                              <ul className="mr-detail__ul--cd-id">
                                {this.state.data_mr.cust_del !== undefined ? (
                                  this.state.data_mr.cust_del.map((e) => (
                                    <li>{e.cd_id}</li>
                                  ))
                                ) : (
                                  <li>{this.state.data_mr.cd_id}</li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>SOW Type</span>
                            </div>
                            <div>{this.state.data_mr.sow_type}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>Current Milestone</span>
                            </div>
                            <div>{this.state.data_mr.current_milestones}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>Current Status</span>
                            </div>
                            <div>{this.state.data_mr.current_mr_status}</div>
                          </div>
                        </div>

                        <div className="mr-detail__body--flex">
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>MR Type</span>
                            </div>
                            <div>{this.state.data_mr.mr_type}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>MR Delivery Type</span>
                            </div>
                            <div>{this.state.data_mr.mr_delivery_type}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>ETD</span>
                            </div>
                            <div>{this.state.data_mr.etd}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>ETA</span>
                            </div>
                            <div>{this.state.data_mr.eta}</div>
                          </div>
                        </div>

                        <div className="mr-detail__body--flex">
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>Delivery Company</span>
                            </div>
                            <div>{this.state.data_mr.dsp_company}</div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>Origin</span>
                            </div>
                            <div>
                              {this.state.data_mr.origin !== null
                                ? this.state.data_mr.origin.title +
                                  " " +
                                  this.state.data_mr.origin.value
                                : ""}
                            </div>
                          </div>
                          <div>
                            <div className="mr-detail__body--header-detail">
                              <span>Shipment ID</span>
                            </div>
                            <div>
                              {this.state.data_mr.no_shipment}
                            </div>
                          </div>
                        </div>

                        <hr className="mr-detail__line" />

                        <div className="mr-detail__body--flex">
                          {this.state.mr_site_NE !== null && (
                            <Fragment>
                              <div className="mr-detail__flex-body--25">
                                <div className="mr-detail__body--header-detail">
                                  <span>Site ID NE</span>
                                </div>
                                <div>{this.state.mr_site_NE.site_id}</div>
                              </div>
                              <div className="mr-detail__flex-body--25">
                                <div className="mr-detail__body--header-detail">
                                  <span>Site Name NE</span>
                                </div>
                                <div>{this.state.mr_site_NE.site_name}</div>
                              </div>
                            </Fragment>
                          )}
                          {this.state.mr_site_FE !== null && (
                            <Fragment>
                              <div className="mr-detail__flex-body--25">
                                <div className="mr-detail__body--header-detail">
                                  <span>Site ID FE</span>
                                </div>
                                <div>{this.state.mr_site_NE.site_id}</div>
                              </div>
                              <div className="mr-detail__flex-body--25">
                                <div className="mr-detail__body--header-detail">
                                  <span>Site Name FE</span>
                                </div>
                                <div>{this.state.mr_site_NE.site_name}</div>
                              </div>
                            </Fragment>
                          )}
                        </div>

                        <hr className="mr-detail__line" />

                        <div className="mr-detail__body--flex-long">
                            <Fragment>
                              {this.state.data_mr.cust_del !== undefined ? (
                                this.state.data_mr.cust_del.map((e) => (
                                  <div className="mr-detail__flex-body--25">
                                    <div className="mr-detail__body--header-detail">
                                      <span>WBS of CD ID {e.cd_id}</span>
                                    </div>
                                    <div>
                                      <Table responsive striped bordered size="sm">
                                        <thead>
                                          <tr style={{fontSize : '10.5px'}}>
                                            <th>WBS HW</th>
                                            <th>WBS HWAC</th>
                                            <th>WBS LCM</th>
                                            <th>WBS PNRO</th>
                                            <th>WBS PNDO</th>
                                            <th>WBS HW Bulk</th>
                                            <th>WBS LCM Bulk</th>
                                            <th>WBS PowHW Site Basis</th>
                                            <th>WBS PowLCM Site Basis</th>
                                            <th>WBS Kathrein</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr style={{fontSize : '10.5px'}}>
                                            {this.tableViewWBSCDID(e.cd_id)}
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="mr-detail__flex-body--25">
                                  <div className="mr-detail__body--header-detail">
                                    <span>WBS of CD ID {this.state.data_mr.cd_id}</span>
                                  </div>
                                  <div>{this.state.mr_site_NE.site_id}</div>
                                </div>
                              )}
                            </Fragment>
                        </div>

                        <hr className="mr-detail__line" />

                        <div className="mr-detail__body--flex"></div>
                      </Fragment>
                    )}
                  </Fragment>
                )}
                {this.state.tabs_submenu[1] === true && (
                  <Fragment>
                    <Row>
                      <Col md="6">
                        <table>
                          <tbody>
                            {this.state.data_mr !== null && (
                              <Fragment>
                                {this.state.mr_site_NE !== null && (
                                  <Fragment>
                                    <tr>
                                      {this.state.data_mr.mr_type ===
                                        "Relocation" ||
                                      this.state.data_mr.mr_type ===
                                        "Return" ? (
                                        <td style={{ width: "150px" }}>
                                          Destination{" "}
                                          {this.state.data_mr.destination.title}
                                        </td>
                                      ) : (
                                        <td style={{ width: "150px" }}>
                                          Site ID NE
                                        </td>
                                      )}
                                      <td>: &nbsp;</td>
                                      {this.state.data_mr.mr_type ===
                                        "Relocation" ||
                                      this.state.data_mr.mr_type ===
                                        "Return" ? (
                                        <td style={{ width: "150px" }}>
                                          {this.state.data_mr.destination.value}
                                        </td>
                                      ) : (
                                        <td>{this.state.mr_site_NE.site_id}</td>
                                      )}
                                    </tr>
                                    {this.state.data_mr.mr_type !==
                                      "Relocation" &&
                                    this.state.data_mr.mr_type !== "Return" ? (
                                      <tr>
                                        <td style={{ width: "150px" }}>
                                          Site Name NE
                                        </td>
                                        <td>:</td>
                                        <td>
                                          {this.state.mr_site_NE.site_name}
                                        </td>
                                      </tr>
                                    ) : (
                                      ""
                                    )}
                                    <tr>
                                      <td style={{ width: "150px" }}>
                                        Total Box
                                      </td>
                                      <td>:</td>
                                      <td>{this.state.data_mr.total_boxes}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ width: "150px" }}>Box ID</td>
                                      <td>:</td>
                                      <td>
                                        {this.state.data_mr.list_of_box_id !==
                                        undefined
                                          ? this.state.data_mr.list_of_box_id.map(
                                              (e) => e + ", "
                                            )
                                          : ""}
                                      </td>
                                    </tr>
                                  </Fragment>
                                )}
                              </Fragment>
                            )}
                          </tbody>
                        </table>
                      </Col>
                      <Col md="6">
                        <table style={{ marginBottom: "0px" }}>
                          <tbody>
                            {this.state.data_mr !== null && (
                              <Fragment>
                                <tr>
                                  <td style={{ width: "550px" }}>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      style={{ float: "right" }}
                                      onClick={this.downloadMaterialMRUpload}
                                    >
                                      Download Format
                                    </Button>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      style={{
                                        float: "right",
                                        marginRight: "10px",
                                      }}
                                      onClick={this.downloadMaterialMRReport}
                                    >
                                      Download MR PS
                                    </Button>
                                    <Button
                                      size="sm"
                                      color="secondary"
                                      style={{
                                        float: "right",
                                        marginRight: "10px",
                                      }}
                                      onClick={this.downloadMaterialMRTRACY}
                                    >
                                      TRACY Format
                                    </Button>
                                  </td>
                                </tr>
                                {this.state.mr_site_FE !== null &&
                                this.state.data_mr.mr_type !== "Relocation" &&
                                this.state.data_mr.mr_type !== "Return" ? (
                                  <Fragment>
                                    <tr>
                                      <td style={{ width: "200px" }}>
                                        Site ID FE
                                      </td>
                                      <td>: &nbsp;</td>
                                      <td>{this.state.mr_site_FE.site_id}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ width: "200px" }}>
                                        Site Name FE
                                      </td>
                                      <td>:</td>
                                      <td>{this.state.mr_site_FE.site_name}</td>
                                    </tr>
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    <tr>
                                      <td style={{ fontSize: "12px" }}>
                                        &nbsp;
                                      </td>
                                    </tr>
                                    {status_can_edit_material.includes(
                                      this.state.data_mr.current_mr_status
                                    ) && (
                                      <tr>
                                        <td style={{ fontSize: "12px" }}>
                                          Change to Material Variant :{" "}
                                        </td>
                                      </tr>
                                    )}
                                  </Fragment>
                                )}
                                {status_can_edit_material.includes(
                                  this.state.data_mr.current_mr_status
                                ) && (
                                  <tr>
                                    <td style={{ width: "550px" }}>
                                      <input
                                        type="file"
                                        onChange={this.fileHandlerMaterial.bind(
                                          this
                                        )}
                                        style={{ visiblity: "hidden" }}
                                      />
                                      <Button
                                        size="sm"
                                        color="success"
                                        style={{ float: "right" }}
                                        onClick={this.saveUpdateMaterial}
                                        disabled={
                                          this.state.rowsXLS.length === 0
                                        }
                                      >
                                        Save
                                      </Button>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            )}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                    <hr className="upload-line-ordering"></hr>
                    <div>PlantSpec Group No : {this.state.data_mr !== null ? this.state.data_mr.no_plantspec : ""}</div>
                    <div className="divtable2">
                      <Table hover bordered striped responsive size="sm">
                        <thead
                          style={{ backgroundColor: "#0B486B", color: "white" }}
                          className="table-mr__header--fixed"
                        >
                          <tr>
                            <th
                              rowSpan="2"
                              className="fixedhead"
                              style={{
                                width: "250px",
                                verticalAlign: "middle",
                              }}
                            >
                              PP / Material Code
                            </th>
                            <th
                              rowSpan="2"
                              className="fixedhead"
                              style={{ verticalAlign: "middle" }}
                            >
                              PP / Material Name
                            </th>
                            <th
                              rowSpan="2"
                              className="fixedhead"
                              style={{ width: "75px", verticalAlign: "middle" }}
                            >
                              Program
                            </th>
                            <th
                              rowSpan="2"
                              className="fixedhead"
                              style={{ width: "75px", verticalAlign: "middle" }}
                            >
                              Unit
                            </th>
                            <th
                              colSpan="2"
                              className="fixedhead"
                              style={{
                                width: "100px",
                                verticalAlign: "middle",
                              }}
                            >
                              Total Qty per PP
                            </th>
                            {this.state.data_mr !== null &&
                            status_can_edit_material.includes(
                              this.state.data_mr.current_mr_status
                            ) ? (
                              <Fragment>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{
                                    width: "100px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  Material in Warehouse
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{
                                    width: "100px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  Material Plan
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{
                                    width: "100px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  Availability
                                </th>
                              </Fragment>
                            ) : (
                              <Fragment></Fragment>
                            )}
                            <th
                              rowSpan="2"
                              className="fixedhead"
                              style={{ width: "75px", verticalAlign: "middle" }}
                            >
                              CPO Number
                            </th>
                            <th rowSpan="2" className="fixedhead" style={{verticalAlign: "middle" }}>
                              PS No. / Material Source
                            </th>
                          </tr>
                          {this.state.data_mr !== null &&
                          this.state.data_mr.mr_type !== "Relocation" &&
                          this.state.data_mr.mr_type !== "Return" ? (
                            <tr>
                              <th
                                className="fixedhead"
                                colSpan={this.state.mr_site_FE !== null ? 1 : 2}
                                style={{
                                  width: "100px",
                                  verticalAlign: "middle",
                                }}
                              >
                                Site NE
                              </th>
                              {this.state.mr_site_FE !== null ? (
                                <th
                                  className="fixedhead"
                                  style={{
                                    width: "100px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  SITE FE
                                </th>
                              ) : (
                                <Fragment></Fragment>
                              )}
                            </tr>
                          ) : (
                            ""
                          )}
                        </thead>
                        {this.state.data_mr !== null &&
                        status_can_edit_material.includes(this.state.data_mr.current_mr_status) ? (
                          <tbody>
                            {this.state.mr_site_NE !== null &&
                              this.state.list_mr_item.filter(e => e.product_type.toLowerCase() !== "svc").map((pp) => (
                                <Fragment>
                                  <tr
                                    style={{ backgroundColor: "#E5FCC2" }}
                                    className="fixbody"
                                  >
                                    <td style={{ textAlign: "left" }}>
                                      {pp.pp_id}
                                    </td>
                                    <td>{pp.product_name}</td>
                                    <td>{pp.program}</td>
                                    <td>{pp.uom}</td>
                                    <td
                                      align="center"
                                      colSpan={
                                        this.state.mr_site_FE !== null ? 1 : 2
                                      }
                                    >
                                      {pp.qty}
                                    </td>
                                    {this.state.mr_site_FE !== null ? (
                                      <td align="center">
                                        {this.getQtyMRPPFE(pp.pp_id)}
                                      </td>
                                    ) : (
                                      <Fragment></Fragment>
                                    )}
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{pp.cpo_number}</td>
                                    <td>{pp.no_tssr_boq_site}</td>
                                  </tr>
                                  {pp.materials.map((material) => (
                                    <tr
                                      style={{
                                        backgroundColor:
                                          "rgba(248,246,223, 0.5)",
                                      }}
                                      className="fixbody"
                                    >
                                      <td style={{ textAlign: "right" }}>
                                        {material.material_id}
                                      </td>
                                      <td style={{ textAlign: "left" }}>
                                        {material.material_name}
                                      </td>
                                      <td></td>
                                      <td>{material.uom}</td>
                                      <td
                                        align="center"
                                        colSpan={
                                          this.state.mr_site_FE !== null ? 1 : 2
                                        }
                                      >
                                        {material.qty}
                                      </td>
                                      {this.state.mr_site_FE !== null ? (
                                        <td align="center">
                                          {this.getQtyMRMDFE(
                                            pp.pp_id,
                                            material.material_id
                                          )}
                                        </td>
                                      ) : (
                                        <Fragment></Fragment>
                                      )}
                                      <td align="center">
                                        {
                                          (qty_wh =
                                            this.state.material_wh.find(
                                              (e) =>
                                                e.sku === material.material_id
                                            ) !== undefined
                                              ? this.state.material_wh
                                                  .find(
                                                    (e) =>
                                                      e.sku ===
                                                      material.material_id
                                                  )
                                                  .qty_sku.toFixed(2)
                                              : 0)
                                        }
                                      </td>
                                      <td align="center">
                                        {
                                          (qty_inbound =
                                            this.state.material_inbound.find(
                                              (e) =>
                                                e.sku === material.material_id
                                            ) !== undefined
                                              ? this.state.material_inbound
                                                  .find(
                                                    (e) =>
                                                      e.sku ===
                                                      material.material_id
                                                  )
                                                  .qty_sku.toFixed(2)
                                              : 0)
                                        }
                                      </td>
                                      <td align="center">
                                        {material.qty < qty_wh ? "OK" : "NOK"}
                                      </td>
                                      <td>{material.cpo_number}</td>
                                      <td>{material.source_material}</td>
                                    </tr>
                                  ))}
                                </Fragment>
                              ))}
                            {this.state.data_mr === null ? (
                              <tr>
                                <td colSpan="5">Loading...</td>
                              </tr>
                            ) : (
                              this.state.data_mr.current_mr_status === "NOT ASSIGNED" && (
                                <tr>
                                  <td colSpan="5">PS not Assigned</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        ) : (
                          <tbody>
                            {this.state.mr_site_NE !== null &&
                              this.state.list_mr_item.map((pp) => (
                                <Fragment>
                                  <tr
                                    style={{ backgroundColor: "#E5FCC2" }}
                                    className="fixbody"
                                  >
                                    <td style={{ textAlign: "left" }}>
                                      {pp.pp_id}
                                    </td>
                                    <td>{pp.product_name}</td>
                                    <td>{pp.program}</td>
                                    <td>{pp.uom}</td>
                                    <td align="center" colSpan={this.state.mr_site_FE !== null ? 1 : 2}>{pp.qty}</td>
                                    {this.state.mr_site_FE !== null ? (
                                      <td align="center">
                                        {this.getQtyMRPPFE(pp.pp_id)}
                                      </td>
                                    ) : (
                                      <Fragment></Fragment>
                                    )}
                                    <td>{pp.cpo_number}</td>
                                    <td>{pp.no_tssr_boq_site}</td>
                                  </tr>
                                  {pp.materials.map((material) => (
                                    <tr
                                      style={{
                                        backgroundColor:
                                          "rgba(248,246,223, 0.5)",
                                      }}
                                      className="fixbody"
                                    >
                                      <td style={{ textAlign: "right" }}>
                                        {material.material_id}
                                      </td>
                                      <td style={{ textAlign: "left" }}>
                                        {material.material_name}
                                      </td>
                                      <td></td>
                                      <td>{material.uom}</td>
                                      <td align="center" colSpan={this.state.mr_site_FE !== null ? 1 : 2}>{material.qty}</td>
                                      {this.state.mr_site_FE !== null ? (
                                        <td align="center">
                                          {this.getQtyMRMDFE(
                                            pp.pp_id,
                                            material.material_id
                                          )}
                                        </td>
                                      ) : (
                                        <Fragment></Fragment>
                                      )}
                                      <td>{material.cpo_number}</td>
                                      <td>{material.source_material}</td>
                                    </tr>
                                  ))}
                                </Fragment>
                              ))}
                            {this.state.data_mr === null ? (
                              <tr>
                                <td colSpan="5">Loading...</td>
                              </tr>
                            ) : (
                              this.state.data_mr.current_mr_status ===
                                "NOT ASSIGNED" && (
                                <tr>
                                  <td colSpan="5">PS not Assigned</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        )}
                      </Table>
                    </div>
                  </Fragment>
                )}
                {this.state.tabs_submenu[2] === true && (
                  <Fragment>
                    <div className="animated fadeIn">
                      {this.state.data_mr !== null && (
                        <Row>
                          <Col md="6">
                            <table style={{ marginBottom: "10px" }}>
                              <tbody>
                                <tr>
                                  <td style={{ width: "150px" }}>
                                    Current Milestone
                                  </td>
                                  <td> : </td>
                                  <td>
                                    {this.state.data_mr.current_milestones}
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ width: "150px" }}>
                                    Current Status
                                  </td>
                                  <td> : </td>
                                  <td>
                                    {this.state.data_mr.current_mr_status}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col xs="12" lg="12">
                          <Card>
                            <CardHeader>
                              {this.state.data_mr !== null && (
                                <span>
                                  {" "}
                                  Progress Overview for{" "}
                                  <b>{this.state.data_mr.mr_id}</b>{" "}
                                </span>
                              )}
                            </CardHeader>
                            <CardBody style={background}>
                              <VerticalTimeline>
                                {this.state.data_mr !== null &&
                                  this.state.data_mr.mr_status
                                    .filter(
                                      (e) =>
                                        e.mr_status_name !== "IMPLEMENTATION"
                                    )
                                    .map((ms, i) => {
                                      return this.milestoneStat(
                                        ms.mr_status_name,
                                        ms.mr_status_value,
                                        ms.mr_status_date,
                                        ms.mr_status_updater,
                                        i
                                      );
                                    })}
                              </VerticalTimeline>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )}
                {this.state.tabs_submenu[3] === true && (
                  <Fragment>
                    {/* <GoogleMap site_lat={-6.3046027} site_lng={106.7951936} /> AIzaSyAoCmcgwc7MN40js68RpcZdSzh9yLrmLF4*/}
                    <MapLoader
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB5mmXco3GYZhRDNY4CJcBlaENjteSC8DM"
                      loadingElement={<div style={{ height: "100%" }} />}
                    />
                  </Fragment>
                )}
              </CardBody>
              <CardFooter>
                {this.state.data_mr !== null && (
                  <div>
                    {this.state.data_mr.current_mr_status ===
                      "PLANTSPEC ASSIGNED" ||
                    this.state.data_mr.current_mr_status ===
                      "PLANTSPEC UPDATED" ? (
                      <Button
                        color="success"
                        style={{ float: "right" }}
                        onClick={this.requestForApproval}
                      >
                        {" "}
                        Send Request
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    {this.state.data_mr.current_mr_status === "MR REQUESTED" ? (
                      // <Button color='success' style={{float : 'right'}} onClick={this.ApproveMR}>Approve</Button>
                      <Button
                        color="success"
                        style={{ float: "right" }}
                        onClick={this.toggleModalapprove}
                      >
                        Approve
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    <Button
                      color="warning"
                      style={{ float: "left" }}
                      size="sm"
                      onClick={this.toggleModalRevision}
                    >
                      Need Revise
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* Modal Loading */}
        <Modal
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm " + this.props.className}
        >
          <ModalBody>
            <div style={{ textAlign: "center" }}>
              <div className="lds-ring">
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

        <Modal isOpen={this.state.modal_revision} toggle={this.toggleModalRevision} className={"modal-sm"}>
          <ModalHeader>Note for Revision</ModalHeader>
          <ModalBody>
            <Input type="textarea" rows="9" placeholder="Note..." onChange={this.handleRevisionNote} value={this.state.revision_note} />
          </ModalBody>
          <ModalFooter>
            <Button color="warning" style={{ float: "right", marginRight: "8px" }} onClick={this.needReviseMR}><i className="fa fa-edit" style={{ marginRight: "8px" }}></i> Need Revision</Button>
            <Button color="secondary" onClick={this.toggleModalRevision}>Cancel</Button>
          </ModalFooter>
        </Modal>

        {/* modal form approve */}
        <ModalForm
          isOpen={this.state.modal_approve_ldm}
          toggle={this.toggleModalapprove}
          className={'modal-sm modal--box-input'}
        >
          <Col>
          {this.state.data_mr !== null && this.state.data_mr !== undefined && this.state.data_mr.dsp_company !== null ? (
            <FormGroup>
              <Label htmlFor="total_box">Delivery Company</Label>
              <Input
                type="text"
                className=""
                placeholder=""
                value={this.state.data_mr.dsp_company}
                readOnly
              />
            </FormGroup>
          ) : (
            <FormGroup>
              <Label htmlFor="total_box">DSP Company</Label>
              <Input
                type="select"
                className=""
                placeholder=""
                onChange={this.handleLDMapprove}
              >
                {this.state.asp_data.map((asp) => (
                  <option value={asp.Vendor_Code}>{asp.Name}</option>
                ))}
              </Input>
            </FormGroup>
          )}
          </Col>
          <div style={{ justifyContent: "center", alignSelf: "center" }}>
            <Button
              color="success"
              onClick={this.ApproveMR}
              className="btn-pill"
            >
              <i className="icon-check icons"></i> Approve
            </Button>
          </div>
        </ModalForm>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(MRDetail);
