import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
  /**
   * Permet de connecter l'utilisateur si il est renseigné dans la base de donné
   * @param email 
   * @param password 
   */
  signInUser(email: string, password: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (data) => {
            resolve(data);
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  /**
   * Permet de se déconnecter
   */
  signOutUser() {
    firebase.auth().signOut();
  }

}
