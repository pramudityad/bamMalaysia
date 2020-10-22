import React from "react";

const DefaultNotif = React.lazy(() =>
  import("../../views/DefaultView/DefaultNotif")
);
const modul_name = "HW Mapping"

class MappingHW extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenUser: this.props.dataLogin.token,
      roleUser: this.props.dataLogin.role,
      dropdownOpen: new Array(3).fill(false),
    all_data: []
    };
  }

  componentDidMount(){

  }

  exportTemplate = () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet();

    let header = [
        'LOOKUP REFERENCE',	'REGION',	'REFERENCE LOC ID',	'NEW LOC ID',	'SITE NAME',	'NEW SITE NAME',	'CONFIG',	'PO#',	'LINE',	'DESCRIPTION',	'QTY',	'NW#',	'CNI DATE',	'MAPPING DATE',	'REMARKS',	'PREMR NO.',	'PROCEED BILLING 100%',	'CELCOM USER',	'PCODE',	'UNIT PRICE',	'TOTAL PRICE',	'DISCOUNTED UNIT PRICE',	'DISCOUNTED PO PRICE',	'SO LINE ITEM DESCRIPTION',	'sitePCode',	'VlookupWBS',	'SO NO.',	'WBS  NO.',	'FOR CHECKING PURPOSE ONLY-RASHIDAH',	'HW COA RECEIVED DATE',	'80% BILLING UPON HW COA',	
        '80% INVOICING NO.','80% INVOICING DATE',	'NI COA DATE (VLOOKUP FROM SERVICES MAPPING)',	'20% BILLING UPON NI',	'20% INVOICING NO.',	'20% INVOICING DATE',	'SSO COA DATE (VLOOKUP FROM SERVICES MAPPING)',	'20% BILLING UPON SSO',	'20% INVOICING NO.',	'20% INVOICING DATE',	'GR NUMBER',	'HW COA RECEIVED DATE',	'40% BILLING UPON COA HW','40% INVOICING NO.','40% INVOICING DATE','Cancelled',	'NI COA date (vlookup from SERVICES MAPPING)',	'40% BILLING UPON COA NI','40% INVOICING  Number','40% INVOICING DATE','Cancelled',	'SSO COA date (vlookup from SERVICES MAPPING)',	'20% BILLING UPON COA SSO',	'20% INVOICING NO.','20% INVOICING DATE','Cancelled',	'Vlookup: SSO 100% in Service (20% in HW)',	'100%  HW COA ',	'100% BILLING UPON HW COA',	'100% INVOICING NO.',
        '100% INVOICING DATE','REFERENCE LOC ID',	'PO#',	'REFF',	'SITE LIST',	'REFF 2',	'NI',	'SSO',	'REF NI',
    ];

    ws.addRow(header);
    for (let i = 1; i < header.length + 1; i++) {
      ws.getCell(numToSSColumn(i) + '1').fill = { type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFFFFF00'},
      bgColor:{argb:'A9A9A9'}};
    }
    const PPFormat = await wb.xlsx.writeBuffer();
    saveAs(new Blob([PPFormat]), modul_name + " Template.xlsx");

  }

  render(){
      return(
          <div className="animated fadeIn">
              <DefaultNotif
          actionMessage={this.state.action_message}
          actionStatus={this.state.action_status}
        />
        <Row>
            
        </Row>
          </div>
      )
  }
}
