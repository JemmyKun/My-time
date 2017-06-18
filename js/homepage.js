/*
 homepage js 脚本
 */

$('#header').load('header.html');
$('#footer').load('footer.html');

//用户输入内容 的tab切换
$(function() {
	$('.input_tab>a').click(function(e) {
		e.preventDefault();
		var tid = $(this).attr('href');
		$(this).addClass('tab_focus').siblings('.tab_focus').removeClass('tab_focus');

		$(tid).addClass('show').siblings('.show').removeClass('show');
	});
});

//famous 消息框 点击x,right,left的切换基本实现
$(function() {
	$('.close').click(function() {
		$(this).parent('.famous').css('display', 'none');
	});

	var n = 0;
	var len = $('.fam_show').length;
	$('.fam_left').click(function() {
		n--;
		if(n < 0) {
			n = len - 1
		}
		$('.fam_show').eq(n).addClass('show').siblings('.show').removeClass('show');
	});
	$('.fam_right').click(function() {
		n++;
		if(n > len - 1) {
			n = 0
		}
		$('.fam_show').eq(n).addClass('show').siblings('.show').removeClass('show');
	});
});

// ul.con_bar 的切换
$(function() {
	$('.con_bar>li>a').click(function(e) {
		e.preventDefault();
		var dl_id = $(this).attr('href');
		$(this).parent('li').addClass('li_hover').
		siblings('.li_hover').removeClass('li_hover');
		$(dl_id).addClass('show').siblings('.show').removeClass('show');
	});
});

//用户登录成功，显示用户名
$(function() {
	var uname = sessionStorage['loginUname'];
	if(uname) {
		$('.login_user_name').html(uname);
	} else {
		$('.login_user_name').html('游客');
	}
});

//发表评论
$(function() {
	//        alert('发表成功！点击加载更多可查看');
	var imgN = parseInt(Math.random() * (17 - 10) + 10);
	//console.log(imgN);
	$('.txt_submit').click(function(e) {
		e.preventDefault();
		//模拟用户提交的数据
		var user_pub = {
			name: sessionStorage['loginUname'],
			content: $('[name=delicate]').val(),
			img: `images/con_img${imgN}.jpg`,
			movie: '《看过的电影》',
			score: score(4, 10),
			time: formatDate()
		};
		//判断 避免用户没输入就提交
		if(!user_pub.content) {
			alert('请先填写评论')
		} else {
			$.ajax({
				type: 'POST',
				url: 'user/publish_content',
				data: user_pub,
				success: function(data) {
					//console.log(data);//服务器发过来的用户编号
					if(data) {
						alert('发表成功！点击加载更多可查看');
						// console.log('发表成功！！！');
						$('[name=delicate]').val(''); //设置文本框的内容为空
						$('.publish_show_more').html('加载更多>>');
					}
				}
			});
		}
	});
});

//发表日志
$(function() {
	var imgN = parseInt(Math.random() * (17 - 10) + 10);
	$('.digest a.log_submit').click(function(e) {
		e.preventDefault();
		var daily = {
			name: sessionStorage['loginUname'],
			content: "<span style='color:#F92EEC;font-weight:500'>" +
				$('[name=title]').val() + "</span>" + "<br/>" + $('[name=log_txt]').val(),
			img: `images/con_img${imgN}.jpg`,
			movie: '《看过的电影》',
			score: score(4, 10),
			time: formatDate()
		};
		//console.log(daily.content);
		$.ajax({
			type: 'POST',
			url: 'user/publish_daily',
			data: daily,
			success: function(result) {
				console.log(result); //获取客户端发送的编号
				if(result > 0) {
					alert('发表成功！点击加载更多可以查看');
					$('[name=title]').val(''); //发表成功，清空输入框的内容
					$('[name=log_txt]').val('');
					$('.publish_show_more').html('加载更多>>'); //新内容发表，提示可以继续点击加载
				}
			}
		});
	});
});
//获取日期字符串的 方法 形如：2017-05-19 14:16;
function formatDate() {
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1; //注意要加 1
	var d = date.getDate();
	var h = date.getHours();
	h = h < 10 ? "0" + h : h; // 如果是小于10  就拼接为01,05等，大于则10,11,12
	mi = date.getMinutes();
	mi = mi < 10 ? "0" + mi : mi;
	var str = y + "-" + m + "-" + d + "   " + h + ":" + mi;
	return str;
}
//定义一个随机生成 评分 4.0-10.0 的函数
function score(min, max) {
	return(Math.random() * (max - min) + min).toFixed(1);
}

//用户发表评论提交到服务器 和 显示到页面的AJAX 异步请求操作
$(function() {
	//调用方法，页面加载完成以后显示从0开始 2条 内容  limit 0, 2
	addContent(0);

	$('.publish_show_more').click(function() {
		//页面加载请求了2(0--1)条数据，所以点击加载从下标2开始
		//即当前的length 2
		var startNum = $('.user_publish').length;
		//console.log(startNum);
		addContent(startNum);
		//            localStorage['con_num'] = startNum;
		//            $('.con_total').html(localStorage['con_num']);
	});
});

//页面加载完成，显示微评的总数
$(function() {
	$('.con_total').html(localStorage['con_num']);
})
//定义加载更多内容的方法
function addContent(n) {
	var u_name = sessionStorage['loginUname'];
	//console.log(u_name);
	$.ajax({
		type: 'GET',
		url: 'user/show_publish',
		data: {
			n: n
		},
		success: function(data) {
			//console.log(data);
			if(data.length == 0) {
				alert('没有更多了！');
				$('.publish_show_more').html('没有更多了');

				//保存用户发表的总数 添加显示到右侧微评数量
				var con_num = $('.user_publish').length;
				//console.log(startNum);
				localStorage['con_num'] = con_num;
				$('.con_total').html(localStorage['con_num']);
				return;
			}
			html = '';
			for(var v of data) {
				var pub_time = v.p_date;
				// console.log(v);
				html += `
                         <ul class="user_publish">
                        <li class="con_img">
                            <a href="#">
                                <img src="${v.P_img}" alt=""/>
                            </a>
                        </li>
                        <li>
                            <span class="user_name text_blue">${u_name}</span>
                            <span class="speak">说</span><a href="">
                            ${v.P_content}
                            </a>
                        </li>
                        <li>
                            <span>电影：</span>
                            <a href="#" class="text_blue">${v.P_movie}</a>
                        </li>
                        <li>评：
                            <span class="point_star"></span>
                            <span class="points speak">${v.P_score}</span>
                        </li>
                        <li class="con_bottom fix">
                            <div>
                                <span class="date text_blue">${v.P_date}</span>
                                <span>来自 <a href="" class="text_blue">时光微评</a></span>
                            </div>
                            <div class="remove">
                                <span class="hide_txt"></span>
                                <a href="">收起</a>
                                <span class="delete"></span>
                                <a href="${v.con_id}">删除</a>
                                 <div class="delete_alert_box">
                                    <span class="ion_top"></span>
                                    <p><b>确认删除这条微评吗？</b></p>
                                    <span class="yes">确认</span>
                                    <span class="no">取消</span>
                                </div>
                            </div>
                            <div>
                                <span class="transit"></span>
                                <a href="#" class="text_blue">转发(0)</a>
                                <span class="reply"></span>
                                <a href="#" class="text_blue">回复(0)</a>
                                <span class="favour_star"></span>
                            </div>
                        </li>
                    </ul>
                    `;
			}
			//将留言编号保存在‘a.delete 的 href 属性中，可以实现删除留言的功能’
			$('#content_box').prepend(html);
		}
	});
}

//点赞 注意必须绑定在DOM树已有的父元素上，因为动态生成的不会绑定事件
$(function() {
	$('#content_box').on('click', '.favour_star', function() {
		$(this).toggleClass('favour_star_focus');
	});
	//点击隐藏  删除 弹出提示框
	$('#content_box').on('click', 'span.hide_txt + a', function(e) {
		e.preventDefault();
		$(this).parent('div').parent('li').parent('ul').slideUp();
	});

	//删除发表内容
	$('#content_box').on('click', 'span.delete + a', function(e) {
		e.preventDefault();
		//获取当前留言的编号，提交留言时 将编个号保存在href属性中
		$(this).siblings('.delete_alert_box').show();
		$(this).parent('.remove').css('display', 'block');
		var did = $(this).attr('href');
		var that = this;
		//console.log(did);
		//            alert('确定要删除吗？');
		$('body').on('click', '.yes', function() {
			deleteContent();
		});
		//删除发表的内容
		function deleteContent() {
			$.ajax({
				type: 'GET',
				url: 'user/delete_content',
				data: {
					did: did
				},
				success: function(result) {
					//console.log(result);//删除的行数为1 是应为按照编号删除的
					if(result >= 1) {
						//alert('删除成功');
						console.log('删除成功！');
						$(that).parent('div').parent('li').parent('ul').hide();
					} else {
						alert('删除失败，请检查网络或者稍后重试');
					}
				}
			});
		}
		//点击‘取消’ 弹窗消失
		$('.no').click(function() {
			$(this).parent('div.delete_alert_box').hide();
		});
	});
});

//向上滚动箭头ion_to_top

var toTop = $('.publish_box .ion_to_top');
$(document).scroll(function() {
	var off = $(document).scrollTop();
	if(off <= 350) {
		$(toTop).css({
			'opacity': '0',
			right: '154px'
		});
	} else if(off > 200 && off < 1950) {
		$(toTop).css({
			'opacity': 1,
			right: '154px'
		});
	} else {
		$(toTop).css({
			'opacity': 1,
			right: '454px'
		});
	}
});
$(toTop).click(function(e) {
	e.preventDefault();
	$('body').animate({
		scrollTop: $('.publish_box').offset().top
	}, 800);

});