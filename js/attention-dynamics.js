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
		area: ['300px', '200px'],
		content: $('.alert_imageWrapper'), 
		cancel: function(){
		
		}
		
	});

}
