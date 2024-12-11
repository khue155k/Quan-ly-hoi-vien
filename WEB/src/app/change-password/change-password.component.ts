import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = '';

  constructor (private authService: AuthService){
    this.email = localStorage.getItem('email') || '';
  }

  onSubmit(): void{
    if (this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '') {
      this.error = 'Vui lòng nhập đủ thông tin.';
      this.message = '';
      return; 
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
      this.message = '';
      return; 
    }

    this.authService.changePassword(this.email, this.oldPassword, this.newPassword).subscribe(success => {
      if (success) {
        this.message = 'Đổi mật khẩu thành công!';
        this.error = '';
      } else {
        this.error = 'Đổi mật khẩu không thành công.';
        this.message = '';
      }
    });
  }
}
