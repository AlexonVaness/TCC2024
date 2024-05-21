import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private USER_PATH: string = 'users';
  private PRODUCT_PATH: string = 'posts';

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router
  ) { }

  public async getCurrentUserData(): Promise<any> {
    const user = await this.fireAuth.currentUser;
    if (user) {
      const uid = user.uid;
      const docRef = this.firestore.collection(this.USER_PATH).doc(uid);
  
      try {
        const doc = await docRef.get().toPromise();
        if (doc && doc.exists) {
          const userData = doc.data() as { [key: string]: any }; // Ensure userData is typed as an object
          return { ...userData, uid }; // Add the userId (uid) to the user data
        } else {
          console.error("User document does not exist.");
          return null;
        }
      } catch (error) {
        console.error("Error getting user document:", error);
        return null;
      }
    } else {
      console.error("User not authenticated.");
      return null;
    }
  }
  public getItemById(itemId: string): Observable<any> {
    console.log('Fetching item details for ID:', itemId); // Adiciona um log para verificar se o ID está correto
    return this.firestore.collection(this.PRODUCT_PATH).doc(itemId).valueChanges();
  }
  

  public async checkUserDocumentExistence(): Promise<void> {
    const user = await this.fireAuth.currentUser;
    if (user) {
      const uid = user.uid;
      const docRef = this.firestore.collection(this.USER_PATH).doc(uid);
  
      try {
        const doc = await docRef.get().toPromise();
        if (doc && doc.exists) { // Check if doc is not undefined and exists
          // User already has a document in the database
          this.router.navigate(['/tabs']);
        } else {
          // User doesn't have a document in the database yet
          this.router.navigate(['/login-sem-cadastro']);
        }
      } catch (error) {
        console.error("Error checking user document existence:", error);
      }
    } else {
      console.error("User not authenticated.");
    }
  }

  public getAllProducts(): Observable<any[]> {
    return this.firestore.collection(this.PRODUCT_PATH).valueChanges();
  }

  public async saveUserData(uid: string, userData: any): Promise<void> {
    try {
      await this.firestore.collection(this.USER_PATH).doc(uid).set(userData);
      console.log('Dados do usuário salvos com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  }
}
