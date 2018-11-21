/************************************************
*
* ファイルのドラッグ&ドロップの処理
*
************************************************/
////////////////////////////////
// プロパティ
////////////////////////////////


////////////////////////////////
//
////////////////////////////////
$(function(){
	/*================================================
	ファイルをドロップした時の処理 : 分割
	=================================================*/
	$('#plzPdf').bind('drop', function(e){
	// デフォルトの挙動を停止
		e.preventDefault();
		// ファイル情報を取得
		var files = e.originalEvent.dataTransfer.files;
		console.log(files);

		/// アップロード ///
		uploadFiles(files , function( resultData ){
			if(resultData.status==200){
				console.log( 'upload成功:'+resultData.data );
				$('#plzPdf').hide();
				PDF = resultData.data;
				initPdf( PDF );
			}else{
				//アップロード失敗表示 ///
				alert('upload失敗!');
			}
		});

	}).bind('dragenter', function(){
		// デフォルトの挙動を停止
		return false;
	}).bind('dragover', function(){
		// デフォルトの挙動を停止
		//$('#encBox').addClass('dragOver');
		return false;
	}).bind('dragleave', function(){
		// デフォルトの挙動を停止
		//$('#encBox').removeClass('dragOver');
		return false;
	}).bind('drop',function(){
		//$('#encBox').removeClass('dragOver');
		return false;
	});
});




/*================================================
  ファイルのアップロード処理
=================================================*/
function uploadFiles( files , callback ) {
	// FormDataオブジェクトを用意
	var fd = new FormData();
	fd.append("pdf", files[0]);
	postData('/upload' , fd , callback );
}







