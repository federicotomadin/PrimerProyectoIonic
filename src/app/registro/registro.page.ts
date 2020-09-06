import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { usuario } from '../models/usuarios.interface';
import { AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms'



@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registrationForm = this.formBuider.group({
    nombre: ['', 
      [Validators.required, 
      Validators.maxLength(20), 
      Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
    ]],
    apellido: ['', 
    [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
    ]],
    email: ['', 
    [
      Validators.required, 
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
    ]],
    clave: ['', [Validators.required, Validators.maxLength(20)]],
    repetirClave: ['', [Validators.required, Validators.maxLength(20)]]
  })

  get nombre() {
    return this.registrationForm.get('nombre')
  }
  get apellido() {
    return this.registrationForm.get('apellido')
  }
  get email() {
    return this.registrationForm.get('email')
  }
  get clave() {
    return this.registrationForm.get('clave')
  }
  get repetirClave() {
    return this.registrationForm.get('repetirClave')
  }

  public errorMessages = {
     nombre: [
      { type: 'required', message: 'El nombre es obligatorio' },
      { type: 'maxlength', message: 'El nombre no puede tener mas de 20 caracteres' } ],
     apellido: [
      { type: 'required', message: 'El apellido es obligatorio' },
      { type: 'maxlength', message: 'El apellido no puede tener mas de 20 caracteres' } ],
     email: [
      { type: 'required', message: 'El email es obligatorio' },
      { type: 'maxlength', message: 'El email no puede tener mas de 20 caracteres' } ],
     clave: [
      { type: 'required', message: 'La clave es obligatorio' },
      { type: 'maxlength', message: 'La clave no puede tener mas de 20 caracteres' } ],
      repetirClave: [
        { type: 'required', message: 'La confirmacion de la clave es obligatorio' },
        { type: 'maxlength', message: 'La confirmacion de la clave no puede tener mas de 20 caracteres' } ]
  }


 user: usuario;
 
  constructor(private formBuider: FormBuilder,public alertController: AlertController,private auth: AngularFireAuth, private dataBase: AngularFireDatabase, private router: Router) { }


  public submit() {
    console.log(this.registrationForm.value);
  }

  ngOnInit() {

  }


  Registrar() {

    if(this.user.email && this.user.clave) {

      this.auth.auth.createUserWithEmailAndPassword(this.user.email, this.user.clave).then(resp => {
        console.log(resp);

        this.dataBase.object('usuario/' +  resp.user.uid).set({
          usuaroi: this.user.email,
          createAt: Date.now()
        });
      })
    }

  }

  private async RegistroCorrecto() {

    const alert = await  this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Bienvenido/a',
      subHeader: 'Hola Juan',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/tab2']);
  
  }

}
