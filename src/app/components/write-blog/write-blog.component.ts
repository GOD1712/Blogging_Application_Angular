import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/common/category';
import { Post } from 'src/app/common/post';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  file: File | undefined;
  categories: Category[] = [];
  token: string = '';
  userDetails = {
    id: 0,
    username: ''
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private postService: PostService) { }

  ngOnInit(): void {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: [null, Validators.required],
      content: ['', Validators.required]
    });

    let authToken = sessionStorage.getItem('token');
    if (authToken == null) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You are not logged in!! Log in to your account in order to write your blog.'
      });
      this.router.navigateByUrl("/login");
    }
    else {
      this.token = authToken;
    }

    let loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser != null) {
      this.userDetails = JSON.parse(loggedInUser);
    }

    this.categoryService.fetchAllCategories().subscribe(
      (data: Category[]) => this.categories = data
    );
  }

  get title() { return this.blogForm.get('title'); }
  get category() { return this.blogForm.get('category'); }
  get content() { return this.blogForm.get('content'); }

  onChange(imageInput: any) {
    this.file = imageInput.files[0];
    console.log(this.file);
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
    }
    else {
      const blogFormValues = this.blogForm.value;
      let newPost: Post = new Post();
      newPost.title = blogFormValues.title;
      newPost.content = blogFormValues.content;
      this.postService.createPost(this.userDetails.id, blogFormValues.category.categoryId, newPost, this.token).subscribe(
        (data: Post) => {
          if (this.file != undefined) {
            this.postService.uploadImage(data.postId, this.file, this.token).subscribe(
              (data: Post) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Blog Posted',
                  text: 'Your blog has been posted successfully!!'
                });
                this.router.navigateByUrl("/home");
              }
            );
          }
          else {
            Swal.fire({
              icon: 'success',
              title: 'Blog Posted',
              text: 'Your blog has been posted successfully!!'
            });
            this.router.navigateByUrl("/home");
          }
        }
      );
    }
  }

  clearFields() {
    this.blogForm.reset();
  }

}
