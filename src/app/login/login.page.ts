import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { usuario } from '../models/usuarios.interface';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = this.formBuider.group({
    email: ['', 
    [
      Validators.required, 
      Validators.maxLength(40),
      Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
    ]],
    clave: ['', [
    
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(6)
    ]]
  })

  get email() {
    return this.loginForm.get('email')
  }
  get clave() {
    return this.loginForm.get('clave')
  }

  public errorMessages = {
    email: [
     { type: 'required', message: 'El email es obligatorio' },
     { type: 'maxlength', message: 'El email no puede tener mas de 20 caracteres' } ],
    clave: [
     { type: 'required', message: 'La clave es obligatoria' },
     { type: 'maxlength', message: 'La clave no puede tener mas de 20 caracteres' },
     { type: 'minlength', message: 'La clave no puede tener menos de seis caracteres' } ],
 }

  public usuario:string;
  public contraseña:string;

  constructor(private authService: AuthService, public navCtrl: NavController, public router: Router,
             public alertController: AlertController, private servicio: AuthService, public formBuider: FormBuilder) {}

  ngOnInit(): void {}

  user: usuario = new usuario;

   async Ingresar() {

    const resp = await this.authService.OnLogin(this.user)
    .then(resp => { 
      this.IngresoCorrecto() })
    .catch(error => { 
      console.log(error.code);
     if (error.code === 'auth/user-not-found') {
      this.IngresoIncorrecto("Error de usuario", 'El usuario no existe')
     }
     if (error.code === 'auth/wrong-password') {
      this.IngresoIncorrecto("Error de contraseña", 'La contraseña es incorrecta')
     }
    })
 
}

private async IngresoCorrecto() {

  const alert = await  this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Bienvenido/a',
    subHeader: this.user.email,
    buttons: ['OK']
  });
  await alert.present();
  this.router.navigate(['/home']);

}

private async IngresoIncorrecto(titulo:string, mensaje:string) {

  const alert = await this.alertController.create({
    animated: true,
    backdropDismiss: true,
    cssClass: 'my-custom-class',
    header: titulo,
    message: mensaje,
    buttons: ['OK']
  });
   await alert.present();
}

Registrar() {
  this.router.navigate(['/registro']);
}


}
