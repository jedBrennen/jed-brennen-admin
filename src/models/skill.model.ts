import FirebaseModel from 'models/firebase.model';
import * as Yup from 'yup';

export enum SkillArea {
  Frontend,
  Backend,
  Mixed,
}

export default class Skill extends FirebaseModel {
  public name: string;
  public area: SkillArea;
  public logo: string;

  constructor(
    id: string = '',
    fromServer: boolean = false,
    name: string = '',
    area: SkillArea = SkillArea.Frontend,
    logo: string = ''
  ) {
    super(id, fromServer);
    this.name = name;
    this.area = area;
    this.logo = logo;
  }
}

export const SkillSchema = Yup.object().shape({
  name: Yup.string().required('You must provide a name.'),
  area: Yup.mixed()
    .oneOf(Object.keys(SkillArea))
    .required('You must provide an area.'),
  logo: Yup.string().required('You must provide a logo.'),
});
