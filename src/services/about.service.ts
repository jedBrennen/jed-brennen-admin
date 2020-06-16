import { Project } from 'models/project.model';
import FirebaseService from './firebase.service';

const collectionName = 'about';

export default class AboutService {
  constructor(private firebase: FirebaseService) {}

  public async getAbout() {
    let projects = await this.firebase.db.collection(collectionName).get();
    return projects.docs.map((doc) => doc.data() as Project);
  }
}
