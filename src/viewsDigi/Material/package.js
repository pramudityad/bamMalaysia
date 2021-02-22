import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
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
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import { getDatafromAPINODE } from "../../helper/asyncFunction";
import debounce from 'lodash.debounce';
import '../MYAssignment/LMRMY.css';

const package_example = [
  {
    package_id: "0001",
    package_name: "Package123",
    region: "KV",
    material_list: [
      {
        mm_code: "ECM-DG-NEW2.1-KV",
        description: "Description of ECM-DG-NEW2.1-KV",
        price: 1000,
        qty: 1
      },
      {
        mm_code: "ECM-DG-KV-ADD5.1",
        description: "Description of ECM-DG-KV-ADD5.1",
        price: 2000,
        qty: 2
      },
      {
        mm_code: "ECM-DG-KV-DOCONLY",
        description: "Description of ECM-DG-KV-DOCONLY",
        price: 3000,
        qty: 3
      }
    ]
  },
  {
    package_id: "0002",
    package_name: "Package234",
    region: "KV",
    material_list: [
      {
        mm_code: "Material1",
        description: "Description of Material1",
        price: 2000,
        qty: 1
      },
      {
        mm_code: "Material2",
        description: "Description of Material2",
        price: 4000,
        qty: 2
      },
      {
        mm_code: "Material3",
        description: "Description of Material3",
        price: 6000,
        qty: 3
      }
    ]
  }
]

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
      check_material_package_list: {},
      create_package_parent: {},
      create_package_child: [],
      modal_check_material_package: false,
      modal_create_package: false,
      modal_material: false,
      filter_list_material: new Array(5).fill(""),
      material_list: [],
      current_material_select: null,
      prevPage: 0,
      activePage: 1,
      totalData: 0,
      perPage: 10,
      prevPage_material: 0,
      activePage_material: 1,
      totalData_material: 0,
      perPage_material: 10,
    }

    this.onChangeDebouncedMaterial = debounce(this.onChangeDebouncedMaterial, 500);
  }

  getPackageList() {
    this.setState({ package_list: package_example });
  }

  handleCheckMaterialPackage = (e) => {
    const value = e.target.value;
    let selectedPackage = this.state.package_list.find((e) => e.package_id === value);
    let allMaterials = [];
    for (let i = 0; i < selectedPackage.material_list.length; i++) {
      let material = {
        mm_code: selectedPackage.material_list[i].mm_code,
        description: selectedPackage.material_list[i].description,
        price: selectedPackage.material_list[i].price,
        qty: selectedPackage.material_list[i].qty
      }
      allMaterials.push(material)
    }
    let check_material_package_list = {
      package_id: selectedPackage.package_id,
      package_name: selectedPackage.package_name,
      region: selectedPackage.region,
      materials: allMaterials
    }
    this.setState({ check_material_package_list: check_material_package_list }, () => this.toggleModalCheckMaterialPackage());
  }

  addMaterial = () => {
    let material_list = this.state.create_package_child;
    material_list.push({});
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
    filter_array.push('"Region":"' + this.state.create_package_parent.region + '"');
    this.state.filter_list_material[4] !== "" && (filter_array.push('"Material_Type":{"$regex" : "' + this.state.filter_list_material[4] + '", "$options" : "i"}'));
    let whereAnd = "{" + filter_array.join(",") + "}";
    getDatafromAPINODE("/mmCodeDigi/getMm?q=" + whereAnd + "&lmt=" + this.state.perPage_material + "&pg=" + this.state.activePage_material, this.state.tokenUser).then((res) => {
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
    create_package_child[parseInt(this.state.current_material_select)]["mm_code"] = data_material.MM_Code;
    create_package_child[parseInt(this.state.current_material_select)]["description"] = data_material.MM_Description;
    create_package_child[parseInt(this.state.current_material_select)]["unit_price"] = data_material.Unit_Price;
    create_package_child[parseInt(this.state.current_material_select)]["qty"] = 0;
    this.setState({ create_package_child: create_package_child });
    this.toggleModalMaterial();
  }

  handleChangeFormPackageChild = (e) => {
    let create_package_child = this.state.create_package_child;
    let idxField = e.target.name.split(" /// ");
    let value = e.target.value;
    let idx = idxField[0];
    let field = idxField[1];

    create_package_child[parseInt(idx)][field] = value;
    this.setState({ create_package_child: create_package_child }, () =>
      console.log(this.state.create_package_child)
    );
  }

  onChangeDebouncedMaterial(e) {
    this.materialSelection();
  }

  componentDidMount() {
    this.getPackageList();
    document.title = "Package List | BAM";
  }

  loopSearchBar = () => {
    let searchBar = [];
    for (let i = 0; i < 3; i++) {
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
    for (let i = 0; i < 5; i++) {
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
        <Row>
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
                      <th style={{ minWidth: "100px", verticalAlign: "middle" }} rowSpan="2">Action</th>
                      <th style={{ minWidth: "150px" }}>Package ID</th>
                      <th style={{ minWidth: "150px" }}>Package Name</th>
                      <th style={{ minWidth: "150px" }}>Region</th>
                    </tr>
                    <tr>
                      {this.loopSearchBar()}
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
                              value={e.package_id}
                              onClick={this.handleCheckMaterialPackage}
                            >
                              <i className="fa fa-cubes" style={{ marginRight: "8px" }}></i>Check Material
                          </Button>
                          </td>
                          <td>{e.package_id}</td>
                          <td>{e.package_name}</td>
                          <td>{e.region}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div style={{ margin: "8px 0px" }}>
                  <small>
                    Showing {this.state.package_list.length} entries
                  </small>
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
                <strong>Package ID</strong> : {this.state.check_material_package_list.package_id}<br />
                <strong>Package Name</strong> : {this.state.check_material_package_list.package_name}<br />
                <strong>Region</strong> : {this.state.check_material_package_list.region}<br /><br />
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
                    this.state.check_material_package_list.materials !== undefined &&
                    this.state.check_material_package_list.materials.map((e) => (
                      <tr>
                        <td>{e.mm_code}</td>
                        <td>{e.description}</td>
                        <td>{e.price}</td>
                        <td>{e.qty}</td>
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
          className={"modal-lg"}
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
                      name="package_name"
                      placeholder="Input Package Name"
                      onChange={this.handleChangeFormPackageParent}
                      value={this.state.create_package_parent.package_name}
                      disabled={this.state.create_package_child.length > 0}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Region</Label>
                    <Input
                      type="select"
                      name="region"
                      onChange={this.handleChangeFormPackageParent}
                      value={this.state.create_package_parent.region}
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
              </Row>
              <strong><h6 style={{ marginTop: "16px" }}>Choose Materials</h6></strong>
              <hr className="upload-line--lmr"></hr>
              {this.state.create_package_child.map((mat, i) => (
                <Row>
                  <Col md={3}>
                    <FormGroup>
                      <Label>MM Code</Label>
                      <Input
                        type="text"
                        name={i + " /// mm_code"}
                        id={i + " /// mm_code"}
                        value={mat.mm_code}
                        onClick={() => this.toggleModalMaterial(i)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Description</Label>
                      <Input
                        type="text"
                        name={i + " /// description"}
                        id={i + " /// description"}
                        value={mat.description}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name={i + " /// unit_price"}
                        id={i + " /// unit_price"}
                        value={mat.unit_price}
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
                        name={i + " /// qty"}
                        id={i + " /// qty"}
                        value={mat.qty}
                        onChange={this.handleChangeFormPackageChild}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              ))}
              <Button color="primary" size="sm" onClick={this.addMaterial} disabled={this.state.create_package_parent.package_name === undefined || this.state.create_package_parent.package_name === "" || this.state.create_package_parent.region === undefined || this.state.create_package_parent.region === ""}>
                <i className="fa fa-plus">&nbsp;</i> Add Material
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
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