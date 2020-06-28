import * as Yup from 'yup';

import FirebaseModel from 'models/firebase.model';
import Skill, { SkillSchema } from 'models/skill.model';

export default class Company extends FirebaseModel {
  public name: string;
  public roles: Role[];
  public skills: Skill[];
  public shortDescription?: string;
  public longDescription?: string;

  constructor(
    id: string,
    fromServer: boolean,
    name: string,
    roles: Role[],
    skills: Skill[],
    shortDescription?: string,
    longDescription?: string
  ) {
    super(id, fromServer);
    this.name = name;
    this.roles = roles;
    this.skills = skills;
    this.shortDescription = shortDescription;
    this.longDescription = longDescription;
  }
  public static get converter(): firebase.firestore.FirestoreDataConverter<
    Company
  > {
    return {
      toFirestore: (company: Company) => {
        const data = FirebaseModel.toFirestore<Company>(company);
        delete data.roles;
        delete data.skills;
        return data;
      },
      fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): Company {
        const company = FirebaseModel.fromFirestore<Company>(snapshot, options);
        company.roles = [];
        company.skills = [];
        return company;
      },
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Role extends FirebaseModel {
  public title: string;
  public startDate: Date;
  public endDate?: Date;

  constructor(
    id: string,
    fromServer: boolean,
    title: string,
    startDate: Date,
    endDate?: Date
  ) {
    super(id, fromServer);
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static get converter(): firebase.firestore.FirestoreDataConverter<
    Role
  > {
    return {
      toFirestore: (role: Role) => {
        const data = FirebaseModel.toFirestore<Role>(role);
        if (!data.endDate) {
          delete data.endDate;
        }
        return data;
      },
      fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
      ): Role => {
        const role = FirebaseModel.fromFirestore<Role>(snapshot, options);
        role.startDate = new Date((role.startDate as any).seconds * 1000);
        if (role.endDate) {
          role.endDate = new Date((role.endDate as any).seconds * 1000);
        }
        return role;
      },
    };
  }
}

export const RoleSchema = Yup.object().shape({
  title: Yup.string().required('A title is required'),
  startDate: Yup.date().required('A start date is required'),
});

export const CompanySchema = Yup.object().shape({
  name: Yup.string().required('A title is required.'),
  roles: Yup.array(RoleSchema.required()).required(
    'You need at least one role per company'
  ),
  skills: Yup.array(SkillSchema.required()).required(
    'You need at least one role per company'
  ),
});
