import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /**
   * Nom du site
   */
  title = 'audio';
  /**
   * Savoir si une personne est connécté ou non
   */
  isLoggedIn = false;
  /**
   * Ajoute le service d'authentification
   * @param authenticationService
   */
  constructor(
    private authenticationService: AuthenticationService
  ) { }
  /**
   * Connecter un utilisateur ou non
   */
  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        console.log('userSession', userSession);
        if (userSession) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }
    );
  }
  /**
   * Déconnecte un utilisateur
   */
  onSignOut() {
    this.authenticationService.signOutUser();
  }

}
