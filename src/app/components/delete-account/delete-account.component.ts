import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/common/api-response';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  userId: number = 0;

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIdStr = params.get('id');
      if (userIdStr != null) {
        this.userId = parseInt(userIdStr);
      }
    });
  }

  deleteAccount() {

    const tokenStr = sessionStorage.getItem('token');
    let token = '';
    if (tokenStr != null) {
      token = tokenStr;
    }

    this.userService.deleteUser(this.userId, token).subscribe(
      (data: ApiResponse) => {
        sessionStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account was deleted successfully!!'
        });
        this.router.navigateByUrl("/home");
      }
    );
  }

}
