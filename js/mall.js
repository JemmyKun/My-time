/*
 	mall 脚本
 * */
$('#header').load('header.html');
$('#footer').load('footer.html');
(function() {
	//弹窗
	$('.classify_left>li').hover(function() {
		var len = $(this).index();
		var topPos = -len * 90 - 1 + 'px';
		$(this).find('.detail_box').show().css('top', topPos);
	}, function() {
		$(this).find('.detail_box').hide();
	});
})()
//轮播
$(function() {
	var n = 0;
	var timer = null;
	function lunbo() {
		if(n < 0) {
			n = 4;
		} else if(n > 4) {
			n = 0;
		}
		$('.mall_slider dd').eq(n).addClass('show').siblings().removeClass('show');
		$('.dot_list a').eq(n).css('background', '#fff').siblings().css('background', '#B8B8B8');
	}
	lunbo();
	timer = setInterval(function() {
		n++;
		lunbo();
	}, 3000);
	//pre next
	$('.pre').click(function(e) {
		e.preventDefault();
		n--;
		lunbo();
	});
	$('.next').click(function(e) {
		e.preventDefault();
		n++;
		lunbo();
	});
	//鼠标进入
	$('.classify_right').hover(function() {
		clearInterval(timer);
	}, function() {
		timer = setInterval(function() {
			n++;
			lunbo();
		}, 3000);
	});
	//点小圆点
	$('.dot_list a').click(function(e) {
		e.preventDefault();
		var index = $(this).attr('href');
		$(this).css('background', '#fff').siblings().css('background', '#B8B8B8');
		$('.mall_slider dd').eq(index).addClass('show').siblings().removeClass('show');
	});
})
//加载更多
$(function(){
	$('.mall_see_more').click(function(){
		var len = $('.mall_guess dl').length;
		var num = len-15;
		$.ajax({
			type:'GET',
			url:'user/mall_show_more',
			data:{num:num},
			success:function(data){
				//console.log(data);
				if(data.length==0){
					$('.mall_see_more').hide();
					return;
				}
				var html = '';
				for(var v of data){
					html+=`
						<dl>
						<dt>
							<a href="#"><img src='${v.pic}' alt="" /></a>
						</dt>
						<dd>
							<a href="#">${v.pname}</a>
							<p>${v.price}</p>
						</dd>
					</dl>
					`;
				}
				$('.mall_guess').append(html);
			}
		});
	});
});
