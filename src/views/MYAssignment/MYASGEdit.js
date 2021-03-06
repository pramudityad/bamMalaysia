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
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "./LMRMY.css";
import { connect } from "react-redux";
import { getDatafromAPINODE } from "../../helper/asyncFunction";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

// const BearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiI1MmVhNTZhMS0zNDMxLTRlMmQtYWExZS1hNTc3ODQzMTMxYzEiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MTY5MTE4MH0.FpbzlssSQyaAbJOzNf3KLqHPnYo_ccBtBWu6n87h1RQ';
const BearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXNfaWQiOiIxOTM2YmE0Yy0wMjlkLTQ1MzktYWRkOC1mZjc2OTNiMDlmZmUiLCJyb2xlcyI6WyJCQU0tU3VwZXJBZG1pbiJdLCJhY2NvdW50IjoiMSIsImlhdCI6MTU5MjQ3MDI4Mn0.tIJSzHa-ewhqz0Ail7J0maIZx4R9P1aXE2E_49pe4KY";

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

const all_reqbody_raw = {
  query_param: {
    table: "p_celc_apim1_m_site_data",
    columns: [
      "m_id",

      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dec7a1c-d14e-11ea-b481-000d3aa2f57d"."value"\')) as loc_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6deda4c0-d14e-11ea-b481-000d3aa2f57d"."value"\')) as site_name',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."6dfb6b35-d14e-11ea-b481-000d3aa2f57d"."value"\')) as fas_id',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."ce9e1915-127e-11eb-a1c8-000d3aa2f57d"."value"\')) as nw_hw',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2461aac5-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_nro',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."2462836e-07a9-11eb-8887-000d3aa2f57d"."value"\')) as nw_ndo',
      'JSON_UNQUOTE(JSON_EXTRACT(custom_property, \'$."3e55d901-172d-11eb-99f8-000d3aa2f57d"."value"\')) as cd_id',
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

class MYASGEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // tokenUser: this.props.dataLogin.token,
      tokenUser: this.props.dataLogin.token,
      lmr_form: {
        pgr: "MP2",
        gl_account: "402102",
        lmr_issued_by: this.props.dataLogin.userName,
        plant: "MY",
        customer: "CELCOM",
        request_type: "Change LMR",
      },
      lmr_edit: true,
      modal_loading: false,
      modal_material: false,
      list_project: [],
      creation_lmr_child_form: [],
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      form_checking: {},
      list_cd_id: [],
      cd_id_selected: null,
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
      lmr_detail: {},
      list_pr_po: [],
      filter_list: new Array(7).fill(""),
      new_child: false,
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
    };
    this.handleChangeCD = this.handleChangeCD.bind(this);
    this.loadOptionsCDID = this.loadOptionsCDID.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.handleChangeFormLMR = this.handleChangeFormLMR.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.createLMR = this.createLMR.bind(this);
    this.handleChangeVendor = this.handleChangeVendor.bind(this);
    this.addLMR = this.addLMR.bind(this);
    this.handleChangeFormLMRChild = this.handleChangeFormLMRChild.bind(this);
    this.toggleMaterial = this.toggleMaterial.bind(this);
    this.handleChangeMaterial = this.handleChangeMaterial.bind(this);
    this.deleteLMR = this.deleteLMR.bind(this);
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggleMaterial(number_child_form) {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.setState((prevState) => ({
      modal_material: !prevState.modal_material,
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

  getDataCD() {
    this.getDatafromAPIMY("/cdid_data").then((resCD) => {
      if (resCD.data !== undefined) {
        this.setState({ list_cd_id: resCD.data._items });
      }
    });
  }

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
      console.log("uniq proj", this.state.list_project)
    );
  };

  componentDidMount() {
    this.getVendorList();
    this.getDataCDACT();
    // this.getProjectList();
    // this.getMaterialList();
    // this.getDataCD();
    if (this.props.match.params.id === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.id);
    }
    // this.getMaterialList();
    console.log("id ", this.props.match.params.id);
    document.title = "LMR Creation | BAM";
  }

  getLMRDetailData(_id) {
    this.getDataFromAPINODE("/aspassignment/getAspAssignment/" + _id).then(
      (res) => {
        if (res.data !== undefined) {
          const dataLMRDetail = res.data.data;
          this.setState({ lmr_detail: dataLMRDetail }, () => {
            console.log("lmr_detail detail ", this.state.lmr_detail.detail);
            this.getDataPRPO(dataLMRDetail.lmr_id);
          });
        }
      }
    );
  }

  getDataPRPO(LMR_ID) {
    this.getDatafromAPIMY(
      '/prpo_data?where={"LMR_No" : "' + LMR_ID + '"}'
    ).then((res) => {
      if (res.data !== undefined) {
        const dataLMRDetailPRPO = res.data._items;
        this.setState({ list_pr_po: dataLMRDetailPRPO });
        console.log("list_pr_po ", this.state.list_pr_po);
      }
    });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.getMaterialList();
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
    this.getMaterialList();
  }

  getProjectList() {
    this.getDatafromAPIMY("/project_data").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ list_project: items });
      }
    });
  }

  getVendorList() {
    this.getDatafromAPIMY("/vendor_data").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ vendor_list: items });
      }
    });
    // this.setState({vendor_list : vendorList});
  }

  getMaterialList(number_child_form) {
    let filter_array = [];
    // vendor
    this.state.lmr_form.vendor_code !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code + '"'
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
    this.state.lmr_form.vendor_code !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code + '"'
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
    this.state.lmr_form.vendor_code !== "" &&
      filter_array.push(
        '"Vendor_ID":"' + this.state.lmr_form.vendor_code + '"'
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
    this.state.lmr_form.vendor_code !== "" &&
      filter_array.push(
        '"Vendor_List.Vendor_Code":"' + this.state.lmr_form.vendor_code + '"'
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

  handleChangeVendor(e) {
    const value = e.target.value;
    let lmr_form = this.state.lmr_form;
    let dataVendor = this.state.vendor_list.find(
      (e) => e.Vendor_Code === value
    );
    lmr_form["vendor_code"] = dataVendor.Vendor_Code;
    lmr_form["vendor_name"] = dataVendor.Name;
    lmr_form["vendor_email"] = dataVendor.Email;
    this.setState({ lmr_form: lmr_form });
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

  handleChangeFormLMR(e) {
    const name = e.target.name;
    let value = e.target.value;
    let lmr_form = this.state.lmr_form;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    if (value === "Per Site") {
      this.setState({ lmr_edit: !this.state.lmr_edit });
    } else {
      if (name === "project_name") {
        let dataProject = this.state.list_project.find(
          (e) => e.Project === value
        );
        if (dataProject !== undefined) {
          lmr_form["id_project_doc"] = dataProject._id;
        }
      }
      lmr_form[name.toString()] = value;
      this.setState({ lmr_form: lmr_form }, () =>
        console.log(this.state.lmr_form)
      );
    }
  }

  async createLMR() {
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
    const respondSaveLMR = await this.postDatatoAPINODE(
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

  addLMR() {
    let dataLMR = this.state.lmr_detail.detail;
    dataLMR.push({
      tax_code: "I0",
      currency: "MYR",
      item_status: "Submit",
      work_status: "Waiting for PR-PO creation",
      site_id: "",
      so_or_nw: "",
      activity: "",
    });
    this.setState({
      creation_lmr_child_form: dataLMR,
      new_child: !this.state.new_child,
    });
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

  handleChangeFormLMRChild(e) {
    let dataLMR = this.state.lmr_detail.detail;
    // console.log('dataLMR ', dataLMR)
    let idxField = e.target.name.split(" /// ");
    // console.log('idxField ',idxField)
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];
    console.log("3 field ", value, idx, field);

    dataLMR[parseInt(idx)][field] = value;
    if (field === "quantity" && isNaN(dataLMR[parseInt(idx)].price) === false) {
      dataLMR[parseInt(idx)]["total_amount"] =
        value * dataLMR[parseInt(idx)].price;
    }
    this.setState({ creation_lmr_child_form: dataLMR });
    console.log("creation_lmr_child_form ", this.state.creation_lmr_child_form);
  }

  // handleChangeFormLMRChild = (idx) => (e) => {
  //   const value = e.currentTarget.value;
  //   const name = e.currentTarget.name;
  //   const newLMRChild = this.state.creation_lmr_child_form.map((lmr, sidx) => {
  //     if (idx !== sidx) return lmr;
  //     return { ...lmr, [name]: value, [name]: value, [name]: value };
  //   });

  //   this.setState(
  //     {
  //       creation_lmr_child_form: newLMRChild,
  //     },
  //     () => console.log('lmr child ',this.state.creation_lmr_child_form)
  //   );
  // };

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

  render() {
    // console.log("this.props.dataUser", this.props.dataUser);
    if (this.state.redirectSign !== false) {
      return <Redirect to={"/mr-detail/" + this.state.redirectSign} />;
    }
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
                  <i className="fa fa-edit" style={{ marginRight: "8px" }}></i>
                  Assignment {this.state.lmr_detail.lmr_id}
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
                          value={this.state.lmr_detail.request_type}
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
                          name="Item_Category"
                          id="Item_Category"
                          value={this.state.lmr_detail.item_category}
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
                          name="LMR_Type"
                          id="LMR_Type"
                          value={this.state.lmr_detail.lmr_type}
                          onChange={this.handleChangeFormLMR}
                          // style={
                          //   this.state.formvalidate.LMR_Type === false
                          //     ? { borderColor: "red" }
                          //     : {}
                          // }
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
                          name="Plan_Cost_Reduction"
                          id="Plan_Cost_Reduction"
                          value={this.state.lmr_detail.plan_cost_reduction}
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
                          value={this.state.lmr_detail.pgr}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>GL Account</Label>

                        {this.state.lmr_detail.lmr_type === "Cost Collector" ? (
                          <Input
                            type="select"
                            name="gl_account"
                            id="gl_account"
                            value={this.state.lmr_detail.gl_account}
                            onChange={this.handleChangeFormLMR}
                            // style={
                            //   this.state.formvalidate.gl_account === false
                            //     ? { borderColor: "red" }
                            //     : {}
                            // }
                          >
                            {this.getOptionbyRole3(this.state.roleUser)}
                          </Input>
                        ) : (
                          <Input
                            type="select"
                            name="gl_account"
                            id="gl_account"
                            value={this.state.lmr_detail.gl_account}
                            onChange={this.handleChangeFormLMR}
                            // style={
                            //   this.state.formvalidate.gl_account === false
                            //     ? { borderColor: "red" }
                            //     : {}
                            // }
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
                          value={this.state.lmr_detail.fas_id}
                          onChange={this.handleChangeFormLMR}
                          // style={
                          //   this.state.formvalidate.fas_id === false
                          //     ? { borderColor: "red" }
                          //     : {}
                          // }
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
                          value={this.state.lmr_detail.header_text}
                          onChange={this.handleChangeFormLMR}
                          // style={
                          //   this.state.formvalidate.header_text === false
                          //     ? { borderColor: "red" }
                          //     : {}
                          // }
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
                          value={this.state.lmr_detail.vendor_code_actual}
                          onChange={this.handleChangeVendor}
                          // style={
                          //   this.state.formvalidate.vendor_name === false
                          //     ? { borderColor: "red" }
                          //     : {}
                          // }
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
                          value={this.state.lmr_detail.vendor_code_actual}
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
                          value={this.state.lmr_detail.vendor_address}
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
                          value={this.state.lmr_detail.total_price}
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
                          value={this.state.lmr_detail.l1_approver}
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
                          value={this.state.lmr_detail.l2_approver}
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
                          value={this.state.lmr_detail.l3_approver}
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
                          value={this.state.lmr_detail.l4_approver}
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
                          value={this.state.lmr_detail.l5_approver}
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
                {this.state.lmr_detail.detail !== undefined &&
                  this.state.lmr_detail.detail.map((lmr, i) => (
                    <Form>
                      <Row form key={lmr._id}>
                        <Col md={2}>
                          <FormGroup>
                            <Label>CD ID</Label>
                            <Input
                              //key={lmr._id}
                              type="select"
                              name={i + " /// cdid"}
                              // id={i + " /// cd_id"}
                              value={lmr.cdid}
                              // onChange={this.handleChangeFormLMRChild}
                              onChange={this.handleChangeFormLMRChild}
                              disabled={
                                this.state.lmr_form.LMR_Type ===
                                "Cost Collector"
                              }
                            >
                              <option value="" disabled selected hidden>
                                Select CD ID
                              </option>
                              {this.state.list_cd_id.map((e) => (
                                <option value={e.CD_ID}>{e.CD_ID}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Project Name</Label>
                            {this.state.lmr_edit === true ? (
                              <Input
                                //key={lmr._id}
                                type="select"
                                name={i + " /// project_name"}
                                // id="project_name"
                                value={lmr.project_name}
                                onChange={this.handleChangeFormLMR}
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
                                //key={lmr._id}
                                type="text"
                                name={i + " /// project_name"}
                                // id={i + " /// project_name"}
                                defaultValue={lmr.project_name}
                                // onChange={this.handleChangeFormLMR}
                                onChange={this.handleChangeFormLMRChild}
                                readOnly
                              />
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Per Site Material Type</Label>
                            <Input
                              //key={lmr._id}
                              type="select"
                              // name={"per_site_material_type"}
                              name={i + " /// per_site_material_type"}
                              // id={i + " /// per_site_material_type"}
                              defaultValue={lmr.per_site_material_type}
                              // onChange={this.handleChangeFormLMRChild}
                              onChange={this.handleChangeFormLMRChild}
                              disabled={
                                this.state.lmr_form.LMR_Type ===
                                "Cost Collector"
                              }
                            >
                              <option value="" disabled selected hidden>
                                Select Material Type
                              </option>
                              <option value="NRO Service">NRO Service</option>
                              <option value="NRO LM">NRO LM</option>
                              <option value="NDO Service">NDO Service</option>
                              {/* {this.state.vendor_list.map((e) => (
                            <option value={e.Vendor_Code}>{e.Name}</option>
                          ))} */}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Site ID</Label>
                            <Input
                              // key={lmr._id}
                              type="text"
                              name={i + " /// site_id"}
                              // id={i + " /// site_id"}
                              value={lmr.site_id}
                              onChange={this.handleChangeFormLMRChild}
                              // readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>SO / NW</Label>
                            <Input
                              key={lmr._id}
                              type="text"
                              name={i + " /// so_or_nw"}
                              // id={i + " /// so_or_nw"}
                              value={lmr.nw}
                              onChange={this.handleChangeFormLMRChild}
                              // readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>NW Activity</Label>
                            <Input
                              //key={lmr._id}
                              type="text"
                              name={i + " /// activity"}
                              // id={i + " /// activity"}
                              value={lmr.activity}
                              onChange={this.handleChangeFormLMRChild}
                              // readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Tax Code</Label>
                            <Input
                              //key={lmr._id}
                              type="text"
                              name={i + " /// tax_code"}
                              // id={i + " /// tax_code"}
                              value={lmr.tax_code}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Material</Label>
                            <Input
                              //key={lmr._id}
                              type="text"
                              name={i + " /// material"}
                              // id={i + " /// material"}
                              value={lmr.material}
                              onClick={() => this.toggleMaterial(i)}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Description</Label>
                            <Input
                              //key={lmr._id}
                              type="textarea"
                              name={i + " /// description"}
                              // id={i + " /// description"}
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
                              //key={lmr._id}
                              type="number"
                              name={i + " /// unit_price"}
                              // id={i + " /// price"}
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
                              //key={lmr._id}
                              type="number"
                              name={i + " /// qty"}
                              // id={i + " /// qty"}
                              value={lmr.qty}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Total Amount</Label>
                            <Input
                              //key={lmr._id}
                              type="number"
                              name={i + " /// total_price"}
                              // id={i+" /// total_price"}
                              value={lmr.total_price}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label>Currency</Label>
                            <Input
                              //key={lmr._id}
                              type="select"
                              name={i + " /// currency"}
                              // id={i+" /// currency"}
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
                              //key={lmr._id}
                              type="date"
                              name={i + " /// delivery_date"}
                              // id={i+" /// delivery_date"}
                              value={lmr.delivery_date}
                              onChange={this.handleChangeFormLMRChild}
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col md={3}>
                        <FormGroup>
                          <Label>Item Status</Label>
                          <Input
                            type="text"
                            name={i + " /// item_status"}
                            id={i + " /// item_status"}
                            value={lmr.item_status}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Work Status</Label>
                          <Input
                            type="text"
                            name={i + " /// work_status"}
                            id={i + " /// work_status"}
                            value={lmr.work_status}
                            onChange={this.handleChangeFormLMRChild}
                            disabled
                          />
                        </FormGroup>
                      </Col> */}
                        {lmr._id === null ? (
                          <Button
                            value={i}
                            onClick={this.deleteLMR}
                            color="danger"
                            size="sm"
                            style={{ marginLeft: "5px" }}
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                        ) : (
                          ""
                        )}
                      </Row>
                      <hr className="upload-line--lmr"></hr>
                    </Form>
                  ))}
                <div>
                  {/* <Button color="primary" size="sm" onClick={this.addLMR}>
                    <i className="fa fa-plus">&nbsp;</i> LMR
                  </Button> */}
                </div>
              </CardBody>
              <CardFooter>
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
                  Create LMR
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
          <ModalBody>
            <Table responsive striped bordered size="sm">
              <thead>
                <th></th>
                <th>MM Code</th>
                <th>Material Type</th>
                <th>SoW</th>
                <th>UoM</th>
                <th>Region</th>
                <th>Unit Price</th>
                <th>MM Description</th>
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
                {this.state.material_list.map((e) => (
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
                    <td>{e.BB_Sub}</td>
                    <td>{e.SoW_Description}</td>
                    <td>{e.UoM}</td>
                    <td>{e.Region}</td>
                    <td>{e.Unit_Price}</td>
                    <td>{e.MM_Description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
            <Button color="secondary" onClick={this.toggleLoading}>
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
