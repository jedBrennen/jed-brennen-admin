import FirebaseService from './firebase.service';

export default class AuthService {
  constructor(private firebase: FirebaseService) {}

  public signIn(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.firebase.auth.signInWithEmailAndPassword(email, password);
  }

  public signOut() {
    this.firebase.auth.signOut();
  }
}
