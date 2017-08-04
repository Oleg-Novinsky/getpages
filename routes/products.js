const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Product = require('../models/product');
const Category = require('../models/category');

// Routes
router.get('/products', (req, res, next)=>{
  res.send('products');
});
//========================== Categories ======================================//
router.get('/getcategories', function(req, res, next){
  Category.getCategories((err, data) => {
    if (err){
      res.json({success: false, msg: 'Категории не найдены'});
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

router.post('/addcategory', (req, res, next) => {
  let newCategory = new Category({
    name: req.body.name
  });

  Category.addCategory(newCategory, (err, category) => {
    if (err){
      res.json({success: false, msg: 'Не удалось создать категорию'});
      console.log(err);
    } else {
      res.json({success: true, msg: 'Категория успешно создана'});
    }
  });
});

router.post('/deletecategory', (req, res, next) => {
  let filter = req.body.name;

  Category.deleteCategory(filter, (err, category) => {
    if (err){
      res.json({success: false, msg: 'Не удалось удалить категорию'});
      console.log(err);
    } else {
      Product.removeCategory(filter, (err, category) => {
        if (err){
          res.json({success: false, msg: 'Категория удалена, но не удалось убрать ее из товаров'});
          console.log(err);
        } else {
          console.log("Category removed");
        }
      });
      res.json({success: true, msg: 'Категория успешно удалена'});
    }
  });
});

//========================== Products ========================================//
router.post('/editproduct', function(req, res, next){

  let newProduct = {
    id: req.body.id,
    name: req.body.name,
    sPrice: req.body.sPrice,
    pPrice: req.body.pPrice,
    category: req.body.category
  };

  Product.editProduct(newProduct, (err) => {
    if (err){
      res.json({success: false, msg: 'Не удалось изменить категорию товара'});
      console.log(err);
    } else {
      res.json({success: true, msg: 'Категория товара успешно изменена'});
    }
  });
});

router.post('/addproduct', (req, res, next) => {

  Product.getMaxId((err, product) => {
    if (err){
      res.json({success: false, msg: 'Не удалось обнаружить идентификаторы в базе товаров'});
      console.log(err);
    } else {
      let prodId;
      if (!product[0]){
        prodId = 1;
      } else {
        prodId = product[0].id;
        prodId++;
      }
      let newProduct = new Product({
        id: prodId,
        name: req.body.name,
        sPrice: req.body.sPrice,
        pPrice: req.body.pPrice,
        category: req.body.category
      });

      Product.addProduct(newProduct, (err, product) => {
        if (err){
          res.json({success: false, msg: 'Не удалось добавить товар'});
          console.log(err);
        } else {
          res.json({success: true, msg: 'Товар успешно добавлен'});
        }
      });
    }
  });
});

router.post('/getproducts', function(req, res, next){
  let filter = req.body.name;
  Product.getProducts(filter, (err, data) => {
    if (err){
      res.json({success: false, msg: 'Не удалось найти категории'});
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

router.post('/deleteproduct', (req, res, next) => {
  let filter = req.body.id;

  Product.deleteProduct(filter, (err, product) => {
    if (err){
      res.json({success: false, msg: 'Не удалось удалить товар'});
      console.log(err);
    } else {
      res.json({success: true, msg: 'Товар успешно удален'});
    }
  });
});


module.exports = router;
