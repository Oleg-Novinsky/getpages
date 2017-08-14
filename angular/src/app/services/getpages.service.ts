import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';



const config = require('../../../../config/database');
const ipConnection = config.ipConnection;

@Injectable()
export class GetpagesService {

  constructor(
    private http: Http
  ) { }


  getPdf(rq) {
    return this.http.post('http://'+ipConnection+'/getpages/getdatafrompages',rq,
                   { responseType: ResponseContentType.Blob })
      .map((res) => {
            return new Blob([res.blob()], { type: 'application/pdf' })
        })
  }



}
