import React, { ReactElement, Component } from 'react';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export default class FirebaseService {
  public db: firebase.firestore.Firestore;
  public auth: firebase.auth.Auth;
  public storage: firebase.storage.Storage;
  private static instance: FirebaseService;

  private constructor() {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    this.auth = firebase.auth();
    this.storage = firebase.storage();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }

    return FirebaseService.instance;
  }
}

const FirebaseContext = React.createContext<FirebaseService>(
  FirebaseService.getInstance()
);

// tslint:disable-next-line: max-classes-per-file
class UserData {
  public user: firebase.User | null;
  public isLoaded: boolean;

  constructor(user?: firebase.User | null, isLoaded?: boolean) {
    this.user = user ?? null;
    this.isLoaded = isLoaded ?? false;
  }
}
const UserContext = React.createContext<UserData>(new UserData());

export { FirebaseContext, UserContext, UserData };

interface FirebaseUserConsumerProps {
  children: (firebase: FirebaseService, user: UserData) => ReactElement;
}

// tslint:disable-next-line: max-classes-per-file
export class FirebaseUserConsumer extends Component<FirebaseUserConsumerProps> {
  render() {
    return (
      <FirebaseContext.Consumer>
        {(fb) => (
          <UserContext.Consumer>
            {(user) => {
              return this.props.children(fb, user);
            }}
          </UserContext.Consumer>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
