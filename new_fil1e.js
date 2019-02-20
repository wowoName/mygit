;
(function(global) {
	"use strict";

	function LisuUtils() {
		var _lisuSelf = this;
		//获取当前时间 yy--mm--dd--以后废弃
		this.curentTime = function() {
			var curDate = new Date().toLocaleDateString().replace(/\//g, '-').split("-");
			if(curDate[1] < 10) curDate[1] = 0 + curDate[1];
			if(curDate[2] < 10) curDate[2] = 0 + curDate[2];
			curDate = (curDate[0] + '-' + curDate[1] + '-' + curDate[2]);
			return curDate;
		};
		//时间格式
		this.format = function() {
				Date.prototype.format = function(fmt, beforeDay) {
					/** 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
					 *可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
					 *eg:(new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2018-12-13 08:09:04.423      
					 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2018-12-13 二 20:09:04      
					 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2018-12-13 周二 08:09:04      
					 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2018-12-13 星期二 08:09:04      
					 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2018-12-13 8:9:4.18      
					 * beforeDay 获取当前日期前n天的日期（±n）
					 */
					if(typeof(beforeDay) === 'number')
						this.setDate(this.getDate() + beforeDay);
					var o = {
						"M+": this.getMonth() + 1, //月份         
						"d+": this.getDate(), //日         
						"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
						"H+": this.getHours(), //小时         
						"m+": this.getMinutes(), //分         
						"s+": this.getSeconds(), //秒         
						"q+": Math.floor((this.getMonth() + 3) / 3), //季度         
						"S": this.getMilliseconds() //毫秒         
					};
					var week = {
						"0": "\u65e5",
						"1": "\u4e00",
						"2": "\u4e8c",
						"3": "\u4e09",
						"4": "\u56db",
						"5": "\u4e94",
						"6": "\u516d"
					};
					if(/(y+)/.test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
					}
					if(/(E+)/.test(fmt)) {
						fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
					}
					for(var k in o) {
						if(new RegExp("(" + k + ")").test(fmt)) {
							fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
						}
					}
					return fmt;
				}
			},
			//只能输入数字
			this.number = function(obj) {
				obj.on("input", function(event) {
					var lastValue = event.target.value;
					//首位不为0 2:首位.改为0. 3://清除“数字”和“.”以外的字符    4://只保留第一个. 清除多余的   
					lastValue = lastValue.toString().replace(/^0/g, "").replace(/^\./g, "0.").replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
					lastValue = lastValue.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
					//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
					if(lastValue.indexOf(".") < 0 && lastValue != "")
						lastValue = parseFloat(lastValue);
					event.target.value = lastValue;
				});
			};
		/**
		 * 判断图片
		 * success callback
		 * error   callback
		 * **/
		this.judegeImg = function(url, success, error) {
			var ImgObj = new Image();
			ImgObj.src = url;
			ImgObj.onload = function() {
				if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
					if(success && typeof success == "function") success();
				}
			}
			ImgObj.onerror = function() {
				if(error && typeof error == "function") error();
			}
		};
		/**
		 * 裁剪图片
		 * @params url 图片url
		 * x 图片裁剪的x坐标
		 * y 图片裁剪的y坐标
		 * w 裁剪宽
		 * h 裁剪的高
		 * tw 生成图片宽
		 * th 生成图片高
		 * **/
		this.cropImgs = function(url = "", x = 0, y = 0, w = 0, h = 0, tw = 0, th = 0) {
			var ImgObj = new Image();
			ImgObj.src = url;
			ImgObj.onload = function() {
				if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
					let _cropCanvas = document.createElement('canvas');
					//drawImage(image,x,y,w,h,0,0,width,height) : 从图片中切割出一个矩形区域
					_cropCanvas.getContext('2d').drawImage(ImgObj, x, y, w, h, 0, 0, tw, th);
					// 保存图片信息
					let _lastImageData = _cropCanvas.toDataURL();
					return _lastImageData;
				} else return false;
			}
			ImgObj.onerror = function() {
				return false;
			}
		};
		//reset 填写的是form的id
		this.resetForm = function(container) {
			if(!this.hasThisEle(container)) return;
			var _eleChild = this.getObject(container, "[lisu-model]");
			for(var i = 0; i < _eleChild.length; i++) {
				_lisuSelf.setFormValue(_eleChild[i].nodeName, "", _eleChild[i]);
			}
			var _eleChildError = this.getObject(container, ".lisu-error"),
				_parents = document.getElementById(container),
				_errorClass = this.getObject(container, ".lisu-error-active");
			//移除 错误元素
			for(var i = 0; i < _eleChildError.length; i++) {
				_eleChildError[i].parentNode.removeChild(_eleChildError[i]);
			}
			//移除样式
			for(var i = 0; i < _errorClass.length; i++) {
				_errorClass[i].classList.remove("lisu-error-active")
			}

		};
		//根据lisu-model  填充数据
		this.fillForm = function(container, datas) {
			if(!this.hasThisEle(container)) return;
			var _eleChild = this.getObject(container, "[lisu-model]");
			for(var i = 0; i < _eleChild.length; i++) {
				var _key = _eleChild[i].getAttribute("lisu-model"),
					_value = "";
				if(datas.hasOwnProperty(_key))
					_value = datas[_key];
				if((_eleChild[i].nodeName == "DIV" || _eleChild[i].nodeName == "SPAN") && "" === _value || null === _value) _value = "<span style='color:#c9c9c9'>^_^ 暂无数据</span>";
				_lisuSelf.setFormValue(_eleChild[i].nodeName, _value, _eleChild[i]);
			}
		};
		this.requireForm = function(container) {
			if(!this.hasThisEle(container)) return;
			var _ele = this.getObject(container, '[lisu-re]'),
				throughVeri = true,
				_that = this;
			for(var i = 0; i < _ele.length; i++) {
				var _tooltip = _ele[i].getAttribute("lisu-re");
				if(_tooltip == "") _tooltip = "必填项哦";
				var _thisSi = $(_ele[i]).siblings(".lisu-error");
				if((_ele[i].nodeName == "INPUT" && _ele[i].value == "" && _ele[i].type != "checkbox") || (_ele[i].nodeName == "TEXTAREA" && _ele[i].value == "") || (_ele[i].nodeName == "DIV" && _ele[i].innerHTML == "") || (_ele[i].nodeName == "INPUT" && _ele[i].type == "checkbox" && !_that.siblingsChek(_ele[i]))) {
					throughVeri = false;
					$(_ele[i]).addClass("lisu-error-active");
					if(_thisSi.length > 0)
						_thisSi.html(_tooltip);
					else
						$(_ele[i]).after("<span class='lisu-error'>" + _tooltip + "</span>")
				} else if(_thisSi.length > 0)
					_thisSi.remove(), $(_ele[i]).removeClass("lisu-error-active");
			}
			return throughVeri;
		};
		//同级的checkbox 选择情况
		this.siblingsChek = function(obj) {
			var chkBox = $(obj).parent().find("input[type='checkbox']"),
				checked = false;
			for(var i = 0; i < chkBox.length; i++) {
				if(chkBox[i].checked && !checked) checked = true;
			}
			return checked;
		};
		//模态框的 tabl的高度 //20是lisu-card的padding
		this.getModelHeight = function(container) {
			var thisTblHeight = (document.documentElement.clientHeight * 0.7 - this.otherHeight(container));
			return thisTblHeight < 300 ? 300 : thisTblHeight;
		}; //模态框的宽度
		this.getModelWidth = function() {
			var layWidth = parseInt((document.documentElement.clientHeight * 0.7) * 1.618),
				layWidth = layWidth < 650 ? "650px" : layWidth > 1000 ? "1000px" : layWidth + "px";
			return layWidth;
		};
		this.setFormValue = function(type, value, ele) {
			if(type == "INPUT" || type == "TEXTAREA") ele.value = value;
			else if(type == "DIV" || type == "SPAN") ele.innerHTML = value;
			else if(type == "IMG") ele.src = value;
		};
		//判断对象
		this.hasThisEle = function(container) {
			var _parent = document.getElementById(container);
			if(_parent === null) {
				console.error('未找到元素');
				return false;
			} else return true;
		}
		//获取对象
		this.getObject = function(container, type) {
			return document.getElementById(container).querySelectorAll(type);
		};
		this.otherHeight = function(container) {
			var $element = document.getElementById(container);
			var _ele = $element.querySelectorAll(".tblOffset"),
				height = 0;
			for(var i = 0; i < _ele.length; i++) {
				height += _ele[i].offsetHeight;
			}
			return height + 20;
		};
		/**
		 * 导出表格的数据
		 * 数据格式按照layui table格式
		 * params headerData thead
		 * params JSONData  data
		 * params FileName excelName
		 * 
		 * */
		this.lisuToExcel = function(headerData, data, FileName) {
			var arrData = typeof headerData != 'object' ? JSON.parse(headerData) : headerData,
				excel = '<table>',
				row = "<tr>";
			//thead thead 定义为title
			excel += (headerData.map(function(val) {
				return val.hasOwnProperty("title") ? "<td>" + val.title + "</td>" : "";
			}).join(""));
			excel += row + "</tr>";
			//tbody
			//读取要导出的key[如果不存在field 导出的內容为索引
			var readKey = headerData.map(function(v) {
				return(v.hasOwnProperty("field") && v.field != "") ? v.field : "";
			});
			/**
			 * 字段定义为 field
			 * */
			excel += (data.map(function(a, b, c) {
				return("<tr>" + readKey.map(function(d, e) {
					var _text = a[d] == null ? "" : a[d];
					//如果是自定义显示方式 则使用自定义的方式取值
					if(headerData[e].hasOwnProperty("templet"))
						_text = headerData[e].templet(a)
					return a.hasOwnProperty(d) ? "<td>" + _text + "</td>" : "";
				}).join("") + "</tr>");
			}).join(""));
			excel += '</table>';
			var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
			excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
			excelFile += excel + "</body></html>";
			var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
			var link = document.createElement("a");
			link.href = uri;
			link.style = "visibility:hidden";
			link.download = FileName + ".xls"; //excel名称
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
	var lisuUtils = new LisuUtils();
	//时间格式
	lisuUtils.format();
	// 最后将插件对象暴露给全局对象
	//兼容CommonJs规范
	if(typeof module !== 'undefined' && module.exports) module.exports = lisuUtils;
	//兼容AMD/CMD规范
	if(typeof define === 'function') define(function() {
		return lisuUtils;
	});
	//注册全局变量，兼容直接使用script标签引入该插件
	global.lisuUtils = lisuUtils;
})(this);

/**
 * readme
 * 
 * 以后可以考虑 class  LisuUtils{}
 * 1输入框只能输入数字 
 * lisuUtils.number($("[lisu-type='number']"));
 * 
 * 2 重置  只对添加了 lisu-model 标签的起作用
 * lisuUtils.resetForm("id");
 * 
 * 3：填充数据 
 * @params 
 * id:String
 * data: json
 * readme:只对添加了lisu-model的input div起作用
 * lisuUtils.fillForm("id",data);
 * 
 * 4验证  只对添加了 lisu-re的input div起作用 （只有非空验证）
 * lisuUtils.requireForm("id");
 * */