import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/common/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  categories: Category[] = [];
  isLoggedIn: boolean = false;
  userId: number = 0;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    this.isLoggedIn = token == null ? false : true;
    this.categoryService.fetchAllCategories().subscribe(
      data => this.categories = data
    );

    const loggedInUserStr = sessionStorage.getItem('user');
    if (loggedInUserStr != null) {
      this.userId = JSON.parse(loggedInUserStr).id;
    }
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
  }

}
