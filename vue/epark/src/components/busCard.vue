<template>
	<Row>
		<Col span="6" offset="9">
		<Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
			<FormItem prop="user" label="用户名">
				<Input type="text" v-model="formInline.user" placeholder="请输入用户名" />
				<Icon type="ios-person-outline" slot="prepend"></Icon>
				</Input>
			</FormItem>
			<FormItem prop="password" label="密码">
				<Input type="password" v-model="formInline.password" placeholder="请输入密码" />
				<Icon type="ios-lock-outline" slot="prepend"></Icon>
				</Input>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="handleSubmit('formInline')"> 保 存</Button>
				<input type='button' @keydown.enter="testSay" value="测试">
			</FormItem>
		</Form>
		</Col>

	</Row>
</template>

<script>
	export default {
		name: "BusCard",
		data() {
			return {
				formInline: {
					user: '',
					password: ''
				},
				ruleInline: {
					user: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							type: 'string',
							min: 6,
							message: '至少六位',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if(valid) {
						this.$Message.success('验证通过!');
						this.$router.push("/");
					} else {
						this.$Message.error('验证失败!');
}
})
},
testSay() {
		console.log("nihao ");
			}
		}
	}
</script>