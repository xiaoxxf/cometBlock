var ui = {
  'submiting': false
}
$(function(){
  // 星星评分
  $(".my-rating").starRating({
    strokeColor:'#ffc900',
    ratedColor:'#ffc900',
    activeColor:'#ffc900',
    hoverColor:'#ffc900',
    strokeWidth: 10,
    useGradient:false,
    starSize: 25,
    initialRating: 0,
    useFullStars:true,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });

  // 编辑器
  var E = window.wangEditor
  var editor = new E('#editor')
  editor.customConfig.menus = [
    'bold',
    'italic',
    'head',
    'emoticon',
    'link',  // 插入链接
    'image',  // 插入图片
  ]

  var uploadUri = 'common/upload'

  editor.customConfig.uploadImgServer = WebApiHostJavaApi + uploadUri;
  editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 //图片大小为5M
  editor.customConfig.uploadFileName = 'file'


  editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {

      },
      success: function (xhr, editor, result) {
        console.log('ok')
      },
      fail: function (xhr, editor, result) {
        alert('插入错误')
      },
      error: function (xhr, editor) {
        alert('上传错误')
      },
      timeout: function (xhr, editor) {

      },

      customInsert: function (insertImg, result, editor) {
        var url = result.datas[0]
        insertImg(url)
      }

  }
  // editor.customConfig.debug = true
  editor.create()


  // 提交
  $('.submit_comment').on('click',function(){

    if (ui.submiting) {
      return false
    }

    ui.submiting = true
    score = parseInt($(".live-rating")[0].innerHTML)
  	var data = {
  		textTitle: $('input[name="head"]')[0].value,
  		textContent: editor.txt.html(),
  		projectId: "331226f0-4d51-4c0e-b964-533817fb7430", //项目
  		score: score, //评分
  		type: 2, //长文的type为2
  		userId: window.localStorage.userid, //userId
  		password:	123
  	}

    // var uri = 'http://10.0.0.169:8080/blockchain/addReview'

    function callback(result){
      if(result.code=="0"){
        ui.submiting = false
        // TODO: 跳转回详情页
        console.log('ok')
       }
    }
    var uri = 'blockchain/addReview'
    doPostJavaApi(uri, JSON.stringify(data), callback, 'json')


  	// $.ajax({
  	// 	type: 'POST',
  	// 	url: uri,
  	// 	data: JSON.stringify(data),
  	// 	dataType : 'json',
  	// 	contentType: 'application/json; charset=UTF-8',
  	// 	success: function (result) {
  	// 	 if(result.code=="0"){
  	// 		 	// TODO: 跳转回项目页
    //       ui.submiting = false
  	// 			console.log('ok')
  	// 		}
  	// 		else{
  	// 			alert("保存失败");
  	// 		}
  	// 	},
  	// 	error: function (err) {
  	// 			//$.dialog.tips("Request Error!");
  	// 	}
  	// });

  })

})
