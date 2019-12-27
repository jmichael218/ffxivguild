// Firebase Module

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

// run firebase
// config 中的參數 API key 等, 部署前 需移動至 env 和 設定檔中
var config = {
    apiKey: "AIzaSyBz5xhuVYskM0_kb3rY1ryWllIsdwZFT7Q",
    authDomain: "ffxivproject-7a3b8.firebaseapp.com",
    databaseURL: "https://ffxivproject-7a3b8.firebaseio.com/",
    storageBucket: ""}

firebase.initializeApp(config);
console.log('Finsh init firebase Module ...');

// APIs
exports.showDB = function(callback) {

  var database = firebase.database();
  database.ref('/').once('value',e=>{

      var eVal = e.val();
      callback(eVal);
  });
}
