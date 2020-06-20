import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { FormikProps } from 'formik';

interface FormikFormGroupProps<T> {
  formikProps: FormikProps<T>;
  name: string;
  className?: string;
  as?: React.ElementType<any>;
  type?: string;
  label?: string;
  placeholder?: string;
  size?: 'sm' | 'lg';
  value?: string | number | string[];
  error?: string;
  multiple?: boolean;
}

export default class FormikFormGroup<T> extends Component<
  FormikFormGroupProps<T>
> {
  render() {
    return (
      <Form.Group
        className={`${this.props.error && 'has-danger'} ${
          this.props.className
        }`}
      >
        {this.props.label && (
          <Form.Label htmlFor={this.props.name}>{this.props.label}</Form.Label>
        )}
        <Form.Control
          multiple={this.props.multiple}
          as={this.props.as}
          type={this.props.type}
          name={this.props.name}
          id={this.props.name}
          placeholder={this.props.placeholder}
          size={this.props.size}
          value={this.props.value}
          disabled={this.props.formikProps.isSubmitting}
          onChange={this.props.formikProps.handleChange}
        >
          {this.props.children}
        </Form.Control>
        {this.props.error && (
          <span className="text-danger">{this.props.error}</span>
        )}
      </Form.Group>
    );
  }
}
