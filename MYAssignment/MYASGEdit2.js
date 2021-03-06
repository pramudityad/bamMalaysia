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

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);

const API_URL_MAS = "https://api-dev.mas.pdb.e-dpm.com/masapi";
const usernameMAS = "mybotprpo";
const passwordMAS = "mybotprpo2020";

//

// const API_URL_NODE = 'http://localhost:5012/bammyapi';
const API_URL_NODE = "https://api-dev.bam-my.e-dpm.com/bammyapi";

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

const projectList = [
  {
    Project: "Project DEMO 1",
    Project_Year: "2020",
  },
  {
    Project: "Project DEMO 3",
    Project_Year: "2020",
  },
];

const vendorList = [
  {
    _id: "5edf4b3836c2b6fd90858d26",
    Name: "Bharti",
    Vendor_Code: "12",
    Email: "",
    created_on: "2020-05-06 07:54:27",
    updated_on: "2020-05-06 07:54:27",
    _etag: "9e63333bd40166971ed8a4e1fd47f9996876edc9",
  },
  {
    _id: "5ee084b7bb1141f864a300da",
    Name: "Vendor Test 1",
    Vendor_Code: "VendorTest1",
    Email: "",
    created_on: "2020-05-08 06:16:29",
    updated_on: "2020-05-08 06:16:29",
    _etag: "58f11185cc2708c5c33ade202691aa0937e8d478",
  },
];

const MaterialDB = [
  {
    MM_Code: "MM Code",
    BB_Sub: "BB_sub",
    SoW_Description: "SoW Description",
    UoM: "UoM",
    Region: "Region",
    Unit_Price: 100,
    MM_Description: "MM Description",
    Acceptance: "Acceptance",
  },
  {
    MM_Code: "MM Code1",
    BB_Sub: "BB_sub1",
    SoW_Description: "SoW Description1",
    UoM: "UoM1",
    Region: "Region1",
    Unit_Price: 200,
    MM_Description: "MM Description1",
    Acceptance: "Acceptance1",
  },
];

const CDIDDB = [
  {
    CD_ID: "MM Code",
  },
  {
    CD_ID: "MM Code1",
  },
];

class MYASGEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // tokenUser: this.props.dataLogin.token,
      tokenUser: this.props.dataLogin.token,
      lmr_form: {
        pgr: "MP2",
        gl_account: "402102",
        lmr_issued_by: this.props.dataUser.preferred_username,
        plant: "MY",
        customer: "CELCOM",
        req_type: "Add LMR",
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
      filter_list: "",
      lmr_detail: {},
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
      let respond = await axios.get(API_URL_MAS + url, {
        headers: { "Content-Type": "application/json" },
        auth: {
          username: usernameMAS,
          password: passwordMAS,
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

  componentDidMount() {
    // this.getVendorList();
    // this.getProjectList();
    // this.getMaterialList();
    // this.getDataCD();
    if (this.props.match.params.id === undefined) {
      this.getLMRDetailData();
    } else {
      this.getLMRDetailData(this.props.match.params.id);
    }
    this.getMaterialList();
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
        this.setState({ creation_lmr_child_form: dataLMRDetailPRPO });
        // console.log('creation_lmr_child_form ', this.state.creation_lmr_child_form)
        // console.log('Item_Category ',this.state.creation_lmr_child_form.map(e => e.Item_Category))
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

  getMaterialList() {
    let filter =
      '"mm_code":{"$regex" : "' +
      this.state.filter_list +
      '", "$options" : "i"}';
    let whereAnd = "{" + filter + "}";
    this.getDatafromAPIMY(
      "/mm_code_data?q=" +
        whereAnd +
        "&lmt=" +
        this.state.perPage +
        "&pg=" +
        this.state.activePage
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
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
      this.setState({ lmr_form: lmr_form });
    }
  }

  async createLMR() {
    const dataForm = this.state.lmr_form;
    const dataChildForm = this.state.creation_lmr_child_form;
    const dataLMR = {
      plant: this.state.lmr_form.plant,
      customer: this.state.lmr_form.customer,
      lmr_issued_by: this.state.lmr_form.lmr_issued_by,
      pgr: this.state.lmr_form.pgr,
      gl_account: this.state.lmr_form.gl_account,
      id_project_doc: this.state.lmr_form.id_project_doc,
      project_name: this.state.lmr_form.project_name,
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
    for (let i = 0; i < dataChildForm.length; i++) {
      const dataChild = {
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
        request_type: this.state.lmr_form.Request_Type,
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
      if (
        dataChildForm[i].site_id === undefined ||
        dataChildForm[i].site_id === null
      ) {
        dataLMRCHild.push(dataChild);
      }
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
    let dataLMR = this.state.creation_lmr_child_form;
    dataLMR.push({
      tax_code: "I0",
      currency: "MYR",
      item_status: "Submit",
      work_status: "Waiting for PR-PO creation",
      site_id: "",
      so_or_nw: "",
      activity: "",
    });
    this.setState({ creation_lmr_child_form: dataLMR });
  }

  handleChangeFormLMRChild(e) {
    let dataLMR = this.state.creation_lmr_child_form;
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
                  Assignment LMR {this.state.lmr_detail.lmr_id}
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
                          name="Request_Type"
                          id="Request_Type"
                          value={this.state.lmr_form.req_type}
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
                          defaultValue={this.state.creation_lmr_child_form.map(
                            (e) => e.Item_Category
                          )}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option value={null} selected></option>
                          <option value="Service">Service</option>
                          <option value="3PP HW">3PP HW</option>
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
                          defaultValue={this.state.creation_lmr_child_form.map(
                            (e) => e.LMR_Type
                          )}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option value={null} selected></option>
                          <option value="Cost Collector">Cost Collector</option>
                          <option value="Per Site">Per Site</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Plan Cost Reduction</Label>
                        <Input
                          type="select"
                          name="plan_cost_reduction"
                          id="Plan_Cost_Reduction"
                          defaultValue={this.state.creation_lmr_child_form.map(
                            (e) => e.Plan_Cost_Reduction
                          )}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option value={null} selected></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
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
                          value={this.state.creation_lmr_child_form.map(
                            (e) => e.Requisitioner
                          )}
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
                        <Input
                          type="text"
                          name="gl_account"
                          id="gl_account"
                          value={this.state.lmr_detail.gl_account}
                          onChange={this.handleChangeFormLMR}
                        ></Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    {/* <Col md={4}>
                      <FormGroup>
                        <Label>Project Name</Label>
                        {this.state.lmr_edit === true ? 
                        (<Input
                          type="select"
                          name="project_name"
                          id="project_name"
                          value={this.state.lmr_form.project_name}
                          onChange={this.handleChangeFormLMR}
                        >
                          <option value="" disabled selected hidden>
                            Select Project Name
                          </option>
                          {this.state.list_project.map((e) => (
                            <option value={e.Project}>{e.Project}</option>
                          ))}  
                        </Input>) : (<Input
                          type="text"
                          name="project_name"
                          id="project_name"
                          value={this.state.lmr_form.project_name}
                          onChange={this.handleChangeFormLMR}
                          readOnly
                        />)}
                      </FormGroup>
                    </Col> */}
                    <Col md={4}>
                      <FormGroup>
                        <Label>Header Text</Label>
                        <Input
                          type="text"
                          name="header_text"
                          id="header_text"
                          value={this.state.lmr_detail.header_text}
                          onChange={this.handleChangeFormLMR}
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
                          value={this.state.lmr_detail.payment_term}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Vendor Name</Label>
                        <Input
                          type="select"
                          name="vendor_name"
                          id="vendor_name"
                          value={this.state.lmr_detail.vendor_name}
                          onChange={this.handleChangeVendor}
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
                          value={this.state.lmr_detail.vendor_email}
                          onChange={this.handleChangeFormLMR}
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
                          type="text"
                          name="l1_approver"
                          id="l1_approver"
                          value={this.state.lmr_detail.l1_approver}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>L2 Approver</Label>
                        <Input
                          type="text"
                          name="l2_approver"
                          id="l2_approver"
                          value={this.state.lmr_detail.l2_approver}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L3 Approver</Label>
                        <Input
                          type="text"
                          name="l3_approver"
                          id="l3_approver"
                          value={this.state.lmr_detail.l3_approver}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L4 Approver</Label>
                        <Input
                          type="text"
                          name="l4_approver"
                          id="l4_approver"
                          value={this.state.lmr_detail.l4_approver}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>L5 Approver</Label>
                        <Input
                          type="text"
                          name="l5_approver"
                          id="l5_approver"
                          value={this.state.lmr_detail.l5_approver}
                          onChange={this.handleChangeFormLMR}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <hr className="upload-line--lmr"></hr>
                <h5 style={{ marginTop: "16px" }}>LMR Child</h5>
                <hr className="upload-line--lmr"></hr>
                {this.state.creation_lmr_child_form.map((lmr, i) => (
                  <Form>
                    <Row form>
                      <Col md={2}>
                        <FormGroup>
                          <Label>CD ID</Label>
                          <Input
                            //key={lmr._id}
                            type="select"
                            name={"cd_id"}
                            id={i + " /// cd_id"}
                            defaultValue={lmr.cd_id}
                            // onChange={this.handleChangeFormLMRChild}
                            onChange={this.handleChangeFormLMRChild}
                            disabled={
                              this.state.lmr_form.LMR_Type === "Cost Collector"
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
                              name={"project_name"}
                              id="project_name"
                              defaultValue={lmr.Project}
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
                              id={i + " /// project_name"}
                              defaultValue={lmr.Project}
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
                            // name={"Per_Site_Material_Type"}
                            name={i + " /// Per_Site_Material_Type"}
                            id={i + " /// Per_Site_Material_Type"}
                            defaultValue={lmr.Per_Site_Material_Type}
                            // onChange={this.handleChangeFormLMRChild}
                            onChange={this.handleChangeFormLMRChild}
                            disabled={
                              this.state.lmr_form.LMR_Type === "Cost Collector"
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
                            id={i + " /// site_id"}
                            value={lmr.Item_Text_Site_Id}
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
                            id={i + " /// so_or_nw"}
                            value={lmr.NW}
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
                            id={i + " /// activity"}
                            value={lmr.NW_Activity}
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
                            id={i + " /// tax_code"}
                            value={lmr.Tax_Code}
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
                            id={i + " /// material"}
                            value={lmr.Material_Code}
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
                            id={i + " /// description"}
                            value={lmr.Description}
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
                            name={i + " /// price"}
                            id={i + " /// price"}
                            value={lmr.Price}
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
                            name={i + " /// quantity"}
                            id={i + " /// quantity"}
                            value={lmr.Qty}
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
                            name={i + " /// total_amount"}
                            id={i + " /// total_amount"}
                            value={lmr.Total_Amount}
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
                            id={i + " /// currency"}
                            value={lmr.Currency}
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
                            id={i + " /// delivery_date"}
                            value={lmr.Request_Delivery_Date}
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
                  color="success"
                  size="sm"
                  style={{ float: "right" }}
                  onClick={this.createLMR}
                >
                  <i
                    className="fa fa-plus-square"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Edit LMR ASG
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
                <th>BB Sub</th>
                <th>SoW</th>
                <th>UoM</th>
                <th>Region</th>
                <th>Unit Price</th>
                <th>MM Description</th>
              </thead>
              <tbody>
                <tr>
                  <td></td>
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
                          value={this.state.filter_list}
                          size="sm"
                        />
                      </InputGroup>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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

export default MYASGEdit;
