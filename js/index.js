var earth = null; // 全局球体对象
var SYSTEMPARAMS = null; // 系统参数对象
var excuteType = 27;// GetXml接口 返回类型
var MATCHMODELMAP= {};// 记录所有的部件模型映射图层;
/*var  baseurl ="http://192.168.2.118:6080/arcgis/rest/services/bjgx/MapServer/40/query?f=json";
var supermapUrl = "http://192.168.2.128:8090/iserver/services/map-lamp/rest/maps/streetLamp";*/
baseurl =STAMP_config.itemurl.baseurl;
supermapUrl=STAMP_config.itemurl.supermapUrl;
var ldFieldValueMap={
		"Mate_ID":{"1":"金属","2":"水泥","3":"木质","4":"其他"}
		,"Pole_Type_ID":{"1":"风帆","2":"花灯","3":"冰山","4":"高杆","5":"庭院灯","6":"单臂","7":"双臂","8":"棚灯","9":"射灯","10":"其他"}
		,"Bulb_Type_ID":{"1":"高压钠灯","2":"金属卤化物灯","3":"汞灯","4":"节能灯","5":"LED灯","6":"其他"}
		,"Mana_Depa_ID":{"35":"哈尔滨经济技术开发区","36":"哈尔滨西部地区开发建设领导小组办公室","37":"哈尔滨利民经济开发区","38":"哈尔滨铁路局","39":"哈尔滨市电业局","40":"黑龙江省邮政公司哈尔滨分公司","41":"哈尔滨市武警消防支队","42":"哈尔滨供水集团有限责任公司","43":"哈尔滨地铁集团有限公司","44":"哈尔滨工大集团有限责任公司","45":"哈尔滨物业供热集团有限责任公司","46":"中国石油天然气股份有限公司哈尔滨石化分公司","47":"中国石油化工集团股份有限公司黑龙江哈尔滨石油分公司","48":"中国移动通信集团哈尔滨分公司","49":"中国联合网络通信有限公司哈尔滨市分公司","50":"中国电信集团公司哈尔滨市电信分公司","51":"哈尔滨中庆燃气有限责任公司","52":"黑龙江天辰燃气有限责任公司","53":"哈尔滨哈投投资股份有限公司供热公司","54":"哈尔滨中龙热电有限公司","55":"哈尔滨太平供热有限责任公司","56":"龙唐电力投资公司群力供热分公司","57":"达尔凯阳光（哈尔滨）热电有限公司","58":"哈尔滨热电有限责任公司","59":"哈尔滨发电厂","60":"哈尔滨平南热电厂","61":"哈尔滨元申广电网络有限公司","62":"哈尔滨市路灯管理处","63":"哈尔滨市南岗区城乡建设局","64":"哈尔滨市城乡建设委员会","65":"黑龙江省文物管理局","66":"其他","1":"哈尔滨市商务局","2":"哈尔滨市工商行政管理局","3":"哈尔滨市住房保障和房产管理局","4":"哈尔滨市城市管理局","5":"哈尔滨市卫生局","6":"哈尔滨市食品药品监督管理局","7":"哈尔滨市气象局","8":"哈尔滨市民政局","9":"哈尔滨日报报业集团","10":"哈尔滨市安全生产监督管理局","11":"哈尔滨市环境保护局","12":"哈尔滨市旅游局","13":"哈尔滨市水务局","14":"哈尔滨市工业和信息化委员会","15":"哈尔滨市政府国有资产监督管理委员会","16":"哈尔滨供排水集团有限责任公司","17":"哈尔滨市人民防空办公室","18":"哈尔滨市城乡规划局","19":"哈尔滨市公安局","20":"哈尔滨市公安交通管理局","21":"哈尔滨市交通局","22":"哈尔滨市文化和新闻出版局","23":"哈尔滨市教育局","24":"哈尔滨市民族宗教事务局","25":"哈尔滨财政局","26":"哈尔滨市林业局","27":"哈尔滨市广播电视局","28":"哈尔滨市南岗区人民政府","29":"哈尔滨市道里区人民政府","30":"哈尔滨市道外区人民政府","31":"哈尔滨市平房区人民政府","32":"哈尔滨市松北区人民政府","33":"哈尔滨市香坊区人民政府","34":"哈尔滨高新技术产业开发区"}
		,"Surv_Depa_ID":{"1":"辽宁宏图创展测绘勘察有限公司","2":"黑龙江省水利水电勘测设计研究院","3":"哈尔滨测量高等专科学校测量工程公司","4":"黑龙江省煤田地质物测队","5":"黑龙江中海经测空间信息技术有限公司","6":"齐齐哈尔地星测绘有限责任公司","7":"大连九成测绘信息有限公司","8":"河北省第三测绘院","9":"其他"}
		,"Devi_Stat_ID":{"1":"完好","2":"破损","3":"丢失","4":"占用","5":"其他"}};


function init()
{
	SystemSetting.initSystemParam();// 初始化系统参数对象
	STAMP.LayerManager(earth).getLayerData(null, false);;
	earth.Environment.Mode2DEnable = false; // 初始显示为三维地图
	earth.Environment.TerrainTransparency = 255; // 初始地形透明度
	earth.GlobeObserver.UndergroundMode = false; // 初始地下不可浏览
}
$(function (){
	/*var e  = document.getElementById("slowlyEnlarge");
	e.onclick = function(){
		if(e.offsetWidth+50>=300){
			return;
		}
		new animateManage({
			"context":e,
			"effect":"linear",
			"time":200,
			"starCss":{
				"width":e.offsetWidth
			},
			"css":{
				"width":e.offsetWidth+50
			}
		}).init();
	}*/
	
	$("#mainMenuDiv ul li:last a").css({border:"none"});
	$("#mainMenuDiv ul li a").bind("click",function(){
		$(this).addClass("selectedMainLiStyle").parent().siblings().children("a").removeClass("selectedMainLiStyle");
		var index=$(this).parent().index();
		$($("#subMenuDiv ul").get(index)).css({display:"block"}).siblings().css({display:"none"});
	});
	$("#subMenuDiv ul li a").bind("click",function(){
		$(this).addClass("selectedSubLiStyle").parent().siblings().children("a").removeClass("selectedSubLiStyle");
		var href=$(this).attr("hsrc");
		if(href)
		    $("#businessDiv").panel({href:href});
		else
			$("#businessDiv").empty();
		//matchModel.highLightMatchObject("路灯","190591ddd15",{X:"293383.732",Y:"205261.707"});
	});
	$("#txtErrorInfoDiv").bind("click",function(){
		$("#businessDiv").panel({href:$(this).attr("hsrc")});
	});
	//报警计数
	var warningCountSpan = document.getElementById("warningCountSpan");
	addWarningCount(randomTime());

	// region 界面控制
    var panelMenu = $("#container").layout("panel", "west"),
         headerHeight = panelMenu.panel("header").outerHeight(); //panel面板头的高度
    // 必须提前初始化对话框面板窗口，不然layout收缩会报错
    // 延迟1秒等待3D插件加载
    // dialog打开后需要关闭（仅针对IE 6）
    /**
     * 显示系统左侧菜单面板
     */
    var openMenuPanel = function() {
        if (panelMenu.panel("options").collapsed) {
            $("#container").layout("expand", "west");
        }
    };
    setTimeout(function () {
        $("#dlgResult").dialog({}).dialog("close");
    }, 1000);
	/**
     * 显示左侧面板，覆盖在左侧菜单面板之上
     * @param src 面板加载网页的地址
     * @param title 面板的标题
     */
    window.showLargeDialog = function (src, title) {
        openMenuPanel();
        $("#dlgResult").dialog({
            shadow:false,
            draggable:false,
            title:title,

            onClose:function () {  // 对话框窗口关闭时清除临时图形
                //earth.ShapeCreator.Clear();
                //earth.Paint.ClearHighlightObject();
                // 对话框关闭时卸载页面，页面自身按需要清除临时数据
                $("#ifResult").attr("src", "");
                $("#checkBntn div").attr("disabled", false);
                //SystemSetting.initSystemParam();
                isCamera = false;
            }
            /* handler:function test() {
             data:obj;
             }*/
        }).panel({height:panelMenu.height() + headerHeight+20,width:240})
            .panel("move", {top:"80px", left:"0px"});
        $("#ifResult").attr("src", src);
    };
    /**
     * 隐藏左侧大面板
     */
    window.hideLargeDialog = function() {
        $("#dlgResult").dialog({}).dialog("close");
    };
	$("#ifEarth").attr("src", "3DMain.html");
});

//报警计数
function addWarningCount(time) {
	var timer = setTimeout(function() {
		var number = Number(warningCountSpan.innerHTML);
		var addNumber = randomCount();
		if(number<95){
			warningCountSpan.innerHTML = number + addNumber;
		}
		addWarningCount(randomTime());
		clearTimeout(timer);
	}, time);
}
function randomTime() {
	var count = Math.round(Math.random() * 5000);
	return count;
}
function randomCount() {
	var count = Math.round(Math.random() * 5);
	return count;
}

function indexSearch(src)
{
	window.showLargeDialog(src,'编号查询');
}

//用电信息更新
function timer() {
	date_object = new Date();
	var t = date_object.toLocaleTimeString();
	var TempNo = Math.round(Math.random());
	var dyNo=TempNo*5-2.5;
	var glNo=TempNo*10-5;
	var dlNo=TempNo*0.02-0.01;
	document.getElementById("tempdy").innerHTML =Number(document.getElementById("tempdy").innerHTML)+dyNo;
	document.getElementById("tempgl").innerHTML =Number(document.getElementById("tempgl").innerHTML)+glNo;
	document.getElementById("tempdl").innerHTML =Number(document.getElementById("tempdl").innerHTML)+dlNo;
	document.getElementById("tempTime").innerHTML = t;
}
//-----------------------------------------------------------------
//--坐标转换对象创建 - 开始
//-----------------------------------------------------------------
var CoordinateTransform = {
	sysDatum : null, // 系统内部的坐标转换对象

	/**
	 * 功能：获取系统内部的坐标转换对象
	 */
	getSystemDatum : function() {
		if (this.sysDatum == null) {
			this.sysDatum = this.createDatum();
		}
		return this.sysDatum;
	},

	/**
	 * 功能：获取坐标转换参数
	 */
	getTransformParam : function(url) {
		if (url == null) {
			url = "http://" + CoordinateTransform.getRootPath()
					+ "/config/spatial.xml";
		}
		var coordDoc = loadXMLStr(url);
		if ((coordDoc == null) || (coordDoc.xml == "")) {
			// alert("坐标转换文件加载失败");
			return null;
		}
		var param = {};
		var coordRoot = coordDoc.documentElement.firstChild;
		param.elliType = coordRoot.selectSingleNode("EllipsoidType").text;
		param.projType = coordRoot.selectSingleNode("ProjectionType").text;
		param.zoneWidth = coordRoot.selectSingleNode("ZoneWidth").text;
		param.zoneIndex = coordRoot.selectSingleNode("ZoneIndex").text;
		param.falseEast = coordRoot.selectSingleNode("FalseEasting").text;
		param.falseNorth = coordRoot.selectSingleNode("FalseNorthing").text;
		param.centerMer = coordRoot.selectSingleNode("CentralMeridian").text;
		param.refLat = coordRoot.selectSingleNode("ReferenceLatitude").text;
		param.offsetX = coordRoot.selectSingleNode("OffsetX").text;
		param.offsetY = coordRoot.selectSingleNode("OffsetY").text;
		param.offsetZ = coordRoot.selectSingleNode("OffsetZ").text;
		param.offsetLon = coordRoot.selectSingleNode("OffsetLongitude").text;
		param.offsetLat = coordRoot.selectSingleNode("OffsetLatitude").text;
		param.offsetAlt = coordRoot.selectSingleNode("OffsetAltitude").text;
		param.transMode = coordRoot.selectSingleNode("TransformMode").text;

		var fourParamNode = coordRoot.selectSingleNode("FourParameter");
		var fourParam = {};
		fourParam.transX = fourParamNode.selectSingleNode("TranslateX").text;
		fourParam.transY = fourParamNode.selectSingleNode("TranslateY").text;
		fourParam.rotate = fourParamNode.selectSingleNode("Rotate").text;
		fourParam.scaling = fourParamNode.selectSingleNode("Scaling").text;
		param.fourParam = fourParam;

		var sevenParamNode = coordRoot.selectSingleNode("SevenParameter");
		var sevenParam = {};
		sevenParam.transX = sevenParamNode.selectSingleNode("TranslateX").text;
		sevenParam.transY = sevenParamNode.selectSingleNode("TranslateY").text;
		sevenParam.transZ = sevenParamNode.selectSingleNode("TranslateZ").text;
		sevenParam.rotateX = sevenParamNode.selectSingleNode("RotateX").text;
		sevenParam.rotateY = sevenParamNode.selectSingleNode("RotateY").text;
		sevenParam.rotateZ = sevenParamNode.selectSingleNode("RotateZ").text;
		sevenParam.scaling = sevenParamNode.selectSingleNode("Scaling").text;
		param.sevenParam = sevenParam;

		param.elliType2 = coordRoot.selectSingleNode("EllipsoidType2").text;
		return param;
	},
	getRootPath : function() {
		var pathName = window.document.location.pathname;
		var localhost = window.location.host;
		var projectName = pathName.substring(0,
				pathName.substr(1).indexOf('/') + 1);
		return (localhost + projectName);
	},
	/**
	 * 功能：创建空间坐标转换对象
	 */
	createDatum : function() {
		var projectId = parent.SYSTEMPARAMS.project;
		var projLayer = earth.LayerManager.GetLayerByGUID(projectId);
		var spatialUrl = projLayer.ProjectSetting.SpatialRefFile;
		var dataProcess = document.getElementById("dataProcess");
		dataProcess.Load();
		var spatial = dataProcess.CoordFactory.CreateSpatialRef();
		spatial.InitFromFile(spatialUrl);
		var datum = dataProcess.CoordFactory.CreateDatum(); // earth.Factory.CreateDatum();
		datum.init(spatial);
		// datum.source.init();//修改椭球体参数
		this.sysDatum = datum;
		return datum;
	}
};
//判断文件是否存在
var chkFile = function(fileURL) {
	/*
	 * var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 * xmlhttp.open("GET",fileURL,false); xmlhttp.send();
	 * if(xmlhttp.readyState==4){ if(xmlhttp.status==200) return true; //存在 else
	 * if(xmlhttp.status==404) return false; //不存在 //else alert("Error"); //报错 }
	 */
	return true;
}
var SystemSetting = {
	/**
	 * 功能：初始化系统参数对象 参数：无 返回值：无
	 */
	initSystemParam : function() {
		if (SYSTEMPARAMS == null) {
			SYSTEMPARAMS = this.getSystemConfig();
		}
		if (SYSTEMPARAMS.project != "") {
			if (SYSTEMPARAMS.Position != "" && SYSTEMPARAMS.Position) {
				var longitude = SYSTEMPARAMS.Position.split(",")[0];
				var latitude = SYSTEMPARAMS.Position.split(",")[1];
				var altitude = SYSTEMPARAMS.Position.split(",")[2];
				var tilt = SYSTEMPARAMS.Position.split(",")[3];
				var heading = SYSTEMPARAMS.Position.split(",")[4];
				var roll = SYSTEMPARAMS.Position.split(",")[5];
				var range = SYSTEMPARAMS.Position.split(",")[6];
				earth.GlobeObserver.GotoLookat(longitude, latitude, altitude,
						heading, tilt, roll, range);
			}
					
			var layer = earth.LayerManager.GetLayerByGUID(SYSTEMPARAMS.project);
			if (layer) {
				// 服务端属性配置开始！
				var projectSetting = layer.ProjectSetting;
				var layerLink = projectSetting.PipeConfigFile;// 管线配置文件
				var fieldMap = projectSetting.FieldMapFile;// 字段映射配置文件
				var valueMap = projectSetting.ValueMapFile;// 值域映射文件
				if (fieldMap != "") {
					var filedPath = "http://"
							+ fieldMap.substr(2).replace("/", "/sde?/")
							+ "_sde";
					if (chkFile(filedPath)) {
						// 管线字段映射
						earth.Event.OnEditDatabaseFinished = function(pRes,
								pFeature) {
							if (pRes.ExcuteType == excuteType) {
								SYSTEMPARAMS.pipeFieldMap = loadXMLStr(pRes.AttributeName); // 初始化编码映射文件对象
							}
							if (layerLink != "") {
								var configUrl = "h ttp://"
										+ layerLink.substr(2).replace("/",
												"/sde?/") + "_sde";
								SYSTEMPARAMS.pipeConfigLink = layerLink;
								if (chkFile(configUrl)) {
									// 管线配置
									earth.Event.OnEditDatabaseFinished = function(
											pRes, pFeature) {
										if (pRes.ExcuteType == excuteType) {
											SYSTEMPARAMS.pipeConfigDoc = loadXMLStr(pRes.AttributeName); // 初始化管线字段映射文件
										}
										if (valueMap != "") {
											var vPath = "http://"
													+ valueMap.substr(2)
															.replace("/",
																	"/sde?/")
													+ "_sde";
											if (chkFile(vPath)) {
												// valueMap配置
												earth.Event.OnEditDatabaseFinished = function(
														pRes, pFeature) {
													if (pRes.ExcuteType == excuteType) {
														SYSTEMPARAMS.valueMap = loadXMLStr(pRes.AttributeName); // 初始化编码映射文件对象
													}
													// 自定义字段 fieldMap.config
													var pipeConfigLink = SYSTEMPARAMS.pipeConfigLink;
													if (pipeConfigLink) {
														var configUrl = "http://"
																+ pipeConfigLink
																		.substr(
																				2)
																		.replace(
																				"/",
																				"/sde?/")
																		.replace(
																				"PipeConfig.config",
																				"FieldMap.config")
																+ "_sde";
														earth.Event.OnEditDatabaseFinished = function(
																pRes, pFeature) {
															if (pRes.ExcuteType == excuteType) {
																var xmlStr = pRes.AttributeName;
																var systemDoc = loadXMLStr(xmlStr);
																if (systemDoc === null) {
																	return;
																}
																var jsonData = $
																		.xml2json(systemDoc);
																if (jsonData.LineFieldMap
																		&& jsonData.LineFieldMap.UserDefine) {
																	var fieldItem = jsonData.LineFieldMap.UserDefine.FieldMapItem;
																	var captionAry = [];
																	var aliasNameAry = [];
																	for ( var i = 0; i < fieldItem.length; i++) {
																		// var
																		// fidldCaption
																		// =
																		// fieldItem[i].FieldCaption;
																		var fieldMapitem = fieldItem[i].FieldName;
																		var fieldAliasName = fieldItem[i].FieldAliasName;
																		captionAry
																				.push(fieldMapitem);
																		aliasNameAry
																				.push(fieldAliasName);
																	}
																	customLineFields
																			.push(
																					captionAry,
																					aliasNameAry);
																}
																if (jsonData.PointFieldMap
																		&& jsonData.PointFieldMap.UserDefine) {
																	var fieldItem = jsonData.PointFieldMap.UserDefine.FieldMapItem;
																	var captionAry = [];
																	var aliasNameAry = [];
																	for ( var i = 0; i < fieldItem.length; i++) {
																		// var
																		// fidldCaption
																		// =
																		// fieldItem[i].FieldCaption;
																		var fieldMapitem = fieldItem[i].FieldName;
																		var fieldAliasName = fieldItem[i].FieldAliasName;
																		captionAry
																				.push(fieldMapitem);
																		aliasNameAry
																				.push(fieldAliasName);
																	}
																	customPointFields
																			.push(
																					captionAry,
																					aliasNameAry);
																}
															}
															// setAreaQueryBtn();
														}
														earth.DatabaseManager.GetXml(configUrl);
													}
												}
												earth.DatabaseManager.GetXml(vPath);
											}
										} else {
											SYSTEMPARAMS.valueMap = "";
										}
									}
									earth.DatabaseManager.GetXml(configUrl);
								}
							} else {
								alert("缺少管线配置文件,管线属性无法正常显示.");
								// return;
								SYSTEMPARAMS.pipeConfigDoc = "";
							}
						}
						earth.DatabaseManager.GetXml(filedPath);
					}
				} else {
					$("#northDiv").attr("disabled", true);
					alert("缺少管线字段映射文件,管线属性无法正常显示.");
					return;
				}
				var spatialRef = projectSetting.SpatialRefFile;// 空间参考文件
				if (spatialRef != "") {
					var spatialUrl = "http://"
							+ spatialRef.substr(2).replace("/", "/sde?/")
							+ "_sde";
					if (chkFile(spatialUrl)) {
						SYSTEMPARAMS.pipeDatum = parent.CoordinateTransform
								.createDatum(spatialUrl);
						earth.Event.OnDocumentUpdate = function(res) {
							// 修改坐标显示单位 如果当前工程范围内 就转坐标 否则显示经纬度
							var earthPose = earth.GlobeObserver.TargetPose;
							var lon = earthPose.Longitude;
							var lat = earthPose.Latitude;
							var alt = earth.GlobeObserver.Pose.Altitude;
							var pXY = parent.CoordinateTransform.createDatum(
									spatialUrl)
									.des_BLH_to_src_xy(lon, lat, alt);
							var layerBounds = layer.ProjectSetting.LonLatRect;
							var layerMaxHeight = layerBounds.MaxHeight;// 图层的最大可见高度
							if (alt <= (layerMaxHeight + 10000)
									&& lon >= layerBounds.West
									&& lon <= layerBounds.east
									&& lat >= layerBounds.South
									&& lat <= layerBounds.North) {
								earth.Environment.UseLocalCoord = true;
								earth.Environment.SetLocalCoord(pXY.x, pXY.y);
							} else {
								earth.Environment.UseLocalCoord = false;
							}
						}
					}
				} else {
					SYSTEMPARAMS.pipeDatum = "";
				}
			}
		} else {
			SYSTEMPARAMS.pipeConfigDoc = "";
			SYSTEMPARAMS.pipeDatum = "";
			SYSTEMPARAMS.pipeFieldMap = "";
		}
	},

	/**
	 * 功能：初始化系统配置文件内容 参数：无 返回值：初始化的系统配置文件内容
	 */
	initSystemConfig : function(id) {
		var configXml = '<xml>';
		if (id) {
			configXml = configXml + '<Project>' + id + '</Project>'; // project
		} else {
			configXml = configXml + '<Project></Project>'; // project
		}
		configXml = configXml + '<Position></Position></xml>';
		return configXml;
	},

	/**
	 * 功能：获取系统配置参数 参数：无 返回值：系统配置参数
	 */
	getSystemConfig : function() {
		var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
		var configPath = rootPath + ".xml";
		var configXml = earth.UserDocument.LoadXmlFile(configPath);
		if (configXml === "" || configXml.indexOf("Position") < 0) {
			configXml = this.initSystemConfig();
			earth.UserDocument.SaveXmlFile(rootPath, configXml);
		}
		var systemDoc = loadXMLStr(configXml);
		var systemJson = $.xml2json(systemDoc);
		if (systemJson == null) {
			return false;
		}
		if (systemJson.Project == "" || systemJson.Project.length != 36
				|| systemJson.Position == null) { // 如果工程不存在，默认选第一个
			var pipeProjArr = SystemSetting.getProjectList();
			if (pipeProjArr.length > 0) {
				var obj = {
					// ip: params.ip,
					project : pipeProjArr[0].id
				};
				earth.UserDocument.DeleteXmlFile(configPath);
				var newXml = this.initSystemConfig(pipeProjArr[0].id);
				earth.UserDocument.SaveXmlFile(rootPath, newXml);
	
				systemDoc = loadXMLStr(newXml);
				systemJson = $.xml2json(systemDoc);
			}
	
		}
		// ////////////////////////////////////////////////////////
		// IE9 不支持selectSingleNode
		// ////////////////////////////////////////////////////////
		/* var root = systemDoc.documentElement; */
		var systemData = {};
		systemData.project = systemJson.Project;
		systemData.Position = systemJson.Position;
		return systemData;
	},

	/**
	 * 功能：设置系统配置参数 参数：systemData-系统配置参数 返回值：无
	 */
	setSystemConfig : function(systemData) {
		var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
		var configPath = rootPath + ".xml";
		var configXml = earth.UserDocument.LoadXmlFile(configPath);
		var systemDoc = loadXMLStr(configXml);
		var root = systemDoc.documentElement;
		(root.getElementsByTagName("Project")[0]).text = systemData.project;
		// (root.getElementsByTagName("Ip")[0]).text = params.ip;
		(root.getElementsByTagName("Position")[0]).text = systemData.Position;
		earth.UserDocument.SaveXmlFile(rootPath, systemDoc.xml);
	},

	/**
	 * 功能：获得项目列表 参数：无 返回值：项目列表
	 */
	getProjectList : function(){
		var projectList = [];
		var rootLayerList = earth.LayerManager.LayerList;
		var projectCount = rootLayerList.GetChildCount();
		for ( var i = 0; i < projectCount; i++) {
			var childLayer = rootLayerList.GetChildAt(i);
			var layerType = childLayer.LayerType;
			var pipeTag = false;
			if (layerType === "Project" && !pipeTag) { // 17
				var projectId = childLayer.Guid;
				var projectName = childLayer.Name;
				var chlildrenCount = childLayer.GetChildCount();
				projectList.push({
					id : projectId,
					name : projectName
				});
			}
		}
		return projectList;
	}
};
