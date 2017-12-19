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
<link rel="stylesheet" href="css/bootstrap-dialog.min.css" />
<link rel="stylesheet" href="css/jquery-confirm.min.css" />
<link rel="stylesheet" href="css/bootstrap-datetimepicker.min.css" />
<link rel="stylesheet" href="css/unicorn.main.css" />
<link rel="stylesheet" href="css/select2.min.css" />

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
	<!-- /btn-group -->
	<div id="sidebar">
		<ul>
			<!-- <li><a href="index.html"><i class="glyphicon glyphicon-home"></i>
					<span>首页</span></a></li> -->
			<li><a href="index.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>用户管理</span></a>
			<li class="active"><a href="#"><i
					class="glyphicon glyphicon-th-list"></i> <span>终端管理</span></a></li>
			<li><a href="group.jsp"><i
					class="glyphicon glyphicon-th-list"></i> <span>小组管理</span></a></li>
		</ul>
	</div>
	<div id="content">
		<div id="content-header">
			<h1>终端管理</h1>
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
							<h5>终端信息</h5>
						</div>
						<div class="widget-content nopadding">
							<div id="custom-toolbar">
								<a id="addTerminal" class="btn btn-danger"
									data-target="#addTerminalModal" onclick="openTerminalDialog();"
									data-whatever="添加终端"><li class="glyphicon glyphicon-plus">添加</li></a>
								<button id="delterminal" class="btn btn-warning"
									data-method="remove" onclick="deleteTerminal();">
									<li class="glyphicon glyphicon-remove">删除</li>
								</button>
							</div>
							<table id="table" class="table table-bordered data-table"
								data-show-toggle="true" data-search="true"
								data-pagination="true" data-row-style="rowStyle"
								data-toolbar="#custom-toolbar" data-height="600"
								data-show-columns="true" data-show-export="true"
								data-id-field="id" data-resizable="true">
								<thead>
									<tr>
										<th data-field="state" data-sortable="true"
											data-checkbox="true"></th>
										<th data-field="tid" data-sortable="true">序列号(SN)</th>
										<th data-field="type" data-sortable="true">类型</th>
										<th data-field="cId" data-sortable="true">北斗卡号</th>
										<th data-field="oname" data-sortable="true">所属部门</th>
										<th data-field="isOnline" data-sortable="true">是否在线</th>
										<th data-field="date" data-sortable="true">购买日期</th>
										<th data-field="owner" data-sortable="true">持有人</th>
										<th data-field="color" data-sortable="false">轨迹预设颜色</th>
										<th data-field="operate" data-formatter="operateFormatter"
											data-events="operateEvents" data-align="center">编辑</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- edit模态框（Modal） -->
		<div class="modal fade" id="editTerminalModal" tabindex="-1"
			role="dialog" aria-labelledby="myModalLabel" data-keyboard="true">
			<div class="modal-dialog" role="document" style="margin: 150px auto;">
				<div class="modal-content" id="editContent">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="ModalTitle">修改终端</h4>
					</div>
					<div class="modal-body">
						<form role="form" class="form-horizontal" id="editTerminalForm"
							method="post" accept-charset="utf-8" onsubmit="return check();">
							<div class="form-group">
								<label class="col-lg-2 control-label" for="tid">序列号(SN)</label>
								<div class="col-lg-9">
									<input name="tid" type="text" id="tid" placeholder="序列号(SN)"
										class="form-control" required="required" value=""
										readonly="readonly" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-lg-2 control-label" for="cId">北斗卡ID</label>
								<div class="col-lg-9">
									<input type="text" name="cId" class="form-control"
										required-message="卡号不能为空！" id="cId" check-type="required"
										placeholder="北斗卡ID">
								</div>
							</div>
							<div class="form-group">
								<label class="col-lg-2 control-label" for="oid">所属部门</label>
								<div class="col-lg-9">
									<!-- <input name="oid" type="text" id="oid" placeholder="所属部门"
										class="form-control" required="required" value="" /> -->
									<select id="oid" name="oid" style="width: 100%"
										class="uid-select" placeholder="所属部门">
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-lg-2 control-label" for="owner">持有人</label>
								<div class="col-lg-9">
									<input type="text" name="owner" class="form-control" id="owner"
										check-type="required" placeholder="持有人">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label">轨迹预设颜色</label>
								<div class="col-sm-8">
									<input id="pathColor" type="text" name="color" readonly />
								</div>
							</div>
							<div class="btn-group" style="padding-left: 200px;">
								<button type="submit" class="btn btn-success" id="submitForm"
									style="margin-left: 5px; margin-right: 5px;">
									<li class="glyphicon glyphicon-check">保存</li>
								</button>
								<!-- <button type="reset" class="btn btn-warning" id="resetBtn"
				style="margin-left: 5px; margin-right: 5px;">
				<li class="glyphicon glyphicon-repeat">重置</li>
			</button> -->
								<button type="button" class="btn btn-danger"
									data-dismiss="modal" id="btn-close">
									<li class="glyphicon glyphicon-remove">取消</li>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="row-fluid">
				<div id="footer" class="span12">
					2015 &copy; 西安航天天绘数据技术有限公司 <a href=""></a>
				</div>
			</div>
			<script type="text/javascript" src="js/jquery.min.js"></script>
			<script type="text/javascript" src="../lib/formserialize.js"></script>
			<script type="text/javascript" src="js/bootstrap.min.js"></script>
			<script type="text/javascript" src="js/moment-with-locales.js"></script>
			<script type="text/javascript" src="js/tableExport.js"></script>
			<script type="text/javascript" src="js/bootstrap-table.js"></script>
			<script type="text/javascript" src="js/bootstrap-table-zh-CN.js"></script>
			<script type="text/javascript" src="js/bootstrap-table-export.js"></script>
			<script type="text/javascript" src="js/bootstrap-dialog.min.js"></script>
			<script type="text/javascript" src="js/jquery-confirm.min.js"></script>
			<script type="text/javascript" src="js/bootstrapValidator.min.js"></script>
			<script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
			<script type="text/javascript" src="js/select2.full.min.js"></script>
			<script type="text/javascript" src="js/terminal.js"></script>
			<script type="text/javascript" src="js/common.js"></script>
			<script type="text/javascript"
				src="../lib/ColorPicker/jquery.colorpicker.js"></script>
			<script type="text/javascript">
				$("#pathColor").colorpicker({
					color : "#4876FF",
				});
				$(function() {
					$('#datetimepicker').datetimepicker({
						locale : 'zh-CN',
						format : "YYYY-MM-DD HH:mm:ss",
						sideBySide : true,
					/* 		showClear : true */
					/* showClose: true, */
					});
				});
			</script>
</body>
</html>
