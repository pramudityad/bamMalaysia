import React, { Fragment } from "react";
import {
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
} from "reactstrap";
import { Col, FormGroup, Label, Row, Table, Input } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Pagination from "react-js-pagination";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import * as XLSX from "xlsx";
import ModalCreateNew from "../Component/ModalCreateNew";
import ModalDelete from "../Component/ModalDelete";
import { connect } from "react-redux";

import Loading from "../Component/Loading";
import { ExcelRenderer } from "react-excel-renderer";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  getDatafromAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
} from "../../helper/asyncFunctionDigi";
import { numToSSColumn } from "../../helper/basicFunction";
import '../MYAssignment/LMRMY.css';

const DefaultNotif = React.lazy(() => import("../DefaultView/DefaultNotif"));
const Checkbox = ({
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
const module_name = "NRO";
const header_model = [
  "Material_Sub_Type",
  "BB",
  "BB_Sub",
  "SoW_Description_or_Site_Type",
  "UoM",
  "Region",
  "Unit_Price",
  "MM_Code",
  "MM_Description",
];

class TabelNRO extends React.Component {
  getVendorRow(material_vendor_data, vendor, mat_id) {
    const Matdata = material_vendor_data.find(
      (e) => e.Vendor_Code === vendor.Vendor_Code
    );
    if (Matdata !== undefined) {
      return (
        <Fragment>
          <td>
            <Checkbox
              // checked={!this.props.CheckVendor}
              checked={
                this.props.vendorChecked.has(mat_id + " /// " + vendor.Vendor_Code) ? this.props.vendorChecked.get(mat_id + " /// " + vendor.Vendor_Code) : true
              }
              onChange={this.props.handleCheckVendor}
              name={mat_id + " /// " + vendor.Vendor_Code}
              value={vendor.Vendor_Code}
              id={vendor.Vendor_Code}
              matId={mat_id}
            // key={mat_id}
            />
          </td>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <td>
            <Checkbox
              checked={this.props.vendorChecked.get(
                mat_id + " /// " + vendor.Vendor_Code
              )}
              value={vendor.Vendor_Code}
              id={vendor.Vendor_Code}
              name={mat_id + " /// " + vendor.Vendor_Code}
              matId={mat_id}
              onChange={this.props.handleCheckVendor}
            // key={mat_id}
            />
          </td>
        </Fragment>
      );
    }
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 9; i++) {
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
                // className="col-sm-3"
                type="text"
                placeholder="Search"
                onChange={this.props.handleFilterList}
                value={this.props.filter_list[header_model[i]]}
                name={header_model[i]}
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
    let MatIdcol = [];
    MatIdcol.push(this.props.DataMaterial.map((a) => a._id));
    // console.log('MatIdcol ', MatIdcol)
    return (
      <Table striped hover bordered responsive size="sm">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}><b>MM_Sub_Type</b></th>
            <th style={{ verticalAlign: "middle" }}><b>BB</b></th>
            <th style={{ verticalAlign: "middle" }}><b>BB_Sub</b></th>
            <th style={{ verticalAlign: "middle" }}><b>SoW_Description</b></th>
            <th style={{ verticalAlign: "middle" }}><b>UoM</b></th>
            <th style={{ verticalAlign: "middle" }}><b>Region</b></th>
            <th style={{ verticalAlign: "middle" }}><b>Unit_Price</b></th>
            <th style={{ verticalAlign: "middle" }}><b>MM Code</b></th>
            <th style={{ verticalAlign: "middle" }}><b>MM_Description</b></th>
            {this.props.Vendor_header.map((vendor) => (
              <Fragment key={vendor._id}>
                <th style={{ verticalAlign: "middle" }}>{vendor.Name}</th>
              </Fragment>
            ))}
            <th colSpan="2" rowSpan="2" style={{ verticalAlign: "middle" }}>Action</th>
          </tr>
          <tr>
            {this.loopSearchBar()}
            {this.props.Vendor_header.map((vendor, i) => (
              <Fragment key={vendor._id}>
                <th>
                  {
                    <Checkbox
                      checked={this.props.vendorCheckedPage.get(vendor.Vendor_Code)}
                      value={vendor.Vendor_Code}
                      id={vendor.Vendor_Code}
                      // name={MatIdcol[i]+" /// "+vendor.Vendor_Code}
                      name={vendor.Vendor_Code}
                      onChange={this.props.handleCheckVendorAll}
                    />
                  }
                </th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.DataMaterial.map((e) => (
            <tr>
              <td style={{ textAlign: "center" }}>{e.Material_Sub_Type}</td>
              <td style={{ textAlign: "center" }}>{e.BB}</td>
              <td style={{ textAlign: "center" }}>{e.BB_Sub}</td>
              <td style={{ textAlign: "center" }}>{e.SoW_Description_or_Site_Type}</td>
              <td style={{ textAlign: "center" }}>{e.UoM}</td>
              <td style={{ textAlign: "center" }}>{e.Region}</td>
              <td style={{ textAlign: "center" }}>{e.Unit_Price}</td>
              <td style={{ textAlign: "center" }}>{e.MM_Code}</td>
              <td style={{ textAlign: "center" }}>{e.MM_Description}</td>
              {this.props.Vendor_header.map((vendor, i) =>
                this.getVendorRow(e.Vendor_List, vendor, e._id)
              )}
              <td>
                <Button
                  size="sm"
                  color="secondary"
                  value={e._id}
                  onClick={this.props.toggleEdit}
                  title="Edit"
                >
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </Button>
              </td>
              <td>
                <Button
                  size="sm"
                  color="danger"
                  value={e._id}
                  name={e.MM_Code}
                  onClick={this.props.toggleDelete}
                  title="Delete"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

class MatNRO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      dropdownOpen: new Array(3).fill(false),
      PPForm: new Array(13).fill(""),
      vendorChecked: new Map(),
      vendorCheckedPage: new Map(),
      createModal: false,
      modal_loading: false,
      vendor_check: false,
      action_status: null,
      action_message: null,
      rowsXLS: [],
      vendor_list: [],
      material_list: [],
      material_list_all: [],
      totalData: 0,
      mmcode_data_check: [
        {
          id: "",
          Vendor_List: [],
        },
      ],
      vendor_data_check: [],
      modalPPForm: false,
      danger: false,
      selected_id: "",
      selected_name: "",
      prevPage: 0,
      activePage: 1,
      perPage: 10,
      modalEdit: false,
      filter_list: {},
    };
    this.togglePPForm = this.togglePPForm.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.togglecreateModal = this.togglecreateModal.bind(this);
    this.resettogglecreateModal = this.resettogglecreateModal.bind(this);
    this.saveUpdateNROVendorData = this.saveUpdateNROVendorData.bind(this);
  }

  componentDidMount() {
    this.getVendorList();
    this.getMaterialList();
    this.getMaterialListAll();
  }

  getVendorList() {
    getDatafromAPIMY("/vendor_data_non_page?sort=[('Name',-1)]").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        // const vendor_data = items.map((a) => a.Name);
        this.setState({ vendor_list: items });
      }
    });
  }

  getMaterialList() {
    let filter_array = [];
    filter_array.push(
      '"Material_Type":{"$regex" : "' + module_name + '", "$options" : "i"}'
    );
    this.state.filter_list["Material_Sub_Type"] !== null &&
      this.state.filter_list["Material_Sub_Type"] !== undefined &&
      filter_array.push(
        '"Material_Sub_Type":{"$regex" : "' +
        this.state.filter_list["Material_Sub_Type"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["BB"] !== null &&
      this.state.filter_list["BB"] !== undefined &&
      filter_array.push(
        '"BB":{"$regex" : "' +
        this.state.filter_list["BB"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["BB_Sub"] !== null &&
      this.state.filter_list["BB_Sub"] !== undefined &&
      filter_array.push(
        '"BB_Sub":{"$regex" : "' +
        this.state.filter_list["BB_Sub"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["SoW_Description_or_Site_Type"] !== null &&
      this.state.filter_list["SoW_Description_or_Site_Type"] !== undefined &&
      filter_array.push(
        '"SoW_Description_or_Site_Type":{"$regex" : "' +
        this.state.filter_list["SoW_Description_or_Site_Type"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["UoM"] !== null &&
      this.state.filter_list["UoM"] !== undefined &&
      filter_array.push(
        '"UoM":{"$regex" : "' +
        this.state.filter_list["UoM"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Region"] !== null &&
      this.state.filter_list["Region"] !== undefined &&
      filter_array.push(
        '"Region":{"$regex" : "' +
        this.state.filter_list["Region"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["Unit_Price"] !== null &&
      this.state.filter_list["Unit_Price"] !== undefined &&
      filter_array.push(
        '"Unit_Price":' + this.state.filter_list["Unit_Price"]
      );
    this.state.filter_list["MM_Code"] !== null &&
      this.state.filter_list["MM_Code"] !== undefined &&
      filter_array.push(
        '"MM_Code":{"$regex" : "' +
        this.state.filter_list["MM_Code"] +
        '", "$options" : "i"}'
      );
    this.state.filter_list["MM_Description"] !== null &&
      this.state.filter_list["MM_Description"] !== undefined &&
      filter_array.push(
        '"MM_Description":{"$regex" : "' +
        this.state.filter_list["MM_Description"] +
        '", "$options" : "i"}'
      );
    let whereAnd = "{" + filter_array.join(",") + "}";

    getDatafromAPINODE(
      "/mmCode/getMm?srt=_id:1&q=" +
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
        this.setState(
          {
            material_list: items,
            totalData: totalData
          },
          () => console.log(items.map((e) => e._id))
        );
      }
    });
  }

  getMaterialListAll() {
    getDatafromAPINODE(
      '/mmCode/getMm?srt=_id:1&q={"Material_Type": "' + module_name + '"}' + "&noPg=1",
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ material_list_all: items });
      }
    });
  }

  toggleLoading() {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  togglecreateModal() {
    this.setState({
      createModal: !this.state.createModal,
    });
  }

  resettogglecreateModal() {
    this.setState({
      rowsXLS: [],
    });
  }

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState({ rowsXLS: rest.rows }, () => console.log('isi excel material', this.state.rowsXLS));
        }
      });
    }
  };

  saveMatStockWHBulk = async () => {
    this.toggleLoading();
    this.togglecreateModal();
    const BulkXLSX = this.state.rowsXLS;
    const res = await postDatatoAPINODE(
      "/mmCode/createMmCode",
      {
        mm_data: BulkXLSX,
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
  };

  saveUpdateNROVendorData = async () => {
    this.toggleLoading();
    const dataVendor = this.state.vendor_list;
    const dataMaterial = this.state.material_list_all;
    const dataVendorMatChecked = this.state.vendorChecked;
    let dataVendorMatUpdate = [];
    for (const [key, value] of dataVendorMatChecked.entries()) {
      const dataKey = key.split(" /// ");
      const data_id_mat = dataKey[0];
      const data_id_vendor = dataKey[1];
      const matFind = dataMaterial.find((mat) => mat._id === data_id_mat);
      const venFind = dataVendor.find(
        (ven) => ven.Vendor_Code === data_id_vendor
      );
      let dataExistIdx = dataVendorMatUpdate.findIndex(
        (exi) => exi._id === matFind._id
      );
      if (dataExistIdx !== -1) {
        if (value === false) {
          dataVendorMatUpdate[dataExistIdx][
            "Vendor_List"
          ] = dataVendorMatUpdate[dataExistIdx].Vendor_List.filter(
            (ven) => ven.Vendor_Code !== data_id_vendor
          );
        } else {
          const dataVendorExist = dataVendorMatUpdate[
            dataExistIdx
          ].Vendor_List.find((ven) => ven.Vendor_Code === data_id_vendor);
          if (dataVendorExist === undefined) {
            dataVendorMatUpdate[dataExistIdx]["Vendor_List"].push({
              Vendor_Name: venFind.Name,
              Vendor_Code: venFind.Vendor_Code,
              _id: venFind._id,
            });
          }
        }
      } else {
        dataVendorMatUpdate.push({
          _id: data_id_mat,
          Vendor_List: matFind.Vendor_List,
        });
      }
      if (value === false) {
        dataVendorMatUpdate[dataVendorMatUpdate.length - 1][
          "Vendor_List"
        ] = dataVendorMatUpdate[
          dataVendorMatUpdate.length - 1
        ].Vendor_List.filter((ven) => ven.Vendor_Code !== data_id_vendor);
        console.log(
          dataVendorMatUpdate[
            dataVendorMatUpdate.length - 1
          ].Vendor_List.filter((ven) => ven.Vendor_Code !== data_id_vendor)
        );
      } else {
        const dataVendorExist = dataVendorMatUpdate[
          dataVendorMatUpdate.length - 1
        ].Vendor_List.find((ven) => ven.Vendor_Code === data_id_vendor);
        if (dataVendorExist === undefined) {
          dataVendorMatUpdate[dataVendorMatUpdate.length - 1][
            "Vendor_List"
          ].push({
            Vendor_Name: venFind.Name,
            Vendor_Code: venFind.Vendor_Code,
            _id: venFind._id,
          });
        }
      }
    }
    console.log("dataVendorMatUpdate", dataVendorMatUpdate);
    const res = await patchDatatoAPINODE(
      "/mmCode/updateMmCode",
      { data: dataVendorMatUpdate },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success", action_message: "Vendors have been updated!" });
      this.toggleLoading();
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

  handleCheckVendor = (event) => {
    const isChecked = event.target.checked;

    const Identifier = event.target.name;
    console.log(Identifier);

    this.setState(
      (prevState) => ({
        vendorChecked: prevState.vendorChecked.set(Identifier, isChecked),
      }),
      () => console.log(this.state.vendorChecked)
    );
  };

  handleCheckVendorAll = (event) => {
    const isChecked = event.target.checked;
    const identifierAll = event.target.name;
    let getMaterialId = this.state.material_list_all;
    if (isChecked) {
      getMaterialId = getMaterialId.map((e) => e._id);
      for (let i = 0; i < getMaterialId.length; i++) {
        const Identifier = getMaterialId[i] + " /// " + event.target.name;

        // console.log(Identifier)
        this.setState((prevState) => ({
          vendorChecked: prevState.vendorChecked.set(Identifier, isChecked),
        }));
      }
    } else {
      getMaterialId = getMaterialId.map((e) => e._id);
      for (let i = 0; i < getMaterialId.length; i++) {
        const Identifier = getMaterialId[i] + " /// " + event.target.name;

        // console.log(Identifier)
        this.setState((prevState) => ({
          vendorChecked: prevState.vendorChecked.set(Identifier, isChecked),
        }));
      }
    }

    console.log(this.state.vendorChecked);
    this.setState((prevState) => ({
      vendorCheckedPage: prevState.vendorCheckedPage.set(identifierAll, isChecked),
    }));
    // this.setState(
    //   (prevState) => ({ vendorCheckedPage: !prevState.vendorCheckedPage }),
    //   () => console.log(this.state.vendorCheckedPage)
    // );
  };

  saveNew = async () => {
    this.togglePPForm();
    this.toggleLoading();
    let dataForm = [
      [
        "Material_Type",
        "Material_Sub_Type",
        "MM_Code",
        "MM_Description",
        "UoM",
        "Unit_Price",
        "BB",
        "BB_Sub",
        "Region",
        "SLA",
        "Remarks",
      ],
      [
        module_name,
        this.state.PPForm[14],
        this.state.PPForm[1],
        this.state.PPForm[2],
        this.state.PPForm[3],
        this.state.PPForm[4],
        this.state.PPForm[5],
        this.state.PPForm[6],
        this.state.PPForm[7],
        this.state.PPForm[8],
        this.state.PPForm[9],
        this.state.PPForm[10],
        this.state.PPForm[11],
        this.state.PPForm[12],
        this.state.PPForm[13],
      ],
    ];
    const res = await postDatatoAPINODE(
      "/mmCode/createMmCode",
      {
        mm_data: dataForm,
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
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

  handleChangeForm = (e) => {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.PPForm;
    dataForm[parseInt(index)] = value;
    this.setState({ PPForm: dataForm }, () => console.log(this.state.PPForm));
  };

  togglePPForm() {
    this.setState((prevState) => ({
      modalPPForm: !prevState.modalPPForm,
    }));
  }

  downloadAll = async () => {
    let download_all = [];
    let getAll_nonpage = this.state.material_list_all;

    if (getAll_nonpage !== undefined) {
      download_all = getAll_nonpage;
    }

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const vendorName = this.state.vendor_list.map((a) => a.Name);
    let header = [
      "Material_Type",
      "Material_Sub_Type",
      "BB",
      "BB_Sub",
      "SoW_Description_or_Site_Type",
      "UoM",
      "Region",
      "Unit_Price",
      "MM_Code",
      "MM_Description",
      "Remarks",
    ];
    // header = header.concat(vendorName);

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
      ws.getCell(numToSSColumn(i) + "1").font = {
        bold: true
      };
    }

    for (let i = 0; i < download_all.length; i++) {
      let e = download_all[i];
      ws.addRow([
        e.Material_Type,
        e.Material_Sub_Type,
        e.BB,
        e.BB_Sub,
        e.SoW_Description_or_Site_Type,
        e.UoM,
        e.Region,
        e.Unit_Price,
        e.MM_Code,
        e.MM_Description,
        e.Remarks,
      ]);
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), "All " + module_name + " Materials.xlsx");
  };

  exportMatStatus = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    // const vendorName = this.state.vendor_list.map((a) => a.Name);
    let header = [
      "Material_Type",
      "Material_Sub_Type",
      "MM_Code",
      "MM_Description",
      "UoM",
      "Unit_Price",
      "BB",
      "BB_Sub",
      "Region",
      "SLA",
      "SoW_Description_or_Site_Type",
      "Remarks",
    ];
    // header = header.concat(vendorName);

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + "1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "A9A9A9" },
      };
      ws.getCell(numToSSColumn(i) + "1").font = {
        bold: true
      };
    }

    ws.addRow([module_name]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), "Material " + module_name + " Template.xlsx");
  };

  toggleDelete = (e) => {
    const modalDelete = this.state.danger;
    if (modalDelete === false) {
      const _id = e.currentTarget.value;
      const name = e.currentTarget.name;
      this.setState({
        danger: !this.state.danger,
        selected_id: _id,
        selected_name: name,
      });
    } else {
      this.setState({
        danger: false,
      });
    }
    this.setState((prevState) => ({
      modalDelete: !prevState.modalDelete,
    }));
  };

  DeleteData = async () => {
    const objData = this.state.selected_id;
    this.toggleLoading();
    this.toggleDelete();
    const DelData = deleteDataFromAPINODE2(
      "/mmCode/deleteMmCode",
      this.state.tokenUser,
      { data: [objData] }
    ).then((res) => {
      if (res.data !== undefined) {
        this.setState({ action_status: "success" });
        this.toggleLoading();
      } else {
        this.setState({ action_status: "failed" }, () => {
          this.toggleLoading();
        });
      }
    });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber }, () => {
      this.getMaterialList();
    });
  };

  toggleEdit = (e) => {
    const modalEdit = this.state.modalEdit;
    if (modalEdit === false) {
      const value = e.currentTarget.value;
      const aEdit = this.state.material_list.find((e) => e._id === value);
      let dataForm = this.state.PPForm;
      dataForm[1] = aEdit.MM_Code;
      dataForm[2] = aEdit.BB;
      dataForm[3] = aEdit.BB_Sub;
      dataForm[4] = aEdit.MM_Description;
      dataForm[5] = aEdit.UoM;
      dataForm[6] = aEdit.Unit_Price;
      dataForm[7] = aEdit.Currency;
      dataForm[8] = aEdit.Region;
      dataForm[9] = aEdit.Remarks_or_Acceptance;
      dataForm[10] = aEdit.SoW_Description_or_Site_Type;
      dataForm[11] = aEdit.Vendor;
      dataForm[12] = aEdit.Note;
      this.setState({ PPForm: dataForm, selected_id: value });
    } else {
      this.setState({ PPForm: new Array(11).fill("") });
    }
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };

  saveUpdate = async () => {
    this.toggleEdit();
    this.toggleLoading();
    let dataForm = {
      _id: this.state.selected_id,
      BB: this.state.PPForm[2],
      BB_Sub: this.state.PPForm[3],
      MM_Description: this.state.PPForm[4],
      UoM: this.state.PPForm[5],
      Unit_Price: this.state.PPForm[6],
      Currency: this.state.PPForm[7],
      Region: this.state.PPForm[8],
      Remarks_or_Acceptance: this.state.PPForm[9],
      SoW_Description_or_Site_Type: this.state.PPForm[10],
      Vendor: this.state.PPForm[11],
      Note: this.state.PPForm[12],
    };
    const res = await patchDatatoAPINODE(
      "/mmCode/updateMmCode",
      {
        data: [dataForm],
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      this.setState({ action_status: "success" });
      this.toggleLoading();
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

  sortVendor(vendorlist) {
    return vendorlist
      .sort((a, b) => (a.Name > b.Name ? 1 : -1))
      .filter((e) => e.Name !== "");
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

  onChangeDebounced(e) {
    this.getMaterialList();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                <span style={{ marginTop: "8px", position: "absolute" }}>
                  {" "}
                  List MM Data{" "}
                </span>
                <div
                  className="card-header-actions"
                  style={{ display: "inline-flex" }}
                >
                  <div>
                    <div>
                      <Dropdown
                        isOpen={this.state.dropdownOpen[2]}
                        toggle={() => {
                          this.toggle(2);
                        }}
                      >
                        <DropdownToggle block color="success" size="sm"><i className="fa fa-plus-square" aria-hidden="true" style={{ marginRight: 4 }}></i>New</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.togglecreateModal}>Bulk</DropdownItem>
                          <DropdownItem onClick={this.togglePPForm}>Form</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
                      <DropdownToggle block color="warning" size="sm"><i className="fa fa-download" aria-hidden="true" style={{ marginRight: 4 }}></i>Export</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        <DropdownItem onClick={this.exportMatStatus}>Material Template</DropdownItem>
                        <DropdownItem onClick={this.downloadAll}>Download All</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <Row></Row>
                <Row>
                  <Col>
                    <div className="divtable">
                      <TabelNRO
                        CheckVendor={this.state.vendor_check}
                        handleCheckVendor={this.handleCheckVendor}
                        Vendor_header={this.sortVendor(this.state.vendor_list)}
                        DataMaterial={this.state.material_list}
                        vendorChecked={this.state.vendorChecked}
                        vendorCheckedPage={this.state.vendorCheckedPage}
                        handleCheckVendorAll={this.handleCheckVendorAll}
                        toggleEdit={this.toggleEdit}
                        toggleDelete={this.toggleDelete}
                        handleFilterList={this.handleFilterList}
                        filter_list={this.state.filter_list}
                      />
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
              <CardFooter>
                <Button
                  color="primary"
                  size="sm"
                  onClick={this.saveUpdateNROVendorData}
                >
                  Update Vendor
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* Modal New Single PP */}
        <Modal
          isOpen={this.state.modalPPForm}
          toggle={this.togglePPForm}
          className="modal--form"
        >
          <ModalHeader>Form {module_name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label>MM_Sub_Type</Label>
                  <Input
                    type="select"
                    name="14"
                    placeholder=""
                    value={this.state.PPForm[14]}
                    onChange={this.handleChangeForm}
                  >
                    <option value="" disabled selected hidden>Select MM Sub Type</option>
                    <option value="Survey">Survey</option>
                    <option value="ITC">ITC</option>
                    <option value="Transport">Transport</option>
                    <option value="Special Transport">Special Transport</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>MM_Code</Label>
                  <Input
                    type="text"
                    name="1"
                    placeholder=""
                    value={this.state.PPForm[1]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>MM_Description</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder=""
                    value={this.state.PPForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>UoM</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.PPForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="text"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>BB</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>BB_Sub</Label>
                      <Input
                        type="text"
                        name="6"
                        placeholder=""
                        value={this.state.PPForm[6]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Region</Label>
                      <Input
                        type="text"
                        name="7"
                        placeholder=""
                        value={this.state.PPForm[7]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label>FTV_or_SSO_SLA_or_SSO_Lite_SLA_or_CBO</Label>
                      <Input
                        type="text"
                        name="8"
                        placeholder=""
                        value={this.state.PPForm[8]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Remarks_or_Acceptance</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SoW_Description_or_Site_Type</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ZERV_(18)</Label>
                  <Input
                    type="text"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ZEXT_(40)</Label>
                  <Input
                    type="text"
                    name="12"
                    placeholder=""
                    value={this.state.PPForm[12]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="13"
                    placeholder=""
                    value={this.state.PPForm[13]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNew}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PP*/}

        {/* Modal create New */}
        <ModalCreateNew
          isOpen={this.state.createModal}
          toggle={this.togglecreateModal}
          className={this.props.className}
          onClosed={this.resettogglecreateModal}
          title={"Create " + module_name}
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
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS.length === 0}
              onClick={this.saveMatStockWHBulk}
              style={{ height: "30px", width: "100px" }}
            >
              Save
            </Button>{" "}
          </ModalFooter>
        </ModalCreateNew>

        {/* Modal Loading */}
        <Loading
          isOpen={this.state.modal_loading}
          toggle={this.toggleLoading}
          className={"modal-sm modal--loading "}
        ></Loading>
        {/* end Modal Loading */}

        {/* Modal Update */}
        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleEdit}
          className="modal--form"
        >
          <ModalHeader>Form {module_name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label>BB</Label>
                  <Input
                    type="text"
                    name="2"
                    placeholder=""
                    value={this.state.PPForm[2]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>BB_Sub</Label>
                  <Input
                    type="text"
                    name="3"
                    placeholder=""
                    value={this.state.PPForm[3]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label>MM_Code</Label>
                      <Input
                        readOnly
                        type="text"
                        name="1"
                        placeholder=""
                        value={this.state.PPForm[1]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>MM_Description</Label>
                      <Input
                        type="text"
                        name="4"
                        placeholder=""
                        value={this.state.PPForm[4]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>UoM</Label>
                      <Input
                        type="text"
                        name="5"
                        placeholder=""
                        value={this.state.PPForm[5]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Label>Unit_Price</Label>
                      <Input
                        type="number"
                        name="6"
                        placeholder=""
                        value={this.state.PPForm[6]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="6">
                    <FormGroup>
                      <Label>Currency</Label>
                      <Input
                        type="text"
                        name="7"
                        placeholder=""
                        value={this.state.PPForm[7]}
                        onChange={this.handleChangeForm}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label>Region</Label>
                  <Input
                    type="text"
                    name="8"
                    placeholder=""
                    value={this.state.PPForm[8]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Remarks_or_Acceptance</Label>
                  <Input
                    type="text"
                    name="9"
                    placeholder=""
                    value={this.state.PPForm[9]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>SoW_Description_or_Site_Type</Label>
                  <Input
                    type="text"
                    name="10"
                    placeholder=""
                    value={this.state.PPForm[10]}
                    onChange={this.handleChangeForm}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vendor</Label>
                  <Input
                    type="select"
                    name="11"
                    placeholder=""
                    value={this.state.PPForm[11]}
                    onChange={this.handleChangeForm}
                  >
                    <option selected="true" disabled="disabled">
                      Select Vendor
                    </option>
                    {this.state.vendor_list.map((asp) => (
                      <option value={asp.Vendor_Code}>{asp.Name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="text"
                    name="12"
                    placeholder=""
                    value={this.state.PPForm[12]}
                    onChange={this.handleChangeForm}
                  />
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
        {/*  Modal New PP*/}

        {/* Modal confirmation delete */}
        <ModalDelete
          isOpen={this.state.danger}
          toggle={this.toggleDelete}
          className={"modal-danger " + this.props.className}
          title={"Delete " + this.state.selected_name}
          body={"Are you sure ?"}
        >
          <Button color="danger" onClick={this.DeleteData}>
            Delete
          </Button>
          <Button color="secondary" onClick={this.toggleDelete}>
            Cancel
          </Button>
        </ModalDelete>
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

export default connect(mapStateToProps)(MatNRO);
