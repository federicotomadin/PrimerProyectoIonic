import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { usuario } from '../models/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService { 
private coleccion: AngularFirestoreCollection<usuario>
private usuarios: Observable<usuario[]>

  constructor(db: AngularFirestore) {
    this.coleccion = db.collection<usuario>('usuarios');
    this.usuarios = this.coleccion.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id  = a.payload.doc.id; 
          return { id, ...data };
        });
      }
    ))

   }

  getUsuarios() {
    return this.usuarios;
  } 
}
