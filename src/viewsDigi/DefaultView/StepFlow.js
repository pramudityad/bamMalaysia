import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, input } from 'reactstrap';
import axios from 'axios';
import classNames from 'classnames';

import './defaultview.css';

const API_URL = 'https://api-dev.smart.pdb.e-dpm.com/smartapi';
const usernamePhilApi = 'pdbdash';
const passwordPhilApi = 'rtkO6EZLkxL1';

const propTypes = {
    materialSign : PropTypes.bool,
    technicalSign : PropTypes.bool,
    commercialSign : PropTypes.bool,
    commercialArr : PropTypes.array,
    orderingSign : PropTypes.bool,
    nowSign : PropTypes.string,
  };
  
  const defaultProps = {
    materialSign : false,
    technicalSign : false,
    commercialSign : false,
    orderingSign : false,
    commercialArr : [],
    nowSign : null,
  };

class StepFlow extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            orderingSign : null,
            commArr : this.props.commercialArr,
        };
        console.log("PROPS", this.props)
      }

      async getDatafromAPI(url){
        try {
          let respond = await axios.get(API_URL +url, {
            headers : {'Content-Type':'application/json'},
            auth: {
              username: usernamePhilApi,
              password: passwordPhilApi
            },
          })
          if(respond.status >= 200 && respond.status < 300){
            console.log("respond Get Data", respond);
          }
          return respond;
        }catch (err) {
          let respond = undefined;
          this.setState({action_status : 'failed', action_message : 'Sorry, There is something error, please refresh page and try again'})
          console.log("respond Get Data", err);
          return respond;
        }
      }

      async getOrdByCom(commArr){
        let status = false;
        const arrayComm = '"'+commArr.join('", "')+'"';
        const where_id_Comm = 'where={"id_boq_comm_doc" : {"$in" : ['+arrayComm+']}}';
        const res = await this.getDatafromAPI('/ordering_sorted?'+where_id_Comm)
        if(res !== undefined){
            if(res.data !== undefined){
                if(res.data._items.length !== 0){
                    this.setState({orderingSign : true});
                    status = true;
                }
            }
        }
        return status;
      }    

    render(){

        let matSign = false;
        let tecSign = false;
        let comSign = false;
        let ordSign = false;

        const { materialSign, technicalSign, commercialSign, nowSign, commercialArr, orderingSign } = this.props;

        if(materialSign == true){
            matSign = "active ";
        }

        if(technicalSign == true){
            tecSign = "active ";
            matSign = "active ";
        }

        if(commercialSign == true){
            matSign = "active ";
            tecSign = "active ";
            comSign = "active ";
        }

        if(this.state.orderingSign == true){
            matSign = "active ";
            tecSign = "active ";
            comSign = "active ";
            ordSign = "active ";
        }

        if(orderingSign == true){
          matSign = "active ";
          tecSign = "active ";
          comSign = "active ";
          ordSign = "active ";
      }

        if(this.state.orderingSign == null && commercialArr.length !== 0 ){
            this.getOrdByCom(commercialArr);
        }

        console.log("this.state.orderingSi", this.state.orderingSign)

        return (
            <div>
                <Row>
                    <Col>
                    <ul className="progressbar">
                        <li className={matSign + (nowSign == "mat" ? " now " : "")}>Material</li>
                        <li className={tecSign + (nowSign == "tec" ? " now " : "")}>Technical BOQ</li>
                        <li className={comSign + (nowSign == "com" ? " now " : "")}>Commercial BOQ</li>
                        <li className={ordSign + (nowSign == "ord" ? " now " : "")}>Ordering BOQ</li>
                    </ul>
                    </Col>
                </Row>
            </div>
        );
    }
}

StepFlow.propTypes = propTypes;
StepFlow.defaultProps = defaultProps;

export default StepFlow;