var ui = {
  'submiting': false
}
$(function(){


  $(".my-rating").starRating({

    strokeColor: '#894A00',
    strokeWidth: 10,
    starSize: 25,
    initialRating: 0,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });

  var E = window.wangEditor
  var editor = new E('#editor')
  // 或者 var editor = new E( document.getElementById('editor') )
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
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = result.datas[0]
          insertImg(url)
      }

  }
  // editor.customConfig.debug = true
  editor.create()



  $('.submit_comment').on('click',function(){

    if (ui.submiting) {
      return false
    }

    ui.submiting = true
    score = parseInt($(".live-rating")[0].innerHTML)
  	var data = {
  		textTitle: $('input[name="head"]')[0].value,
  		textContent: editor.txt.html(),
  		projectId: 1, //项目
  		score: score, //评分
  		type: 2, //长文的type为2
  		userId: window.localStorage.userid, //userId
  		password:	123
  	}

    // var uri = 'http://10.0.0.169:8080/blockchain/addReview'

    function callback(result){
      if(result.code=="0"){
        ui.submiting = false
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
