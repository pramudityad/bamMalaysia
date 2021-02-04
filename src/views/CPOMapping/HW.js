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
} from "reactstrap";
import Excel from "exceljs";
import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
} from "../../helper/asyncFunction";
import ModalCreateNew from "../Component/ModalCreateNew";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import { numToSSColumn } from "../../helper/basicFunction";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./cpomapping.css";
const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);
const Checkbox1 = ({
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
const modul_name = "HW Mapping";
const header = [
  "DEAL NAME",
  "HAMMER ",
  "PROJECT DESCRIPTION",
  "PO NUMBER",
  "1",
  "LOOKUP REFERENCE",
  "REGION",
  "REFERENCE LOC ID",
  "NEW LOC ID",
  "SITE NAME",
  "NEW SITE NAME",
  "CONFIG",
  "PO#",
  "LINE",
  "DESCRIPTION",
  "QTY",
  "NW#",
  "ON AIR DATE",
  "MAPPING DATE",
  "REMARKS",
  "PREMR NO.",
  "PROCEED BILLING 100%",
  "CELCOM USER",
  "PCODE",
  "UNIT PRICE",
  "TOTAL PRICE",
  "DISCOUNTED UNIT PRICE",
  "DISCOUNTED PO PRICE",
  "HAMMER 1 HD TOTAL",
  "SO LINE ITEM DESCRIPTION",
  "sitePCode",
  "VlookupWBS",
  "SO NO.",
  "WBS  NO.",
  "FOR CHECKING PURPOSE ONLY-RASHIDAH",
  "HW COA RECEIVED DATE",
  "80% BILLING UPON HW COA",
  "80% INVOICING NO.",
  "80% INVOICING DATE",
  "Cancel Invoice",
  "NI COA DATE (VLOOKUP FROM SERVICES MAPPING)",
  "20% BILLING UPON NI",
  "20% INVOICING NO.",
  "20% INVOICING DATE",
  "Cancelled",
  "HW COA RECEIVED DATE",
  "40% BILLING UPON COA HW",
  "40% INVOICING NO.",
  "40% INVOICING DATE",
  "Cancelled",
  "NI COA date (vlookup from SERVICES MAPPING)",
  "40% BILLING UPON COA NI",
  "40% INVOICING Number",
  "40% INVOICING DATE",
  "Cancelled",
  "SSO COA date (vlookup from SERVICES MAPPING)",
  "20% BILLING UPON COA SSO",
  "20% INVOICING NO.",
  "20% INVOICING DATE",
  "Cancelled",
  "100%  HW COA ",
  "100% BILLING UPON HW COA",
  "100% INVOICING NO.",
  "100% INVOICING DATE",
  "Cancelled",
  "Cancel column",
  "REFERENCE LOC ID",
  "PO#",
  "REFF",
  "Vlookup for billing",
];

const header_model = [
  "Deal_Name",
  "Hammer",
  "Project_Description",
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
  "NW",
  "On_Air_Date",
  "Mapping_Date",
  "Remarks",
  "Premr_No",
  "Proceed_Billing_100",
  "Celcom_User",
  "Pcode",
  "Unit_Price",
  "Total_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "Hammer_1_Hd_Total",
  "So_Line_Item_Description",
  "Sitepcode",
  "VlookupWbs",
  "So_No",
  "Wbs_No",
  "For_Checking_Purpose_Only_Rashidah",
  "Hw_Coa_Received_Date_80",
  "Billing_Upon_Hw_Coa_80",
  "Invoicing_No_Hw_Coa_80",
  "Invoicing_Date_Hw_Coa_80",
  "Cancelled_Invoice_Hw_Coa_80",
  "Ni_Coa_Date_20",
  "Billing_Upon_Ni_20",
  "Invoicing_No_Ni_20",
  "Invoicing_Date_Ni_20",
  "Cancelled_Invoicing_Ni_20",
  "Hw_Coa_Received_Date_40",
  "Billing_Upon_Hw_Coa_40",
  "Invoicing_No_Hw_Coa_40",
  "Invoicing_Date_Hw_Coa_40",
  "Cancelled_Hw_Coa_40",
  "Ni_Coa_Date_40",
  "Billing_Upon_Ni_40",
  "Invoicing_No_Ni_40",
  "Invoicing_Date_Ni_40",
  "Cancelled_Ni_40",
  "Sso_Coa_Date_20_1",
  "Billing_Upon_Sso_20_1",
  "Invoicing_No_Sso_20_1",
  "Invoicing_Date_Sso_20_1",
  "Cancelled_Sso_20",
  "Hw_Coa_100",
  "Billing_Upon_Hw_Coa_100",
  "Invoicing_No_Hw_Coa_100",
  "Invoicing_Date_Hw_Coa_100",
  "Cancelled_Invoicing_Hw_Coa_100",
  "Cancel_Column",
  "Reference_Loc_Id_1",
  "Po_1",
  "Reff",
  "Vlookup_For_Billing",
];

const header_materialmapping = [
  "Deal_Name",
  "Hammer",
  "Project_Description",
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
  "NW",
  "On_Air_Date",
  "Mapping_Date",
  "Remarks",
  "Premr_No",
  "Proceed_Billing_100",
  "Celcom_User",
  "Pcode",
  "Unit_Price",
  "Total_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
];

const header_pfm = [
  "So_Line_Item_Description",
  "Sitepcode",
  "VlookupWbs",
  "So_No",
  "Wbs_No",
  "Hw_Coa_Received_Date_80",
  "Billing_Upon_Hw_Coa_80",
  "Invoicing_No_Hw_Coa_80",
  "Invoicing_Date_Hw_Coa_80",
  "Cancelled_Invoice_Hw_Coa_80",
  // "Ni_Coa_Date_20",
  "Billing_Upon_Ni_20",
  "Invoicing_No_Ni_20",
  "Invoicing_Date_Ni_20",
  "Cancelled_Invoicing_Ni_20",
  // "Hw_Coa_Received_Date_40",
  "Billing_Upon_Hw_Coa_40",
  "Invoicing_No_Hw_Coa_40",
  "Invoicing_Date_Hw_Coa_40",
  "Cancelled_Hw_Coa_40",
  // "Ni_Coa_Date_40",
  "Billing_Upon_Ni_40",
  "Invoicing_No_Ni_40",
  "Invoicing_Date_Ni_40",
  "Cancelled_Ni_40",
  // "Sso_Coa_Date_20_1",
  "Billing_Upon_Sso_20_1",
  "Invoicing_No_Sso_20_1",
  "Invoicing_Date_Sso_20_1",
  "Cancelled_Sso_20",
  "Hw_Coa_100",
  // "Billing_Upon_Hw_Coa_100",
  "Invoicing_No_Hw_Coa_100",
  "Invoicing_Date_Hw_Coa_100",
  "Cancelled_Invoicing_Hw_Coa_100",
];

const header_admin = [
  "For_Checking_Purpose_Only_Rashidah",
  "Hw_Coa_Received_Date_80",
  "Cancel_Column",
  "Reference_Loc_Id_1",
  "Reff",
];

class MappingHW extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      createModal: false,
      rowsXLS: [],
      modal_loading: false,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      CPOForm: {},
      modalEdit: false,
      modal_loading: false,
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
    };
  }

  componentDidMount() {
    console.log("header", header.length);
    console.log("model_header", header_model.length);
    this.getList();
    this.getListAll();
    this.getMaster();
  }

  getMaster() {
    getDatafromAPINODE(
      "/summaryMaster/getSummaryMaster?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items2 = res.data.data;
        this.setState({ all_data_master: items2 });
      }
    });
  }

  getList() {
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

    // filter_array.push('"Not_Required":' + null);
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/required/hw?q=" +
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
        this.setState({ all_data: items, totalData: totalData });
      }
    });
  }

  getListAll() {
    getDatafromAPINODE(
      "/cpoMapping/getCpo/required/hw?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ all_data_mapping: items });
      }
    });
  }

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

    filter_array.push('"Not_Required":' + true);
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?q=" +
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

  exportTemplate = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_materialmapping);
    for (let i = 1; i < header_materialmapping.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([PPFormat]),
      this.state.roleUser[1] + " " + modul_name + " Template.xlsx"
    );
  };

  exportTemplate2 = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const download_all_template = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    ws.addRow(header_materialmapping);
    for (let i = 1; i < header_materialmapping.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_template.data !== undefined) {
      console.log(download_all_template.data.data.map((u) => u._id));

      for (let i = 0; i < download_all_template.data.data.length; i++) {
        let e = download_all_template.data.data[i];
        ws.addRow([
          e.Project,
          e.Internal_Po,
          // e.Link,
          e.Lookup_Reference,
          e.Region,
          e.Reference_Loc_Id,
          e.New_Loc_Id,
          e.Site_Name,
          e.New_Site_Name,
          e.Config,
          e.Po,
          e.Line,
          this.LookupField(e.Po + "-" + e.Line, "Description"),
          e.Qty,
          e.CNI_Date,
          e.Mapping_Date,
          e.Remarks,
          e.Celcom_User,
          this.LookupField(e.Po + "-" + e.Line, "Pcode"),
          this.LookupField(e.Po + "-" + e.Line, "Unit_Price"),
          e.Total_Price,
          e.Discounted_Unit_Price,
          e.Discounted_Po_Price,
          // e.Type,
          // e.So_Line_Item_Description,
          // e.So_No,
          // e.Wbs_No,
          // e.Billing_100,
          // e.Atp_Coa_Received_Date_80,
          // e.Billing_Upon_Atp_Coa_80,
          // e.Invoicing_No_Atp_Coa_80,
          // e.Invoicing_Date_Atp_Coa_80,
          // e.Cancelled_Atp_Coa_80,
          // e.Ni_Coa_Date_20,
          // e.Billing_Upon_Ni_20,
          // e.Invoicing_No_Ni_20,
          // e.Invoicing_Date_Ni_20,
          // e.Sso_Coa_Date_80,
          // e.Billing_Upon_Sso_80,
          // e.Invoicing_No_Sso_80,
          // e.Invoicing_Date_Sso_80,
          // e.Coa_Psp_Received_Date_20,
          // e.Billing_Upon_Coa_Psp_20,
          // e.Invoicing_No_Coa_Psp_20,
          // e.Invoicing_Date_Coa_Psp_20,
          // e.Sso_Coa_Date_100,
          // e.Billing_Upon_Sso_Coa_100,
          // e.Invoicing_No_Sso_Coa_100,
          // e.Invoicing_Date_Sso_Coa_100,
          // e.Coa_Ni_Date_100,
          // e.Billing_Upon_Coa_Ni_100,
          // e.Invoicing_No_Coa_Ni_100,
          // e.Invoicing_Date_Coa_Ni_100,
          // e.Ses_No,
          // e.Ses_Status,
          // e.Link_1,
          // e.Ni_Coa_Submission_Status,
          // e.Invoicing_Date_Sso_20_1,
          // e.Cancelled_Sso_20,
          // e.Vlookup_SSO_100_In_Service,
          // e.Hw_Coa_100,
          // e.Billing_Upon_Hw_Coa_100,
          // e.Invoicing_No_Hw_Coa_100,
          // e.Invoicing_Date_Hw_Coa_100,
          // e.Reference_Loc_Id_1,
          // e.Po_1,
          // e.Reff_1,
          // e.Site_List,
          // e.Reff_2,
          // e.Ni,
          // e.Sso,
          // e.Ref_Ni,
        ]);
      }
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([PPFormat]),
      this.state.roleUser[1] + " " + modul_name + " All Data.xlsx"
    );
  };

  exportTemplateall = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const download_all_template = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    ws.addRow(header_model);
    for (let i = 1; i < header_model.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_template.data !== undefined) {
      console.log(download_all_template.data.data.map((u) => u._id));

      for (let i = 0; i < download_all_template.data.data.length; i++) {
        let e = download_all_template.data.data[i];
        ws.addRow([
          e.Project,
          e.Internal_Po,
          // e.Link,
          e.Lookup_Reference,
          e.Region,
          e.Reference_Loc_Id,
          e.New_Loc_Id,
          e.Site_Name,
          e.New_Site_Name,
          e.Config,
          e.Po,
          e.Line,
          this.LookupField(e.Po + "-" + e.Line, "Description"),
          e.Qty,
          e.CNI_Date,
          e.Mapping_Date,
          e.Remarks,
          e.Celcom_User,
          this.LookupField(e.Po + "-" + e.Line, "Pcode"),
          this.LookupField(e.Po + "-" + e.Line, "Unit_Price"),
          e.Total_Price,
          e.Discounted_Unit_Price,
          e.Discounted_Po_Price,
          e.Type,
          e.So_Line_Item_Description,
          e.So_No,
          e.Wbs_No,
          e.Billing_100,
          e.Atp_Coa_Received_Date_80,
          e.Billing_Upon_Atp_Coa_80,
          e.Invoicing_No_Atp_Coa_80,
          e.Invoicing_Date_Atp_Coa_80,
          e.Cancelled_Atp_Coa_80,
          e.Ni_Coa_Date_20,
          e.Billing_Upon_Ni_20,
          e.Invoicing_No_Ni_20,
          e.Invoicing_Date_Ni_20,
          e.Sso_Coa_Date_80,
          e.Billing_Upon_Sso_80,
          e.Invoicing_No_Sso_80,
          e.Invoicing_Date_Sso_80,
          e.Coa_Psp_Received_Date_20,
          e.Billing_Upon_Coa_Psp_20,
          e.Invoicing_No_Coa_Psp_20,
          e.Invoicing_Date_Coa_Psp_20,
          e.Sso_Coa_Date_100,
          e.Billing_Upon_Sso_Coa_100,
          e.Invoicing_No_Sso_Coa_100,
          e.Invoicing_Date_Sso_Coa_100,
          e.Coa_Ni_Date_100,
          e.Billing_Upon_Coa_Ni_100,
          e.Invoicing_No_Coa_Ni_100,
          e.Invoicing_Date_Coa_Ni_100,
          e.Ses_No,
          e.Ses_Status,
          e.Link_1,
          e.Ni_Coa_Submission_Status,
          e.Invoicing_Date_Sso_20_1,
          e.Cancelled_Sso_20,
          e.Vlookup_SSO_100_In_Service,
          e.Hw_Coa_100,
          e.Billing_Upon_Hw_Coa_100,
          e.Invoicing_No_Hw_Coa_100,
          e.Invoicing_Date_Hw_Coa_100,
          e.Reference_Loc_Id_1,
          e.Po_1,
          e.Reff_1,
          e.Site_List,
          e.Reff_2,
          e.Ni,
          e.Sso,
          e.Ref_Ni,
        ]);
      }
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([PPFormat]),
      this.state.roleUser[1] + " " + modul_name + " All Data.xlsx"
    );
  };

  togglecreateModal = () => {
    this.setState({
      createModal: !this.state.createModal,
    });
  };

  resettogglecreateModal = () => {
    this.setState({
      rowsXLS: [],
    });
  };

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState({
            rowsXLS: rest.rows,
          });
        }
      });
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

  saveBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo",
      {
        cpo_type: "hw",
        required_check: true,
        roles: roles,
        cpo_data: this.state.rowsXLS,
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
      const aEdit = this.state.all_data.find((e) => e._id === value);
      this.setState({ CPOForm: aEdit, selected_id: value });
    } else {
      this.setState({ CPOForm: {} });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  handleChangeForm = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState(
      (prevState) => ({
        CPOForm: {
          ...prevState.CPOForm,
          [name]: value,
        },
      }),
      () => console.log(this.state.CPOForm)
    );
  };

  saveUpdate = async () => {
    // this.toggleEdit();
    this.toggleLoading();
    if (this.state.tabs_submenu[0] === true) {
      let checked_data = this.state.dataChecked_container;
      const newForm = checked_data
        .map(({ Not_Required, ...item }) => item)
        .map((obj) => ({ ...obj, Not_Required: true }));
      console.log("not req form", checked_data, newForm);

      const res = await patchDatatoAPINODE(
        "/cpoMapping/updateCpo",
        {
          cpo_type: "hw",
          data: newForm,
        },
        this.state.tokenUser
      );
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
        setTimeout(function () {
          window.location.reload();
        }, 1500);
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
    } else {
      let checked_data2 = this.state.dataChecked_container2;
      const newForm2 = checked_data2
        .map(({ Not_Required, ...item }) => item)
        .map((obj) => ({ ...obj, Not_Required: null }));
      const res = await patchDatatoAPINODE(
        "/cpoMapping/updateCpo",
        {
          cpo_type: "hw",
          data: newForm2,
        },
        this.state.tokenUser
      );
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
        setTimeout(function () {
          window.location.reload();
        }, 1500);
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
    }
  };

  download_Admin = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_admin);
    for (let i = 1; i < header_admin.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A.data !== undefined) {
      for (let i = 0; i < download_all_A.data.data.length; i++) {
        let e = download_all_A.data.data[i];
        ws.addRow([
          e.Billing_100,
          e.Atp_Coa_Received_Date_80,
          e.Ni_Coa_Date_20,
          e.Sso_Coa_Date_80,
          e.Coa_Psp_Received_Date_20,
          e.Sso_Coa_Date_100,
          e.Ses_No,
          e.Ses_Status,
          e.Ni_Coa_Submission_Status,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
    this.toggleLoading();
  };

  export_Admin = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_admin);
    for (let i = 1; i < header_admin.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Template " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
    this.toggleLoading();
  };

  download_PFM = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_pfm);
    for (let i = 1; i < header_pfm.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A.data !== undefined) {
      console.log(download_all_A.data.data.map((u) => u._id));

      for (let i = 0; i < download_all_A.data.data.length; i++) {
        let e = download_all_A.data.data[i];
        ws.addRow([
          e.So_Line_Item_Description,
          e.Sitepcode,
          e.VlookupWbs,
          e.So_No,
          e.Wbs_No,
          e.Billing_100,
          e.Billing_Upon_Atp_Coa_80,
          e.Invoicing_No_Atp_Coa_80,
          e.Invoicing_Date_Atp_Coa_80,
          e.Cancelled_Atp_Coa_80,
          e.Billing_Upon_Ni_20,
          e.Invoicing_No_Ni_20,
          e.Invoicing_Date_Ni_20,
          e.Cancelled_Invoicing_Ni_20,
          e.Billing_Upon_Sso_80,
          e.Invoicing_No_Sso_80,
          e.Invoicing_Date_Sso_80,
          e.Cancelled_Sso_Coa_Date_80,
          e.Billing_Upon_Coa_Psp_20,
          e.Invoicing_No_Coa_Psp_20,
          e.Invoicing_Date_Coa_Psp_20,
          e.Cancelled_Coa_Psp_Received_Date_20,
          e.Billing_Upon_Sso_Coa_100,
          e.Invoicing_No_Sso_Coa_100,
          e.Invoicing_Date_Sso_Coa_100,
          e.Cancelled_Sso_Coa_Date_100,
          e.Coa_Ni_Date_100,
          e.Billing_Upon_Coa_Ni_100,
          e.Invoicing_No_Coa_Ni_100,
          e.Invoicing_Date_Coa_Ni_100,
          e.Cancelled_Coa_Ni_Date_100,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
    this.toggleLoading();
  };

  export_PFM = async () => {
    this.toggleLoading();
    const download_all_A = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(header_pfm);
    for (let i = 1; i < header_pfm.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([allocexport]),
      "Template" + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
    this.toggleLoading();
  };

  onChangeDebounced = () => {
    this.state.tabs_submenu[0] === true ? this.getList() : this.getList2();
  };

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
    for (let i = 0; i < header_model.length; i++) {
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
                value={this.state.filter_list[header_model[i]]}
                name={header_model[i]}
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

  LookupField = (unique_id_master, params_field) => {
    let value = "objectData." + params_field;
    let objectData = this.state.all_data_master.find(
      (e) => e.unique_code === unique_id_master
    );
    if (objectData !== undefined) {
      return eval(value);
    } else {
      return null;
    }
  };

  handleChangeChecklist = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const each_data = this.state.all_data;
    let dataChecked_container = this.state.dataChecked_container;
    if (isChecked === true) {
      const getCPO = each_data.find((pp) => pp._id === item);
      dataChecked_container.push(getCPO);
    } else {
      dataChecked_container = dataChecked_container.filter(function (pp) {
        return pp._id !== item;
      });
    }
    this.setState({ dataChecked_container: dataChecked_container }, () =>
      console.log("make not req", this.state.dataChecked_container)
    );
    this.setState((prevState) => ({
      dataChecked: prevState.dataChecked.set(item, isChecked),
    }));
  };

  handleChangeChecklistAll = async (e) => {
    const getall = await getDatafromAPINODE(
      "/cpoMapping/getCpo/hw?noPg=1",
      this.state.tokenUser
    );
    console.log(getall.data);

    if (getall.data !== undefined) {
      if (e.target !== null) {
        const isChecked = e.target.checked;
        let dataChecked_container = this.state.dataChecked_container;
        let each_data = getall.data.data;
        if (isChecked) {
          each_data = each_data.filter(
            (e) =>
              dataChecked_container.map((m) => m._id).includes(e._id) !== true
          );
          for (let x = 0; x < each_data.length; x++) {
            dataChecked_container.push(each_data[x]);
            this.setState((prevState) => ({
              dataChecked_container: prevState.dataChecked_container.set(
                each_data[x]._id,
                isChecked
              ),
            }));
          }
          this.setState({ dataChecked_container: dataChecked_container });
        } else {
          for (let x = 0; x < each_data.length; x++) {
            this.setState(
              (prevState) => ({
                dataChecked_container: prevState.dataChecked_container.set(
                  each_data[x]._id,
                  isChecked
                ),
              }),
              () => console.log(this.state.dataChecked_container)
            );
          }
          dataChecked_container.length = 0;
          this.setState({ dataChecked_container: dataChecked_container });
        }
        this.setState((prevState) => ({
          dataChecked_all: !prevState.dataChecked_all,
        }));
      }
    }
  };

  handleChangeChecklist2 = (e) => {
    const item2 = e.target.name;
    const isChecked2 = e.target.checked;
    const each_data2 = this.state.all_data_true;
    let dataChecked_container2 = this.state.dataChecked_container2;
    if (isChecked2 === false) {
      const getCPO2 = each_data2.find((pp) => pp._id === item2);
      dataChecked_container2.push(getCPO2);
    } else {
      dataChecked_container2 = dataChecked_container2.filter(function (pp) {
        return pp._id !== item2;
      });
    }
    this.setState({ dataChecked_container2: dataChecked_container2 }, () =>
      console.log(this.state.dataChecked_container2)
    );
    this.setState((prevState) => ({
      dataChecked: prevState.dataChecked.set(item2, isChecked2),
    }));
  };

  changeTabsSubmenu = (e) => {
    e === 1 ? this.getList2() : this.getList();
    // console.log("tabs_submenu", e);
    let tab_submenu = new Array(2).fill(false);
    tab_submenu[parseInt(e)] = true;
    this.setState({ tabs_submenu: tab_submenu });
  };

  countData = () => {};

  handleChangeLimit = (e) => {
    let limitpg = e.currentTarget.value;
    this.setState({ perPage: limitpg }, () => this.getList());
  };

  countheader = (params_field) => {
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
                      <Button
                        block
                        color="success"
                        size="sm"
                        onClick={this.togglecreateModal}
                      >
                        <i className="fa fa-plus-square" aria-hidden="true">
                          {" "}
                          &nbsp;{" "}
                        </i>{" "}
                        {role.includes("BAM-IM") === true ||
                        role.includes("BAM-PFM") === true
                          ? "Update"
                          : "New"}
                      </Button>
                    </div>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
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
                          All Data HW Export
                        </DropdownItem>
                        <DropdownItem header>Uploader Template</DropdownItem>

                        {role.includes("BAM-MAT PLANNER") === true ? (
                          <>
                            <DropdownItem onClick={this.exportTemplate}>
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>
                            <DropdownItem onClick={this.exportTemplate2}>
                              {" "}
                              All Data Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>
                          </>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-PFM") === true ? (
                          <>
                            <DropdownItem onClick={this.export_PFM}>
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>
                            <DropdownItem onClick={this.download_PFM}>
                              All Data Template{" " + this.state.roleUser[1]}{" "}
                            </DropdownItem>
                          </>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-IM") === true ? (
                          <>
                            <DropdownItem onClick={this.export_Admin}>
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>
                            <DropdownItem onClick={this.download_Admin}>
                              All Data Template{" " + this.state.roleUser[1]}{" "}
                            </DropdownItem>
                          </>
                        ) : (
                          ""
                        )}
                      </DropdownMenu>
                    </Dropdown>
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
                      <table class="table table-hover">
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
                            {header.map((head) => (
                              <th>{head}</th>
                            ))}
                          </tr>
                          {this.state.tabs_submenu[0] === true ? (
                            <>
                              <tr align="center">
                                <th></th>
                                <th></th>
                                {header_model.map((head) => (
                                  <th>{this.countheader(head)}</th>
                                ))}
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr align="center">
                                {header_model.map((head) => (
                                  <th>{this.countheader(head)}</th>
                                ))}
                              </tr>
                            </>
                          )}
                          <tr align="center">
                            <td></td>
                            <td>
                              {/* <Checkbox1
                                name={"all"}
                                checked={this.state.dataChecked_all}
                                onChange={this.handleChangeChecklistAll}
                                value={"all"}
                              /> */}
                            </td>{" "}
                            {this.loopSearchBar()}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.tabs_submenu[0] === true &&
                            this.state.all_data !== undefined &&
                            this.state.all_data.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr align="center" key={e._id}>
                                  <td>
                                    <Link to={"/hw-cpo/" + e._id}>
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
                                    <Checkbox1
                                      checked={this.state.dataChecked.get(
                                        e._id
                                      )}
                                      // checked={e.Not_Required}
                                      onChange={this.handleChangeChecklist}
                                      name={e._id}
                                      value={e}
                                    />
                                  </td>
                                  <td>{e.Project}</td>
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
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>{e.NW}</td>
                                  <td>{e.On_Air_Date}</td>
                                  <td>{e.Mapping_Date}</td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Premr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Unit_Price * e.Qty}</td>
                                  <td>{e.Discounted_Unit_Price}</td>
                                  <td>{e.Discounted_Po_Price}</td>
                                  <td>{e.So_Line_Item_Description}</td>
                                  <td>{e.Sitepcode}</td>
                                  <td>{e.VlookupWbs}</td>
                                  <td>{e.So_No}</td>
                                  <td>{e.Wbs_No}</td>
                                  <td>
                                    {e.For_Checking_Purpose_Only_Rashidah}
                                  </td>
                                  <td>{e.Hw_Coa_Received_Date_80}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_80}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_80}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_80}</td>
                                  <td>{e.Cancelled_Invoice_Hw_Coa_80}</td>
                                  <td>{e.Ni_Coa_Date_20}</td>
                                  <td>{e.Billing_Upon_Ni_20}</td>
                                  <td>{e.Invoicing_No_Ni_20}</td>
                                  <td>{e.Invoicing_Date_Ni_20}</td>
                                  <td>{e.Cancelled_Invoicing_Ni_20}</td>
                                  <td>{e.Sso_Coa_Date_20}</td>
                                  <td>{e.Billing_Upon_Sso_20}</td>
                                  <td>{e.Invoicing_No_Sso_20}</td>
                                  <td>{e.Invoicing_Date_Sso_20}</td>
                                  <td>{e.Gr_Number}</td>
                                  <td>{e.Hw_Coa_Received_Date_40}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_40}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_40}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_40}</td>
                                  <td>{e.Cancelled_Hw_Coa_40}</td>
                                  <td>{e.Ni_Coa_Date_40}</td>
                                  <td>{e.Billing_Upon_Ni_40}</td>
                                  <td>{e.Invoicing_No_Ni_40}</td>
                                  <td>{e.Invoicing_Date_Ni_40}</td>
                                  <td>{e.Cancelled_Ni_40}</td>
                                  <td>{e.Sso_Coa_Date_20_1}</td>
                                  <td>{e.Billing_Upon_Sso_20_1}</td>
                                  <td>{e.Invoicing_No_Sso_20_1}</td>
                                  <td>{e.Invoicing_Date_Sso_20_1}</td>
                                  <td>{e.Cancelled_Sso_20}</td>
                                  <td>{e.Vlookup_SSO_100_In_Service}</td>
                                  <td>{e.Hw_Coa_100}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_100}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_100}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_100}</td>
                                  <td>{e.Cancelled_Invoicing_Hw_Coa_100}</td>
                                  <td>{e.Cancel_Column}</td>
                                  <td>{e.Reference_Loc_Id_1}</td>
                                  <td>{e.Po_1}</td>
                                  <td>{e.Reff}</td>
                                  <td>{e.Vlookup_For_Billing}</td>
                                  <td>{e.Deal_Name}</td>
                                  <td>{e.Hammer}</td>
                                  <td>
                                    {e.Unit_Price *
                                      e.Qty *
                                      (this.LookupField(
                                        e.Po + "-" + e.Line,
                                        "Hammer_1_Hd"
                                      ) /
                                        100)}
                                  </td>
                                  <td>{e.Project_Description}</td>
                                </tr>
                              </React.Fragment>
                            ))}
                          {this.state.tabs_submenu[1] === true &&
                            this.state.all_data_true !== undefined &&
                            this.state.all_data_true.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr align="center" key={e._id}>
                                  {role.includes("BAM-IM") === true ||
                                  role.includes("BAM-PFM") === true ? (
                                    <td>
                                      <Link to={"/hw-cpo/" + e._id}>
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
                                  ) : (
                                    <td></td>
                                  )}
                                  <td>{e.Project}</td>
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
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>{e.NW}</td>
                                  <td>{e.On_Air_Date}</td>
                                  <td>{e.Mapping_Date}</td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Premr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
                                  <td>{e.Discounted_Unit_Price}</td>
                                  <td>{e.Discounted_Po_Price}</td>
                                  <td>{e.So_Line_Item_Description}</td>
                                  <td>{e.Sitepcode}</td>
                                  <td>{e.VlookupWbs}</td>
                                  <td>{e.So_No}</td>
                                  <td>{e.Wbs_No}</td>
                                  <td>
                                    {e.For_Checking_Purpose_Only_Rashidah}
                                  </td>
                                  <td>{e.Hw_Coa_Received_Date_80}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_80}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_80}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_80}</td>
                                  <td>{e.Cancelled_Invoice_Hw_Coa_80}</td>
                                  <td>{e.Ni_Coa_Date_20}</td>
                                  <td>{e.Billing_Upon_Ni_20}</td>
                                  <td>{e.Invoicing_No_Ni_20}</td>
                                  <td>{e.Invoicing_Date_Ni_20}</td>
                                  <td>{e.Cancelled_Invoicing_Ni_20}</td>
                                  <td>{e.Sso_Coa_Date_20}</td>
                                  <td>{e.Billing_Upon_Sso_20}</td>
                                  <td>{e.Invoicing_No_Sso_20}</td>
                                  <td>{e.Invoicing_Date_Sso_20}</td>
                                  <td>{e.Gr_Number}</td>
                                  <td>{e.Hw_Coa_Received_Date_40}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_40}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_40}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_40}</td>
                                  <td>{e.Cancelled_Hw_Coa_40}</td>
                                  <td>{e.Ni_Coa_Date_40}</td>
                                  <td>{e.Billing_Upon_Ni_40}</td>
                                  <td>{e.Invoicing_No_Ni_40}</td>
                                  <td>{e.Invoicing_Date_Ni_40}</td>
                                  <td>{e.Cancelled_Ni_40}</td>
                                  <td>{e.Sso_Coa_Date_20_1}</td>
                                  <td>{e.Billing_Upon_Sso_20_1}</td>
                                  <td>{e.Invoicing_No_Sso_20_1}</td>
                                  <td>{e.Invoicing_Date_Sso_20_1}</td>
                                  <td>{e.Cancelled_Sso_20}</td>
                                  <td>{e.Vlookup_SSO_100_In_Service}</td>
                                  <td>{e.Hw_Coa_100}</td>
                                  <td>{e.Billing_Upon_Hw_Coa_100}</td>
                                  <td>{e.Invoicing_No_Hw_Coa_100}</td>
                                  <td>{e.Invoicing_Date_Hw_Coa_100}</td>
                                  <td>{e.Cancelled_Invoicing_Hw_Coa_100}</td>
                                  <td>{e.Cancel_Column}</td>
                                  <td>{e.Reference_Loc_Id_1}</td>
                                  <td>{e.Po_1}</td>
                                  <td>{e.Reff}</td>
                                  <td>{e.Vlookup_For_Billing}</td>
                                  <td>{e.Deal_Name}</td>
                                  <td>{e.Hammer}</td>
                                  <td>
                                    {this.LookupField(
                                      e.Po + "-" + e.Line,
                                      "Hammer_1_Hd_Total"
                                    ) *
                                      (e.Unit_Price * e.Qty)}
                                  </td>
                                  <td>{e.Project_Description}</td>
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

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form Update</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup row>
                  <Col xs="4">
                    <FormGroup>
                      <Label>Line</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Line"
                        placeholder=""
                        value={CPOForm.Line}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label>PO</Label>
                      <Input
                        readOnly
                        type="text"
                        name="Po"
                        placeholder=""
                        value={CPOForm.Po}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label>NEW LOC ID</Label>
                      <Input
                        readOnly
                        type="text"
                        name="New_Loc_Id"
                        placeholder=""
                        value={CPOForm.New_Loc_Id}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Config</Label>
                      {role.includes("BAM-IM") === true ? (
                        <Input
                          type="text"
                          name="Config"
                          placeholder=""
                          value={CPOForm.Config}
                          onChange={this.handleChangeForm}
                        />
                      ) : (
                        <Input
                          readOnly
                          type="text"
                          name="Config"
                          placeholder=""
                          value={CPOForm.Config}
                          onChange={this.handleChangeForm}
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>QTY</Label>
                      {role.includes("BAM-IM") === true ? (
                        <Input
                          readOnly
                          type="number"
                          name="Qty"
                          placeholder=""
                          value={CPOForm.Qty}
                          onChange={this.handleChangeForm}
                        />
                      ) : (
                        <Input
                          type="number"
                          name="Qty"
                          placeholder=""
                          value={CPOForm.Qty}
                          onChange={this.handleChangeForm}
                        />
                      )}
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveUpdate}>
              Update
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal create New */}
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
          title={"Manage " + modul_name}
        >
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Upload File</td>
                  <td>:</td>
                  <td>
                    <input
                      type="file"
                      onChange={this.fileHandlerMaterial.bind(this)}
                      style={{ padding: "10px", visiblity: "hidden" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ModalFooter>
            {/* {role.includes("BAM-IM") === true ||
            role.includes("BAM-PFM") === true ? (
              <Button
                size="sm"
                block
                color="secondary"
                className="btn-pill"
                disabled={this.state.rowsXLS.length === 0}
                onClick={this.saveUpdate}
                style={{ height: "30px", width: "100px" }}
              >
                Update
              </Button>
            ) : ( */}
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveBulk}
              style={{ height: "30px", width: "100px" }}
            >
              Save
            </Button>
            {/* )} */}
          </ModalFooter>
        </ModalCreateNew>

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

export default connect(mapStateToProps)(MappingHW);
