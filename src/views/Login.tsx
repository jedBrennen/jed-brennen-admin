import React, { Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Container, Row, Card, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AuthService from 'services/auth.service';
import FirebaseService, {
  FirebaseContext,
  UserContext,
} from 'services/firebase.service';
import SubmitButton from 'components/Buttons/SubmitButton';

import 'assets/scss/styles/login/login.scss';

interface LoginProps {
  from: Location;
}

interface LoginState {
  loginError?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email.'),
  password: Yup.string().required('Please enter your password.'),
});

export default class Login extends Component<RouteComponentProps, LoginState> {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private authService: AuthService;

  constructor(props: RouteComponentProps, context: FirebaseService) {
    super(props);

    this.authService = new AuthService(context);
  }

  render() {
    return (
      <UserContext.Consumer>
        {(user) => {
          if (!user.isLoaded) {
            return null;
          }
          if (user.user) {
            const { from } = (this.props.location.state as LoginProps) || {
              from: { pathname: '/' },
            };
            return <Redirect to={from} />;
          }

          const initialValues: LoginFormValues = {
            email: '',
            password: '',
          };
          return (
            <Container className="h-100">
              <Row className="justify-content-center align-items-center h-100">
                <Card className="login-form">
                  <Card.Body>
                    <Card.Title className="mb-2">Login</Card.Title>
                    {this.state?.loginError && (
                      <div className="mb-2 text-center text-danger">
                        {this.state.loginError}
                      </div>
                    )}
                    <Formik
                      initialValues={initialValues}
                      validationSchema={LoginSchema}
                      validateOnChange={false}
                      validateOnBlur={false}
                      onSubmit={(values) => this.login(values)}
                    >
                      {(props) => (
                        <Form
                          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            props.handleSubmit(e);
                          }}
                        >
                          <Form.Group
                            className={props.errors.email && 'has-danger'}
                          >
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Enter email"
                              disabled={props.isSubmitting}
                              onChange={props.handleChange}
                            />
                            <span className="text-danger">
                              {props.errors.email}
                            </span>
                          </Form.Group>
                          <Form.Group
                            className={props.errors.password && 'has-danger'}
                          >
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              id="password"
                              placeholder="Enter password"
                              disabled={props.isSubmitting}
                              onChange={props.handleChange}
                            />
                            <span className="text-danger">
                              {props.errors.password}
                            </span>
                          </Form.Group>
                          <SubmitButton
                            label="Save"
                            submittinglabel="Saving"
                            isSubmitting={props.isSubmitting}
                          />
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          );
        }}
      </UserContext.Consumer>
    );
  }

  private async login(values: LoginFormValues) {
    this.setState({ loginError: undefined });
    await this.authService
      .signIn(values.email, values.password)
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        switch (errorCode) {
          case 'auth/invalid-email':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            errorMessage =
              'Your email or password was incorrect. Please try again.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Your account has been disabled.';
            break;
        }
        this.setState({
          loginError: errorMessage,
        });
      });
  }
}
