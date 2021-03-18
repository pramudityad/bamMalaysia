import React, { Component } from "react";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";

const Matplan = ({ type, head_model, handleChangeForm }) => {
  return (
    <div>
      <Col sm="12">
        <Form>
          <FormGroup row>
            <Label sm={4}>{head_model}</Label>
            <Col sm={8}>
              <Input
                type={type}
                name={head_model}
                placeholder={head_model}
                value={head_model}
                onChange={handleChangeForm}
              />
            </Col>
          </FormGroup>
        </Form>
      </Col>
    </div>
  );
};

export default React.memo(Matplan);
