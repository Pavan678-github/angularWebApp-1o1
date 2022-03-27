import { Component, OnInit } from '@angular/core';
import {WebAppService} from "../web-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Feedback} from "../feedback";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedback : Feedback[] = [];

  visNote : number = 0;
  //todo get current notation  and assign to visnote

  constructor(private webAppService : WebAppService,private router : Router , private route : ActivatedRoute) { }

  getComments(){
    this.webAppService.getComments(Number(this.route.snapshot.paramMap.get('id'))).subscribe((res: any) =>{

      console.log(res);
      this.feedback = res;


    });


  }

  setNotation(note : number , feedback_id : number){


    this.webAppService.addNotation( note , Number(this.route.snapshot.paramMap.get('id')) , feedback_id , Number(localStorage.getItem("user_id")) ).subscribe((res: any) =>{

      console.log(res);


    });

    this.visNote = note;

  }




  addFeedback(comment : string, rating : string){
    this.webAppService.addFeedback(Number(rating), comment, Number(localStorage.getItem("user_id")) ,Number(this.route.snapshot.paramMap.get('id'))).subscribe((res: any) =>{
      console.log("feedback res")
      console.log(res);

    });

    let index = this.feedback.findIndex(x => x.user_id === Number(localStorage.getItem("user_id")));
    this.feedback[index].comment = comment;
    this.feedback[index].rating = Number(rating);




  }


  ngOnInit(): void {
    this.getComments();
    //todo get visnote

  }

}
