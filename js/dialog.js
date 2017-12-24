
	var url;
    var type;
    var iframe;
    var dgdata =[];
    var arr=[];
    var ajaxData;
    var ajaxDataGH;
    var listPlayersUrl;
    var listPlayersUrlGH;
    var listPlayersUrl;
    var listGHPlayers;
	var getoddData;
	var userFlow;
	var nameOfuserFlow;
	var sessionid;
    window.onload = function(){
		

    	var url=window.location.href;	  //获取当前页面的url
    	var b=url.split("?")[1]; //获取第一个参数以后的内容 
    	var c=b.split("&");   //从指定的地方将字符串分割成字符串数组
    	arr=new Array();  //新建一个数组
    	for(var i=0;i<c.length;i++){
    	 	 var d=c[i].split("=")[1]; //从=处将字符串分割成字符串数组,并选择第2个元素
    	         arr.push(d);	 //将获取的元素存入到数组中	
    	}
		sessionid = arr[1].split("#")[0];
    	$(".panel-tool")[0].style.display = 'none';
    	listPlayersUrl = "http://106.75.133.210/manage/listallplayers?";
    	listPlayersUrlGH ="http://106.75.133.210/manage/listguilds?";
    	listGHPlayers = "http://106.75.133.210/manage/listPlayersByGuildid?";
    	iframe = document.getElementById("loadHtml");  
    	//动态加载标题和数据———玩家
         $.ajax({
             url: listPlayersUrl+"sessionid="+sessionid+"&start=0&count=10000",
             type: "get",
             dataType: "json",
             success: function (data) {
            	 ajaxData = data;
             },
             error:function(result) {
            	 alert("Sorry，I can not get the feed"); 
            } 
         });
       //动态加载标题和数据———工会列表
         $.ajax({
             url: listPlayersUrlGH+"sessionid="+arr[1].split("#")[0]+"&start=0&count=1000&start=0",
             type: "get",
             dataType: "json",
             success: function (data) {
            	 ajaxDataGH = data;

             },
             error:function(result) {
            	 alert("Sorry，I can not get the feed"); 
            } 
         });
		 //赔率？
		 $.ajax({
             url: "http://106.75.133.210/guess/getodds?"+"sessionid="+arr[1].split("#")[0]+"&start=0&count=10000",
             type: "get",
             dataType: "json",
             success: function (data) {
				 getoddData = data.result_value;
             },
             error:function(result) {
            	 alert("Sorry，I can not get the feed"); 
            } 
         });
		 
		 
         $(".layout-panel-west.layout-split-west")[0].style.width="130px";
         $(".layout-panel.layout-panel-center")[0].style.left="130.3px";
         $("#cancel").click(function(){
        	 window.location.href="http://localhost:8080/LD/login.jsp"
         });
    	 
		 
		 showHtml();
    };
    function showHtml(){
    	 iframe = document.getElementById("loadHtml"); 
    	 iframe.onload = iframe.onreadystatechange = iframeload;
    	 if(arr[0]==2){//工会管理员
    		 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";
    		 $("#community").click(function(){
                /* iframe. onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/community.html";  */
    			 return false; 
             });
   		     $("#players").click(function(){
   		    	iframe. onload = iframe.onreadystatechange = iframeload;   
                iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";  
             });
    		 $("#flow").click(function(){
                 iframe.onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/flow.html";  
             });
    		 $("#rating").click(function(){
    			 iframe. onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/rating.html";
             });
    		 /*$("#players")[0].style.opacity=0.2;*/
    		 $("#flow")[0].style.opacity=0.2;
    		/* $("#rating")[0].style.opacity=0.2;*/
    		 $("#community")[0].style.opacity=0.2;
    	 }else if(arr[0]==1)//管理员登录
    	 {
    		 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";
			 $("#horse").click(function(){
                iframe. onload = iframe.onreadystatechange = iframeload;   
                iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/horse.html";  
             });
			 
    		 $("#community").click(function(){
                 iframe. onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/community.html";  
             });
    		 $("#players").click(function(){
            	 iframe.onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";  
             });
    		 $("#flow").click(function(){
                 iframe.onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/flow.html";  
             });
    		 $("#rating").click(function(){
    			 iframe. onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/rating.html";
             });
    		 $("#players")[0].style.opacity=1;
    		 $("#flow")[0].style.opacity=1;
    		 $("#rating")[0].style.opacity=1;
    		 $("#community")[0].style.opacity=1;
			 
			 $("#flow_li").css("display","none");
    	 }
    	 else{
    		 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";
    		 $("#players").click(function(){
            	 iframe.onload = iframe.onreadystatechange = iframeload;   
                 iframe.src = "http://localhost:8080/LD/html/cheeseAndplay/players.html";  
             });
    	 }
    }
    function iframeload() {  
        if (!iframe.readyState || iframe.readyState == "complete") {  
        	iframe.contentWindow.document.getElementsByClassName('datagrid-body')[1].style.overflow='auto';
        	iframe.contentWindow.document.getElementsByClassName('datagrid-view')[0].style.height="84%";
        	iframe.contentWindow.document.getElementsByClassName('datagrid-body')[1].style.height="84%";
        }  
    }  
    function saveuser() {
        $("#fm").form("submit", {
            url: url,
            onsubmit: function () {
                return $(this).form("validate");
            },
            success: function (result) {
                if (result == "1") {
                    $.messager.alert("提示信息", "操作成功");
                    $("#dlg").dialog("close");
                    $("#dg").datagrid("load");
                }
                else {
                    $.messager.alert("提示信息", "操作失败");
                }
            }
        });
    }
    function destroyUser() {
        var row = $('#dg').datagrid('getSelected');
        if (row) {
            $.messager.confirm('Confirm', '确定删除该条数据吗?', function (r) {
                if (r) {
                    $.post('destroy_user.php', { id: row.id }, function (result) {
                        if (result.success) {
                            $('#dg').datagrid('reload');    // reload the user data  
                        } else {
                            $.messager.show({   // show error message  
                                title: 'Error',
                                msg: result.errorMsg
                            });
                        }
                    }, 'json');
                }
            });
        }
    }  