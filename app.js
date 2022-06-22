const express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;
const homes = require('./routes/route.js');




app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('layout extractScripts', true);

//app.engine('html', require('ejs').renderFile);

//css와 img 파일 사용을 위한 경로 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use('/',homes); //use 미들웨어 (중간다리 역할) 등록



module.exports = app;