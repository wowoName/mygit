<template>
	<div id="app">
		<div class="layout">
			<Layout>
				<Header>
					<Menu mode="horizontal" theme="dark" active-name="1">
						<div class="layout-logo">
							<img src="../static/img/logo.png" style="width: 30px;vertical-align: middle;" />
							<span style="font-size: 18px;color: #ffffff;">特易停</span>
						</div>
						<div class="layout-nav">
							<MenuItem name="1">
							<Icon type="ios-navigate"></Icon>
							指挥中心
							</MenuItem>
							<MenuItem name="2">
							<Icon type="ios-keypad"></Icon>
							运营中心
							</MenuItem>
							<MenuItem name="3">
							<Icon type="ios-analytics"></Icon>
							数据分析
							</MenuItem>
							<MenuItem name="4">
							<Icon type="ios-paper"></Icon>
							客服中心
							</MenuItem>
						</div>
					</Menu>
				</Header>
				<Layout>
					<Sider collapsible :collapsed-width="78" v-model="isCollapsed" @toggleCollapse="testC">
						<Menu active-name="2-1" theme="dark" width="auto" :open-names="['2']" :class="menuitemClasses">
							<Submenu name="1">
								<template slot="title">
									<Icon type="ios-navigate"></Icon>
									<span>运营配置</span>
								</template>
								<MenuItem name="1-1">优惠活动</MenuItem>
								<MenuItem name="1-2">实体停车卡</MenuItem>
								<MenuItem name="1-3">优惠券</MenuItem>
							</Submenu>
							<Submenu name="2">
								<template slot="title">
									<Icon type="ios-keypad"></Icon>
									<span>运营管理</span>
								</template>
								<MenuItem name="2-1">会员管理</MenuItem>
								<MenuItem name="2-2">发票管理</MenuItem>
							</Submenu>
							<Submenu name="3">
								<template slot="title">
									<Icon type="ios-analytics"></Icon>
									<span>监督考核</span>
								</template>
								<MenuItem name="3-1">收费员日收现金</MenuItem>
								<MenuItem name="3-2">收费员签到</MenuItem>
							</Submenu>
						</Menu>
					</Sider>
					<Layout :style="{padding: '0 24px 24px'}">
						<Breadcrumb :style="{margin: '16px 0'}">
							<BreadcrumbItem>指挥中心</BreadcrumbItem>
							<BreadcrumbItem>运营配置</BreadcrumbItem>
							<BreadcrumbItem>优惠活动</BreadcrumbItem>
						</Breadcrumb>
						<Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
							<router-view/>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'App',
		data() {
			return {
				isCollapsed: false
			}
		},
		computed: {
			menuitemClasses: function() {
				return ['menu-item',
					this.isCollapsed ? 'collapsed-menu' : ''
				]
			}
		},
		methods: {
			testC() {
				console.log("===");
			}
		}
	}
</script>

<style scoped>
	#app {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
	
	.ivu-layout {
		height: 100%;
	}
	
	.layout {
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		overflow: hidden;
	}
	
	.layout-logo {
		width: 200px;
		height: 64px;
		background: #5b6270;
		border-radius: 3px;
		float: left;
		position: relative;
		/*top: 15px;*/
		left: -50px;
	}
	
	.layout-nav {
		width: 480px;
		margin: 0 auto;
		margin-right: 20px;
	}
	
	.ivu-layout-sider-children {
		overflow: auto;
	}
	
	.menu-item span {
		display: inline-block;
		overflow: hidden;
		width: 69px;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: bottom;
		transition: width .2s ease .2s;
	}
	
	.menu-item i {
		transform: translateX(0px);
		transition: font-size .2s ease, transform .2s ease;
		vertical-align: middle;
		font-size: 16px;
	}
	
	.collapsed-menu span {
		width: 0px;
		transition: width .2s ease;
	}
	
	.collapsed-menu i {
		transform: translateX(5px);
		transition: font-size .2s ease .2s, transform .2s ease .2s;
		vertical-align: middle;
		font-size: 22px;
	}
</style>