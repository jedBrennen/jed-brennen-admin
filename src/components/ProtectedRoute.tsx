import React, { Component } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { UserContext } from 'services/firebase.service';
import { LOGIN } from 'constants/routes';

interface ProtectedRouteProps extends RouteProps {
  condition?: (user: firebase.User | null) => boolean;
}

interface ProtectedRouteState {
  isAuthorised: boolean;
}

export default class ProtectedRoute extends Component<
  ProtectedRouteProps,
  ProtectedRouteState
> {
  render() {
    const { render, location, ...rest } = this.props;
    return (
      <UserContext.Consumer>
        {(user) => {
          return (
            <Route
              {...rest}
              render={(props) =>
                user.user ? (
                  render && render(props)
                ) : (
                  <Redirect
                    to={{ pathname: LOGIN, state: { from: location } }}
                  />
                )
              }
            ></Route>
          );
        }}
      </UserContext.Consumer>
    );
  }
}
