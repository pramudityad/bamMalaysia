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
  Form,
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
  apiSendEmail,
} from "../../../helper/asyncFunction";
import "../../../helper/config";
import { connect } from "react-redux";
import "../cpomapping.css";
const DefaultNotif = React.lazy(() =>
  import("../../../views/DefaultView/DefaultNotif")
);
const modul_name = "SVC";

class SVCEdit extends React.PureComponent {
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
      "/cpoMapping/getCpo/required/svc/" + _id,
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
    let error_containers = [];
    let warn_containers = [];
    this.toggleLoading();
    let uniq_value = Object.keys(this.state.CPOForm)
      .filter((key) => ["Po", "Line", "Reference_Loc_Id", "Qty"].includes(key))
      .reduce((obj, key) => {
        obj[key] = this.state.CPOForm[key];
        return obj;
      }, {});
    const allowed_header =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true ||
      this.state.roleUser.includes("BAM-IM") === true ||
      this.state.roleUser.includes("BAM-IE") === true
        ? global.config.cpo_mapping.svc.header_materialmapping
        : this.state.roleUser.includes("BAM-PFM") === true
        ? global.config.cpo_mapping.svc.header_pfm
        : global.config.cpo_mapping.svc.header_admin;
    const header_post =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true ||
      this.state.roleUser.includes("BAM-IM") === true ||
      this.state.roleUser.includes("BAM-IE") === true
        ? global.config.cpo_mapping.svc.header_materialmapping
        : this.state.roleUser.includes("BAM-PFM") === true
        ? global.config.cpo_mapping.svc.header_pfm.concat(
            "Reference_Loc_Id",
            "Po",
            "Line",
            "Qty"
          )
        : global.config.cpo_mapping.svc.header_admin.concat(
            "Reference_Loc_Id",
            "Po",
            "Line",
            "Qty"
          );
    const roles =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true ||
      this.state.roleUser.includes("BAM-IM") === true ||
      this.state.roleUser.includes("BAM-IE") === true
        ? 1
        : this.state.roleUser.includes("BAM-PFM") === true
        ? 2
        : 3;
    const filtered = Object.keys(this.state.CPOForm)
      .filter((key) => allowed_header.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.state.CPOForm[key];
        return obj;
      }, {});
    const reqBody_post =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true ||
      this.state.roleUser.includes("BAM-IM") === true ||
      this.state.roleUser.includes("BAM-IE") === true
        ? Object.values(filtered)
        : Object.values(filtered).concat(Object.values(uniq_value));

    console.log(reqBody_post);
    const res = await postDatatoAPINODE(
      "/cpoMapping/createCpo2",
      {
        cpo_type: "svc",
        roles: roles,
        cpo_data: [header_post, reqBody_post],
      },
      this.state.tokenUser
    );
    if (
      res.response !== undefined &&
      res.response.data !== undefined &&
      res.response.data.error !== undefined
    ) {
      let err_data = res.response.data.error.message;
      // if (err_data !== undefined) {
      error_containers.push(err_data.message);
      // }
    }
    if (res.data !== undefined) {
      if (roles === 2) {
        this.toggleLoading();
      } else {
        if (res.data.updateData.length !== 0) {
          const table_header = Object.keys(res.data.updateData[0]);
          const update_Data = res.data.updateData;
          const new_table_header = table_header.slice(0, -2);
          let value = "row.";
          const bodyEmail =
            "<h2>DPM - BAM Notification</h2><br/><span>Please be notified that the following " +
            modul_name +
            " data has been updated <br/><br/><table><tr>" +
            new_table_header.map((tab, i) => "<th>" + tab + "</th>").join(" ") +
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
          // if (res.data.warnNotif.length !== 0) {
          //   let dataEmail = {
          //     // "to": creatorEmail,
          //     // to: "damar.pramuditya@ericsson.com",
          //     to: global.config.role.cpm,
          //     subject: "[NOTIFY to CPM] " + modul_name,
          //     body: bodyEmail,
          //   };
          //   const sendEmail = await apiSendEmail(dataEmail);

          //   // console.log(sendEmail);
          //   // this.setState({
          //   //   action_status: "warning",
          //   //   action_message:
          //   //     "Success with warn " +
          //   //     res.data.warnNotif.map((warn) => warn) +
          //   //     " batch ",
          //   // });
          //   // this.toggleLoading();
          //   // return;
          //   // setTimeout(function () {
          //   //   window.location.reload();
          //   // }, 1500);
          // }
          let dataEmail = {
            // "to": creatorEmail,
            // to: "damar.pramuditya@ericsson.com",
            to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);

          // console.log(sendEmail);
          this.toggleLoading();
          /**
           *  push errors to array
           */
          if (res.data.errNotif.length !== 0) {
            for (let in_err = 0; in_err < res.data.errNotif.length; in_err++) {
              let acc_line = this.state.batch_count;
              let err_data = res.data.errNotif[in_err];
              // console.log("before ", err_data);
              err_data.row = acc_line + err_data.line + 1;
              err_data.message = err_data.message.message;
              // console.log("after ", err_data);
              error_containers.push(err_data);
            }
          }
          if (res.data.warnNotif.length !== 0) {
            for (
              let in_warn = 0;
              in_warn < res.data.warnNotif.length;
              in_warn++
            ) {
              let warn_data = res.data.warnNotif[in_warn];

              warn_containers.push(warn_data);
            }
          }
        } else {
          this.toggleLoading();
          /**
           *  push errors to array
           */
          if (res.data.errNotif.length !== 0) {
            for (let in_err = 0; in_err < res.data.errNotif.length; in_err++) {
              let acc_line = this.state.batch_count;
              let err_data = res.data.errNotif[in_err];
              // console.log("before ", err_data);
              err_data.row = acc_line + err_data.line + 1;
              err_data.message = err_data.message.message;
              // console.log("after ", err_data);
              error_containers.push(err_data);
            }
          }
          if (res.data.warnNotif.length !== 0) {
            for (
              let in_warn = 0;
              in_warn < res.data.warnNotif.length;
              in_warn++
            ) {
              let warn_data = res.data.warnNotif[in_warn];

              warn_containers.push(warn_data);
            }
          }
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
            action_message: res.response.data.error.message,
          });
        } else {
          this.setState({
            action_status: "failed",
            action_message: res.response.data.error,
          });
        }
      } else {
        this.setState({
          action_status: "failed",
          action_message: res.response.data.error,
        });
      }
      this.toggleLoading();
    }
    if (error_containers.length !== 0 || warn_containers.length !== 0) {
      this.setState({
        error_log: error_containers,
        warn_log: warn_containers,
        upload_finish: true,
        action_message:
          "There are error(s) and/or warning(s) please toogle the button",
        action_status: "failed",
      });
    } else {
      this.setState({
        action_message: "Success update",
        action_status: "success",
      });
    }
  };

  toggleLoading = () => {
    this.setState((prevState) => ({
      modal_loading: !prevState.modal_loading,
    }));
  };

  render() {
    const CPOForm = this.state.CPOForm;
    const render_field =
      this.state.roleUser.includes("BAM-MAT PLANNER") === true ||
      this.state.roleUser.includes("BAM-IM") === true ||
      this.state.roleUser.includes("BAM-IE") === true
        ? global.config.cpo_mapping.svc.header_materialmapping
        : this.state.roleUser.includes("BAM-PFM") === true
        ? global.config.cpo_mapping.svc.header_pfm.concat(
            "Po",
            "Line",
            "Reference_Loc_Id",
            "Qty"
          )
        : global.config.cpo_mapping.svc.header_admin.concat(
            "Po",
            "Line",
            "Reference_Loc_Id",
            "Qty"
          );
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
                  {render_field.map((head_model, j) => (
                    <Col sm="12">
                      <Form>
                        <FormGroup row>
                          <Label sm={4}>{head_model}</Label>
                          <Col sm={8}>
                            {head_model === "Po" ||
                            head_model === "Line" ||
                            head_model === "Reference_Loc_Id" ||
                            head_model === "Qty" ? (
                              <Input
                                readOnly
                                type="text"
                                name={head_model}
                                placeholder={head_model}
                                value={eval("CPOForm." + head_model)}
                                onChange={this.handleChangeForm}
                              />
                            ) : (
                              <Input
                                type="text"
                                name={head_model}
                                placeholder={head_model}
                                value={eval("CPOForm." + head_model)}
                                onChange={this.handleChangeForm}
                              />
                            )}
                          </Col>
                        </FormGroup>
                      </Form>
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

export default connect(mapStateToProps)(SVCEdit);
