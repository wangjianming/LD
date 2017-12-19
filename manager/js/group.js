$(function() {
	$table = $('#table');
	valiatorGroup();
	getOrgan();
	var index1;
	if ($('.glyphicon-user').text() != "admin") {
		$('#custom-toolbar').children().last().attr("disabled", "true").css({
			"background-color" : "#696969",
			"border-color" : "#DCDCDC"
		});
	}
});
// 单独删除操作
function deleteOneGroup(ids) {
	var $killrow = $(this).parent().parent('tr');
	$killrow.addClass("danger");
	$killrow.fadeOut(100, function() {
		$(this).remove();
	});
}

// 删除多个
function deleteMulite() {
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.oid;
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
					field : "oid",
					values : ids
				});

				deleteGroup(ids);
			},
			cancel : function() {

			}
		});
	}
}
function deleteGroup(ids) {
	$.ajax({
		type : "post",
		url : "deleteOrganAction.action",
		cache : false,
		traditional : true,// 这样就能正常发送数组参数了
		data : {
			"ids" : ids,
		},
		success : function(result) {
			if (result.organObject.isSuccess == 0) {
				alertView('删除失败!');
			}
			else {
				alertView("删除成功！");

			}
		}
	});
}
// 查询所有数据
function getOrgan() {
	$.ajax({
		type : "post",
		url : "queryAllOrganAction.action",
		cache : false,
		dataType : 'json',
		success : function(data) {
			if (data.organJSONList != null) {
				var list = transformTable(data.organJSONList);
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

function transformTable(data) {
	var list = [];
	for ( var i = 0; i < data.length; i++) {
		if (data[i].olevel == 1) {
			var arr = subLevel(data, data[i].oid);
			for ( var j = 0; j < arr.length; j++) {
				var obj = {};
				obj["zone"] = data[i].oid;
				obj["zoneName"] = data[i].oname;
				obj["oid"] = arr[j].oid;
				obj["team"] = arr[j].oname;
				obj["leader"] = arr[j].uname;
				obj["omember"] = arr[j].omember;
				obj["ophone"] = arr[j].ophone;
				list.push(obj);
			}
		}
	}
	return list;
}

// 获取下级列表
function subLevel(data, oid) {
	var arr = [];
	for ( var i = 0; i < data.length; i++) {
		var obj = {};
		if (oid == data[i].oparent) {
			obj["oname"] = data[i].oname;
			obj["oid"] = data[i].oid;
			obj["uname"] = data[i].uname;
			obj["omember"] = data[i].omember;
			obj["ophone"] = data[i].ophone;
			arr.push(obj);
		}
	}
	return arr;
}

function addGroup() {
	BootstrapDialog.show({
		title : "添加小队",
		draggable : true,
		message : function(dialog) {
			var $message = $('<div></div>');
			var pageToLoad = dialog.getData('pageToLoad');
			$message.load(pageToLoad);
			return $message;
		},
		data : {
			'pageToLoad' : 'addGroup.html'
		},
	});
}

function addForm(form) {
	$.ajax({
		type : "post",
		url : "addOrganAction.action",
		cache : false,
		dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			if (result.organObject.isSuccess == 0) {
				alertView('添加失败!');
			}
			else {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					confirmButton : "确定",
					title : false,
					content : "添加成功！",
					theme : 'white',
					confirm : function() {
						$('.modal-dialog').modal('hide');
						location.reload();
					}
				});
			}
		},
	});
}
function valiatorGroup() {
	$('#editGroupForm').bootstrapValidator({
		message : '无效值',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		submitHandler : function(validator, form, submitButton) {
			edit(form);
		},
		fields : {
			team : {
				validators : {
					notEmpty : {
						message : '不能为空'
					}
				}
			},
			leader : {
				validators : {
					notEmpty : {
						message : '终端类型不能为空'
					}
				}
			},
			ophone : {
				validators : {
					notEmpty : {
						message : '北斗卡ID不能为空'
					},
					regexp : {
						regexp : /^[0-9]+$/,
						message : '电话格式不正确'
					}
				}
			},
			omember : {
				validators : {
					notEmpty : {
						message : '责任人ID不能为空'
					}
				}
			},
		}
	});
}
// 记录修改
function editGroup(row, index) {
	index1 = index;
	levelName("#zone", 1);
	$('#editGroupModal').on('show.bs.modal', function(event) {
		var modal = $(this);
		modal.find('#oid').val(row.oid);
		modal.find('#zoneName').val(row.zone);// ID保存到这个里面
		modal.find('#zoneID').val(row.zoneName);// 显示名称
		modal.find('#team').val(row.team);
		modal.find('#leader').val(row.leader);
		modal.find('#ophone').val(row.ophone);
		modal.find('#omember').val(row.omember);
	});
}

function edit(form) {
	var zone = $('#zoneID').val();
	var oid = $('#oid').val();
	var zoneName = $('#zoneName').val();
	var team = $('#team').val();
	var leader = $('#leader').val();
	var ophone = $('#ophone').val();
	var omember = $('#omember').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			zone : zone,
			leader : leader,
			team : team,
			ophone : ophone,
			omember : omember,
		}
	});
	$.ajax({
		type : "post",
		url : "updateGroupAction.action",
		cache : false,
		dataType : 'json',
		data : {
			id : oid,
			zone : zoneName,
			leader : leader,
			team : team,
			ophone : ophone,
			omember : omember,
		},
		success : function(result) {
			$('#editGroupModal').modal('hide');
			if (result.organObject.isSuccess) {
				alertView("修改成功！！");
			}
			else {
				alertView("修改失败！");
			}
		},
	});
}
// 操作
function operateFormatter(value, row, index) {
	if ($('.glyphicon-user').text() != "admin")
		return [
				'<a class="edit ml10" id="edit" href="javascript:;" data-target="#editGroupModal" title="修改" data-whatever="修改小组">',
				'<i class="glyphicon glyphicon-edit" style="color:#696969;"></i>', '</a> ' ].join('');
	else
		return [
				'<a class="edit ml10" id="edit" href="javascript:void(0)" data-toggle="modal" data-target="#editGroupModal" title="Edit" data-whatever="修改小组">',
				'<i class="glyphicon glyphicon-edit"></i>', '</a>&nbsp;' ].join('');
}

window.operateEvents = {
	'click .edit' : function(e, value, row, index) {
		editGroup(row, index);
	},
	'click .remove' : function(e, value, row, index) {
		deleteOneGroup(row.id);
	}
}
