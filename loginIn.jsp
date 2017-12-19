<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <meta http-equiv="X-UA-Compatible" content="IE=9"> 
      <meta http-equiv="X-UA-Compatible" content="IE=Ddge"> 
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>棋牌系统</title>
      <link rel="stylesheet" type="text/css" href="easyui/themes/default/easyui.css">
	  <link rel="stylesheet" type="text/css" href="easyui/themes/icon.css">
	  <link rel="stylesheet" type="text/css" href="css/common.css">
	  <link rel="stylesheet" type="text/css" href="css/index.css">
	  <link rel="stylesheet" href="css/zTreeStyle/zTreeStyle.css" type="text/css">
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
    </style> 
  </head>
  <body class="easyui-layout">
  <div id="tt" class="easyui-tabs" style="width:1536px;height:400px;">
    <div title="玩家管理" style="padding:20px;">   
        <table id="dg" title="玩家管理" class="easyui-datagrid" style="width: 500px; height: 250px"
        url="data/players.json" toolbar="#toolbar1" pagination="true" rownumbers="true"
        fitcolumns="true" singleselect="true">
        <thead>
            <tr>
                <th field="player_id" width="50">
            ID
                </th>
                <th field="name" width="50">
                     玩家账号
                </th>
                <th field="phone" width="60">
                    手机号码
                </th>
               <th field="points" width="60">
                    点数
                </th>
            </tr>
        </thead>
    </table> 
    </div>
     <div title="赔率管理" style="overflow:auto;padding:20px;">   
        <table id="dg1" title="赔率管理" class="easyui-datagrid" style="width: 300px; height: 250px"
        url="data/players.json" toolbar="#toolbar2" pagination="true" rownumbers="true"
        fitcolumns="true" singleselect="true">
        <thead>
            <tr>
                <th field="AccountCode" width="50">
            ID
                </th>
                <th field="AccountName" width="50">
                     描述
                </th>
                <th field="AccountPwd" width="60">
                    赔率值
                </th>
            </tr>
        </thead>
    </table>    
    </div>
    <div title="工会管理" style="padding:20px;">   
        <table id="dg2" title="工会管理" class="easyui-datagrid" style="width: 500px; height: 250px"
        url="data/players.json" toolbar="#toolbar" pagination="true" rownumbers="true"
        fitcolumns="true" singleselect="true">
        <thead>
            <tr>
                <th field="AccountCode" width="50">
            ID
                </th>
                <th field="AccountName" width="50">
                     工会管理员
                </th>
            </tr>
        </thead>
    </table> 
    </div>
    <div title="流水查看" style="padding:20px;">   
        <table id="dg3" title="流水查看" class="easyui-datagrid" style="width: 500px; height: 250px"
        url="data/players.json"  pagination="true" rownumbers="true"
        fitcolumns="true" singleselect="true">
        <thead>
            <tr>
                <th field="AccountCode" width="50">
            	期号
                </th>
                <th field="AccountName" width="50">
                            投注总额
                </th>
                <th field="AccountPwd" width="60">
             	 派奖
                </th>
                 <th field="AccountPwd" width="60">
                              盈利
                </th>
            </tr>
        </thead>
    </table> 
    </div>
    </div>
    <div id="toolbar">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
    </div>
    <div id="toolbar1">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
    </div>
    <div id="toolbar2">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-add" onclick="newuser()" plain="true">添加</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-edit" onclick="edituser()" plain="true">修改</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
    </div>
    
    <div id="dlg" class="easyui-dialog" style="width: 400px; height: 280px; padding: 10px 20px;"
       closed="true" buttons="#dlg-buttons"> 
       <div class="ftitle"> 
           信息编辑 
       </div> 
       <form id="fm" method="post"> 
       <div class="fitem"> 
           <label> 
            ID    
           </label> 
           <input name="AccountCode" class="easyui-validatebox" required="true" /> 
       </div> 
       <div class="fitem"> 
           <label> 
               账号</label> 
           <input name="AccountName" class="easyui-validatebox" required="true" /> 
       </div> 
       <div class="fitem"> 
           <label> 
               手机积分</label> 
           <input name="AccountPwd" class="easyui-validatebox" required="true" /> 
       </div> 
       <input type="hidden" name="action" id="hidtype" /> 
       <input type="hidden" name="ID" id="Nameid" /> 
       </form> 
   </div>
    <div id="dlg-buttons"> 
        <a href="javascript:void(0)" class="easyui-linkbutton" onclick="saveuser()" iconcls="icon-save">保存</a> 
        <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg').dialog('close')"
            iconcls="icon-cancel">取消</a> 
    </div>
	  <script type="text/javascript" src="js/dialog.js"></script>
  </body>
</html>