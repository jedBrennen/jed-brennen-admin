import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';

import { COMPANY_ADD, COMPANY_EDIT } from 'constants/routes';
import CompanyEdit from 'views/Companies/CompanyEdit';
import CompanyList from 'views/Companies/CompanyList';

class Companies extends Component<RouteComponentProps> {
  render() {
    const match = this.props.match;

    return (
      <Switch>
        <Route
          path={COMPANY_ADD}
          render={(props) => <CompanyEdit {...props} />}
        />
        <Route
          path={COMPANY_EDIT}
          render={(props) => <CompanyEdit {...props} />}
        />
        <Route
          path={match.path}
          render={(props) => <CompanyList {...props} />}
        />
      </Switch>
    );
  }
}

export default withRouter(Companies);
