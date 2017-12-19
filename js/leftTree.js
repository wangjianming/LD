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
			   var attributes = item.attributes;
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
		
		var imageDiv = $("<div class='mydiv'>").text(treeLeafItem.name).appendTo($('#businessDiv'));
		var img = $("<img class='myimg' src="+imgsrc+">").appendTo(imageDiv);
		img.click(function(){
			imgclick(treeLeafItem);
		});
	});
};



var setting = {
		check: {
			enable: true
		},
		data: {
			simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: ""
		}
		},
		view: {
			expandSpeed: ""
		},
		callback: {
			beforeExpand: beforeExpand,
			onClick: zTreeOnClick	
		}
	};
var rootNode =[{name:"工区", id:"1",type:"rootNode", count:500,isParent:true}];

//ztree展开事件
function beforeExpand(treeId, treeNode) {
	expandorClick(treeId, treeNode);
	}
function zTreeOnClick(event, treeId, treeNode) {
		
	expandorClick(treeId, treeNode); 
};
function expandorClick(treeId, treeNode){
	if(treeNode.type=="rootNode"&&treeNode.children==null){
		treeNode.icon = "./css/zTreeStyle/img/loading.gif";
		queryByCQ(treeNode);
	}else if(treeNode.type=="cequNode"&&treeNode.children==null){
		treeNode.icon = "./css/zTreeStyle/img/loading.gif";
		querybyNode(treeNode.name,treeNode);
	}else if(treeNode.type=="leaf"){
		$('#mytabs').tabs("select",0);//默认选中某个tab
		//定位到三维球上
		var wylsh=treeNode.name;
		var xx = treeNode.geometry.x;
		var yy=treeNode.geometry.y;
		//定位开始
		matchModel.highLightMatchObject("路灯",wylsh,{X:xx,Y:yy},treeNode.attributes);
		//定位结束
	}else{
		$('#mytabs').tabs("select",1);//默认选中某个tab
		//展开此节点
		var treeObj = $.fn.zTree.getZTreeObj("myTree");
		var nodes = treeObj.getSelectedNodes();
		if (nodes.length>0) {
			treeObj.expandNode(nodes[0], true, true, true);
		}

	}
}

var init = function(){
	 $.fn.zTree.init($("#myTree"), setting, rootNode);
};

//
function queryByCQ(node) {
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
			"processCompleted" : function(queryEventArgs){
				processCompleted(queryEventArgs,node);
			},
			"processFailed" : processFailed
		}
	});
	queryBySQLService.processAsync(queryBySQLParams);
};

 function processFailed(queryEventArgs){
 };

function processCompleted(queryEventArgs,treeNode) {
	var  result = queryEventArgs.result,
		recordsets =result.recordsets;
	var CQHArr=[];
	if (result && recordsets) {
		var treeData=[];
		for ( var j = 0; j < recordsets[0].features.length; j++) {
			var queryfeature = recordsets[0].features[j],
			    rs = queryfeature.attributes["Meas_Area_Code"];
		//	treeData.push({text : rs,type:"工区", children : [],state : "closed"});
			CQHArr.push({name:rs,type:"cequNode",isParent:true});
		}	
		var zTree = $.fn.zTree.getZTreeObj("myTree"),
        newNodes = zTree.addNodes(treeNode, CQHArr);
		treeNode.icon = "";
	   //调用初始化树的事件的函数
	//	myTreeEvent([{text : "工区",children : treeData,state : "closed"}]);	
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
   
function querybyNodeCompleted(queryEventArgs,treeNode){	
    var name =queryEventArgs.object.distinctName,
     recordsets =queryEventArgs.result.recordsets;
    var tempArr=[];
    if(recordsets[0].features.length > 0){
		for (var j = 0; j < recordsets[0].features.length; j++){
			  var feature =recordsets[0].features[j];
				var wylsh = feature.attributes["Fiel_Seri_Code"];
				var geometry = feature.geometry;
				tempArr.push({name:wylsh,attributes:feature.attributes,geometry:geometry,type:"leaf"});		 
		}
		var zTree = $.fn.zTree.getZTreeObj("myTree"),
           newNodes = zTree.addNodes(treeNode, tempArr);
		//加载点击节点的测区下的路灯,以图表的形式显示
		$('#mytabs').tabs("select",1);//默认选中某个tab
	    dynamicDIV(tempArr);
	    treeNode.icon = "";
    }else{
    	alert("此工区没有查到相关信息!");
    }
};
    lefttree.init = init;
	//lefttree.queryByCQ =queryByCQ;
})();



				            