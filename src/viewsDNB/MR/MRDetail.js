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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Form, FormGroup, Label } from "reactstrap";
import { Link } from "react-router-dom";
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
import { getDatafromAPINODEFile } from "../../helper/asyncFunction";

import { convertDateFormatfull } from "../../helper/basicFunction";

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

const status_can_edit_material = [
  "PLANTSPEC ASSIGNED",
  "PLANTSPEC UPDATED",
  "MR REQUESTED",
  "MR CANCELED",
  "MR APPROVED",
  "MR REJECTED",
  "MR UPDATED",
  "ORDER PROCESSING START",
  "MR NEED REVISION",
  "PS NEED REVISION",
];

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
      data_wh: {},
      mr_site_NE: null,
      mr_site_FE: null,
      update_mr_form: {},
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
      wbs_cd_id_data: [],
      location_mr: {},
      dropdownOpen: new Array(2).fill(false),
      modal_loading: false,
      dsp_list: [],
      sid_file: [],
      abd_file: [],
      mot_type: null,
      product_package_ps_mw: [],
      modal_cancel_mr: false,
      edit_mr_material: false,
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
    this.downloadMaterialMRUpload2 = this.downloadMaterialMRUpload2.bind(this);
    this.saveUpdateMaterial = this.saveUpdateMaterial.bind(this);
    this.downloadMaterialMRReport = this.downloadMaterialMRReport.bind(this);
    this.needReviseMR = this.needReviseMR.bind(this);
    this.takeoutPS = this.takeoutPS.bind(this);
    this.cancelMR = this.cancelMR.bind(this);
    this.toggleModalapprove = this.toggleModalapprove.bind(this);
    this.toggleModalRevision = this.toggleModalRevision.bind(this);
    this.handleRevisionNote = this.handleRevisionNote.bind(this);
    this.downloadMaterialMRTRACY = this.downloadMaterialMRTRACY.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.exportMRFormat = this.exportMRFormat.bind(this);
    this.updateMR = this.updateMR.bind(this);
    this.downloadMaterialSerialNumberReport =
      this.downloadMaterialSerialNumberReport.bind(this);
    this.handleMotType = this.handleMotType.bind(this);
    this.toggleModalCancelMR = this.toggleModalCancelMR.bind(this);
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
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
      modal_revision: !prevState.modal_revision,
    }));
  }

  toggleModalCancelMR(e) {
    this.setState((prevState) => ({
      modal_cancel_mr: !prevState.modal_cancel_mr,
    }));
  }

  toggleDropdown(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  handleRevisionNote(e) {
    let value = e.target.value;
    this.setState({ revision_note: value });
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
    this.getDatafromAPIEXEL('/vendor_data_non_page?where={"Type":"DSP"}').then(
      (res) => {
        // console.log("asp data ", res.data);
        if (res.data !== undefined) {
          this.setState({ asp_data: res.data._items });
        } else {
          this.setState({ asp_data: [] });
        }
      }
    );
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
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE + url, {
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
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async getDatafromAPIXL(url) {
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

  async deleteDataFromAPINODE(url, data) {
    try {
      let respond = await axios.delete(
        process.env.REACT_APP_API_URL_NODE + url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.tokenUser,
          },
          data: data,
        }
      );
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond delete Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond delete Data err", err);
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
        this.getMRLocation(_id_MR);
        if (resMR.data.dsp_company === null) {
          this.getASPList();
        }
        this.setState({ data_mr: resMR.data }, () => {
          if (resMR.data.origin !== undefined) {
            this.getWHOrigin(resMR.data.origin.value);
          }
          if (this.state.data_mr.cust_del !== undefined) {
            this.getDataCDID(this.state.data_mr.cust_del.map((e) => e.cd_id));
            this.getSIDNumber(this.state.data_mr.cust_del.map((e) => e.cd_id));
          }
          this.setState({ mr_pp: resMR.data.packages }, () => {
            if (
              status_can_edit_material.includes(resMR.data.current_mr_status)
            ) {
              this.getDataWarehouse(resMR.data.packages);
              this.getDataInbound(resMR.data.packages);
            }
            this.prepareView();
          });
        });
      }
    });
  }

  async getSIDNumber(arrayCDID) {
    const page = 1;
    const maxPage = 1;
    let dataSID = [];
    let dataABD = [];
    for (let i = 0; i < arrayCDID.length; i++) {
      let filter_array = [];
      filter_array.push('"cust_del.cd_id":"' + arrayCDID[i] + '"');
      filter_array.push('"type" : {"$ne" : "ABD"}');
      let whereAnd = "{" + filter_array.join(",") + "}";
      const res = await this.getDataFromAPINODE(
        "/sidFile?srt=_id:-1&q=" + whereAnd + "&lmt=" + maxPage + "&pg=" + page
      );
      if (
        res.data !== undefined &&
        res.data.data !== undefined &&
        res.data.data.length !== 0
      ) {
        dataSID.push(res.data.data[0]);
      }
    }
    for (let i = 0; i < arrayCDID.length; i++) {
      let filter_array = [];
      filter_array.push('"cust_del.cd_id":"' + arrayCDID[i] + '"');
      filter_array.push('"type" : "ABD"');
      let whereAnd = "{" + filter_array.join(",") + "}";
      const res = await this.getDataFromAPINODE(
        "/sidFile?srt=_id:-1&q=" + whereAnd + "&lmt=" + maxPage + "&pg=" + page
      );
      if (
        res.data !== undefined &&
        res.data.data !== undefined &&
        res.data.data.length !== 0
      ) {
        dataABD.push(res.data.data[0]);
      }
    }
    this.setState({ sid_file: dataSID, abd_file: dataABD });
  }

  getWHOrigin(wh_id) {
    this.getDataFromAPINODE(
      '/whManagement/warehouse?q={"wh_id" : "' + wh_id + '"}'
    ).then((resWH) => {
      if (resWH.data !== undefined) {
        if (resWH.data.data[0] !== undefined) {
          this.setState({ data_wh: resWH.data.data[0] });
          console.log("resWH", resWH.data.data[0]);
        }
      }
    });
  }

  getMRLocation(_id_MR) {
    this.getDataFromAPINODE("/getMRLocationById/" + _id_MR).then((resLocMR) => {
      if (resLocMR.data !== undefined) {
        this.setState({ location_mr: resLocMR.data });
      }
    });
  }

  async getDataCDID(array_cd_id) {
    let array_in_cdid = '"' + array_cd_id.join('", "') + '"';
    let projection =
      '&projection={"WP_ID" : 1, "C1003_WBS_HW" : 1, "C1008_WBS_HWAC" : 1, "C1013_WBS_LCM" : 1, "C1018_WBS_PNRO" : 1, "C1024_WBS_PNDO" : 1, "C1032_WBS_HW_Bulk" : 1, "C1033_WBS_LCM_Bulk" : 1, "C1034_WBS_PowHW_Site_Basis" : 1, "C1035_WBS_PowLCM_Site_Basis" : 1, "C1036_WBS_Kathrein" : 1, "C1045_WBS_LCM_8107" : 1, "C01063_WBS_Power_2114" : 1}';
    const getWPID = await this.getDatafromAPIXL(
      '/custdel_sorted?where={"WP_ID":{"$in" : [' +
        array_in_cdid +
        "]}}" +
        projection
    );
    if (getWPID !== undefined && getWPID.data !== undefined) {
      this.setState({ wbs_cd_id_data: getWPID.data._items });
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
    let list_mr_item = [];
    let site_NE = undefined;
    let site_FE = undefined;
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
    if (mr_data.sow_type === "TRM") {
      let dataPPPS = Object.assign({}, data_pp);
      let dataPPNE = dataPPPS.filter((ne) => ne.site_title === "NE");
      let dataPPMW = [];
      for (let i = 0; i < dataPPNE.length; i++) {
        let dataNEIdx = Object.assign({}, dataPPNE[i]);
        const dataFEIdx = dataPPPS.find(
          (fe) =>
            fe.site_title === "FE" && fe.id_pp_doc === dataPPNE[i].id_pp_doc
        );
        const dataFEIdxCopy = Object.assign({}, dataFEIdx);
        const materialConcat = dataPPNE[i].materials.concat(
          dataFEIdxCopy.materials
        );
        const materialConcatNE = materialConcat.filter(
          (mc) => mc.site_title === "NE"
        );
        let materialConcatUniq = this.uniqObjectArray(
          JSON.parse(JSON.stringify(materialConcat)),
          "id_mc_doc"
        );
        for (let j = 0; j < materialConcatUniq.length; j++) {
          let materialConcatNE = materialConcat.find(
            (mcf) =>
              mcf.site_title === "NE" &&
              mcf.id_mc_doc === materialConcatUniq[j].id_mc_doc
          );
          let materialConcatFE = materialConcat.find(
            (mcf) =>
              mcf.site_title === "FE" &&
              mcf.id_mc_doc === materialConcatUniq[j].id_mc_doc
          );
          if (materialConcatNE !== undefined) {
            materialConcatUniq[j]["qty"] = materialConcatNE.qty;
            materialConcatUniq[j]["_id_ne"] = materialConcatNE._id;
          } else {
            materialConcatUniq[j]["qty"] = 0;
          }
          if (materialConcatFE !== undefined) {
            materialConcatUniq[j]["qty_fe"] = materialConcatFE.qty;
            materialConcatUniq[j]["_id_fe"] = materialConcatFE._id;
          } else {
            materialConcatUniq[j]["qty_fe"] = 0;
          }
        }
        dataNEIdx["_id_ne"] = dataNEIdx._id;
        dataNEIdx["_id_fe"] = dataFEIdxCopy._id;
        dataNEIdx["qty_fe"] = dataFEIdxCopy.qty;
        dataNEIdx["materials"] = materialConcatUniq;
        dataPPMW.push(dataNEIdx);
      }
      this.setState({ product_package_ps_mw: dataPPMW });
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
    if (this.state.edit_detail === false) {
      this.getDSPList();
      let dataForm = this.state.update_mr_form;
      dataForm["vendor_code"] = this.state.data_mr.dsp_company_code;
      dataForm["vendor_name"] = this.state.data_mr.dsp_company;
      this.setState({ update_mr_form: dataForm });
    }
    this.setState((prevState) => ({
      edit_detail: !prevState.edit_detail,
    }));
  }

  getDSPList() {
    this.toggleLoading();
    this.getDatafromAPIXL('/vendor_data_non_page?where={"Type":"ASP"}').then(
      (res) => {
        if (res.data !== undefined) {
          const items = res.data._items;
          this.setState({ dsp_list: items });
        }
        this.toggleLoading();
      }
    );
  }

  changeTabsSubmenu(e) {
    let tab_submenu = new Array(4).fill(false);
    tab_submenu[parseInt(e)] = true;
    this.setState({ tabs_submenu: tab_submenu });
  }

  handleChangeFormMRUpdate(e) {
    const value = e.target.value;
    const field = e.target.name;
    let dataForm = this.state.update_mr_form;
    dataForm[field] = value;
    const indexOpt = e.target.selectedIndex;
    if (field === "vendor_code") {
      let vendoridx = this.state.dsp_list.find((v) => v.Vendor_Code === value);
      if (vendoridx !== undefined) {
        dataForm["vendor_name"] = vendoridx.Name;
      }
    }
    this.setState({ update_mr_form: dataForm });
  }

  milestoneStat(ms_name, ms_status, ms_date, ms_updater, ms_notes, index) {
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
        {ms_notes !== undefined && ms_notes !== null && (
          <h6 className="vertical-timeline-element-subtitle">
            Notes : {ms_notes}
          </h6>
        )}
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

  submitTSSR(_id_ps) {
    this.patchDatatoAPINODE("/plantspec/submitPlantspec/" + _id_ps).then(
      (res) => {
        if (res.data !== undefined) {
          // this.setState({ action_status : "success" });
        } else {
          // this.setState({ action_status : "failed" });
        }
      }
    );
  }

  requestForApproval() {
    this.toggleLoading();
    let dataMR = this.state.data_mr;
    this.patchDatatoAPINODE("/matreq/requestMatreq/" + dataMR._id).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          this.toggleLoading();
        } else {
          this.setState({ action_status: "failed" });
          this.toggleLoading();
        }
      }
    );
  }

  ApproveMR(e) {
    this.toggleLoading();
    const _id = this.props.match.params.id;
    let body = this.state.selected_dsp;
    if (
      this.state.data_mr.dsp_company !== null &&
      this.state.data_mr.dsp_company !== undefined
    ) {
      body = {
        dsp_company_code: this.state.data_mr.dsp_company_code,
        dsp_company: this.state.data_mr.dsp_company,
      };
    }
    body = { ...body, motType: this.state.mot_type };
    // console.log('_id ',_id);
    // console.log('body ',body);
    this.patchDatatoAPINODE("/matreq/approveMatreq/" + _id, body).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          this.toggleModalapprove();
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
          this.toggleModalapprove();
          this.toggleLoading();
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
    const dataItemMR = this.state.list_mr_item.filter(
      (e) =>
        e.product_type.toLowerCase() !== "svc" &&
        e.product_type.toLowerCase() !== "hwac" &&
        e.product_type.toLowerCase() !== "sw"
    );
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    let headerRow = [
      "bam_id",
      "ps_number",
      "site_id",
      "site_name",
      "site_title",
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
      "Material Origin",
      "WBS",
    ];
    ws.addRow(headerRow);
    let list_material_id = [];
    let dataCDIDIdx = {};
    if (dataMR.cust_del !== undefined && dataMR.cust_del[0] !== undefined) {
      dataCDIDIdx = this.state.wbs_cd_id_data;
      if (dataCDIDIdx.length !== 0) {
        let dataCDID_5 = dataCDIDIdx.find((dci) => /_5$/.test(dci.WP_ID));
        if (dataCDID_5 === undefined) {
          dataCDIDIdx = dataCDIDIdx[0];
        } else {
          dataCDIDIdx = dataCDID_5;
        }
      } else {
        dataCDIDIdx = {};
      }
    }
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
        let dataWBS = null;
        if (
          dataMatIdx.material_origin !== undefined &&
          dataMatIdx.material_origin !== null
        ) {
          if (dataMatIdx.material_origin.toLowerCase() === "eab") {
            dataWBS = dataCDIDIdx.C1003_WBS_HW;
          }
          if (dataMatIdx.material_origin.toLowerCase() === "lcm") {
            dataWBS = dataCDIDIdx.C1013_WBS_LCM;
          }
          if (dataMatIdx.material_origin.toLowerCase() === "eab antenna") {
            dataWBS = dataCDIDIdx.C1036_WBS_Kathrein;
          }
          if (dataMatIdx.material_origin.toLowerCase() === "lcm antenna") {
            dataWBS = dataCDIDIdx.C1045_WBS_LCM_8107;
            if (
              dataWBS === undefined ||
              dataWBS === null ||
              dataWBS.length === 0
            ) {
              dataWBS = dataCDIDIdx.C1013_WBS_LCM;
            }
          }
          if (dataMatIdx.material_origin.toLowerCase() === "eab power") {
            dataWBS = dataCDIDIdx.C01063_WBS_Power_2114;
          }
        }
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
          dataMatIdx.uom,
          dataMatIdx.qty,
          qty_wh,
          qty_inbound,
          dataMatIdx.qty < qty_wh ? "OK" : "NOK",
          dataMatIdx.source_material,
          dataMatIdx.material_origin,
          dataWBS,
        ]);
      }
    }

    let listMatId = [...new Set(list_material_id)];
    let matIdData = {
      list_material_id: listMatId,
    };

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
    const getQtyfromWHbySKU = await this.postDatatoAPINODE(
      "/whStock/getWhStockbySku",
      { sku: sku_list }
    ).then((res) => {
      if (res.data !== undefined && res.status >= 200 && res.status < 400) {
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

  async downloadMaterialMRUpload2() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item.filter(
      (e) =>
        e.product_type.toLowerCase() !== "svc" &&
        e.product_type.toLowerCase() !== "hwac" &&
        e.product_type.toLowerCase() !== "sw"
    );
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
        if (dataMatIdx.qty < qty_wh) {
          continue;
        }
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
          dataMatIdx.uom,
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
      list_material_id: listMatId,
    };

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
    const getQtyfromWHbySKU = await this.postDatatoAPINODE(
      "/whStock/getWhStockbySku",
      { sku: sku_list }
    ).then((res) => {
      if (res.data !== undefined && res.status >= 200 && res.status < 400) {
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
      "Material MR " + dataMR.mr_id + " uploader NOK.xlsx"
    );
  }

  async downloadMaterialMRReport() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item.filter(
      (e) =>
        e.product_type.toLowerCase() !== "svc" &&
        e.product_type.toLowerCase() !== "hwac" &&
        e.product_type.toLowerCase() !== "sw"
    );
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    ws.addRow(["MR ID", dataMR.mr_id]);
    ws.addRow(["Project", dataMR.project_name]);
    ws.addRow(["Site", this.state.mr_site_NE.site_id]);

    ws.addRow([""]);

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
      "Program",
    ];
    ws.addRow(headerRow);
    ws.getCell("A5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("B5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("C5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("D5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("E5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("F5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("G5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("H5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("I5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("J5").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("A5").font = { bold: true };
    ws.getCell("B5").font = { bold: true };
    ws.getCell("C5").font = { bold: true };
    ws.getCell("D5").font = { bold: true };
    ws.getCell("E5").font = { bold: true };
    ws.getCell("F5").font = { bold: true };
    ws.getCell("G5").font = { bold: true };
    ws.getCell("H5").font = { bold: true };
    ws.getCell("I5").font = { bold: true };
    ws.getCell("J5").font = { bold: true };
    ws.addRow([]);
    for (let i = 0; i < dataItemMR.length; i++) {
      ws.addRow([
        dataItemMR[i].pp_id,
        dataItemMR[i].product_name,
        null,
        null,
        dataItemMR[i].uom,
        null,
        null,
        null,
        dataItemMR[i].no_tssr_boq_site,
        dataItemMR[i].program,
      ]);
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

    let headerRow = [
      "REC_TYPE",
      "FILLER",
      "COMP_CD",
      "CUST_DELIV_NO",
      "CUST_ID",
      "CUST_CNTRY_CD",
      "ETA_SHP_DT",
      "SHP_DT",
      "SITE_LOC_ID",
      "SITE_CNTRY_CD",
      "SEND_SYSTEM",
      "SEND_UNIT",
      "SALES_GRP",
      "PRNO ",
      "SHP_NO",
      "END_CUST_NM",
      "END_CUST_ID",
      "CUST_NM",
      "SALES_ORD_NO",
      "PACK_ID",
      "PURCH_ORD_NO",
      "SER_NO",
      "CIN",
      "GI_Type",
      "Shp_Pnt",
      "Plant_ID",
    ];
    ws.addRow(headerRow);
    let dateDispatch = null;
    const dispatchData = dataMR.mr_status.find(
      (e) => e.mr_status_value === "DISPATCH"
    );
    if (
      dispatchData.mr_status_date !== undefined &&
      dispatchData.mr_status_date !== null
    ) {
      let dateDispatchNew = new Date(dispatchData.mr_status_date);
      dateDispatch =
        dateDispatchNew.getFullYear().toString() +
        (dateDispatchNew.getMonth() + 1).toString().padStart(2, "0") +
        dateDispatchNew.getDate().toString().padStart(2, "0");
    }
    const dataSite = dataMR.site_info[0].site_id;
    let shipTrim = dataMR.no_shipment.split("-");
    shipTrim.splice(0, 2);
    const shipTracy = shipTrim.join("");
    for (let i = 0; i < dataItemMR.length; i++) {
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        if (
          dataMatIdx.serial_numbers !== undefined &&
          dataMatIdx.serial_numbers.length !== 0
        ) {
          let serial_number = dataMatIdx.serial_numbers.find(
            (e) => e.flag_name === "obd" || e.flag_name === "obd_web"
          );
          if (serial_number !== undefined) {
            for (let k = 0; k < serial_number.list_of_sn.length; k++) {
              ws.addRow([
                "K",
                null,
                2089,
                dataMR.mr_id,
                "XL",
                "ID",
                null,
                dateDispatch,
                dataMR.site_info[0].site_id,
                "ID",
                "DPM",
                1105,
                null,
                dataMatIdx.material_id,
                shipTracy,
                "XL Axiata",
                "XL",
                "XL Axiata",
                null,
                null,
                dataMatIdx.cpo_number,
                serial_number.list_of_sn[k],
                null,
                null,
                null,
                null,
              ]);
            }
          }
        } else {
          ws.addRow([
            "K",
            null,
            2089,
            dataMR.mr_id,
            "XL",
            "ID",
            null,
            dateDispatch,
            dataMR.site_info[0].site_id,
            "ID",
            "DPM",
            1105,
            null,
            dataMatIdx.material_id,
            shipTracy,
            "XL Axiata",
            "XL",
            "XL Axiata",
            null,
            null,
            dataMatIdx.cpo_number,
            null,
            null,
            null,
            null,
            null,
          ]);
        }
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "TRACY Material MR " + dataMR.mr_id + ".xlsx"
    );
  }

  async downloadMaterialSerialNumberReport() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    let headerRow = [
      "MR_ID",
      "SKU",
      "SERIAL_NUMBER",
      "DESCRIPTION",
      "SCAN_BY",
      "LASTEST_UPDATE_DATE_SCAN",
      "ACCOUNT",
      "WAREHOUSE",
    ];
    ws.addRow(headerRow);
    let dateDispatch = null;
    const dispatchData = dataMR.mr_status.find(
      (e) => e.mr_status_value === "DISPATCH"
    );
    if (
      dispatchData !== undefined &&
      dispatchData.mr_status_date !== undefined &&
      dispatchData.mr_status_date !== null
    ) {
      let dateDispatchNew = new Date(dispatchData.mr_status_date);
      dateDispatch =
        dateDispatchNew.getFullYear().toString() +
        (dateDispatchNew.getMonth() + 1).toString().padStart(2, "0") +
        dateDispatchNew.getDate().toString().padStart(2, "0");
    }
    const dataSite = dataMR.site_info[0].site_id;
    for (let i = 0; i < dataItemMR.length; i++) {
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        if (
          dataMatIdx.serial_numbers !== undefined &&
          dataMatIdx.serial_numbers.length !== 0
        ) {
          let serial_number = dataMatIdx.serial_numbers.find(
            (e) => e.flag_name === "obd" || e.flag_name === "obd_web"
          );
          if (serial_number !== undefined) {
            for (let k = 0; k < serial_number.list_of_sn.length; k++) {
              ws.addRow([
                dataMR.mr_id,
                dataMatIdx.material_id,
                serial_number.list_of_sn[k],
                dataMatIdx.material_name,
                serial_number.updated_by,
                serial_number.updated_on,
                "XL",
                dataMR.origin.value,
              ]);
            }
          }
        } else {
          ws.addRow([
            dataMR.mr_id,
            dataMatIdx.material_id,
            null,
            dataMatIdx.material_name,
            null,
            null,
            "XL",
            dataMR.origin.value,
          ]);
        }
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "SERIAL NUMBER Material MR " + dataMR.mr_id + " REPORT.xlsx"
    );
  }

  async saveUpdateMaterial() {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataMR = this.state.data_mr;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/updatePlantSpecWithVariant/" + dataMR._id,
      { identifier: "MR", data: dataXLS }
    );
    if (dataMR.id_plantspec_doc !== undefined) {
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
    this.toggleLoading();
  }

  async needReviseMR() {
    this.toggleLoading();
    const dataMR = this.state.data_mr;
    let patchDataMR = await this.patchDatatoAPINODE(
      "/matreq/needReviseMRFromWH/" + dataMR._id,
      { note_value: this.state.revision_note }
    );
    if (
      patchDataMR.data !== undefined &&
      patchDataMR.status >= 200 &&
      patchDataMR.status <= 300
    ) {
      this.setState({ action_status: "success", modal_revision: false });
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
            modal_revision: false,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  }

  async takeoutPS() {
    this.toggleLoading();
    const dataMR = this.state.data_mr;
    this.patchDatatoAPINODE("/matreq/takeOutPlantSpec/" + dataMR._id).then(
      (res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          this.toggleLoading();
        } else {
          this.setState({ action_status: "failed" });
          this.toggleLoading();
        }
      }
    );
  }

  async cancelMR() {
    this.toggleLoading();
    const dataMR = this.state.data_mr;
    this.patchDatatoAPINODE("/matreq/cancelMatreq/" + dataMR._id, {
      cancelNote: this.state.revision_note,
    }).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" });
        this.toggleLoading();
      }
    });
  }

  tableViewWBSCDID(cd_id) {
    const dataCDWBS = this.state.wbs_cd_id_data;
    let dataCDWBSbyCDID = dataCDWBS.find((e) => e.WP_ID === cd_id);
    if (dataCDWBSbyCDID !== undefined) {
      return (
        <Fragment>
          <td>{dataCDWBSbyCDID.C1003_WBS_HW}</td>
          <td>{dataCDWBSbyCDID.C1013_WBS_LCM}</td>
          <td>{dataCDWBSbyCDID.C1036_WBS_Kathrein}</td>
          <td>{dataCDWBSbyCDID.C1045_WBS_LCM_8107}</td>
          <td>{dataCDWBSbyCDID.C1033_WBS_LCM_Bulk}</td>
          <td>{dataCDWBSbyCDID.C1035_WBS_PowLCM_Site_Basis}</td>
          <td>{dataCDWBSbyCDID.C1008_WBS_HWAC}</td>
          <td>{dataCDWBSbyCDID.C1018_WBS_PNRO}</td>
          <td>{dataCDWBSbyCDID.C1024_WBS_PNDO}</td>
          <td>{dataCDWBSbyCDID.C01063_WBS_Power_2114}</td>
        </Fragment>
      );
    } else {
      return (
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
      );
    }
  }

  async exportMRFormat() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataMR = this.state.data_mr;

    ws.addRow([
      "id",
      "project_name",
      "mr_type",
      "mr_delivery_type",
      "origin_warehouse",
      "etd",
      "eta",
      "deliver_by",
      "mr_comment_project",
      "sent_mr_request",
      "created_based",
      "identifier",
    ]);

    ws.addRow([
      dataMR.mr_id,
      dataMR.project_name,
      1,
      1,
      dataMR.origin.value,
      dataMR.etd.slice(0, 10),
      dataMR.eta.slice(0, 10),
      dataMR.dsp_company_code,
      null,
      null,
      "cd_id",
      dataMR.cust_del[0].cd_id,
    ]);

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "MR Uploader Template " + dataMR.mr_id + ".xlsx"
    );
  }

  async updateMR() {
    this.toggleLoading();
    let success = true;
    this.setState({ action_status: null, action_message: null });
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
    let list_site = [];
    let dataXLS = [
      [
        "id",
        "project_name",
        "mr_type",
        "mr_delivery_type",
        "origin_warehouse",
        "etd",
        "eta",
        "deliver_by",
        "mr_comment_project",
        "sent_mr_request",
        "created_based",
        "identifier",
      ],
      [
        dataMR.mr_id,
        dataMR.project_name,
        1,
        1,
        dataMR.origin.value,
        dataMR.etd.slice(0, 10),
        dataMR.eta.slice(0, 10),
        this.state.update_mr_form.vendor_code,
        null,
        null,
        "cd_id",
        dataMR.cust_del[0].cd_id,
      ],
    ];
    const respondCheckingMR = await this.postDatatoAPINODE(
      "/matreq/matreqByActivity",
      { data: dataXLS }
    );
    if (
      respondCheckingMR.data !== undefined &&
      respondCheckingMR.status >= 200 &&
      respondCheckingMR.status <= 300
    ) {
      const respondSaveMR = await this.postDatatoAPINODE(
        "/matreq/saveMatreqByActivity",
        { data: respondCheckingMR.data.data }
      );
      if (
        respondSaveMR.data !== undefined &&
        respondSaveMR.status >= 200 &&
        respondSaveMR.status <= 300
      ) {
        this.setState({ action_status: "success", action_message: null });
      } else {
        if (
          respondSaveMR.response !== undefined &&
          respondSaveMR.response.data !== undefined &&
          respondSaveMR.response.data.error !== undefined
        ) {
          if (respondSaveMR.response.data.error.message !== undefined) {
            this.setState({
              action_status: "failed",
              action_message: respondSaveMR.response.data.error.message,
            });
          } else {
            this.setState({
              action_status: "failed",
              action_message: respondSaveMR.response.data.error,
            });
          }
        } else {
          this.setState({ action_status: "failed" });
        }
      }
    } else {
      if (
        respondCheckingMR.response !== undefined &&
        respondCheckingMR.response.data !== undefined &&
        respondCheckingMR.response.data.error !== undefined
      ) {
        if (respondCheckingMR.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: respondCheckingMR.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: respondCheckingMR.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  }

  getSIDFile = async (e) => {
    e.preventDefault();
    e.persist();
    const _id = e.currentTarget.value;
    const dataSID = this.state.sid_file.find((sf) => sf._id === _id);
    if (dataSID !== undefined) {
      const resFile = await getDatafromAPINODEFile(
        "/sidFile/getDocument/" + _id,
        this.props.dataLogin.token,
        dataSID.file_document.mime_type
      );
      if (resFile !== undefined) {
        saveAs(
          new Blob([resFile.data], { type: dataSID.file_document.mime_type }),
          dataSID.file_document.file_name
        );
      }
    }
  };

  getABDFile = async (e) => {
    e.preventDefault();
    e.persist();
    const _id = e.currentTarget.value;
    const dataSID = this.state.abd_file.find((sf) => sf._id === _id);
    if (dataSID !== undefined) {
      const resFile = await getDatafromAPINODEFile(
        "/sidFile/getDocument/" + _id,
        this.props.dataLogin.token,
        dataSID.file_document.mime_type
      );
      if (resFile !== undefined) {
        saveAs(
          new Blob([resFile.data], { type: dataSID.file_document.mime_type }),
          dataSID.file_document.file_name
        );
      }
    }
  };

  getWBSMaterial(material_origin) {
    let dataCDIDIdx = this.state.wbs_cd_id_data;
    if (dataCDIDIdx.length !== 0) {
      let dataCDID_5 = dataCDIDIdx.find((dci) => /_5$/.test(dci.WP_ID));
      if (dataCDID_5 === undefined) {
        dataCDIDIdx = dataCDIDIdx[0];
      } else {
        dataCDIDIdx = dataCDID_5;
      }
    } else {
      dataCDIDIdx = {};
    }
    let dataWBS = null;
    if (material_origin !== undefined && material_origin !== null) {
      if (material_origin.toLowerCase() === "eab") {
        dataWBS = dataCDIDIdx.C1003_WBS_HW;
      }
      if (material_origin.toLowerCase() === "lcm") {
        dataWBS = dataCDIDIdx.C1013_WBS_LCM;
      }
      if (material_origin.toLowerCase() === "eab antenna") {
        dataWBS = dataCDIDIdx.C1036_WBS_Kathrein;
      }
      if (material_origin.toLowerCase() === "lcm antenna") {
        dataWBS = dataCDIDIdx.C1045_WBS_LCM_8107;
        if (dataWBS === undefined || dataWBS === null || dataWBS.length === 0) {
          dataWBS = dataCDIDIdx.C1013_WBS_LCM;
        }
      }
      if (material_origin.toLowerCase() === "eab power") {
        dataWBS = dataCDIDIdx.C01063_WBS_Power_2114;
      }
    }
    return dataWBS;
  }

  handleMotType(e) {
    this.setState({ mot_type: e.target.value });
  }

  downloadMaterialAssingSerialNumber = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataMR = this.state.data_mr;
    const dataItemMR = this.state.list_mr_item;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    let headerRow = [
      "site_id",
      "bundle_id",
      "bundle_name",
      "program",
      "site_title",
      "material_id",
      "material_name",
      "serial_number",
    ];
    ws.addRow(headerRow);
    let list_material_id = [];
    for (let i = 0; i < dataItemMR.length; i++) {
      for (let j = 0; j < dataItemMR[i].materials.length; j++) {
        let dataMatIdx = dataItemMR[i].materials[j];
        ws.addRow([
          dataItemMR[i].site_id,
          dataItemMR[i].pp_id,
          dataItemMR[i].product_name,
          dataItemMR[i].program,
          dataItemMR[i].site_title,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Material MR Serial Number" + dataMR.mr_id + " uploader.xlsx"
    );
  };

  changeEditMR = () => {
    this.setState((prevState) => ({
      edit_mr_material: !prevState.edit_mr_material,
    }));
  };

  saveUpdateMaterialSerialNumber = async () => {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataMR = this.state.data_mr;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/uploadSerialNumber/" + dataMR._id,
      { data: dataXLS }
    );
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
    this.toggleLoading();
  };

  render() {
    const background = {
      backgroundColor: "#e3e3e3",
    };

    function MapsTrekking(props) {
      return <GMap />;
    }

    // const MapLoader = withScriptjs(MapsTrekking);

    let qty_wh = undefined,
      qty_inbound = undefined;
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
                {this.state.data_mr !== null &&
                  this.state.data_mr.current_mr_status !== "MR CANCELED" &&
                  this.state.userRole.findIndex(
                    (e) => e === "BAM-Project Planner"
                  ) === -1 &&
                  this.state.userRole.findIndex(
                    (e) => e === "BAM-Warehouse"
                  ) === -1 &&
                  this.state.userRole.findIndex(
                    (e) => e === "BAM-ASP Management"
                  ) === -1 &&
                  this.state.userRole.findIndex((e) => e === "BAM-ASP") ===
                    -1 &&
                  this.state.userRole.findIndex(
                    (e) => e === "BAM-ASPWarehouse"
                  ) === -1 && (
                    <Fragment>
                      {/* }<Button style={{float : 'right', marginRight: "8px"}} size="sm" color="warning" onClick={this.changeEditable}>Edit MR Detail</Button> */}
                    </Fragment>
                  )}
                {this.state.sid_file.length !== 0 ||
                this.state.abd_file.length !== 0 ? (
                  <Dropdown
                    size="sm"
                    isOpen={this.state.dropdownOpen[1]}
                    toggle={() => {
                      this.toggleDropdown(1);
                    }}
                    style={{ float: "right", marginRight: "10px" }}
                  >
                    <DropdownToggle caret color="secondary">
                      <i className="fa fa-download" aria-hidden="true">
                        {" "}
                        &nbsp;{" "}
                      </i>
                      Download SID File
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>SID File</DropdownItem>
                      {this.state.sid_file.map((sf) => (
                        <DropdownItem value={sf._id} onClick={this.getSIDFile}>
                          <span>{sf.file_document.file_name}</span> (
                          {sf.cust_del[0].cd_id})
                        </DropdownItem>
                      ))}
                      <DropdownItem header>ABD File</DropdownItem>
                      {this.state.userRole.findIndex(
                        (e) => e === "BAM-ASP Management"
                      ) === -1 &&
                        this.state.userRole.findIndex(
                          (e) => e === "BAM-ASP"
                        ) === -1 &&
                        this.state.userRole.findIndex(
                          (e) => e === "BAM-ASPWarehouse"
                        ) === -1 &&
                        this.state.abd_file.map((sf) => (
                          <DropdownItem
                            value={sf._id}
                            onClick={this.getABDFile}
                          >
                            <span>{sf.file_document.file_name}</span> (
                            {sf.cust_del[0].cd_id})
                          </DropdownItem>
                        ))}
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Button
                    size="sm"
                    style={{ float: "right", marginRight: "10px" }}
                  >
                    no data SID or ABD
                  </Button>
                )}
                <Button
                  style={{ marginRight: "8px", float: "right" }}
                  outline
                  color="info"
                  size="sm"
                  onClick={this.exportMRFormat}
                  size="sm"
                >
                  <i
                    className="fa fa-download"
                    style={{ marginRight: "8px" }}
                  ></i>
                  MR Format
                </Button>
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
                        {this.state.data_mr.mr_mitt_no != undefined &&
                          this.state.data_mr.mr_mitt_no !== null && (
                            <tr>
                              <td
                                colSpan="4"
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  color: "rgba(59,134,134,1)",
                                }}
                              >
                                MR MITT Migration ID :{" "}
                                {this.state.data_mr.mr_mitt_no}
                              </td>
                            </tr>
                          )}
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
                                  <li>
                                    {this.state.data_mr.cust_del
                                      .map((cd) => cd.cd_id)
                                      .join(", ")}
                                  </li>
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
                            {this.state.edit_detail === true ? (
                              <Input
                                type="select"
                                name="vendor_code"
                                value={this.state.update_mr_form.vendor_code}
                                onChange={this.handleChangeFormMRUpdate}
                              >
                                <option value="" disabled selected hidden>
                                  Select Delivery Company
                                </option>
                                <option value="DSP">DSP</option>
                                {this.state.dsp_list.map((e) => (
                                  <option value={e.Vendor_Code}>
                                    {e.Name}
                                  </option>
                                ))}
                              </Input>
                            ) : (
                              <div>{this.state.data_mr.dsp_company}</div>
                            )}
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
                            <div>{this.state.data_mr.no_shipment}</div>
                          </div>
                          {(this.state.data_mr.mr_delivery_type_code === "A1" ||
                            this.state.data_mr.mr_delivery_type_code === "A2" ||
                            this.state.data_mr.mr_delivery_type_code === "B1" ||
                            this.state.data_mr.mr_delivery_type_code ===
                              "C1") && (
                            <div>
                              <div className="mr-detail__body--header-detail">
                                <span>MR Remarks</span>
                              </div>
                              <div>{this.state.data_mr.mr_remark}</div>
                            </div>
                          )}
                          {this.state.data_mr.mr_type === "Additional" && (
                            <Fragment>
                              <div>
                                <div className="mr-detail__body--header-detail">
                                  <span>MR Reason</span>
                                </div>
                                <div>{this.state.data_mr.mr_reason}</div>
                              </div>
                              <div>
                                <div className="mr-detail__body--header-detail">
                                  <span>MR Remarks</span>
                                </div>
                                <div>{this.state.data_mr.mr_remark}</div>
                              </div>
                            </Fragment>
                          )}
                          {this.state.data_mr.mr_note !== undefined &&
                            this.state.data_mr.mr_note.find(
                              (e) => e.title === "RE-ROUTE"
                            ) !== undefined && (
                              <div>
                                <div className="mr-detail__body--header-detail">
                                  <span>Re-Route</span>
                                </div>
                                <div>
                                  {
                                    this.state.data_mr.mr_note.find(
                                      (e) => e.title === "RE-ROUTE"
                                    ).value
                                  }
                                </div>
                              </div>
                            )}
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
                              <div className="mr-detail__flex-body--25">
                                <div className="mr-detail__body--header-detail">
                                  <span>Site Coordinat</span>
                                </div>
                                <div>
                                  <span style={{ fontWeight: "700" }}>
                                    Lat :{" "}
                                  </span>
                                  {this.state.mr_site_NE.site_latitude}
                                  <br />
                                  <span style={{ fontWeight: "700" }}>
                                    Long :{" "}
                                  </span>
                                  {this.state.mr_site_NE.site_longitude}
                                </div>
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
                          <Fragment>
                            <div className="mr-detail__flex-body--25">
                              <div className="mr-detail__body--header-detail">
                                <span>MRA</span>
                              </div>
                              <div>
                                {this.state.data_mr["matreq-ra"] !== undefined
                                  ? this.state.data_mr["matreq-ra"]
                                      .map((mra) => mra.mra_id)
                                      .join(", ")
                                  : null}
                              </div>
                            </div>
                          </Fragment>
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
                                    <Table
                                      responsive
                                      striped
                                      bordered
                                      size="sm"
                                    >
                                      <thead>
                                        <tr style={{ fontSize: "10.5px" }}>
                                          <th>WBS HW</th>
                                          <th>WBS LCM</th>
                                          <th>WBS Katherin Antenna</th>
                                          <th>WBS LCM Antenna</th>
                                          <th>WBS LCM Bulk</th>
                                          <th>WBS LCM Power</th>
                                          <th>WBS HWAC (License)</th>
                                          <th>WBS PNRO</th>
                                          <th>WBS PNDO</th>
                                          <th>WBS Power System</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr style={{ fontSize: "10.5px" }}>
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
                                  <span>
                                    WBS of CD ID {this.state.data_mr.cd_id}
                                  </span>
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
                                              (e) =>
                                                typeof e === "string"
                                                  ? e + " , "
                                                  : e.box_id + " , "
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
                        <table style={{ marginBottom: "0px", float: "right" }}>
                          <tbody>
                            {this.state.data_mr !== null && (
                              <Fragment>
                                {this.state.userRole.findIndex(
                                  (e) => e === "BAM-Mover"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP Management"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASPWarehouse"
                                ) === -1 ? (
                                  <Dropdown
                                    size="sm"
                                    isOpen={this.state.dropdownOpen[0]}
                                    toggle={() => {
                                      this.toggleDropdown(0);
                                    }}
                                    style={{
                                      float: "left",
                                      marginRight: "10px",
                                    }}
                                  >
                                    <DropdownToggle caret color="secondary">
                                      <i
                                        className="fa fa-download"
                                        aria-hidden="true"
                                      >
                                        {" "}
                                        &nbsp;{" "}
                                      </i>
                                      Download File
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem header>
                                        MR File
                                      </DropdownItem>
                                      {this.state.userRole.findIndex(
                                        (e) => e === "BAM-ASP Management"
                                      ) === -1 &&
                                        this.state.userRole.findIndex(
                                          (e) => e === "BAM-ASP"
                                        ) === -1 &&
                                        this.state.userRole.findIndex(
                                          (e) => e === "BAM-ASPWarehouse"
                                        ) === -1 &&
                                        this.state.data_mr.mr_status !==
                                          undefined &&
                                        this.state.data_mr.mr_status.find(
                                          (e) =>
                                            e.mr_status_value === "DISPATCH"
                                        ) !== undefined && (
                                          <DropdownItem
                                            onClick={
                                              this.downloadMaterialMRTRACY
                                            }
                                          >
                                            {" "}
                                            <i
                                              className="fa fa-file-text-o"
                                              aria-hidden="true"
                                            ></i>
                                            TRACY Format
                                          </DropdownItem>
                                        )}
                                      <DropdownItem
                                        onClick={
                                          this
                                            .downloadMaterialSerialNumberReport
                                        }
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-file-text-o"
                                          aria-hidden="true"
                                        ></i>
                                        SN Report
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={this.downloadMaterialMRReport}
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-file-text-o"
                                          aria-hidden="true"
                                        ></i>
                                        Download MR PS
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={this.downloadMaterialMRUpload}
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-file-text-o"
                                          aria-hidden="true"
                                        ></i>
                                        PlantSpec Format
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={this.downloadMaterialMRUpload2}
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-file-text-o"
                                          aria-hidden="true"
                                        ></i>
                                        PlantSpec Format NOK
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={
                                          this
                                            .downloadMaterialAssingSerialNumber
                                        }
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-file-text-o"
                                          aria-hidden="true"
                                        ></i>
                                        Serial Number Format Update
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                ) : (
                                  <Button
                                    onClick={this.downloadMaterialMRReport}
                                  >
                                    Download MR PS
                                  </Button>
                                )}
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
                                    {this.state.userRole.findIndex(
                                      (e) => e === "BAM-Mover"
                                    ) === -1 &&
                                      this.state.userRole.findIndex(
                                        (e) => e === "BAM-ASP Management"
                                      ) === -1 &&
                                      this.state.userRole.findIndex(
                                        (e) => e === "BAM-ASP"
                                      ) === -1 &&
                                      this.state.userRole.findIndex(
                                        (e) => e === "BAM-ASPWarehouse"
                                      ) === -1 &&
                                      status_can_edit_material.includes(
                                        this.state.data_mr.current_mr_status
                                      ) && (
                                        <tr>
                                          <td style={{ fontSize: "12px" }}></td>
                                        </tr>
                                      )}
                                  </Fragment>
                                )}
                                {this.state.data_mr !== null &&
                                  this.state.data_mr.mr_delivery_type_code !==
                                    "A1" &&
                                  this.state.data_mr.mr_delivery_type_code !==
                                    "A2" &&
                                  this.state.data_mr.mr_delivery_type_code !==
                                    "B1" &&
                                  this.state.data_mr.mr_delivery_type_code !==
                                    "C1" && (
                                    <td>
                                      {this.state.mr_site_FE !== null &&
                                      this.state.data_mr.mr_type !==
                                        "Relocation" &&
                                      this.state.data_mr.mr_type !==
                                        "Return" ? (
                                        <Fragment>
                                          <Button
                                            onClick={this.changeEditMR}
                                            size="sm"
                                            color="info"
                                          >
                                            Edit
                                          </Button>
                                        </Fragment>
                                      ) : (
                                        <Fragment>
                                          <Button
                                            onClick={this.changeEditMR}
                                            size="sm"
                                            color="info"
                                          >
                                            Edit
                                          </Button>
                                        </Fragment>
                                      )}
                                    </td>
                                  )}
                              </Fragment>
                            )}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                    {this.state.edit_mr_material === true && (
                      <Row style={{ marginTop: "20px" }}>
                        <Col>
                          <Card>
                            <CardBody>
                              {this.state.userRole.findIndex(
                                (e) => e === "BAM-Mover"
                              ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP Management"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASPWarehouse"
                                ) === -1 &&
                                status_can_edit_material.includes(
                                  this.state.data_mr.current_mr_status
                                ) && (
                                  <Row>
                                    <Col md="6">
                                      <div>
                                        <span>
                                          Change to Material Variant :
                                        </span>
                                      </div>
                                      <div>
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
                                          Update Mat
                                        </Button>
                                      </div>
                                    </Col>
                                    {/*}<Col  md="6">
                              <div><span>Update CPO Number :</span></div>
                              <div>
                              <input type="file" onChange={this.fileHandlerMaterialCPO.bind( this )} style={{ visiblity: "hidden" }} />
                              <Button size="sm" color="success" style={{ float: "right" }} onClick={this.saveUpdateMaterialCPO}
                                disabled={ this.state.rowsXLSCPO.length === 0 } >
                                Update CPO
                              </Button>
                              </div>
                            </Col> */}
                                  </Row>
                                )}
                              {this.state.userRole.findIndex(
                                (e) => e === "BAM-Mover"
                              ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP Management"
                                ) === -1 &&
                                this.state.userRole.findIndex(
                                  (e) => e === "BAM-ASP"
                                ) === -1 && (
                                  <Row style={{ marginTop: "15px" }}>
                                    <Col md="6">
                                      <div>
                                        <span>Adding Serial Number :</span>
                                      </div>
                                      <div>
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
                                          onClick={
                                            this.saveUpdateMaterialSerialNumber
                                          }
                                          disabled={
                                            this.state.rowsXLS.length === 0
                                          }
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                )}
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    )}
                    <hr className="upload-line-ordering"></hr>
                    <div>
                      PlantSpec Group No :{" "}
                      {this.state.data_mr !== null ? (
                        <Link
                          to={
                            "/ps-detail/" + this.state.data_mr.id_plantspec_doc
                          }
                        >
                          {this.state.data_mr.no_plantspec}
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                    {this.state.data_mr !== null &&
                    (this.state.data_mr.mr_delivery_type_code === "A1" ||
                      (this.state.data_mr.mr_delivery_type_code !== "A2" &&
                        this.state.data_mr.mr_delivery_type_code !== "B1" &&
                        this.state.data_mr.mr_delivery_type_code !== "C1")) ? (
                      <div className="divtable2">
                        {this.state.data_mr !== null &&
                        this.state.data_mr.sow_type !== "TRM" ? (
                          <Table hover bordered striped responsive size="sm">
                            <thead
                              style={{
                                backgroundColor: "#0B486B",
                                color: "white",
                              }}
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
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  Program
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
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
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  CPO Number
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{ verticalAlign: "middle" }}
                                >
                                  PS No. / Material Source (WBS Number)
                                </th>
                              </tr>
                              {this.state.data_mr !== null &&
                              this.state.data_mr.mr_type !== "Relocation" &&
                              this.state.data_mr.mr_type !== "Return" ? (
                                <tr>
                                  <th
                                    className="fixedhead"
                                    colSpan={
                                      this.state.mr_site_FE !== null ? 1 : 2
                                    }
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
                            status_can_edit_material.includes(
                              this.state.data_mr.current_mr_status
                            ) ? (
                              <tbody>
                                {this.state.mr_site_NE !== null &&
                                  this.state.list_mr_item
                                    .filter(
                                      (e) =>
                                        e.product_type.toLowerCase() !==
                                          "svc" &&
                                        e.product_type.toLowerCase() !==
                                          "hwac" &&
                                        e.product_type.toLowerCase() !== "sw"
                                    )
                                    .map((pp) => (
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
                                              this.state.mr_site_FE !== null
                                                ? 1
                                                : 2
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
                                                this.state.mr_site_FE !== null
                                                  ? 1
                                                  : 2
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
                                                      e.sku ===
                                                      material.material_id
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
                                                      e.sku ===
                                                      material.material_id
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
                                              {material.qty < qty_wh
                                                ? "OK"
                                                : "NOK"}
                                            </td>
                                            <td>{material.cpo_number}</td>
                                            <td>
                                              {material.source_material}{" "}
                                              {this.getWBSMaterial(
                                                material.material_origin
                                              ) !== null
                                                ? "(WBS : " +
                                                  this.getWBSMaterial(
                                                    material.material_origin
                                                  ) +
                                                  ")"
                                                : null}
                                            </td>
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
                            ) : (
                              <tbody>
                                {this.state.mr_site_NE !== null &&
                                  this.state.list_mr_item
                                    .filter(
                                      (e) =>
                                        e.product_type.toLowerCase() !==
                                          "svc" &&
                                        e.product_type.toLowerCase() !==
                                          "hwac" &&
                                        e.product_type.toLowerCase() !== "sw"
                                    )
                                    .map((pp) => (
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
                                              this.state.mr_site_FE !== null
                                                ? 1
                                                : 2
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
                                                this.state.mr_site_FE !== null
                                                  ? 1
                                                  : 2
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
                                            <td>{material.cpo_number}</td>
                                            <td>
                                              {material.source_material}{" "}
                                              {this.getWBSMaterial(
                                                material.material_origin
                                              ) !== null
                                                ? "(WBS : " +
                                                  this.getWBSMaterial(
                                                    material.material_origin
                                                  ) +
                                                  ")"
                                                : null}
                                            </td>
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
                        ) : (
                          <Table hover bordered striped responsive size="sm">
                            <thead
                              style={{
                                backgroundColor: "#0B486B",
                                color: "white",
                              }}
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
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  Program
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
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
                                  style={{
                                    width: "75px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  CPO Number
                                </th>
                                <th
                                  rowSpan="2"
                                  className="fixedhead"
                                  style={{ verticalAlign: "middle" }}
                                >
                                  PS No. / Material Source
                                </th>
                              </tr>
                              {this.state.data_mr !== null &&
                              this.state.data_mr.mr_type !== "Relocation" &&
                              this.state.data_mr.mr_type !== "Return" ? (
                                <tr>
                                  <th
                                    className="fixedhead"
                                    style={{
                                      width: "100px",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    Site NE
                                  </th>
                                  <th
                                    className="fixedhead"
                                    style={{
                                      width: "100px",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    SITE FE
                                  </th>
                                </tr>
                              ) : (
                                <Fragment></Fragment>
                              )}
                            </thead>
                            {this.state.data_mr !== null &&
                            status_can_edit_material.includes(
                              this.state.data_mr.current_mr_status
                            ) ? (
                              <tbody>
                                {this.state.mr_site_NE !== null &&
                                  this.state.list_mr_item
                                    .filter(
                                      (e) =>
                                        e.product_type.toLowerCase() !== "svc"
                                    )
                                    .map((pp) => (
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
                                          <td align="center">{pp.qty}</td>
                                          <td align="center">{pp.qty_fe}</td>
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
                                            <td align="center">
                                              {material.qty}
                                            </td>
                                            <td align="center">
                                              {material.qty_fe}
                                            </td>
                                            <td align="center">
                                              {
                                                (qty_wh =
                                                  this.state.material_wh.find(
                                                    (e) =>
                                                      e.sku ===
                                                      material.material_id
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
                                                      e.sku ===
                                                      material.material_id
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
                                              {material.qty < qty_wh
                                                ? "OK"
                                                : "NOK"}
                                            </td>
                                            <td>{material.cpo_number}</td>
                                            <td>
                                              {material.source_material}{" "}
                                              {this.getWBSMaterial(
                                                material.material_origin
                                              ) !== null
                                                ? "(WBS : " +
                                                  this.getWBSMaterial(
                                                    material.material_origin
                                                  ) +
                                                  ")"
                                                : null}
                                            </td>
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
                                        <td align="center">{pp.qty}</td>
                                        <td align="center">{pp.qty_fe}</td>
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
                                              this.state.mr_site_FE !== null
                                                ? 1
                                                : 2
                                            }
                                          >
                                            {material.qty}
                                          </td>
                                          <td
                                            align="center"
                                            colSpan={
                                              this.state.mr_site_FE !== null
                                                ? 1
                                                : 2
                                            }
                                          >
                                            {material.qty_fe}
                                          </td>
                                          <td>{material.cpo_number}</td>
                                          <td>
                                            {material.source_material}{" "}
                                            {this.getWBSMaterial(
                                              material.material_origin
                                            ) !== null
                                              ? "(WBS : " +
                                                this.getWBSMaterial(
                                                  material.material_origin
                                                ) +
                                                ")"
                                              : null}
                                          </td>
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
                        )}
                      </div>
                    ) : (
                      <div className="divtable2">
                        <Table hover bordered striped responsive size="sm">
                          <thead
                            style={{
                              backgroundColor: "#0B486B",
                              color: "white",
                            }}
                            className="table-mr__header--fixed"
                          >
                            <tr>
                              <th>PP / Material Code</th>
                              <th>PP / Material Name</th>
                              <th>Unit</th>
                              <th>Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data_mr !== null &&
                              this.state.data_mr.packages.map((mp) => (
                                <Fragment>
                                  <tr
                                    style={{
                                      backgroundColor: "rgba(78,205,196,1)",
                                    }}
                                  >
                                    <td>{mp.pp_id}</td>
                                    <td>{mp.product_name}</td>
                                    <td>{mp.uom}</td>
                                    <td>{mp.qty}</td>
                                  </tr>
                                  {mp.materials.map((mpm) => (
                                    <tr
                                      style={{
                                        backgroundColor:
                                          "rgba(248,246,223, 0.5)",
                                      }}
                                    >
                                      <td style={{ textAlign: "right" }}>
                                        {mpm.material_id}
                                      </td>
                                      <td style={{ textAlign: "left" }}>
                                        {mpm.material_name}
                                      </td>
                                      <td>{mpm.uom}</td>
                                      <td>{mpm.qty}</td>
                                    </tr>
                                  ))}
                                </Fragment>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    {this.state.data_mr !== null &&
                    (this.state.data_mr.mr_delivery_type_code === "A1" ||
                      (this.state.data_mr.mr_delivery_type_code !== "A2" &&
                        this.state.data_mr.mr_delivery_type_code !== "B1" &&
                        this.state.data_mr.mr_delivery_type_code !== "C1")) ? (
                      <Fragment></Fragment>
                    ) : (
                      <Fragment>
                        <div>Material LOM</div>
                        <div className="divtable2">
                          <Table hover bordered striped responsive size="sm">
                            <thead
                              style={{
                                backgroundColor: "#0B486B",
                                color: "white",
                              }}
                              className="table-mr__header--fixed"
                            >
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
                                style={{
                                  width: "75px",
                                  verticalAlign: "middle",
                                }}
                              >
                                Program
                              </th>
                              <th
                                rowSpan="2"
                                className="fixedhead"
                                style={{
                                  width: "75px",
                                  verticalAlign: "middle",
                                }}
                              >
                                Unit
                              </th>
                              <th
                                rowSpan="2"
                                className="fixedhead"
                                style={{
                                  width: "100px",
                                  verticalAlign: "middle",
                                }}
                              >
                                Total Qty per PP
                              </th>
                              <th
                                rowSpan="2"
                                className="fixedhead"
                                style={{
                                  width: "100px",
                                  verticalAlign: "middle",
                                }}
                              >
                                State
                              </th>
                            </thead>
                            <tbody>
                              {this.state.data_mr !== null &&
                                this.state.data_mr.lom_packages !==
                                  undefined && (
                                  <Fragment>
                                    {this.state.data_mr.lom_packages.map(
                                      (pp) => (
                                        <Fragment>
                                          <tr
                                            style={{
                                              backgroundColor: "#E5FCC2",
                                            }}
                                            className="fixbody"
                                          >
                                            <td style={{ textAlign: "left" }}>
                                              {pp.pp_id}
                                            </td>
                                            <td>{pp.product_name}</td>
                                            <td>{pp.program}</td>
                                            <td>{pp.uom}</td>
                                            <td>{pp.qty}</td>
                                            <td>{pp.process}</td>
                                          </tr>
                                          {pp.lom_materials.map((mm) => (
                                            <Fragment>
                                              <tr
                                                style={{
                                                  backgroundColor:
                                                    "rgba(248,246,223, 0.5)",
                                                }}
                                              >
                                                <td
                                                  style={{ textAlign: "right" }}
                                                >
                                                  {mm.material_id}
                                                </td>
                                                <td>{mm.material_name}</td>
                                                <td></td>
                                                <td>{mm.uom}</td>
                                                <td>{mm.qty}</td>
                                                <td></td>
                                              </tr>
                                            </Fragment>
                                          ))}
                                        </Fragment>
                                      )
                                    )}
                                  </Fragment>
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </Fragment>
                    )}
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
                                        ms.mr_status_note,
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
                    {/*<MapsTrekking latitude={-6.173990} longitude={106.826851}/>
                     <GoogleMap site_lat={-6.3046027} site_lng={106.7951936} /> AIzaSyAoCmcgwc7MN40js68RpcZdSzh9yLrmLF4*/}
                    {/*<MapLoader
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB5mmXco3GYZhRDNY4CJcBlaENjteSC8DM"
                      loadingElement={<div style={{ height: "100%" }} />}
                    /> */}
                    {this.state.data_mr !== null ? (
                      this.state.location_mr.updated_location !== undefined ? (
                        <Fragment>
                          {console.log("dataWH", this.state.data_wh)}
                          <GMap
                            wh_lat={this.state.data_wh.latitude}
                            wh_lng={this.state.data_wh.longitude}
                            dsp_lat={
                              this.state.location_mr.updated_location.latitude
                            }
                            dsp_lng={
                              this.state.location_mr.updated_location.longitude
                            }
                            site_lat={
                              this.state.data_mr.site_info[0].site_latitude
                            }
                            site_lng={
                              this.state.data_mr.site_info[0].site_longitude
                            }
                          />
                        </Fragment>
                      ) : (
                        <GMap
                          wh_lat={
                            this.state.data_wh.latitude === null
                              ? undefined
                              : this.state.data_wh.latitude
                          }
                          wh_lng={
                            this.state.data_wh.longitude === null
                              ? undefined
                              : this.state.data_wh.longitude
                          }
                          dsp_lat={
                            this.state.data_wh.latitude === null
                              ? undefined
                              : this.state.data_wh.latitude
                          }
                          dsp_lng={
                            this.state.data_wh.longitude === null
                              ? undefined
                              : this.state.data_wh.longitude
                          }
                          site_lat={
                            this.state.data_mr.site_info[0].site_latitude
                          }
                          site_lng={
                            this.state.data_mr.site_info[0].site_longitude
                          }
                        />
                      )
                    ) : (
                      <div></div>
                    )}
                  </Fragment>
                )}
              </CardBody>
              {this.state.data_mr !== null && (
                <CardFooter>
                  {(this.state.userRole.findIndex((e) => e === "BAM-LDM") !==
                    -1 ||
                    this.state.userRole.findIndex((e) => e === "Admin") !==
                      -1) &&
                  this.state.data_mr.mr_status.find(
                    (ms) =>
                      ms.mr_status_name === "LOADING_PROCESS" &&
                      ms.mr_status_name === "FINISH"
                  ) === undefined ? (
                    <Button
                      color="warning"
                      style={{ float: "left" }}
                      size="sm"
                      onClick={this.toggleModalRevision}
                    >
                      Need Revise
                    </Button>
                  ) : (
                    <Fragment></Fragment>
                  )}
                  {(this.state.userRole.findIndex((e) => e === "BAM-LDM") !==
                    -1 ||
                    this.state.userRole.findIndex((e) => e === "Admin") !==
                      -1) &&
                  this.state.data_mr !== null &&
                  this.state.data_mr.current_mr_status === "MR REQUESTED" ? (
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
                  {this.state.data_mr !== null &&
                    this.state.data_mr.current_mr_status !== "MR CANCELED" &&
                    this.state.userRole.findIndex(
                      (e) => e === "BAM-Project Planner"
                    ) === -1 &&
                    this.state.userRole.findIndex(
                      (e) => e === "BAM-Warehouse"
                    ) === -1 &&
                    this.state.userRole.findIndex(
                      (e) => e === "BAM-ASP Management"
                    ) === -1 &&
                    this.state.userRole.findIndex((e) => e === "BAM-ASP") ===
                      -1 &&
                    this.state.userRole.findIndex(
                      (e) => e === "BAM-ASPWarehouse"
                    ) === -1 && (
                      <React.Fragment>
                        {this.state.data_mr !== null && (
                          <div>
                            {this.state.data_mr.current_mr_status ===
                              "PLANTSPEC ASSIGNED" ||
                            this.state.data_mr.current_mr_status ===
                              "PLANTSPEC UPDATED" ||
                            this.state.data_mr.current_mr_status ===
                              "MR UPDATED" ||
                            this.state.data_mr.current_mr_status ===
                              "MR REJECTED" ? (
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
                            {this.state.data_mr !== null &&
                            this.state.data_mr.no_plantspec !== null &&
                            this.state.data_mr.mr_status.findIndex(
                              (st) =>
                                st.mr_status_name === "LOADING_PROCESS" &&
                                st.mr_status_value === "FINISH"
                            ) === -1 ? (
                              <Fragment>
                                {(this.state.data_mr.current_mr_status ===
                                  "MR UPDATED" ||
                                  this.state.data_mr.current_mr_status ===
                                    "MR REQUESTED" ||
                                  this.state.data_mr.current_mr_status ===
                                    "PLANTSPEC ASSIGNED" ||
                                  this.state.data_mr.current_mr_status ===
                                    "PLANTSPEC NOT ASSIGNED" ||
                                  this.state.userRole.findIndex(
                                    (e) => e === "BAM-LDM"
                                  ) !== -1 ||
                                  this.state.userRole.findIndex(
                                    (e) => e === "Admin"
                                  ) !== -1) && (
                                  <Fragment>
                                    <Button
                                      color="danger"
                                      style={{
                                        float: "left",
                                        margin: "0 10px 0 20px",
                                      }}
                                      size="sm"
                                      onClick={this.takeoutPS}
                                    >
                                      Takeout PS
                                    </Button>
                                  </Fragment>
                                )}
                              </Fragment>
                            ) : (
                              <Fragment></Fragment>
                            )}
                            {this.state.userRole.findIndex(
                              (e) => e === "BAM-Engineering"
                            ) === -1 &&
                              this.state.data_mr.mr_status.findIndex(
                                (st) =>
                                  st.mr_status_name === "LOADING_PROCESS" &&
                                  st.mr_status_value === "FINISH"
                              ) === -1 && (
                                <Button
                                  color="danger"
                                  style={{
                                    float: "left",
                                    margin: "0 10px 0 10px",
                                  }}
                                  size="sm"
                                  onClick={this.toggleModalCancelMR}
                                >
                                  Cancel MR
                                </Button>
                              )}
                            {this.state.edit_detail === true && (
                              <Button
                                color="warning"
                                style={{
                                  float: "left",
                                  margin: "0 10px 0 10px",
                                }}
                                size="sm"
                                onClick={this.updateMR}
                              >
                                Save Update MR
                              </Button>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    )}
                </CardFooter>
              )}
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

        <Modal
          isOpen={this.state.modal_revision}
          toggle={this.toggleModalRevision}
          className={"modal-sm"}
        >
          <ModalHeader>Note for Revision</ModalHeader>
          <ModalBody>
            <Input
              type="textarea"
              rows="9"
              placeholder="Note..."
              onChange={this.handleRevisionNote}
              value={this.state.revision_note}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="warning"
              style={{ float: "right", marginRight: "8px" }}
              onClick={this.needReviseMR}
            >
              <i className="fa fa-edit" style={{ marginRight: "8px" }}></i> Need
              Revision
            </Button>
            <Button color="secondary" onClick={this.toggleModalRevision}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modal_cancel_mr}
          toggle={this.toggleModalCancelMR}
          className={"modal-sm"}
        >
          <ModalHeader>Note for Cancel</ModalHeader>
          <ModalBody>
            <Input
              type="textarea"
              rows="9"
              placeholder="Note..."
              onChange={this.handleRevisionNote}
              value={this.state.revision_note}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              style={{ float: "right", marginRight: "8px" }}
              onClick={this.cancelMR}
            >
              <i className="fa fa-edit" style={{ marginRight: "8px" }}></i>{" "}
              Cancel MR
            </Button>
            <Button color="secondary" onClick={this.toggleModalCancelMR}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* modal form approve */}
        <ModalForm
          isOpen={this.state.modal_approve_ldm}
          toggle={this.toggleModalapprove}
          className={"modal-sm modal--box-input"}
        >
          <Col>
            {this.state.data_mr !== null &&
            this.state.data_mr !== undefined &&
            this.state.data_mr.dsp_company !== null ? (
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
              <Fragment>
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
                <FormGroup>
                  <Label htmlFor="total_box">MOT Type</Label>
                  <Input
                    type="select"
                    name={"0 /// sub_category"}
                    onChange={this.handleMotType}
                    value={this.state.mot_type}
                  >
                    <option value="" disabled selected hidden></option>
                    <option value="MOT-Land">MOT-Land</option>
                    <option value="MOT-Air">MOT-Air</option>
                    <option value="MOT-Sea">MOT-Sea</option>
                  </Input>
                </FormGroup>
              </Fragment>
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
