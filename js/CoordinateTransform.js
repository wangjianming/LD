var SYSTEMPARAMS = null; //系统参数对象

var CoordinateTransform = {
    sysDatum: null, //系统内部的坐标转换对象

    /**
     * 功能：获取系统内部的坐标转换对象
     */
    getSystemDatum: function () {
        if (this.sysDatum == null) {
            this.sysDatum = this.createDatum();
        }
        return this.sysDatum;
    },

    /**
     * 功能：获取坐标转换参数
     */
    getTransformParam: function (url) {
        if (url == null) {
            url = "http://" + CoordinateTransform.getRootPath() + "/config/spatial.xml";
        }
        var coordDoc = loadXMLStr(url);
        if ((coordDoc == null) || (coordDoc.xml == "")) {
            //alert("坐标转换文件加载失败");
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
    getRootPath: function () {
        var pathName = window.document.location.pathname;
        var localhost = window.location.host;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return(localhost + projectName);
    },
    /**
     * 功能：创建空间坐标转换对象
     */
    createDatum: function () {
        var projectId = parent.SYSTEMPARAMS.project;
        var projLayer = earth.LayerManager.GetLayerByGUID(projectId);
        var spatialUrl = projLayer.ProjectSetting.SpatialRefFile;
        var dataProcess = document.getElementById("dataProcess");
        dataProcess.Load();
        var spatial = dataProcess.CoordFactory.CreateSpatialRef();
        spatial.InitFromFile(spatialUrl);
        var datum = dataProcess.CoordFactory.CreateDatum();  //earth.Factory.CreateDatum();
        datum.init(spatial);
        //datum.source.init();//修改椭球体参数
        this.sysDatum = datum;
        return datum;
    }
};