import { Company } from 'models/company.model';
import FirebaseService from './firebase.service';

const collectionName = 'companies';

export default class CompanyService {
  constructor(private firebase: FirebaseService) {}

  public async getCompanies() {
    let companyCollection = await this.firebase.db
      .collection(collectionName)
      .get();
    return companyCollection.docs.map((doc) =>
      FirebaseService.mapFirebaseData<Company>(doc)
    );
  }
}
