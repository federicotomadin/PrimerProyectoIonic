import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { usuario } from '../models/usuarios.interface';
import { AlertController } from '@ionic/angular';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms'
import { isUndefined } from 'util';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  matching_passwords_group = new FormGroup({
    password: new FormControl('', Validators.compose([
       Validators.minLength(5),
       Validators.required,
       Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
    ])),
    confirm_password: new FormControl('', Validators.required)
  }, (formGroup: FormGroup) => {
     return this.areEqual(formGroup);
  });

  registrationForm = this.formBuider.group({
    nombre: ['', 
      [Validators.required, 
      Validators.maxLength(20), 
      Validators.pattern('^[a-z-A-Z\D]+$')
    ]],
    apellido: ['', 
    [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[a-z-A-Z\D]+$')
    ]],
    email: ['', 
    [
      Validators.required, 
      Validators.maxLength(40),
      Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
    ]],
    clave: new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(6)
    ])),
    repetirClave: ['', 
    [
      Validators.required,
      Validators.maxLength(20), 
      Validators.minLength(6)      
    ]],
    matching_passwords: this.matching_passwords_group,
      terms: new FormControl(false, Validators.pattern('true'))
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
      { type: 'maxlength', message: 'La clave no puede tener mas de 20 caracteres' },
      { type: 'minlength', message: 'La clave debe tenes al menos seis caracteres' } ],
      repetirClave: [
        { type: 'required', message: 'La confirmacion de la clave es obligatorio' },
        { type: 'maxlength', message: 'La confirmacion de la clave no puede tener mas de 20 caracteres' } ]
  }


 user: usuario = new usuario();

 
  constructor(private formBuider: FormBuilder,public alertController: AlertController,
              private auth: AngularFireAuth, private dataBase: AngularFireDatabase, private router: Router) { }


  ngOnInit() {

  }

  Registrar() {   
    let crearUsuario
    if(this.user.email && this.user.clave) {
       let errorCode: string;
       let errorMessage: string;
       crearUsuario =  this.auth.auth.createUserWithEmailAndPassword(this.user.email, this.user.clave)
 
       .then(resp => {   
         debugger;
        this.dataBase.object('usuario/' +  resp.user.uid).set({
        usuario: this.user.email,
        createAt: new Date(Date.now()).toLocaleDateString("en-AR") + '-' + new Date(Date.now()).toLocaleTimeString("en-AR")
      });
      this.RegistroCorrecto(this.user.email);
      })
       .catch(function(error)
       {
          if (error.code === "auth/email-already-in-use") {
            errorCode = 'Error en el registro';
            errorMessage = "El email ya esta en uso";
          }
       }).then(resp => {
         debugger;
         if (errorCode !== undefined) {
          this.RegistroIncorrecto(errorCode, errorMessage);      
         }       
       })     
  }
}

  async RegistroCorrecto(email: string) {
    const alert = await  this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Bienvenido/a',
      subHeader: email,
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/tab1']);
  }

  public async RegistroIncorrecto(titulo:string, mensaje: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: mensaje,
      buttons: ['OK']
    });
    await alert.present();
     this.router.navigate(['/registro']);
  }

  public areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;
  
    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    }
   }
}
