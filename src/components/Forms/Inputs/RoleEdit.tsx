import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DateTime from 'react-datetime';
import { FormikErrors } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Role } from 'models/company.model';

import 'assets/scss/styles/forms/inputs/role-edit.scss';

interface RoleEditProps {
  name: string;
  value: Role;
  errors?: string | string[] | FormikErrors<Role>[];
  onChange?: (role: Role) => void;
  onDelete?: () => void;
}

export default class RoleEdit extends Component<RoleEditProps> {
  render() {
    const title = `${this.props.name}.title`;
    const startDate = `${this.props.name}.startDate`;
    const endDate = `${this.props.name}.endDate`;
    return (
      <Row className="align-items-end justify-content-between mb-3">
        <Col md={4} lg={6}>
          <Form.Group
            className={`mb-2 mb-md-0 ${this.error?.title ? 'has-danger' : ''}`}
          >
            <Form.Label htmlFor={title}>Title</Form.Label>
            <Form.Control
              name={title}
              id={title}
              type="text"
              placeholder="Enter a title for the role"
              value={this.props.value.title}
              onChange={(value) => {
                const role = this.props.value;
                role.title = value.target.value;
                this.props.onChange && this.props.onChange(role);
              }}
            />
            <div className="text-danger">{this.error?.title}</div>
          </Form.Group>
        </Col>
        <Col sm="auto">
          <Form.Group className="mb-2 mb-sm-0">
            <Form.Label htmlFor={startDate}>Start Date</Form.Label>
            <DateTime
              className="role-edit__date-input"
              defaultValue={this.props.value.startDate ?? new Date()}
              dateFormat={'DD/MM/YYYY'}
              timeFormat=""
              onChange={(value) => {
                const role = this.props.value;
                role.startDate = new Date(value as string);
                this.props.onChange && this.props.onChange(role);
              }}
              closeOnSelect
            />
          </Form.Group>
        </Col>
        <Col sm="auto">
          <Form.Group className="mb-2 mb-sm-0">
            <Form.Label htmlFor={endDate}>End Date</Form.Label>
            <DateTime
              className="role-edit__date-input"
              defaultValue={this.props.value.endDate}
              dateFormat={'DD/MM/YYYY'}
              timeFormat=""
              onChange={(value) => {
                const role = this.props.value;
                const newDate = value as string;
                role.endDate = newDate ? new Date(newDate) : undefined;
                this.props.onChange && this.props.onChange(role);
              }}
              closeOnSelect
            />
          </Form.Group>
        </Col>
        <Col sm="auto">
          <Button
            className="mt-2 mt-sm-0 w-100"
            variant="danger"
            onClick={this.props.onDelete}
          >
            <FontAwesomeIcon icon="times" />
          </Button>
        </Col>
      </Row>
    );
  }

  private get error(): FormikErrors<Role> | undefined {
    if (this.props.errors && typeof this.props.errors !== 'string') {
      const errors = this.props.errors as FormikErrors<Role>[];
      const index = parseInt(this.props.name.split('.')[1], undefined);
      return errors[index];
    }
    return undefined;
  }
}
