import { Component } from '@angular/core';
import { AuthService} from './services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(authService: AuthService, router: Router) {
    authService.isLoggedIn().subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['login']);
      }
    })

  }}
