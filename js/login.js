var sessionId;
$(function() {
	validation();
	$table = $('#table');
	// loginCallback();
	$(".form-group.has-feedback")[3].style.height = "75px";
});
function loginCallback() {
	var callbackStr = getStatus();
	if (callbackStr !== "unlogin") {
		var info = BootstrapDialog.show({
			message : callbackStr,
			type : BootstrapDialog.TYPE_INFO,
			closable : true,
			draggable : true,
			autodestroy : true,
		});
		setTimeout(function() {
			info.close();
		}, 1000);
	}

}
function cancel() {
	$(":text").val("");
	$(":password").val("");
}
function register() {
	BootstrapDialog.show({
		title : "用户注册 ",
		draggable : true,
		message : $('<div></div>').load('addUser.html'),
	});

}
function addUser(form) {
	$.ajax({
		type : "post",
		url : "insertAction.action",
		cache : false,
		// dataType : 'json',
		data : $(form).serializeArray(),
		success : function(result) {
			$('#adduserModal').modal('hide');
			if (result.userObject.isSuccess) {
				$.alert({
					animation : 'zoom',
					animationBounce : 2,
					keyboardEnabled : true,
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
var baseUrl = "http://106.75.133.210/user/login?";
// 用户登陆
function login(form) {
	$.ajax({
		type : "get",
		url:baseUrl+"unmorphonenumber="+form[0][0].value+"&password="+form[0][1].value+"",
		cache : false,
		dataType : 'json',
		success : function(e) {
			if(e.result_code==10003)
			{
				alert(e.result_message);
			}else{
				var characterId = e.result_code;
				var loginMsg = e.result_message;
				sessionId = e.result_value;
				window.location.href='index.jsp?characterId='+e.result_code+'&sessionId='+e.result_value;;
			}
			//登录成功后此处返回sessionID,在此处可以设置一个全局变量var userID = result_value;
			//{"result_code":1,"result_value":"b1e45f60-46eb-4686-a454-dca6c4f7d398","result_message":"登录成功！"}
			/*var location = b.getResponseHeader("location");
			window.location.href = location;*/
		},
	});

}
/*
 * // 管理员登陆 function managerlogin(form) { $.ajax({ type : "post", url :
 * "sysloginAction.action", cache : false, dataType : 'json', data :
 * $(form).serializeArray(), success : function(result) { if
 * (result.userObject.isSuccess == 0) { $.alert({ animation : 'zoom',
 * animationBounce : 2, keyboardEnabled : true, title : false, content :
 * '登陆失败!', theme : 'white', }); } }, }); }
 */

/* 用户登陆验证 */
function validation() {
	$('#loginForm').bootstrapValidator({
		message : '值无效',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		 submitHandler : function(validator, form, submitButton) {
		 login(form);
		 },
		fields : {
			userName : {
				message : '用户名无效',
				validators : {
					notEmpty : {
						message : '用户名不能为空'
					}
				  , regexp : { regexp : /^[a-zA-Z0-9_\.]+$/, message :'用户名只能包括字符、数字、圆点和下划线' },
				}
			},
			password : {
				validators : {
					notEmpty : {
						message : '密码不能为空'
					},
					stringLength : {
						min : 1,
						max : 30,
						message : '密码长度应该为1到30位'
					}
				}
			}
		}
	});

	/* 管理员登陆验证 */
	$('#managerLoginForm').bootstrapValidator({
		message : '值无效',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		/*
		 * submitHandler : function(validator, form, submitButton){
		 * managerlogin(form); },
		 */
		fields : {
			managerName : {
				message : '用户名无效',
				validators : {
					notEmpty : {
						message : '用户名不能为空'
					}
				/*
				 * , regexp : { regexp : /^[a-zA-Z0-9_\.]+$/, message :
				 * '用户名只能包括字符、数字、圆点和下划线' }
				 */
				}
			},
			managerPassword : {
				validators : {
					notEmpty : {
						message : '密码不能为空'
					},
					stringLength : {
						min : 1,
						max : 30,
						message : '密码长度应该为1到30位'
					}
				}
			}
		}
	});
}
