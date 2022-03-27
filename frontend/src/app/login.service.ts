import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private webReqService : WebRequestService) { }

  getID( name : string){
    return this.webReqService.getUID(`username/${name}`);
  }

  createUser(name : string){
    return this.webReqService.postName(`user` ,{"user_name" : name});
  }
  getName(u_id : number){}
  setName(u_id : number){}


}
