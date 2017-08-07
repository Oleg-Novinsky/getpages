const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const request = require('request');
const cheerio = require('cheerio');
const iconv  = require('iconv-lite');

const Pages = require('../models/pages');


router.post('/getparsed', function(req, res){

  let arr = [];

  request('http://foxnews.com/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html);
    let a = $("a").text();
    let str = a.split(" ");
    let accurate = toFormat(str);

    res.send({"data" : accurate});
    }
  });


});

function toFormat(arr){
  let result = [];
  for(let i = 0; i < arr.length; i++){
    let str = trimmer(arr[i]);
    if(str.length > 4){
        result.push(str.toLowerCase());
    }
  }
  return result;
}

function trimmer(str){
  let result = str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ');
  return result;
}




module.exports = router;
