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
import Companies from 'views/Comapnies';
import Projects from 'views/Projects';
import About from 'views/About';
import Login from 'views/Login';

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
                path="/"
                render={(props) => <Index {...props} />}
              />
              <ProtectedRoute
                path="/about"
                render={(props) => <About {...props} />}
              />
              <ProtectedRoute
                path="/companies"
                render={(props) => <Companies {...props} />}
              />
              <ProtectedRoute
                path="/projects"
                render={(props) => <Projects {...props} />}
              />
              <Route path="/login" render={(props) => <Login {...props} />} />
              <Redirect to="/login" />
            </Switch>
          </BrowserRouter>
        </UserContext.Provider>
      </FirebaseContext.Provider>
    );
  }
}
