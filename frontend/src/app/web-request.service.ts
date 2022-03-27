import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WebApp} from "./web-app";
import {Feedback} from "./feedback";


@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly  ROOT_URL;

  constructor(private http : HttpClient) {
    this.ROOT_URL = `http://localhost:3000`;
  }


  get(uri : string){
    return this.http.get<WebApp[]>(`${this.ROOT_URL}/${uri}`);
  }
  post(uri : string, payload : Object){
    return this.http.post<WebApp[]>(`${this.ROOT_URL}/${uri}` , payload);
  }

  patch(uri : string, payload : Object){
    return this.http.patch(`${this.ROOT_URL}/${uri}` , payload);
  }

  delete(uri : string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  getName(uri : string ){
    return this.http.get<String>(`${this.ROOT_URL}/${uri}`);
  }
  postName(uri : string, payload : Object){

    return this.http.post(`${this.ROOT_URL}/${uri}` , payload);
  }
  getUID(uri : string ){

    console.log(uri);
    return this.http.get<Object>(`${this.ROOT_URL}/${uri}`);
  }
  postUID(uri : string, payload : Object){
    return this.http.post(`${this.ROOT_URL}/${uri}` , payload);
  }

  getComments(uri : string){
    return this.http.get<Feedback[]>(`${this.ROOT_URL}/${uri}`);
  }

  postFeedback(uri : string, payload : Object){
    return this.http.post<Feedback[]>(`${this.ROOT_URL}/${uri}` , payload);
  }

  postNotation(uri : string, payload : Object){
    return this.http.post<Feedback[]>(`${this.ROOT_URL}/${uri}` , payload);
  }







}
