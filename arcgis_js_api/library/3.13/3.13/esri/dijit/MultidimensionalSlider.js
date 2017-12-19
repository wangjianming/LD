// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.13/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/templates/MultidimensionalSlider_horizontal.html":'\x3cdiv class\x3d"esriMdSliderHorizontal"\x3e\r\n  \x3ctable class\x3d"esriMdSliderTableHorizontal"\x3e\r\n    \x3ccolgroup\x3e\r\n      \x3ccol class\x3d"esriMdSliderHorizontalCol1"\x3e\r\n      \x3ccol\x3e\r\n    \x3c/colgroup\x3e\r\n    \x3ctr\x3e\r\n      \x3ctd class\x3d"esriMdSliderDimensionInfoCellHorizontal" colspan\x3d"2"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"dimensionInfo"\x3e\x3c/div\x3e\r\n      \x3c/td\x3e\r\n    \x3c/tr\x3e\r\n    \x3ctr\x3e\r\n      \x3ctd align\x3d"right" valign\x3d"middle"\x3e\x3cbutton data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'mdsButton mdsPlayButton\'" data-dojo-attach-event\x3d"onClick:_onPlay" \r\n                                               data-dojo-attach-point\x3d"playPauseBtn" type\x3d"button" title\x3d"${_i18n.widgets.mdSlider.NLS_play}"\x3e\x3c/button\x3e\x3c/td\x3e\r\n      \x3ctd class\x3d"esriMdSliderCellHorizontal" data-dojo-attach-point\x3d"mdSliderCell"\x3e\r\n      \x3c/td\x3e\r\n    \x3c/tr\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n',
"url:esri/dijit/templates/MultidimensionalSlider_vertical.html":'\x3cdiv class\x3d"esriMdSliderVertical"\x3e\r\n  \x3ctable class\x3d"esriMdSliderTableVertical" data-dojo-attach-point\x3d"mdSliderTable"\x3e\r\n    \x3ctr\x3e\r\n      \x3ctd class\x3d"esriMdSliderDimensionInfoCellVertical" align\x3d"middle"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"dimensionInfo" class\x3d"esriMdSliderDimensionInfo"\x3e\r\n          \x3cbr/\x3e\x3cbr/\x3e\x3cbr/\x3e\r\n        \x3c/div\x3e\r\n      \x3c/td\x3e\r\n    \x3c/tr\x3e\r\n    \x3ctr\x3e\r\n      \x3ctd class\x3d"esriMdSliderCellVertical" data-dojo-attach-point\x3d"mdSliderCell"\x3e\x3c/td\x3e\r\n    \x3c/tr\x3e\r\n    \x3ctr  class\x3d"esriMdsSliderPlayButtonRow"  data-dojo-attach-point\x3d"playPauseBtnRow"\x3e\r\n      \x3ctd align\x3d"middle" valign\x3d"middle" class\x3d"esriMdsSliderPlayButtonCell"\x3e\r\n        \x3cbutton data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'mdsButton mdsPlayButton\'" data-dojo-attach-event\x3d"onClick:_onPlay" data-dojo-attach-point\x3d"playPauseBtn" type\x3d"button"\r\n                title\x3d"${_i18n.widgets.mdSlider.NLS_play}"\x3e\r\n        \x3c/button\x3e\x3c/td\x3e\r\n    \x3c/tr\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/MultidimensionalSlider","dojo/_base/declare dojo/_base/lang dojo/_base/event dojo/_base/kernel dojo/has dojo/on dojo/json dijit/form/VerticalSlider dojox/form/VerticalRangeSlider dijit/form/VerticalRule dijit/form/VerticalRuleLabels dijit/form/HorizontalSlider dojox/form/HorizontalRangeSlider dijit/form/HorizontalRule dijit/form/HorizontalRuleLabels dijit/_Widget dijit/_Templated dojox/timing/_base dojo/_base/array dojo/Deferred dojo/DeferredList ../layers/MosaicRule ../layers/DimensionalDefinition ../kernel ../lang ./_EventedWidget dojo/text!./templates/MultidimensionalSlider_vertical.html dojo/text!./templates/MultidimensionalSlider_horizontal.html dojo/i18n!../nls/jsapi dojo/dom-class dojo/dom-style dojo/dom-geometry".split(" "),
function(p,g,k,O,q,r,n,u,v,w,x,y,z,A,B,C,D,E,e,F,G,H,I,J,l,K,L,M,N,s,m,t){var h={LAYOUT_VERTICAL:"vertical",LAYOUT_HORIZONTAL:"horizontal"};k=p([K,C,D],{declaredClass:"esri.dijit.MultidimensionalSlider",widgetsInTemplate:!0,templateString:L,nLabels:10,thumbCount:1,loop:!0,useLayersDimSlices:!0,prefetch:!0,prefetchedValues:{},showPlayButton:!0,prefetchFactor:3,_hasUnitConflict:!1,unitSymbols:{meter:"m",pascal:"Pa"},_eventMap:{"dimension-value-change":!0,play:!0,pause:!0,next:!0,previous:!0,change:!0,
"dimension-array-create":!0},onChange:function(){},onPlay:function(){},onPause:function(){},onDimensionValueChange:function(){},_onPlay:function(){this.playing=!this.playing;this._updateUI();this.playing?(this._timer.start(),this.onPlay()):(this._timer.stop(),this.onPause())},constructor:function(a,b){p.safeMixin(this,a);this.playing=!1;this._iconClass="mdsButton mdsPlayButton";this.map&&this._getImageLayers();this.layout===h.LAYOUT_HORIZONTAL&&(this.templateString=M);this.thumbMovingRate=this.thumbMovingRate||
3E3;this.prefetchImgNode=new Image;this._i18n=N},postCreate:function(){this.inherited(arguments)},startup:function(){this.inherited(arguments);var a=this;this._getAllLayersMDInfo().then(function(b){a._sortDimensionValues();a.dimensionValues=a.dimensionValues&&a.dimensionValues.length&&!a.useLayersDimValues?a.dimensionValues:a._mapSortedDimensionValues;a.getUnit();a._setupSlider(!0)});this.showPlayButton?m.set(this.playPauseBtn.domNode,"display","block"):(m.set(this.playPauseBtn.domNode,"display",
"none"),this.playPauseBtnRow&&m.set(this.playPauseBtnRow,"display","none"));this._timer=new E.Timer;this._timer.setInterval(this.thumbMovingRate);this._timer.onTick=g.hitch(this,"_bumpSlider",1);this.layout===h.LAYOUT_VERTICAL&&(this.computeSliderStyle(),this.on("resize",g.hitch(this,"computeSliderStyle")))},testLog:function(){},_setDimensionAttr:function(a){this._slider&&(a.dimension&&(this.dimension=a.dimension),this.dimensionValues=a.dimensionValues&&a.dimensionValues.length?a.dimensionValues:
[],this.update(!1))},update:function(a){var b=this;this._mapSortedDimensionValues=[];this._getImageLayers();this.value=a?this.dimensionValues[this._slider.value]:null;this._getAllLayersMDInfo().then(function(d){b._sortDimensionValues();b.getUnit();if(!b.dimensionValues||!b.dimensionValues.length||b.useLayersDimSlices)b.dimensionValues=b._mapSortedDimensionValues;b._setupSlider(a)})},pause:function(){this.playing=!1;this._updateUI();this._timer.stop()},play:function(){!0!==this.playing&&(this.playing=
!1,this._onPlay())},_setupSlider:function(a){this._destroySlider();this.dimensionValues&&this.dimensionValues.length&&(this.sliderNode=document.createElement("div"),this._getDimensionAlias(),this._layers&&(this._layers.length&&1===this._layers.length&&a)&&this._readMosaicRule(),this._createRule(),this._createLabels(),this._createSlider(),this._slider.onChange(this._slider.value))},_createLabels:function(){this.layout===h.LAYOUT_HORIZONTAL?this._createHorizontalLabels():this._createVerticalLabels()},
_createRule:function(){this.layout===h.LAYOUT_HORIZONTAL?this._createHorizontalRule():this._createVerticalRule()},_createVerticalLabels:function(){this.labelsNode=document.createElement("div");this.sliderNode.appendChild(this.labelsNode);this._sliderLabels=new x({labels:this._filterLabels(),labelStyle:"font-size: 75%; padding-left: 5px;"},this.labelsNode)},_createVerticalRule:function(){this.rulesNode=document.createElement("div");this.sliderNode.appendChild(this.rulesNode);100>=this.dimensionValues.length&&
(this._sliderRules=new w({count:this.dimensionValues.length-1,style:"width:5px;"},this.rulesNode),this._sliderRules.startup())},_createHorizontalLabels:function(){this.labelsNode=document.createElement("div");this.sliderNode.appendChild(this.labelsNode);this._sliderLabels=new B({labels:this._filterLabels(),labelStyle:"font-size: 75%"},this.labelsNode)},_createHorizontalRule:function(){this.rulesNode=document.createElement("div");this.sliderNode.appendChild(this.rulesNode);100>=this.dimensionValues.length&&
(this._sliderRules=new A({count:this.dimensionValues.length-1,style:"height:5px;"},this.rulesNode),this._sliderRules.startup())},_createHorizontalSingleSlider:function(a){var b=this;this._slider=new y({name:"horizontal",minimum:0,maximum:this.dimensionValues.length-1,intermediateChanges:!1,discreteValues:this.dimensionValues.length,style:"width: 100%;",increment:g.hitch(this,"_bumpSlider",1),decrement:g.hitch(this,"_bumpSlider",-1),value:a||0,onChange:function(a){var c=b.dimensionValues[a];b.setDimensionInfoText(c);
e.forEach(b._layers,function(f){b._updateMosaicRule(f,c);b.prefetch&&b.playing&&b._prefetchData(a,f)});b.onChange(c)}},b.sliderNode);this._slider.startup()},_createHorizontalRangeSlider:function(a){var b=this;this._slider=new z({name:"horizontal",minimum:0,maximum:this.dimensionValues.length-1,intermediateChanges:!1,discreteValues:this.dimensionValues.length,style:"width:100%;",increment:g.hitch(this,"_bumpSlider",1),decrement:g.hitch(this,"_bumpSlider",-1),value:a||[0,1],onChange:function(a){var c=
[b.dimensionValues[a[1]],b.dimensionValues[a[0]]];b.setDimensionInfoText(c);e.forEach(b._layers,function(f){b._updateMosaicRule(f,c);b.prefetch&&b.playing&&b._prefetchData(a,f);b.onChange(c)})}},b.sliderNode);this._slider.startup();r(this._slider.incrementButton,"click",this._slider.increment);r(this._slider.decrementButton,"click",this._slider.decrement);this._slider._typematicCallback=function(){}},_createVerticalSingleSlider:function(a){var b=this;this._slider=new u({name:"vertical",minimum:0,
maximum:this.dimensionValues.length-1,intermediateChanges:!1,discreteValues:this.dimensionValues.length,style:this.computeSliderStyle(),increment:g.hitch(this,"_bumpSlider",1),decrement:g.hitch(this,"_bumpSlider",-1),value:a||0,onChange:function(a){var c=b.dimensionValues[a];b.setDimensionInfoText(c);e.forEach(b._layers,function(f){b._updateMosaicRule(f,c);b.prefetch&&b.playing&&b._prefetchData(a,f)});b.onChange(c)}},b.sliderNode);this._slider.startup()},_createVerticalRangeSlider:function(a){var b=
this;this._slider=new v({name:"vertical",minimum:0,maximum:this.dimensionValues.length-1,intermediateChanges:!1,discreteValues:this.dimensionValues.length,style:this.computeSliderStyle(),increment:g.hitch(this,"_bumpSlider",1),decrement:g.hitch(this,"_bumpSlider",-1),value:a||[0,1],onChange:function(a){var c=[b.dimensionValues[a[1]],b.dimensionValues[a[0]]];c.sort();b.setDimensionInfoText(c);e.forEach(b._layers,function(f){b._updateMosaicRule(f,c);b.prefetch&&b.playing&&b._prefetchData(a,f)});b.onChange(c)}},
b.sliderNode);this._slider.startup();this._slider._typematicCallback=function(){}},_destroySlider:function(){this._slider&&(this._slider.destroy(),this._slider=null)},_createSlider:function(){var a;this.mdSliderCell.appendChild(this.sliderNode);this.value&&this.value.length?a=0<=e.indexOf(this.dimensionValues,this.value[0])&&0<=e.indexOf(this.dimensionValues,this.value[1])?[e.indexOf(this.dimensionValues,this.value[0]),e.indexOf(this.dimensionValues,this.value[1])]:[0,1]:this.value&&(a=0<=e.indexOf(this.dimensionValues,
this.value)?e.indexOf(this.dimensionValues,this.value):0);2===this.thumbCount?this.layout===h.LAYOUT_HORIZONTAL?this._createHorizontalRangeSlider(a):this._createVerticalRangeSlider(a):this.layout===h.LAYOUT_HORIZONTAL?this._createHorizontalSingleSlider(a):this._createVerticalSingleSlider(a)},_getMultidimensionalInfo:function(a){function b(){a.getMultidimensionalInfo().then(function(b){a.multidimensionalInfo=b;d.resolve(a)},function(a){d.reject(a)})}var d=new F;if(a.multidimensionalInfo)d.resolve(a);
else if(a.loaded)b();else a.on("load",function(){b()});return d},_getAllLayersMDInfo:function(){var a=[],b=this;e.forEach(this._layers,function(d){a.push(b._getMultidimensionalInfo(d))});return new G(a)},_getImageLayers:function(){var a=this.map.layerIds.concat(this.map.graphicsLayerIds),b=this,d;this._layers=[];e.forEach(a,function(a){d=b.map.getLayer(a);("esri.layers.ArcGISImageServiceLayer"===d.declaredClass||"esri.layers.ArcGISImageServiceVectorLayer"===d.declaredClass)&&b._layers.push(d)})},
_sortDimensionValues:function(){function a(a,b){for(var d=[],c=0,e=0;c<a.length&&e<b.length;)a[c]<b[e]?d.push(a[c++]):a[c]>b[e]?d.push(b[e++]):(d.push(b[e++]),c++);return d.concat(a.slice(c)).concat(b.slice(e))}var b=this,d=0,c=[];this._layers=this._filterLayers();e.forEach(this._layers,function(a){a.multidimensionalInfo&&e.some(a.multidimensionalInfo.variables,function(a){e.some(a.dimensions,function(a){a.name===b.dimension&&!a.hasRanges&&c.push(a)})})});if(1===c.length)this._mapSortedDimensionValues=
c[0].values;else if(1<c.length){this._mapSortedDimensionValues=c[0].values;for(d=1;d<c.length;d++)this._mapSortedDimensionValues=a(this._mapSortedDimensionValues,c[d].values)}},_createDimensionalDefinition:function(a,b){var d=a.constructor===Array?a:[a];return new I({variableName:b,dimensionName:this.dimension,values:d,isSlice:1===d.length})},_updateMosaicRule:function(a,b){var d=this,c=!1,f=a.mosaicRule||a.defaultMosaicRule||new H({multidimensionalDefinition:[]}),g=f.multidimensionalDefinition||
[];b.length&&b.sort(function(a,b){return a-b});e.forEach(g,function(a){a.dimensionName===d.dimension&&(a.values=b.length?b:[b],a.isSlice=!l.isDefined(b.length),c=!0)});!c&&e.some(a.multidimensionalInfo.variables,function(a){if(e.some(a.dimensions,function(a){if(a.name===d.dimension)return!0}))return!0})&&(g.push(d._createDimensionalDefinition(b,"")),c=!0);c&&(f.multidimensionalDefinition=g,a.setMosaicRule(f))},_prefetchData:function(a,b){if(b&&b.mosaicRule){var d,c,f,h=this,k=!1;this.prefetchedValues[b.id]||
(this.prefetchedValues[b.id]=[]);c=g.clone(b._params);f=g.clone(b.mosaicRule);for(d=1;d<=this.prefetchFactor;d++)k=!1,e.forEach(f.multidimensionalDefinition,function(c){c.dimensionName===this.dimension&&(a.length?(c.values=[this.dimensionValues[(a[0]+d)%this.dimensionValues.length],this.dimensionValues[(a[1]+d)%this.dimensionValues.length]],c.values.sort(function(a,b){return a-b})):c.values=[this.dimensionValues[(a+d)%this.dimensionValues.length]],e.some(this.prefetchedValues[b.id],function(a){if(n.stringify(a)===
n.stringify(c.values))return!0})||(k=!0,this.prefetchedValues[b.id].push(c.values)))},this),k&&(c.mosaicRule=n.stringify(f.toJson()),b.getImageUrl(this.map.extent,this.map.width,this.map.height,function(a){h.prefetchImgNode.src=a},c))}},setDimensionInfoText:function(a){if(l.isDefined(a)){var b=this.unitSymbol||this.unit;if("number"!==typeof a){a=a.sort();if(0!==a[0]%1||0!==a[1]%1)a[0]=parseFloat(a[0].toFixed(2)),a[1]=parseFloat(a[1].toFixed(2));a="["+a[0]+", "+a[1]+"]"}else 0!==a%1&&(a=a.toFixed(2));
this.dimensionInfo.innerHTML=this.unitSymbol?"\x3clabel style\x3d'font-weight:700;'\x3e"+this.dimensionAlias+" ("+b+")\x3c/label\x3e":"\x3clabel style\x3d'font-weight:700;'\x3e"+this.dimensionAlias+"\x3c/label\x3e";this.dimensionInfo.innerHTML=this.layout===h.LAYOUT_HORIZONTAL?this.dimensionInfo.innerHTML+(": "+a):this.dimensionInfo.innerHTML+("\x3cbr/\x3e "+a)}},setLabels:function(a){},_filterLabels:function(){if(this.nLabels&&this.dimensionValues&&this.dimensionValues.length){var a=Math.ceil(this.dimensionValues.length/
this.nLabels);return e.map(this.dimensionValues,function(b,d){return 0===d%a||d===this.dimensionValues.length-1?(0!=b%1&&(b=parseFloat(b.toFixed(2))),b):""},this)}},_filterLayers:function(){var a=this;return e.filter(this._layers,function(b){if(b.multidimensionalInfo&&(b.visible&&b.useMapDimensionValue)&&e.some(b.multidimensionalInfo.variables,function(b){if(e.some(b.dimensions,function(b){if(b.name==a.dimension&&!b.hasRanges)return!0}))return!0}))return!0})},hasMdLayers:function(){},hasVisibleMdLayers:function(){},
_updateUI:function(){s.remove(this.playPauseBtn.iconNode,this._iconClass);this._iconClass=this.playing?"mdsButton mdsPauseButton":"mdsButton mdsPlayButton";s.add(this.playPauseBtn.iconNode,this._iconClass)},_bumpSlider:function(a){var b=this._slider.value;if(0<a)0>b||b>=this.dimensionValues.length-1||b[0]>=this.dimensionValues.length-1||b[1]>=this.dimensionValues.length-1?this._timer.isRunning&&(this.loop?(this._timer.stop(),this.prefetchedValues={},2===this.thumbCount?this._slider.set("value",[0,
Math.abs(b[0]-b[1])]):this._slider.set("value",0),this._timer.start(),this.playing=!0):this.pause()):2===this.thumbCount&&b[0]<this.dimensionValues.length-1&&b[1]<this.dimensionValues.length-1?this._slider.set("value",[b[0]+1,b[1]+1]):1===this.thumbCount&&b<this.dimensionValues.length-1&&this._slider.set("value",b+1);else if(0>a&&(0<=b||0<=b[1]))2===this.thumbCount&&0<b[1]&&0<b[0]?this._slider.set("value",[b[0]-1,b[1]-1]):1===this.thumbCount&&0<b&&this._slider.set("value",b-1)},setThumbMovingRate:function(a){this.thumbMovingRate=
a;this._timer&&this._timer.setInterval(this.thumbMovingRate)},getFullDimensionRange:function(){if(this._mapSortedDimensionValues&&this._mapSortedDimensionValues.length)return[this._mapSortedDimensionValues[0],this._mapSortedDimensionValues[this._mapSortedDimensionValues.length-1]]},setThumbCount:function(a){this.thumbCount=2==a?2:1;this.value=this.dimensionValues[this._slider.value];this._setupSlider()},clearDimensionalDefinition:function(a){var b,d=[],c;a&&(a.mosaicRule&&a.mosaicRule.multidimensionalDefinition)&&
(c=a.mosaicRule,b=c.multidimensionalDefinition,e.forEach(b,function(a){a.dimensionName!==this.dimension&&d.push(a)},this),c.multidimensionalDefinition=d,a.setMosaicRule(c))},getUnit:function(){var a=null,b=!1;this.unit=null;e.forEach(this._layers,function(d){d.multidimensionalInfo&&e.forEach(d.multidimensionalInfo.variables,function(c){e.forEach(c.dimensions,function(c){c.name===this.dimension&&c.unit&&(null==a&&!b?a=c.unit.replace("esri",""):l.isDefined(c.unit)&&c.unit.replace("esri","").toLowerCase()!=
a.toLowerCase()&&(a=null,b=!0))},this)},this)},this);a&&(a=a.replace("esri",""));this.unit=a;this.unitSymbol=this.getUnitSymbol();this._hasUnitConflict=b;return a},_getDimensionAlias:function(){this.dimensionAlias=this.dimension;e.some(this._layers,function(a){if(a.fields&&a.fields.length&&e.some(a.fields,function(a){if(a.name&&a.name===this.dimension&&a.alias)return this.dimensionAlias=a.alias,!0},this))return!0},this)},_readMosaicRule:function(){var a;e.forEach(this._layers,function(b){b.mosaicRule&&
b.mosaicRule.multidimensionalDefinition&&e.forEach(b.mosaicRule.multidimensionalDefinition,function(b){b.dimensionName===this.dimension&&(a=b.values)},this)},this);a&&(1===a.length?(this.thumbCount=1,this.value=a[0]):(this.thumbCount=2,this.value=a))},hasUnitConflict:function(){this.getUnit();return this._hasUnitConflict},computeSliderStyle:function(){var a,b;a=t.getContentBox(this.mdSliderTable).h-t.getContentBox(this.dimensionInfo).h;10>=q("ie")&&(a-=53);this.showPlayButton&&(a-=35);b="height: "+
a+"px;";this._slider&&this._slider.domNode&&m.set(this._slider.domNode,"height",a+"px");return b},getUnitSymbol:function(){if(l.isDefined(this.unit)){var a=this.unit.toLowerCase();if("meters"===a||"meter"===a)return this.unitSymbols.meter;if("pascal"===a||"pascals"===a)return this.unitSymbols.pascal}else return null}});g.mixin(k,h);q("extend-esri")&&g.setObject("dijit.MultidimensionalSlider",k,J);return k});