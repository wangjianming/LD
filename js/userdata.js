var userdataArr=[];//element数组
var editDataArr=parent.editDataArr;
var objArr=parent.objArrs;
var earth=null;
var treePIDObject = {};
var nodeLevel = {};
var cameraArr = [];//摄像头数组

if( !STAMP ){
    var STAMP = {};
}
var filename="MyPlace";
STAMP.Userdata = function (earthObj){
    if(earthObj){
        earth = earthObj;
    } else{
        earth=parent.earth;
    }
    var userdata = {};
    /**
     * 初始化element对象
     */
    var _initDataArr=function(filenames){
        filename=filenames;
        var userdataDoc=getUserdata(filenames);
        userdataArr = getAllIconObjs(userdataDoc);
    };
    var getDefaultUserdata=function(){
        return getUserdata(filename);
    };

    /**
     * 创建EditLayer
     */
    var EditLayer = null;
    var createLayer=function(){
        EditLayer = earth.Factory.CreateEditLayer(earth.Factory.createGuid(),"my_layer",earth.Factory.CreateLonLatRect(-90,90,-180,180,0,1000),0, 1000);
        earth.AttachObject(EditLayer);
    };

    /**
     *  每次添加对象的时候不再741n1tTree 执行数据更新即可
     */
    function updateTree(data){
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var root = zTree.getNodes()[0];
        zTree.addNodes(root, {id: data.guid, pId: -1, name:data.name,  checked:true}, false);
        // TreeObj = zTree;
    }

    /**
     * [ description]
     * @return {[type]} [description]
     */
    var _createParticle = function (flag){
        var guid = earth.Factory.CreateGuid();
        var obj = {};
        obj.action="add";
        obj.earth=earth;
        //obj.type = "246";
        obj.guid = guid;

        var particleType;
        switch(flag){
            case 0:
                particleType = "fire";
                obj.name="fire";
                obj.type="fire";
                break;
            case 1:
                particleType = "mist";
                obj.name="mist";
                obj.type="mist";
                break;
            case 2:
                particleType = "fountain";
                obj.name="fountain";
                obj.type="fountain";
                break;
            case 3:
                particleType = "nozzle";
                obj.name="nozzle";
                obj.type="nozzle";
                break;
            case 4:
                particleType = "SprayNozzle";
                obj.name="SprayNozzle";
                obj.type="SprayNozzle";
                break;
            default:
                particleType = "";
                break;
        }

        earth.Event.OnCreateGeometry = function (pt, type){
            window.showModalDialog("html/userdata/getParticleName.html",obj,"dialogWidth=400px;dialogHeight=110px;status=no") ;
            var name = obj.name;
            if(obj.name==""){
                return;
            }
            if(obj.click === "false"){
                return;
            }
            var particle = earth.factory.CreateElementParticle(guid, name);
            particle.SphericalTransform.SetLocationEx(pt.Longitude,pt.Latitude,pt.Altitude);

            particle.BeginUpdate();
            particle.Type = flag;   //   火 = 0,  烟 = 1,  喷泉 = 2, 直流水枪 = 3,   喷雾水枪 = 4
            particle.EndUpdate();

            earth.AttachObject(particle);
            userdataArr.push(particle);
            // particles[guid] = particle;
            updateTree(obj);
            objArr.push(obj);
            createElement(obj, particle);
            treePIDObject[guid] = 0;
        };
        earth.ShapeCreator.CreatePoint();
    };
    /**
     * 创建图元
     * @param flag 根据flag判断创建图元类型
     * @return treetag 创建成功true 否false
     */
    var _createPrimitives = function (flag,userdataTree){
        var flagArr=[];
        if(flag.indexOf("-")>=0){
            flagArr=flag.split("-");
            flag=flagArr[0];
        }
        var userdataObj={};
        userdataObj.action="add";
        userdataObj.earth=earth;
        earth.ShapeCreator.Clear();
        if (flag == "createline"){
            earth.Event.OnCreateGeometry = function (pval, type) {
                //earth.ShapeCreator.Clear();
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.type = 220;
                userdataObj.name = "line";
                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=450px;status=no");
                if ( userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var lineGuid = earth.Factory.CreateGUID();
                userdataObj.guid=lineGuid;
                elementLine = earth.Factory.CreateElementLine(lineGuid,  userdataObj.name);
                elementLine.BeginUpdate();
                elementLine.SetPointArray(pval);
                elementLine.Visibility = true;
                elementLine.LineStyle.LineColor =parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase());
                elementLine.LineStyle.LineWidth = userdataObj.linewidth;
                elementLine.AltitudeType =userdataObj.shadow;
                elementLine.Visibility = true;
                elementLine.IsAddArrow =userdataObj.arrow;
                //新增属性
                elementLine.Selectable = userdataObj.selectable;
                elementLine.Editable = userdataObj.editable;
                elementLine.DrawOrder = userdataObj.drawOrder;

                elementLine.EndUpdate();
                earth.AttachObject(elementLine);

                //保存到本地xml
                userdataObj.lineLength = elementLine.length;
                //alert(userdataObj.lineLength);
                createElement(userdataObj,elementLine);
                userdataArr.push(elementLine);
                updateTree(userdataObj);
                treePIDObject[lineGuid] = 0;
                earth.ShapeCreator.Clear();

            };
            earth.ShapeCreator.CreatePolyline(2, 16711680);
        }else if(flag == "icon"){
            earth.Event.OnCreateGeometry =function (pVal){
                userdataObj.path = earth.Environment.RootPath + "userres" + "\\";
                userdataObj.type = 209;
                userdataObj.name = "icon";
                var rValue = showModalDialog("html/userdata/iconData.html", userdataObj,"dialogWidth=400px;dialogHeight=500px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                userdataObj.guid = guid;
                //var position = earth.GlobeObserver.Pick(pVal.X, pVal.Y);
                userdataObj.longitude = pVal.Longitude;
                userdataObj.latitude = pVal.Latitude;
                userdataObj.altitude = pVal.Altitude;

                var strHightlightIcon = userdataObj.iconSelectedFileName;
                var iconName = userdataObj.name;
                var myicon = earth.Factory.CreateElementIcon(userdataObj.guid,userdataObj.name);
                myicon.Create( userdataObj.longitude,userdataObj.latitude,userdataObj.altitude,userdataObj.iconNormalFileName, userdataObj.iconSelectedFileName, userdataObj.name );
                myicon.Visibility = true;

                //新增属性
                myicon.textFormat = parseInt("0x100");
                myicon.textColor = parseInt("0x" + userdataObj.textColor.toString().substring(1).toLowerCase());
                myicon.textHorizontalScale = userdataObj.textHorizontalScale;
                myicon.textVerticalScale  = userdataObj.textVerticalScale;
                myicon.showHandle = userdataObj.showHandle;
                myicon.handleHeight = userdataObj.handleHeight;
                myicon.handleColor = parseInt("0x" + userdataObj.handleColor.toString().substring(1).toLowerCase());
                myicon.minVisibleRange = userdataObj.minVisibleRange;
                myicon.maxVisibleRange = userdataObj.maxVisibleRange;
                myicon.selectable = userdataObj.selectable;
                myicon.editable = userdataObj.editable;

                // alert(myicon.textFormat + " " + myicon.textColor + " " + myicon.textHorizontalScale + " " +
                //     myicon.textVerticalScale + " " + myicon.showHandle + " " + myicon.handleHeight + " " +
                //     myicon.handleColor + " " + myicon.minVisibleRange + " " + myicon.maxVisibleRange + " " +
                //     myicon.selectable + " " + myicon.editable);

                earth.AttachObject(myicon);
                userdataArr.push(myicon);
                createElement(userdataObj,myicon);
                // initTree(userdataTree);
                updateTree(userdataObj);
                treePIDObject[ userdataObj.guid ] = 0;

            }
            earth.ShapeCreator.CreatePoint();
        }else if(flag == "createpolygon"){
            earth.Event.OnCreateGeometry = function (pval, type) {

                userdataObj.type = 211;
                userdataObj.name = "polygon";
                userdataObj.path = earth.Environment.RootPath;
                //alert(pval.perimeter);
                //alert(pval.area);
                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=500px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }

                var polygonGuid=earth.Factory.CreateGUID();
                userdataObj.guid=polygonGuid;

                var elementPolygon = earth.Factory.CreateElementPolygon(polygonGuid, userdataObj.name);
                elementPolygon.BeginUpdate();
                elementPolygon.SetExteriorRing(pval);
                elementPolygon.LineStyle.LineWidth = userdataObj.linewidth;
                elementPolygon.LineStyle.LineColor = parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase() );
                //alert(userdataObj.shadow);
                //alert(elementPolygon.area);
                elementPolygon.AltitudeType = userdataObj.shadow;
                //alert(elementPolygon.FillStyle.FillColor.toString(16));
                elementPolygon.FillStyle.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );
                elementPolygon.DrawOrder = userdataObj.drawOrder;
                elementPolygon.Selectable = userdataObj.selectable;
                elementPolygon.Editable = userdataObj.editable;

                elementPolygon.EndUpdate();
                earth.AttachObject(elementPolygon);

                userdataObj.perimeter = elementPolygon.perimeter;
                userdataObj.area = elementPolygon.area;

                createElement(userdataObj,elementPolygon);
                userdataArr.push(elementPolygon);
                updateTree(userdataObj);
                treePIDObject[polygonGuid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreatePolygon();
        }else if(flag =="createcurve"){//曲线
            earth.Event.OnCreateGeometry = function(pval,type){

                userdataObj.path = earth.Environment.RootPath;
                userdataObj.type = 241;
                userdataObj.name = "curve";
                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=450px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                userdataObj.guid=guid;

                var curve = earth.Factory.CreateElementCurve(guid, userdataObj.name);
                curve.BeginUpdate();
                curve.SetControlPointArray(pval);
                var linestyle = curve.LineStyle;
                linestyle.LineWidth =userdataObj.linewidth;
                linestyle.LineColor =parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase());//0xffffff00;
                curve.AltitudeType = userdataObj.shadow;
                curve.IsAddArrow = userdataObj.arrow;
                //新增属性
                curve.Selectable = userdataObj.selectable;
                curve.Editable = userdataObj.editable;
                curve.DrawOrder = userdataObj.drawOrder;

                curve.EndUpdate();
                userdataArr.push(curve);
                earth.AttachObject(curve);
                createElement(userdataObj,curve);
                //initTree(userdataTree);
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            }
            earth.ShapeCreator.CreateCurve();
        }else if(flag=="createcircle"){//圆
            earth.Event.OnCreateGeometry = function(pval, type){
                userdataObj.type = 239;
                userdataObj.name = "circle";
                userdataObj.path = earth.Environment.RootPath;
                //这两个属性是没有的......
                // userdataObj.perimeter = pval.perimeter;
                // userdataObj.area = pval.area;

                //半径
                userdataObj.radius = pval.Radius;
                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=530px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                userdataObj.guid = guid;
                var circle = earth.Factory.CreateElementCircle(guid, userdataObj.name);
                var tran = circle.SphericalTransform;
                tran.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                circle.BeginUpdate();

                userdataObj.perimeter = circle.perimeter;
                userdataObj.area = circle.area;

                //新增属性
                circle.Selectable = userdataObj.selectable;
                circle.Editable = userdataObj.editable;
                //circle.DrawOrder = userdataObj.drawOrder;
                circle.AltitudeType = userdataObj.shadow;
                circle.Radius = userdataObj.radius;
                circle.FillStyle.FillColor = parseInt("0x" + userdataObj.fillcolor.toString().substring(1).toLowerCase() );// 0xccff00ff;
                circle.LineStyle.LineWidth = userdataObj.linewidth;
                circle.LineStyle.LineColor =parseInt("0x" + userdataObj.linecolor.toString().substring(1).toLowerCase() );// 0xccff00ff;
                circle.EndUpdate();

                //alert(circle.perimeter);
                //这里有问题 属性取不到值
                userdataObj.perimeter = circle.perimeter;
                userdataObj.area = circle.area;

                userdataArr.push(circle);
                earth.AttachObject(circle);
                createElement(userdataObj,circle);
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();

            }
            earth.ShapeCreator.CreateCircle();

        }else if(flag ==="createellipse"){//椭圆
            earth.Event.OnCreateGeometry = function(pval,type){
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.type = 243;
                userdataObj.name = "ellipse";
                //alert(pval.longRadius + " " + pval.shortRadius + " " + pval.perimeter + " " + pval.area);

                userdataObj.longRadius = pval.longRadius;
                userdataObj.shortRadius = pval.shortRadius;

                // userdataObj.perimeterValue = pval.perimeter;
                // userdataObj.areaValue = pval.area;

                //alert(pval.Perimeter);
                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=570px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                userdataObj.guid=guid;

                var ellipse = earth.Factory.CreateElementEllipse(guid, userdataObj.name);
                var tran = ellipse.SphericalTransform;
                tran.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                ellipse.BeginUpdate();
                ellipse.AltitudeType = userdataObj.shadow;
                //新增属性
                ellipse.Selectable = userdataObj.selectable;
                ellipse.Editable = userdataObj.editable;
                //ellipse.DrawOrder = userdataObj.drawOrder;

                userdataObj.perimeter = ellipse.perimeter;
                userdataObj.area = ellipse.area;

                ellipse.LongRadius = userdataObj.longRadius;
                ellipse.ShortRadius = userdataObj.shortRadius;
                var fillstyle = ellipse.FillStyle;
                fillstyle.FillColor =  parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//0xcc00ff00;
                var linestyle = ellipse.LineStyle;
                linestyle.LineWidth =userdataObj.linewidth;
                linestyle.LineColor= parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase() );//0xcc00ff00;
                ellipse.EndUpdate();
                userdataArr.push(ellipse);
                earth.AttachObject(ellipse);
                createElement(userdataObj,ellipse);
                // initTree(userdataTree);
                //earth.ShapeCreator.CreateEllipse();
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            }
            earth.ShapeCreator.CreateEllipse();

        }else if(flag == "createsector"){//扇形
            earth.Event.OnCreateGeometry = function(pval,type){
                userdataObj.type = 240;
                userdataObj.name = "sector";
                userdataObj.path = earth.Environment.RootPath;

                userdataObj.angle = pval.angle;
                userdataObj.radius = pval.radius;
                userdataObj.ArcCenter = pval.ArcCenter;
                // userdataObj.perimeterValue = pval.perimeter;
                // userdataObj.areaValue = pval.area;

                var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=560px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                userdataObj.guid = guid;
                var sector = earth.Factory.CreateElementSector(guid,  userdataObj.name);
                var tran = sector.SphericalTransform;
                tran.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                sector.BeginUpdate();
                sector.ArcCenter = pval.ArcCenter;
                sector.radius = userdataObj.radius;
                //新增属性
                sector.Selectable = userdataObj.selectable;
                sector.Editable = userdataObj.editable;
                sector.AltitudeType = userdataObj.shadow;
                sector.Angle = Number(userdataObj.angle);

                // userdataObj.perimeter = sector.perimeter;
                // userdataObj.area = sector.area;

                //bug 属性未添加 暂时注释掉
                //sector.DrawOrder = userdataObj.drawOrder;
                //bug
                //sector.radius = 10;

                var linestyle = sector.LineStyle;
                linestyle.LineWidth =userdataObj.linewidth;
                linestyle.LineColor =parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase() );//4294963200;
                var fillstyle = sector.FillStyle;
                fillstyle.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//4294963200;

                sector.EndUpdate();
                userdataArr.push(sector);
                earth.AttachObject(sector);
                createElement(userdataObj,sector);
                // initTree(userdataTree);
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            }
            earth.ShapeCreator.CreateSector(30);

        }else if(flag=="createTexturePolygon"){//矢量面贴图
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.type = 245;
                userdataObj.name = "TexturePolygon";
                var guid=earth.Factory.CreateGuid();
                userdataObj.guid=guid;
                var rValue = showModalDialog("html/userdata/texturePolygon.html", userdataObj,"dialogWidth=400px;dialogHeight=540px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var polygon = earth.Factory.CreateElementTexturePolygon(userdataObj.guid, userdataObj.name);
                polygon.BeginUpdate();
                polygon.SetExteriorRing(pval);

                polygon.FillStyle.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );
                polygon.TextureImagePath = userdataObj.picture;//"E:\\Users\\Administrator\\Desktop\\trunk\\trunk\\css\\zTree\\img\\diy\\1.png";
                polygon.TextureMode = parseInt(userdataObj.textture);  //  0 无纹理        1 平铺纹理   2 拉伸（必须四个顶点）
                polygon.TextureTiltX = parseInt(userdataObj.expandX); //  横向平铺重复次shu
                polygon.TextureTiltY = parseInt(userdataObj.expandY); //  纵向平铺重复次shu

                polygon.LineStyle.LineColor = parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase() );//userdataObj.linecolor;
                polygon.LineStyle.LineWidth = parseInt(userdataObj.linewidth);
                polygon.AltitudeType = parseInt(userdataObj.shadow); // 0绝对 1贴地
                //alert(polygon.area);
                //新增属性
                polygon.Selectable = userdataObj.selectable;
                polygon.Editable = userdataObj.editable;
                //polygon.DrawOrder = userdataObj.drawOrder;

                polygon.EndUpdate();
                //userdataTree
                earth.AttachObject(polygon);
                createElement(userdataObj,polygon);
                // initTree(userdataTree);
                updateTree(userdataObj);
                userdataArr.push(polygon);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            }
            earth.ShapeCreator.CreatePolygon();
        }else if(flag=="createrectangle"){//矩形贴图
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.type = 245;
                userdataObj.name = "rectangle";
                var guid=earth.Factory.CreateGuid();
                userdataObj.guid=guid;
                var rValue = showModalDialog("html/userdata/texturePolygon.html", userdataObj,"dialogWidth=400px;dialogHeight=540px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var rectangle = earth.Factory.CreateElementTexturePolygon(guid, userdataObj.name);
                rectangle.BeginUpdate();
                rectangle.SetExteriorRing(pval);
                rectangle.name = userdataObj.name;
                rectangle.FillStyle.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase());
                rectangle.TextureImagePath = userdataObj.picture;//"E:\\Users\\Administrator\\Desktop\\trunk\\trunk\\css\\zTree\\img\\diy\\1.png";
                rectangle.TextureMode = parseInt( userdataObj.textture);  //  0 无纹理        1 平铺纹理   2 拉伸（必须四个顶点）
                rectangle.TextureTiltX =  parseInt(userdataObj.expandX); //  横向平铺重复次shu
                rectangle.TextureTiltY = parseInt( userdataObj.expandY); //  纵向平铺重复次shu
                //alert(rectangle.area);
                rectangle.LineStyle.LineColor = parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase() );//userdataObj.linecolor;
                rectangle.LineStyle.LineWidth =  parseInt(userdataObj.linewidth);
                //alert(userdataObj.shadow);
                rectangle.AltitudeType =  parseInt(userdataObj.shadow); // 0绝对 1贴地

                //新增属性
                rectangle.Selectable = userdataObj.selectable;
                rectangle.Editable = userdataObj.editable;

                rectangle.EndUpdate();

                earth.AttachObject(rectangle);
                createElement(userdataObj,rectangle);
                updateTree(userdataObj);
                userdataArr.push(rectangle);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            }
            earth.ShapeCreator.CreateRectangle();
        } else if(flag==="parallelLines"){     //平行线
            earth.ToolManager.ElementEditTool.ParallelGeometry(0);
            earth.Event.OnGeometryParalleled = function(Coll,offset){
                //var poly = Coll.Items(0);
                if(Coll){
                    if(Coll.Rtti===241){
                        userdataObj.type = 241;
                    }
                    else{
                        userdataObj.type = 220;
                    }
                    userdataObj.name = Coll.Name;
                    userdataObj.drawOrder = 0;
                    userdataObj.action = "parallel";
                    //属性先从Coll中获取到 增加到userdata中
                    // userdataObj.linecolor = Coll.LineStyle.LineColor;
                    userdataObj.linecolor = "#" + parseInt(50).toString(16) + "0000ff";
                    userdataObj.linewidth =  Coll.LineStyle.LineWidth;
                    userdataObj.selectable = Coll.AltitudeType;
                    userdataObj.selectable = Coll.Selectable;
                    userdataObj.editable = Coll.Editable;
                    userdataObj.drawOrder = Coll.DrawOrder;
                    userdataObj.desc = "";
                    userdataObj.shadow = 1;
                    //var rValue = showModalDialog("html/userdata/parallel.html", userdataObj,"dialogWidth=100px;dialogHeight=250px;status=no");
                    var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=480px;status=no");
                    if (userdataObj.click==="false"){
                        earth.ShapeCreator.Clear();
                        return;
                    }
                    var guid = earth.Factory.CreateGuid();
                    userdataObj.guid=guid;
                    userdataObj.lineLength = Coll.Length;
                    var outPoly;
                    var elementLine;
                    if(userdataObj.type === 220){
                        outPoly= earth.GeometryAlgorithm.CreateParallelLine(Coll.GetPointArray(), offset, 1);
                        elementLine = earth.Factory.CreateElementLine(guid, userdataObj.name);
                        elementLine.BeginUpdate();
                        elementLine.SetPointArray(outPoly);
                    }
                    else{
                        outPoly= earth.GeometryAlgorithm.CreateParallelLine(Coll.GetControlPointArray(), offset, 1);
                        elementLine = earth.Factory.CreateElementCurve(guid, userdataObj.name);
                        elementLine.BeginUpdate();
                        elementLine.SetControlPointArray(outPoly);
                    }
                    //todo:修改默认颜色为#0000ff
                    elementLine.LineStyle.LineColor =  parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase());
                    //alert(Coll.LineStyle.LineWidth);
                    elementLine.LineStyle.LineWidth =  userdataObj.linewidth;
                    elementLine.AltitudeType = userdataObj.shadow;
                    elementLine.IsAddArrow = Coll.IsAddArrow;
                    elementLine.Visibility = true;
                    //userdataObj.shadow = elementLine.AltitudeType;
                    //新增属性
                    elementLine.Selectable = userdataObj.selectable;
                    elementLine.Editable = userdataObj.editable;
                    elementLine.DrawOrder = userdataObj.drawOrder;

                    elementLine.EndUpdate();
                    userdataObj.linecolor="#"+elementLine.LineStyle.LineColor.toString(16);
                    userdataObj.arrow= elementLine.IsAddArrow;
                    //userdataObj.fillcolor= "#"+elementLine.LineStyle.LineColor.toString(16);
                    earth.AttachObject(elementLine);
                    createElement(userdataObj,elementLine);
                    updateTree(userdataObj);
                    userdataArr.push(elementLine);
                    treePIDObject[guid] = 0;

                    //结束编辑状态
                    earth.ToolManager.SphericalObjectEditTool.Browse();
                }
            }
        }else if(flag==="parallelSurface"){    //平行面
            earth.ToolManager.ElementEditTool.ParallelGeometry(1);
            earth.Event.OnGeometryParalleled=function(Coll,offset){
                //var poly = Coll.Items(0);
                if(Coll){
                    if(Coll.Rtti===239){
                        userdataObj.type = 239;     //圆
                        userdataObj.radius = Coll.Radius-offset;
                    }
                    else if(Coll.Rtti===243){
                        userdataObj.type = 243;     //椭圆
                        userdataObj.longRadius = Coll.LongRadius-offset;
                        userdataObj.shortRadius = Coll.ShortRadius-offset;
                    }
                    else{
                        userdataObj.type = 211;
                    }
                    userdataObj.name = Coll.Name;
                    userdataObj.drawOrder = 0;
                    userdataObj.action = "parallel";
                    //属性先从Coll中获取到 增加到userdata中
                    userdataObj.shadow = Coll.AltitudeType;
                    userdataObj.drawOrder = Coll.DrawOrder;
                    //修改为自定义颜色
                    //userdataObj.linecolor = parseInt(0xcc0000ff);
                    userdataObj.linecolor = "#cc0000ff";
                    //userdataObj.fillcolor = parseInt("0x" + parseInt(50).toString(16) + "0000ff");
                    userdataObj.fillcolor = "#" + parseInt(50).toString(16) + "0000ff";
                    userdataObj.linewidth = Coll.LineStyle.LineWidth;
                    //周长,面积
                    userdataObj.perimeter = Coll.perimeter;
                    userdataObj.area = Coll.area;

                    userdataObj.selectable = true;
                    userdataObj.editable = true;
                    userdataObj.desc = "";

                    var rValue = showModalDialog("html/userdata/2DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=550px;status=no");
                    if (userdataObj.click==="false"){
                        earth.ShapeCreator.Clear();
                        return;
                    }
                    var outPoly;
                    var guid = earth.Factory.CreateGuid();
                    userdataObj.guid=guid;
                    var polygon;
                    if(Coll.Rtti===239){
                        //outPoly = earth.GeometryAlgorithm.CreateParallelPolygon(Coll.SphericalTransform.GetLocation(), offset, 1);
                        polygon = earth.Factory.CreateElementCircle(guid, userdataObj.name); //圆
                        polygon.SphericalTransform.SetLocationEx(Coll.SphericalTransform.GetLocation().X, Coll.SphericalTransform.GetLocation().Y, Coll.SphericalTransform.GetLocation().Z);
                        polygon.BeginUpdate();
                        polygon.Radius = userdataObj.radius;
                    }
                    else if(Coll.Rtti===243){
                        //outPoly = earth.GeometryAlgorithm.CreateParallelPolygon(Coll.SphericalTransform.GetLocation(), offset, 1);
                        polygon = earth.Factory.CreateElementEllipse(guid, userdataObj.name);//椭圆
                        polygon.SphericalTransform.SetLocationEx(Coll.SphericalTransform.GetLocation().X, Coll.SphericalTransform.GetLocation().Y, Coll.SphericalTransform.GetLocation().Z);
                        polygon.BeginUpdate();
                        polygon.LongRadius = userdataObj.longRadius;
                        polygon.ShortRadius = userdataObj.shortRadius;
                    }
                    else{
                        outPoly = earth.GeometryAlgorithm.CreateParallelPolygon(Coll.GetExteriorRing(), offset, 1);
                        polygon = earth.Factory.CreateElementPolygon(guid, userdataObj.name);
                        polygon.BeginUpdate();
                        polygon.SetExteriorRing(outPoly);
                        polygon.DrawOrder = userdataObj.drawOrder;
                    }
                    polygon.LineStyle.LineWidth = userdataObj.linewidth;
                    polygon.LineStyle.LineColor = parseInt("0x"+userdataObj.linecolor.toString().substring(1).toLowerCase());
                    polygon.FillStyle.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase());
                    //polygon.DrawOrder = Coll.DrawOrder;
                    polygon.AltitudeType = 1;
                    polygon.EndUpdate();

                    userdataObj.linecolor="#"+polygon.LineStyle.LineColor.toString(16);
                    userdataObj.fillcolor="#"+polygon.FillStyle.FillColor.toString(16);

                    userdataObj.perimeter = Coll.perimeter;
                    userdataObj.area = Coll.area;

                    earth.AttachObject(polygon);
                    createElement(userdataObj,polygon);
                    updateTree(userdataObj);
                    userdataArr.push(polygon);
                    treePIDObject[guid] = 0;

                    //结束编辑状态
                    earth.ToolManager.SphericalObjectEditTool.Browse();
                }
                else{
                    alert("您选择的对象不可画平行面！");
                }
            }
        }else if(flag==="surfaceTosurface"){   //面面求并, 面面求差, 面面求交
            userdataObj.type = 211;
            userdataObj.name = "polygon";
            earth.ToolManager.SphericalObjectEditTool.Select();
            var dataArr=[];
            earth.Event.OnSelectChanged=function(x){
                var selectSet = earth.SelectSet;
                //alert(selectSet.GetCount());
                for(var i=0; i<selectSet.GetCount(); i++){
                    var element = selectSet.GetObject(i);
                    if(element.Rtti==211){
                        dataArr.push(element.GetPolygon ()) ;
                    } else{
                        alert("请选择面");
                        earth.ToolManager.SphericalObjectEditTool.Browse();
                    }
                }
                if(dataArr.length>=2){
                    earth.Event.OnSelectChanged=function(){} ;
                    var relationship= earth.PolygonAlgorithm.PolysRelationship(dataArr[0],dataArr[1]);
                    if(relationship!=3&&relationship!=1){
                        alert("请选择两个相交的面");
                        return;
                    }
                    var a=earth.PolygonAlgorithm.PolysBoolOperation(dataArr[0],dataArr[1],flagArr[1]);
                    //alert(a.Count);
                    for(var m=0;m< a.Count;m++){
                        var guid=earth.Factory.createGuid();
                        userdataObj.name="polygon2";
                        userdataObj.guid=guid;
                        var polygon = earth.Factory.CreateElementPolygon(guid, "polygon2");

                        polygon.BeginUpdate();
                        polygon.SetPolygon(a.Items(m));
                        polygon.LineStyle.LineWidth =1;
                        polygon.LineStyle.LineColor = parseInt(0xff88ffff);
                        polygon.FillStyle.FillColor = parseInt(0xff88ffff);
                        // polygon.DrawOrder = 1;
                        polygon.AltitudeType = 1;
                        polygon.Selectable = true;
                        polygon.Editable = true;
                        polygon.DrawOrder = 0;
                        polygon.EndUpdate();
                        earth.AttachObject(polygon);
                        userdataObj.linecolor="#"+polygon.LineStyle.LineColor.toString(16);
                        userdataObj.fillcolor="#"+polygon.FillStyle.FillColor.toString(16);
                        userdataObj.shadow = 1;
                        userdataObj.selectable = true;
                        userdataObj.editable = true;
                        userdataObj.drawOrder = 0;
                        createElement(userdataObj,polygon);
                        updateTree(userdataObj);
                        userdataArr.push(polygon);
                        earth.Event.OnSelectChanged=function(x){};
                    }
                    treePIDObject[guid] = 0;
                }
                //earth.Event.OnSelectChanged=function(x){};
            }

        }else if(flag == "createsphere"){
            userdataObj.name="sphere";
            userdataObj.type = 216;
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.radius = pval.Radius;
                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=390px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementSphere = earth.Factory.CreateElementSphere(guid, userdataObj.name);
                elementSphere.BeginUpdate();
                //新增属性
                elementSphere.Selectable = userdataObj.selectable;
                elementSphere.Editable = userdataObj.editable;

                elementSphere.Underground = userdataObj.objectFlagType;

                elementSphere.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementSphere.Radius = userdataObj.radius;
                var materialStyles = elementSphere.MaterialStyles;
                var count = materialStyles.Count;
                //for(var i=0; i<count; i++){
                var materialStyle = materialStyles.Items(0);
                materialStyle.DiffuseTexture=userdataObj.texturePath[2];
                //}
                ////12632256
                ////parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase()  )
                elementSphere.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase()  );//12632256;
                elementSphere.EndUpdate();
                createElement(userdataObj,elementSphere);
                earth.AttachObject(elementSphere);
                updateTree(userdataObj);
                userdataArr.push(elementSphere);
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreateSphere(16711680);
        }else if(flag == "createbox"){
            userdataObj.type = 202;
            userdataObj.name = "box";
            earth.Event.OnCreateGeometry = function (pval, type) {
                polyCount=6;
                userdataObj.path = earth.Environment.RootPath;
                //新增属性
                userdataObj.longValue = pval.Length;
                userdataObj.widthValue = pval.Width;
                userdataObj.heightValue = pval.Height;

                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=530px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementBox = earth.Factory.CreateElementBox(guid, userdataObj.name);
                elementBox.BeginUpdate();
                elementBox.Selectable = userdataObj.selectable;
                elementBox.Editable = userdataObj.editable;

                elementBox.Underground = userdataObj.objectFlagType;
                elementBox.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);

                var materialStyles = elementBox.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    if(userdataObj.texturePath.length!=0){
                        materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                    }
                }
                elementBox.Width = userdataObj.widthValue;
                elementBox.Length =  userdataObj.longValue;
                elementBox.Height = userdataObj.heightValue;

                elementBox.FillColor =parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//12632256;
                elementBox.EndUpdate();
                userdataArr.push(elementBox);
                earth.AttachObject(elementBox);
                createElement(userdataObj,elementBox);
                // initTree(userdataTree);
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreateBox(16711680);
        }else if(flag == "createvolume"){
            userdataObj.type = 207;
            userdataObj.name = "volume";
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.heightValue = pval.Height;

                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=450px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                //var vlGuid=earth.Factory.CreateGUID();
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementVolume = earth.Factory.CreateElementVolume(guid, userdataObj.name);
                elementVolume.BeginUpdate();
                elementVolume.Selectable = userdataObj.selectable;
                elementVolume.Editable = userdataObj.editable;

                elementVolume.Underground = userdataObj.objectFlagType;
                elementVolume.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementVolume.Height =  userdataObj.heightValue;
                elementVolume.Vectors = pval.Vector3s;
                elementVolume.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//12632256;
                polyCount=pval.Vector3s.Count+2;
                var materialStyles = elementVolume.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                }
                elementVolume.EndUpdate();
                createElement(userdataObj,elementVolume);
                earth.AttachObject(elementVolume);
                // initTree(userdataTree);
                updateTree(userdataObj);
                userdataArr.push(elementVolume);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreateVolume(16711680);
        }else if(flag == "createcylinder"){
            polyCount = 3;
            userdataObj.type = 203;
            userdataObj.name = "cylinder";
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.heightValue = pval.Height;
                userdataObj.bottomRadius = pval.Radius;

                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=480px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementCylinder = earth.Factory.CreateElementCylinder(guid, userdataObj.name);
                elementCylinder.BeginUpdate();
                elementCylinder.Selectable = userdataObj.selectable;
                elementCylinder.Editable = userdataObj.editable;
                elementCylinder.Underground = userdataObj.objectFlagType;
                elementCylinder.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementCylinder.Radius = userdataObj.bottomRadius;
                elementCylinder.Height = userdataObj.heightValue;
                elementCylinder.FillColor = parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//12632256;
                var materialStyles = elementCylinder.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                }
                elementCylinder.EndUpdate();
                earth.AttachObject(elementCylinder);
                createElement(userdataObj,elementCylinder);
                // initTree(userdataTree);
                updateTree(userdataObj);
                userdataArr.push(elementCylinder);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreateCylinder(16711680);
        }else if(flag == "createcone"){//创建圆锥
            polyCount = 3;
            userdataObj.type = 204;
            userdataObj.name = "cone";
            earth.Event.OnCreateGeometry = function (pval, type) {
                var guid=earth.Factory.CreateGUID();
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.heightValue = pval.Height;
                userdataObj.bottomRadius = pval.BottomRadius;
                userdataObj.topRadius = pval.TopRadius;
                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=530px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                userdataObj.guid=guid;
                var elementCone = earth.Factory.CreateElementCone(guid,userdataObj.name);
                elementCone.BeginUpdate();
                elementCone.Selectable = userdataObj.selectable;
                elementCone.Editable = userdataObj.editable;
                elementCone.Underground = userdataObj.objectFlagType;
                elementCone.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementCone.BottomRadius = userdataObj.bottomRadius;
                elementCone.TopRadius = userdataObj.topRadius;
                elementCone.Height = userdataObj.heightValue;
                elementCone.FillColor =parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );// 12632256;
                var materialStyles = elementCone.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                }
                elementCone.EndUpdate();
                earth.AttachObject(elementCone);
                createElement(userdataObj,elementCone);
                treePIDObject[guid] = 0;

                // initTree(userdataTree);
                //更新tree 添加新的节点 不必每次都在创建新对象的时候 重新init一下树 其他地方要一并修改......
                updateTree(userdataObj);

                userdataArr.push(elementCone);
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreateCone(16711680);
        }else if(flag == "createprism"){//创建棱柱
            userdataObj.type = 205;
            userdataObj.name = "prism";
            userdataObj.sides = 5;
            earth.Event.OnCreateGeometry = function (pval, type) {
                var guid=earth.Factory.CreateGUID();
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.heightValue = pval.Height;
                userdataObj.bottomRadius = pval.Radius;
                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=530px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                userdataObj.guid=guid;
                var elementPrism = earth.Factory.CreateElementPrism(guid, userdataObj.name);
                elementPrism.BeginUpdate();
                elementPrism.Selectable = userdataObj.selectable;
                elementPrism.Editable = userdataObj.editable;
                elementPrism.Underground = userdataObj.objectFlagType;
                elementPrism.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementPrism.Sides = pval.Sides;
                elementPrism.Radius = userdataObj.bottomRadius;
                elementPrism.Height = userdataObj.heightValue;
                elementPrism.Sides = userdataObj.sides;
                elementPrism.FillColor =parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//12632256;
                var materialStyles = elementPrism.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                }

                elementPrism.EndUpdate();
                earth.AttachObject(elementPrism);
                createElement(userdataObj,elementPrism);
                // initTree(userdataTree);
                updateTree(userdataObj);
                userdataArr.push(elementPrism);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreatePrism(userdataObj.sides, 16711680);
        }else if(flag == "createpyramid"){//创建棱椎
            userdataObj.type = 206;
            userdataObj.name = "pyramid";
            userdataObj.sides = 5;
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.path = earth.Environment.RootPath;
                userdataObj.heightValue = pval.Height;
                userdataObj.bottomRadius = pval.BottomRadius;
                userdataObj.topRadius = pval.TopRadius;
                var rValue = showModalDialog("html/userdata/3DEdit.html", userdataObj,"dialogWidth=400px;dialogHeight=530px;status=no");
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementPyramid = earth.Factory.CreateElementPyramid(guid, userdataObj.name);
                elementPyramid.BeginUpdate();
                elementPyramid.Selectable = userdataObj.selectable;
                elementPyramid.Editable = userdataObj.editable;
                elementPyramid.Underground = userdataObj.objectFlagType;
                elementPyramid.SphericalTransform.SetLocationEx(pval.Longitude, pval.Latitude, pval.Altitude);
                elementPyramid.Sides = pval.Sides;
                elementPyramid.BottomRadius = userdataObj.bottomRadius;
                elementPyramid.TopRadius = userdataObj.topRadius;
                elementPyramid.Height = userdataObj.heightValue;
                elementPyramid.Sides = userdataObj.sides;
                elementPyramid.FillColor =parseInt("0x"+userdataObj.fillcolor.toString().substring(1).toLowerCase() );//12632256;
                var materialStyles = elementPyramid.MaterialStyles;
                var count = materialStyles.Count;
                for(var i=0; i<count; i++){
                    var materialStyle = materialStyles.Items(i);
                    materialStyle.DiffuseTexture=userdataObj.texturePath[i];
                }
                elementPyramid.EndUpdate();
                earth.AttachObject(elementPyramid);
                createElement(userdataObj,elementPyramid);
                // initTree(userdataTree);
                updateTree(userdataObj);
                userdataArr.push(elementPyramid);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreatePyramid(userdataObj.sides, 16711680);
        }else if(flag == "createdWater"){
            earth.Event.OnCreateGeometry = function (pval, type) {
                userdataObj.type = "dWater";
                userdataObj.name = "dWater";
                var particleType = "dWater"
                userdataObj.path = earth.Environment.RootPath;
                var rValue = showModalDialog("html/userdata/getParticleName.html",userdataObj,"dialogWidth=400px;dialogHeight=110px;status=no") ;
                if (userdataObj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                //usearth.ShapeCreator.Clear();
                var guid=earth.Factory.CreateGUID();
                userdataObj.guid=guid;
                var elementWater = earth.Factory.CreateElementWater(guid, userdataObj.name);
                elementWater.BeginUpdate();
                var polygon = earth.Factory.CreatePolygon();
                polygon.AddRing(pval);
                elementWater.SetPolygon(polygon);
                elementWater.EndUpdate();
                earth.AttachObject(elementWater);

                createElement(userdataObj,elementWater);
                userdataArr.push(elementWater);
                updateTree(userdataObj);
                treePIDObject[guid] = 0;
                earth.ShapeCreator.Clear();
            };
            earth.ShapeCreator.CreatePolygon();
        }
        objArr.push(userdataObj);
    };
    /********************************************************************************************************************************************/
    /**
     * 创建军标
     * 根据flag判断创建那种军标//sArrow customArrow tailArrow customTailArrow equalSArrow doubleArrow xArrow
     //assemblyArea triangleFlag rectFlag curveFlag
     */
    var _createMilitaryTag = function(flag,userdataTree){
        var obj={};
        obj.action="add";
        obj.earth = earth;
        obj.name=flag;
        earth.Event.OnCreateGeometry = function (pval, type) {
            //var sarrow = earth.Factory.CreateElementPlotSArrow(guid, obj.name);
            var sarrow;
            var guid = earth.Factory.CreateGuid();
            if(flag=="sArrow"){
                sarrow = earth.Factory.CreateElementPlotSArrow(guid, obj.name);
                obj.type = "250";
            }else if (flag == "customArrow"){
                sarrow = earth.Factory.CreateElementPlotCustomArrow(guid, obj.name);
                obj.type = "253";
            }else if(flag == "tailArrow"){
                sarrow = earth.Factory.CreateElementPlotTailSArrow(guid, obj.name);
                obj.type = "252";
            }else  if(flag=="customTailArrow"){
                sarrow = earth.Factory.CreateElementPlotCustomTailArrow(guid, obj.name);
                obj.type = "254";
            }else if(flag=="equalSArrow"){
                sarrow = earth.Factory.CreateElementPlotEqualSArrow(guid, obj.name);
                obj.type = "251";
            }else if(flag=="doubleArrow"){
                sarrow = earth.Factory.CreateElementPlotDoubleArrow(guid, obj.name);
                obj.type = "255";
            }else if(flag=="xArrow"){
                sarrow = earth.Factory.CreateElementPlotXArrow(guid, obj.name);
                obj.type = "256";
            }else if(flag=="assemblyArea"){
                sarrow = earth.Factory.CreateElementPlotAssemblyArea(guid, obj.name);
                obj.type = "260";
            }else if(flag=="triangleFlag"){
                sarrow = earth.Factory.CreateElementPlotTriangleFlag(guid, obj.name);
                obj.type = "257";
            }else if(flag=="rectFlag"){
                sarrow = earth.Factory.CreateElementPlotRectFlag(guid, obj.name);
                obj.type = "258";
            }else if(flag=="curveFlag"){
                sarrow = earth.Factory.CreateElementPlotCurveFlag(guid, obj.name);
                obj.type = "259";
            }

            var militaryData;
            if(obj.type === "250" || obj.type === "251" || obj.type === "252" || obj.type === "253" || obj.type === "254" || obj.type === "255" || obj.type === "256" || obj.type === "260" ){
                militaryData = window.showModalDialog("html/userdata/MilitaryTagData.html",obj,"dialogWidth=400px;dialogHeight=450px;status=no");
            } else {
                militaryData = window.showModalDialog("html/userdata/MilitaryTagData.html",obj,"dialogWidth=400px;dialogHeight=350px;status=no");
            }

            if (obj.click==="false"){
                earth.ShapeCreator.Clear();
                return;
            }

            obj.guid = sarrow.Guid;
            //obj.type=flag;
            sarrow.BeginUpdate();
            sarrow.name =  obj.name;
            //sarrow.AltitudeType = 1;
            sarrow.SetControlPointArray(pval);
            var linestyle = sarrow.LineStyle;
            linestyle.LineWidth = obj.linewidth;
            //alert(obj.linecolor);
            if(obj.linecolor){
                linestyle.LineColor = parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase() );
            }
            var fillstyle = sarrow.FillStyle;
            if(obj.fillcolor){
                fillstyle.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase() );
            }
            //新增属性[DrawOrder, Selectable, Editable]
            //sarrow.DrawOrder = obj.drawOrder;
            sarrow.selectable = obj.selectable;
            sarrow.editable = obj.editable;

            if( flag!="triangleFlag" && flag!="rectFlag" && flag!="curveFlag" ){
                sarrow.AltitudeType = obj.Shadow;
            }

            sarrow.EndUpdate();
            earth.AttachObject(sarrow);
            createElement(obj, sarrow);
            // initTree(userdataTree);
            updateTree(obj);
            userdataArr.push(sarrow);
            objArr.push(obj);
            treePIDObject[guid] = 0;
            earth.ShapeCreator.Clear();
        }

    };
    /********************************************************************************************************************************************/
    /**************************************************************************************************************************************/

    /**
     * 导入模型数据
     * 根据flag判断导入那种数据
     */
    var _importModelData=function(flag,userdataTree){
        var obj={};
        obj.action="add";
        obj.earth = earth;
        earth.ShapeCreator.Clear();
        //earth.Environment.SetCursorStyle(32515);
        if(flag === "model" || flag === "tree" || flag === "match"){
            earth.Event.OnCreateGeometry =function (pVal){
                obj.path = earth.Environment.RootPath;
                obj.flag = flag;
                var tag = 1;
                if(flag === "model"){
                    obj.name = "模型";
                    tag = 1;
                } else if (flag === "tree") {
                    obj.name = "树";
                    tag = 2;
                } else if (flag === "match") {
                    obj.name = "小品";
                    tag =3;
                }
                obj.tag = tag;
                var rValue = showModalDialog("html/userdata/modelData.html", obj,"dialogWidth=370px;dialogHeight=310px;status=no");
                if (obj.click==="false"){
                    earth.ShapeCreator.Clear();
                    //earth.Environment.SetCursorStyle(32649);
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                obj.guid = guid;
                obj.type = 229;
                //var position = earth.GlobeObserver.Pick(pVal.X, pVal.Y);
                obj.longitude = pVal.Longitude;
                obj.latitude = pVal.Latitude;
                obj.altitude = pVal.Altitude;

                var model = earth.Factory.CreateEditModelByLocal(obj.guid, obj.name, obj.link,tag);//创建以文件形式存放的editmodel
                //model.SetIsCollapse(true);
                model.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);//设置对象的位置
                model.name = obj.name;
                model.Selectable = true;
                model.Editable = true;
                earth.AttachObject(model);
                userdataArr.push(model);
                createElement(obj,model);
                //initTree(userdataTree);
                updateTree(obj);
                treePIDObject[guid] = 0;
                //earth.Environment.SetCursorStyle(32649);

            }
            earth.ShapeCreator.CreatePoint();
        }else if (flag == "picture"){
            earth.Event.OnCreateGeometry =function (pVal){
                obj.path = earth.Environment.RootPath;
                var rValue = showModalDialog("html/userdata/pictureData.html", obj,"dialogWidth=370px;dialogHeight=300px;status=no");
                if (obj.click==="false"){
                    earth.ShapeCreator.Clear();
                    //earth.Environment.SetCursorStyle(32649);
                    return;
                }
                var guid = earth.Factory.CreateGuid();
                obj.guid = guid;
                //obj.name = "picture";
                obj.type = 217;
                // var position = earth.GlobeObserver.Pick(pVal.X, pVal.Y);
                obj.longitude = pVal.Longitude;
                obj.latitude = pVal.Latitude;
                obj.altitude = pVal.Altitude;
                obj.image = obj.iconFileName;

                var billboard = earth.Factory.CreateElementSimpleBillboard( obj.guid, obj.name );
                billboard.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
                billboard.BeginUpdate();
                billboard.name = obj.name;
                billboard.Width = obj.width ;
                billboard.Height = obj.height ;
                billboard.Image = obj.image;//"G:\\project\\UniBrowser_3.0\\root\icon\\icon.dds";//
                //billboard.Name=obj.name;
                billboard.Visibility = true;
                billboard.EndUpdate();
                earth.AttachObject(billboard);
                userdataArr.push(billboard);
                createElement(obj,billboard);
                //userdataTree.addNodes(userdataTree.getNodeByTId("userdataTree_1"),{id:obj.guid,pId: -1,name:obj.name},false);
                //initTree(userdataTree);
                updateTree(obj);
                treePIDObject[obj.guid] = 0;
                //earth.Environment.SetCursorStyle(32649);

            }
            earth.ShapeCreator.CreatePoint();
        }else  if(flag=="simplebuilding"){
            earth.Event.OnCreateGeometry = function(pVal,type){
                obj.path = earth.Environment.RootPath;
                obj.floorsAllHeight = pVal.Height;
                obj.earth=earth;
                var rValue = showModalDialog("html/userdata/SimpleBuiliding.html", obj,"dialogWidth=400px;dialogHeight=370px;status=no");
                if (obj.click==="false"){
                    earth.ShapeCreator.Clear();
                    return;
                }
                obj.guid = earth.Factory.CreateGUID();
                obj.type = 280;
                obj.vector3s = pVal.Vector3s;
                obj.longitude = pVal.Longitude;
                obj.latitude = pVal.Latitude;
                obj.altitude = pVal.Altitude;

                var simpleBuilding = earth.factory.CreateSimpleBuilding(obj.guid, obj.name);
                simpleBuilding.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
                simpleBuilding.BeginUpdate();
                var polygon = earth.factory.CreatePolygon();
                polygon.AddRing(obj.vector3s);
                simpleBuilding.SetPolygon(0,polygon);
                var floorCount = parseInt(obj.floorCount);
                var floorHeight = parseFloat(obj.floorHeight);
                simpleBuilding.SetFloorsHeight(floorHeight * floorCount);
                simpleBuilding.SetFloorHeight(floorHeight);
                simpleBuilding.SetRoofType(obj.roofTypeNode);
                var roofcolor= parseInt("0x"+obj.roofColor.toString().substring(1).toLowerCase() );
                var floorcolor= parseInt("0x"+obj.floorColor.toString().substring(1).toLowerCase() );
                simpleBuilding.FloorsColor = floorcolor;
                simpleBuilding.RoofColor = roofcolor;

                var floorMats = simpleBuilding.GetFloorsMaterialStyles();
                floorMats.Items(0).DiffuseTexture = obj.roofTexture;
                floorMats.Items(1).DiffuseTexture = obj.roofTexture;
                for(var i=2; i<floorMats.Count; i++){
                    floorMats.Items(i).DiffuseTexture = obj.floorTexture;
                }
                var roofMats = simpleBuilding.GetRoofMaterialStyles();
                for(var i=0; i<roofMats.Count; i++){
                    roofMats.Items(i).DiffuseTexture = obj.roofTexture;
                }

                simpleBuilding.EndUpdate();
                earth.ShapeCreator.Clear();
                earth.AttachObject(simpleBuilding);
                userdataArr.push(simpleBuilding);
                createElement(obj,simpleBuilding);
                //userdataTree.addNodes(userdataTree.getNodeByTId("userdataTree_1"),{id:obj.guid,pId: -1,name:obj.name},false);
                //initTree(userdataTree);
                updateTree(obj);
                treePIDObject[ obj.guid ] = 0;
                //earth.Environment.SetCursorStyle(32649);
            };
            earth.ShapeCreator.CreateVolume(0xffff0000);

        }else if(flag=="grid"){//晕渲图
            //earth.Event.OnCreateGeometry =function (pVal){
            obj.path = earth.Environment.RootPath;
            obj.name="grid";
            obj.type=244;
            var rValue = showModalDialog("html/userdata/gridData.html", obj,"dialogWidth=370px;dialogHeight=260px;status=no");
            if (obj.click==="false"){
                earth.ShapeCreator.Clear();
                //earth.Environment.SetCursorStyle(32649);
                return;
            }
            if(EditLayer===null){
                createLayer();
            }
            obj.guid=earth.Factory.CreateGuid();
            //var position = earth.GlobeObserver.Pick(pVal.X, pVal.Y);
            obj.longitude="113.2704949388";
            obj.latitude="36.5545501412";
            obj.altitude="3";
            var grid = earth.Factory.CreateElementGrid(obj.guid,obj.name,obj.path,obj.height/*高度2千米*/);
            grid.name = obj.name;
            earth.AttachObject(grid);
            /* EditLayer.BeginUpdate();
             EditLayer.AttachObject(grid);
             EditLayer.EndUpdate();*/
            //grid.SphericalTransform.SetLocationEx(113.2704949388,36.5545501412,3);
            //earth.GlobeObserver.GotoLookat(113.2704949388,36.5545501412,3,0,0,0,1);

            userdataArr.push(grid);
            createElement(obj,grid);
            //initTree(userdataTree);
            updateTree(obj);
            treePIDObject[ obj.guid ] = 0;
            //earth.Environment.SetCursorStyle(32649);
            //}
            earth.ShapeCreator.CreatePoint();
        }
        objArr.push(obj);

    };
    /**************************************************************************************************************************************/
    /**
     * 创建图元保存到xml
     *
     */
    var createElement = function(obj, element, editMsg) {
        var rootxml = getUserdata(filename);
        var elementXML = getElementByGUID(rootxml, obj.guid);
        if(elementXML){
            obj.desc = elementXML.getElementsByTagName("Description")[0].text;
        }
        var xmlData = createElementXml(obj,element);
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");

        var lookupNode = null;

        if (editMsg && !(editMsg["prev"] === undefined && editMsg["next"] === undefined)) {
            //alert(editMsg["prev"]);
            var prevNodeID = editMsg["prev"];
            var nextNodeID = editMsg["next"];
            if (prevNodeID) {
                var prevN = getElementByGUID(rootxml, prevNodeID);
                insertAfter(xmlDoc.documentElement.firstChild, prevN);
                //alert("添加完毕");
            }
            else if (nextNodeID){
                var nextN = getElementByGUID(rootxml, nextNodeID);
                nextN.parentNode.insertBefore(xmlDoc.documentElement.firstChild, nextN);
                //alert("添加完毕");
            }
        } else {

            if (rootxml.childNodes.length>1) {
                lookupNode = rootxml.childNodes[rootxml.childNodes.length-1].firstChild;
            } else {
                lookupNode = rootxml.documentElement.firstChild;
            }
            lookupNode.appendChild(xmlDoc.documentElement.firstChild);
        }
        var root = earth.Environment.RootPath + "userdata\\"+filename;
        earth.UserDocument.saveXmlFile(root,rootxml.xml);

    }

    /**
     * 创建xml
     *
     */
    var createElementXml = function(obj, elment){
    	var xmlData = "";
    	xmlData += "<Element id='" +obj.guid+ "' name='" +obj.name+ "' shadow_cast='1' type='"+obj.type+"' checked='1' >";	
        xmlData += " <Visibility>true</Visibility>";
        if(obj.type==229){
        	xmlData += " <devi_Num>"+obj.deviNum+"</devi_Num>";
        	xmlData += " <pole_Type_ID>"+obj.poleTypeID+"</pole_Type_ID>";
        	xmlData += " <bulb_Num>"+obj.bulbNum+"</bulb_Num>";
        	xmlData += " <mana_Depa_ID>"+obj.manaDepaID+"</mana_Depa_ID>";
        	xmlData += " <owne_Depa>"+obj.owneDepa+"</owne_Depa>";
        	xmlData += " <main_Depa>"+obj.mainDepa+"</main_Depa>";
        	xmlData += " <Belo_No>"+obj.Belo_No+"</Belo_No>";
        }        if(obj.desc!=undefined){
            xmlData += " <Description>"+obj.desc+"</Description>";
        }else{
            xmlData += " <Description></Description>";
        }
        xmlData += " <RenderStyle>";

        //这里要针对动态对象单独处理 不用转类型
        if (!(obj.type === "fire" || obj.type === "mist" || obj.type === "fountain" || obj.type === "nozzle" || obj.type === "SprayNozzle"))
        {
            obj.type = Number(obj.type);
        }

        //二维xml格式
        if(obj.type === 220 || obj.type === 239 ||obj.type === 243 || obj.type === 240 || obj.type === 241 || obj.type  === 211 || obj.type === 245)
        {
            var lineColor = elment.LineStyle.LineColor;
            xmlData += "  <LineColor>" +obj.linecolor+ "</LineColor>";
            xmlData += "  <LineWidth>" +elment.LineStyle.LineWidth+ "</LineWidth>";
            if(elment.FillStyle){
                xmlData += "  <FillColor>" +obj.fillcolor+ "</FillColor>";
            }
            // else if(obj.fillcolor){
            //     xmlData += "  <FillColor>" +obj.fillcolor+ "</FillColor>";
            // }

            xmlData += "  <ShadowStyle>";
            //alert(obj.shadow);
            xmlData += "   <ShadowType>" + obj.shadow + "</ShadowType>";
            xmlData += "   <ShadowColor>" + obj.linecolor + "</ShadowColor>";
            xmlData += "  </ShadowStyle>";

            xmlData += "  <Selectable>" +obj.selectable+ "</Selectable>";
            xmlData += "  <Editable>" +obj.editable+ "</Editable>";
            //由于圆 椭圆与扇形还没有DrawOrder属性 因此这里暂不添加
            if(obj.type === 220  || obj.type === 211 || obj.type === 241
                || obj.type === 240 || obj.type === 243){
                xmlData += " <DrawOrder>" + obj.drawOrder+ "</DrawOrder>";
            }
            var vector3s="";
            if(obj.type === 220){
                xmlData += "  <isShadowArrow>" +obj.arrow+ "</isShadowArrow>";
                xmlData += "  <Length>" +obj.lineLength+ "</Length>";
                vector3s=elment.GetPointArray();
            }else if(obj.type === 211){
                vector3s=elment.GetExteriorRing();
            }else if(obj.type === 239){
                vector3s="";
                xmlData += "   <Radius>" +elment.Radius+ "</Radius>";
            }else if(obj.type === 241){
                xmlData += "   <isShadowArrow>" +obj.arrow+ "</isShadowArrow>";
                vector3s=elment.GetControlPointArray();
                //vector3s=elment.GetControlPointArray();
            }else if(obj.type === 240){
                vector3s="";
                var ArcCenterStr= " " + elment.ArcCenter.x + "," + elment.ArcCenter.y + "," + elment.ArcCenter.z;
                xmlData += "   <ArcCenter>" +ArcCenterStr+ "</ArcCenter>";
                xmlData += "   <Angle>" +elment.Angle+ "</Angle>";
                xmlData += "   <Radius>" +obj.radius+ "</Radius>";
            }else if(obj.type === 243){
                vector3s="";
                xmlData += "   <LongRadius>" +elment.LongRadius+ "</LongRadius>";
                xmlData += "   <ShortRadius>" +elment.ShortRadius+ "</ShortRadius>";
            }else if(obj.type === 245){
                vector3s=elment.GetExteriorRing();
                xmlData += "   <TextureImagePath>" +obj.picture+ "</TextureImagePath>";
                xmlData += "   <TextureTiltX>" +obj.expandX+ "</TextureTiltX>";
                xmlData += "   <TextureTiltY>" +obj.expandY+ "</TextureTiltY>";
                xmlData += "   <TextureMode>" +obj.textture+ "</TextureMode>";
            }

            //新增接口 obj.type==="texturePolygon" || obj.type==="rectangle" 这两者不支持周长与面积
            if(obj.type === 211 || obj.type === 239 || obj.type === 240 || obj.type === 243){
                xmlData += "  <Perimeter>" + elment.perimeter + "</Perimeter>";
                xmlData += "  <Area>" + elment.area + "</Area>";
            }

            var ptString = "";
            for(var i=0;i<vector3s.Count;i++){
                ptString += " " + vector3s.Items(i).x + "," + vector3s.Items(i).y + "," + vector3s.Items(i).z;
            }
            xmlData += " <Coordinates>" + ptString+ "</Coordinates>";
        }

        xmlData += " </RenderStyle>";

        //军标xml
        if(obj.type == 250 || obj.type == 251 || obj.type == 252 || obj.type == 253
            || obj.type == 254 ||  obj.type == 255 || obj.type == 256 || obj.type == 257
            || obj.type == 258 || obj.type == 259 || obj.type == 260)
        {
            xmlData += "  <LineColor>" +obj.linecolor+ "</LineColor>";
            xmlData += "  <LineWidth>" +elment.LineStyle.LineWidth+ "</LineWidth>";
            xmlData += "  <FillColor>" +obj.fillcolor+ "</FillColor>";
            // xmlData += "  <Transparency>" +obj.transparency+ "</Transparency>";
            xmlData += "   <Shadow>" +  obj.Shadow + "</Shadow>";
            var vector3s=elment.GetControlPointArray();
            var ptString = "";
            for(var i=0;i<vector3s.Count;i++){
                ptString += " " + vector3s.Items(i).x + "," + vector3s.Items(i).y + "," + vector3s.Items(i).z;
            }
            xmlData += " <Coordinates>" + ptString+ "</Coordinates>";

            //新增节点
            if(obj.type == 250 || obj.type == 251 || obj.type == 252 || obj.type == 253
                || obj.type == 254 ||  obj.type == 255 || obj.type == 256 || obj.type == 260){
                xmlData += " <DrawOrder>" + obj.drawOrder+ "</DrawOrder>";
                xmlData += " <Selectable>" + obj.selectable+ "</Selectable>";
                xmlData += " <Editable>" + obj.editable+ "</Editable>";
            }
        }
        //三维对象
        if(obj.type === 216 || obj.type === 202 || obj.type === 207 || obj.type === 203 ||
            obj.type === 204 || obj.type === 205 || obj.type === 206){//三维xml格式
            xmlData += "<TextureParams>";
            xmlData += "    <UniqueSideStyle>"+""+"</UniqueSideStyle>";
            xmlData += "  <FillColor>" +obj.fillcolor+ "</FillColor>";

            //新增属性
            xmlData += "  <Selectable>" +obj.selectable+ "</Selectable>";
            xmlData += "  <Editable>" +obj.editable+ "</Editable>";
            xmlData += "  <ObjectFlagType>" +obj.objectFlagType+ "</ObjectFlagType>";

            var count = elment.MaterialStyles.Count;
            for(var i=0; i<count; i++){
                xmlData += "    <TextureParam>";
                xmlData += "        <TexturePath>"+ obj.texturePath[i] +"</TexturePath>";
                xmlData += "    </TextureParam>";
            }
            xmlData += "</TextureParams>";
            xmlData += "  <SphericalTransform><Location>"+elment.SphericalTransform.Longitude+","+elment.SphericalTransform.Latitude+","+elment.SphericalTransform.Altitude+"</Location></SphericalTransform>";

            if(obj.type === 216){
                xmlData += "   <Radius>" +elment.radius+ "</Radius>";
                xmlData += "        <TexturePath>"+obj.texturePath[2]+"</TexturePath>";
                //xmlData += "  <Sphere><Radius>"+elment.Radius+"</Radius></Sphere>";
            }else if(obj.type===202){
                xmlData += "  <Box><Width>"+obj.widthValue+"</Width>";
                xmlData += "  <Length>"+obj.longValue+"</Length>";
                xmlData += "  <Height>"+obj.heightValue+"</Height></Box>";
            }else if(obj.type===207){
                var pList="";
                var vector3s=elment.Vectors;
                for(var i=0;i<vector3s.Count;i++){
                    var point=vector3s.Items(i);
                    pList+=point.X+","+point.Y+","+point.Z+" ";
                }
                xmlData+= "  <Volume><PointList>"+pList+" </PointList>";
                xmlData+= " <Height>"+obj.heightValue+"</Height></Volume>";
            }else if(obj.type===203){//圆柱
                xmlData += "  <Cylinder><Radius>"+obj.bottomRadius+"</Radius>";
                xmlData += "  <Height>"+obj.heightValue+"</Height></Cylinder>";
            }else if(obj.type===204){//圆锥
                xmlData += "  <Cone><Radius>"+ obj.bottomRadius+"</Radius>";
                xmlData += "  <TopRadius>"+obj.topRadius+"</TopRadius>";
                xmlData += "  <Height>"+obj.heightValue+"</Height></Cone>";
            }else if(obj.type===205){//棱柱
                xmlData += "  <Prism><Sides>"+obj.sides+"</Sides>";
                xmlData += "  <Radius>"+obj.bottomRadius+"</Radius>";
                xmlData += "  <Height>"+obj.heightValue+"</Height></Prism>";
            }else if(obj.type===206){//棱锥
                xmlData += "  <Pyramid><Sides>"+obj.sides+"</Sides>";
                xmlData += "  <BottomRadius>"+obj.bottomRadius+"</BottomRadius>";
                xmlData += "  <TopRadius>"+obj.topRadius+"</TopRadius>";
                xmlData += "  <Height>"+obj.heightValue+"</Height></Pyramid>";
            }
        }
        if(obj.type === 229){//model
            xmlData += " <EditModel>";
            xmlData += "  <Link>" +obj.link+ "</Link>";
            xmlData += "  <Pivot>0.00000000,0.00000000,0.00000000</Pivot>";
            xmlData += "  <BBox>";
            xmlData += "   <MinBoundary>-10,0.0,-10</MinBoundary>";
            xmlData += "   <MaxBoundary>10,10,10</MaxBoundary>";
            if(obj.tag){
                xmlData += "   <Tag>"+obj.tag+"</Tag>";
            }
            xmlData += "  </BBox>";
            xmlData += " </EditModel>";
        }else if(obj.type === 217){//picture 
            xmlData += " <Width>" +obj.width+ "</Width>";
            xmlData += " <Height>" +obj.height+ "</Height>";
            xmlData += " <RenderStyle>";
            xmlData += "  <Icon>" +obj.iconFileName+ "</Icon>";
            xmlData += " </RenderStyle>";
            xmlData += "<Location>"+obj.longitude+","+obj.latitude+","+obj.altitude+"</Location>";

        }else if(obj.type === 209){//icon
            xmlData += " <RenderStyle type='normal'>";
            xmlData += "  <Icon>" +obj.iconNormalFileName+ "</Icon>";
            xmlData += " </RenderStyle>";
            xmlData += " <RenderStyle type='selected'>";
            xmlData += "  <Icon>" +obj.iconSelectedFileName+ "</Icon>";
            xmlData += " </RenderStyle>";
            xmlData += " <Location>" +obj.longitude+","+obj.latitude+","+obj.altitude+ "</Location>";
            //新增属性
            xmlData += "  <TextFormat>" +obj.textFormat+ "</TextFormat>";
            xmlData += "  <TextColor>" +obj.textColor+ "</TextColor>";
            xmlData += "  <TextHorizontalScale>" +obj.textHorizontalScale+ "</TextHorizontalScale>";
            xmlData += "  <TextVerticalScale>" +obj.textVerticalScale+ "</TextVerticalScale>";
            xmlData += "  <ShowHandle>" +obj.showHandle+ "</ShowHandle>";
            xmlData += "  <HandleHeight>" +obj.handleHeight+ "</HandleHeight>";
            xmlData += "  <HandleColor>" +obj.handleColor+ "</HandleColor>";
            xmlData += "  <MinVisibleRange>" +obj.minVisibleRange+ "</MinVisibleRange>";
            xmlData += "  <MaxVisibleRange>" +obj.maxVisibleRange+ "</MaxVisibleRange>";
            xmlData += "  <Selectable>" +obj.selectable+ "</Selectable>";
            xmlData += "  <Editable>" +obj.editable+ "</Editable>";

        }else if(obj.type === 280){
            xmlData += " <FloorHeight>" + obj.floorHeight  + "</FloorHeight>";
            xmlData += " <FloorCount>" + obj.floorCount  + "</FloorCount>";
            xmlData += " <RoofType>" + obj.roofTypeNode   + "</RoofType>";
            xmlData += " <FloorTexture>" + obj.floorTexture   + "</FloorTexture>";
            xmlData += " <RoofTexture>" + obj.roofTexture + "</RoofTexture>";
            xmlData += " <RoofColor>" + obj.roofColor + "</RoofColor>";
            xmlData += " <FloorColor>" + obj.floorColor + "</FloorColor>";

            xmlData += " <Location>" +obj.longitude+","+obj.latitude+","+obj.altitude+ "</Location>";
            var pList="";
            var vector3s=elment.GetPolygon(0).GetRingAt(0);
            for(var i=0;i<vector3s.Count;i++){
                var point=vector3s.Items(i);
                pList+=point.X+","+point.Y+","+point.Z+" ";
            }
            xmlData+= "  <SimpleBuilding><PointList>"+pList+" </PointList></SimpleBuilding>";
        }else if(obj.type === 244){
            xmlData += " <Height>" +obj.height+ "</Height>";
            xmlData += " <Grid>";
            xmlData += "  <Link>" +obj.path+ "</Link>";
            xmlData += " </Grid>";
        }

        var Rotation = elment.SphericalTransform.GetRotation();
        var Scale = elment.SphericalTransform.GetScale();
        var Position=elment.SphericalTransform.GetLocation();

        xmlData += " <ControlParams>";
        xmlData += "    <Rotation>"+Rotation.X+","+Rotation.Y+","+Rotation.Z+"</Rotation>";
        xmlData += "    <Scale>"+Scale.X+","+Scale.Y+","+Scale.Z+"</Scale>";
        xmlData += "    <Position>"+Position.X+","+Position.Y+","+Position.Z+"</Position>";
        xmlData += " </ControlParams>";
        //alert(Position.X+","+Position.Y+","+Position.Z);
        var heading = earth.GlobeObserver.Pose.heading;
        var tilt = earth.GlobeObserver.Pose.tilt;
        var range = earth.GlobeObserver.PickRange();

        xmlData += " <LookAt>";
        if(obj.name=="grid"){
            xmlData += "  <Longitude>" +obj.longitude+ "</Longitude>";
            xmlData += "  <Latitude>" +obj.latitude+ "</Latitude>";
            xmlData += "  <Altitude>" +obj.altitude+ "</Altitude>";
        }else {
            xmlData += "  <Longitude>" +elment.SphericalTransform.Longitude+ "</Longitude>";
            xmlData += "  <Latitude>" +elment.SphericalTransform.Latitude+ "</Latitude>";
            xmlData += "  <Altitude>" +elment.SphericalTransform.Altitude+ "</Altitude>";
        }
        xmlData += "  <Heading>" +heading+ "</Heading>";
        xmlData += "  <Tilt>" +tilt+ "</Tilt>";
        xmlData += "  <Range>" +range+ "</Range>";
        xmlData += " </LookAt>";

        xmlData += "</Element>";

        return xmlData;
    };


    /**
     * 选择
     */
    var _select = function (){
        earth.ToolManager.SphericalObjectEditTool.Select();
    };
    /**
     * 移动
     */
    var _move = function (){
        earth.ToolManager.SphericalObjectEditTool.Move(5);
    };
    /**
     * 旋转
     */
    var _rotate = function (){
        earth.ToolManager.SphericalObjectEditTool.Rotate(2);
    };
    /**
     * 缩放
     */
    var _scale = function (){
        earth.ToolManager.SphericalObjectEditTool.Scale(7);
    };
    /**
     * 清除加到球上的对象
     */
    var clearObj=function(clearElementArr){
        for(var i=0;i<clearElementArr.length;i++){
            _initDataArr(clearElementArr[i]) ;
            if(userdataArr != null){
                for(var n=0;n<userdataArr.length;n++){
                    earth.DetachObject(userdataArr[n]);
                }
            }
        }

    }

    var _moveByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.MoveSelectObject(dx,dy,dz);
        dingliangEditFinish();
    };
    var _rotateByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.RotateSelectObject(dx,dy,dz);
        dingliangEditFinish();
    };
    var _scaleByValue = function (dx,dy,dz){
        earth.ToolManager.SphericalObjectEditTool.ScaleSelectObject(dx,dy,dz);
        dingliangEditFinish();
    };
    /**
     * 贴地
     * 这里面的事件流有点乱...
     */
    var _alignGround = function (){
        earth.ToolManager.SphericalObjectEditTool.AlignGround();
        // selectObj();
        // earth.Event.OnLBUp = function(point){
        //     var selectSet = earth.SelectSet.Count;
        //     if(selectSet>0){
        //         selectObj();
        //     }

        //     earth.Event.OnLBUp = function(){} ;
        // }

        // earth.Event.OnRBDown = function(pointX, pointY){
        //     if(saveTag==="save"){
        //         editDataArr=[];
        //     }
        //     selectObj();
        //     earth.ToolManager.SphericalObjectEditTool.Browse() ;
        //     editDataArr=[];
        //     earth.Event.OnRBDown=function(){};
        // }
    };

    /**
     * 编辑顶点
     */
    var _editpoint=function(){
        earth.ToolManager.ElementEditTool.ShapeEdit();
    };

    /**
     * 添加顶点
     */
    var _addpoint=function(){
        earth.ToolManager.ElementEditTool.InsertPoint();
    };
    /**
     * 删除顶点
     */
    var _deletepoint=function(){
        earth.Event.OnGeometryDeletePoint=function(v1){
            selectObj();
            earth.ToolManager.ElementEditTool.DeleteSelectedPoint();//删除选择点

        };
        earth.ToolManager.ElementEditTool.DeletePoint();//选择删除点
    };
    /**
     * 边拉伸
     */
    var _SegmentExtrude=function(){
        earth.ToolManager.ElementEditTool.SegmentExtrude();
    };
    /**
     * 体拉伸
     */
    var _VolumeSegmentExtrude=function(){
        earth.ToolManager.ElementEditTool.VolumeSegmentExtrude();
    };
    /**
     * 克隆
     */
    var _clone = function (){
        earth.ToolManager.SphericalObjectEditTool.Select();
        earth.Event.OnSelectChanged=function(x){
            earth.Event.OnSelectChanged=function(x){};
            //if(earth.SelectSet && earth.SelectSet.GetCount() > 0){
            var selectSet = earth.SelectSet;
            for(var i=0; i < selectSet.GetCount(); i++){

                var obj = selectSet.GetObject(i);
                if(obj.RtspURL){
                    alert("摄像机不能克隆！");
                    selectSet.Clear();
                    return;
                }
                var copyObject = obj.Clone();

                var rootxml = getUserdata(filename);
                var nodes = getElementFromGUID(rootxml, obj.Guid,"");
                var vector3s = "";
                var copyNode = nodes[0]["remove"].cloneNode(true);

                //坐标偏移处理
                var positionNode = copyNode.getElementsByTagName("Position")[0].text;
                var posNode = positionNode.split(",");
                //alert(posNode[0] + " " +  posNode[1] + " " + posNode[2]);
                var newX = Number(posNode[0]) + 0.0001;
                var newY = Number(posNode[1]) + 0.0001;
                var newPos = newX + "," + newY + "," + posNode[2];
                //alert(newPos);
                copyObject.SphericalTransform.SetLocationEx(newX, newY, Number(posNode[2]));
                copyObject.Visibility = true;

                copyObject.BeginUpdate();
                earth.AttachObject(copyObject);
                copyObject.EndUpdate();

                userdataArr.push(copyObject);
                treePIDObject[copyObject.Guid] = 0;

                nodes[0]["remove"].parentNode.appendChild(copyNode);
                var locationNode = copyNode.getElementsByTagName("Location");
                var CoordinatesNode = copyNode.getElementsByTagName("Coordinates");
                var Longitude = copyNode.getElementsByTagName("Longitude");
                var Latitude = copyNode.getElementsByTagName("Latitude");
                if(CoordinatesNode.length!=0){
                    if(obj.Rtti==220){   //line
                        vector3s=obj.GetPointArray();
                    }else if(obj.Rtti==211||obj.Rtti==245){  //polygon
                        vector3s=obj.GetExteriorRing();
                    }else if(obj.Rtti==239||obj.Rtti==240||obj.Rtti==243){  //polygon
                        vector3s="";
                    }else if(obj.Rtti==241){
                        vector3s=obj.GetControlPointArray();
                    }else if(obj.Rtti==207){
                        vector3s=obj.Vectors;
                    } else if(obj.Rtti==280){
                        vector3s=obj.GetPolygon(0).GetRingAt(0);
                    }
                    var ptString="";
                    for(var j=0;j<vector3s.Count;j++){
                        var vector3sX = Number(vector3s.Items(j).x)+0.0001;
                        var vector3sY = Number(vector3s.Items(j).Y)+0.0001;
                        ptString += " " + vector3sX + "," + vector3sY + "," + vector3s.Items(j).z;
                    }
                    copyNode.getElementsByTagName("Coordinates")[0].text=ptString ;
                }
                if(locationNode.length != 0){
                    var str=copyObject.SphericalTransform.Longitude+","+copyObject.SphericalTransform.Latitude+","+copyObject.SphericalTransform.Altitude;
                    copyNode.getElementsByTagName("Location")[0].text=str ;
                }
                if(Longitude.length != 0){
                    copyNode.getElementsByTagName("Longitude")[0].text=copyObject.SphericalTransform.Longitude ;
                }
                if(Latitude.length != 0){
                    copyNode.getElementsByTagName("Latitude")[0].text=copyObject.SphericalTransform.Latitude ;
                }
                var elementDoc=copyNode.getElementsByTagName("Element");
                var updatanode= {guid:copyObject.Guid, name:copyNode.getAttribute("name")+"Clone"};
                updateTree(updatanode);
                copyNode.setAttribute("id",copyObject.Guid);
                copyNode.setAttribute("name",copyNode.getAttribute("name")+"Clone");

                copyNode.getElementsByTagName("Position")[0].text = newPos;

                var path= earth.Environment.RootPath + "userdata\\" + filename;
                earth.UserDocument.saveXmlFile(path,rootxml.xml);
            }
            selectSet.Clear();
        }
    };

    /**
     * 选择对象
     */
    var selectObj=function(){
        var selectSet = earth.SelectSet;
        for(var i=0; i<selectSet.GetCount(); i++){
            var element = selectSet.GetObject(i);
            if(!element.Aspect) { //判断是否摄像头
                if(editDataArr === undefined){
                    editDataArr= earth.editDataArr
                }
                editDataArr.push(element);
            }else {
                if(cameraArr === undefined){
                    cameraArr=earth.cameraArr;
                }
                cameraArr.push(element);
            }
            //alert(element.FillStyle.FillColor.toString(16));
        }
    };
    $(document).ready(function (){
        earth.Event.OnPoseChanged = function(x,y,z){
            //selectObj();
        }
        earth.Event.OnControlPointSelectChanged =function(x){
            //selectObj();
        }
        earth.Event.OnControlPointValueChanged =function(x){
            //selectObj();
        }
        earth.Event.OnGeometryDeletePoint =function(x){
            //selectObj();
        }
        earth.Event.OnGeometryInsertPoint =function(x){
            //selectObj();
        }

        earth.Event.OnExtrudeEnd =function(x){
            //selectObj();
        }
        earth.Event.OnSelectChanged =function(x){
            //selectObj();
        }

        earth.Event.OnEditFinished = function(){
            var ztree = null;
            if(earth.ztree){
                zTree = earth.ztree;
            }else{
                zTree = parent.$.fn.zTree.getZTreeObj("userdataTree");
            }
            //if(saveTag==="save"){
            editDataArr=[];
            //}
            selectObj();
            if(editDataArr.length != 0){
                _save(zTree);
            }
            if(cameraArr.length != 0){
                _saveCamera();
            }

            //清空选择
            earth.ToolManager.SphericalObjectEditTool.Browse();
            var picturesBalloons = null;
            if(parent.picturesBalloons===undefined){
                picturesBalloons = earth.htmlBallon;
            }else{
                picturesBalloons = parent.picturesBalloons;
            }
            if (picturesBalloons != null){
                picturesBalloons.DestroyObject();
                picturesBalloons = null;
            }
            //editDataArr = [];
        };
    });
    var dingliangEditFinish=function(){
        var ztree = null;
        if(earth.ztree){
            zTree = earth.ztree;
        }else{
            zTree = parent.$.fn.zTree.getZTreeObj("userdataTree");
        }
        //if(saveTag==="save"){
        editDataArr=[];
        //}
        selectObj();
        if(editDataArr.length != 0){
            _save(zTree);
        }
        if(cameraArr.length != 0){
            _saveCamera();
        }
    }
    /**
     * 保存移动、旋转、缩放编后的camera
     */
    var _saveCamera = function (){
        var xmlCameraData = earth.UserDocument.LoadXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE + ".xml");
        var cameraDoc = loadXMLStr(xmlCameraData) ;
        var cameras= cameraDoc.getElementsByTagName("record") ;
        for(var m=0;m<cameras.length;m++){
            var id = cameras[m].getAttribute("ID") ;
            for(var i =0;i<cameraArr.length;i++){
                if(id === cameraArr[i].Guid ){   //todo
                    var Rotation = cameraArr[i].SphericalTransform.GetRotation();
                    var Scale = cameraArr[i].SphericalTransform.GetScale();
                    var Position=cameraArr[i].SphericalTransform.GetLocation();
                    var lacation =  Position.X+","+Position.Y+","+Position.Z;
                    var rtt = Rotation.X+","+Rotation.Y+","+Rotation.Z;
                    var scl = Scale.X+","+Scale.Y+","+Scale.Z;
                    cameras[m].setAttribute("LOCATION",lacation);
                    cameras[m].setAttribute("ROTATION",rtt);
                    cameras[m].setAttribute("SCALE",scl);
                }
            }
        }
        var path=earth.RootPath + STAMP_config.constants.CAMERAFILE ;
        earth.UserDocument.saveXmlFile(path,cameraDoc.xml);

    }
    /**
     * 保存移动、旋转、顶点等编辑修改
     */
    var saveTag="";
    var _save = function(zTree){
        saveTag="save";
        //editDataArr包含当前选中对象
        var rootxml = getUserdata(filename);
        for(var i=0; i<editDataArr.length; i++){
            var element = editDataArr[i];
            var obj=null;
            //objArr包含各个对象的obj信息
            if(objArr===undefined){
                objArr = earth.objArr;
            }
            for(var m=0;m<objArr.length;m++){
                var objX=objArr[m];
                if(objX.guid==element.Guid){
                    obj=objX;
                    var editMsg = _deleteUserNodeToEdit(objX.guid, filename, true, zTree,rootxml);
                    obj.shadow = element.AltitudeType;
                    obj.selectable = element.selectable;
                    obj.editable = element.editable;
                    createElementToEdit(obj, element, editMsg,rootxml);
                }
            }
        }
        editDataArr=[];
        var root = earth.Environment.RootPath + "userdata\\"+filename;
        earth.UserDocument.saveXmlFile(root,rootxml.xml);
        if(saveTag === "save"){
            saveTag = "";
        }
    };
    //编辑完调用方法 如果多次编辑多次保存数量多时会报错
    var createElementToEdit = function(obj, element, editMsg,rootxml) {

        var elementXML = getElementByGUID(rootxml, obj.guid);
        if(elementXML){
            obj.desc = elementXML.getElementsByTagName("Description")[0].text;
        }
        var xmlData = createElementXml(obj,element);
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");

        var lookupNode = null;

        if (editMsg && !(editMsg["prev"] === undefined && editMsg["next"] === undefined)) {
            //alert(editMsg["prev"]);
            var prevNodeID = editMsg["prev"];
            var nextNodeID = editMsg["next"];
            if (prevNodeID) {
                var prevN = getElementByGUID(rootxml, prevNodeID);
                insertAfter(xmlDoc.documentElement.firstChild, prevN);
                //alert("添加完毕");
            }
            else if (nextNodeID){
                var nextN = getElementByGUID(rootxml, nextNodeID);
                nextN.parentNode.insertBefore(xmlDoc.documentElement.firstChild, nextN);
                //alert("添加完毕");
            }
        } else {

            if (rootxml.childNodes.length>1) {
                lookupNode = rootxml.childNodes[rootxml.childNodes.length-1].firstChild;
            } else {
                lookupNode = rootxml.documentElement.firstChild;
            }
            lookupNode.appendChild(xmlDoc.documentElement.firstChild);
        }

    }
    var _deleteUserNodeToEdit=function(id, filename, isEdit, zTree,rootxml){
        var userDoc=rootxml;
        var elementObj=_getElementByID(id);
        var elements;
        var editMsg = {};

        if(!elementObj)//如果找不到Element节点 说明是ElementFolder文件夹节点
        {
            //移除folder并且移除内部的各个子节点
            elements = userDoc.getElementsByTagName("ElementFolder");
        } else {
            elements = userDoc.getElementsByTagName("Element");
        }
        for (var i = 0; i < elements.length; i++) {
            var eleid=elements[i].getAttribute("id");
            if(eleid===id){
                //针对编辑后的节点信息保存
                if (isEdit) {
                    var currentElement = elements[i];
                    var currentNode = zTree.getNodesByParam("id", id)[0];
                    var preNode = currentNode.getPreNode();
                    var nextNode = currentNode.getNextNode();
                    if(preNode){
                        editMsg["prev"] = preNode.id;
                    }
                    if(nextNode){
                        editMsg["next"] = nextNode.id;
                    }
                }

                elements[i].parentNode.removeChild(elements[i]);
                if(saveTag=="save"){//savetag 判断对象是否经过偏移旋转等编辑d

                }else{
                    if(elementObj){
                        //earth.DetachObject(elementObj);
                    }
                }
            }
            // if(elements){
            //    userDoc.documentElement.removeChild(elements);
            // }
        }
        //var path= earth.Environment.RootPath + "userdata\\" + filename;
        //earth.UserDocument.saveXmlFile(path,userDoc.xml);
        if (editMsg) {
            return editMsg;
        }
        if(saveTag=="save"){
            return;
        }
        //_initDataArr(filename);
    };
    /**************************************************************************************************************************************/
    /**
     * 根据id删除对应的element对象,同时保存到本地xml文件
     * 注意:当进行编辑(移动,旋转等)操作后,这里要记录删除节点的相邻节点信息 以便同步到本地xml时候做插入位置的判断
     *      如果不是编辑后的操作,这部分逻辑不需要处理,因此根据需要传入第三个参数进行判断处理一下 明白了吧?!
     */
    var _deleteUserNode=function(id, filename, isEdit, zTree){
        var userDoc=getUserdata(filename);
        var elementObj=_getElementByID(id);
        var elements;
        var editMsg = {};

        if(!elementObj)//如果找不到Element节点 说明是ElementFolder文件夹节点
        {
            //移除folder并且移除内部的各个子节点
            elements = userDoc.getElementsByTagName("ElementFolder");
        } else {
            elements = userDoc.getElementsByTagName("Element");
        }
        for (var i = 0; i < elements.length; i++) {
            var eleid=elements[i].getAttribute("id");
            if(eleid===id){
                //针对编辑后的节点信息保存
                if (isEdit) {
                    var currentElement = elements[i];
                    var currentNode = zTree.getNodesByParam("id", id)[0];
                    var preNode = currentNode.getPreNode();
                    var nextNode = currentNode.getNextNode();
                    if(preNode){
                        editMsg["prev"] = preNode.id;
                    }
                    if(nextNode){
                        editMsg["next"] = nextNode.id;
                    }
                }

                elements[i].parentNode.removeChild(elements[i]);
                if(saveTag=="save"){//savetag 判断对象是否经过偏移旋转等编辑d

                }else{
                    if(elementObj){
                        //earth.DetachObject(elementObj);
                    }
                }
            }
            // if(elements){
            //    userDoc.documentElement.removeChild(elements); 
            // }
        }
        var path= earth.Environment.RootPath + "userdata\\" + filename;
        earth.UserDocument.saveXmlFile(path,userDoc.xml);
        if (editMsg) {
            return editMsg;
        }
        if(saveTag=="save"){
            return;
        }
        //_initDataArr(filename);
    };

    /**
     * 右键编辑
     * 根据id编辑对应的element对象
     * 编辑对象思路:根据内存中的对象实时获取属性 不从本地XML里获取
     *              当且仅当右键操作,程序初始化的时候才从xml里写入属性或者读取属性
     */
    var _editUserNode = function(id, filename){
        var obj=[];
        obj.click="false";
        obj.earth=earth;
        obj.action="edit";
        var userDoc=getUserdata(filename);
        var docElements = userDoc.getElementsByTagName("Element");

        var elements = userdataArr;
        //alert(userdataArr.length);
        for (var i = 0; i < userdataArr.length; i++) {//这里的length不对???
            var currentElement = userdataArr[i];
            var docElement = docElements[i];
            var eleid = currentElement.Guid;
            //alert(eleid + " " + id);
            if(eleid === id){
                obj.id = eleid;
                obj.action = "edit";
                //对象类型
                obj.type = currentElement.Rtti;
                //alert(currentElement.name);
                obj.desc = docElement.getElementsByTagName("Description")[0].text;
                obj.name = docElement.getAttributeNode("name").nodeValue;
                obj.description = obj.desc;
                obj.type = Number(obj.type);

                //动态对象
                var particleType = docElement.getAttributeNode("type").nodeValue;
                var particleName = docElement.getAttributeNode("name").nodeValue;
                if (particleType === "fire" || particleType === "mist" || particleType === "fountain" || particleType === "nozzle" || particleType === "SprayNozzle" || particleType === "dWater") {
                    obj.name = particleName;
                    window.showModalDialog("html/userdata/getParticleName.html",obj,"dialogWidth=400px;dialogHeight=110px;status=no") ;
                    currentElement.name = obj.name;
                } else {
                    if (currentElement.FillStyle) {
                        obj.FillColor = currentElement.FillStyle.FillColor.toString(16);
                    }
                    if (currentElement.AltitudeType) {
                        obj.shadow = currentElement.AltitudeType;
                    };
                    //obj.name = currentElement.name;
                    obj.description = obj.desc;
                }

                //二维对象  line 220 circle 239 ellipse 243 sector 240 curve 241 polygon 211 texturepolygon 245 rectangle 245
                if (obj.type === 220 || obj.type === 239 || obj.type === 243 || obj.type === 240 || obj.type === 241 || obj.type  === 211 || obj.type === 245){
                    obj.drawOrder = 0;
                    obj.linewidth = currentElement.LineStyle.LineWidth;
                    obj.linecolor = "#" + currentElement.LineStyle.LineColor.toString(16);

                    //obj.type==="circle"||obj.type==="ellipse"||obj.type==="sector" 已经支持!
                    if(obj.type === 220 || obj.type === 241 || obj.type === 211 || obj.type === 239 || obj.type === 243 || obj.type === 240){
                        obj.drawOrder = currentElement.DrawOrder;
                    }

                    //新增属性[可选择 可编辑]
                    obj.selectable = currentElement.Selectable;
                    obj.editable = currentElement.Editable;
                    obj.shadow = currentElement.AltitudeType;

                    if(obj.type != 220){
                        obj.fillcolor = "#" + currentElement.FillStyle.FillColor.toString(16);
                        docElement.getElementsByTagName("ShadowType")[0].text = obj.shadow;
                    }

                    if(obj.type === 220){
                        obj.arrow = currentElement.IsAddArrow;
                    }

                    if(obj.type === 239 || obj.type === 243 || obj.type === 240){
                        var rotation = currentElement.SphericalTransform.GetRotation();
                        var scale = currentElement.SphericalTransform.GetScale();
                        obj.rotation = rotation;
                        obj.scale = scale;
                    }

                    //半径
                    if(obj.type === 239 || obj.type === 240){
                        //alert(currentElement.Radius);
                        obj.radius = currentElement.Radius;
                    }

                    //长轴半径 短轴半径
                    if(obj.type === 243){
                        obj.longRadius = currentElement.LongRadius;
                        obj.shortRadius = currentElement.ShortRadius;
                    }

                    if(obj.type === 240){
                        obj.angle = currentElement.Angle;
                    }

                    //新增属性 [周长 面积]  obj.type === "texturePolygon" || obj.type === "rectangle"
                    if(obj.type === 211 || obj.type === 239 || obj.type === 243 || obj.type === 240){
                        obj.perimeter = currentElement.Perimeter;
                        obj.area = currentElement.Area;
                    }

                    //多边形贴图与矩形贴图
                    if(obj.type === 245){
                        obj.expandX = currentElement.TextureTiltX;
                        obj.expandY = currentElement.TextureTiltY;
                        obj.picture = currentElement.TextureImagePath;
                        obj.textture = currentElement.TextureMode;
                        obj.shadow = currentElement.AltitudeType;
                        obj.linecolor = "#" + currentElement.LineStyle.LineColor.toString(16);
                        obj.fillcolor = "#" + currentElement.FillStyle.FillColor.toString(16);
                        window.showModalDialog("html/userdata/texturePolygon.html",obj,"dialogWidth=400px;dialogHeight=540px;status=no");
                        if(obj.click ==="false") { return;}
                        docElement.getElementsByTagName("TextureImagePath")[0].text = obj.picture;
                        docElement.getElementsByTagName("ShadowType")[0].text = obj.shadow;
                        docElement.getElementsByTagName("TextureTiltX")[0].text = obj.expandX;
                        docElement.getElementsByTagName("TextureTiltY")[0].text = obj.expandY;
                        docElement.getElementsByTagName("TextureMode")[0].text = obj.textture;

                        docElement.getElementsByTagName("LineColor")[0].text = obj.linecolor;
                        docElement.getElementsByTagName("FillColor")[0].text = obj.fillcolor;
                        docElement.getElementsByTagName("LineWidth")[0].text = obj.linewidth;

                        // elements[i].getElementsByTagName("Perimeter")[0].text = obj.perimeter;
                        // elements[i].getElementsByTagName("Area")[0].text = obj.area;
                        //elements[i].getElementsByTagName("DrawOrder")[0].text = obj.drawOrder;

                    }else{
                        if(obj.type === 220){
                            obj.lineLength = currentElement.Length;
                        }
                        if (obj.type === 220 || obj.type === 239 || obj.type === 241 || obj.type  == 211){
                            window.showModalDialog("html/userdata/2DEdit.html",obj,"dialogWidth=400px;dialogHeight=530px;status=no");
                        }
                        else if (obj.type === 243){
                            window.showModalDialog("html/userdata/2DEdit.html",obj,"dialogWidth=400px;dialogHeight=570px;status=no");
                        }
                        if(obj.type === 240){
                            window.showModalDialog("html/userdata/2DEdit.html",obj,"dialogWidth=400px;dialogHeight=560px;status=no");
                        }

                        if(obj.click === "false") { return;}

                        docElement.getElementsByTagName("LineWidth")[0].text = obj.linewidth;
                        docElement.getElementsByTagName("ShadowColor")[0].text = obj.linecolor;
                        docElement.getElementsByTagName("LineColor")[0].text = obj.linecolor;

                        if(obj.type != 220){
                            docElement.getElementsByTagName("FillColor")[0].text = obj.fillcolor;
                            docElement.getElementsByTagName("ShadowType")[0].text = obj.shadow;
                        }
                        if(obj.type === 240){
                            docElement.getElementsByTagName("Angle")[0].text = obj.angle;
                        }
                        //半径
                        if(obj.type === 239 || obj.type === 240){
                            docElement.getElementsByTagName("Radius")[0].text = obj.radius;
                        }
                        if(obj.type === 220 ||obj.type === 241){
                            docElement.getElementsByTagName("isShadowArrow")[0].text = obj.arrow;
                        }
                    }

                    //新增属性 [周长 面积]obj.type === "texturePolygon" || obj.type === "rectangle"
                    if(obj.type === 211 || obj.type === 239 || obj.type === 243 || obj.type === 240 ){
                        docElement.getElementsByTagName("Perimeter")[0].text = obj.perimeter;
                        docElement.getElementsByTagName("Area")[0].text = obj.area;
                    }

                    docElement.getElementsByTagName("Selectable")[0].text = obj.selectable;
                    docElement.getElementsByTagName("Editable")[0].text = obj.editable;
                    docElement.getAttributeNode("name").nodeValue = obj.name;

                    if(obj.type === 220 || obj.type === 243 || obj.type === 240 || obj.type === 241 || obj.type  === 211){
                        docElement.getElementsByTagName("DrawOrder")[0].text = obj.drawOrder;
                    }

                    //半径
                    if(obj.type === 239 || obj.type === 240){
                        docElement.getElementsByTagName("Radius")[0].text = obj.radius;
                    }

                    //长轴半径 短轴半径
                    if(obj.type === 243){
                        docElement.getElementsByTagName("LongRadius")[0].text = obj.longRadius;
                        docElement.getElementsByTagName("ShortRadius")[0].text = obj.shortRadius;
                    }
                }

                //军标部分  tailSArrow 250  EqualSArrow = 251 TailSArrow = 252, CustomArrow = 253,  CustomTailArrow = 254,  DoubleArrow = 255,  XArrow = 256,  AssemblyArea = 260, trangleFlag = 257 rectFlag = 258 curveFlag = 259
                if(obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 257 || obj.type === 258 || obj.type === 259 || obj.type === 260 ){//军标编辑
                    obj.action = "edit";
                    obj.linewidth = currentElement.LineStyle.LineWidth;
                    obj.linecolor = "#" + currentElement.LineStyle.LineColor.toString(16);
                    obj.fillcolor = "#" + currentElement.FillStyle.FillColor.toString(16);

                    //新增属性
                    if(obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 260){
                        obj.drawOrder = currentElement.DrawOrder;
                        obj.selectable = currentElement.Selectable;
                        obj.editable = currentElement.Editable;
                    }

                    // obj.transparency=elements[i].getElementsByTagName("Transparency")[0].text;
                    obj.Shadow = currentElement.AltitudeType;
                    //obj.desc=elements[i].getElementsByTagName("Description")[0].text;

                    if(obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 260){
                        window.showModalDialog("html/userdata/MilitaryTagData.html",obj,"dialogWidth=400px;dialogHeight=450px;status=no");
                    } else {
                        window.showModalDialog("html/userdata/MilitaryTagData.html",obj,"dialogWidth=400px;dialogHeight=350px;status=no");
                    }

                    if(obj.click ==="false") { return;}
                    currentElement.name = obj.name;
                    docElement.getElementsByTagName("LineWidth")[0].text = obj.linewidth;
                    docElement.getElementsByTagName("LineColor")[0].text = obj.linecolor;
                    docElement.getElementsByTagName("FillColor")[0].text = obj.fillcolor;
                    // elements[i].getElementsByTagName("Transparency")[0].text = obj.transparency;
                    docElement.getElementsByTagName("Shadow")[0].text = obj.Shadow;
                    docElement.getElementsByTagName("Description")[0].text = obj.desc;
                    docElement.getAttributeNode("name").nodeValue = obj.name;
                    //新增属性
                    if(obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 260){
                        docElement.getElementsByTagName("DrawOrder")[0].text = obj.drawOrder;
                        docElement.getElementsByTagName("Selectable")[0].text = obj.selectable;
                        docElement.getElementsByTagName("Editable")[0].text = obj.editable;
                    }
                }

                //三维图元[编辑]
                if(obj.type === 216 || obj.type === 202 || obj.type === 207 || obj.type === 203 ||
                    obj.type === 204 || obj.type === 205 || obj.type === 206)
                {
                    obj.action="edit";
                    obj.name = currentElement.name;

                    obj.FillColor = "#" + currentElement.FillColor.toString(16);

                    //从三维显示对象中获取材质
                    var ary = [];
                    if(obj.type === 216){
                        var materialStyle = currentElement.MaterialStyles.Items(0);
                        ary.push("","", materialStyle.DiffuseTexture);
                    } else {
                        var count = currentElement.MaterialStyles.Count;
                        if(currentElement.MaterialStyles.Items(0)){//判断是否存在
                            for(var m = 0; m < count; m++){
                                var materialStyle = currentElement.MaterialStyles.Items(m);
                                ary.push(materialStyle.DiffuseTexture);
                            }
                        }
                    }
                    obj.texturePath = ary;

                    obj.selectable = currentElement.Selectable;
                    obj.editable = currentElement.Editable;
                    obj.objectFlagType = currentElement.Underground;

                    if(obj.type === 216 || obj.type === 203 || obj.type === 205){
                        obj.radius = currentElement.Radius;
                    }

                    if (obj.type === 202) {//长方体
                        obj.longValue = currentElement.Length;
                        obj.widthValue = currentElement.Width;
                        obj.heightValue = currentElement.Height;
                    } else if (obj.type === 207) {//立体多边形
                        obj.heightValue = currentElement.Height;
                    } else if (obj.type === 203) {//圆柱
                        obj.bottomRadius = currentElement.Radius;
                        obj.heightValue = currentElement.Height;
                    } else if (obj.type === 204) {//圆台
                        obj.bottomRadius = currentElement.BottomRadius;
                        obj.topRadius = currentElement.TopRadius;
                        obj.heightValue = currentElement.Height;
                    } else if (obj.type === 205) {//棱柱
                        obj.bottomRadius = currentElement.Radius;
                        obj.heightValue = currentElement.Height;
                        obj.sides = currentElement.Sides;
                    } else if (obj.type === 206) {//棱台
                        obj.bottomRadius = currentElement.BottomRadius;
                        obj.topRadius = currentElement.TopRadius;
                        obj.heightValue = currentElement.Height;
                        obj.sides = currentElement.Sides;
                    }

                    obj.earth = earth;
                    if(obj.type === 206){
                        window.showModalDialog("html/userdata/3DEdit.html",obj,"dialogWidth=400px;dialogHeight=550px;status=no");
                    } else if(obj.type === 216){
                        window.showModalDialog("html/userdata/3DEdit.html",obj,"dialogWidth=400px;dialogHeight=420px;status=no");
                    } else {
                        window.showModalDialog("html/userdata/3DEdit.html",obj,"dialogWidth=400px;dialogHeight=520px;status=no");
                    }
                    if(obj.click ==="false") { return;}
                    //alert(obj.type);
                    if(obj.type === 216){
                        docElement.getElementsByTagName("TexturePath")[1].text = obj.texturePath[2];
                        docElement.getElementsByTagName("Radius")[0].text=obj.radius;
                    } else{
                        docElement.getElementsByTagName("TexturePath")[0].text=obj.texturePath[0];
                        docElement.getElementsByTagName("TexturePath")[1].text=obj.texturePath[1];
                        docElement.getElementsByTagName("TexturePath")[2].text=obj.texturePath[2];
                    }
                    //alert(obj.FillColor[0].text);
                    docElement.getElementsByTagName("FillColor")[0].text=obj.fillcolor;
                    //新增接口
                    docElement.getElementsByTagName("Selectable")[0].text=obj.selectable;
                    docElement.getElementsByTagName("Editable")[0].text=obj.editable;
                    docElement.getElementsByTagName("ObjectFlagType")[0].text=obj.objectFlagType;

                    if (obj.type === 202) {//长方体
                        docElement.getElementsByTagName("Length")[0].text = obj.longValue;
                        docElement.getElementsByTagName("Width")[0].text = obj.widthValue;
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                    } else if (obj.type === 207) {//立体多边形
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                    } else if (obj.type === 203) {//圆柱
                        docElement.getElementsByTagName("Radius")[0].text = obj.bottomRadius;
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                    } else if (obj.type === 204) {//圆台
                        docElement.getElementsByTagName("Radius")[0].text = obj.bottomRadius;
                        docElement.getElementsByTagName("TopRadius")[0].text = obj.topRadius;
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                    } else if (obj.type === 205) {//棱柱
                        docElement.getElementsByTagName("Radius")[0].text = obj.bottomRadius;
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                        docElement.getElementsByTagName("Sides")[0].text = obj.sides;
                    } else if (obj.type === 206) {//棱台
                        docElement.getElementsByTagName("BottomRadius")[0].text = obj.bottomRadius;
                        docElement.getElementsByTagName("TopRadius")[0].text = obj.topRadius;
                        docElement.getElementsByTagName("Height")[0].text = obj.heightValue;
                        docElement.getElementsByTagName("Sides")[0].text = obj.sides;
                    }

                    docElement.getAttributeNode("name").nodeValue = obj.name;
                }

                //simplebuilding 280 model 229 SimpleBillboard 217 icon 209 guid 244
                if(obj.type === 280 || obj.type === 229 || obj.type === 217 || obj.type === 209 || obj.type === 244){
                    obj.action="edit";
                    obj.earth=earth;
                    obj.path= earth.Environment.RootPath ;
                    obj.longitude = currentElement.Longitude;
                    obj.latitude = currentElement.Latitude;
                    obj.altitude = currentElement.Altitude;
                    obj.name = currentElement.name;
                    if(obj.type === 229){
                        obj.link = currentElement.Link;
                        obj.deviNum = docElement.getElementsByTagName("devi_Num")[0].text;
        				obj.poleTypeID = docElement.getElementsByTagName("pole_Type_ID")[0].text;
        				obj.bulbNum = docElement.getElementsByTagName("bulb_Num")[0].text;
        				obj.manaDepaID = docElement.getElementsByTagName("mana_Depa_ID")[0].text;
        				obj.owneDepa = docElement.getElementsByTagName("owne_Depa")[0].text;
        				obj.mainDepa = docElement.getElementsByTagName("main_Depa")[0].text;
        				obj.Belo_No = docElement.getElementsByTagName("Belo_No")[0].text;
                        window.showModalDialog("html/userdata/modelData.html",obj,"dialogWidth=370px;dialogHeight=310px;status=no");
                        if(obj.click ==="false") { return;}
                        docElement.getElementsByTagName("Link")[0].text=obj.link;
                        docElement.getElementsByTagName("devi_Num")[0].text=obj.deviNum;
                        docElement.getElementsByTagName("pole_Type_ID")[0].text=obj.poleTypeID;
                        docElement.getElementsByTagName("bulb_Num")[0].text=obj.bulbNum;
                        docElement.getElementsByTagName("mana_Depa_ID")[0].text=obj.manaDepaID;
                        docElement.getElementsByTagName("owne_Depa")[0].text=obj.owneDepa;
                        docElement.getElementsByTagName("main_Depa")[0].text=obj.mainDepa;
                        docElement.getElementsByTagName("Belo_No")[0].text=obj.Belo_No;
                        
                    }else if(obj.type === 217){//广告牌
                        obj.width = currentElement.Width;
                        obj.height = currentElement.Height;
                        obj.iconFileName = currentElement.Image;//路径
                        window.showModalDialog("html/userdata/pictureData.html",obj,"dialogWidth=370px;dialogHeight=300px;status=no");
                        if(obj.click ==="false") { return;}
                        docElement.getElementsByTagName("Width")[0].text = obj.width;
                        docElement.getElementsByTagName("Height")[0].text = obj.height;
                        docElement.getElementsByTagName("Icon")[0].text = obj.iconFileName;
                    }else if(obj.type === 209){//二维图标
                        obj.name = currentElement.name;
                        obj.guid = currentElement.Guid;

                        obj.iconNormalFileName = currentElement.normalIcon.iconlink;
                        obj.iconSelectedFileName = currentElement.highlighticon.iconlink;

                        //新增属性
                        obj.textFormat = "0x" + currentElement.textFormat.toString(16);// elements[i].getElementsByTagName("textFormat")[0].text;
                        obj.textColor =  "#" + currentElement.TextColor.toString(16); // elements[i].getElementsByTagName("textColor")[0].text;
                        obj.textHorizontalScale = currentElement.TextHorizontalScale; // elements[i].getElementsByTagName("textHorizontalScale")[0].text;
                        obj.textVerticalScale  = currentElement.TextVerticalScale;
                        obj.showHandle = currentElement.ShowHandle;
                        obj.handleHeight = currentElement.HandleHeight;
                        obj.handleColor = "#" + currentElement.HandleColor.toString(16);
                        obj.minVisibleRange = currentElement.MinVisibleRange;
                        obj.maxVisibleRange = currentElement.MaxVisibleRange;
                        obj.selectable = currentElement.Selectable;
                        obj.editable = currentElement.Editable;
                        window.showModalDialog("html/userdata/iconData.html",obj,"dialogWidth=400px;dialogHeight=540px;status=no");
                        if(obj.click === "false") { return;}
                        docElement.getElementsByTagName("Icon")[0].text = obj.iconNormalFileName;
                        docElement.getElementsByTagName("Icon")[1].text = obj.iconSelectedFileName;

                        docElement.getElementsByTagName("TextFormat")[0].text = obj.textFormat;
                        docElement.getElementsByTagName("TextColor")[0].text = obj.textColor;
                        docElement.getElementsByTagName("TextHorizontalScale")[0].text = obj.textHorizontalScale;
                        docElement.getElementsByTagName("TextVerticalScale")[0].text = obj.textVerticalScale;
                        docElement.getElementsByTagName("ShowHandle")[0].text = obj.showHandle;
                        docElement.getElementsByTagName("HandleHeight")[0].text = obj.handleHeight;
                        docElement.getElementsByTagName("HandleColor")[0].text = obj.handleColor;
                        docElement.getElementsByTagName("MinVisibleRange")[0].text = obj.minVisibleRange;
                        docElement.getElementsByTagName("MaxVisibleRange")[0].text = obj.maxVisibleRange;
                        docElement.getElementsByTagName("Selectable")[0].text = obj.selectable;
                        docElement.getElementsByTagName("Editable")[0].text = obj.editable;

                    }else if(obj.type === 280){//SimpleBuilding 简单建筑

                        obj.floorCount = currentElement.GetFloorsCount();
                        obj.floorHeight = currentElement.GetFloorHeight();

                        var floorMats = currentElement.GetFloorsMaterialStyles();
                        //屋顶材质
                        obj.roofTexture = floorMats.Items(0).DiffuseTexture;
                        //楼层材质
                        for(var k=2; k<floorMats.Count; k++){
                            obj.floorTexture = floorMats.Items(k).DiffuseTexture;
                        }

                        obj.roofTypeNode = currentElement.GetRoofType();
                        //屋顶颜色
                        obj.roofColor = "#" + currentElement.RoofColor.toString(16);
                        //屋低颜色
                        obj.floorColor = "#" + currentElement.FloorsColor.toString(16);
                        //obj.desc=elements[i].getElementsByTagName("Description")[0].text;
                        window.showModalDialog("html/userdata/SimpleBuiliding.html",obj,"dialogWidth=370px;dialogHeight=400px;status=no");
                        if(obj.click ==="false") { return;}
                        docElement.getElementsByTagName("FloorCount")[0].text = obj.floorCount;
                        docElement.getElementsByTagName("FloorHeight")[0].text = obj.floorHeight;
                        docElement.getElementsByTagName("FloorTexture")[0].text = obj.floorTexture;
                        docElement.getElementsByTagName("RoofTexture")[0].text = obj.roofTexture;
                        docElement.getElementsByTagName("RoofType")[0].text = obj.roofTypeNode;
                        docElement.getElementsByTagName("RoofColor")[0].text = obj.roofColor;
                        docElement.getElementsByTagName("FloorColor")[0].text = obj.floorColor;
                    }else if(obj.type === 244){//Grid 晕染图
                        //这两个属性没有get方法 ... 等待底层添加
                        obj.height = currentElement.Altitude;
                        obj.path = currentElement.DataPath;
                        window.showModalDialog("html/userdata/gridData.html",obj,"dialogWidth=370px;dialogHeight=260px;status=no");
                        if(obj.click ==="false") { return;}
                        docElement.getElementsByTagName("Height")[0].text=obj.height;
                        docElement.getElementsByTagName("Link")[0].text=obj.path;
                    }
                }
                docElement.getAttributeNode("name").nodeValue = obj.name;
                //docElement.setAttribute("name",obj.name);
                var shadowType = docElement.getElementsByTagName("ShadowType");
                if(shadowType.length != 0){
                    shadowType[0].text = obj.shadow;
                }

                var str = JSON.stringify(obj.desc);
                if(str != undefined){
                    docElement.getElementsByTagName("Description")[0].text = obj.desc;
                }
                //给要素赋name属性
                currentElement.name = obj.name;

                _editElementToEarth(id, obj);
                var path= earth.Environment.RootPath + "userdata\\" + filename;
                earth.UserDocument.saveXmlFile(path,userDoc.xml);
            }
        }
        // _initDataArr(filename);
    };
    /**
     * 根据id得到对应的element对象
     * 是从userdataArr里还是从objArr里面?
     */
    var _getElementByID=function(id){
        var eleObj = null;
        if(saveTag=="save"){
            //userdataArr = objArr;
            for(var i=0; i < objArr.length; i++){
                var eobj = objArr[i];
                if(eobj && eobj.guid == id){
                    eleObj = eobj;
                }
            }
            return eleObj;
        }
        if(userdataArr == null) return null;
        for(var i=0;i<userdataArr.length;i++){
            var eobj = userdataArr[i];
            //alert(eobj.id + " " + eobj.guid);
            if(eobj && eobj.guid == id){
                eleObj = eobj;
            }
        }
        return eleObj;
    };
    /**
     * 图元或对象编辑以后在球上实时修改
     *
     */
    var _editElementToEarth=function(id, obj){
        var editObj = _getElementByID(id);

        //二维图元在球上实时修改//curve LineWidth LineColor IsAddArrow;sector FillColor
        //line 220 circle 239 ellipse 243 sector 240 curve 241 polygon 211 texturepolygon 245 rectangle 245
        if(obj.type === 220 || obj.type === 239 ||obj.type === 243 ||obj.type === 240 || obj.type === 241 || obj.type  === 211 || obj.type === 245){
            editObj.BeginUpdate();
            editObj.name = obj.name;
            if(obj.type === 220){
                editObj.LineStyle.LineWidth = obj.linewidth;
                editObj.LineStyle.LineColor =  parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase());
                editObj.IsAddArrow =obj.arrow;
            }else if( obj.type === 241 ){
                editObj.LineStyle.LineWidth = obj.linewidth;
                editObj.LineStyle.LineColor = parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase());
                editObj.FillStyle.FillColor =  parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
                editObj.IsAddArrow =obj.arrow;
            }else if(obj.type === 245){

                editObj.FillStyle.FillColor = parseInt("0x" + obj.fillcolor.toString().substring(1).toLowerCase() );;
                editObj.TextureImagePath = obj.picture;//"E:\\Users\\Administrator\\Desktop\\trunk\\trunk\\css\\zTree\\img\\diy\\1.png";
                editObj.TextureMode = obj.textture;  //  0 无纹理        1 平铺纹理   2 拉伸（必须四个顶点）
                editObj.TextureTiltX = obj.expandX; //  横向平铺重复次shu
                editObj.TextureTiltY = obj.expandY; //  纵向平铺重复次shu
                //alert(editObj.FillStyle.FillColor);
                editObj.LineStyle.LineColor = parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase() );//userdataObj.linecolor;
                editObj.LineStyle.LineWidth = obj.linewidth;
//				editObj.AltitudeType = obj.shadow; // 0绝对 1贴地
            }else{
                //alert(editObj.FillStyle.FillColor);
                editObj.FillStyle.FillColor =parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
                editObj.LineStyle.LineWidth=obj.linewidth;
                editObj.LineStyle.LineColor=parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase());
            }

            //对 折线 曲线 多边形 圆 椭圆 扇形 这六个支持"渲染顺序"属性
            if (obj.type === 220 || obj.type === 241 || obj.type === 211 || obj.type === 239 || obj.type === 243 || obj.type === 240) {
                editObj.DrawOrder = obj.drawOrder;
            }

            editObj.AltitudeType = obj.shadow;
            editObj.selectable = obj.selectable;
            editObj.editable = obj.editable;

            if(obj.type === 240){
                editObj.Angle = Number(obj.angle);
                editObj.radius = Number(obj.radius);
                //editObj.ArcCenter = obj.ArcCenter;
            }

            if(obj.type === 239){
                editObj.radius = Number(obj.radius);
            }

            if(obj.type === 243){
                editObj.LongRadius = obj.longRadius;
                editObj.ShortRadius = obj.shortRadius;
            }
            if(obj.type === 239 || obj.type === 243 || obj.type === 240){
                editObj.SphericalTransform.SetRotationEx(obj.rotation.x, obj.rotation.y, obj.rotation.z);
                editObj.SphericalTransform.SetScaleEx (obj.scale.x, obj.scale.y, obj.scale.z);
            }
            editObj.EndUpdate();
        }

        //军标图元在球上实时修改
        if(obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 257 || obj.type === 258 || obj.type === 259 || obj.type === 260 ){

            var vector3s=editObj.GetControlPointArray();
            editObj.BeginUpdate();

            //新增属性
            if (obj.type === 250 || obj.type === 251 || obj.type === 252 || obj.type === 253 || obj.type === 254 || obj.type === 255 || obj.type === 256 || obj.type === 260 ) {
                editObj.selectable = obj.selectable;
                editObj.editable = obj.editable;
                editObj.DrawOrder = obj.drawOrder;
                editObj.AltitudeType = obj.Shadow;
            }

            editObj.SetControlPointArray(vector3s);
            var linestyle = editObj.LineStyle;
            linestyle.LineWidth = obj.linewidth;
            linestyle.LineColor = parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase());
            var fillstyle = editObj.FillStyle;
            fillstyle.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
            //editObj.AltitudeType = obj.Shadow;
            editObj.EndUpdate();
            earth.AttachObject(editObj);

        }

        //三维图元在球上实时修改
        //sphere 216 box 202 volume 207 cylinder 203 cone 204 prism 205 pyramid 206
        if(obj.type === 216 || obj.type === 202 || obj.type === 207 || obj.type === 203 ||
            obj.type === 204 || obj.type === 205 || obj.type === 206){

            editObj.BeginUpdate();
            editObj.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
            //editObj.AltitudeType = obj.shadowType;

            //新增属性
            editObj.selectable = obj.selectable;
            editObj.editable = obj.editable;
            editObj.Underground = obj.objectFlagType;

            if(obj.type === 216){
                editObj.radius = obj.radius;
            }

            //立方体实时修改
            if(obj.type === 202){
                editObj.Height =  obj.heightValue;
                editObj.Width = obj.widthValue;
                editObj.Length = obj.longValue;
            }

            //立方体多边形实时修改
            if(obj.type === 207){
                editObj.Height =  obj.heightValue;
            }

            //圆柱实时修改
            if(obj.type === 203){
                editObj.radius = obj.bottomRadius;
                editObj.Height =  obj.heightValue;
            }

            //圆锥实时修改
            if(obj.type === 204){
                editObj.Height =  obj.heightValue;
                editObj.BottomRadius =  obj.bottomRadius;
                editObj.TopRadius =  obj.topRadius;
            }

            //棱柱实时修改
            if(obj.type === 205){
                //alert(obj.bottomRadius + " " + obj.heightValue + " " + obj.sides);
                editObj.Radius = obj.bottomRadius;
                editObj.Height =  obj.heightValue;
                editObj.Sides = obj.sides;
            }

            //棱锥实时修改
            if(obj.type === 206){
                editObj.Height =  obj.heightValue;
                editObj.BottomRadius =  obj.bottomRadius;
                editObj.TopRadius =  obj.topRadius;
                editObj.Sides = obj.sides;
            }

            var count = editObj.MaterialStyles.Count;
            for(var m=0; m<count; m++){
                var materialStyle =editObj.MaterialStyles.Items(m);
                materialStyle.DiffuseTexture=obj.texturePath[m];
                if(obj.type === 216){
                    materialStyle.DiffuseTexture=obj.texturePath[2];
                }
            }

            editObj.EndUpdate();
        }
        //导入数据在球上实时修改
        if(obj.type === 280 || obj.type === 229 || obj.type === 217 || obj.type === 209 || obj.type === 244){
            if(obj.type === 229){
                var model = earth.Factory.CreateEditModelByLocal(obj.id, obj.name, obj.link,3);
                model.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);

            }else if(obj.type === 217){
                editObj.BeginUpdate();
                editObj.Width = obj.width;
                editObj.Height = obj.height;
                editObj.Image = obj.iconFileName;
                editObj.EndUpdate();
            }else if(obj.type === 209){
                //alert(obj.iconNormalFileName +  " " + obj.iconSelectedFileName);
                var myicon = earth.Factory.CreateElementIcon(obj.guid, obj.name);
                var originIndex = editObj.guid;
                myicon.name = obj.name;
                myicon.Create( editObj.SphericalTransform.longitude, editObj.SphericalTransform.latitude, editObj.SphericalTransform.altitude, obj.iconNormalFileName, obj.iconSelectedFileName, obj.name );
                earth.DetachObject(editObj);
                //新增属性
                myicon.textFormat = parseInt(obj.textFormat);
                // myicon.textFormat = obj.textFormat;
                myicon.textColor = parseInt("0x" + obj.textColor.toString().substring(1).toLowerCase());
                myicon.textHorizontalScale = obj.textHorizontalScale;
                myicon.textVerticalScale  = obj.textVerticalScale;
                myicon.showHandle = obj.showHandle;
                myicon.handleHeight = obj.handleHeight;
                myicon.handleColor = parseInt("0x" + obj.handleColor.toString().substring(1).toLowerCase());
                myicon.minVisibleRange = parseInt(obj.minVisibleRange);
                myicon.maxVisibleRange =  parseInt(obj.maxVisibleRange);
                myicon.selectable = obj.selectable;
                myicon.editable = obj.editable;

                myicon.Visibility = true;
                earth.AttachObject(myicon);
                //userdataArr.push(myicon);
                for (var i = userdataArr.length - 1; i >= 0; i--) {
                    if (userdataArr[i].guid === originIndex) {
                        originIndex = i;
                        userdataArr.splice(i, 1, myicon);
                    }
                };

            }else if(obj.type===280){
                editObj.BeginUpdate();
                //editObj.AltitudeType = obj.shadowType;
                editObj.SetFloorHeight(obj.floorHeight);
                editObj.SetFloorsHeight(obj.floorHeight * obj.floorCount);
                editObj.SetRoofType(parseInt(obj.roofTypeNode));
                var roofcolor= parseInt("0x"+obj.roofColor.toString().substring(1).toLowerCase() );
                var floorcolor= parseInt("0x"+obj.floorColor.toString().substring(1).toLowerCase() );
                editObj.FloorsColor = floorcolor;
                editObj.RoofColor = roofcolor;
                var floorMats = editObj.GetFloorsMaterialStyles();
                floorMats.Items(0).DiffuseTexture = obj.roofTexture;
                floorMats.Items(1).DiffuseTexture = obj.roofTexture;
                for(var i=2; i<floorMats.Count; i++){
                    floorMats.Items(i).DiffuseTexture = obj.floorTexture;
                }

                //var roofMats = editObj.GetRoofMaterialStyles();
                //for(var i=0; i<roofMats.Count; i++){
                //roofMats.Items(1).DiffuseTexture =obj.roofTextureNode;
                //}
                editObj.EndUpdate();
            }else if(obj.type === 244){
                editObj.BeginUpdate();
                //grid.DataPath = obj.path;
                editObj.Altitude = obj.height;
                editObj.EndUpdate();
            }
        }
    };
    /**
     * 根据filename判断
     * 得到的本地用户数据是二维、三维还是导入模型
     */
    var getUserdata=function(filename) {//得到xmlData文件
        url = earth.Environment.RootPath+ "userdata\\"+filename+".xml";
        var xmlData = earth.UserDocument.loadXmlFile(url); // 加载xml文件；
        if (xmlData == "") {
            var userdataGUID = earth.Factory.createGuid();
            var userdataXml = "<Xml><ElementDocument id='" + userdataGUID + "' name='MyPlace' im0='folderOpen.gif' type='folder' checked='0' open='false'></ElementDocument></Xml>";
            var userdata = earth.Environment.RootPath + "userData\\"+filename;
            earth.UserDocument.saveXmlFile(userdata, userdataXml);
            xmlData = userdataXml;
        }
        return loadXMLStr(xmlData);
    }
    var getDefaultUserdata=function() {
        return getUserdata(filename);
    }

    /**
     *   是否绑定对象到Earth上
     */
    function attachObject(checked, obj){
        if (Number(checked) === 1) {
            obj.Visibility = true;
            obj.Selectable = true;
        } else {
            obj.Visibility = false;
            obj.Selectable = false;
        };
    };

    function setTransform (element, obj){
        var rotation = obj.getElementsByTagName("Rotation")[0].text;
        var scale = obj.getElementsByTagName("Scale")[0].text;
        var position = obj.getElementsByTagName("Position")[0].text;

        rotation = rotation.split(",");
        scale = scale.split(",");
        position = position.split(",");

        var objType = element.rtti;
        if(objType === 250 || objType === 251 || objType === 252 || objType === 253
            || objType === 254 || objType === 255 || objType === 256 || objType === 257
            || objType === 258 || objType === 259 || objType === 260){

        } else {
           // element.SphericalTransform.SetRotationEx(rotation[0], rotation[1], rotation[2]);
            //element.SphericalTransform.SetScaleEx (scale[0], scale[1], scale[2]);
           // element.SphericalTransform.SetLocationEx(Number(position[0]), Number(position[1]), Number(position[2]));
        }
    };

    /**
     * 解析本地xml构建地标对象，并将所有对象绑定在地球上，并显示
     */
    var getAllIconObjs =function ( currUserdataDoc){
        userdataArr=[];
        if(currUserdataDoc == null){
            return;
        }
        var element = currUserdataDoc.getElementsByTagName("Element");
        for(var i=0;i<element.length;i++){
            var obj={};
            var elementObj=element[i];
            var checked = elementObj.getAttribute("checked");
            obj.id = elementObj.getAttribute("id");
            obj.guid=obj.id;
            obj.name = elementObj.getAttribute("name");
            //alert(obj.name);
            obj.type=elementObj.getAttribute("type");
            obj.desc=elementObj.getElementsByTagName("Description")[0].text;
            var rotation=elementObj.getElementsByTagName("Rotation")[0].text;
            var scale=elementObj.getElementsByTagName("Scale")[0].text;
            rotation=rotation.split(",");
            scale=scale.split(",");
            if(elementObj.getElementsByTagName("FillColor")[0]){
                obj.fillColor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.fillcolor=obj.fillColor;
            }
            obj.longitude = elementObj.getElementsByTagName("Longitude")[0].text;
            obj.latitude = elementObj.getElementsByTagName("Latitude")[0].text;
            obj.altitude = elementObj.getElementsByTagName("Altitude")[0].text;
            obj.type = elementObj.getAttribute("type");
            var objType = Number(obj.type);
            //军标部分
            if(objType === 250 || objType === 251 || objType === 252 || objType === 253
                || objType === 254 || objType === 255 || objType === 256 || objType === 257
                || objType === 258 || objType === 259 || objType === 260){

                obj.fillColor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.lineColor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.fillcolor=obj.fillColor;
                obj.linecolor=obj.lineColor;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.Shadow=elementObj.getElementsByTagName("Shadow")[0].text;

                //新增属性
                if(objType === 250 || objType === 251 || objType === 252 || objType === 253
                    || objType === 254 || objType === 255 || objType === 256 || objType === 260){
                    obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;
                    obj.selectable=elementObj.getElementsByTagName("Selectable")[0].text;
                    obj.editable=elementObj.getElementsByTagName("Editable")[0].text;
                }
                var PointList =elementObj.getElementsByTagName("Coordinates")[0].text;
                var vecs=PointList.split(" ");
                var v3s = earth.Factory.CreateVector3s();
                for(var k = 0; k<vecs.length; k++){
                    var v = vecs[k].split(",");
                    var v3 = earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                obj.guid=obj.id;
                if(objType === 250){
                    var editObj = earth.Factory.CreateElementPlotSArrow(obj.id, obj.name);
                }else if (objType === 253){
                    var editObj = earth.Factory.CreateElementPlotCustomArrow(obj.id, obj.name);
                }else if(objType === 252){
                    var editObj = earth.Factory.CreateElementPlotTailSArrow(obj.id, obj.name);
                }else  if(objType === 254){
                    var editObj = earth.Factory.CreateElementPlotCustomTailArrow(obj.id, obj.name);
                }else if(objType === 251){
                    var editObj = earth.Factory.CreateElementPlotEqualSArrow(obj.id, obj.name);
                }else if(objType === 255){
                    var editObj = earth.Factory.CreateElementPlotDoubleArrow(obj.id, obj.name);
                }else if(objType === 256){
                    var editObj = earth.Factory.CreateElementPlotXArrow(obj.id, obj.name);
                }else if(objType === 260){
                    var editObj = earth.Factory.CreateElementPlotAssemblyArea(obj.id, obj.name);
                }else if(objType === 257){
                    var editObj = earth.Factory.CreateElementPlotTriangleFlag(obj.id, obj.name);
                }else if(objType === 258){
                    var editObj = earth.Factory.CreateElementPlotRectFlag(obj.id, obj.name);
                }else if(objType === 259){
                    var editObj = earth.Factory.CreateElementPlotCurveFlag(obj.id, obj.name);
                }
                editObj.BeginUpdate();
                editObj.name = obj.name;

                //新属性
                if(objType === 250 || objType === 251 || objType === 252 || objType === 253
                    || objType === 254 || objType === 255 || objType === 256 || objType === 260){
                    editObj.drawOrder = obj.drawOrder;//暂不支持
                    editObj.selectable = obj.selectable;
                    editObj.editable = obj.editable;
                    editObj.AltitudeType = parseInt(obj.Shadow);
                }

                //alert(editObj.AltitudeType);
                editObj.SetControlPointArray(obj.vector3s);
                var linestyle = editObj.LineStyle;
                linestyle.LineWidth = obj.lineWidth;
                //alert(obj.lineColor);
                linestyle.LineColor = parseInt("0x"+obj.lineColor.toString().substring(1).toLowerCase() );
                var fillstyle = editObj.FillStyle;
                fillstyle.FillColor = parseInt("0x"+obj.fillColor.toString().substring(1).toLowerCase() );

                editObj.EndUpdate();
                earth.AttachObject(editObj);
                //军标旋转后直接修改了原始坐标 不用给rotation赋值
                setTransform(editObj, elementObj);
                attachObject(checked, editObj);
                userdataArr.push(editObj);
                objArr.push(obj);
            } else if(obj.type === "fire" || obj.type === "mist" || obj.type === "fountain" || obj.type === "nozzle" || obj.type === "SprayNozzle" ){

                var pType = 0;
                switch(obj.type){
                    case "fire":
                        pType = 0;
                        break;
                    case "mist":
                        pType = 1;
                        break;
                    case "fountain":
                        pType = 2;
                        break;
                    case "nozzle":
                        pType = 3;
                        break;
                    case "SprayNozzle":
                        pType = 4;
                        break;
                    default:
                        pType = 0;
                        break;
                }

                var particle = earth.factory.CreateElementParticle(obj.id,  obj.name);
                obj.guid = obj.id;
                //获取位置
                var pt = elementObj.getElementsByTagName("Position")[0].text.split(",");
                particle.SphericalTransform.SetLocationEx(pt[0],pt[1],pt[2]);
                particle.BeginUpdate();
                //火 = 0,  烟 = 1,  喷泉 = 2, 直流水枪 = 3,   喷雾水枪 = 4
                particle.Type = pType;
                particle.name = obj.name;
                particle.EndUpdate();
                earth.AttachObject(particle);
                setTransform(particle, elementObj);
                var checked = elementObj.getAttribute("checked");

                if(Number(checked) === 1) {
                    particle.Visibility = true;
                    particle.Selectable = true;
                } else {
                    particle.Visibility = false;
                    particle.Selectable = true;
                }
                userdataArr.push(particle);
                objArr.push(obj);
                // particles[record["ID"]] = particle;

            }else if(obj.type === "dWater"){
                var editObj = earth.Factory.CreateElementWater(obj.id, obj.name);
                obj.guid = obj.id;
                var pt = elementObj.getElementsByTagName("Position")[0].text.split(",");
                editObj.SphericalTransform.SetLocationEx(pt[0],pt[1],pt[2]);
                editObj.BeginUpdate();
                editObj.name = obj.name;
                editObj.EndUpdate();
                earth.AttachObject(editObj);
                setTransform(editObj, elementObj);
                userdataArr.push(editObj);
                objArr.push(obj);
            }
            else if(Number(obj.type) === 220){//初始化线条
                obj.lineColor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;
                obj.fillcolor=obj.fillColor;
                obj.linecolor=obj.lineColor;
                obj.arrow=elementObj.getElementsByTagName("isShadowArrow")[0].text;
                obj.shadow = elementObj.getElementsByTagName("ShadowType")[0].text;
                var Coordinates =elementObj.getElementsByTagName("Coordinates")[0].text;
                var vecs=Coordinates.split(" ");
                var v3s = earth.Factory.CreateVector3s();
                for(var j = 0; j<vecs.length; j++){
                    var v = vecs[j].split(",");
                    var v3 = earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                var visibility = elementObj.selectSingleNode("Visibility").text;
                //iconObj.Visibility = visibility;
                var lineObj = earth.Factory.CreateElementLine(obj.id, obj.name);
                //var lineColor=obj.lineColor.toString().substring(1).toLowerCase();
                lineObj.BeginUpdate();
                lineObj.name = obj.name;
                lineObj.SetPointArray(obj.vector3s);
                lineObj.Visibility = true;
                var Linestyle=lineObj.LineStyle;
                Linestyle.LineWidth = obj.lineWidth;
                lineObj.IsAddArrow =obj.arrow;
                Linestyle.LineColor = parseInt("0x"+obj.lineColor.toString().substring(1).toLowerCase());
                lineObj.AltitudeType = parseInt(obj.shadow);

                // lineObj.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                //lineObj.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);

                //获取经纬度值 获取postion 传入
                //lineObj.SphericalTransform.SetLocationEx();

                lineObj.selectable = elementObj.getElementsByTagName("Selectable")[0].text;
                lineObj.editable = elementObj.getElementsByTagName("Editable")[0].text;
                lineObj.drawOrder = obj.drawOrder;

                lineObj.EndUpdate();
                setTransform(lineObj, elementObj);
                earth.AttachObject(lineObj);
                attachObject(checked, lineObj);
                userdataArr.push(lineObj);
                objArr.push(obj);
            }else if(Number(obj.type) === 245){//多边形贴图 矩形贴图
                obj.shadow=elementObj.getElementsByTagName("ShadowType")[0].text;
                obj.expandX=elementObj.getElementsByTagName("TextureTiltX")[0].text;
                obj.expandY=elementObj.getElementsByTagName("TextureTiltY")[0].text;
                obj.picture=elementObj.getElementsByTagName("TextureImagePath")[0].text;
                obj.fillcolor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.linecolor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.textture=elementObj.getElementsByTagName("TextureMode")[0].text;
                //新增
                // obj.perimeter = elementObj.getElementsByTagName("Perimeter")[0].text;
                // obj.area = elementObj.getElementsByTagName("Area")[0].text;
                //obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;

                var Coordinates =elementObj.getElementsByTagName("Coordinates")[0].text;

                var vecs=Coordinates.split(" ");
                var v3s = earth.Factory.CreateVector3s();
                for(var j = 0; j<vecs.length; j++){
                    var v = vecs[j].split(",");
                    var v3 = earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                var polygon = earth.Factory.CreateElementTexturePolygon(obj.id, obj.name);
                polygon.BeginUpdate();
                polygon.name = obj.name;
                polygon.SetExteriorRing(obj.vector3s);

                polygon.FillStyle.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase() );
                polygon.TextureImagePath = obj.picture;//"E:\\Users\\Administrator\\Desktop\\trunk\\trunk\\css\\zTree\\img\\diy\\1.png";
                polygon.TextureMode =  parseInt(obj.textture);  //  0 无纹理        1 平铺纹理   2 拉伸（必须四个顶点）
                polygon.TextureTiltX = parseInt( obj.expandX); //  横向平铺重复次shu
                polygon.TextureTiltY =  parseInt(obj.expandY); //  纵向平铺重复次shu

                polygon.LineStyle.LineColor = parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase() );//userdataObj.linecolor;
                polygon.LineStyle.LineWidth = parseInt( obj.lineWidth);
                polygon.AltitudeType =  parseInt(obj.shadow); // 0绝对 1贴地
                //polygon.drawOrder = obj.drawOrder;
                //polygon.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                //polygon.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                polygon.EndUpdate();
                setTransform(polygon, elementObj);
                earth.AttachObject(polygon);
                attachObject(checked, polygon);
                userdataArr.push(polygon);
                objArr.push(obj);
            }else if(Number(obj.type) === 211){//多边形
                obj.fillColor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.lineColor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                //新增
                obj.perimeter = elementObj.getElementsByTagName("Perimeter")[0].text;
                obj.area = elementObj.getElementsByTagName("Area")[0].text;
                obj.drawOrder = elementObj.getElementsByTagName("DrawOrder")[0].text;

                obj.linecolor=obj.lineColor;
                obj.fillcolor=obj.fillColor;
                obj.shadow = elementObj.getElementsByTagName("ShadowType")[0].text;
                var Coordinates =elementObj.getElementsByTagName("Coordinates")[0].text;
                var vecs=Coordinates.split(" ");
                var v3s = earth.Factory.CreateVector3s();
                for(var j = 0; j<vecs.length; j++){
                    var v = vecs[j].split(",");
                    var v3 = earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                var polygon = earth.Factory.CreateElementPolygon(obj.id , obj.name);
                polygon.BeginUpdate();
                polygon.name = obj.name;
                polygon.SetExteriorRing(obj.vector3s);
                polygon.FillStyle.FillColor = parseInt("0x" + obj.fillColor.toString().substring(1).toLowerCase() );
                polygon.LineStyle.LineColor = parseInt("0x" + obj.lineColor.toString().substring(1).toLowerCase() );

                polygon.LineStyle.LineWidth = obj.lineWidth;
                polygon.drawOrder = obj.drawOrder;
                //alert(obj.shadow);
                polygon.AltitudeType = obj.shadow;
                polygon.Visibility = true;

                polygon.EndUpdate();
                setTransform(polygon, elementObj);
                earth.AttachObject(polygon);
                attachObject(checked, polygon);
                objArr.push(obj);
                userdataArr.push(polygon);
            }else if(Number(obj.type) === 239){//圆

                obj.Radius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.fillcolor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.lineColor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.shadow = elementObj.getElementsByTagName("ShadowType")[0].text;
                //新增
                obj.perimeter = elementObj.getElementsByTagName("Perimeter")[0].text;
                obj.area = elementObj.getElementsByTagName("Area")[0].text;

                //obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;
                obj.selectable=elementObj.getElementsByTagName("Selectable")[0].text;
                obj.editable=elementObj.getElementsByTagName("Editable")[0].text;

                //圆目前不支持该属性
                //obj.drawOrder = elementObj.getElementsByTagName("DrawOrder")[0].text;

                obj.guid=obj.id;
                obj.linecolor=obj.lineColor;
                var circle = earth.Factory.CreateElementCircle(obj.id, obj.name);
                circle.name = obj.name;
                var tran = circle.SphericalTransform;
                tran.SetLocationEx(obj.longitude, obj.latitude, obj.altitude);
                circle.BeginUpdate();
                circle.Radius = obj.Radius;

                circle.Selectable = obj.selectable;
                circle.Editable = obj.editable;
                //circle.drawOrder = obj.drawOrder;
                circle.AltitudeType = obj.shadow;
                circle.FillStyle.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase() );// 0xccff00ff;
                circle.LineStyle.LineWidth = obj.lineWidth;
                circle.LineStyle.LineColor =parseInt("0x"+obj.lineColor.toString().substring(1).toLowerCase() );// 0xccff00ff;
                circle.EndUpdate();
                earth.AttachObject(circle);
                setTransform(circle, elementObj);
                attachObject(checked, circle);
                userdataArr.push(circle);
                objArr.push(obj);
            }else if(Number(obj.type) === 243){//椭圆
                obj.fillcolor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.ShortRadius=elementObj.getElementsByTagName("ShortRadius")[0].text;
                obj.LongRadius=elementObj.getElementsByTagName("LongRadius")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.lineColor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.shadow = elementObj.getElementsByTagName("ShadowType")[0].text;
                //新增
                obj.perimeter = elementObj.getElementsByTagName("Perimeter")[0].text;
                obj.area = elementObj.getElementsByTagName("Area")[0].text;
                obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;

                obj.selectable=elementObj.getElementsByTagName("Selectable")[0].text;
                obj.editable=elementObj.getElementsByTagName("Editable")[0].text;

                obj.guid=obj.id;
                obj.linecolor=obj.lineColor;
                var ellipse = earth.Factory.CreateElementEllipse(obj.id, obj.name);
                ellipse.name = obj.name;
                var tran = ellipse.SphericalTransform;
                tran.SetLocationEx(obj.longitude, obj.latitude, obj.altitude);
                ellipse.BeginUpdate();
                ellipse.LongRadius = obj.LongRadius;
                ellipse.ShortRadius = obj.ShortRadius;
                //ellipse.drawOrder = obj.drawOrder;
                ellipse.Selectable = obj.selectable;
                ellipse.Editable = obj.editable;

                var fillstyle = ellipse.FillStyle;
                fillstyle.FillColor =  parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase() );//0xcc00ff00;
                ellipse.LineStyle.LineWidth = obj.lineWidth;
                ellipse.LineStyle.LineColor = parseInt("0x"+obj.lineColor.toString().substring(1).toLowerCase() );//0xcc00ff00;
                ellipse.AltitudeType = obj.shadow;
                ellipse.EndUpdate();
                ellipse.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                ellipse.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                earth.AttachObject(ellipse);
                setTransform(ellipse, elementObj);
                attachObject(checked, ellipse);
                userdataArr.push(ellipse);
                objArr.push(obj);
            }else if(Number(obj.type) === 240){
                obj.fillcolor=elementObj.getElementsByTagName("FillColor")[0].text;
                obj.linecolor=elementObj.getElementsByTagName("LineColor")[0].text;
                obj.lineWidth=elementObj.getElementsByTagName("LineWidth")[0].text;
                var ArcCenterList =elementObj.getElementsByTagName("ArcCenter")[0].text.split(",");
                obj.Angle =elementObj.getElementsByTagName("Angle")[0].text;
                obj.radius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.shadow = elementObj.getElementsByTagName("ShadowType")[0].text;
                //新增
                obj.perimeter = elementObj.getElementsByTagName("Perimeter")[0].text;
                obj.area = elementObj.getElementsByTagName("Area")[0].text;
                //obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;

                obj.selectable=elementObj.getElementsByTagName("Selectable")[0].text;
                obj.editable=elementObj.getElementsByTagName("Editable")[0].text;

                obj.guid=obj.id;
                obj.ArcCenter= earth.Factory.CreateVector3();
                obj.ArcCenter.X =ArcCenterList[0];
                obj.ArcCenter.Y =ArcCenterList[1];
                obj.ArcCenter.Z =ArcCenterList[2];
                //obj.ArcCenter.AddVector(v31);
                var sector = earth.Factory.CreateElementSector(obj.id,  obj.name);
                sector.name = obj.name;
                var tran = sector.SphericalTransform;
                tran.SetLocationEx(obj.longitude, obj.latitude, obj.altitude);
                sector.BeginUpdate();
                sector.ArcCenter = obj.ArcCenter;
                sector.Angle = obj.Angle;
                sector.radius = obj.radius;
                sector.Selectable = obj.selectable;
                sector.Editable = obj.editable;
                //sector.drawOrder = obj.drawOrder;
                sector.AltitudeType = obj.shadow;
                sector.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                sector.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var fillstyle = sector.FillStyle;
                fillstyle.FillColor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase() );//4294963200;
                var sectorStyle = sector.LineStyle;

                sectorStyle.LineWidth =obj.lineWidth;
                sectorStyle.LineColor =parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase() );//4294963200;

                sector.EndUpdate();
                sector.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                sector.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                earth.AttachObject(sector);
                setTransform(sector, elementObj);
                attachObject(checked, sector);
                userdataArr.push(sector);
                objArr.push(obj);
            }else if(Number(obj.type) === 241){
                if (elementObj.getElementsByTagName("ShadowType")[0]) {
                    obj.shadow=elementObj.getElementsByTagName("ShadowType")[0].text;
                };

                if(elementObj.getElementsByTagName("LineColor")[0]){
                    obj.linecolor=elementObj.getElementsByTagName("LineColor")[0].text;
                }

                if (obj.arrow=elementObj.getElementsByTagName("isShadowArrow")[0]) {
                    obj.arrow=elementObj.getElementsByTagName("isShadowArrow")[0].text;
                };
                obj.lineWidth= elementObj.getElementsByTagName("LineWidth")[0].text;
                obj.drawOrder=elementObj.getElementsByTagName("DrawOrder")[0].text;
                var PointList;
                if(elementObj.getElementsByTagName("Coordinates")[0]){
                    PointList =elementObj.getElementsByTagName("Coordinates")[0].text;
                    var vecs=PointList.split(" ");
                    var v3s = earth.Factory.CreateVector3s();
                    for(var k = 0; k<vecs.length; k++){
                        var v = vecs[k].split(",");
                        var v3 = earth.Factory.CreateVector3();
                        v3.X =v[0];
                        v3.Y =v[1];
                        v3.Z =v[2];
                        v3s.AddVector(v3);
                    }
                    obj.vector3s=v3s;
                }

                obj.guid=obj.id;
                var curve = earth.Factory.CreateElementCurve(obj.id, obj.name);
                curve.name = obj.name;
                curve.BeginUpdate();
                if(obj.vector3s){
                    curve.SetControlPointArray(obj.vector3s);
                }
                var linestyle = curve.LineStyle;
                linestyle.LineWidth =obj.lineWidth;
                if(obj.linecolor){
                    linestyle.LineColor =parseInt("0x"+obj.linecolor.toString().substring(1).toLowerCase());//0xffffff00;
                }
                curve.AltitudeType = obj.shadow;
                if(obj.arrow){
                    curve.IsAddArrow = obj.arrow;
                }
                curve.drawOrder = obj.drawOrder;
                //curve.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                //curve.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                curve.EndUpdate();
                earth.AttachObject(curve);
                setTransform(curve, elementObj);
                attachObject(checked, curve);
                userdataArr.push(curve);
                objArr.push(obj);
            }else if(Number(obj.type) === 216){
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.Radius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.selectable = elementObj.getElementsByTagName("Selectable")[0].text;
                obj.editable = elementObj.getElementsByTagName("Editable")[0].text;
                obj.objectFlagType = elementObj.getElementsByTagName("ObjectFlagType")[0].text;

                var fillcolor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
                var radData =  obj.Radius;
                //var params = this.getTextureParams(obj);      
                var sphere = earth.Factory.CreateElementSphere(obj.id, obj.name);
                /*var  rotation=obj.Rotation;*/
                var tran = sphere.SphericalTransform;
                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                sphere.name = obj.name;
                sphere.BeginUpdate();
                sphere.Radius = obj.Radius;
                sphere.selectable = obj.selectable;
                sphere.editable = obj.editable;
                sphere.Underground = obj.objectFlagType;
                sphere.FillColor = fillcolor;
                sphere.Visibility = true;
                //sphere.Name=obj.name;
                sphere.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                sphere.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var materialStyles = sphere.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0;m<count;m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[1];
                }
                sphere.EndUpdate();
                earth.AttachObject(sphere);
                setTransform(sphere, elementObj);
                attachObject(checked, sphere);
                userdataArr.push(sphere);
                objArr.push(obj);
            }else if(Number(obj.type) === 202){//立方体
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.widthValue=elementObj.getElementsByTagName("Width")[0].text;
                obj.longValue=elementObj.getElementsByTagName("Length")[0].text;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;

                var fillcolor = parseInt("0x"+obj.fillColor.toString().substring(1).toLowerCase());
                var visibility =  true;
                var box = earth.Factory.CreateElementBox(obj.id, obj.name);
                box.name = obj.name;
                var tran = box.SphericalTransform;
                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                box.BeginUpdate();
                box.Width = obj.widthValue;
                box.Length = obj.longValue;
                box.Height = obj.heightValue;
                box.FillColor = fillcolor;
                box.Visibility = visibility;
                box.Name=obj.name;
                box.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                box.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var materialStyles = box.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0; m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }
                box.EndUpdate();
                earth.AttachObject(box);
                setTransform(box, elementObj);
                attachObject(checked, box);
                userdataArr.push(box);
                objArr.push(obj);
            }else if(Number(obj.type) === 207){//立体多边形
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;
                var PointList =elementObj.getElementsByTagName("PointList")[0].text;
                var vecs=PointList.split(" ");
                var v3s = earth.Factory.CreateVector3s();
                for(var k = 0; k<vecs.length; k++){
                    var v = vecs[k].split(",");
                    var v3 = earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                obj.guid=obj.id;
                var fillcolor = parseInt("0x"+obj.fillColor.toString().substring(1).toLowerCase());
                var volume = earth.Factory.CreateElementVolume(obj.id, obj.name);
                volume.name = obj.name;
                setTransform(volume, elementObj);
                volume.BeginUpdate();
                volume.Underground = true;

                volume.Height = obj.heightValue;
                volume.Visibility = true;
                //volume.Name = obj.name;
                volume.Vectors=obj.vector3s;
                volume.FillColor = fillcolor;
                //volume.Description=obj.description;
                var materialStyles = volume.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0; m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }
                volume.EndUpdate();
                earth.AttachObject(volume);

                attachObject(checked, volume);
                userdataArr.push(volume);
                objArr.push(obj);
            }else if(Number(obj.type) === 203){//圆柱
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.bottomRadius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;

                var fillcolor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
                var cylinder = earth.Factory.CreateElementCylinder(obj.id, obj.name);
                cylinder.name = obj.name;
                var tran = cylinder.SphericalTransform;
                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                cylinder.BeginUpdate();
                cylinder.Radius = obj.bottomRadius;
                cylinder.Height = obj.heightValue;
                cylinder.Visibility = true;
                //cylinder.Name=obj.name;
                cylinder.FillColor = fillcolor;
                cylinder.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                cylinder.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var materialStyles = cylinder.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0; m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }

                cylinder.EndUpdate();
                earth.AttachObject(cylinder);
                setTransform(cylinder, elementObj);
                attachObject(checked, cylinder);
                userdataArr.push(cylinder);
                objArr.push(obj);
            }else if(Number(obj.type) === 204){//圆锥
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.topRadius=elementObj.getElementsByTagName("TopRadius")[0].text;
                obj.bottomRadius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;

                var fillcolor = parseInt("0x"+obj.fillColor.toString().substring(1).toLowerCase());
                var radiusBottom = obj.BottomRadius;
                var radiusTop = obj.TopRadius;
                var height = obj.Height;
                var cone = earth.Factory.CreateElementCone(obj.id, obj.name);
                cone.name = obj.name;
                var tran = cone.SphericalTransform;

                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                cone.BeginUpdate();
                cone.BottomRadius = obj.bottomRadius;
                cone.TopRadius = obj.topRadius;
                cone.Height = obj.heightValue;
                //cone.Name=obj.name;
                cone.Visibility = true;
                cone.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                cone.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                cone.FillColor = fillcolor;
                var materialStyles = cone.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0;m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }
                cone.EndUpdate();
                earth.AttachObject(cone);
                setTransform(cone, elementObj);
                attachObject(checked, cone);
                userdataArr.push(cone);
                objArr.push(obj);
            }else if(Number(obj.type) === 205){//棱柱
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.bottomRadius=elementObj.getElementsByTagName("Radius")[0].text;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;
                obj.sides=elementObj.getElementsByTagName("Sides")[0].text;

                var fillcolor = parseInt("0x"+obj.fillcolor.toString().substring(1).toLowerCase());
                var prism = earth.Factory.CreateElementPrism(obj.id, obj.name);
                prism.name = obj.name;
                var tran = prism.SphericalTransform;
                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                prism.BeginUpdate();
                prism.Radius = obj.bottomRadius;
                prism.Height = obj.heightValue;
                prism.Sides = obj.sides;
                prism.Visibility = true;
                prism.FillColor = fillcolor;
                prism.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                prism.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var materialStyles = prism.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0; m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }

                prism.EndUpdate();
                earth.AttachObject(prism);
                setTransform(prism, elementObj);
                attachObject(checked, prism);
                userdataArr.push(prism);
                objArr.push(obj);
            }else if(Number(obj.type) === 206){//棱锥
                var texturePath=elementObj.getElementsByTagName("TexturePath");
                var texturePathCount=texturePath.length;
                var texturesArr=[];
                for(var j=0;j<texturePathCount;j++){
                    texturesArr.push(texturePath[j].text);
                }
                obj.guid=obj.id;
                obj.textures=texturesArr;
                obj.texturePath=texturesArr;
                obj.topRadius=elementObj.getElementsByTagName("TopRadius")[0].text;
                obj.bottomRadius=elementObj.getElementsByTagName("BottomRadius")[0].text;
                obj.heightValue=elementObj.getElementsByTagName("Height")[0].text;
                obj.sides=elementObj.getElementsByTagName("Sides")[0].text;

                var fillcolor = parseInt("0x"+obj.fillColor.toString().substring(1).toLowerCase());
                var pyramid = earth.Factory.CreateElementPyramid(obj.id, obj.name);
                pyramid.name = obj.name;
                var tran = pyramid.SphericalTransform;
                tran.SetLocationEx( obj.longitude,obj.latitude,obj.altitude);
                pyramid.BeginUpdate();

                pyramid.Sides = obj.sides;
                pyramid.BottomRadius = obj.bottomRadius;
                pyramid.TopRadius = obj.topRadius;
                pyramid.Height = obj.heightValue;
                pyramid.Visibility = true;
                pyramid.Name = obj.name;
                pyramid.FillColor = fillcolor;
                pyramid.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                pyramid.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                var materialStyles = pyramid.MaterialStyles;
                var count = materialStyles.Count;
                for(var m=0; m<count; m++){
                    var materialStyle = materialStyles.Items(m);
                    materialStyle.DiffuseTexture=obj.textures[m];
                }
                pyramid.EndUpdate();
                earth.AttachObject(pyramid);
                setTransform(pyramid, elementObj);
                attachObject(checked, pyramid);
                userdataArr.push(pyramid);
                objArr.push(obj);
            }else if(Number(obj.type) === 229){
                obj.strLink = elementObj.getElementsByTagName("Link")[0].text;
                if(elementObj.getElementsByTagName("Tag").length>0){
                    obj.tag =elementObj.getElementsByTagName("Tag")[0].text;
                } else {
                    obj.tag = 3;
                }
                obj.link=obj.strLink;
                obj.guid=obj.id;
                var model = earth.Factory.CreateEditModelByLocal(obj.id, obj.name, obj.strLink, obj.tag);
                //model.SetIsCollapse(true)   ;
                model.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
                model.Name=obj.name;
                model.Selectable = true;
                model.Editable = true;
                earth.AttachObject(model);
                setTransform(model, elementObj);
                userdataArr.push(model);
                objArr.push(obj);
            }else if(Number(obj.type) === 217){
                obj.width=elementObj.getElementsByTagName("Width")[0].text;
                obj.height=elementObj.getElementsByTagName("Height")[0].text;
                obj.imag=elementObj.getElementsByTagName("Icon")[0].text;
                obj.iconFileName=obj.imag;
                obj.guid=obj.id;
                var billboard = earth.Factory.CreateElementSimpleBillboard( obj.id, obj.name);
                billboard.name = obj.name;
                billboard.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
                billboard.BeginUpdate();
                billboard.Width = Number(obj.width) ;
                billboard.Height = Number(obj.height) ;
                billboard.Image =obj.imag;
                //billboard.Name=obj.name;
                billboard.Visibility = true;
                billboard.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                billboard.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                billboard.EndUpdate();
                setTransform(billboard, elementObj);
                earth.AttachObject(billboard);
                attachObject(checked, billboard);
                userdataArr.push(billboard);
                objArr.push(obj);
            }else if(Number(obj.type) === 209){
                var strIcon = elementObj.getElementsByTagName("Icon")[0].text;
                var strHightlightIcon =elementObj.getElementsByTagName("Icon")[1].text;
                obj.iconNormalFileName=strIcon;
                obj.guid=obj.id;
                obj.iconSelectedFileName=strHightlightIcon;
                var myicon = earth.Factory.CreateElementIcon(obj.id, obj.name);
                myicon.name = obj.name;
                myicon.Create( obj.longitude,obj.latitude,obj.altitude, strIcon, strHightlightIcon, obj.name );

                //新增属性
                myicon.textFormat = parseInt("0x100");
                var textColor = elementObj.getElementsByTagName("TextColor")[0].text;
                myicon.textColor = parseInt("0x" + textColor.toString().substring(1).toLowerCase());
                myicon.textHorizontalScale = elementObj.getElementsByTagName("TextHorizontalScale")[0].text;
                myicon.textVerticalScale  = elementObj.getElementsByTagName("TextVerticalScale")[0].text;
                myicon.showHandle = elementObj.getElementsByTagName("ShowHandle")[0].text;
                myicon.handleHeight = elementObj.getElementsByTagName("HandleHeight")[0].text;
                var handleColor = elementObj.getElementsByTagName("HandleColor")[0].text;
                myicon.handleColor = parseInt("0x" + handleColor.toString().substring(1).toLowerCase());
                myicon.minVisibleRange = elementObj.getElementsByTagName("MinVisibleRange")[0].text;
                myicon.MaxVisibleRange = elementObj.getElementsByTagName("MaxVisibleRange")[0].text;
                myicon.selectable = elementObj.getElementsByTagName("Selectable")[0].text;
                myicon.editable = elementObj.getElementsByTagName("Editable")[0].text;

                myicon.Visibility = true;
                //myicon.Name= obj.name;
                myicon.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                myicon.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                earth.AttachObject(myicon);
                setTransform(myicon, elementObj);
                attachObject(checked, myicon);
                userdataArr.push(myicon);
                objArr.push(obj);
            }else if(Number(obj.type) === 280){
                obj.floorHeight = elementObj.getElementsByTagName("FloorHeight")[0].text;
                obj.floorCount = elementObj.getElementsByTagName("FloorCount")[0].text;
                obj.roofType = elementObj.getElementsByTagName("RoofType")[0].text;
                obj.floorTexture = elementObj.getElementsByTagName("FloorTexture")[0].text;
                obj.roofTexture = elementObj.getElementsByTagName("RoofTexture")[0].text;
                obj.roofColor=elementObj.getElementsByTagName("RoofColor")[0].text;
                obj.floorColor=elementObj.getElementsByTagName("FloorColor")[0].text;
                var PointList =elementObj.getElementsByTagName("PointList")[0].text;
                var vecs=PointList.split(" ");
                var v3s =earth.Factory.CreateVector3s();
                for(var k = 0; k<vecs.length; k++){
                    var v = vecs[k].split(",");
                    var v3 =earth.Factory.CreateVector3();
                    v3.X =v[0];
                    v3.Y =v[1];
                    v3.Z =v[2];
                    v3s.AddVector(v3);
                }
                obj.vector3s=v3s;
                obj.guid=obj.id;
                obj.roofTypeNode=obj.roofType;
                var simpleBuilding = earth.factory.CreateSimpleBuilding(obj.id, obj.name);
                simpleBuilding.name = obj.name;
                simpleBuilding.SphericalTransform.SetLocationEx(obj.longitude,obj.latitude,obj.altitude);
                simpleBuilding.BeginUpdate();
                var polygon = earth.factory.CreatePolygon();
                polygon.AddRing(obj.vector3s);
                simpleBuilding.SetPolygon(0,polygon);
                var floorCount = parseInt(obj.floorCount);
                var floorHeight = parseFloat(obj.floorHeight);
                simpleBuilding.SetFloorsHeight(obj.floorHeight * obj.floorCount);
                simpleBuilding.SetFloorHeight(obj.floorHeight);
                simpleBuilding.SetRoofType(obj.roofType);
                var roofcolor= parseInt("0x"+obj.roofColor.toString().substring(1).toLowerCase() );
                var floorcolor= parseInt("0x"+obj.floorColor.toString().substring(1).toLowerCase() );
                simpleBuilding.FloorsColor = floorcolor;
                simpleBuilding.RoofColor = roofcolor;
                var floorMats = simpleBuilding.GetFloorsMaterialStyles();
                floorMats.Items(0).DiffuseTexture = obj.roofTexture;
                floorMats.Items(1).DiffuseTexture = obj.roofTexture;
                for(var m=2; m<floorMats.Count; m++){
                    floorMats.Items(m).DiffuseTexture = obj.floorTexture;
                }
                var roofMats = simpleBuilding.GetRoofMaterialStyles();
                //for(var i=0; i<roofMats.Count; i++){
                roofMats.Items(1).DiffuseTexture = obj.roofTexture;
                //}
                simpleBuilding.SphericalTransform.SetRotationEx(rotation[0],rotation[1],rotation[2]);
                simpleBuilding.SphericalTransform.SetScaleEx (scale[0],scale[1],scale[2]);
                simpleBuilding.EndUpdate();
                earth.AttachObject(simpleBuilding);

                setTransform(simpleBuilding, elementObj);
                attachObject(checked, simpleBuilding);
                userdataArr.push(simpleBuilding);
                objArr.push(obj);
            }else if(Number(obj.type) === 244){
                if(EditLayer===null){
                    createLayer();
                }
                obj.guid=obj.id;
                obj.path=elementObj.getElementsByTagName("Link")[0].text;
                obj.height=elementObj.getElementsByTagName("Height")[0].text;
                var grid = earth.Factory.CreateElementGrid(obj.id, obj.name, obj.path,obj.height/*高度2千米*/);
                grid.name = obj.name;
                grid.SphericalTransform.SetLocationEx(obj.longitude, obj.latitude,obj.altitude );
                EditLayer.BeginUpdate();
                earth.AttachObject(grid);
                if (Number(checked) === 1){
                    //EditLayer.AttachObject(grid);
                    grid.Visibility = true;
                } else {
                    grid.Visibility = false;
                    //EditLayer.DetachObject(grid);
                }

                EditLayer.EndUpdate();
                setTransform(grid, elementObj);
                objArr.push(obj);
                userdataArr.push(grid);
            }

        }
        return userdataArr;
    };


    /**
     * 根据node id得到节点数据并定位
     */
    //var search=STAMP.Search(earth);

    var _flyto=function(dataDoc,nodeId){
        var elements = dataDoc.getElementsByTagName("Element");//得到Element数组
        var editObj=_getElementByID(nodeId);//得到_getElementByID函数的返回值对象。
        //var a=editObj.GetMaterialByMeshName("11w",0);
        for (var i = 0; i < elements.length; i++) {
            var id=elements[i].getAttribute("id");//所有id
            var type=elements[i].getAttribute("type");//所有type
            if(nodeId===id){
                var lon=elements[i].getElementsByTagName("Longitude")[0].nodeTypedValue;
                var lat=elements[i].getElementsByTagName("Latitude")[0].nodeTypedValue;
                var alt=elements[i].getElementsByTagName("Altitude")[0].nodeTypedValue;
                var heading=elements[i].getElementsByTagName("Heading")[0].nodeTypedValue;
                var tilt=elements[i].getElementsByTagName("Tilt")[0].nodeTypedValue;
                var range=elements[i].getElementsByTagName("Range")[0].nodeTypedValue;
                var roll=0;
                var time=6;
                if(type === "244"){//晕染图单独处理
                    var grid;
                    for(var k = 0; k < userdataArr.length; k++){
                        var eobj = userdataArr[k];
                        //alert(eobj.id + " " + eobj.guid);
                        if(eobj && eobj.guid == nodeId){
                            grid = eobj;
                        }
                    }
                    earth.GlobeObserver.FlytoLookat(grid.CenterLocation.X, grid.CenterLocation.Y, grid.CenterLocation.Z, 0, 90, 0, 500, time);
                } else {
                    earth.GlobeObserver.FlytoLookat(lon, lat, alt, heading, tilt, roll, range, time);
                }
            }
        }
        if(editObj && editObj.Visibility == true){
            if(editObj.type==="model"||editObj.type==="picture"||editObj.type==="simplebuilding"||editObj.type==="icon"){
                blinkElementObject ( editObj, 0, 0);//闪烁
            }else {
                editObj.ShowHighLight();//高亮
            }
        }
        
    };
    /*
    var _flyto=function(dataDoc,nodeId){
        var elements = dataDoc.getElementsByTagName("Element");//得到Element数组
        var editObj=_getElementByID(nodeId);//得到_getElementByID函数的返回值对象。

        //var a=editObj.GetMaterialByMeshName("11w",0);
        for (var i = 0; i < elements.length; i++) {
            var id=elements[i].getAttribute("id");//所有id
            var type=elements[i].getAttribute("type");//所有type
            if(nodeId===id){
                var lon=elements[i].getElementsByTagName("Longitude")[0].nodeTypedValue;
                var lat=elements[i].getElementsByTagName("Latitude")[0].nodeTypedValue;
                var alt=elements[i].getElementsByTagName("Altitude")[0].nodeTypedValue;
                var heading=elements[i].getElementsByTagName("Heading")[0].nodeTypedValue;
                var tilt=elements[i].getElementsByTagName("Tilt")[0].nodeTypedValue;
                var range=elements[i].getElementsByTagName("Range")[0].nodeTypedValue;
                var roll=0;
                var time=6;
                if(type === "244"){//晕染图单独处理
                    var grid;
                    for(var k = 0; k < userdataArr.length; k++){
                        var eobj = userdataArr[k];
                        //alert(eobj.id + " " + eobj.guid);
                        if(eobj && eobj.guid == nodeId){
                            grid = eobj;
                        }
                    }
                    earth.GlobeObserver.FlytoLookat(grid.CenterLocation.X, grid.CenterLocation.Y, grid.CenterLocation.Z, 0, 90, 0, 500, time);
                } else {
                    earth.GlobeObserver.FlytoLookat(lon, lat, alt, heading, tilt, roll, range, time);
                }
            }
        }
        if(editObj && editObj.Visibility == true){
            if(editObj.type==="model"||editObj.type==="picture"||editObj.type==="simplebuilding"||editObj.type==="icon"){
                blinkElementObject ( editObj, 0, 0);//闪烁
            }else {
                editObj.ShowHighLight();//高亮
            }
        }
    };
    */
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

    var loadXMLStr=function(xmlStr){
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
    };

    // 树基本设置
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view:{
            dblClickExpand:false, //双击节点时，是否自动展开父节点的标识
            expandSpeed:"", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
            selectedMulti:false, //设置是否允许同时选中多个节点
            showTitle:false //不显示提示信息
        },
        callback:{}
    };
  
    var toTreeNode = function(id){
    	
    	var node = {isParent:false,id:id};
        userdata.toTreeNode(null,null,node);
    }
    //双击树节点定位到
    var dblClickuserdataTreeNode = function (event, treeId, node){
        userDataDoc = getUserdata(filename);
        if(node && node.isParent){
            TreeObj.expandNode(node);
        }else{
            if(node && node.id){
                _flyto(userDataDoc,node.id);
            }
        }
    };

    // 右键选中节点，并弹出右键菜单
    var rightClickuserdataTreeNode = function (event, treeId, node){
        //子节点弹出[编辑 删除]菜单
        $.fn.zTree.getZTreeObj(treeId).selectNode(node);
        if(node){
            if(!node.isParent){
                $('#contextMenuUserdata').menu('show', {
                    left: event.pageX,
                    top: event.pageY
                });
            }
            //父节点(根节点除外)弹出[新建 删除 重命名]菜单
            else if(node && node.isParent && node.name != filename){
                $('#contextMenuCreateTrack').menu('show', {
                    left: event.pageX,
                    top: event.pageY
                })
            }
            else{//根节点右键弹出新建菜单
                $('#contextMenuRoot').menu('show', {
                    left: event.pageX,
                    top: event.pageY
                })
            }
        }
    };

    /**
     * 右键编辑功能
     */
    $("#divEditUserdata").die().live("click",function(){
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var node = zTree.getSelectedNodes()[0];
        if(node && node.id){
            var userId = node.id;
            if(userId){
                //保存到本地XML
                _editUserNode(userId, filename);
                //修改树节点名称
                var element = _getElementByID(node.id);
                if(element){
                    node.name = element.name;
                    zTree.updateNode(node);
                }
            }
        }

    });

    //任意节点(根目录除外)右键新建文件夹
    $("#btnNew").die().live("click",function(){
        addFolder();
    });

    //根目录右键新建文件夹
    $("#btnNewRoot").die().live("click",function(){
        addFolder();
    });

    //树节点右键重命名,只针对文件夹
    $("#renameFolder").die().live("click",function(){
        updateFolder();
    });

    function addFolder(){
    	var zTree = $.fn.zTree.getZTreeObj("userdataTree");//
        var trackName = showModalDialog("html/scene/getTrackName.html",null,"dialogWidth=300px;dialogHeight=150px;status=no");
        var parentNode  = null;//
        if(trackName){
        	var node = zTree.getNodeByParam("name",trackName);
        	if(node){
        		parentNode = node;
        	}else{
        		var guid= earth.Factory.CreateGUID();
        		var nodes = zTree.getCheckedNodes();
        		if(nodes.length>0){
        			var treeNode = nodes[0];
        			//从右键的节点作为父对象进行添加
        			newNodes = zTree.addNodes(treeNode, {name:trackName, isParent:true, pId:treeNode.pId, id:guid});
        			parentNode = newNodes[0];
        			createElementsFolder(treeNode, newNodes[0]);
        		}
        		//treeNode为目标对象 newNodes为新建的对象
        		//alert(treeNode.id + " " + newNodes[0].id);
        		//saveNodesToXML(newNodes);
        	}
        }
        return parentNode;
    };

    //创建文件夹同步到MyPlace.xml文件中
    function createElementsFolder(target, node){
        var xmlData = "<ElementFolder id='" + node.id  + "' name='" + node.name + "' type='folder' open='"+ node.open +"' checked='"+ node.check +"'  >" + "</ElementFolder>";
        // var xmlData = "<ElementFolder id='" + node.id  + "' name='" + node.name + "' type='folder'  checked='"+ node.check +"'  >" + "</ElementFolder>";
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");
        //获取usedata文件夹下的xml数据
        var rootxml = getUserdata(filename);
        var lookupNode = null;

        //直接添加到右键目标文件夹下
        if(target.id != -1){
            var target = getElementByGUID(rootxml, target.id);
            // insertAfter(xmlDoc.documentElement.firstChild, target);
            target.appendChild(xmlDoc.documentElement.firstChild);
        } else { //根节点
            if(rootxml.childNodes.length>1){
                lookupNode = rootxml.childNodes[rootxml.childNodes.length-1].firstChild;
            } else {
                lookupNode = rootxml.documentElement.firstChild;
            }
            lookupNode.appendChild(xmlDoc.documentElement.firstChild);
        }

        var root = earth.Environment.RootPath + "userdata\\"+filename;
        earth.UserDocument.saveXmlFile(root, rootxml.xml);
    };

    function updateFolder(){
        var nodes = TreeObj.getSelectedNodes();
        var treeNode = nodes[0];
        if(treeNode && treeNode.name)
        {
            var trackName = showModalDialog("html/scene/getTrackName.html",null,"dialogWidth=300px;dialogHeight=150px;status=no");
            if(trackName){
                //更新节点名称
                treeNode.name = trackName;
                TreeObj.updateNode(treeNode);
                updateElementsFolder(nodes[0], trackName);
            }
        }
    };

    //修改文件名后保存到本地xml文件中
    function updateElementsFolder(node, name){
        var rootxml = getUserdata(filename);
        var element = getElementByGUID(rootxml, node.id);
        element.getAttributeNode("name").nodeValue = name;

        var root = earth.Environment.RootPath + "userdata\\"+filename;
        earth.UserDocument.saveXmlFile(root, rootxml.xml);
    }

    //树右键删除文件夹
    $("#deleteFolder").die().live("click",function(){
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var nodes = zTree.getSelectedNodes();
        var node = nodes[0];
        //alert(node.id);
        if(node && node.id)
        {
            if(confirm("是否确定要删除？")){
                //树上移除相关节点(如果有子节点也一并移除)
                zTree.removeNode(node);
                //根据guid移除地球上的显示对象
                removeObjFromEarth(node.id);
                //同步数据到本地xml文件
                deleteFolder(node);
            }
        };
    });

    /**
     * 根目录删除所有子节点
     * @return {[type]} [description]
     */
    $("#deleteRootFolder").die().live("click",function(){
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var nodes = zTree.getSelectedNodes();
        var node = nodes[0];

        //从左侧面板里移除根节点下的所有子节点
        if (nodes && nodes.length > 0 ) {

            if(confirm("是否删除所有节点?")){
                //树上移除相关节点(如果有子节点也一并移除)
                zTree.removeChildNodes(node);
                //删除地球上所有对象
                removeAllFromEarth();
                //同步数据到本地xml文件
                deleteAllXML();
                //置空数组
                if (userdataArr && userdataArr.length > 0) {
                    userdataArr = [];
                };
            }
        }
    });

    function removeAllFromEarth(){
        if(userdataArr && userdataArr.length > 0){
            for( var i = 0; i < userdataArr.length; i++){
                //alert(userdataArr[i].name);
                earth.DetachObject(userdataArr[i]);
            }
        }
        //清空数组
        userdataArr = [];
        earth.ToolManager.SphericalObjectEditTool.Browse();
    };

    function deleteAllXML(){
        var rootxml = getUserdata(filename);
        var childs = rootxml.getElementsByTagName("ElementDocument")[0].childNodes;
        //移除folder并且移除内部的各个子节点
        var folderElements = rootxml.getElementsByTagName("ElementFolder");
        var elements = rootxml.getElementsByTagName("Element");

        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }

        for (var i = 0; i < folderElements.length; i++) {
            folderElements[i].parentNode.removeChild(folderElements[i]);
        }

        var path= earth.Environment.RootPath + "userdata\\" + filename;
        earth.UserDocument.saveXmlFile(path, rootxml.xml);
    };

    /**
     * 删除文件夹的时候 从地球上移除文件夹下的所有对象
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    function removeObjFromEarth(nodeID){
        //清除earth上对应的要素
        earth.ShapeCreator.Clear();
        var rootxml = getUserdata(filename);
        var list = getElementsByFolder(rootxml, nodeID);
        if (list && list.length) {
            for (var i = list.length - 1; i >= 0; i--) {
                var elementObj = _getElementByID(list[i]);
                //elementObj.editable = false;
                earth.DetachObject(elementObj);
                earth.ToolManager.SphericalObjectEditTool.Browse();
            };
        }
    };

    /**
     * 同步数据到本地xml文件
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    function deleteFolder(node){
        _deleteUserNode(node.id, filename);

    };

    //右键删除子节点
    $("#divDeleteUserdata").die().live("click",function(){
        //var userId = TreeObj.getSelectedNodes()[0].id;
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var nodes = zTree.getSelectedNodes();
        var node = nodes[0];
        if(node && node.id){
            if(confirm("是否确定要删除？")){
                //删除UI上的树节点
                zTree.removeNode(zTree.getSelectedNodes()[0]);
                //根据id删除对应的element并同步到本地的xml文件
                _deleteUserNode(node.id, filename);
                //清除earth上对应的要素 这里貌似不起作用啊 删除不了动态对象
                earth.ShapeCreator.Clear();
                deleteFromEarth(node.id);
                //从对象数组中清除该对象
                removeFromUserdata(userdataArr, node.id);
            }
        }
    });

    var removeFromUserdata = function(array, id) {
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i].guid === id) {
                array.splice(i, 1);
            }
        };
    }

    //从Earth上删除对象
    function deleteFromEarth(guid){
        if (userdataArr && userdataArr.length) {
            for (var i = userdataArr.length - 1; i >= 0; i--) {
                if (userdataArr[i].guid === guid) {
                    earth.DetachObject(userdataArr[i]);
                    //todo:如果该对象是选中状态的时候 怎么清除选中框呢? 暂时都清除了 
                    earth.ToolManager.SphericalObjectEditTool.Browse();
                }
            };
        }
    }

    //添加 移动都要调用该方法 同步到本地xml数据中
    function saveNodesToXML(node){

    };

    //初始化element树
    var TreeObj;
    var originID = 1;
    var originPID = 0;
    var ID = 0;
    var treeData = [];
    var initTree=function(userdataTree){
        // var userTreeData = [{id:-1, pId:0, name: filename, open:true,isParent:true}];
        var userTreeData;
        setting.callback = {
            onClick:"",
            onDblClick: dblClickuserdataTreeNode,
            onRightClick: rightClickuserdataTreeNode,
            beforeDrop: zTreeBeforeDrop,
            onDrop: zTreeOnDrop,
            onCollapse: zTreeOnCollapse,
            onExpand: zTreeOnExpand,
            onCheck: zTreeOnCheck,
            onNodeCreated: zTreeOnNodeCreated
        };

        setting.edit = {
            enable: true,
            showRenameBtn: false,
            showRemoveBtn: false
        };

        setting.edit.drag = {
            isCopy:false,
            isMove:true,
            inner:innerTree,
            prev:true,
            next:true
        };

        setting.check = {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "ps", "N": "ps" }
        };

        setting.data.keep = {
            parent: true
        };

        userDataDoc = userdata.getUserdata(filename);

        userTreeData = getElementsList(userDataDoc, "ElementDocument", originID, originPID);
        userdataTree = $.fn.zTree.init($("#userdataTree"), setting, userTreeData);
        TreeObj= userdataTree;
        //这样写合适么?
        // if(userdataArr && userdataArr.length == 0){
        //     userdataArr = userTreeData;
        // }
        _initDataArr(filename);
    };

    /**
     *   递归遍历XML节点生成一个数组 数组内部都是json格式的数据 用来直接传递给JQuery里的zTree对象
     *   @param  {String} xml 表示传入的xml数据
     *   @param  {String} rootName 表示开始遍历的节点名称
     *   @return {String} 返回[{...}]格式的数组数据
     */
    function getElementsList(xml, rootName, originID, originPID){

        var list = xml.documentElement.getElementsByTagName(rootName);
        var id = list[0].getAttribute("id");
        var checked = list[0].getAttribute("checked");
        var open = list[0].getAttribute("open");
        var length = list.length;

        if(Number(checked) === 1) {
            checked = true;
        } else {
            checked = false;
        }

        var json = {
            id: id,
            pId: 0,
            name:filename,
            checked:checked,
            open:open,
            isParent:true
        };
        treePIDObject[id] = 0;
        treeData.push(json);

        for(var t = 0; t < length; t++){
            var x = list[t].childNodes;
            //传入ElementDocument所有子节点
            recursion(x, id, originPID);
            // nID++;
        }
        return treeData;
    };

    /**
     * 递归算法
     * @param  {[type]} x         [description]
     * @param  {[type]} originID  [description]
     * @param  {[type]} originPID [description]
     * @return {[type]}           [description]
     */
    function recursion(x, originID, originPID){
        for(var i = 0, max = x.length; i < max; i++)
        {
            var element = x[i];
            var name = element.nodeName;

            var nName = element.getAttribute("name");
            var nID = element.getAttribute("id");
            var checked = element.getAttribute("checked");
            var open = element.getAttribute("open");

            if(Number(checked) === 1) {
                checked = true;
            } else {
                checked = false;
            }

            if(name == "Element")
            {
                var json = {
                    id: nID,
                    pId: originID,
                    name:nName,
                    checked:checked,
                    open:open
                };
                treePIDObject[nID] = originID;
                treeData.push(json);
            }

            if(name == "ElementFolder" && element.childNodes){
                var json = {
                    id: nID,
                    pId: originID,
                    name:nName,
                    checked:checked,
                    open:open,
                    isParent:true
                };

                treePIDObject[nID] = originID;
                treeData.push(json);

                recursion(element.childNodes, nID, nID);
            }
        }
    }
    //递归完毕

    //保存check的状态 这里不统一设定...
    function zTreeOnNodeCreated(event, treeId, treeNode) {
        if(treeNode){
            //treeNode.checked = true;//默认设置为勾选状态
        }
    };

    /**
     * 用于捕获节点被折叠的事件回调函数
     * @param  {[type]} event    [description]
     * @param  {[type]} treeId   [description]
     * @param  {[type]} treeNode [description]
     * @return {[type]}          [description]
     */
    function zTreeOnCollapse(event, treeId, treeNode) {
        var guid = treeNode.id;
        setElementOpen(guid, "false");
    };

    //用于捕获节点被展开的事件回调函数
    function zTreeOnExpand(event, treeId, treeNode) {
        var guid = treeNode.id;
        setElementOpen(guid, "true");
    };

    //用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数
    function zTreeOnCheck(event, treeId, treeNode) {
        var level = treeNode.level;
        var guid = treeNode.id;
        if (treeNode.isParent) {
            setFolderChecked(guid, treeNode.checked);
        } else {
            setElementChecked(guid, treeNode.checked, level);
        }
    };

    //设置节点的是否展开状态(折叠状态)
    function setElementOpen(guid, open){
        //设置
        var rootxml = getUserdata(filename);
        var element = getElementByGUID(rootxml, guid);
        if(element){//todo:根节点的状态还未保存
            element.getAttributeNode("open").nodeValue = open;
            //保存
            var root = earth.Environment.RootPath + "userdata\\"+filename;
            earth.UserDocument.saveXmlFile(root, rootxml.xml);
        }
    };

    /**
     *  设置节点的是否勾选状态
     *  todo:代码优化 内部遍历有重复......
     */
    function setElementChecked(guid, checked, level){
        //设置
        var rootxml = getUserdata(filename);
        //这里取出来的是节点
        var element = getElementByGUID(rootxml, guid);
        //这里取出来的是地球上的对象(都是Element)
        var sElement = _getElementByID(guid);
        //ture记为1 flase记为0
        if (checked) {
            checked = 1;
            if(sElement){
                //alert(sElement.guid);
                sElement.Visibility = true;
                sElement.Selectable = true;
            }

        } else {
            checked = 0;
            if(sElement) {
                //alert(sElement.guid);
                sElement.Visibility = false;
                sElement.Selectable = false;
            }
        }

        //获取该element对应的所有的父节点对象 并设置check
        getFolderByGuid(rootxml, guid, checked, level);

        if(element){//todo:根节点的状态还未保存
            element.getAttributeNode("checked").nodeValue = checked;
            //保存
            var root = earth.Environment.RootPath + "userdata\\"+filename;
            earth.UserDocument.saveXmlFile(root, rootxml.xml);
        }
    };

    /**
     * 获取该element对应的所有的父节点对象
     * 当check的时候 这些父对象也对应修改节点的check属性值 并保存到本地
     * @param  {[type]} guid [description]
     * @return {[type]}      [description]
     */
    function getFolderByGuid(rootxml, guid, checked, level){
        var floderIds = [];
        var num = nodeLevel[guid];
        if(level && level > 0)
        {
            for (var i = level; i > 0; i--) {
                var pid = treePIDObject[guid];
                var treeNode = getElementByGUID(rootxml, pid);
                if(treeNode){
                    treeNode.getAttributeNode("checked").nodeValue = checked;
                    floderIds.push(treeNode);
                    //循环条件
                    guid = pid;
                }
            };
            //return floderIds;
        }
    };

    function setFolderChecked(guid, checked){
        //设置
        var rootxml = getUserdata(filename);
        var element = getElementByGUID(rootxml, guid);
        var elementList = getElementsByFolder(rootxml, guid);

        if(checked) {
            checked = 1;
            for (var i = elementList.length - 1; i >= 0; i--) {
                var object = _getElementByID(elementList[i]);
                if(object){
                    //earth.AttachObject(object);
                    object.Visibility = true;
                    object.Selectable = true;
                }
            }

        }  else {
            checked = 0;
            for (var i = elementList.length - 1; i >= 0; i--) {
                var object = _getElementByID(elementList[i]);
                if(object){
                    //earth.DetachObject(object);
                    object.Visibility = false;
                    object.Selectable = false;
                }
            }
        }

        if (element.nodeName === "ElementDocument"){
            //elementFolder[i].getAttributeNode("checked").nodeValue = checked;
        }

        //由于这里是文件夹(父节点) 本身的checked变为1 
        //其子对象都要把checked属性设置为1 同步到本地xml文件中
        if(element){
            element.getAttributeNode("checked").nodeValue = checked;
            var elements = element.getElementsByTagName('Element');
            var elementFolder = element.getElementsByTagName('ElementFolder');
            if(elements && elements.length){
                for (var i = 0; i < elements.length; i++){
                    elements[i].getAttributeNode("checked").nodeValue = checked;
                }
            }
            if(elementFolder && elementFolder.length){
                for (var i = 0; i < elementFolder.length; i++){
                    elementFolder[i].getAttributeNode("checked").nodeValue = checked;
                }
            }
            //保存
            var root = earth.Environment.RootPath + "userdata\\"+filename;
            earth.UserDocument.saveXmlFile(root, rootxml.xml);
        }
    };
    /**
     * 根据folder文件夹ID来获取其子节点的所有ID
     * @param  {[type]} rootxml [description]
     * @param  {[type]} guid    [description]
     * @return {[type]}         [description]
     */
    function getElementsByFolder(rootxml, guid){
        var element = getElementByGUID(rootxml, guid);
        if (element) {
            var type = element.getAttribute("type");
            if(type === "folder")
            {
                //如果是文件夹 则返回多个下面所有的element的guid
                var elementList = element.getElementsByTagName("Element");
                var list = [];
                for(var i = 0, max = elementList.length; i < max; i++){
                    //alert(" " + elementList[i].getAttribute("id"));
                    list.push(elementList[i].getAttribute("id"));
                }
                return list;
            }
        }
    };

    //显示Element到Earth上
    function showElement(guid){
    };
    //隐藏Element在Earth上
    function hideElement(guid){
    };
    //拖拽释放后的回调函数
    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
        if(targetNode){
            var rootxml = getUserdata(filename);
            var zTree = $.fn.zTree.getZTreeObj("userdataTree");
            var removeNode;
            var targetN;
            //先根据guid找到本地xml里的节点
            var removeGUID = treeNodes[0].id;
            var targetGUID = targetNode.id;
            var nodes = getElementFromGUID(rootxml, removeGUID, targetGUID);
            for(var i = 0, len = nodes.length; i < len; i++)
            {
                var n = nodes[i];
                if(n.hasOwnProperty("remove")){
                    removeNode = n["remove"];
                }
                if (n.hasOwnProperty("target")) {
                    targetN = n["target"];
                };
            }
            // alert(removeNode.xml + " " + targetN.xml);

            if(targetNode.isParent)//如果目标节点是父节点
            {
                //从xml中删除节点
                var copyNode = removeNode.cloneNode(true);
                removeNode.parentNode.removeChild(removeNode);
                if(moveType == "prev")
                {
                    targetN.parentNode.insertBefore(removeNode, targetN);
                }
                else if(moveType == "next" || moveType == "inner")
                {
                	if(typeof(targetN)!="undefined"){
                		targetN.appendChild(copyNode);
                	}
                }
            }
            else if(!targetNode.isParent)//如果目标对象是子节点
            {
                var strXML = rootxml.xml;
                // var copyNode = removeNode.cloneNode(true);
                // removeNode.parentNode.removeChild(removeNode);
                if(moveType == "prev")
                {
                    targetN.parentNode.insertBefore(removeNode, targetN);
                }
                else if(moveType == "next")
                {
                    //这里不能直接使用appendChild(该方法会插入节点 不是在节点的最后追加)
                    insertAfter(removeNode, targetN);
                }
            }
            //删除后要保存一下否则本地xml数据不会更新
            var root = earth.Environment.RootPath + "userdata\\"+filename;
            earth.UserDocument.saveXmlFile(root, rootxml.xml);
        }
    };

    //插入节点到目标节点后面
    function insertAfter(newElement,targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }


    //todo:跟下面的方法getElementFromGUID合并处理一下
    var getElementByGUID = function(xml, guid)
    {
        //根节点
        var rootNode = xml.getElementsByTagName("ElementDocument")[0];
        var id = rootNode.getAttribute("id");
        //允许通过其guid或者pid(0)来获取根节点节点
        if(id === guid)
        {
            return rootNode;
        }
        var elements = xml.getElementsByTagName('Element');
        var elementFolder = xml.getElementsByTagName('ElementFolder');

        for (var i = 0; i < elements.length; i++){
            var elementGUID = elements[i].getAttribute("id");
            if(elementGUID == guid)
            {
                return elements[i];
            }
        }

        for (var i = 0; i < elementFolder.length; i++){
            var elementFolderGUID = elementFolder[i].getAttribute("id");
            if(elementFolderGUID == guid)
            {
                return elementFolder[i];
            }
        }
    }

    /**
     * [getElementByType 根据对象类型来返回对象 如多边形的  211 面 220 线条]
     * @param  {[type]} xml  [description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    function getElementByType(xml, type){
        var returnType = [];
        var elements = xml.getElementsByTagName('Element');

        for (var i = 0; i < elements.length; i++){
            var elementType = elements[i].getAttribute("type");
            if(elementType === type || Number(elementType) === type)
            {
                returnType.push(elements[i]);
            }
        }
        return returnType;
    }

    //根据传入的GUID获取对应的xml节点 针对子节点拖拽到父节点
    function getElementFromGUID(xml, removeGUID, targetGUID){
        var nodes = [];
        //遍历每一个Element节点
        var elements = xml.getElementsByTagName('Element');
        //遍历每一个ElementFolder节点
        var elementFolder = xml.getElementsByTagName('ElementFolder');

        for (var i = 0; i < elements.length; i++)
        {
            var elementGUID = elements[i].getAttribute("id");
            if(elementGUID == removeGUID)
            {
                nodes.push({"remove":elements[i]});
            }
            else if(elementGUID == targetGUID)
            {
                nodes.push({"target":elements[i]});
            }
        }

        for (var i = 0; i < elementFolder.length; i++)
        {
            var elementFolderGUID = elementFolder[i].getAttribute("id");
            if(elementFolderGUID == removeGUID)
            {
                nodes.push({"remove":elementFolder[i]});
            }
            else if(elementFolderGUID == targetGUID)
            {
                nodes.push({"target":elementFolder[i]});
            }
        }
        return nodes;
    }
    function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
        return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId));
    };

    var prevTree= function(treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
    }
    var nextTree= function(treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
    }
    var innerTree= function(treeId, treeNodes, targetNode) {
        // return targetNode!=null && targetNode.isParent && targetNode.tId == treeNodes[0].parentTId;
        //当文件夹里没有子节点的时候 默认不处理 文件夹图标变为子节点图标 不做删除操作
        if(treeNodes && treeNodes[0]){
            var parent = treeNodes[0].getParentNode();
            if(parent && parent.children && parent.children.length == 1){
                var treeN = treeNodes[0].getParentNode();
                //TreeObj.removeNode(treeN);
            }
        }

        return targetNode!=null && targetNode.isParent;
    }

    var _addElementFromOuter = function (element) {
        if (userdataArr) {
            userdataArr.push(element);
        }
    }
    
    //过滤属性，和本地的Element进行对比筛选
    var getUserDataByPropertry =function (propertyName,value,searchType,id){
    	 if(userdataArr == null) {
    		 return null;
    	 }
    	 for(var i=0; i < userdataArr.length; i++){
    	        var eobj = userdataArr[i];
    	        if(eobj && eobj.guid == id){
    	            eleObj = eobj;
    	        }
    	    }
    	    return eleObj;
    }
    
    userdata.initDataArr=_initDataArr
    userdata.createPrimitives=_createPrimitives;
    userdata.createParticle = _createParticle;
    userdata.importModelData=_importModelData;
    userdata.createMilitaryTag=_createMilitaryTag;
    userdata.getUserdata=getUserdata;
    userdata.getDefaultUserdata=getDefaultUserdata;
    userdata.flyto=_flyto;
    userdata.deleteUserNode=_deleteUserNode;
    userdata.editUserNode=_editUserNode;
    userdata.addElementFromOuter = _addElementFromOuter;
    userdata.select = _select;
    userdata.move = _move;
    userdata.rotate = _rotate;
    userdata.scale = _scale;
    userdata.moveByValue = _moveByValue;
    userdata.rotateByValue = _rotateByValue;
    userdata.scaleByValue = _scaleByValue;
    userdata.alignGround = _alignGround;
    userdata.clearObj=clearObj;
    userdata.getElementByID=_getElementByID;

    userdata.editpoint = _editpoint;
    userdata.deletepoint = _deletepoint;
    userdata.addpoint = _addpoint;
    userdata.SegmentExtrude=_SegmentExtrude;
    userdata.VolumeSegmentExtrude=_VolumeSegmentExtrude;
    userdata.clone=_clone;
    userdata.save=_save;
    userdata.initTree=initTree;
    userdata.loadXMLStr=loadXMLStr;
    userdata.getElementByType = getElementByType;
    userdata.getElementByGUID = getElementByGUID;
    userdata.updateTree = updateTree;
    userdata.toTreeNode = toTreeNode;
    userdata.addFolder=addFolder;
    return userdata;

}

