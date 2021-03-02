import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

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

    onConfirm(redirect) {
        if (redirect === '' || redirect === null || redirect === 'undefined' || typeof redirect === 'undefined') {
            window.location.reload();
        } else {
            window.location.replace(redirect);
        }
    }

    render() {
        if (this.props.actionStatus !== undefined && this.props.actionStatus !== null) {
            if (this.props.actionStatus === 'failed') {
                return (
                    <SweetAlert danger title="Error!" onConfirm={this.onConfirm}>
                        {this.props.actionMessage !== null ? JSON.stringify(this.props.actionMessage) : "There is something error, please refresh your page"}
                    </SweetAlert>
                )
            } else {
                if (this.props.actionStatus === 'success') {
                    return (
                        <SweetAlert success title="Success!" onConfirm={() => this.onConfirm(this.props.redirect)}>
                            {this.props.actionMessage !== null ? JSON.stringify(this.props.actionMessage) : "Your action has been successful"}
                        </SweetAlert>
                    )
                } else {
                    if (this.props.actionStatus === 'warning') {
                        return (
                            <SweetAlert warning title="Warning!" onConfirm={this.onConfirm}>
                                {this.props.actionMessage !== null ? JSON.stringify(this.props.actionMessage) : "There is some warning"}
                            </SweetAlert>
                        )
                    } else {
                        return (
                            <div></div>
                        )
                    }
                }
            }
        } else {
            return (
                <div></div>
            )
        }
    }
}

DefaultNotif.propTypes = {
    actionMessage: PropTypes.string,
    actionStatus: PropTypes.string,
    redirect: PropTypes.string
};

DefaultNotif.defaultProps = {
    actionMessage: null,
    actionStatus: null,
    redirect: ""
};

export default DefaultNotif;