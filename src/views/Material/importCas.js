import React from "react";

import { ExcelRenderer } from "react-excel-renderer";

class importCas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowsXLS: [],
      roles: "",
      importForm: {},
      roleform: [{ role: "" }],
    };
  }

  changeInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      (prevState) => ({ importForm: { ...prevState.newUser, [name]: value } }),
      () => console.log(this.state.importForm)
    );
  };

  handleInputRole = (idx) => (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const newData = this.state.roleform.map((data, sidx) => {
      if (idx !== sidx) return data;
      return { ...data, [name]: value, [name]: value, [name]: value };
    });

    this.setState(
      {
        roleform: newData,
      },
      () => console.log(this.state.roleform.map((name) => name.role))
    );
  };

  addRole = () => {
    this.setState({
      roleform: this.state.roleform.concat([{ role: "" }]),
    });
  };

  constructImport = (obj, type) => {
    let users = [];
    if (type === "PDB") {
      obj.map((row, i) =>
        users.push({
          _cls: "User",
          first_name: row[0].split(" ").slice(0, -1).join(" "),
          last_name: row[0].split(" ").slice(-1).join(" "),
          username: row[1],
          active: true,
          email: row[2].toLowerCase(),
          roles: this.state.roleform.map((name) => name.role),
          created_on: {
            $date: "2020-03-17T08:33:25.162Z",
          },
          changed_on: {
            $date: "2020-03-17T08:33:25.162Z",
          },
          fail_login_count: 0,
          last_login: {
            $date: "2020-12-29T13:50:08.295Z",
          },
          login_count: 0,
        })
      );
    } else {
      obj.map((row, i) =>
        users.push({
          email: row[2],
          enabled: "true",
          username: row[1].toLowerCase(),
          firstName: row[0].split(" ").slice(0, -1).join(" "),
          lastName: row[0].split(" ").slice(-1).join(" "),
          credentials: [
            {
              temporary: true,
              type: "password",
              value: "Ericsson1!",
            },
          ],
          requiredActions: ["Update_Password"],
          realmRoles: ["offline_access", "uma_authorization"],
        })
      );
    }
    // let cas = {
    //   email: row[2],
    //   enabled: "true",
    //   username: row[1],
    //   firstName: row[0].split(" ").slice(0, -1).join(" "),
    //   lastName: row[0].split(" ").slice(-1).join(" "),
    //   credentials: [
    //     {
    //       temporary: true,
    //       type: "password",
    //       value: "Ericsson1!",
    //     },
    //   ],
    //   requiredActions: ["Update_Password"],
    //   realmRoles: ["offline_access", "uma_authorization"],
    // };
    // let pdb = {
    //   _cls: "User",
    //   first_name: row[0].split(" ").slice(0, -1).join(" "),
    //   last_name: row[0].split(" ").slice(-1).join(" "),
    //   username: row[1],
    //   active: true,
    //   email: row[2],
    //   roles: [],
    //   created_on: {
    //     $date: "2020-03-17T08:33:25.162Z",
    //   },
    //   changed_on: {
    //     $date: "2020-03-17T08:33:25.162Z",
    //   },
    //   fail_login_count: 0,
    //   last_login: {
    //     $date: "2020-12-29T13:50:08.295Z",
    //   },
    //   login_count: 0,
    // };

    console.log(users);
  };

  fileHandlerMaterial = (event) => {
    let fileObj = event.target.files[0];
    if (fileObj !== undefined) {
      ExcelRenderer(fileObj, (err, rest) => {
        if (err) {
          console.log(err);
        } else {
          //   console.log("rest.rows", JSON.stringify(rest.rows));
          this.setState(
            {
              rowsXLS: rest.rows,
            },
            () => this.constructImport(this.state.rowsXLS)
          );
        }
      });
    }
  };

  render() {
    return (
      <>
        <div>
          <label>export type</label>{" "}
          <select
            name="type_form"
            value={this.state.importForm.type_form}
            onChange={this.changeInput}
          >
            <option value={null} selected></option>
            <option value="PDB">PDB</option>
            <option value="CAS">CAS</option>
          </select>
        </div>
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

        <div>
          {this.state.importForm.type_form === "PDB"
            ? this.state.roleform.map((roles, j) => (
                <>
                  <label>Role PDB {j} </label>{" "}
                  <input
                    type="text"
                    name="role"
                    onChange={this.handleInputRole(j)}
                    value={roles.role}
                  />
                  <button onClick={this.addRole}>Add role</button>
                </>
              ))
            : ""}
        </div>
      </>
    );
  }
}

export default importCas;
