import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  user: User | undefined;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/)]]
    });

    this.route.paramMap.subscribe(params => {
      const userIdStr = params.get('id');
      if (userIdStr != null) {
        this.userService.fetchUserById(parseInt(userIdStr)).subscribe(
          (data: User) => {
            this.user = data;
            this.changePasswordForm.get('email')?.setValue(data.email);
            this.changePasswordForm.controls['email'].disable();
          }
        );
      }
    });
  }

  get email() { return this.changePasswordForm.get('email'); }
  get password() { return this.changePasswordForm.get('password'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
    }
    else {
      if (this.changePasswordForm.get('password')?.value != this.changePasswordForm.get('confirmPassword')?.value) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password does not match confirm Password!'
        });
      }
      else {
        this.userService.changePassword(this.changePasswordForm.get('email')?.value, this.changePasswordForm.get('password')?.value).subscribe(
          (data: User) => {
            Swal.fire({
              icon: 'success',
              title: 'Password Changed',
              text: "Your password was updated successfully!! Log in again with your new password"
            });
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
          }
        );
      }
    }
  }

  clearFields() {
    this.changePasswordForm.reset();
  }

}
