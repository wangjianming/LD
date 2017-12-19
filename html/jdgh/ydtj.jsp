<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>用电统计</title>
</head>
<body>
	<script src="js/lib/echarts-all.js"></script> 
		<script type="text/javascript">
        var myChart = echarts.init(document.getElementById('ydtjmain'));
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
	<div class="easyui-tabs" data-options="fit:true">
		<div title="属性">
			<div style="position:absolute;left:2px;top:80px;font-size:14px;">基本信息</div>
			<table style="position:absolute;left:40px;font-size:14px;top:100px;">
				<tr>
					<td align="right" width=90px>ID:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="4457" /></td>
					<td align="right" width=90px>街号:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="哈师大北校区058号" /></td>

					<td align="right" width=90px>总功率:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="24W" /></td>
				</tr>
			</table>
			<div style="position:absolute;left:2px;font-size:14px;top:130px;">权属信息</div>
			<table style="position:absolute;left:40px;font-size:14px;top:150px;">
				<tr>
					<td align="right" width=90px>维护区:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="2-5区" /></td>

					<td align="right" width=90px>大小灯:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="小灯" /></td>

					<td align="right" width=90px>路灯编号:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="068" /></td>
				</tr>
			</table>
			<div style="position:absolute;left:2px;font-size:14px;top:180px;">非电配件</div>
			<table style="position:absolute;left:40px;font-size:14px;top:200px;">
				<tr>
					<td align="right" width=90px>灯臂:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="双臂" /></td>

					<td align="right" width=90px>灯源个数:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="2" /></td>

					<td align="right" width=90px>材质类型:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="铸铁" /></td>
				</tr>
			</table>
			<div style="position:absolute;left:2px;font-size:14px;top:230px;">电器件</div>
			<table style="position:absolute;left:40px;font-size:14px;top:250px;">
				<tr>
					<td align="right" width=90px>电容:</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="500F" /></td>

					<td align="right" width=90px>光源1功率(W):</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="24" /></td>

					<td align="right" width=90px>光源2功率(W):</td>
					<td align="left"><input id="modelName" type="text"
						style="width:130px;" value="0" /></td>
					<!-- <td align="right">光源3功率(W):</td>
				<td align="left">
					<input id="modelName" type="text" style="width:169px;"value="0" />
				</td> -->
				</tr>
			</table>
			<div style="position:absolute;left:2px;font-size:14px;top:280px;">照片信息</div>
			<table style="position:absolute;left:5px;font-size:14px;top:300px;">
				<tr>
					<td><img src="images/ludeng.jpg" width="750" height="500" />
					</td>
				</tr>
			</table>
		</div>
		<div title="用电" selected=true>
			<div style="position:absolute;left:5px;top:80px;font-size:14px;">基本信息</div>
			<table style="position:absolute;left:80px;top:90px;">
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
			<table style="position:absolute;left:80px;top:240px;">
				<tr>
					<td width=400px>
						<div id="ydtjmain" style="height:300px;border:1px solid #ccc;padding:10px;"></div> 
		
					</td>
					<td width=400px>
						<div id="cc" class="easyui-calendar"
							style="width:350px;height:300px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>