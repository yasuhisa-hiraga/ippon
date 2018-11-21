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
	app.set('port', process.env.PORT || 8080);//80じゃ実行できないくさい少なくともMacは
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

/////////////////////////////////////////////////////////////
//　ページの設定
/////////////////////////////////////////////////////////////
function setUpPages(){
	//回答者リセット
	restAnswer();

	//PDF受付
	app.post('/upload'  , function(req , res){
		uploadManager.upload(req.files.pdf, './public/pdf', function(err,uplist){
			var resData = {
				status:200
			};
			if(err){
				resData.status = '500';
				resData.error  = err;
			}else{
				//受け取ったファイル名を返す
				var questionPdfName = uplist[0].split('/').pop();
				resData.data    = questionPdfName;
				currentQuestion = questionPdfName;
			}
			res.json( resData );
		});
	});

	/// 回答が来てないかポーリングする
	app.get('/getAnswer',function(req, res){
		if(currentAnswer.text){
			res.json( {
				status:200,
				data:currentAnswer
			});
			//回答リセット
			restAnswer();
		}else{
			res.json( {
				status:404,
				error:'現在回答はありません'
			});
		}
	});

	///回答の受付
	app.post('/sendAnswer',function( req, res ){
		console.log(req.body.text);
		//todo
		currentAnswer={
			text    : req.body.text.replace(/\n/g,'<br>'),
			color   : req.body.color,
			answerer: req.body.answerer
		};
		res.json( {
			status:200
		});

		//ログ出力
		addAnswerData( currentAnswer );

		// todo
		// 出題とページと回答情報をひとまとめにしてjson出力しとく.あとで見る用。
		//
		//

	});

	///評価の受付
	var evQue = new queue();
	app.post('/sendEvaluate',function( req, res ){
		var ev = req.body.evaluate;
		evQue.enqueue( ev );
		res.json( {
			status:200
		});
		//ログアップデート
		updateEvaluate( ev );
	});
	//評価を伝える
	app.get('/getEvaluate',function( req , res ){
		var ev = evQue.dequeue();
		if(ev){
			res.json( {
				status:200,
				data:ev
			});
		}else{
			res.json( {
				status:404
			});
		}
	});

	//現在のページ番号取得
	app.post('/sendPageNumber',function( req , res ){
		currentPage = req.body.currentPage;
		res.json( {
			status:200
		});
		console.log('現在のページ:'+currentPage);
	});
}

/////////////////////////////////////////////////////////////
// 現在使用中の問題
/////////////////////////////////////////////////////////////
var currentQuestion = '';
var currentPage = 1;
/////////////////////////////////////////////////////////////
// 現在受け付けた回答
/////////////////////////////////////////////////////////////
var currentAnswer={};
function restAnswer(){
	currentAnswer={
		text:'',
		color:'black',
		answerer:'名無し'
	};
}
var currentAnswerId=0;

/////////////////////////////////////////////////////////////
// 問題と回答のログ更新
/////////////////////////////////////////////////////////////
var answerDataList = [];
function addAnswerData( currentAnswer ){
	currentAnswerId = new Date().getTime();
	answerDataList.push({
		id          : currentAnswerId ,
		pdfName     : currentQuestion,
		currentPage : currentPage,
		answerer    : currentAnswer.answerer,
		text        : currentAnswer.text,
		color       : currentAnswer.color,
		good        : 0,
		bad         : 0,
		better      : 0,
		crazy       : 0
	});
	outputAnswerData();
	/*
	//ちゃんと考えた場合のschema
	pdfData:{
		id:99999,
		name:'aaa.pdf'
	}
	questionData:{
		id:888888,
		pdfId:99999,
		pageNumber:1,
	}
	answerData:{
		id:12345678,
		questionId:888888,
		answerer:'やす',
		text:'かいとう',
		color:'black'
	}
	evaluateData:{
		'answerId':12345678,
		'good':1,
		'bad':2,
		'better':3,
		'crazy':99
	}
	*/

	/*
	もう少しシンプルに,,
	//新しい回答があるごとにデータを追加していく
	answerData:{
		id:9999999,
		pdfName:'aaa.pdf',
		currentPage:1,
		answerer:'やす',
		text:'かいとう',
		color:'black',
		good:1,
		bad:2,
		better:3,
		crazy:99
	}
	*/
}

function updateEvaluate( evaluate ){
	var answerData = getAnswerData( currentAnswerId );
	if( answerData ){
		answerData[evaluate]++;
		outputAnswerData();
	}
}

function getAnswerData( currentAnswerId ){
	for(var i=0;i<answerDataList.length;i++){
		if(answerDataList[i].id == currentAnswerId )return answerDataList[i];
	}
	return null;
}

function outputAnswerData(){
	fs.writeFileSync( './answerData/answers.json' , JSON.stringify( answerDataList, null , '\t') );
}
