<template>
	<div class="home-body">
		<div class="project-all">
			<template v-for='project in projectData'>
				<div class="name" v-on:click='successT(1)' v-bind:class="{'success':project.success}">{{project.projectName}}</div>
			</template>
			<div class="name" v-if='addp' v-on:click='addproject'>新增项目</div>
			<div class="name" v-if='!addp'>
				<input type="text" class='name-input' placeholder='请填写项目名称' v-on:keyup.enter='saveProjectFun' v-el:addProject>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='esc' v-on:keyup.esc='escFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='delete' v-on:keyup.delete='deleteFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='space' v-on:keyup.space='spaceFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='up' v-on:keyup.up='upFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='down' v-on:keyup.down='downFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='left' v-on:keyup.left='leftFun'>
			</div>
			<div class="name">
				<input type="text" class='name-input' placeholder='right' v-on:keyup.right='rightFun'>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "TestV",
		components: {},
		ready: function() {},
		methods: {
			//当你选种某个项目时，将其success属性改为true，为其class添加 success 
			successT: function(index) {
				this.projectData.forEach(function(item) {
					item.success = false;
				});
				this.projectData[index].success = true;
			},
			//点击添加项目后让其不显示
			addproject: function() {
				this.addp = false;
			},
			//当用户按回车后，保存添加的项目
			saveProjectFun: function() {
			
				var obj = {}
				obj.success = false;
				let name = this.$els.addproject.value;
				obj.projectName = name.replace(/\s+/g, "");
				this.projectData.push(obj);
				this.addp = true;
			},
			escFun: function() {
				alert("esc");
			},
			deleteFun: function() {
				alert("delete");
			},
			spaceFun: function() {
				alert("space空格键");
			},
			upFun: function() {
				alert("up");
			},
			downFun: function() {
				alert("down");
			},
			leftFun: function() {
				alert("left");
			},
			rightFun: function() {
				alert("right");
			}
		},
		data() {
			return {
				addp: true, //是否显示添加项目
				projectData: [{
					success: false,
					projectName: '人员管理系统'
				}, {
					success: false,
					projectName: '管理系统'
				}, {
					success: false,
					projectName: '假数据1'
				}, {
					success: false,
					projectName: '假数据2'
				}, {
					success: false,
					projectName: '假数据3'
				}],
			}
		}
	}
</script>