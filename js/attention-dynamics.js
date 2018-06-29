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
		area: ['340px', '390px'],
		content: $('.alert_imageWrapper'), 
		cancel: function(){
			console.log(imgFile)
			
		}
		
	});
 
}
//判断弹窗位置
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
	imgFile = obj.files[0];  
    console.log(imgFile);
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
		fr.readAsDataURL(imgFile);
		preview.src = reader.result; //拿到图片的结果
		
}
//删除图片
$(document).on('click','.upedImg .deleteImg',function(){  
    //处理未来事件  
    $(this).parent().parent().remove();  
})  
//上传图片
function uploadPic(){
	debugger
	var formData=new FormData();
	formData.append("imgFile",imgFile);
	$.ajax({
        type: 'POST',
		url:WebApiHostJavaApi + 'common/upload',
		data:formData,
		async:false,
		processData:false,
		success:function(data){
			if (data.code == 0) {
		        // 把照片的值存在对应的input
		        member_pic_name = t.parentElement.nextElementSibling.firstElementChild
		        member_pic_name.value =  data.datas[0]
		        // layer.msg('上传成功')
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
$("input").change(function(e){
	var num=e.target.files.length //这就是用户选择的图片数量，根据这个值决定是否进行上传
	console.log(num);
   
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
