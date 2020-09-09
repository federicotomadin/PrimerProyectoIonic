import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { usuario } from '../models/usuarios.interface';
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
private coleccion: AngularFirestoreCollection<usuario>
private usuarios: Observable<usuario[]>
public isLogged: any = false;

  constructor(db: AngularFirestore, public afAuth: AngularFireAuth) {

         
      afAuth.authState.subscribe(resp => { this.isLogged = true })

    // this.coleccion = db.collection<usuario>('usuarios');
    // this.usuarios = this.coleccion.snapshotChanges().pipe(map(
    //   actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const id  = a.payload.doc.id; 
    //       return { id, ...data };
    //     });
    //   }
    // ))
   }

//Login 
async OnLogin(user: usuario) {
  
  try {

    return await (await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.clave)); 

  } catch (error) {

   console.log('Error en la creacion del usario', error);
   throw(error);
       
  }
}

async onRegister(user: usuario) {
  
  try {

    return await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.clave);
    
  } catch (error) {
    // console.log('Error en la creacion del usario', error);
    throw(error);
  }
}

logout() {
  this.afAuth.auth.signOut();
}

  getUsuarios() {
    return this.usuarios;
  } 
}
