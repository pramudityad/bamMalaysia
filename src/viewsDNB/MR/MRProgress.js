import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Table } from 'reactstrap';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const API_URL = 'https://api.smart.pdb.e-dpm.com/smartapi';
const username = 'usermitt';
const password = 'Z4icVgFQp3D1';

const API_URL_BAM = 'https://api-dev.bam-id.e-dpm.com/bamidapi';
const usernameBAM = 'bamidadmin@e-dpm.com';
const passwordBAM = 'F760qbAg2sml';

class MRProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data_mr : null
    }
    this.getDatafromAPIBAM = this.getDatafromAPIBAM.bind(this)
  }

  async getDataFromAPI(url) {
    try {
      let response = await axios.get(API_URL+url, {
        headers: {'Content-Type':'application/json'},
        auth: {
          username: username,
          password: password
        }
      });

      return response;
    } catch(err) {
      return err;
    }
  }

  async getDatafromAPIBAM(url){
    try {
      let respond = await axios.get(API_URL_BAM +url, {
        headers : {'Content-Type':'application/json'},
        auth: {
          username: usernameBAM,
          password: passwordBAM
        },
      })
      if(respond.status >= 200 && respond.status < 300){
        console.log("respond Get Data", respond);
      }
      return respond;
    }catch (err) {
      let respond = err;
      console.log("respond Get Data", err);
      return respond;
    }
  }

  getMRProgress(_id_MR)
  {
    this.getDatafromAPIBAM('/mr_op/'+_id_MR).then(resMR => {
      if(resMR.data !== undefined){
        this.setState({ data_mr : resMR.data })
        console.log('milestones nya ', this.state.data_mr.mr_milestones)
      }
    })
  }

  milestoneStat(ms_name, ms_date, ms_updater, index)
  {
    switch ( ms_name )
    {
      case 'MS_ORDER_CREATED':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Order Created</h3>
          <h4 className="vertical-timeline-element-subtitle">by <b>{ms_updater}</b></h4>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
      case 'MS_ORDER_RECEIVED':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Order Received</h3>
          <h4 className="vertical-timeline-element-subtitle">by <b>{ms_updater}</b></h4>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
      case 'MS_ORDER_PROCESSING':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Order Processing</h3>
          <h4 className="vertical-timeline-element-subtitle">by <b>{ms_updater}</b></h4>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
      case 'MS_READY_TO_DELIVER':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(227, 30, 16)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Ready to Deliver</h3>
          <h4 className="vertical-timeline-element-subtitle">confirmed by <b>{ms_updater}</b></h4>
        </VerticalTimelineElement>;
      case 'MS_JOINT_CHECK':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Joint Check</h3>
          <h4 className="vertical-timeline-element-subtitle">initiated by <b>{ms_updater}</b></h4>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
      case 'MS_LOADING_PROCESS':
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={ms_date}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Loading Process</h3>
          <h4 className="vertical-timeline-element-subtitle">initiated by <b>{ms_updater}</b></h4>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
      default:
        return <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date=""
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

      >
          <h3 className="vertical-timeline-element-title">Data not available</h3>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra ut mauris.
          </p>
        </VerticalTimelineElement>;
    }
  }

  componentDidMount() {
    this.getMRProgress(this.props.match.params.id);
    document.title = 'MR Progress Overview | BAM';
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const background = {
      backgroundColor: '#e3e3e3',
    };

    console.log("di render", this.state.data_mr);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                {this.state.data_mr !== null &&
                  <span> Progress Overview for <b>{this.state.data_mr.mr_id}</b> </span>
                }
              </CardHeader>
              <CardBody
                style={background}
              >
                <VerticalTimeline>
                  {this.state.data_mr !== null &&
                    this.state.data_mr.mr_milestones.map((ms, i) => {
                      return this.milestoneStat(ms.ms_name, ms.ms_date, ms.ms_updater, i)
                    })
                  }
                </VerticalTimeline>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MRProgress;
