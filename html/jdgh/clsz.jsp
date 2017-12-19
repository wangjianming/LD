<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>策略设置</title>
</head>
<body> 
	<div class="easyui-layout" data-options="fit:true" style="width:800px;height:800px;">
		<div data-options="region:'center'">
			<table id="dg" class="easyui-datagrid"
			data-options="url:'datagrid_data1.json', method:'get',border:true,singleSelect:true,
			fit:true,fitColumns:true,pagination:true,onClickCell: onClickCell">
				<thead>
					<tr>
					    <th data-options="field:'CYMC',align:'center',width:50">策略名称</th>
						<th data-options="field:'SSQY',align:'center',width:50">所属区域</th>
						<th data-options="field:'SSJZQ',align:'center',width:50">所属集中器</th>
						<th data-options="field:'YXRQ',align:'center',width:50">有效日期</th>
						<th data-options="field:'TKMS',align:'center',width:50">调控模式</th>
						<th data-options="field:'ZT',align:'center',width:50">状态</th>
						<th data-options="field:'CZ',align:'center',width:50">操作</th>
						
						<!-- 
						<th data-options="field:'SSJZQ',align:'right'" width="85">所属集中器</th>
						<th data-options="field:'YXRQ',align:'right'" width="80">有效日期</th>
						<th data-options="field:'TKMS'" width="100">调控模式</th>
						<th data-options="field:'ZT',align:'center'" width="50">状态</th>
						<th data-options="field:'CZ',align:'center'" width="50">操作</th> -->
					</tr>
				</thead> 
			</table>
		</div>
		<div data-options="region:'south',split:true" style="height:50px;">		
			<a href="#" class="easyui-linkbutton" onclick="startBtnClick()">启用</a>
			<a href="#" class="easyui-linkbutton" onclick="endBtnClick()">禁用</a>
			<a href="#" class="easyui-linkbutton" onclick="addBtnClick()">添加</a>
			<a href="#" class="easyui-linkbutton" onclick="deleteBtnClick()">删除</a>
		</div>
	</div>
	<script>
	$(function (){ 
		 for(var item in lefttree.xzqArr){
		    console.log(item);
			$("#selectedAero").append('<Option value="'+item+ '">'+item+'</Option>');
		 }
			
	 });

	
	function startBtnClick(){
		var myrow = $('#dg').datagrid('getSelected');
		  var rowIndex = $('#dg').datagrid('getRowIndex',myrow);
		 if(rowIndex !=-1){
		 $.messager.alert("提示","启用所选择的策略!");
		}
	}
	function endBtnClick(){
	      var myrow = $('#dg').datagrid('getSelected');
		   var rowIndex = $('#dg').datagrid('getRowIndex',myrow);
		   if(rowIndex !=-1){
	       $.messager.alert("提示","禁用所选择的策略!");
	      }
	}
	
	function addBtnClick(){
			$('#dg').datagrid('appendRow',{
			CYMC: '爱建小区10盏',
			SSQY: '道外区'
		   });
		    $.messager.alert("提示","添加成功!");
	}
	function deleteBtnClick(){
      var myrow = $('#dg').datagrid('getSelected');
     // console.log($('#dg').datagrid('getRowIndex',myrow));
	  var rowIndex = $('#dg').datagrid('getRowIndex',myrow);
     console.log(rowIndex);
	 if(rowIndex !=-1){
	 $('#dg').datagrid('deleteRow',rowIndex);
	  $.messager.alert("提示","删除成功!");
	 }else{
	 $.messager.alert("提示","请选择行进行删除!");
	 }
	   
	}
function queryBtnClick(){
	 var param = $("#selectedAero").val();
	  var tempArr=[];
	  var url="datagrid_data1.json";
	   $.getJSON(url, function callback(res){
		   console.log(res);
		   for (var i =0 ; i<res.rows.length; i++){
			  if( res.rows[i].SSQY==param){
				  tempArr.push(res.rows[i]);
			  }
		   }
		   $('#dg').datagrid("loadData",tempArr);
	      
	   });
	}
//添加datagrid的编辑
		$.extend($.fn.datagrid.methods, {
			editCell: function(jq,param){
				return jq.each(function(){
					var opts = $(this).datagrid('options');
					var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
					for(var i=0; i<fields.length; i++){
						var col = $(this).datagrid('getColumnOption', fields[i]);
						col.editor1 = col.editor;
						if (fields[i] != param.field){
							col.editor = null;
						}
					}
					$(this).datagrid('beginEdit', param.index);
					for(var i=0; i<fields.length; i++){
						var col = $(this).datagrid('getColumnOption', fields[i]);
						col.editor = col.editor1;
					}
				});
			}
		});
		
		var editIndex = undefined;
		function endEditing(){
			if (editIndex == undefined){return true}
			if ($('#dg').datagrid('validateRow', editIndex)){
				$('#dg').datagrid('endEdit', editIndex);
				editIndex = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickCell(index, field){
			if (endEditing()){
				$('#dg').datagrid('selectRow', index)
						.datagrid('editCell', {index:index,field:field});
				editIndex = index;
			}
		}
</script>
</body>
</html>