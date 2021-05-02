import React from "react";
import { Button, Modal, ModalBody, ModalFooter, Progress } from "reactstrap";
import Proptypes from "prop-types";

export default React.memo(({ isOpen, toggle, value, max }) => {
  const percent = (value / max) * 100;
  return (
    <div className="animated fadeIn">
      <div className="card-header-actions">
        <div style={{ textAlign: "center" }}>
          <Progress value={percent} />
        </div>
      </div>
    </div>
  );
});
