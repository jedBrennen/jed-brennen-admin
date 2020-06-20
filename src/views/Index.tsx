import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';

import { PROJECTS, COMPANIES, ABOUT } from 'constants/routes';

import 'assets/scss/styles/index.scss';

export default class Index extends Component<RouteComponentProps> {
  render() {
    return (
      <Container fluid>
        <Row className="mt-4">
          <Col>
            <Card className="showcase" onClick={() => this.navigateTo(ABOUT)}>
              <Card.Body>
                <Card.Title>About</Card.Title>
                Click here to edit the about section
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row xs={1} sm={2} className="mt-4">
          <Col>
            <Card
              className="showcase"
              onClick={() => this.navigateTo(PROJECTS)}
            >
              <Card.Body>
                <Card.Title>Projects</Card.Title>
                Click here to edit the projects
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className="showcase"
              onClick={() => this.navigateTo(COMPANIES)}
            >
              <Card.Body>
                <Card.Title>Companies</Card.Title>
                Click here to edit the Companies
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  private navigateTo(path: string) {
    this.props.history.push(path);
  }
}
