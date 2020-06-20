import FirebaseService from 'services/firebase.service';
import Project from 'models/project.model';
import Image from 'models/image.model';

export default class ProjectService {
  static readonly collectionName = 'projects';
  constructor(private firebase: FirebaseService) {}

  public async getProjects() {
    const projectCollection = await this.collection
      .withConverter<Project>(Project.converter)
      .get();
    return projectCollection.docs.map((doc) => doc.data());
  }

  public async getProject(projectId: string) {
    const projectDoc = this.collection.doc(projectId);
    const project = (
      await projectDoc.withConverter(Project.converter).get()
    ).data();
    const imageDocs = (
      await projectDoc.collection('images').withConverter(Image.converter).get()
    ).docs;
    if (project) {
      project.images = imageDocs.map((imageDoc) => imageDoc.data());
      return project;
    }

    return undefined;
  }

  public async createProject(project: Project): Promise<string> {
    const batch = this.firebase.db.batch();
    const projectRef = this.collection.doc();

    const projectDoc = Project.converter.toFirestore(project);
    batch.set(projectRef, projectDoc);

    const imageCollection = projectRef.collection('images');
    project.images.forEach((image) => {
      const imageRef = imageCollection.doc(image.id || undefined);
      const imageDoc = Image.converter.toFirestore(image);
      batch.set(imageRef, imageDoc);
    });

    await batch.commit();
    return projectRef.id;
  }

  public async updateProject(project: Project, imagesToDelete?: Image[]) {
    const batch = this.firebase.db.batch();
    const projectRef = this.collection.doc(project.id);

    const imageCollection = projectRef.collection('images');
    project.images.forEach((image) => {
      const imageRef = imageCollection.doc(image.id || undefined);
      const imageDoc = Image.converter.toFirestore(image);
      batch.set(imageRef, imageDoc);
    });

    imagesToDelete?.forEach((image) => {
      const imageRef = imageCollection.doc(image.id);
      batch.delete(imageRef);
    });

    const projectDoc = Project.converter.toFirestore(project);
    batch.update(projectRef, projectDoc);

    return batch.commit();
  }

  public getNewProjectRef() {
    return this.collection.doc();
  }

  private get collection() {
    return this.firebase.db.collection(ProjectService.collectionName);
  }
}
