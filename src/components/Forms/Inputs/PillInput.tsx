import React, { Component } from 'react';
import { Badge, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Variant } from 'models/bootstrap.model';

import 'assets/scss/styles/forms/inputs/pill-list.scss';

interface PillInputProps {
  name: string;
  allowDuplicates?: boolean;
  variant?: Variant;
  label?: string;
  placeholder?: string;
  values?: string[];
  error?: string;
  onChange?: (event: React.ChangeEvent) => void;
  disabled: boolean;
}

interface PillInputState {
  values: string[];
}

export default class PillInput extends Component<
  PillInputProps,
  PillInputState
> {
  static defaultProps = {
    disabled: false,
  };
  constructor(props: PillInputProps) {
    super(props);

    this.state = {
      values: props.values ?? [],
    };
  }

  render() {
    return (
      <Form.Group
        className={`pill-list ${
          this.props.disabled ? 'pill-list--disabled' : ''
        }`}
      >
        {this.props.label && (
          <Form.Label htmlFor={this.props.name}>{this.props.label}</Form.Label>
        )}
        <div>
          {this.state.values &&
            this.state.values.map((value, index) => (
              <Badge
                pill
                className="mr-1 pill-list__pill"
                variant={this.props.variant ?? 'secondary'}
                key={this.props.allowDuplicates ? index : value}
              >
                {value}
                {!this.props.disabled && (
                  <span
                    className="pill-list__pill-close"
                    onClick={() => this.removePill(index)}
                  >
                    <FontAwesomeIcon icon="times" />
                  </span>
                )}
              </Badge>
            ))}
          <input
            className="pill-list__pill-input"
            type="text"
            placeholder="Add a pill"
            onKeyPress={(e) => this.handleKeyPress(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            disabled={this.props.disabled}
          ></input>
        </div>
        {this.props.error && (
          <span className="text-danger">{this.props.error}</span>
        )}
      </Form.Group>
    );
  }

  private handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.value) {
        const values = this.state.values;
        if (this.props.allowDuplicates || !values.includes(input.value)) {
          values.push(input.value);
          this.setState({ values });
        }
        input.value = '';
      }
    }
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.target as HTMLInputElement;
    if (e.keyCode === 8 && !input.value) {
      const values = this.state.values;
      values.pop();
      this.setState({ values });
    }
  }

  private removePill(index: number) {
    const values = this.state.values;
    values.splice(index, 1);
    this.setState({ values });
  }
}
