import FirebaseService from 'services/firebase.service';
import Project from 'models/project.model';

const collectionName = 'about';

export default class AboutService {
  constructor(private firebase: FirebaseService) {}

  public async getAbout() {
    const projects = await this.firebase.db.collection(collectionName).get();
    return projects.docs.map((doc) => doc.data() as Project);
  }
}
