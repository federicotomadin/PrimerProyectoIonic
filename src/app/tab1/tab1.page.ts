import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../servicios/login.service';
import { usuario } from '../models/usuarios.interface';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public usuario:string;
  public contraseña:string;

  constructor(public navCtrl: NavController, public router: Router,
             public alertController: AlertController, private servicio: LoginService) {}

  users: usuario[];
  // his.users = resp}
   Ingresar(usr: string, pwd: string) {

    this.servicio.getUsuarios().subscribe(resp => { 
      
      resp.forEach(r => {
        
        if(r.usuario ===  usr && r.clave === pwd) {
          this.IngresoCorrecto();
        } else {
          this.IngresoIncorrecto();
      }
    })
  })
}

private async IngresoCorrecto() {

  const alert = await  this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Bienvenido/a',
    subHeader: 'Hola Juan',
    buttons: ['OK']
  });
  await alert.present();
  this.router.navigate(['/tab2']);

}

private async IngresoIncorrecto() {

  const alert = await this.alertController.create({
    animated: true,
    backdropDismiss: true,
    cssClass: 'my-custom-class',
    header: 'Error',
    subHeader: 'Credenciales incorrectas',
    message: 'Usuario o contraseña incorrectos',
    buttons: ['OK']
  });

   await alert.present();

}

}
