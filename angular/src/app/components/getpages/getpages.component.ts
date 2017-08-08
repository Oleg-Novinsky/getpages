import { Component, OnInit } from '@angular/core';
import {GetpagesService} from '../../services/getpages.service';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
const FileSaver = require('file-saver');

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
  }


getFromRouter(){
  let arr = [];
  //arr.push("http://foxnews.com/");
  arr.push("http://www.bbc.com/news");
  let rq = {
    data: arr
  }
  this.getpagesService.getFromRouter(rq).subscribe(data => {
    this.fromRouter = data;
    //console.log(data);
  });
}

getPdf(filename) {
this.getpagesService.getPdf(filename)
    .subscribe(res => {
        FileSaver.saveAs(res,"Result.pdf");
        let fileURL = URL.createObjectURL(res);
        window.open(fileURL);
    })
}

generatePdf(){
  let rq = {
    data: "arr"
  }
  this.getpagesService.gneratePdf(rq).subscribe(data => {
    this.getPdf(data);
  });
}



}
