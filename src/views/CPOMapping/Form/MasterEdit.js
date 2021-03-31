import React from "react";
import {
  Col,
  FormGroup,
  Label,
  Row,
  Table,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Form,
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
const modul_name = "Summary Master";

class SummaryMaster extends React.PureComponent {
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
      "/summaryMaster/getSummaryMaster/" + _id,
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
    const res = await postDatatoAPINODE(
      "/summaryMaster/createSummaryMaster",
      {
        line_item_data: [this.state.CPOForm],
      },
      this.state.tokenUser
    );
    if (res.data !== undefined) {
      if (res.data.data.length !== 0) {
        // new Data
        const new_table_header = Object.keys(res.data.data[0]).slice(2, -8);
        const new_Data = res.data.data;
        let value = "row.";
        const body_new =
          "<br/><span>The following " +
          modul_name +
          " data has been successfully created </span><br/><br/><table><tr>" +
          new_table_header.map((tab, i) => "<th>" + tab + "</th>").join(" ") +
          "</tr>" +
          new_Data
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
        // updated Data
        if (res.data.updateData.length !== 0) {
          const updated_table_header = Object.keys(
            res.data.updateData[0]
          ).slice(0, -3);
          const update_Data = res.data.updateData;
          const body_updated =
            "<br/><span>Please be notified that the following " +
            modul_name +
            " data has been updated </span><br/><br/><table><tr>" +
            updated_table_header
              .map((tab, i) => "<th>" + tab + "</th>")
              .join(" ") +
            "</tr>" +
            update_Data
              .map(
                (row, j) =>
                  "<tr key={" +
                  j +
                  "}>" +
                  updated_table_header
                    .map((td) => "<td>" + eval(value + td) + "</td>")
                    .join(" ") +
                  "</tr>"
              )
              .join(" ") +
            "</table>";

          const bodyEmail =
            "<h2>DPM - BAM Notification</h2>" + body_new + body_updated;
          let dataEmail = {
            to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } else {
          const bodyEmail = "<h2>DPM - BAM Notification</h2>" + body_new;
          let dataEmail = {
            to: global.config.role.cpm,
            subject: "[NOTIFY to CPM] " + modul_name,
            body: bodyEmail,
          };
          const sendEmail = await apiSendEmail(dataEmail);
          this.setState({ action_status: "success" });
          this.toggleLoading();
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        }
      } else {
        // updated Data
        const updated_table_header = Object.keys(res.data.updateData[0]).slice(
          0,
          -3
        );
        const update_Data = res.data.updateData;
        let value = "row.";
        const body_updated =
          "<br/><span>Please be notified that the following " +
          modul_name +
          " data has been updated </span><br/><br/><table><tr>" +
          updated_table_header
            .map((tab, i) => "<th>" + tab + "</th>")
            .join(" ") +
          "</tr>" +
          update_Data
            .map(
              (row, j) =>
                "<tr key={" +
                j +
                "}>" +
                updated_table_header
                  .map((td) => "<td>" + eval(value + td) + "</td>")
                  .join(" ") +
                "</tr>"
            )
            .join(" ") +
          "</table>";

        const bodyEmail = "<h2>DPM - BAM Notification</h2>" + body_updated;
        const dataEmail = {
          to: global.config.role.cpm,
          subject: "[NOTIFY to CPM] " + modul_name,
          body: bodyEmail,
        };
        const sendEmail = await apiSendEmail(dataEmail);
        this.setState({ action_status: "success" });
        this.toggleLoading();
        setTimeout(function () {
          window.location.reload();
        }, 1500);
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
                  {global.config.cpo_mapping.master.header_model.map(
                    (head_model, j) => (
                      <Col sm="12">
                        <Form>
                          <FormGroup row>
                            <Label sm={4}>{head_model}</Label>
                            <Col sm={8}>
                              <Input
                                type="text"
                                name={head_model}
                                placeholder={head_model}
                                value={eval("CPOForm." + head_model)}
                                onChange={this.handleChangeForm}
                              />
                            </Col>
                          </FormGroup>
                        </Form>
                      </Col>
                    )
                  )}
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

export default connect(mapStateToProps)(SummaryMaster);
