
			
			$(function() {

				//验证手机号码输入格式
				jQuery.validator.addMethod("isMobile", function(value, element) {
					var length = value.length;
					var regPhone = /^1([3578]\d|4[57])\d{8}$/;
					return this.optional(element) || (length == 11 && regPhone.test(value));
				}, "请正确填写您的手机号码");

				$('#formLogin').validate({
					rules: {
						
						//   电话
						tel: {
							required: true,
							minlength: 11,
							isMobile: true

						},
						//   密码
						pwd: {
							required: true,
							minlength: 6
						},
					},
					messages: {
						
						//   电话
						tel: {
							required: '请输入手机号',
							minlength: "手机长度为11位",
							//                       isMobile:"请填写11位的手机号码!"
						},
						//   密码
						pwd: {
							required: '请输入密码',
							minlength: "密码长度不能小于 6 个字符"
						},
					},
					// 校验全部通过
					submitHandler: function() {
//						$("#load").attr({style:"-webkit-animation:loader2 1s 0.23s linear infinite"});
//           			$("#load div").attr({style:"display:block"});
//						setTimeout(function() { //两秒后跳转                                   
//							location.href = "index.html";
//						}, 1500);
					},

				})
			})

			$("#sign-in-form-submit-btn").click(function() {

				var param = {
					userName: $("#session_phone").val(),					
					userPwd: $("#session_password").val(),
					tel: $("#session_phone").val(),
					userType: 2,
				}

				
				var uri = 'news/login?userName=' + param.userName  + '&userPwd=' +hex_md5(param.userName+param.userPwd) ;					
				param = JSON.stringify(param)

				
				doJavaGet(uri, function(res) {
					
                    if(res != null && res.code == 0) {
                    	
						$("#load").attr({
							style: "-webkit-animation:loader2 1s 0.23s linear infinite"
						});
						$("#load div").attr({
							style: "display:block"
						});
						
						
						
                                
						setTimeout(function() { //两秒后跳转    
							
								localStorage.setItem('userinfo', res.datas);//存储
                                localStorage.setItem('userid', res.datas.id);      
                                
                                localStorage.setItem('userinfo', JSON.stringify(res.datas));
                                $.cookie('token', res.datas.id);
                                $.cookie('userid', res.datas.id);
                                
                                window.location.href="index.html";
							
						}, 1500);
						

					} else {
						
						layer.msg(res.msg);
						
					}
                }, "json");

			});
		
