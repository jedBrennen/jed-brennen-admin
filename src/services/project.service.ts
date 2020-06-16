import { Project } from 'models/project.model';
import FirebaseService from 'services/firebase.service';

const collectionName = 'projects';

export default class ProjectService {
  constructor(private firebase: FirebaseService) {}

  public async getProjects() {
    let projectCollection = await this.firebase.db
      .collection(collectionName)
      .get();
    return projectCollection.docs.map((doc) =>
      FirebaseService.mapFirebaseData<Project>(doc)
    );
  }
}
