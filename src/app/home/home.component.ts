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
   isPlaying = false;

  constructor(
    private propertiesService: PropertiesService
  ) { }

  start(track: Property) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
      },
      onend: () => {
        console.log('POG');
      }
    });
    this.player.play();
  }

  togglePlayer(pause){
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  next() {
    let index = this.properties.indexOf(this.activeTrack);
    if (index !== this.properties.length - 1) {
      this.start(this.properties[index + 1]);
    } else {
      this.start(this.properties[0]);
    }
  }

  prev() {
    let index = this.properties.indexOf(this.activeTrack);
    if (index > 0) {
      this.start(this.properties[index - 1]);
    } else {
      this.start(this.properties[this.properties.length - 1]);
    }
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
