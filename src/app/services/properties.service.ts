import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Property } from '../interfaces/property';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  /**
   * Liste des property
   */
  properties: Property[] = [];
  /**
   * RxJs le "sujet" (ce la chose ou on s'abonne)
   */
  propertiesSubject = new Subject<Property[]>();

  constructor() { }
  /**
   * Rend à la vue dès qu'il y a un changement
   */
  emitProperties() {
    this.propertiesSubject.next(this.properties);
  }
  /**
   * Sauvegarde dans la base de donnée les properties
   */
  saveProperties() {
    firebase.database().ref('/properties').set(this.properties);
  }
  /**
   * Récupère toutes les property de la base de donné et l'envoyes la vue
   */
  getProperties() {
    firebase.database().ref('/properties').on('value', (data) => {
      this.properties = data.val() ? data.val() : [];
      this.emitProperties();
    });
  }
  /**
   * Récupère une property de la base de donné et l'envoyes la vue
   * @param id
   */
  getSingleProperties(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/properties/' + id).once('value').then(
          (data) => {
            resolve(data.val());
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
   * Permet de créer une property dans la BD
   * @param property
   */
  createProperty(property: Property) {
    this.properties.push(property);
    this.saveProperties();
    this.emitProperties();
  }
  /**
   * Permet de supprimer une property de la BD
   * @param index
   */
  deleteProperty(index)  {
    this.properties.splice(index, 1);
    this.saveProperties();
    this.emitProperties();
  }
  /**
   * Permet de modifier une property de la BD
   * @param property 
   * @param index 
   */
  updateProperty(property: Property, index) {
    firebase.database().ref('/properties/' + index).update(property).catch(
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Permet d'ajouter une image dans la BD
   * @param file 
   */
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const fileName = uniqueId + file.name;
        const upload = firebase.storage().ref().child('audios/properties/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downloadUrl) => {
                console.log(downloadUrl);
                resolve(downloadUrl);
              }
            );
          }
        );
      }
    );
  }
  /**
   * Permet de supprimer une image de la BD
   * @param fileLink
   */
  removeFile(fileLink: string) {
    if (fileLink) {
      const storageRef = firebase.storage().refFromURL(fileLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      );
    }
  }

}
