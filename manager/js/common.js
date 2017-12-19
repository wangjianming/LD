$(function() {
	// 页面自适应
	$(window).resize(function() {
//		$('#table').bootstrapTable('resetView');
	});
});

function levelName(id, num) {
	$.ajax({
		url : "queryAllOrganAction.action",
		type : "post",
		dataType : "json",
		success : function(result) {
			var data = [];
			if (result.organJSONList) {
				for ( var i = 0; i < result.organJSONList.length; i++) {
					if (num != 0) {
						if (result.organJSONList[i].olevel == num) {
							var tmp = {};
							tmp["id"] = result.organJSONList[i].oid;
							tmp["text"] = result.organJSONList[i].oname;
							data.push(tmp);
						}
					}
					else {
						var tmp = {};
						tmp["id"] = result.organJSONList[i].oid;
						tmp["text"] = result.organJSONList[i].oname;
						data.push(tmp);
					}
				}
				$(id).select2({
					data : data,
					minimumResultsForSearch : Infinity,// 禁用搜索
					allowClear : true
				});
			}
		},
		error : function(result) {
			alertView("查无此记录");
		}
	});
}
function changePasswd() {
	BootstrapDialog.show({
		title : "修改密码",
		draggable : true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'changePasswd.html'
		},
	});
}

function change() {
	$.ajax({
		url : "../rest/user/edit",
		type : "post",
		cache : false,
		data : $("#changeForm").serializeArray(),
		success : function(result) {
			if (result) {
				alertView("修改成功！", function() {
					location.reload();
					$('.bootstrap-dialog').modal('hide');
				});
			}
			else {
				alertView('修改失败!');
			}
		}
	});
}

// 弹出alert框
function alertView(str, callback) {
	$.alert({
		animation : 'zoom',
		animationBounce : 2,
		keyboardEnabled : true,
		confirmButton : "确定",
		cancelButton : '取消 ',
		title : false,
		content : str,
		theme : 'white',
		confirm : callback,
	});
}

// 用户退出登录
function logout() {
	$.confirm({
		title : '退出系统登陆吗？',
		content : false,
		keyboardEnabled : true,
		confirmButton : '確定',
		cancelButton : '取消 ',
		confirmButtonClass : 'btn-info',
		cancelButtonClass : 'btn-danger',
		confirm : function() {
			$.ajax({
				type : "post",
				url : "logoutAction.action",
				async : false,
				success : function() {
					location.href = "../login.jsp";
				}
			});
		},
	});
}

function rowStyle(row, index) {
	var classes = [ 'success', 'info', 'warning', 'danger' ];
	if (index % 2 === 0) {
		return {
			classes : classes[index % 3]
		}
	}
	return {};
}

function runningFormatter(value, row, index) {
	return index + 1;
}
