var layers = null;//图层对象数组
var searchResult = parent.searchResult;//搜索结果对象
var searchCurrpage = 0;//查询的当前页面
var searchTree;
var layerGuid = "";
var myicon=null;
var selectLayer = parent.selectLayer;
if( !STAMP ){
    var STAMP = {};
}

STAMP.Search = function (earth){
    var search = {};
    /**
     * 根据图层类型，获取图标路径
     * @param layerType 图层类型
     * @return 图标样式
     */
    var _getLayerIcon = function (layerType) {
        var icon = "";
        if(layerType != "Folder"){
            icon = '../../image/layer/layer_'+ layerType.toLowerCase()+'.gif';
        }
        return icon;
    };
    /** 
     * 将管线子图层中的英文名标识改为中文标识
     * @param name
     * @return {*}
     */
    var _enName2cnName = function (name) {
        var map = {
            "equipment":"附属",
            "container":"管线",
            "well":"井",
            "joint":"附属点",
            "plate":"井盖"
        };
        if(map[name]){
            name = map[name];
        }
        return name;
    };
    /**
     * 获取图层数据
     * @param layer 图层根节点
     * @param bWithIcon 是否需要图标
     * @return 图层数据数组
     */
    var getLayerData = function (layer,bWithIcon) {
        if( !layer ){
            layer = earth.LayerManager.LayerList;
        }
        var layerData = [];
        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            var name = _enName2cnName(childLayer.Name);

            var data = {
                "id":childLayer.Guid,
                "name":name,
                "checked":childLayer.Visibility
            };
            if(bWithIcon){
                data["icon"] = _getLayerIcon(childLayer.LayerType);
            }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer, true);
            }
            layerData.push(data);
        }
        return layerData;
    };
    /**
     * 初始化基础图层树
     */
    var  initLayerTree=function(){
        var layerManager = STAMP.LayerManager(earth);
        var zNodes =getLayerData(null, true);
        var setting = {
            check:{
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            view:{
                dblClickExpand:false, //双击节点时，是否自动展开父节点的标识
                expandSpeed:"", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti:false //设置是否允许同时选中多个节点
            },
            callback:{
                onClick:function(event, treeId, node){
                    layerGuid=node.id;
                    var currLayer = earth.LayerManager.GetLayerByGUID(layerGuid);
                    if (currLayer.LayerType == "Model") {
                        $("#search_tips").removeAttr("disabled");
                    }else{
                        $("#search_tips").attr("disabled","disabled");
                    }
                    /*var tempLayer = earth.LayerManager.GetLayerByGUID(selectLayer);
                     if(tempLayer == null){
                     return;
                     }*/
                    /*if (tempLayer.PipeLineType >= 4000 && tempLayer.PipeLineType < 5000){  // fire
                     $("#showFlow").attr("disabled", false);
                     }else{
                     $("#showFlow").attr("disabled", true);
                     }*/
                },
                onDblClick:function (event, treeId, node) {
                    if(node && node.id){
                        var layer = earth.LayerManager.GetLayerByGUID(node.id);
                        if (layer.LayerType) {
                            layerManager.flyToLayer(layer); //定位图层
                        }
                    }
                },
                onCheck:function (event, treeId, node) {
                    layerGuid=node.id;
                    var currLayer = earth.LayerManager.GetLayerByGUID(layerGuid);
                    if (currLayer.LayerType == "Model") {
                        $("#search_tips").removeAttr("disabled");
                    }else{
                        $("#search_tips").attr("disabled","disabled");
                    }
                }
            }
        };

        searchTree=$.fn.zTree.init($("#searchTree"), setting, zNodes);
        searchTree.checkAllNodes(false);

    }

    /* var uncheck=function(){
     var nodes=layerTree.getNodes();
     for(var i=0;i<nodes.length;i++){
     nodes[i].checked = false;
     layerTree.updateNode(nodes[i]);
     }
     }*/
    /**
     * 初始化
     */
    
    var loadSearch=function(earth) {
        if (earth == null) {
            earth = parent.earth;
        }
        initLayerTree();
        setWinSize();
    }
    /**
     * 设置查询结果的颜色
     */
    var clearDateList =function() {
        var n = document.all.selectFalg.rows.length;
        for (var i = 0; i < n; i++) {
            document.getElementById("rows" + i).style.backgroundColor = '#FFFFFF';
        }
    }
    /**
     * 关键字搜索
     */
    var searchTag = true;
    var keyWordSearch=function() {
        var keyword = document.getElementById("id").value;
        if ("" == keyword || null == keyword || keyword == undefined) {
            alert("请输入路灯编号");
            return;
        }
        searchTag=false;
        onSearchCallback(keyword, null);
    }
    var layerTd =function (){
        if(selectLayer){
            var layer = earth.LayerManager.GetLayerByGUID(selectLayer);
            var name = _enName2cnName(layer.Name);
            document.getElementById("layerTd").innerText= "查询图层"+"："+name;
        }

    }
   
    /**
     * 将管线子图层中的英文名标识改为中文标识
     * @param name
     * @return {*}
     */
    var _enName2cnName = function (name) {
        var map = {
            "equipment":"附属",
            "container":"管线",
            "well":"井",
            "joint":"附属点",
            "plate":"井盖"
        };
        if(map[name]){
            name = map[name];
        }
        return name;
    };
    /**
     * 点搜索
     */
    var pointSearch=function() {
        if(layerGuid==""){
            alert("请先选择一个图层");
            return;
        }
        earth.Event.OnPickObjectEx = function (args) {
            earth.Query.FinishPick();
            if (args != null) {
                var color = parseInt("0x77ff0000");
                args.ShowHighLight();
                var htmlStr = '<table style="width:100%;"><tr>';
                htmlStr = htmlStr + '<td>' + 1 + '</td>';
                htmlStr = htmlStr + '<td>' + args.GetKey()+ '</td>';
                htmlStr = htmlStr + '</tr></table>';
                document.getElementById("searchData").innerHTML = htmlStr;
                $("#pageDiv").hide();
            }
        };
        var query = earth.Query;
        query.PickObjectEx(127);
    }

    /**
     *功能：根据一个经纬高程点生成一条短线，用于点搜索
     *参数：经纬高程
     *调用：pointSearch方法调用
     */
    var generateGeoPoints=function(geoPoint) {
        var geoPoints = earth.Factory.CreateGeoPoints();
        geoPoints.Add(geoPoint.Longitude, geoPoint.Latitude, geoPoint.altitude);
        //geoPoints.Add(geoPoint.Longitude-0.00001,geoPoint.Latitude,geoPoint.altitude);
        //geoPoints.Add(geoPoint.Longitude+0.00001,geoPoint.Latitude,geoPoint.altitude);
        return geoPoints;
    }

    /**
     * 面搜索
     */
    var polygonSearch=function() {
        /*if(layerGuid==""){
         alert("请先选择一个图层");
         return;
         }*/
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry =function (pval, type) {
            onSearchCallback("", pval);
            earth.ShapeCreator.Clear();
            earth.Event.OnCreateGeometry = function () {            
            };
        };
        earth.ShapeCreator.CreatePolygon();
    }
    /**
     * 圆搜索
     */
    var circleSearch=function() {
        /* if(layerGuid==""){
         alert("请先选择一个图层");
         return;
         }*/
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry =function (pval, type) {
            onSearchCallback("", pval);
            earth.ShapeCreator.Clear();
            earth.Event.OnCreateGeometry = function () {
            };
        };
        earth.ShapeCreator.CreateCircle();
    }
    /**
     * 矩形搜索
     */
    var rectangleSearch=function() {
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry =function (pval, type) {
            onSearchCallback("", pval);
            earth.ShapeCreator.Clear();
            earth.Event.OnCreateGeometry = function () {
            };
        };
        earth.ShapeCreator.CreateRectangle();
    }
    /**
     * 范围搜索回调函数
     */

    var pageRecordCount = 10;
    if(window.screen.height>1000){
        pageRecordCount = 20;
    }
    else if(window.screen.height>720){
        pageRecordCount = Math.round(window.screen.height/56);
    }
    var onSearchCallback=function(keyword, spatialObj) {
        var layerValue = selectLayer;
        searchResult = localSearch(layerValue, keyword, spatialObj);
        if(searchTag){    //xian搜索再弹出结果页面
            window.showLargeDialog('html/search/searchResult.html', '查询结果');
        }  else{  //先弹出结果页面再搜索
            if ((searchResult == null) || (searchResult.RecordCount == 0)) {
                emptyResultHtml();
                pagePagination();//分页控件引用
            } else {
                showResult(1);
                pagePagination();
            }
        }


    }
    //分页控件引用
    var pagePagination  = function(){ //
        var totalPageNum = Math.ceil(searchResult.RecordCount / pageRecordCount);
        if(totalPageNum==0){
            totalPageNum = 1;
        }
        $("#page").pagination({
            total:searchResult.RecordCount,//总的记录数
            pageSize:pageRecordCount,//每页显示的大小。
            showPageList:false,
            showRefresh:false,
            displayMsg:"",
            beforePageText: "",
            afterPageText: "/" + totalPageNum,
            //pageList: [10,20,50,100],//选择每页显示的记录数的下拉框的值。
            onSelectPage: function(pageNumber, ps){//选择相应的页码时刷新显示内容列表。
                showResult(pageNumber);
            }
        });
    }
    var localSearch=function(guid, keyword, spatialObj) {
        var layerObj = earth.LayerManager.GetLayerByGUID(guid);
        var searchParam = layerObj.LocalSearchParameter;//获取文件搜索的接口
        if(searchParam==null){
            return;
        }
        searchParam.ClearSpatialFilter();
        if (searchParam == null) {
            return null;
        }
        if (keyword != "") {
            searchParam.SetFilter(keyword, "");//用关键字和ID进行搜索
        }
        if (spatialObj != null) {
            searchParam.SetFilter("", "");
            searchParam.SetSpatialFilter(spatialObj);//设置空间域搜索
        }

        searchParam.PageRecordCount = pageRecordCount;
        searchParam.HasDetail = true;
        searchParam.HasMesh = true;
        searchParam.ReturnDataType = 1; //0 返回所有数据，1 返回xml数据，2 返回渲染数据
        var result = layerObj.SearchFromLocal();//获取从文件中搜索的结果
        return result;
    }

    /**
     * 查询结果为空时的hmtl字符串
     */
    var emptyResultHtml=function() {
        //document.getElementById("pageDiv").style.display = "none";
        var Html = "";
        Html += '<div style="margin-top:100;"><font color=#993300><b>没有找到符合条件的结果<b></font></div>';
        document.getElementById("searchData").innerHTML = Html;
        document.getElementById("pageDiv").style.display = "";
    }

    /**
     * 截取查询结果数组中的一页数据
     */
    var getShowResult=function(searchResult, currPage) {
        var resultXml = searchResult.GotoPage(currPage - 1);
        var resultDoc = loadXMLStr(resultXml);
        var dataRoot = resultDoc.documentElement.firstChild.firstChild;
        return dataRoot;
    }

    /**
     * 获得查询结果进行展现
     */

    var showResult=function(searchCurrpage) {
        var pageSize = pageRecordCount;
        var totalPageNum = Math.ceil(searchResult.RecordCount / pageSize);
               //alert(totalPageNum);
        /*       document.getElementById("totalPageNum").innerHTML = "" + totalPageNum;*/

        var dataRoot = getShowResult(searchResult, searchCurrpage);
        var pageNum = searchCurrpage;
        var htmlStr = '<table style="width:100%;color:black" >';
        var no = 0;
       // alert(dataRoot.childNodes.length);
        for (var i = 0; i < dataRoot.childNodes.length; i++) {
            var index = (pageNum - 1) * pageRecordCount + i;
            no = index+1;
            var dataNode = dataRoot.childNodes[i];
            var name = dataNode.selectSingleNode("SE_NAME").text;
            var dataType = null;
            if (dataNode.tagName == "ModelData") {
                dataType = "Model";
            } else if (dataNode.tagName == "POIData") {
                dataType = "POI";
            } else {
                dataType = "Model";
                //return;
            }
            //MaxHeight
            htmlStr = htmlStr + '<tr style="CURSOR: hand" onclick="search.goToSearchObject(' + index + ',\'' + dataType +'\''+ ',\''+name+'\''+')">';
            htmlStr=htmlStr+'<td width=\"30\" height=\"25\" class=\"\" nowrap><font color="green">' + no + '</font></td>';
            htmlStr = htmlStr + '<td>' + name + '</td>';
            htmlStr = htmlStr + '</tr>';
        }
        htmlStr = htmlStr + '</table>';
        document.getElementById("searchData").innerHTML = htmlStr;

        document.getElementById("pageDiv").style.display = "";
        /* document.getElementById("pageNum").innerHTML = "" + pageNum;
         if (pageNum == 1) {
         *//*document.getElementById("firstTd").disabled = true;*//*
         *//*document.getElementById("preTd").disabled = true;*//*
         }
         var totalPageNum = parseInt(document.getElementById("totalPageNum").innerHTML);
         if (pageNum == totalPageNum) {
         *//* document.getElementById("nextTd").disabled = true;*//*
         *//*document.getElementById("lastTd").disabled = true;*//*
         }*/
    }
    /**
     * 单击查询结果定位
     */
    var goToSearchObject=function(index, dataType,name) {
        var obj = searchResult.GetLocalObject(index);
        if (dataType == "Model") {
            var currLayer = earth.LayerManager.GetLayerByGUID(selectLayer);
            var layType = currLayer.Name.substr(currLayer.Name.indexOf("--") + 2);
            var layerType=layType.toLowerCase()  ;
            if (layerType == "billboard") {
                billboardBlinkBox(obj, 0, 0);
            }
            flyToModel(obj);
            var detailCheck = document.getElementById("search_info").checked;
            if (detailCheck == true) {
                var key = searchResult.GetLocalObjectKey(index);
                showModelDetailMsg(obj, key);
            }
        } else if (dataType == "POI") {
            //poiBlink(obj, 0, 0);
            flyToPOI(obj,name);
            var detailCheck = document.getElementById("search_info").checked;
            if (detailCheck == true) {
                earth.detachEvent("onPoiClicked",parent.ifEarth.onPoiClicked);
                var key = searchResult.GetLocalObjectKey(index);
                showpoiMsg(obj,name);
            }else{
                earth.detachEvent("onPoiClicked",parent.ifEarth.onPoiClicked);
            }
        }
    }
    var poihtmlBallon = null;
     var showpoiMsg = function(obj,name){
         if(obj!=null){
             if(htmlBalloons){
                 htmlBalloons.DestroyObject();//删除气泡对象
                 htmlBalloons=null;
             }
             if(poihtmlBallon){
                 poihtmlBallon.DestroyObject();
                 poihtmlBallon=null;
             }
             var htmlStr = '<div style="margin-top:15px; width:100%;overflow: auto;word-break: break-all;word-wrap: break-word; height: 150">';
             htmlStr = htmlStr + '<table style="width:100%;height:150px;font-size:14px;color:#fffffe;text-align:center; overflow:auto;">';
             htmlStr = htmlStr + '<tr>';
             htmlStr = htmlStr + '<td style="word-wrap:break-word;" width="50">名称:</td>';
             htmlStr = htmlStr + '<td style="word-wrap:break-word;" width="100">' + name + '</td>';
             htmlStr = htmlStr + '</tr>';
             htmlStr = htmlStr + '<tr>';
             htmlStr = htmlStr + '<td>经度:</td>';
             htmlStr = htmlStr + '<td>' + obj.Longitude + '</td>';
             htmlStr = htmlStr + '</tr>';
             htmlStr = htmlStr + '<tr>';
             htmlStr = htmlStr + '<td>纬度:</td>';
             htmlStr = htmlStr + '<td>' + obj.Latitude + '</td>';
             htmlStr = htmlStr + '</tr>';
             htmlStr = htmlStr + '<tr>';
             htmlStr = htmlStr + '<td>高程:</td>';
             htmlStr = htmlStr + '<td>' + obj.Altitude + '</td>';
             htmlStr = htmlStr + '</tr>';
             htmlStr = htmlStr + '<tr>';
             htmlStr = htmlStr + '<td>图层:</td>';
             htmlStr = htmlStr + '<td>' + obj.ParentGuid + '</td>';
             htmlStr = htmlStr + '</tr>';
             htmlStr = htmlStr + '</table>';
             htmlStr = htmlStr + '</div>';

             //earth.HtmlBalloon.Transparence = true;
             var guid = earth.Factory.CreateGuid();//创建Guid
             poihtmlBallon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
             poihtmlBallon.SetSphericalLocation( obj.Longitude ,  obj.Latitude, obj.Altitude);
             poihtmlBallon.SetRectSize(180,180);
             var color = parseInt("0xcc4d514a ");//0xccc0c0c0 //e4e4e4
             poihtmlBallon.SetTailColor(color);
             poihtmlBallon.SetIsAddCloseButton(true);
             poihtmlBallon.SetIsAddMargin(true);
             poihtmlBallon.SetIsAddBackgroundImage(true);
             poihtmlBallon.SetIsTransparence(true);
             poihtmlBallon.SetBackgroundAlpha(0xcc);
             poihtmlBallon.ShowHtml(htmlStr);
             earth.Event.OnHtmlBalloonFinished = function(){
                 if(poihtmlBallon!=null){
                     poihtmlBallon.DestroyObject();
                     poihtmlBallon=null;
                 }
                 //earth.attachEvent("onPoiClicked",parent.ifEarth.onPoiClicked);
                 earth.Event.OnHtmlBalloonFinished = function(){};
             }
         }
    }
    /**
     * 设置树的高亮（画立方体）
     */
    var billboardBlinkBox=function(obj, counter, control_box) {
        if (counter <= 15) {
            if (control_box == 0) {
                var lonLatRect = obj.GetLonLatRect();
                var north = lonLatRect.North + 0.00002500;
                var south = lonLatRect.South - 0.00002500;
                var east = lonLatRect.East + 0.00002501;
                var west = lonLatRect.West - 0.00002500;
                var top_height = lonLatRect.MaxHeight + 7;
                var bottom_height = lonLatRect.MinHeight;
                //earth.Paint.DrawBox(north, south, east, west, top_height, bottom_height,0x66ff0000);
                control_box = 1;
            } else {
                //earth.Paint.Clear();
                control_box = 0;
            }
            /*var self = this;
             setTimeout(function () {
             counter++;
             self.billboardBlinkBox(obj, counter, control_box);
             }, 1000);*/
        } else {
            //earth.Paint.Clear();
        }
    }

    /**
     * 设置POI的高亮
     */
    var poiBlink=function(obj, counter, control_box) {
        if (counter <= 15) {
            if (control_box == 0) {
                var lon = obj.Longitude;// * 180 / Math.PI;
                var lat = obj.Latitude;// * 180 / Math.PI;
                var alt = obj.Altitude;
                //			earth.Paint.DrawIcon(lon, lat, alt, "", 0x66ff0000);
                control_box = 1;
            } else {
                //			earth.Paint.Clear();
                control_box = 0;
            }
            var self = this;
            /*setTimeout(function () {
             counter++;
             self.poiBlink(obj, counter, control_box);
             }, 1000);*/
        } else {
            //		earth.Paint.Clear();
        }
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
        range += 50;
        earth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 60, 0, range, 5);
        obj.ShowHighLight();
    }
    /**
     * 定位(飞行)到POI
     */

    var flyToPOI =function(obj,name) {
        /*if(myicon){
            earth.DetachObject(myicon);
        }*/
        clearBolloan();
        var lon = obj.Longitude;// * 180 / Math.PI;
        var lat = obj.Latitude;// * 180 / Math.PI;
        var alt = obj.Altitude;
        var path = earth.RootPath+"\\icon\\"+"flag.png";
        var path1 = earth.RootPath+"\\icon\\"+"flag1.png";
        var dataProcess=document.getElementById("dataProcess");//将图片格式转换成规定格式并保存到model下
        dataProcess.Load();
        dataProcess.DataConvert.Convert_File(path,path1)  ;
        var guid = earth.Factory.CreateGuid();
        myicon = earth.Factory.CreateElementIcon(guid,name);
        myicon.Create(lon,lat,alt,path1 ,path1 , name );
        myicon.Visibility = true;
        earth.AttachObject(myicon);
        earth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 60, 0, 1000, 5);
        blinkElementObject(myicon,0,0);
    }
    /**
     * 闪烁双击定位的对象
     */
    var blinkElementObject =function( obj, counter, control_box){
        if(counter<=10){
            if (control_box == 0) {
                obj.Visibility = false;
                control_box = 1;
            } else {
                obj.Visibility = true;
                control_box = 0;
            }
            //var self = this;
            setTimeout(function(){
                counter++;
                blinkElementObject(obj, counter, control_box);
            }, 1000);
        }else{
            obj.Visibility = true;
        }
    }
    /**
     *功能：显示搜索对象的详细信息
     *参数：obj-要定位查看的搜索对象；key-搜索对象的关键字
     *调用：flyToSearchObject(index)调用
     */
    var htmlBalloons =null;
    /*var showModelDetailMsg=function(obj, key) {
        if(obj!=null){
            if(htmlBalloons){
                htmlBalloons.DestroyObject();//删除气泡对象
                htmlBalloons=null;
            }
            if(htmlBalloons){
                htmlBalloons.DestroyObject();
                htmlBalloons=null;
            }
            //earth.HtmlBalloon.Hide();
            var rect = obj.GetLonLatRect();//获得经纬范围
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;
            var htmlStr = '<table style="font-size:14px;color:#fffffe;text-align:center;">';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>ID:</td>';
            htmlStr = htmlStr + '<td>' + obj.Guid + '</td>';  
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>Name:</td>';
            htmlStr = htmlStr + '<td>' + obj.Name + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>key:</td>';
            htmlStr = htmlStr + '<td>'+ key +'</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>North:</td>';
            htmlStr = htmlStr + '<td>' + north + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>South:</td>';
            htmlStr = htmlStr + '<td>' + south + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>East:</td>';
            htmlStr = htmlStr + '<td>' + east + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>West:</td>';
            htmlStr = htmlStr + '<td>' + west + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>MaxHeight:</td>';
            htmlStr = htmlStr + '<td>' + top + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>MinHeight:</td>';
            htmlStr = htmlStr + '<td>' + bottom + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '</table>';
            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;
            //earth.HtmlBalloon.Transparence = true;
            var guid = earth.Factory.CreateGuid();
            htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
            htmlBalloons.SetSphericalLocation(centerX, centerY, centerZ);
            htmlBalloons.SetRectSize(290, 210);
            var color = parseInt("0xcc4d514a");//0xccc0c0c0
            htmlBalloons.SetTailColor(color);
            htmlBalloons.SetIsAddCloseButton(true);
            htmlBalloons.SetIsAddMargin(true);
            htmlBalloons.SetIsAddBackgroundImage(true);
            htmlBalloons.SetIsTransparence(true);
            htmlBalloons.SetBackgroundAlpha(0xcc);
            htmlBalloons.ShowHtml(htmlStr);
            earth.Event.OnHtmlBalloonFinished = function(){
                if(htmlBalloons!=null){
                    htmlBalloons.DestroyObject();
                    htmlBalloons=null;
                }
                earth.Event.OnHtmlBalloonFinished = function(){};
            };
            //earth.HtmlBalloon.ShowHtml(htmlStr, centerX, centerY, centerZ, 410, 300, true);
        }
    };*/
    var showModelDetailMsg=function(obj, element,question) {
        if(obj!=null){
            if(htmlBalloons){
                htmlBalloons.DestroyObject();//删除气泡对象
                htmlBalloons=null;
            }
            /*if(htmlBalloons){
                htmlBalloons.DestroyObject();
                htmlBalloons=null;
            }*/
            //earth.HtmlBalloon.Hide();
            var rect = obj.GetLonLatRect();//获得经纬范围
            var north = rect.North;
            var south = rect.South; 
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;
            var htmlStr = '<table style="font-size:14px;color:#fffffe;text-align:center;">';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>ID:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("devi_Num")[0].text + '</td>';  
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>Name:</td>';
            htmlStr = htmlStr + '<td>' + obj.name + '</td>';
            htmlStr = htmlStr + '</tr>';
            if(question!=""){
            	htmlStr = htmlStr + '<tr>';
                htmlStr = htmlStr + '<td>描述:</td>';
                htmlStr = htmlStr + '<td>'+ question +'</td>';
                htmlStr = htmlStr + '</tr>';
            }
            
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>灯杆类型:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("pole_Type_ID")[0].text + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>光源数量:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("bulb_Num")[0].text + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>主管单位:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("mana_Depa_ID")[0].text + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>权属单位:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("owne_Depa")[0].text + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>养护单位:</td>';
            htmlStr = htmlStr + '<td>' + element.getElementsByTagName("main_Depa")[0].text + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '</table>';
            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;
            //earth.HtmlBalloon.Transparence = true;
            var guid = earth.Factory.CreateGuid();
            htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
            htmlBalloons.SetSphericalLocation(centerX, centerY, centerZ);
            htmlBalloons.SetRectSize(200, 210);
            var color = parseInt("0xcc4d514a");//0xccc0c0c0
            htmlBalloons.SetTailColor(color);
            htmlBalloons.SetIsAddCloseButton(true);
            htmlBalloons.SetIsAddMargin(true);
            htmlBalloons.SetIsAddBackgroundImage(true);
            htmlBalloons.SetIsTransparence(true);
            htmlBalloons.SetBackgroundAlpha(0xcc);
            htmlBalloons.ShowHtml(htmlStr);
            earth.Event.OnHtmlBalloonFinished = function(){
                if(htmlBalloons!=null){
                    htmlBalloons.DestroyObject();
                    htmlBalloons=null;
                }
                earth.Event.OnHtmlBalloonFinished = function(){};
            };
        }
    };
    var clearBolloan = function (){
        if(htmlBalloons){
            htmlBalloons.DestroyObject();
            htmlBalloons = null;
        }
        if(poihtmlBallon){
            poihtmlBallon.DestroyObject();
            poihtmlBallon = null;
        }
        if(myicon){
            earth.DetachObject(myicon);
            myicon = null;
        }
        earth.attachEvent("onPoiClicked",parent.ifEarth.onPoiClicked);
    }
    var goToFirstPage=function() {
        showResult(1);
    }

    var goToPrePage=function() {
        var currPage = parseInt(document.getElementById("pageNum").innerHTML);
        if(currPage==1){
            return;
        }
        var prePage = currPage - 1;
        showResult(prePage);
    }

    var goToNextPage=function() {
        var currPage = parseInt(document.getElementById("pageNum").innerHTML);
        var totalPageNum = Math.ceil(searchResult.RecordCount / pageRecordCount);
        if(currPage==totalPageNum){
            return;
        }
        var nextPage = currPage + 1;
        showResult(nextPage);
    }

    var goToLastPage=function() {
        var lastPage = parseInt(document.getElementById("totalPageNum").innerHTML);
        showResult(lastPage);
    }

    /**
     * 功能：Tips信息显示
     * 参数：tipChecked-是否显示Tip信息（true表示显示；false表示不显示）
     * 调用：Tips复选框的onclick事件触发调用
     */
    var searchTips=function(t) {
        if (t) {
            earth.Environment.EnableHoverMessage = true;
            earth.ToolTips.Enable = true;
            earth.Event.onMouseHover = showTipsMessage;
        } else {
            earth.Environment.EnableHoverMessage = false;
            earth.ToolTips.Enable = false;
            earth.ToolTips.Hide();
        }
    }

    /**
     * Tips信息显示回调函数
     */
    var showTipsMessage=function(x, y) {
        earth.ToolTips.Hide();
        var geoPoint = earth.GlobeObserver.Pick(x, y);
        var geoPoints = generateGeoPoints(geoPoint);

        var searchGuid = selectLayer;
        var tmpResult;
        var records;

        //如果一次没有查询到 则继续查询 超过五次不再查询
        for (var i = 4; i >= 0; i--) {
            tmpResult = localSearch(searchGuid, "", geoPoints);
            var tmpResultXml = tmpResult.GotoPage(0);

            var json = $.xml2json(tmpResultXml);
            records = json.SearchResult.ModelResult.ModelData;
            if (records === undefined) {
                if ( i === 0 ){
                    alert("查询失败!");
                    return;
                }
                continue;
            } else {
                break;
            }
        };
        //alert(records);

        var attributes = [];
        $.each(records, function (i, record){
            //属性数据
            for(var key in record){
                if(key && record[key]){
                    //alert(key + " " + record[key]);
                    attributes.push({key:key, value:record[key]});
                }
            }
        });
        var htmlStr = '<table style="font-size:14px;">';
        for (var i = attributes.length - 1; i >= 0; i--) {
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td>' + attributes[i]["key"] + '</td>';
            htmlStr = htmlStr + '<td>'+ attributes[i]["value"] +'</td>';
            htmlStr = htmlStr + '</tr>';
        };
        htmlStr = htmlStr + '</table>';

        var centerX = (east + west) / 2;
        var centerY = (north + south) / 2;
        var centerZ = (top + bottom) / 2;
        //earth.HtmlBalloon.Transparence = true;
        usearth.HtmlBalloon.ShowHtml(htmlStr, geoPoint.x, geoPoint.y, geoPoint.z, 410, 300, true);
        earth.Event.onMouseHover = function(){};
    }

    /**
     * 回车键的操作
     */
    window.document.onkeydown = function (event) {
        event = window.event || event;
        if (event.keyCode == 13) {
            keyWordSearch();
        }
    };

    /**
     * 屏蔽右键菜单
     */
    document.oncontextmenu = function () {
        event.returnValue = false;
    };
    $(window).unload(function () {
        if(earth.ShapeCreator!=null){
            earth.ShapeCreator.Clear();
        }
    });
    /**
     * 返回xmlDoc对象
     * @param xmlStr
     * @returns {___xmlDoc0}
     */
    function loadXMLStr(xmlStr){
        var xmlDoc;

        try {
            if(window.ActiveXObject) {
                var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM','MSXML2.DOMDocument'];
                for (var i=0; i<activeX.length; i++){
                    xmlDoc = new ActiveXObject(activeX[i]);
                    xmlDoc.async = false;
                    break;
                }
                if (/http/ig.test(xmlStr.substring(0,4))){
                    xmlDoc.load(xmlStr);
                }else{
                    xmlDoc.loadXML(xmlStr);
                }
            } else if (document.implementation && document.implementation.createDocument) {
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.loadXml(xmlStr);
            } else {
                xmlDoc = null;
            }
        }catch (exception){
            xmlDoc = null;
        }

        return xmlDoc;
    }

    /**
     * 设置窗体的大小
     */
    function setWinSize() {
        var tabSearchObj = document.getElementById("tab_search");
        //var tabSearchHeight = parent.g_showWinHeight - 233;
        tabSearchObj.style.height = "100%";
    }

    search.loadSearch=loadSearch;
    search.keyWordSearch=keyWordSearch;
    search.pointSearch=pointSearch;
    search.polygonSearch=polygonSearch;
    search.circleSearch=circleSearch;
    search.rectangleSearch=rectangleSearch;
    search.searchTips=searchTips;
    search.emptyResultHtml=emptyResultHtml;
    search.showResult=showResult;
    search.goToSearchObject=goToSearchObject;
    search.goToFirstPage=goToFirstPage;
    search.goToPrePage=goToPrePage;
    search.goToNextPage=goToNextPage;
    search.goToLastPage=goToLastPage;
    search.initLayerTree=initLayerTree;
    search.layerTd = layerTd;
    search.clearBolloan=clearBolloan;
    search.showModelDetailMsg=showModelDetailMsg;
    search.htmlBalloons=htmlBalloons;

    return search;

};