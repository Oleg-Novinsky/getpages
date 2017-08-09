const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const request = require('request');
const cheerio = require('cheerio');
var Promise = require("bluebird");

var PDF = require('pdfkit');
var fs = require('fs');

  router.post('/getdatafrompages', function(req, res){
     let urlList = req.body.data;
     let request = Promise.promisifyAll(require("request"), {multiArgs: true});

      Promise.map(urlList, function(url) {
          return request.getAsync(url).spread(function(response,body) {
            let $ = cheerio.load(body);
            let tags = ["a", "p", "h1", "h2", "h3", "h4", "h5", "span"];
            let resultFromEachTag = [];
            for (let tag = 0; tag < tags.length; tag++){
              let arr = $(tags[tag]).text().split(" ");
              arr = toFormat(arr);
              resultFromEachTag.push(arr);
            }
            let rsp = getMostRepeating(resultFromEachTag);
            return rsp;

          });
      }).then(function(results) {
           // results is an array of all the parsed bodies in order
           res.send({data: results, urls: urlList});
      }).catch(function(err) {
           // handle error here
           res.send({
             err: err,
             reason: err.cause.code,
             hostname: err.cause.hostname
           });
      });


   });

   router.post('/generatepdf', function(req, res){
     let content = req.body.data;
     let urls = req.body.urls;
     let fileName = generateFileName();

     let doc = new PDF();
     doc.pipe(fs.createWriteStream('./files/'+fileName+'.pdf'));
     for (let i = 0; i < urls.length; i++){
       doc.text("Site: "+urls[i]+" Words: "+content[i]);
     }
     doc.end();
     res.send({filename: fileName});
   });

   router.post('/download', function(req, res){
     let filename = req.body.filename;
     let file = './files/'+filename+'.pdf';
     res.download(file);
   });

//==========
function getMostRepeating(arr){
  let resultingArr = [];
  let resultingObj = {};
  let mostRepeating = [];

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
    resultingObj[resultingArr[i]] = counter;
  }
  // Выбираем три ключа с наибольшими значениями
  for (let i = 0; i < 3; i++){
    let mostRepeatedWord = "";
    let count = 0;
    for (let word in resultingObj){
      if (count < resultingObj[word]){
        count = resultingObj[word];
        mostRepeatedWord = word;
      }
    }
    mostRepeating.push(mostRepeatedWord);
    resultingObj[mostRepeatedWord] = 0;
  }

  return mostRepeating;
}

//==============

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
