
import { Injectable, NgZone } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { User as AngularFireUser } from '@firebase/auth/dist/auth-public';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  usuarioDados: any;
  currentUserUID: string | null = null; // Adicionando a variável para armazenar o UID do usuário atual

  constructor(private firebase: FirebaseService, private fireAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.usuarioDados = user;
        this.currentUserUID = user.uid; // Armazenando o UID do usuário atual
        localStorage.setItem('user', JSON.stringify(this.usuarioDados));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  public singIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  public signUpWithEmailAndPassword(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  public recoverPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  public signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['signin']);
    });
  }
  public async getCurrentUser(): Promise<AngularFireUser | null> {
    try {
      const userCredential = await this.fireAuth.currentUser;
      return userCredential ? (userCredential as AngularFireUser) : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
  
  public getUserLogged() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    if (user != null) {
      return user;
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return user !== null ? true : false;
  }

  public singInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider, browserPopupRedirectResolver);
  }

  public singInWithGitHub() {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider, browserPopupRedirectResolver);
  }
  // Método para salvar os dados do perfil do usuário
  public async saveProfileData(profileData: any): Promise<void> {
    const user = await this.fireAuth.currentUser; // Obter o usuário atual de forma assíncrona
    if (user) {
      return this.firebase.saveUserData(user.uid, profileData); // Assumindo que você tem um método no FirebaseService para salvar os dados do usuário
    } else {
      throw new Error('Usuário não autenticado.');
    }
  }
  
}
