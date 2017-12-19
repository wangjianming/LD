
/**
 * User: wyh
 * Date: 12-12-18
 * Time: 下午4:10
 * Desc:
 */
if( !STAMP ){
    var STAMP = {};
}
STAMP.LayerManager = function (earth){
    var layerManager = {};

    /**
     * 根据图层类型，获取图标路径
     * @param layerType 图层类型
     * @return 图标样式
     */
    var _getLayerIcon = function (layerType) {
        var icon = "";
        if(layerType != "Folder"){
            icon = 'image/layer/layer_'+ layerType.toLowerCase()+'.gif';
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
            "plate":"井盖",
            "room":"井室"
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
            if(childLayer.LayerType === "Project"){
                STAMP_config.spatial.push({id:childLayer.Guid,name:name});
            }
            else if(childLayer.LayerType == "MatchModel")
            {
           	    MATCHMODELMAP[childLayer.Name]= childLayer;
            }
            if(bWithIcon){
                data["icon"] = _getLayerIcon(childLayer.LayerType);
            }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer, true);
            }
            if(name!="buffer"&&name!="room"){
                layerData.push(data);
            }
        }
        return layerData;
    };
    /**
     * 定位到经纬度范围
     */
    var flyToLayer = function (layer) {
        var lonLatRect = layer.LonLatRect;
        var centerX = (lonLatRect.East + lonLatRect.West) / 2;
        var centerY = (lonLatRect.North + lonLatRect.South) / 2;
        var width = (parseFloat(lonLatRect.North) - parseFloat(lonLatRect.South)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 4);
    };
    layerManager.flyToLayer = flyToLayer;          // 定位到图层
    layerManager.getLayerData = getLayerData;      // 获取图层数据
    return layerManager;
};