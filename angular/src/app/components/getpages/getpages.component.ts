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

  sitesArr = [];
  errorMessage = {
    code: "",
    hostname: ""
  };
  loadStatus = "";
  isLoading = false;

  constructor(
    private router:Router,
    private http:Http,
    private getpagesService:GetpagesService
  ) { }

  ngOnInit() {
    this.addInput();
  }

startLoading(){
  if (this.isLoading == false){
    this.isLoading = true;
  } else{
    this.isLoading = false;
  }
}

deleteInput(name){
    let newArr = [];
    for (let i = 0; i < this.sitesArr.length; i++){
      if (this.sitesArr[i].name != name ){
        newArr.push({name: this.sitesArr[i].name, site: this.sitesArr[i].site});
      }
    }
    this.sitesArr = newArr;
}

addInput(){
  let obj = {
    name: generateName(),
    site: ""
  };
  this.sitesArr.push(obj);
  this.sitesArr.reverse();

  function generateName(){
    let str = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 5; i++){
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
  }
}

getDataFromPages(){

    this.startLoading();
    this.loadStatus = "Идет парсинг страниц...";
    let rq = formSitesArray(this.sitesArr);
    this.getpagesService.getDataFromPages(rq).subscribe(data => {
      if (data.reason != undefined){
        this.errorMessage = data;
        this.loadStatus = "Не удалось распарсить одну или более страниц. "+"Reason: "+data.reason+", Hostname: "+data.hostname;
        this.stopLoading();
      } else{
        this.generatePdf(data);
        this.loadStatus = "Создание PDF файла...";
      }
    });

    function formSitesArray(sitesArr){
      let arr = [];
      for (let i = 0; i < sitesArr.length; i++){
        arr.push(sitesArr[i].site);
      }
      return {data: arr};
    }
}

getPdf(filename) {
this.getpagesService.getPdf(filename)
    .subscribe(res => {
        FileSaver.saveAs(res,"Result.pdf");
        let fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        this.stopLoading();
    })
}

generatePdf(rq){
  this.getpagesService.gneratePdf(rq).subscribe(data => {
    if (data.error != undefined){
      this.loadStatus = "Не удалось сгенерировать PDF файл";
      this.stopLoading();
    } else{
      this.getPdf(data);
      this.loadStatus = "Загрузка PDF файла...";
    }
  });
}

stopLoading(){
  let scope = this;
  setTimeout(function(){scope.isLoading = false}, 5000);
}



}
