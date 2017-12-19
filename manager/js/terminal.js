$(function() {
	initTermtype();
	$table = $('#table');
	queryAll();
	check();
	var index1;
	levelName("#oid", 0);
	if ($('.glyphicon-user').text() != "admin") {
		$('#custom-toolbar').children().last().attr("disabled", "true").css({
			"background-color" : "#696969",
			"border-color" : "#DCDCDC"
		});

	}
});
var Config = {};
function initTermtype() {
	$.ajax({
		url : "../js/config/config.json",
		async : false,
		dataType : "json",
		success : function(result) {
			Config = result;
			dutyPeople();
		},
		error : function(result) {
			alertView("查无此记录");
		}
	});
}
// 获取责任人列表
function dutyPeople(oid) {
	$.ajax({
		url : "queryAllOrganAction.action",
		type : "post",
		async : false,
		dateType : "json",
		success : function(result) {
			Config["OrganArray"] = {};
			$.each(result.organJSONList, function(i, organ) {
				Config["OrganArray"][organ.oid] = organ;
			});
			var data = $.map(result.organJSONList, function(organ) {
				if (organ.olevel != 2)
					return null;
				else
					return {
						id : organ.oid,
						text : organ.uname
					};
			});
			$(".uid-select").select2({
				data : data,
				minimumResultsForSearch : Infinity,// 禁用搜索
				allowClear : true
			});
		},
		error : function(result) {
			alertView("查无此记录");
		},
	});
}

function openTerminalDialog() {
	var abc = new BootstrapDialog({
		title : "添加终端",
		draggable : true,
		message : $('<div></div>').load('addTerminal.html'),
	});
	abc.open();
}
// 终端修改
function editTerminal(row, index) {
	index1 = index;
	$('#editTerminalModal').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var recipient = button.data('whatever');
		var modal = $(this);
		modal.find('.modal-title').text(recipient);
		modal.find('#tid').val(row.tid);
		modal.find('#type').val(row.type);
		modal.find('#cId').val(row.cId);
		modal.find('#date').val(row.date);
		modal.find('#oid').val(row.oid);
		modal.find('#pathColor').css('background-color', row.color).val(row.color);
		$("#oid").val(row.oid).trigger("change");// select选中所取值
		modal.find('#uid').val(row.uid);
		modal.find('#uname').val(row.name);
	})
}
function edit(form) {
	var tid = $('#tid').val();
	var cId = $('#cId').val();
	var uid = $('#uid').val();
	var date = $('#date').val();
	$table.bootstrapTable('updateRow', {
		index : index1,
		row : {
			tid : tid,
			cId : cId,
			uid : uid,
		}
	});
	var data = $(form).serializeObj();
	console.dir(data);
	$.ajax({
		url : "../rest/terminal/update",
		type : "post",
		contentType : "application/json",
		data : JSON.stringify(data),
		dataType : 'text',
		success : function(result) {
			if (result) {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
					confirmButton : "确定",
					title : false,
					content : '修改成功!',
					theme : 'white',
					confirm : function() {
						$('#editTerminalModal').modal('hide');
						location.reload();
					}
				});
			}
			else {
				alertView("修改失败！");
			}
		},
	});
}
// 删除终端
function deleteTerminal() {
	var ids = $.map($table.bootstrapTable('getSelections'), function(row) {
		return row.tid;
	});
	// alert(ids.length);
	if (ids == 0) {
		alertView("请选择所需删除项?");
	}
	else {
		$table.bootstrapTable('remove', {
			field : "tid",
			values : ids
		});
		delTerminal(ids);
	}
}
// 单独删除操作
function deleteOneTerminal(ids) {
	$table.bootstrapTable('remove', {
		field : "tid",
		values : ids
	});
	delTerminal(ids);
}
function delTerminal(ids) {
	$.ajax({
		url : "../rest/terminal/delete",
		type : "post",
		async : false,
		traditional : true,// 这样就能正常发送数组参数了
		// dataType : "json",
		data : {
			"ids" : ids,
		},
		success : function() {
			alertView('删除成功!');
		},
		error : function() {
			alertView("删除失败！！");
		}
	});
}
// 添加终端
function addTerminal(form) {
	var data = $(form).serializeObj();
	$.ajax({
		url : "../rest/terminal/insert",
		type : "post",
		contentType : "application/json",
		data : JSON.stringify(data),
		dataType : 'text',
		success : function(result) {
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
						$('#bd5018ad-b701-4abd-87a8-847e56c48047').modal('hide');
						location.reload();
					}
				});
			}
			else {
				alertView("添加失败！");
			}
		},
	});
}

// 查询所有
function queryAll() {
	$.ajax({
		url : "../rest/terminal/queryall",
		type : "get",
		dataType : 'json',
		success : function(data) {
			if (data.length != 0) {
				var list = $.map(data, function(item) {
					item["type"] = Config.termType[item.type];
					item["isOnline"] = item.isOnline > 0 ? "在线" : "离线";
					item["oid"] = item.oid;
					item["oname"] = Config.OrganArray[item.oid].oname;
					return item;
				});
				userName(list);
			}
			else
				alertView("无相关记录或获取记录失败");
		}
	});
}

// 责任人id到name转换
function userName(list) {
	$.getJSON("queryAllOrganAction.action", function(data) {
		for ( var i = 0; i < list.length; i++) {
			var flag = 0;
			for ( var j = 0; j < data.organJSONList.length; j++) {
				if (list[i].oid == data.organJSONList[j].oid) {
					list[i].uname = data.organJSONList[j].uname;
					flag = 1;
				}
			}
			if (flag == 0) {
				list[i].uname = "查无此人";
			}
		}
		$('#table').bootstrapTable({
			data : list,
			onAll : function(evt) {
				$.each($("td:contains('#')"), function(index, item) {
					$(item).css({
						'background-color' : item.outerText
					});
				});
			},
		});
		$(".export").attr("title", "导出");
	});
}

// 操作
function operateFormatter(value, row, index) {
	return [
			'<a class="edit ml10" id="edit" href="javascript:;" data-toggle="modal" data-target="#editTerminalModal" title="修改" data-whatever="修改终端">',
			'<i class="glyphicon glyphicon-edit"></i>', '</a> ' ].join('');
}

window.operateEvents = {

	'click .like' : function(e, value, row, index) {
		alert('You click like	  icon, row: ' + JSON.stringify(row));
	},

	'click .edit' : function(e, value, row, index) {
		if ($('.glyphicon-user').text() == "admin") editTerminal(row, index);
	},
	'click .remove' : function(e, value, row, index) {
		deleteOneTerminal(row.tid);
	}
}
function check() {
	$('#editTerminalForm').bootstrapValidator({
		// live: 'disabled',
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
			tid : {
				validators : {
					notEmpty : {
						message : '不能为空'
					}
				}
			},
			type : {
				validators : {
					notEmpty : {
						message : '终端类型不能为空'
					}
				/*
				 * , regexp : { regexp : /^[a-zA-Z0-9_\.]+$/, message :
				 * '用户名只能由字母，数字，圆点和下划线组成' }
				 */
				}
			},
			cId : {
				validators : {
					notEmpty : {
						message : '北斗卡ID不能为空'
					}
				}
			},
			uid : {
				validators : {
					notEmpty : {
						message : '责任人ID不能为空'
					}
				}
			},
			date : {
				validators : {
					date : {
						format : 'YYYY-MM-DD HH:mm:ss'
					},
					notEmpty : {
						message : '购买时间不能为空'
					}
				}
			},
		}
	});

	$('#resetBtn').click(function() {
		$('#editTerminalForm').data('bootstrapValidator').resetForm(true);
	});
}
