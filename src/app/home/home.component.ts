import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertiesService } from '../services/properties.service';
import { Subscription } from 'rxjs';
import { Howl } from 'howler';
import { Property } from 'src/app/interfaces/property';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Liste des properties
   */
  properties = [];
  /**
   * Abonnement aux properties 
   */
  propertiesSubscription: Subscription;
  /**
   * Ajoute le service des properties
   * @param propertiesService
   */

   player: Howl = null;
   activeTrack: Property = null;

  constructor(
    private propertiesService: PropertiesService
  ) { }

  start(track: Property) {
    this.player = new Howl({
      src: [track.audios[0]]
    });
    this.player.play();
  }
  /**
   * Récupère toutes les properties de la base de donné.
   */
  ngOnInit() {
    this.propertiesSubscription = this.propertiesService.propertiesSubject.subscribe(
      (data: any) => {
        this.properties = data;
      }
    );
    this.propertiesService.getProperties();
    this.propertiesService.emitProperties();
  }

  /**
   * Permet de de désabonner lors de la fermeture de la page
   */
  ngOnDestroy() {
    this.propertiesSubscription.unsubscribe();
  }

}
