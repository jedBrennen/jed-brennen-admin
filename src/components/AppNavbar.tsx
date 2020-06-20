import React, { Component } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthService from 'services/auth.service';
import FirebaseService, {
  FirebaseContext,
  UserContext,
} from 'services/firebase.service';
import 'assets/scss/styles/app-navbar.scss';
// Fixes issue with @types not being found
// tslint:disable-next-line: no-var-requires
const Headroom = require('headroom.js');

export default class AppNavbar extends Component {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private authService: AuthService;
  private navbarRef: React.RefObject<any>;

  constructor(props: {}, context: FirebaseService) {
    super(props);

    this.authService = new AuthService(context);
    this.navbarRef = React.createRef();
  }

  componentDidMount() {
    const headroom = new Headroom(this.navbarRef.current, {
      offset: 71,
      tolerance: {
        up: 7,
        down: 0,
      },
    });
    headroom.init();
  }

  render() {
    return (
      <Navbar ref={this.navbarRef} bg="primary" expand="lg" fixed="top">
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
