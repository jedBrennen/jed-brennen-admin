import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FirebaseService, { FirebaseContext } from 'services/firebase.service';
import ProjectService from 'services/project.service';
import Project from 'models/project.model';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';
import { PROJECT_ADD } from 'constants/routes';

interface ProjectListState {
  isLoading: boolean;
  projects: Project[];
}

export default class ProjectList extends Component<
  RouteComponentProps,
  ProjectListState
> {
  static contextType = FirebaseContext;
  public context!: React.ContextType<typeof FirebaseContext>;
  private projectService: ProjectService;

  constructor(props: RouteComponentProps, context: FirebaseService) {
    super(props);

    this.projectService = new ProjectService(context);
    this.state = {
      isLoading: false,
      projects: [],
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col>
            <h1 className="mb-3">Projects</h1>
          </Col>
          <Col className="text-right">
            <Button variant="success" onClick={() => this.addProject()}>
              <FontAwesomeIcon icon="plus" className="mr-2" />
              Add Project
            </Button>
          </Col>
        </Row>
        <List isLoading={this.state.isLoading}>
          {this.state.projects.map((project) => (
            <ListItem
              key={project.id}
              title={project.title}
              subtitle={project.skills.map((skill) => skill.name).join(', ')}
              body={project.shortDescription}
              onOpen={() => this.navigateToProject(project.id)}
            />
          ))}
        </List>
      </Container>
    );
  }

  private fetchProjects(): void {
    this.setState({ isLoading: true });
    this.projectService
      .getProjects()
      .then((projects) => this.setState({ projects, isLoading: false }));
  }

  private addProject(): void {
    const { history } = this.props;
    history.push(PROJECT_ADD);
  }

  private navigateToProject(projectId: string): void {
    const { match, history } = this.props;
    history.push(`${match.path}/${projectId}`);
  }
}
