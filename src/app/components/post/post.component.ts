import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/common/post';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';
import { Comment } from '../../common/comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post!: Post;
  comments: Comment[] = [];
  commentForm!: FormGroup;
  loggedInUser = {
    id: 0,
    username: ''
  };

  constructor(private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private commentService: CommentService) { }

  ngOnInit(): void {
    let postId: number = 0;
    this.route.params.subscribe(params => postId = params['id']);
    this.postService.fetchPostById(postId).subscribe(
      data => {
        this.post = data;
        this.comments = this.post.comments;
      }
    );

    this.commentForm = this.formBuilder.group({
      title: ['', Validators.required],
      comment: ['', Validators.required]
    });

    let signedInUser = sessionStorage.getItem("user");
    if (signedInUser != null) {
      this.loggedInUser = JSON.parse(signedInUser);
    }
  }

  get title() { return this.commentForm.get('title'); }
  get comment() { return this.commentForm.get('comment'); }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    let token = sessionStorage.getItem("token");
    if (token == null) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You are not logged in!! Please login if you want to comment on a post'
      });
      this.router.navigateByUrl("/login");
      this.clearFields();
    }
    else {
      const formValues = this.commentForm.value;
      let comment: Comment = new Comment();
      comment.title = formValues.title;
      comment.content = formValues.comment;
      this.clearFields();
      this.commentService.addComment(comment, this.post.postId, this.loggedInUser.id, token).subscribe(
        (data: Comment) => {
          this.post.comments.push(data);
          this.comments = this.post.comments;
        }
      );
    }
  }

  clearFields() {
    this.commentForm.reset();
  }

}
