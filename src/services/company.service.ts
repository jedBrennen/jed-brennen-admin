import Company, { Role } from 'models/company.model';
import FirebaseService from 'services/firebase.service';

export default class CompanyService {
  static readonly collectionName = 'companies';
  constructor(private firebase: FirebaseService) {}

  public async getCompanies() {
    const companyCollection = await this.collection
      .withConverter<Company>(Company.converter)
      .get();
    return companyCollection.docs.map((doc) => doc.data());
  }

  public async getCompany(companyId: string) {
    const companyDoc = this.collection.doc(companyId);
    const company = (
      await companyDoc.withConverter<Company>(Company.converter).get()
    ).data();
    const roleDocs = (
      await companyDoc
        .collection('roles')
        .withConverter<Role>(Role.converter)
        .get()
    ).docs;
    if (company) {
      company.roles = roleDocs.map((roleDoc) => roleDoc.data());
      return company;
    }

    return undefined;
  }

  public async createCompany(company: Company): Promise<string> {
    const batch = this.firebase.db.batch();
    const companyRef = this.collection.doc();

    const companyDoc = Company.converter.toFirestore(company);
    batch.set(companyRef, companyDoc);

    const roleCollection = companyRef.collection('roles');
    company.roles.forEach((role) => {
      const roleRef = roleCollection.doc();
      const roleDoc = Role.converter.toFirestore(role);
      batch.set(roleRef, roleDoc);
    });

    await batch.commit();
    return companyRef.id;
  }

  public async updateCompany(company: Company, rolesToDelete?: Role[]) {
    const batch = this.firebase.db.batch();
    const companyRef = this.collection.doc(company.id);

    const roleCollection = companyRef.collection('roles');
    company.roles.forEach((role) => {
      const roleRef = role.fromServer
        ? roleCollection.doc(role.id || undefined)
        : roleCollection.doc();
      const roleDoc = Role.converter.toFirestore(role);
      batch.set(roleRef, roleDoc);
    });

    rolesToDelete?.forEach((role) => {
      const roleRef = roleCollection.doc(role.id);
      batch.delete(roleRef);
    });

    const companyDoc = Company.converter.toFirestore(company);
    batch.update(companyRef, companyDoc);

    return batch.commit();
  }

  public getNewCompanyRef() {
    return this.collection.doc();
  }

  private get collection() {
    return this.firebase.db.collection(CompanyService.collectionName);
  }
}
