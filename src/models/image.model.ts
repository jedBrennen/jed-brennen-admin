import * as Yup from 'yup';

import FirebaseModel from 'models/firebase.model';

export default class Image extends FirebaseModel {
  src: string;
  alt: string;
  file?: File;

  constructor(
    id: string,
    fromServer: boolean,
    src: string,
    alt: string,
    file?: File
  ) {
    super(id, fromServer);
    this.src = src;
    this.alt = alt;
    this.file = file;
  }

  public static get converter(): firebase.firestore.FirestoreDataConverter<
    Image
  > {
    return {
      toFirestore: (image: Image) => {
        const data = FirebaseModel.toFirestore<Image>(image);
        delete data.file;
        return data;
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): Image => {
        return FirebaseModel.fromFirestore<Image>(snapshot, options);
      },
    };
  }
}

export const ImageSchema = Yup.object().shape({
  src: Yup.string().required(),
  alt: Yup.string().required('You must provide alt text.'),
});
