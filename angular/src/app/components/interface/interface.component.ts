import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {

  isModal = false;
  isModalAddProduct = false;
  isModalEditProduct = false;
  isModalAddCategory = false;
  isModalDeleteCategory = false;
  isModalDeleteProduct = false;

  productName: String;
  productPPrice: Number;
  productSPrice: Number;
  productCategory: String;

  boundAddCategory = {
    name: ""
  };

  boundCategory = {
    name: String
  };
  boundProduct = {
    id: Number,
    category: String,
    name: String,
    sPrice: Number,
    pPrice: Number
  };

  public categories = [];
  public products = [];

  messageIsShown = false;
  messageType = "";
  
  emptyList = false;

  constructor(
    private router:Router,
    private http:Http,
    private productsService:ProductsService
  ) { }


  ngOnInit() {

    this.productsService.getCategories().subscribe(data => {
    this.categories = data;
    let categoryData = {
    name: data[0].name
    }
    this.boundCategory.name = data[0].name;
    this.productsService.getProducts(categoryData).subscribe(data => {
      this.products = data;
	  if(data.length == 0){
		  this.emptyList = true;
	  }else {
		  this.emptyList = false;
	  }
    });
  },
    err => {
      console.log(err);
      return false;
    });
  }
//========================== Messages ========================================//

public showMessage = function(type, msg){
  this.messageMsg = msg;
  this.messageType = type;

  this.messageIsShown = true;

  var scope = this;
    function fadeMessage(){
     scope.messageIsShown = false;
    }
   setTimeout(fadeMessage, 3000);
}


//========================== Modal ===========================================//

  togleModal(){
    if(this.isModal == true){
      this.isModal = false;
      this.isModalAddProduct = false;
      this.isModalEditProduct = false;
      this.isModalAddCategory = false;
      this.isModalDeleteCategory = false;
      this.isModalDeleteProduct = false;
    } else {
      this.isModal = true;
    }
  }

  onModalEditProduct(product){
    this.boundProduct = product;
    this.togleModal();
    this.isModalEditProduct = true;
  }

  onModalAddProduct(){
    this.togleModal();
    this.isModalAddProduct = true;
  }

  onModalDeleteProduct(product){
    this.boundProduct = product;
    this.togleModal();
    this.isModalDeleteProduct = true;
  }

  onModalAddCategory(){
    this.togleModal();
    this.isModalAddCategory = true;
  }

  onModalDeleteCategory(category){
    this.boundCategory = category;
    this.togleModal();
    this.isModalDeleteCategory = true;
  }

//========================== Categories ======================================//

  getCategories(){
    this.productsService.getCategories().subscribe(data => {
    this.categories = data;
  },
    err => {
      console.log(err);
      return false;
    });
  }

  onAddCategory(category){
    let duplicate = false;
    for(let i = 0; i < this.categories.length; i++){
      if(this.categories[i].name == this.boundAddCategory.name) duplicate = true;
    }
    if(duplicate == true){
      this.showMessage("nok", "Категория с таким названием уже существует");
    } else{
      let data = {
        name: this.boundAddCategory.name
      }
      this.productsService.addCategory(data).subscribe(data => {
        if(data.success){
          this.getCategories();
          this.isModal = false;
          this.isModalAddCategory = false;
          this.showMessage("ok", data.msg);
        } else {
          this.showMessage("nok", data.msg);
        }
      });
    }
  }

  onDeleteCategory(){
    let data = {
      name: this.boundCategory.name
    }

    this.productsService.deleteCategory(data).subscribe(data => {
      if(data.success){
        this.getCategories();
        this.isModal = false;
        this.isModalDeleteCategory = false;
        this.showMessage("ok", data.msg);
        if(this.products[0].category == this.boundCategory.name){
          this.boundCategory.name = this.categories[0].name;
          this.getProducts();
        } else {
			this.boundCategory.name = this.products[0].category;
		}
      } else {
        this.showMessage("nok", data.msg);
      }
    });
  }

//========================== Products ========================================//

getProducts(){
  let dataCategory = {
    name: this.boundCategory.name
  }
  this.productsService.getProducts(dataCategory).subscribe(data => {
    this.products = data;
	if(data.length == 0){
		  this.emptyList = true;
	  } else {
		  this.emptyList = false;
	  }
  });
}

  onAddProduct(){
    let data = {
      id: 0,
      name: this.productName,
      sPrice: this.productSPrice,
      pPrice: this.productPPrice,
      category: this.productCategory
    }
    if(this.productCategory == undefined || this.productCategory == "Выберите категорию"){
      this.showMessage("nok", "Выберите категорию");
    } else {
      this.productsService.addProduct(data).subscribe(data => {
        if(data.success){
          this.getProducts();
          this.isModal = false;
          this.isModalAddProduct = false;
          this.showMessage("ok", data.msg);
        } else {
          this.showMessage("nok", data.msg);
        }
      });
    }
  }

  onGetProducts(category){
    this.boundCategory.name = category.name;
    if(category == "Без категории"){
      this.boundCategory.name = category;
    } 
	this.getProducts();
  }

  onDeleteProduct(){
    let data = {
      id: this.boundProduct.id
    }
    this.productsService.deleteProduct(data).subscribe(data => {
      if(data.success){
      this.getProducts();
      this.isModal = false;
      this.isModalDeleteProduct = false;
        this.showMessage("ok", data.msg);
      } else {
        this.showMessage("nok", data.msg);
      }
    });
  }

  onEditProduct(){
	  let prodCategory = this.boundProduct.category;
	  if( prodCategory.toString() == ("Выберите категорию" || undefined)){
		  this.showMessage("nok", "Выберите категорию");
	  } else {
		  let product = this.boundProduct;
    let data = {
      id: product.id,
      name: product.name,
      sPrice: product.sPrice,
      pPrice: product.pPrice,
      category: product.category
    }

    this.productsService.editProduct(data).subscribe(data => {
      if(data.success){
        this.getProducts();
        this.isModal = false;
        this.isModalEditProduct = false;
        this.showMessage("ok", data.msg);
      } else {
        this.showMessage("nok", data.msg);
      }
    });
	  }
  }

}
