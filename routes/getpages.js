const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const request = require('request');
const cheerio = require('cheerio');

  // Получаем запрос
  router.post('/getparsed', function(req, res){
    let urlArr = req.body.data;
    let resultAll = [];
    let result = [];
    /*
    // Получаем массив всех слов по каждому сайту
    for (let i = 0; i < urlArr.length; i++){
      let siteResult = parseSingle(urlArr[i]);
      resultAll.push(siteResult);
    }
    // Получаем три наиболее частых по каждому сайту
    for (let i = 0; i < resultAll.length; i++){
      let words = getMostRepeating(resultAll[i]);
      let item = {
        site: urlArr[i],
        words: words
      };
      result.push(item);
    }
*/
    let item = {
      site: urlArr[0],
      words: "words"
    };
    res.send({"data" : item}); // {"data" : result}
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

function parseSingle(url){
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let a = $("a").text();
      let str = a.split(" ");
      let accurate = toFormat(str);
      return accurate;
    } else{
      return ["Error: Bad response from "+url];
    }
  });
}

function toFormat(arr){
  let result = [];
  for (let i = 0; i < arr.length; i++){
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
