import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FirebaseService, { FirebaseContext } from 'services/firebase.service';
import CompanyService from 'services/company.service';
import { COMPANY_ADD } from 'constants/routes';
import Company, { Role } from 'models/company.model';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';

interface ProjectListState {
  isLoading: boolean;
  companies: Company[];
}

export default class CompanyList extends Component<
  RouteComponentProps,
  ProjectListState
> {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private companyService: CompanyService;

  constructor(props: RouteComponentProps, context: FirebaseService) {
    super(props);

    this.companyService = new CompanyService(context);
    this.state = {
      isLoading: false,
      companies: [],
    };
  }

  componentDidMount() {
    this.fetchCompanies();
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col>
            <h1 className="mb-3">Companies</h1>
          </Col>
          <Col className="text-right">
            <Button variant="success" onClick={() => this.addCompany()}>
              <FontAwesomeIcon icon="plus" className="mr-2" />
              Add Company
            </Button>
          </Col>
        </Row>
        <List isLoading={this.state.isLoading}>
          {this.state.companies.map((company) => (
            <ListItem
              key={company.id}
              title={company.name}
              subtitle={this.getRoleSummary(company.roles)}
              body={company.shortDescription}
              onOpen={() => this.navigateToCompany(company.id)}
            />
          ))}
        </List>
      </Container>
    );
  }

  private fetchCompanies(): void {
    this.setState({ isLoading: true });
    this.companyService
      .getCompanies()
      .then((companies) => this.setState({ companies, isLoading: false }));
  }

  private addCompany(): void {
    const { history } = this.props;
    history.push(COMPANY_ADD);
  }

  private navigateToCompany(companyId: string): void {
    const { match, history } = this.props;
    history.push(`${match.path}/${companyId}`);
  }

  private getRoleSummary(roles: Role[]): string {
    const current = roles.find((role) => !role.endDate);
    const count = roles.length;
    return `${current}${
      count ? `and ${count} other position${count === 1 ? '' : 's'}` : ''
    }`;
  }
}
