import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Http } from '@angular/http';

@Injectable()
export class AuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: Http) {}

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  /**
   *  Login the user then tell all the subscribers about the new status
   */
  register(username: string, password: string): any {
    const that = this
    return new Promise(function(resolve){
      that.http.post('/api/register', {username: username, password: password}).subscribe(data => {
        localStorage.setItem('baseballgm-username', username);
        localStorage.setItem('baseballgm-id', data.json()._id);
        that.isLoginSubject.next(true);
        resolve({data: data})
      }, err => {
        resolve({err: err})
      })
    })
  }

  login(username: string, password: string): any {
    const that = this
    return new Promise(function(resolve){
      that.http.post('/api/login', {username: username, password: password}).subscribe(data => {
        localStorage.setItem('baseballgm-username', username);
        localStorage.setItem('baseballgm-id', data.json()._id);
        that.isLoginSubject.next(true);
        resolve({data: data})
      }, err => {
        resolve({err: err})
      })
    })
  }

  /**
   * Log out the user then tell all the subscribers about the new status
   */
  logout(): void {
    localStorage.removeItem('baseballgm-username');
    this.isLoginSubject.next(false);
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('baseballgm-username');
  }
}
