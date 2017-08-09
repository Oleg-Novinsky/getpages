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

  inputNoRepeat = "";
  errorMessage = {
    code: "",
    hostname: ""
  };

  constructor(
    private router:Router,
    private http:Http,
    private getpagesService:GetpagesService
  ) { }

  ngOnInit() {
  }


getDataFromPages(){
  let arr = [];
  arr.push("http://www.bbc.com/news");
  arr.push("http://foxnews.com");
  let rq = {
    data: arr
  }
    this.getpagesService.getDataFromPages(rq).subscribe(data => {
      if (data.reason != undefined){
        this.errorMessage = data;
      } else{
        this.generatePdf(data);
      }
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

generatePdf(rq){
  this.getpagesService.gneratePdf(rq).subscribe(data => {
    this.getPdf(data);
  });
}



}
