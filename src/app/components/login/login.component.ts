import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/common/authentication-request';
import { AuthenticationResponse } from 'src/app/common/authentication-response';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
      //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/")]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const formValues = this.loginForm.value;
    const authRequest: AuthenticationRequest = new AuthenticationRequest(formValues.username, formValues.password);

    this.authService.authenticateUser(authRequest).subscribe(
      (data: AuthenticationResponse) => {
        let token: string = data.token;
        sessionStorage.setItem("token", token);
        this.userService.fetchUserByUsername(formValues.username).subscribe(
          (data: User) => {
            let user = {
              id: data.id,
              username: data.name
            };
            sessionStorage.setItem("user", JSON.stringify(user));
          }
        );
        this.router.navigateByUrl("/home");
      },
      (error: any) => {
        if (error.statusCode == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Username or Password is incorrect'
          });
        }
      }
    );

  }

  clearFields() {
    this.loginForm.reset();
  }

}
