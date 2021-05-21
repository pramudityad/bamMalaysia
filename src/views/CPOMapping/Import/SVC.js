import React from "react";
import {
  Col,
  FormGroup,
  Row,
  Table,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Modal,
  ModalBody,
  CardText,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Button,
  UncontrolledCollapse,
} from "reactstrap";
import {
  getDatafromAPINODE,
  postDatatoAPINODE,
} from "../../../helper/asyncFunction";
import { getUniqueListBy, numToSSColumn } from "../../../helper/basicFunction";

import { saveAs } from "file-saver";
import { connect } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";

const DefaultNotif = React.lazy(() =>
  import("../../../views/DefaultView/DefaultNotif")
);

const modul_name = "SVC Mapping";
class ImportSVC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
      all_data: [],
      pivot_data: [],
      createModal: false,
      rowsXLS: [],
      rowsXLS_batch: [],
      modal_loading: false,
      action_status: null,
      action_message: null,
      modal_progress: false,
      batch_file: 0,
      batch_log: "",
      upload_finish: false,
      error_log: [],
    };
  }

  fileHandlerMaterial = (input) => {
    this.setState({ batch_log: "" });
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
    this.setState({ batch_log: "Counting batch..." });
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
      () => this.chunkArray(this.state.rowsXLS, 2000)
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

  toggleLoading_batch = () => {
    this.setState((prevState) => ({
      modal_progress: !prevState.modal_progress,
    }));
  };

  saveBulk = async () => {
    // this.togglecreateModal();
    let error_containers = [];
    let line_containers = [];
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
        batch_file: index_xlsx + 1,
      });

      this.toggleLoading_batch();
      console.log(`hit ${index_xlsx + 1}`);
      const res = await postDatatoAPINODE(
        "/cpoMapping/createCpo1",
        {
          cpo_type: "svc",
          required_check: true,
          roles: roles,
          cpo_data: this.state.rowsXLS_batch[index_xlsx],
        },
        this.state.tokenUser
      );
      if (res.data !== undefined) {
        if (roles === 2) {
          this.toggleLoading_batch();
          /**
           * success notif
           */
          // if (index_xlsx === this.state.rowsXLS_batch.length - 1) {
          //   this.setState({
          //     action_status: "success",
          //     action_message:
          //       "Success upload all " +
          //       this.state.rowsXLS_batch.length +
          //       " batch",
          //   });
          // }
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
              //const sendEmail = await apiSendEmail(dataEmail);

              // console.log(sendEmail);
              this.setState({
                action_status: "warning",
                action_message:
                  "Success with warn " +
                  res.data.warnNotif.map((warn) => warn) +
                  " batch ",
              });
              this.toggleLoading_batch();
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
            //const sendEmail = await apiSendEmail(dataEmail);

            // console.log(sendEmail);
            this.toggleLoading_batch();
            /**
             * success notif
             */
            // if (index_xlsx === this.state.rowsXLS_batch.length - 1) {
            //   this.setState({
            //     action_status: "success",
            //     action_message:
            //       "Success upload all " +
            //       this.state.rowsXLS_batch.length +
            //       " batch",
            //   });
            // }
            // setTimeout(function () {
            //   window.location.reload();
            // }, 1500);

            /**
             *  push errors to array
             */
            if (res.data.errNotif.length !== 0) {
              for (
                let in_err = 0;
                in_err < res.data.errNotif.length;
                in_err++
              ) {
                error_containers.push(res.data.errNotif[in_err]);
                line_containers.push(res.data.errNotif[in_err]);
              }
              // error_containers.push(res.data.errNotif.map((err) => err));
            }
          } else {
            this.toggleLoading_batch();
            // if (index_xlsx === this.state.rowsXLS_batch.length - 1) {
            //   this.setState({
            //     action_status: "success",
            //     action_message:
            //       "Success upload all " +
            //       this.state.rowsXLS_batch.length +
            //       " batch",
            //   });
            // }
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
                res.response.data.error.message + " batch " + (index_xlsx + 1),
            });
          } else {
            this.setState({
              action_status: "failed",
              action_message:
                res.response.data.error + " batch " + (index_xlsx + 1),
            });
          }
        } else {
          this.setState({
            action_status: "failed",
            action_message:
              res.response.data.error + " batch " + (index_xlsx + 1),
          });
        }
        this.toggleLoading_batch();
        break;
      }
    }
    this.setState({
      error_log:
        // error_containers,
        error_containers.map(
          (letter) => letter.message !== undefined && letter.message.message
        ) +
        " line " +
        error_containers.map((err) => err.line),
      upload_finish: true,
    });
    console.log(this.state.error_log);
    console.log(error_containers);
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="row-alert-fixed">
          <Col xs="12" lg="12">
            <DefaultNotif
              actionMessage={this.state.action_message}
              actionStatus={this.state.action_status}
            />
          </Col>
        </Row>
        {this.state.upload_finish === false ? (
          ""
        ) : (
          <div>
            <Button
              color="warning"
              id="toggler"
              style={{ marginBottom: "1rem" }}
            >
              Toggle Log
            </Button>
            <UncontrolledCollapse toggler="#toggler">
              <Card>
                <CardBody>
                  {this.state.action_message}
                  {/* {this.state.error_log.map((err) => (
                      <span>{err}</span>
                    ))} */}
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>
        )}

        <Card>
          <CardHeader>{modul_name}</CardHeader>
          <CardBody>
            {/* <CardTitle tag="h5">Special Title Treatment</CardTitle> */}
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
                {this.state.rowsXLS_batch.length === 0
                  ? this.state.batch_log
                  : "File will be split into " +
                    this.state.rowsXLS_batch.length +
                    " batch"}
              </span>
            </div>
          </CardBody>
          <CardFooter>
            {" "}
            <Button
              size="sm"
              block
              color="success"
              className="btn-pill"
              disabled={this.state.rowsXLS_batch.length === 0}
              onClick={this.saveBulk}
              style={{ height: "30px", width: "100px" }}
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Modal Loading Batch*/}
        <Modal
          isOpen={this.state.modal_progress}
          toggle={this.toggleLoading_batch}
          className={"modal-sm modal--loading "}
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
            <div style={{ textAlign: "center" }}>
              System is processing batch {this.state.batch_file}/
              {this.state.rowsXLS_batch.length} ...
            </div>
          </ModalBody>
        </Modal>
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

export default connect(mapStateToProps)(ImportSVC);
