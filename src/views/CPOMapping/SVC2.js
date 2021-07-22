/* eslint-disable */
import React from "react";
import {
  Col,
  FormGroup,
  Label,
  Row,
  Table,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Collapse,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  Progress,
} from "reactstrap";
import Excel from "exceljs";
import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import debounce from "lodash.debounce";

import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
  getDatafromAPINODE2,
  apiSendEmail,
} from "../../helper/asyncFunction";
import { CSVLink, CSVDownload } from "react-csv";
import ModalCreateNew from "../Component/ModalCreateNew";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import {
  numToSSColumn,
  getUniqueListBy,
  convertDateFormat,
  formatMoney,
  arraychunk,
  convertDateFormat_firefox,
} from "../../helper/basicFunction";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import * as XLSX from "xlsx";
import "../../helper/config";
import "./cpomapping.css";
const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const save_update_header = [
  "Po_Number",
  "Data_1",
  "Lookup_Reference",
  "Region",
  "Reference_Loc_Id",
  "New_Loc_Id",
  "Site_Name",
  "New_Site_Name",
  "Config",
  "Po",
  "Line",
  "Description",
  "Qty",
  "CNI_Date",
  "Mapping_Date",
  "Remarks",
  "Proceed_Billing_100",
  "Celcom_User",
  "Pcode",
  "Unit_Price",
  "Total_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "So_Line_Item_Description",
  "Sitepcode",
  "VlookupWbs",
  "So_No",
  "Wbs_No",
  "Billing_100",
  "Atp_Coa_Received_Date_80",
  "Billing_Upon_Atp_Coa_80",
  "Invoicing_No_Atp_Coa_80",
  "Invoicing_Date_Atp_Coa_80",
  "Cancelled_Atp_Coa_80",
  "Ni_Coa_Date_20",
  "Billing_Upon_Ni_20",
  "Invoicing_No_Ni_20",
  "Invoicing_Date_Ni_20",
  "Cancelled_Invoicing_Ni_20",
  "Sso_Coa_Date_80",
  "Billing_Upon_Sso_80",
  "Invoicing_No_Sso_80",
  "Invoicing_Date_Sso_80",
  "Cancelled_Sso_Coa_Date_80",
  "Coa_Psp_Received_Date_20",
  "Billing_Upon_Coa_Psp_20",
  "Invoicing_No_Coa_Psp_20",
  "Invoicing_Date_Coa_Psp_20",
  "Cancelled_Coa_Psp_Received_Date_20",
  "Coa_Ni_Received_Date_40",
  "Billing_Upon_Coa_Ni_40",
  "Invoicing_No_Coa_Ni_40",
  "Invoicing_Date_Coa_Ni_40",
  "Cancelled_Coa_Ni_Received_Date_40",
  "Cosso_Received_Date_60",
  "Billing_Upon_Cosso_60",
  "Invoicing_No_Cosso_60",
  "Invoicing_Date_Cosso_60",
  "Cancelled_Cosso_Received_Date_60",
  "Coa_Sso_Received_Date_100",
  "Billing_Upon_Sso_Coa_100",
  "Invoicing_No_Sso_Coa_100",
  "Invoicing_Date_Sso_Coa_100",
  "Coa_Ni_Date_100",
  "Billing_Upon_Coa_Ni_100",
  "Invoicing_No_Coa_Ni_100",
  "Invoicing_Date_Coa_Ni_100",
  "Cancelled_Coa_Ni_Date_100",
  "Ses_No",
  "Ses_Status",
  "Link",
  "Ni_Coa_Submission_Status",
  "Deal_Name",
  "Hammer",
  "Hammer_1_Hd_Total",
  "Project_Description",
  "Commodity",
  "Gr_No",
  "Line_Item_Sap",
  "Material_Code",
  "Net_Unit_Price",
  "Invoice_Total",
];
const Checkbox11 = ({
  type = "checkbox",
  name,
  checked = false,
  onChange,
  value,
  id,
  matId,
  key,
}) => (
  <input
    key={key}
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    value={value}
    id={id}
    matId={matId}
  />
);
const Checkbox2 = ({
  type = "checkbox",
  name,
  checked = true,
  onChange,
  value,
  id,
  matId,
  key,
}) => (
  <input
    key={key}
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    value={value}
    id={id}
    matId={matId}
  />
);
const modul_name = "SVC Mapping";
class MappingSVC extends React.Component {
  // csvLink = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data_svc: [],
      createModal: false,
      rowsXLS: [],
      rowsXLS_batch: [],
      modal_loading: false,
      modal_progress: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      CPOForm: {},
      modalEdit: false,
      modal_loading: false,
      modal_callof: false,
      multiple_select: [],
      multiple_select2: [],
      mapping_date: "",
      po_select: null,
      reloc_options: [],
      action_status: null,
      action_message: null,
      filter_list: {},
      all_data_master: [],
      all_data_mapping: [],
      dataChecked: new Map(),
      dataChecked_container: [],
      dataChecked_container2: [],
      tabs_submenu: [true, false],
      all_data_true: [],
      dataChecked_all: false,
      count_header: {},
      callof_filter: {},
    };
    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
  }

  componentDidMount() {
    // console.log("token", this.state.tokenUser);
    this.getMaster();
  }

  getHeader() {
    let filter_array2 = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array2.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd2 = "{" + filter_array2.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/required/count/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items3 = res.data.data;
        // console.log("items3 ", items3);
        this.setState({ count_header: items3 });
      }
    });
  }

  mapHeader(data_header) {
    let header_keys = Object.keys(data_header);
    let header_values = Object.values(data_header);
    // console.log("header ", header_values);
    // if (header_keys !== undefined) {
    if (
      header_keys === "Qty" ||
      header_keys === "Unit_Price" ||
      header_keys === "Total_Price" ||
      header_keys === "Discounted_Unit_Price" ||
      header_keys === "Discounted_Po_Price"
    ) {
      return formatMoney(header_values);
    } else {
      return header_values;
    }
    // }
  }

  getMaster() {
    getDatafromAPINODE(
      "/summaryMaster/getSummaryMaster?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items2 = res.data.data;
        this.setState({ all_data_master: items2 }, () => this.getList());
      }
    });
  }

  getList() {
    let filter_array = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/required/svc?q=" +
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
        this.setState({ all_data_svc: items, totalData: totalData }, () =>
          this.getHeader()
        );
      }
    });
  }

  loadOptionsReclocID = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let data_list = [];
      const getWPID = await getDatafromAPINODE(
        '/cpoMapping/getCpo/required/svc?q={"Reference_Loc_Id":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}',
        this.state.tokenUser
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        getUniqueListBy(getWPID.data.data, "Reference_Loc_Id").map((wp) =>
          data_list.push({
            value: wp.Reference_Loc_Id,
            label: wp.Reference_Loc_Id,
          })
        );
      }
      return data_list;
    }
  };

  loadOptionsPO = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let data_list2 = [];
      const getWPID = await getDatafromAPINODE(
        '/cpoMapping/getCpo/required/svc?q={"Project_Description":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}',
        this.state.tokenUser
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        getUniqueListBy(getWPID.data.data, "Project_Description").map((wp) =>
          data_list2.push({
            value: wp.Project_Description,
            label: wp.Project_Description,
          })
        );
      }
      return data_list2;
    }
  };

  handlemultipleRelocID = (datalist) => {
    let filter_callof = this.state.callof_filter;
    filter_callof.Reference_Loc_Id = datalist.value;
    this.setState({ callof_filter: filter_callof }, () =>
      console.log(this.state.callof_filter)
    );
  };

  handleBeforeCallOf = async (datalist) => {
    let callof_container = [];

    const getCallof_data = await getDatafromAPINODE(
      '/cpoMapping/getCpo/required/svc?q={"Project_Description":{"$regex" : "' +
        datalist.value +
        '", "$options" : "i"},"Reference_Loc_Id":{"$regex" : "' +
        this.state.callof_filter.Reference_Loc_Id +
        '", "$options" : "i"}}&noPg=1',
      this.state.tokenUser
    );
    if (getCallof_data !== undefined && getCallof_data.data !== undefined) {
      getCallof_data.data.data.map((req) =>
        callof_container.push([req.Po, req.Line, req.Reference_Loc_Id, req.Qty])
      );
    }
    // console.log(callof_container);
    this.setState({ multiple_select2: callof_container }, () =>
      console.log(this.state.multiple_select2)
    );
  };

  getList2() {
    let filter_array = [];
    this.state.filter_list["Internal_Po"] !== null &&
      this.state.filter_list["Internal_Po"] !== undefined &&
      filter_array.push(
        '"Internal_Po":{"$regex" : "' +
          this.state.filter_list["Internal_Po"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["Region"] !== null &&
      this.state.filter_list["Region"] !== undefined &&
      filter_array.push(
        '"Region":{"$regex" : "' +
          this.state.filter_list["Region"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["New_Loc_Id"] !== null &&
      this.state.filter_list["New_Loc_Id"] !== undefined &&
      filter_array.push(
        '"New_Loc_Id":{"$regex" : "' +
          this.state.filter_list["New_Loc_Id"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["New_Site_Name"] !== null &&
      this.state.filter_list["New_Site_Name"] !== undefined &&
      filter_array.push(
        '"site_id":{"$regex" : "' +
          this.state.filter_list["New_Site_Name"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["Po"] !== null &&
      this.state.filter_list["Po"] !== undefined &&
      filter_array.push(
        '"Po":{"$regex" : "' +
          this.state.filter_list["Po"] +
          '", "$options" : "i"}'
      );
    this.state.filter_list["Line"] !== null &&
      this.state.filter_list["Line"] !== undefined &&
      filter_array.push(
        '"Line":{"$regex" : "' +
          this.state.filter_list["Line"] +
          '", "$options" : "i"}'
      );

    // filter_array.push('"Not_Required":' + true);
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/svc?q=" +
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
        this.setState({ all_data_true: items, totalData: totalData });
      }
    });
  }

  togglecreateModal = () => {
    this.setState({
      createModal: !this.state.createModal,
    });
  };

  toggleCallOff = () => {
    this.setState({
      modal_callof: !this.state.modal_callof,
    });
  };

  toggle = (i) => {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  };

  handleChangeForm = (e) => {
    const value = e.target.value;
    const unique_code = e.target.name;
    this.setState({ mapping_date: value });
  };

  saveUpdate_CallOf = async () => {
    this.toggleLoading();
    this.toggleCallOff();
    let req_body = [];
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    const header_update_Mapping_Date = [
      ["Po", "Line", "Reference_Loc_Id", "Qty", "Mapping_Date"],
    ];
    const body_update_Mapping_Date = this.state.multiple_select2.map((req) =>
      req_body.push([
        req.Po,
        req.Line,
        req.Reference_Loc_Id,
        req.Qty,
        this.state.mapping_date,
      ])
    );
    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo",
      {
        cpo_type: "svc",
        required_check: true,
        roles: roles,
        cpo_data: header_update_Mapping_Date.concat(req_body),
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
      // setTimeout(function () {
      //   window.location.reload();
      // }, 1500);
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

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber }, () => {
      this.state.tabs_submenu[0] === true ? this.getList() : this.getList2();
    });
  };

  toggleEdit = (e) => {
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.all_data_svc.find((e) => e._id === value);
      this.setState({ CPOForm: aEdit, selected_id: value });
    } else {
      this.setState({ CPOForm: {} });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  saveUpdate = async () => {
    this.toggleLoading();
    // create
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    const header_create_not_req = [save_update_header];
    const body_create_not_req = this.state.dataChecked_container.map((data) =>
      Object.keys(data)
        .filter((key) =>
          global.config.cpo_mapping.svc.header_model.includes(key)
        )
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {})
    );
    console.log("body_create_not_req", body_create_not_req);

    const trimm_body_create_not_req = body_create_not_req.map((data) =>
      Object.keys(data).map((key) => data[key])
    );

    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo",
      {
        cpo_type: "svc",
        required_check: false,
        roles: roles,
        cpo_data: header_create_not_req.concat(trimm_body_create_not_req),
      },
      this.state.tokenUser
    );

    if (res.data !== undefined) {
      // delete
      let req_body_del = [];
      const _id_delete = this.state.dataChecked_container.map((del) =>
        req_body_del.push(del._id)
      );
      const resdel = await deleteDataFromAPINODE2(
        "/cpoMapping/deleteCpo",
        this.state.tokenUser,
        {
          cpo_type: "svc",
          data: req_body_del,
        }
      );
      if (resdel !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
        // setTimeout(function () {
        //   window.location.reload();
        // }, 1500);
      } else {
        if (
          resdel.response !== undefined &&
          resdel.response.data !== undefined &&
          resdel.response.data.error !== undefined
        ) {
          if (resdel.response.data.error.message !== undefined) {
            this.setState({
              action_status: "failed",
              action_message: resdel.response.data.error.message,
            });
          } else {
            this.setState({
              action_status: "failed",
              action_message: resdel.response.data.error,
            });
          }
        } else {
          this.setState({ action_status: "failed" });
        }
        this.toggleLoading();
      }
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

  onChangeDebounced() {
    this.state.tabs_submenu[0] === true ? this.getList() : this.getList2();
  }

  handleFilterList = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value.length === 0) {
      value = null;
    }
    let dataFilter = this.state.filter_list;
    dataFilter[index] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    });
  };

  loopSearchBar = () => {
    let searchBar = [];
    for (
      let i = 0;
      i < global.config.cpo_mapping.svc.header_model.length;
      i++
    ) {
      searchBar.push(
        <td>
          {/* {i !== 0 && i !== 3 && i !== 5 && i !== 7 && i !== 9 && i !== 10 ? (
            ""
          ) : ( */}
          <div className="controls" style={{ width: "150px" }}>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                // className="col-sm-3"
                type="text"
                placeholder="Search"
                onChange={this.handleFilterList}
                value={
                  this.state.filter_list[
                    global.config.cpo_mapping.svc.header_model[i]
                  ]
                }
                name={global.config.cpo_mapping.svc.header_model[i]}
                size="sm"
              />
            </InputGroup>
          </div>
          {/* )} */}
        </td>
      );
    }
    return searchBar;
  };

  handleChangeChecklist = (e) => {
    console.log(this.state.dataChecked.has(e._id));
    const item = e.target.name;
    const isChecked = e.target.checked;
    const each_data_svc = this.state.all_data_svc;
    console.log("here", item, isChecked, each_data_svc);
    let dataChecked_container = this.state.dataChecked_container;
    if (isChecked === true) {
      let getCPO = each_data_svc.find((pp) => pp._id === item);
      dataChecked_container.push(getCPO);
    } else {
      dataChecked_container = dataChecked_container.filter(function (pp) {
        return pp._id !== item;
      });
    }
    this.setState({ dataChecked_container: dataChecked_container }, () =>
      console.log("make not req", this.state.dataChecked_container)
    );
    this.setState(
      (prevState) => ({
        dataChecked: prevState.dataChecked.set(item, isChecked),
      }),
      () => console.log("dataChecked ", this.state.dataChecked)
    );
  };

  changeTabsSubmenu = (e) => {
    e === 1 ? this.getList2() : this.getList();
    // console.log("tabs_submenu", e);
    let tab_submenu = new Array(2).fill(false);
    tab_submenu[parseInt(e)] = true;
    this.setState({ tabs_submenu: tab_submenu });
  };

  handleChangeLimit = (e) => {
    let limitpg = e.currentTarget.value;
    this.setState({ perPage: limitpg }, () => this.getList());
  };

  // countheader = (params_field) => {
  //   let value = "curr." + params_field;
  //   let sumheader = this.state.all_data_mapping.reduce(
  //     (acc, curr) => acc + eval(value),
  //     0
  //   );
  //   // console.log(sumheader);
  //   return Math.round((sumheader + Number.EPSILON) * 100) / 100;
  // };

  countheaderNaN = (params_field) => {
    let value = "element." + params_field;
    let sumheader = this.state.all_data_mapping.filter(
      (element) => eval(value) !== null && eval(value) !== ""
    );
    return sumheader.length;
    // console.log(params_field, sumheader);
  };

  render() {
    const CPOForm = this.state.CPOForm;
    const role = this.state.roleUser;
    return (
      <div className="animated fadeIn">
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
            <Card style={{}}>
              <CardHeader>
                <span style={{ marginTop: "8px", position: "absolute" }}>
                  {" "}
                  List {modul_name}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                    <div>
                      {role.includes("BAM-MAT PLANNER") === true ? (
                        <Button
                          block
                          color="info"
                          size="sm"
                          onClick={this.toggleCallOff}
                        >
                          Call Off
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <div>
                      <Link to={"/cpo-svc-import"} target="_blank">
                        <Button
                          color="success"
                          style={{ float: "right", marginLeft: "8px" }}
                          size="sm"
                        >
                          <i className="fa fa-plus-square" aria-hidden="true">
                            {" "}
                            &nbsp;{" "}
                          </i>{" "}
                          {role.includes("BAM-ADMIN") === true ||
                          role.includes("BAM-PFM") === true
                            ? "Update"
                            : "New"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <Link to={"/cpo-svc-export"} target="_blank">
                      <Button
                        color="warning"
                        style={{ float: "right", marginLeft: "8px" }}
                        size="sm"
                      >
                        <i className="fa fa-download" aria-hidden="true">
                          {" "}
                          &nbsp;{" "}
                        </i>{" "}
                        Export
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          float: "left",
                          margin: "5px",
                          display: "inline-flex",
                        }}
                      >
                        <Input
                          type="select"
                          name="select"
                          id="selectLimit"
                          onChange={this.handleChangeLimit}
                        >
                          <option value={"10"}>10</option>
                          <option value={"25"}>25</option>
                          <option value={"50"}>50</option>
                          <option value={"100"}>100</option>
                          <option value={"noPg=1"}>All</option>
                        </Input>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        onClick={this.changeTabsSubmenu.bind(this, 0)}
                        value="0"
                        active={this.state.tabs_submenu[0]}
                        href="#"
                      >
                        <b>Required</b>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        onClick={this.changeTabsSubmenu.bind(this, 1)}
                        value="1"
                        active={this.state.tabs_submenu[1]}
                        href="#"
                      >
                        <b>Not Required</b>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>{" "}
                <Row>
                  <Col>
                    <div
                      style={{
                        "max-height": "calc(100vh - 210px)",
                        "overflow-y": "auto",
                      }}
                    >
                      <table style={{ width: "10%" }} class="table table-hover">
                        <thead class="thead-dark">
                          <tr align="center">
                            {this.state.tabs_submenu[0] === true ? (
                              <>
                                <th></th>
                                <th>Not Required</th>
                              </>
                            ) : (
                              ""
                            )}
                            {global.config.cpo_mapping.svc.header.map(
                              (head) => (
                                <th>{head}</th>
                              )
                            )}
                          </tr>
                          {this.state.tabs_submenu[0] === true ? (
                            <>
                              <tr align="center">
                                <th></th>
                                <th></th>
                                {Object.keys(this.state.count_header).length !==
                                  0 &&
                                this.state.count_header.constructor ===
                                  Object ? (
                                  this.mapHeader(this.state.count_header).map(
                                    (head, j) => <th>{head}</th>
                                  )
                                ) : (
                                  <></>
                                )}
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr align="center">
                                {global.config.cpo_mapping.svc.header_model.map(
                                  (head) => (
                                    <th>{this.countheaderNaN(head)}</th>
                                  )
                                )}
                              </tr>
                            </>
                          )}
                          <tr align="center">
                            {this.state.tabs_submenu[0] === true ? (
                              <>
                                <td></td>
                                <td></td>
                                {this.loopSearchBar()}
                              </>
                            ) : (
                              <>{this.loopSearchBar()}</>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.tabs_submenu[0] === true &&
                            this.state.all_data_svc !== undefined &&
                            this.state.all_data_svc.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr align="center" key={e._id}>
                                  <td>
                                    <Link to={"/svc-cpo/" + e._id}>
                                      <Button
                                        size="sm"
                                        color="secondary"
                                        title="Edit"
                                      >
                                        <i
                                          className="fa fa-edit"
                                          aria-hidden="true"
                                        ></i>
                                      </Button>
                                    </Link>
                                  </td>
                                  <td>
                                    <Checkbox11
                                      checked={this.state.dataChecked.get(
                                        e._id
                                      )}
                                      // checked={e.Not_Required}
                                      onChange={this.handleChangeChecklist}
                                      name={e._id}
                                      value={e}
                                    />
                                  </td>
                                  <td>{e.Deal_Name}</td>
                                  <td>{e.Hammer}</td>
                                  <td>{e.Project_Description}</td>
                                  <td>{e.Po_Number}</td>
                                  <td>{e.Data_1}</td>
                                  <td>{e.Lookup_Reference}</td>
                                  <td>{e.Region}</td>
                                  <td>{e.Reference_Loc_Id}</td>
                                  <td>{e.New_Loc_Id}</td>
                                  <td>{e.Site_Name}</td>
                                  <td>{e.New_Site_Name}</td>
                                  <td>{e.Config}</td>
                                  <td>{e.Po}</td>
                                  <td>{e.Line}</td>
                                  <td>{e.Material_Code}</td>
                                  <td>{e.Line_Item_Sap}</td>
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>
                                    {convertDateFormat_firefox(e.CNI_Date)}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(e.Mapping_Date)}
                                  </td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Gr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
                                  <td>{e.Commodity}</td>
                                  <td>{e.Discounted_Unit_Price}</td>
                                  <td>{e.Discounted_Po_Price}</td>
                                  <td>{e.Net_Unit_Price}</td>
                                  <td>{e.Invoice_Total}</td>
                                  <td>{e.Hammer_1_Hd_Total}</td>
                                  <td>{e.So_Line_Item_Description}</td>
                                  <td>{e.Sitepcode}</td>
                                  <td>{e.VlookupWbs}</td>
                                  <td>{e.So_No}</td>
                                  <td>{e.Wbs_No}</td>
                                  <td>{e.Billing_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Atp_Coa_Received_Date_80
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Atp_Coa_80}</td>
                                  <td>{e.Invoicing_No_Atp_Coa_80}</td>
                                  <td>{e.Invoicing_Date_Atp_Coa_80}</td>
                                  <td>{e.Cancelled_Atp_Coa_80}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Ni_Coa_Date_20
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Ni_20}</td>
                                  <td>{e.Invoicing_No_Ni_20}</td>
                                  <td>{e.Invoicing_Date_Ni_20}</td>
                                  <td>{e.Cancelled_Invoicing_Ni_20}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Sso_Coa_Date_80
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Sso_80}</td>
                                  <td>{e.Invoicing_No_Sso_80}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Invoicing_Date_Sso_80
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Sso_Coa_Date_80
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Psp_Received_Date_20
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Psp_20}</td>
                                  <td>{e.Invoicing_No_Coa_Psp_20}</td>
                                  <td>{e.Invoicing_Date_Coa_Psp_20}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Psp_Received_Date_20
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Ni_Received_Date_40
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Ni_40}</td>
                                  <td>{e.Invoicing_No_Coa_Ni_40}</td>
                                  <td>{e.Invoicing_Date_Coa_Ni_40}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Ni_Received_Date_40
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cosso_Received_Date_60
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Cosso_60}</td>
                                  <td>{e.Invoicing_No_Cosso_60}</td>
                                  <td>{e.Invoicing_Date_Cosso_60}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Cosso_Received_Date_60
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Sso_Received_Date_100
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Sso_Coa_100}</td>
                                  <td>{e.Invoicing_No_Sso_Coa_100}</td>
                                  <td>{e.Invoicing_Date_Sso_Coa_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Sso_Received_Date_100
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Ni_Date_100
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Ni_100}</td>
                                  <td>{e.Invoicing_No_Coa_Ni_100}</td>
                                  <td>{e.Invoicing_Date_Coa_Ni_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Ni_Date_100
                                    )}
                                  </td>
                                  <td>{e.Ses_No}</td>
                                  <td>
                                    {convertDateFormat_firefox(e.Ses_Status)}
                                  </td>
                                  <td>{e.Link}</td>
                                  <td>{e.Ni_Coa_Submission_Status}</td>
                                </tr>
                              </React.Fragment>
                            ))}
                          {this.state.tabs_submenu[1] === true &&
                            this.state.all_data_true !== undefined &&
                            this.state.all_data_true.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr align="center" key={e._id}>
                                  <td>{e.Deal_Name}</td>
                                  <td>{e.Hammer}</td>
                                  <td>{e.Project_Description}</td>
                                  <td>{e.Po_Number}</td>
                                  <td>{e.Data_1}</td>
                                  <td>{e.Lookup_Reference}</td>
                                  <td>{e.Region}</td>
                                  <td>{e.Reference_Loc_Id}</td>
                                  <td>{e.New_Loc_Id}</td>
                                  <td>{e.Site_Name}</td>
                                  <td>{e.New_Site_Name}</td>
                                  <td>{e.Config}</td>
                                  <td>{e.Po}</td>
                                  <td>{e.Line}</td>
                                  <td>{e.Material_Code}</td>
                                  <td>{e.Line_Item_Sap}</td>
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>
                                    {convertDateFormat_firefox(e.CNI_Date)}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(e.Mapping_Date)}
                                  </td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Gr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
                                  <td>{e.Commodity}</td>
                                  <td>{e.Discounted_Unit_Price}</td>
                                  <td>{e.Discounted_Po_Price}</td>
                                  <td>{e.Net_Unit_Price}</td>
                                  <td>{e.Invoice_Total}</td>
                                  <td>{e.Hammer_1_Hd_Total}</td>
                                  <td>{e.So_Line_Item_Description}</td>
                                  <td>{e.Sitepcode}</td>
                                  <td>{e.VlookupWbs}</td>
                                  <td>{e.So_No}</td>
                                  <td>{e.Wbs_No}</td>
                                  <td>{e.Billing_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Atp_Coa_Received_Date_80
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Atp_Coa_80}</td>
                                  <td>{e.Invoicing_No_Atp_Coa_80}</td>
                                  <td>{e.Invoicing_Date_Atp_Coa_80}</td>
                                  <td>{e.Cancelled_Atp_Coa_80}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Ni_Coa_Date_20
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Ni_20}</td>
                                  <td>{e.Invoicing_No_Ni_20}</td>
                                  <td>{e.Invoicing_Date_Ni_20}</td>
                                  <td>{e.Cancelled_Invoicing_Ni_20}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Sso_Coa_Date_80
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Sso_80}</td>
                                  <td>{e.Invoicing_No_Sso_80}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Invoicing_Date_Sso_80
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Sso_Coa_Date_80
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Psp_Received_Date_20
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Psp_20}</td>
                                  <td>{e.Invoicing_No_Coa_Psp_20}</td>
                                  <td>{e.Invoicing_Date_Coa_Psp_20}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Psp_Received_Date_20
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Ni_Received_Date_40
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Ni_40}</td>
                                  <td>{e.Invoicing_No_Coa_Ni_40}</td>
                                  <td>{e.Invoicing_Date_Coa_Ni_40}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Ni_Received_Date_40
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cosso_Received_Date_60
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Cosso_60}</td>
                                  <td>{e.Invoicing_No_Cosso_60}</td>
                                  <td>{e.Invoicing_Date_Cosso_60}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Cosso_Received_Date_60
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Sso_Received_Date_100
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Sso_Coa_100}</td>
                                  <td>{e.Invoicing_No_Sso_Coa_100}</td>
                                  <td>{e.Invoicing_Date_Sso_Coa_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Sso_Received_Date_100
                                    )}
                                  </td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Coa_Ni_Date_100
                                    )}
                                  </td>
                                  <td>{e.Billing_Upon_Coa_Ni_100}</td>
                                  <td>{e.Invoicing_No_Coa_Ni_100}</td>
                                  <td>{e.Invoicing_Date_Coa_Ni_100}</td>
                                  <td>
                                    {convertDateFormat_firefox(
                                      e.Cancelled_Coa_Ni_Date_100
                                    )}
                                  </td>
                                  <td>{e.Ses_No}</td>
                                  <td>
                                    {convertDateFormat_firefox(e.Ses_Status)}
                                  </td>
                                  <td>{e.Link}</td>
                                  <td>{e.Ni_Coa_Submission_Status}</td>
                                </tr>
                              </React.Fragment>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                <div style={{ margin: "8px 0px" }}>
                  <small>Showing {this.state.totalData} entries</small>
                </div>
                <Row>
                  <Col>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.totalData}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </Col>
                </Row>
              </CardBody>
              <ModalFooter>
                {this.state.tabs_submenu[0] === true ? (
                  <Button
                    color="info"
                    onClick={this.saveUpdate}
                    disabled={
                      this.state.dataChecked_container.length === 0 &&
                      this.state.dataChecked_container2.length === 0
                    }
                  >
                    Update
                  </Button>
                ) : (
                  ""
                )}
              </ModalFooter>
            </Card>
          </Col>
        </Row>

        {/* Modal Loading */}
        <Loading
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}
        ></Loading>
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

export default connect(mapStateToProps)(MappingSVC);
