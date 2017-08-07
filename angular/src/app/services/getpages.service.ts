import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';



const config = require('../../../../config/database');
const ipConnection = config.ipConnection;

@Injectable()
export class GetpagesService {

  constructor(
    private http: Http
  ) { }


  getFromRouter(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/getpages/getparsed', data, {headers: headers})
    .map(res => res.json());
  }



}
