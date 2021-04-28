import React from "react";
import { Button, Modal, ModalBody, ModalFooter, Progress } from "reactstrap";
import Proptypes from "prop-types";

export default React.memo(({ isOpen, toggle, value, max }) => {
  const percent = (value / max) * 100;
  return (
    <div style={{ textAlign: "center" }}>
      <Progress value={percent} />
    </div>
  );
});
