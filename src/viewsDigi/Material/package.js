import React, { Component, Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Table,
} from "reactstrap";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import { getDatafromAPINODE, postDatatoAPINODE, patchDatatoAPINODE, getDatafromAPIMY } from "../../helper/asyncFunction";
import debounce from 'lodash.debounce';
import '../MYAssignment/LMRMY.css';
import SweetAlert from 'react-bootstrap-sweetalert';

const DefaultNotif = React.lazy(() =>
  import("../DefaultView/DefaultNotif")
);

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

class Package extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      package_list: [],
      package_list_all: [],
      check_material_package_list: {},
      create_package_parent: {},
      create_package_child: [],
      vendor_list: [],
      modal_check_material_package: false,
      modal_create_package: false,
      modal_material: false,
      modal_loading: false,
      action_status: null,
      action_message: null,
      filter_list: new Array(4).fill(""),
      filter_list_material: new Array(6).fill(""),
      material_list: [],
      current_material_select: null,
      vendorChecked: new Map(),
      vendorCheckedPage: new Map(),
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      prevPage_material: 0,
      activePage_material: 1,
      totalData_material: 0,
      perPage_material: 10,
      sweet_alert: null
    }

    this.onChangeDebounced = debounce(this.onChangeDebounced, 500);
    this.onChangeDebouncedMaterial = debounce(this.onChangeDebouncedMaterial, 500);
  }

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  }

  getPackageList() {
    const page = this.state.activePage;
    const maxPage = this.state.perPage;
    let filter_array = [];
    this.state.filter_list[0] !== "" && (filter_array.push('"Package_Id":{"$regex" : "' + this.state.filter_list[0] + '", "$options" : "i"}'));
    this.state.filter_list[1] !== "" && (filter_array.push('"Package_Name":{"$regex" : "' + this.state.filter_list[1] + '", "$options" : "i"}'));
    this.state.filter_list[2] !== "" && (filter_array.push('"Region":{"$regex" : "' + this.state.filter_list[2] + '", "$options" : "i"}'));
    this.state.filter_list[3] !== "" && (filter_array.push('"Material_Sub_Type":{"$regex" : "' + this.state.filter_list[3] + '", "$options" : "i"}'));
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

  getPackageListAll() {
    getDatafromAPINODE('/package/getPackage?noPg=1', this.state.tokenUser).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ package_list_all: items });
      }
    });
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

  addMaterial = () => {
    let material_list = this.state.create_package_child;
    material_list.push({
      MM_Code: '',
      Transport: 'no',
      duplicate: 'no',
      blank_material: 'no',
      zero_qty: 'no'
    });
    this.setState({ create_package_child: material_list });
  }

  handleChangeFormPackageParent = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    let create_package_parent = this.state.create_package_parent;
    if (value !== (null && undefined)) {
      value = value.toString();
    }
    create_package_parent[name.toString()] = value;
    this.setState({ create_package_parent: create_package_parent });
  }

  materialSelection = () => {
    let filter_array = [];
    this.state.filter_list_material[0] !== "" && (filter_array.push('"MM_Code":{"$regex" : "' + this.state.filter_list_material[0] + '", "$options" : "i"}'));
    this.state.filter_list_material[1] !== "" && (filter_array.push('"MM_Description":{"$regex" : "' + this.state.filter_list_material[1] + '", "$options" : "i"}'));
    this.state.filter_list_material[2] !== "" && (filter_array.push('"Unit_Price":' + this.state.filter_list_material[2]));
    filter_array.push('"Region":"' + this.state.create_package_parent.Region + '"');
    this.state.filter_list_material[4] !== "" && (filter_array.push('"Material_Type":{"$regex" : "' + this.state.filter_list_material[4] + '", "$options" : "i"}'));
    if (this.state.create_package_parent.Material_Sub_Type === 'ITC + NDO + Transport') {
      filter_array.push('"Material_Sub_Type":{"$in":["ITC","NDO","Transport"]}');
    } else {
      filter_array.push('"Material_Sub_Type":{"$in":["' + this.state.create_package_parent.Material_Sub_Type + '"]}');
    }
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE("/mmCode/getMm?q=" + whereAnd + "&lmt=" + this.state.perPage_material + "&pg=" + this.state.activePage_material, this.state.tokenUser).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        const totalData = res.data.totalResults;
        this.setState({ material_list: items, totalData_material: totalData });
      }
    });
  }

  toggleModalCheckMaterialPackage = () => {
    this.setState((prevState) => ({
      modal_check_material_package: !prevState.modal_check_material_package,
    }));
  }

  toggleModalCreatePackage = () => {
    this.setState((prevState) => ({
      modal_create_package: !prevState.modal_create_package,
    }));
  }

  toggleModalMaterial = (number_child_form) => {
    if (number_child_form !== undefined && isNaN(number_child_form) === false) {
      this.setState({ current_material_select: number_child_form });
    } else {
      this.setState({ current_material_select: null });
    }
    this.materialSelection();
    this.setState((prevState) => ({
      modal_material: !prevState.modal_material,
    }));
  }

  handlePageChangeMaterial = (pageNumber) => {
    this.setState({ activePage_material: pageNumber }, () => {
      this.materialSelection();
    });
  }

  handleFilterListMaterial = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list_material;
    dataFilter[parseInt(index)] = value;
    this.setState({ filter_list_material: dataFilter, activePage: 1 }, () => {
      this.onChangeDebouncedMaterial(e);
    })
  }

  handleSelectMaterial = (e) => {
    const value = e.target.value;
    const data_material = this.state.material_list.find((e) => e.MM_Code === value);
    let create_package_child = this.state.create_package_child;
    create_package_child[parseInt(this.state.current_material_select)]["MM_Code_Id"] = data_material._id;
    create_package_child[parseInt(this.state.current_material_select)]["MM_Code"] = data_material.MM_Code;
    create_package_child[parseInt(this.state.current_material_select)]["Description"] = data_material.MM_Description;
    create_package_child[parseInt(this.state.current_material_select)]["Unit_Price"] = data_material.Unit_Price;
    create_package_child[parseInt(this.state.current_material_select)]["Qty"] = 0;
    this.setState({ create_package_child: create_package_child });
    this.toggleModalMaterial();
  }

  handleChangeFormPackageChild = (e) => {
    let create_package_child = this.state.create_package_child;
    let idxField = e.target.name.split(" /// ");
    let value = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
    let idx = idxField[0];
    let field = idxField[1];

    create_package_child[parseInt(idx)][field] = value;

    if (field === 'Transport') {
      let checked = e.target.checked;
      if (checked === true) {
        create_package_child[parseInt(idx)]["MM_Code_Id"] = null;
        create_package_child[parseInt(idx)]["MM_Code"] = "Placeholder for transport";
        create_package_child[parseInt(idx)]["Description"] = "Placeholder for transport";
        create_package_child[parseInt(idx)]["Unit_Price"] = 0;
        create_package_child[parseInt(idx)]["Qty"] = 0;
        create_package_child[parseInt(idx)]["Transport"] = "yes";
      } else {
        create_package_child[parseInt(idx)]["MM_Code_Id"] = "";
        create_package_child[parseInt(idx)]["MM_Code"] = "";
        create_package_child[parseInt(idx)]["Description"] = "";
        create_package_child[parseInt(idx)]["Unit_Price"] = 0;
        create_package_child[parseInt(idx)]["Qty"] = 0;
        create_package_child[parseInt(idx)]["Transport"] = "no";
      }
    }

    this.setState({ create_package_child: create_package_child }, () =>
      console.log(this.state.create_package_child)
    );
  }

  createPackage = async () => {
    let create_package_child = this.state.create_package_child;

    for (let i = 0; i < create_package_child.length; i++) {
      create_package_child[i].duplicate = 'no';
      create_package_child[i].blank_material = 'no';
      create_package_child[i].zero_qty = 'no';
    }

    let check_duplicate = false;
    for (let i = 0; i < create_package_child.length; i++) {
      for (let j = i + 1; j < create_package_child.length; j++) {
        if (create_package_child[i].MM_Code === create_package_child[j].MM_Code) {
          check_duplicate = true;
          create_package_child[i].duplicate = 'yes';
          create_package_child[j].duplicate = 'yes';
        }
      }
    }

    for (let i = 0; i < create_package_child.length; i++) {
      if (create_package_child[i].MM_Code === '') {
        create_package_child[i].blank_material = 'yes';
      }
    }

    for (let i = 0; i < create_package_child.length; i++) {
      if (create_package_child[i].Qty === 0 && create_package_child[i].Transport !== 'yes') {
        create_package_child[i].zero_qty = 'yes';
      }
    }

    if (check_duplicate) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Material duplication found!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < create_package_child.length; i++) {
        create_package_child[i].blank_material = 'no';
        create_package_child[i].zero_qty = 'no';
      }
      this.setState({ create_package_child: create_package_child }, () =>
        console.log(this.state.create_package_child)
      );
    } else if (create_package_child.some(e => e.blank_material === 'yes')) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please select a material first!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < create_package_child.length; i++) {
        create_package_child[i].duplicate = 'no';
        create_package_child[i].zero_qty = 'no';
      }
      this.setState({ create_package_child: create_package_child }, () =>
        console.log(this.state.create_package_child)
      );
    } else if (create_package_child.some(e => e.zero_qty === 'yes')) {
      const getAlert = () => (
        <SweetAlert
          danger
          title="Error!"
          onConfirm={() => this.hideAlert()}
        >
          Please input the qty to be more than 0!
        </SweetAlert>
      );

      this.setState({
        sweet_alert: getAlert()
      });

      for (let i = 0; i < create_package_child.length; i++) {
        create_package_child[i].duplicate = 'no';
        create_package_child[i].blank_material = 'no';
      }
      this.setState({ create_package_child: create_package_child }, () =>
        console.log(this.state.create_package_child)
      );
    } else {
      this.toggleLoading();
      for (let i = 0; i < create_package_child.length; i++) {
        create_package_child[i].duplicate = 'no';
        create_package_child[i].blank_material = 'no';
        create_package_child[i].zero_qty = 'no';
      }
      this.setState({ create_package_child: create_package_child }, () =>
        console.log(this.state.create_package_child)
      );

      const dataPackageChild = [];
      for (let i = 0; i < create_package_child.length; i++) {
        let dataChild = {
          MM_Code_Id: create_package_child[i].MM_Code_Id,
          MM_Code: create_package_child[i].MM_Code,
          Qty: create_package_child[i].Qty,
          Transport: create_package_child[i].Transport
        }
        dataPackageChild.push(dataChild);
      }

      const dataPackage = {
        Package_Name: this.state.create_package_parent.Package_Name,
        Region: this.state.create_package_parent.Region,
        Material_Sub_Type: this.state.create_package_parent.Material_Sub_Type,
        MM_Data: dataPackageChild
      }

      console.log('dataPackage', dataPackage)

      const response = await postDatatoAPINODE("/package/createPackage", { package_data: [dataPackage] }, this.state.tokenUser);
      if (response.data !== undefined && response.status >= 200 && response.status <= 300) {
        this.toggleLoading();
        this.setState({ action_status: "success", action_message: "Package has been created, please check in Package List!" });
      } else {
        if (response.response !== undefined && response.response.data !== undefined && response.response.data.error !== undefined) {
          if (response.response.data.error.message !== undefined) {
            this.toggleLoading();
            this.setState({
              action_status: "failed",
              action_message: response.response.data.error.message,
            });
          } else {
            this.toggleLoading();
            this.setState({
              action_status: "failed",
              action_message: response.response.data.error,
            });
          }
        } else {
          this.toggleLoading();
          this.setState({ action_status: "failed" });
        }
      }
    }
  }

  hideAlert() {
    this.setState({
      sweet_alert: null
    });
  }

  handleDeletePackageChild(index) {
    let create_package_child = this.state.create_package_child;
    create_package_child.splice(index, 1);
    this.setState({ create_package_child: create_package_child }, () => console.log(this.state.create_package_child));
  }

  onChangeDebouncedMaterial(e) {
    this.materialSelection();
  }

  handleFilterList = (e) => {
    const index = e.target.name;
    let value = e.target.value;
    if (value !== "" && value.length === 0) {
      value = "";
    }
    let dataFilter = this.state.filter_list;
    dataFilter[parseInt(index)] = value;
    this.setState({ filter_list: dataFilter, activePage: 1 }, () => {
      this.onChangeDebounced(e);
    })
  }

  getVendorList() {
    getDatafromAPIMY("/vendor_data_non_page?sort=[('Name',1)]").then((res) => {
      if (res.data !== undefined) {
        const items = res.data._items;
        this.setState({ vendor_list: items });
      }
    });
  }

  getVendorRow(material_vendor_data, vendor, mat_id) {
    const Matdata = material_vendor_data.find(
      (e) => e.Vendor_Code === vendor.Vendor_Code
    );
    if (Matdata !== undefined) {
      return (
        <Fragment>
          <td>
            <Checkbox
              checked={this.state.vendorChecked.has(mat_id + " /// " + vendor.Vendor_Code) ? this.state.vendorChecked.get(mat_id + " /// " + vendor.Vendor_Code) : true}
              onChange={this.handleCheckVendor}
              name={mat_id + " /// " + vendor.Vendor_Code}
              value={vendor.Vendor_Code}
              id={vendor.Vendor_Code}
              matId={mat_id}
            />
          </td>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <td>
            <Checkbox
              checked={this.state.vendorChecked.get(
                mat_id + " /// " + vendor.Vendor_Code
              )}
              value={vendor.Vendor_Code}
              id={vendor.Vendor_Code}
              name={mat_id + " /// " + vendor.Vendor_Code}
              matId={mat_id}
              onChange={this.handleCheckVendor}
            />
          </td>
        </Fragment>
      );
    }
  }

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
    let package_list_all = this.state.package_list_all;
    if (isChecked) {
      package_list_all = package_list_all.map((e) => e._id);
      for (let i = 0; i < package_list_all.length; i++) {
        const Identifier = package_list_all[i] + " /// " + event.target.name;
        // console.log(Identifier)
        this.setState((prevState) => ({
          vendorChecked: prevState.vendorChecked.set(Identifier, isChecked),
        }));
      }
    } else {
      package_list_all = package_list_all.map((e) => e._id);
      for (let i = 0; i < package_list_all.length; i++) {
        const Identifier = package_list_all[i] + " /// " + event.target.name;
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
  };

  updateVendorPackage = async () => {
    this.toggleLoading();
    const dataVendor = this.state.vendor_list;
    const dataPackage = this.state.package_list_all;
    const vendorChecked = this.state.vendorChecked;
    let dataVendorPackageUpdate = [];
    for (const [key, value] of vendorChecked.entries()) {
      const dataKey = key.split(" /// ");
      const data_id_mat = dataKey[0];
      const data_id_vendor = dataKey[1];
      const matFind = dataPackage.find((mat) => mat._id === data_id_mat);
      const venFind = dataVendor.find(
        (ven) => ven.Vendor_Code === data_id_vendor
      );
      let dataExistIdx = dataVendorPackageUpdate.findIndex(
        (exi) => exi._id === matFind._id
      );
      if (dataExistIdx !== -1) {
        if (value === false) {
          dataVendorPackageUpdate[dataExistIdx][
            "Vendor_List"
          ] = dataVendorPackageUpdate[dataExistIdx].Vendor_List.filter(
            (ven) => ven.Vendor_Code !== data_id_vendor
          );
        } else {
          const dataVendorExist = dataVendorPackageUpdate[
            dataExistIdx
          ].Vendor_List.find((ven) => ven.Vendor_Code === data_id_vendor);
          if (dataVendorExist === undefined) {
            dataVendorPackageUpdate[dataExistIdx]["Vendor_List"].push({
              Vendor_Name: venFind.Name,
              Vendor_Code: venFind.Vendor_Code,
              _id: venFind._id,
            });
          }
        }
      } else {
        dataVendorPackageUpdate.push({
          _id: data_id_mat,
          Vendor_List: matFind.Vendor_List,
        });
      }
      if (value === false) {
        dataVendorPackageUpdate[dataVendorPackageUpdate.length - 1][
          "Vendor_List"
        ] = dataVendorPackageUpdate[
          dataVendorPackageUpdate.length - 1
        ].Vendor_List.filter((ven) => ven.Vendor_Code !== data_id_vendor);
        console.log(
          dataVendorPackageUpdate[
            dataVendorPackageUpdate.length - 1
          ].Vendor_List.filter((ven) => ven.Vendor_Code !== data_id_vendor)
        );
      } else {
        const dataVendorExist = dataVendorPackageUpdate[
          dataVendorPackageUpdate.length - 1
        ].Vendor_List.find((ven) => ven.Vendor_Code === data_id_vendor);
        if (dataVendorExist === undefined) {
          dataVendorPackageUpdate[dataVendorPackageUpdate.length - 1][
            "Vendor_List"
          ].push({
            Vendor_Name: venFind.Name,
            Vendor_Code: venFind.Vendor_Code,
            _id: venFind._id,
          });
        }
      }
    }
    console.log("dataVendorPackageUpdate", dataVendorPackageUpdate);
    const res = await patchDatatoAPINODE("/package/updatePackage", { package_data: dataVendorPackageUpdate }, this.state.tokenUser);
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

  onChangeDebounced(e) {
    this.getPackageList();
  }

  componentDidMount() {
    this.getPackageList();
    this.getPackageListAll();
    this.getVendorList();
    document.title = "Package List | BAM";
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 4; i++) {
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

  loopSearchBarMaterial = () => {
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
                onChange={this.handleFilterListMaterial}
                value={this.state.filter_list_material[i]}
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

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
          redirect={this.state.redirect}
        />
        <Row>
          {this.state.sweet_alert}
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <span style={{ lineHeight: "2" }}>
                  <i className="fa fa-align-justify" style={{ marginRight: "8px" }}></i>Package List
                </span>
                <Button
                  color="success"
                  style={{ float: "right", marginLeft: "8px" }}
                  size="sm"
                  onClick={this.toggleModalCreatePackage}
                >
                  <i className="fa fa-plus-square" style={{ marginRight: "8px" }}></i>Create Package
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped bordered size="sm">
                  <thead className="text-center">
                    <tr>
                      <th style={{ minWidth: "150px", verticalAlign: "middle" }} rowSpan="2">Action</th>
                      <th style={{ minWidth: "150px", verticalAlign: "middle" }}>Package ID</th>
                      <th style={{ minWidth: "150px", verticalAlign: "middle" }}>Package Name</th>
                      <th style={{ minWidth: "150px", verticalAlign: "middle" }}>Region</th>
                      <th style={{ minWidth: "150px", verticalAlign: "middle" }}>MM Type</th>
                      {this.state.vendor_list.map((vendor) => (
                        <Fragment key={vendor._id}>
                          <th style={{ verticalAlign: "middle" }}>{vendor.Name}</th>
                        </Fragment>
                      ))}
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
                      {this.state.vendor_list.map((vendor, i) => (
                        <Fragment key={vendor._id}>
                          <th>
                            {
                              <Checkbox
                                checked={this.state.vendorCheckedPage.get(vendor.Vendor_Code)}
                                value={vendor.Vendor_Code}
                                id={vendor.Vendor_Code}
                                name={vendor.Vendor_Code}
                                onChange={this.handleCheckVendorAll}
                              />
                            }
                          </th>
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {this.state.package_list !== undefined &&
                      this.state.package_list.map((e) => (
                        <tr>
                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              value={e.Package_Id}
                              onClick={this.handleCheckMaterialPackage}
                            >
                              <i className="fa fa-cubes" style={{ marginRight: "8px" }}></i>Check Material
                          </Button>
                          </td>
                          <td>{e.Package_Id}</td>
                          <td>{e.Package_Name}</td>
                          <td>{e.Region}</td>
                          <td>{e.Material_Sub_Type}</td>
                          {this.state.vendor_list.map((vendor, i) =>
                            this.getVendorRow(e.Vendor_List, vendor, e._id)
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>Showing {this.state.package_list.length} entries</small>
                </div>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={this.state.perPage}
                  totalItemsCount={this.state.package_list.length}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  size="sm"
                  onClick={this.updateVendorPackage}
                >
                  Update Vendor
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

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

        {/* Modal Create Package */}
        <Modal
          isOpen={this.state.modal_create_package}
          toggle={this.toggleModalCreatePackage}
          className={"modal-xl"}
        >
          <ModalBody>
            <div>
              <strong><h6>Input Package Details</h6></strong>
              <hr className="upload-line--lmr"></hr>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label>Package Name</Label>
                    <Input
                      type="text"
                      name="Package_Name"
                      placeholder="Input Package Name"
                      onChange={this.handleChangeFormPackageParent}
                      value={this.state.create_package_parent.Package_Name}
                      disabled={this.state.create_package_child.length > 0}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Region</Label>
                    <Input
                      type="select"
                      name="Region"
                      onChange={this.handleChangeFormPackageParent}
                      value={this.state.create_package_parent.Region}
                      disabled={this.state.create_package_child.length > 0}
                    >
                      <option value="" disabled selected hidden>Select Region</option>
                      <option value="KV">KV</option>
                      <option value="OKV">OKV</option>
                      <option value="ER">ER</option>
                      <option value="EM">EM</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>MM Type</Label>
                    <Input
                      type="select"
                      name="Material_Sub_Type"
                      onChange={this.handleChangeFormPackageParent}
                      value={this.state.create_package_parent.Material_Sub_Type}
                      disabled={this.state.create_package_child.length > 0}
                    >
                      <option value="" disabled selected hidden>Select MM Type</option>
                      <option value="ITC + NDO + Transport">ITC + NDO + Transport</option>
                      <option value="Survey">Survey</option>
                      <option value="Integration">Integration</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <strong><h6 style={{ marginTop: "16px" }}>Choose Materials</h6></strong>
              <hr className="upload-line--lmr"></hr>
              {this.state.create_package_child.map((mat, i) => (
                <Row>
                  <Col md={1}>
                    <FormGroup>
                      <Label>Transport</Label><br />
                      <Input
                        type="checkbox"
                        name={i + " /// Transport"}
                        onChange={this.handleChangeFormPackageChild}
                        className="checkmark-dash"
                        style={{ left: "40%" }}
                        checked={mat.Transport === 'yes'}
                        disabled={this.state.create_package_child.find(x => x.Transport === 'yes')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>MM Code</Label>
                      <Input
                        type="text"
                        name={i + " /// MM_Code"}
                        id={i + " /// MM_Code"}
                        value={mat.MM_Code}
                        onClick={() => this.toggleModalMaterial(i)}
                        disabled={mat.Transport === 'yes'}
                        style={mat.duplicate === 'yes' || mat.blank_material === 'yes' ? { border: "2px solid red" } : {}}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        type="text"
                        name={i + " /// Description"}
                        id={i + " /// Description"}
                        value={mat.Description}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name={i + " /// Unit_Price"}
                        id={i + " /// Unit_Price"}
                        value={mat.Unit_Price}
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
                        name={i + " /// Qty"}
                        id={i + " /// Qty"}
                        value={mat.Qty}
                        onChange={this.handleChangeFormPackageChild}
                        disabled={mat.Transport === 'yes'}
                        style={mat.zero_qty === 'yes' ? { border: "2px solid red" } : {}}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="auto">
                    <Button color="danger" size="sm" onClick={e => this.handleDeletePackageChild(i)} style={{ marginTop: '30px' }}><span className="fa fa-times"></span></Button>
                  </Col>
                </Row>
              ))}
              <Button color="primary" size="sm" onClick={this.addMaterial} disabled={this.state.create_package_parent.Package_Name === undefined || this.state.create_package_parent.Package_Name === "" || this.state.create_package_parent.Region === undefined || this.state.create_package_parent.Region === ""}>
                <i className="fa fa-plus">&nbsp;</i> Add Material
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createPackage}>
              Create Package
            </Button>
            <Button color="secondary" onClick={this.toggleModalCreatePackage}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Create Package */}

        {/* Modal Material List */}
        <Modal
          isOpen={this.state.modal_material}
          toggle={this.toggleModalMaterial}
          className={"modal-lg"}
        >
          <ModalBody
            style={{
              "max-height": "calc(100vh - 210px)",
              "overflow-y": "auto",
            }}
          >
            <div class="table-container">
              <Table responsive striped bordered size="sm">
                <thead>
                  <tr>
                    <th style={{ minWidth: "100px", verticalAlign: "middle" }} rowSpan="2">Action</th>
                    <th>MM Code</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Region</th>
                    <th>Material Type</th>
                    <th>Material Sub Type</th>
                  </tr>
                  <tr>
                    {this.loopSearchBarMaterial()}
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
                            onClick={this.handleSelectMaterial}
                          >
                            <i className="fa fa-check-square" style={{ marginRight: 4 }}></i>Select
                          </Button>
                        </td>
                        <td>{e.MM_Code}</td>
                        <td>{e.MM_Description}</td>
                        <td>{e.Unit_Price}</td>
                        <td>{e.Region}</td>
                        <td>{e.Material_Type}</td>
                        <td>{e.Material_Sub_Type}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              activePage={this.state.activePage_material}
              itemsCountPerPage={this.state.perPage_material}
              totalItemsCount={this.state.totalData_material}
              pageRangeDisplayed={5}
              onChange={this.handlePageChangeMaterial}
              itemClass="page-item"
              linkClass="page-link"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModalMaterial}>Close</Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Material List */}

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

export default connect(mapStateToProps)(Package);