$(function() {
	queryAll();
	$table = $('#table');
	if ($('.glyphicon-user').text() != "admin") {
		$('#custom-toolbar').children().attr("disabled", "true").css({
			"background-color" : "#696969",
			"border-color" : "#DCDCDC"
		});
	}

});

function openDialog() {
	BootstrapDialog.show({
		title : "添加用户 ",
		draggable : true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addUser.html'
		},
	});
}

function addUser(form) {
	$.ajax({
		type : "post",
		url : "../rest/user/insert",
		contentType : "application/json",
		data : JSON.stringify({
			"uname" : $("input#uname").val(),
			"upassword" : $("input#upassword").val(),
			"organ" : {
				"oid" : $("select#oid").val(),
			}
		}),
		success : function(result) {
			$('#adduserModal').modal('hide');
			if (result) {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					confirmButton : "确定",
					title : false,
					content : '添加成功!',
					theme : 'white',
					confirm : function() {
						location.reload();
					}
				});
			}
			else {
				alertView("添加失败！！");
			}
		},
		error : function() {
			$('#adduserModal').modal('hide');
			alertView("添加失败");
		}
	});
}

// 删除用户
function deleteUser() {
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.uid;
	});
	if (ids == 0) {
		alertView("请选择所需删除项?");
	}
	else {
		$.confirm({
			title : false,
			content : '确定删除这' + ids.length + '项吗？',
			confirmButton : "确定",
			cancelButton : '取消 ',
			theme : 'white',
			confirm : function() {
				$table.bootstrapTable('remove', {
					field : "uid",
					values : ids
				});
				delUser(ids);
			},
		});
	}
}
// 单独删除操作
function deleteOneUser(ids) {
	$table.bootstrapTable('remove', {
		field : "uid",
		values : ids
	});
	delUser(ids);
}
function delUser(ids) {
	$.ajax({
		url : "../rest/user/deleteMultiple",
		type : "post",
		async : false,
		traditional : true,// 这样就能正常发送数组参数了
		data : {
			"ids" : ids,
		},
		success : function() {
			alertView("删除成功！！");
		},
		error : function() {
			alertView("删除失败！！");
		}
	});
}

// 查询所有用户
function queryAll() {
	$.ajax({
		type : "get",
		url : "../rest/user/queryall",
		dataType : 'json',
		success : function(data) {
			if (data.length != 0) {
				var list = $.map(data, function(user, index) {
					user["oname"] = user.organ.oname;
					if (user.initloc) {
						user["center"] = user.initloc.center;
						user["zoom"] = user.initloc.zoom;
					}
					return user;
				});
				$('#table').bootstrapTable({
					data : list
				});
				$(".export").attr("title", "导出");
			}
			else
				alertView("无相关记录或获取记录失败");
		}
	});
}
