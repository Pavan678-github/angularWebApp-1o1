import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebAppComponent} from "../app/web-app/web-app.component";
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "../app/login/login.component";
import {AppDetailComponent} from "../app/app-detail/app-detail.component";


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'webapps', component: WebAppComponent },
  { path: 'webapps/:id', component: AppDetailComponent },
  { path: 'login', component: LoginComponent }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class WebAppRoutingModule { }
