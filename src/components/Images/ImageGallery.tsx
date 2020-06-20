import React, { Component } from 'react';
import { Container, Row, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from 'models/image.model';

import 'assets/scss/styles/images/image-gallery.scss';

interface ImageGalleryProps {
  images: Image[];
  childrenPosition?: 'BEFORE' | 'AFTER';
  onUpdate?: (index: number, image: Image) => void;
  onRemove?: (index: number) => void;
  isValid: boolean;
  disabled: boolean;
  editing: boolean;
}

export default class ImageGallery extends Component<ImageGalleryProps> {
  static defaultProps = {
    isValid: true,
    editing: false,
    disabled: false,
  };

  render() {
    return (
      <Container>
        <Row className="image-gallery">
          {this.props.childrenPosition &&
            this.props.childrenPosition === 'BEFORE' &&
            this.props.children}
          {this.props.images.map((image, index) => (
            <div key={image.id} className="image-gallery__image-container">
              <span className="image-gallery__image-overlay">
                <img
                  className="image-gallery__image"
                  src={image.src}
                  alt={image.alt}
                />
                {this.props.editing && !this.props.disabled && (
                  <span
                    className="image-gallery__image-delete"
                    onClick={() =>
                      this.props.onRemove && this.props.onRemove(index)
                    }
                  >
                    <FontAwesomeIcon icon="trash-alt" size="lg" />
                  </span>
                )}
              </span>
              {this.getAltInput(image, index)}
              {!this.props.editing && (
                <span className="image-gallery__image-description">
                  {image.alt}
                </span>
              )}
            </div>
          ))}
          {this.props.childrenPosition &&
            this.props.childrenPosition === 'AFTER' &&
            this.props.children}
        </Row>
      </Container>
    );
  }

  private getAltInput(image: Image, index: number): JSX.Element | undefined {
    if (this.props.editing) {
      return (
        <Form.Group
          className={`image-gallery__image-description ${
            !this.props.isValid && !image.alt && 'has-danger'
          }`}
        >
          <Form.Control
            size="sm"
            defaultValue={image.alt}
            onChange={(event) => {
              image.alt = event.target.value;
              this.props.onUpdate && this.props.onUpdate(index, image);
            }}
            disabled={this.props.disabled}
          />
          {!this.props.isValid && !image.alt && (
            <span className="text-danger">Please enter some alt text</span>
          )}
        </Form.Group>
      );
    }
  }
}
