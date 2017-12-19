/**
 * User: wangmeng
 * Date: 2014-12-12
 * Time: 下午7:53
 * Desc:查询公共方法
 */
/*commonsearch={};*/
(function () {
	var objHighLight=null;
	var htmlBalloons=null;
	var ldAttrCN={"NAME":"名称","DEVI_NUM":"设施编号","CODE":"编码","CLAS_CODE":"分类编码","UNIT_GRID":"所属单元网格","BELO_ROAD":"所属道路","MATE_ID":"灯杆材质","POLE_TYPE_ID":"灯杆类型","BULB_TYPE_ID":"灯泡类别","MEMB_NUM":"杆号","MEMB_NUM_110":"110杆号","LAMP_FACT":"灯具厂家","POWE":"功率","BULB_NUM":"光源数量","DEVI_STAT_ID":"设施状态","INST_TIME":"安装时间","MANA_DEPA_ID":"主管单位","OWNE_DEPA":"权属单位","MAIN_DEPA":"养护单位","SURV_DEPA_ID":"普查单位","INIT_TIME":"初始时间","CHAN_TIME":"变更时间","NOTE_":"备注","CLAS_NAME":"分类名称","ANCI_FACI_EXIS":"是否有负载设施"}; 
    //本地模型查询
    var localSearch=function(layerObj, keyword, searchgeometry) {
    	var searchParam = layerObj.LocalSearchParameter;
        if(searchParam==null){
            return;
        }
        searchParam.ClearSpatialFilter();
        if (keyword.length>0) {
            searchParam.SetFilter(keyword, "");
        }
        if (searchgeometry != null) {
            searchParam.SetFilter("", "");
            searchParam.SetSpatialFilter(searchgeometry);
        }
        searchParam.PageRecordCount = 65535;
        searchParam.ReturnDataType = 1; //0 返回所有数据，1 返回xml数据，2 返回渲染数据
        var result = layerObj.SearchFromLocal();
        return result;
    }
    /**
     * SDE部件查询结果定位
     */
    var highLightMatchObject=function(layerName,keyValue,position,dataNode) {
    	var result=null;
	    clearObjHighLight();
	    clearHtmlBalloons();
	    if(layerName in MATCHMODELMAP)
	    {
	    	var layerObj=MATCHMODELMAP[layerName];
			result=localSearch(layerObj,keyValue,null);
	    }
    	if (result==null || result.RecordCount==0) {
    		flyToPosition(position);
    		showModelDetailMsg(null,position,dataNode);
            return;
        }
    	var dataRoot = getShowResult(result);
    	if(dataRoot==null)
    	{
    		flyToPosition(position);
    		showModelDetailMsg(null,position,dataNode);
            return;
    	}
	    //模型端模糊查询，获取具体索引
	    var index=getResultIndex(dataRoot,keyValue);
	    if(index==-1)
	    {
	    	flyToPosition(position);
	    	showModelDetailMsg(null,position,dataNode);
	    	return;
	    }
	    objHighLight= result.GetLocalObject(index);
	    objHighLight.ShowHighLight();
	    flyToModel(objHighLight);
	    showModelDetailMsg(objHighLight,position,dataNode);
    }
    //三维模型查询结果，获取dom对象
    var getShowResult=function(searchResult) {
    	var resultXml = searchResult.GotoPage(0);
    	if(resultXml==null || resultXml.length<10)
    	{
    		return null;
    	}
        var resultDoc = loadXMLStr(resultXml);
        var dataRoot=resultDoc.documentElement.firstChild.firstChild;
        return dataRoot;
    }
	 //三维模型模糊查询唯一值获取
    var getResultIndex=function(dataRoot,name)
    {
    	for (var i = 0; i < dataRoot.childNodes.length; i++) {
    		if(dataRoot.childNodes[i].selectSingleNode("SE_NAME").text==name)
    	    {
    			return i;
    	    }
    	}
    	return -1;
    }
    var clearObjHighLight=function()
    {
    	if(objHighLight!=null)
	    	objHighLight.StopHighLight();
    }
    //获取指定位置高程
    var getDEMHeight=function(x,y)
    {
    	return earth.GlobeObserver.GetHeight(x,y)+5;
    }
    /**
     * 定位(飞行)到模型搜索数据.
     */
    var flyToModel=function(obj) {
        if(obj==null){
            return;
        }
        var rect = obj.GetLonLatRect();
        if (rect == null || rect == undefined) return;
        var north = Number(rect.North);
        var south = Number(rect.South);
        var east = Number(rect.East);
        var west = Number(rect.West);
        var topHeight = Number(rect.MaxHeight);
        var bottomHeight = Number(rect.MinHeight);

        var lon = (east+west)/2;
        var lat = (south+north)/2;
        var alt = (topHeight+bottomHeight)/2;
        var width = (parseFloat(north) - parseFloat(south)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        range += 25;
        earth.GlobeObserver.FlytoLookat(lon, lat, alt,0,75,0,range,3);
    }
    /**
     * 定位(飞行)到平面位置{X:"293383.732",Y:"205261.707"}
     */
    var flyToPosition=function(position) {
        if(position && position.X && position.Y)
        {
        	var datum = CoordinateTransform.getSystemDatum();
			if (datum) {
			   var geoPoint = datum.src_xy_to_des_BLH(position.X, position.Y, 0);//293383.732,205261.707
			   var lon = Number(geoPoint.X);
			   var lat= Number(geoPoint.Y);
			   var alt=getDEMHeight(geoPoint.X,geoPoint.Y);
               var range= 240;
               earth.GlobeObserver.FlytoLookat(lon, lat, alt,0,75,0,range,3);
			}
        }
    }
    var getPosition=function(position) {
        if(position && position.X && position.Y)
        {
        	var datum = CoordinateTransform.getSystemDatum();
			if (datum) {
			   var geoPoint = datum.src_xy_to_des_BLH(position.X, position.Y, 0);//293383.732,205261.707
			   var lon = Number(geoPoint.X);
			   var lat= Number(geoPoint.Y);
			   var alt=getDEMHeight(geoPoint.X,geoPoint.Y);
               return {X:lon,Y:lat,Z:alt};
			}
        }
        return null;
    }
    /**
     * 显示SDE查询结果_详细信息
     */
    var showModelDetailMsg=function(obj,position,dataNode)
    {
    	console.log("yangna!");
    	console.log(dataNode);
    	var htmlStr ='';
    	if(dataNode){
    		for(var key in dataNode){
    			/*if(key=="SmID"|| key ="SmX"|| key ="SmY"|| key ="SmUserID"){
    			 continue;	
    			}*/
    			var value;
    			if(key.toUpperCase() in ldAttrCN){
    				value = dataNode[key];
    				console.log(value);
    				if(key in ldFieldValueMap){
    					value =ldFieldValueMap[key][value];
    				//	console.log(value);
    				}
    				htmlStr = htmlStr + '<tr><td>'+ldAttrCN[key.toUpperCase()]+'</td><td>'+value+'</td></tr>';
    			}
    		}
    		showModelDetailHtmlBalloons(obj,position,htmlStr);
    	}
    	
    }

    var showModelDetailHtmlBalloons=function(obj,position,content)
    {
    	var htmlStr = '<div style="display:block;width:100%;height:100%;overflow:auto;padding:0px;">';
        htmlStr =htmlStr +'<table border="0" cellpadding="1" cellspacing="0" style="width:100%;height:100%;"><tr><td width="100%" valign="top"><table border="0" cellpadding="2" cellspacing="1" width="100%" style="font-size:12px;background:#b9d8f3">';
        htmlStr =htmlStr +'<col bgcolor="#f4faff"/>';
        htmlStr =htmlStr +'<col bgcolor="#f4faff"/>';
        htmlStr =htmlStr +'<tr style="color:#0076c8"><th align="left">字段名</th><th align="left">属性值</th></tr>';
        htmlStr =htmlStr + content;
        htmlStr =htmlStr +'</table></td></tr>';
        htmlStr = htmlStr + '</table></div>';
        
        var centerX,centerY,centerZ;
        if(obj){
        	var rect = obj.GetLonLatRect();
    		centerX = rect.Center.X;
    	    centerY = rect.Center.Y;
    	    centerZ = rect.Center.Z;
        }
        else
        {
        	var centerObj=getPosition(position);
        	if(centerObj)
        	{
        		centerX = centerObj.X;
        	    centerY = centerObj.Y;
        	    centerZ = centerObj.Z;
        	}
        	else
        		return;
        }
	    //earth.HtmlBalloon.Transparence = true;
	    var guid = earth.Factory.CreateGuid();
	    htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
	    htmlBalloons.SetSphericalLocation(centerX, centerY, centerZ);
	    htmlBalloons.SetRectSize(370, 350);
        var color = parseInt("0xccffffff");//0xccc0c0c0
        htmlBalloons.SetTailColor(color);
        htmlBalloons.SetIsAddCloseButton(true);
        htmlBalloons.SetIsAddMargin(true);
        htmlBalloons.SetIsAddBackgroundImage(true);
        //htmlBalloons.SetIsTransparence(true);
        htmlBalloons.SetBackgroundAlpha(0xcc);
        htmlBalloons.ShowHtml(htmlStr);
        earth.Event.OnHtmlBalloonFinished = function(){
            if(htmlBalloons){
            	htmlBalloons.DestroyObject();
            	htmlBalloons=null;
            	clearObjHighLight();
                earth.Event.OnHtmlBalloonFinished = function(){};
            }
        };
    }
    //清除SDE数据中出现0的情况
    var clearValueZero=function(value)
    {
    	var numberValue;
    	if(value.length>=18 && value.indexOf(".")>0 && !isNaN(value))
    	{
    		  numberValue=parseFloat(value);
              if(numberValue==0)
            	  return 0;
              else
              {
            	  if(parseInt(value)-numberValue==0)
            		  return parseInt(value);
            	  return numberValue.toFixed(3);
              }
    	}
    	return value;
    }

  //清除弹出气球消息框
    var clearHtmlBalloons=function()       
    {
    	if(htmlBalloons){
        	htmlBalloons.DestroyObject();
        	htmlBalloons=null;
    	}
    }
    //方法
    matchModel.highLightMatchObject=highLightMatchObject;
    matchModel.flyToPosition=flyToPosition;
    matchModel.localSearch=localSearch;
    matchModel.getShowResult=getShowResult;
    matchModel.getResultIndex=getResultIndex;
    matchModel.getDEMHeight=getDEMHeight;
})();