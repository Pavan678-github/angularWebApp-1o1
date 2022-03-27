import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebAppComponent } from './web-app/web-app.component';
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import {WebAppRoutingModule} from "../web-app-routing/web-app-routing.module";
import { AppDetailComponent } from './app-detail/app-detail.component';
import {FormsModule} from "@angular/forms";
import { FeedbackComponent } from './feedback/feedback.component';


@NgModule({
  declarations: [
    AppComponent,
    WebAppComponent,
    LoginComponent,
    AppDetailComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WebAppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
