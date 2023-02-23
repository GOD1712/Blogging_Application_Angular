import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/common/api-response';
import { PageConstants } from 'src/app/common/constants/page-constants';
import { Post } from 'src/app/common/post';
import { PostResponse } from 'src/app/common/post-response';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-blogs',
  templateUrl: './user-blogs.component.html',
  styleUrls: ['./user-blogs.component.css']
})
export class UserBlogsComponent implements OnInit {
  userId: number = 0;
  posts: Post[] = [];
  pageNumber: number = PageConstants.PAGE_NUMBER;
  pageSize: number = PageConstants.PAGE_SIZE;
  totalPosts: number = 0;

  constructor(private route: ActivatedRoute,
    private postService: PostService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIdStr = params.get('id');
      if (userIdStr != null) {
        this.userId = parseInt(userIdStr);
      }
    });

    this.fetchPostsByUser();
  }

  private fetchPostsByUser() {
    this.postService.fetchPostsByUser(this.userId, this.pageNumber - 1, this.pageSize).subscribe(
      (data: PostResponse) => {
        this.posts = data.content;
        this.totalPosts = data.totalElements;
      }
    );
  }

  deleteBlog(postId: number) {
    const tokenStr = sessionStorage.getItem('token');
    let token = '';
    if (tokenStr != null) {
      token = tokenStr;
    }
    this.postService.deletePost(postId, token).subscribe(
      (data: ApiResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'Blog Deleted',
          text: data.message
        });
        this.posts = this.posts.filter(post => post.postId != postId);
        this.router.navigate([], { queryParams: { delete: true }, relativeTo: this.route });
      }
    );
  }

  onPageChange() {
    this.fetchPostsByUser();
  }

}
