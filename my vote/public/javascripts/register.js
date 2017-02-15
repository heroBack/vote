register ={
	username : $('.username').val(),
	password : $('.initial_password').val(),
	phone :$('.mobile').val(),
	confirm_password:$('.confirm_password').val(),
	description : $('.description').val(),	
	localKey:$(''),	
	init:function(){
		var userinfo = register.getStorage(register.localKey) ;

		// 事件委托和组织事件的冒泡
		$('.rebtn').click(function(){
				if(register.regForm() === false){
					var form = $('#register').serialize();
					console.log(form);
					register.requestData('/vote/register/data','post',ok,form);
				}
		});
		function ok(data){
			alert(data.msg);
			if(data.erro == 0){
				register.setStorge={username:data.username,id:data.id};
				winow.location.href= '/vote/index';


			}
		};

	},
	regForm:function(){
		if (register.username){
			alert('请输入用户名');
			return false;
		};
		if (register.password){
			alert('请输入密码');
			return false;
		};
		if (register.confirm_password){
			alert('确认密码不能为空');
			return false;
		};
		if (register.confirm_password == register.password){
			alert('两次密码输入不一致');
			return false;
		};
		var phoneReg = /^\d{11}$/;
		if (register.phone.test(RegphoneNum)){
			alert('请输入手机号');
			return false;
		};
		if (register.description){
			alert('请输入自我介绍');
			return false;
		};
		return true;
	},
	requestData : function(url ,type , callback,data){
		data = data || null;
		$.ajax({
			url:url,
			type:type,
			dataType:'json',
			beforeSend: function () {
			},
			success:function(data){
				callback(data);
			},
			erro:function(){
				console.log('请求错误');
			}
		})
	}

}
register.init();
