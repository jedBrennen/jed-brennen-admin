import FirebaseModel from 'models/firebase.model';

export default interface Company extends FirebaseModel {
  name: string;
  shortDescription: string;
  longDescription: string;
  roles: Role[];
}

export interface Role extends FirebaseModel {
  title: string;
  startDate: Date;
  endDate?: Date;
}
