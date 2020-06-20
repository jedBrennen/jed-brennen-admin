import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';

import { PROJECT_ADD, PROJECT_EDIT } from 'constants/routes';
import ProjectList from 'views/Projects/ProjectList';
import ProjectEdit from 'views/Projects/ProjectEdit';

class Projects extends Component<RouteComponentProps> {
  render() {
    const match = this.props.match;

    return (
      <Switch>
        <Route
          path={PROJECT_ADD}
          render={(props) => <ProjectEdit {...props} />}
        />
        <Route
          path={PROJECT_EDIT}
          render={(props) => <ProjectEdit {...props} />}
        />
        <Route
          path={match.path}
          render={(props) => <ProjectList {...props} />}
        />
      </Switch>
    );
  }
}

export default withRouter(Projects);
