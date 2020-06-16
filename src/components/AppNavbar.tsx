import React, { Component } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthService from 'services/auth.service';
import FirebaseService, {
  FirebaseContext,
  UserContext,
} from 'services/firebase.service';

export default class AppNavbar extends Component {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private authService: AuthService;

  constructor(props: {}, context: FirebaseService) {
    super(props);

    this.authService = new AuthService(context);
  }

  render() {
    return (
      <Navbar bg="primary" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Jed Brennen Admin</Navbar.Brand>
          </LinkContainer>
          <UserContext.Consumer>
            {(user) => {
              return user.user ? (
                <>
                  <Nav className="flex-row">
                    <Nav.Item>
                      <LinkContainer to="/about">
                        <Nav.Link>About</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                    <Nav.Item>
                      <LinkContainer to="/projects">
                        <Nav.Link>Projects</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                    <Nav.Item>
                      <LinkContainer to="/Companies">
                        <Nav.Link>Companies</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={() => this.authService.signOut()}>
                        Sign Out
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </>
              ) : null;
            }}
          </UserContext.Consumer>
        </Container>
      </Navbar>
    );
  }
}
