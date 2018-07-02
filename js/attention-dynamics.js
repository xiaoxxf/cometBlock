//编辑textarea鼠标光标居于左上角
function textareaFocus(e,a){
	if (e && e.preventDefault )
		e.preventDefault();
	else
		window.event.returnValue=false;
		a.focus();
		
}

//点击图片出现下方图片列表弹出框

function ImageAlert(){
	layer.open({
		type: 1,
		shade: false,
		title: false, //不显示标题
		//offset: ['350', '380'],//弹窗自定义位置
		area: ['340px', 'auto'],
//		area: ['340px', '160px'],
		content: $('.alert_imageWrapper'), 
		scrollbar: false,
		cancel: function(){
			console.log(imgFile)
			$('.imgOnloadWrap').html('');
		},
		
	
	});

}
//判断弹窗位置-在图片下方
$(document).ready(function(){
  $("button").click(function(){
    x=$("p").offset();
    $("#span1").text(x.left);
    $("#span2").text(x.top);
  });
});


//点击预览上传图片方法
var imgFile;
function upImg(obj){
//	debugger
	imgFile = obj.files[0];  
//  console.log(imgFile);
    var img = new Image();  
    var fr = new FileReader();
    fr.onload = function(){  
        var htmlStr = '<div class="upWrapper">';  
        htmlStr += '<div class="fileWrap">';  
        htmlStr += '<input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onchange="upImg(this)"/>';  
        htmlStr += '</div>';  
        htmlStr += '<div class="imgWrap upedImg"><span class="deleteImg">X</span> ';  
        htmlStr += '<img src="'+fr.result+'" alt="" />';  
		//htmlStr += '<div class="upload_addImage_icon"><i class="fa fa-plus add_icon" style="font-size: 24px;"></i></div>';  
        htmlStr += '</div>';  
        htmlStr += '</div>';  
       	$('.imgOnloadWrap').append(htmlStr);
        obj.value = '';  
		} 
		
		var preview = $('.upedImg').find('img')[0];
		
//		fr.addEventListener("load", function() {
//			preview.src = fr.result; //拿到图片的结果
//		}, false);
		
		fr.readAsDataURL(imgFile);
		uploadPic(imgFile);
		
}
//删除图片
$(document).on('click','.upedImg .deleteImg',function(){  
    //处理未来事件  
    $(this).parent().parent().remove();  
})  
//上传图片
function uploadPic(imgFile){
	
	var formData=new FormData();
	formData.append("file",imgFile);
	$.ajax({
        type: 'POST',
		url:WebApiHostJavaApi + 'common/upload',
	    data: formData,
//	    datType: "json",
	    async: false,//使用同步的方式,true为异步方式
	    processData: false,  // 不处理数据
	    contentType: false,   // 不设置内容类型
		success:function(data){
			
			if (data.code == 0) {
		        layer.msg('上传成功')
				var imgUrl=data.datas[0]; //保存返回的图片地址
//				var arr = new Array(9); //创建数组保存9张图片
//				arr[0]=imgUrl;
//				console.log(arr)

		    }else if(data.code == -1){
		        layer.msg(data.msg)
		    }
		},
		error:function(e){
	      // ui.fileUpLoading = false
	      layer.msg("上传错误，请重试！");
	    }
	});
}






//限制上传图片数量
var uploadImageNum; //
$("input").change(function(e){
//	var num=e.target.files.length //这就是用户选择的图片数量，根据这个值决定是否进行上传
	uploadImageNum=$(".imgOnloadWrap .upWrapper").length 
	console.log(uploadImageNum)
	if(uploadImageNum >= 8){
//		htmlStr="";
		console.log("g")
		$(".upWrapper > .imgWrap").css("display","none");
	}
	$('.sum_upload_image').html(uploadImageNum + 1); //共几张
	$('.leave_upload_image').html(8 - uploadImageNum ); //已经上传几张
		
});

	
//鼠标移入

//$(document).ready(function(){
//	$(".fileWrap").mouseover(function(){
//		$(".upedImg > span.deleteImg").css("display","none");
//	});
//	$(".fileWrap").mouseout(function(){
//		$(".upedImg > span.deleteImg").css("display","block");
//	});
//});



//弹窗位置
