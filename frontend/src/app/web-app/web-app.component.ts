import { Component, OnInit } from '@angular/core';
import {WebApp} from "../web-app";
import {WebRequestService} from "../web-request.service";
import {WebAppService} from "../web-app.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-web-app',
  templateUrl: './web-app.component.html',
  styleUrls: ['./web-app.component.css']
})
export class WebAppComponent implements OnInit {

  apps : WebApp[] = [];

  constructor(private webAppService : WebAppService,private router : Router) { }

  getApps(): void {
    console.log("getting apps");
    console.log("user id is ");
    console.log(localStorage.getItem('user_id'));
    this.webAppService.getApps().subscribe((res: any) =>{

      this.apps = res;

    });
  }

  addApp(name: string , description : string): void {
    name = name.trim();
    if (!name) { return; }
    this.webAppService.addWebApp(name, description , Number(localStorage.getItem('user_id')))
      .subscribe((res : any) => {
        this.apps.push(res[0]);

      });
  }



  deleteApp(appID: number): void {
    this.webAppService.deleteApp(appID).subscribe((res: any) =>{
      console.log("app deleted");
      this.apps.forEach((element,index)=>{
        if(element.app_id==appID) this.apps.splice(index,1);
      });

    });

  }

  viewApp(appID : number): void{

    this.router.navigate([`webapps/${appID}`]);

  }



  /**
  selectedApp?: WebApp;
  onSelect(app: WebApp): void {
    this.selectedApp = app;
  }
 **/
  ngOnInit(): void {
    console.log("init apps");
    this.getApps();
  }


}
