import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/)]],
      description: ['']
    });
  }

  get name() { return this.registrationForm.get('name'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get description() { return this.registrationForm.get('description'); }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
    }
    else {
      let formValues = this.registrationForm.value;
      let user: User = new User();
      user.name = formValues.name;
      user.email = formValues.email;
      user.password = formValues.password;
      user.about = formValues.description;

      this.userService.registerUser(user).subscribe(
        (data: User) => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successfull',
            text: 'Your account was created successfully!!'
          });
          this.router.navigateByUrl('/login');
        }
      );
    }
  }

  clearFields() {
    this.registrationForm.reset();
  }

}
