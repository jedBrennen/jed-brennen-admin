import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from 'models/image.model';

import 'assets/scss/styles/forms/inputs/image-upload.scss';

interface ImageUploadProps {
  onUpload: (images: Image[], files: File[]) => void;
  className?: string;
  disabled: boolean;
}

interface ImageUploadState {
  images: Image[];
  isProcessing: boolean;
  filesToProcess: number;
  filesProcessed: number;
}

export default class ImageUpload extends Component<
  ImageUploadProps,
  ImageUploadState
> {
  static defaultProps = {
    disabled: false,
  };
  private inputRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.inputRef = React.createRef();
    this.state = {
      images: [],
      isProcessing: false,
      filesToProcess: 0,
      filesProcessed: 0,
    };
  }

  render() {
    return (
      <Dropzone
        accept="image/*"
        onDropAccepted={(files) => this.handleDrop(files)}
        disabled={this.state.isProcessing || this.props.disabled}
        multiple
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            ref={this.inputRef}
            className={`image-upload align-items-center p-3  ${
              isDragActive ? 'image-upload--drag-hovering' : ''
            } ${
              this.state.isProcessing || this.props.disabled
                ? 'image-upload--disabled'
                : ''
            } ${this.props.className}`}
            {...getRootProps()}
          >
            {!this.state.isProcessing && (
              <>
                <FontAwesomeIcon
                  className="image-upload__icon my-2"
                  icon={{ prefix: 'far', iconName: 'plus-square' }}
                  size="2x"
                />
                <h5 className="image-upload__text text-center">
                  Drag your images here
                </h5>
              </>
            )}
            {this.state.isProcessing && (
              <>
                <ProgressBar
                  animated
                  striped
                  variant="info"
                  max={this.totalFiles}
                  min={0}
                  now={this.state.filesProcessed}
                  className="image-upload__progress my-3 mx-4"
                />
                <h5 className="image-upload__text text-center">
                  {`Processing: ${this.state.filesProcessed} / ${this.totalFiles}`}
                </h5>
              </>
            )}
            <input
              type="file"
              className="image-input"
              {...getInputProps()}
              disabled={this.props.disabled}
            />
          </div>
        )}
      </Dropzone>
    );
  }

  private get totalFiles(): number {
    return this.state.filesToProcess + this.state.filesProcessed;
  }

  private async handleDrop(files: File[]) {
    // Check File API support
    if (window.File && window.FileList && window.FileReader) {
      if (files && files.length) {
        this.setState({
          images: [],
          isProcessing: true,
          filesToProcess: files.length,
          filesProcessed: 0,
        });
        const promises: Promise<Image>[] = [];
        files.forEach((file) => {
          promises.push(
            this.readFileAsync(file).then((src) => {
              const newImage = new Image('', false, src, '', file);
              this.setState((state) => {
                const images = [...state.images, newImage];
                const toProcess = state.filesToProcess - 1;
                const processed = state.filesProcessed + 1;
                return {
                  images,
                  isProcessing: !!toProcess,
                  filesToProcess: toProcess,
                  filesProcessed: processed,
                };
              });
              return newImage;
            })
          );
        });
        const newImages = await Promise.all(promises);
        this.props.onUpload(newImages, files);
      }
    } else {
      alert('Your browser does not support File API');
    }
  }

  private readFileAsync(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
