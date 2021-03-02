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
import { getDatafromAPINODE } from "../../helper/asyncFunction";
import { connect } from "react-redux";
import { number } from "prop-types";
import debounce from 'lodash.debounce';
import './LMRMY.css';

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const data_raw_dev = {
  query_param: {
    table: "p_celc_tes2_m_site_data",
    columns: [
      "m_id",
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c02767d3-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as workplan_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec14232-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as workplan_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec4bff5-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as network_element_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c0292f27-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as program',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c02b9c03-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as project',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."fdee0f72-e056-11e9-acbc-000d3aa3db8c"."value"\')) as sub_project',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."fdf0f5cf-e056-11e9-acbc-000d3aa3db8c"."value"\')) as po',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c02d5c22-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as cluster',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c031052c-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as pc_sc_npc',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c03262d4-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as region',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c02ebba1-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as site_category',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c02767d3-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as ref_no',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c03aa61a-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as loc_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c036b531-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as site_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."fdf28189-e056-11e9-acbc-000d3aa3db8c"."value"\')) as technology',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec58ad8-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as final_planned_tech',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec672d3-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as material_purchase',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec7dd57-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as scope_status',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec90098-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as wbs_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ec9e722-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as wbs_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."9ecbfa81-c1a5-11ea-af53-000d3aa3db8c"."value"\')) as asp_assigned',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."c03e0897-adf8-11e9-bb77-000d3aa3db8c"."value"\')) as fas_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e8801de2-07a5-11eb-8826-000d3aa3db8c"."value"\')) as asp_assigned_survey',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e881c18e-07a5-11eb-8826-000d3aa3db8c"."value"\')) as committed_cost_cleared_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e8831879-07a5-11eb-8826-000d3aa3db8c"."value"\')) as committed_cost_cleared_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e8840804-07a5-11eb-8826-000d3aa3db8c"."value"\')) as committed_cost_cleared_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e884f4df-07a5-11eb-8826-000d3aa3db8c"."value"\')) as wbs_closure_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e8860421-07a5-11eb-8826-000d3aa3db8c"."value"\')) as wbs_closure_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e886c79f-07a5-11eb-8826-000d3aa3db8c"."value"\')) as wbs_closure_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e8875848-07a5-11eb-8826-000d3aa3db8c"."value"\')) as wbs_lm',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e888465a-07a5-11eb-8826-000d3aa3db8c"."value"\')) as wbs_hwac',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e889200f-07a5-11eb-8826-000d3aa3db8c"."value"\')) as nw_lm',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e889fec8-07a5-11eb-8826-000d3aa3db8c"."value"\')) as nw_hwac',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e88aea2a-07a5-11eb-8826-000d3aa3db8c"."value"\')) as nro_service',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e88bce5e-07a5-11eb-8826-000d3aa3db8c"."value"\')) as ndo_service',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."e88cb734-07a5-11eb-8826-000d3aa3db8c"."value"\')) as nro_local_material',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2d394e53-07a1-11eb-8826-000d3aa3db8c"."value"\')) as wbs_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2d3b0660-07a1-11eb-8826-000d3aa3db8c"."value"\')) as nw_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2d3c1bde-07a1-11eb-8826-000d3aa3db8c"."value"\')) as nw_ndo',
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

const package_example = [
  {
    Package_Id: "0001",
    Package_Name: "Package123",
    Region: "KV",
    MM_Data: [
      {
        MM_Code: "ECM-DG-NEW2.1-KV",
        Description: "Description of ECM-DG-NEW2.1-KV",
        Price: 1000,
        Qty: 1,
        Transport: "no"
      },
      {
        MM_Code: "ECM-DG-KV-ADD5.1",
        Description: "Description of ECM-DG-KV-ADD5.1",
        Price: 2000,
        Qty: 2,
        Transport: "no"
      },
      {
        MM_Code: "ECM-DG-KV-DOCONLY",
        Description: "Description of ECM-DG-KV-DOCONLY",
        Price: 3000,
        Qty: 3,
        Transport: "no"
      },
      {
        MM_Code: "Placeholder for transport",
        Description: "Placeholder for transport",
        Price: 0,
        Qty: 0,
        Transport: "yes"
      }
    ]
  },
  {
    Package_Id: "0002",
    Package_Name: "Package234",
    Region: "KV",
    MM_Data: [
      {
        MM_Code: "Material1",
        Description: "Description of Material1",
        Price: 2000,
        Qty: 1,
        Transport: "no"
      },
      {
        MM_Code: "Material2",
        Description: "Description of Material2",
        Price: 4000,
        Qty: 2,
        Transport: "no"
      },
      {
        MM_Code: "Material3",
        Description: "Description of Material3",
        Price: 6000,
        Qty: 3,
        Transport: "no"
      }
    ]
  }
]

class MYASGCreation extends Component {
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
      createModal: true,
      lmr_edit: true,
      modal_loading: false,
      modal_material: false,
      modal_material_NRO: false,
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
        currency: "MYR"
      },
      validation_form: {},
      current_material_select: null,
      data_user: this.props.dataUser,
      filter_list: new Array(8).fill(""),
      filter_list_package: new Array(3).fill(""),
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
      header_data: {},
      child_data: {},
      check_draft: false,
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
    this.state.filter_list_package[2] !== "" && (filter_array.push('"Region":{"$regex" : "' + this.state.filter_list_package[2] + '", "$options" : "i"}'));
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

  toggleModalPackage = () => {
    this.getPackageList();
    this.setState((prevState) => ({
      modal_package: !prevState.modal_package,
    }));
  }

  toggleModalCheckMaterialPackage = () => {
    this.setState((prevState) => ({
      modal_check_material_package: !prevState.modal_check_material_package,
    }));
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

  async getCDfromACTdev(proxyurl, url) {
    try {
      let respond = await axios.post(proxyurl + url, data_raw_dev, {
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

  getDataCDACTdev = () => {
    this.getCDfromACTdev(
      "https://cors-anywhere.herokuapp.com/",
      "https://uat.act.e-dpm.com/index.php/android/get_data_new"
    ).then((resCD) => {
      this.toggleLoading();
      if (resCD.data !== undefined) {
        if (resCD.data.result !== undefined) {
          const list_cd_act = resCD.data.result.raw_data;
          const filter_cd_id = list_cd_act.filter(
            (cd) => cd.cd_id !== null && cd.cd_id !== "null"
          );
          const filter_project = list_cd_act.filter(
            (proj) => proj.cd_id !== null
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
            <option value="NRO service - 402603">NRO service - 402603</option>
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
    // this.getDataCDACT(); enable this again later
    // this.getDataCDACT_Fas();
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

  getMaterialList(number_child_form) {
    let filter_array = [];
    this.state.creation_lmr_child_form[number_child_form].transport === "yes" && filter_array.push('"BB":"Transport"');
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
      "/mmCodeDigi/getMm?q=" +
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
      "/mmCodeDigi/getMm?q=" +
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
      "/mmCodeDigi/getMm?q=" +
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
      "/mmCodeDigi/getMm?q=" +
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
      localStorage.removeItem("asp_data");
      localStorage.removeItem("asp_data_child");
      this.setState({
        action_status: "success",
        redirectSign: respondSaveLMR.data.parent._id,
      });
      this.toggleLoading();
    } else {
      localStorage.setItem("asp_data", JSON.stringify(dataLMR));
      localStorage.setItem("asp_data_child", JSON.stringify(dataLMRCHild));
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
        this.setState({
          action_status: "failed",
          actionMessage:
            "There is something error. Don't worry, we saved a draft for you. Please refresh page",
        });
        this.toggleLoading();
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
    if (this.state.count_form_validate.length === 0) {
      let dataLMR = this.state.creation_lmr_child_form;
      dataLMR.push({
        key: key,
        tax_code: "I0",
        currency: "MYR",
        item_status: "Submit",
        work_status: "Waiting for PR-PO creation",
        site_id: "",
        nw: "",
        activity: "",
      });
      this.setState({ creation_lmr_child_form: dataLMR, key_child: key });
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
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "NRO";
        lmr_form["gl_type"] = "Transport";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "ARP - 402693") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "ARP";
        lmr_form["gl_type"] = "T&M";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NRO service - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "NRO";
        lmr_form["gl_type"] = "NRO Services";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NDO service - 402603") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "NDO";
        lmr_form["gl_type"] = "NDO Services";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "NRO local material - 402201") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "NRO";
        lmr_form["gl_type"] = "LM";
        lmr_form["mm_data_type"] = mm_data_type;
      }
      if (selected_options === "3PP Hardware - 402201") {
        lmr_form["gl_account_actual"] = selected_options;
        mm_data_type = "HW";
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
    this.setState({ lmr_form: lmr_form }, () =>
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
    for (let i = 0; i < 3; i++) {
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

  handleDeleteLMRChild(key) {
    console.log(key);
    let LMRChild = this.state.creation_lmr_child_form;
    let after_delete = LMRChild.filter((i) => i.key !== key);
    console.log(after_delete);
    this.setState({ creation_lmr_child_form: after_delete });
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

  handleCheckForm = () => {
    const lmr_header = this.state.lmr_form;
    let error = [];
    let dataValidate = {};

    const form_to_validate = [
      "lmr_type",
      "gl_account",
      // "fas_id",
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

  handleSelectPackage = (e) => {
    const value = e.target.value;
    let selectedPackage = this.state.package_list.find((e) => e.Package_Id === value);
    let lmrChildAll = [];
    for (let i = 0; i < selectedPackage.MM_Data.length; i++) {
      let lmrChild = {
        key: i + 1,
        activity: this.state.lmr_child_package.activity,
        currency: this.state.lmr_child_package.currency,
        delivery_date: this.state.lmr_child_package.delivery_date,
        description: selectedPackage.MM_Data[i].Description,
        item_status: "Submit",
        material: selectedPackage.MM_Data[i].MM_Code,
        material_code_doc: "60112f2feea6d1f700aa55ab",
        nw: this.state.lmr_child_package.nw,
        qty: selectedPackage.MM_Data[i].Qty,
        site_id: this.state.lmr_child_package.site_id,
        tax_code: this.state.lmr_child_package.tax_code,
        total_value: selectedPackage.MM_Data[i].Qty * selectedPackage.MM_Data[i].Price,
        unit_price: selectedPackage.MM_Data[i].Price,
        work_status: "Waiting for PR-PO creation",
        transport: selectedPackage.MM_Data[i].Transport
      }
      lmrChildAll.push(lmrChild);
    }
    this.setState({ creation_lmr_child_form: lmrChildAll }, () => this.toggleModalPackage());
  }

  handleCheckMaterialPackage = (e) => {
    const value = e.target.value;
    let selectedPackage = this.state.package_list.find((e) => e.Package_Id === value);
    let allMaterials = [];
    for (let i = 0; i < selectedPackage.MM_Data.length; i++) {
      let material = {
        MM_Code: selectedPackage.MM_Data[i].MM_Code,
        Description: selectedPackage.MM_Data[i].Description,
        Price: selectedPackage.MM_Data[i].Price,
        Qty: selectedPackage.MM_Data[i].Qty
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
            />
          </Col>
        </Row>
        <Row>
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
                <Button color="primary" style={{ marginBottom: "16px" }} onClick={this.toggleModalPackage}><i className="fa fa-cubes" style={{ marginRight: "8px" }}></i>Select Package</Button>
                {this.state.creation_lmr_child_form.map((lmr, i) => (
                  <Form>
                    {lmr.transport === "yes" && (<Alert color="danger" pill>Please Select Transport Material!</Alert>)}
                    <Row form>
                      <Col md={3}>
                        <FormGroup>
                          <Label>CD ID</Label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            name={i + " /// cdid"}
                            id={i + " /// cdid"}
                            value={{ label: lmr.cdid, value: lmr.cdid }}
                            // options={this.state.options}
                            // onMenuOpen={this.onMenuOpen}
                            loadOptions={this.seachCDList}
                            onChange={this.handleChangeCDFormLMRChild}
                            isDisabled={
                              this.state.lmr_form.lmr_type === "Cost Collector"
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Project Name</Label>
                          {/* {this.state.lmr_form.lmr_type === "Cost Collector" ? ( */}
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
                          {/* ) : (
                            <Input
                              type="select"
                              name={i + " /// project_name"}
                              id={i + " /// project_name"}
                              value={lmr.project_name}
                              // onChange={this.handleChangeFormLMRChild}
                              // readOnly
                            >
                              <option value="" disabled selected hidden>
                                Select Project Name
                              </option>
                              {this.state.list_project.map((e) => (
                                <option value={e}>{e}</option>
                              ))}
                            </Input>
                          )} */}
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
                          //   this.state.lmr_form.lmr_type === "Cost Collector"
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
                          //   this.state.lmr_form.lmr_type === "Cost Collector"
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
                            value={lmr.delivery_date}
                            onChange={this.handleChangeFormLMRChild}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={(e) => this.handleDeleteLMRChild(lmr.key)}
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
                  <Button color="primary" size="sm" onClick={this.addLMR}>
                    <i className="fa fa-plus">&nbsp;</i> LMR Child
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
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

        {/* Modal Package */}
        <Modal
          isOpen={this.state.modal_package}
          toggle={this.toggleModalPackage}
          className={"modal-lg"}
        >
          <ModalBody>
            <div class="table-container">
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label>CD ID</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={this.seachCDList}
                      onChange={this.handleChangeCDFormLMRChild}
                      isDisabled={
                        this.state.lmr_form.lmr_type === "Cost Collector"
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Project Name</Label>
                    <Input
                      type="select"
                      name="project_name"
                      onChange={this.handleChangeFormLMRChildPackage}
                      value={this.state.lmr_child_package.project_name}
                    >
                      <option value="" disabled selected hidden>Select Project Name</option>
                      {this.state.list_project.map((e) => (
                        <option value={e}>{e}</option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Site ID / Text ID</Label>
                    <Input
                      type="text"
                      name="site_id"
                      onChange={this.handleChangeFormLMRChildPackage}
                      value={this.state.lmr_child_package.site_id}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>SO / NW</Label>
                    <Input
                      type="text"
                      name="nw"
                      onChange={this.handleChangeFormLMRChildPackage}
                      value={this.state.lmr_child_package.nw}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
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
                <Col md={3}>
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
                <Col md={3}>
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
                            value={e.Package_Id}
                            onClick={this.handleSelectPackage}
                          >
                            <i className="fa fa-check-square" style={{ marginRight: "8px" }}></i>Select
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            value={e.Package_Id}
                            onClick={this.handleCheckMaterialPackage}
                            style={{ marginLeft: 8 }}
                          >
                            <i className="fa fa-cubes" style={{ marginRight: "8px" }}></i>Check Material
                          </Button>
                        </td>
                        <td>{e.Package_Id}</td>
                        <td>{e.Package_Name}</td>
                        <td>{e.Region}</td>
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
          className={"modal-lg"}
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
