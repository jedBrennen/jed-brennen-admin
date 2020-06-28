import React, { Component } from 'react';
import {
  Container,
  Form,
  Spinner,
  Alert,
  Button,
  Col,
  Row,
} from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Formik, FormikHelpers, FieldArray } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FirebaseService, { FirebaseContext } from 'services/firebase.service';
import CompanyService from 'services/company.service';
import { COMPANY_ADD, COMPANIES } from 'constants/routes';
import Company, { CompanySchema, Role } from 'models/company.model';
import SubmitButton from 'components/Buttons/SubmitButton';
import FormikFormGroup from 'components/Forms/FormGroup';
import RoleEdit from 'components/Forms/Inputs/RoleEdit';

interface CompanyState {
  isLoading: boolean;
  company?: Company;
  saveError?: string;
  showError: boolean;
  saveSuccess?: string;
  showSuccess: boolean;
}

interface CompanyPathParams {
  companyId: string;
}

interface CompanyLocationState {
  newCompanyName?: string;
}

export default class CompanyEdit extends Component<
  RouteComponentProps,
  CompanyState
> {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private companyService: CompanyService;
  private newCompany: boolean;
  private emptyCompany: Company = {
    id: '',
    fromServer: false,
    name: '',
    shortDescription: '',
    longDescription: '',
    roles: [],
    skills: [],
  };

  constructor(props: RouteComponentProps, context: FirebaseService) {
    super(props);

    this.companyService = new CompanyService(context);
    this.newCompany = props.match.path === COMPANY_ADD;
    this.state = {
      isLoading: !this.newCompany,
      showError: false,
      showSuccess: false,
    };
  }

  componentDidMount() {
    !this.newCompany && this.getCompany();
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (prevProps !== this.props) {
      const newCompanyName = (this.props.location.state as CompanyLocationState)
        ?.newCompanyName;
      const showSuccess = !!newCompanyName;
      this.newCompany = !showSuccess;
      this.setState({
        showSuccess,
        saveSuccess: showSuccess
          ? `New Company ${newCompanyName} Added`
          : undefined,
      });
      this.getCompany();
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
            this.newCompany ? this.emptyCompany : this.state.company!
          }
          validationSchema={CompanySchema}
          validateOnChange={false}
          onSubmit={(company, helpers) => {
            if (this.newCompany) {
              this.createCompany(company, helpers);
            } else {
              this.saveCompany(
                this.state.company ?? this.emptyCompany,
                company,
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
              <FormikFormGroup<Company>
                formikProps={props}
                name="name"
                label="Name"
                placeholder="Enter a name for the company"
                type="text"
                value={props.values.name}
                error={props.errors.name}
              />
              <FormikFormGroup<Company>
                formikProps={props}
                name="shortDescription"
                label="Short Description"
                placeholder="Enter a short description for the company"
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
              <FieldArray
                name="roles"
                render={(arrayHelpers) => {
                  props.values.roles.sort((a, b) => {
                    // Newest to oldest
                    if (a.startDate < b.startDate) return 1;
                    if (a.startDate > b.startDate) return -1;
                    return 0;
                  });
                  return (
                    <>
                      <Row className="justify-content-between">
                        <Col xs={6}>
                          <h5>Roles</h5>
                        </Col>
                        <Col xs={6} className="text-right">
                          <Button
                            variant="success"
                            onClick={() =>
                              arrayHelpers.push(
                                new Role('', false, '', new Date())
                              )
                            }
                          >
                            <FontAwesomeIcon icon="plus" />
                          </Button>
                        </Col>
                      </Row>
                      {!props.values.roles.length && (
                        <blockquote className="text-center mt-3 mb-0 text-secondary">
                          No roles to display. Add a new role.
                        </blockquote>
                      )}
                      {props.errors.roles &&
                        typeof props.errors.roles === 'string' && (
                          <div className="text-center text-danger">
                            {props.errors.roles}
                          </div>
                        )}
                      {props.values.roles.map((role, index) => {
                        return (
                          <RoleEdit
                            key={role.id}
                            name={`roles.${index}`}
                            value={role}
                            errors={props.errors.roles}
                            onChange={(r) => arrayHelpers.replace(index, r)}
                            onDelete={() => arrayHelpers.remove(index)}
                          />
                        );
                      })}
                    </>
                  );
                }}
              />
              <SubmitButton
                className="mt-3"
                label={this.newCompany ? 'Create' : 'Save'}
                submittingLabel={this.newCompany ? 'Creating' : 'Saving'}
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

  private getCompany() {
    const {
      match: { params },
    } = this.props;
    const { companyId } = params as CompanyPathParams;
    if (companyId) {
      this.setState({ isLoading: true });
      this.companyService.getCompany(companyId).then((company) => {
        this.setState({ company, isLoading: false });
      });
    }
  }

  private async createCompany(
    company: Company,
    helpers: FormikHelpers<Company>
  ) {
    this.setState({
      showError: false,
      showSuccess: false,
    });
    try {
      const companyId = await this.companyService.createCompany(company);
      helpers.setSubmitting(false);
      const historyState: CompanyLocationState = {
        newCompanyName: company.name,
      };
      this.props.history.push(`${COMPANIES}/${companyId}`, historyState);
    } catch (error) {
      helpers.setSubmitting(false);
      this.handleError(error);
    }
  }

  private async saveCompany(
    initialCompany: Company,
    company: Company,
    helpers: FormikHelpers<Company>
  ) {
    this.setState({
      showError: false,
      showSuccess: false,
    });
    company.id = company.fromServer
      ? company.id
      : this.companyService.getNewCompanyRef().id;
    const rolesToDelete = initialCompany.roles.filter(
      (role) => !company.roles.find((rl) => role.id === rl.id)
    );
    await this.updateCompany(company, rolesToDelete);
    const newCompany = await this.companyService.getCompany(company.id);
    helpers.setValues(newCompany!, false);
    this.setState({
      company: newCompany,
    });
    helpers.setSubmitting(false);
  }

  private async updateCompany(company: Company, rolesToDelete?: Role[]) {
    try {
      await this.companyService.updateCompany(company, rolesToDelete).then(() =>
        this.setState({
          saveSuccess: `Successfully saved ${company.name}`,
          showSuccess: true,
        })
      );
    } catch (error) {
      this.handleError(error);
    }
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
