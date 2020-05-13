import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropertiesService } from 'src/app/services/properties.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { Property } from 'src/app/interfaces/property';

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {
  /**
   * Formulaire des propriétés 
   */
  propertiesForm: FormGroup;
  /**
   * Abonnement aux proprétés (RxJs)
   */
  propertiesSubscription: Subscription;
  /**
   * Tableau des propriétés
   */
  properties: Property[] = [];
  /**
   * Sauvegarde de l'index à supprimer
   */
  indexToRemove;
  /**
   * Sauvegarde de l'index à mmodifier
   */
  indexToUpdate;
  /**
   * Permet de savoir si on est en mode édition ou non
   */
  editMode = false;
  /**
   * Permet de savoir si la audio est en train d'être uploader
   */
  audioUploading = false;
  /**
   * Permet de savoir si la audio à été uploader
   */
  audioUploaded = false;
  /**
   * Liste des audios uploader
   */
  audiosAdded: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService
  ) { }

  /**
   * Récupère toutes les properties de la base de donné en s'abonnant à l'aide de RxJs
   */
  ngOnInit() {
    this.initPropertiesForm();
    this.propertiesService.propertiesSubject.subscribe(
      (data: Property[]) => {
        this.properties = data;
      }
    );
    this.propertiesService.getProperties();
    this.propertiesService.emitProperties();
  }
  /**
   * Initialise le formulaire des propriété
   */
  initPropertiesForm() {
    this.propertiesForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      path: ['', Validators.required],
    });
  }
  /**
   * Ajoute ou modifie une property
   */
  onSubmitPropertiesForm() {
    const newProperty: Property = this.propertiesForm.value;
    newProperty.audios = this.audiosAdded ? this.audiosAdded : [];
    if (this.editMode) {
      this.propertiesService.updateProperty(newProperty, this.indexToUpdate);
    } else {
      this.propertiesService.createProperty(newProperty);
    }
    $('#propertiesFormModal').modal('hide');
  }
  /**
   * Permet de reset le formulaire des properties
   */
  resetForm() {
    this.editMode = false;
    this.propertiesForm.reset();
    this.audiosAdded = [];
  }
  /**
   * Permet d'initialiser l'index à supprimer lors de la selecter d'une property
   * @param index
   */
  onDeleteProperty(index) {
    $('#deletePropertyModal').modal('show');
    this.indexToRemove = index;
  }
  /**
   * Supprime de la base de donné une property
   */
  onConfirmDeleteProperty() {
    this.properties[this.indexToRemove].audios.forEach(
      (audio) => {
        this.propertiesService.removeFile(audio);
      }
    );
    this.propertiesService.deleteProperty(this.indexToRemove);
    $('#deletePropertyModal').modal('hide');
  }
  /**
   * Permet de savoir si on est en mode édition ou non et si on l'est, cela ajoute directement les valeurs de la bonne preperty
   * @param property
   */
  onEditProperty(property: Property) {
    this.editMode = true;
    $('#propertiesFormModal').modal('show');
    this.propertiesForm.get('title').setValue(property.title);
    this.propertiesForm.get('category').setValue(property.category);
    this.propertiesForm.get('path').setValue(property.path);
    this.audiosAdded = property.audios ? property.audios : [];
    const index = this.properties.findIndex(
      (propertyEl) => {
        if (propertyEl === property) {
          return true;
        }
      }
    );
    this.indexToUpdate = index;
  }
  /**
   * Permet d'ajouter une image lors d'un upload de fichier
   * @param event
   */
  onUploadFile(event) {
    this.audioUploading = true;
    this.propertiesService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.audiosAdded.push(url);
        this.audioUploading = false;
        this.audioUploaded = true;
        setTimeout(() => {
          this.audioUploaded = false;
        }, 5000);
      }
    );
  }
  /**
   * Supprime une image
   * @param index
   */
  onRemoveAddedaudio(index) {
    this.propertiesService.removeFile(this.audiosAdded[index]);
    this.audiosAdded.splice(index, 1);
  }
}
