<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="zh">
<head>

<title>应急救援车辆监控管理软件</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="css/bootstrap.min.css" />
<link rel="stylesheet" href="css/bootstrap-table.css" />
<link rel="stylesheet" href="css/bootstrap-dialog.min.css" />
<link rel="stylesheet" href="css/jquery-confirm.min.css" />
<link rel="stylesheet" href="css/bootstrapValidator.min.css" />
<link rel="stylesheet" href="css/select2.min.css" />
<link rel="stylesheet" href="css/unicorn.main.css" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/tableExport.js"></script>
<script type="text/javascript" src="js/bootstrap-table.js"></script>
<script type="text/javascript" src="js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="js/bootstrap-table-export.js"></script>
<script type="text/javascript" src="js/bootstrap-dialog.min.js"></script>
<script type="text/javascript" src="js/jquery.base64.js"></script>
<script type="text/javascript" src="js/jquery-confirm.min.js"></script>
<script type="text/javascript" src="js/bootstrapValidator.min.js"></script>
<script type="text/javascript" src="js/select2.full.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script type="text/javascript" src="js/table.js"></script>
<script type="text/javascript">
	function getName(){
		return  '<%=session.getAttribute("myerror")%>';
	}
</script>
</head>
<body>
	<div id="header">
		<img id="logo" src="../images/logo.png" width=120 height=120></img>
		<h1>应急救援车辆监控管理</h1>
	</div>
	<div id="user-nav" class="btn-group dropdown">
		<button class="btn btn-success dropdown-toggle" type="button"
			style="margin-right: 5px;" id="dropdownMenu1" data-toggle="dropdown"
			aria-haspopup="true" aria-expanded="true">
			<li class="glyphicon glyphicon-user"><a href="#" class="text"><shiro:principal /></a></li>
			<span class="caret"></span>
		</button>
		<ul class="dropdown-menu dropdown-menu-right"
			aria-labelledby="dropdownMenu1" aria-labelledby="dropdownMenuDivider">
			<li><a href="#" type="button" onclick="changePasswd();">修改密码</a></li>
			<!-- 	<li role="separator" class="divider"></li>
			<li><a href="#">Separated link</a></li> -->
		</ul>
		<button class="btn btn-success" style="margin-right:5px;"
			onclick="window.parent.location.href='../main.jsp';">
			<span class="glyphicon glyphicon-share-alt"></span> <a><span
				class="text">主页</span> </a>
		</button>
		<button class="btn btn-success" onclick="logout();">
			<li class="glyphicon glyphicon-share-alt"><a href="#"><span
					class="text">退出</span></a></li>
		</button>
	</div>
	<div id="sidebar">
		<ul>
			<li class="active"><a href="index.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>用户管理</span></a>
			<li><a href="terminal.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>终端管理</span></a></li>
			<li><a href="group.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>小组管理</span></a></li>
		</ul>
	</div>
	<div id="content">
		<div id="content-header">
			<h1>用户管理</h1>
			<div class="btn-group">
				<a class="btn btn-large tip-bottom" title="Manage Files"><i
					class="icon-file"></i></a> <a class="btn btn-large tip-bottom"
					title="Manage Users"><i class="icon-user"></i></a> <a
					class="btn btn-large tip-bottom" title="Manage Comments"><i
					class="icon-comment"></i><span class="label label-important">5</span></a>
				<a class="btn btn-large tip-bottom" title="Manage Orders"><i
					class="icon-shopping-cart"></i></a>
			</div>
		</div>
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="span12">
					<div class="widget-box">
						<div class="widget-title">
							<h5>用户信息</h5>
						</div>
						<div class="widget-content nopadding">
							<div id="custom-toolbar">
								<a id="adduser" class="btn btn-danger" onclick="openDialog();">
									<li class="glyphicon glyphicon-plus">添加</li>
								</a> <a id="delusers" class="btn btn-warning"
									onclick="deleteUser();" data-method="remove">
									<li class="glyphicon glyphicon-remove">删除</li>
								</a>
							</div>
							<table id="table" class="table table-bordered data-table"
								data-show-toggle="true" data-search="true"
								data-pagination="true" data-row-style="rowStyle"
								data-toolbar="#custom-toolbar" data-height="600"
								data-show-columns="true" data-show-export="true"
								data-id-field="id" data-resizable="true">
								<thead>
									<tr>
										<th data-field="state" data-align="center"
											data-checkbox="true"></th>
										<th data-field="uid" data-align="center" data-sortable="true">序号</th>
										<th data-field="uname" data-align="center"
											data-sortable="true">用户名</th>
										<th data-field="oname" data-align="center"
											data-sortable="true">部门</th>
										<th data-field="uphone" data-align="center"
											data-sortable="true">联系电话</th>
<!-- 										<th data-field="center" data-align="center"
											data-sortable="false">默认地图中心</th>
										<th data-field="zoom" data-align="center"
											data-sortable="false">默认地图缩放级别</th> -->
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
</body>
</html>
