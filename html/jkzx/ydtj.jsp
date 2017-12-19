<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>用电统计</title>
</head>
<body>
    <div id="siglelampTabs" class="easyui-tabs" data-options="fit:true" style="border:none;padding:0px;margin:0px">   
	   
	     <div title="属性"  style="border:none;padding:5px;margin:0px"> 
	      <form id="attrFormsigle" method="post">
			<table data-options="fit:true">
			    <tr align="left"><th><div>基本信息</div><th></tr>
				<tr>
					<td align="left" width=80px>ID:</td>
					<td align="left" padding="10px"><input readonly="readonly" id="ID" name="ID" type="text" style="width:80px;"/></td>
					<td align="left" width=80px>街号:</td>
					<td align="left"><input  readonly="readonly"  id="Belo_Road" name="Belo_Road" type="text" style="width:80px;"/></td>

					<td align="left" width=80px>总功率:</td>
					<td align="left"><input  readonly="readonly"  id="Powe" name="Powe" type="text" value="24"
						style="width:80px;"/></td>
				</tr>
				<tr align="left"><th><div>权属信息</div><th></tr>
				<tr>
					<td align="left" width=80px>维护区:</td>
					<td align="left"><input  readonly="readonly"  id="Main_Depa" name="Main_Depa" type="text"
						style="width:80px;" value="2-5区" /></td>

					<td align="left" width=80px>大小灯:</td>
					<td align="left"><input  readonly="readonly"  id="Bulb_Type_ID" name="Bulb_Type_ID" type="text"
						style="width:80px;" value="小灯" /></td>

					<td align="left" width=80px>路灯编号:</td>
					<td align="left"><input  readonly="readonly"  id="Fiel_Seri_Code" name="Fiel_Seri_Code" type="text"
						style="width:80px;" /></td>
				</tr>
				<tr align="left"><th>非电器件</div></th></tr>
				<tr>
					<td align="left" width=80px>灯臂:</td>
					<td align="left"><input  readonly="readonly"  id="Pole_Type_ID" name="Pole_Type_ID" type="text"
						style="width:80px;" value="双臂" /></td>

					<td align="left" width=80px>灯源个数:</td>
					<td align="left"><input  readonly="readonly"  id="Bulb_Num" name="Bulb_Num" type="text"
						style="width:80px;" value="2" /></td>

					<td align="left" width=80px>材质类型:</td>
					<td align="left"><input  readonly="readonly"  id="Mate_ID" name="Mate_ID" type="text"
						style="width:80px;" value="铸铁" /></td>
				</tr>
				<tr align="left"><th>电器件</div></th></tr>
				<tr>
					<td align="left" width=80px>电容:</td>
					<td align="left" style="width:80px;"><input  readonly="readonly"  id="dr" name="dr" value="500uF"
						style="width:80px;"/></td>

					<td align="right" width=80px>光源1功率:</td>
					<td align="left" style="width:80px;"><input  readonly="readonly"  id="gygl" name="gygl" value="24w"
						style="width:80px;" /></td>

					<td align="left" width=80px>光源2功率:</td>
					<td align="left" style="width:80px;"><input  readonly="readonly"  id="gygl2" name="gygl2" value="0w"
						style="width:80px;" /></td>
				</tr>
			</table>
			<div id="imageParentDiv">
			
			</div>
						
	</form>
	</div>
	<div title="用电"  style="border:none;padding:0px;margin:0px">
			<div style="position:absolute;left:5px;top:80px;font-size:14px;">基本信息</div>
			<table style="position:absolute;left:80px;top:90px;" data-options="fit:true">
				<tr>
					<td align="right" width=80px>实时电压:</td>
					<td align="left"><a id="tempdy">221</a>V</td>

					<td align="right" width=80px>实时功率:</td>
					<td align="left"><a id="tempgl">400</a>W</td>
				</tr>
				<tr>
					<td align="right" width=80px>实时电流:</td>
					<td align="left"><a id="tempdl">2</a>A</td>

					<td align="right" width=80px>更新时间:</td>
					<td align="left" id="tempTime" width=50px>00:00:00</td>
					<td width=80px>
						<button onClick="timer()">立即更新</button>
					</td>
				</tr>
			</table>
			<div style="position:absolute;left:5px;font-size:14px;top:200px;">用电历史：</div>
			<div style="position:absolute;left:450px;font-size:14px;top:200px;">日期选择：</div>
			<table style="position:absolute;left:5px;top:240px;">
				<tr>
					<td >
						<div id="ydtjmain1" style="height:300px;width:280px;border:1px solid #ccc;padding:3px;"></div> 
					</td>
					<td >
						<div id="cc" class="easyui-calendar"
							style="width:280px;height:300px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<script src="js/lib/echarts-all.js"></script> 
		<script type="text/javascript">
        var myChart = echarts.init(document.getElementById('ydtjmain1'));
        myChart.setOption({
        	
            legend: {
                data:['功率']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitArea : {show : true}
                }
            ],
            series : [
                {
                    name:'功率',
                    type:'line',
                    data:[401,403,400,395,400,405,400,0,0,0,0,0,0,0,0,0,0,0,400,403,400,394,396,400,405]
                }
            ]
        });
        
    </script>
</body>
</html>