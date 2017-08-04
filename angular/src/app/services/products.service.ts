import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

const config = require('../../../../config/database');
const ipConnection = config.ipConnection;

@Injectable()
export class ProductsService {

  constructor(private http:Http) { }

  getMaxId() {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.get('http://'+ipConnection+'/products/getmaxid', {headers: headers})
  .map(res => res.json());
}

//========================== Products ========================================//
  editProduct(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/editproduct', data, {headers: headers})
    .map(res => res.json());
  }

  addProduct(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/addproduct', data, {headers: headers})
    .map(res => res.json());
  }

  getProducts(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/getproducts', data, {headers: headers})
    .map(res => res.json());
  }

  deleteProduct(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/deleteproduct', data, {headers: headers})
    .map(res => res.json());
  }

//========================== Categories ======================================//
  getCategories(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://'+ipConnection+'/products/getcategories', {headers: headers})
    .map(res => res.json());
  }

  addCategory(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/addcategory', data, {headers: headers})
    .map(res => res.json());
  }

  deleteCategory(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/products/deletecategory', data, {headers: headers})
    .map(res => res.json());
  }

}
