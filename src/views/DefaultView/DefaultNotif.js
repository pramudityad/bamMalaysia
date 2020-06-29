import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

const propTypes = {
    actionMessage : PropTypes.string,
    actionStatus : PropTypes.string,
  };

  const defaultProps = {
    actionMessage : null,
    actionStatus : null,
  };


class DefaultNotif extends Component {
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
        if(this.props.actionStatus !== undefined && this.props.actionStatus !== null){
            if(this.props.actionStatus === 'failed'){
                return (
                    <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                      {this.props.actionMessage !== null ? this.props.actionMessage : "There is something error, please refresh your page" }
                    </Alert>
                )
            }else{
                if(this.props.actionStatus === 'success'){
                    return (
                        <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss}>
                            {this.props.actionMessage !== null ? this.props.actionMessage : "Your action has been successful" }
                        </Alert>
                    )
                }else{
                    if(this.props.actionStatus === 'warning'){
                        return (
                            <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                                {this.props.actionMessage !== null ? this.props.actionMessage : "There is some warning" }
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


export default DefaultNotif;
