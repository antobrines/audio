import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'monAgence';

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCvwBJdPT48o9VCjMPKHgoQrP7uaz46wco",
      authDomain: "test-f9579.firebaseapp.com",
      databaseURL: "https://test-f9579.firebaseio.com",
      projectId: "test-f9579",
      storageBucket: "test-f9579.appspot.com",
      messagingSenderId: "3066738730",
      appId: "1:3066738730:web:aec83caa48d8d6e4c02b53",
      measurementId: "G-ZKKV42YPNQ"
    };
    firebase.initializeApp(firebaseConfig);
  }

}
