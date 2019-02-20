<template>
	<div class="hello">
		<Button type="primary" @click="gotoBusCard('BusCard')">busCard</Button>
		<Button type="primary" @click="gotoBusCard('TestV')">testV</Button>

	</div>
</template>

<script>
	export default {
		name: 'HelloWorld',
		data() {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		},
		methods: {
			gotoBusCard(name) {
				this.$router.push('/' + name);
				console.log("跳转啊");
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
</style>