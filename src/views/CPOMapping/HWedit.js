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
} from "reactstrap";
import Loading from "../Component/Loading";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
} from "../../helper/asyncFunction";

import { connect } from "react-redux";
import "./cpomapping.css";
const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);
const modul_name = "HW";

class HWEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      modal_loading: false,
      CPOForm: {},
      action_status: null,
      action_message: null,
    };
  }

  componentDidMount() {
    this.getListID(this.props.match.params.id);
  }

  getListID(_id) {
    getDatafromAPINODE(
      "/cpoMapping/getCpo/hw/" + _id,
      this.state.tokenUser
    ).then((res) => {
      if (res.data !== undefined) {
        const items = res.data.data;
        this.setState({ CPOForm: items });
      }
    });
  }

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
    this.toggleLoading();
    const res = await patchDatatoAPINODE(
      "/cpoMapping/updateCpo",
      {
        cpo_type: "hw",
        data: [this.state.CPOForm],
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

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  render() {
    const role = this.state.roleUser;
    const CPOForm = this.state.CPOForm;
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
                {" "}
                Edit {modul_name + " " + CPOForm.unique_code}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      {/* <Col>
                        <FormGroup>
                          <Label>Link</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              type="text"
                              name="Link"
                              placeholder=""
                              value={CPOForm.Link}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              readOnly
                              type="text"
                              name="Link"
                              placeholder=""
                              value={CPOForm.Link}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col> */}
                      <Col>
                        <FormGroup>
                          <Label>Lookup_Reference</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Lookup_Reference"
                              placeholder=""
                              value={CPOForm.Lookup_Reference}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Lookup_Reference"
                              placeholder=""
                              value={CPOForm.Lookup_Reference}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>REGION</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Region"
                              placeholder=""
                              value={CPOForm.Region}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Region"
                              placeholder=""
                              value={CPOForm.Region}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>REFERENCE LOC ID</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Reference_Loc_Id"
                              placeholder=""
                              value={CPOForm.Reference_Loc_Id}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Reference_Loc_Id"
                              placeholder=""
                              value={CPOForm.Reference_Loc_Id}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      {/* <Col>
                        <FormGroup>
                          <Label>NEW LOC ID</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="New_Loc_Id"
                              placeholder=""
                              value={CPOForm.New_Loc_Id}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="New_Loc_Id"
                              placeholder=""
                              value={CPOForm.New_Loc_Id}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col> */}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      <Col>
                        <FormGroup>
                          <Label>SITE NAME</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              type="text"
                              name="Site_Name"
                              placeholder=""
                              value={CPOForm.Site_Name}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              readOnly
                              type="text"
                              name="Site_Name"
                              placeholder=""
                              value={CPOForm.Site_Name}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      {/* <Col>
                        <FormGroup>
                          <Label>REGION</Label>
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
                      </Col> */}
                      <Col>
                        <FormGroup>
                          <Label>New_Site_Name</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="New_Site_Name"
                              placeholder=""
                              value={CPOForm.New_Site_Name}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="New_Site_Name"
                              placeholder=""
                              value={CPOForm.New_Site_Name}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
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
                      <Col>
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
                      <Col>
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
                      <Col>
                        <FormGroup>
                          <Label>Description</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Description"
                              placeholder=""
                              value={CPOForm.Description}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Description"
                              placeholder=""
                              value={CPOForm.Description}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      <Col>
                        <FormGroup>
                          <Label>Qty</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              type="number"
                              name="Qty"
                              placeholder=""
                              value={CPOForm.Qty}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              readOnly
                              type="number"
                              name="Qty"
                              placeholder=""
                              value={CPOForm.Qty}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>NW</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="NW"
                              placeholder=""
                              value={CPOForm.NW}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="NW"
                              placeholder=""
                              value={CPOForm.NW}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>CNI_Date</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="date"
                              name="CNI_Date"
                              placeholder=""
                              defaultValue={CPOForm.CNI_Date}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="date"
                              name="CNI_Date"
                              placeholder=""
                              defaultValue={CPOForm.CNI_Date}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Mapping_Date</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="date"
                              name="Mapping_Date"
                              placeholder=""
                              value={CPOForm.Mapping_Date}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="date"
                              name="Mapping_Date"
                              placeholder=""
                              value={CPOForm.Mapping_Date}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Remarks</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Remarks"
                              placeholder=""
                              value={CPOForm.Remarks}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Remarks"
                              placeholder=""
                              value={CPOForm.Remarks}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      <Col>
                        <FormGroup>
                          <Label>Premr_No</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              type="text"
                              name="Premr_No"
                              placeholder=""
                              value={CPOForm.Premr_No}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              readOnly
                              type="text"
                              name="Premr_No"
                              placeholder=""
                              value={CPOForm.Premr_No}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Proceed_Billing_100</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Proceed_Billing_100"
                              placeholder=""
                              value={CPOForm.Proceed_Billing_100}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Proceed_Billing_100"
                              placeholder=""
                              value={CPOForm.Proceed_Billing_100}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Celcom_User</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Celcom_User"
                              placeholder=""
                              value={CPOForm.Celcom_User}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Celcom_User"
                              placeholder=""
                              value={CPOForm.Celcom_User}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Pcode</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Pcode"
                              placeholder=""
                              value={CPOForm.Pcode}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Pcode"
                              placeholder=""
                              value={CPOForm.Pcode}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Unit_Price</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Unit_Price"
                              placeholder=""
                              value={CPOForm.Unit_Price}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Unit_Price"
                              placeholder=""
                              value={CPOForm.Unit_Price}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Total_Price</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Total_Price"
                              placeholder=""
                              value={CPOForm.Total_Price}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Total_Price"
                              placeholder=""
                              value={CPOForm.Total_Price}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Discounted_Unit_Price</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Discounted_Unit_Price"
                              placeholder=""
                              value={CPOForm.Discounted_Unit_Price}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Discounted_Unit_Price"
                              placeholder=""
                              value={CPOForm.Discounted_Unit_Price}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Discounted_Po_Price</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Discounted_Po_Price"
                              placeholder=""
                              value={CPOForm.Discounted_Po_Price}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Discounted_Po_Price"
                              placeholder=""
                              value={CPOForm.Discounted_Po_Price}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <FormGroup row>
                      <Col>
                        <FormGroup>
                          <Label>So_Line_Item_Description</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              type="text"
                              name="So_Line_Item_Description"
                              placeholder=""
                              value={CPOForm.So_Line_Item_Description}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              readOnly
                              type="text"
                              name="So_Line_Item_Description"
                              placeholder=""
                              value={CPOForm.So_Line_Item_Description}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Sitepcode</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="Sitepcode"
                              placeholder=""
                              value={CPOForm.Sitepcode}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="Sitepcode"
                              placeholder=""
                              value={CPOForm.Sitepcode}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>VlookupWbs</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="VlookupWbs"
                              placeholder=""
                              value={CPOForm.VlookupWbs}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="VlookupWbs"
                              placeholder=""
                              value={CPOForm.VlookupWbs}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>So_No</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="text"
                              name="So_No"
                              placeholder=""
                              value={CPOForm.So_No}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="text"
                              name="So_No"
                              placeholder=""
                              value={CPOForm.So_No}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Wbs_No</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Wbs_No"
                              placeholder=""
                              value={CPOForm.Wbs_No}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Wbs_No"
                              placeholder=""
                              value={CPOForm.Wbs_No}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>For_Checking_Purpose_Only_Rashidah</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="For_Checking_Purpose_Only_Rashidah"
                              placeholder=""
                              value={CPOForm.For_Checking_Purpose_Only_Rashidah}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="For_Checking_Purpose_Only_Rashidah"
                              placeholder=""
                              value={CPOForm.For_Checking_Purpose_Only_Rashidah}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Hw_Coa_Received_Date</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Hw_Coa_Received_Date_80"
                              placeholder=""
                              value={CPOForm.Hw_Coa_Received_Date_80}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Hw_Coa_Received_Date_80"
                              placeholder=""
                              value={CPOForm.Hw_Coa_Received_Date_80}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>Billing_Upon_Hw_Coa_80</Label>
                          {role.includes("BAM-IM") === true ? (
                            <Input
                              readOnly
                              type="number"
                              name="Billing_Upon_Hw_Coa_80"
                              placeholder=""
                              value={CPOForm.Billing_Upon_Hw_Coa_80}
                              onChange={this.handleChangeForm}
                            />
                          ) : (
                            <Input
                              type="number"
                              name="Billing_Upon_Hw_Coa_80"
                              placeholder=""
                              value={CPOForm.Billing_Upon_Hw_Coa_80}
                              onChange={this.handleChangeForm}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button color="success" onClick={this.saveUpdate}>
                  Update
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

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

export default connect(mapStateToProps)(HWEdit);
