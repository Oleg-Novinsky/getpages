const mongoose = require('mongoose');
const config = require('../config/database');

// Product Schema
const ProductSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sPrice: {
    type: Number,
    required: true
  },
  pPrice: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.addProduct = function(newProduct, callback){
  newProduct.save(callback);
}

module.exports.getProducts = function(filter, callback){
  Product.find({category: filter}, callback);
}

module.exports.deleteProduct = function(filter, callback){
  Product.remove({id: filter}, callback);
}

module.exports.editProduct = function(newProduct, callback){
  let query = {"id": newProduct.id};

      Product.findOneAndUpdate(
        query,
        { $set: {
          "name": newProduct.name,
          "sPrice": newProduct.sPrice,
          "pPrice": newProduct.pPrice,
          "category": newProduct.category
                }
        },
        function(err, doc){
    if(err){
        console.log("Something went wrong!");
           }
        callback();
    }
  );
}

module.exports.removeCategory = function(filter, callback){
  let query = {"category": filter};

      Product.update(
        query,
        { $set: {
          "category": "Без категории"
                }
        },
        function(err, doc){
    if(err){
        console.log("Something went wrong!");
           }
        callback();
    }
  );
}

module.exports.getMaxId = function(callback){
  Product.find(callback).sort({id:-1}).limit(1);
}
