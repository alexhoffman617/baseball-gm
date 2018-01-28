import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  state = 'login'
  username: string
  password: string
  constructor(public authService: AuthService, private router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  async login() {
    const response = await this.authService.login(this.username, this.password)
    if (response.err) {
      this.snackBar.open(response.err._body, 'Ok', {duration: 2000})
    } else {
      this.router.navigate(['']);
    }
  }

  async register() {
    const response = await this.authService.register(this.username, this.password)
    if (response.err) {
      this.snackBar.open(response.err._body, 'Ok', {duration: 2000})
    } else {
      this.router.navigate(['']);
    }  }

  switchState(state: string) {
    this.state = state
  }

}
