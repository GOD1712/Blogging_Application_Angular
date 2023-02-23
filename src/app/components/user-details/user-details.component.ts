import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../common/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetailsForm!: FormGroup;
  updateMode: boolean = false;
  userId: number = 0;
  userDetails!: User;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userDetailsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      description: ['']
    });

    this.route.paramMap.subscribe(params => {
      const userIdStr = params.get('id');
      if (userIdStr != null) {
        this.userId = parseInt(userIdStr);
      }
    });

    this.userService.fetchUserById(this.userId).subscribe(
      (data: User) => {
        this.userDetails = data;
        this.setUserDetails(data);
      }
    );

    this.disableFields();
  }

  get name() { return this.userDetailsForm.get('name'); }
  get email() { return this.userDetailsForm.get('email'); }
  get description() { return this.userDetailsForm.get('description'); }

  enableFields() {
    this.name?.enable();
    this.email?.enable();
    this.description?.enable();
  }

  disableFields() {
    this.name?.disable();
    this.email?.disable();
    this.description?.disable();
  }

  setUserDetails(user: User) {
    this.userDetailsForm.setValue({
      name: user.name,
      email: user.email,
      description: user.about
    });
  }

  switchOnUpdateMode() {
    this.updateMode = true;
    this.enableFields();
  }

  cancelUpdate() {
    this.setUserDetails(this.userDetails);
    this.updateMode = false;
    this.disableFields();
  }

  onSubmit() {
    if (this.userDetailsForm.invalid) {
      this.userDetailsForm.markAllAsTouched();
    }
    else {
      const tokenStr = sessionStorage.getItem('token');
      let token = '';
      if (tokenStr != null) {
        token = tokenStr;
      }

      const formValues = this.userDetailsForm.value;
      this.userDetails.name = formValues.name;
      this.userDetails.email = formValues.email;
      this.userDetails.about = formValues.description;

      this.userService.updateUser(this.userDetails.id, this.userDetails, token).subscribe(
        (data: User) => {
          const updatedUser = {
            id: data.id,
            username: data.name
          }
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
          Swal.fire({
            icon: 'success',
            title: 'Updated Your Details',
            text: 'Your details were updated successfully!!'
          });
          this.updateMode = false;
          this.disableFields();
        }
      );
    }
  }
}
