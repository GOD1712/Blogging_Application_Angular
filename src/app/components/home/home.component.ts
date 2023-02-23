import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConstants } from 'src/app/common/constants/page-constants';
import { Post } from 'src/app/common/post';
import { PostResponse } from 'src/app/common/post-response';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  pageNumber: number = PageConstants.PAGE_NUMBER;
  pageSize: number = PageConstants.PAGE_SIZE;
  sortBy: string = PageConstants.SORT_BY;
  sortDir: string = PageConstants.SORT_DIR;
  totalPosts: number = 0;
  totalPages: number = 0;
  keyword: string = '';

  constructor(private postService: PostService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        let categoryId = params['categoryId'];
        if (categoryId == undefined) {
          this.fetchPosts();
        }
        else {
          this.postService.fetchPostsByCategory(categoryId, this.pageNumber - 1, this.pageSize).subscribe(
            (data: PostResponse) => {
              this.posts = data.content;
              this.totalPages = data.totalPages;
              this.totalPosts = data.totalElements;
            }
          );
        }
      });
  }

  private fetchPosts() {
    this.postService.fetchAllPosts(this.pageNumber - 1, this.pageSize, this.sortBy, this.sortDir).subscribe(
      (data: PostResponse) => {
        this.posts = data.content;
        this.totalPosts = data.totalElements;
        this.totalPages = data.totalPages;
      }
    );
  }

  search() {
    this.postService.searchPosts(this.keyword, this.pageNumber - 1, this.pageSize).subscribe(
      (data: PostResponse) => {
        this.posts = data.content;
        this.totalPages = data.totalPages;
        this.totalPosts = data.totalElements;
        console.log(data);
      }
    );
    this.router.navigate(["/home"], { queryParams: { keyword: this.keyword } });
  }

  cancelSearch() {
    this.fetchPosts();
    this.router.navigateByUrl("/home");
  }

  onPageChange() {
    this.fetchPosts();
  }

  viewPost(postId: number) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
