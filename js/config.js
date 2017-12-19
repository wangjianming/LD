/**
 * User: wyh
 * Date: 12-11-21
 * Time: 下午11:03
 * Desc:
 */
var STAMP_config = {};
STAMP_config.server = {
    ip : "http://192.168.2.180",  // 基础数据服务器地址
    screen : 0                       // 基础数据配置文件索引
};
STAMP_config.spatial = [] ;   //   所有project图层的spatial文件
STAMP_config.itemurl={
		 baseurl:"http://192.168.2.118:6080/arcgis/rest/services/bjgx/MapServer/40/query?f=json",  //arcgis 二维服务路灯图层
		 supermapUrl: "http://192.168.2.128:8090/iserver/services/map-lamp/rest/maps/streetLamp"   //supermap路灯图层
};