import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginCredentials } from 'src/app/models/login-credentials.model';
import { fadeInOutAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInOutAnimation]
})
export class LoginComponent implements OnInit {

  loginFailed :boolean = false;
  errorMessage :string;
  @ViewChild('btnLogin') btnLogin : ElementRef;

  constructor(
    private router: Router, 
    private authService: AuthService) { }

  ngOnInit() {
    this.errorMessage = '';
  }

  onSubmit(form) {
    
    if (form.valid) {
      var credentials = new LoginCredentials();
      credentials.login = form.value.login;
      credentials.senha = form.value.password;

      this.btnLogin.nativeElement.classList.add('is-loading'); 
      this.authService.autenticar(credentials).subscribe((resp) => {
        this.loginFailed = false;
        this.errorMessage = '';
        this.btnLogin.nativeElement.classList.remove('is-loading');
        this.router.navigate(['home']);        
      },
      (error) => {
        this.btnLogin.nativeElement.classList.remove('is-loading');
        if (error.status == 400) {
          this.errorMessage = 'Usuário ou Senha inválidos';
        }else {
          if (error.status == 0) {
            this.errorMessage = 'Serviço indisponível'
          } else {
            this.errorMessage = error.statusText;
          }
        }
        this.loginFailed = true;
      });
    }
  }

  onNotificationClick(form) {    
    this.loginFailed = false;
  }
}
