var voteFn = {
	// 私有化
	limit:10,
	num:0,
	loadFlag:true,
	init: function(){
		voteFn.requestData('/vote/index/data?limit='+voteFn.limit+'&offset='+voteFn.num,'get',voteFn.indexUserStr);
		// onscroll tarmove
		voteFn.botScroll();
	},
	setStorage:function(){  // 设置本地存储
		localStorage.setItem(key,JSON.stringfy(obj));
	},
	getStorage:function( key ){	// 获取本地存储
		return JSON.parse( localStorage.getItem( key ) );
	},
	delteStorage:function(){
		localStorage.removeItem();
	},
	//  登录弹出层的点击登录
	signIn:function(){
		// 点击登录提交的操作；
		$('.subbtn').click(function(event) {
			var password = $('.mask .user_password').attr("pword");
			var id = $('.mask .usernum').val();
			if(!/^\d*$/.test(id)) {
				alert('请输入数字的编号');
				return false;
			};
			voteUser = {
				password: password,
				id: id
			}
			$.ajax({
				url: '/vote/index/info',
				type: 'POST',
				data: voteUser,
				success: function(data) {
					data = JSON.parse(data);
					if(data.errno === 0) {
						voteUser.username = data.user.username;
						// 登录成功 种下cookie
						voteFn.setStorage('voteUser', voteUser);
						window.location = url;
					} else {
						console.log('请求错误了');
						alert(data.msg);
					}
				}
			})
		});
	},
	// 
	signInAction:function(){
		// 首页 右边的用户登录点击的操作
		$('.sign_in').on('tap',function(event){
			$('.mask').show();
			var voteUser = voteFn.getStorage('voteUser');
			if(voteUser){
				$('.no_signed').hide();
				$('.singed .username').html(voteUser.username);
				//退出操作
				$('.signed .dropout').on('tap',function(){
					voteFn.delteStorage('voteUser');
					window.location =url;// 刷新页面
				});
				return false;
			}
			voteFn.signIn();
		});
	},
	/**
	*登录的遮罩层事件绑定
	**/ 
	maskDeal:function(){
		$('.mask').on('tap',function(event){
			voteFn.passwordDiaplay('user_passwod');
			if(event.target.className =="mask"){
				$('.mask').hide();
			};
		});
	},
	botScroll:function(){
		$(window).scroll( function(){
				var winHeight = document.documentElement.clientHeight || document.documentElement.clientHeight;
				var allHeight = document.documentElement.scrollHeight || document.body.scrollHeight ;
				var scrollHeight =  document.documentElement.scrollTop || document.body.scrollTop;
				console.log(allHeight,winHeight+scrollHeight)
				if(winHeight+scrollHeight> allHeight){
					alert('到底部了');
					// 圆圈  正方形去掉一条边转起来就就好了
					voteFn.indexUserStr();
					voteFn.num++;	
					voteFn.requestData('/vote/index/data?limit='+voteFn.limit+'&offset='+voteFn.num,'get',voteFn.indexUserStr);
				};
		});
	},
	indexUserStr : function(data){
		$('.loading').css('display','none');
		voteFn.lock = true;
		var str ='';
		var arrs = data.data.objects;
		for( var i =0 ; i<arrs.length;i++){
			str += '<li>';      
            str +='<div class="head">' ;
            	str += '<a href="detail.html"><img src="'+arrs[i].head_icon+'" alt=""></a>';             
            str += '</div>';                
            str += '<div class="up">';                
	            str += '<div class="vote"><span>'+arrs[i].vote+'票</span></div>';           
	            str += '<div class="btn">投TA一票</div>';            
            str += '</div>'; 
            str +='<div class="descr">' ;              
	            str +='<a href="detail.html">';
		            str += '<div>';                
			            str +='<span>'+arrs[i].username+'</span>';
			            str +='<span>|</span>';
			            str +='<span>编号#'+arrs[i].id+'</span>'; 
		            str += '</div>'; 
		            str +='<p>'+arrs[i].description+'</p>' ;                                              
	            str +='</a>';
            str += '</div>';   
            str += '</li>';
		}
		$('#coming').append(str);
	},
	requestData : function(url ,type , callback,data){
		data = data || null;
		voteFn.lock = false;
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
		});
	},
	username : $('.username').val(),
	password : $('.initial_password').val(),
	phone :$('.mobile').val(),
	confirm_password:$('.confirm_password').val(),
	description : $('.description').val(),	
	registerInt:function(){
		var  rebtnFlag = true;
		$('.rebtn').click(function(){
			if(!rebtnFlag){
				return false;
			};
			// 加锁
			rebtnFlag = false;
			if( voteFn.regForm() === false){
				//发送请求
				rebtnFlag = true;
				return;
			};
			// 发请求
			voteFn.requestData('vote/register/data','post',formData);
			}
		});
	},
	regForm:function(){
		var username = $('.username').val();
		var mobile = $('.mobile').val();
		var description = $('.description').val();
		var password = $('.initial_password').attr('pword');
		var gender = "";
		$('.gender input').each(function(index, el) {
			if($(this).attr('select') === 'yes') {
				gender = index == 0 ? 'boy' : 'girl'
			}
		});
		if(!username) {
			alert("请填写用户名称");
			return false;
		}
		if(!/^\d{11}$/.test(mobile)) {
			alert("请填写正确格式的手机号码");
			return false;
		}
		if(!description) {
			alert("请填写自我描述内容");
			return false;
		}
		return {
			username: username,
			mobile: mobile,
			description: description, = $('')
			gender: gender,
			password: password
		};

		var username = $('.username').val();
		var mobile = $('.mobile').val();
		var description = $('.description').val();
		var password = $

	}
};
//我很幸福开心


var indexReg =/index/;
var register =/register/;
var url =  location.href;
$(function(){
	if(indexReg.test(url)){
		//主页
		voteFn.maskDeal();
		voteFn.signInAction();
		// var voteUser = voteFn.getStorage('voteUser');
		voteFn.init();
	}else if(register.test(url)){
		// 验证 传值 返回首页
		console.log('报名页面');
		voteFn.registerInt();
		$('.gender input').click(function(event) {
			console.log('点激动了');
			$(this).attr('select', 'yes').prop('checked',true).parent('div').siblings('div').children('input').attr('select', 'no').prop('checked',false); 
		});
	}
});