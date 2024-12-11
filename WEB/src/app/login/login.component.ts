import { Component, OnInit } from '@angular/core';
//import { GridModule,FormModule,ContainerComponent } from '@coreui/angular';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: false,
  // imports: [
  //   GridModule,
  //   FormModule,
  //   ContainerComponent
  // ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  token: string = "";
  email: string = "";
  password: string = "";
  rememberMe: boolean = false;
  userInfo: any;

  constructor(private authService: AuthService, private router: Router) {
  };

  ngOnInit(): void {
    if (this.authService.isTokenExpired()) {
    } else {
      this.rememberMe = true;
      this.onSubmit();
      this.router.navigate(['/home']);
    }

  }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/home']);
        } else {
          alert('Tài khoản hoặc mật khẩu không đúng!');
        }
      },
      error: (err) => {
        alert('Có lỗi sảy ra!');
        console.error(err);
      }
    })
  }
}
