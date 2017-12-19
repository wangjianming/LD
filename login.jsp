<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page session="true"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="zh">
<head>
<title>赛马综合管理系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<link href="manager/css/bootstrap.min.css" rel='stylesheet'
	type='text/css'>
<link href="css/style.css" rel='stylesheet' type='text/css' />
<link href="css/login.css" rel="stylesheet" type="text/css" />
<link href="manager/css/bootstrapValidator.min.css" rel='stylesheet'
	type='text/css' />
<link rel="stylesheet" href="manager/css/jquery-confirm.min.css" />
<link rel="stylesheet" href="manager/css/bootstrap-dialog.min.css" />
<link rel="stylesheet" href="manager/css/select2.min.css" />
</head>
<link href="css/index_style.css" rel="stylesheet" type="text/css">
<script src="manager/js/jquery.min.js"></script>
<script src="manager/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="manager/js/common.js"></script>
<script type="text/javascript" src="manager/js/bootstrapValidator.min.js"></script>
<script type="text/javascript" src="manager/js/bootstrap-dialog.min.js"></script>
<script type="text/javascript" src="manager/js/jquery-confirm.min.js"></script>
<script type="text/javascript" src="manager/js/select2.full.min.js"></script>
<script type="text/javascript">
<%-- function getStatus(){
	'<%if (session.getAttribute("status") != null)%>'
		return  '<%=session.getAttribute("status")%>';
	return "";
} --%>
</script>
<body style = "background: url(images/in_top_bj.jpg) no-repeat center top;background-size: cover;background-attachment: fixed;">
	<canvas id="canvas">
	</canvas>
	<div class="container-fluid" style = "top:100px;position: absolute;z-index: 100;width: 805px;left: 250px;height: 700px;">
		<div id="title2" style="padding-left: 200px;">赛马项目管理系统</div>
		<!-- <img id="logo" src="images/car2.png" width=200 height=230></img> -->
		<div class="login-form" style='margin-Left:250px;'> 
			<!-- <ul id="myTab" class="nav nav-tabs">
				<li class="active"><a href="#tabs2" data-toggle="tab">用户登陆
				</a></li>
				<li><a href="#tabs1" data-toggle="tab">管理员登陆</a></li>
			</ul> -->
			<div id="myTabContent" class="tab-content" style='width:400px;'>
				<div class="tab-pane fade in active" id="tabs2">
					<div class="form-info">
						<form id="loginForm" method="get" action="loginAction.action"  style = "height:80px;">
							<div class="form-group">
								<input id="unmorphonenumber" type="text" name="unmorphonenumber" class="unmorphonenumber"
									placeholder="用户名" autocomplete="off" required="required" style = "height:20px"/>
							</div>
							<div class="form-group">
								<input id="password" type="password" name="password"
									class="password" placeholder="密码" autocomplete="off"
									required="required" style = "height:21px"/>
							</div>
							<div class="form-group">
								<label id="errMsg" style="width:100px;height:5px;">${errMsg}</label>
							</div>
							<ul class="login-buttons">
								<li><input id="login" type="submit"
									class="btn btn-inverse hvr-sweep-to-left" value="登录" style = "height:30px;padding:2px 30px;"/></li>
								<li><a class="btn btn-inverse hvr-sweep-to-left"
									onclick="cancel();" style = "height:30px;padding:2px 30px;">取消</a></li>
							</ul>
						</form>
					</div>
				</div>
				<div class="tab-pane fade" id="tabs1">
					<div class="form-info">
						<form id="managerLoginForm" method="post"
							action="sysloginAction.action"
							onsubmit="return validation(this);">
							<div class="form-group">
								<input type="text" name="managerName" class="unmorphonenumber"
									placeholder="用户名" autocomplete="off" required="required" style = "height:20px"/>
							</div>
							<div class="form-group">
								<input type="password" name="managerPassword" class="password"
									placeholder="密码" autocomplete="off" required="required" style = "height:20px"/>
							</div>

							<ul class="login-buttons">
								<li><input type="submit"
									class="btn btn-inverse hvr-sweep-to-left" value="登录" style = "height:30px;padding:2px 30px;"/></li>
								<li><a class="btn btn-inverse hvr-sweep-to-left"
									onclick="cancel();" style = "height:30px;padding:2px 30px;">取消</a></li>
							</ul>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
<script>
$(function(){
	//宇宙特效
	"use strict";
	var canvas = document.getElementById('canvas'),
	  ctx = canvas.getContext('2d'),
	  w = canvas.width = window.innerWidth,
	  h = canvas.height = window.innerHeight,

	  hue = 217,
	  stars = [],
	  count = 0,
	  maxStars = 2300;//星星数量

	var canvas2 = document.createElement('canvas'),
	  ctx2 = canvas2.getContext('2d');
	canvas2.width = 100;
	canvas2.height = 100;
	var half = canvas2.width / 2,
	  gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
	gradient2.addColorStop(0.025, '#CCC');
	gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
	gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
	gradient2.addColorStop(1, 'transparent');

	ctx2.fillStyle = gradient2;
	ctx2.beginPath();
	ctx2.arc(half, half, half, 0, Math.PI * 2);
	ctx2.fill();

	// End cache

	function random(min, max) {
	  if (arguments.length < 2) {
	    max = min;
	    min = 0;
	  }

	  if (min > max) {
	    var hold = max;
	    max = min;
	    min = hold;
	  }

	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function maxOrbit(x, y) {
	  var max = Math.max(x, y),
	    diameter = Math.round(Math.sqrt(max * max + max * max));
	  return diameter / 2;
	  //星星移动范围，值越大范围越小，
	}

	var Star = function() {

	  this.orbitRadius = random(maxOrbit(w, h));
	  this.radius = random(60, this.orbitRadius) / 8; 
	  //星星大小
	  this.orbitX = w / 2;
	  this.orbitY = h / 2;
	  this.timePassed = random(0, maxStars);
	  this.speed = random(this.orbitRadius) / 50000; 
	  //星星移动速度
	  this.alpha = random(2, 10) / 10;

	  count++;
	  stars[count] = this;
	}

	Star.prototype.draw = function() {
	  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
	    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
	    twinkle = random(10);

	  if (twinkle === 1 && this.alpha > 0) {
	    this.alpha -= 0.05;
	  } else if (twinkle === 2 && this.alpha < 1) {
	    this.alpha += 0.05;
	  }

	  ctx.globalAlpha = this.alpha;
	  ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
	  this.timePassed += this.speed;
	}

	for (var i = 0; i < maxStars; i++) {
	  new Star();
	}

	function animation() {
	  ctx.globalCompositeOperation = 'source-over';
	  ctx.globalAlpha = 0.5; //尾巴
	  ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
	  ctx.fillRect(0, 0, w, h)

	  ctx.globalCompositeOperation = 'lighter';
	  for (var i = 1, l = stars.length; i < l; i++) {
	    stars[i].draw();
	  };

	  window.requestAnimationFrame(animation);
	}

	animation();
})
</script>

</html>