import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import FirebaseService, {
  FirebaseContext,
  UserContext,
  UserData,
} from 'services/firebase.service';
import AppNavbar from 'components/AppNavbar';
import ProtectedRoute from 'components/ProtectedRoute';
import Index from 'views/Index';
import Companies from 'views/Companies/Companies';
import Projects from 'views/Projects/Projects';
import About from 'views/About';
import Login from 'views/Login';
import { INDEX, ABOUT, PROJECTS, COMPANIES, LOGIN } from 'constants/routes';

interface AppState {
  userData: UserData;
}

export default class App extends Component<{}, AppState> {
  private readonly firebase: FirebaseService = FirebaseService.getInstance();
  private authStateUnsubscribe?: firebase.Unsubscribe;

  constructor(props: {}) {
    super(props);

    this.state = {
      userData: new UserData(),
    };
  }

  componentDidMount() {
    this.authStateUnsubscribe = this.firebase.auth.onAuthStateChanged(
      (user) => {
        this.setState({ userData: new UserData(user, true) });
      }
    );
  }

  componentWillUnmount() {
    this.authStateUnsubscribe && this.authStateUnsubscribe();
  }

  render() {
    return (
      <FirebaseContext.Provider value={this.firebase}>
        <UserContext.Provider value={this.state.userData}>
          <BrowserRouter>
            <AppNavbar />
            <Switch>
              <ProtectedRoute
                exact
                path={INDEX}
                render={(props) => <Index {...props} />}
              />
              <ProtectedRoute
                path={ABOUT}
                render={(props) => <About {...props} />}
              />
              <ProtectedRoute
                path={PROJECTS}
                render={(props) => <Projects {...props} />}
              />
              <ProtectedRoute
                path={COMPANIES}
                render={(props) => <Companies {...props} />}
              />
              <Route path={LOGIN} render={(props) => <Login {...props} />} />
              <Redirect to={LOGIN} />
            </Switch>
            <div className="m-4"></div>
          </BrowserRouter>
        </UserContext.Provider>
      </FirebaseContext.Provider>
    );
  }
}
