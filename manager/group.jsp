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
<title>应急救援车辆管理系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="css/bootstrap.min.css" />
<link rel="stylesheet" href="css/bootstrap-table.css" />
<link rel="stylesheet" href="css/jquery-confirm.min.css" />
<link rel="stylesheet" href="css/bootstrapValidator.min.css" />
<link rel="stylesheet" href="css/bootstrap-dialog.min.css" />
<link rel="stylesheet" href="css/select2.min.css" />
<link rel="stylesheet" href="css/unicorn.main.css" />

</head>
<body>
	<div id="header">
		<img id="logo" src="../images/logo.png" width=120 height=120></img>
		<h1>应急救援车辆管理系统</h1>
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
			<!-- <li role="separator" class="divider"></li>
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
			<!-- <li><a href="index.html"><i class="glyphicon glyphicon-home"></i>
					<span>首页</span></a></li> -->
			<li><a href="index.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>用户管理</span></a>
			<li><a href="terminal.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>终端管理</span></a></li>
			<li class="active"><a href="#"><i
					class="glyphicon glyphicon-th-list"></i> <span>小组管理</span></a></li>
		</ul>
	</div>
	<div id="content">
		<div id="content-header">
			<h1>小组管理</h1>
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
		<!-- <div id="breadcrumb">
		<h1>用户管理</h1>
			<a href="#" title="Go to Home" class="tip-bottom"><i
				class="icon-home"></i>主页</a> <a href="#">用户管理</a>
		</div> -->
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="span12">
					<div class="widget-box">
						<div class="widget-title">
							<h5>用户信息</h5>
						</div>
						<div class="widget-content nopadding">
							<div id="custom-toolbar">
								<a id="addGroup" class="btn btn-danger" data-toggle="modal"
									type="button" onclick="addGroup();">
									<li class="glyphicon glyphicon-plus">添加</li></a>
								<button id="delGroup" class="btn btn-warning"
									onclick="deleteMulite();" data-method="remove">
									<li class="glyphicon glyphicon-remove">删除</li></button>
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
										<th data-sortable="true" data-align="center"
											data-formatter="runningFormatter">ID</th>
										<th data-field="oid" data-align="center" data-sortable="true"
											data-visible="false">oid</th>
										<th data-field="zone" data-align="center" data-sortable="true" data-visible="false">所属区域ID</th>
										<th data-field="zoneName" data-align="center" data-sortable="true" >所属区域</th>
										<th data-field="team" data-align="center" data-sortable="true">队名</th>
										<th data-field="leader" data-align="center"
											data-sortable="true">队长</th>
										<th data-field="ophone" data-align="center"
											data-sortable="true">联系电话</th>
										<th data-field="omember" data-align="center"
											data-sortable="true">队员</th>
										<th data-field="operate" data-formatter="operateFormatter"
											data-events="operateEvents" data-align="center">操作</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- edit Model -->
		<div class="modal fade" id="editGroupModal" tabindex="-1"
			role="dialog" aria-labelledby="myModalLabel" data-keyboard="true">
			<div class="modal-dialog" role="document" style="margin: 150px auto;">
				<div class="modal-content" id="editContent">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="ModalTitle">修改</h4>
					</div>
					<div class="modal-body">
						<form role="form" class="form-horizontal" id="editGroupForm"
							method="post" accept-charset="utf-8" onsubmit="return valiatorGroup();">
							<input type="hidden" id="oid" name="oid" value="">
							<input type="hidden" id="zoneName" name="zoneName" value="">
							<div class="form-group">
								<label for="zone" class="control-label col-lg-2">所属区域</label>
								<div class="col-lg-9">
										<input class="form-control" name="zone" type="text" id="zoneID"
										placeholder="所属区域" required="required" value="" readonly style="width:100%"/> 
								</div>
							</div>
							<div class="form-group ">
								<label class="col-lg-2 control-label" for="team">队名</label>
								<div class="col-lg-9">
									<input class="form-control" name="team" type="text" id="team"
										placeholder="队名" required="required" value="" readonly/> 
								</div>
							</div>
							<div class="form-group">
								<label class="col-lg-2 control-label" for="leader">队长</label>
								<div class="col-lg-9">
									<input class="form-control" name="leader" type="text"
										id="leader" placeholder="队长" required="required" value="" />
								</div>
							</div>
							<div class="form-group ">
								<label class="col-lg-2 control-label" for="ophone">联系电话</label>
								<div class="col-lg-9">
									<input class="form-control" name="ophone" type="text"
										id="ophone" placeholder="联系电话" required="required" value="" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-lg-2 control-label" for="omember">队员</label>
								<div class="col-lg-9">
									<input class="form-control" name="omember" type="text"
										id="omember" placeholder="队员" required="required" value="" />
								</div>
							</div>
							<hr />
							<div class="btn-group" style="padding-left: 200px;">
								<button type="submit" class="btn btn-success" id="submitGroup" style="margin-left: 5px; margin-right: 5px;">
									<li class="glyphicon glyphicon-check">OK</li>
								</button>
						<!-- 		<button type="reset" class="btn btn-warning" id="btn-reset"
									style="margin-left: 5px; margin-right: 5px;">
									<li class="glyphicon glyphicon-repeat">重置</li>
								</button> -->
								<button type="button" class="btn btn-danger"
									data-dismiss="modal" id="btn-close">
									<li class="glyphicon glyphicon-remove">关闭</li>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			</div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/bootstrap-table.js"></script>
<script type="text/javascript" src="js/bootstrap-table-export.js"></script>
<script type="text/javascript" src="js/tableExport.js"></script>
<script type="text/javascript" src="js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="js/jquery.base64.js"></script>
<script type="text/javascript" src="js/jquery-confirm.min.js"></script>
<script type="text/javascript" src="js/bootstrapValidator.min.js"></script>
<script type="text/javascript" src="js/select2.full.min.js"></script>
<script type="text/javascript" src="js/bootstrap-dialog.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script type="text/javascript" src="js/group.js"></script>
</body>
</html>
