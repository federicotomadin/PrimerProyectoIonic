import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private route: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  salir() {
   this.auth.logout();
   this.route.navigate(['/login']);
  }

}
