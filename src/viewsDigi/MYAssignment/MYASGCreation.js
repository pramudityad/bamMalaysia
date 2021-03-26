import React, { Component, Fragment } from "react";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  Input,
  CardFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { Form, FormGroup, Label, FormText } from "reactstrap";
import Pagination from "react-js-pagination";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { convertDateFormat } from "../../helper/basicFunction";
import ModalCreateNew from "../Component/ModalCreateNew";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "./LMRMY.css";
import { getDatafromAPINODE, postDatatoAPINODE, generateTokenACT } from "../../helper/asyncFunctionDigi";
import { connect } from "react-redux";
import { number } from "prop-types";
import debounce from 'lodash.debounce';
import SweetAlert from 'react-bootstrap-sweetalert';
import './LMRMY.css';

const DefaultNotif = React.lazy(() =>
  import("../DefaultView/DefaultNotif")
);

class MYASGCreation extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    date.setDate(date.getDate() + 7);

    this.state = {
      roleUser: this.props.dataLogin.role,
      tokenUser: this.props.dataLogin.token,
      lmr_form: {
        // pgr: "MP2",
        gl_account: "",
        lmr_issued_by: this.props.dataLogin.userName,
        item_category: "Service",
        pgr: "MY3",
        // lmr_issued_by: "EHAYZUX",
        total_price: 0,
        plant: "2172",
        customer: "CELCOM",
        request_type: "Add LMR",
      },
      createModal: true,
      lmr_edit: true,
      modal_loading: false,
      modal_material: false,
      modal_material_NRO: false,
      modal_material_NDO: false,
      modal_material_survey: false,
      modal_material_integration: false,
      modal_material_HW: false,
      modal_material_ARP: false,
      modal_package: false,
      modal_check_material_package: false,
      list_project: [],
      creation_lmr_child_form: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      form_checking: {},
      list_cd_id: [],
      cd_id_selected: "",
      data_cd_id_selected: null,
      redirectSign: false,
      action_status: null,
      action_message: null,
      vendor_list: [],
      material_list: [],
      project_list: [],
      package_list: [],
      check_material_package_list: {},
      lmr_child_package: {
        activity: "5640",
        nw: "",
        site_id: "",
        currency: "MYR",
        tax_code: "I0",
        delivery_date: convertDateFormat(date)
      },
      validation_form: {},
      current_material_select: null,
      data_user: this.props.dataUser,
      filter_list: new Array(8).fill(""),
      filter_list_package: new Array(4).fill(""),
      mm_data_type: "",
      matfilter: {
        mat_type: "",
        region: "",
      },
      hide_region: false,
      vendor_selected: "",
      custom_site_display: "",
      custom_gl_display: "",
      so_nw_updated: "",
      getrole: "",
      list_cd_id_act: [],
      list_fas: [],
      options: [],
      formvalidate: {},
      count_form_validate: [],
      list_wp_id: [],
      region_package: null,
      redirectSign: false,
      key_child: 0,
      header_data: {},
      child_data: {},
      check_draft: false,
      sweet_alert: null,
      access_token: null
    };
    this.handleChangeCD = this.handleChangeCD.bind(this);
    this.loadOptionsCDID = this.loadOptionsCDID.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.handleChangeFormLMR = this.handleChangeFormLMR.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.createLMR = this.createLMR.bind(this);
    this.handleChangeVendor = this.handleChangeVendor.bind(this);
    this.handleChangeFormLMRChild = this.handleChangeFormLMRChild.bind(this);
    this.toggleMaterial = this.toggleMaterial.bind(this);
    this.handleChangeMaterial = this.handleChangeMaterial.bind(this);
    this.deleteLMR = this.deleteLMR.bind(this);
    this.handleMaterialFilter = this.handleMaterialFilter.bind(this);
    this.decideFilter = this.decideFilter.bind(this);
    this.onChangeDebouncedPackage = debounce(this.onChangeDebouncedPackage, 500);
  }

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  getPackageList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list_package[0] !== "" && (filter_array.push('"Package_Id":{"$regex" : "' + this.state.filter_list_package[0] + '", "$options" : "i"}'));
    this.state.filter_list_package[1] !== "" && (filter_array.push('"Package_Name":{"$regex" : "' + this.state.filter_list_package[1] + '", "$options" : "i"}'));
    if (this.state.region_package !== null) {
      filter_array.push('"Region":"' + this.state.region_package + '"');
    }
    if (this.state.lmr_form.gl_account_actual === 'ITC + transport - 402603') {
      filter_array.push('"Material_Sub_Type":"ITC %2B Transport"');
    } else {
      const material_sub_type = this.state.lmr_form.gl_account_actual.split(" - ");
      filter_array.push('"Material_Sub_Type":"' + material_sub_type[0] + '"');
    }
    let whereAnd = '{' + filter_array.join(',') + '}';
    getDatafromAPINODE('/package/getPackage?srt=_id:-1&q=' + whereAnd + '&lmt=' + maxPage + '&pg=' + page, this.state.tokenUser).then(res => {
      console.log("Package List", res);
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ package_list: items, totalData: totalData });
      }
    })
  }

  decideToggleMaterial = (number_child_form) => {
    // let Mat_type = this.state.creation_lmr_child_form[number_child_form]
    //   .material_type;
    let Mat_type = this.state.mm_data_type;
    console.log(Mat_type);
    switch (Mat_type) {
      case "ITC + transport":
        this.toggleMaterialNRO(number_child_form);
        break;
      case "NDO":
        this.toggleMaterialNDO(number_child_form);
        break;
      case "Survey":
        this.toggleMaterialSurvey(number_child_form);
        break;
      case "Integration":
        this.toggleMaterialIntegration(number_child_form);
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
      this.setState({ current_material_select: number_child_form }, () => this.getMaterialListNRO(number_child_form));
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_NRO: !prevState.modal_material_NRO,
    }));
  };

  toggleMaterialNDO = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.setState({ current_material_select: number_child_form }, () => this.getMaterialListNDO(number_child_form));
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_NDO: !prevState.modal_material_NDO,
    }));
  };

  toggleMaterialSurvey = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.setState({ current_material_select: number_child_form }, () => this.getMaterialListSurvey(number_child_form));
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_survey: !prevState.modal_material_survey,
    }));
  };

  toggleMaterialIntegration = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.setState({ current_material_select: number_child_form }, () => this.getMaterialListIntegration(number_child_form));
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material_integration: !prevState.modal_material_integration,
    }));
  };

  toggleModalPackage = () => {
    if (this.state.count_form_validate.length === 0) {
      this.getPackageList();
      this.setState((prevState) => ({
        modal_package: !prevState.modal_package,
      }));
    } else {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please fill all required fields first!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });
    }
  }

  hideAlert() {
    this.setState({
      sweet_alert: null
    });
  }

  toggleModalCheckMaterialPackage = () => {
    this.setState((prevState) => ({
      modal_check_material_package: !prevState.modal_check_material_package,
    }));
  }

  async postDatatoAPINODE(url, data) {
    try {
      let respond = await axios.post(
        process.env.REACT_APP_API_URL_NODE_Digi + url,
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

  async getDatafromAPIMY(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_Digi + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: process.env.REACT_APP_usernameMAS,
          password: process.env.REACT_APP_passwordMAS,
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

  async getFASfromACT(proxyurl, url) {
    const fas_reqbody = {
      query_param: {
        table: "p_digi_madd_m_site_data",
        columns: [
          "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"70b54a94-8b77-11eb-8bb2-000d3aa2f57d\".\"value\"')) as fas_id"
        ],
        join: {},
        condition: {},
        pagination: "all",
        page_target: 1,
        length_per_page: 10,
      },
    };
    try {
      let respond = await axios.post(proxyurl + url, fas_reqbody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token,
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

  async getWPfromACT(proxyurl, url, param) {
    try {
      let body = {
        "query_param": {
          "table": "p_digi_madd_m_site_data",
          "columns": [
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0edbe63-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as workplan_id",
            // "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0ef9d14-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as project_name",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"298dc641-8adf-11eb-9de5-000d3aa2f57d\".\"value\"')) as project_name",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0f139d6-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as cd_id",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0f4efd9-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as site_id",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0f81a00-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as site_name",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"208380b6-87b3-11eb-9de5-000d3aa2f57d\".\"value\"')) as region",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0fb474f-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as lmr_survey_nw_number",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0feffd5-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as lmr_survey_number",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c10794d4-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as lmr_ti_nw_number",
            "JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c10aade8-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) as lmr_ti_number"
          ],
          "join": {},
          "condition": {
            ["JSON_UNQUOTE(JSON_EXTRACT(p_digi_madd_m_site_data.custom_property, '$.\"c0edbe63-8616-11eb-9b96-000d3aa2f57d\".\"value\"')) like '%" + param + "%' "]: null
          },
          "pagination": "page",
          "page_target": 1,
          "length_per_page": 1000
        }
      }
      let respond = await axios.post(proxyurl + url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond WP", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond WP", err);
      return respond;
    }
  }

  async findByWPfromACT(proxyurl, url) {
    try {
      let respond = await axios.get(proxyurl + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond find WP", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond find WP", err);
      return respond;
    }
  }

  async updateLMRtoACT(proxyurl, url, m_id, lmr_id, lmr_date) {
    try {
      let param = '', date = '';
      if (this.state.lmr_form.gl_account_actual === 'ITC + transport - 402603') {
        param = 'ti_lmr_number';
        date = 'ti_lmr_date';
      } else if (this.state.lmr_form.gl_account_actual === 'Survey - 402603') {
        param = 'survey_lmr_number';
        date = 'survey_lmr_date';
      } else if (this.state.lmr_form.gl_account_actual === 'NDO - 402603') {
        param = 'ndo_lmr_number';
        date = 'ndo_lmr_date';
      } else if (this.state.lmr_form.gl_account_actual === 'Integration - 402603') {
        param = 'integration_lmr_number';
        date = 'integration_lmr_date';
      }
      let body = {
        "m_id": m_id,
        "query_param": {
          [param]: lmr_id,
          [date]: lmr_date
        }
      }
      let respond = await axios.patch(proxyurl + url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.access_token,
        },
      });
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond update", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond update", err);
      return respond;
    }
  }

  searchWPID = async (inputValue) => {
    if (inputValue === '' || inputValue.length < 3) {
      return [];
    } else {
      let wp_id_option = [];
      let wp_id_list = [];
      let getWPID = await this.getWPfromACT("https://dev-corsanywhere.e-dpm.com/", "https://api.act.e-dpm.com/api/get_data_auth", inputValue);
      if (getWPID !== undefined && getWPID.data !== undefined) {
        getWPID.data.result.raw_data.map(e => wp_id_option.push({ label: e.workplan_id, value: e.workplan_id }));
        wp_id_list = getWPID.data.result.raw_data;
      }
      console.log('array wp', wp_id_list)
      this.setState({ list_wp_id: wp_id_list });
      return wp_id_option;
    }
  }

  handleChangeWP = async (e, action) => {
    this.toggleLoading();
    let dataLMR = this.state.creation_lmr_child_form;
    let idxField = action.name.split(" /// ");
    let value = e.value;
    let idx = idxField[0];
    let field = idxField[1];
    dataLMR[parseInt(idx)][field] = value;
    const list_wp_id = this.state.list_wp_id;
    dataLMR[parseInt(idx)]["project_name"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].project_name : "";
    dataLMR[parseInt(idx)]["cdid"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].cd_id : "";
    if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Central') {
      dataLMR[parseInt(idx)]["region"] = "KV";
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Northern' || list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Southern') {
      dataLMR[parseInt(idx)]["region"] = "SN";
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Eastern') {
      dataLMR[parseInt(idx)]["region"] = "ER";
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Sabah' || list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Sarawak') {
      dataLMR[parseInt(idx)]["region"] = "EM";
    }
    dataLMR[parseInt(idx)]["site_id"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].site_id : "";
    dataLMR[parseInt(idx)]["site_name"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].site_name : "";
    dataLMR[parseInt(idx)]["nw"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].lmr_ti_nw_number : "";

    let findWPID = await this.getWPfromACT("https://dev-corsanywhere.e-dpm.com/", "https://act.e-dpm.com/api/find_by_wpid?wp_id=" + value);
    if (findWPID !== undefined && findWPID.data !== undefined && findWPID.data.result !== undefined && findWPID.data.result.status >= 200 && findWPID.data.result.status <= 300) {
      dataLMR[parseInt(idx)]["m_id_wp"] = findWPID.data.result.m_id;
    } else {
      dataLMR[parseInt(idx)]["m_id_wp"] = "";
    }

    this.setState({ creation_lmr_child_form: dataLMR }, () =>
      console.log(this.state.creation_lmr_child_form)
    );
    this.toggleLoading();
  }

  handleChangeWPPackage = async (e, action) => {
    this.toggleLoading();
    let dataLMR = this.state.lmr_child_package;
    let value = e.value;
    let field = action.name;
    dataLMR[field] = value;
    const list_wp_id = this.state.list_wp_id;
    dataLMR["project_name"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].project_name : "";
    dataLMR["cdid"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].cd_id : "";
    if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Central') {
      dataLMR["region"] = "KV";
      this.setState({ region_package: "KV" }, () => this.getPackageList());
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Northern' || list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Southern') {
      dataLMR["region"] = "SN";
      this.setState({ region_package: "SN" }, () => this.getPackageList());
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Eastern') {
      dataLMR["region"] = "ER";
      this.setState({ region_package: "ER" }, () => this.getPackageList());
    } else if (list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Sabah' || list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].region === 'Sarawak') {
      dataLMR["region"] = "EM";
      this.setState({ region_package: "EM" }, () => this.getPackageList());
    }
    dataLMR["site_id"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].site_id : "";
    dataLMR["site_name"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].site_name : "";
    dataLMR["nw"] = value !== "" ? list_wp_id[list_wp_id.findIndex(x => x.workplan_id === value)].lmr_ti_nw_number : "";

    let findWPID = await this.getWPfromACT("https://dev-corsanywhere.e-dpm.com/", "https://act.e-dpm.com/api/find_by_wpid?wp_id=" + value);
    if (findWPID !== undefined && findWPID.data !== undefined && findWPID.data.result !== undefined && findWPID.data.result.status >= 200 && findWPID.data.result.status <= 300) {
      dataLMR["m_id_wp"] = findWPID.data.result.m_id;
    } else {
      dataLMR["m_id_wp"] = "";
    }

    this.setState({ lmr_child_package: dataLMR }, () =>
      console.log(this.state.lmr_child_package)
    );
    this.toggleLoading();
  }

  async getDataFromAPINODE(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_NODE_Digi + url, {
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

  getDataCDACT_Fas() {
    this.toggleLoading();
    this.getFASfromACT("https://dev-corsanywhere.e-dpm.com/", "https://api.act.e-dpm.com/api/get_data_auth").then((resCD) => {
      if (resCD.data !== undefined) {
        if (resCD.data.result !== undefined) {
          const list_fas = resCD.data.result.raw_data;
          const Unique_fas = [...new Set(list_fas.map((item) => item.fas_id))];
          this.setState({ list_fas: Unique_fas });
        }
      }
      if (resCD === 500) {
        this.setState({
          action_status: "failed",
          action_message: "Error getting CD Data, please reload the page",
        });
      }
    });
    this.toggleLoading();
  }

  UniqueProject = (listvalue) => {
    const UniqueProject = [...new Set(listvalue.map((item) => item.project))];
    const UniqueFas = [...new Set(listvalue.map((item) => item.fas_id))];
    const addSubProject = UniqueProject.concat([
      ...new Set(listvalue.map((item) => item.sub_project)),
    ]);
    this.setState({ list_project: addSubProject, list_fas: UniqueFas }, () =>
      this.CheckDraft()
    );
  };

  getOptionbyRole1 = (role) => {
    if (role !== undefined) {
      if (
        role.includes("BAM-CPM") === true ||
        role.includes("BAM-Sourcing") === true
      ) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NDO service - 402603">NDO service - 402603</option>
            <option value="NRO local material - 402201">NRO local material - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-IM") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">NRO local material - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-IE Lead") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">NRO local material - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-NDO IM") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NDO service - 402603">NDO service - 402603</option>
          </>
        );
      }
    }
  };

  getOptionbyRole2 = (role) => {
    if (role !== undefined) {
      if (
        role.includes("BAM-CPM") === true ||
        role.includes("BAM-Sourcing") === true
      ) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
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
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO">NRO</option>
          </>
        );
      }
      if (role.includes("BAM-IE Lead") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO Service">NRO Service</option>
            <option value="NRO LM">NRO LM</option>
          </>
        );
      }
      if (role.includes("BAM-MP") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="HW">HW</option>
          </>
        );
      }
      if (role.includes("BAM-PA") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="ARP">ARP</option>
          </>
        );
      }
    }
  };

  getOptionbyRole3 = (role) => {
    if (role !== undefined) {
      if (
        role.includes("BAM-CPM") === true ||
        role.includes("BAM-Sourcing") === true
      ) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="Transport - 402102">Transport - 402102</option>
            <option value="ARP - 402693">ARP - 402693</option>
            <option value="3PP Hardware - 402201">3PP Hardware - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-IM") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="Transport - 402102">Transport - 402102</option>
          </>
        );
      }
      if (role.includes("BAM-PA") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="ARP - 402693">ARP - 402693</option>
          </>
        );
      }
      if (role.includes("BAM-MP") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="3PP Hardware - 402201">3PP Hardware - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-GR-PA") === true) {
        return (
          <>
            <option value="" disabled selected hidden>Select GL Account</option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">NRO local material - 402201</option>
            <option value="Transport - 402102">Transport - 402102</option>
          </>
        );
      }
    }
  };

  async componentDidMount() {
    this.toggleLoading();
    this.getVendorList();
    this.setState({ access_token: await generateTokenACT() }, () => { this.getDataCDACT_Fas(); this.toggleLoading(); });
    // this.getProjectList();
    // this.getMaterialList();
    // this.getDataCDACT(); enable this again later
    // this.getDataCD();
    // this.toggleLoading();
    document.title = "LMR Creation | BAM";
  }

  togglecreateModal = () => {
    this.setState({
      createModal: !this.state.createModal,
      check_draft: false,
    });
  };

  CheckDraft() {
    const header_data = JSON.parse(localStorage.getItem("asp_data"));
    const child_data = JSON.parse(localStorage.getItem("asp_data_child"));
    console.log("draft ", header_data, child_data);
    if (header_data !== null && child_data !== null) {
      this.setState({
        header_data: header_data,
        child_data: child_data,
        check_draft: true,
      });
    }
    return;
  }

  getDraft = () => {
    if (this.state.header_data !== null && this.state.child_data !== null) {
      let headerData = this.state.header_data;
      this.setState({
        lmr_form: this.state.header_data,
        creation_lmr_child_form: this.state.child_data,
        mm_data_type: headerData.mm_data_type,
        createModal: !this.state.createModal,
      });
    }
  };

  handlePageChange(pageNumber) {
    let dataLMR = this.state.creation_lmr_child_form;
    let type_material = this.state.mm_data_type;
    this.setState({ activePage: pageNumber }, () => {
      this.decideFilter(type_material);
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
    });
  }

  onChangeDebounced(e) {
    let dataLMR = this.state.creation_lmr_child_form;
    let type_material = this.state.mm_data_type;
    this.decideFilter(type_material);
  }

  getVendorList() {
    this.getDatafromAPIMY("/vendor_data").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        const vendor_sort = items
          .sort((a, b) => (a.Name > b.Name ? 1 : -1))
          .filter((e) => e.Name !== "");
        this.setState({ vendor_list: vendor_sort });
      }
    });
    // this.setState({vendor_list : vendorList});
  }

  getMaterialListSurvey(number_child_form) {
    let filter_array = [];
    // this.state.creation_lmr_child_form[number_child_form].transport === "yes" && filter_array.push('"BB":"Transport"');
    // vendor
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push('"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]');
    filter_array.push('"Material_Sub_Type":{"$in":["Survey"]}');
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
    filter_array.push('"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"');
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"SoW_Description":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"Unit_Price":' + this.state.filter_list[7]
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

  getMaterialListIntegration(number_child_form) {
    let filter_array = [];
    // this.state.creation_lmr_child_form[number_child_form].transport === "yes" && filter_array.push('"BB":"Transport"');
    // vendor
    // this.state.lmr_form.vendor_code_actual !== "" &&
    //   filter_array.push('"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]');
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push('"$and":[{"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]},{"$or":[{"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"},{"Region":null}]}]');
    filter_array.push('"Material_Sub_Type":{"$in":["Integration"]}');
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
    // filter_array.push('"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"');
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"SoW_Description":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"Unit_Price":' + this.state.filter_list[7]
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

  getMaterialListNDO(number_child_form) {
    let filter_array = [];
    // this.state.creation_lmr_child_form[number_child_form].transport === "yes" && filter_array.push('"BB":"Transport"');
    // vendor
    // this.state.lmr_form.vendor_code_actual !== "" &&
    //   filter_array.push('"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]');
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push('"$and":[{"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]},{"$or":[{"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"},{"Region":null}]}]');
    filter_array.push('"Material_Sub_Type":{"$in":["NDO"]}');
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
    // filter_array.push('"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"');
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list[4] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[5] !== "" &&
      filter_array.push(
        '"SoW_Description":{"$regex" : "' +
        this.state.filter_list[5] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[6] !== "" &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list[6] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[7] !== "" &&
      filter_array.push(
        '"Unit_Price":' + this.state.filter_list[7]
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
    // this.state.lmr_form.vendor_code_actual !== "" &&
    //   filter_array.push('"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]');
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push('"$and":[{"$or":[{"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code_actual + '"},{"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"}]},{"$or":[{"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"},{"Region":null}]}]');
    this.state.mm_data_type !== "" &&
      filter_array.push('"Material_Sub_Type":{"$in":["ITC","Transport","Special Transport"]}');
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
    // filter_array.push('"$or":[{"Region":"' + this.state.creation_lmr_child_form[this.state.current_material_select].region + '"}]');
    this.state.filter_list[3] !== "" &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list[3] +
        '", "$options" : "i"}'
      );
    this.state.filter_list[4] !== "" &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
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
        '"SoW_Description_or_Site_Type":{"$regex" : "' +
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

  handleChangeVendor(e) {
    const value = e.target.value;
    let lmr_form = this.state.lmr_form;
    let dataVendor = this.state.vendor_list.find(
      (e) => e.Vendor_Code === value
    );
    lmr_form["vendor_code_actual"] = dataVendor.Vendor_Code;
    lmr_form["vendor_name"] = dataVendor.Name;
    lmr_form["vendor_address"] = dataVendor.Email;
    lmr_form["payment_term"] = dataVendor.PayT;
    this.setState(
      { lmr_form: lmr_form, vendor_selected: lmr_form["vendor_name"] },
      () => console.log(this.state.lmr_form)
    );
    // console.log(this.state.lmr_form)
  }

  handleChangeCD(e) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    const data_CD = this.state.list_cd_id.find((e) => e._id === value);
    this.setState(
      { cd_id_selected: value, data_cd_id_selected: data_CD },
      () => {
        this.getDataCDProject();
      }
    );
  }

  async loadOptionsCDID(inputValue) {
    if (!inputValue) {
      return [];
    } else {
      let wp_id_list = [];
      // const getSSOWID = await this.getDatafromAPIMY('/ssow_sorted_nonpage?where={"ssow_id":{"$regex":"'+inputValue+'", "$options":"i"}, "sow_type":"'+this.state.list_activity_selected.CD_Info_SOW_Type +'"}');
      const getWPID = await this.getDatafromAPIMY(
        '/custdel_sorted_non_page?where={"WP_ID":{"$regex":"' +
        inputValue +
        '", "$options":"i"}}'
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        getWPID.data._items.map((wp) =>
          wp_id_list.push({
            value: wp.WP_ID,
            label: wp.WP_ID + " ( " + wp.WP_Name + " )",
          })
        );
      }
      return wp_id_list;
    }
  }

  async createLMR() {
    this.toggleLoading();
    const dataForm = this.state.lmr_form;
    const dataChildForm = this.state.creation_lmr_child_form;

    console.log("lmr child ", this.state.creation_lmr_child_form);
    const dataLMR = {
      plant: this.state.lmr_form.plant,
      customer: this.state.lmr_form.customer,
      request_type: this.state.lmr_form.request_type,
      item_category: this.state.lmr_form.item_category,
      lmr_type: this.state.lmr_form.lmr_type,
      plan_cost_reduction: this.state.lmr_form.plan_cost_reduction,
      lmr_issued_by: this.state.lmr_form.lmr_issued_by,
      pgr: this.state.lmr_form.pgr,
      gl_account: this.state.lmr_form.gl_account,
      gl_account_actual: this.state.lmr_form.gl_account_actual,
      id_project_doc: this.state.lmr_form.id_project_doc,
      project_name: dataChildForm[0].project_name,
      header_text: this.state.lmr_form.header_text,
      payment_term: this.state.lmr_form.payment_term,
      vendor_name: this.state.lmr_form.vendor_name,
      vendor_code_actual: this.state.lmr_form.vendor_code_actual,
      vendor_address: this.state.lmr_form.vendor_address,
      lmr_role: this.state.roleUser[1],
      gl_type: this.state.lmr_form.gl_type,
      mm_data_type: this.state.lmr_form.mm_data_type,
      l1_approver: this.state.lmr_form.l1_approver,
      l2_approver: this.state.lmr_form.l2_approver,
      l3_approver: this.state.lmr_form.l3_approver,
      l4_approver: this.state.lmr_form.l4_approver,
      l5_approver: this.state.lmr_form.l5_approver,
      fas_id: this.state.lmr_form.fas_id,
      total_price: this.state.lmr_form.total_price,
    };
    let dataLMRChild = [], empty_nw = false, check_duplicate = false;

    for (let i = 0; i < dataChildForm.length; i++) {
      dataChildForm[i].duplicate = 'no';
      dataChildForm[i].blank_material = 'no';
      dataChildForm[i].zero_qty = 'no';
    }

    for (let i = 0; i < dataChildForm.length; i++) {
      if (dataChildForm[i].material === '') {
        dataChildForm[i].blank_material = 'yes';
      }
    }

    for (let i = 0; i < dataChildForm.length; i++) {
      if (dataChildForm[i].qty === 0) {
        dataChildForm[i].zero_qty = 'yes';
      }
    }

    for (let i = 0; i < dataChildForm.length; i++) {
      for (let j = i + 1; j < dataChildForm.length; j++) {
        if (dataChildForm[i].material === dataChildForm[j].material) {
          check_duplicate = true;
          dataChildForm[i].duplicate = 'yes';
          dataChildForm[j].duplicate = 'yes';
        }
      }

      if (dataChildForm[i].nw === '' || dataChildForm[i].nw === null || dataChildForm[i].cdid === '' || dataChildForm[i].cdid === null) {
        empty_nw = true;
      }

      const dataChild = {
        project_name: dataChildForm[i].project_name,
        nw: dataChildForm[i].nw,
        activity: dataChildForm[i].activity,
        id_project_doc: this.state.lmr_form.id_project_doc,
        material_code_doc: dataChildForm[i].material_code_doc,
        material: dataChildForm[i].material,
        description: dataChildForm[i].description,
        site_id: dataChildForm[i].site_id,
        qty: dataChildForm[i].qty,
        unit_price: dataChildForm[i].unit_price,
        tax_code: dataChildForm[i].tax_code,
        delivery_date: dataChildForm[i].delivery_date,
        total_value: dataChildForm[i].total_value,
        currency: dataChildForm[i].currency,
        pr: "",
        item: 0,
        request_type: this.state.lmr_form.request_type,
        item_category: this.state.lmr_form.item_category,
        lmr_type: this.state.lmr_form.lmr_type,
        plan_cost_reduction: this.state.lmr_form.plan_cost_reduction,
        cdid: dataChildForm[i].cdid,
        // per_site_material_type: dataChildForm[i].Per_Site_Material_Type,
        wp_id: dataChildForm[i].wp_id,
        lmr_type: this.state.lmr_form.LMR_Type,
        gl_type: this.state.lmr_form.gl_type,
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        plant: this.state.lmr_form.plant,
        customer: this.state.lmr_form.customer,
      };
      // if (
      //   dataChildForm[i].site_id === undefined ||
      //   dataChildForm[i].site_id === null
      // ) {
      dataLMRChild.push(dataChild);
      // }
    }

    if (empty_nw) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Empty CD ID and SO / NW cannot be allowed!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });
      this.toggleLoading();
    } else if (check_duplicate) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Material duplication found!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < dataChildForm.length; i++) {
        dataChildForm[i].blank_material = 'no';
        dataChildForm[i].zero_qty = 'no';
      }
      this.toggleLoading();
    } else if (dataChildForm.some(e => e.blank_material === 'yes')) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please select a material first!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < dataChildForm.length; i++) {
        dataChildForm[i].duplicate = 'no';
        dataChildForm[i].zero_qty = 'no';
      }
      this.toggleLoading();
    } else if (dataChildForm.some(e => e.zero_qty === 'yes')) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please input the qty to be more than 0!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < dataChildForm.length; i++) {
        dataChildForm[i].duplicate = 'no';
        dataChildForm[i].blank_material = 'no';
      }
      this.toggleLoading();
    } else {
      console.log("dataLMR", dataLMR);
      console.log("dataLMRChild", dataLMRChild);
      const respondSaveLMR = await this.postDatatoAPINODE("/aspassignment/createOneAspAssignment", { asp_data: dataLMR, asp_data_child: dataLMRChild });
      if (respondSaveLMR.data !== undefined && respondSaveLMR.status >= 200 && respondSaveLMR.status <= 300) {
        localStorage.removeItem("asp_data");
        localStorage.removeItem("asp_data_child");

        let failed_update_wp = [];

        for (let i = 0; i < dataChildForm.length; i++) {
          let date = new Date();
          let updateLMRtoACT = await this.updateLMRtoACT("https://dev-corsanywhere.e-dpm.com/", "https://api.act.e-dpm.com/api/update_site_data", dataChildForm[i].m_id_wp, respondSaveLMR.data.parent.lmr_id, convertDateFormat(date));
          if (updateLMRtoACT !== undefined && updateLMRtoACT.data !== undefined && updateLMRtoACT.data.result.status >= 200 && updateLMRtoACT.data.result.status <= 300) {
            console.log('success update WP', dataChildForm[i].wp_id);
          } else {
            failed_update_wp.push(dataChildForm[i].wp_id);
          }
        }

        if (failed_update_wp.length === 0) {
          this.setState({ action_status: "success", action_message: "LMR has been created!", redirect: "lmr-detail/" + respondSaveLMR.data.parent._id });
        } else {
          const getAlert = () => (
            <SweetAlert
              danger
              title="Successfully created LMR but failed to update to Erisite!"
              onConfirm={() => this.hideAlert()}
            >
              WP ID: {failed_update_wp.join(', ')}
            </SweetAlert>
          );

          this.setState({
            sweet_alert: getAlert()
          });
        }

        this.toggleLoading();
      } else {
        localStorage.setItem("asp_data", JSON.stringify(dataLMR));
        localStorage.setItem("asp_data_child", JSON.stringify(dataLMRChild));
        if (respondSaveLMR.response !== undefined && respondSaveLMR.response.data !== undefined && respondSaveLMR.response.data.error !== undefined) {
          if (respondSaveLMR.response.data.error.message !== undefined) {
            this.setState({
              action_status: "failed",
              action_message: respondSaveLMR.response.data.error.message,
            });
            this.toggleLoading();
          } else {
            this.setState({
              action_status: "failed",
              action_message: respondSaveLMR.response.data.error,
            });
            this.toggleLoading();
          }
        } else {
          this.setState({
            action_status: "failed",
            action_message: "There is something error. Don't worry, we saved a draft for you. Please refresh the page"
          });
          this.toggleLoading();
        }
      }
    }
  }

  addLMR = () => {
    this.handleCheckForm();
  };

  saveLMR = () => {
    const dataChildForm = this.state.creation_lmr_child_form;
    console.log("lmr child ", this.state.creation_lmr_child_form);
    const dataLMR = {
      plant: this.state.lmr_form.plant,
      customer: this.state.lmr_form.customer,
      request_type: this.state.lmr_form.request_type,
      item_category: this.state.lmr_form.item_category,
      lmr_type: this.state.lmr_form.lmr_type,
      plan_cost_reduction: this.state.lmr_form.plan_cost_reduction,
      lmr_issued_by: this.state.lmr_form.lmr_issued_by,
      pgr: this.state.lmr_form.pgr,
      gl_account: this.state.lmr_form.gl_account,
      gl_account_actual: this.state.lmr_form.gl_account_actual,
      id_project_doc: this.state.lmr_form.id_project_doc,
      project_name: dataChildForm[0].project_name,
      header_text: this.state.lmr_form.header_text,
      payment_term: this.state.lmr_form.payment_term,
      vendor_name: this.state.lmr_form.vendor_name,
      vendor_code_actual: this.state.lmr_form.vendor_code_actual,
      vendor_address: this.state.lmr_form.vendor_address,
      lmr_role: this.state.roleUser[1],
      gl_type: this.state.lmr_form.gl_type,
      mm_data_type: this.state.lmr_form.mm_data_type,
      l1_approver: this.state.lmr_form.l1_approver,
      l2_approver: this.state.lmr_form.l2_approver,
      l3_approver: this.state.lmr_form.l3_approver,
      l4_approver: this.state.lmr_form.l4_approver,
      l5_approver: this.state.lmr_form.l5_approver,
      fas_id: this.state.lmr_form.fas_id,
      total_price: this.state.lmr_form.total_price,
    };
    let dataLMRCHild = [];
    for (let i = 0; i < dataChildForm.length; i++) {
      const dataChild = {
        project_name: dataChildForm[i].project_name,
        nw: dataChildForm[i].nw,
        activity: dataChildForm[i].activity,
        id_project_doc: this.state.lmr_form.id_project_doc,
        material_code_doc: dataChildForm[i].material_code_doc,
        material: dataChildForm[i].material,
        description: dataChildForm[i].description,
        site_id: dataChildForm[i].site_id,
        qty: dataChildForm[i].qty,
        unit_price: dataChildForm[i].unit_price,
        tax_code: dataChildForm[i].tax_code,
        delivery_date: dataChildForm[i].delivery_date,
        total_value: dataChildForm[i].total_value,
        currency: dataChildForm[i].currency,
        pr: "",
        item: 0,
        request_type: this.state.lmr_form.request_type,
        item_category: this.state.lmr_form.item_category,
        lmr_type: this.state.lmr_form.lmr_type,
        plan_cost_reduction: this.state.lmr_form.plan_cost_reduction,
        cdid: dataChildForm[i].cdid,
        // per_site_material_type: dataChildForm[i].Per_Site_Material_Type,
        wp_id: dataChildForm[i].wp_id,
        lmr_type: this.state.lmr_form.LMR_Type,
        gl_type: this.state.lmr_form.gl_type,
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        plant: this.state.lmr_form.plant,
        customer: this.state.lmr_form.customer,
      };
      dataLMRCHild.push(dataChild);
    }
    localStorage.setItem("asp_data", JSON.stringify(dataLMR));
    localStorage.setItem("asp_data_child", JSON.stringify(dataLMRCHild));
    this.setState({
      action_status: "success",
      action_message: "Draft Saved",
    });
  };

  addChildLMR = () => {
    const key = this.state.key_child + 1;
    let date = new Date();
    date.setDate(date.getDate() + 7);
    if (this.state.count_form_validate.length === 0) {
      let dataLMR = this.state.creation_lmr_child_form;
      dataLMR.push({
        key: key,
        tax_code: "I0",
        currency: "MYR",
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        site_id: "",
        cdid: "",
        nw: "",
        material: "",
        activity: "5640",
        qty: 0,
        unit_price: 0,
        total_value: 0,
        delivery_date: convertDateFormat(date)
      });
      this.setState({ creation_lmr_child_form: dataLMR, key_child: key });
    } else {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please fill all required fields first!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });
    }
  };

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

  handleChangeFormLMR(e) {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_form = this.state.lmr_form;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    if (name === "item_category") {
      if (value === "3PP") {
        lmr_form["pgr"] = "MY1";
      } else if (value === "Service") {
        lmr_form["pgr"] = "MY3";
      }
    }
    if (name === "lmr_type") {
      if (value === "Per Site") {
        lmr_form["plan_cost_reduction"] = "No";
      } else {
        lmr_form["plan_cost_reduction"] = "Yes";
      }
    }
    if (name === "gl_account") {
      let selected_options = e.target.options[e.target.selectedIndex].text;
      let mm_data_type = "";
      if (selected_options === "ITC + transport - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "ITC + transport";
        lmr_form["gl_type"] = "ITC + transport";
        lmr_form["mm_data_type"] = mm_data_type;
      } else if (selected_options === "NDO - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "NDO";
        lmr_form["gl_type"] = "NDO";
        lmr_form["mm_data_type"] = mm_data_type;
      } else if (selected_options === "Survey - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "Survey";
        lmr_form["gl_type"] = "Survey";
        lmr_form["mm_data_type"] = mm_data_type;
      } else if (selected_options === "Integration - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "Integration";
        lmr_form["gl_type"] = "Integration";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      this.setState({
        custom_gl_display: selected_options,
        mm_data_type: mm_data_type,
      });
    }
    if (name === "gl_account" && value !== null) {
      lmr_form[name.toString()] = value.split(" - ")[1];
    } else {
      lmr_form[name.toString()] = value;
    }
    this.setState({ lmr_form: lmr_form }, () =>
      console.log(this.state.lmr_form)
    );
  }

  sumTotalPrice = () => {
    let dataLMR = this.state.creation_lmr_child_form;
    let lmr_form = this.state.lmr_form;
    let total_price = 0;
    for (let i = 0; i < dataLMR.length; i++) {
      total_price += dataLMR[i]["total_value"];
    }
    lmr_form["total_price"] = total_price;
    this.setState({ lmr_form: lmr_form }, () =>
      console.log(this.state.lmr_form)
    );
  };

  handleChangeFormLMRChild(e) {
    let dataLMR = this.state.creation_lmr_child_form;
    let dataparentLMR = this.state.lmr_form;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];
    let cdData = this.state.list_cd_id.find(
      (e) => e.CD_ID === dataLMR[parseInt(idx)]["cdid"]
    );
    dataLMR[parseInt(idx)][field] = value;

    if (field === "qty" && isNaN(dataLMR[parseInt(idx)].unit_price) === false) {
      dataLMR[parseInt(idx)]["total_value"] =
        value * dataLMR[parseInt(idx)].unit_price;
    }
    this.setState(
      {
        lmr_form: dataparentLMR,
        creation_lmr_child_form: dataLMR,
        // so_nw_updated: dataLMR[parseInt(idx)]["nw"],
      },
      () => {
        console.log(this.state.creation_lmr_child_form)
        this.sumTotalPrice();
      }
    );
  }

  handleChangeFormLMRChildPackage = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_child_package = this.state.lmr_child_package;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    lmr_child_package[name.toString()] = value;
    this.setState({ lmr_child_package: lmr_child_package });
  }

  handleChangeCDFormLMRChild = (e, action) => {
    let dataLMR = this.state.creation_lmr_child_form;
    let dataparentLMR_GL = this.state.lmr_form;
    let idxField = action.name.split(" /// ");
    let value = e.value;
    let idx = idxField[0];
    let field = idxField[1];
    if (field === "cdid" && this.state.lmr_form.lmr_type === "Per Site") {
      let cdData = this.state.list_cd_id_act.find((e) => e.cdid === value);
      let custom_site_display = cdData.loc_id + "_" + cdData.site_name;
      dataLMR[parseInt(idx)]["custom_site_display"] = custom_site_display;
      dataLMR[parseInt(idx)]["site_id"] = custom_site_display;
      dataLMR[parseInt(idx)]["project_name"] = cdData.project;
      dataLMR[parseInt(idx)]["cdid"] = value;
      if (dataparentLMR_GL.gl_account_actual === "Transport - 402102") {
        dataLMR[parseInt(idx)]["nw"] = "";
        dataLMR[parseInt(idx)]["activity"] = "803X";
      }
      if (dataparentLMR_GL.gl_account_actual === "NRO service - 402603") {
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_nro;
        dataLMR[parseInt(idx)]["activity"] = "5640";
        dataLMR[parseInt(idx)]["wp_id"] = cdData.workplan_id;
      }
      if (
        dataparentLMR_GL.gl_account_actual === "NRO local material - 402201"
      ) {
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_hw;
        dataLMR[parseInt(idx)]["activity"] = "2000";
      }
      if (dataparentLMR_GL.gl_account_actual === "NDO service - 402603") {
        // should be NDO
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_ndo;
        dataLMR[parseInt(idx)]["activity"] = "5200";
      }

      this.setState({
        cd_id_selected: value,
      });
    }
    this.setState({ creation_lmr_child_form: dataLMR }, () =>
      console.log(this.state.creation_lmr_child_form)
    );
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
    dataLMR[parseInt(this.state.current_material_select)]["unit_price"] =
      data_material.Unit_Price;
    dataLMR[parseInt(this.state.current_material_select)]["qty"] = 0;
    this.setState({ creation_lmr_child_form: dataLMR });
    this.decideToggleMaterial();
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 8; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
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

  loopSearchBarNRO = () => {
    let searchBar = [];
    for (let i = 0; i < 8; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
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

  loopSearchBarHW = () => {
    let searchBar = [];
    for (let i = 0; i < 7; i++) {
      searchBar.push(
        <td>
          {i !== 2 ? (
            <div className="controls" style={{ minWidth: "150px" }}>
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
          ) : (
            ""
          )}
        </td>
      );
    }
    return searchBar;
  };

  loopSearchBarARP = () => {
    let searchBar = [];
    for (let i = 0; i < 6; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
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

  loopSearchBarPackage = () => {
    let searchBar = [];
    for (let i = 0; i < 4; i++) {
      searchBar.push(
        <td>
          <div className="controls" style={{ minWidth: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                placeholder="Search"
                onChange={this.handleFilterListPackage}
                value={this.state.filter_list_package[i]}
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

  handleFilterListPackage = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list_package;
    dataFilter[parseInt(index)] = value;
    this.setState({ filter_list_package: dataFilter, activePage: 1 }, () => {
      this.onChangeDebouncedPackage(e);
    })
  }

  onChangeDebouncedPackage(e) {
    this.getPackageList();
  }

  handleDeleteLMRChild = (index) => {
    // console.log(key);
    // let LMRChild = this.state.creation_lmr_child_form;
    // let after_delete = LMRChild.filter((i) => i.key !== key);
    // console.log(after_delete);
    // this.setState({ creation_lmr_child_form: after_delete });

    let LMRChild = this.state.creation_lmr_child_form;
    let lmr_form = this.state.lmr_form;
    lmr_form['total_price'] = lmr_form['total_price'] - LMRChild[index]['total_value'];
    LMRChild.splice(index, 1);
    this.setState({ creation_lmr_child_form: LMRChild }, () => console.log(this.state.creation_lmr_child_form));
    this.setState({ lmr_form: lmr_form }, () => console.log(this.state.lmr_form));
  }

  handleMaterialFilter(e) {
    let value = e.target.value;
    let name = e.target.name;
    let dataLMR = this.state.creation_lmr_child_form;
    let type_material = this.state.mm_data_type;
    // console.log()
    this.setState(
      (prevState) => ({
        matfilter: {
          ...prevState.matfilter,
          [name]: value,
        },
      }),
      () => {
        // this.hideRegion();
        this.decideFilter(type_material);
        console.log(this.state.matfilter);
      }
    );
  }

  hideRegion() {
    if (this.state.mm_data_type === "HW" || this.state.mm_data_type === "ARP") {
      this.setState({ hide_region: true });
    } else {
      this.setState({ hide_region: false });
    }
  }

  decideFilter(type_material) {
    switch (type_material) {
      case "ITC + transport":
        this.getMaterialListNRO();
        break;
      case "NDO":
        this.getMaterialListNDO();
        break;
      case "Survey":
        this.getMaterialListSurvey();
        break;
      case "Integration":
        this.getMaterialListIntegration();
        break;
      default:
        break;
    }
  }

  // loadcdACT = () => {
  //     let cd_id_list = [];
  //   this.state.list_cd_id_act.map((e) =>
  //     cd_id_list.push({ label: e.workplan_id, value: e.workplan_id })
  //   );
  //   this.setState({options: cd_id_list}, () => console.log(this.state.options))
  // }

  onMenuOpen = () => {
    let cd_id_list = [];
    this.state.list_cd_id_act.map((e) =>
      cd_id_list.push({ label: e.cdid, value: e.cdid })
    );
    setTimeout(() => {
      this.setState({
        options: cd_id_list,
      });
    }, 1000);
  };

  seachCDList = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let cd_id_list = [];
      await this.state.list_cd_id_act
        .filter((data) => data.cdid.includes(inputValue.toString()))
        .map((e) => cd_id_list.push({ label: e.cdid, value: e.cdid }));
      // console.log(cd_id_list);
      // this.setState({
      //   options: cd_id_list,
      // });
      return cd_id_list;
    }
  };

  handleCheckForm = (param) => {
    const lmr_header = this.state.lmr_form;
    let error = [];
    let dataValidate = {};

    const form_to_validate = [
      "item_category",
      "lmr_type",
      "gl_account",
      "fas_id",
      "vendor_name",
      "header_text",
    ];

    for (let i = 0; i < form_to_validate.length; i++) {
      // console.log(lmr_header[form_to_validate[i]]);
      if (
        lmr_header[form_to_validate[i]] === undefined ||
        lmr_header[form_to_validate[i]] === null ||
        lmr_header[form_to_validate[i]] === ""
      ) {
        dataValidate[form_to_validate[i]] = false;
        error.push(false);
      } else {
        // dataValidate[form_to_validate[i]] = true;
        error.slice(0, this.state.count_form_validate.length - 1);
      }
    }
    if (param === 'select_package') {
      this.setState({ formvalidate: dataValidate, count_form_validate: error }, () => this.toggleModalPackage());
    } else {
      this.setState({ formvalidate: dataValidate, count_form_validate: error }, () => this.addChildLMR());
    }
  };

  handleSelectPackage = async (e) => {
    this.toggleLoading();
    const value = e.target.value;
    const response = await postDatatoAPINODE("/package/getManyPackagebyId", { package_data: [value] }, this.state.tokenUser);
    if (response.data !== undefined && response.status >= 200 && response.status <= 300) {
      let selectedPackage = response.data.data;
      let lmrChildAll = [...this.state.creation_lmr_child_form];
      let materialsNotAssignedToVendor = [];
      for (let i = 0; i < selectedPackage.MM_Data.length; i++) {
        if (selectedPackage.MM_Data[i].Transport === 'no') {
          if (selectedPackage.MM_Data[i].Vendor_ID !== null) {
            if (selectedPackage.MM_Data[i].Vendor_ID !== this.state.lmr_form.vendor_code_actual) {
              materialsNotAssignedToVendor.push(selectedPackage.MM_Data[i].MM_Code);
            }
          } else {
            if (!selectedPackage.MM_Data[i].Vendor_List.some(e => e.Vendor_Code === this.state.lmr_form.vendor_code_actual)) {
              materialsNotAssignedToVendor.push(selectedPackage.MM_Data[i].MM_Code);
            }
          }
        }
        let lmrChild = {
          key: i + 1,
          activity: this.state.lmr_child_package.activity,
          currency: this.state.lmr_child_package.currency,
          delivery_date: this.state.lmr_child_package.delivery_date,
          description: selectedPackage.MM_Data[i].Description,
          item_status: "Submit",
          material: selectedPackage.MM_Data[i].MM_Code,
          material_code_doc: selectedPackage.MM_Data[i].MM_Code_Id,
          nw: this.state.lmr_child_package.nw,
          qty: selectedPackage.MM_Data[i].Qty,
          site_id: this.state.lmr_child_package.site_id,
          site_name: this.state.lmr_child_package.site_name,
          cdid: this.state.lmr_child_package.cdid,
          region: this.state.lmr_child_package.region,
          wp_id: this.state.lmr_child_package.wp_id,
          m_id_wp: this.state.lmr_child_package.m_id_wp,
          project_name: this.state.lmr_child_package.project_name,
          tax_code: this.state.lmr_child_package.tax_code,
          total_value: selectedPackage.MM_Data[i].Qty * selectedPackage.MM_Data[i].Price,
          unit_price: selectedPackage.MM_Data[i].Price,
          work_status: "Waiting for PR-PO creation",
          transport: selectedPackage.MM_Data[i].Transport
        }
        lmrChildAll.push(lmrChild);
      }
      if (materialsNotAssignedToVendor.length === 0) {
        this.setState({ creation_lmr_child_form: lmrChildAll }, () => { this.toggleModalPackage(); this.sumTotalPrice(); });
      } else {
        let list_material = materialsNotAssignedToVendor.join(', ');
        const getAlert = () => (
          <SweetAlert
            danger
            title="Below materials are not assigned to the selected vendor!"
            onConfirm={() => this.hideAlert()}
          >
            {list_material}
          </SweetAlert>
        );
        this.setState({
          sweet_alert: getAlert()
        });
      }
    } else {
      if (response.response !== undefined && response.response.data !== undefined && response.response.data.error !== undefined) {
        if (response.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: response.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: response.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
    this.toggleLoading();
  }

  handleCheckMaterialPackage = async (e) => {
    const value = e.target.value;
    const response = await postDatatoAPINODE("/package/getManyPackagebyId", { package_data: [value] }, this.state.tokenUser);
    if (response.data !== undefined && response.status >= 200 && response.status <= 300) {
      let selectedPackage = response.data.data;
      let allMaterials = [];
      for (let i = 0; i < selectedPackage.MM_Data.length; i++) {
        let vendors = [];
        if (selectedPackage.MM_Data[i].Vendor_ID !== null) {
          vendors.push(selectedPackage.MM_Data[i].Vendor_Name);
        } else {
          for (let x = 0; x < selectedPackage.MM_Data[i].Vendor_List.length; x++) {
            vendors.push(selectedPackage.MM_Data[i].Vendor_List[x].Vendor_Name);
          }
        }
        let material = {
          MM_Code: selectedPackage.MM_Data[i].MM_Code,
          Description: selectedPackage.MM_Data[i].Description,
          Price: selectedPackage.MM_Data[i].Price,
          Qty: selectedPackage.MM_Data[i].Qty,
          Vendors: vendors.join(', ')
        }
        allMaterials.push(material)
      }
      let check_material_package_list = {
        Package_Id: selectedPackage.Package_Id,
        Package_Name: selectedPackage.Package_Name,
        Region: selectedPackage.Region,
        Materials: allMaterials
      }
      this.setState({ check_material_package_list: check_material_package_list }, () => this.toggleModalCheckMaterialPackage());
    } else {
      if (response.response !== undefined && response.response.data !== undefined && response.response.data.error !== undefined) {
        if (response.response.data.error.message !== undefined) {
          this.setState({
            action_status: "failed",
            action_message: response.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: response.response.data.error,
          });
        }
      } else {
        this.setState({ action_status: "failed" });
      }
    }
  }

  render() {
    const matfilter = this.state.matfilter;
    // console.log("this.props.dataUser", this.props.dataUser);
    if (this.state.redirectSign !== false) {
      setTimeout(1500);
      return <Redirect to={"/lmr-detail/" + this.state.redirectSign} />;
    }
    if (
      this.state.header_data !== null &&
      this.state.child_data !== null &&
      this.state.modal_loading === false &&
      this.state.check_draft === true
    ) {
      return (
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.togglecreateModal}
          title={"You have draft, want to load ?"}
        >
          <div>{ }</div>
          <ModalFooter>
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              // disabled={this.state.rowsXLS.length === 0}
              onClick={this.getDraft}
              style={{ height: "30px", width: "100px" }}
            >
              Yes
            </Button>{" "}
            <Button
              size="sm"
              block
              color="secondary"
              className="btn-pill"
              // disabled={this.state.rowsXLS.length === 0}
              onClick={this.togglecreateModal}
              style={{ height: "30px", width: "100px" }}
            >
              No
            </Button>
          </ModalFooter>
        </ModalCreateNew>
      );
    }

    return (
      <div>
        <Row className="row-alert-fixed">
          <Col xs="12" lg="12">
            <DefaultNotif
              actionMessage={this.state.action_message}
              actionStatus={this.state.action_status}
              redirect={this.state.redirect}
            />
          </Col>
        </Row>
        <Row>
          {this.state.sweet_alert}
          <Col xl="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2", fontSize: "17px" }}>
                  <i className="fa fa-edit" style={{ marginRight: "8px" }}></i>
                  Assignment LMR Creation{" "}
                </span>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md={1}>
                      <FormGroup>
                        <Label>PLANT</Label>
                        <Input
                          type="text"
                          name="plant"
                          id="plant"
                          value={this.state.lmr_form.plant}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Customer</Label>
                        <Input
                          type="text"
                          name="customer"
                          id="customer"
                          value={this.state.lmr_form.customer}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Request Type</Label>
                        <Input
                          type="text"
                          name="request_type"
                          id="request_type"
                          value={this.state.lmr_form.request_type}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />
                        {/* <option value={null} selected></option>
                          <option value="Add LMR">Add LMR</option>
                          <option value="Change LMR">Change LMR</option>
                          <option value="Delete LMR">Delete LMR</option>*/}
                        {/* </Input> */}
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Item Category</Label>
                        <Input
                          type="select"
                          name="item_category"
                          id="item_category"
                          value={this.state.lmr_form.item_category}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option value="" disabled selected hidden>Select Item Category</option>
                          <option value="Service">Service</option>
                          <option value="3PP">3PP</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>LMR Type</Label>
                        <Input
                          type="select"
                          name="lmr_type"
                          id="lmr_type"
                          value={this.state.lmr_form.lmr_type}
                          onChange={this.handleChangeFormLMR}
                          style={this.state.formvalidate.lmr_type === false ? { borderColor: "red" } : {}}
                        >
                          <option value="" disabled selected hidden>
                            Select LMR Type
                          </option>
                          <option value="Cost Collector">Cost Collector</option>
                          <option value="Per Site">Per Site</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Plan Cost Reduction</Label>
                        <Input
                          readOnly
                          type="text"
                          name="plan_cost_reduction"
                          id="plan_cost_reduction"
                          value={this.state.lmr_form.plan_cost_reduction}
                          onChange={this.handleChangeFormLMR}
                        />
                        {/* <option value={null} selected></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option> */}
                        {/* </Input> */}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label>LMR Issued By</Label>
                        <Input
                          type="text"
                          name="lmr_issued_by"
                          id="lmr_issued_by"
                          value={this.state.lmr_form.lmr_issued_by}
                          onChange={this.handleChangeFormLMR}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>PGr</Label>
                        <Input
                          type="text"
                          name="pgr"
                          id="pgr"
                          value={this.state.lmr_form.pgr}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>GL Account</Label>
                        <Input
                          type="select"
                          name="gl_account"
                          id="gl_account"
                          value={this.state.lmr_form.gl_account_actual}
                          onChange={this.handleChangeFormLMR}
                          style={this.state.formvalidate.gl_account === false ? { borderColor: "red" } : {}}
                          disabled={this.state.creation_lmr_child_form.length > 0}
                        >
                          <option value="" disabled selected hidden>Select GL Account</option>
                          {this.state.lmr_form.lmr_type === 'Per Site' && (
                            <>
                              <option value="ITC + transport - 402603">ITC + transport - 402603</option>
                              <option value="NDO - 402603">NDO - 402603</option>
                              <option value="Survey - 402603">Survey - 402603</option>
                              <option value="Integration - 402603">Integration - 402603</option>
                            </>
                          )}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Fas ID</Label>
                        <Input
                          type="select"
                          name="fas_id"
                          id="fas_id"
                          value={this.state.lmr_form.fas_id}
                          onChange={this.handleChangeFormLMR}
                          style={this.state.formvalidate.fas_id === false ? { borderColor: "red" } : {}}
                        >
                          <option value="" disabled selected hidden>Select Fas</option>
                          {this.state.list_fas.map((fas) => (
                            <option value={fas}>{fas}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Header Text</Label>
                        <Input
                          type="text"
                          name="header_text"
                          id="header_text"
                          value={this.state.lmr_form.header_text}
                          onChange={this.handleChangeFormLMR}
                          style={this.state.formvalidate.header_text === false ? { borderColor: "red" } : {}}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Vendor Name</Label>
                        <Input
                          type="select"
                          name="vendor_name"
                          id="vendor_name"
                          value={this.state.lmr_form.vendor_code_actual}
                          onChange={this.handleChangeVendor}
                          style={this.state.formvalidate.vendor_name === false ? { borderColor: "red" } : {}}
                          disabled={this.state.creation_lmr_child_form.length > 0}
                        >
                          <option value="" disabled selected hidden>
                            Select Vendor Name
                          </option>
                          {this.state.vendor_list.map((e) => (
                            <option value={e.Vendor_Code}>{e.Name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Vendor Code</Label>
                        <Input
                          type="text"
                          name="vendor_code"
                          id="vendor_code"
                          value={this.state.lmr_form.vendor_code_actual}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Vendor Email</Label>
                        <Input
                          type="text"
                          name="vendor_email"
                          id="vendor_email"
                          value={this.state.lmr_form.vendor_address}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Payment Term</Label>
                        <Input
                          type="text"
                          name="payment_term"
                          id="payment_term"
                          value={this.state.lmr_form.payment_term}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Grand Total Amount</Label>
                        <Input
                          type="number"
                          name="total_price"
                          id="total_price"
                          value={this.state.lmr_form.total_price}
                          // onChange={this.sumTotalPrice}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label>L1 Approver / PM</Label>
                        <Input
                          type="select"
                          name="l1_approver"
                          id="l1_approver"
                          value={this.state.lmr_form.l1_approver}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option disabled selected hidden>Select L1 Approver</option>
                          <option value="EZYUSMO">EZYUSMO</option>
                          <option value="EYAUHON">EYAUHON</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>L2 Approver</Label>
                        <Input
                          type="select"
                          name="l2_approver"
                          id="l2_approver"
                          value={this.state.lmr_form.l2_approver}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option disabled selected hidden>Select L2 Approver</option>
                          <option value="EZSETMA">EZSETMA</option>
                          {/* <option value="EYAUHON">EYAUHON</option> */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L3 Approver</Label>
                        <Input
                          type="select"
                          name="l3_approver"
                          id="l3_approver"
                          value={this.state.lmr_form.l3_approver}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option disabled selected hidden>Select L3 Approver</option>
                          <option value="ERAMANN">ERAMANN</option>
                          {/* <option value="EYAUHON">EYAUHON</option> */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L4 Approver</Label>
                        <Input
                          type="select"
                          name="l4_approver"
                          id="l4_approver"
                          value={this.state.lmr_form.l4_approver}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option disabled selected hidden>Select L4 Approver</option>
                          <option value="QDAVHAG">QDAVHAG</option>
                          {/* <option value="EYAUHON">EYAUHON</option> */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L5 Approver</Label>
                        <Input
                          type="select"
                          name="l5_approver"
                          id="l5_approver"
                          value={this.state.lmr_form.l5_approver}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option disabled selected hidden>Select L5 Approver</option>
                          <option value="TEIMIR">TEIMIR</option>
                          {/* <option value="EYAUHON">EYAUHON</option> */}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <hr className="upload-line--lmr"></hr>
                <h5 style={{ marginTop: "16px" }}>LMR Child</h5>
                <hr className="upload-line--lmr"></hr>
                {this.state.creation_lmr_child_form.map((lmr, i) => (
                  <Form>
                    {lmr.transport === "yes" && (<Alert color="danger" pill>Please Select Transport Material!</Alert>)}
                    <Row form>
                      <Col md={2}>
                        <FormGroup>
                          <Label>WP ID <small>(type min. 3 characters)</small></Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={this.searchWPID}
                            onChange={this.handleChangeWP}
                            name={i + " /// wp_id"}
                            id={i + " /// wp_id"}
                            placeholder={lmr.wp_id}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label>CD ID</Label>
                          <Input
                            type="text"
                            name={i + " /// cdid"}
                            id={i + " /// cdid"}
                            value={lmr.cdid}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                            style={lmr.cdid === '' || lmr.cdid === null ? { border: "2px solid red" } : {}}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label>Region</Label>
                          <Input
                            type="text"
                            name={i + " /// region"}
                            id={i + " /// region"}
                            value={lmr.region}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Project Name</Label>
                          <Input
                            type="text"
                            name={i + " /// project_name"}
                            id={i + " /// project_name"}
                            value={lmr.project_name}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label>Site ID</Label>
                          <Input
                            type="text"
                            name={i + " /// site_id"}
                            id={i + " /// site_id"}
                            value={lmr.site_id}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label>Site Name</Label>
                          <Input
                            type="text"
                            name={i + " /// site_name"}
                            id={i + " /// site_name"}
                            value={lmr.site_name}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>SO / NW</Label>
                          <Input
                            type="text"
                            name={i + " /// nw"}
                            id={i + " /// nw"}
                            value={lmr.nw}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                            style={lmr.nw === '' || lmr.nw === null ? { border: "2px solid red" } : {}}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>NW Activity</Label>
                          <Input
                            type="text"
                            name={i + " /// activity"}
                            id={i + " /// activity"}
                            value={lmr.activity}
                            onChange={this.handleChangeFormLMRChild}
                          // disabled={
                          //   this.state.lmr_form.lmr_type === "Cost Collector"
                          // }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Tax Code</Label>
                          <Input
                            type="text"
                            name={i + " /// tax_code"}
                            id={i + " /// tax_code"}
                            value={lmr.tax_code}
                            onChange={this.handleChangeFormLMRChild}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>MM Data Type</Label>
                          {/* {this.state.header_data.gl_account_actual !==
                            undefined &&
                          this.state.header_data.gl_account_actual !== null ? (
                            <Input
                              type="text"
                              name={i + " /// material_type"}
                              id={i + " /// material_type"}
                              // value={lmr.material_type}
                              value={this.state.header_data.mm_data_type}
                              onChange={this.handleChangeFormLMRChild}
                              readOnly
                            />
                          ) : ( */}
                          <Input
                            type="text"
                            name={i + " /// material_type"}
                            id={i + " /// material_type"}
                            // value={lmr.material_type}
                            value={this.state.mm_data_type}
                            onChange={this.handleChangeFormLMRChild}
                            readOnly
                          />
                          {/* )} */}
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Material</Label>
                          <Input
                            type="text"
                            name={i + " /// material"}
                            id={i + " /// material"}
                            value={lmr.material}
                            onClick={() => this.decideToggleMaterial(i)}
                            style={lmr.duplicate === 'yes' || lmr.blank_material === 'yes' ? { border: "2px solid red" } : {}}
                          // onChange={this.handleChangeFormLMRChild}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Description</Label>
                          <Input
                            type="textarea"
                            name={i + " /// description"}
                            id={i + " /// description"}
                            value={lmr.description}
                            onChange={this.handleChangeFormLMRChild}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            name={i + " /// unit_price"}
                            id={i + " /// unit_price"}
                            value={lmr.unit_price}
                            onChange={this.handleChangeFormLMRChild}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Quantity</Label>
                          <Input
                            min="0"
                            type="number"
                            name={i + " /// qty"}
                            id={i + " /// qty"}
                            value={lmr.qty}
                            onChange={this.handleChangeFormLMRChild}
                            style={lmr.zero_qty === 'yes' ? { border: "2px solid red" } : {}}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Total Amount</Label>
                          <Input
                            type="number"
                            name={i + " /// total_value"}
                            id={i + " /// total_value"}
                            value={lmr.total_value}
                            onChange={this.handleChangeFormLMRChild}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <FormGroup>
                          <Label>Currency</Label>
                          <Input
                            type="select"
                            name={i + " /// currency"}
                            id={i + " /// currency"}
                            value={lmr.currency}
                            onChange={this.handleChangeFormLMRChild}
                          >
                            <option value="MYR" selected>MYR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Delivery Date</Label>
                          <Input
                            type="date"
                            name={i + " /// delivery_date"}
                            id={i + " /// delivery_date"}
                            value={lmr.delivery_date}
                            onChange={this.handleChangeFormLMRChild}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={(e) => this.handleDeleteLMRChild(i)}
                          style={{ float: "right", marginTop: "30px" }}
                        >
                          <span className="fa fa-times"></span>
                        </Button>
                      </Col>
                    </Row>
                    <hr className="upload-line--lmr"></hr>
                  </Form>
                ))}
                <div>
                  <Button color="primary" size="sm" onClick={this.addLMR} style={{ marginRight: 8 }}>
                    <i className="fa fa-plus"></i>&nbsp;Add LMR Child
                  </Button>
                  <Button color="primary" size="sm" onClick={() => this.handleCheckForm('select_package')}>
                    <i className="fa fa-plus"></i>&nbsp;Add Package
                  </Button>
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  color="secondary"
                  size="sm"
                  style={{ float: "left" }}
                  onClick={this.saveLMR}
                >
                  <i className="fa fa-save" style={{ marginRight: "8px" }}></i>
                  Save
                </Button>
                <Button
                  color="success"
                  size="sm"
                  style={{ float: "right" }}
                  onClick={this.createLMR}
                >
                  <i
                    className="fa fa-plus-square"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Create LMR ASG
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

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
              <Row md={2}>
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
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBar()}
                  </tr>
                </thead>
                <tbody>
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
                  <FormGroup hidden>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBarNRO()}
                  </tr>
                </thead>
                <tbody>
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

        {/* Modal Material Survey */}
        <Modal
          isOpen={this.state.modal_material_survey}
          toggle={this.toggleMaterialSurvey}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={2}>
                {this.state.hide_region !== true ? (
                  <FormGroup hidden>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBar()}
                  </tr>
                </thead>
                <tbody>
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
            <Button color="secondary" onClick={this.toggleMaterialSurvey}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Material Integration */}
        <Modal
          isOpen={this.state.modal_material_integration}
          toggle={this.toggleMaterialIntegration}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={2}>
                {this.state.hide_region !== true ? (
                  <FormGroup hidden>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBar()}
                  </tr>
                </thead>
                <tbody>
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
            <Button color="secondary" onClick={this.toggleMaterialIntegration}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Material NDO */}
        <Modal
          isOpen={this.state.modal_material_NDO}
          toggle={this.toggleMaterialNDO}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Row md={2}>
                {this.state.hide_region !== true ? (
                  <FormGroup hidden>
                    <Label>
                      <b>Region</b>
                    </Label>
                    <Input
                      type="select"
                      name={"region"}
                      value={matfilter.region}
                      onChange={this.handleMaterialFilter}
                    >
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBar()}
                  </tr>
                </thead>
                <tbody>
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
            <Button color="secondary" onClick={this.toggleMaterialIntegration}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

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
              <Row md={2}>
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
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="All">All</option>
                      <option value="KV">KV</option>
                      <option value="SN">SN</option>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>BB</th>
                    <th>BB Sub</th>
                    <th>Region</th>
                    <th>MM Code</th>
                    <th>MM Description</th>
                    <th>SoW</th>
                    <th>UoM</th>
                    <th>Unit Price</th>
                  </tr>
                  <tr>
                    {this.loopSearchBar()}
                  </tr>
                </thead>
                <tbody>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>MM_Code</th>
                    <th>UoM</th>
                    <th>Unit_Price</th>
                    <th>Currency</th>
                    <th>Info_Rec</th>
                    <th>Valid_To</th>
                    <th>Created_On</th>
                    <th>Created_By</th>
                    <th>Status_Price_in_SAP</th>
                  </tr>
                  <tr>
                    {this.loopSearchBarHW()}
                  </tr>
                </thead>
                <tbody>
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
                        <td>{e.Valid_To}</td>
                        <td>{e.Created_On}</td>
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
              <Table responsive striped bordered size="sm" id="asg-detail-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Action</th>
                    <th>MM_Code</th>
                    <th>MM_Description</th>
                    <th>UoM</th>
                    <th>Unit_Price</th>
                    <th>Currency</th>
                    <th>Remarks</th>
                  </tr>
                  <tr>
                    {this.loopSearchBarARP()}
                  </tr>
                </thead>
                <tbody>
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
                        <td>{e.Unit_Price}</td>
                        <td>{e.Currency}</td>
                        <td>{e.Remarks}</td>
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
          {/* <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter> */}
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Package */}
        <Modal
          isOpen={this.state.modal_package}
          toggle={this.toggleModalPackage}
          className={"modal-xl"}
        >
          <ModalBody>
            <div class="table-container">
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label>WP ID <small>(type min. 3 characters)</small></Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={this.searchWPID}
                      onChange={this.handleChangeWPPackage}
                      name="wp_id"
                      placeholder={this.state.lmr_child_package.wp_id}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>CD ID</Label>
                    <Input
                      type="text"
                      name="cdid"
                      value={this.state.lmr_child_package.cdid}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={1}>
                  <FormGroup>
                    <Label>Region</Label>
                    <Input
                      type="text"
                      name="region"
                      value={this.state.lmr_child_package.region}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Project Name</Label>
                    <Input
                      type="text"
                      name="project_name"
                      value={this.state.lmr_child_package.project_name}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>Site ID</Label>
                    <Input
                      type="text"
                      name="site_id"
                      value={this.state.lmr_child_package.site_id}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Site Name</Label>
                    <Input
                      type="text"
                      name="site_name"
                      value={this.state.lmr_child_package.site_name}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>SO / NW</Label>
                    <Input
                      type="text"
                      name="nw"
                      value={this.state.lmr_child_package.nw}
                      onChange={this.handleChangeFormLMRChildPackage}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>NW Activity</Label>
                    <Input
                      type="text"
                      name="activity"
                      value={this.state.lmr_child_package.activity}
                      onChange={this.handleChangeFormLMRChildPackage}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>Tax Code</Label>
                    <Input
                      type="text"
                      name="tax_code"
                      value={this.state.lmr_child_package.tax_code}
                      onChange={this.handleChangeFormLMRChildPackage}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>Currency</Label>
                    <Input
                      type="select"
                      name="currency"
                      value={this.state.lmr_child_package.currency}
                      onChange={this.handleChangeFormLMRChildPackage}
                    >
                      <option value="MYR">MYR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Delivery Date</Label>
                    <Input
                      type="date"
                      name="delivery_date"
                      value={this.state.lmr_child_package.delivery_date}
                      onChange={this.handleChangeFormLMRChildPackage}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Table responsive striped bordered size="sm">
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ verticalAlign: "middle", minWidth: 210 }}>Action</th>
                    <th>Package ID</th>
                    <th>Package Name</th>
                    <th>Region</th>
                    <th>MM Type</th>
                  </tr>
                  <tr>
                    {this.loopSearchBarPackage()}
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.package_list.map((e) => (
                      <tr>
                        <td>
                          <Button
                            color="success"
                            size="sm"
                            value={e._id}
                            onClick={this.handleSelectPackage}
                          >
                            <i className="fa fa-check-square" style={{ marginRight: "8px" }}></i>Select
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            value={e._id}
                            onClick={this.handleCheckMaterialPackage}
                            style={{ marginLeft: 8 }}
                          >
                            <i className="fa fa-cubes" style={{ marginRight: "8px" }}></i>Check Material
                          </Button>
                        </td>
                        <td>{e.Package_Id}</td>
                        <td>{e.Package_Name}</td>
                        <td>{e.Region}</td>
                        <td>{e.Material_Sub_Type}</td>
                      </tr>
                    ))
                  }
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
            <Button color="secondary" onClick={this.toggleModalPackage}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Package */}

        {/* Modal Check Material Package */}
        <Modal
          isOpen={this.state.modal_check_material_package}
          toggle={this.toggleModalCheckMaterialPackage}
          className={"modal-xl"}
        >
          <ModalBody>
            <div class="table-container">
              <div>
                <strong>Package ID</strong> : {this.state.check_material_package_list.Package_Id}<br />
                <strong>Package Name</strong> : {this.state.check_material_package_list.Package_Name}<br />
                <strong>Region</strong> : {this.state.check_material_package_list.Region}<br /><br />
              </div>
              <Table responsive striped bordered size="sm">
                <thead>
                  <tr>
                    <th>MM Code</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Vendors</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.check_material_package_list.Materials !== undefined &&
                    this.state.check_material_package_list.Materials.map((e) => (
                      <tr>
                        <td>{e.MM_Code}</td>
                        <td>{e.Description}</td>
                        <td>{e.Price}</td>
                        <td>{e.Qty}</td>
                        <td>{e.Vendors}</td>
                      </tr>
                    ))
                  }
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
            <Button color="secondary" onClick={this.toggleModalCheckMaterialPackage}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Check Material Package */}
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

export default connect(mapStateToProps)(MYASGCreation);
