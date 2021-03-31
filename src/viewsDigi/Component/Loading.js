import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter
} from "reactstrap";
import Proptypes from 'prop-types'

const Loading = ({
    isOpen, toggle, className
}) => {
    return (
        <div>
            {/* Modal Loading */}
            <Modal
                isOpen={isOpen}
                toggle={toggle}
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
                    <div style={{ textAlign: "center" }}>Loading ...</div>
                    <div style={{ textAlign: "center" }}>System is processing ...</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Close
            </Button>
                </ModalFooter>
            </Modal>
            {/* end Modal Loading */}
        </div>
    )
}

export default Loading;