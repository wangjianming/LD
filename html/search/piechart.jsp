<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	  <link rel="stylesheet" type="text/css" href="easyui/themes/default/easyui.css">
	  <link rel="stylesheet" type="text/css" href="easyui/themes/icon.css">
	  <link rel="stylesheet" type="text/css" href="css/common.css">
	  <link rel="stylesheet" type="text/css" href="css/index.css">
	  <script type="text/javascript" src="easyui/jquery.min.js"></script>
	  <script type="text/javascript" src="easyui/jquery.easyui.min.js"></script>
	  <script type="text/javascript" src="js/highcharts/highcharts.js"></script>
  
        </head>  
        <body> 
        <div class="easyui-layout" data-options="fit:true" style="width:100%;height:100%;"> 
	          
		   <div data-options="region:'center'">
			   <div>
				     <select id="methodSelect" style="width:200px;">
							<option value="Owne_Depa">权属查询</option>
							<option value="Pole_Type_ID">灯杆类型</option>
							<option value="Belo_Road">所属道路</option>
							<option value="Meas_Area_Code">测区编号</option>
							<option value="Surv_Depa_ID">普查单位</option>
							<option value="Bulb_Type_ID">灯泡类型</option>
							
			        	</select> 
			        	<button onclick="queryBtnClick()">查询</button>
			     </div> 
	          <div id="piecontainer" style="width: 100%;height:95%;"></div>
	       </div>
	       <div data-options="region:'east',split:true"  style="width:280px;">
	         <table id="dg" class="easyui-datagrid" data-options=" method:'get',border:true,singleSelect:true,
			fit:true,fitColumns:true">
	           <thead>
					<tr>
					    <th data-options="field:'Meas_Area_Code',align:'center',width:50">测区号</th>
						<th data-options="field:'Fiel_Seri_Code',align:'center',width:50">外业流水号</th>
						<th data-options="field:'Belo_Road',align:'center',width:50">所属道路</th>
						<th data-options="field:'Pole_Type_ID',align:'center',width:50">灯杆类型</th>
						<th data-options="field:'Owne_Depa',align:'center',width:50">权属单位</th>
					</tr>
				</thead> 
	         </table>
	       </div>
      </div>  
        <script type="text/javascript">  
   // var obj={"权属单位":Owne_Depa,"灯杆类型":Pole_Type_ID,"所属道路":Belo_Road,"测区号":Meas_Area_Code};


    var lampArrObj={};
    var  ludengArrObj={};
    var treeData=[];
    var lamplength=0;
    var text=null;
    var checkChiniserReg = /[\u4E00-\u9FA5]/;
  //  var  baseurl ="http://192.168.2.118:6080/arcgis/rest/services/bjgx/MapServer/40/query?where=1=1&f=json&callback=?";
   // var  baseurl ="http://192.168.2.118:6080/arcgis/rest/services/bjgx/MapServer/40/query?f=json";
  var param; //选择的查询的方式
 function queryBtnClick(){

   lampArrObj={};
   treeData=[];
   param = $("#methodSelect").val();
   var tempurl = baseurl+"&groupByFieldsForStatistics="+param+"&outStatistics=[{statisticType:count,onStatisticField:"+ param+",outStatisticFieldName:count}]&returnGeometry=false&returnCountOnly=false&callback=?";
   
               $.getJSON(tempurl,function(res){
					lamplength =res.features.length;
						for (var i = 0; i < res.features.length; i++){
                               var key = res.features[i].attributes[param];
                               var keyvalue = key;
                               if(param in ldFieldValueMap){
                                  keyvalue = ldFieldValueMap[param][key];
                               }
                                
	                            if(keyvalue==null|| keyvalue==""||!checkChiniserReg.test(keyvalue)){
	                              keyvalue ="其他";
	                            }
								if (!(keyvalue in lampArrObj)) {
									lampArrObj[keyvalue] = [];
								}
								
							
								lampArrObj[keyvalue].push({
										count:res.features[i].attributes["count"],
										text:keyvalue
									});
						 }
						
						 for ( var item in lampArrObj) {
						       var count = lampArrObj[item][0]["count"];
							   var arr =[item,count];
							   if(count/lamplength > 0.005){
							     treeData.push(arr);
							   }
							   
						}
						chart();
						
					 }
					);
   }	
   //图表chart	
  function chart(){
     var chart = new Highcharts.Chart({  
            chart: {  
                renderTo: 'piecontainer',  
                plotBackgroundColor: null,  
                plotBorderWidth: 1,  
                plotShadow: true,
                credits:{
                enabled:false
                }
            },  
            title: {  
                text: '<b>'+$("#methodSelect option:selected").html()+'</b>'  
            },  
            tooltip: {  
                formatter: function() {  
                    return '<b>'+ this.point.name +'</b>: '+ Math.ceil((this.percentage)*1000)/1000 +' %';  
                }  
            },  
            plotOptions: {  
                pie: {  
                    allowPointSelect: true,  
                    cursor: 'pointer',
                    point:{
                       events:{
                            click:piechartClick 
                        //  click:tt    
                       }
                    },
                     credits:{
                     enabled:false
                     }, 
                    dataLabels: {  
                        enabled: true,  
                        color: '#000000',  
                        connectorColor: '#000000',  
                        formatter: function() {  
                            return '<b>'+ this.point.name +'</b>: '+ Math.ceil((this.percentage)*1000)/1000 +' %';  
                        }  
                    }  
                }  
            },  
            series: [{  
                type: 'pie',  
                name: 'Browser share',  
                data: treeData
            }]  
        });  
   
   }
    //===============
   piechartClick  =function(event){
	   var key =event.point.name;
	   var valueKey;
	   var count =0;
	   //有value值找相对应的key
	  for(var tempKey in ldFieldValueMap[param]){ 
	      count++;
		  if(key==ldFieldValueMap[param][tempKey]){
		    valueKey=tempKey;
		    break;
		  }
		 
	  }
	  if(valueKey==null){
	    valueKey="'"+key+"'";
	  }
	    var dgdata =[];        
           $.ajax({
				url : baseurl+"&outFields=Fiel_Seri_Code,Meas_Area_Code,Belo_Road,Owne_Depa,Pole_Type_ID,Surv_Depa_ID&where="+param+"="+valueKey+"&callback=?",
				dataType : "json",
				success : function(res) {
							for(var i=0;i<res.features.length;i++){
								//if(i<1000){
							      dgdata.push(res.features[i].attributes);
							      //}
							 }
	                         createGrid('#dg',dgdata)
						}
						
					}); 
   
    }
    function createGrid(gridId,data){
		$(gridId).datagrid({loadFilter:pagerFilter,pagination:true,pageNumber:10}).datagrid('loadData', data);
    }
    function pagerFilter(data){
		if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
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
			}
			,beforePageText:""
			,afterPageText:"/{pages}"
			,displayMsg:"{from} - {to}/{total}"
		});
		if (!data.originalRows){
			data.originalRows = (data.rows);
		}
		var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
		var end = start + parseInt(opts.pageSize);
		data.rows = (data.originalRows.slice(start, end));
		return data;
	}
    </script>  
        </body>
         
    </html> 


