const mongoose = require('mongoose');
const config = require('../config/database');

// Product Schema
const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.getCategories = function(callback) {
Category.find(callback);
}

module.exports.addCategory = function(newCategory, callback){
      newCategory.save(callback);
}

module.exports.deleteCategory = function(filter, callback){
  Category.remove({name: filter}, callback);
}
