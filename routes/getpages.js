const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const request = require('request');
const cheerio = require('cheerio');
var Promise = require("bluebird");

var PDF = require('pdfkit');
var fs = require('fs');

  // Получаем запрос

  router.post('/download', function(req, res){
    let filename = req.body.filename;
    let file = './files/'+filename+'.pdf';
    res.download(file);
  });

  router.post('/getpdf', function(req, res){

    let fileName = generateFileName();
    let text = fileName;
    let doc = new PDF();
    doc.pipe(fs.createWriteStream('./files/'+fileName+'.pdf'));
    doc.text(text, 100, 100);
    doc.end();
    res.send({filename: fileName});
  });

  router.post('/getparsed', function(req, res){
     let urlList = req.body.data;
     let request = Promise.promisifyAll(require("request"), {multiArgs: true});

      Promise.map(urlList, function(url) {
          return request.getAsync(url).spread(function(response,body) {
            let $ = cheerio.load(body);
            let a = $("a").text();
            let str = a.split(" ");
            let accurate = toFormat(str);
            return accurate;
          });
      }).then(function(results) {
           // results is an array of all the parsed bodies in order
           res.send({data: results});
      }).catch(function(err) {
           // handle error here
           res.send({data: err});
      });


   });

//==========
  function getMostRepeating(arr){
    let resultingArr = [];
    let resultingObj = {};
    // Собираем все в один массив
    for (let i = 0; i < arr.length; i++){
      for (let j = 0; j < arr[i].length; j++){
        resultingArr.push(arr[i][j]);
      }
    }
  // Записываем в объект связки "слово: кол-во повторений"
  for (let i = 0; i < resultingArr.length; i++){
    if (resultingObj[resultingArr[i]] != undefined) continue;
    let counter = 0;
    for (let j = 0; j < resultingArr.length; j++){
      if (resultingArr[i] == resultingArr[j]) counter++;
    }
    resultingObj.resultingArr[i] = counter;
  }
  // Выбираем три ключа с наибольшими значениями
  let mostRepeating = [];

  for (let i = 0; i < 3; i++){
    let maxRepeated = "";
    let count = 0;
    for (let word in resultingObj){
      if (count < resultingObj[word]){
        count = resultingObj[word];
        maxRepeated = word;
      }
    }
    mostRepeating.push(maxRepeated);
    resultingObj.maxRepeated = 0;
  }
  return mostRepeating;
  }

function toFormat(arr){
  let result = [];
  for (let i = 0; i < arr.length; i++){
    let str = trimmer(arr[i]);
    if(str.length > 4){
        result.push(str); //.toLowerCase()
    }
  }
  return result;
}

function trimmer(str){
  let result = str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ');
  return result;
}

function generateFileName(){
  let str = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 20; i++){
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return str;
}



module.exports = router;
