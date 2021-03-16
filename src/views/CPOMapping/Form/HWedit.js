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
import Loading from "../../Component/Loading";
import {
  getDatafromAPIMY,
  postDatatoAPINODE,
  patchDatatoAPINODE,
  deleteDataFromAPINODE2,
  getDatafromAPINODE,
} from "../../../helper/asyncFunction";
import "../../../helper/config";
import { connect } from "react-redux";
import "../cpomapping.css";
const DefaultNotif = React.lazy(() =>
  import("../../../views/DefaultView/DefaultNotif")
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
                  {global.config.cpo_mapping.hw.map((label, j) => (
                    <Col sm="12">
                      <FormGroup row>
                        <Label>{label}</Label>
                        <Input
                        // type="text"
                        // name="Internal_Po"
                        // placeholder=""
                        // value={CPOForm.Internal_Po}
                        // onChange={this.handleChangeForm}
                        />
                      </FormGroup>
                    </Col>
                  ))}
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
