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
} from "reactstrap";
import { Form, FormGroup, Label, FormText } from "reactstrap";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";

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

const MR_ADDITIONAL_REASONS = [
  { code: "R1", value: "CR" },
  { code: "R2", value: "Faulty" },
  { code: "R3", value: "Returned to WH/Access" },
  { code: "R4", value: "Mismatch Database" },
  { code: "R5", value: "Partial Delivery" },
  { code: "R6", value: "PICO Issue" },
  { code: "R7", value: "Stolen Issue" },
  { code: "R8", value: "LOM" },
  { code: "R9", value: "Interference" },
  { code: "R10", value: "Site Replacement" },
  { code: "R11", value: "Other Reason" },
];

class MRCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      list_tower: [],
      list_project: [],
      list_tower_selection: [],
      list_project_selection: [],
      list_warehouse: [],
      form_checking: {},
      create_mr_form: new Array(9).fill(null),
      create_mr_name_form: new Array(9).fill(null),
      list_cd_id: [],
      cd_id_selected: null,
      data_cd_id_selected: null,
      project_selected: null,
      project_name_selected: null,
      list_tssr: [],
      list_tssr_for_selection: [],
      id_tssr_selected: null,
      data_tssr_selected: null,
      tssr_BOM_data_NE: null,
      tssr_BOM_data_FE: null,
      list_pp_material_tssr: [],
      redirectSign: false,
      action_status: null,
      action_message: null,
      toggle_display: "new",
      identifier_by: "tower_id",
      tower_selected_id: null,
      dsp_list: [],
      validation_form: {},
    };
    this.saveMRtoAPI = this.saveMRtoAPI.bind(this);
    this.handleChangeFormMRCreation =
      this.handleChangeFormMRCreation.bind(this);
    this.handleChangeMRType = this.handleChangeMRType.bind(this);
    this.handleChangeProject = this.handleChangeProject.bind(this);
    this.handleChangeCD = this.handleChangeCD.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleChangeProjectXL = this.handleChangeProjectXL.bind(this);
    this.handleChangeTowerXL = this.handleChangeTowerXL.bind(this);
    this.handleChangeIdentifierBy = this.handleChangeIdentifierBy.bind(this);
    this.loadOptionsTowerID = this.loadOptionsTowerID.bind(this);
    this.loadOptionsCDID = this.loadOptionsCDID.bind(this);

    this.loadOptionsMRID = this.loadOptionsMRID.bind(this);
    this.handleChangeMRID = this.handleChangeMRID.bind(this);

    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
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
    this.getDatafromAPIXL("/custdel_op").then((resCD) => {
      if (resCD.data !== undefined) {
        this.setState({ list_cd_id: resCD.data._items });
      }
    });
  }

  getDataCDProject() {
    const project_id = this.state.data_cd_id_selected.CD_Info_Project;
    this.getDatafromAPIXL("/project_op/" + project_id).then((resCD) => {
      if (resCD.data !== undefined) {
        this.setState({
          project_selected: resCD.data._id,
          project_name_selected: resCD.data.Project,
        });
      }
    });
  }

  handleChangeIdentifierBy(e) {
    const value = e.target.value;
    this.setState({ identifier_by: value });
  }

  handleChangeTSSR = (newValue) => {
    const _id_tssr = newValue.value;
    const data_tssr_selection = this.state.list_tssr.find(
      (e) => e._id === _id_tssr
    );
    this.setState(
      { id_tssr_selected: _id_tssr, data_tssr_selected: data_tssr_selection },
      () => {
        this.getTSSRBOM();
      }
    );
  };

  handleChangeMRType(e) {
    const value = e.target.value;
    this.setState({ mr_type: value });
  }

  handleChangeFormMRCreation(e) {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.create_mr_form;
    dataForm[parseInt(index)] = value;
    const indexOpt = e.target.selectedIndex;
    if (indexOpt !== undefined) {
      let dataFormName = this.state.create_mr_name_form;
      const textOpt = e.target[indexOpt].text;
      dataFormName[parseInt(index)] = textOpt;
      this.setState({ create_mr_name_form: dataFormName });
    }
    this.setState({ create_mr_form: dataForm }, () => {
      console.log(
        "PPForm",
        this.state.create_mr_form,
        this.state.create_mr_name_form
      );
    });
  }

  preparingDataMR() {
    const dateNow = new Date();
    const dataRandom = Math.floor(Math.random() * 100)
      .toString()
      .padStart(4, "0");
    const numberTSSR =
      dateNow.getFullYear().toString() +
      (dateNow.getMonth() + 1).toString().padStart(2, "0") +
      dateNow.getDate().toString().padStart(2, "0") +
      dataRandom.toString();
    return numberTSSR;
  }

  selectedDatetoFormat(date) {
    let dateSplit = date.split("-");
    return dateSplit[0] + "-" + dateSplit[1] + "-" + dateSplit[2];
  }

  handleCheckingForm() {
    const dataForm = this.state.create_mr_form;
    const dataFormName = this.state.create_mr_name_form;
    let dataValidate = {};
    let checkerror = [];
    let dataFormHeader = [
      "project_name",
      "mr_type",
      "mr_delivery_type",
      "origin_warehouse",
      "etd",
      "eta",
      "deliver_by",
      "created_based",
      "identifier",
    ];
    let dataFormInputan = [
      this.state.project_name_selected,
      dataForm[3],
      dataForm[4],
      dataForm[8],
      dataForm[5],
      dataForm[6],
      dataForm[7],
      this.state.identifier_by,
      this.state.tower_selected_id,
    ];
    for (let i = 0; i < dataFormHeader.length; i++) {
      if (dataFormInputan[i] === undefined || dataFormInputan[i] === null) {
        dataValidate[dataFormHeader[i]] = false;
        checkerror.push(false);
      }
    }
    this.setState({ validation_form: dataValidate });
    if (checkerror.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async saveMRtoAPI() {
    this.toggleLoading();
    this.setState({ action_status: null, action_message: null });
    const dataCD = this.state.data_cd_id_selected;
    const dataForm = this.state.create_mr_form;
    const dataFormName = this.state.create_mr_name_form;
    const dataValidation = await this.handleCheckingForm();
    if (dataValidation !== true) {
      const numberingMR = this.preparingDataMR();
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
      let dataXLS = [];
      if (dataForm[3] === "Replacement") {
        dataXLS = [
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
            "priority_mr",
            "week_number",
            "note_orn",
            "replacement_related",
          ],
          [
            "new",
            this.state.project_name_selected,
            this.selectMRType(dataForm[3]),
            this.selectDeliveryType(dataForm[4]),
            dataForm[8],
            this.selectedDatetoFormat(dataForm[5]),
            this.selectedDatetoFormat(dataForm[6]),
            dataForm[7],
            "",
            "",
            this.state.identifier_by,
            this.state.tower_selected_id,
            dataForm[10],
            dataForm[11],
            dataForm[12],
            dataForm[13],
          ],
        ];
      } else {
        dataXLS = [
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
            "priority_mr",
            "week_number",
          ],
          [
            "new",
            this.state.project_name_selected,
            this.selectMRType(dataForm[3]),
            this.selectDeliveryType(dataForm[4]),
            dataForm[8],
            this.selectedDatetoFormat(dataForm[5]),
            this.selectedDatetoFormat(dataForm[6]),
            dataForm[7],
            "",
            "",
            this.state.identifier_by,
            this.state.tower_selected_id,
            dataForm[10],
            dataForm[11],
          ],
        ];
      }
      if (dataForm[3] === "Additional") {
        dataXLS = [
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
            "priority_mr",
            "week_number",
            "mr_reason",
            "mr_remark",
          ],
          [
            "new",
            this.state.project_name_selected,
            this.selectMRType(dataForm[3]),
            this.selectDeliveryType(dataForm[4]),
            dataForm[8],
            this.selectedDatetoFormat(dataForm[5]),
            this.selectedDatetoFormat(dataForm[6]),
            dataForm[7],
            "",
            "",
            this.state.identifier_by,
            this.state.tower_selected_id,
            dataForm[10],
            dataForm[11],
            dataForm[16],
            dataForm[17],
          ],
        ];
      }
      if (
        this.selectDeliveryType(dataForm[4]) === "A1" ||
        this.selectDeliveryType(dataForm[4]) === "A2" ||
        this.selectDeliveryType(dataForm[4]) === "B1" ||
        this.selectDeliveryType(dataForm[4]) === "C1"
      ) {
        dataXLS = [
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
            "priority_mr",
            "week_number",
            "destination_warehouse",
            "mr_remark",
          ],
          [
            "new",
            this.state.project_name_selected,
            this.selectMRType(dataForm[3]),
            this.selectDeliveryType(dataForm[4]),
            dataForm[8],
            this.selectedDatetoFormat(dataForm[5]),
            this.selectedDatetoFormat(dataForm[6]),
            dataForm[7],
            "",
            "",
            this.state.identifier_by,
            this.state.tower_selected_id,
            dataForm[10],
            dataForm[11],
            dataForm[9],
            dataForm[17],
          ],
        ];
      }
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
          this.setState(
            { action_status: "success", action_message: null },
            () => {
              if (
                respondSaveMR.data.new !== undefined &&
                respondSaveMR.data.new.length !== 0
              ) {
                setTimeout(
                  function () {
                    this.setState({
                      redirectSign: respondSaveMR.data.new[0]._id,
                    });
                  }.bind(this),
                  2000
                );
              }
            }
          );
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
    }
    this.toggleLoading();
  }

  componentDidMount() {
    // this.getDataCD();
    // this.getDataTower();
    this.getDSPList();
    this.getDataProject();
    this.getDataWarehouse();
    document.title = "MR Creation | BAM";
  }

  getDSPList() {
    this.getDatafromAPIXL('/vendor_data_non_page?where={"Type":"ASP"}').then(
      (res) => {
        if (res.data !== undefined) {
          const items = res.data._items;
          this.setState({ dsp_list: items });
        }
      }
    );
  }

  getDataTower() {
    this.getDatafromAPIXL(
      '/tower_site_sorted_non_page?projection={"tower_id" : 1}'
    ).then((resTower) => {
      if (resTower.data !== undefined) {
        this.setState({ list_tower: resTower.data._items }, () => {
          this.filterDataTower("");
        });
      }
    });
  }

  getDataWarehouse() {
    this.getDataFromAPINODE(
      '/whManagement/warehouse?q={"wh_type":{"$regex" : "internal", "$options" : "i"}}'
    ).then((resWH) => {
      if (resWH.data !== undefined) {
        this.setState({ list_warehouse: resWH.data.data });
      }
    });
  }

  getDataProject() {
    this.getDatafromAPIXL("/project_sorted_non_page").then((resProject) => {
      if (resProject.data !== undefined) {
        this.setState({ list_project: resProject.data._items }, () => {
          this.filterDataProject("");
        });
      }
    });
  }

  filterDataTower = (inputValue) => {
    const list = [];
    this.state.list_tower.map((i) =>
      list.push({ label: i.tower_id, value: i.tower_id })
    );
    this.setState({ list_tower_selection: list });
    if (inputValue.length === 0) {
      return list;
    } else {
      return this.state.list_tower_selection.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  filterDataProject = (inputValue) => {
    const list = [];
    this.state.list_project.map((i) =>
      list.push({ label: i.Project, value: i.Project })
    );
    this.setState({ list_project_selection: list });
    if (inputValue.length === 0) {
      return list;
    } else {
      return this.state.list_project_selection.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  handleChangeProjectXL(e) {
    if (e !== null) {
      this.setState(
        {
          project_selected: e.map((e) => e.value).join("///"),
          project_name_selected: e.map((e) => e.value).join("///"),
        },
        () => {
          console.log(
            "project_name_selected",
            this.state.project_name_selected
          );
        }
      );
    } else {
      this.setState({ project_selected: null, project_name_selected: null });
    }
    return e;
  }

  // handleChangeTowerXL(e){
  //   let dataForm = this.state.create_mr_form;
  //   let dataFormName = this.state.create_mr_name_form;
  //   dataForm[1] = e.value;
  //   dataFormName[1] = e.label;
  //   this.setState({create_mr_form : dataForm, create_mr_name_form : dataFormName });
  //   return e
  // }

  handleChangeProject(e) {
    const value = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target[index].text;
    this.setState({ project_selected: value, project_name_selected: text });
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

  async loadOptionsTowerID(inputValue) {
    if (!inputValue || inputValue.length < 3) {
      return [];
    } else {
      let tower_id_list = [];
      // const getSSOWID = await this.getDatafromAPIXL('/ssow_sorted_nonpage?where={"ssow_id":{"$regex":"'+inputValue+'", "$options":"i"}, "sow_type":"'+this.state.list_activity_selected.CD_Info_SOW_Type +'"}');
      const getTowerID = await this.getDatafromAPIXL(
        '/tower_site_sorted_non_page?where={"tower_id":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}'
      );
      if (getTowerID !== undefined && getTowerID.data !== undefined) {
        getTowerID.data._items.map((tower) =>
          tower_id_list.push({ label: tower.tower_id, value: tower.tower_id })
        );
      }
      return tower_id_list;
    }
  }

  async loadOptionsCDID(inputValue) {
    if (!inputValue) {
      return [];
    } else {
      let wp_id_list = [];
      // const getSSOWID = await this.getDatafromAPIXL('/ssow_sorted_nonpage?where={"ssow_id":{"$regex":"'+inputValue+'", "$options":"i"}, "sow_type":"'+this.state.list_activity_selected.CD_Info_SOW_Type +'"}');
      const getWPID = await this.getDatafromAPIXL(
        '/custdel_sorted_non_page?where={"WP_ID":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}'
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        this.setState({ list_cd_id: getWPID.data._items });
        getWPID.data._items.map((wp) =>
          wp_id_list.push({
            value: wp.WP_ID,
            label: wp.WP_ID + " ( " + wp.WP_Name + " )",
            project: wp.CD_Info_Project_Name,
          })
        );
      }
      this.setState({ project_name: wp_id_list[0].project });
      return wp_id_list;
    }
  }

  handleChangeTowerXL(e) {
    const cd_id_number = e.value;
    this.setState({ tower_selected_id: cd_id_number });
    if (this.state.identifier_by === "cd_id") {
      let findCDID = this.state.list_cd_id.find(
        (e) => e.WP_ID === cd_id_number.trim()
      );
      if (findCDID !== undefined) {
        this.setState({
          project_selected: findCDID.CD_Info_Project,
          project_name_selected: findCDID.CD_Info_Project_Name,
        });
      }
    }
    return e;
  }

  async loadOptionsMRID(inputValue) {
    if (!inputValue) {
      return [];
    } else {
      let wp_id_list = [];
      const getWPID = await this.getDataFromAPINODE(
        '/matreq?q={"mr_id":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}&v={"mr_id" : 1}'
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        this.setState({ list_cd_id: getWPID.data.data });
        wp_id_list.push({ value: null, label: null });
        getWPID.data.data.map((wp) =>
          wp_id_list.push({ value: wp._id, label: wp.mr_id })
        );
      }
      return wp_id_list;
    }
  }

  handleChangeMRID(e) {
    const cd_id_number = e.value;
    let dataForm = this.state.create_mr_form;
    dataForm[13] = e.label;
    this.setState({ create_mr_form: dataForm });
    return e;
  }

  showHide(e) {
    if (e.target.value === "Relocation") {
      this.setState({ toggle_display: "relocation" });
    } else if (e.target.value === "Return") {
      this.setState({ toggle_display: "return" });
    } else if (e.target.value === "Replacement") {
      this.setState({ toggle_display: "replacement" });
    } else {
      this.setState({ toggle_display: "new" });
    }
  }

  selectMRType(TypeDel) {
    let delType = null;
    switch (TypeDel) {
      case "New":
        delType = 1;
        break;
      case "Upgrade":
        delType = 2;
        break;
      case "Additional":
        delType = 3;
        break;
      case "Outstanding":
        delType = 4;
        break;
      case "Replacement":
        delType = 5;
        break;
      case "Return Excess":
        delType = 6;
        break;
      case "Return Faulty":
        delType = 7;
        break;
      default:
        delType = 1;
    }
    return delType;
  }

  selectDeliveryType(TypeDel) {
    let delType = null;
    switch (TypeDel) {
      case "Warehouse to Site":
        delType = 1;
        break;
      case "Site to Warehouse":
        delType = 2;
        break;
      case "Site to Site":
        delType = 3;
        break;
      case "Port to Warehouse":
        delType = "A1";
        break;
      case "Warehouse to Port":
        delType = "A2";
        break;
      case "Warehouse to Warehouse":
        delType = "B1";
        break;
      case "Warehouse to Scrap":
        delType = "C1";
        break;
      default:
        delType = 1;
    }
    return delType;
  }

  addDateFunction(afterDay) {
    var today = new Date();
    today.setDate(today.getDate() + parseInt(afterDay));
    let todayDate =
      today.getFullYear().toString() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    console.log("today", todayDate);
    return todayDate;
  }

  render() {
    // if(this.state.redirectSign !== false){
    //   return (<Redirect to={'/mr-detail/'+this.state.redirectSign} />);
    // }
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
                  MR Creation{" "}
                </span>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label>MR Type</Label>
                        <Input
                          type="select"
                          name="3"
                          value={this.state.create_mr_form[3]}
                          onChange={(e) => {
                            this.handleChangeFormMRCreation(e);
                            this.showHide(e);
                          }}
                          style={
                            this.state.validation_form.mr_type === false
                              ? { borderColor: "red" }
                              : {}
                          }
                        >
                          <option value="" disabled selected hidden>
                            Select MR Type
                          </option>
                          <option value="New">New</option>
                          <option value="Upgrade">Upgrade</option>
                          <option value="Additional">Additional</option>
                          <option value="Outstanding">Outstanding</option>
                          <option value="Replacement">Replacement</option>
                          <option value="Return Excess">
                            Return Excess (WH to WH)
                          </option>
                          <option value="Return Faulty">
                            Return Faulty (WH to WH)
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>MR Delivery Type</Label>
                        <Input
                          type="select"
                          name="4"
                          value={this.state.create_mr_form[4]}
                          onChange={this.handleChangeFormMRCreation}
                          style={
                            this.state.validation_form.mr_delivery_type ===
                            false
                              ? { borderColor: "red" }
                              : {}
                          }
                        >
                          <option value="" disabled selected hidden>
                            Select MR Delivery Type
                          </option>
                          <option
                            value="Warehouse to Site"
                            hidden={this.state.toggle_display !== "new"}
                          >
                            Warehouse to Site
                          </option>
                          <option
                            value="Site to Warehouse"
                            hidden={this.state.toggle_display !== "return"}
                          >
                            Site to Warehouse
                          </option>
                          <option
                            value="Site to Site"
                            hidden={this.state.toggle_display !== "replacement"}
                          >
                            Site to Site
                          </option>
                          {(this.state.create_mr_form[3] === "New" ||
                            this.state.create_mr_form[3] === "Return Excess" ||
                            this.state.create_mr_form[3] ===
                              "Return Faulty") && (
                            <Fragment>
                              <option
                                value="Warehouse to Warehouse"
                                hidden={this.state.toggle_display !== "new"}
                              >
                                Warehouse to Warehouse
                              </option>
                              <option
                                value="Port to Warehouse"
                                hidden={this.state.toggle_display !== "new"}
                              >
                                Port to Warehouse
                              </option>
                              <option
                                value="Warehouse to Port"
                                hidden={this.state.toggle_display !== "new"}
                              >
                                Warehouse to Port
                              </option>
                              <option
                                value="Warehouse to Scrap"
                                hidden={this.state.toggle_display !== "new"}
                              >
                                Warehouse to Scrap
                              </option>
                            </Fragment>
                          )}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label>
                          <select
                            type="select"
                            onChange={this.handleChangeIdentifierBy}
                            value={this.state.identifier_by}
                          >
                            <option value="cd_id">CD ID</option>
                            <option value="tower_id">Tower ID</option>
                          </select>
                        </Label>
                        {this.state.identifier_by === "tower_id" ? (
                          <AsyncSelect
                            cacheOptions
                            loadOptions={this.loadOptionsTowerID}
                            defaultOptions
                            onChange={this.handleChangeTowerXL}
                          />
                        ) : (
                          <AsyncSelect
                            cacheOptions
                            loadOptions={this.loadOptionsCDID}
                            defaultOptions
                            onChange={this.handleChangeTowerXL}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    {this.state.identifier_by === "tower_id" ? (
                      <Col md={6}>
                        <FormGroup>
                          <Label>Project</Label>
                          <Select
                            cacheOptions
                            isMulti
                            options={this.state.list_project_selection}
                            onChange={this.handleChangeProjectXL}
                          />
                        </FormGroup>
                      </Col>
                    ) : (
                      <Col md="6">
                        <FormGroup>
                          <Label>Project Name</Label>
                          <Input
                            value={this.state.project_name_selected}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Delivery Company</Label>
                        <Input
                          type="select"
                          name="7"
                          value={this.state.create_mr_form[7]}
                          onChange={this.handleChangeFormMRCreation}
                          style={
                            this.state.validation_form.deliver_by === false
                              ? { borderColor: "red" }
                              : {}
                          }
                        >
                          <option value="" disabled selected hidden>
                            Select Delivery Company
                          </option>
                          <option value="DSP">DSP</option>
                          {this.state.dsp_list.map((e) => (
                            <option value={e.Vendor_Code}>{e.Name}</option>
                          ))}
                        </Input>
                        {this.state.create_mr_form[7] === "DSP" && (
                          <FormText
                            color="muted"
                            style={{
                              fontSize: "12px",
                              paddingLeft: "5px",
                              marginTop: "5px",
                            }}
                          >
                            LDM will choose the DSP company
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Origin Warehouse</Label>
                        <Input
                          type="select"
                          name="8"
                          value={this.state.create_mr_form[8]}
                          onChange={this.handleChangeFormMRCreation}
                          hidden={this.state.toggle_display === "return"}
                          style={
                            this.state.validation_form.origin_warehouse ===
                            false
                              ? { borderColor: "red" }
                              : {}
                          }
                        >
                          <option value="" disabled selected hidden>
                            Select Origin
                          </option>
                          {this.state.list_warehouse.map((e) => (
                            <option value={e.wh_id}>
                              {e.wh_id + " - " + e.wh_name}
                            </option>
                          ))}
                        </Input>
                        <Input
                          type="text"
                          name="8"
                          onChange={this.handleChangeFormMRCreation}
                          hidden={this.state.toggle_display !== "return"}
                        />
                      </FormGroup>
                    </Col>
                    {(this.state.create_mr_form[4] ===
                      "Warehouse to Warehouse" ||
                      this.state.create_mr_form[4] === "Warehouse to Port" ||
                      this.state.create_mr_form[4] === "Warehouse to Scrap" ||
                      this.state.create_mr_form[4] === "Port to Warehouse") && (
                      <Col md={6}>
                        <FormGroup>
                          <Label>Destination</Label>
                          <Input
                            type="select"
                            name="9"
                            value={this.state.create_mr_form[9]}
                            onChange={this.handleChangeFormMRCreation}
                          >
                            <option value="" disabled selected hidden>
                              Select Destination
                            </option>
                            {this.state.list_warehouse.map((e) => (
                              <option value={e.wh_id}>
                                {e.wh_id + " - " + e.wh_name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label>ETD</Label>
                        <Input
                          type="date"
                          name="5"
                          value={this.state.create_mr_form[5]}
                          onChange={this.handleChangeFormMRCreation}
                          style={
                            this.state.validation_form.etd === false
                              ? { borderColor: "red" }
                              : {}
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>ETA</Label>
                        <Input
                          type="date"
                          name="6"
                          value={this.state.create_mr_form[6]}
                          onChange={this.handleChangeFormMRCreation}
                          style={
                            this.state.validation_form.eta === false
                              ? { borderColor: "red" }
                              : {}
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Priority</Label>
                        <Input
                          type="select"
                          name="10"
                          value={this.state.create_mr_form[10]}
                          onChange={this.handleChangeFormMRCreation}
                        >
                          <option value="" disabled selected hidden>
                            Select Priority
                          </option>
                          <option value={"P1"}>P1</option>
                          <option value={"P2"}>P2</option>
                          <option value={"P3"}>P3</option>
                        </Input>
                        {/* <Input
                      type="string"
                      name="10" value={this.state.create_mr_form[10]} onChange={this.handleChangeFormMRCreation}
                    /> */}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Week target</Label>
                        <Input
                          type="number"
                          min="1"
                          max="54"
                          name="11"
                          value={this.state.create_mr_form[11]}
                          onChange={this.handleChangeFormMRCreation}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {this.state.create_mr_form[3] === "Additional" && (
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label>MR Reason</Label>
                          <Input
                            type="select"
                            name="16"
                            value={this.state.create_mr_form[16]}
                            onChange={this.handleChangeFormMRCreation}
                          >
                            <option value="" disabled selected hidden>
                              Select MR Reason
                            </option>
                            {MR_ADDITIONAL_REASONS.map((mar) => (
                              <option value={mar.code}>{mar.value}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>MR Remarks</Label>
                          <Input
                            type="textarea"
                            name="17"
                            value={this.state.create_mr_form[17]}
                            onChange={this.handleChangeFormMRCreation}
                          ></Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  {(this.state.create_mr_form[4] === "Warehouse to Warehouse" ||
                    this.state.create_mr_form[4] === "Warehouse to Port" ||
                    this.state.create_mr_form[4] === "Warehouse to Scrap" ||
                    this.state.create_mr_form[4] === "Port to Warehouse") && (
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label>MR Remarks</Label>
                          <Input
                            type="textarea"
                            name="17"
                            value={this.state.create_mr_form[17]}
                            onChange={this.handleChangeFormMRCreation}
                          ></Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  {this.state.create_mr_form[3] === "Replacement" && (
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Note Replacement</Label>
                          <Input
                            type="text"
                            name="12"
                            value={this.state.create_mr_form[12]}
                            onChange={this.handleChangeFormMRCreation}
                            style={
                              this.state.validation_form.etd === false
                                ? { borderColor: "red" }
                                : {}
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>MR Related</Label>
                          <AsyncSelect
                            loadOptions={this.loadOptionsMRID}
                            defaultOptions
                            onChange={this.handleChangeMRID}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  color="success"
                  style={{ float: "right" }}
                  onClick={this.saveMRtoAPI}
                  disabled={this.state.modal_loading === true}
                >
                  <i
                    className="fa fa-plus-square"
                    style={{ marginRight: "8px" }}
                  ></i>{" "}
                  Create MR
                </Button>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData,
  };
};

export default connect(mapStateToProps)(MRCreation);
