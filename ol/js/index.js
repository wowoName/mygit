var layers = [];
var googleSatelliteLayer = new ol.layer.Tile({
	visible: false,
	opacity: .8,
	source: new ol.source.XYZ({
		url: "http://mt{0-3}.google.cn/vt/lyrs=m@169000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=",
		crossOrigin: 'anonymous'
	})
});
layers.push(googleSatelliteLayer);

var controls = [];
//比例尺  1 
var scaleLineControl = new ol.control.ScaleLine({
	units: "metric" //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
});
controls.push(scaleLineControl);
var map = new ol.Map({
	controls: ol.control.defaults({
		attribution: false, //是否显示右下角的属性
		zoom: true //是否显示缩放
	}).extend(controls),
	layers: layers,
	///interactions: ol.interaction.defaults().extend([new app.Drag()]),
	target: 'map',
	view: new ol.View({
		center: ol.proj.transform([119.44, 45.366], 'EPSG:4326', 'EPSG:3857'),
		zoom: 13,
		minZoom: 13,
		maxZoom: 22,
		extent: [13289673.038304245, 5676892.748756419, 13302724.660883939, 5682615.971249272],
		//rotation: 10,
	})
});
//系统层
var source = new ol.source.Vector({
	wrapX: false,
});
var vector = new ol.layer.Vector({
	source: source
});
map.addLayer(vector);
//节点层
var nodesource = new ol.source.Vector({
	wrapX: false
});
var nodevector = new ol.layer.Vector({
	source: nodesource
});
map.addLayer(nodevector);

//设备的卡车层
var carsource = new ol.source.Vector({
	wrapX: false
});
var carvector = new ol.layer.Vector({
	source: carsource,
	name: "drag"
});
map.addLayer(carvector);
//电铲
var dcsource = new ol.source.Vector({
	wrapX: false
});
var dcvector = new ol.layer.Vector({
	source: dcsource,
	name: "drag"
});
map.addLayer(dcvector);
//卸点
var xdsource = new ol.source.Vector({
	wrapX: false
});
var xdvector = new ol.layer.Vector({
	source: xdsource,
	name: "drag"
});
map.addLayer(xdvector);
//钻机
var zjsource = new ol.source.Vector({
	wrapX: false
});
var zjvector = new ol.layer.Vector({
	source: zjsource,
	name: "drag"
});
map.addLayer(zjvector);
//辐设
var fssource = new ol.source.Vector({
	wrapX: false
});
var fsvector = new ol.layer.Vector({
	source: fssource,
	name: "drag"
});
map.addLayer(fsvector);
getAreaData();
//系统层、节点		
function getAreaData() {
	$.ajax({
		type: "get",
		url: "http://p0a46aiqa.bkt.clouddn.com/systemData-2018-08-08.json",
//		url: "http://od5tbr1ue.bkt.clouddn.com/systemData.json",
		dataType: "json", //返回数据格式为json
		async: true,
		success: function(data) {
			//系统层
			var thisSysData = data.system.Rails;
			for(var i = 0; i < thisSysData.length; i++) {
				//获取电子围栏的坐标
				var thisGeom = [],
					thisPoints = thisSysData[i]._Points;
				for(var j = 0; j < thisPoints.length; j++) {
					thisGeom.push(thisPoints[j].X + "," + thisPoints[j].Y);
				}
				//绘制
				drawTheArea(thisGeom, thisSysData[i].ElementName, 'rgba(65,105,225, .2)', "#4169E1");
			}

			//节点层
			var thisNodeData = data.node.Locations;
			for(var i = 0; i < thisNodeData.length; i++) {
				addNodeJoin([Number(thisNodeData[i].Point.X), Number(thisNodeData[i].Point.Y)], thisNodeData[i].ElementName);
			}
			//道路层
			var thisRoadDara = data.roadData.Routes;
			for(var i = 0; i < thisRoadDara.length; i++) {
				//获取道路的坐标
				var thisGeom = [],
					thisPoints = thisRoadDara[i]._Points;
				for(var j = 0; j < thisPoints.length; j++) {
					thisGeom.push(thisPoints[j].X + "," + thisPoints[j].Y);
				}
				//绘制道路[坐标 ，道路的id，填充色，绘制色]
				drawTheLine(thisGeom, thisRoadDara[i].GPSID, "rgba(169,169,169, .2)", "#A9A9A9");
			}
		}
	});
}
//节点[坐标 名称]
function addNodeJoin(point, name) {
	var circle = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat(point)) //坐标的位置				
	});
	circle.setStyle(new ol.style.Style({
		image: new ol.style.Circle({
			radius: 3, //大小
			stroke: new ol.style.Stroke({
				color: '#A2A2A2', //颜色
				size: 1
			}),
			fill: new ol.style.Fill({ //填充的颜色
				color: 'RGBA(162, 162, 162, 1.00)'
			})
		}),
		text: new ol.style.Text({ //文字
			textAlign: "center",
			textBaseline: "top",
			offsetY: 4,
			font: 'bold 16px',
			text: name == "N0" ? "" : name,
			fill: new ol.style.Fill({
				color: "black"
			})
		})

	}));
	nodesource.addFeature(circle);
}

//绘制区域【坐标，名称，填充色，绘制色】
function drawTheArea(coordinates, name, fillColor, strokeColor) {
	var pts = [];
	for(var m = 0; m < coordinates.length; m++) {
		if(coordinates[m] == "") {
			break;
		}
		var cor = ol.proj.transform([Number(coordinates[m].split(",")[0]), Number(coordinates[m].split(",")[1])], 'EPSG:4326', 'EPSG:3857');
		pts.push(cor);
	}
	if(pts && (pts instanceof Array) && pts.length > 1) {
		var feature = new ol.Feature({
			geometry: new ol.geom.Polygon([pts])
		});
		feature.setStyle(new ol.style.Style({ // 设置图层样式
			text: new ol.style.Text({
				fill: new ol.style.Fill({
					color: '#000000'
				}),
				font: '12px simsun, sans-serif',
				text: name
			}),
			fill: new ol.style.Fill({
				color: fillColor
			}),
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: 2
			}),
			zIndex: 2
		}));
		source.addFeature(feature);

	}
}
//绘制线[坐标，id]
function drawTheLine(coordinates, id, fillColor, strokeColor) {
	var thisFeature = source.getFeatureById(id);
	if(thisFeature)
		source.removeFeature(thisFeature);
	var pts = [];
	for(var m = 0; m < coordinates.length; m++) {
		if(coordinates[m] == "") {
			break;
		}
		var cor = ol.proj.transform([Number(coordinates[m].split(",")[0]), Number(coordinates[m].split(",")[1])], 'EPSG:4326', 'EPSG:3857');
		pts.push(cor);
	}
	if(pts && (pts instanceof Array) && pts.length > 1) {
		var feature = new ol.Feature({
			geometry: new ol.geom.LineString(pts)
		});
		feature.setStyle(new ol.style.Style({ // 设置图层样式						
			fill: new ol.style.Fill({
				color: fillColor //'rgba(169,169,169, .2)' 
			}),
			stroke: new ol.style.Stroke({
				color: strokeColor, //'#A9A9A9',
				width: 1
			})
		}));
		//带有箭头的线
		//feature.setStyle(styleFunction(feature));
		source.addFeature(feature);
	}
}

//特殊线的样式
function styleFunction(feature) {
	var geometry = feature.getGeometry();
	var styles = [
		new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(169,169,169, .2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#A9A9A9',
				width: 1
			})
		})
	];

	geometry.forEachSegment(function(start, end) {
		var dx = end[0] - start[0];
		var dy = end[1] - start[1];
		var rotation = Math.atan2(dy, dx);
		// arrows
		styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
			image: new ol.style.Icon({
				src: 'img/arrow.png',
				anchor: [0.75, 0.5],
				rotateWithView: true,
				rotation: -rotation
			})

		}));
	});
	return styles;
};
//位置测试//1:卡车，2:电铲，3:卸点，9:辅助设备;4:钻机
function dotest() {
	drawingEquipment([119.436299, 45.36858], "卡车", "img/kache.png", "song", "#3CB371", 1, [0.5, 30], {
		equipmentName: "1"
	}, 'kache');
	drawingEquipment([119.416299, 45.36858], "卡车", "img/kache-guzhang.png", "song00", "#FF6347", 1, [0.5, 60], {
		equipmentName: "1"
	}, 'kache');

	drawingEquipment([119.446299, 45.35858], "电铲", "img/dianchan.png", "song1", "#00FF00", 2, [0.3, 42], {
		equipmentName: "1"
	}, 'dianchan');
	drawingEquipment([119.426299, 45.35858], "电铲", "img/dianchan-guzhang.png", "song11", "#FF6347", 2, [0.3, 42], {
		equipmentName: "1"
	}, 'dianchan');

	drawingEquipment([119.456299, 45.34858], "辅助设备", "img/fuzhushebei.png", "song2", "#FF8C00", 9, [0.3, 38], {
		equipmentName: "1"
	}, 'fuhse');
	drawingEquipment([119.436299, 45.34858], "辅助设备", "img/fuzhu-guzhang.png", "song22", "#FF6347", 9, [0.3, 38], {
		equipmentName: "1"
	}, 'fushe');

	drawingEquipment([119.466299, 45.33858], "卸点", "img/xiedian.png", "song3", "#00BFFF", 3, [0.5, 60], {
		equipmentName: "1"
	}, 'xiedian');
	drawingEquipment([119.476299, 45.32858], "钻机", "img/zuanji.png", "song4", "#6495ED", 4, [0.45, 60], {
		equipmentName: "1"
	}, 'zuanji');
	drawingEquipment([119.486299, 45.32858], "钻机11", "img/zuanji.png", "song44", "#6495ED", 4, [0.45, 60], {
		equipmentName: "1"
	}, 'zuanji');
}

//绘制设备【坐标，名称，图片，id,文字的颜色,图片中心点】
function drawingEquipment(point, name, img, id, color, type, anchorArr, msg, eqtype) {
	var iconFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857')),
		type: eqtype,
		geom: point,
		msg: JSON.stringify(msg)
	});
	iconFeature.setId(id);
	iconFeature.setStyle(new ol.style.Style({
		image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
			anchor: anchorArr,
			anchorOrigin: 'top-right',
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			offsetOrigin: 'top-right',
			offset: [0, 0], // 位置设定
			scale: .5, // 图标缩放比例
			opacity: 1, // 透明度
			//	rotation: Math.PI / 1.2,//旋转角度
			src: img // 图标的url
		})),
		text: new ol.style.Text({
			textAlign: 'center',
			textBaseline: 'middle',
			font: '12px simsun, sans-serif',
			offsetY: 18,
			text: name.toString(),
			fill: new ol.style.Fill({
				color: "transparent"
			}),
			stroke: new ol.style.Stroke({
				color: color,
				width: 1
			})
		}),
		zIndex: 20
	}));
	//1:卡车，2:电铲，3:卸点，9:辅助设备;4:钻机
	switch(Number(type)) {
		case 1:
			var thisFeature = carsource.getFeatureById(id);
			if(thisFeature)
				carsource.removeFeature(thisFeature);
			carsource.addFeature(iconFeature);
			break;
		case 2:
			var thisFeature = dcsource.getFeatureById(id);
			if(thisFeature)
				dcsource.removeFeature(thisFeature);
			dcsource.addFeature(iconFeature);
			break;
		case 3:
			var thisFeature = xdsource.getFeatureById(id);
			if(thisFeature)
				xdsource.removeFeature(thisFeature);
			xdsource.addFeature(iconFeature);
			break;
		case 4:
			var thisFeature = zjsource.getFeatureById(id);
			if(thisFeature)
				zjsource.removeFeature(thisFeature);
			zjsource.addFeature(iconFeature);
			break;
		case 9:
			var thisFeature = fssource.getFeatureById(id);
			if(thisFeature)
				fssource.removeFeature(thisFeature);
			fssource.addFeature(iconFeature);
			break;
	}
}

function setView() {
	map.setView(new ol.View({
		center: ol.proj.transform([119.44387435913086, 45.360769965283723], 'EPSG:4326', 'EPSG:3857'),
		zoom: 13,
		minZoom: 13,
		maxZoom: 22,
		extent: [13289905.460744347, 5676333.133700891, 13302957.083324041, 5680661.40042754]
	}));

}
map.on('pointermove', function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
map.on('click', function(evt) {
	evt.stopPropagation();
	var coordinate = evt.coordinate; //坐标	
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		return feature;
	});

	if(feature && feature.get("type")) {
		var thisType = feature.get("type");
		if(thisType == "xiedian") return;
		var thisID = feature.getId();
		if($(".ol-popup").length > 0 && $("#" + thisID).length > 0) return;
		$(".ol-popup").css({
			"z-index": "1"
		});
		var elementDiv = document.createElement('div');
		elementDiv.className = "ol-popup"; //
		elementDiv.setAttribute("id", feature.getId()); //
		elementDiv.style.width = '160px';
		elementDiv.style.zIndex = '2';
		//关闭按钮
		var elementA = document.createElement('a');
		elementA.className = "ol-popup-closer";
		elementA.href = '#';
		elementA.addEventListener("click", function() {
			$(this).parent().remove();
		});
		elementDiv.appendChild(elementA); // 新建的div元素添加a子节点
		//创建内容
		var elementContent = document.createElement('div');
		elementDiv.appendChild(elementContent); // 为content添加div子节点

		//内容元素
		var elementContentA = document.createElement('div');
		elementContentA.className = "markerInfo";
		elementContentA.textContent = '详细信息';

		elementContent.appendChild(elementContentA); // 新建的div元素添加a子节点
		//新增div元素
		//获取当前设备属性
		var thisEqMsg = JSON.parse(feature.get("msg"));
		var elementContentDiv = document.createElement('div');
		elementContentDiv.className = "markerText";
		var thisEqH = "";
		switch(thisEqMsg.equipmentStatus.toString()) {
			case "1":
				thisEqMsg.equipmentStatus = "作业";
				break;
			case "2":
				thisEqMsg.equipmentStatus = "延时";
				break;
			case "3":
				thisEqMsg.equipmentStatus = "故障";
				break;
			case "4":
				thisEqMsg.equipmentStatus = "备用";
				break;
			default:
				thisEqMsg.equipmentStatus = "--";
				break;
		}
		thisEqMsg.online ? thisEqMsg.equipmentStatus : thisEqMsg.equipmentStatus = "离线"
		if(thisType == "kache") {
			thisEqH = '<div>设备名称:' + thisEqMsg.equipmentName + '</div><div>设备状态:' + thisEqMsg.equipmentStatus + '</div><div>当前物料:' + thisEqMsg.goods + '</div><div>司机姓名:' + thisEqMsg.mainDriverId + '</div><div>调度起点:</div><div>调度终点:</div>';
		} else {
			thisEqH = '<div>设备名称:' + thisEqMsg.equipmentName + '</div><div>设备状态:' + thisEqMsg.equipmentStatus + '</div><div>司机姓名:' + thisEqMsg.mainDriverId + '</div>';
		}
		elementContentDiv.innerHTML = thisEqH;
		elementContent.appendChild(elementContentDiv); // 为content添加div子节点
		//					
		var popup = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
			element: elementDiv,
			autoPan: true,
			positioning: 'bottom-center',
			stopEvent: false,
			autoPanAnimation: {
				duration: 250 //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度. 单位为毫秒（ms）  
			}
		}));
		map.addOverlay(popup);
		//当前设备的坐标
		var thisPoint = feature.get("geom");
		thisPoint = ol.proj.transform(thisPoint, 'EPSG:4326', 'EPSG:3857');
		if(popup.getPosition() == undefined) {
			popup.setPosition(thisPoint); //设置popup的位置
		}
	}
});
//图形可以编辑
//mapModify();

function mapModify() {
	var selectInteraction = new ol.interaction.Select({
		condition: function(mapBrowserEvent) {
			return ol.events.condition.singleClick(mapBrowserEvent);
		},
		layers: [carvector, dcvector, xdvector, zjvector, fsvector],
		multi: false,
		hitTolerance: 10
	});
	var modify = new ol.interaction.Modify({
		features: selectInteraction.getFeatures(),
		deleteCondition: function(event) {
			return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
		}
	});
	modify.on('modifystart', function(event) {
		//移除popup
		$("#map .ol-popup ").remove();
	});
	modify.on('modifyend', function(event) {
		var lineCoordinates; //改变之后的坐标
		for(var p = 0; p < event.features.getArray().length; p++) {
			lineCoordinates = event.features.getArray()[p].getGeometry().getCoordinates();
			var thisGeom = ol.proj.transform(lineCoordinates, 'EPSG:3857', 'EPSG:4326');
			//重新设置坐标
			event.features.getArray()[p].set("geom", thisGeom);
		}
	});

	map.addInteraction(selectInteraction); //添加选中feature
	map.addInteraction(modify); //可以编辑
	//map.removeInteraction(modify);	//移除
}
//加载所有的设备
function getAllEquipment() {
	//设备类型1卡车，2:电铲，3:卸点，4:钻机9:辅助设备
	//加载卡车1
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?equipmentType=1",
		async: true,
		success: function(data) {
			var thisData = data;
			for(var i = 0; i < thisData.length; i++) {
				if(thisData[i].gpsLong.toString() != "0" && thisData[i].gpsLat.toString() != "0") {
					var thisImg = "",
						anchorArr = [0.5, 30],
						thisColor = "#FF6347",
						// 设备运行状态（1: 待装， 2:装载， 3:重运， 4:待卸， 5:卸载， 6:空运）
						runStatus = thisData[i].tRunStatus,
						equipmentStatus = thisData[i].equipmentStatus,
						goods = thisData[i].goods,
						online = thisData[i].online;
					if(online) {
						switch(equipmentStatus) {
							case 1:
								if(runStatus == 1 || runStatus == 6) {
									//空运
									online ? thisImg = 'img/kache/jiuxu.png' : thisImg = 'img/kache/offline.png'
									online ? thisColor = "#AAEE72" : thisColor = "#A2A2A2";
								} else {
									//重运
									if(goods == '矿石') {
										online ? thisImg = 'img/kache/jiuxu-ks.png' : thisImg = 'img/kache/offline-ks.png'
										online ? thisColor = "#AAEE72" : thisColor = "#A2A2A2";
									} else if(goods == "岩石") {
										online ? thisImg = 'img/kache/jiuxu-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#AAEE72" : thisColor = "#A2A2A2";
									} else {
										//TODO 缺少其他物料的图片
										online ? thisImg = 'img/kache/jiuxu-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#AAEE72" : thisColor = "#A2A2A2";
									}
								}
								break;
							case 2:
								if(runStatus == 1 || runStatus == 6) {
									//空运
									online ? thisImg = 'img/kache/yanshi.png' : thisImg = 'img/kache/offline.png'
									online ? thisColor = "#D3E24A" : thisColor = "#A2A2A2";
								} else {
									//重运
									if(goods == '矿石') {
										online ? thisImg = 'img/kache/yanshi-ks.png' : thisImg = 'img/kache/offline-ks.png'
										online ? thisColor = "#D3E24A" : thisColor = "#A2A2A2";
									} else if(goods == "岩石") {
										online ? thisImg = 'img/kache/yanshi-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#D3E24A" : thisColor = "#A2A2A2";
									} else {
										//TODO 缺少其他物料的图片
										online ? thisImg = 'img/kache/yanshi-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#D3E24A" : thisColor = "#A2A2A2";
									}
								}
								break;
							case 3:
								if(runStatus == 1 || runStatus == 6) {
									//空运
									online ? thisImg = 'img/kache/guzhang.png' : thisImg = 'img/kache/offline.png'
									online ? thisColor = "#EC5228" : thisColor = "#A2A2A2";
								} else {
									//重运
									if(goods == '矿石') {
										online ? thisImg = 'img/kache/guzhang-ks.png' : thisImg = 'img/kache/offline-ks.png'
										online ? thisColor = "#EC5228" : thisColor = "#A2A2A2";
									} else if(goods == "岩石") {
										online ? thisImg = 'img/kache/guzhang-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#EC5228" : thisColor = "#A2A2A2";
									} else {
										//TODO 缺少其他物料的图片
										online ? thisImg = 'img/kache/guzhang-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#EC5228" : thisColor = "#A2A2A2";
									}
								}
								break;
							case 4:
								if(runStatus == 1 || runStatus == 6) {
									//空运
									online ? thisImg = 'img/kache/beiyong.png' : thisImg = 'img/kache/offline.png'
									online ? thisColor = "#8EFBFD" : thisColor = "#A2A2A2";
								} else {
									//重运
									if(goods == '矿石') {
										online ? thisImg = 'img/kache/beiyong-ks.png' : thisImg = 'img/kache/offline-ks.png'
										online ? thisColor = "#8EFBFD" : thisColor = "#A2A2A2";
									} else if(goods == "岩石") {
										online ? thisImg = 'img/kache/beiyong-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#8EFBFD" : thisColor = "#A2A2A2";
									} else {
										//TODO 缺少其他物料的图片
										online ? thisImg = 'img/kache/beiyong-ys.png' : thisImg = 'img/kache/offline-ys.png'
										online ? thisColor = "#8EFBFD" : thisColor = "#A2A2A2";
									}
								}
								break;
						}
						//					thisData[i].equipmentStatus == "2" ? (thisColor = "#FF6347", thisImg = "img/kache-guzhang.png", anchorArr = [0.5, 30]) : (thisColor = "#3CB371", thisImg = "img/kache.png", anchorArr = [0.5, 30]);
						//定位设备【红色】
						drawingEquipment([Number(thisData[i].gpsLong), Number(thisData[i].gpsLat)], thisData[i].equipmentName, thisImg, thisData[i].equipmentId, thisColor, 1, anchorArr, thisData[i], "kache");
					}

				}
			}
		}
	});
	//电铲2
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?equipmentType=2",
		async: true,
		success: function(data) {
			var thisData = data;
			for(var i = 0; i < thisData.length; i++) {
				if(thisData[i].gpsLong.toString() != "0" && thisData[i].gpsLat.toString() != "0") {
					var thisImg = "",
						anchorArr = [0.5, 30],
						thisColor = "#FF6347",
						// 设备运行状态（1: 待装， 2:装载， 3:重运， 4:待卸， 5:卸载， 6:空运）
						runStatus = thisData[i].sRunStatus,
						equipmentStatus = thisData[i].equipmentStatus,
						goods = thisData[i].goods,
						online = thisData[i].online;
					if(online) {
						switch(equipmentStatus) {
							case 1:
								thisImg = 'img/dianchan/jiuxu.png'
								thisColor = "#74A54E"
								break;
							case 2:
								thisImg = 'img/dianchan/yanshi.png'
								thisColor = "#EFB03D"
								break;
							case 3:
								thisImg = 'img/dianchan/guzhang.png'
								thisColor = '#ED5C2A'
								break;
							case 4:
								thisImg = 'img/dianchan/beiyong.png'
								thisColor = "#6B96F8"
								break;
						}
						//					thisData[i].equipmentStatus == "2" ? (thisColor = "#FF6347", thisImg = "img/dianchan-guzhang.png") : (thisColor = "#00FF00", thisImg = "img/diancha.png");
						//定位设备【字体颜色绿色】
						drawingEquipment([Number(thisData[i].gpsLong), Number(thisData[i].gpsLat)], thisData[i].equipmentName, thisImg, thisData[i].equipmentId, thisColor, 2, [0.3, 42], thisData[i], "dianchan");
					}

				}
			}
		}
	});
	//3 卸点
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?equipmentType=3",
		async: true,
		success: function(data) {
			var thisData = data;
			for(var i = 0; i < thisData.length; i++) {
				if(thisData[i].gpsLong.toString() != "0" && thisData[i].gpsLat.toString() != "0") {
					var thisImg = "",
						thisColor = "#FF6347";
					thisData[i].equipmentStatus == "2" ? (thisColor = "#FF6347", thisImg = "img/xiedian.png") : (thisColor = "#00BFFF", thisImg = "img/xiedian.png");
					//定位设备【字体 深天蓝】
					drawingEquipment([Number(thisData[i].gpsLong), Number(thisData[i].gpsLat)], thisData[i].equipmentName, thisImg, thisData[i].equipmentId, "#00BFFF", 3, [0.5, 60], thisData[i], "xiedian");
				}
			}
		}
	});
	//4钻机
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?equipmentType=4",
		async: true,
		success: function(data) {
			var thisData = data;
			for(var i = 0; i < thisData.length; i++) {
				if(thisData[i].gpsLong.toString() != "0" && thisData[i].gpsLat.toString() != "0") {
					var thisImg = "",
						thisColor = "";
					thisData[i].equipmentStatus == "2" ? (thisColor = "#FF6347", thisImg = "img/zuanji.png") : (thisColor = "#6495ED", thisImg = "img/zuanji.png");
					//定位设备【字体 矢车菊蓝】
					drawingEquipment([Number(thisData[i].gpsLong), Number(thisData[i].gpsLat)], thisData[i].equipmentName, thisImg, thisData[i].equipmentId, thisColor, 4, [0.45, 60], thisData[i], "zuanji");
				}
			}
		}
	});
	//辅助设备9
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?equipmentType=9",
		async: true,
		success: function(data) {
			var thisData = data;
			for(var i = 0; i < thisData.length; i++) {
				if(thisData[i].gpsLong.toString() != "0" && thisData[i].gpsLat.toString() != "0") {
					var thisImg = "",
						thisColor = "";
					thisData[i].equipmentStatus == "2" ? (thisColor = "#FF6347", thisImg = "img/fuzhu-guzhang.png") : (thisColor = "#FF8C00", thisImg = "img/fuzhushebei.png");
					//定位设备【字体 橙色】
					drawingEquipment([Number(thisData[i].gpsLong), Number(thisData[i].gpsLat)], thisData[i].equipmentName, thisImg, thisData[i].equipmentId, thisColor, 9, [0.3, 38], thisData[i], "fushe");
				}
			}
		}
	});
	//30S 更新一次
	setTimeout(getAllEquipment, 5000);
}
//搜索设备
function doSearchEq() {
	var thisSelVal = $.trim($("#doSearchEqVal").val());
	if(thisSelVal == "") return;
	$.ajax({
		type: "get",
		url: "http://192.168.43.167:8080/equipmentInfo/getMdsEquipmentInfoList?&equipmentName=" + thisSelVal,
		async: true,
		success: function(data) {
			var thisData = data;
			var thisHtml = "";
			if(thisData.length > 0) {
				for(var i = 0; i < thisData.length; i++) {
					thisHtml += '<dd data-id="' + thisData[i].equipmentId + '" title=" "><em>' + thisData[i].equipmentName + '</em></dd>';
				}
			} else {
				thisHtml = '<dd data-id="" class="data-null">查无结果</dd>';
			}
			$('#searchResult_list').html(thisHtml);
			$("#searchResult").slideDown(200);
		},
		error: function() {
			console.log("错误！");
		}
	});
};

$(function() {
	//加载所有的设备
	getAllEquipment();
	$("#map").on("click", ".ol-popup", function() {
		$(".ol-popup").css({
			"z-index": "1"
		});
		$(this).css({
			"z-index": "20"
		});

	});
	//设备的切换
	$(".equipment-ul").on("click", "li", function() {
		var thisValue = $(this).attr("value");
		if(thisValue == "all") {
			nodevector.setVisible(true); //节点
			carvector.setVisible(true); //卡车
			dcvector.setVisible(true); //电铲
			xdvector.setVisible(true); //卸点
			zjvector.setVisible(true); //钻机
			fsvector.setVisible(true); //辐设
		} else {
			nodevector.setVisible(false); //节点
			carvector.setVisible(false); //卡车
			dcvector.setVisible(false); //电铲
			xdvector.setVisible(false); //卸点
			zjvector.setVisible(false); //钻机
			fsvector.setVisible(false); //辐设
			switch(thisValue) {
				case "car":
					carvector.setVisible(true); //卡车
					break;
				case "dc":
					dcvector.setVisible(true); //电铲
					break;
				case "fs":
					fsvector.setVisible(true); //辐设
					break;
				case "zj":
					zjvector.setVisible(true); //钻机
					break;
				case "jd":
					nodevector.setVisible(true); //节点
					break;
			}

		}
		$(this).addClass("equipment-active").siblings().removeClass("equipment-active");
	});
	//搜索内容的点击事件
	$("#searchResult_list").on("click", "dd", function() {
		var thisId = $(this).attr("data-id");
		//定位设备
		var thisFeature1 = carsource.getFeatureById(thisId);
		var thisFeature2 = dcsource.getFeatureById(thisId);
		var thisFeature3 = xdsource.getFeatureById(thisId);
		var thisFeature4 = zjsource.getFeatureById(thisId);
		var thisFeature5 = fssource.getFeatureById(thisId);
		if(thisFeature1)
			map.getView().fit(thisFeature1.getGeometry().getExtent(), map.getSize());
		else if(thisFeature2) {
			map.getView().fit(thisFeature2.getGeometry().getExtent(), map.getSize());
		} else if(thisFeature3) {
			map.getView().fit(thisFeature3.getGeometry().getExtent(), map.getSize());
		} else if(thisFeature4) {
			map.getView().fit(thisFeature4.getGeometry().getExtent(), map.getSize());
		} else if(thisFeature5) {
			map.getView().fit(thisFeature5.getGeometry().getExtent(), map.getSize());
		}

	});

});

console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~ fanxuchao: start ~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log(map.getSize());
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~ fanxuchao: end ~~~~~~~~~~~~~~~~~~~~~~~~~~");
document.addEventListener("click", function(event) {
	if(event.target.closest("#searchResult") == null && event.target.closest("#doSearchEq") == null) {
		$("#searchResult").slideUp(200);
	}
});