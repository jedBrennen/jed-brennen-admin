import { v4 as uuid } from 'uuid';

export default abstract class FirebaseModel {
  public id: string;
  public fromServer: boolean;

  constructor(id: string, fromServer: boolean) {
    this.id = id || uuid();
    this.fromServer = fromServer;
  }

  public static get converter(): firebase.firestore.FirestoreDataConverter<
    any
  > {
    throw new Error('Converter not implemented!');
  }

  protected static toFirestore<T extends FirebaseModel>(
    model: T
  ): firebase.firestore.DocumentData {
    const data = { ...model };
    delete data.id;
    delete data.fromServer;
    return { ...data };
  }

  protected static fromFirestore<T extends FirebaseModel>(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): T {
    const data = snapshot.data(options)!;
    return { id: snapshot.id, fromServer: true, ...data } as T;
  }
}
