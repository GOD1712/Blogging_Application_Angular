import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Access Denied!! This route is only for registered users"
      });
      this.router.navigateByUrl("/home");
    }
    else {
      const loggedInUserStr = sessionStorage.getItem('user');
      if (loggedInUserStr != null) {
        this.userId = JSON.parse(loggedInUserStr).id;
      }
    }
  }

}
