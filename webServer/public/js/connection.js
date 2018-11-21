/************************************************
*
* サーバーとの通信周り
*
************************************************/
var TIMEOUT = 60 * 1000;//タイムアウトを60秒に設定
////////////////////////////////
// サーバーにデータ送信
////////////////////////////////
function postData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'POST',
		data:  data ,
		timeout:TIMEOUT,
		processData: false,
		contentType: false,
		success: callback
	});
}

////////////////////////////////
// GET送信 : 未テスト
////////////////////////////////
/// サーバーにJSON形式でデータ送信 /// 帰ってくるデータもJson形式にすること
/*
function getJsonData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'GET',
		data: JSON.stringify( data ),
		contentType: 'application/json',
		dataType: "json",
		success: callback
	});
}
*/
function getData( url , callback  ){
	$.ajax({
		url: url,
		type: 'GET',
		timeout:TIMEOUT,
		success: callback
	});
}

////////////////////////////////
// POST送信
////////////////////////////////
/// サーバーにJSON形式でデータ送信 /// 帰ってくるデータもJson形式にすること
function postJsonData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'POST',
		data: JSON.stringify( data ),
		contentType: 'application/json',
		dataType: "json",
		timeout:TIMEOUT,
		success: callback
	});
}

////////////////////////////////
// PUT送信 : 未テスト
////////////////////////////////
/// サーバーにJSON形式でデータ送信 /// 帰ってくるデータもJson形式にすること
function putJsonData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'PUT',
		data: JSON.stringify( data ),
		contentType: 'application/json',
		dataType: "json",
		timeout:TIMEOUT,
		success: callback
	});
}
////////////////////////////////
// サーバーにデータ送信
////////////////////////////////
function putData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'PUT',
		data:  data ,
		processData: false,
		contentType: false,
		timeout:TIMEOUT,
		success: callback
	});
}
////////////////////////////////
// DELETE送信 : 未テスト
////////////////////////////////
/// サーバーにJSON形式でデータ送信 /// 帰ってくるデータもJson形式にすること
function deleteJsonData( url , data , callback  ){
	$.ajax({
		url: url,
		type: 'DELETE',
		data: JSON.stringify( data ),
		contentType: 'application/json',
		dataType: "json",
		timeout:TIMEOUT,
		success: callback
	});
}
