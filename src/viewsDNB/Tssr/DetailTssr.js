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
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { Form, FormGroup, Label } from "reactstrap";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import axios from "axios";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { ExcelRenderer } from "react-excel-renderer";
import { connect } from "react-redux";
import Select from "react-select";
import ModalDelete from "../components/ModalDelete";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const API_URL_BMS_Phil = "https://api-dev.smart.pdb.e-dpm.com/smartapi";
const usernamePhilApi = "pdbdash";
const passwordPhilApi = "rtkO6EZLkxL1";

const API_URL_BAM = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const usernameBAM = "bamidadmin@e-dpm.com";
const passwordBAM = "F760qbAg2sml";

const API_URL_PDB_TSEL = "https://api-dev.tsel.pdb.e-dpm.com/tselpdbapi";
const usernameTselApi = "adminbamidsuper";
const passwordTselApi = "F760qbAg2sml";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

const API_URL_NODE = "https://api2-dev.bam-id.e-dpm.com/bamidapi";

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

if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

class DetailTssr extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      rowsXLS: [],
      data_tower: {},
      data_tssr: null,
      tssr_site_FE: null,
      tssr_site_NE: null,
      data_tssr_sites: [],
      data_tssr_sites_item: [],
      list_version: [],
      data_tssr_current: null,
      tssr_site_FE_current: null,
      tssr_site_NE_current: null,
      data_tssr_sites_current: [],
      data_tssr_sites_item_current: [],
      version_selected: null,
      version_current: null,
      list_pp_material_tssr: [],
      list_project: [],
      project_selected: null,
      project_name_selected: null,
      cd_id_selected: null,
      dataTssrUpload: [],
      dataTssrRevUpload: [],
      list_technical_ref: [],
      list_technical_ref_selection: [],
      technical_ref_selected: null,
      waiting_status: null,
      action_status: null,
      action_message: null,
      tssrData: null,
      material_wh: [],
      material_inbound: [],
      collapseUpload: false,
      dropdownOpen: new Array(1).fill(false),
      wbs_cd_id_data: [],
      collapseUploadAdditonal: false,
      qty_ps: [
        [
          "bam_id",
          "tssr_id",
          "bundle_id",
          "bundle_name",
          "program",
          "material_id_plan",
          "material_name_plan",
          "material_id_actual",
          "material_name_actual",
          "uom",
          "qty",
        ],
      ],

      modalAdditionalForm: false,
      modal_loading: false,
      additional_material: [],
      modal_delete_warning: false,
      product_package: [],
      material_additional_data: [],
    };
    this.handleChangeProject = this.handleChangeProject.bind(this);
    this.handleChangeVersion = this.handleChangeVersion.bind(this);
    this.saveProjecttoDB = this.saveProjecttoDB.bind(this);
    this.prepareEdit = this.prepareEdit.bind(this);
    this.prepareRevision = this.prepareRevision.bind(this);
    this.exportFormatTSSR = this.exportFormatTSSR.bind(this);
    this.handleChangeTechRef = this.handleChangeTechRef.bind(this);
    this.referenceWithTechBoq = this.referenceWithTechBoq.bind(this);
    this.submitTSSR = this.submitTSSR.bind(this);
    this.deletePS = this.deletePS.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.toggleUploadAdditional = this.toggleUploadAdditional.bind(this);
    this.saveUpdateMaterial = this.saveUpdateMaterial.bind(this);
    this.saveUpdateMaterialAdditonal =
      this.saveUpdateMaterialAdditonal.bind(this);
    this.saveUpdateMaterialWeb = this.saveUpdateMaterialWeb.bind(this);
    this.downloadMaterialTSSRUpload =
      this.downloadMaterialTSSRUpload.bind(this);
    this.downloadMaterialTSSRUploadNOK =
      this.downloadMaterialTSSRUploadNOK.bind(this);
    this.exportMaterialPSReport = this.exportMaterialPSReport.bind(this);
    this.exportMaterialPSReportBundling =
      this.exportMaterialPSReportBundling.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.toggleAdditionalForm = this.toggleAdditionalForm.bind(this);
    this.AdditionalForm = this.AdditionalForm.bind(this);

    this.addMaterialAdditional = this.addMaterialAdditional.bind(this);
    this.deleteMaterialAdditional = this.deleteMaterialAdditional.bind(this);
    this.downloadMaterialTSSRUploadAdditional =
      this.downloadMaterialTSSRUploadAdditional.bind(this);
    this.onChangeMaterialAdditional =
      this.onChangeMaterialAdditional.bind(this);
    this.saveAdditional = this.saveAdditional.bind(this);
    this.deleteAdditionalMaterialAll =
      this.deleteAdditionalMaterialAll.bind(this);
    this.toggleWarningDeleteAdditional =
      this.toggleWarningDeleteAdditional.bind(this);
    this.downloadEPODFormat = this.downloadEPODFormat.bind(this);
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggleAdditionalForm() {
    this.setState((prevState) => ({
      modalAdditionalForm: !prevState.modalAdditionalForm,
    }));
  }

  toggleWarningDeleteAdditional() {
    this.setState((prevState) => ({
      modal_delete_warning: !prevState.modal_delete_warning,
    }));
  }

  toggleUpload() {
    this.setState({
      collapseUpload: !this.state.collapseUpload,
      collapseUploadAdditonal: false,
    });
  }

  toggleUploadAdditional() {
    this.setState({
      collapseUploadAdditonal: !this.state.collapseUploadAdditonal,
      collapseUpload: false,
    });
  }

  toggleDropdown(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
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

  async patchDatatoAPIBMS(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL_BMS_Phil + url, data, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
        },
        headers: {
          "If-Match": _etag,
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

  async getDatafromAPITSEL(url) {
    try {
      let respond = await axios.get(API_URL_PDB_TSEL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameTselApi,
          password: passwordTselApi,
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
      console.log("respond Patch data", err.response);
      return respond;
    }
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios({
        method: "get",
        url: API_URL_NODE + url,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.tokenUser,
        },
        params: {},
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

  checkValue(props) {
    //Swap undefined to null
    if (typeof props === "undefined") {
      return null;
    } else {
      return props;
    }
  }

  checkValuetoZero(props) {
    //Swap undefined or null to 0
    if (typeof props == "undefined" || props == null) {
      return 0;
    } else {
      return props;
    }
  }

  checkValuetoString(props) {
    //Swap undefined or null to ""
    if (typeof props == "undefined" || props == null) {
      return "";
    } else {
      return props;
    }
  }

  isSameValue(element, value) {
    //function for FindIndex
    return element === value;
  }

  getIndex(data, value) {
    //get index of value in Array
    return data.findIndex((e) => this.isSameValue(e, value));
  }

  comparerDiffbyField(otherArray, field) {
    //Compare Different between 2 array
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other[field] == current[field];
        }).length == 0
      );
    };
  }

  comparerDiffbyValue(otherArray) {
    //Compare Different between 2 array
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other == current;
        }).length == 0
      );
    };
  }

  fileHandlerTSSR = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          this.setState(
            {
              action_status: null,
              action_message: null,
            },
            () => {
              this.ArrayEmptytoNull(rest.rows);
            }
          );
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

  async getAllPP(array_PP, array_PP_sepcial) {
    let dataPP = [];
    let arrayDataPP = array_PP;
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for (let i = 0; i < getNumberPage; i++) {
      let DataPaginationPP = arrayDataPP.slice(i * 25, (i + 1) * 25);
      let arrayIdPP = '"' + DataPaginationPP.join('", "') + '"';
      arrayIdPP = arrayIdPP.replace("&", "%26");
      let where_id_PP = '?where={"pp_id" : {"$in" : [' + arrayIdPP + "]}}";
      let resPP = await this.getDatafromAPIBAM(
        "/pp_sorted_nonpage" + where_id_PP
      );
      if (resPP !== undefined) {
        if (resPP.data !== undefined) {
          dataPP = dataPP.concat(resPP.data._items);
        }
      }
    }
    for (let i = 0; i < array_PP_sepcial.length; i++) {
      let dataPPIndex = array_PP_sepcial[i];
      dataPPIndex = dataPPIndex.replace('"', "");
      let where_id_PP =
        '?where={"pp_id":{"$regex" : "' + dataPPIndex + '", "$options" : "i"}}';
      let resPP = await this.getDatafromAPIBAM(
        "/pp_sorted_nonpage" + where_id_PP
      );
      if (resPP !== undefined) {
        if (resPP.data !== undefined) {
          dataPP = dataPP.concat(resPP.data._items);
        }
      }
    }
    return dataPP;
  }

  getDataTssr(_id_tssr) {
    this.getDataFromAPINODE("/plantspec/" + _id_tssr).then((res) => {
      if (res.data !== undefined) {
        this.setState({ tssrData: res.data.data }, () => {
          this.getPackageDataAPI();
          if (res.data.data.site_info !== undefined) {
            this.getDataTower(res.data.data.site_info[0].site_id);
            this.getDataCDID(
              res.data.data.site_info
                .filter((fe) => fe.cd_id !== null && fe.cd_id !== undefined)
                .map((e) => e.cd_id)
            );
          }
          this.getDataWarehouse();
          this.getDataInbound();
        });
        console.log("tssrData", this.state.tssrData);
      }
    });
  }

  getDataTower(tower_id) {
    this.getDatafromAPIXL(
      '/tower_site_op?where={"tower_id" :"' +
        tower_id +
        '"}&projection={"tower_id":1,"region":1, "address":1, "city":1}'
    ).then((res) => {
      if (res.data !== undefined) {
        if (res.data._items[0] !== undefined) {
          this.setState({ data_tower: res.data._items[0] });
        }
      }
    });
  }

  async getDataCDID(array_cd_id) {
    if (array_cd_id.length !== 0) {
      let array_in_cdid = '"' + array_cd_id.join('", "') + '"';
      const getWPID = await this.getDatafromAPIXL(
        '/custdel_sorted?where={"WP_ID":{"$in" : [' + array_in_cdid + "]}}"
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        this.setState({ wbs_cd_id_data: getWPID.data._items });
      }
    }
  }

  async getDataWarehouse() {
    let listSku = [];
    if (this.state.tssrData !== undefined) {
      this.state.tssrData.packages.map((pp) =>
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

  async getDataInbound() {
    let listSku = [];
    if (this.state.tssrData !== undefined) {
      this.state.tssrData.packages.map((pp) =>
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

  async getPPandMaterial(array_id_package) {
    let dataPP = [];
    let arrayDataPP = array_id_package;
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for (let i = 0; i < getNumberPage; i++) {
      let dataPaginationPP = arrayDataPP.slice(i * 25, (i + 1) * 25);
      let arrayIdPP = '"' + dataPaginationPP.join('", "') + '"';
      let where_id_PP = '?where={"_id" : {"$in" : [' + arrayIdPP + "]}}";
      let resPP = await this.getDatafromAPIBAM(
        "/pp_sorted_nonpage" + where_id_PP
      );
      if (resPP !== undefined) {
        if (resPP.data !== undefined) {
          // eslint-disable-next-line
          dataPP = dataPP.concat(resPP.data._items);
        }
      }
    }
    this.getDataMaterial(dataPP);
  }

  async getDataMaterial(data_pp) {
    let dataMat = [];
    let arrayDataPP = data_pp.map((e) => e._id);
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for (let i = 0; i < getNumberPage; i++) {
      let dataPaginationPP = arrayDataPP.slice(i * 25, (i + 1) * 25);
      let arrayIdPP = '"' + dataPaginationPP.join('", "') + '"';
      let where_id_PP = '?where={"id_pp_doc" : {"$in" : [' + arrayIdPP + "]}}";
      let resMat = await this.getDatafromAPIBAM("/mc_op" + where_id_PP);
      if (resMat !== undefined) {
        if (resMat.data !== undefined) {
          // eslint-disable-next-line
          dataMat = dataMat.concat(resMat.data._items);
        }
      }
    }
    this.prepareDataPP(data_pp, dataMat);
  }

  prepareDataPP(data_pp, data_material) {
    let product_package = data_pp;
    const material_catalogue = data_material;
    for (let i = 0; i < product_package.length; i++) {
      const material = material_catalogue.filter(
        (e) => e.pp_id === product_package[i].pp_id
      );
      product_package[i]["list_of_material"] = material;
    }
    this.setState({ list_pp_material_tssr: product_package });
  }

  prepareView() {
    let site_NE = this.state.data_tssr_sites.find((e) => e.site_title === "NE");
    let site_FE = this.state.data_tssr_sites.find((e) => e.site_title === "FE");
    if (site_NE !== undefined) {
      site_NE["list_of_site_items"] = this.state.data_tssr_sites_item.filter(
        (e) => e.id_tssr_boq_site_doc === site_NE._id
      );
      this.setState({ tssr_site_NE: site_NE, tssr_site_NE_current: site_NE });
    } else {
      this.setState({ tssr_site_NE: null, tssr_site_NE_current: null });
    }
    if (site_FE !== undefined) {
      site_FE["list_of_site_items"] = this.state.data_tssr_sites_item.filter(
        (e) => e.id_tssr_boq_site_doc === site_FE._id
      );
      this.setState({ tssr_site_FE: site_FE, tssr_site_FE_current: site_FE });
    } else {
      this.setState({ tssr_site_FE: null, tssr_site_FE_current: null });
    }
  }

  getDataProject() {
    this.getDatafromAPITSEL("/project_sorted_non_page").then((resProject) => {
      if (resProject.data !== undefined) {
        this.setState({ list_project: resProject.data._items });
      }
    });
  }

  componentDidMount() {
    this.getDataTssr(this.props.match.params.id);
    // this.getPackageDataAPI();
    // this.getVersionTssr(this.props.match.params.id);
  }

  preparingDataTSSR() {
    //Before Show preview and user can click save button
    const dataTSSRXls = this.state.rowsXLS;
    for (let i = 2; i < dataTSSRXls.length; i++) {}
  }

  preparingSaveTssr() {
    const dateNow = new Date();
    const dataRandom = Math.floor(Math.random() * 100);
    const numberTSSR =
      dateNow.getFullYear().toString() +
      (dateNow.getMonth() + 1).toString() +
      dateNow.getDate().toString() +
      "-" +
      dataRandom.toString().padStart(4, "0");
    return numberTSSR;
  }

  getQtyTssrPPNE(pp_id) {
    const itemTssrBom = this.state.tssr_site_NE.list_of_site_items;
    const getDataPPTssr = itemTssrBom.find((e) => e.pp_id === pp_id);
    if (getDataPPTssr !== undefined) {
      return getDataPPTssr.qty;
    } else {
      return 0;
    }
  }

  getQtyTssrPPFE(pp_id) {
    const itemTssrBom = this.state.tssr_site_FE.list_of_site_items;
    const getDataPPTssr = itemTssrBom.find((e) => e.pp_id === pp_id);
    if (getDataPPTssr !== undefined) {
      return getDataPPTssr.qty;
    } else {
      return 0;
    }
  }

  handleChangeProject(e) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    this.setState({ project_selected: value, project_name_selected: text });
  }

  saveProjecttoDB() {
    let dataTssr = this.state.data_tssr;
    const _id_project = this.state.project_selected;
    const name_project = this.state.project_name_selected;
    const dataProject = {
      id_project_doc: _id_project,
      project_name: name_project,
    };
    this.patchDatatoAPIBAM(
      "/tssr_op/" + dataTssr._id,
      dataProject,
      dataTssr._etag
    ).then((resProject) => {
      if (
        resProject.data !== undefined &&
        resProject.status >= 200 &&
        resProject.status <= 300
      ) {
        dataTssr["id_project_doc"] = _id_project;
        dataTssr["project_name"] = name_project;
        this.setState({ action_status: "success", data_tssr: dataTssr });
      } else {
        this.setState({ action_status: "failed" });
      }
    });
  }

  prepareEdit() {
    this.prepareEditData();
  }

  async prepareEditData(signSucRev, versionNew) {
    let signSuc = [];
    let signRevSuc = signSucRev;
    let dataTSSR = this.state.data_tssr;
    let dataSiteNE = this.state.tssr_site_NE;
    let dataSiteFE = this.state.tssr_site_FE;
    let dataFormat = this.state.dataTssrUpload;
    let version = dataTSSR.version;
    if (signSucRev === undefined) {
      signRevSuc = [];
    } else {
      if (versionNew !== undefined) {
        version = versionNew;
      }
    }
    if (this.state.version_current !== this.state.version_selected) {
      dataTSSR = this.state.data_tssr_current;
      dataSiteNE = this.state.tssr_site_NE_current;
      dataSiteFE = this.state.tssr_site_FE_current;
    }
    if (
      dataFormat.length === 0 &&
      this.state.version_current !== this.state.version_selected
    ) {
      dataFormat = this.state.dataTssrRevUpload;
    }
    if (dataSiteNE !== null) {
      const SiteNENew = dataFormat.find(
        (e) => e.site_id === dataSiteNE.site_id
      );
      if (SiteNENew !== undefined && dataSiteNE.site_id === SiteNENew.site_id) {
        const itemFormatNew = SiteNENew.list_of_site_items;
        const itemNE = dataSiteNE.list_of_site_items;
        const itemNENew = itemFormatNew.filter(
          this.comparerDiffbyField(itemNE, "pp_id")
        );
        const itemNEDel = itemNE.filter(
          this.comparerDiffbyField(itemFormatNew, "pp_id")
        );
        const itemNESame = itemFormatNew.filter(
          (e) => itemNE.findIndex((i) => e.pp_id === i.pp_id) !== -1
        );
        const patchDataSite = await this.patchDatatoAPIBAM(
          "/tssr_sites_op/" + dataSiteNE._id,
          { version: version.toString() },
          dataSiteNE._etag
        );
        const delItem = await this.delItemTssr(itemNEDel, version, dataSiteNE);
        const editItem = await this.editPP(
          itemNENew,
          itemNESame,
          version,
          dataTSSR,
          dataSiteNE
        );
        if (
          delItem.length === itemNEDel.length &&
          editItem.length === itemNENew.length + itemNESame.length
        ) {
          signSuc.push(true);
        }
      }
    }
    if (dataSiteFE !== null) {
      const SiteFENew = dataFormat.find(
        (e) => e.site_id === dataSiteFE.site_id
      );
      if (SiteFENew !== undefined && dataSiteFE.site_id === SiteFENew.site_id) {
        const itemFormatNew = SiteFENew.list_of_site_items;
        const itemFE = dataSiteFE.list_of_site_items;
        const itemFENew = itemFormatNew.filter(
          this.comparerDiffbyField(itemFE, "pp_id")
        );
        const itemFEDel = itemFE.filter(
          this.comparerDiffbyField(itemFormatNew, "pp_id")
        );
        const itemFESame = itemFormatNew.filter(
          (e) => itemFE.findIndex((i) => e.pp_id === i.pp_id) !== -1
        );
        const patchDataSite = await this.patchDatatoAPIBAM(
          "/tssr_sites_op/" + dataSiteFE._id,
          { version: version.toString() },
          dataSiteFE._etag
        );
        const delItem = await this.delItemTssr(itemFEDel, version, dataSiteFE);
        const editItem = await this.editPP(
          itemFENew,
          itemFESame,
          version,
          dataTSSR,
          dataSiteFE
        );
        if (
          delItem.length === itemFEDel.length &&
          editItem.length === itemFENew.length + itemFESame.length
        ) {
          signSuc.push(true);
        }
      }
    }
    const patchDataParent = await this.patchDatatoAPIBAM(
      "/tssr_op/" + dataTSSR._id,
      { version: version.toString() },
      dataTSSR._etag
    );
    if (signSucRev === undefined) {
      if (signSuc.length === 2 && patchDataParent.data !== undefined) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        });
      } else {
        this.setState({ action_status: "failed" });
      }
    } else {
      if (
        signSuc.length + signSucRev.length === 5 &&
        patchDataParent.data !== undefined
      ) {
        this.setState({ action_status: "success" }, () => {
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        });
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  async editPP(itemNew, itemSame, version, dataTssr, dataSite) {
    const date = new Date();
    const dateNow =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    let sucEdit = [];
    for (let i = 0; i < itemSame.length; i++) {
      const dataItemIdx = dataSite.list_of_site_items.find(
        (e) => e.pp_id === itemSame[i].pp_id
      );
      const patchDataItem = await this.patchDatatoAPIBAM(
        "/tssr_site_items_op/" + dataItemIdx._id,
        { qty: itemSame[i].qty, version: version.toString() },
        dataItemIdx._etag
      );
      if (patchDataItem.data !== undefined && patchDataItem.status < 400) {
        sucEdit.push(patchDataItem.data._id);
      }
    }
    if (itemNew.length !== 0) {
      let tssrSitesItem = [];
      for (let j = 0; j < itemNew.length; j++) {
        let itemSiteIdx = Object.assign(itemNew[j], {});
        itemSiteIdx["id_tssr_boq_doc"] = dataTssr._id;
        itemSiteIdx["no_tssr_boq"] = dataTssr.no_tssr_boq;
        itemSiteIdx["id_tssr_boq_site_doc"] = dataSite._id;
        itemSiteIdx["no_tssr_boq_site"] = dataSite.no_tssr_boq_site;
        itemSiteIdx["version"] = version.toString();
        itemSiteIdx["created_on"] = dateNow.toString();
        itemSiteIdx["updated_on"] = dateNow.toString();
        tssrSitesItem.push(itemSiteIdx);
      }
      const respondSaveTSSRSitesItem = await this.postDatatoAPIBAM(
        "/tssr_site_items_op",
        tssrSitesItem
      );
      if (respondSaveTSSRSitesItem.data !== undefined) {
        if (itemNew.length > 1) {
          sucEdit.push(respondSaveTSSRSitesItem.data._items.map((e) => e._id));
        } else {
          sucEdit.push(respondSaveTSSRSitesItem.data._id);
        }
      }
    }
    return sucEdit;
  }

  async prepareRevision() {
    let signSuc = [];
    let dataTSSR = this.state.data_tssr;
    let dataSiteNE = this.state.tssr_site_NE;
    let dataSiteFE = this.state.tssr_site_FE;
    if (this.state.version_current !== this.state.version_selected) {
      dataTSSR = this.state.data_tssr_current;
      dataSiteNE = this.state.tssr_site_NE_current;
      dataSiteFE = this.state.tssr_site_FE_current;
    }
    let version = parseInt(dataTSSR.version) + 1;
    let version_current = parseInt(dataTSSR.version);
    let dataRevTssr = Object.assign({}, dataTSSR);
    dataRevTssr["id_document"] = dataTSSR._id;
    dataRevTssr["created_by"] = dataTSSR.created_by;
    dataRevTssr["updated_by"] = dataTSSR.updated_by;
    delete dataRevTssr._id;
    delete dataRevTssr._etag;
    delete dataRevTssr._links;
    const respondSaveTSSRRev = await this.postDatatoAPIBAM(
      "/tssr_version_op",
      dataRevTssr
    );
    if (respondSaveTSSRRev.data !== undefined) {
      signSuc.push(true);
      let dataItemRev = [];
      let dataSiteRev = [];
      let dataRevNE = Object.assign({}, dataSiteNE);
      let dataRevFE = Object.assign({}, dataSiteFE);
      const dataItemNE = dataSiteNE.list_of_site_items;
      const dataItemFE = dataSiteFE.list_of_site_items;
      for (let i = 0; i < dataItemNE.length; i++) {
        let dataRevItemNE = Object.assign({}, dataItemNE[i]);
        dataRevItemNE["id_document"] = dataItemNE[i]._id;
        dataRevItemNE["created_by"] = dataItemNE[i].created_by;
        dataRevItemNE["updated_by"] = dataItemNE[i].updated_by;
        dataRevItemNE["version"] = version_current.toString();
        delete dataRevItemNE._id;
        delete dataRevItemNE._etag;
        delete dataRevItemNE._links;
        dataItemRev.push(dataRevItemNE);
      }
      for (let i = 0; i < dataItemFE.length; i++) {
        let dataRevItemFE = Object.assign({}, dataItemFE[i]);
        dataRevItemFE["id_document"] = dataItemFE[i]._id;
        dataRevItemFE["created_by"] = dataItemFE[i].created_by;
        dataRevItemFE["updated_by"] = dataItemFE[i].updated_by;
        dataRevItemFE["version"] = version_current.toString();
        delete dataRevItemFE._id;
        delete dataRevItemFE._etag;
        delete dataRevItemFE._links;
        dataItemRev.push(dataRevItemFE);
      }
      dataRevNE["id_document"] = dataSiteNE._id;
      dataRevNE["created_by"] = dataSiteNE.created_by;
      dataRevNE["updated_by"] = dataSiteNE.updated_by;
      dataRevNE["version"] = version_current.toString();
      delete dataRevNE._id;
      delete dataRevNE._etag;
      delete dataRevNE._links;
      if (dataRevNE.list_of_site_items !== undefined) {
        delete dataRevNE.list_of_site_items;
      }
      dataSiteRev.push(dataRevNE);
      dataRevFE["id_document"] = dataSiteFE._id;
      dataRevFE["created_by"] = dataSiteFE.created_by;
      dataRevFE["updated_by"] = dataSiteFE.updated_by;
      dataRevFE["version"] = version_current.toString();
      delete dataRevFE._id;
      delete dataRevFE._etag;
      delete dataRevFE._links;
      if (dataRevFE.list_of_site_items !== undefined) {
        delete dataRevFE.list_of_site_items;
      }
      dataSiteRev.push(dataRevFE);
      const respondSaveSitesRev = await this.postDatatoAPIBAM(
        "/tssr_sites_version_op",
        dataSiteRev
      );
      if (respondSaveSitesRev.data !== undefined) {
        signSuc.push(true);
        const respondSaveItemsRev = await this.postDatatoAPIBAM(
          "/tssr_site_items_version_op",
          dataItemRev
        );
        if (respondSaveItemsRev.data !== undefined) {
          signSuc.push(true);
          console.log("version rev", version);
          this.prepareEditData(signSuc, version);
        }
      }
    }
  }

  async delItemTssr(itemDel, version, dataSite) {
    let sucDel = [];
    for (let i = 0; i < itemDel.length; i++) {
      const dataItemIdx = dataSite.list_of_site_items.find(
        (e) => e.pp_id === itemDel[i].pp_id
      );
      const delData = await this.patchDatatoAPIBAM(
        "/tssr_site_items_op/" + dataItemIdx._id,
        { deleted: 1, version: version.toString() },
        dataItemIdx._etag
      );
      if (delData.data !== undefined && delData.status < 400) {
        sucDel.push(delData.data._id);
      }
    }
    return sucDel;
  }

  getVersionTssr(_id) {
    this.getDatafromAPIBAM(
      '/tssr_version_sorted_nonpage?where={"id_document":"' +
        _id +
        '"}&projection={"version":1, "_etag" : 1}'
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ list_version: res.data._items });
      }
    });
  }

  handleChangeVersion(e) {
    const value = e.target.value;
    this.setState({ version_selected: value }, () => {
      if (value !== this.state.version_current) {
        this.getDataTssrVersion(this.props.match.params.id, value);
      } else {
        this.getDataTssr(this.props.match.params.id);
      }
    });
  }

  handleChangeQTY(e, i, u) {
    const value_qty = e.target.value;
    const Data_tssr = this.state.tssrData;
    const Data_package = Data_tssr.packages.find((e) => e._id === u);
    if (Data_package !== undefined) {
      const Data_mat = Data_package.materials.find((m) => m._id === i);
      if (Data_mat !== undefined) {
        this.setState((prevState) => ({
          qty_ps: [
            ...prevState.qty_ps,
            [
              Data_mat._id,
              Data_mat.no_tssr_boq_site,
              Data_package.pp_id,
              Data_package.product_name,
              Data_package.program,
              Data_mat.material_id_plan,
              Data_mat.material_name_plan,
              Data_mat.material_id_plan,
              Data_mat.material_name_plan,
              Data_mat.uom,
              value_qty,
            ],
          ],
        }));
      }
    }
  }

  getDataTssrVersion(_id_tssr, version) {
    this.getDatafromAPIBAM(
      '/tssr_version_op?where={"id_document" : "' +
        _id_tssr +
        '", "version" : "' +
        version +
        '"}'
    ).then((resTssr) => {
      if (resTssr.data !== undefined) {
        // this.setState({ data_tssr : resTssr.data });
        this.getDatafromAPIBAM(
          '/tssr_sites_version_op?where={"id_tssr_boq_doc" : "' +
            _id_tssr +
            '", "version" : "' +
            version +
            '"}'
        ).then((resSites) => {
          if (resSites.data !== undefined) {
            this.getDatafromAPIBAM(
              '/tssr_site_items_version_op?where={"id_tssr_boq_doc" : "' +
                _id_tssr +
                '", "version" : "' +
                version +
                '"}'
            ).then((resItem) => {
              if (
                resItem.data !== undefined &&
                resItem.data._items.length !== 0
              ) {
                const itemsTssr = resItem.data._items;
                const itemUniq = [
                  ...new Set(itemsTssr.map(({ id_pp_doc }) => id_pp_doc)),
                ];
                this.setState(
                  {
                    data_tssr_sites: resSites.data._items,
                    data_tssr_sites_item: resItem.data._items,
                  },
                  () => {
                    this.getPPandMaterial(itemUniq);
                    this.prepareViewRevision();
                  }
                );
              }
            });
          }
        });
      }
    });
  }

  prepareViewRevision() {
    let site_NE = this.state.data_tssr_sites.find((e) => e.site_title === "NE");
    let site_FE = this.state.data_tssr_sites.find((e) => e.site_title === "FE");
    if (site_NE !== undefined) {
      site_NE["list_of_site_items"] = this.state.data_tssr_sites_item.filter(
        (e) => e.id_tssr_boq_site_doc === site_NE.id_document
      );
      console.log("site NE", site_NE);
      this.setState({ tssr_site_NE: site_NE });
    } else {
      site_NE = null;
      this.setState({ tssr_site_NE: null });
    }
    if (site_FE !== undefined) {
      site_FE["list_of_site_items"] = this.state.data_tssr_sites_item.filter(
        (e) => e.id_tssr_boq_site_doc === site_FE.id_document
      );
      this.setState({ tssr_site_FE: site_FE });
    } else {
      site_FE = null;
      this.setState({ tssr_site_FE: null });
    }
    this.formatDataRev(site_NE, site_FE);
  }

  formatDataRev(siteNE, siteFE) {
    console.log("siteNE rev", siteNE);
    let dataFormat = [];
    let listSites = [];
    if (siteNE !== null && siteNE !== undefined) {
      listSites.push(siteNE);
    }
    if (siteFE !== null && siteFE !== undefined) {
      listSites.push(siteFE);
    }
    for (let i = 0; i < listSites.length; i++) {
      let itemsSite = [];
      let dataItem = listSites[i].list_of_site_items;
      for (let j = 0; j < dataItem.length; j++) {
        let package_data = {
          id_pp_doc: dataItem[j].id_pp_doc,
          pp_id: dataItem[j].pp_id,
          pp_group: dataItem[j].pp_group,
          pp_cust_number: dataItem[j].pp_cust_number,
          product_name: dataItem[j].product_name,
          physical_group: dataItem[j].physical_group,
          product_type: dataItem[j].pp_group,
          uom: dataItem[j].uom,
          qty: dataItem[j].qty,
          version: "0",
          deleted: 0,
          created_by: this.state.userId,
          updated_by: this.state.userId,
        };
        itemsSite.push(package_data);
      }
      let siteTssrBOM = {
        account_id: "1",
        site_id: listSites[i].site_id,
        site_name: listSites[i].site_id,
        site_title: listSites[i].site_id,
        list_of_site_items: itemsSite,
        version: "0",
        created_by: this.state.userId,
        updated_by: this.state.userId,
        deleted: 0,
      };
      dataFormat.push(siteTssrBOM);
    }
    this.setState({ dataTssrRevUpload: dataFormat });
  }

  exportFormatTSSR = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPP = this.state.list_pp_material_tssr;
    const dataNE = this.state.tssr_site_NE;
    const dataFE = this.state.tssr_site_FE;

    let ppIdRow = ["site_title", "site_id", "site_name"];
    let ppTypeRow = ["", "", ""];

    ppIdRow = ppIdRow.concat(
      dataPP.map((pp) => pp.pp_id + " /// " + pp.product_name)
    );
    ppTypeRow = ppTypeRow.concat(dataPP.map((pp) => pp.product_type));

    ws.addRow(ppTypeRow);
    ws.addRow(ppIdRow);
    if (dataNE !== null) {
      let rowNE = ["NE", dataNE.site_id, dataNE.site_name];
      rowNE = rowNE.concat(dataPP.map((e) => this.getQtyTssrPPNE(e.pp_id)));
      ws.addRow(rowNE);
    }
    if (dataFE !== null) {
      let rowFE = ["FE", dataFE.site_id, dataFE.site_name];
      rowFE = rowFE.concat(dataPP.map((e) => this.getQtyTssrPPFE(e.pp_id)));
      ws.addRow(rowFE);
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Plant Spec " +
        this.state.data_tssr.no_tssr_boq +
        " Uploader Template.xlsx"
    );
  };

  getListTechnicalForRef() {
    const dataPSParent = this.state.data_tssr;
    const dataTSSRBOM = this.state.data_tssr_sites;
    let whereTech = "";
    if (dataTSSRBOM.length > 1) {
      whereTech =
        'where={"$or" : [{"site_id" : "' +
        dataTSSRBOM[0].site_id +
        '"}, {"site_id" : "' +
        dataTSSRBOM[1].site_id +
        '"}] }';
    } else {
      whereTech = 'where={"site_id" : "' + dataTSSRBOM[0].site_id + '"}';
    }
    if (dataTSSRBOM.length > 0) {
      this.getDatafromAPIBMS(
        "/boq_tech_sites_op" +
          '?projection={"site_id" : 1, "site_name" : 1, "_etag" : 1, "id_boq_tech_doc" : 1,  "no_boq_tech" : 1, "tssr_boq_id" : 1}&' +
          whereTech
      ).then((res) => {
        if (res.data !== undefined) {
          this.setState({ list_technical_ref: res.data._items }, () => {
            this.prepareSelectionTechRef(res.data._items);
          });
        }
      });
    }
  }

  prepareSelectionTechRef(techRef) {
    const dataTSSRBOM = this.state.data_tssr_sites;
    const techRefUniq = [
      ...new Set(techRef.map(({ no_boq_tech }) => no_boq_tech)),
    ];
    let listTech = [];
    for (let i = 0; i < techRefUniq.length; i++) {
      const getTech = techRef.filter((e) => e.no_boq_tech === techRefUniq[i]);
      if (getTech.length >= dataTSSRBOM.length) {
        listTech.push({ value: getTech[0]._id, label: getTech[0].no_boq_tech });
      }
    }
    this.setState({ list_technical_ref_selection: listTech });
  }

  handleChangeTechRef = (newValue) => {
    this.setState({ technical_ref_selected: newValue.label });
    return newValue;
  };

  async referenceWithTechBoq() {
    const dataTSSRBOM = this.state.data_tssr_sites;
    const techSelected = this.state.list_technical_ref.filter(
      (e) => e.no_boq_tech === this.state.technical_ref_selected
    );
    let sucPatch = [];
    for (let i = 0; i < dataTSSRBOM.length; i++) {
      const patchWill = techSelected.find(
        (e) => e.site_id === dataTSSRBOM[i].site_id
      );
      if (patchWill !== undefined) {
        const patchData = await this.patchDatatoAPIBMS(
          "/boq_tech_sites_op/" + patchWill._id,
          { tssr_boq_id: dataTSSRBOM[0].no_tssr_boq },
          patchWill._etag
        );
        if (patchData.data !== undefined) {
          sucPatch.push(patchData.data._id);
        }
      }
    }
    if (sucPatch.length === dataTSSRBOM.length) {
      this.setState({ action_status: "success" }, () => {
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      });
    } else {
      this.setState({ action_status: "failed" });
    }
  }

  submitTSSR() {
    this.patchDatatoAPINODE(
      "/plantspec/submitPlantspec/" + this.props.match.params.id
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
      } else {
        this.setState({ action_status: "failed" });
      }
    });
  }

  deletePS() {
    this.toggleLoading();
    this.deleteDataFromAPINODE("/plantspec/deletePlantspec", {
      data: [this.props.match.params.id],
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

  CompareArrayObject(arr, prop) {
    return arr.sort(function (a, b) {
      var nameA = a[prop].toLowerCase(),
        nameB = b[prop].toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  async downloadMaterialTSSRUpload() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages.filter(
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
      "site_id",
      "site_name",
      "tssr_id",
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
    for (let i = 0; i < dataItemTSSR.length; i++) {
      for (let j = 0; j < dataItemTSSR[i].materials.length; j++) {
        let dataMatIdx = dataItemTSSR[i].materials[j];
        list_material_id.push(dataMatIdx.material_id);
        let qty_wh = stockWH.find((e) => e.sku === dataMatIdx.material_id);
        let qty_inbound = inboundWH.find(
          (e) => e.sku === dataMatIdx.material_id
        );
        qty_wh = qty_wh !== undefined ? qty_wh.qty_sku : 0;
        qty_inbound = qty_inbound !== undefined ? qty_inbound.qty_sku : 0;
        ws.addRow([
          dataMatIdx._id,
          dataItemTSSR[i].site_id,
          dataItemTSSR[i].site_name,
          dataItemTSSR[i].no_tssr_boq_site,
          dataItemTSSR[i].pp_id,
          dataItemTSSR[i].product_name,
          dataItemTSSR[i].program,
          dataMatIdx.material_id_plan,
          dataMatIdx.material_name_plan,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.uom,
          dataMatIdx.qty,
          qty_wh,
          qty_inbound,
          dataMatIdx.qty < qty_wh ? "OK" : "NOK",
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
      "Material TSSR " + dataTSSR.no_plantspec + " uploader.xlsx"
    );
  }

  // check_availability(availability){
  //   if (availability === "OK" ){ continue; }
  // }

  async downloadMaterialTSSRUploadNOK() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages.filter(
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
      "site_id",
      "site_name",
      "tssr_id",
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
    for (let i = 0; i < dataItemTSSR.length; i++) {
      for (let j = 0; j < dataItemTSSR[i].materials.length; j++) {
        let dataMatIdx = dataItemTSSR[i].materials[j];
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
          dataItemTSSR[i].site_id,
          dataItemTSSR[i].site_name,
          dataItemTSSR[i].no_tssr_boq_site,
          dataItemTSSR[i].pp_id,
          dataItemTSSR[i].product_name,
          dataItemTSSR[i].program,
          dataMatIdx.material_id_plan,
          dataMatIdx.material_name_plan,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.uom,
          dataMatIdx.qty,
          qty_wh,
          qty_inbound,
          dataMatIdx.qty < qty_wh ? "OK" : "NOK",
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
      "Material TSSR " + dataTSSR.no_plantspec + " uploader.xlsx"
    );
  }

  async downloadMaterialTSSRUploadAdditional() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages;
    const addPP = dataItemTSSR.filter((e) => e.pp_id === "AdditionalMaterial");
    let dataMaterialVariant = [];

    let headerRow = [
      "material_id_actual",
      "material_name_actual",
      "material_type",
      "unit",
      "qty",
      "source_material",
    ];
    ws.addRow(headerRow);
    let list_material_id = [];
    for (let i = 0; i < addPP.length; i++) {
      for (let j = 0; j < addPP[i].materials.length; j++) {
        let dataMatIdx = addPP[i].materials[j];
        ws.addRow([
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.material_type,
          dataMatIdx.uom,
          dataMatIdx.qty,
          dataMatIdx.source_material,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Additional Material TSSR " + dataTSSR.no_plantspec + " uploader.xlsx"
    );
  }

  async exportMaterialPSReport() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages.filter(
      (e) =>
        e.product_type.toLowerCase() !== "svc" &&
        e.product_type.toLowerCase() !== "hwac" &&
        e.product_type.toLowerCase() !== "sw"
    );
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    const DatePrint = new Date();
    const DatePrintOnly =
      DatePrint.getFullYear() +
      "-" +
      (DatePrint.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      DatePrint.getDay().toString().padStart(2, "0");

    const prepared = ws.mergeCells("A4:E4");
    ws.getCell("A4").value = "prepared";
    ws.getCell("A4").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("A4").font = { size: 8 };
    ws.getCell("A4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const preparedEmail = ws.mergeCells("A5:E5");
    ws.getCell("A5").value = this.state.userEmail;
    ws.getCell("A5").alignment = { horizontal: "left" };
    ws.getCell("A5").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const DocumentNo = ws.mergeCells("F4:H4");
    ws.getCell("F4").value = "Document No.";
    ws.getCell("F4").font = { size: 8 };
    ws.getCell("F4").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const DocumentNum = ws.mergeCells("F5:H5");
    ws.getCell("F5").value = dataTSSR.no_plantspec;
    ws.getCell("F5").alignment = { horizontal: "left" };
    ws.getCell("F5").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const Approved = ws.mergeCells("A6:C7");
    ws.getCell("A6").value = "Approved";
    ws.getCell("A6").font = { size: 8 };
    ws.getCell("A6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("A6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
    };

    const Checked = ws.mergeCells("D6:E7");
    ws.getCell("D6").value = "Checked";
    ws.getCell("D6").font = { size: 8 };
    ws.getCell("D6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("D6").border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const dateDoc = ws.mergeCells("F6:G6");
    ws.getCell("F6").value = "Date";
    ws.getCell("F6").font = { size: 8 };
    ws.getCell("F6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const dateDocument = ws.mergeCells("F7:G7");
    ws.getCell("F7").value = DatePrintOnly;
    ws.getCell("F7").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F7").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // const revDoc = ws.mergeCells('H6:I6');
    ws.getCell("H6").value = "Rev";
    ws.getCell("H6").font = { size: 8 };
    ws.getCell("H6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("H6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    // const revDocNum = ws.mergeCells('H7:I7');
    ws.getCell("H7").value = "-";
    ws.getCell("H7").alignment = { horizontal: "left" };
    ws.getCell("H7").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ws.mergeCells("I6:J6");
    ws.getCell("I6").value = "File";
    ws.getCell("I6").font = { size: 8 };
    ws.getCell("I6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("I6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    ws.mergeCells("I7:J7");
    ws.getCell("I7").value = null;
    ws.getCell("I7").alignment = { horizontal: "left" };
    ws.getCell("I7").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ws.mergeCells("I4:J4");
    ws.getCell("I4").value = "PO Number";
    ws.getCell("I4").font = { size: 8 };
    ws.getCell("I4").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("I4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    ws.mergeCells("I5:J5");
    ws.getCell("I5").value = null;
    ws.getCell("I5").alignment = { horizontal: "left" };
    ws.getCell("I5").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ws.addRow([""]);
    ws.addRow(["Project", null, ": " + dataTSSR.project_name]);
    ws.mergeCells("A9:B9");
    ws.addRow([""]);
    ws.addRow(["Tower ID", null, ": " + dataTSSR.site_info[0].site_id]);
    ws.addRow(["Tower Name", null, ": " + dataTSSR.site_info[0].site_name]);
    ws.mergeCells("A11:B11");
    ws.addRow([""]);

    let headerRow = [
      "NO.",
      "DENOMINATION",
      null,
      null,
      "PRODUCT CODE",
      null,
      "QTY PLAN",
      "QTY ACTUAL",
      "UNIT",
      "REMARKS",
    ];
    ws.addRow(headerRow);
    ws.mergeCells("B14:D14");
    ws.mergeCells("E14:F14");
    ws.getCell("A14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("B14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("F14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("G14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("H14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("I14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("J14").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("A14").font = { bold: true };
    ws.getCell("B14").font = { bold: true };
    ws.getCell("F14").font = { bold: true };
    ws.getCell("G14").font = { bold: true };
    ws.getCell("H14").font = { bold: true };
    ws.getCell("I14").font = { bold: true };
    ws.getCell("J14").font = { bold: true };
    ws.addRow([""]);
    let dataItemTSSRConfig = [
      ...new Set(dataItemTSSR.map(({ config_id }) => config_id)),
    ];

    let numberPSItem = 0;

    for (let a = 0; a < dataItemTSSRConfig.length; a++) {
      let itemTSSRBundle = dataItemTSSR.filter(
        (e) =>
          e.config_id === dataItemTSSRConfig[a] &&
          e.product_type.toLowerCase() !== "svc"
      );
      ws.addRow([
        null,
        dataItemTSSRConfig[a],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);
      ws.addRow([""]);
      numberPSItem = numberPSItem + 1;
      ws.addRow([
        numberPSItem,
        dataItemTSSRConfig[a],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        dataItemTSSRConfig[a],
      ]);
      ws.addRow([""]);
      for (let i = 0; i < itemTSSRBundle.length; i++) {
        numberPSItem = numberPSItem + 1;
        ws.addRow([
          numberPSItem,
          itemTSSRBundle[i].product_name,
          null,
          null,
          itemTSSRBundle[i].pp_id,
          null,
          itemTSSRBundle[i].qty,
          null,
          itemTSSRBundle[i].uom,
          null,
        ]);
        for (let j = 0; j < itemTSSRBundle[i].materials.length; j++) {
          let dataMatIdx = itemTSSRBundle[i].materials[j];
          ws.addRow([
            null,
            dataMatIdx.material_name,
            null,
            null,
            dataMatIdx.material_id,
            null,
            dataMatIdx.qty,
            dataMatIdx.qty,
            dataMatIdx.uom,
            null,
          ]);
        }
        ws.addRow([""]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Material TSSR " + dataTSSR.no_plantspec + " Report.xlsx"
    );
  }

  async getDataConfig(arrayConfigId) {
    let dataConfig = [];
    let array_config_id = '"' + arrayConfigId.join('", "') + '"';
    const res = await this.getDataFromAPINODE(
      '/packageconfig?q={"config_id":{"$in" : [' +
        array_config_id +
        ']}}&v={"config_id":1, "config_name":1}'
    );
    if (res.data !== undefined) {
      dataConfig = res.data.data;
    }
    return dataConfig;
  }

  async exportMaterialPSReportBundling() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages.filter(
      (e) => e.product_type.toLowerCase() === "hw"
    );
    const dataCDID = this.state.wbs_cd_id_data;
    const stockWH = this.state.material_wh;
    const inboundWH = this.state.material_inbound;
    let dataMaterialVariant = [];

    const DatePrint = new Date();
    const DatePrintOnly =
      DatePrint.getFullYear() +
      "-" +
      (DatePrint.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      DatePrint.getDay().toString().padStart(2, "0");

    const prepared = ws.mergeCells("A4:E4");
    ws.getCell("A4").value = "prepared";
    ws.getCell("A4").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("A4").font = { size: 8 };
    ws.getCell("A4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const preparedEmail = ws.mergeCells("A5:E5");
    ws.getCell("A5").value = this.state.userEmail;
    ws.getCell("A5").alignment = { horizontal: "left" };
    ws.getCell("A5").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const DocumentNo = ws.mergeCells("F4:I4");
    ws.getCell("F4").value = "Document No.";
    ws.getCell("F4").font = { size: 8 };
    ws.getCell("F4").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const DocumentNum = ws.mergeCells("F5:I5");
    ws.getCell("F5").value = dataTSSR.no_plantspec;
    ws.getCell("F5").alignment = { horizontal: "left" };
    ws.getCell("F5").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const Approved = ws.mergeCells("A6:C7");
    ws.getCell("A6").value = "Approved";
    ws.getCell("A6").font = { size: 8 };
    ws.getCell("A6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("A6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
    };

    const Checked = ws.mergeCells("D6:E7");
    ws.getCell("D6").value = "Checked";
    ws.getCell("D6").font = { size: 8 };
    ws.getCell("D6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("D6").border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const dateDoc = ws.mergeCells("F6:G6");
    ws.getCell("F6").value = "Date";
    ws.getCell("F6").font = { size: 8 };
    ws.getCell("F6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const dateDocument = ws.mergeCells("F7:G7");
    ws.getCell("F7").value = DatePrintOnly;
    ws.getCell("F7").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("F7").border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const revDoc = ws.mergeCells("H6:I6");
    ws.getCell("H6").value = "File";
    ws.getCell("H6").font = { size: 8 };
    ws.getCell("H6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("H6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const revDocNum = ws.mergeCells("H7:I7");
    ws.getCell("H7").value = null;
    ws.getCell("H7").alignment = { horizontal: "left" };
    ws.getCell("H7").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ws.addRow([null]);

    let dataItemTSSRConfig = [
      ...new Set(dataItemTSSR.map(({ config_id }) => config_id)),
    ];
    let dataCDSOWCODEUNIQ = [
      ...new Set(dataCDID.map(({ SoW_Code }) => SoW_Code)),
    ];

    const dataConfig = await this.getDataConfig(dataItemTSSRConfig);

    ws.addRow(["RBS"]);
    let getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).font = { bold: true };

    ws.addRow([
      "Project",
      null,
      ": " + dataTSSR.project_name.replace("///", ", "),
    ]);
    getlastRow = ws.lastRow._number;
    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };
    ws.addRow(["Prodef No.", null, ": " + dataCDSOWCODEUNIQ.join(", ")]);
    getlastRow = ws.lastRow._number;
    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };

    ws.addRow([""]);
    ws.addRow([
      "Tower",
      null,
      ": " +
        dataTSSR.site_info[0].site_id +
        " " +
        dataTSSR.site_info[0].site_name,
    ]);
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };

    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.addRow([
      "Address",
      null,
      ": " +
        (this.state.data_tower.address !== undefined &&
        this.state.data_tower.address !== null &&
        this.state.data_tower.address.length !== 0
          ? this.state.data_tower.address + ", "
          : "") +
        (this.state.data_tower.city !== undefined &&
        this.state.data_tower.city !== null &&
        this.state.data_tower.city.length !== 0
          ? this.state.data_tower.city
          : ""),
    ]);
    getlastRow = ws.lastRow._number;
    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };

    ws.addRow([""]);
    ws.addRow(["Site Information", null, ": "]);
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };

    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.addRow(["Configuration", null, ": " + dataItemTSSRConfig.join(", ")]);
    getlastRow = ws.lastRow._number;
    ws.mergeCells("A" + getlastRow + ":B" + getlastRow);
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("C" + getlastRow).font = { bold: true };

    ws.addRow([""]);

    let headerRow = [
      "No",
      "FUNCTIONAL DESCRIPTION",
      null,
      null,
      "SAP NUMBER",
      "Qty Plan",
      "Qty Built",
      "SLOC",
      "REMARKS",
    ];
    ws.addRow(headerRow);
    getlastRow = ws.lastRow._number;
    ws.mergeCells("B" + getlastRow + ":D" + getlastRow);
    ws.getCell("A" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("B" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("E" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("F" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("G" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("H" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("I" + getlastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("B" + getlastRow).font = { bold: true };
    ws.getCell("E" + getlastRow).font = { bold: true };
    ws.getCell("F" + getlastRow).font = { bold: true };
    ws.getCell("G" + getlastRow).font = { bold: true };
    ws.getCell("H" + getlastRow).font = { bold: true };
    ws.getCell("I" + getlastRow).font = { bold: true };
    ws.addRow([""]);
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("B" + getlastRow).border = { left: { style: "thin" } };
    ws.getCell("E" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("F" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("G" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("H" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("I" + getlastRow).border = {
      left: { style: "thin" },
      right: { style: "thin" },
    };

    let numberPSItem = 0;
    for (let a = 0; a < dataItemTSSRConfig.length; a++) {
      let itemTSSRBundle = dataItemTSSR.filter(
        (e) =>
          e.config_id === dataItemTSSRConfig[a] &&
          e.product_type.toLowerCase() === "hw"
      );
      let dataConfigIdx = dataConfig.find(
        (e) => e.config_id === dataItemTSSRConfig[a]
      );
      if (dataConfigIdx !== undefined) {
        ws.addRow([
          a + 1,
          dataConfigIdx.config_name,
          null,
          null,
          dataItemTSSRConfig[a],
          null,
          null,
          null,
          null,
        ]);
      } else {
        ws.addRow([
          a + 1,
          null,
          null,
          null,
          dataItemTSSRConfig[a],
          null,
          null,
          null,
          null,
        ]);
      }
      getlastRow = ws.lastRow._number;
      ws.getCell("A" + getlastRow).font = { bold: true };
      ws.getCell("B" + getlastRow).font = { bold: true };
      ws.getCell("E" + getlastRow).font = { bold: true };
      ws.getCell("A" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("B" + getlastRow).border = { left: { style: "thin" } };
      ws.getCell("E" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("F" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("G" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("H" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("I" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      for (let i = 0; i < itemTSSRBundle.length; i++) {
        ws.addRow([
          a + 1 + "." + (i + 1),
          itemTSSRBundle[i].product_name,
          null,
          null,
          itemTSSRBundle[i].pp_id,
          itemTSSRBundle[i].qty,
          null,
          null,
          null,
        ]);
        getlastRow = ws.lastRow._number;
        ws.getCell("A" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
        ws.getCell("B" + getlastRow).border = { left: { style: "thin" } };
        ws.getCell("E" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
        ws.getCell("F" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
        ws.getCell("G" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
        ws.getCell("H" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
        ws.getCell("I" + getlastRow).border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };

        // for(let j = 0; j < itemTSSRBundle[i].materials.length; j++){
        //   let dataMatIdx = itemTSSRBundle[i].materials[j];
        //   // ws.addRow([null, dataMatIdx.material_name, null, null, null, dataMatIdx.qty, null, null, null]);
        // }
        // ws.addRow([""]);
      }
      ws.addRow([""]);
      getlastRow = ws.lastRow._number;
      ws.getCell("A" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("B" + getlastRow).border = { left: { style: "thin" } };
      ws.getCell("E" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("F" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("G" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("H" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
      ws.getCell("I" + getlastRow).border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
    ws.addRow([""]);
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("B" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
    };
    ws.getCell("C" + getlastRow).border = { bottom: { style: "thin" } };
    ws.getCell("D" + getlastRow).border = { bottom: { style: "thin" } };
    ws.getCell("E" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("F" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("G" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("H" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    ws.getCell("I" + getlastRow).border = {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    ws.addRow([""]);
    ws.addRow([""]);
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + (getlastRow + 1)).value = "Date";
    ws.getCell("G" + (getlastRow + 1)).value = "Date";

    getlastRow = ws.lastRow._number;
    ws.getCell("A" + (getlastRow + 1)).value = "PT. Ericsson Indonesia";
    ws.getCell("G" + (getlastRow + 1)).value = "PT. Huawei Service";
    getlastRow = ws.lastRow._number;
    ws.getCell("A" + getlastRow).font = { bold: true };
    ws.getCell("G" + getlastRow).font = { bold: true };

    ws.addRow([""]);
    ws.addRow([""]);
    ws.addRow([""]);
    ws.addRow([""]);
    ws.addRow([""]);

    getlastRow = ws.lastRow._number;
    ws.getCell("A" + (getlastRow + 1)).value = "Name";

    ws.getCell("A" + (getlastRow + 1)).border = { top: { style: "thin" } };
    ws.getCell("B" + (getlastRow + 1)).border = { top: { style: "thin" } };
    // ws.getCell('C'+(getlastRow+1)).border = {top: {style:'thin'}};

    ws.getCell("G" + (getlastRow + 1)).value = "Name";

    ws.getCell("G" + (getlastRow + 1)).border = { top: { style: "thin" } };
    ws.getCell("H" + (getlastRow + 1)).border = { top: { style: "thin" } };
    ws.getCell("I" + (getlastRow + 1)).border = { top: { style: "thin" } };

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "PS " + dataTSSR.no_plantspec + " Report Bundling ATP.xlsx"
    );
  }

  async downloadEPODFormat() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    const ws2 = wb.addWorksheet();

    const dataTSSR = this.state.tssrData;
    const dataItemTSSR = this.state.tssrData.packages;
    const dataCDWBS = this.state.wbs_cd_id_data;
    let dataMaterialVariant = [];

    let checkMaterialOrigin =
      this.state.tssrData.packages[0] !== undefined
        ? this.state.tssrData.packages[0].materials[0] !== undefined
          ? this.state.tssrData.packages[0].materials[0].material_origin !==
            undefined
            ? this.state.tssrData.packages[0].materials[0].material_origin
            : undefined
          : undefined
        : undefined;

    // let ppData = [];
    // if(checkMaterialOrigin === undefined){
    //   ppData = await this.ppData(dataItemTSSR.map(e => e.pp_id))
    // }

    let headerRow = [
      "BOM_ID",
      "Site_ID",
      "Material_ID",
      "Material_Name",
      "Material_Quantity",
      "BOM_Status",
      "WBS_ID",
      "CPO_ID",
      "BOM_Creation_Date",
      "SalesOrder_ID",
      "InternalPO_ID",
      "BOM_Approval_Date",
      "Configuration_ID",
      "Bundle_ID",
      "Program_Name",
      "Material_Category",
    ];
    ws.addRow(headerRow);
    let list_material_id = [];
    for (let i = 0; i < dataItemTSSR.length; i++) {
      let dataCD = null;
      let dataCDWBSbyCDID = dataCDWBS.find(
        (e) => e.WP_ID === dataTSSR.site_info[0].cd_id
      );
      if (dataCDWBSbyCDID !== undefined) {
        dataCD = dataCDWBSbyCDID;
      }
      let dataCDMaterial = null;
      let findCDMaterial = dataTSSR.site_info.find(
        (e) => e.no_tssr_boq_site === dataItemTSSR[i].no_tssr_boq_site
      );
      if (findCDMaterial !== undefined) {
        dataCDMaterial = findCDMaterial.cd_id;
      }
      for (let j = 0; j < dataItemTSSR[i].materials.length; j++) {
        let dataMatIdx = dataItemTSSR[i].materials[j];
        ws.addRow([
          dataTSSR.no_plantspec,
          dataCDMaterial,
          dataMatIdx.material_id,
          dataMatIdx.material_name,
          dataMatIdx.qty,
          "Approved",
          dataCD.C1003_WBS_HW,
          dataItemTSSR[i].cpo_number,
          null,
          null,
          null,
          null,
          dataItemTSSR[i].config_id,
          dataItemTSSR[i].pp_id,
          dataItemTSSR[i].program,
          dataMatIdx.material_origin,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "EPOD Format " + dataTSSR.no_plantspec + ".xlsx"
    );
  }

  async getAllPP(array_PP) {
    let dataPP = [];
    let arrayDataPP = array_PP;
    let getNumberPage = Math.ceil(arrayDataPP.length / 25);
    for (let i = 0; i < getNumberPage; i++) {
      let DataPaginationPP = arrayDataPP.slice(i * 25, (i + 1) * 25);
      let arrayIdPP = '"' + DataPaginationPP.join('", "') + '"';
      arrayIdPP = arrayIdPP.replace("&", "%26");
      let where_id_PP = '?where={"pp_id" : {"$in" : [' + arrayIdPP + "]}}";
      let resPP = await this.getDatafromAPI(
        "/pp_sorted_non_page" + where_id_PP
      );
      if (resPP !== undefined) {
        if (resPP.data !== undefined) {
          dataPP = dataPP.concat(resPP.data._items);
        }
      }
    }
    return dataPP;
  }

  async saveUpdateMaterialWeb() {
    this.toggleLoading();
    const dataWeb = this.state.qty_ps;
    const dataTSSR = this.state.tssrData;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/updatePlantSpecWithVariant/" + dataTSSR._id,
      { identifier: "PS", data: dataWeb }
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
  }

  async saveUpdateMaterial() {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataTSSR = this.state.tssrData;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/updatePlantSpecWithVariantWithoutId/" + dataTSSR._id,
      { identifier: "PS", data: dataXLS }
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
  }

  saveUpdateMaterialWithID = async () => {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataTSSR = this.state.tssrData;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/updatePlantSpecWithVariant/" + dataTSSR._id,
      { identifier: "PS", data: dataXLS }
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

  async saveUpdateMaterialAdditonal() {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataTSSR = this.state.tssrData;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/inputAdditionalMaterial/" + dataTSSR._id,
      {
        identifier: "PS",
        additionalMaterial: dataXLS,
        takeOutAdditional: false,
      }
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
  }

  async deleteAdditionalMaterialAll() {
    this.toggleLoading();
    const dataXLS = this.state.rowsXLS;
    const dataTSSR = this.state.tssrData;
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/inputAdditionalMaterial/" + dataTSSR._id,
      { identifier: "PS", additionalMaterial: dataXLS, takeOutAdditional: true }
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
        if (patchDataMat.response.data.data !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: patchDataMat.response.data.data,
          });
        } else {
          this.setState({ action_status: "failed" });
        }
      }
    }
    this.setState({ modal_delete_warning: false });
    this.toggleLoading();
  }

  tableWBSPlantSpect(site_info) {
    const dataCDWBS = this.state.wbs_cd_id_data;
    if (site_info.cd_id !== undefined && site_info.cd_id !== null) {
      let dataCDWBSbyCDID = dataCDWBS.find((e) => e.WP_ID === site_info.cd_id);
      if (dataCDWBSbyCDID !== undefined) {
        return (
          <Fragment>
            <td>{site_info.cd_id}</td>
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
        );
      } else {
        return (
          <Fragment>
            <td>{site_info.cd_id}</td>
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
    } else {
      return (
        <Fragment>
          <td colSpan="11">Please Assign PS to MR</td>
        </Fragment>
      );
    }
  }

  addMaterialAdditional() {
    let addMaterial = this.state.additional_material;
    addMaterial.push({});
    this.setState({ additional_material: addMaterial });
  }

  deleteMaterialAdditional(index) {
    let addMaterial = this.state.additional_material;
    addMaterial.splice(index, 1);
    this.setState({ additional_material: addMaterial });
  }

  onChangeMaterialAdditional(e) {
    let addMaterial = this.state.additional_material;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[1];
    let field = idxField[0];
    if (field === "material_id_actual") {
      addMaterial[parseInt(idx)][field] = value;
      let material = this.state.product_package[0].materials.find(
        (mm) => mm.material_id === value
      );
      if (material !== undefined) {
        addMaterial[parseInt(idx)]["material_name_actual"] =
          material.material_name;
        addMaterial[parseInt(idx)]["material_type"] = material.material_type;
        addMaterial[parseInt(idx)]["unit"] = material.uom;
        addMaterial[parseInt(idx)]["qty"] = material.qty;
      } else {
        addMaterial[parseInt(idx)]["material_name_actual"] = null;
        addMaterial[parseInt(idx)]["material_type"] = null;
        addMaterial[parseInt(idx)]["unit"] = null;
        addMaterial[parseInt(idx)]["qty"] = null;
      }
    } else {
      addMaterial[parseInt(idx)][field] = value;
    }
    this.setState({ additional_material: addMaterial });
  }

  async saveAdditional() {
    this.toggleLoading();
    this.setState({ modalAdditionalForm: false });
    const addMaterial = this.state.additional_material;
    const dataTSSR = this.state.tssrData;
    const dataUpload = [
      [
        "material_id_actual",
        "material_name_actual",
        "material_type",
        "unit",
        "qty",
        "source_material",
      ],
    ];
    for (let i = 0; i < addMaterial.length; i++) {
      dataUpload.push([
        addMaterial[i].material_id_actual,
        addMaterial[i].material_name_actual,
        addMaterial[i].material_type,
        addMaterial[i].unit,
        parseFloat(addMaterial[i].qty),
        addMaterial[i].source_material,
      ]);
    }
    let patchDataMat = await this.patchDatatoAPINODE(
      "/matreq/inputAdditionalMaterial/" + dataTSSR._id,
      {
        identifier: "PS",
        additionalMaterial: dataUpload,
        takeOutAdditional: false,
      }
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
  }

  AdditionalForm() {
    // this.toggleLoading();
    let additionaMaterial = [];
    const addPP = this.state.tssrData.packages.filter(
      (e) => e.pp_id === "AdditionalMaterial"
    );
    const addMaterial = addPP
      .map((value) => value.materials.map((child) => child))
      .reduce((l, n) => l.concat(n), []);
    for (let i = 0; i < addMaterial.length; i++) {
      let addIdx = {
        material_id_actual: addMaterial[i].material_id,
        material_name_actual: addMaterial[i].material_name,
        material_type: addMaterial[i].material_type,
        unit: addMaterial[i].uom,
        qty: addMaterial[i].qty,
        source_material: addMaterial[i].source_material,
      };
      additionaMaterial.push(addIdx);
    }
    this.setState(
      { additional_material: additionaMaterial, modalAdditionalForm: true },
      () => {
        // this.toggleLoading();
      }
    );
  }

  getPackageDataAPI() {
    this.getDataFromAPINODE(
      '/productpackage?q={"pp_id": "AdditionalMaterial"}'
    ).then((res) => {
      if (res.data !== undefined) {
        this.prepareMaterialAdditional(res.data.data);
        this.setState({ product_package: res.data.data });
      } else {
        this.setState({ product_package: [] });
      }
    });
  }

  prepareMaterialAdditional(product) {
    // <Select
    let dataMaterialALL = [];
    for (let i = 0; i < product.length; i++) {
      let PPMat = product[i].materials;
      // if(this.state.tssrData.plantspec_type === "MW"){
      //   PPMat = product[i].materials.filter(e => e.material_type === "TRM" || e.material_type === "trm");
      // }else{
      //   PPMat = product[i].materials.filter(e => e.material_type !== "TRM" && e.material_type !== "trm");
      // }
      for (let j = 0; j < PPMat.length; j++) {
        let matdIdx = PPMat[j];
        matdIdx["value"] = matdIdx.material_id;
        matdIdx["label"] = matdIdx.material_id;
        dataMaterialALL.push(matdIdx);
      }
    }
    this.setState({ material_additional_data: dataMaterialALL });
  }

  onChangeMaterialAdditionalSearch = (newValue, e) => {
    let addMaterial = this.state.additional_material;

    const idMat = newValue.value;
    let idxField = e.name.split(" /// ");
    let idx = idxField[1];
    let field = idxField[0];

    addMaterial[parseInt(idx)][field] = idMat;
    let material = this.state.product_package[0].materials.find(
      (mm) => mm.material_id === idMat
    );
    if (material !== undefined) {
      addMaterial[parseInt(idx)]["material_name_actual"] =
        material.material_name;
      addMaterial[parseInt(idx)]["material_type"] = material.material_type;
      addMaterial[parseInt(idx)]["unit"] = material.uom;
      addMaterial[parseInt(idx)]["qty"] = material.qty;
    } else {
      addMaterial[parseInt(idx)]["material_name_actual"] = null;
      addMaterial[parseInt(idx)]["material_type"] = null;
      addMaterial[parseInt(idx)]["unit"] = null;
      addMaterial[parseInt(idx)]["qty"] = null;
    }

    this.setState({ additional_material: addMaterial });
    return newValue;
  };

  render() {
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
                <span style={{ lineHeight: "2", fontSize: "15px" }}>
                  Detail Plant Spec Group
                </span>
                {this.state.tssrData !== null &&
                (this.state.tssrData.submission_status === "NOT SUBMITTED" ||
                  this.state.tssrData.submission_status ===
                    "PLANTSPEC UPDATED") ? (
                  <Button
                    style={{ marginRight: "8px", float: "right" }}
                    color="success"
                    onClick={this.submitTSSR}
                    size="sm"
                  >
                    Submit
                  </Button>
                ) : (
                  <Fragment></Fragment>
                )}
                {this.state.tssrData !== null &&
                this.state.tssrData.locked === false ? (
                  <Fragment>
                    <Button
                      style={{ marginRight: "8px", float: "right" }}
                      color="primary"
                      onClick={this.toggleUpload}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      style={{ marginRight: "8px", float: "right" }}
                      color="primary"
                      onClick={this.toggleUploadAdditional}
                      size="sm"
                    >
                      Edit Additional
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment></Fragment>
                )}
                <Dropdown
                  size="sm"
                  isOpen={this.state.dropdownOpen[0]}
                  toggle={() => {
                    this.toggleDropdown(0);
                  }}
                  style={{ float: "right", marginRight: "10px" }}
                >
                  <DropdownToggle caret color="secondary">
                    <i className="fa fa-download" aria-hidden="true">
                      {" "}
                      &nbsp;{" "}
                    </i>
                    Download File
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>TSSR File</DropdownItem>
                    <DropdownItem onClick={this.exportMaterialPSReportBundling}>
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>PS
                      Report Bundling ATP
                    </DropdownItem>
                    <DropdownItem onClick={this.exportMaterialPSReport}>
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      PlantSpec Report
                    </DropdownItem>
                    <DropdownItem onClick={this.downloadEPODFormat}>
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      EPOD Format
                    </DropdownItem>
                    <DropdownItem onClick={this.downloadMaterialTSSRUpload}>
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      PlantSpec Format
                    </DropdownItem>
                    <DropdownItem onClick={this.downloadMaterialTSSRUploadNOK}>
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      PlantSpec Format NOK
                    </DropdownItem>
                    <DropdownItem
                      onClick={this.downloadMaterialTSSRUploadAdditional}
                    >
                      {" "}
                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      Additional Material Format
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                {/* }<Button style={{marginRight : '8px', float : 'right', display: 'none'}} outline color="info" onClick={this.exportFormatTSSR} size="sm"><i className="fa fa-download" style={{marginRight: "8px"}}></i>Download PS Format</Button> */}
              </CardHeader>
              <Collapse isOpen={this.state.collapseUpload}>
                <Card style={{ margin: "10px 10px 5px 10px" }}>
                  <CardBody>
                    <div>
                      <Row>
                        <Col md="12">
                          {this.props.match.params.id !== undefined && (
                            <React.Fragment>
                              <div
                                style={{
                                  "align-items": "baseline",
                                  paddingTop: "10px",
                                }}
                              >
                                <input
                                  type="file"
                                  onChange={this.fileHandlerTSSR.bind(this)}
                                />
                                {this.state.rowsXLS.length === 0 ? (
                                  <Button
                                    style={{
                                      float: "right",
                                      marginLeft: "auto",
                                      order: "2",
                                    }}
                                    color="primary"
                                    onClick={this.saveUpdateMaterialWeb}
                                  >
                                    <i className="fa fa-paste">&nbsp;&nbsp;</i>
                                    Save Web
                                  </Button>
                                ) : (
                                  <React.Fragment>
                                    <Button
                                      style={{
                                        float: "right",
                                        marginLeft: "10px",
                                      }}
                                      size="sm"
                                      color="primary"
                                      onClick={this.saveUpdateMaterialWithID}
                                      disabled={this.state.rowsXLS.length === 0}
                                    >
                                      <i className="fa fa-paste">
                                        &nbsp;&nbsp;
                                      </i>
                                      Save using BAM ID
                                    </Button>
                                    <Button
                                      style={{ float: "right" }}
                                      size="sm"
                                      color="info"
                                      onClick={this.saveUpdateMaterial}
                                      disabled={this.state.rowsXLS.length === 0}
                                    >
                                      <i className="fa fa-paste">
                                        &nbsp;&nbsp;
                                      </i>
                                      Save
                                    </Button>
                                  </React.Fragment>
                                )}
                              </div>
                            </React.Fragment>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Collapse>
              <Collapse isOpen={this.state.collapseUploadAdditonal}>
                <Card style={{ margin: "10px 10px 5px 10px" }}>
                  <CardBody>
                    <div>
                      <Row>
                        <Col md="12">
                          {this.props.match.params.id !== undefined && (
                            <React.Fragment>
                              <div
                                style={{
                                  display: "flex",
                                  "align-items": "baseline",
                                }}
                              >
                                <input
                                  type="file"
                                  onChange={this.fileHandlerTSSR.bind(this)}
                                  style={{ padding: "10px" }}
                                />
                                <Button
                                  style={{
                                    float: "right",
                                    marginLeft: "auto",
                                    order: "2",
                                  }}
                                  color="primary"
                                  onClick={this.saveUpdateMaterialAdditonal}
                                  disabled={this.state.rowsXLS.length === 0}
                                >
                                  <i className="fa fa-save">&nbsp;&nbsp;</i>
                                  Save Additional
                                </Button>
                              </div>
                            </React.Fragment>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button
                      style={{ float: "left", marginLeft: "auto", order: "2" }}
                      color="danger"
                      size="sm"
                      onClick={this.toggleWarningDeleteAdditional}
                    >
                      <i className="fa fa-trash">&nbsp;&nbsp;</i>
                      Delete Additional Bundle
                    </Button>
                    <Button
                      style={{ float: "right", marginLeft: "auto", order: "2" }}
                      color="primary"
                      onClick={this.AdditionalForm}
                    >
                      <i className="fa fa-paste">&nbsp;&nbsp;</i>
                      Form
                    </Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody>
                {this.state.data_tssr !== null ? (
                  this.state.data_tssr.project_name === "" ||
                  this.state.data_tssr.project_name === null ? (
                    <table style={{ marginBottom: "20px" }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingTop: "10px", width: "150px" }}>
                            Project Name
                          </td>
                          <td
                            style={{ paddingTop: "10px", paddingRight: "10px" }}
                          >
                            :
                          </td>
                          <td>
                            <Input
                              style={{ marginTop: "10px" }}
                              name="project"
                              type="select"
                              onChange={this.handleChangeProject}
                              value={this.state.project_selected}
                            >
                              <option value={null}></option>
                              {this.state.list_project.map((project) => (
                                <option value={project._id}>
                                  {project.Project}
                                </option>
                              ))}
                            </Input>
                          </td>
                          <td
                            style={{ paddingTop: "10px", paddingLeft: "20px" }}
                          >
                            <Button
                              color="success"
                              size="sm"
                              onClick={this.saveProjecttoDB}
                            >
                              Save
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <Fragment></Fragment>
                  )
                ) : (
                  <Fragment></Fragment>
                )}
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
                        Plant Spec Group DETAIL
                      </td>
                    </tr>
                    {this.state.tssrData !== null && (
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
                            Plant Spec Group ID :{" "}
                            {this.state.tssrData.no_plantspec}
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
                            Project Name : {this.state.tssrData.project_name}
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
                            Tower ID :{" "}
                            {this.state.tssrData.site_info[0].site_id}
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
                            MR Related : {this.state.tssrData.mr_id}
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
                            Region : {this.state.data_tower.region}
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  </tbody>
                </table>
                <hr
                  style={{
                    borderStyle: "double",
                    borderWidth: "0px 0px 3px 0px",
                    borderColor: "rgba(59,134,134,1)",
                    marginTop: "5px",
                  }}
                ></hr>
                <Fragment>
                  <hr className="upload-line-ordering"></hr>
                  <Table responsive striped bordered size="sm">
                    <thead>
                      <tr style={{ fontSize: "10.5px" }}>
                        <th>PS No</th>
                        <th>CD ID</th>
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
                      {this.state.tssrData !== null ? (
                        this.state.tssrData.site_info.map((site) => (
                          <tr style={{ fontSize: "10.5px" }}>
                            <td>{site.no_tssr_boq_site}</td>
                            {this.tableWBSPlantSpect(site)}
                          </tr>
                        ))
                      ) : (
                        <Fragment></Fragment>
                      )}
                    </tbody>
                  </Table>
                  <hr className="upload-line-ordering"></hr>
                  <div className="divtable2">
                    <Table hover bordered striped responsive size="sm">
                      <thead
                        style={{ backgroundColor: "#0B486B", color: "white" }}
                      >
                        <tr>
                          <th
                            rowSpan="2"
                            className="fixedhead"
                            style={{ width: "200px", verticalAlign: "middle" }}
                          >
                            PS No. (Program) / Source Material
                          </th>
                          <th
                            rowSpan="2"
                            className="fixedhead"
                            style={{ width: "200px", verticalAlign: "middle" }}
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
                            UOM
                          </th>
                          <th
                            colSpan="3"
                            className="fixedhead"
                            style={{ width: "100px", verticalAlign: "middle" }}
                          >
                            Total Qty per PP
                          </th>
                          <th
                            rowSpan="2"
                            className="fixedhead"
                            style={{ width: "100px", verticalAlign: "middle" }}
                          >
                            Config ID / Availability
                          </th>
                        </tr>
                        <tr>
                          <th
                            className="fixedhead"
                            style={{ width: "100px", verticalAlign: "middle" }}
                          >
                            Qty PS
                          </th>
                          <th
                            className="fixedhead"
                            style={{ width: "100px", verticalAlign: "middle" }}
                          >
                            Material in Warehouse
                          </th>
                          <th
                            className="fixedhead"
                            style={{ width: "100px", verticalAlign: "middle" }}
                          >
                            Material Plan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.tssrData !== null &&
                          Array.isArray(this.state.tssrData.packages) &&
                          this.state.tssrData.packages
                            .filter(
                              (e) =>
                                e.product_type.toLowerCase() !== "svc" &&
                                e.product_type.toLowerCase() !== "hwac" &&
                                e.product_type.toLowerCase() !== "sw"
                            )
                            .map((pp, arr_pp) => (
                              <Fragment>
                                <tr
                                  key={arr_pp}
                                  style={{ backgroundColor: "#E5FCC2" }}
                                  className="fixbody"
                                >
                                  <td style={{ textAlign: "left" }}>
                                    {pp.no_tssr_boq_site +
                                      " (" +
                                      pp.program +
                                      ")"}
                                  </td>
                                  <td style={{ textAlign: "left" }}>
                                    {pp.pp_id}
                                  </td>
                                  <td>{pp.product_name}</td>
                                  <td>{pp.program}</td>
                                  <td>{pp.uom}</td>
                                  <td align="center">{pp.qty.toFixed(2)}</td>
                                  <td align="center"></td>
                                  <td align="center"></td>
                                  <td align="center">{pp.config_id}</td>
                                </tr>
                                {pp.materials.map((material, arr_mat) => (
                                  <tr
                                    key={arr_mat}
                                    style={{
                                      backgroundColor: "rgba(248,246,223, 0.5)",
                                    }}
                                    className="fixbody"
                                  >
                                    <td>{material.source_material}</td>
                                    <td style={{ textAlign: "right" }}>
                                      {material.material_id}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      {material.material_name}
                                    </td>
                                    <td style={{ textAlign: "left" }}></td>
                                    <td>{material.uom}</td>
                                    <td key={arr_mat} align="center">
                                      {this.state.collapseUpload === true ? (
                                        <Input
                                          type="number"
                                          min="0"
                                          defaultValue={material.qty.toFixed(2)}
                                          onChange={(e) => {
                                            this.handleChangeQTY(
                                              e,
                                              material._id,
                                              pp._id
                                            );
                                          }}
                                        />
                                      ) : (
                                        material.qty
                                      )}
                                    </td>
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
                                  </tr>
                                ))}
                              </Fragment>
                            ))}
                      </tbody>
                    </Table>
                  </div>
                </Fragment>
              </CardBody>
              <CardFooter>
                {this.state.tssrData !== null &&
                  this.state.tssrData.mr_id === null && (
                    <Button
                      style={{ float: "left", marginLeft: "auto", order: "2" }}
                      color="danger"
                      size="sm"
                      onClick={this.deletePS}
                    >
                      <i className="fa fa-trash">&nbsp;&nbsp;</i>
                      Delete Plant Spec
                    </Button>
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
          <ModalFooter></ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Additional Material */}
        <Modal
          isOpen={this.state.modalAdditionalForm}
          toggle={this.toggleAdditionalForm}
          className={"modal-xl " + this.props.className}
        >
          <ModalHeader>
            <div>
              <span>Form Additional Material</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Material ID</th>
                      <th>Material Name</th>
                      <th>Type</th>
                      <th>UoM</th>
                      <th>Qty</th>
                      <th>Source Material</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.additional_material.map((add, i) => (
                      <tr>
                        <td>
                          <Select
                            cacheOptions
                            value={{
                              value: add.material_id_actual,
                              label: add.material_id_actual,
                            }}
                            options={this.state.material_additional_data}
                            // defaultOptions
                            onChange={this.onChangeMaterialAdditionalSearch}
                            name={"material_id_actual" + " /// " + i}
                            menuPosition={"fixed"}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={"material_name_actual" + " /// " + i}
                            value={add.material_name_actual}
                            onChange={this.onChangeMaterialAdditional}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={"material_type" + " /// " + i}
                            value={add.material_type}
                            onChange={this.onChangeMaterialAdditional}
                            style={{ width: "150px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={"unit" + " /// " + i}
                            value={add.unit}
                            onChange={this.onChangeMaterialAdditional}
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name={"qty" + " /// " + i}
                            value={add.qty}
                            onChange={this.onChangeMaterialAdditional}
                            style={{ width: "75px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="string"
                            name={"source_material" + " /// " + i}
                            value={add.source_material}
                            onChange={this.onChangeMaterialAdditional}
                          />
                        </td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={(e) => this.deleteMaterialAdditional(i)}
                          >
                            <span className="fa fa-times"></span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <Button
                    style={{ float: "left", margin: "15px" }}
                    color="info"
                    size="sm"
                    onClick={this.addMaterialAdditional}
                  >
                    Add Material
                  </Button>
                </Table>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="warning"
              size="sm"
              onClick={this.toggleAdditionalForm}
            >
              Cancel
            </Button>
            <Button color="success" size="sm" onClick={this.saveAdditional}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal Additional Material*/}

        {/* Modal confirmation Delete */}
        <ModalDelete
          isOpen={this.state.modal_delete_warning}
          toggle={this.toggleWarningDeleteAdditional}
          className={"modal-danger " + this.props.className}
          title={"Delete All Additional Material"}
          body={
            "This action will delete all additional material and its bundle in this PS. Are you sure ?"
          }
        >
          <Button
            color="danger"
            onClick={this.deleteAdditionalMaterialAll}
            value="save"
          >
            Yes
          </Button>
          <Button
            color="secondary"
            onClick={this.toggleWarningDeleteAdditional}
          >
            Cancel
          </Button>
        </ModalDelete>
        {/* Modal confirmation Delete */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(DetailTssr);
