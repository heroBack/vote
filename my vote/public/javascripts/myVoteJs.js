var voteFn = {
	// 私有化
    lock:true,
	limit:10,
	num:0,
	loadFlag:true,
	init: function(){
		voteFn.requestData('/vote/index/data?limit='+voteFn.limit+'&offset='+voteFn.num,'get',voteFn.indexUserStr);
		// onscroll tarmove
		voteFn.botScroll();
	},
	setStorage:function(key,obj){  // 设置本地存储
		localStorage.setItem(key,JSON.stringify( obj ));
	},
	getStorage:function( key ){	// 获取本地存储
		return JSON.parse( localStorage.getItem( key ) );
	},
	delteStorage:function(key){
		localStorage.removeItem(key);
	},
	//  登录弹出层的点击登录
	signIn:function(){
//        用户名 12密码 100
		// 点击登录提交的操作；
		$('.subbtn').click(function(event) {
			var password = $('.mask .user_password').val();
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
            // 没有登录时候的状态
			voteFn.signIn();
		});
	},
	/**
	*登录的遮罩层事件绑定
	**/ 
	maskDeal:function(){
		$('.mask').on('tap',function(ev){
            var ev = ev || window.event,target = ev.target || ev.srcElement;
			if(target.className =="mask"){
                $('.mask').hide();
			}
		});
	},
	botScroll:function(){
		$(window).scroll( function(){
				var winHeight = document.documentElement.clientHeight || document.documentElement.clientHeight;
				var allHeight = document.documentElement.scrollHeight || document.body.scrollHeight ;
				var scrollHeight =  document.documentElement.scrollTop || document.body.scrollTop;
                if(winHeight+scrollHeight>= allHeight){
                    if(voteFn.lock ){
                        voteFn.lock = false;
                        // 圆圈  正方形去掉一条边转起来就就好了
                        voteFn.num++;
                        voteFn.requestData('/vote/index/data?limit='+voteFn.limit+'&offset='+voteFn.num,'get',voteFn.indexUserStr);
                    };
                };
		});
	},
	indexUserStr : function(data){
		voteFn.lock = true;
        var str ='';
        var arrs = data.data.objects;
        if(arrs == 0){
            $('.dropload-load').html('到底部了');
            alert('到底部了，没有数据了');
        }else{
            for( var i =0 ; i<arrs.length;i++){
                str += '<li>';
                str +='<div class="head">' ;
                str += '<a href="detail.html?id='+arrs[i].id+'"><img src="'+arrs[i].head_icon+'" alt=""></a>';
                str += '</div>';
                str += '<div class="up">';
                str += '<div class="vote"><span>'+arrs[i].vote+'票</span></div>';
                str += '<div class="btn" id="'+arrs[i].id+'">投TA一票</div>';
                str += '</div>';
                str +='<div class="descr">' ;
                str +='<a href="detail.html?id='+arrs[i].id+'">';
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
            voteFn.userPoll();
        }
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
			// 防止用户重复点击在验证成功之前
			rebtnFlag = false;
			if( voteFn.regForm() === false){
				//发送请求
				rebtnFlag = true;
				return;
			}else{
                $.ajax({
                    url: '/vote/register/data',
                    type: 'POST',
                    data: voteFn.regForm(),
                    success: function(data) {
                        data = JSON.parse(data);
                        if(data.errno === 0) {
                            var id = data.id;
                            var reg = /(.*)register/;
                            var voteUser = {
                                username: voteFn.regForm().username,
                                password: voteFn.regForm().password,
                                id: id
                            }
                            voteFn.setStorage('voteUser', voteUser);
                            alert(data.msg);
                            window.location = reg.exec(url)[1] + 'index';
                        } else {
                            alert('报名失败');
                        }
                    }
                });
            }
		});
	},
	regForm:function(){
		var username = $('.username').val();
		var mobile = $('.mobile').val();
		var description = $('.description').val();
		var password = $('.initial_password').val();
        var conPassword = $('.confirm_password').val();
		var gender = "";
		$('.gender input').each(function(index, el) {
			if($(this).attr('select') === 'yes') {
				gender = index == 0 ? 'boy' : 'girl';
			}
		});
		if(!username) {
			alert("请填写用户名称");
			return false;
		}
        if(!password) {
            alert("请填写密码");
            return false;
        }
        if(!conPassword) {
            alert("请填写确认密码");
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
        console.log(gender);
        if(!gender) {
            alert("请填写性别");
            return false;
        }
		return {
			username: username,
			mobile: mobile,
			description: description,
			gender: gender,
			password: password
		};
	},
    detailInit:function(){
        var idReg = /.*?(\d*)$/;
        var id = idReg.exec(url)[1];
        $.ajax({
            url:'/vote/all/detail/data?id='+id,
            type:'get',
            dataType:"json",
            success:function(data){
                if(data.errno ==0){
                    //把字符串用方法封装好返回比较好（易读）；
//                    上下都拼接出来
                    $('.personal').html(voteFn.detailTop(data));
                    $('.coming').html(voteFn.detailBot(data));
                }else{
                    alert(data.msg);
                }
            }
        })
    },
    detailTop:function(data){
        data  =  data.data;
        var strTop =  '<div class="pl">';
            strTop += '<div class="head"><img src="'+data.head_icon+'" alt=""></div>';
            strTop += '<div class="p_descr">';
                strTop += '<p>'+data.username+'</p>';
                strTop +='<p>编号'+data.id+'</p>';
            strTop +='</div>';
        strTop += '</div>';
        strTop +='<div class="pr">';
            strTop += '<div class="p_descr pr_descr">';
                strTop +='<p>'+data.rank+'名</p>';
                strTop+='<p>'+data.vote+'票</p>';
            strTop+='</div>';
        strTop +='</div>';
        strTop +='<div class="motto">'+data.description+'</div>';
        return strTop;
    },
    detailBot:function(data){
        var data =data.data.vfriend;
        var strBot='';
        for(var j=0; j<data.length;j++){
            strBot += '<li>';
                strBot += '<div class="head">';
                    strBot += '<a href=""><img src="'+data[j].head_icon+'"/></a>'
                strBot += '</div>';
                strBot +='<div class="up">';
                    strBot +='<div class="vote">';
                    strBot +='<span >投了一票</span>';
                    strBot +='</div>';
                strBot +='</div>';
                strBot +='<div class="descr">';
                    strBot +='<p>'+data[j].username+'</p>';
                    strBot +='<p>编号'+data[j].rank +'</p>';
                strBot +='</div>';
            strBot +='</li>';
        }
        return strBot;
    },
    userPoll:function(){
        $('.btn').off();
        $('.btn').on('click',function(){
            var _this=this;''
            var id=$(this).attr('id');
            var voteUser =voteFn.getStorage('voteUser');
            if(voteUser){
            	alert('已经登录了');
            	alert(id);
            	alert(voteUser.id);
            	alert(this);
            	//已经登录就像后台发送请求；
            	voteFn.voteRequest(id,voteUser.id,this);
            }else{
            	// 没有登录请登录
            	$('.mask').show();
            	voteFn.signIn();
            };
        });
    },
    //账号1：jiajia2 密码：100226abcd
    //账号2：18911792561 密码：100226abcd
    /***
    ** 投票者ID
    ** 被投票id
    ***/ 
    voteRequest:function(id,voteId,_this){
    	$.ajax({
    		url:"/vote/index/poll?id="+id+'&voterId='+voteId,
    		type:'GET',
    		success:function(data){
    			data = JSON.parse(data);
    			if(data.errno ===  0){
    				var voteNum = $(_this).siblings('.vote').find('span').html();
    				var reg = /(\d*)/;
    				voteNum = reg.exec(voteNum)[1];
    				$(_this).siblings('.vote').find('span').html(++voteNum+'票');
    				$(_this).siblings('.vote').addClass('bounceIn');
    			}else{
    				alert(data.msg);
    			};
    		},

    	})
    }
};
//我很幸福开心


var indexReg =/index/;
var registerReg =/register/;
var detailReg =/detail/;
var url =  location.href;
$(function(){
	if(indexReg.test(url)){
		//主页
		voteFn.maskDeal();
		voteFn.signInAction();
		// var voteUser = voteFn.getStorage('voteUser');
		voteFn.init();
	}else if(registerReg.test(url)){
		// 验证 传值 返回首页
		voteFn.registerInt();
        // radios click
		$('.gender input').click(function(event) {
			$(this).attr('select', 'yes').prop('checked',true).parent('div').siblings('div').find('input').attr('select', 'no').prop('checked',false); 
		});
	}else if(detailReg.test(url)){
        //详情页面
        voteFn.detailInit();
    }
});