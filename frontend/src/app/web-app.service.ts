import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {WebApp} from "./web-app";



@Injectable({
  providedIn: 'root'
})
export class WebAppService {

  constructor(private webReqService : WebRequestService) { }

  getApps(){
    return this.webReqService.get(`webapp`);

  }

  getApp(appID : number){
    return this.webReqService.get(`webapp/${appID}`);

  }

  getUser(userID : number){
    return this.webReqService.getName(`user/${userID}`);
  }

  addWebApp(name : string , description : string , user_id : number) {
    // search by user name to get user id

    return this.webReqService.post('webapp' , {
      "user_id": user_id,
      "app_name": name,
      "app_desc": description

    });
  }

  deleteApp(appID : number){
    return this.webReqService.delete(`webapp/${appID}`);
  }

  getComments(appID : number){
    return this.webReqService.getComments(`feedback/${appID}`);
  }

  addFeedback(rating : number, comment : string , user_id : number , app_id : number) {
    // search by user name to get user id

    return this.webReqService.post(`feedback/${app_id}` , {
      "user_id": user_id,
      "rating": rating,
      "comment": comment

    });
  }

  addNotation(note: number, app_id : number , feedback_id : number , user_id : number) {
    // search by user name to get user id

    return this.webReqService.post(`notation/${app_id}` , {
      "user_id": user_id,
      "notation": note,
      "feedback_id": feedback_id,
      "app_id": app_id
    });
  }


}
