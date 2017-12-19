<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'attrDlg.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
      <link rel="stylesheet" type="text/css" href="easyui/themes/default/easyui.css">
	  <link rel="stylesheet" type="text/css" href="easyui/themes/icon.css">
	  <link rel="stylesheet" type="text/css" href="css/common.css">
	  <link rel="stylesheet" type="text/css" href="css/index.css">
	  <script type="text/javascript" src="easyui/jquery.min.js"></script>
	  <script type="text/javascript" src="easyui/jquery.easyui.min.js"></script>
	  <script type="text/javascript" src="js/json.js"></script>
  </head>
  
  <body>
      <form id="attrForm" method="post" >
           
	    	<table class="mytable" data-options="fit:true">
	    	    <tr>
	    			<td><img  src="images/lamp/zhaoming.png" width="80px" height="80px"></img></td>
	    			<td><div></div></td>
	    		</tr>
	    		<tr>
	    			<td>名称:</td>
	    			<td><input  type="text" id="Name" name="Name"></input></td>
	    		</tr>
	    		<tr>
	    			<td>测区:</td>
	    			<td><input  type="text" id="Meas_Area_Code" name="Meas_Area_Code"></input></td>
	    		</tr>
	    		<tr>
	    			<td>所属道路:</td>
	    			<td><input  type="text" id="Belo_Road" name="Belo_Road"></input></td>
	    		</tr>
	    		<tr>
	    			<td>功率:</td>
	    			<td><input  type="text" id="Powe" name="Powe"></input></td>
	    		</tr>
	    		<tr>
	    			<td>权属单位:</td>
	    			<td><input  type="text" id="Owne_Depa" name="Owne_Depa"></input></td>
	    		</tr>
	    		<tr>
	    			<td>X坐标:</td>
	    			<td><input  type="text" id="XCood" name="XCood"></input></td>
	    		</tr>
	    		<tr>
	    			<td>Y坐标:</td>
	    			<td><input  type="text" id="YCood" name="YCood"></input></td>
	    		</tr>
	    	</table>
	    </form>
	
  </body>
</html>
