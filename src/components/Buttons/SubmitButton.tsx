import React, { Component } from 'react';
import { Button, Spinner } from 'react-bootstrap';

import 'assets/scss/styles/buttons/submit-button.scss';

interface SubmitButtonProps {
  label: string;
  isSubmitting: boolean;
  submittingLabel?: string;
  className?: string;
}

export default class SubmitButton extends Component<SubmitButtonProps> {
  render() {
    return (
      <div className="text-right">
        <Button
          variant="primary"
          className={`submit-button ${this.props.className}`}
          type="submit"
          disabled={this.props.isSubmitting}
        >
          {this.props.isSubmitting && (
            <Spinner
              className="mr-3"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {this.props.isSubmitting
            ? this.props.submittingLabel ?? this.props.label
            : this.props.label}
        </Button>
      </div>
    );
  }
}
