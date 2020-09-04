import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public usuario:string;
  public contraseña:string;

  constructor(public navCtrl: NavController, public router: Router, public alertController: AlertController) {

    localStorage.setItem('usuario', 'juanperez')
    localStorage.setItem('contraseña', '1234')

  }

  async Ingresar(usr: string, pwd: string){
   
    if (usr === localStorage.getItem('usuario') && pwd === localStorage.getItem('contraseña')) {
     
      const alert =  await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Bienvenido/a',
        subHeader: 'Hola Juan',
        buttons: ['OK']
      });
  
      await alert.present();
      this.router.navigate(['/tab2']);

    } else {
      const alert =  await this.alertController.create({
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

}
