import * as Yup from 'yup';

import FirebaseModel from 'models/firebase.model';
import Image, { ImageSchema } from 'models/image.model';

export default class Project extends FirebaseModel {
  public title: string;
  public technology: string[];
  public images: Image[];
  public shortDescription?: string;
  public longDescription?: string;

  constructor(
    id: string,
    fromServer: boolean,
    title: string,
    technology: string[],
    images: Image[],
    shortDescription?: string,
    longDescription?: string
  ) {
    super(id, fromServer);
    this.title = title;
    this.technology = technology;
    this.images = images;
    this.shortDescription = shortDescription;
    this.longDescription = longDescription;
  }

  public static get converter(): firebase.firestore.FirestoreDataConverter<
    Project
  > {
    return {
      toFirestore: (project: Project) => {
        const data = FirebaseModel.toFirestore<Project>(project);
        delete data.images;
        return data;
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): Project => {
        const project = FirebaseModel.fromFirestore<Project>(snapshot, options);
        project.images = [];
        return project;
      },
    };
  }
}

export const ProjectSchema = Yup.object().shape({
  title: Yup.string().required('A title is required.'),
  images: Yup.array(ImageSchema),
});
