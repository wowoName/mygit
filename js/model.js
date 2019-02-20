;
(function(global) {
	"use strict";
	var LisuForm = function(data) {
		this.data = data;
		this.init();
	}
	var lisuFormObj = LisuForm.prototype;
	lisuFormObj.init = function() {
		var that = this;
		Object.keys(this.data).forEach(function(key) {
			that.defineObect(key);
			that.bindValue(key, that.data[key]);

		});
	};
	lisuFormObj.defineObect = function(key) {
		let that = this;
		Object.defineProperty(this, key, {
			enumerable: false,
			configurable: true,
			set: function(newValue) {
				console.log("进来了吗", newValue);
				//this[key] = newValue;
			},
			get: function() {
				return this.aa;
			}
		})
	};
	lisuFormObj.getValue = function(key) {
		return this.data[key];
	};
	lisuFormObj.bindValue = function(key, val) {
		var el = this.lisugetEle(key),
			that = this;
		el.forEach(function(v) {
			v.value = val;
			that.bindInput(key);
		})
	};
	lisuFormObj.lisugetEle = function(key, fun) {
		return document.querySelectorAll('[v-model="' + key + '"]');
	};
	//绑定input事件
	lisuFormObj.bindInput = function(key) {
		var el = this.lisugetEle(key),
			that = this;
		el.forEach(function(v) {
			v.addEventListener("input", function() {
				that.data[key] = this.value.replace(/(^\s*)|(\s*$)/g, "");
				that.bindValue(key, that.data[key]);
			})
		});
	}
	//添加监听者
	function Watcher(node, name) {
		this.vm = vm;
		this.node = node;
		this.name = name;
		this.update();
	}

	watcher.prototype = {
		update() {
			this.get();
			//input标签特殊处理化
			if(this.node.nodeName === 'INPUT') {
				this.node.value = this.value;
			} else {
				this.node.nodeValue = this.value;
			}
		},
		get() {
			//这里调用了数据劫持的getter
			this.value = this.vm[this.name];
		}
	};

	lisuFormObj.watchLish = function(node, key) {

	}

	if(typeof module !== 'undefined' && module.exports) module.exports = LisuForm;
	if(typeof define === 'function') define(function() {
		return LisuForm;
	});
	global.LisuForm = LisuForm;
})(this);