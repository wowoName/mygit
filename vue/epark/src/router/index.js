import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import BusCard from '@/components/busCard'
import TestV from '@/components/testV'
Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'HelloWorld',
		component: HelloWorld
	}, {
		path: '/BusCard',
		name: 'BusCard',
		component: BusCard
	}, {
		path: '/TestV',
		name: 'TestV',
		component: TestV
	}]
})