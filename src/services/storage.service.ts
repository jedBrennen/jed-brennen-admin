import FirebaseService from 'services/firebase.service';

export default class StorageService {
  constructor(private firebase: FirebaseService) {}

  public upload(path: string, file: File): firebase.storage.UploadTask {
    const fileRef = this.root.child(path);
    return fileRef.put(file);
  }

  public delete(path: string, fallbackUrl?: string) {
    let fileRef = this.root.child(path);
    fileRef.delete().catch((error) => {
      if (fallbackUrl && error === 'storage/object-not-found') {
        this.getRootFromUrl(fallbackUrl).delete();
      }
    });
  }

  private get root(): firebase.storage.Reference {
    return this.firebase.storage.ref();
  }

  private getRootFromUrl(url: string): firebase.storage.Reference {
    return this.firebase.storage.refFromURL(url);
  }
}
