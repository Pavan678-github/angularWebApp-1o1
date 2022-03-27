import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router : Router, private loginService : LoginService) { }

  async loginUser(userName :string){
    this.loginService.getID(userName).subscribe((res : any ) => {
      console.log("res");

      if(res.length !== 0){
        localStorage.setItem('user_id' , `${res[0]["user_id"]}`);
        console.log("user found");
      }
      else{
        console.log("creating user");
        this.loginService.createUser(userName).subscribe((res2 : any) => {
          console.log("creating new user");
          localStorage.setItem('user_id' , `${res2[0]["user_id"]}`);
        });
      }

    });


    await this.router.navigate(['webapps']);
  }

  ngOnInit(): void {
  }

}
