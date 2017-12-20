<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
response.setHeader("Access-Control-Allow-Origin", "*");  
%>  
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <meta http-equiv="X-UA-Compatible" content="IE=9"> 
      <meta http-equiv="X-UA-Compatible" content="IE=Ddge"> 
      <meta http-equiv="Access-Control-Allow-Origin" content="*" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>棋牌系统</title>
      <link rel="stylesheet" type="text/css" href="easyui/themes/default/easyui.css">
	  <link rel="stylesheet" type="text/css" href="easyui/themes/icon.css">
	  <link rel="stylesheet" type="text/css" href="css/common.css">
	  <link rel="stylesheet" type="text/css" href="css/index.css">
	  <link rel="stylesheet" type="text/css" href="css/style1.css">
	  <script type="text/javascript" src="easyui/jquery.min.js"></script>
	  <script type="text/javascript" src="easyui/jquery.easyui.min.js"></script>
	  <script type="text/javascript" src="js/lib/jquery.xml2json.js"></script>
	 <style type="text/css"> 
        #fm 
        { 
            margin: 0; 
            padding: 10px 30px; 
        } 
        .ftitle 
        { 
            font-size: 14px; 
            font-weight: bold; 
            padding: 5px 0; 
            margin-bottom: 10px; 
            border-bottom: 1px solid #ccc; 
        } 
        .fitem 
        { 
            margin-bottom: 5px; 
        } 
        .fitem label 
        { 
            display: inline-block; 
            width: 80px; 
        }
        @font-face{font-family:hychf; src:url('fonts/hychf.ttf');}
        canvas{border: 1px solid #777;display: block;margin: auto;}
    </style> 
  </head>
  <body class="easyui-layout">
  <div id="topbarbackdiv" data-options="region:'north',split:true" style="height:70px;background:#e8f1ff">
  <!-- <canvas id="mycanvas"></canvas> -->
  <h2 style="padding-top:20px;">赛&nbsp;马&nbsp;综&nbsp;合&nbsp;管&nbsp;理&nbsp;系&nbsp;统</h2>
  <input id="cancel" type="button" value='注销' style="float:right;"></input>
  </div>  
  <div data-options="region:'west',title:'功能面板',split:true" style="width:130px;">
	  <ul id="accordion" class="accordion" style="margin-top:0px">
			<li>
				<div class="link"><i class="fa fa-paint-brush"></i>倍率调整<i class="fa fa-chevron-down"></i></div>
				<ul class="submenu">
					<li><a id="horse"  href="#">赛马</a></li>
					<li><a href="#">赛车</a></li>
					<li><a href="#">捕鱼</a></li>
					<li><a href="#">麻将</a></li>
				</ul>
			</li>
			<li>
				<div class="link"><i id="com-flow" class="fa fa-code"></i>公会<i class="fa fa-chevron-down"></i></div>
				<ul class="submenu">
					<li><a id ="players"  href ="#">玩家管理</a></li>
					<li><a id="flow"      href ="#">查看流水</a></li>
					<li><a id="community" href= "#">公会管理</a></li>
					<li><a id="rating"    href ="#">推广员管理</a></li>
				</ul>
			</li>
		</ul>
  <!-- <div id="tt" class="easyui-tabs" style="width:1536px;height:400px;"> -->
  
  </div>
  
  <div id="centerPosition" data-options="region:'center',title:'显示面板',split:true" style="background:#eee;">
  		<iframe id ="loadHtml" style="width:100%;height:100%"></iframe>
  </div>
    <!-- <div id="toolbar">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" onclick="destroyUser()" plain="true">删除</a>
    </div>
    <div id="toolbar1">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" onclick="destroyUser()" plain="true">删除</a>
    </div>
    <div id="toolbar2">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" onclick="destroyUser()" plain="true">删除</a>
    </div> -->
  
	  <script type="text/javascript" src="js/dialog.js"></script>
	  <script type="text/javascript" src="js/index1.js"></script>
  </body>
</html>