 var url,rowName,rowPoints;
        var balance;
        var rowNewPoints;
        var baseUrl = "http://106.75.133.210/manage/chargepoints?";
        var broadUrl = "http://106.75.133.210/manage/listextdplayer?";
        var guildid,name;
        var addpoint;
        var array;
        window.onload = function()
        {
        	 $('#dg').datagrid({loadFilter:pagerFilter}).datagrid('loadData', parent.ajaxData.result_value);
		     $(".datagrid-view")[0].style.height="74%";
		     $(".datagrid-view")[0].style.overflow="auto";
		     $(".datagrid-view2")[0].style.paddingLeft="17px";
		     $(".datagrid-view2")[1].style.paddingLeft="17px";
        }
        function broadAdmin()
        {
        	var row = $("#dg").datagrid("getSelected");
	        if (row) 
	        {
	        	guidid = row.guildid;//邀请码
	        	name = row.name;
	        	$.ajax({
				type : "get",
				url:broadUrl+"sessionid="+parent.arr[1].split("#")[0]+"&guildid="+guidid+"&name="+name+"&count=100&start=0",
				cache : false,
				dataType : 'json',
				success : function(result) {
					if (result.result_code == 10000) {
	                    $.messager.alert("提示信息", "添加成功");
	                    array = result.result_value
	                    /* $("#dlgGH").dialog("close");
	                    $("#dg2").datagrid("reload"); */
	                    window.array = array; 
	                    getAllPlayers(array);
                	}
	                else {
	                    $.messager.alert("提示信息", "操作失败");
	                }
				},
			});
	        }
        }
        function getAllPlayers(array)
        {
        	$("#playersBroaddg").datagrid({loadFilter:pagerFilter}).datagrid('loadData', array);
        	$("#dlgBroadPlayers").dialog("open");
        }
	    function pagerFilter(data){
            if (typeof data.length == 'number' && typeof data.splice == 'function'){    // 判断数据是否是数组
                data = {
                    total: data.length,
                    rows: data
                }
            }
            var dg = $(this);
            var opts = dg.datagrid('options');
            var pager = dg.datagrid('getPager');
            pager.pagination({
                onSelectPage:function(pageNum, pageSize){
                    opts.pageNumber = pageNum;
                    opts.pageSize = pageSize;
                    pager.pagination('refresh',{
                        pageNumber:pageNum,
                        pageSize:pageSize
                    });
                    dg.datagrid('loadData',data);
                    $(".datagrid-view2")[0].style.paddingLeft="30px";
		     		$(".datagrid-view2")[1].style.paddingLeft="30px";
                }
               
            });
            if (!data.originalRows){
                data.originalRows = (data.rows);
            }
            var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
            var end = start + parseInt(opts.pageSize);
            data.rows = (data.originalRows.slice(start, end));
            return data;
        }
        
	    function edituser() {
	        var row = $("#dg").datagrid("getSelected");
	        if (row) {
	        	rowPoints = row.points;
	            $("#dlg").dialog("open").dialog('setTitle', '修改积分');
	            row.points = 0;
	            $("#fm").form("load", row); 
	            rowName = row.name;
	            /* rowPoints = row.points; */
	        }
    	}
    	function saveuser() {
    	/* if(rowPoints<parseInt($("#points")[0].value))
	            {
	            	balance = parseInt($("#points")[0].value)-rowPoints;
	            }
	            else
	            {
	            	balance =-(rowPoints-parseInt($("#points")[0].value));
	            } */
	        addpoint = parseInt($("#points")[0].value);
	        $.ajax({
					type : "get",
					url:baseUrl+"sessionid="+parent.arr[1].split("#")[0]+"&name="+rowName+"&point="+addpoint+"",
					cache : false,
					dataType : 'json',
					success : function(result) {
						if (result.result_code == 10000) {
		                    $.messager.alert("提示信息", result.result_message);
		                    $("#dlg").dialog("close");
		                    $("#dg").datagrid("load");
		                    $("#dg").datagrid("reload");
		                     for(var i = 0 ;i<$(".datagrid-row").length;i++)
		                    {
		                    	if($(".datagrid-row")[i].className.indexOf("datagrid-row-selected")>0)
		                    	{
			                    	  indexNumber = i;
			                    	  break;
		                    	}
		                    }
		                    $('#dg').datagrid('updateRow',{
								index: indexNumber,
								row: {
									points: rowPoints+addpoint
								}
							});
	                	}
		                else {
		                    $.messager.alert("提示信息", "操作失败");
		                }
					},
			});
    	}/**
 * 
 */