import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/common/category';
import { Post } from 'src/app/common/post';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  blogForm!: FormGroup;
  file: File | undefined;
  categories: Category[] = [];
  token: string = '';
  postId: number = 0;
  initPost!: Post;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private postService: PostService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let authToken = sessionStorage.getItem('token');
    if (authToken == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You are not logged in!! Log in to your account in order to write your blog.',
      })
      this.router.navigateByUrl("/login");
    }
    else {
      this.token = authToken;
    }

    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: [null, Validators.required],
      content: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const postIdStr = params.get('postId');
      if (postIdStr != null) {
        this.postId = parseInt(postIdStr);
      }
    });

    this.postService.fetchPostById(this.postId).subscribe(
      (data: Post) => {
        this.initPost = data;
        this.initializeForm();
      }
    );

    this.categoryService.fetchAllCategories().subscribe(
      (data: Category[]) => this.categories = data
    );
  }

  get title() { return this.blogForm.get('title'); }
  get category() { return this.blogForm.get('category'); }
  get content() { return this.blogForm.get('content'); }

  private initializeForm() {
    this.title?.setValue(this.initPost.title);
    this.category?.setValue(this.initPost.category);
    this.content?.setValue(this.initPost.content);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.categoryId === c2.categoryId : c1 === c2;
  }

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
      newPost.category = blogFormValues.category;
      newPost.content = blogFormValues.content;
      newPost.imageName = this.initPost.imageName;
      this.postService.updatePost(this.postId, newPost, this.token).subscribe(
        (data: Post) => {
          if (this.file != undefined) {
            this.postService.uploadImage(this.postId, this.file, this.token).subscribe(
              (data: Post) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Blog Updated',
                  text: 'Your post was successfully updated!!'
                });
                this.router.navigateByUrl(`/dashboard/user/${data.user.id}/blogs`);
              }
            );
          }
          else {
            Swal.fire({
              icon: 'success',
              title: 'Blog Updated',
              text: 'Your post was successfully updated!!'
            });
            this.router.navigateByUrl(`/dashboard/user/${data.user.id}/blogs`);
          }
        }
      );
    }
  }

  cancelUpdate() {
    this.initializeForm();
  }

}
