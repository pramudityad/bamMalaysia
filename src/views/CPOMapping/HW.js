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
const Progressbar = React.lazy(() => import("../Component/Progressbar"));

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
  "LINE ITEM SAP CELCOM",
  "MATERIAL CODE",
  "DESCRIPTION",
  "QTY",
  "NW#",
  "ON AIR DATE",
  "MAPPING DATE",
  "REMARKS",
  "GR NO",
  // "PREMR NO.",
  "PROCEED BILLING 100%",
  "CELCOM USER",
  "PCODE",
  "UNIT PRICE",
  "TOTAL PRICE",
  "DISCOUNTED UNIT PRICE",
  "DISCOUNTED PO PRICE",
  "NET UNIT PRICE",
  "INVOICE TOTAL",
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
  "Line_Item_Sap",
  "Material_Code",
  "Description",
  "Qty",
  "NW",
  "On_Air_Date",
  "Mapping_Date",
  "Remarks",
  "Gr_No",
  "Proceed_Billing_100",
  "Celcom_User",
  "Pcode",
  "Unit_Price",
  "Total_Price",
  "Discounted_Unit_Price",
  "Discounted_Po_Price",
  "Net_Unit_Price",
  "Invoice_Total",
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
  "Line_Item_Sap",
  "Material_Code",
  "Description",
  "Qty",
  "NW",
  "On_Air_Date",
  "Mapping_Date",
  "Remarks",
  "Gr_No",
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
  // "Gr_No",
  "For_Checking_Purpose_Only_Rashidah",
  "Hw_Coa_Received_Date_80",
  "Invoicing_Date_Hw_Coa_100",
  "Cancel_Column",
  "Reference_Loc_Id_1",
  "Reff",
];

class MappingHW extends React.Component {
  // csvLink = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
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
    };
    // this.exportTemplate2 = this.exportTemplate2.bind(this);
  }

  componentDidMount() {
    console.log("token", this.state.tokenUser);
    // console.log("model_header", header_model.length);
    // this.getList();
    // this.getHeader();
    // this.getListAll();
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
      "/cpoMapping/getCpo/required/count/hw?q=" + whereAnd2 + "&noPg=1",
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
        this.setState({ all_data: items, totalData: totalData }, () =>
          this.getHeader()
        );
      }
    });
  }

  loadOptionsReclocID = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let asycn_options = [];
      await getUniqueListBy(
        this.state.all_data_mapping,
        "Reference_Loc_Id"
      ).map((data) =>
        asycn_options.push({
          label: data.Reference_Loc_Id,
          value: data.Reference_Loc_Id,
          // Reference_Loc_Id: data.Reference_Loc_Id,
          // Po: data.Po,
          // Line: data.Line,
        })
      );
      return asycn_options.filter((i) =>
        i.label.toLowerCase().includes(inputValue)
      );
    }
  };

  loadOptionsPO = async (inputValue) => {
    if (!inputValue) {
      return [];
    } else {
      let async_options2 = [];
      await getUniqueListBy(
        this.state.all_data_master,
        "Project_Description"
      ).map((data) =>
        async_options2.push({
          label: data.Project_Description,
          value: data.Project_Description,
          // Reference_Loc_Id: data.Reference_Loc_Id,
          // Po: data.Po,
          // Line: data.Line,
        })
      );
      return async_options2.filter((i) =>
        i.label.toLowerCase().includes(inputValue)
      );
    }
  };

  handlemultipleRelocID = (datalist) => {
    let multiple_array = [];
    let site_selected = [];
    // console.log("datalist", datalist);
    if (datalist !== undefined && datalist !== null) {
      const data_ref = this.state.all_data_mapping
        .filter((ref) => ref.Reference_Loc_Id === datalist.value)
        .map((e) =>
          multiple_array.push({
            _id: e._id,
            Reference_Loc_Id: e.Reference_Loc_Id,
            unique_code: e.unique_code,
            Project_Description: this.LookupField(
              e.Po + "-" + e.Line,
              "Project_Description"
            ),
            Mapping_Date: "",
            Po: e.Po,
            Line: e.Line,
            Qty: e.Qty,
          })
        );
      // console.log("dataref", data_ref);
      this.setState({ multiple_select: multiple_array }, () =>
        console.log(this.state.multiple_select)
      );
    } else {
      this.setState({ multiple_select: [] }, () =>
        console.log(this.state.multiple_select)
      );
    }
  };

  handleBeforeCallOf = (datalist) => {
    const mapping_data = this.state.multiple_select.filter(
      (data) => data.Project_Description === datalist.value
    );
    // console.log("Project_Description", datalist.value);
    if (datalist !== undefined && datalist !== null) {
      this.setState(
        { multiple_select2: mapping_data, po_select: datalist.value },
        () => console.log(this.state.multiple_select2)
      );
    } else {
      this.setState({ datalist: null }, () => console.log(this.state.datalist));
    }
  };

  getListAll = async () => {
    let all_data = [];
    this.toggleLoading();
    const t0 = performance.now();
    getDatafromAPINODE(
      "/cpoMapping/getCpo/required/hw?noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const t1 = performance.now();
        console.log("took 1" + (t1 - t0) + " milliseconds.");
        console.log("len ", items.length);
        // all_data = items;
        // return all_data;
        this.setState(
          { all_data_mapping: items }
          //   , () => {
          //   setTimeout(() => {
          //     this.csvLink.current.link.click();
          //   });
          // }
        );
      } else {
        all_data = [];
      }
    });
    this.toggleLoading();
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
    this.toggleLoading();
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const download_all_template = this.state.all_data_mapping;
    ws.addRow(header_materialmapping);
    for (let i = 1; i < header_materialmapping.length + 1; i++) {
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
          this.LookupField2(e.Po + "-" + e.Line, "Deal_Name"),
          this.LookupField2(e.Po + "-" + e.Line, "Hammer"),
          this.LookupField2(e.Po + "-" + e.Line, "Project_Description"),
          this.LookupField2(e.Po + "-" + e.Line, "Po_Number"),
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
          e.Line_Item_Sap,
          e.Material_Code,
          this.LookupField2(e.Po + "-" + e.Line, "Description"),
          e.Qty,
          e.NW,
          e.On_Air_Date,
          e.Mapping_Date,
          e.Remarks,
          e.Premr_No,
          e.Proceed_Billing_100,
          e.Celcom_User,
          this.LookupField2(e.Po + "-" + e.Line, "Pcode"),
          this.LookupField2(e.Po + "-" + e.Line, "Unit_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Total_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Discounted_Unit_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Discounted_Po_Price"),
        ]);
      }
    }
    this.toggleLoading();
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([PPFormat]),
      this.state.roleUser[1] + " " + modul_name + " All Data.xlsx"
    );
  };

  exportTemplateall = async () => {
    this.toggleLoading();
    // this.getListAll();

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const download_all_template = this.state.all_data_mapping;

    ws.addRow(header_model);
    for (let i = 1; i < header_model.length + 1; i++) {
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
          this.LookupField2(e.Po + "-" + e.Line, "Deal_Name"),
          this.LookupField2(e.Po + "-" + e.Line, "Hammer"),
          this.LookupField2(e.Po + "-" + e.Line, "Project_Description"),
          this.LookupField2(e.Po + "-" + e.Line, "Po_Number"),
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
          e.Line_Item_Sap,
          e.Material_Code,
          this.LookupField2(e.Po + "-" + e.Line, "Description"),
          e.Qty,
          e.NW,
          e.On_Air_Date,
          e.Mapping_Date,
          e.Remarks,
          e.Premr_No,
          e.Proceed_Billing_100,
          e.Celcom_User,
          this.LookupField2(e.Po + "-" + e.Line, "Pcode"),
          this.LookupField2(e.Po + "-" + e.Line, "Unit_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Total_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Discounted_Unit_Price"),
          this.LookupField2(e.Po + "-" + e.Line, "Discounted_Po_Price"),
          e.Unit_Price *
            e.Qty *
            (this.LookupField2(e.Po + "-" + e.Line, "Hammer_1_Hd") / 100),
          e.So_Line_Item_Description,
          e.Sitepcode,
          e.VlookupWbs,
          e.So_No,
          e.Wbs_No,
          e.For_Checking_Purpose_Only_Rashidah,
          e.Hw_Coa_Received_Date_80,
          e.Billing_Upon_Hw_Coa_80,
          e.Invoicing_No_Hw_Coa_80,
          e.Invoicing_Date_Hw_Coa_80,
          e.Cancelled_Invoice_Hw_Coa_80,
          e.Ni_Coa_Date_20,
          e.Billing_Upon_Ni_20,
          e.Invoicing_No_Ni_20,
          e.Invoicing_Date_Ni_20,
          e.Cancelled_Invoicing_Ni_20,
          e.Hw_Coa_Received_Date_40,
          e.Billing_Upon_Hw_Coa_40,
          e.Invoicing_No_Hw_Coa_40,
          e.Invoicing_Date_Hw_Coa_40,
          e.Cancelled_Hw_Coa_40,
          e.Ni_Coa_Date_40,
          e.Billing_Upon_Ni_40,
          e.Invoicing_No_Ni_40,
          e.Invoicing_Date_Ni_40,
          e.Cancelled_Ni_40,
          e.Sso_Coa_Date_20_1,
          e.Billing_Upon_Sso_20_1,
          e.Invoicing_No_Sso_20_1,
          e.Invoicing_Date_Sso_20_1,
          e.Cancelled_Sso_20,
          e.Hw_Coa_100,
          e.Billing_Upon_Hw_Coa_100,
          e.Invoicing_No_Hw_Coa_100,
          e.Invoicing_Date_Hw_Coa_100,
          e.Cancelled_Invoicing_Hw_Coa_100,
          e.Cancel_Column,
          e.Reference_Loc_Id_1,
          e.Po_1,
          e.Reff,
          e.Vlookup_For_Billing,
        ]);
      }
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    this.toggleLoading();
    // };
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

  toggleCallOff = () => {
    this.setState({
      modal_callof: !this.state.modal_callof,
    });
  };

  resettogglecreateModal = () => {
    this.setState({
      rowsXLS: [],
      rowsXLS_batch: [],
    });
  };

  fileHandlerMaterial = (input) => {
    const file = input.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    // console.log("rABS");
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        cellDates: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, devfal: null });
      /* Update state */
      this.ArrayEmptytoNull(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  checkValue(props) {
    // if value undefined return null
    if (typeof props === "undefined") {
      return null;
    } else {
      return props;
    }
  }

  ArrayEmptytoNull(dataXLS) {
    let newDataXLS = [];
    for (let i = 0; i < dataXLS.length; i++) {
      let col = [];
      for (let j = 0; j < dataXLS[0].length; j++) {
        if (typeof dataXLS[i][j] === "object") {
          let dataObject = this.checkValue(JSON.stringify(dataXLS[i][j]));
          if (dataObject !== null) {
            dataObject = dataObject.replace(/"/g, "");
          }
          col.push(dataObject);
        } else {
          col.push(this.checkValue(dataXLS[i][j]));
        }
      }
      newDataXLS.push(col);
    }
    this.setState(
      {
        rowsXLS: newDataXLS,
      },
      () => this.chunkArray(this.state.rowsXLS, 4000)
    );
  }

  chunkArray = (array, size) => {
    let result = [];
    // console.log("origin ", array.splice(1, array.length));
    let arrayCopy = [...array.splice(1, array.length)];
    let header_change = [...array.splice(0, 1)];
    while (arrayCopy.length > 0) {
      result.push(header_change.concat(arrayCopy.splice(0, size)));
    }
    console.log("res len, ", result.length);
    console.log("result ", result);
    this.setState({ rowsXLS_batch: result });
    // return result;
  };

  toggle = (i) => {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  };

  saveBulk2 = async () => {
    // this.toggleLoading();
    this.togglecreateModal();
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    for (
      let index_xlsx = 0;
      index_xlsx < this.state.rowsXLS_batch.length;
      index_xlsx++
    ) {
      this.setState({
        action_status: null,
        action_message: null,
      });
      let num_batch = 1;
      this.toggleLoading();
      console.log(`hit ${index_xlsx}`);
      const res = await postDatatoAPINODE(
        "/cpoMapping/createCpo",
        {
          cpo_type: "svc",
          required_check: true,
          roles: roles,
          cpo_data: this.state.rowsXLS_batch[index_xlsx],
        },
        this.state.tokenUser
      );
      console.log(res);

      if (res.data !== undefined) {
        if (roles === 2) {
          this.setState({
            action_status: "success",
            action_message: "success batch " + num_batch,
          });
          this.toggleLoading();
        } else {
          if (res.data.updateData.length !== 0) {
            const table_header = Object.keys(res.data.updateData[0]);
            const update_Data = res.data.updateData;
            const new_table_header = table_header.slice(0, -2);
            // update_Data.map((row, k) => console.log(row));
            // console.log(table_header);
            let value = "row.";
            const bodyEmail =
              "<h2>DPM - BAM Notification</h2><br/><span>Please be notified that the following " +
              modul_name +
              " data has been updated <br/><br/><table><tr>" +
              new_table_header
                .map((tab, i) => "<th>" + tab + "</th>")
                .join(" ") +
              "</tr>" +
              update_Data
                .map(
                  (row, j) =>
                    "<tr key={" +
                    j +
                    "}>" +
                    new_table_header
                      .map((td) => "<td>" + eval(value + td) + "</td>")
                      .join(" ") +
                    "</tr>"
                )
                .join(" ") +
              "</table>";
            if (res.data.warnNotif.length !== 0) {
              let dataEmail = {
                // "to": creatorEmail,
                to: "damar.pramuditya@ericsson.com",
                // to: global.config.role.cpm,
                subject: "[NOTIFY to CPM] " + modul_name,
                body: bodyEmail,
              };
              const sendEmail = await apiSendEmail(dataEmail);
              // console.log(sendEmail);
              this.setState({
                action_status: "warning",
                action_message:
                  "success with warn " +
                  res.data.warnNotif.map((warn) => warn) +
                  " batch " +
                  num_batch,
              });
              this.toggleLoading();
              return;
              // setTimeout(function () {
              //   window.location.reload();
              // }, 1500);
            }
            let dataEmail = {
              // "to": creatorEmail,
              to: "damar.pramuditya@ericsson.com",
              // to: global.config.role.cpm,
              subject: "[NOTIFY to CPM] " + modul_name,
              body: bodyEmail,
            };
            // const sendEmail = await apiSendEmail(dataEmail);
            // console.log(sendEmail);
            this.setState({
              action_status: "success",
              action_message: "success batch " + num_batch,
            });
            this.toggleLoading();
            // setTimeout(function () {
            //   window.location.reload();
            // }, 1500);
          } else {
            this.setState({
              action_status: "success",
              action_message: "success batch " + num_batch,
            });
            this.toggleLoading();
          }
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
              action_message:
                res.response.data.error.message + "batch " + num_batch,
            });
          } else {
            this.setState({
              action_status: "failed",
              action_message: res.response.data.error + "batch " + num_batch,
            });
          }
        } else {
          this.setState({ action_status: "failed" });
        }
        this.toggleLoading();
        break;
      }
      num_batch++;
    }
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
        cpo_type: "hw",
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
      const aEdit = this.state.all_data.find((e) => e._id === value);
      this.setState({ CPOForm: aEdit, selected_id: value });
    } else {
      this.setState({ CPOForm: {} });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  // handleChangeForm = (e) => {
  //   const value = e.target.value;
  //   const name = e.target.name;
  //   this.setState(
  //     (prevState) => ({
  //       CPOForm: {
  //         ...prevState.CPOForm,
  //         [name]: value,
  //       },
  //     }),
  //     () => console.log(this.state.CPOForm)
  //   );
  // };

  saveUpdate = async () => {
    this.toggleLoading();
    // create
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    let header_move = [
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
      "Line_Item_Sap",
      "Material_Code",
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
      "Deal_Name",
      "So_Line_Item_Description",
      "Sitepcode",
    ];
    const header_create_not_req = [header_move];
    const body_create_not_req = this.state.dataChecked_container.map((data) =>
      Object.keys(data)
        .filter((key) => header_move.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {})
    );
    const trimm_body_create_not_req = body_create_not_req.map((data) =>
      Object.keys(data).map((key) => data[key])
    );
    console.log("trimm_body_create_not_req", trimm_body_create_not_req);
    // console.log(
    //   "header",
    //   body_create_not_req.map((data) => Object.keys(data).map((key) => key))
    // );
    // console.log("body", trimm_body_create_not_req);
    // console.log(
    //   "post not req",
    //   header_create_not_req.concat(trimm_body_create_not_req)
    // );
    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo",
      {
        cpo_type: "hw",
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
          cpo_type: "hw",
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

  download_Admin = async () => {
    this.toggleLoading();
    const download_all_A = this.state.all_data_mapping;

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(
      [
        "Deal_Name",
        "Hammer",
        "Project_Description",
        "Po_Number",
        "Reference_Loc_Id",
        "Line",
        "Po",
      ].concat(header_admin)
    );
    for (let i = 1; i < header_admin.length + 3; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A !== undefined) {
      for (let i = 0; i < download_all_A.length; i++) {
        let e = download_all_A[i];
        ws.addRow([
          e.Deal_Name,
          this.LookupField2(e.Po_Number + "-" + e.Line, "Hammer"),
          this.LookupField2(e.Po_Number + "-" + e.Line, "Project_Description"),
          e.Po_Number,
          e.Reference_Loc_Id,
          e.Line,
          e.Po,
          e.For_Checking_Purpose_Only_Rashidah,
          e.Hw_Coa_Received_Date_80,
          e.Invoicing_Date_Hw_Coa_100,
          e.Cancel_Column,
          e.Reference_Loc_Id_1,
          e.Reff,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    this.toggleLoading();
    saveAs(
      new Blob([allocexport]),
      "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
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
    this.toggleLoading();
    saveAs(
      new Blob([allocexport]),
      "Template " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
  };

  download_PFM = async () => {
    this.toggleLoading();
    const download_all_A = this.state.all_data;

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

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
      ].concat(header_pfm)
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
      // console.log(download_all_A.data.map((u) => u._id));

      for (let i = 0; i < download_all_A.length; i++) {
        let e = download_all_A[i];
        ws.addRow([
          e.Deal_Name,
          this.LookupField2(e.Po + "-" + e.Line, "Hammer"),
          this.LookupField2(e.Po + "-" + e.Line, "Project_Description"),
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
          e.Hw_Coa_Received_Date_80,
          e.Billing_Upon_Hw_Coa_80,
          e.Invoicing_No_Hw_Coa_80,
          e.Invoicing_Date_Hw_Coa_80,
          e.Cancelled_Invoice_Hw_Coa_80,
          e.Billing_Upon_Ni_20,
          e.Invoicing_No_Ni_20,
          e.Invoicing_Date_Ni_20,
          e.Cancelled_Invoicing_Ni_20,
          e.Billing_Upon_Hw_Coa_40,
          e.Invoicing_No_Hw_Coa_40,
          e.Invoicing_Date_Hw_Coa_40,
          e.Cancelled_Hw_Coa_40,
          e.Billing_Upon_Ni_40,
          e.Invoicing_No_Ni_40,
          e.Invoicing_Date_Ni_40,
          e.Cancelled_Ni_40,
          e.Billing_Upon_Sso_20_1,
          e.Invoicing_No_Sso_20_1,
          e.Invoicing_Date_Sso_20_1,
          e.Cancelled_Sso_20,
          e.Hw_Coa_100,
          e.Invoicing_No_Hw_Coa_100,
          e.Invoicing_Date_Hw_Coa_100,
          e.Cancelled_Invoicing_Hw_Coa_100,
        ]);
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    this.toggleLoading();
    saveAs(
      new Blob([allocexport]),
      "All Data " + this.state.roleUser[1] + " " + modul_name + ".xlsx"
    );
  };

  export_PFM = async () => {
    this.toggleLoading();
    const download_all_A = await this.state.all_data_mapping;

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(
      ["Reference_Loc_Id", "Line", "Po", "Proceed_Billing_100"].concat(
        header_pfm
      )
    );
    for (let i = 1; i < header_pfm.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
    }

    if (download_all_A !== undefined) {
      // console.log(download_all_A.data.map((u) => u._id));
      for (let i = 0; i < download_all_A.length; i++) {
        let e = download_all_A[i];
        ws.addRow([e.Reference_Loc_Id, e.Line, e.Po, e.Proceed_Billing_100]);
      }
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
      if (
        params_field === "Unit_Price" ||
        params_field === "Total_Price" ||
        params_field === "Discounted_Unit_Price" ||
        params_field === "Discounted_Po_Price" ||
        params_field === "Net_Unit_Price"
      ) {
        return formatMoney(eval(value));
      }
      return eval(value);
    } else {
      return null;
    }
  };

  LookupField2 = (unique_id_master, params_field) => {
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
    console.log(this.state.dataChecked.has(e._id));
    const item = e.target.name;
    const isChecked = e.target.checked;
    const each_data = this.state.all_data;
    console.log("here", item, isChecked, each_data);
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

  countheader = (params_field) => {
    let value = "curr." + params_field;
    let sumheader = this.state.all_data_mapping.reduce(
      (acc, curr) => acc + eval(value),
      0
    );
    // console.log(sumheader);
    return Math.round((sumheader + Number.EPSILON) * 100) / 100;
  };

  countheaderNaN = (params_field) => {
    let value = "element." + params_field;
    let sumheader = this.state.all_data_mapping.filter(
      (element) => eval(value) !== null && eval(value) !== ""
    );
    return sumheader.length;
    // console.log(params_field, sumheader);
  };

  Upload_progress = (value, max) => {
    const percent = (value / max) * 100;
    return (
      <div className="animated fadeIn">
        <div className="card-header-actions">
          <div style={{ textAlign: "center" }}>
            <Progress value={percent} />
          </div>
        </div>
      </div>
    );
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
            <Progressbar value={20} />
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
                        {role.includes("BAM-ADMIN") === true ||
                        role.includes("BAM-PFM") === true
                          ? "Update"
                          : "New"}
                      </Button>
                    </div>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    {/* <Dropdown
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
                        <DropdownItem
                          disabled={this.state.all_data_mapping.length === 0}
                          onClick={this.exportTemplateall}
                        >
                          {" "}
                          All Data HW Export
                        </DropdownItem>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        {role.includes("BAM-MAT PLANNER") === true ? (
                          <>
                            <DropdownItem
                              disabled={
                                this.state.all_data_mapping.length === 0
                              }
                              onClick={this.exportTemplate2}
                            >
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>                   
                          </>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-PFM") === true ? (
                          <>
                            <DropdownItem
                              disabled={
                                this.state.all_data_mapping.length === 0
                              }
                              onClick={this.download_PFM}
                            >
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>         
                          </>
                        ) : (
                          ""
                        )}
                        {role.includes("BAM-ADMIN") === true ? (
                          <>
                            <DropdownItem
                              disabled={
                                this.state.all_data_mapping.length === 0
                              }
                              onClick={this.download_Admin}
                            >
                              {" "}
                              Mapping Template{" " +
                                this.state.roleUser[1]}{" "}
                            </DropdownItem>               
                          </>
                        ) : (
                          ""
                        )}
                      </DropdownMenu>
                    </Dropdown> */}
                    <Link to={"/cpo-hw-export"} target="_blank">
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
                                {/* <th></th> */}
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
                                {/* <th></th> */}
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
                                {header_model.map((head) => (
                                  <th>{this.countheader(head)}</th>
                                ))}
                              </tr>
                            </>
                          )}
                          <tr align="center">
                            {this.state.tabs_submenu[0] === true ? (
                              <>
                                {/* <td></td> */}
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
                            this.state.all_data !== undefined &&
                            this.state.all_data.map((e, i) => (
                              <React.Fragment key={e._id + "frag"}>
                                <tr align="center" key={e._id}>
                                  {/* <td>
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
                                  </td> */}

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
                                  <td>{e.Line_Item_Sap}</td>
                                  <td>{e.Material_Code}</td>
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>{e.NW}</td>
                                  <td>{e.On_Air_Date}</td>
                                  <td>{e.Mapping_Date}</td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Gr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
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
                                  <td>{e.Line_Item_Sap}</td>
                                  <td>{e.Material_Code}</td>
                                  <td>{e.Description}</td>
                                  <td>{e.Qty}</td>
                                  <td>{e.NW}</td>
                                  <td>{e.On_Air_Date}</td>
                                  <td>{e.Mapping_Date}</td>
                                  <td>{e.Remarks}</td>
                                  <td>{e.Gr_No}</td>
                                  <td>{e.Proceed_Billing_100}</td>
                                  <td>{e.Celcom_User}</td>
                                  <td>{e.Pcode}</td>
                                  <td>{e.Unit_Price}</td>
                                  <td>{e.Total_Price}</td>
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
                      {role.includes("BAM-ADMIN") === true ? (
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
                      {role.includes("BAM-ADMIN") === true ? (
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

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modal_callof}
          toggle={this.toggleCallOff}
          className="modal--form"
        >
          <ModalHeader>Form Call Off</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="8">
                <FormGroup row>
                  <Col xs="8">
                    <FormGroup>
                      <Label>Reference Loc ID</Label>
                      <AsyncSelect
                        // isMulti
                        cacheOptions
                        loadOptions={this.loadOptionsReclocID}
                        defaultOptions
                        onChange={this.handlemultipleRelocID}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
              <Col sm="8">
                <FormGroup row>
                  <Col xs="8">
                    <FormGroup>
                      <Label>Project Description</Label>
                      <AsyncSelect
                        // isMulti
                        cacheOptions
                        loadOptions={this.loadOptionsPO}
                        defaultOptions
                        onChange={this.handleBeforeCallOf}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            {this.state.multiple_select2 !== null &&
            this.state.po_select !== null ? (
              <>
                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      <Col xs="8">
                        <FormGroup>
                          <Label>
                            <h6>
                              There are {this.state.multiple_select2.length}{" "}
                              items under this combination
                            </h6>
                          </Label>
                          <Input
                            type="date"
                            name={"unique_code"}
                            placeholder=""
                            value={CPOForm.Line}
                            onChange={this.handleChangeForm}
                          />
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={this.saveUpdate_CallOf}
              disabled={this.state.multiple_select2.length === 0}
            >
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
                  <td>Upload</td>
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
            <span>
              File will be split into {this.state.rowsXLS_batch.length} batch
            </span>
          </div>

          <ModalFooter>
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS_batch.length === 0}
              onClick={this.saveBulk2}
              style={{ height: "30px", width: "100px" }}
            >
              Save
            </Button>
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
