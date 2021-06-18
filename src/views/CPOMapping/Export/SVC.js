import React from "react";
import {
  Col,
  FormGroup,
  Row,
  Table,
  Card,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Button,
} from "reactstrap";
import { getDatafromAPINODE } from "../../../helper/asyncFunction";
import {
  getUniqueListBy,
  numToSSColumn,
  convertDateFormat_firefox,
} from "../../../helper/basicFunction";

import { saveAs } from "file-saver";
import { connect } from "react-redux";
import Select from "react-select";

import Excel from "exceljs";
import AsyncSelect from "react-select/async";
import Loading from "../../Component/Loading";
import "../../../helper/config";

const modul_name = "SVC Mapping";

class ExportSVC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      pivot_data: [],
      createModal: false,
      rowsXLS: [],
      modal_loading: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      multiply: 0,
      hammer_list: [],
      projdesc_list: [],
      filter_list: {},
      billing_list: [],
      billvalue_list: [],
      header_name: "",
      all_data_mapping: [],
    };
  }

  componentDidMount() {
    // console.log("header", header.length);
    // console.log("model_header", header_model.length);
    this.loadPOlist();
    // this.getList();
  }

  getList() {
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
      "/cpoMapping/getCpo/required/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        // this.setState({ all_data_mapping: items });
        return items;
      }
    });
  }

  loadPOlist = () => {
    let hammer_options = [
      {
        label: "2021",
        value: "2021",
      },
    ];
    this.setState({ hammer_list: hammer_options });
  };

  handleChange1 = (e) => {
    let filter_list = this.state.filter_list;
    filter_list["Hammer"] = e.value;
    this.setState({ filter_list: filter_list });
  };

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  handleChange2 = (e) => {
    let filter_list = this.state.filter_list;
    filter_list["Project_Description"] = e.value;
    this.setState({ filter_list: filter_list });
  };

  exportTemplateall = async () => {
    this.toggleLoading();
    // this.getListAll();

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    let filter_array2 = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array2.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd2 = "{" + filter_array2.join(",") + "}";
    const getdata = await getDatafromAPINODE(
      "/cpoMapping/getCpo/required/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    );

    if (getdata.data !== undefined) {
      const download_all_template = await getdata.data.data;
      // console.log("download_all_template ", download_all_template);
      ws.addRow(global.config.cpo_mapping.svc.header_model);
      for (
        let i = 1;
        i < global.config.cpo_mapping.svc.header_model.length + 1;
        i++
      ) {
        ws.getCell(numToSSColumn(i) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
          bgColor: { argb: "A9A9A9" },
        };
      }

      if (download_all_template !== undefined) {
        for (let i = 0; i < download_all_template.length; i++) {
          let e = download_all_template[i];
          ws.addRow([
            e.Deal_Name,
            e.Hammer,
            e.Project_Description,
            e.Po_Number,
            e.Data_1,
            e.Lookup_Reference,
            e.Region,
            e.Reference_Loc_Id,
            e.New_Loc_Id,
            e.Site_Name,
            e.New_Site_Name,
            e.Config,
            e.Po,
            e.Line,
            e.Material_Code,
            e.Description,
            e.Line_Item_Sap,
            e.Qty,
            convertDateFormat_firefox(e.CNI_Date),
            convertDateFormat_firefox(e.Mapping_Date),
            e.Remarks,
            e.Gr_No,
            e.Proceed_Billing_100,
            e.Celcom_User,
            e.Pcode,
            e.Unit_Price,
            e.Total_Price,
            e.Commodity,
            e.Discounted_Unit_Price,
            e.Discounted_Po_Price,
            e.Net_Unit_Price,
            e.Invoice_Total,
            e.Hammer_1_Hd_Total,
            e.So_Line_Item_Description,
            e.Sitepcode,
            e.VlookupWbs,
            e.So_No,
            e.Wbs_No,
            e.Billing_100,
            convertDateFormat_firefox(e.Atp_Coa_Received_Date_80),
            e.Billing_Upon_Atp_Coa_80,
            e.Invoicing_No_Atp_Coa_80,
            convertDateFormat_firefox(e.Invoicing_Date_Atp_Coa_80),
            e.Cancelled_Atp_Coa_80,
            convertDateFormat_firefox(e.Ni_Coa_Date_20),
            e.Billing_Upon_Ni_20,
            e.Invoicing_No_Ni_20,
            convertDateFormat_firefox(e.Invoicing_Date_Ni_20),
            e.Cancelled_Invoicing_Ni_20,
            convertDateFormat_firefox(e.Sso_Coa_Date_80),
            e.Billing_Upon_Sso_80,
            e.Invoicing_No_Sso_80,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_80),
            convertDateFormat_firefox(e.Cancelled_Sso_Coa_Date_80),
            convertDateFormat_firefox(e.Coa_Psp_Received_Date_20),
            e.Billing_Upon_Coa_Psp_20,
            e.Invoicing_No_Coa_Psp_20,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Psp_20),
            convertDateFormat_firefox(e.Cancelled_Coa_Psp_Received_Date_20),
            convertDateFormat_firefox(e.Coa_Ni_Received_Date_40),
            e.Billing_Upon_Coa_Ni_40,
            e.Invoicing_No_Coa_Ni_40,
            e.Invoicing_Date_Coa_Ni_40,
            convertDateFormat_firefox(e.Cancelled_Coa_Ni_Received_Date_40),
            convertDateFormat_firefox(e.Cosso_Received_Date_60),
            e.Billing_Upon_Cosso_60,
            e.Invoicing_No_Cosso_60,
            convertDateFormat_firefox(e.Invoicing_Date_Cosso_60),
            convertDateFormat_firefox(e.Cancelled_Cosso_Received_Date_60),
            convertDateFormat_firefox(e.Coa_Sso_Received_Date_100),
            e.Billing_Upon_Sso_Coa_100,
            e.Invoicing_No_Sso_Coa_100,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_Coa_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Sso_Received_Date_100),
            convertDateFormat_firefox(e.Coa_Ni_Date_100),
            e.Billing_Upon_Coa_Ni_100,
            e.Invoicing_No_Coa_Ni_100,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Ni_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Ni_Date_100),
            e.Ses_No,
            e.Ses_Status,
            e.Link,
            e.Ni_Coa_Submission_Status,
          ]);
        }
      }
      this.toggleLoading();

      const PPFormat = await wb.xlsx.writeBuffer();

      saveAs(
        new Blob([PPFormat]),
        this.state.roleUser[1] + " " + modul_name + " All Data.xlsx"
      );
    }
  };

  exportTemplate2 = async () => {
    this.toggleLoading();
    // this.getListAll();

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    let filter_array2 = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array2.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd2 = "{" + filter_array2.join(",") + "}";
    const getdata = await getDatafromAPINODE(
      "/cpoMapping/getCpo/required/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    );

    if (getdata.data !== undefined) {
      const download_all_template = await getdata.data.data;
      // console.log("download_all_template ", download_all_template);
      ws.addRow(global.config.cpo_mapping.svc.header_materialmapping);
      for (
        let i = 1;
        i < global.config.cpo_mapping.svc.header_materialmapping.length + 1;
        i++
      ) {
        ws.getCell(numToSSColumn(i) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
          bgColor: { argb: "A9A9A9" },
        };
      }

      if (download_all_template !== undefined) {
        // console.log(download_all_template.data.data.map((u) => u._id));

        for (let i = 0; i < download_all_template.length; i++) {
          let e = download_all_template[i];
          ws.addRow([
            e.Deal_Name,

            e.Hammer,

            e.Project_Description,

            e.Po_Number,
            e.Data_1,
            e.Lookup_Reference,
            e.Region,
            e.Reference_Loc_Id,
            e.New_Loc_Id,
            e.Site_Name,
            e.New_Site_Name,
            e.Config,
            e.Po,
            e.Line,

            e.Description,
            e.Qty,
            convertDateFormat_firefox(e.CNI_Date),
            convertDateFormat_firefox(e.Mapping_Date),
            e.Remarks,
            // e.Premr_No,
            e.Proceed_Billing_100,
            e.Celcom_User,

            e.Pcode,
            e.Unit_Price,

            e.Total_Price,

            e.Commodity,

            e.Discounted_Unit_Price,

            e.Discounted_Po_Price,

            e.Unit_Price * e.Qty * (e.Hammer_1_Hd / 100),
            e.So_Line_Item_Description,
            e.Sitepcode,
            e.VlookupWbs,
            e.So_No,
            e.Wbs_No,
            e.Billing_100,
            convertDateFormat_firefox(e.Atp_Coa_Received_Date_80),
            e.Billing_Upon_Atp_Coa_80,
            e.Invoicing_No_Atp_Coa_80,
            convertDateFormat_firefox(e.Invoicing_Date_Atp_Coa_80),
            e.Cancelled_Atp_Coa_80,
            convertDateFormat_firefox(e.Ni_Coa_Date_20),
            e.Billing_Upon_Ni_20,
            e.Invoicing_No_Ni_20,
            convertDateFormat_firefox(e.Invoicing_Date_Ni_20),
            e.Cancelled_Invoicing_Ni_20,
            convertDateFormat_firefox(e.Sso_Coa_Date_80),
            e.Billing_Upon_Sso_80,
            e.Invoicing_No_Sso_80,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_80),
            convertDateFormat_firefox(e.Cancelled_Sso_Coa_Date_80),
            convertDateFormat_firefox(e.Coa_Psp_Received_Date_20),
            e.Billing_Upon_Coa_Psp_20,
            e.Invoicing_No_Coa_Psp_20,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Psp_20),

            convertDateFormat_firefox(e.Cancelled_Coa_Psp_Received_Date_20),
            convertDateFormat_firefox(e.Coa_Ni_Received_Date_40),
            e.Billing_Upon_Coa_Ni_40,
            e.Invoicing_No_Coa_Ni_40,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Ni_40),
            convertDateFormat_firefox(e.Cancelled_Coa_Ni_Received_Date_40),
            convertDateFormat_firefox(e.Cosso_Received_Date_60),
            e.Billing_Upon_Cosso_60,
            e.Invoicing_No_Cosso_60,
            convertDateFormat_firefox(e.Invoicing_Date_Cosso_60),
            e.Cancelled_Cosso_Received_Date_60,
            convertDateFormat_firefox(e.Coa_Sso_Received_Date_100),
            e.Billing_Upon_Sso_Coa_100,
            e.Invoicing_No_Sso_Coa_100,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_Coa_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Sso_Received_Date_100),
            e.Coa_Ni_Date_100,
            e.Billing_Upon_Coa_Ni_100,
            e.Invoicing_No_Coa_Ni_100,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Ni_100),
            e.Cancelled_Coa_Ni_Date_100,
            e.Ses_No,
            e.Ses_Status,
            e.Link,
            e.Ni_Coa_Submission_Status,
          ]);
        }
      }
      this.toggleLoading();

      const PPFormat = await wb.xlsx.writeBuffer();

      saveAs(
        new Blob([PPFormat]),
        this.state.roleUser[1] + " " + modul_name + " All Data.xlsx"
      );
    }
  };

  download_PFM = async () => {
    this.toggleLoading();
    // this.getListAll();

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    let filter_array2 = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array2.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd2 = "{" + filter_array2.join(",") + "}";
    const getdata = await getDatafromAPINODE(
      "/cpoMapping/getCpo/required/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    );

    if (getdata.data !== undefined) {
      const download_all_A = await getdata.data.data;
      // console.log("download_all_template ", download_all_template);
      ws.addRow(
        [
          "Deal_Name",
          "Hammer",
          "Project_Description",
          "Po_Number",
          "Reference_Loc_Id",
          "Line",
          "Po",
          "Proceed_Billing_100",
        ].concat(global.config.cpo_mapping.svc.header_pfm)
      );
      // general info column
      for (let info = 1; info < 9; info++) {
        ws.getCell(numToSSColumn(info) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCFFCC" },
        };
      }
      // hammer2 column
      for (let hammer2 = 9; hammer2 < 22; hammer2++) {
        ws.getCell(numToSSColumn(hammer2) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DFDF9F" },
        };
      }
      // hammer1 column
      for (let hammer1 = 22; hammer1 < 35; hammer1++) {
        ws.getCell(numToSSColumn(hammer1) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };
      }
      // billing100 column
      for (let billing100 = 35; billing100 < 40; billing100++) {
        ws.getCell(numToSSColumn(billing100) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "60BF9F" },
        };
      }

      if (download_all_A !== undefined) {
        for (let i = 0; i < download_all_A.length; i++) {
          let e = download_all_A[i];
          ws.addRow([
            e.Deal_Name,
            e.Hammer,
            e.Project_Description,
            e.Po_Number,
            e.Reference_Loc_Id,
            e.Line,
            e.Po,
            e.Proceed_Billing_100,
            e.So_Line_Item_Description,
            e.Sitepcode,
            e.VlookupWbs,
            e.So_No,
            e.Wbs_No,
            e.Billing_Upon_Atp_Coa_80,
            e.Invoicing_No_Atp_Coa_80,
            convertDateFormat_firefox(e.Invoicing_Date_Atp_Coa_80),
            e.Cancelled_Atp_Coa_80,
            e.Billing_Upon_Ni_20,
            e.Invoicing_No_Ni_20,
            convertDateFormat_firefox(e.Invoicing_Date_Ni_20),
            e.Cancelled_Invoicing_Ni_20,
            e.Billing_Upon_Sso_80,
            e.Invoicing_No_Sso_80,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_80),
            convertDateFormat_firefox(e.Cancelled_Sso_Coa_Date_80),
            e.Billing_Upon_Coa_Psp_20,
            e.Invoicing_No_Coa_Psp_20,
            e.Invoicing_Date_Coa_Psp_20,
            convertDateFormat_firefox(e.Cancelled_Coa_Psp_Received_Date_20),
            e.Billing_Upon_Sso_Coa_100,
            e.Invoicing_No_Sso_Coa_100,
            e.Invoicing_Date_Sso_Coa_100,
            convertDateFormat_firefox(e.Cancelled_Coa_Sso_Received_Date_100),
            convertDateFormat_firefox(e.Coa_Ni_Date_100),
            e.Billing_Upon_Coa_Ni_100,
            e.Invoicing_No_Coa_Ni_100,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Ni_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Ni_Date_100),
          ]);
        }
      }
      const allocexport = await wb.xlsx.writeBuffer();
      this.toggleLoading();
      saveAs(
        new Blob([allocexport]),
        "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
      );
    }
  };

  download_Admin = async () => {
    this.toggleLoading();
    // this.getListAll();

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();
    let filter_array2 = [];
    for (const [key, value] of Object.entries(this.state.filter_list)) {
      if (value !== null && value !== undefined) {
        filter_array2.push(
          '"' + key + '":{"$regex" : "' + value + '", "$options" : "i"}'
        );
      }
    }
    let whereAnd2 = "{" + filter_array2.join(",") + "}";
    const getdata = await getDatafromAPINODE(
      "/cpoMapping/getCpo/required/svc?q=" + whereAnd2 + "&noPg=1",
      this.state.tokenUser
    );

    if (getdata.data !== undefined) {
      const download_all_A = await getdata.data.data;
      // console.log("download_all_template ", download_all_template);
      ws.addRow(
        [
          "Deal_Name",
          "Hammer",
          "Project_Description",
          "Po_Number",
          "Reference_Loc_Id",
          "Line",
          "Po",
          "Proceed_Billing_100",
        ].concat(global.config.cpo_mapping.svc.header_admin)
      );
      // general info column
      for (let info = 1; info < 8; info++) {
        ws.getCell(numToSSColumn(info) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCFFCC" },
        };
      }
      // hammer2 column
      for (let hammer2 = 8; hammer2 < 22; hammer2++) {
        ws.getCell(numToSSColumn(hammer2) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DFDF9F" },
        };
      }
      // hammer1 column
      for (let hammer1 = 22; hammer1 < 35; hammer1++) {
        ws.getCell(numToSSColumn(hammer1) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };
      }
      // billing100 column
      for (let billing100 = 35; billing100 < 40; billing100++) {
        ws.getCell(numToSSColumn(billing100) + "1").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "60BF9F" },
        };
      }

      if (download_all_A !== undefined) {
        for (let i = 0; i < download_all_A.length; i++) {
          let e = download_all_A[i];
          ws.addRow([
            e.Deal_Name,
            e.Hammer,
            e.Project_Description,
            e.Po_Number,
            e.Reference_Loc_Id,
            e.Line,
            e.Po,
            e.Proceed_Billing_100,
            e.So_Line_Item_Description,
            e.Sitepcode,
            e.VlookupWbs,
            e.So_No,
            e.Wbs_No,
            convertDateFormat_firefox(e.Billing_Upon_Atp_Coa_80),
            e.Invoicing_No_Atp_Coa_80,
            convertDateFormat_firefox(e.Invoicing_Date_Atp_Coa_80),
            e.Cancelled_Atp_Coa_80,
            e.Billing_Upon_Ni_20,
            e.Invoicing_No_Ni_20,
            convertDateFormat_firefox(e.Invoicing_Date_Ni_20),
            e.Cancelled_Invoicing_Ni_20,
            e.Billing_Upon_Sso_80,
            e.Invoicing_No_Sso_80,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_80),
            convertDateFormat_firefox(e.Cancelled_Sso_Coa_Date_80),
            e.Billing_Upon_Coa_Psp_20,
            e.Invoicing_No_Coa_Psp_20,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Psp_20),
            convertDateFormat_firefox(e.Cancelled_Coa_Psp_Received_Date_20),
            e.Billing_Upon_Sso_Coa_100,
            e.Invoicing_No_Sso_Coa_100,
            convertDateFormat_firefox(e.Invoicing_Date_Sso_Coa_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Sso_Received_Date_100),
            convertDateFormat_firefox(e.Coa_Ni_Date_100),
            e.Billing_Upon_Coa_Ni_100,
            e.Invoicing_No_Coa_Ni_100,
            convertDateFormat_firefox(e.Invoicing_Date_Coa_Ni_100),
            convertDateFormat_firefox(e.Cancelled_Coa_Ni_Date_100),
          ]);
        }
      }

      const allocexport = await wb.xlsx.writeBuffer();
      this.toggleLoading();
      saveAs(
        new Blob([allocexport]),
        "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
      );
    }
  };

  toggle = (i) => {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  };

  loadOptionsCDID = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let data_list = [];
      const getWPID = await getDatafromAPINODE(
        '/cpoMapping/getCpo/required/svc?q={"Project_Description":{"$regex":"' +
          inputValue +
          '", "$options":"i"}}',
        this.state.tokenUser
      );
      if (getWPID !== undefined && getWPID.data !== undefined) {
        // this.setState({ list_cd_id: getWPID.data.data });
        getUniqueListBy(getWPID.data.data, "Project_Description").map((wp) =>
          data_list.push({
            value: wp.Project_Description,
            label: wp.Project_Description,
          })
        );
      }
      console.log("data_list ", data_list);
      this.setState({ projdesc_list: data_list });
      return data_list;
    }
  };

  render() {
    const role = this.state.roleUser;
    return (
      <div>
        <Container>
          <Row>
            <Card body outline color="secondary">
              <Row xs="3">
                <Col md={4}>
                  <FormGroup>
                    {/* <Label>PO</Label> */}
                    <Select
                      placeholder="Select HAMMER"
                      options={this.state.hammer_list}
                      onChange={this.handleChange1}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    {/* <Select
                      placeholder="Select Project Desc"
                      options={this.state.billing_list}
                      onChange={this.handleChange2}
                    />{" "} */}
                    <AsyncSelect
                      placeholder="Type Project Desc"
                      cacheOptions
                      loadOptions={this.loadOptionsCDID}
                      defaultOptions
                      onChange={this.handleChange2}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <Dropdown
                    isOpen={this.state.dropdownOpen[1]}
                    toggle={() => {
                      this.toggle(1);
                    }}
                  >
                    <DropdownToggle block color="warning" size="sm">
                      <i className="fa fa-download" aria-hidden="true">
                        {" "}
                        &nbsp;{" "}
                      </i>{" "}
                      Export
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Export Data</DropdownItem>
                      <DropdownItem onClick={this.exportTemplateall}>
                        {" "}
                        All Data SVC Export
                      </DropdownItem>
                      <DropdownItem header>Uploader Template</DropdownItem>
                      {role.includes("BAM-MAT PLANNER") === true ? (
                        <>
                          <DropdownItem onClick={this.exportTemplate2}>
                            {" "}
                            Mapping Template{" " + this.state.roleUser[1]}{" "}
                          </DropdownItem>
                        </>
                      ) : (
                        ""
                      )}
                      {role.includes("BAM-PFM") === true ? (
                        <>
                          <DropdownItem onClick={this.download_PFM}>
                            {" "}
                            Mapping Template{" " + this.state.roleUser[1]}{" "}
                          </DropdownItem>
                        </>
                      ) : (
                        ""
                      )}
                      {role.includes("BAM-ADMIN") === true ? (
                        <>
                          <DropdownItem onClick={this.download_Admin}>
                            {" "}
                            Mapping Template{" " + this.state.roleUser[1]}{" "}
                          </DropdownItem>
                        </>
                      ) : (
                        ""
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
              </Row>
            </Card>
          </Row>
        </Container>

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

export default connect(mapStateToProps)(ExportSVC);
