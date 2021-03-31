import React, { Component } from "react";
import { ModalBody, ModalHeader, Modal, ModalFooter } from "reactstrap";

const ModalDelete = ({ isOpen, toggle, className, title, children, body }) => {
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
            {children}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalDelete;
