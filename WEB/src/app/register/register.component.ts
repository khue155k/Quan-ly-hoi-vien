import { Component,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalComponent } from '@coreui/angular';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      ten_doanh_nghiep: ['Công ty ABC', Validators.required],
      mst: ['1439853245', Validators.required],
      diachi: ['Số 1 Đại Cồ Việt', Validators.required],
      so_dt: ['0123456788', Validators.required],
      zalo: ['0123456788', Validators.required],
      email: ['abc@ttss.com', [Validators.required, Validators.email]],
      website: ['abc.com'],
      hoten_ndd: ['XXX', Validators.required],
      chucvu_ndd: ['Giám đốc'],
      ngay_sinh_ndd: [null],
      so_dt_ndd: ['0123456788', Validators.required],
      zalo_ndd: ['0123456788'],
      email_ndd: ['xxx@tss.com', [Validators.required, Validators.email]],
      hoten_nlh: ['XXZ', Validators.required],
      chucvu_nlh: ['Tổng quản lý'],
      ngay_sinh_nlh: [null],
      so_dt_nlh: ['0123456788', Validators.required],
      zalo_nlh: ['0123456788'],
      email_nlh: ['xxz@ttss.com', [Validators.required, Validators.email]],
      dongy1: [true, Validators.requiredTrue]
    });
  }
  @ViewChild('NotiModal', { static: false }) NotiModal!: ModalComponent;

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };

      this.registerService.registerCompany(formData).subscribe({
        next : (response) => {
          if (response.status == 201) {
            this.successMessage = response.body.message
            this.NotiModal.visible = true;
            this.registerForm.reset();
          }else{
            alert(response.body.message);
            this.errorMessage = response.body.message;
          }
        },
        error : (error) => {
          alert(error.error.message);
        },
    });
    }
    else {
      this.registerForm.markAllAsTouched()
    }
  }

}
