/**
 * index 脚本
 */
//加载页头和页尾

$('#header').load('header.html');
$('#footer').load('footer.html');

//part06 加载更多
$('.market .see_more').click(function() {
	var that = this;
	var len = $('.pro_ads .ad').length;
	var s = len - 4;
	if(len >= 12) {
		$(this).hide();				
	}
	$.ajax({
		type: 'GET',
		url: 'user/show_more_goods',
		data: {
			s: s
		},
		success: function(data) {
			//console.log(data);
			var html = '';
			for(var v of data) {
				html += `
                        <div class="ad">
                            <p><a href="#"><img src="${v.img}" alt=""/></a></p>
                            <dl>
                                <dt>${v.title}</dt>
                                <dd><a href="#">${v.con_one}</a></dd>
                                <dd><a href="#">${v.con_two}</a></dd>
                            </dl>
                        </div>
                    `;
			}
			$('.pro_ads').append(html);
		}

	});
})

//part08 加载更多
$('#show_more_fun').click(function() {
	var that = this;
	var n = $('.fun_news dl').length;
	var m = n - 8;
	if(n >= 20) {
		$(that).hide();
		$(that).siblings('.banner_ad')
				.css('margin-top','50px');
	}
	// console.log(m);
	$.ajax({
		type: 'get',
		url: 'user/show_more_fun',
		data: {
			m: m
		},
		success: function(data) {
			var html = '';
			for(var v of data) {
				var obj = v;
				//console.log(obj);
				html += `
                      <dl>
                          <dt><a href="#"><img src="${obj.img}" alt=""/></a></dt>
                          <dd><b>${obj.title}</b></dd>
                          <dd><a href="#">${obj.content}</a></dd>
                       </dl>

                    `
			}
			$('.fun_news').append(html);
		}
	});
});

(function() {
	var n = 0;
	var len = $('.imgList li').length;

	function lunBo1() {
		if(n == len) {
			n = 0;
		} else if(n < 0) {
			n = len - 1; //n<0  返回到length-1
		}
		$('.imgList li').eq(n).addClass('show').siblings('.show').removeClass('show');
		$('.img_index a').eq(n).addClass('on').siblings('.on').removeClass('on');
	}
	lunBo1();
	//自动轮播
	var t = setInterval(function() {
		n++;
		lunBo1();
	}, 3000);
	//鼠标进入和移出
	$('.roll_box').hover(function() {
		clearInterval(t);
	}, function() {
		t = setInterval(function() {
			n++;
			lunBo1();
		}, 3000)
	});
	//点击左右
	$('.roll_box').on('click', '.btn_left', function(e) {
		e.preventDefault();
		n--;
		lunBo1();
	});
	$('.roll_box').on('click', '.btn_right', function(e) {
		e.preventDefault();
		n++;
		lunBo1();
	});
	//点击小圆点
	$('.img_index').on('click', ' a', function(e) {
		e.preventDefault();
		var img_id = $(this).attr('href');
		$(this).addClass('on').siblings('.on').removeClass('on');
		$(img_id).addClass('show').siblings('.show').removeClass('show');
	});
})();

//1.1 
(function() {
	$('.top_right a:nth-child(2) .btn_login').click(function(e) {
		e.preventDefault();
		$(this).siblings('#login').toggleClass('show');
	});
	//1.2
	$('.remember').click(function() {
		$(this).toggleClass('remember_hover');
	});
})();

//part05.1 tab切换
$('.films_nav').on('click', 'a', function(e) {
	e.preventDefault();
	var id = $(this).attr('href');
	$(this).addClass('light').siblings('.light').removeClass('light');
	$(id).addClass('show').siblings('.show').removeClass('show');
});

//part05.2 choose input
$('.cinema_search p ').click(function() {
	$(this).siblings('.choose').toggleClass('show');
});

//part05.2-1  #ready 
(function() {
	$('#ready .move_right').click(function(e) {
		e.preventDefault();
		$(this).siblings('.movie_ready').css('left', '-600px');
	});

	$('#ready .move_left').click(function(e) {
		e.preventDefault();
		$(this).siblings('.movie_ready').css('left', 0);
	});
})();

//part05.3 滚动
(function() {
	var left = $('.list_box').css('left');
	var div = $('.list_box');
	var c = parseInt(left);
	$('.movie_right a.move_right').click(function(e) {
		e.preventDefault();
		if(c < 0) {
			c += 600;
			left = c + 'px';
			div.css('left', left);
			$(this).css('opacity', '.8');
			//console.log(left);
		} else if(c >= 0) {
			$(this).css('opacity', '.2');
		}

	});
	$('.movie_right a.move_left').click(function(e) {
		e.preventDefault();
		if(c >= -600) {
			c -= 600;
			left = c + 'px';
			div.css('left', left);
			$(this).css('opacity', '.8');
			//console.log(left);
		} else if(c <= -600) {
			$(this).css('opacity', '.2');
		}
	});
})();

//part06 products  a
(function() {
	var N = 0;
	$('.products .move_right').click(function(e) {
		e.preventDefault();
		N++;
		if(N == 2) {
			N = 0;
		}
		$('.pro_box ul').eq(N).addClass('show').siblings('.show').removeClass('show');
	});
	$('.products .move_left').click(function(e) {
		e.preventDefault();
		N--;
		if(N == -1) {
			N = 1;
		}
		$('.pro_box ul').eq(N).addClass('show').siblings('.show').removeClass('show');
	});
})();

//part09 
(function() {
	$('.box_title a').click(function(e) {
		e.preventDefault();
		$(this).addClass('show_border').siblings('.show_border').removeClass('show_border');
		var d = $(this).attr('href');
		$(d).addClass('show').siblings('.show').removeClass('show');

	});
})();

//part10 
(function() {
	var num = 0;
	var btnLeft = $('.comm_detail .move_left');
	var btnRight = $('.comm_detail .move_left');
	var Id = $('.comm_detail .slider');
	var oUl = Id.find('ul');
	var oLi = Id.find('li');
	var oCur = $('.slider_dot');
	var oCurA = oCur.find('a');
	//console.log(oCurS);
	var oLiLen = oLi.length;
	var t = setInterval(function() {
		num++;
		lunBo();
	}, 3000);

	Id.hover(function() {
		clearInterval(t);
	}, function() {
		t = setInterval(function() {
			num++;
			lunBo();
		}, 3000)
	});

	Id.on('click', '.move_left', function(e) {
		e.preventDefault();
		num--;
		if(num < 0) {
			num = 2;
		}
		//console.log(num);
		lunBo();
	});
	Id.on('click', '.move_right', function(e) {
		e.preventDefault();
		num++;
		lunBo();
	});

	oCur.on('click', 'a', function(e) {
		e.preventDefault();
		$(this).addClass('dot').siblings('.dot').removeClass('dot');
		var liId = $(this).attr('href');
		$(liId).addClass('show').siblings('.show').removeClass('show');
	});

	function lunBo() {

		if(num == oLiLen) {
			num = 0;
		}
		oLi.eq(num).addClass('show').siblings('.show').removeClass('show'); //eq>index
		oCurA.eq(num).addClass('dot').siblings('.dot').removeClass('dot');
	}
	lunBo();
})();