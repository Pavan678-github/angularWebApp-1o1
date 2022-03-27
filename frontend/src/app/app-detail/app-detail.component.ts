import { Component, Input, OnInit } from '@angular/core';
import {WebAppService} from "../web-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WebApp} from "../web-app";

@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit {

  @Input() app ?: WebApp;

  userName : string = "";

  constructor(private webAppService : WebAppService,private router : Router , private route : ActivatedRoute) { }


  getApp(): void {

    this.webAppService.getApp(Number(this.route.snapshot.paramMap.get('id'))).subscribe((res: any) =>{


      this.app = res[0];
      this.webAppService.getUser(res[0]["user_id"]).subscribe((res2: any) =>{

        this.userName = res2[0]["user_name"];

      });

    });



  }



  //show app details
  //show comments
  //post comments + rating
  //note comment


  ngOnInit(): void {
    const appID = (Number(this.route.snapshot.paramMap.get('id')));
    this.getApp();
  }

}
