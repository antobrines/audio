import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  /**
   * Formualire de connexion de type FormGroup
   */
  signinForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Initialise le formulaire
   */
  ngOnInit() {
    this.initSigninForm();
  }

  /**
   * Formulaire de connexion
   */
  initSigninForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  /**
   * Lorsque le formulaire est validée, cela authentifi l'utilisateur et le redirige sur la route /admin/dashboard
   */
  onSubmitSigninForm() {
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    this.authenticationService.signInUser(email, password).then(
      (data) => {
        this.router.navigate(['/admin', 'dashboard']);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

}
