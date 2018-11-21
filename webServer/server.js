// **********************************************************
// ippon
// lemo 2017/03/01
// **********************************************************

/////////////////////////////////////////////////////////////
//　モジュールロード
/////////////////////////////////////////////////////////////
var express = require('express');
var fs      = require('fs');
var async   = require('async');

var http = require('http');
var path = require('path');
var exec = require('child_process').exec;
var uploadManager = require('uploadManager');
var queue = require('Queue');

/////////////////////////////////////////////////////////////
//　ページ
/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
//　プロパティ
/////////////////////////////////////////////////////////////
var app;
init();
/////////////////////////////////////////////////////////////
//　初期化
/////////////////////////////////////////////////////////////
function init(){
	//express
	app  = express();
	//setup
	setUpExpress();
	//ページ設定
	setUpPages();
	//
	run();
}


/////////////////////////////////////////////////////////////
//　Expressの設定
/////////////////////////////////////////////////////////////
function setUpExpress(){
	app.set('port', process.env.PORT || 8090);//80じゃ実行できないくさい少なくともMacは
	app.set('views', path.join(__dirname, 'public'));
	app.set('view engine', 'ejs');

	app.use(express.cookieParser('shhhh, very secret'));
	app.use(express.session());
	app.use(express.bodyParser({
		uploadDir: path.join(__dirname, 'temp')
	}));
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public'), {maxAge:0}));

	console.log( 'view cache >> ' +  app.enabled('view cache') );
}


/////////////////////////////////////////////////////////////
//　実行
/////////////////////////////////////////////////////////////
function run(){
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
}

var count = 0;

/////////////////////////////////////////////////////////////
//　ページの設定
/////////////////////////////////////////////////////////////
function setUpPages(){
	
	/// カウント取得
	app.get('/getCount',function(req, res){
		res.json({status:200,data:count});
	});

	///カウントアップ
	app.post('/countup',function( req, res ){
		count++;
		res.json( {
			status:200
		});
	});

	///カウントリセット
	app.post('/reset',function( req, res ){
		count = 0;
		res.json( {
			status:200
		});
	});
}






