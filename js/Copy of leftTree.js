(function(){	
//  var supermapUrl = "http://192.168.2.128:8090/iserver/services/map-lamp/rest/maps/streetLamp";
 //图片单击事件
 imgclick =function(item){
	     $('#singleAttDiv').dialog({
		   title:"路灯",
		   width:600,
		   height:600,
		   closed:false,
		   href:"./html/jkzx/ydtj.jsp",
		   modal:true,
		   onLoad:function(){
			   var attributes = item.children.attributes;
			   $('#attrFormsigle').form('load',attributes);
			   
			   $("<img>").attr("src","servlet/ShowPhotoAction?photopath="+attributes["Phot_Path"]+"&photoname="+attributes["Phot_Name_1"]+"&isincequ=1&width=557").appendTo($("#imageParentDiv"));

		   }
		   
	   });
		// var value = showModalDialog("attrDlg.jsp",null,"dialogWidth=270px;dialogHeight=200px;status=no");
	    //加载空间参考文件
	}
 //动态添加DIV,存放路灯图片
function dynamicDIV(treeLeafItems) {
	var imgsrc="images/lamp/lamp1.jpg";
	$.each(treeLeafItems,function(index,treeLeafItem){
		
		var imageDiv = $("<div class='mydiv'>").text(treeLeafItem.text).appendTo($('#businessDiv'));
		var img = $("<img class='myimg' src="+imgsrc+">").appendTo(imageDiv);
		img.click(function(){
			imgclick(treeLeafItem);
		});
	});
}
var nodeType=0;
//初始化树的事件	
function myTreeEvent(lastdatasource){
                $('#myTree').tree({
				data : lastdatasource,
				onBeforeExpand:function(node){
					myTreeExpOrClick(node);
				}
                ,onClick : function(node){
                	myTreeExpOrClick(node);
                	/*var isleaf = $('#myTree').tree('isLeaf',node.target);
                
	                	if(isleaf){
	                		
							//定位到三维球上
	                		var wylsh=node.text;
							var xx = node.children.geometry.x;
							var yy = node.children.geometry.y;
							
							//定位开始
							matchModel.highLightMatchObject("路灯",wylsh,{X:xx,Y:yy},node.children.attributes);
							//定位结束
						}else{
							$('#mytabs').tabs("select",1);//默认选中某个tab
							var children = node.children;
							if(children && children.length>0){
								dynamicDIV(children);
							}else{
								querybyNode(node.text,node);
							}
						}*/
                	
                }

			});
}
function myTreeExpOrClick(node){
	var isleaf = $('#myTree').tree('isLeaf',node.target);
	if(isleaf){
		//定位到三维球上
		var wylsh=node.text;
		var xx = node.children.geometry.x;
		var yy=node. children.geometry.y;
		console.log(node.children.attributes);
		//定位开始
		matchModel.highLightMatchObject("路灯",wylsh,{X:xx,Y:yy},node.children.attributes);
		//定位结束
	}else if(node.type=="工区"){
		$("#businessDiv").empty();//将DIV置空
		if(node.text){
			var children = node.children;
			if(children && children.length>0){
				dynamicDIV(children);
			}else{
				querybyNode(node.text,node);
			}
		}
	}
}
//动态向tree中添加节点
function addNodesDynamic(node,datasource,selectNode){
	$('#myTree').tree('append',{ 
		parent:selectNode.target,
		data:datasource
	});	

	selectNode.children = datasource;
	$('#myTree').tree("collapse",selectNode.target);
	$('#myTree').tree("expand",selectNode.target);
	 //加载点击节点的测区下的路灯,以图表的形式显示
    dynamicDIV(datasource);
}
//
 var queryBySQL =function() {
	 
	var queryParams = [];
	var queryBySQLParams, queryBySQLService;
		var queryParam_ = new SuperMap.REST.FilterParameter();
		queryParam_.name = "tbl_Street_Lamp@lamp";
		queryParam_.attributeFilter = "Name LIKE '%路灯%'";
		//queryParam_.fields = ["SmID","Owne_Depa","Main_Depa","Clas_Name","Name","Belo_Road",""];
		queryParam_.groupBy  = "Meas_Area_Code";
		queryParam_.orderBy  = "Meas_Area_Code";
		queryParams.push(queryParam_);
	queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
		queryParams : queryParams
	});
	queryBySQLService = new SuperMap.REST.QueryBySQLService(supermapUrl, {
		eventListeners : {
			"processCompleted" : processCompleted,
			"processFailed" : processFailed
		}
	});
	queryBySQLService.processAsync(queryBySQLParams);
};

 function processFailed(queryEventArgs){
 };

function processCompleted(queryEventArgs) {
	var  result = queryEventArgs.result,
		recordsets =result.recordsets;
	if (result && recordsets) {
		var treeData=[];
		for ( var j = 0; j < recordsets[0].features.length; j++) {
			var queryfeature = recordsets[0].features[j],
			    rs = queryfeature.attributes["Meas_Area_Code"];
			treeData.push({text : rs,type:"工区", children : [],state : "closed"});
		}	
		
	   //调用初始化树的事件的函数
		myTreeEvent([{text : "工区",children : treeData,state : "closed"}]);	
	 }
};
///////////////////////////////////
function querybyNode(name,node){
	var queryParams = [];
	var queryParam_ = new SuperMap.REST.FilterParameter();
	queryParam_.name = "tbl_Street_Lamp@lamp";
	queryParam_.attributeFilter = "Meas_Area_Code = "+name;
	queryParams.push(queryParam_);
	
	queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
		queryParams : queryParams
	});
	queryBySQLService = new SuperMap.REST.QueryBySQLService(supermapUrl, {
		eventListeners : {
			"processCompleted" : function(queryEventArgs){
				querybyNodeCompleted(queryEventArgs,node);
			}
		},
		"distinctName":name
	});
	currentService = queryBySQLService; // 用于取消当前查询 by Hu
	queryBySQLService.processAsync(queryBySQLParams);
};

function querybyNodeCompleted(queryEventArgs,node){	
	var cequArr={};
	var tempArr=[];
    var name =queryEventArgs.object.distinctName,
     recordsets =queryEventArgs.result.recordsets;
    if(recordsets[0].features.length > 0){
		for (var j = 0; j < recordsets[0].features.length; j++){
			if(j<300){
				var att = recordsets[0].features[j].attributes["Fiel_Seri_Code"];
				var geometry = recordsets[0].features[j].geometry;
				if (!(name in cequArr)) {
					cequArr[name] = [];
				}
				cequArr[name].push({
					children: recordsets[0].features[j],
					text:att,
					geometry:geometry
				});
				tempArr.push(recordsets[0].features[j].attributes);
			}	 
		}
	  addNodesDynamic(name,cequArr[name],node);
    }else{
    	alert("此工区没有查到相关信息!");
    }
};

	lefttree.queryBySQL =queryBySQL;
})();



				            