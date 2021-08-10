import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Collapse } from 'reactstrap';
import { Col, FormGroup, Label, Row, Table, Input } from 'reactstrap';
import { ExcelRenderer } from 'react-excel-renderer';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import Pagination from "react-js-pagination";
import debounce from 'lodash.debounce';
import './product.css';
import Select from 'react-select';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
import { connect } from 'react-redux';

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, value }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={value} className="checkmark-dash" />
);

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';

class AddMatPackageUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      pp_all: [],
      project_filter: undefined,
      filter_name: "",
      perPage: 10,
      prevPage: 1,
      activePage: 1,
      total_dataParent: 0,
      rowsXLS: [],
      action_status: null,
      action_message: null,
      product_package: [],
      product_package_all: [],
      dataParent: [],
      modalCheckout: false,
      packageSelected: [],
      packageChecked: new Map(),
      modal_loading: false,
      dropdownOpen: new Array(6).fill(false),
      modalPPForm: false,
      PPForm: new Array(9).fill(null),
      collapse: false,
      modalPPFedit: false,
      packageChecked_all: false,
      packageChecked_page: false,
      modalAdditionalForm : false,
      additional_material : [],
      search: null,

    }
    this.togglePPForm = this.togglePPForm.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.handleChangeChecklist = this.handleChangeChecklist.bind(this);
    this.handleChangeChecklistAll = this.handleChangeChecklistAll.bind(this);
    this.handleChangeChecklistPage = this.handleChangeChecklistPage.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.changeFilterName = debounce(this.changeFilterName, 1000);
    this.toggle = this.toggle.bind(this);
    this.toggleAddNew = this.toggleAddNew.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.saveNewPP = this.saveNewPP.bind(this);
    this.togglePPedit = this.togglePPedit.bind(this);
    this.saveUpdatePP = this.saveUpdatePP.bind(this);
    this.exportFormatBundleMaterial = this.exportFormatBundleMaterial.bind(this);
    this.toggleAdditionalForm = this.toggleAdditionalForm.bind(this);
    this.AdditionalForm = this.AdditionalForm.bind(this);
    this.onChangeMaterialAdditional = this.onChangeMaterialAdditional.bind(this);
    this.addMaterialAdditional = this.addMaterialAdditional.bind(this);
    this.deleteMaterialAdditional = this.deleteMaterialAdditional.bind(this);
    this.saveAdditional = this.saveAdditional.bind(this);

  }

  toggleAdditionalForm() {
    this.setState(prevState => ({
      modalAdditionalForm: !prevState.modalAdditionalForm
    }));
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  toggleAddNew() {
    this.setState({ collapse: !this.state.collapse });
  }

  onEntering() {
    this.setState({ status: 'Opening...' });
  }

  onEntered() {
    this.setState({ status: 'Opened' });
  }

  onExiting() {
    this.setState({ status: 'Closing...' });
  }

  onExited() {
    this.setState({ status: 'Closed' });
  }

  async getDatafromAPINODE(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  async postDatatoAPINODE(url, data) {
    try {
      let respond = await axios.post(API_URL_NODE + url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        // console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      // console.log("respond Post Data err", err);
      return respond;
    }
  }

  async patchDatatoAPINODE(url, data) {
    try {
      let respond = await axios.patch(API_URL_NODE + url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
      return respond;
    }
  }

  changeFilterName(value) {
    this.getPackageDataAPI();
  }

  SearchFilter = (e) => {
    let keyword = e.target.value;
    this.setState({ search: keyword });
  };

  handleChangeFilter = (e) => {
    let value = e.target.value;
    if (value.length === 0) {
      value = "";
    }
    this.setState({ filter_name: value }, () => {
      this.changeFilterName(value);
    });
  }

  handleChangeProjectFilter = (e) => {
    const value = e.target.value;
    this.setState({ project_filter: value });
    this.getPackageDataAPI(this.state.filter_name, value);
  }

  getPackageDataAPI() {
    let filter = '{"$regex" : "", "$options" : "i"}';
    if (this.state.filter_name !== "") {
      filter = '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    }
    // let filter = this.state.filter_name === ""  ? '{"$exists" : 1}' : '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    let whereOr = '{"$or" : [{"product_name": ' + filter + '}, {"pp_id": "AdditionalMaterial"}, {"pp_cust_number": ' + filter + '}, {"physical_group": ' + filter + '}]}';
    // let whereOr = '{"$or" : [{"product_name": ' + filter + '}]}';
    this.getDatafromAPINODE('/productpackage?q={"pp_id": "AdditionalMaterial"}&lmt=' + this.state.perPage + '&pg=' + this.state.activePage)
    // this.getDatafromAPINODE('/productpackage?q=' + whereOr + '&lmt=' + this.state.perPage + '&pg=' + this.state.activePage)
      .then(res => {
        if (res.data !== undefined) {
          this.setState({ product_package: res.data.data, prevPage: this.state.activePage, total_dataParent: res.data.totalResults });
        } else {
          this.setState({ product_package: [], total_dataParent: 0, prevPage: this.state.activePage });
        }
      })
  }

  getPackageDataAPI_all() {
    this.getDatafromAPINODE('/productpackage?q={"pp_id": "AdditionalMaterial"}&noPg=1')
      .then(res => {
        if (res.data !== undefined) {
          this.setState({ product_package_all: res.data.data });
        } else {
          this.setState({ product_package_all: [] });
        }
      })
  }

  isSameValue(element, value) {
    //function for FindIndex
    return this.checkValuetoString(element).toLowerCase() === this.checkValuetoString(value).toLowerCase();
  }

  getIndex(data, value) {
    //get index of value in Array
    return data.findIndex(e => this.isSameValue(e, value));
  }

  checkValue(props) {
    // if value undefined return null
    if (typeof props === 'undefined') {
      return null;
    } else {
      return props;
    }
  }

  checkValuetoString(props) {
    // if value undefined return ""
    if (typeof props === 'undefined' || props === null) {
      return "";
    } else {
      return props;
    }
  }

  checkValueReturn(value1, value2) {
    // if value undefined return Value2
    if (typeof value1 !== 'undefined' && value1 !== null) {
      return value1;
    } else {
      return value2;
    }
  }

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState({
            rowsXLS: rest.rows
          });
        }
      });
    }
  }

  checkFormatPackage(dataXLSHeader) {
    // cek the import data is for Product Package or Not
    if (this.getIndex(dataXLSHeader, 'PP / Material') !== -1 && this.getIndex(dataXLSHeader, 'bundle_id') !== -1 && this.getIndex(dataXLSHeader, 'bundle_name') !== -1 && this.getIndex(dataXLSHeader, 'product_type') !== -1 && this.getIndex(dataXLSHeader, 'physical_group') !== -1 & this.getIndex(dataXLSHeader, 'uom') !== -1 && this.getIndex(dataXLSHeader, 'pp_group_number') !== -1) {
      return true;
    } else {
      return false;
    }
  }

  checkFormatMaterial(dataXLSHeader) {
    // cek the import data is for Material or Not
    if (this.getIndex(dataXLSHeader, 'PP / Material') !== -1 && this.getIndex(dataXLSHeader, 'bundle_id') !== -1 && this.getIndex(dataXLSHeader, 'material_id') !== -1 && (this.getIndex(dataXLSHeader, 'material_name') !== -1 || this.getIndex(dataXLSHeader, 'quantity') !== -1 || this.getIndex(dataXLSHeader, 'uom') !== -1)) {
      return true;
    } else {
      return false;
    }
  }

  saveProductPackage = async () => {
    this.toggleLoading();
    const productPackageXLS = this.state.rowsXLS;
    const isPackage = this.checkFormatPackage(productPackageXLS[0]);
    const isMaterial = this.checkFormatMaterial(productPackageXLS[0]);
    if (isPackage === true) {
      const ppData = await this.getPackageFormat(productPackageXLS);
      const postPackage = await this.postDatatoAPINODE('/productpackage/manyProductPackage', { "ppData": ppData })
        .then(res => {
          if (res.data !== undefined) {
            this.setState({ action_status: 'success' });
            this.toggleLoading();
          } else {
            if (res.response !== undefined) {
              if (res.response.data !== undefined) {
                if (res.response.data.error !== undefined) {
                  if (res.response.data.error.message !== undefined) {
                    this.setState({ action_status: 'failed', action_message: res.response.data.error.message }, () => {
                      this.toggleLoading();
                    });
                  } else {
                    this.setState({ action_status: 'failed', action_message: res.response.data.error }, () => {
                      this.toggleLoading();
                    });
                  }
                } else {
                  this.setState({ action_status: 'failed' }, () => {
                    this.toggleLoading();
                  });
                }
              } else {
                this.setState({ action_status: 'failed' }, () => {
                  this.toggleLoading();
                });
              }
            } else {
              this.setState({ action_status: 'failed' }, () => {
                this.toggleLoading();
              });
            }
          }
        })
    } else if (isMaterial === true) {
      let dataMat = await this.getMaterialFormat(productPackageXLS);
      const postMaterial = await this.postDatatoAPINODE('/materialcatalogue/manyMaterialCatalogue', { "mcData": dataMat });
      if (postMaterial.data !== undefined) {
        this.setState({ action_status: 'success' });
        this.toggleLoading();
      } else {
        if (postMaterial.response !== undefined) {
          if (postMaterial.response.data !== undefined) {
            if (postMaterial.response.data.error !== undefined) {
              if (postMaterial.response.data.error.message !== undefined) {
                this.setState({ action_status: 'failed', action_message: postMaterial.response.data.error.message }, () => {
                  this.toggleLoading();
                });
              } else {
                this.setState({ action_status: 'failed', action_message: postMaterial.response.data.error }, () => {
                  this.toggleLoading();
                });
              }
            } else {
              this.setState({ action_status: 'failed' }, () => {
                this.toggleLoading();
              });
            }
          } else {
            this.setState({ action_status: 'failed' }, () => {
              this.toggleLoading();
            });
          }
        } else {
          this.setState({ action_status: 'failed' }, () => {
            this.toggleLoading();
          });
        }
      }
    } else {
      this.setState({ action_status: 'failed', action_message: 'Please check your format' }, () => {
        this.toggleLoading();
      });
    }
  }

  saveProductPackageOneShot = async () => {
    this.toggleLoading();
    let productPackageXLS = this.state.rowsXLS;
    let isPackage = true;
    let headerRow = [];
    for (let i = 0; i < productPackageXLS[0].length; i++) {
      let value = productPackageXLS[0][i];
      value = value.replace("bundle_id", "pp_id");
      value = value.replace("bundle_name", "product_name");
      value = value.replace("bundle_type", "product_type");
      value = value.replace("bundle_unit", "package_unit");
      value = value.replace("bundle_group", "pp_group");
      headerRow.push(value);
    }
    productPackageXLS[0] = headerRow;
    if (isPackage === true) {
      const postPackage = await this.postDatatoAPINODE('/productpackage/packageWithMaterial', { "data": productPackageXLS })
        .then(res => {
          if (res.data !== undefined) {
            this.setState({ action_status: 'success' });
            this.toggleLoading();
          } else {
            if (res.response !== undefined) {
              if (res.response.data !== undefined) {
                if (res.response.data.error !== undefined) {
                  if (res.response.data.error.message !== undefined) {
                    this.setState({ action_status: 'failed', action_message: res.response.data.error.message }, () => {
                      this.toggleLoading();
                    });
                  } else {
                    this.setState({ action_status: 'failed', action_message: res.response.data.error }, () => {
                      this.toggleLoading();
                    });
                  }
                } else {
                  this.setState({ action_status: 'failed' }, () => {
                    this.toggleLoading();
                  });
                }
              } else {
                this.setState({ action_status: 'failed' }, () => {
                  this.toggleLoading();
                });
              }
            } else {
              this.setState({ action_status: 'failed' }, () => {
                this.toggleLoading();
              });
            }
          }
        })
    } else {
      this.setState({ action_status: 'failed', action_message: 'Please check your format' }, () => {
        this.toggleLoading();
      });
    }
  }

  async getPackageFormat(dataImport) {
    const dataHeader = dataImport[0];
    const onlyParent = dataImport.map(e => e).filter(e => (this.checkValuetoString(e[this.getIndex(dataHeader, 'PP / Material')])).toLowerCase() === "pp");
    let product_package = [];
    let ppAlready = [];
    let ppError = [];
    let ppSpace = [];
    if (onlyParent !== undefined && onlyParent.length !== 0) {
      for (let i = 0; i < onlyParent.length; i++) {
        let pp_id = this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'bundle_id')]);
        let pp_name = this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'bundle_name')]);
        if (pp_name === null || pp_name === undefined) { pp_name = pp_id }
        const ppcountID = Math.floor(Math.random() * 1000).toString().padStart(6, '0');
        const pp = {
          "pp_id": pp_id,
          "product_name": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'bundle_name')]),
          "product_type": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'product_type')]),
          "physical_group": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'physical_group')]),
          "uom": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'uom')]),
          "pp_cust_number": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'pp_group_number')]),
          "pp_group": this.checkValue(onlyParent[i][this.getIndex(dataHeader, 'pp_group_name')]),
        }
        if (pp.physical_group !== undefined && pp.physical_group !== null) {
          pp["physical_group"] = pp.physical_group.toString();
        }
        if (pp.product_type !== undefined && pp.product_type !== null) {
          pp["product_type"] = pp.product_type.toString();
        }
        if (pp.pp_group === null || pp.pp_group === undefined) {
          pp["pp_group"] = pp.pp_id;
        }
        product_package.push(pp);
      }
      return product_package;
    } else {
      this.setState({ action_status: 'failed', action_message: 'Please check your format' }, () => {
        this.toggleLoading();
      });
    }
  }

  getMaterialFormat(dataImport) {
    const dataHeader = dataImport[0];
    const onlyMaterial = dataImport.map(e => e).filter(e => (this.checkValuetoString(e[this.getIndex(dataHeader, 'PP / Material')])).toLowerCase() === "material");
    let materialList = [];
    let matErr = [];
    for (let i = 0; i < onlyMaterial.length; i++) {
      let pp_id = this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'bundle_id')]);
      let mat_id = this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'material_id')]);
      let mat_name = this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'material_name')]);
      if (mat_name === null || mat_name === undefined) { mat_name = mat_id }
      const matIdx = {
        "pp_id": pp_id,
        "material_id": mat_id,
        "material_name": mat_name,
        "material_type": this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'material_type')]),
        "uom": this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'uom')]),
        "qty": this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'quantity')]),
        "material_origin": this.checkValue(onlyMaterial[i][this.getIndex(dataHeader, 'material_origin')]),
        "po_number": ""
      }
      if (matIdx.material_id !== undefined && matIdx.material_id !== null) {
        matIdx["material_id"] = matIdx.material_id.toString();
      }
      if (matIdx.material_name !== undefined && matIdx.material_name !== null) {
        matIdx["material_name"] = matIdx.material_name.toString();
      }
      if (matIdx.qty === null || matIdx.qty === undefined) {
        matIdx["qty"] = parseInt(matIdx.qty);
      }
      if (matIdx.pp_id === null || matIdx.pp_id === undefined) {
        matIdx["pp_id"] = matIdx.pp_id;
      }
      if (pp_id !== null && mat_id !== null) {
        materialList.push(matIdx);
      } else {
        matErr.push(i);
      }
    }
    return materialList;
  }

  componentDidMount() {
    this.getPackageDataAPI();
    // this.getPackageDataAPI_all();
    document.title = 'Product Package | BAM';
  }

  handleChangeChecklist(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const dataMaterial = this.state.product_package;
    let packageSelected = this.state.packageSelected;
    if (isChecked === true) {
      const getMaterial = dataMaterial.find(pp => pp._id === item);
      packageSelected.push(getMaterial);
    } else {
      packageSelected = packageSelected.filter(function (pp) {
        return pp._id !== item;
      });
    }
    this.setState({ packageSelected: packageSelected });
    this.setState(prevState => ({ packageChecked: prevState.packageChecked.set(item, isChecked) }));
  }

  handleChangeChecklistAll(e) {
    const isChecked = e.target.checked;
    let packageSelected = this.state.packageSelected;
    let getMaterial = this.state.product_package_all;
    if (isChecked) {
      getMaterial = getMaterial.filter(e => packageSelected.map(m => m._id).includes(e._id) !== true);
      for (let x = 0; x < getMaterial.length; x++) {
        packageSelected.push(getMaterial[x]);
        this.setState(prevState => ({ packageChecked: prevState.packageChecked.set(getMaterial[x]._id, isChecked) }));
      }
      this.setState({ packageSelected: packageSelected });
    } else {
      for (let x = 0; x < getMaterial.length; x++) {
        this.setState(prevState => ({ packageChecked: prevState.packageChecked.set(getMaterial[x]._id, isChecked) }));
      }
      packageSelected.length = 0;
      this.setState({ packageSelected: packageSelected });
    }
    this.setState(prevState => ({ packageChecked_all: !prevState.packageChecked_all }))
  }

  handleChangeChecklistPage(e) {
    const isChecked = e.target.checked;
    let packageSelected = this.state.packageSelected;
    let getMaterial = this.state.product_package;
    if (isChecked) {
      getMaterial = getMaterial.filter(e => packageSelected.map(m => m._id).includes(e._id) !== true);
      for (let x = 0; x < getMaterial.length; x++) {
        packageSelected.push(getMaterial[x]);
        this.setState(prevState => ({ packageChecked: prevState.packageChecked.set(getMaterial[x]._id, isChecked) }));
      }
      this.setState({ packageSelected: packageSelected });
    } else {
      for (let x = 0; x < getMaterial.length; x++) {
        this.setState(prevState => ({ packageChecked: prevState.packageChecked.set(getMaterial[x]._id, isChecked) }));
      }
      packageSelected.length = 0;
      this.setState({ packageSelected: packageSelected });
    }
    this.setState(prevState => ({ packageChecked_page: !prevState.packageChecked_page }))
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber, packageChecked_page: false }, () => {
      this.getPackageDataAPI();
    });
  }

  toggleLoading() {
    this.setState(prevState => ({
      modal_loading: !prevState.modal_loading
    }));
  }

  togglePPForm() {
    this.setState(prevState => ({
      modalPPForm: !prevState.modalPPForm
    }));
  }

  togglePPedit(e) {
    const modalPPFedit = this.state.modalPPFedit;
    if (modalPPFedit === false) {
      const value = e.currentTarget.value;
      const ppEdit = this.state.product_package.find(e => e.pp_id === value);
      let dataForm = this.state.PPForm;
      dataForm[0] = ppEdit.pp_id;
      dataForm[1] = ppEdit.product_name;
      dataForm[2] = ppEdit.uom;
      dataForm[3] = ppEdit.product_type;
      dataForm[4] = ppEdit.physical_group;
      dataForm[5] = ppEdit.pp_cust_number;
      dataForm[6] = ppEdit.pp_group;
      dataForm[7] = ppEdit.notes;
      dataForm[8] = ppEdit.price;
      this.setState({ PPForm: dataForm });
    } else {
      this.setState({ PPForm: new Array(9).fill(null) });
    }
    this.setState(prevState => ({
      modalPPFedit: !prevState.modalPPFedit
    }));
  }

  handleChangeForm(e) {
    const value = e.target.value;
    const index = e.target.name;
    let dataForm = this.state.PPForm;
    dataForm[parseInt(index)] = value;
    this.setState({ PPForm: dataForm });
  }

  async saveUpdatePP() {
    let respondSaveEdit = undefined;
    const dataPPEdit = this.state.PPForm;
    const dataPP = this.state.product_package.find(e => e.pp_id === dataPPEdit[0]);
    let pp = {
      "pp_id": dataPPEdit[0],
      "product_name": dataPPEdit[1],
      "product_type": dataPPEdit[3],
      "physical_group": dataPPEdit[4],
      "uom": dataPPEdit[2],
      "qty": 0,
      "pp_cust_number": this.checkValue(dataPPEdit[5]),
      "pp_group": this.checkValue(dataPPEdit[6])
    }
    this.toggleLoading();
    this.togglePPedit();
    if (pp.pp_group === undefined || pp.pp_group === null) {
      pp["pp_group"] = pp.product_name;
    } else {
      if (pp.pp_group.length === 0) {
        pp["pp_group"] = pp.product_name;
      }
    }
    if (pp.pp_cust_number === null || pp.pp_cust_number === undefined) {
      pp["pp_cust_number"] = pp.pp_id;
    } else {
      if (pp.pp_cust_number.length === 0) {
        pp["pp_cust_number"] = pp.pp_id;
      }
    }
    let patchData = await this.patchDatatoAPINODE('/productpackage/updateManyProductPackage', { "ppData": [pp] });
    if (patchData === undefined) { patchData = {}; patchData["data"] = undefined }
    if (patchData.data !== undefined) {
      this.setState({ action_status: 'success' }, () => {
        this.toggleLoading();
        setTimeout(function () { window.location.reload(); }, 2000);
      });
    } else {
      this.toggleLoading();
      this.setState({ action_status: 'failed' });
    }
  }

  async saveNewPP() {
    this.togglePPForm();
    this.toggleLoading();
    let respondSaveNew = undefined;
    let ppData = [];
    const dataPPNew = this.state.PPForm;
    const ppcountID = Math.floor(Math.random() * 1000).toString().padStart(6, '0');
    const pp_name = dataPPNew[1];
    let pp_id_Gen = "PP" + ppcountID + " / " + pp_name;
    let pp = {
      "pp_id": dataPPNew[0],
      "product_name": pp_name.toString(),
      "product_type": dataPPNew[2],
      "physical_group": dataPPNew[3],
      "uom": dataPPNew[4],
      "qty": dataPPNew[5],
      "pp_cust_number": this.checkValue(dataPPNew[8]),
      "pp_group": this.checkValue(dataPPNew[6])
    }
    if (pp.pp_group === undefined || pp.pp_group === null) {
      pp["pp_group"] = pp.product_name;
    } else {
      if (pp.pp_group.length === 0) {
        pp["pp_group"] = pp.product_name;
      }
    }
    if (pp.pp_cust_number === null || pp.pp_cust_number === undefined) {
      pp["pp_cust_number"] = pp.pp_id;
    } else {
      if (pp.pp_cust_number.length === 0) {
        pp["pp_cust_number"] = pp.pp_id;
      }
    }
    ppData.push(pp);
    let postData = await this.postDatatoAPINODE('/productpackage/manyProductPackage', { "ppData": ppData })
      .then(res => {
        console.log('response postData', res);
        if (res.data !== undefined) {
          this.toggleLoading();
          console.log('single PP success created');
        } else {
          this.setState({ action_status: 'failed', action_message: res.response.data.error });
          this.toggleLoading();
        }
      });
  }

  numToSSColumn(num) {
    var s = '', t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t) / 26 | 0;
    }
    return s || undefined;
  }

  async downloadAll() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPP = this.state.packageSelected;

    let headerRow = ['bundle_id',	'bundle_name',	'bundle_type',	'physical_group',	'bundle_unit',	'bundle_group',	'material_id',	'material_name',	'material_type',	'material_origin',	'material_unit',	'material_qty', "bundle_system_id"]
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
    }

    for (let i = 0; i < dataPP.length; i++) {
      ws.addRow([dataPP[i].pp_id, dataPP[i].product_name, dataPP[i].product_type, dataPP[i].physical_group, dataPP[i].uom, dataPP[i].pp_group, dataPP[i].pp_id +" /// "+ dataPP[i].product_name])
      // let getlastrow = ws.lastRow._number;
      // ws.mergeCells('B' + getlastrow + ':D' + getlastrow);
      for (let j = 0; j < dataPP[i].materials.length; j++) {
        let matIndex = dataPP[i].materials[j];
        ws.addRow(["", "", "", "","", "",matIndex.material_id, matIndex.material_name, matIndex.material_type, matIndex.material_origin, matIndex.uom, matIndex.qty])
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Product Package All.xlsx');
  }

  exportTechnicalFormat = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const datapackageSelected = this.state.packageSelected;

    let ppIdArray = ["project", "site_id", "site_name"];
    let phyGroupArray = ["", "", ""];

    ppIdArray = ppIdArray.concat(datapackageSelected.map(pp => pp.pp_id + " /// " + pp.product_name));
    phyGroupArray = phyGroupArray.concat(datapackageSelected.map(pp => pp.product_type));

    ws.addRow(phyGroupArray);
    ws.addRow(ppIdArray);

    const techFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([techFormat]), 'Technical BOQ Format.xlsx');
  }

  exportFormatPackage = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow(["PP / Material", "bundle_id", "bundle_name", "uom", "physical_group", "product_type", "pp_group_number", "pp_group_name"]);
    ws.addRow(["PP", "bundle key 1", "bundle Name 1", "pc", "Radio", "HW", "customer product number 1", "customer product name 1"]);
    ws.addRow(["PP", "bundle key 2", "bundle Name 2", "pc", "Radio", "HW", "customer product number 2", "customer product name 2"]);

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'PP Uploader Template.xlsx');
  }

  exportFormatMaterial = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPrint = this.state.packageSelected;

    ws.addRow(["PP / Material", "material_id", "material_name", "quantity", "uom", "material_type", "material_origin", "bundle_id", "bundle_name"]);

    for (let i = 0; i < dataPrint.length; i++) {
      if (dataPrint[i].materials !== undefined) {
        if (dataPrint[i].materials.length !== 0) {
          for (let j = 0; j < dataPrint[i].materials.length; j++) {
            ws.addRow(["Material", dataPrint[i].materials[j].material_id, dataPrint[i].materials[j].material_name, dataPrint[i].materials[j].qty, dataPrint[i].materials[j].uom, "", dataPrint[i].materials[j].material_origin, dataPrint[i].pp_id, dataPrint[i].product_name]);
          }
        } else {
          ws.addRow(["Material", "child id", "child Name", "3", "pc", "active", "EAB", dataPrint[i].pp_id, dataPrint[i].product_name]);
        }
      } else {
        ws.addRow(["Material", "child id", "child Name", "3", "pc", "active", "EAB", dataPrint[i].pp_id, dataPrint[i].product_name]);
      }
    }

    const MaterialFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MaterialFormat]), 'Material Uploader Template.xlsx');
  }

  exportFormatConfig = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPrint = this.state.packageSelected;
    console.log('pp selected', dataPrint);

    let confArray = ["2020_Config-1D EXAMPLE", "Coverage", "Cov_2020_Config-4_0610", "Cov_2020_Config-4_06", "2515914", "RBS:COV_2020_CONFIG-4DC", "SVC", "EXAMPLE"];
    let typeArray = ["config_name", "program", "config_id", "config_customer_name", "sap_number", "sap_description", "config_type", "description"];

    // ws.addRow(["config_id", "sap_number", "pp_id", "qty", "price", "currency", "config_description", "config_type", "qty_commercial"]);
    typeArray = typeArray.concat(dataPrint.map(pp => pp.pp_id + " /// " + pp.product_name));
    confArray = confArray.concat(dataPrint.map(pp => 0));

    // for (let i = 0; i < dataPrint.length; i++) {
    //   ws.addRow(["CONFIG_TEST", "SAP_NUMBER", dataPrint[i].pp_id, 2, 2400, "USD", "conf_desc_example", "conf_type_example", 235]);
    // }

    ws.addRow(typeArray);
    ws.addRow(confArray);

    const MaterialFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MaterialFormat]), 'Config Uploader Template.xlsx');
  }

  exportFormatConfigVertical = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPrint = this.state.packageSelected;

    let confArray = ["2020_Config-1D EXAMPLE", "Coverage", "Cov_2020_Config-4_0610", "Cov_2020_Config-4_06", "2515914", "RBS:COV_2020_CONFIG-4DC", "SVC", "EXAMPLE", "example_bundle_id", "example_bundle_name"];
    let typeArray = ["config_name", "program", "config_id", "config_customer_name", "sap_number", "sap_description", "config_type", "description", "bundle_id", "bundle_name", "qty"];

    ws.addRow(typeArray);
    ws.addRow(confArray);

    const ws2 = wb.addWorksheet();

    ws2.addRow(["bundle_id", "bundle_name"]);
    dataPrint.map(pp => ws2.addRow([pp.pp_id, pp.product_name]));

    const MaterialFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MaterialFormat]), 'Config Uploader Template Vertical.xlsx');
  }

  async exportFormatBundleMaterial() {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    const dataPP = this.state.product_package_all;

    ws.addRow(["bundle_id", "bundle_name", "bundle_type", "physical_group", "bundle_unit", "bundle_group", "material_id", "material_name", "material_type", "material_origin", "material_unit", "material_qty"]);

    for (let i = 0; i < dataPP.length; i++) {
      if(dataPP[i].materials.length !== 0){
        for (let j = 0; j < dataPP[i].materials.length; j++) {
          let matIndex = dataPP[i].materials[j];
          ws.addRow([dataPP[i].pp_id, dataPP[i].product_name, dataPP[i].product_type, dataPP[i].physical_group, dataPP[i].uom, dataPP[i].pp_group,matIndex.material_id, matIndex.material_name, matIndex.material_type, matIndex.material_origin, matIndex.uom, matIndex.qty])
        }
      }else{
        ws.addRow([dataPP[i].pp_id, dataPP[i].product_name, dataPP[i].product_type, dataPP[i].physical_group, dataPP[i].uom, dataPP[i].pp_group])
      }
    }

    const BundleMaterial = await wb.xlsx.writeBuffer();
    saveAs(new Blob([BundleMaterial]), ' Material Uploader Template.xlsx');
  }

  addMaterialAdditional(){
    let addMaterial = this.state.additional_material;
    addMaterial.push({});
    this.setState({additional_material : addMaterial });
  }

  deleteMaterialAdditional(index){
    let addMaterial = this.state.additional_material;
    // addMaterial[i]["material_origin"] = "deleted"
    addMaterial.splice(index,1);
    this.setState({additional_material : addMaterial });
  }

  onChangeMaterialAdditional(e){
    let addMaterial = this.state.additional_material;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[1];
    let field = idxField[0];
    addMaterial[parseInt(idx)][field] = value;
    this.setState({additional_material : addMaterial})
  }

  async saveAdditional(){
    this.toggleLoading();
    this.setState({modalAdditionalForm : false});
    const addMaterial = this.state.additional_material;
    const dataPP = this.state.product_package[0];
    // const dataUpload = [["material_id_actual", "material_name_actual", "material_type", "unit", "qty"]];
    const dataUpload = [["pp_id","product_name","product_type","physical_group","package_unit","pp_group","material_id","material_name","material_type","material_origin","material_unit","material_qty"]];
    for(let i = 0; i < addMaterial.length; i++){
      dataUpload.push(["AdditionalMaterial","Additional Material","Additional","Additional","grp","AdditionalMaterial",
      addMaterial[i].material_id_actual,
      addMaterial[i].material_name_actual,
      addMaterial[i].material_type !== undefined && addMaterial[i].material_type !== null && addMaterial[i].material_type.length !== 0 ? addMaterial[i].material_type : "Additional",
      addMaterial[i].material_origin,
      addMaterial[i].unit !== undefined && addMaterial[i].unit !== null && addMaterial[i].unit.length !== 0 ? addMaterial[i].unit : "Additional",
      addMaterial[i].qty !== undefined && addMaterial[i].qty !== null && addMaterial[i].qty.length !== 0 ? parseFloat(addMaterial[i].qty) : 1,
    ]);
    }
    let patchDataMat = await this.postDatatoAPINODE('/productpackage/packageWithMaterial', { "data": dataUpload });
    if(patchDataMat.data !== undefined && patchDataMat.status >= 200 && patchDataMat.status <= 300 ) {
      this.setState({ action_status : 'success'}, () => {
        this.getPackageDataAPI();
      });
    } else{
      if(patchDataMat.response !== undefined && patchDataMat.response.data !== undefined && patchDataMat.response.data.error !== undefined){
        if(patchDataMat.response.data.error.message !== undefined){
          this.setState({ action_status: 'failed', action_message: patchDataMat.response.data.error.message });
        }else{
          this.setState({ action_status: 'failed', action_message: patchDataMat.response.data.error });
        }
      }else{
        this.setState({ action_status: 'failed' });
      }
    }
    this.toggleLoading();
  }

  AdditionalForm(){
    // this.toggleLoading();
    let additionaMaterial = [];
    const addPP = this.state.product_package.filter(e => e.pp_id === "AdditionalMaterial");
    const addMaterial = addPP.map(value => value.materials.map(child => child)).reduce((l, n) => l.concat(n), []);
    for(let i = 0; i < addMaterial.length; i++){
      let addIdx = {
        "material_id_actual" : addMaterial[i].material_id,
        "material_name_actual" : addMaterial[i].material_name,
        "material_type" : addMaterial[i].material_type,
        "unit" : addMaterial[i].uom,
        "qty" : addMaterial[i].qty,
        "source_material" : addMaterial[i].source_material
      };
      additionaMaterial.push(addIdx);
    }
    this.setState({additional_material : additionaMaterial, modalAdditionalForm : true}, () => {
      // this.toggleLoading();
    });

  }

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                {/* <span style={{ marginTop: '8px', position: 'absolute' }}> Additional Material</span> */}
                <div className="card-header-actions" style={{ display: 'inline-flex' }}>
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                      <DropdownToggle caret color="light">
                        Download Template
                        </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Uploader Template</DropdownItem>
                        {/* <DropdownItem onClick={this.exportFormatPackage}>>  Template</DropdownItem>
                        <DropdownItem onClick={this.exportFormatMaterial} disabled={this.state.packageChecked.length === 0}>> Material Template</DropdownItem> */}
                        <DropdownItem onClick={this.exportFormatBundleMaterial}>> Additional Material Template</DropdownItem>
                        {/* <DropdownItem onClick={this.exportFormatConfigVertical} disabled={this.state.packageChecked.length === 0}>> Config Template</DropdownItem>
                        <DropdownItem onClick={this.exportTSSRFormat} disabled={this.state.packageChecked.length === 0}>> PS Template</DropdownItem>
                        <DropdownItem onClick={this.downloadAll}>> Download All PP</DropdownItem> */}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  {this.state.userRole.includes('Flow-PublicInternal') !== true ? (
                    <div>
                      <Button block color="success" onClick={this.toggleAddNew} id="toggleCollapse1">
                        <i className="fa fa-plus-square" aria-hidden="true"> &nbsp; </i> Update
                        </Button>
                    </div>
                  ) : ("")}
                </div>
              </CardHeader>
              <Collapse isOpen={this.state.collapse} onEntering={this.onEntering} onEntered={this.onEntered} onExiting={this.onExiting} onExited={this.onExited}>
                <Card style={{ margin: '10px 10px 5px 10px' }}>
                  <CardBody>
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td>Upload File</td>
                            <td>:</td>
                            <td>
                              <input type="file" onChange={this.fileHandlerMaterial.bind(this)} style={{ "padding": "10px", "visiblity": "hidden" }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button color="success" size="sm" disabled={this.state.rowsXLS.length === 0} onClick={this.saveProductPackageOneShot} style={{ marginRight: '10px' }}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;SAVE</Button>
                    {/* <Button color="success" size="sm" disabled={this.state.rowsXLS.length === 0} onClick={this.saveProductPackage}> <i className="fa fa-refresh" aria-hidden="true"> </i> &nbsp;Update </Button> */}
                    <Button color="primary" style={{ float: 'right' }} onClick={this.AdditionalForm}> <i className="fa fa-paste">&nbsp;&nbsp;</i> &nbsp;Form</Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '500' }}> Material Additional List</span>
                      <div style={{ float: 'right', margin: '5px', display: 'inline-flex' }}>
                      <span style={{marginRight: '10px'}}>
                      {/* <Checkbox name={"all"} checked={this.state.packageChecked_all} onChange={this.handleChangeChecklistAll} />Select All */}
                      </span>
                        {/* <span style={{ marginRight: '10px' }}>
                          <Checkbox name={"allPP"} checked={this.state.packageChecked_allPP} onChange={this.handleChangeChecklistAllPP} disabled={this.state.pp_all.length === 0} />
                          Select All
                        </span> */}
                        {/* &nbsp;&nbsp;&nbsp; */}
                        <input className="search-box-material" type="text" name='filter' placeholder="Search" onChange={(e) => this.SearchFilter(e)}  />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='divtable'>
                      <table hover bordered responsive size="sm" width='100%'>
                        <thead style={{ backgroundColor: '#c6f569' }} className='fixed-pp'>
                          <tr align="center">
                            <th>Material ID</th>
                            <th>Material Name</th>
                            <th>Type</th>
                            <th>Origin</th>
                            <th>Unit</th>
                            <th>Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.product_package
                          .map(pp =>
                            <React.Fragment key={pp._id + "frag"}>
                              {pp.materials
                              .filter((mat) => {
                                if (this.state.search === null) {
                                  return mat;
                                } else if (
                                  mat.material_name
                                    .toLowerCase()
                                    .includes(this.state.search.toLowerCase()) ||
                                  mat.material_id
                                    .toLowerCase()
                                    .includes(this.state.search.toLowerCase())
                                ) {
                                  return mat;
                                }
                              })
                              .map(mat =>
                                <tr className='fixbodymat' key={mat._id}>
                                  <td style={{ textAlign: 'center' }}>{mat.material_id}</td>
                                  <td style={{ textAlign: 'center' }}>{mat.material_name}</td>
                                  <td style={{ textAlign: 'center' }}>{mat.material_type}</td>
                                  <td style={{ textAlign: 'center' }}>{mat.material_origin}</td>
                                  <td style={{ textAlign: 'center' }}>{mat.uom}</td>
                                  <td style={{ textAlign: 'center' }}>{mat.qty}</td>
                                </tr>
                              )}
                            </React.Fragment>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div style={{ margin: "8px 0px" }}>
                      <small>Showing {this.state.perPage} entries from {this.state.product_package[0] === undefined ? 0 : this.state.product_package[0].materials.length} data</small>
                    </div>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total_dataParent}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div>
                      <span style={{ color: 'red' }}>*</span><span>NOTE : Please select Product Package first, before download Technical Format or Material Template.</span>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal New Single PP */}
        <Modal isOpen={this.state.modalPPForm} toggle={this.togglePPForm} className="modal--form">
          <ModalHeader>Form Product Package</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="pp_id"> ID</Label>
                  <Input type="text" name="0" placeholder="" value={this.state.PPForm[0]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="product_name"> Name</Label>
                  <Input type="text" name="1" placeholder="" value={this.state.PPForm[1]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup row>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="product_type" >Product Type</Label>
                      <Input type="text" name="2" placeholder="" value={this.state.PPForm[2]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="physical_group" >Physical Group</Label>
                      <Input type="text" name="3" placeholder="" value={this.state.PPForm[3]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="uom" >Unit Of Measure</Label>
                      <Input type="text" name="4" placeholder="" value={this.state.PPForm[4]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="qty" >Quantity</Label>
                      <Input type="number" min="1" name="5" placeholder="" value={this.state.PPForm[5]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="pp_cust_number" >Package Number (Group)</Label>
                      <Input type="text" name="8" placeholder="" value={this.state.PPForm[8]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="pp_group" >Package Number (Name)</Label>
                  <Input type="text" name="6" placeholder="" value={this.state.PPForm[6]} onChange={this.handleChangeForm} />
                </FormGroup>
                {/* <FormGroup>
                  <Label htmlFor="note" >Note</Label>
                  <Input type="text" name="7" placeholder="" value={this.state.PPForm[7]} onChange={this.handleChangeForm} />
                </FormGroup> */}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNewPP}>Submit</Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PP*/}

        {/* Modal Additional Material */}
        <Modal isOpen={this.state.modalAdditionalForm} toggle={this.toggleAdditionalForm} className={'modal-xl '+ this.props.className}>
          <ModalHeader>
            <div>
              <span>Form Additional Material</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>
                        Material ID
                      </th>
                      <th>
                        Material Name
                      </th>
                      <th>
                        Type
                      </th>
                      <th>
                        Material Origin
                      </th>
                      <th>
                        UoM
                      </th>

                      <th>
                        Qty
                      </th>
                      {/* <th>
                        Source Material
                      </th> */}
                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.additional_material.map((add,i) =>
                    <tr>
                      <td>
                        <input type="text" name={"material_id_actual" + " /// "+i } value={add.material_id_actual} onChange={this.onChangeMaterialAdditional} />
                      </td>
                      <td>
                        <input type="text" name={"material_name_actual" + " /// "+i } value={add.material_name_actual} onChange={this.onChangeMaterialAdditional} />
                      </td>
                      <td>
                        <input type="text" name={"material_type" + " /// "+i } value={add.material_type} onChange={this.onChangeMaterialAdditional} style={{width : '150px'}}/>
                      </td>
                      <td>
                        <input type="text" name={"material_origin" + " /// "+i } value={add.material_origin} onChange={this.onChangeMaterialAdditional} style={{width : '100px'}}/>
                      </td>
                      <td>
                        <input type="text" name={"unit" + " /// "+i } value={add.unit} onChange={this.onChangeMaterialAdditional} style={{width : '100px'}}/>
                      </td>

                      <td>
                        <input type="number" name={"qty" + " /// "+i } value={add.qty} onChange={this.onChangeMaterialAdditional} style={{width : '75px'}}/>
                      </td>
                      {/* <td>
                        <input type="string" name={"source_material" + " /// "+i } value={add.source_material} onChange={this.onChangeMaterialAdditional} />
                      </td> */}
                      <td>
                        <Button color="danger" size="sm" onClick={e => this.deleteMaterialAdditional(i)}><span className="fa fa-times"></span></Button>
                      </td>
                    </tr>
                  )}
                  </tbody>
                  <Button style={{ float : "left", margin : "15px"}} color="info" size="sm" onClick={this.addMaterialAdditional}>Add Material</Button>
                </Table>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" size="sm" onClick={this.toggleAdditionalForm}>Cancel</Button>
            <Button color="success" size="sm" onClick={this.saveAdditional}>Submit</Button>
          </ModalFooter>
        </Modal>
        {/*  Modal Additional Material*/}

        {/* Modal Edit PP */}
        <Modal isOpen={this.state.modalPPFedit} toggle={this.togglePPedit} className="modal--form">
          <ModalHeader>Form Update Product Package</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="pp_key">Package ID</Label>
                  <Input type="text" name="0" placeholder="" value={this.state.PPForm[0]} onChange={this.handleChangeForm} disabled />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="package_name" >Name</Label>
                  <Input type="text" name="1" placeholder="" value={this.state.PPForm[1]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup row>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="unit" >Unit</Label>
                      <Input type="text" name="2" placeholder="" value={this.state.PPForm[2]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="product_type" >Type</Label>
                      <Input type="text" name="3" placeholder="" value={this.state.PPForm[3]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="physical_group" >Physical Group</Label>
                      <Input type="text" name="4" placeholder="" value={this.state.PPForm[4]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="pp_id" >Package Number (Group)</Label>
                      <Input type="text" name="5" placeholder="" value={this.state.PPForm[5]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="pp_group" >Package Name (Group)</Label>
                  <Input type="text" name="6" placeholder="" value={this.state.PPForm[6]} onChange={this.handleChangeForm} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveUpdatePP}>Update</Button>
          </ModalFooter>
        </Modal>
        {/*  Modal Edit PP*/}

        {/* Modal Loading */}
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm modal--loading '}>
          <ModalBody>
            <div style={{ textAlign: 'center' }}>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              Loading ...
            </div>
            <div style={{ textAlign: 'center' }}>
              System is processing ...
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleLoading}>Close</Button>
          </ModalFooter>
        </Modal>
        {/* end Modal Loading */}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLogin: state.loginData
  }
}

export default connect(mapStateToProps)(AddMatPackageUpload);
