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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";
import "./boqTechnical.css";
import { saveAs } from "file-saver";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import Excel from "exceljs";
import Select from "react-select";
import { Redirect, Link } from "react-router-dom";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import jsonData from "./TechnicalNewFormat.js";

import ModalDelete from "../components/ModalDelete";
import { convertDateFormatfull } from "../../helper/basicFunction";

const API_EMAIL =
  "https://prod-37.westeurope.logic.azure.com:443/workflows/7700be82ef7b4bdab6eb986e970e2fc8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wndx4N_qNLEZ9fpCR73BBR-5T1QHjx7xxshdyrvJ20c";
const API_URL = "https://api-dev.smart.pdb.e-dpm.com/smartapi";
const usernamePhilApi = "pdbdash";
const passwordPhilApi = "rtkO6EZLkxL1";

const API_URL_BAM = "https://api-dev.bam-id.e-dpm.com/bamidapi";
const usernameBAM = "bamidadmin@e-dpm.com";
const passwordBAM = "F760qbAg2sml";

const API_URL_TSEL = "https://api-dev.tsel.pdb.e-dpm.com/tselpdbapi";
const usernameTsel = "adminbamidsuper";
const passwordTsel = "F760qbAg2sml";

const API_URL_XL = "https://api-dev.xl.pdb.e-dpm.com/xlpdbapi";
const usernameXL = "adminbamidsuper";
const passwordXL = "F760qbAg2sml";

// const Config_group_type_DEFAULT = ["General Info", "General Info", "General Info", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "SERVICE", "SERVICE", "SERVICE", "SERVICE", "SERVICE", "SERVICE", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME"]
//
// const Config_group_DEFAULT = ["TowerID", "Program Name", "SOW", "Config Cabinet", "qty", "Config Add L9", "qty", "Config Add L10", "qty", "Config Add L18", "qty", "Config Add L21", "qty", "Config BB 5212 (Reuse)", "qty", "Config UPG BW 1800", "qty", "Swapped Module/BB", "qty", "Config UPG BW 2100", "qty", "Config Radio B0 MIMO 2T2R", "qty", "Config Kit Radio B1 MIMO 2T2R", "qty", "Config Radio B1 MIMO 2T2R", "qty", "Config Kit Radio B3 MIMO 2T2R", "qty", "Config Radio B3 MIMO 2T2R", "qty", "Config Radio B1 MIMO 4T4R", "qty", "Config Radio B3 MIMO 4T4R", "qty", "Config Radio B1 + B3 DUAL BAND 2T2R", "qty", "Config Radio B1 + B3 DUAL BAND 4T4R", "qty", "Config Multi Sector", "qty", "Config Antenna", "qty", "Config Service 1", "qty", "Config Service 2", "qty", "Config Service 3", "qty", "Material 1 Power", "qty 1", "Material 2 Power", "qty 2", "Material 3 Power", "qty 3", "Material 4 Power", "qty 4", "Material 5 Power", "qty 5", "Service 1 Power Qty 1", "Service 2 Power", "qty 2", "Service 3 Power Qty 3", "Material 1 CME", "qty 1", "Material 2 CME", "qty 2", "Material 3 CME", "qty 3", "Material 4 CME", "qty 4", "Material 5 CME", "qty 5", "Service 1 CME", "SAP Number 1", "qty 1", "Service 2 CME", "SAP Number 2", "qty 2", "Service 3 CME", "SAP Number 3", "qty 3"];

const Config_group_type_DEFAULT = [
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "HW",
  "SERVICE",
  "SERVICE",
  "SERVICE",
  "POWER",
  "POWER",
  "POWER",
  "POWER",
  "POWER",
  "POWER",
  "POWER",
  "POWER",
  "CME",
  "CME",
  "CME",
  "CME",
  "CME",
  "CME",
  "CME",
  "CME",
];

const Config_group_DEFAULT = [
  "Config Cabinet",
  "Config Add L9",
  "Config Add L10",
  "Config Add L18",
  "Config Add L21",
  "Config BB 5212 (Reuse)",
  "Config UPG BW 1800",
  "Swapped Module/BB",
  "Config UPG BW 2100",
  "Config Radio B0 MIMO 2T2R",
  "Config Kit Radio B1 MIMO 2T2R",
  "Config Radio B1 MIMO 2T2R",
  "Config Kit Radio B3 MIMO 2T2R",
  "Config Radio B3 MIMO 2T2R",
  "Config Radio B1 MIMO 4T4R",
  "Config Radio B3 MIMO 4T4R",
  "Config Radio B1 + B3 DUAL BAND 2T2R",
  "Config Radio B1 + B3 DUAL BAND 4T4R",
  "Config Multi Sector",
  "Config Antenna",
  "Config Service 2",
  "Config Service 3",
  "Config Service 4",
  "Material 1 Power",
  "Material 2 Power",
  "Material 3 Power",
  "Material 4 Power",
  "Material 5 Power",
  "Service 1 Power",
  "Service 2 Power",
  "Service 3 Power",
  "Material 1 CME",
  "Material 2 CME",
  "Material 3 CME",
  "Material 4 CME",
  "Material 5 CME",
  "Service 1 CME",
  "Service 2 CME",
  "Service 3 CME",
];

class TableTechnicalConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  getTechnicalRow(site_data_config, config_group, config_group_type) {
    const dataConfigIdx = site_data_config.find(
      (e) =>
        e.config_group === config_group &&
        e.config_group_type === config_group_type
    );
    if (dataConfigIdx !== undefined) {
      return (
        <Fragment>
          <td>{dataConfigIdx.config_id}</td>
          <td>{dataConfigIdx.qty}</td>
          <td>{dataConfigIdx.qty_commercial}</td>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <td></td>
          <td></td>
          <td></td>
        </Fragment>
      );
    }
  }

  render() {
    return (
      <Table hover bordered striped responsive size="sm">
        <thead>
          <tr>
            <th rowSpan="2" style={{ verticalAlign: "middle" }}>
              Tower ID
            </th>
            <th rowSpan="2" style={{ verticalAlign: "middle" }}>
              Program
            </th>
            <th rowSpan="2" style={{ verticalAlign: "middle" }}>
              SOW
            </th>
            <th rowSpan="2" style={{ verticalAlign: "middle" }}>
              SOW Code
            </th>
            <th rowSpan="2" style={{ verticalAlign: "middle" }}>
              Priority
            </th>
            {this.props.configHeader.config_group_type_header.map((type) => (
              <Fragment>
                <th>{type}</th>
                <th>{type}</th>
                <th>{type}</th>
              </Fragment>
            ))}
          </tr>
          <tr>
            {this.props.configHeader.config_group_header.map((conf) => (
              <Fragment>
                <th>{conf}</th>
                <th>Qty</th>
                <th>Qty Comm</th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.dataTechBoqSites.map((site) => (
            <tr>
              <td>{site.site_id}</td>
              <td>{site.program}</td>
              <td>{site.sow}</td>
              <td>{site.sow_code}</td>
              <td>{site.priority}</td>
              {this.props.isVersion === "rollback"
                ? this.props.configHeader.config_group_header.map((conf, i) =>
                    this.getTechnicalRow(
                      site.siteItemConfigVersion,
                      conf,
                      this.props.configHeader.config_group_type_header[i]
                    )
                  )
                : this.props.configHeader.config_group_header.map((conf, i) =>
                    this.getTechnicalRow(
                      site.siteItemConfig,
                      conf,
                      this.props.configHeader.config_group_type_header[i]
                    )
                  )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

class TechnicalBoq extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity_list: [],
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      rowsTech: [],
      result_check_tech: null,
      data_tech_boq: null,
      data_tech_boq_sites: [],
      data_tech_boq_sites_version: [],
      data_tech_boq_sites_pagination: [],
      view_tech_header_table: {
        config_group_header: [],
        config_group_type_header: [],
      },
      view_tech_all_header_table: {
        config_group_header: [],
        config_group_type_header: [],
      },
      list_version: [],
      pp_all: [],
      sites_all: [],
      API_Tech: [],
      API_Tech_prev: null,
      API_Tech_Sites: [],
      dataPackage: [],
      action_status: null,
      action_message: "",
      checkedItems: new Map(),
      rowsTech: [],
      Package_Header: [],
      data_item: [],
      data_item_pagination: [],
      waiting_status: null,
      project_name: [],
      data_format: [],
      data_format_rev: [],
      current_rev: null,
      select_rev: null,
      modal_loading: false,
      version_now: null,
      version_selected: null,
      collapse: false,
      dropdownOpen: new Array(2).fill(false),
      redirectSign: false,
      noteChange: new Array(8).fill(null),
      fieldNoteChange: new Array(8).fill(null),
      perPage: 25,
      prevPage: 1,
      activePage: 1,
      opportunity_id: null,
      note_version: null,
      list_commercial_tech: [],
      summaryQTYTech: [],
      project_all: [],
      project_select: null,
      project_name_selected: null,
      progress_count: null,
      progress_data: 0,
      progress_count: 0,
      progress_failed: 0,
      option_tssr_header_view: "only_filled",
      update_qty_for: "new",
      update_type: "revision",
      modal_update_info: false,
      loading_checking: null,
      format_uploader: null,
      save_confirmation: false,
      revise_confirmation: false,
      selected_id: "",
      selected_version: null,
    };
    this.toggleUpdateInfo = this.toggleUpdateInfo.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.saveTechBoq = this.saveTechBoq.bind(this);
    this.updateTechBoq = this.updateTechBoq.bind(this);
    this.approvedBoqTech = this.approvedBoqTech.bind(this);
    this.overwriteDataSites = this.overwriteDataSites.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.handleChangeVersion = this.handleChangeVersion.bind(this);
    this.handleChangeNote = this.handleChangeNote.bind(this);
    this.handleChangeFieldNote = this.handleChangeFieldNote.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleChangeShow = this.handleChangeShow.bind(this);
    this.handleChangeOpportunity = this.handleChangeOpportunity.bind(this);
    this.saveOpportunityNote = this.saveOpportunityNote.bind(this);
    this.handleChangeVerComment = this.handleChangeVerComment.bind(this);
    this.saveProjecttoDB = this.saveProjecttoDB.bind(this);
    this.exportFormatTechnical = this.exportFormatTechnical.bind(this);
    this.exportFormatTechnicalCommercial =
      this.exportFormatTechnicalCommercial.bind(this);
    this.exportFormatTechnicalNew = this.exportFormatTechnicalNew.bind(this);
    this.exportFormatTechnicalHorizontal =
      this.exportFormatTechnicalHorizontal.bind(this);
    this.exportFormatTechnicalVertical =
      this.exportFormatTechnicalVertical.bind(this);
    this.approvalTechnical = this.approvalTechnical.bind(this);
    this.submitTSSR = this.submitTSSR.bind(this);
    this.handleChangeOptionView = this.handleChangeOptionView.bind(this);
    this.handleChangeFormatUploader =
      this.handleChangeFormatUploader.bind(this);
    this.toggleSave = this.toggleSave.bind(this);
    this.toggleRevised = this.toggleRevised.bind(this);
  }

  numberToAlphabet(number) {
    const num = Number(number) + 1;
    if (num > 26) {
      let mod = ((num % 26) + 9).toString(36).toUpperCase();
      return "Z" + mod;
    } else {
      return (num + 9).toString(36).toUpperCase();
    }
  }

  toggleSave(e) {
    const modalDelete = this.state.save_confirmation;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      // const name = e.currentTarget.name;
      this.setState({
        save_confirmation: !this.state.save_confirmation,
        selected_id: this.state.data_tech_boq.no_tech_boq,
      });
    } else {
      this.setState({
        save_confirmation: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  }

  toggleRevised(e) {
    const modalDelete = this.state.revise_confirmation;
    if (modalDelete === false) {
      // const name = e.currentTarget.name;
      this.setState({
        revise_confirmation: !this.state.revise_confirmation,
        selected_id: this.state.data_tech_boq.no_tech_boq,
        selected_version: parseInt(this.state.data_tech_boq.version) + 1,
      });
    } else {
      this.setState({
        revise_confirmation: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  }

  toggleUpload(e) {
    if (e !== undefined) {
      if (e.target !== undefined) {
        if (e.target.value !== undefined) {
          this.setState({ update_qty_for: e.target.value });
        }
      }
    }
    console.log();
    this.setState({ collapse: !this.state.collapse });
  }

  toggleDropdown(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  onEntering() {
    this.setState({ status: "Opening..." });
  }

  onEntered() {
    this.setState({ status: "Opened" });
  }

  onExiting() {
    this.setState({ status: "Closing..." });
  }

  onExited() {
    this.setState({ status: "Closed" });
  }

  toggleUpdateInfo(e) {
    const value = e.currentTarget.value;
    this.setState({ update_type: value });
    this.setState((prevState) => ({
      modal_update_info: !prevState.modal_update_info,
    }));
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

  async getDataFromAPITSEL(url) {
    try {
      let respond = await axios.get(API_URL_TSEL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameTsel,
          password: passwordTsel,
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

  async getDataFromAPIXL(url) {
    try {
      let respond = await axios.get(API_URL_XL + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameXL,
          password: passwordXL,
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

  async getDatafromAPI(url) {
    try {
      let respond = await axios.get(API_URL + url, {
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
      let respond = undefined;
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Get Data", err);
      return respond;
    }
  }

  async postDatatoAPI(url, data) {
    try {
      let respond = await axios.post(API_URL + url, data, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      // if(this.state.modal_loading === true){
      //   this.toggleLoading();
      // }
      let respond = undefined;
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Post Data", err);
      return respond;
    }
  }

  async patchDatatoAPI(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL + url, data, {
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
      let respond = undefined;
      this.setState({
        action_status: "failed",
        action_message:
          "Sorry, There is something error, please refresh page and try again",
      });
      console.log("respond Patch data", err);
      return respond;
    }
  }

  async apiSendEmail(data) {
    try {
      let respond = await axios.post(API_EMAIL, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      this.setState({
        action_status: "failed",
        action_message: "Sorry, There is something error, please try again",
      });
      console.log("respond Patch data", err);
      return respond;
    }
  }

  getTechBoqData(_id_tech) {
    this.getDataFromAPINODE("/techBoq/" + _id_tech).then((res) => {
      if (res.data !== undefined) {
        const dataTech = res.data;
        this.setState({ data_tech_boq: dataTech.data });
        if (res.data.data !== undefined) {
          this.setState(
            {
              data_tech_boq_sites: dataTech.data.techBoqSite,
              list_version: new Array(parseInt(dataTech.data.version) + 1).fill(
                "0"
              ),
            },
            () => {
              this.viewTechBoqData(dataTech.data.techBoqSite);
            }
          );
        }
      }
    });
  }

  viewTechBoqData(data_sites) {
    if (data_sites.length !== 0) {
      const configId = data_sites[0].siteItemConfig.map((e) => e.config_id);
      const typeHeader = data_sites[0].siteItemConfig.map((e) => "CONFIG");
      let all_config = data_sites
        .map((value) => value.siteItemConfig.map((child) => child))
        .reduce((l, n) => l.concat(n), []);
      let config_group_avail_uniq = [
        ...new Set(all_config.map(({ config_group }) => config_group)),
      ];
      let config_group_non_default = [];
      let config_group_type_avail = [];
      let config_group_type_non_default = [];
      for (let i = 0; i < config_group_avail_uniq.length; i++) {
        let findConfigGroupType = all_config.find(
          (e) => e.config_group === config_group_avail_uniq[i]
        ).config_group_type;
        config_group_type_avail.push(findConfigGroupType);
        if (
          Config_group_DEFAULT.includes(config_group_avail_uniq[i]) !== true
        ) {
          config_group_non_default.push(config_group_avail_uniq[i]);
          config_group_type_non_default.push(findConfigGroupType);
        }
      }
      let config_group_all = Config_group_DEFAULT.concat(
        config_group_non_default
      );
      let config_group_type_all = Config_group_type_DEFAULT.concat(
        config_group_type_non_default
      );

      this.setState(
        {
          view_tech_header_table: {
            config_group_header: config_group_avail_uniq,
            config_group_type_header: config_group_type_avail,
          },
          view_tech_all_header_table: {
            config_group_header: config_group_all,
            config_group_type_header: config_group_type_all,
          },
        },
        () => {
          this.dataViewPagination(data_sites);
        }
      );
    }
  }

  headerTechBoqDataNote(data_sites) {
    const dataNote = data_sites
      .map((e) => e.notes)
      .reduce((l, n) => l.concat(n), []);
    const headerNoteUniq = [
      ...new Set(dataNote.map(({ note_name }) => note_name)),
    ];
    return headerNoteUniq;
  }

  async updateTechBoq(e) {
    let revisionType = e.currentTarget.value;
    let revision = true;
    if (revisionType === "save") {
      revision = false;
    }
    if (this.state.modal_update_info === true) {
      this.setState({ modal_update_info: false });
    }
    this.toggleLoading();
    const dataChecked = this.state.result_check_tech;
    const dataPatch = {
      revision: revision,
      sites_data: dataChecked.tech_data,
      configList: dataChecked.configList,
    };
    if (this.state.update_qty_for.toLowerCase() === "commercial") {
      dataPatch["updateQtyCommercial"] = true;
    }
    let patchTech = await this.patchDatatoAPINODE(
      "/techBoq/updateTechBoqData/" + this.state.data_tech_boq._id,
      dataPatch
    );
    if (patchTech.data !== undefined) {
      this.setState({ action_status: "success" });
    } else {
      if (patchTech.response !== undefined) {
        if (patchTech.response.data !== undefined) {
          if (patchTech.response.data.error !== undefined) {
            if (patchTech.response.data.error.message !== undefined) {
              this.setState(
                {
                  action_status: "failed",
                  action_message: patchTech.response.data.error.message,
                },
                () => {}
              );
            } else {
              this.setState(
                {
                  action_status: "failed",
                  action_message: patchTech.response.data.error,
                },
                () => {}
              );
            }
          } else {
            this.setState({ action_status: "failed" }, () => {});
          }
        } else {
          this.setState({ action_status: "failed" }, () => {});
        }
      } else {
        this.setState({ action_status: "failed" }, () => {});
      }
    }
    this.toggleLoading();
    if (revisionType === "save") {
      this.toggleSave();
    } else {
      this.toggleRevised();
    }
  }

  handleChangeVersion(e) {
    const value = e.target.value;
    this.setState({ version_selected: value }, () => {
      if (value !== this.state.data_tech_boq.version) {
        this.getVersionTechBoqData(this.props.match.params.id, value);
      } else {
        this.getTechBoqData(this.props.match.params.id);
      }
    });
  }

  getVersionTechBoqData(_id_tech, ver) {
    console.log();
    this.getDataFromAPINODE("/techBoq/" + _id_tech + "/ver/" + ver).then(
      (res) => {
        if (res.data !== undefined) {
          const dataTech = res.data;
          if (res.data.data !== undefined) {
            this.setState(
              { data_tech_boq_sites_version: dataTech.data.techBoqSiteVersion },
              () => {
                this.viewTechBoqDataVersion(dataTech.data.techBoqSiteVersion);
              }
            );
          }
        }
      }
    );
  }

  viewTechBoqDataVersion(data_sites) {
    if (data_sites.length !== 0) {
      const configId = data_sites[0].siteItemConfigVersion.map(
        (e) => e.config_id
      );
      const typeHeader = data_sites[0].siteItemConfigVersion.map(
        (e) => "Config"
      );
      let all_config = data_sites
        .map((value) => value.siteItemConfigVersion.map((child) => child))
        .reduce((l, n) => l.concat(n), []);
      console.log("config_group_avail_uniq", all_config);
      let config_group_avail_uniq = [
        ...new Set(all_config.map(({ config_group }) => config_group)),
      ];
      let config_group_non_default = [];
      let config_group_type_avail = [];
      let config_group_type_non_default = [];
      for (let i = 0; i < config_group_avail_uniq.length; i++) {
        let findConfigGroupType = all_config.find(
          (e) => e.config_group === config_group_avail_uniq[i]
        ).config_group_type;
        config_group_type_avail.push(findConfigGroupType);
        if (
          Config_group_DEFAULT.includes(config_group_avail_uniq[i]) !== true
        ) {
          config_group_non_default.push(config_group_avail_uniq[i]);
          config_group_type_non_default.push(findConfigGroupType);
        }
      }
      let config_group_all = Config_group_DEFAULT.concat(
        config_group_non_default
      );
      let config_group_type_all = Config_group_type_DEFAULT.concat(
        config_group_type_non_default
      );
      console.log("config_group_avail_uniq", config_group_avail_uniq);
      this.setState({
        view_tech_header_table: {
          config_group_header: config_group_avail_uniq,
          config_group_type_header: config_group_type_avail,
        },
        view_tech_all_header_table: {
          config_group_header: config_group_all,
          config_group_type_header: config_group_type_all,
        },
      });
    }
  }

  getProjectAll() {
    this.getDataFromAPIXL(
      '/project_sorted_non_page?where={"BOQ_Project" : true}'
    ).then((resp) => {
      if (resp !== undefined) {
        this.setState({ project_all: resp.data._items });
      }
    });
  }

  selectProject(e) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    this.setState({ project_select: value, project_name_selected: text });
  }

  async approvalTechnical(e) {
    let currValue = e.currentTarget.value;
    if (currValue !== undefined) {
      currValue = parseInt(currValue);
    }
    let patchData = await this.patchDatatoAPINODE(
      "/techBoq/approval/" + this.state.data_tech_boq._id,
      { operation: currValue }
    );
    if (patchData.data !== undefined) {
      this.setState({ action_status: "success" });
    } else {
      if (patchData.response !== undefined) {
        if (patchData.response.data !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(patchData.response.data.error),
          });
        } else {
          this.setState({ action_status: "failed" });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  async submitTSSR(e) {
    this.toggleLoading();
    let currValue = e.currentTarget.value;
    if (currValue !== undefined) {
      currValue = parseInt(currValue);
    }
    let patchData = await this.postDatatoAPINODE(
      "/tssr/createTssr/" + this.state.data_tech_boq._id
    );
    if (patchData.data !== undefined) {
      this.setState({ action_status: "success" });
    } else {
      if (patchData.response !== undefined) {
        if (patchData.response.data !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: JSON.stringify(patchData.response.data.error),
          });
        } else {
          this.setState({ action_status: "failed" });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  }

  getBOQTechAPI(_id_Tech) {
    this.setState({});
    let url =
      "/boq_tech_audit/" +
      _id_Tech +
      '?embedded={"created_by" : 1, "updated_by" : 1, "list_of_id_site" : 1}';
    if (_id_Tech == undefined) {
      url =
        '/boq_tech_audit?embedded={"created_by" : 1, "updated_by" : 1, "list_of_id_site" : 1}';
    }
    this.getDatafromAPI(url).then((res) => {
      if (res !== undefined) {
        if (res.data.list_of_id_site !== undefined) {
          this.setState({ API_Tech: res.data });
          this.getCommTechAPI(_id_Tech);
          this.setState(
            { API_Tech_Sites: res.data.list_of_id_site, data_item: [] },
            () => {
              this.viewTech(this.state.API_Tech_Sites);
            }
          );

          if (res.data.list_of_id_site.length === 0) {
            this.setState({ action_status: "failed" });
          }
          // this.getSitesTechDataAPI(res.data.list_of_id_site);
          this.setState({
            version_now: res.data.version,
            version_selected: res.data.version,
          });
          this.getListVersion(_id_Tech);
        } else {
          this.setState({ action_status: "failed" });
        }
      }
    });
  }

  saveProjecttoDB() {
    const dataTech = this.state.API_Tech;
    const data_Project = {
      id_project_doc: this.state.project_select,
      project_name: this.state.project_name_selected,
    };
    this.patchDatatoAPI(
      "/boq_tech_op/" + dataTech._id,
      data_Project,
      dataTech._etag
    ).then((res) => {
      if (res !== undefined) {
        if (res.data !== undefined) {
          this.setState(
            {
              action_message: "Your project have been assign to Technical BOQ ",
              action_status: "success",
            },
            () => {
              setTimeout(function () {
                window.location.reload();
              }, 3000);
            }
          );
        }
      }
    });
  }

  getCommTechAPI(_id_Tech) {
    let url =
      "/boq_tech_audit/" +
      _id_Tech +
      '?embedded={"list_of_id_boq_comm" : 1}&projection={"list_of_id_boq_comm" : 1}';
    this.getDatafromAPI(url).then((res) => {
      if (res !== undefined) {
        if (res.data !== undefined) {
          this.setState(
            { list_commercial_tech: res.data.list_of_id_boq_comm },
            () => {
              console.log(
                "list_commercial_tech",
                this.state.list_commercial_tech
              );
            }
          );
        }
      }
    });
  }

  async getAllSites(array_sites) {
    let dataSites = [];
    let arrayDataSites = array_sites;
    let getNumberPage = Math.ceil(arrayDataSites.length / 25);
    for (let i = 0; i < getNumberPage; i++) {
      let DataPaginationSites = arrayDataSites.slice(i * 25, (i + 1) * 25);
      let arrayIdSites = '"' + DataPaginationSites.join('", "') + '"';
      arrayIdSites = arrayIdSites.replace("&", "%26");
      let where_id_Sites =
        '&where={"site_id" : {"$in" : [' + arrayIdSites + "]}}";
      let resSites = await this.getDatafromAPI(
        '/site_non_page?projection={"site_id" : 1, "site_name" : 1, "_id" : 1}' +
          where_id_Sites
      );
      if (resSites !== undefined) {
        if (resSites.data !== undefined) {
          dataSites = dataSites.concat(resSites.data._items);
        }
      }
    }
    return dataSites;
  }

  getSitesTechDataAPI(id_Sites) {
    const arraySites = '"' + id_Sites.join('", "') + '"';
    const where_id_Sites = 'where={"_id" : {"$in" : [' + arraySites + "]}}";
    this.getDatafromAPI("/boq_tech_sites_non_page?" + where_id_Sites).then(
      (res) => {
        this.setState(
          { API_Tech_Sites: res.data._items, data_item: [] },
          () => {
            this.viewTech(this.state.API_Tech_Sites);
          }
        );
      }
    );
  }

  checkValue(props) {
    //Swap undefined to null
    if (typeof props == "undefined") {
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

  comparerDiffSites(otherArray) {
    //Compare Different between 2 array
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other.site_id == current.site_id;
        }).length == 0
      );
    };
  }

  isSameValue(element, value) {
    //function for FindIndex
    return element === value;
  }

  getIndex(data, value) {
    //get index of value in Array
    return data.findIndex((e) => this.isSameValue(e, value));
  }

  componentDidMount() {
    // this.getAllSites();
    if (this.props.match.params.id === undefined) {
      this.getProjectAll();
    } else {
      // this.setState({data_tech_boq : jsonData.data, data_tech_boq_sites : jsonData.data.techBoqSite}, () => {
      //   this.viewTechBoqData(jsonData.data.techBoqSite);
      // });
      this.getTechBoqData(this.props.match.params.id);
    }
    console.log(this.state.version_selected);
  }

  fileHandlerTechnical = (event) => {
    this.setState({ loading_checking: "Checking" });
    this.setState({ waiting_status: "loading" });
    let fileObj = event.target.files[0];
    const date = new Date();
    const DateNow =
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
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          this.setState({ loading_checking: null });
          console.log(err);
        } else {
          this.setState({
            action_status: null,
            action_message: "",
            data_format: [],
          });
          this.ArrayEmptytoNull(rest.rows, DateNow);
        }
      });
    }
  };

  ArrayEmptytoNull(dataXLS, DateNow) {
    let newDataXLS = [];
    for (let i = 0; i < dataXLS.length; i++) {
      let col = [];
      for (let j = 0; j < dataXLS[1].length; j++) {
        col.push(this.checkValue(dataXLS[i][j]));
      }
      newDataXLS.push(col);
    }
    this.setState({
      rowsTech: newDataXLS,
    });
    this.checkingFormatTech(newDataXLS);
  }

  async checkingFormatTech(rowsTech) {
    this.toggleLoading();
    let dataCheck = {
      techBoqData: rowsTech,
    };
    if (this.state.update_qty_for.toLowerCase() === "commercial") {
      dataCheck["updateQtyCommercial"] = true;
    }
    if (this.state.update_qty_for.toLowerCase() === "delivery") {
      dataCheck["updateQtyDelivery"] = true;
    }
    let urlCheck = "/techBoq/checkTechBoqDataXL";
    if (this.state.format_uploader === "Vertical") {
      urlCheck = "/techBoq/checkTechBoqDataXLVertical";
    }
    let postCheck = await this.postDatatoAPINODE(urlCheck, dataCheck);
    if (postCheck.data !== undefined) {
      const dataCheck = postCheck.data;
      let siteNew = [];
      const listSites = dataCheck.tech_data.map((e) => e.site_info);
      for (let i = 0; i < listSites.length; i++) {
        if (listSites[i].new_site === true) {
          siteNew.push(listSites[i].site_id);
        }
      }
      if (siteNew.length !== 0) {
        this.setState({
          action_status: "failed",
          action_message:
            "[ " +
            siteNew.join(", ") +
            " ] => Not available, please create this sites in PDB",
        });
        this.toggleLoading();
      } else {
        this.setState({ result_check_tech: dataCheck });
        this.toggleLoading();
      }
    } else {
      if (postCheck.response !== undefined) {
        if (postCheck.response.data !== undefined) {
          if (postCheck.response.data.error !== undefined) {
            if (postCheck.response.data.error.message !== undefined) {
              this.setState(
                {
                  action_status: "failed",
                  action_message: postCheck.response.data.error.message,
                },
                () => {
                  this.toggleLoading();
                }
              );
            } else {
              this.setState(
                {
                  action_status: "failed",
                  action_message: postCheck.response.data.error,
                },
                () => {
                  this.toggleLoading();
                }
              );
            }
          } else {
            this.setState({ action_status: "failed" }, () => {
              this.toggleLoading();
            });
          }
        } else {
          this.setState({ action_status: "failed" }, () => {
            this.toggleLoading();
          });
        }
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    }
    this.setState({ loading_checking: null });
  }

  handleChangeFormatUploader = (e) => {
    let format = e.target.value;
    this.setState({ format_uploader: format });
  };

  saveTechBoq = async () => {
    this.toggleLoading();
    const dataChecked = this.state.result_check_tech;
    const projectData = {
      id_project_doc: this.state.project_select,
      project_name: this.state.project_name_selected,
    };
    const dataPost = {
      tech_boq_info: projectData,
      sites_data: dataChecked.tech_data,
      configList: dataChecked.configList,
    };
    console.log("dataPost", JSON.stringify(dataPost));
    let postTech = await this.postDatatoAPINODE(
      "/techBoq/createTechBoqData",
      dataPost
    );
    if (postTech.data !== undefined) {
      this.setState({ action_status: "success" }, () => {
        setTimeout(
          function () {
            this.setState({ redirectSign: postTech.data.techBoq._id });
          }.bind(this),
          3000
        );
      });
    } else {
      if (postTech.response !== undefined) {
        if (postTech.response.data !== undefined) {
          if (postTech.response.data.error !== undefined) {
            if (postTech.response.data.error.message !== undefined) {
              this.setState(
                {
                  action_status: "failed",
                  action_message: JSON.stringify(
                    postTech.response.data.error.message
                  ),
                },
                () => {}
              );
            } else {
              this.setState(
                {
                  action_status: "failed",
                  action_message: JSON.stringify(postTech.response.data.error),
                },
                () => {}
              );
            }
          } else {
            this.setState({ action_status: "failed" }, () => {});
          }
        } else {
          this.setState({ action_status: "failed" }, () => {});
        }
      } else {
        this.setState({ action_status: "failed" }, () => {});
      }
    }
    this.toggleLoading();
  };

  formatDataTech = async (dataXLS) => {
    let action_message = this.state.action_message;
    let actionStatus = null;
    const staticHeader = ["project", "site_id", "site_name"];
    const staticHeaderXLS = dataXLS[1].filter((e, n) => n < 3);
    var staticHeaderXLStoLower = [];
    for (var i = 0; i < staticHeaderXLS.length; i++) {
      if (staticHeaderXLS[i] !== null) {
        if (staticHeaderXLS[i].length !== 0) {
          staticHeaderXLStoLower.push(staticHeaderXLS[i].toLowerCase());
        }
      }
    }
    // if(staticHeaderXLStoLower.equals(staticHeader) !== true){
    //   this.setState({action_status : "failed", action_message : action_message + "la Please check your upload format or Package Number"});
    // }
    let dataPackage = [];
    const index_item = 3;
    let RespondGetPP = [];
    const ppid_upload = [];
    let pp_id_special = [];
    for (let j = index_item; j < dataXLS[1].length; j++) {
      let idXLSIndex = dataXLS[1][j].toString().split(" /// ", 1);
      if (Array.isArray(idXLSIndex) == true) {
        idXLSIndex = idXLSIndex.join();
        if (idXLSIndex.includes('"')) {
          pp_id_special.push(idXLSIndex);
        } else {
          ppid_upload.push(idXLSIndex);
        }
      }
    }
    RespondGetPP = await this.getAllPP(ppid_upload, pp_id_special);
    this.setState({ waiting_status: null });
    if (RespondGetPP.length !== 0) {
      dataPackage = RespondGetPP;
    }
    let SitesOfBOQTech = [];
    let id_PP = new Map();
    let _id_PP = new Map();
    let pp_key = new Map();
    let pp_name = new Map();
    let group_PP = new Map();
    let pp_cust_num = new Map();
    let phy_group = new Map();
    let pp_type = new Map();
    let pp_unit = new Map();
    let data_duplicated = [];
    let data_undefined = [];
    let siteIDNull = [];
    let siteNameNull = [];
    for (let j = index_item; j < dataXLS[1].length; j++) {
      let idXLSIndex = dataXLS[1][j].toString().split(" /// ", 1);
      if (Array.isArray(idXLSIndex) == true) {
        idXLSIndex = idXLSIndex.join();
      }
      let get_id_PP = dataPackage.find((PP) => PP.pp_id === idXLSIndex);
      // let cekAllZero = dataXLS.map( e => this.checkValuetoZero(e[j]) ).filter( (e,n) => n>1);
      // if(cekAllZero.every( e => e == 0)){
      //   actionStatus = "failed";
      //   action_message = "Value of Product packages can not all zero or null"
      // }
      if (get_id_PP === undefined) {
        data_undefined.push(idXLSIndex);
      } else {
        if (id_PP.get(idXLSIndex) === undefined) {
          id_PP.set(idXLSIndex, get_id_PP.pp_id);
          pp_key.set(idXLSIndex, get_id_PP.pp_key);
          _id_PP.set(idXLSIndex, get_id_PP._id);
          group_PP.set(idXLSIndex, get_id_PP.pp_group);
          pp_name.set(idXLSIndex, get_id_PP.product_name);
          pp_cust_num.set(idXLSIndex, get_id_PP.pp_cust_number);
          phy_group.set(idXLSIndex, get_id_PP.physical_group);
          pp_type.set(idXLSIndex, get_id_PP.product_type);
          pp_unit.set(idXLSIndex, get_id_PP.uom);
        } else {
          data_duplicated.push(idXLSIndex);
        }
      }

      console.log("Data PP ID", get_id_PP);
    }
    if (data_undefined.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and <br />" : "";
      action_message =
        "Please check your upload format or Package Number in " +
        data_undefined.join(", ") +
        twoSentence +
        action_message;
    }
    if (data_duplicated.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and <br />" : "";
      action_message =
        action_message +
        twoSentence +
        " There are Duplicated PP in " +
        data_duplicated.join(", ");
    }
    let siteSaveFormat = [];
    let siteError = [];
    let sitePPerror = [];
    for (let i = 2; i < dataXLS.length; i++) {
      if (
        this.checkValue(dataXLS[i][this.getIndex(dataXLS[1], "site_id")]) !==
          null &&
        this.state.action_status !== "failed" &&
        actionStatus !== "failed"
      ) {
        let packageDatas = [];
        let errorPP = [];
        for (let j = index_item; j < dataXLS[1].length; j++) {
          let dataXLSIndex = dataXLS[1][j].split(" /// ", 1).join();
          let package_data = {
            id_pp_doc: _id_PP.get(dataXLSIndex),
            pp_id: dataXLSIndex,
            pp_key: pp_key.get(dataXLSIndex),
            package_name: pp_name.get(dataXLSIndex).toString(),
            pp_group: group_PP.get(dataXLSIndex),
            pp_cust_number: pp_cust_num.get(dataXLSIndex),
            phy_group: phy_group.get(dataXLSIndex),
            product_type: pp_type.get(dataXLSIndex),
            unit: pp_unit.get(dataXLSIndex),
            qty: this.checkValuetoZero(dataXLS[i][j]),
            ericsson_allocated: 0,
            qty_quotation_allocated: 0,
            smart_allocated: 0,
            status: "0",
          };
          packageDatas.push(package_data);
          if (isNaN(package_data.qty)) {
            errorPP.push(1);
          } else {
            if (/\s/g.test(package_data.qty)) {
              errorPP.push(1);
            }
          }
        }
        let siteID = this.checkValue(
          dataXLS[i][this.getIndex(dataXLS[1], "site_id")]
        ).toString();
        let siteName = this.checkValuetoString(
          dataXLS[i][this.getIndex(dataXLS[1], "site_name")]
        ).toString();
        let SiteBOQTech = {
          site_id: siteID,
          site_name: siteName,
          list_of_site_items: packageDatas,
          version: "0",
          created_by: this.state.userId,
          updated_by: this.state.userId,
          deleted: 0,
        };
        if (errorPP.length !== 0) {
          sitePPerror.push(SiteBOQTech.site_id);
        }
        if (siteID.length === 0) {
          siteIDNull.push(null);
        }
        if (siteName.length === 0) {
          siteNameNull.push(null);
        }
        if (
          siteSaveFormat.find((e) => e === SiteBOQTech.site_id) !== undefined
        ) {
          siteError.push(SiteBOQTech.site_id);
        }
        siteSaveFormat.push(SiteBOQTech.site_id);
        SitesOfBOQTech.push(SiteBOQTech);
      }
    }
    if (siteError.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and " : "";
      action_message =
        action_message + twoSentence + "There are duplicate site";
    }
    if (siteIDNull.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and " : "";
      action_message = action_message + twoSentence + "Site ID cant NULL";
    }
    if (siteNameNull.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and " : "";
      action_message = action_message + twoSentence + "Site Name cant NULL";
    }
    if (sitePPerror.length !== 0) {
      actionStatus = "failed";
      let twoSentence = action_message.length !== 0 ? "and " : "";
      action_message =
        action_message +
        twoSentence +
        "Please Check Qty in site " +
        sitePPerror.join(", ");
    }
    if (actionStatus === "failed") {
      this.setState({
        action_status: "failed",
        action_message: action_message,
      });
    }
    // console.log("SitesOfBOQTech", JSON.stringify(SitesOfBOQTech));
    console.log("SitesOfBOQTech length", SitesOfBOQTech.length);
    this.setState({ data_format: SitesOfBOQTech });
    return SitesOfBOQTech;
  };

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

  compareDatewithNow(input) {
    const dateIn = input + " GMT+0000";
    console.log("nO_BOQ_TECH dATE", dateIn);
    const date = new Date(dateIn);
    const DateNow =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    const NowDate = new Date();
    const now_date =
      NowDate.getFullYear() +
      "/" +
      (NowDate.getMonth() + 1) +
      "/" +
      NowDate.getDate();
    let dateNow = false;
    dateNow = now_date === DateNow;
    return dateNow;
  }

  prepareBOQTech = async () => {
    try {
      let respond = this.getDatafromAPI(
        "/amountboqtech/5d24454a951c58496433be19"
      );
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Prepare PP", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      return respond;
    }
  };

  async updateAmount(data, _etag) {
    try {
      let respond = await axios.patch(
        API_URL + "/amountboqtech/5d24454a951c58496433be19",
        data,
        {
          auth: {
            username: usernamePhilApi,
            password: passwordPhilApi,
          },
          headers: {
            "If-Match": _etag,
          },
        }
      );
      return respond;
    } catch (err) {
      let respond = undefined;
      return respond;
    }
  }

  async saveTechtoDB(count, dataSites) {
    this.setState({ progress_count: "20%" });
    const date = new Date();
    const DateNow =
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
    const ID_Tech =
      "TECBOQ-" +
      date.getFullYear().toString().substr(-2) +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0") +
      "-" +
      count.toString().padStart(4, "0");
    const BOQTech = {
      no_boq_tech: ID_Tech,
      rev: "PA",
      rev_by: this.state.userEmail,
      rev_date: DateNow.toString(),
      created_by: this.state.userId,
      updated_by: this.state.userId,
      no_boq_comm: null,
      project_name: null,
      list_of_id_boq_comm: [],
      version: "0",
      deleted: 0,
      created_on: DateNow.toString(),
      updated_on: DateNow.toString(),
    };
    // console.log("noq_tech_op", JSON.stringify(BOQTech));
    axios
      .post(API_URL + "/boq_tech_op", BOQTech, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
        },
      })
      .then((res) => {
        if (res !== undefined) {
          console.log("noq_tech_op", res);
          this.loopsaveTechtoDB(
            dataSites,
            ID_Tech,
            res.data._id,
            res.data._etag
          );
        } else {
          this.setState({ action_status: "failed", action_message: "" }, () => {
            this.toggleLoading();
          });
          const dataUpdateTech = {
            deleted: 1,
          };
          this.updateTechToDB(dataUpdateTech, res.data._id, res.data._etag);
        }
      });
  }

  async loopsaveTechtoDB(dataSites, id_tech, _id_Tech, _etag_Tech) {
    this.setState({ progress_count: "30%" });
    const date = new Date();
    const DateNow =
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
    for (let i = 0; i < dataSites.length; i++) {
      dataSites[i]["id_boq_tech_doc"] = _id_Tech;
      dataSites[i]["no_boq_tech"] = id_tech;
      dataSites[i]["created_on"] = DateNow.toString();
      dataSites[i]["updated_on"] = DateNow.toString();
    }
    let loopNow = 0;
    let perPage = 100;
    let totalLoop = Math.ceil(dataSites.length / perPage);
    console.log("data Center", totalLoop);
    let RespondPostData = [];
    let countperLoop = 60 / totalLoop;
    let countNow = countperLoop + 30;
    console.time("loop save");
    if (dataSites.length > 1) {
      for (let i = 0; i < totalLoop; i++) {
        let dataTechSitesPageLoop = dataSites.slice(
          i * perPage,
          (i + 1) * perPage
        );
        // console.log("dataTechSitesPageLoop", i);
        const respondLoopSites = await this.postDatatoAPI(
          "/boq_tech_sites_op",
          dataTechSitesPageLoop
        );
        if (respondLoopSites !== undefined) {
          if (respondLoopSites.data !== undefined) {
            RespondPostData = RespondPostData.concat(
              respondLoopSites.data._items.map((e) => e._id)
            );
            countNow = countperLoop * (i + 1) + 30;
            this.setState({ progress_count: countNow.toString + "%" });
          }
        }
      }
    } else {
      const respondLoopSites = await this.postDatatoAPI(
        "/boq_tech_sites_op",
        dataSites
      );
      if (respondLoopSites !== undefined) {
        if (respondLoopSites.data !== undefined) {
          RespondPostData.push(respondLoopSites.data._id);
        }
      }
    }
    console.timeEnd("loop save");
    if (RespondPostData.length !== 0) {
      let dataUpdateTech = {
        list_of_id_site: RespondPostData,
      };
      this.setState({ progress_count: "100%" });
      this.updateTechToDB(dataUpdateTech, _id_Tech, _etag_Tech, 0);
      this.setState(
        {
          action_status: "success",
          action_message: "Your Technical BOQ has been saved",
        },
        () => {
          this.toggleLoading();
        }
      );
    } else {
      this.setState({ action_status: "failed" }, () => {
        this.toggleLoading();
      });
    }
  }

  saveSitesToDB(dataSites, id_tech, _id_Tech, _etag_Tech) {
    const date = new Date();
    const DateNow =
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
    for (let i = 0; i < dataSites.length; i++) {
      dataSites[i]["id_boq_tech_doc"] = _id_Tech;
      dataSites[i]["no_boq_tech"] = id_tech;
      dataSites[i]["created_on"] = DateNow.toString();
      dataSites[i]["updated_on"] = DateNow.toString();
    }
    console.log("dataSites save", JSON.stringify(dataSites));
    axios
      .post(API_URL + "/boq_tech_sites_op", dataSites, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
        },
      })
      .then((res) => {
        if (res.data !== undefined) {
          this.setState({ action_status: "success" });
          let dataUpdateTech = [];
          if (res.data._items !== undefined) {
            dataUpdateTech = {
              list_of_id_site: res.data._items.map((e) => e._id),
            };
          } else {
            dataUpdateTech = {
              list_of_id_site: [res.data._id],
            };
          }
          this.updateTechToDB(dataUpdateTech, _id_Tech, _etag_Tech, 0);
          this.setState(
            {
              action_status: "success",
              action_message: "Your Technical BOQ has been saved",
            },
            () => {
              this.toggleLoading();
            }
          );
        } else {
          this.setState({ action_status: "failed", action_message: "" }, () => {
            this.toggleLoading();
          });
          const dataUpdateTech = {
            deleted: 1,
          };
          this.updateTechToDB(dataUpdateTech, _id_Tech, _etag_Tech);
        }
      });
  }

  updateTechToDB(data, _id_Tech, _etag_Tech, verNumber) {
    data["version"] = verNumber.toString();
    console.log("data updateTech", JSON.stringify(data));
    axios
      .patch(API_URL + "/boq_tech_op/" + _id_Tech, data, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernamePhilApi,
          password: passwordPhilApi,
        },
        headers: {
          "If-Match": _etag_Tech,
        },
      })
      .then((res) => {
        console.log("respond Tech update", res);
        if (res !== undefined) {
          if (res.data._id !== undefined || res.data._id !== null) {
            // this.getBOQTechAPI(res.data._id);
            setTimeout(
              function () {
                this.setState({ redirectSign: res.data._id });
              }.bind(this),
              3000
            );
          }
        } else {
          if (this.state.modal_loading === true) {
            this.toggleLoading();
          }
          this.setState({ action_status: "failed", action_message: "" }, () => {
            this.toggleLoading();
          });
        }
      });
  }

  async overwriteDataSites() {
    this.toggleLoading();
    const dataTech = this.state.API_Tech;
    let dataTechOld = this.state.data_item;
    if (
      this.state.version_selected !== null &&
      this.state.version_selected !== this.state.version_now
    ) {
      dataTechOld = this.state.API_Tech_Sites;
    }
    const dataTechNew = this.state.data_format;
    if (dataTechNew.length === 0) {
      this.setState(
        {
          action_status: "failed",
          action_message: "There are no data for updated",
        },
        () => {
          this.toggleLoading();
        }
      );
    } else {
      const sitesTechNew = dataTechNew.filter(
        this.comparerDiffSites(dataTechOld)
      );
      const sitesTechDel = dataTechOld.filter(
        this.comparerDiffSites(dataTechNew)
      );
      const dataTechSame = dataTechNew.filter(
        (e) => dataTechOld.findIndex((i) => e.site_id === i.site_id) !== -1
      );
      const getverNumber = parseInt(dataTech.version);
      let progressData = dataTechSame.length + sitesTechNew.length;
      this.setState({ progress_data: progressData, progress_count: 0 });
      let responddeletedSites = await this.deletedSites(sitesTechDel);
      this.LoopOverwrite(
        0,
        dataTechOld,
        dataTechSame,
        sitesTechNew,
        sitesTechDel,
        getverNumber
      );
    }
  }

  async deletedSites(sitesTechDel) {
    const updateDelete = { deleted: 1 };
    let patchData = [];
    for (let i = 0; i < sitesTechDel.length; i++) {
      let respondPatch = await this.patchDatatoAPI(
        "/boq_tech_sites_op/" + sitesTechDel[i]._id,
        updateDelete,
        sitesTechDel[i]._etag
      );
      if (respondPatch === undefined) {
        respondPatch["data"] = undefined;
      }
      if (respondPatch.data !== undefined) {
        patchData.push(respondPatch.data);
      }
    }
    return patchData;
  }

  async LoopOverwrite(
    index,
    dataOld,
    dataSitesSame,
    sitesTechNew,
    sitesTechDel,
    verNumber
  ) {
    this.setState({ progress_count: index });
    if (index < dataSitesSame.length) {
      let dataOldIndex = dataOld.find(
        (e) => e.site_id === dataSitesSame[index].site_id
      );
      if (
        this.state.version_selected !== null &&
        this.state.version_selected !== this.state.version_now
      ) {
        dataOldIndex = this.state.API_Tech_Sites.find(
          (e) => e.site_id === dataSitesSame[index].site_id
        );
      }
      dataSitesSame[index]["_id"] = dataOldIndex._id;
      dataSitesSame[index]["_etag"] = dataOldIndex._etag;
      dataSitesSame[index]["id_boq_tech_doc"] = this.state.API_Tech._id;
      dataSitesSame[index]["no_boq_tech"] = this.state.API_Tech.no_boq_tech;
      dataSitesSame[index]["version"] = verNumber.toString();
    }
    if (index >= dataSitesSame.length) {
      let respondPOST = "not New";
      let id_SitesNew = [];
      if (sitesTechNew.length !== 0) {
        for (let x = 0; x < sitesTechNew.length; x++) {
          sitesTechNew[x]["version"] = verNumber.toString();
        }
        this.setState({ progress_count: "Save New Sites" });
        const respondPOST = await this.postSitesToAPI(
          sitesTechNew,
          this.state.API_Tech._id,
          this.state.API_Tech.no_boq_tech
        );
        if (respondPOST !== undefined) {
          if (respondPOST.data !== undefined) {
            if (sitesTechNew.length == 1) {
              id_SitesNew = respondPOST.data._id;
            } else {
              id_SitesNew = respondPOST.data._items.map((e) => e._id);
            }
          }
        }
      }
      if (respondPOST !== undefined) {
        const id_SitesSame = dataSitesSame.map((e) => e._id);
        const date = new Date();
        const DateNow =
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
        const dataUpdateTech = {
          list_of_id_site: id_SitesSame.concat(id_SitesNew),
          version: verNumber.toString(),
        };
        dataUpdateTech["rev"] = "PA";
        dataUpdateTech["updated_by"] = this.state.userId;
        dataUpdateTech["updated_on"] = DateNow.toString();
        dataUpdateTech["rev_by"] = this.state.userId;
        dataUpdateTech["rev_date"] = DateNow.toString();
        this.setState({
          progress_data: "finishing",
          progress_count: "finishing",
        });
        const repondUpdateTech = await this.patchBoqTechToAPI(
          dataUpdateTech,
          this.state.API_Tech._id,
          this.state.API_Tech._etag,
          verNumber
        );
        if (repondUpdateTech !== undefined) {
          this.setState({ API_Tech_Sites: [], data_item: [] }, () => {
            this.getBOQTechAPI(this.state.API_Tech._id);
          });
          this.getBOQTechAPI(this.state.API_Tech._id);
          this.setState(
            {
              action_status: "success",
              action_message: "Your Technical BOQ has been update ",
            },
            () => {
              this.toggleLoading();
              setTimeout(function () {
                window.location.reload();
              }, 2000);
            }
          );
        } else {
          this.setState({ action_status: "failed", action_message: "" }, () => {
            this.toggleLoading();
          });
        }
      } else {
        this.setState({ action_status: "failed", action_message: "" }, () => {
          this.toggleLoading();
        });
      }
    } else {
      const respondPUT = await this.putSitestoAPI(
        dataSitesSame[index],
        verNumber,
        dataSitesSame[index]._id,
        dataSitesSame[index]._etag
      );
      if (respondPUT != undefined) {
        this.LoopOverwrite(
          index + 1,
          dataOld,
          dataSitesSame,
          sitesTechNew,
          sitesTechDel,
          verNumber
        );
      } else {
        this.setState({ action_status: "failed", action_message: "" }, () => {
          this.toggleLoading();
        });
      }
    }
  }

  revisionTech = async () => {
    this.toggleLoading();
    this.setState({ progress_data: "pre Process" });
    this.setState({ progress_count: "Step 1" });
    let revComm = undefined;
    let dataTech = this.state.API_Tech;
    if (
      this.state.version_selected !== null &&
      this.state.version_selected !== this.state.version_now
    ) {
      dataTech = this.state.API_Tech_prev;
    }
    const dataSites = this.state.API_Tech_Sites;
    let dataRevTech = Object.assign({}, dataTech);
    const dataTechNew = this.state.data_format;
    this.setState({ progress_count: "Step 2" });
    if (dataTechNew.length === 0) {
      this.setState(
        {
          action_status: "failed",
          action_message: "There are no data for updated",
        },
        () => {
          this.toggleLoading();
        }
      );
    } else {
      dataRevTech["id_document"] = dataTech._id;
      dataRevTech["created_by"] = this.state.userId;
      dataRevTech["updated_by"] = this.state.userId;
      dataRevTech["updated_on"] = dataTech.updated_on;
      dataRevTech["delta_rev_file"] = null;
      dataRevTech["list_of_id_site"] = dataTech.list_of_id_site.map(
        (e) => e._id
      );
      dataRevTech["version_comment"] = this.state.note_version;
      delete dataRevTech._id;
      delete dataRevTech._etag;
      delete dataRevTech._links;
      this.setState({ progress_count: "Step 3" });
      const ResPostTechRev = await this.postDatatoAPI(
        "/boq_tech_rev",
        dataRevTech
      );
      if (
        ResPostTechRev !== undefined &&
        ResPostTechRev.status >= 200 &&
        ResPostTechRev.status < 400
      ) {
        let dataSitesRev = [];
        for (let i = 0; i < dataSites.length; i++) {
          let dataRevIn = Object.assign({}, dataSites[i]);
          dataRevIn["id_document"] = dataRevIn._id;
          delete dataRevIn._id;
          delete dataRevIn._etag;
          delete dataRevIn._links;
          delete dataRevIn.list_qty_items;
          dataRevIn["created_by"] = this.state.userId;
          dataRevIn["updated_by"] = this.state.userId;
          dataSitesRev.push(dataRevIn);
        }
        this.setState({ progress_count: "Step 4" });
        const ResPostSitesTechRev = await this.postDatatoAPI(
          "/boq_tech_sites_rev",
          JSON.stringify(dataSitesRev)
        );
        if (
          ResPostSitesTechRev.status < 400 &&
          ResPostSitesTechRev !== undefined
        ) {
          let dataTechOld = this.state.data_item;
          if (
            this.state.version_selected !== null &&
            this.state.version_selected !== this.state.version_now
          ) {
            dataTechOld = this.state.API_Tech_Sites;
          }
          const sitesTechNew = dataTechNew.filter(
            this.comparerDiffSites(dataTechOld)
          );
          const sitesTechDel = dataTechOld.filter(
            this.comparerDiffSites(dataTechNew)
          );
          const dataTechSame = dataTechNew.filter(
            (e) => dataTechOld.findIndex((i) => e.site_id === i.site_id) !== -1
          );
          const getVerNumber = parseInt(dataTech.version);
          let progressData = dataTechSame.length + sitesTechNew.length;
          this.setState({ progress_data: progressData, progress_count: 0 });
          let responddeletedSites = await this.deletedSites(sitesTechDel);
          this.LoopOverwrite(
            0,
            dataTechOld,
            dataTechSame,
            sitesTechNew,
            sitesTechDel,
            getVerNumber + 1
          );
        }
      } else {
        this.toggleLoading();
      }
    }
  };

  async putSitestoAPI(dataSitesSame, verNumber, _id_sites, _etag_sites) {
    const date = new Date();
    const DateNow =
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
    const dataSiteSave = {
      id_boq_tech_doc: dataSitesSame.id_boq_tech_doc,
      no_boq_tech: dataSitesSame.no_boq_tech,
      site_id: dataSitesSame.site_id,
      site_name: dataSitesSame.site_name,
      list_of_site_items: dataSitesSame.list_of_site_items,
      version: verNumber.toString(),
      updated_on: DateNow.toString(),
      updated_by: this.state.userId,
      deleted: 0,
    };
    try {
      let respond = await axios.patch(
        API_URL + "/boq_tech_sites_op/" + _id_sites,
        dataSiteSave,
        {
          headers: { "Content-Type": "application/json" },
          auth: {
            username: usernamePhilApi,
            password: passwordPhilApi,
          },
          headers: {
            "If-Match": _etag_sites,
          },
        }
      );
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond PUT Sites", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      console.log("respond PUT Sites", err);
      return respond;
    }
  }

  async postSitesToAPI(dataSites, _id_Tech, id_tech) {
    console.log("DATASITES NEW REVI", "MASUK POST SITES NEW");
    const date = new Date();
    const DateNow =
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
    let getSites = await this.getAllSites(dataSites.map((e) => e.site_id));
    for (let i = 0; i < dataSites.length; i++) {
      let sitesIndex = getSites.find(
        (site) => site.site_id === dataSites[i].site_id.toString()
      );
      if (sitesIndex === undefined) {
        let DataSite = {
          site_id: dataSites[i].site_id,
          site_name: dataSites[i].site_name,
          longitude: null,
          latitude: null,
          customer_area: null,
          province: null,
          city: null,
          address: null,
          site_type: null,
          search_ring_status: null,
          lessor_type: null,
          land_classification: null,
          lessor_name: null,
          lessor_contact: null,
          distance_from_nominal_in_meter: null,
          candidate_status: null,
          tower_type: null,
          tower_height_in_meter: null,
          permanent_power_solution: null,
          electrical_cooperative: null,
          temporary_power_supplier: null,
          tx_readiness_status: null,
          tx_readiness_remarks: null,
          tx_readiness_plan_date: null,
          tx_readiness_actual: null,
          ac_dc_power_status: null,
          ac_dc_power_remarks: null,
          ac_dc_power_plan_date: null,
          ac_dc_power_actual_date: null,
          tower_status: null,
          tower_remarks: null,
          tower_plan_date: null,
          tower_actual_date: null,
          access_status: null,
          access_remarks: null,
          access_plan_date: null,
          access_actual_date: null,
          deleted: 0,
          created_by: this.state.userId,
          updated_by: this.state.userId,
          created_on: DateNow.toString(),
          updated_on: DateNow.toString(),
        };
        const postSites = await this.postDatatoAPI("/site_op", DataSite);
        if (postSites !== undefined) {
          dataSites[i]["site_name"] = dataSites[i].site_name;
          dataSites[i]["id_site_doc"] = postSites.data._id;
        } else {
          dataSites[i]["site_name"] = dataSites[i].site_name;
        }
      } else {
        dataSites[i]["site_name"] = sitesIndex.site_name;
        dataSites[i]["id_site_doc"] = sitesIndex._id;
      }
      dataSites[i]["id_boq_tech_doc"] = _id_Tech;
      dataSites[i]["no_boq_tech"] = id_tech;
    }
    try {
      console.log("DATASITES NEW REVI", JSON.stringify(dataSites));
      let respond = await axios.post(
        API_URL + "/boq_tech_sites_op",
        dataSites,
        {
          headers: { "Content-Type": "application/json" },
          auth: {
            username: usernamePhilApi,
            password: passwordPhilApi,
          },
        }
      );
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond POST Sites", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      console.log("respond POST Sites", err);
      return respond;
    }
  }

  async patchBoqTechToAPI(data, _id_Tech, _etag_Tech, verNumber) {
    data["version"] = verNumber.toString();
    try {
      let respond = await axios.patch(
        API_URL + "/boq_tech_op/" + _id_Tech,
        data,
        {
          headers: { "Content-Type": "application/json" },
          auth: {
            username: usernamePhilApi,
            password: passwordPhilApi,
          },
          headers: {
            "If-Match": _etag_Tech,
          },
        }
      );
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch Tech", respond);
      }
      return respond;
    } catch (err) {
      let respond = undefined;
      console.log("respond Patch Tech", err);
      return respond;
    }
  }

  countFromDataBase(dataTech) {
    let onlyItem = dataTech
      .map((value) => value.list_of_site_items.map((child) => child))
      .reduce((l, n) => l.concat(n), []);
    let get_id_package = [...new Set(onlyItem.map(({ pp_id }) => pp_id))];
    let countData = {};
    for (let i = 0; i < get_id_package.length; i++) {
      const materialQTY = onlyItem.filter((d) => d.pp_id === get_id_package[i]);
      countData[get_id_package[i]] = materialQTY.reduce((a, b) => a + b.qty, 0);
    }
  }

  viewTech(dataAPI) {
    //Make from Data API format into View Format
    if (dataAPI !== undefined && dataAPI.length !== 0) {
      const arrayPPID = dataAPI[0].list_of_site_items.map((e) => e.id_pp_doc);
      const dataHeaderID = dataAPI[0].list_of_site_items.map(
        (e) => e.id_pp_doc
      );
      const dataHeader = dataAPI[0].list_of_site_items.map(
        (e) => e.package_name
      );
      const dataGroupPP = dataAPI[0].list_of_site_items.map(
        (e) => e.product_type
      );
      const dataIDPP = dataAPI[0].list_of_site_items.map((e) => e.pp_id);
      const dataUnit = dataAPI[0].list_of_site_items.map((e) => e.unit);
      let dataSummaryQTY = new Array(dataHeaderID.length + 1)
        .join("0")
        .split("")
        .map(parseFloat);
      console.log("dataSummaryQTY", dataSummaryQTY);
      for (let i = 0; i < dataAPI.length; i++) {
        let arrayItem = new Array(dataHeaderID.length)
          .join("0")
          .split("")
          .map(parseFloat);
        for (let j = 0; j < dataAPI[i].list_of_site_items.length; j++) {
          const indexItem = dataHeaderID.findIndex(
            (d) => d === dataAPI[i].list_of_site_items[j].id_pp_doc
          );
          let qtyPPSite = this.checkValuetoZero(
            dataAPI[i].list_of_site_items[j].qty
          );
          arrayItem[indexItem] = qtyPPSite;
          dataSummaryQTY[indexItem] = dataSummaryQTY[indexItem] + qtyPPSite;
        }
        dataAPI[i]["list_qty_items"] = arrayItem;
      }
      const Header = {
        type: dataGroupPP,
        name: dataHeader,
        IDPP: dataIDPP,
        unit: dataUnit,
      };
      this.setState(
        {
          data_item: dataAPI,
          Package_Header: Header,
          summaryQTYTech: dataSummaryQTY,
        },
        () => {
          this.dataViewPagination(dataAPI);
        }
      );
    } else {
      this.setState({
        action_status: "failed",
        action_message: "There is error, please select other Technical BOQ",
      });
    }
  }

  SumPerPackageTechnicalXLS(XLS) {
    const dataTech = XLS;
    let countData = {};
    for (let i = 4; i < dataTech[0].length; i++) {
      const materialamount = dataTech.map((e) => e[i]).filter((e, n) => n > 1);
      countData[dataTech[1][i]] = materialamount.reduce((a, b) => a + b, 0);
    }
    return countData;
  }

  dataViewPagination(dataTechView) {
    let perPage = this.state.perPage;
    let dataTechPage = [];
    if (perPage !== dataTechView.length) {
      let pageNow = this.state.activePage - 1;
      dataTechPage = dataTechView.slice(
        pageNow * perPage,
        (pageNow + 1) * perPage
      );
    } else {
      dataTechPage = dataTechView;
    }
    this.setState({ data_tech_boq_sites_pagination: dataTechPage });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.dataViewPagination(this.state.data_tech_boq_sites);
    });
  }

  handleChangeOptionView() {
    let value = "only_filled";
    if (this.state.option_tssr_header_view === "only_filled") {
      this.setState({ option_tssr_header_view: "all" });
    } else {
      this.setState({ option_tssr_header_view: "only_filled" });
    }
  }

  handleChangeShow = (e) => {
    let show = e.target.value;
    this.setState({ perPage: show }, () => {
      this.dataViewPagination(this.state.data_item);
    });
  };

  handleChangeVerComment(e) {
    const value = e.target.value;
    this.setState({ note_version: value });
  }

  numToSSColumn(num) {
    var s = "",
      t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = ((num - t) / 26) | 0;
    }
    return s || undefined;
  }

  exportTechnical = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    const dataSites = this.state.data_tech_boq_sites;
    const dataHeader = this.state.view_tech_header_table;
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
    ws.getCell("F5").value = dataTech.no_tech_boq;
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
    ws.getCell("H6").value = "Rev";
    ws.getCell("H6").font = { size: 8 };
    ws.getCell("H6").alignment = { vertical: "top", horizontal: "left" };
    ws.getCell("H6").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const revStatus = dataTech.rev !== "A" ? "PA" : "A";

    const revDocNum = ws.mergeCells("H7:I7");
    ws.getCell("H7").value = dataTech.version;
    ws.getCell("H7").alignment = { horizontal: "left" };
    ws.getCell("H7").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ws.mergeCells("A9:I9");
    ws.getCell("A9").value = "TECHNICAL BOQ";
    ws.getCell("A9").font = { size: 14, bold: true };
    ws.getCell("A9").alignment = { vertical: "middle", horizontal: "center" };
    ws.getCell("A9").border = { bottom: { style: "double" } };

    ws.addRow([
      "Project",
      ": " + dataTech.project_name,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    ws.addRow([
      "Created On",
      ": " + convertDateFormatfull(dataTech.created_on),
      "",
      "",
      "",
      "",
      "Updated On",
      convertDateFormatfull(dataTech.updated_on),
      "",
    ]);
    ws.mergeCells("B10:C10");
    ws.mergeCells("B11:C11");
    ws.mergeCells("B12:C12");
    ws.mergeCells("H10:I10");
    ws.mergeCells("H11:I11");
    ws.mergeCells("H12:I12");

    if (
      this.checkValuetoString(dataTech.note_1).length !== 0 ||
      this.checkValuetoString(dataTech.note_2).length !== 0
    ) {
      let getlastnullrow = ws.lastRow._number + 1;
      ws.mergeCells("B" + getlastnullrow + ":C" + getlastnullrow);
      ws.getCell("A" + getlastnullrow).value = dataTech.note_name_1;
      ws.getCell("B" + getlastnullrow).value = dataTech.note_1;
      ws.mergeCells("H" + getlastnullrow + ":I" + getlastnullrow);
      ws.getCell("G" + getlastnullrow).value = dataTech.note_name_2;
      ws.getCell("H" + getlastnullrow).value = dataTech.note_2;
    }
    if (
      this.checkValuetoString(dataTech.note_3).length !== 0 ||
      this.checkValuetoString(dataTech.note_4).length !== 0
    ) {
      let getlastnullrow = ws.lastRow._number + 1;
      ws.mergeCells("B" + getlastnullrow + ":C" + getlastnullrow);
      ws.getCell("A" + getlastnullrow).value = dataTech.note_name_3;
      ws.getCell("B" + getlastnullrow).value = dataTech.note_3;
      ws.mergeCells("H" + getlastnullrow + ":I" + getlastnullrow);
      ws.getCell("G" + getlastnullrow).value = dataTech.note_name_4;
      ws.getCell("H" + getlastnullrow).value = dataTech.note_4;
    }

    ws.addRow([""]);

    const rowHeader1 = ["", ""].concat(
      dataHeader.config_group_type_header.map((e) => e)
    );
    const rowHeader2 = ["Tower ID", "Tower Name", "Program"].concat(
      dataHeader.config_group_header.map((e) => e)
    );
    let getlastrowHeaderSum = ws.lastRow._number;
    ws.addRow(rowHeader1);
    let getlastrowHeader1 = ws.lastRow._number;
    for (let i = 3; i < rowHeader1.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + getlastrowHeader1.toString()).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "7F81C784" },
      };
    }
    ws.addRow(rowHeader2);
    let getlastrowHeader2 = ws.lastRow._number;
    for (let i = 1; i < rowHeader2.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + getlastrowHeader2.toString()).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0ACD7D" },
      };
    }

    for (let i = 0; i < dataSites.length; i++) {
      ws.addRow(
        [
          dataSites[i].site_id,
          dataSites[i].site_name,
          dataSites[i].program,
        ].concat(dataSites[i].siteItemConfig.map((e) => e.qty))
      );
    }

    const techFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([techFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Report.xlsx"
    );
  };

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  getListVersion(_id) {
    this.getDatafromAPI(
      '/boq_tech_rev_all?where={"id_document":"' +
        _id +
        '"}&projection={"version":1, "rev":1, "_etag" : 1}'
    ).then((res) => {
      if (res !== undefined) {
        this.setState({ list_version: res.data._items });
      }
    });
  }

  getBOQRevAPI(_id_Tech) {
    let API_Tech = Object.assign({}, this.state.API_Tech);
    this.setState({ API_Tech_prev: this.state.API_Tech });
    const version = this.state.version_selected;
    const where_id_Sites =
      '?where={"id_document" : "' +
      _id_Tech +
      '", "version" : "' +
      version +
      '"}';
    let url = "/boq_tech_rev" + where_id_Sites;
    this.getDatafromAPI(url).then((res) => {
      if (res !== undefined) {
        API_Tech["note_name_1"] = this.checkValue(
          res.data._items[0].note_name_1
        );
        API_Tech["note_1"] = this.checkValue(res.data._items[0].note_1);
        API_Tech["note_name_2"] = this.checkValue(
          res.data._items[0].note_name_2
        );
        API_Tech["note_2"] = this.checkValue(res.data._items[0].note_2);
        API_Tech["note_name_3"] = this.checkValue(
          res.data._items[0].note_name_3
        );
        API_Tech["note_3"] = this.checkValue(res.data._items[0].note_3);
        API_Tech["note_name_4"] = this.checkValue(
          res.data._items[0].note_name_4
        );
        API_Tech["note_4"] = this.checkValue(res.data._items[0].note_4);
        API_Tech["version_comment"] = this.checkValue(
          res.data._items[0].version_comment
        );
        if (res.data._items[0].list_of_id_site !== undefined) {
          this.setState({ API_Tech: API_Tech });
          this.getSitesTechRevAPI(_id_Tech, version);
        }
      }
    });
  }

  getSitesTechRevAPI(id_boq_tech_doc, version) {
    // const arraySites = '"'+id_Sites.join('", "')+'"';
    const where_id_Sites =
      'where={"id_boq_tech_doc" : "' +
      id_boq_tech_doc +
      '" , "version" : "' +
      version +
      '"}';
    this.getDatafromAPI("/boq_tech_sites_rev_all?" + where_id_Sites).then(
      (res) => {
        console.log("data_format Rev Res", res);
        this.formatDataRev(res.data._items);
        this.viewTech(res.data._items);
      }
    );
  }

  formatDataRev(dataItems) {
    let dataStoreRev = [];
    for (let i = 0; i < dataItems.length; i++) {
      let dataStoreRevIndex = Object.assign({}, dataItems[i]);
      // dataStoreRevIndex["created_by"] = this.state.userId;
      dataStoreRevIndex["updated_by"] = this.state.userId;
      delete dataStoreRevIndex.id_document;
      delete dataStoreRevIndex._id;
      delete dataStoreRevIndex._etag;
      delete dataStoreRevIndex._links;
      delete dataStoreRevIndex.created_on;
      delete dataStoreRevIndex.updated_on;
      dataStoreRev.push(dataStoreRevIndex);
    }
    console.log("data_format Rev", dataStoreRev);
    this.setState({ data_format: dataStoreRev });
    // return dataStoreRev;
  }

  checkIsEqual(dataXLS) {
    const dataTech = this.state.data_item;
    const TechSiteID = dataTech.map((e) => e.site_id);
    const TechPPID = dataTech[0].list_of_site_items.map((e) => e.pp_id);
    const uploadSiteID = dataXLS
      .map((e) => e[this.getIndex(dataXLS[1], "site_id")])
      .filter((e, n) => n > 1 && e !== null);
    const dataHeaderUpload = dataXLS[1].filter((e, n) => n > 1);
    if (TechSiteID.equals(uploadSiteID) === true) {
      if (TechPPID.equals(dataHeaderUpload) === true) {
      } else {
        this.setState({
          action_status: "failed",
          action_message:
            "PP ID for revision must equal with PP ID in saved Technical BOQ \n since this technical BOQ already linked with commercial BOQ",
        });
      }
    } else {
      this.setState({
        action_status: "failed",
        action_message:
          "Site ID for revision must equal with Site ID in saved Technical BOQ \n since this technical BOQ already linked with commercial BOQ",
      });
    }
  }

  async approvedBoqTech(e) {
    this.toggleLoading();
    const statusValue = e.target.value;
    const date = new Date();
    const DateNow =
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
    const dataTech = this.state.API_Tech;
    let EmailReceiver = [];
    if (statusValue === "WA") {
      const getUserApproval = await this.getDatafromAPI(
        '/user_all?where={"roles" : "5d6ceb420dbae80ce6052751"}'
      );
      if (getUserApproval !== undefined) {
        if (getUserApproval.data !== undefined) {
          if (getUserApproval.data._items.length !== 0) {
            EmailReceiver = getUserApproval.data._items.map((e) => e.email);
          }
        }
      }
    }
    let dataApprove = {
      rev: statusValue.toString(),
    };
    dataApprove["rev_by"] = this.state.userEmail;
    dataApprove["rev_date"] = DateNow.toString();
    let revPatch = await this.patchDatatoAPI(
      "/boq_tech_op/" + dataTech._id,
      dataApprove,
      dataTech._etag
    );
    if (revPatch !== undefined) {
      if (revPatch.data !== undefined) {
        if (EmailReceiver.length !== 0) {
          let dataEmail = {};
          let bodyEmail =
            "<span style='font-size:30px;font-weight:800;'>Approval Request</span><br/><br/><span>You have a request for BOQ Management System Approval</span><br/><br/><span style='font-size:20px;font-weight:600;'>Approve or Reject rquest</span><br/><br/><span>This is automate generate email from BOQ Management system . Follow this link to approve request : <a href='https://smart.e-dpm.com/#/Boq/Technical/Approval/" +
            dataTech._id +
            "'>" +
            dataTech.no_boq_tech +
            "</a></span><br/><br/><span style='font-size:20px;font-weight:600;'>Don't know what this is?</span><br/><br/><span>This message is sent from DPM BOQ Management System, since you are registered as one of the approval role. Questions are welcome to dpm.notification@ericsson.com</span>";
          dataEmail = {
            to: EmailReceiver.join("; "),
            subject:
              "Request for Approval Technical BOQ " + dataTech.no_boq_tech,
            body: bodyEmail,
          };
          // let sendEmail = await this.apiSendEmail(dataEmail);
        }
        dataTech["rev"] = dataApprove.rev;
        dataTech["rev_by"] = dataApprove.rev_by;
        dataTech["rev_date"] = dataApprove.rev_date;
        dataTech["_etag"] = revPatch.data._etag;
        this.setState(
          {
            action_status: "succes",
            action_message:
              "BOQ Technical " + dataTech.no_boq_tech + " has been approved",
            API_Tech: dataTech,
          },
          () => {}
        );
      }
    }
    this.toggleLoading();
  }

  saveNote = () => {
    const techAPI = this.state.API_Tech;
    // const numbNote = e;
    let updateNote = {};
    for (let numbNote = 1; numbNote <= 6; numbNote++) {
      if (numbNote !== 5) {
        updateNote["note_" + numbNote.toString()] =
          this.state.noteChange[parseInt(numbNote)];
        if (
          this.checkValuetoString(this.state.noteChange[parseInt(numbNote)])
            .length == 0
        ) {
          updateNote["note_" + numbNote.toString()] = this.checkValuetoString(
            techAPI["note_" + numbNote.toString()]
          );
        }
        updateNote["note_name_" + numbNote.toString()] =
          this.state.fieldNoteChange[parseInt(numbNote)];
        if (
          this.checkValuetoString(
            this.state.fieldNoteChange[parseInt(numbNote)]
          ).length == 0
        ) {
          updateNote["note_name_" + numbNote.toString()] =
            this.checkValuetoString(
              techAPI["note_name_" + numbNote.toString()]
            );
        }
      }
    }
    console.log("updateNote", updateNote);
    return updateNote;
  };

  handleChangeNote(e) {
    let noteArray = this.state.noteChange;
    const index = e.target.name;
    const value = e.target.value;
    noteArray[parseInt(index)] = value.toString();
    this.setState({
      noteChange: noteArray,
    });
  }

  handleChangeFieldNote(e) {
    let fieldnoteArray = this.state.fieldNoteChange;
    const index = e.target.name;
    const value = e.target.value;
    fieldnoteArray[parseInt(index)] = value.toString();
    this.setState({
      fieldNoteChange: fieldnoteArray,
    });
  }

  handleChangeOpportunity(e) {
    let value = e.target.value;
    if (value !== null) {
      if (value.length === 0) {
        value = null;
      }
    }
    this.setState({ opportunity_id: value });
  }

  async saveOpportunityNote() {
    this.toggleLoading();
    let respSaveON = undefined;
    const updateOppotunity = {
      opportunity_id: this.checkValuetoString(this.state.opportunity_id),
    };
    const updateNote = this.saveNote();
    if (this.state.opportunity_id === null) {
      const patchTech = await this.patchDatatoAPI(
        "/boq_tech_op/" + this.state.API_Tech._id,
        updateNote,
        this.state.API_Tech._etag
      );
      if (patchTech !== undefined) {
        if (patchTech.data !== undefined) {
          respSaveON = true;
        }
      }
    } else {
      const dataUpdate = { ...updateNote, ...updateOppotunity };
      const patchTech = await this.patchDatatoAPI(
        "/boq_tech_op/" + this.state.API_Tech._id,
        dataUpdate,
        this.state.API_Tech._etag
      );
      for (let i = 0; i < this.state.API_Tech.list_of_id_boq_comm.length; i++) {
        let getdataComm = await this.getDatafromAPI(
          "/boq_comm_op/" + this.state.API_Tech.list_of_id_boq_comm[i]
        );
        if (getdataComm == undefined) {
          getdataComm["data"] = undefined;
        }
        if (getdataComm.data !== undefined) {
          const patchComm = await this.patchDatatoAPI(
            "/boq_comm_op/" + getdataComm.data._id,
            updateOppotunity,
            getdataComm.data._etag
          );
        }
      }
      if (patchTech !== undefined) {
        if (patchTech.data !== undefined) {
          respSaveON = true;
        }
      }
    }
    if (respSaveON === true) {
      this.setState(
        {
          action_status: "success",
          action_message: "Opportunity ID has been saved",
        },
        () => {
          this.toggleLoading();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
      );
    } else {
      this.setState({ action_status: "failed" }, () => {
        this.toggleLoading();
      });
    }
  }

  exportFormatTechnical = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }

    const header_config = this.state.view_tech_all_header_table;

    let HeaderRow1 = [
      "General Info",
      "General Info",
      "General Info",
      "General Info",
      "General Info",
    ];
    let HeaderRow2 = ["tower_id", "program", "sow", "sow_code", "priority"];

    header_config.config_group_type_header.map(
      (e) => (HeaderRow1 = HeaderRow1.concat([e, e]))
    );
    header_config.config_group_header.map(
      (e) => (HeaderRow2 = HeaderRow2.concat([e, "qty"]))
    );

    ws.addRow(HeaderRow1);
    ws.addRow(HeaderRow2);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfigVersion.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      } else {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfig.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      }
      ws.addRow(
        [
          dataSites[i].site_id,
          dataSites[i].program,
          dataSites[i].sow,
          dataSites[i].sow_code,
          dataSites[i].priority,
        ].concat(qtyConfig)
      );
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Uploader Template.xlsx"
    );
  };

  exportFormatTechnicalCommercial = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }

    const header_config = this.state.view_tech_all_header_table;

    let HeaderRow1 = [
      "General Info",
      "General Info",
      "General Info",
      "General Info",
      "General Info",
    ];
    let HeaderRow2 = ["tower_id", "program", "sow", "sow_code", "priority"];

    header_config.config_group_type_header.map(
      (e) => (HeaderRow1 = HeaderRow1.concat([e, e]))
    );
    header_config.config_group_header.map(
      (e) => (HeaderRow2 = HeaderRow2.concat([e, "qty_commercial"]))
    );

    ws.addRow(HeaderRow1);
    ws.addRow(HeaderRow2);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfigVersion.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty_commercial,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      } else {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfig.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty_commercial,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      }
      ws.addRow(
        [
          dataSites[i].site_id,
          dataSites[i].program,
          dataSites[i].sow,
          dataSites[i].sow_code,
          dataSites[i].priority,
        ].concat(qtyConfig)
      );
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " +
        dataTech.no_tech_boq +
        " Uploader Commercial Template.xlsx"
    );
  };

  exportFormatTechnicalNew = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let HeaderRow1 = [
      "General Info",
      "General Info",
      "General Info",
      "General Info",
      "General Info",
    ];
    let HeaderRow2 = ["tower_id", "program", "sow", "sow_code", "priority"];

    Config_group_type_DEFAULT.map(
      (e) => (HeaderRow1 = HeaderRow1.concat([e, e]))
    );
    Config_group_DEFAULT.map(
      (e) => (HeaderRow2 = HeaderRow2.concat([e, "qty"]))
    );

    ws.addRow(HeaderRow1);
    ws.addRow(HeaderRow2);

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MRFormat]), "Technical BOQ Uploader Template.xlsx");
  };

  exportFormatTechnicalHorizontal = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }

    const header_config = this.state.view_tech_all_header_table;

    let HeaderRow1 = [
      "General Info",
      "General Info",
      "General Info",
      "General Info",
      "General Info",
    ];
    let HeaderRow2 = ["tower_id", "program", "sow", "sow_code", "priority"];

    header_config.config_group_type_header.map(
      (e) => (HeaderRow1 = HeaderRow1.concat([e, e]))
    );
    header_config.config_group_header.map(
      (e) => (HeaderRow2 = HeaderRow2.concat([e, "qty"]))
    );

    ws.addRow(HeaderRow1);
    ws.addRow(HeaderRow2);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfigVersion.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      } else {
        for (let j = 0; j < header_config.config_group_header.length; j++) {
          let dataConfigIdx = dataSites[i].siteItemConfig.find(
            (e) =>
              e.config_group === header_config.config_group_header[j] &&
              e.config_group_type === header_config.config_group_type_header[j]
          );
          if (dataConfigIdx !== undefined) {
            qtyConfig = qtyConfig.concat([
              dataConfigIdx.config_id,
              dataConfigIdx.qty,
            ]);
          } else {
            qtyConfig = qtyConfig.concat([null, null]);
          }
        }
      }
      ws.addRow(
        [
          dataSites[i].site_id,
          dataSites[i].program,
          dataSites[i].sow,
          dataSites[i].sow_code,
          dataSites[i].priority,
        ].concat(qtyConfig)
      );
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Horizontal.xlsx"
    );
  };

  exportFormatTechnicalVerticalUploader = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }
    const dataHeader = this.state.view_tech_header_table;

    let ppIdRow = [
      "tower_id",
      "program",
      "sow",
      "config_group",
      "config_id",
      "config_group_type",
      "qty",
    ];

    ws.addRow(ppIdRow);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < dataSites[i].siteItemConfigVersion.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].program,
            dataSites[i].sow,
            dataSites[i].siteItemConfigVersion[j].config_group,
            dataSites[i].siteItemConfigVersion[j].config_id,
            dataSites[i].siteItemConfigVersion[j].config_group_type,
            dataSites[i].siteItemConfigVersion[j].qty,
          ]);
        }
      } else {
        for (let j = 0; j < dataSites[i].siteItemConfig.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].program,
            dataSites[i].sow,
            dataSites[i].siteItemConfig[j].config_group,
            dataSites[i].siteItemConfig[j].config_id,
            dataSites[i].siteItemConfig[j].config_group_type,
            dataSites[i].siteItemConfig[j].qty,
          ]);
        }
      }
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Vertical Uploader.xlsx"
    );
  };

  exportFormatTechnicalVerticalUploaderCommercial = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }
    const dataHeader = this.state.view_tech_header_table;

    let ppIdRow = [
      "tower_id",
      "program",
      "sow",
      "config_group",
      "config_id",
      "config_group_type",
      "qty_commercial",
    ];

    ws.addRow(ppIdRow);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < dataSites[i].siteItemConfigVersion.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].program,
            dataSites[i].sow,
            dataSites[i].siteItemConfigVersion[j].config_group,
            dataSites[i].siteItemConfigVersion[j].config_id,
            dataSites[i].siteItemConfigVersion[j].config_group_type,
            dataSites[i].siteItemConfigVersion[j].qty_commercial,
          ]);
        }
      } else {
        for (let j = 0; j < dataSites[i].siteItemConfig.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].site_name,
            dataSites[i].sow,
            dataSites[i].siteItemConfig[j].config_group,
            dataSites[i].siteItemConfig[j].config_id,
            dataSites[i].siteItemConfig[j].config_group_type,
            dataSites[i].siteItemConfig[j].qty_commercial,
          ]);
        }
      }
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Vertical Uploader.xlsx"
    );
  };

  exportFormatTechnicalVertical = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataTech = this.state.data_tech_boq;
    let dataSites = [];
    if (
      this.state.version_selected !== null &&
      dataTech.version !== this.state.version_selected
    ) {
      dataSites = this.state.data_tech_boq_sites_version;
    } else {
      dataSites = this.state.data_tech_boq_sites;
    }
    const dataHeader = this.state.view_tech_header_table;

    let ppIdRow = [
      "Tower ID",
      "Tower Name",
      "Program",
      "SOW",
      "Type",
      "Configuration BOQ",
      "SAP NUmber",
      "Qty",
    ];

    ws.addRow(ppIdRow);
    for (let i = 0; i < dataSites.length; i++) {
      let qtyConfig = [];
      if (
        this.state.version_selected !== null &&
        dataTech.version !== this.state.version_selected
      ) {
        for (let j = 0; j < dataSites[i].siteItemConfigVersion.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].site_name,
            dataSites[i].program,
            dataSites[i].sow,
            dataSites[i].siteItemConfigVersion[j].config_type,
            dataSites[i].siteItemConfigVersion[j].config_id,
            dataSites[i].siteItemConfigVersion[j].sap_number,
            dataSites[i].siteItemConfigVersion[j].qty,
          ]);
        }
      } else {
        for (let j = 0; j < dataSites[i].siteItemConfig.length; j++) {
          ws.addRow([
            dataSites[i].site_id,
            dataSites[i].site_name,
            dataSites[i].program,
            dataSites[i].sow,
            dataSites[i].siteItemConfig[j].config_type,
            dataSites[i].siteItemConfig[j].config_id,
            dataSites[i].siteItemConfig[j].sap_number,
            dataSites[i].siteItemConfig[j].qty,
          ]);
        }
      }
    }

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([MRFormat]),
      "Technical BOQ " + dataTech.no_tech_boq + " Vertical.xlsx"
    );
  };

  render() {
    console.log(
      "length",
      Config_group_DEFAULT.length,
      Config_group_type_DEFAULT.length
    );
    if (this.state.redirectSign !== false) {
      return (
        <Redirect to={"/list-technical/detail/" + this.state.redirectSign} />
      );
    }

    function AlertProcess(props) {
      const alert = props.alertAct;
      const message = props.messageAct;
      if (alert == "failed") {
        return (
          <div className="alert alert-danger" role="alert">
            {message.length !== 0
              ? message
              : "Sorry, there was an error when we tried, please reload your page and try again try again"}
          </div>
        );
      } else {
        if (alert == "success") {
          return (
            <div className="alert alert-success" role="alert">
              {message}
              Your Action was Success, please Reload your page
            </div>
          );
        } else {
          return <div></div>;
        }
      }
    }

    return (
      <div>
        <AlertProcess
          alertAct={this.state.action_status}
          messageAct={this.state.action_message}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardHeader>
                {this.state.data_item.length === 0 &&
                this.state.API_Tech.no_boq_tech === undefined &&
                this.props.match.params.id == undefined ? (
                  <React.Fragment>
                    <span>Create Technical BOQ</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span style={{ marginTop: "3px", position: "absolute" }}>
                      Detail Technical BOQ
                    </span>
                    <div
                      className="card-header-actions"
                      style={{ display: "inline-flex" }}
                    >
                      <Col>
                        <Dropdown
                          isOpen={this.state.dropdownOpen[0]}
                          toggle={() => {
                            this.toggleDropdown(0);
                          }}
                        >
                          <DropdownToggle caret color="secondary" size="sm">
                            <i className="fa fa-download" aria-hidden="true">
                              {" "}
                              &nbsp;{" "}
                            </i>
                            Download Technical File
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header> Technical File</DropdownItem>
                            <DropdownItem onClick={this.exportTechnical}>
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Report
                            </DropdownItem>
                            <DropdownItem
                              onClick={this.exportFormatTechnicalHorizontal}
                            >
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Horizontal
                            </DropdownItem>
                            <DropdownItem
                              onClick={this.exportFormatTechnicalVertical}
                            >
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Vertical
                            </DropdownItem>
                            <DropdownItem
                              onClick={
                                this.exportFormatTechnicalVerticalUploader
                              }
                            >
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Delivery Vertical Format
                            </DropdownItem>
                            <DropdownItem
                              onClick={
                                this
                                  .exportFormatTechnicalVerticalUploaderCommercial
                              }
                            >
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Commercial Vertical Format
                            </DropdownItem>
                            <DropdownItem onClick={this.exportFormatTechnical}>
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Delivery Format
                            </DropdownItem>
                            <DropdownItem
                              onClick={this.exportFormatTechnicalCommercial}
                            >
                              {" "}
                              <i
                                className="fa fa-file-text-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Technical Commercial Format
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                      <Col>
                        <Dropdown
                          isOpen={this.state.dropdownOpen[1]}
                          toggle={() => {
                            this.toggleDropdown(1);
                          }}
                        >
                          <DropdownToggle caret color="primary" size="sm">
                            <i className="fa fa-download" aria-hidden="true">
                              {" "}
                              &nbsp;{" "}
                            </i>
                            Update
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={this.toggleUpload}
                              value="Delivery"
                              id="toggleCollapse1"
                            >
                              <i className="fas fa-edit" aria-hidden="true">
                                {" "}
                              </i>{" "}
                              &nbsp;Qty Delivery
                            </DropdownItem>
                            <DropdownItem
                              onClick={this.toggleUpload}
                              value="Commercial"
                              id="toggleCollapse1"
                            >
                              <i className="fas fa-edit" aria-hidden="true">
                                {" "}
                              </i>{" "}
                              &nbsp;Qty Commercial
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </div>
                  </React.Fragment>
                )}
              </CardHeader>
              <CardBody className="card-UploadBoq">
                <React.Fragment>
                  <div>
                    {this.state.data_item.length === 0 &&
                    this.state.API_Tech.no_boq_tech === undefined &&
                    this.props.match.params.id == undefined ? (
                      <React.Fragment>
                        <Row></Row>
                        <div
                          style={{
                            display: "flex",
                            marginBottom: "10px",
                            marginLeft: "15px",
                          }}
                        >
                          <span style={{ width: "135px", marginTop: "10px" }}>
                            Format Uploader :
                          </span>
                          <Input
                            style={{ width: "125px" }}
                            id="format_uploader"
                            name="format_uploader"
                            type="select"
                            value={this.state.format_uploader}
                            onChange={this.handleChangeFormatUploader}
                          >
                            <option value={null}></option>
                            <option value="Horizontal">Horizontal</option>
                            <option value="Vertical">Vertical</option>
                          </Input>
                        </div>
                        <input
                          type="file"
                          onChange={this.fileHandlerTechnical.bind(this)}
                          style={{
                            padding: "10px 10px 5px 10px",
                            visiblity: "hidden",
                          }}
                          disable={this.state.format_uploader !== null}
                        />
                        <Button
                          className="btn-success"
                          style={{ float: "right", margin: "8px" }}
                          color="success"
                          onClick={this.saveTechBoq}
                          disabled={
                            this.state.action_status === "failed" ||
                            this.state.result_check_tech === null
                          }
                        >
                          {this.state.rowsTech.length == 0
                            ? "Save"
                            : this.state.result_check_tech !== null
                            ? "Save"
                            : "Loading.."}
                        </Button>
                        <Row>
                          <Col md="4">
                            <div style={{ display: "flex", marginTop: "10px" }}>
                              <span
                                style={{ width: "135px", marginTop: "10px" }}
                              >
                                Project :
                              </span>
                              <Input
                                name="project"
                                type="select"
                                onChange={this.selectProject}
                                value={this.state.project_select}
                              >
                                <option value=""></option>
                                {this.state.project_all.map((project) => (
                                  <option value={project._id}>
                                    {project.Project}
                                  </option>
                                ))}
                              </Input>
                            </div>
                          </Col>
                        </Row>
                        <hr className="upload-line"></hr>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {this.state.data_tech_boq !== null ? (
                      <Collapse
                        isOpen={this.state.collapse}
                        onEntering={this.onEntering}
                        onEntered={this.onEntered}
                        onExiting={this.onExiting}
                        onExited={this.onExited}
                      >
                        <CardBody style={{ padding: "5px" }}>
                          <Row>
                            <Col>
                              <div
                                style={{
                                  display: "inline-flex",
                                  marginBottom: "20px",
                                }}
                              >
                                <span
                                  style={{ width: "135px", marginTop: "10px" }}
                                >
                                  Format Uploader :
                                </span>
                                <Input
                                  style={{ width: "125px" }}
                                  id="format_uploader"
                                  name="format_uploader"
                                  type="select"
                                  value={this.state.format_uploader}
                                  onChange={this.handleChangeFormatUploader}
                                >
                                  <option value={null}></option>
                                  <option value="Horizontal">Horizontal</option>
                                  <option value="Vertical">Vertical</option>
                                </Input>
                              </div>
                              <div style={{ display: "inline-flex" }}>
                                <span style={{ width: "135px" }}>
                                  Qty {this.state.update_qty_for} :
                                </span>
                                <span>
                                  <Input
                                    type="file"
                                    onChange={this.fileHandlerTechnical.bind(
                                      this
                                    )}
                                  />
                                </span>
                              </div>
                            </Col>
                            {this.state.data_tech_boq.list_of_commercial.filter(
                              (e) => e.comm_boq_status !== "OBSOLETE"
                            ).length !== 0 ? (
                              <Col>
                                <div>
                                  <React.Fragment>
                                    <Button
                                      style={{ float: "right" }}
                                      color="warning"
                                      onClick={this.toggleUpdateInfo}
                                      value="save"
                                      disabled={
                                        this.state.action_status === "failed" ||
                                        this.state.result_check_tech === null
                                      }
                                    >
                                      <i className="fa fa-paste">
                                        &nbsp;&nbsp;
                                      </i>
                                      {this.state.rowsTech.length === 0
                                        ? "Save"
                                        : this.state.result_check_tech !== null
                                        ? "Save"
                                        : "Loading.."}
                                    </Button>
                                  </React.Fragment>
                                  <Button
                                    style={{
                                      float: "right",
                                      marginRight: "8px",
                                    }}
                                    color="success"
                                    onClick={this.toggleUpdateInfo}
                                    value="revision"
                                    disabled={
                                      this.state.action_status === "failed" ||
                                      this.state.result_check_tech === null
                                    }
                                  >
                                    <i className="fa fa-copy">&nbsp;&nbsp;</i>
                                    {this.state.rowsTech.length === 0
                                      ? "Revision"
                                      : this.state.result_check_tech !== null
                                      ? "Revision"
                                      : "Loading.."}
                                  </Button>
                                </div>
                              </Col>
                            ) : (
                              <Col>
                                <div>
                                  <React.Fragment>
                                    <Button
                                      style={{ float: "right" }}
                                      color="warning"
                                      onClick={this.toggleSave}
                                      value="save"
                                      disabled={
                                        this.state.action_status === "failed" ||
                                        this.state.result_check_tech === null
                                      }
                                    >
                                      <i className="fa fa-paste">
                                        &nbsp;&nbsp;
                                      </i>
                                      {this.state.rowsTech.length === 0
                                        ? "Save"
                                        : this.state.result_check_tech !== null
                                        ? "Save"
                                        : "Loading.."}
                                    </Button>
                                  </React.Fragment>
                                  <Button
                                    style={{
                                      float: "right",
                                      marginRight: "8px",
                                    }}
                                    color="success"
                                    onClick={this.toggleRevised}
                                    value="revision"
                                    disabled={
                                      this.state.action_status === "failed" ||
                                      this.state.result_check_tech === null
                                    }
                                  >
                                    <i className="fa fa-copy">&nbsp;&nbsp;</i>
                                    {this.state.rowsTech.length === 0
                                      ? "Revision"
                                      : this.state.result_check_tech !== null
                                      ? "Revision"
                                      : "Loading.."}
                                  </Button>
                                </div>
                              </Col>
                            )}
                          </Row>
                          {this.state.API_Tech.project_name === null ? (
                            <Row style={{ marginTop: "10px" }}>
                              <Col>
                                <div>
                                  <Input
                                    name="project"
                                    type="select"
                                    onChange={this.selectProject}
                                    value={this.state.project_select}
                                  >
                                    <option value=""></option>
                                    {this.state.project_all.map((project) => (
                                      <option value={project._id}>
                                        {project.Project}
                                      </option>
                                    ))}
                                  </Input>
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <Button onClick={this.saveProjecttoDB}>
                                    Save Project
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                          <hr className="upload-line"></hr>
                        </CardBody>
                      </Collapse>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}

                    {this.state.data_item.length !== 0 ? (
                      this.state.API_Tech.list_of_id_boq_comm.length !== 0 ? (
                        <Collapse
                          isOpen={this.state.collapse}
                          onEntering={this.onEntering}
                          onEntered={this.onEntered}
                          onExiting={this.onExiting}
                          onExited={this.onExited}
                        >
                          <CardBody style={{ padding: "5px" }}>
                            <Row>
                              <Col>
                                <div>
                                  <Input
                                    type="file"
                                    onChange={this.fileHandlerTechnical.bind(
                                      this
                                    )}
                                  />
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <Button
                                    style={{ float: "right", margin: "8px" }}
                                    color="secondary"
                                    onClick={this.revisionTech}
                                    disabled={
                                      this.state.action_status === "failed"
                                    }
                                  >
                                    <i className="fa fa-copy">&nbsp;&nbsp;</i>
                                    {this.state.rowsTech.length == 0
                                      ? "Revision"
                                      : this.state.data_format.length !== 0
                                      ? "Revision"
                                      : "Loading.."}
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                            <hr className="upload-line"></hr>
                          </CardBody>
                        </Collapse>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </div>
                </React.Fragment>
                {/*  )} */}
                {this.state.data_tech_boq !== null && (
                  <React.Fragment>
                    <Row>
                      <Col sm="12" md="12">
                        <table
                          style={{
                            width: "100%",
                            marginBottom: "0px",
                            marginLeft: "10px",
                          }}
                        >
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
                                TECHNICAL BOQ
                              </td>
                            </tr>
                            <tr
                              style={{
                                fontWeight: "390",
                                fontSize: "15px",
                                fontStyle: "oblique",
                              }}
                            >
                              <td
                                colSpan="2"
                                style={{
                                  textAlign: "center",
                                  marginBottom: "10px",
                                  fontWeight: "500",
                                }}
                              >
                                Doc : {this.state.data_tech_boq.no_tech_boq}
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
                    <Row>
                      <Col sm="6" md="6">
                        <div style={{ marginLeft: "10px" }}>
                          <table
                            style={{ width: "100%", marginBottom: "5px" }}
                            className="table-header"
                          >
                            <tbody>
                              <tr
                                style={{ fontWeight: "425", fontSize: "15px" }}
                              >
                                <td style={{ textAlign: "left" }}>Version</td>
                                <td style={{ textAlign: "left" }}>:</td>
                                <td style={{ textAlign: "left" }} colspan={2}>
                                  <Input
                                    type="select"
                                    value={
                                      this.state.version_selected === null
                                        ? this.state.data_tech_boq.version
                                        : this.state.version_selected
                                    }
                                    onChange={this.handleChangeVersion}
                                    style={{ width: "100px", height: "30px" }}
                                  >
                                    {this.state.list_version.map((e, i) => (
                                      <option value={i}>{i}</option>
                                    ))}
                                  </Input>
                                </td>
                              </tr>
                              <tr
                                style={{ fontWeight: "425", fontSize: "15px" }}
                              >
                                <td style={{ textAlign: "left" }}>
                                  Created On &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td style={{ textAlign: "left" }}>:</td>
                                <td style={{ textAlign: "left" }} colspan={2}>
                                  {convertDateFormatfull(
                                    this.state.data_tech_boq.created_on
                                  )}
                                </td>
                              </tr>
                              <tr
                                style={{ fontWeight: "425", fontSize: "15px" }}
                              >
                                <td>&nbsp; </td>
                                <td></td>
                                <td></td>
                                <td style={{ paddingLeft: "5px" }}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                      <Col sm="6" md="6">
                        <div style={{ marginTop: "3px", marginLeft: "10px" }}>
                          <table
                            style={{ width: "100%", marginBottom: "5px" }}
                            className="table-header"
                          >
                            <tbody>
                              <tr
                                style={{ fontWeight: "425", fontSize: "15px" }}
                              >
                                <td style={{ textAlign: "left" }}>Project </td>
                                <td style={{ textAlign: "left" }}>:</td>
                                <td style={{ textAlign: "left" }} colspan={2}>
                                  {this.state.data_tech_boq.project_name}
                                </td>
                              </tr>
                              <tr
                                style={{ fontWeight: "425", fontSize: "15px" }}
                              >
                                <td style={{ textAlign: "left" }}>
                                  Updated On{" "}
                                </td>
                                <td style={{ textAlign: "left" }}>:</td>
                                <td style={{ textAlign: "left" }} colspan={2}>
                                  {convertDateFormatfull(
                                    this.state.data_tech_boq.updated_on
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
                {this.state.data_tech_boq_sites.length === 0 &&
                this.state.data_tech_boq === null &&
                this.props.match.params.id === undefined ? (
                  <Table hover bordered striped responsive size="sm">
                    <tbody>
                      {this.state.rowsTech.map((row) => (
                        <tr>
                          {row.map((col) => (
                            <td>{col}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <React.Fragment>
                    {this.state.version_selected !== null &&
                    this.state.data_tech_boq.version !==
                      this.state.version_selected ? (
                      <TableTechnicalConfig
                        dataTechBoqSites={
                          this.state.data_tech_boq_sites_version
                        }
                        configHeader={
                          this.state.option_tssr_header_view === "only_filled"
                            ? this.state.view_tech_header_table
                            : this.state.view_tech_all_header_table
                        }
                        isVersion="rollback"
                      />
                    ) : (
                      <TableTechnicalConfig
                        dataTechBoqSites={
                          this.state.data_tech_boq_sites_pagination
                        }
                        configHeader={
                          this.state.option_tssr_header_view === "only_filled"
                            ? this.state.view_tech_header_table
                            : this.state.view_tech_all_header_table
                        }
                      />
                    )}
                    <nav>
                      <div>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={this.state.perPage}
                          totalItemsCount={
                            this.state.data_tech_boq_sites.length
                          }
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                          itemClass="page-item"
                          linkClass="page-link"
                        />
                      </div>
                    </nav>
                  </React.Fragment>
                )}
              </CardBody>
              <CardFooter>
                <div style={{ display: "flex" }}>
                  {this.state.data_tech_boq !== null && (
                    <Row>
                      <Col>
                        <Button
                          size="sm"
                          className="btn-success"
                          style={{ float: "left" }}
                          color="success"
                          value={"1"}
                          onClick={this.approvalTechnical}
                          disabled={
                            this.state.data_tech_boq.approval_status !==
                            "PRE APPROVAL"
                          }
                        >
                          {this.state.data_tech_boq.approval_status ===
                          "PRE APPROVAL"
                            ? "Submit"
                            : "Tech Submitted"}
                        </Button>
                      </Col>
                    </Row>
                  )}
                  {this.state.data_tech_boq !== null &&
                    (this.state.data_tech_boq.approval_status ===
                      "REQUEST FOR APPROVAL" ||
                      this.state.data_tech_boq.approval_status ===
                        "APPROVED") && (
                      <Row>
                        <Col>
                          <Button
                            size="sm"
                            className="btn-success"
                            style={{ float: "left", marginLeft: "10px" }}
                            color="success"
                            value={"2"}
                            onClick={this.approvalTechnical}
                            disabled={
                              this.state.data_tech_boq.approval_status !==
                              "REQUEST FOR APPROVAL"
                            }
                          >
                            {this.state.data_tech_boq.approval_status ===
                            "REQUEST FOR APPROVAL"
                              ? "Approve"
                              : "Tech Approved"}
                          </Button>
                        </Col>
                      </Row>
                    )}
                  {this.state.data_tech_boq !== null && (
                    <Row>
                      {this.state.data_tech_boq.tssr_approval_status ===
                        "NOT SUBMITTED" ||
                      this.state.data_tech_boq.tssr_approval_status ===
                        "TSSR CONFIRMED WITH GAP" ? (
                        <Col>
                          <Button
                            size="sm"
                            className="btn-success"
                            style={{ float: "left", marginLeft: "10px" }}
                            color="success"
                            value="4"
                            onClick={this.submitTSSR}
                            disabled={false}
                          >
                            {this.state.data_tech_boq.tssr_approval_status ===
                              "NOT SUBMITTED" ||
                            this.state.data_tech_boq.tssr_approval_status ===
                              "TSSR CONFIRMED WITH GAP"
                              ? "Submit to TSSR"
                              : "TSSR Submitted"}
                          </Button>
                        </Col>
                      ) : (
                        <Col>
                          <Button
                            size="sm"
                            className="btn-success"
                            style={{ float: "left", marginLeft: "10px" }}
                            color="success"
                            value="4"
                            onClick={this.submitTSSR}
                            disabled={true}
                          >
                            {this.state.data_tech_boq.tssr_approval_status ===
                              "NOT SUBMITTED" ||
                            this.state.data_tech_boq.tssr_approval_status ===
                              "TSSR CONFIRMED WITH GAP"
                              ? "Submit to TSSR"
                              : "TSSR Submitted"}
                          </Button>
                        </Col>
                      )}
                    </Row>
                  )}
                </div>
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
            <div style={{ textAlign: "center" }}>
              {this.state.loading_checking !== null
                ? this.state.loading_checking
                : "Loading..."}
            </div>
            <div style={{ textAlign: "center" }}>
              System is{" "}
              {this.state.loading_checking !== null
                ? "checking your upload file"
                : "processing ..."}
            </div>
            <div style={{ textAlign: "center" }}>
              {this.state.progress_count} / {this.state.progress_data}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal confirmation save */}
        <ModalDelete
          isOpen={this.state.save_confirmation}
          toggle={this.toggleSave}
          className={"modal-warning " + this.props.className}
          title={"Save and Replace "}
          body={
            "This action will save and replace " +
            this.state.selected_id +
            ". Are you sure ?"
          }
        >
          <Button color="warning" onClick={this.updateTechBoq} value="save">
            Yes
          </Button>
          <Button color="secondary" onClick={this.toggleSave}>
            Cancel
          </Button>
        </ModalDelete>

        {/* Modal confirmation revised */}
        <ModalDelete
          isOpen={this.state.revise_confirmation}
          toggle={this.toggleRevised}
          className={"modal-success " + this.props.className}
          title={"Make Revise "}
          body={
            "This action will add revision version " +
            "'" +
            this.state.selected_version +
            "'" +
            " on " +
            this.state.selected_id +
            " . Are you sure ?"
          }
        >
          <Button color="success" onClick={this.updateTechBoq} value="revision">
            Yes
          </Button>
          <Button color="secondary" onClick={this.toggleRevised}>
            Cancel
          </Button>
        </ModalDelete>

        {/* Modal Delete */}
        <Modal
          isOpen={this.state.modal_update_info}
          toggle={this.toggleUpdateInfo}
          className={"modal-sm " + this.props.className}
        >
          <ModalBody>
            <div style={{ textAlign: "center", margin: "15px 0 20px 0" }}>
              <span style={{ fontWeight: "500", fontSize: "15px" }}>
                Update this Technical BOQ can delete Commercial BOQ related with
                this Technical BOQ{" "}
              </span>
            </div>
            <div style={{ textAlign: "center", margin: "15px 0 20px 0" }}>
              <span style={{ fontWeight: "500", fontSize: "15px" }}></span>
            </div>
            <div style={{ textAlign: "center" }}>
              {this.state.submission_number_selected}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="warning"
              onClick={this.updateTechBoq}
              value={this.state.update_type}
            >
              {this.state.update_type}
            </Button>
            <Button color="secondary" onClick={this.toggleUpdateInfo}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Delete */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(TechnicalBoq);
