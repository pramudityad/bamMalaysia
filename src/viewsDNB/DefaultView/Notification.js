import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import './defaultview.css';

const propTypes = {
    // materialSign : PropTypes.bool,
    // technicalSign : PropTypes.bool,
    // commercialSign : PropTypes.bool,
    // commercialArr : PropTypes.array,
    // orderingSign : PropTypes.bool,
    actionMessage : PropTypes.string,
    actionAlert : PropTypes.string,
  };
  
  const defaultProps = {
    // materialSign : false,
    // technicalSign : false,
    // commercialSign : false,
    // orderingSign : false,
    // commercialArr : [],
    actionMessage : null,
    actionAlert : null,
  };


class Notif extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            visible: true,
        };
      
        this.onDismiss = this.onDismiss.bind(this);
    }
      
    onDismiss() {
        this.setState({ visible: false });
    }

    render(){
        // let matSign = false;

        // if(materialSign == true){
        //     matSign = "active ";
        // }
        if(this.props.actionAlert !== undefined && this.props.actionAlert !== null){
            if(this.props.actionAlert === 'failed'){
                return (
                    <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                        {this.props.actionMessage}
                    </Alert>
                )
            }else{
                if(this.props.actionAlert === 'success'){
                    return (
                        <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss}>
                            {this.props.actionMessage}
                        </Alert>
                    )
                }else{
                    if(this.props.actionAlert === 'warning'){
                        return (
                            <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                                {this.props.actionMessage}
                            </Alert>
                        )
                    }else{
                        return (
                            <div></div>
                        )
                    }
                }
            }
        }else{
            return (
                <div></div>
            )
        }
    }
}


export default Notif;