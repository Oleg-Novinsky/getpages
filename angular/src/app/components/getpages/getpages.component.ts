import { Component, OnInit } from '@angular/core';
import {GetpagesService} from '../../services/getpages.service';
import {AuthService} from '../../services/auth.service';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

const FileSaver = require('file-saver');

@Component({
  selector: 'app-getpages',
  templateUrl: './getpages.component.html',
  styleUrls: ['./getpages.component.css']
})
export class GetpagesComponent implements OnInit {

// Переменные для привязки к шаблону
  sitesArr = [];
  loadStatus = "";
  isLoading = false;
  errorMessage = {
    code: "",
    hostname: ""
  };

  constructor(
    private router:Router,
    private http:Http,
    private getpagesService:GetpagesService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.addInput();
  }

// Индикация загрузки
startLoading(){
  if (this.isLoading == false){
    this.isLoading = true;
  } else{
    this.isLoading = false;
  }
}

stopLoading(){
  let scope = this;
  setTimeout(function(){scope.isLoading = false}, 5000);
}

// Удаление поля ввода
deleteInput(name){
    let newArr = [];
    for (let i = 0; i < this.sitesArr.length; i++){
      if (this.sitesArr[i].name != name ){
        newArr.push({name: this.sitesArr[i].name, site: this.sitesArr[i].site});
      }
    }
    this.sitesArr = newArr;
}

// Добавление поля ввода
addInput(){
  let obj = {
    name: generateName(),
    site: ""
  };
  this.sitesArr.unshift(obj);

  function generateName(){
    let str = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 5; i++){
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
  }
}

// Отправляем массив с адресами на сервер
getDataFromPages(){
    this.startLoading();
    this.loadStatus = "Идет парсинг страниц...";
    let rq = formSitesArray(this.sitesArr);

    this.getpagesService.getPdf(rq).subscribe(data => {

        FileSaver.saveAs(data,"Result.pdf");
        let fileURL = URL.createObjectURL(data);
        window.open(fileURL);
        this.stopLoading();
        this.loadStatus = "Создание PDF файла...";

    });

    function formSitesArray(sitesArr){
      let arr = [];
      for (let i = 0; i < sitesArr.length; i++){
        if (sitesArr[i].site.indexOf("http://") < 0){
          let str = "http://"+sitesArr[i].site;
          arr.push(str);
          continue;
        }
        arr.push(sitesArr[i].site);
      }
      return {data: arr};
    }
}

onLogout(){
  this.authService.logout();
  this.router.navigate(['/login']);
}

}
