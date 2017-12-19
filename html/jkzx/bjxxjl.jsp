<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>报警信息</title>
</head>
<body>
<style>
table{
border:#999 1px dashed;
}
table tr td{
border-bottom:#999 1px dashed;
}
table tr th{
border-bottom:#999 1px dashed;
CURSOR: hand;
}
</style>
	<script type="text/javascript">
	date_object = new Date();
	$(function() {
		var number = Number(parent.document.getElementById("warningCountSpan").innerHTML);
		var warnLen = 36969;
		var htmlStr = '';
		var noWarning=1;
		for ( var i = 0; i < number; i++) {

			var tempOBJECTID = Math.round(Math.random() * (warnLen-1))+1;
			var tempOwne_Depa;
			var tempName;
			var tempMain_Depa;
			var tempBelo_Road;
			var tempBulb_Num;
			var tempAnci_Faci_Exis;
			$.ajax({
			     method:"post",
			     url :STAMP_config.itemurl.baseurl+"&outFields=*&where=OBJECTID="+tempOBJECTID+"&callback=?",
				 dataType : "json",
				 success : function(res) {
			         tempName = res.features[0].attributes["Name"];
			         tempOwne_Depa = res.features[0].attributes["Owne_Depa"];
			         tempMain_Depa= res.features[0].attributes["Main_Depa"];
			         tempBelo_Road= res.features[0].attributes["Belo_Road"];
			         tempBulb_Num=res.features[0].attributes["Bulb_Num"];
			         tempAnci_Faci_Exis=res.features[0].attributes["Anci_Faci_Exis"];
			         tempOBJECTID=res.features[0].attributes["OBJECTID"];
			         if(tempOwne_Depa==null){tempOwne_Depa="";}
			         if(tempMain_Depa==null){tempMain_Depa="";}
			         if(tempBelo_Road==null){tempBelo_Road="";}
			         if(tempBulb_Num==null){tempBulb_Num="";}
			         if(tempAnci_Faci_Exis==null){tempAnci_Faci_Exis="";}
	                 htmlStr = '';
	     			 htmlStr = htmlStr + '<tr height="25" bgcolor="#FFFFFF" style="CURSOR:hand" ondblclick="test('+tempOBJECTID+')">';
	     			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + (noWarning++) + '</td>';
	     			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempName + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempOwne_Depa + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempMain_Depa + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempBelo_Road + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempBulb_Num + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempAnci_Faci_Exis + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + date_object.toLocaleString() + '</td>';
	    			 htmlStr = htmlStr + '<td align="center" bgcolor="#FFFFFF">' + tempName + tempOBJECTID + '</td>';
	    			 htmlStr = htmlStr + '</tr>';
	    			 $("#warningResultTable").append(htmlStr);
               	 }
			});
		}
	});
	function test(tmpId){
		$.ajax({
		     method:"post",
		     url : "http://192.168.2.118:6080/arcgis/rest/services/bjgx/MapServer/40/query?f=json&outFields=*&where=OBJECTID="+tmpId+"&callback=?",
			 dataType : "json",
			 success : function(res) {
				 var tempPosition={};
				 tempPosition.X=res.features[0].geometry.x;
				 tempPosition.Y=res.features[0].geometry.y;
				 var tempFiel_Seri_Code= res.features[0].attributes["Fiel_Seri_Code"];
				 matchModel.highLightMatchObject("路灯",tempFiel_Seri_Code,tempPosition);
				 $("#mytabs").tabs("select",0);//默认选中某个tab
          	 }
		});
	}
	</script>
	<div>
		<table id="warningResultTable"  width="100%" cellpadding="0" cellspacing="0" bordercolorlight="#999999" bordercolordark="#FFFFFF" line-height="0px";>
			<tr height="20" bgcolor="#FFFFFF" >
				<th>序号</th>
				<th>设施名称</th>
				<th>权属单位</th>
				<th>养护单位</th>
				<th>所属道路</th>
				<th>光源数量</th>
				<th>负载设施</th>
				<th>告警时间</th>
				<th>告警描述</th>
			</tr>
		</table>
	</div>
</body>
</html>