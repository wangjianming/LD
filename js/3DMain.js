function unloadEarth() {
    seearth.Suicide();
}
$(function (){
    $("#earthDiv").html('<object id="seearth" classid="clsid:EA3EA17C-5724-4104-94D8-4EECBD352964" ' +
        'data="data:application/x-oleobject;base64,Xy0TLBTXH0q8GKFyFzl3vgAIAADYEwAA2BMAAA==" ' +
        'width="100%" height="100%"></object>');
        seearth.Event.OnCreateEarth = function () {
        seearth.Event.OnCreateEarth = function () {};
        parent.earth = seearth;

        seearth.Event.OnDocumentChanged = function (type, guid) {
            seearth.Event.OnDocumentChanged = function () {};
            if (type == 1) {
             	setTimeout(function(){parent.init();}, 500);
                seearth.Analysis.AnalysisServer = STAMP_config.server.ip;
            }
        };
        seearth.Environment.SetLogoWindowVisibility(false);//设置logo
        seearth.Environment.SetProviderWindowVisibility(false);//设置logo
        seearth.Load(STAMP_config.server.ip, STAMP_config.server.screen);
    };
});