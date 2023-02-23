import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostComponent } from './components/post/post.component';
import { RegisterComponent } from './components/register/register.component';
import { UserBlogsComponent } from './components/user-blogs/user-blogs.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { WriteBlogComponent } from './components/write-blog/write-blog.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'home/category/:categoryId', component: HomeComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'write-blog', component: WriteBlogComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'user/:userId/post/:postId/edit-blog', component: EditBlogComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'user/:id/details', component: UserDetailsComponent },
      { path: 'user/:id/blogs', component: UserBlogsComponent },
      { path: 'user/:id/change-password', component: ChangePasswordComponent },
      { path: 'user/:id/delete-account', component: DeleteAccountComponent }
    ]
  },
  { path: '', redirectTo: "/home", pathMatch: "full" },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
