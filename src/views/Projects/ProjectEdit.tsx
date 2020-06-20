import React, { Component } from 'react';
import { Container, Form, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Formik, FieldArray, FormikHelpers } from 'formik';
import { Editor } from '@tinymce/tinymce-react';

import FirebaseService, { FirebaseContext } from 'services/firebase.service';
import ProjectService from 'services/project.service';
import StorageService from 'services/storage.service';
import { PROJECT_ADD, PROJECTS } from 'constants/routes';
import Project, { ProjectSchema } from 'models/project.model';
import Image from 'models/image.model';
import SubmitButton from 'components/Buttons/SubmitButton';
import FormikFormGroup from 'components/Forms/FormGroup';
import PillInput from 'components/Forms/Inputs/PillInput';
import ImageUpload from 'components/Forms/Inputs/ImageUpload';
import ImageGallery from 'components/Images/ImageGallery';

interface ProjectState {
  isLoading: boolean;
  uploadProgress?: Map<string, number>;
  project?: Project;
  saveError?: string;
  showError: boolean;
  saveSuccess?: string;
  showSuccess: boolean;
}

interface ProjectPathParams {
  projectId: string;
}

interface ProjectLocationState {
  newProjectTitle?: string;
}

export default class ProjectEdit extends Component<
  RouteComponentProps,
  ProjectState
> {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private projectService: ProjectService;
  private storageService: StorageService;
  private newProject: boolean;
  private emptyProject: Project = {
    id: '',
    fromServer: false,
    title: '',
    shortDescription: '',
    longDescription: '',
    technology: [],
    images: [],
  };

  constructor(props: RouteComponentProps, context: FirebaseService) {
    super(props);

    this.projectService = new ProjectService(context);
    this.storageService = new StorageService(context);
    this.newProject = props.match.path === PROJECT_ADD;
    this.state = {
      isLoading: !this.newProject,
      showError: false,
      showSuccess: false,
    };
  }

  componentDidMount() {
    !this.newProject && this.getProject();
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (prevProps !== this.props) {
      const newProjectTitle = (this.props.location
        .state as ProjectLocationState)?.newProjectTitle;
      const showSuccess = !!newProjectTitle;
      this.newProject = !showSuccess;
      this.setState({
        showSuccess,
        saveSuccess: showSuccess
          ? `New Project ${newProjectTitle} Added`
          : undefined,
      });
      this.getProject();
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner animation="border" />;
    }
    return (
      <Container className="h-100 pt-4">
        {this.alerts}
        <Formik
          initialValues={
            this.newProject ? this.emptyProject : this.state.project!
          }
          validationSchema={ProjectSchema}
          validateOnChange={false}
          onSubmit={(project, helpers) => {
            if (this.newProject) {
              this.createProject(project, helpers);
            } else {
              this.saveProject(
                this.state.project ?? this.emptyProject,
                project,
                helpers
              );
            }
          }}
        >
          {(props) => (
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                props.handleSubmit(e);
              }}
            >
              <FormikFormGroup<Project>
                formikProps={props}
                name="title"
                label="Title"
                placeholder="Enter a title for the project"
                type="text"
                value={props.values.title}
                error={props.errors.title}
              />
              <FormikFormGroup<Project>
                formikProps={props}
                name="shortDescription"
                label="Short Description"
                placeholder="Enter a short description for the project"
                type="text"
                value={props.values.shortDescription}
                error={props.errors.shortDescription}
              />
              <Form.Group>
                <Form.Label htmlFor="longDescription">
                  Detailed Description
                </Form.Label>
                <Editor
                  apiKey={process.env.REACT_APP_TINY_API_KEY}
                  init={{
                    content_css: `/assets/css/custom.css?v=${Date.now()}`,
                  }}
                  textareaName="longDescription"
                  value={props.values.longDescription}
                  disabled={props.isSubmitting}
                  onEditorChange={(e) =>
                    props.handleChange('longDescription')(e)
                  }
                />
              </Form.Group>
              <PillInput
                variant="secondary"
                name="technology"
                label="Technology"
                values={props.values.technology}
                disabled={props.isSubmitting}
              />
              <Form.Group>
                <Form.Label>Images</Form.Label>
                <FieldArray
                  name="images"
                  render={(arrayHelpers) => (
                    <ImageGallery
                      images={props.values.images}
                      isValid={props.isValid}
                      childrenPosition="AFTER"
                      onUpdate={arrayHelpers.replace}
                      onRemove={arrayHelpers.remove}
                      disabled={props.isSubmitting}
                      editing
                    >
                      <ImageUpload
                        className="mr-sm-3 mb-3"
                        onUpload={(images) => images.forEach(arrayHelpers.push)}
                        disabled={props.isSubmitting}
                      />
                    </ImageGallery>
                  )}
                />
              </Form.Group>
              {props.isSubmitting && this.imageUploadProgress}
              <SubmitButton
                label={this.newProject ? 'Create' : 'Save'}
                submittingLabel={this.newProject ? 'Creating' : 'Saving'}
                isSubmitting={props.isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </Container>
    );
  }

  private get alerts() {
    return (
      <>
        <Alert
          show={this.state.showError && !!this.state.saveError}
          onClose={() => this.setState({ showError: false })}
          variant="danger"
          dismissible
        >
          {this.state.saveError}
        </Alert>
        <Alert
          show={this.state.showSuccess && !!this.state.saveSuccess}
          onClose={() => this.setState({ showSuccess: false })}
          variant="success"
          dismissible
        >
          {this.state.saveSuccess}
        </Alert>
      </>
    );
  }

  private get imageUploadProgress(): JSX.Element | undefined {
    if (this.state.uploadProgress?.size) {
      return (
        <>
          <div className="text-center mb-2">{`Uploading Images: ${Math.round(
            this.totalProgress
          )}%`}</div>
          <ProgressBar
            animated
            variant="info"
            className="mb-4"
            now={this.totalProgress}
          />
        </>
      );
    }
    return undefined;
  }

  private get totalProgress(): number {
    const uploadCount = this.state.uploadProgress?.size;
    if (this.state.uploadProgress && uploadCount) {
      const value = Array.from(this.state.uploadProgress.values()).reduce(
        (prev, curr) => prev + curr
      );
      return value / uploadCount;
    }
    return 0;
  }

  private getProject() {
    const {
      match: { params },
    } = this.props;
    const { projectId } = params as ProjectPathParams;
    if (projectId) {
      this.setState({ isLoading: true });
      this.projectService.getProject(projectId).then((project) => {
        this.setState({ project, isLoading: false });
      });
    }
  }

  private async createProject(
    project: Project,
    helpers: FormikHelpers<Project>
  ) {
    this.setState({
      showError: false,
      showSuccess: false,
    });
    try {
      await this.uploadImages(project);
      const projectId = await this.projectService.createProject(project);
      this.setState({
        uploadProgress: new Map<string, number>(),
      });
      helpers.setSubmitting(false);
      const historyState: ProjectLocationState = {
        newProjectTitle: project.title,
      };
      this.props.history.push(`${PROJECTS}/${projectId}`, historyState);
    } catch (error) {
      helpers.setSubmitting(false);
      this.handleError(error);
    }
  }

  private async saveProject(
    initialProject: Project,
    project: Project,
    helpers: FormikHelpers<Project>
  ) {
    this.setState({
      showError: false,
      showSuccess: false,
    });
    project.id = project.fromServer
      ? project.id
      : this.projectService.getNewProjectRef().id;
    await this.uploadImages(project);
    const imagesToDelete = initialProject.images.filter(
      (image) => !project.images.find((img) => image.id === img.id)
    );
    await this.updateProject(project, imagesToDelete);
    await this.deleteImages(imagesToDelete, project.id);
    const newProject = await this.projectService.getProject(project.id);
    helpers.setValues(newProject!, false);
    this.setState({
      project: newProject,
      uploadProgress: new Map<string, number>(),
    });
    helpers.setSubmitting(false);
  }

  private async updateProject(project: Project, imagesToDelete?: Image[]) {
    try {
      await this.projectService
        .updateProject(project, imagesToDelete)
        .then(() =>
          this.setState({
            saveSuccess: `Successfully saved ${project.title}`,
            showSuccess: true,
          })
        );
    } catch (error) {
      this.handleError(error);
    }
  }

  private uploadImages(project: Project): Promise<void> {
    return new Promise((resolve) => {
      const imagesToUpload = project.images.filter(
        (image) => !image.fromServer && !!image.file
      );
      if (imagesToUpload.length) {
        let i = imagesToUpload.length;
        this.setState({
          uploadProgress: new Map<string, number>(),
        });
        imagesToUpload.forEach((image) => {
          const task = this.storageService.upload(
            `${ProjectService.collectionName}/${project.id}/${image.id}`,
            image.file!
          );

          const imgName = task.snapshot.ref.name;
          task.on(
            'state_changed',
            (snapshot) => {
              const snapshotProgress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.setState((state) => {
                state.uploadProgress?.set(imgName, snapshotProgress);
                return { uploadProgress: state.uploadProgress };
              });
            },
            undefined,
            async () => {
              image.src = await task.snapshot.ref.getDownloadURL();
              this.setState((state) => {
                state.uploadProgress?.set(imgName, 100);
                return { uploadProgress: state.uploadProgress };
              });

              i--;
              !i && resolve();
            }
          );
        });
      } else {
        resolve();
      }
    });
  }

  private deleteImages(images: Image[], projectId: string) {
    images.forEach((image) => {
      this.storageService.delete(
        `${ProjectService.collectionName}/${projectId}/${image.id}`,
        image.src
      );
    });
  }

  private handleError(error: any) {
    let message = 'An error occurred. Please try again.';
    switch (error.code) {
      case 'permission-denied':
        message = 'You are not allowed to do this.';
        break;
    }
    this.setState({ saveError: message, showError: true });
  }
}
