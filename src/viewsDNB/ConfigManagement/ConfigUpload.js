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
import mydata from './data/getAllPackage.json'
import mydata2 from './data/getAllPackage2.json'

const DefaultNotif = React.lazy(() => import('../../views/DefaultView/DefaultNotif'));

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, value }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} value={value} className="checkmark-dash" />
);

const API_URL_NODE = 'https://api2-dev.bam-id.e-dpm.com/bamidapi';
const usernameBAM = 'bamidadmin@e-dpm.com';
const passwordBAM = 'F760qbAg2sml';

const Config_group_type_DEFAULT = ["HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "HW", "SERVICE", "SERVICE", "SERVICE", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "POWER", "CME", "CME", "CME", "CME", "CME", "CME", "CME", "CME"]

const Config_group_DEFAULT = ["Config Cabinet", "Config Add L9", "Config Add L10", "Config Add L18", "Config Add L21", "Config BB 5212 (Reuse)", "Config UPG BW 1800", "Swapped Module/BB", "Config UPG BW 2100", "Config Radio B0 MIMO 2T2R", "Config Kit Radio B1 MIMO 2T2R", "Config Radio B1 MIMO 2T2R", "Config Kit Radio B3 MIMO 2T2R", "Config Radio B3 MIMO 2T2R", "Config Radio B1 MIMO 4T4R", "Config Radio B3 MIMO 4T4R", "Config Radio B1 + B3 DUAL BAND 2T2R", "Config Radio B1 + B3 DUAL BAND 4T4R", "Config Multi Sector", "Config Antenna", "Config Service 2", "Config Service 3", "Config Service 4", "Material 1 Power", "Material 2 Power", "Material 3 Power", "Material 4 Power", "Material 5 Power", "Service 1 Power", "Service 2 Power", "Service 3 Power", "Material 1 CME", "Material 2 CME", "Material 3 CME", "Material 4 CME", "Material 5 CME", "Service 1 CME", "Service 2 CME", "Service 3 CME"];

class ConfigUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userRole: this.props.dataLogin.role,
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.userName,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      pp_all: [],
      filter_name: "",
      perPage: 10,
      prevPage: 1,
      activePage: 1,
      rowsXLS: [],
      action_status: null,
      action_message: null,
      product_package: [],
      config_package: [],
      config_package_all: [],
      check_config_package: [],
      check_config_update: null,
      dataConfig: [],
      total_dataConfig: 0,
      packageChecked: new Map(),
      modal_loading: false,
      dropdownOpen: new Array(2).fill(false),
      modalPPForm: false,
      PPForm: new Array(9).fill(null),
      collapse: false,
      collapseUpdate: false,
      updateConfigType: true,
      loadprojectdata: [],
      modalPPFedit: false,
      config_checked: new Map(),
      config_selected: [],
      config_checked_all: false,
      config_checked_page: false,
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
    this.toggleUpdateBulk = this.toggleUpdateBulk.bind(this);
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.downloadAll = this.downloadAll.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.saveNewPP = this.saveNewPP.bind(this);
    this.togglePPedit = this.togglePPedit.bind(this);
    this.saveUpdatePP = this.saveUpdatePP.bind(this);
    this.exportFormatConfigParent = this.exportFormatConfigParent.bind(this);
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
    if (this.state.collapseUpdate === true) {
      this.toggleUpdateBulk();
    }
    this.setState({ collapse: !this.state.collapse });
  }

  toggleUpdateBulk(e) {
    if (e !== undefined) {
      if (e.target !== undefined) {
        if (e.target.value !== undefined) {
          this.setState({ updateConfigType: e.target.value });
        }
      }
    }
    if (this.state.collapse === true) {
      this.toggleAddNew();
    }
    this.setState({ collapseUpdate: !this.state.collapseUpdate });
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

  async getDatatoAPINode(url) {
    try {
      let respond = await axios.get(API_URL_NODE + url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenUser
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Get Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Get Data err", err);
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
        console.log("respond Post Data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Post Data err", err);
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

  async getDatafromAPIBAM(url, data, _etag) {
    try {
      let respond = await axios.patch(API_URL_NODE + url, data, {
        headers: { 'Content-Type': 'application/json', "If-Match": _etag },
        auth: {
          username: usernameBAM,
          password: passwordBAM
        },
      })
      if (respond.status >= 200 && respond.status < 300) {
        console.log("respond Patch data", respond);
      }
      return respond;
    } catch (err) {
      let respond = err;
      console.log("respond Patch data", err);
      return respond;
    }
  }

  changeFilterName(value) {
    this.getConfigDataAPI();
  }

  handleChangeFilter = (e) => {
    let value = e.target.value;
    if (value.length === 0) {
      value = "";
    }
    this.setState({ filter_name: value }, () => {
      this.changeFilterName(value);
    });
  }

  getConfigDataAPI() {
    let filter = '{"$regex" : "", "$options" : "i"}';
    if (this.state.filter_name !== "") {
      filter = '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    }
    let whereOr = '{"$or" : [{"config_id": ' + filter + '}, {"config_name": ' + filter + '}, {"program": ' + filter + '}, {"config_type": ' + filter + '}]}';
    this.getDatatoAPINode('/packageconfig?q=' + whereOr + '&lmt=' + this.state.perPage + '&pg=' + this.state.activePage)
      .then(res => {
        if (res.data !== undefined) {
          this.setState({ config_package: res.data.data, prevPage: this.state.activePage, total_dataConfig: res.data.totalResults })
        } else {
          this.setState({ config_package: [], total_dataConfig: 0, prevPage: this.state.activePage });
        }
      })
  }

  getConfigDataAPI_all() {
    let filter = '{"$regex" : "", "$options" : "i"}';
    if (this.state.filter_name !== "") {
      filter = '{"$regex" : "' + this.state.filter_name + '", "$options" : "i"}';
    }
    let whereOr = '{"$or" : [{"config_id": ' + filter + '}, {"config_name": ' + filter + '}, {"program": ' + filter + '}, {"config_type": ' + filter + '}]}';
    this.getDatatoAPINode('/packageconfig?noPg=1&q='+whereOr)
      .then(res => {
        if (res.data !== undefined) {
          this.setState({ config_package_all: res.data.data });
        } else {
          this.setState({ config_package_all: [] });
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
      console.log('value1', value1);
      return value1;
    } else {
      console.log('value2', value2);
      return value2;
    }
  }

  // check Package Config
  fileHandlerConfig = (event) => {
    this.toggleLoading();
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        }
        else {
          this.checkConfigFormatNew(rest.rows);
        }
      });
    }
  }

  checkConfigFormatNew(newXLS){
    let rowsXLS = newXLS;
    let headerRow = [];
    for (let i = 0; i < rowsXLS[0].length; i++) {
      let value = rowsXLS[0][i];
      value = value.replace("bundle_id", "pp_id");
      value = value.replace("bundle_name", "product_name");
      headerRow.push(value);
    }
    rowsXLS[0] = headerRow;
    console.log("rest.rows", JSON.stringify(rowsXLS));
    this.postDatatoAPINODE('/packageconfig/checkPackageConfig', { "configData": rowsXLS }).then(res => {
      if (res.data !== undefined) {
        this.setState({ check_config_package: res.data.configData, rowsXLS: newXLS })
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
  }

  fileHandlerUpdate = (event) => {
    this.toggleLoading();
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        }
        else {
          this.checkFormatUpdateConfig(rest.rows);
        }
      });
    }
  }

  checkFormatUpdateConfig(newXLS) {
    let rowsXLS = newXLS;
    let headerRow = [];
    for (let i = 0; i < rowsXLS[0].length; i++) {
      let value = rowsXLS[0][i];
      value = value.replace("bundle_id", "pp_id");
      value = value.replace("bundle_name", "product_name");
      headerRow.push(value);
    }
    rowsXLS[0] = headerRow;
    let dataUpdateConfig = {
      "updateData": true,
      "parentOnly": false,
      "skipBlank": true,
      "configData": rowsXLS
    }
    this.postDatatoAPINODE('/packageconfig/checkPackageConfig', dataUpdateConfig).then(res => {
      if (res.data !== undefined) {
        this.setState({ check_config_update: res.data.configData, rowsXLS: newXLS })
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
  }

  checkFormatConfig(dataXLSHeader) {
    // cek the import data is for Config or Not
    if (this.getIndex(dataXLSHeader, 'config_id') !== -1 && this.getIndex(dataXLSHeader, 'sap_number') !== -1 && this.getIndex(dataXLSHeader, 'pp_id') === -1 && (this.getIndex(dataXLSHeader, 'qty') !== -1 && this.getIndex(dataXLSHeader, 'price') !== -1 && this.getIndex(dataXLSHeader, 'currency') !== -1)) {
      return true;
    } else {
      return false;
    }
  }


  saveConfigBulk = async () => {
    this.toggleLoading();
    const isConfig = true;
    if (isConfig === true) {
      const postConfig = await this.postDatatoAPINODE('/packageConfig/saveConfigBulk', { "configData": this.state.check_config_package });
      if (postConfig.data !== undefined) {
        this.setState({ action_status: 'success' }, () => {
          this.toggleLoading();
        });
      } else {
        if (postConfig.response !== undefined) {
          if (postConfig.response.data !== undefined) {
            if (postConfig.response.data.error !== undefined) {
              if (postConfig.response.data.error.message !== undefined) {
                this.setState({ action_status: 'failed', action_message: postConfig.response.data.error.message }, () => {
                  this.toggleLoading();
                });
              } else {
                this.setState({ action_status: 'failed', action_message: postConfig.response.data.error }, () => {
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
      this.setState({ action_status: 'failed', action_message: 'There is something error' }, () => {
        this.toggleLoading();
      });
    }
  }

  updateConfigBulk = async (e) => {
    this.toggleLoading();
    const isConfig = this.state.check_config_update !== undefined && this.state.check_config_update !== null;
    if (isConfig === true) {
      const postConfig = await this.patchDatatoAPINODE('/packageConfig/updateConfig', { "configData": this.state.check_config_update });
      if (postConfig.data !== undefined) {
        this.setState({ action_status: 'success' }, () => {
          this.toggleLoading();
        });
      } else {
        if (postConfig.response !== undefined) {
          if (postConfig.response.data !== undefined) {
            if (postConfig.response.data.error !== undefined) {
              if (postConfig.response.data.error.message !== undefined) {
                this.setState({ action_status: 'failed', action_message: postConfig.response.data.error.message }, () => {
                  this.toggleLoading();
                });
              } else {
                this.setState({ action_status: 'failed', action_message: postConfig.response.data.error }, () => {
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
      this.setState({ action_status: 'failed', action_message: 'There is something error' }, () => {
        this.toggleLoading();
      });
    }
  }

  componentDidMount() {
    this.getConfigDataAPI();
    this.getConfigDataAPI_all();
    document.title = 'Config Manager | BAM';
  }

  handleChangeChecklist(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const dataConfig = this.state.config_package;
    let configSelected = this.state.config_selected;
    if (isChecked === true) {
      const getConfig = dataConfig.find(conf => conf._id === item);
      configSelected.push(getConfig);
    } else {
      configSelected = configSelected.filter(function (conf) {
        return conf._id !== item;
      });
    }
    this.setState({ config_selected: configSelected });
    this.setState(prevState => ({ config_checked: prevState.config_checked.set(item, isChecked) }));
  }

  handleChangeChecklistAll(e) {
    const isChecked = e.target.checked;
    let configSelected = this.state.config_selected;
    let dataConfig = this.state.config_package_all;
    if (isChecked) {
      dataConfig = dataConfig.filter(e => configSelected.map(m => m._id).includes(e._id) !== true);
      for (let x = 0; x < dataConfig.length; x++) {
        configSelected.push(dataConfig[x]);
        this.setState(prevState => ({ config_checked: prevState.config_checked.set(dataConfig[x]._id, isChecked) }));
      }
      this.setState({ config_selected: configSelected });
    } else {
      for (let x = 0; x < dataConfig.length; x++) {
        this.setState(prevState => ({ config_checked: prevState.config_checked.set(dataConfig[x]._id, isChecked) }));
      }
      configSelected.length = 0;
      this.setState({ config_selected: configSelected });
    }
    this.setState(prevState => ({ config_checked_all: !prevState.config_checked_all }))
  }

  handleChangeChecklistPage(e) {
    const isChecked = e.target.checked;
    let configSelected = this.state.config_selected;
    let dataConfig = this.state.config_package;
    if (isChecked) {
      dataConfig = dataConfig.filter(e => configSelected.map(m => m._id).includes(e._id) !== true);
      for (let x = 0; x < dataConfig.length; x++) {
        configSelected.push(dataConfig[x]);
        this.setState(prevState => ({ config_checked: prevState.config_checked.set(dataConfig[x]._id, isChecked) }));
      }
      this.setState({ config_selected: configSelected });
    } else {
      for (let x = 0; x < dataConfig.length; x++) {
        this.setState(prevState => ({ config_checked: prevState.config_checked.set(dataConfig[x]._id, isChecked) }));
      }
      configSelected.length = 0;
      this.setState({ config_selected: configSelected });
    }
    this.setState(prevState => ({ config_checked_page: !prevState.config_checked_page }))
  }

  handlePageChange(pageNumber) {
    // console.log(`active page ${pageNumber}`)
    this.setState({ activePage: pageNumber, config_checked_page: false }, () => {
      this.getConfigDataAPI();
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
      "pp_group": this.checkValue(dataPPEdit[6]),
      "product_name": dataPPEdit[1],
      "uom": dataPPEdit[2],
      "pp_cust_number": this.checkValue(dataPPEdit[5]),
      "physical_group": dataPPEdit[4],
      "product_type": dataPPEdit[3],
      "pricing_group": 0,
      "price": dataPPEdit[8],
      "year": "2020",
      "variant_name": null,
      "notes": dataPPEdit[7],
      "deleted": 0,
      "updated_by": this.state.userId
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
    let patchData = await this.patchDatatoAPIBAM('/pp_op/' + dataPP._id, pp, dataPP._etag);
    if (patchData === undefined) { patchData = {}; patchData["data"] = undefined }
    if (patchData.data !== undefined) {
      respondSaveEdit = patchData.data;
    }
    if (respondSaveEdit !== undefined) {
      this.setState({ action_status: 'success' }, () => {
        this.toggleLoading();
        setTimeout(function () { window.location.reload(); }, 2000);
      });
    }
  }

  async saveNewPP() {
    this.togglePPForm();
    this.toggleLoading();
    let respondSaveNew = undefined;
    const dataPPNew = this.state.PPForm;
    const dataAllPP = this.state.pp_all;
    if (dataAllPP.find(e => e.pp_id === dataPPNew[0]) !== undefined) {
      const ppcountID = Math.floor(Math.random() * 1000).toString().padStart(6, '0');
      const pp_name = dataPPNew[1];
      let pp_id_Gen = "PP" + ppcountID + " / " + pp_name;
      let pp = {
        "pp_id": dataPPNew[0],
        "pp_key": pp_id_Gen,
        "pp_group": this.checkValue(dataPPNew[6]),
        "product_name": pp_name.toString(),
        "uom": dataPPNew[2],
        "pp_cust_number": this.checkValue(dataPPNew[5]),
        "physical_group": dataPPNew[4],
        "product_type": dataPPNew[3],
        "pricing_group": 0,
        "price": dataPPNew[8],
        "year": "2020",
        "variant_name": null,
        "notes": dataPPNew[7],
        "deleted": 0,
        "created_by": this.state.userId,
        "updated_by": this.state.userId
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
      let postData = await this.postDatatoAPIBAM('/pp_op', pp);
      if (postData === undefined) { postData = {}; postData["data"] = undefined }
      if (postData.data !== undefined) {
        respondSaveNew = postData.data;
      }
      if (respondSaveNew !== undefined) {
        this.setState({ action_status: 'success' }, () => {
          this.toggleLoading();
          setTimeout(function () { window.location.reload(); }, 2000);
        });
      } else {
        this.setState({ action_status: 'failed' });
        this.toggleLoading();
      }
    } else {
      this.toggleLoading();
      this.setState({ action_status: 'failed', action_message: 'Duplicated PP ID' });
    }
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

    const dataPP = this.state.config_package_all;

    let headerRow = ['Config ID',	'Config Name',	'Program',	'Config Type', 'SAP Number', 'SAP Description',	'Description', 'Bundle ID',	'Bundle Name', 'UoM',	'Qunatity']
    ws.addRow(headerRow);

    for (let i = 1; i < headerRow.length + 1; i++) {
      ws.getCell(this.numToSSColumn(i) + '1').font = { size: 11, bold: true };
    }

    for (let i = 0; i < dataPP.length; i++) {
      ws.addRow([dataPP[i].config_id, dataPP[i].config_name, dataPP[i].program, dataPP[i].config_type, dataPP[i].sap_number, dataPP[i].sap_description, dataPP[i].description])
      // let getlastrow = ws.lastRow._number;
      // ws.mergeCells('B' + getlastrow + ':D' + getlastrow);
      for (let j = 0; j < dataPP[i].package_list.length; j++) {
        let matIndex = dataPP[i].package_list[j].id_pp_doc;
        ws.addRow(["", "", "", "","", "","", matIndex.pp_id, matIndex.product_name, matIndex.uom, dataPP[i].package_list[j].qty])
      }
    }

    const allocexport = await wb.xlsx.writeBuffer();
    saveAs(new Blob([allocexport]), 'Config Package.xlsx');
  }

  exportTechnicalFormat = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let HeaderRow1 = ["General Info", "General Info", "General Info", "General Info", "General Info"];
    let HeaderRow2 = ["tower_id", "program", "sow", "sow_code", "priority"];

    Config_group_type_DEFAULT.map(e => HeaderRow1 = HeaderRow1.concat([e, e]));
    Config_group_DEFAULT.map(e => HeaderRow2 = HeaderRow2.concat([e, "qty"]));

    ws.addRow(HeaderRow1);
    ws.addRow(HeaderRow2);

    const ws2 = wb.addWorksheet();

    ws2.addRow(["config_id", "config_name"]);
    const dataConfigSelected = this.state.config_selected;
    dataConfigSelected.map(e => ws2.addRow([e.config_id, e.config_name]));

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MRFormat]), 'Technical BOQ Uploader Horizontal Template.xlsx');
  }

  exportTechnicalVerticalFormat = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let HeaderRow1 = ["tower_id", "program", "sow", "config_group", "config_id", "config_group_type", "qty"];

    ws.addRow(HeaderRow1);

    const ws2 = wb.addWorksheet();

    ws2.addRow(["config_id", "config_name"]);
    const dataConfigSelected = this.state.config_selected;
    dataConfigSelected.map(e => ws2.addRow([e.config_id, e.config_name]));

    const MRFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([MRFormat]), 'Technical BOQ Uploader Vertical Template.xlsx');
  }

  // Config Template XLSX bulk upload
  exportFormatConfigParent = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    ws.addRow([ "config_id", "config_name", "program","config_customer_name", "sap_number", "sap_description", "config_type", "description", "bundle_id", "bundle_name", "qty"]);
    const dataConfigSelected = this.state.config_selected;
    console.log("dataConfigSelected", dataConfigSelected);
    dataConfigSelected.map(e => e.package_list.map(p => ws.addRow([e.config_id, e.config_name, e.program, e.config_customer_name, e.sap_number, e.sap_description, e.config_type, e.description, p.pp_id, p.id_pp_doc.product_name, p.qty])));

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'Config Update Template Only Parent.xlsx');
  }

  exportFormatAllConfigUploader = async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let typeArray = ["config_id", "config_name", "program", "config_customer_name", "sap_number", "sap_description", "config_type", "description"];

    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), 'All Config Template.xlsx');
  }

  render() {
    return (
      <div className="animated fadeIn">
        <DefaultNotif actionMessage={this.state.action_message} actionStatus={this.state.action_status} />
        <Row>
          <Col xl="12">
            <Card style={{}}>
              <CardHeader>
                <span style={{ fontSize: "17px" }}>Config</span>
                <div className="card-header-actions" style={{ display: 'inline-flex' }}>
                  <div style={{ marginRight: "10px" }}>
                    <Dropdown size="sm" isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                      <DropdownToggle caret color="light">
                        Download Template
                        </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>File Template</DropdownItem>
                        <DropdownItem onClick={this.exportTechnicalFormat}>> Technical BOQ Horizontal Template</DropdownItem>
                        <DropdownItem onClick={this.exportTechnicalVerticalFormat}>> Technical BOQ Vertical Template</DropdownItem>
                        <DropdownItem onClick={this.exportFormatConfigParent}>> Config Update Template Parent</DropdownItem>
                        <DropdownItem onClick={this.downloadAll} disabled={this.state.config_package_all.length === 0}>> Download Config All</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div style={{ marginRight: "10px" }}>
                    <Button block color="success" size="sm" onClick={this.toggleAddNew} id="toggleCollapse1">
                      <i className="fa fa-plus-square" aria-hidden="true"> &nbsp; </i> New
                      </Button>
                  </div>
                  <div>
                    <Button block color="warning" size="sm" onClick={this.toggleUpdateBulk} id="toggleCollapse1">
                      <i className="fa fa-plus-square" aria-hidden="true"> &nbsp; </i> Update
                      </Button>
                  </div>
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
                              <input type="file" onChange={this.fileHandlerConfig.bind(this)} style={{ "padding": "10px", "visiblity": "hidden" }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button color="success" size="sm" disabled={this.state.rowsXLS.length === 0} onClick={this.saveConfigBulk}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;SAVE </Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <Collapse isOpen={this.state.collapseUpdate} onEntering={this.onEntering} onEntered={this.onEntered} onExiting={this.onExiting} onExited={this.onExited}>
                <Card style={{ margin: '10px 10px 5px 10px' }}>
                  <CardBody>
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td>Upload File</td>
                            <td>:</td>
                            <td>
                              <input type="file" onChange={this.fileHandlerUpdate.bind(this)} style={{ "padding": "10px", "visiblity": "hidden" }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button color="success" size="sm" disabled={this.state.rowsXLS.length === 0} onClick={this.updateConfigBulk}> <i className="fa fa-save" aria-hidden="true"> </i> &nbsp;Update </Button>
                  </CardFooter>
                </Card>
              </Collapse>
              <CardBody>
                <Row>
                  <Col>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '500' }}>Config List</span>
                      <div style={{ float: 'right', margin: '5px', display: 'inline-flex' }}>
                      <span style={{marginRight: '10px'}}>
                        <Checkbox name={"all"} checked={this.state.config_checked_all} onChange={this.handleChangeChecklistAll} disabled={this.state.config_package_all.length === 0} />Select All
                      </span>
                        {/* <span style={{ marginRight: '10px' }}>
                          <Checkbox name={"allPP"} checked={this.state.packageChecked_allPP} onChange={this.handleChangeChecklistAllPP} disabled={this.state.pp_all.length === 0} />
                          Select All
                        </span> */}
                        <input className="search-box-material" type="text" name='filter' placeholder="Search" onChange={this.handleChangeFilter} value={this.state.filter_name} />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='divtable'>
                      <table hover bordered responsive size="sm" width='100%'>
                        <thead style={{ backgroundColor: '#73818f' }} className='fixed-conf'>
                          <tr align="center">
                            <th>
                              <Checkbox name={"all"} checked={this.state.config_checked_page} onChange={this.handleChangeChecklistPage} />
                            </th>
                            <th style={{ minWidth: '150px' }}>Config</th>
                            <th>Config Name</th>
                            <th>SAP</th>
                            <th>Program</th>
                            <th>Bundle ID</th>
                            <th>Bundle Name</th>
                            <th>Qty</th>
                            <th>Config Cust Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.config_package.map(pp =>
                            <React.Fragment key={pp._id + "frag"}>
                              <tr style={{ backgroundColor: '#d3d9e7', fontWeight: 700 }} className='fixbody' key={pp._id}>
                                <td align="center"><Checkbox name={pp._id} checked={this.state.config_checked.get(pp._id)} onChange={this.handleChangeChecklist} value={pp} /></td>
                                <td style={{ textAlign: 'center' }}>{pp.config_id}</td>
                                <td style={{ textAlign: 'center' }}>{pp.config_name}</td>
                                <td style={{ textAlign: 'center' }}>{pp.sap_number}</td>
                                <td style={{ textAlign: 'center' }}>{}</td>
                                <td style={{ textAlign: 'center' }}>{pp.config_type}</td>
                                <td></td>
                                <td>
                                </td>
                                <td style={{ textAlign: 'center' }}>{pp.config_customer_name}</td>
                              </tr>
                              {pp.package_list.map(pl =>
                                <tr className='fixbodymat' key={pl.id_pp_doc}>
                                  <td style={{ textAlign: 'left' }}></td>
                                  <td style={{ textAlign: 'left' }}></td>
                                  <td style={{ textAlign: 'left' }}></td>
                                  <td style={{ textAlign: 'left' }}></td>
                                  <td style={{ textAlign: 'left' }}></td>
                                  <td style={{ textAlign: 'center' }}>{pl.pp_id}</td>
                                  <td style={{ textAlign: 'center' }}>{pl.pp_group}</td>
                                  <td style={{ textAlign: 'center' }}>{pl.qty.toFixed(2)}</td>
                                  <td></td>
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
                    <small>Showing {this.state.perPage} entries from {this.state.total_dataConfig} data</small>
                  </div>
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.perPage}
                      totalItemsCount={this.state.total_dataConfig}
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
                      <span style={{ color: 'red' }}>*</span><span>NOTE : Please select Bundle first, before download Technical Format or Material Template.</span>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal New PP */}
        <Modal isOpen={this.state.modalPPForm} toggle={this.togglePPForm} className="formmaterial">
          <ModalHeader>Form Config</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="pp_key">Product Key</Label>
                  <Input type="text" name="0" placeholder="" value={this.state.PPForm[0]} onChange={this.handleChangeForm} />
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
                  <Col xs="8">
                    <FormGroup>
                      <Label htmlFor="pp_id" >Product Number (Cust)</Label>
                      <Input type="text" name="5" placeholder="" value={this.state.PPForm[5]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="price" >Price</Label>
                      <Input type="number" name="8" placeholder="" value={this.state.PPForm[8]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="pp_group" >Product Name (Cust)</Label>
                  <Input type="text" name="6" placeholder="" value={this.state.PPForm[6]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="note" >Note</Label>
                  <Input type="text" name="7" placeholder="" value={this.state.PPForm[7]} onChange={this.handleChangeForm} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.saveNewPP}>Submit</Button>
          </ModalFooter>
        </Modal>
        {/*  Modal New PP*/}

        {/* Modal Edit PP */}
        <Modal isOpen={this.state.modalPPFedit} toggle={this.togglePPedit}>
          <ModalHeader>Form Update Product Package</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="pp_key">Product Key</Label>
                  <Input type="text" name="0" placeholder="" value={this.state.PPForm[0]} onChange={this.handleChangeForm} />
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
                  <Col xs="8">
                    <FormGroup>
                      <Label htmlFor="pp_id" >Product Number (Cust)</Label>
                      <Input type="text" name="5" placeholder="" value={this.state.PPForm[5]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="price" >Price</Label>
                      <Input type="number" name="8" placeholder="" value={this.state.PPForm[8]} onChange={this.handleChangeForm} />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="pp_group" >Product Name (Cust)</Label>
                  <Input type="text" name="6" placeholder="" value={this.state.PPForm[6]} onChange={this.handleChangeForm} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="note" >Note</Label>
                  <Input type="text" name="7" placeholder="" value={this.state.PPForm[7]} onChange={this.handleChangeForm} />
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
        <Modal isOpen={this.state.modal_loading} toggle={this.toggleLoading} className={'modal-sm ' + this.props.className + ' loading '}>
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

export default connect(mapStateToProps)(ConfigUpload);
