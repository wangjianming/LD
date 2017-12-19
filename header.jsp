<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String arcgis_js_api_home = request.getServerName() + ":"
			+ request.getServerPort() + path + "/";
%>
<!DOCTYPE>
<html>
<head>
<base href="<%=basePath%>">
<script type="text/javascript">
		var  arcgis_js_api_home = "<%=arcgis_js_api_home%>";
		var dojoConfig = { async: true,paths:{"js":"/../js","cbtree":"/../js/cbtree"},isDebug:true};
</script>
<link rel="stylesheet" type="text/css" href="arcgis_js_api/library/3.13/3.13/dijit/themes/claro/claro.css" />
<link rel="stylesheet" type="text/css" href="arcgis_js_api/library/3.13/3.13/dijit/themes/claro/document.css" />
<link rel="stylesheet" type="text/css" href="arcgis_js_api/library/3.13/3.13/dojox/widget/Toaster/Toaster.css" />
<link rel="stylesheet" type="text/css" href="arcgis_js_api/library/3.13/3.13/esri/css/esri.css" />
<script type="text/javascript" src="arcgis_js_api/library/3.13/3.13/init.js"></script>
