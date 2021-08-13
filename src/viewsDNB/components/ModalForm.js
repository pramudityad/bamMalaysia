import React from "react";
import { ModalBody, ModalHeader, Modal, ModalFooter, Row, Col } from "reactstrap";

const ModalForm = ({ isOpen, toggle, className, title, children }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={className}
      >
        <ModalBody>
          <Row>{children[0]}</Row>
        </ModalBody>
        <ModalFooter>{children[1]}</ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalForm;
