import React, { Component, Fragment } from "react";
import {
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

import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "./LMRMY.css";
import { getDatafromAPINODE } from "../../helper/asyncFunction";
import { connect } from "react-redux";
const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const data_raw = {
  query_param: {
    table: "p_celc_tes2_m_site_data",
    columns: [
      "m_id",
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dd97a9d-d14e-11ea-b481-000d3aa2f57d"."value"\')) as workplan_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6ddc5ad9-d14e-11ea-b481-000d3aa2f57d"."value"\')) as workplan_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6ddd5695-d14e-11ea-b481-000d3aa2f57d"."value"\')) as network_element_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6ddf06e9-d14e-11ea-b481-000d3aa2f57d"."value"\')) as program',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de2185d-d14e-11ea-b481-000d3aa2f57d"."value"\')) as project',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de3e9c6-d14e-11ea-b481-000d3aa2f57d"."value"\')) as sub_project',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de50a63-d14e-11ea-b481-000d3aa2f57d"."value"\')) as po',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de61b94-d14e-11ea-b481-000d3aa2f57d"."value"\')) as cluster',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de7236f-d14e-11ea-b481-000d3aa2f57d"."value"\')) as pc_sc_npc',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de80a3a-d14e-11ea-b481-000d3aa2f57d"."value"\')) as region',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de9936c-d14e-11ea-b481-000d3aa2f57d"."value"\')) as site_category',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6deb0872-d14e-11ea-b481-000d3aa2f57d"."value"\')) as ref_no',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dec7a1c-d14e-11ea-b481-000d3aa2f57d"."value"\')) as loc_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6deda4c0-d14e-11ea-b481-000d3aa2f57d"."value"\')) as site_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dee8ffe-d14e-11ea-b481-000d3aa2f57d"."value"\')) as technology',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6def62c1-d14e-11ea-b481-000d3aa2f57d"."value"\')) as final_planned_tech',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6df05af4-d14e-11ea-b481-000d3aa2f57d"."value"\')) as material_purchase',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6df162c1-d14e-11ea-b481-000d3aa2f57d"."value"\')) as scope_status',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6df24065-d14e-11ea-b481-000d3aa2f57d"."value"\')) as wbs_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6df35010-d14e-11ea-b481-000d3aa2f57d"."value"\')) as wbs_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6df51f22-d14e-11ea-b481-000d3aa2f57d"."value"\')) as asp_assigned',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dfb6b35-d14e-11ea-b481-000d3aa2f57d"."value"\')) as fas_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."24637634-07a9-11eb-8887-000d3aa2f57d"."value"\')) as asp_assigned_survey',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246461b2-07a9-11eb-8887-000d3aa2f57d"."value"\')) as committed_cost_cleared_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."24652856-07a9-11eb-8887-000d3aa2f57d"."value"\')) as committed_cost_cleared_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."24660220-07a9-11eb-8887-000d3aa2f57d"."value"\')) as committed_cost_cleared_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2466d3dc-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_closure_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2467c011-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_closure_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."24688eea-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_closure_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."24695f14-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_lm',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246a2819-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_hwac',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."858ddfa1-1291-11eb-a1c8-000d3aa2f57d"."value"\')) as wbs_eab',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246aed1a-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_lm',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246bc7e7-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_hwac',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246aed1a-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_eab',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246ca447-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nro_service',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246d7d56-07a9-11eb-8887-000d3aa2f57d"."value"\')) as ndo_service',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."246e7ca2-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nro_local_material',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2460b228-07a9-11eb-8887-000d3aa2f57d"."value"\')) as wbs_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2461aac5-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2462836e-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."3e55d901-172d-11eb-99f8-000d3aa2f57d"."value"\')) as cd_id',
    ],
    join: {},
    condition: {},
    pagination: "all",
    page_target: 1,
    length_per_page: 10,
  },
};

const all_reqbody_raw = {
  query_param: {
    table: "p_celc_apim1_m_site_data",
    columns: [
      "m_id",
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dd97a9d-d14e-11ea-b481-000d3aa2f57d"."value"\')) as workplan_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dec7a1c-d14e-11ea-b481-000d3aa2f57d"."value"\')) as loc_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6deda4c0-d14e-11ea-b481-000d3aa2f57d"."value"\')) as site_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dfb6b35-d14e-11ea-b481-000d3aa2f57d"."value"\')) as fas_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."ce9e1915-127e-11eb-a1c8-000d3aa2f57d"."value"\')) as nw_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2461aac5-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2462836e-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."3e55d901-172d-11eb-99f8-000d3aa2f57d"."value"\')) as cdid',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de2185d-d14e-11ea-b481-000d3aa2f57d"."value"\')) as project',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6de3e9c6-d14e-11ea-b481-000d3aa2f57d"."value"\')) as sub_project',
    ],
    join: {},
    condition: {},
    pagination: "all",
    page_target: 1,
    length_per_page: 10,
  },
};

const fas_reqbody = {
  query_param: {
    table: "p_celc_apim1_m_site_data",
    columns: [
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dfb6b35-d14e-11ea-b481-000d3aa2f57d"."value"\')) as fas_id',
    ],
    join: {},
    condition: {},
    pagination: "all",
    page_target: 1,
    length_per_page: 10,
  },
};

class MYASGEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roleUser: this.props.dataLogin.role,
      tokenUser: this.props.dataLogin.token,
      lmr_form: {
        // pgr: "MP2",
        gl_account: "",
        lmr_issued_by: this.props.dataLogin.userName,
        // lmr_issued_by: "EHAYZUX",
        total_price: 0,
        plant: "2172",
        customer: "CELCOM",
        request_type: "Add LMR",
      },
      lmr_edit: true,
      modal_loading: false,
      modal_material: false,
      modal_material_NRO: false,
      modal_material_HW: false,
      modal_material_ARP: false,
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
      validation_form: {},
      current_material_select: null,
      data_user: this.props.dataUser,
      filter_list: new Array(8).fill(""),
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
      redirectSign: false,
      key_child: 0,
      edit_count: 0,
      total_price_parent: 0,
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
    this.handleDeleteLMRChild = this.handleDeleteLMRChild.bind(this);
    this.deleteLMR = this.deleteLMR.bind(this);
    this.handleMaterialFilter = this.handleMaterialFilter.bind(this);
    this.decideFilter = this.decideFilter.bind(this);
  }

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  decideToggleMaterial = (number_child_form) => {
    // let Mat_type = this.state.creation_lmr_child_form[number_child_form]
    //   .material_type;
    let Mat_type = this.state.lmr_form;
    console.log(Mat_type["mm_data_type"]);
    switch (Mat_type["mm_data_type"]) {
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

  decideToggleMaterialexist = (number_child_form) => {
    // let Mat_type = this.state.creation_lmr_child_form[number_child_form]
    //   .material_type;
    let Mat_type = this.state.lmr_form.mm_data_type;
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

  async getDatafromAPIMY(url) {
    try {
      let respond = await axios.get(process.env.REACT_APP_API_URL_MAS + url, {
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
    try {
      let respond = await axios.post(proxyurl + url, fas_reqbody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic dXNlcml4dDpYUXJuMzJuNWtxb00=",
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

  async getCDfromACT(proxyurl, url) {
    try {
      let respond = await axios.post(proxyurl + url, all_reqbody_raw, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic dXNlcml4dDpYUXJuMzJuNWtxb00=",
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

  getDataCDACT = () => {
    this.getCDfromACT(
      "https://cors-anywhere.herokuapp.com/",
      "https://act.e-dpm.com/index.php/android/get_data_new"
    ).then((resCD) => {
      this.toggleLoading();
      if (resCD.data !== undefined) {
        if (resCD.data.result !== undefined) {
          const list_cd_act = resCD.data.result.raw_data;
          const filter_cd_id = list_cd_act.filter(
            (cd) => cd.cdid !== null && cd.cdid !== "null"
          );
          const filter_project = list_cd_act.filter(
            (proj) => proj.cdid !== null
          );
          // console.log("lenght", filter_cd_id.length);
          this.setState({ list_cd_id_act: filter_cd_id }, () =>
            this.UniqueProject(filter_project)
          );
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
  };

  getDataCDACT_Fas() {
    this.toggleLoading();
    this.getFASfromACT(
      "https://cors-anywhere.herokuapp.com/",
      "https://act.e-dpm.com/index.php/android/get_data_new"
    ).then((resCD) => {
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
      console.log("uniq proj", this.state.list_project)
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
            <option value="" selected></option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NDO service - 402603">NDO service - 402603</option>
            <option value="NRO local material - 402201">
              NRO local material - 402201
            </option>
            {/* <option value="3PP Hardware - 402201">3PP Hardware - 402201</option> */}
          </>
        );
      }
      if (role.includes("BAM-IM") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">
              NRO local material - 402201
            </option>{" "}
          </>
        );
      }
      if (role.includes("BAM-IE Lead") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="NRO service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">
              NRO local material - 402201
            </option>
          </>
        );
      }
      if (role.includes("BAM-NDO IM") === true) {
        return (
          <>
            <option value="" selected></option>
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

            <option value="NRO Service">NRO Service</option>
            <option value="NRO LM">NRO LM</option>
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

  getOptionbyRole3 = (role) => {
    if (role !== undefined) {
      if (
        role.includes("BAM-CPM") === true ||
        role.includes("BAM-Sourcing") === true
      ) {
        return (
          <>
            <option value="" selected></option>
            <option value="Transport - 402102">Transport - 402102</option>
            <option value="ARP - 402693">ARP - 402693</option>
            <option value="3PP Hardware - 402201">3PP Hardware - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-IM") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="Transport - 402102">Transport - 402102</option>
          </>
        );
      }
      if (role.includes("BAM-PA") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="ARP - 402693">ARP - 402693</option>
          </>
        );
      }
      if (role.includes("BAM-MP") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="3PP Hardware - 402201">3PP Hardware - 402201</option>
          </>
        );
      }
      if (role.includes("BAM-GR-PA") === true) {
        return (
          <>
            <option value="" selected></option>
            <option value="NRO Service - 402603">NRO service - 402603</option>
            <option value="NRO local material - 402201">
              NRO local material - 402201
            </option>{" "}
            <option value="Transport - 402102">Transport - 402102</option>
          </>
        );
      }
    }
  };

  componentDidMount() {
    // this.toggleLoading();
    this.getVendorList();
    // this.getProjectList();
    // this.getMaterialList();
    this.getDataCDACT();
    if (this.props.match.params.id === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.id);
    }
    // this.getMaterialList();
    console.log("id ", this.props.match.params.id);
    document.title = "LMR Edit | BAM";
  }

  getLMRDetailData(_id) {
    this.getDataFromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState(
            {
              lmr_form: dataLMRDetail,
              // creation_lmr_child_form: dataLMRDetail.detail,
            },
            () => {
              // console.log("mm_data_type ", this.state.lmr_form.mm_data_type);
              // this.getDataPRPO(dataLMRDetail.lmr_id);
              this.getChildLMR();
            }
          );
        }
      }
    );
  }

  getChildLMR() {
    const LMR_parent = this.state.lmr_form;
    this.setState({ creation_lmr_child_form: LMR_parent.detail });
  }

  // getDataPRPO(LMR_ID) {
  //   this.getDatafromAPIMY(
  //     '/prpo_data?where={"LMR_No" : "' + LMR_ID + '"}'
  //   ).then((res) => {
  //     if (res.data !== undefined) {
  //       const dataLMRDetailPRPO = res.data._items;
  //       this.setState({ list_pr_po: dataLMRDetailPRPO });
  //       console.log("list_pr_po ", this.state.list_pr_po);
  //     }
  //   });
  // }

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

  getMaterialList(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"'
      );
    this.state.mm_data_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
          this.state.mm_data_type +
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
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"'
      );
    this.state.mm_data_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
          this.state.mm_data_type +
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
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code_actual + '"'
      );
    this.state.mm_data_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
          this.state.mm_data_type +
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
        '"Remarks":{"$regex" : "' +
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
    this.state.lmr_form.vendor_code_actual !== "" &&
      filter_array.push(
        '"Vendor_List.Vendor_Code":"' +
          this.state.lmr_form.vendor_code_actual +
          '"'
      );
    this.state.mm_data_type !== "" &&
      filter_array.push(
        '"Material_Type":{"$regex" : "' +
          this.state.mm_data_type +
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

  createLMR = async () => {
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
        lmr_type: this.state.lmr_form.lmr_type,
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
      dataLMRCHild.push(dataChild);
      // }
    }
    console.log("dataLMR", dataLMR);
    console.log("dataLMRChild", dataLMRCHild);
    const respondSaveLMR = await this.postDatatoAPINODE(
      "/aspassignment/createOneAspAssignment",
      { asp_data: dataLMR, asp_data_child: dataLMRCHild }
    );
    if (
      respondSaveLMR.data !== undefined &&
      respondSaveLMR.status >= 200 &&
      respondSaveLMR.status <= 300
    ) {
      this.setState({
        action_status: "success",
        redirectSign: respondSaveLMR.data.parent._id,
      });
      this.toggleLoading();
      // setTimeout(
      //   <Redirect to={"/lmr-detail/" + this.state.redirectSign} />,
      //   1000
      // );
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
          this.toggleLoading();
        } else {
          this.setState({
            action_status: "failed",
            action_message: respondSaveLMR.response.data.error,
          });
          this.toggleLoading();
        }
      } else {
        this.setState({ action_status: "failed" });
        this.toggleLoading();
      }
    }
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

  addLMR = () => {
    this.handleCheckForm();
  };

  addChildLMR = () => {
    const key = this.state.key_child + 1;
    if (this.state.count_form_validate.length === 0) {
      let dataLMR = this.state.lmr_form;
      dataLMR["detail"].push({
        key: key,
        tax_code: "I0",
        currency: "MYR",
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        mm_data_type: dataLMR.mm_data_type,
        site_id: "",
        so_or_nw: "",
        activity: "",
      });
      this.setState({ lmr_form: dataLMR, key_child: key }, () =>
        console.log(this.state.lmr_form)
      );
    } else {
      return;
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
    const increase_edit = this.state.edit_count + 1;

    if (value !== (null && undefined)) {
      value = value.toString();
    }
    if (name === "item_category" && value === "3PP") {
      lmr_form["pgr"] = "MY1";
    }
    if (name === "item_category" && value === "Service") {
      lmr_form["pgr"] = "MY3";
    }
    if (name === "lmr_type" && value !== "Per Site") {
      lmr_form["plan_cost_reduction"] = "Yes";
      this.setState({ lmr_edit: false });
    }
    if (name === "lmr_type" && value !== "Cost Collector") {
      lmr_form["plan_cost_reduction"] = "No";
      // this.setState({ lmr_edit: false });
    }
    if (name === "gl_account") {
      let selected_options = e.target.options[e.target.selectedIndex].text;
      let mm_data_type = "";
      if (selected_options === "Transport - 402102") {
        mm_data_type = "NRO";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "Transport";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "ARP - 402693") {
        mm_data_type = "ARP";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "T&M";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NRO service - 402603") {
        mm_data_type = "NRO";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "NRO Services";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NDO service - 402603") {
        mm_data_type = "NDO";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "NDO Services";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NRO local material - 402201") {
        mm_data_type = "NRO";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "LM";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "3PP Hardware - 402201") {
        mm_data_type = "HW";
        lmr_form["gl_account_actual"] = selected_options;
        lmr_form["gl_type"] = "Hardware";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      this.setState({
        custom_gl_display: selected_options,
        mm_data_type: mm_data_type,
      });
    }
    if (name === "gl_account" && value !== null) {
      lmr_form[name.toString()] = this.getnumberGL(value);
    } else {
      lmr_form[name.toString()] = value;
    }
    this.setState({ lmr_form: lmr_form, edit_count: increase_edit }, () =>
      console.log(this.state.lmr_form)
    );
  }

  getnumberGL = (str) => {
    return str.split("-")[1];
  };

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
    const increase_edit = this.state.edit_count + 1;
    let dataLMR = this.state.creation_lmr_child_form;
    let dataparentLMR = this.state.lmr_form;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];

    dataLMR[parseInt(idx)][field] = value;

    if (field === "qty" && isNaN(dataLMR[parseInt(idx)].unit_price) === false) {
      dataLMR[parseInt(idx)]["total_value"] =
        value * dataLMR[parseInt(idx)].unit_price;
    }
    this.setState(
      {
        edit_count: increase_edit,
        // lmr_form: dataLMR,
        creation_lmr_child_form: dataLMR,
        // so_nw_updated: dataLMR[parseInt(idx)]["so_or_nw"],
      },
      () => this.sumTotalPrice()
    );
  }

  handleChangeCDFormLMRChild = (e, action) => {
    const increase_edit = this.state.edit_count + 1;
    let dataLMR = this.state.lmr_form.detail;
    let dataparentLMR_GL = this.state.lmr_form;
    let idxField = action.name.split(" /// ");
    let value = e.value;
    let idx = idxField[0];
    let field = idxField[1];
    if (field === "cdid" && this.state.lmr_form.lmr_type === "Per Site") {
      let cdData = this.state.list_cd_id_act.find((e) => e.cdid === value);
      console.log("cddata", cdData);
      let custom_site_display = cdData.loc_id + "_" + cdData.site_name;
      dataLMR[parseInt(idx)]["custom_site_display"] = custom_site_display;
      dataLMR[parseInt(idx)]["site_id"] = cdData.site_name;
      dataLMR[parseInt(idx)]["project_name"] = cdData.project;
      dataLMR[parseInt(idx)]["cdid"] = value;
      if (dataparentLMR_GL["gl_account_actual"] === "Transport - 402102") {
        dataLMR[parseInt(idx)]["nw"] = "";
        dataLMR[parseInt(idx)]["activity"] = "803X";
      }
      if (dataparentLMR_GL["gl_account_actual"] === "NRO service - 402603") {
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_nro;
        dataLMR[parseInt(idx)]["activity"] = "5640";
        dataLMR[parseInt(idx)]["wp_id"] = cdData.wp_id;
      }
      if (
        dataparentLMR_GL["gl_account_actual"] === "NRO local material - 402201"
      ) {
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_hw;
        dataLMR[parseInt(idx)]["activity"] = "2000";
      }
      if (dataparentLMR_GL["gl_account_actual"] === "NDO service - 402603") {
        // should be NDO
        dataLMR[parseInt(idx)]["nw"] = cdData.nw_ndo;
        dataLMR[parseInt(idx)]["activity"] = "5200";
      }
      // if (dataparentLMR_GL === "3PP Hardware - 402201") {
      //   dataLMR[parseInt(idx)]["so_or_nw"] = cdData.nw_hw;
      //   dataLMR[parseInt(idx)]["activity"] = "2000";
      // }
      this.setState({
        cd_id_selected: value,
      });
    }
    this.setState(
      { creation_lmr_child_form: dataLMR, edit_count: increase_edit },
      () => console.log(this.state.creation_lmr_child_form)
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

  loopSearchBarHW = () => {
    let searchBar = [];
    for (let i = 0; i < 7; i++) {
      searchBar.push(
        <td>
          {i !== 2 ? (
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

  handleDeleteLMRChild(key) {
    console.log(key);
    const increase_edit = this.state.edit_count + 1;
    let dataLMR = this.state.lmr_form;
    let after_delete = dataLMR["detail"].filter((i) => i.key !== key);
    console.log(after_delete);
    this.setState({
      lmr_form: after_delete,
      creation_lmr_child_form: after_delete,
      edit_count: increase_edit,
    });
  }

  handleDeleteLMRChildexist = (key) => {
    console.log(key);
    const increase_edit = this.state.edit_count + 1;
    const dataLMR = this.state.lmr_form;
    const after_delete = dataLMR.detail.filter((i) => i._id !== key);
    dataLMR["detail"] = after_delete;
    // console.log(after_delete);
    this.setState(
      {
        lmr_form: dataLMR,
        creation_lmr_child_form: after_delete,
        edit_count: increase_edit,
      },
      () => console.log(this.state.lmr_form)
    );
  };

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

  // loadcdACT = () => {
  //     let cd_id_list = [];
  //   this.state.list_cd_id_act.map((e) =>
  //     cd_id_list.push({ label: e.workplan_id, value: e.workplan_id })
  //   );
  //   this.setState({options: cd_id_list}, () => console.log(this.state.options))
  // }

  onMenuOpen = () => {
    let cd_id_list = [];
    this.state.list_cd_id_act
      // .filter((data) => data.cd_id !== "null" && data.cd_id !== null)
      .map((e) => cd_id_list.push({ label: e.cd_id, value: e.cd_id }));
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

  handleCheckForm = () => {
    const lmr_header = this.state.lmr_form;
    let error = [];
    let dataValidate = {};

    const form_to_validate = [
      "lmr_type",
      // "gl_account_actual",
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
    this.setState(
      { formvalidate: dataValidate, count_form_validate: error },
      () => this.addChildLMR()
    );
  };

  render() {
    const matfilter = this.state.matfilter;
    // console.log("this.props.dataUser", this.props.dataUser);
    if (this.state.redirectSign !== false) {
      setTimeout(1500);
      return <Redirect to={"/lmr-detail/" + this.state.redirectSign} />;
    }
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
                  <i className="fa fa-edit" style={{ marginRight: "8px" }}></i>
                  Assignment {this.state.lmr_form.lmr_id}
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
                          <option value="Delete LMR">Delete LMR</option>                           */}
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
                          <option value="" disabled selected hidden>
                            Select Item Category
                          </option>
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
                          style={
                            this.state.formvalidate.lmr_type === false
                              ? { borderColor: "red" }
                              : {}
                          }
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

                        {this.state.lmr_form.lmr_type === "Cost Collector" ? (
                          <Input
                            type="select"
                            name="gl_account"
                            id="gl_account"
                            value={this.state.lmr_form.gl_account_actual}
                            onChange={this.handleChangeFormLMR}
                            style={
                              this.state.formvalidate.gl_account === false
                                ? { borderColor: "red" }
                                : {}
                            }
                          >
                            {this.getOptionbyRole3(this.state.roleUser)}
                          </Input>
                        ) : (
                          <Input
                            type="select"
                            name="gl_account"
                            id="gl_account"
                            value={this.state.lmr_form.gl_account_actual}
                            onChange={this.handleChangeFormLMR}
                            style={
                              this.state.formvalidate.gl_account === false
                                ? { borderColor: "red" }
                                : {}
                            }
                          >
                            {this.getOptionbyRole1(this.state.roleUser)}
                          </Input>
                        )}
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
                          style={
                            this.state.formvalidate.fas_id === false
                              ? { borderColor: "red" }
                              : {}
                          }
                        >
                          <option value="" disabled selected hidden>
                            Select Fas
                          </option>
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
                          style={
                            this.state.formvalidate.header_text === false
                              ? { borderColor: "red" }
                              : {}
                          }
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
                          style={
                            this.state.formvalidate.vendor_name === false
                              ? { borderColor: "red" }
                              : {}
                          }
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
                          <option value={null} selected></option>
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
                          <option value={null} selected></option>
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
                          <option value={null} selected></option>
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
                          <option value={null} selected></option>
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
                          <option value={null} selected></option>
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
                {this.state.creation_lmr_child_form !== undefined &&
                  this.state.creation_lmr_child_form.map((lmr, i) => (
                    <Form>
                      <Row form>
                        <Col md={3}>
                          <FormGroup>
                            <Label>CD ID</Label>
                            <AsyncSelect
                              cacheOptions
                              defaultOptions
                              name={i + " /// cdid"}
                              id={i + " /// cdid"}
                              value={{
                                label: lmr.cdid,
                                value: lmr.cdid,
                              }}
                              // options={this.state.options}
                              // onMenuOpen={this.onMenuOpen}
                              loadOptions={this.seachCDList}
                              onChange={this.handleChangeCDFormLMRChild}
                              isDisabled={
                                this.state.lmr_form.LMR_Type ===
                                "Cost Collector"
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Project Name</Label>
                            {/* {this.state.lmr_form.LMR_Type === "Cost Collector" ? ( */}
                            <Input
                              type="select"
                              name={i + " /// project_name"}
                              id={i + " /// project_name"}
                              value={lmr.project_name}
                              onChange={this.handleChangeFormLMRChild}
                            >
                              <option value="" disabled selected hidden>
                                Select Project Name
                              </option>
                              {this.state.list_project.map((e) => (
                                <option value={e}>{e}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>

                        <Col md={2}>
                          <FormGroup>
                            <Label>Site ID / Text ID</Label>
                            <Input
                              type="text"
                              name={i + " /// site_id"}
                              id={i + " /// site_id"}
                              value={lmr.site_id}
                              onChange={this.handleChangeFormLMRChild}
                              // disabled={
                              //   this.state.lmr_form.LMR_Type === "Cost Collector"
                              // }
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
                              // disabled={
                              //   this.state.lmr_form.LMR_Type === "Cost Collector"
                              // }
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
                              //   this.state.lmr_form.LMR_Type === "Cost Collector"
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
                            {/* {lmr._id !== undefined && lmr._id !== null ? ( */}
                            <Input
                              type="text"
                              name={i + " /// material_type"}
                              id={i + " /// material_type"}
                              // value={lmr.material_type}
                              value={this.state.lmr_form.mm_data_type}
                              onChange={this.handleChangeFormLMRChild}
                              readOnly
                            />
                            {/* ) : (
                              <Input
                                type="text"
                                name={i + " /// material_type"}
                                id={i + " /// material_type"}
                                // value={lmr.material_type}
                                value={this.state.mm_data_type}
                                onChange={this.handleChangeFormLMRChild}
                                readOnly
                              />
                            )} */}
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Material</Label>
                            {lmr._id !== undefined && lmr._id !== null ? (
                              <Input
                                type="text"
                                name={i + " /// material"}
                                id={i + " /// material"}
                                value={lmr.material}
                                onClick={() =>
                                  this.decideToggleMaterialexist(i)
                                }
                                // onChange={this.handleChangeFormLMRChild}
                              />
                            ) : (
                              <Input
                                type="text"
                                name={i + " /// material"}
                                id={i + " /// material"}
                                value={lmr.material}
                                onClick={() => this.decideToggleMaterial(i)}
                                // onChange={this.handleChangeFormLMRChild}
                              />
                            )}
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
                              min="0.1"
                              type="number"
                              name={i + " /// qty"}
                              id={i + " /// qty"}
                              value={lmr.qty}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          {lmr._id !== "" ? (
                            <FormGroup>
                              <Label>Total Amount</Label>
                              <Input
                                type="number"
                                name={i + " /// total_value"}
                                id={i + " /// total_value"}
                                value={lmr.unit_price * lmr.qty}
                                onChange={this.handleChangeFormLMRChild}
                              />
                            </FormGroup>
                          ) : (
                            <FormGroup>
                              <Label>Total Amount</Label>
                              <Input
                                type="number"
                                name={i + " /// total_value"}
                                id={i + " /// total_value"}
                                value={lmr.total_value}
                                onChange={this.handleChangeFormLMRChild}
                              />
                            </FormGroup>
                          )}
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
                              <option value="MYR" selected>
                                MYR
                              </option>
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
                              value={convertDateFormat(lmr.delivery_date)}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          {lmr._id !== null ? (
                            <Button
                              color="danger"
                              size="sm"
                              onClick={(e) =>
                                this.handleDeleteLMRChildexist(lmr._id)
                              }
                              style={{ float: "right", marginTop: "30px" }}
                            >
                              <span className="fa fa-times"></span>
                            </Button>
                          ) : (
                            <Button
                              color="danger"
                              size="sm"
                              onClick={(e) =>
                                this.handleDeleteLMRChild(lmr.key)
                              }
                              style={{ float: "right", marginTop: "30px" }}
                            >
                              <span className="fa fa-times"></span>
                            </Button>
                          )}
                        </Col>
                      </Row>
                      <hr className="upload-line--lmr"></hr>
                    </Form>
                  ))}
                <div>
                  <Button color="primary" size="sm" onClick={this.addLMR}>
                    <i className="fa fa-plus">&nbsp;</i> LMR
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
                  <i className="fa-floppy-o" style={{ marginRight: "8px" }}></i>
                  Save
                </Button>{" "}
                <Button
                  color="success"
                  size="sm"
                  style={{ float: "right" }}
                  onClick={this.createLMR}
                  disabled={this.state.edit_count === 0}
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
                    {this.loopSearchBarHW()}
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
              <Table responsive striped bordered size="sm">
                <thead>
                  <th></th>
                  <th>MM_Code</th>
                  <th>MM_Description</th>
                  <th>UoM</th>
                  <th>Unit_Price</th>
                  <th>Currency</th>
                  <th>Remarks</th>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    {this.loopSearchBarARP()}
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
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
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

export default connect(mapStateToProps)(MYASGEdit);
