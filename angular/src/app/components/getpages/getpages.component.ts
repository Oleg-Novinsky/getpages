import { Component, OnInit } from '@angular/core';
import {GetpagesService} from '../../services/getpages.service';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-getpages',
  templateUrl: './getpages.component.html',
  styleUrls: ['./getpages.component.css']
})
export class GetpagesComponent implements OnInit {

  parsedPages = [];
  inputOne: String;
  inputTwo = "";
  RegExpResult = [];
  fromRouter = [];

  constructor(
    private router:Router,
    private http:Http,
    private getpagesService:GetpagesService
  ) { }

  ngOnInit() {
    this.parsedPages = ["a", "b", "c"];
  }

doCheck(){
  this.RegExpResult = [];
var str = this.inputTwo;

function tgtrimm(str){
  var ars = str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ');
  return ars;
}

this.RegExpResult.push(tgtrimm(str));
/*
var Reg6 = new RegExp("^[A-zА-яЁё]+$");
var Reg61 = new RegExp("^.*[^A-zА-яЁё].*$");
if(Reg6.test(str))
{
 console.log("first");
 if(Reg61.test(str))
 {
 console.log("second");
 }
}
*/
//console.log(this.RegExpResult);
}

getFromRouter(){
  let rq = {
    name: "something"
  }
  this.getpagesService.getFromRouter(rq).subscribe(data => {
    this.fromRouter = data;
    console.log(data);
  });
}



}
