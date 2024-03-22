<script setup>
definePageMeta({
	layout: "auth",
	middleware: ["auth"]
});
const nuxtApp = useNuxtApp();

// const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
// 	duration: 2000,
// 	throttle: 200,
// 	estimatedProgress: (duration, elapsed) => (2 / Math.PI) * 100 * Math.atan(((elapsed / duration) * 100) / 50)
// });

// ref
const loginFormEl = ref(null);

//
const ruleForm = reactive({
	id: "bo001",
	password: "1q2w3e4r"
});

const autoId = ref(false);

// function
const onSubmit = async () => {
	// validate
	if (!(await formValidate(loginFormEl.value))) return;

	// 아이디 저장한 경우
	if (autoId) localStorage.setItem("cosBoId", ruleForm.id);
	else localStorage.removeItem("cosBoId");

	const loginApi = await nuxtApp.$_fetch.post("/api/login", { body: { ...ruleForm } });
	if (loginApi?.code !== "S") return;
	nuxtApp.$store.user.setIslogin(true);
	nuxtApp.$store.user.setUserInfo(loginApi.data.user);
	nuxtApp.$router.push(loginApi.data.redirect_url);
};

// validate
const validateId = (rule, value, callback) => {
	if (!value) return callback(new Error("아이디를 입력 해주세요."));
	callback();
};

const validatePassword = (rule, value, callback) => {
	if (!value) return callback(new Error("비밀번호를 입력 해주세요."));
	callback();
};

const rules = reactive({
	id: [{ validator: validateId }],
	password: [{ validator: validatePassword }]
});

// lifecycle
onMounted(() => {
	const storage = localStorage.getItem("cosBoId");
	if (storage) {
		ruleForm.id = storage;
		autoId.value = true;
	}
});
</script>

<template>
	<div>
		<el-form
			ref="loginFormEl"
			:model="ruleForm"
			label-width="auto"
			style="max-width: 600px; padding: 30px"
			hide-required-asterisk
			:rules="rules"
		>
			<el-form-item label="ID" prop="id">
				<el-input v-model="ruleForm.id" placeholder="아이디를 입력하세요." />
			</el-form-item>
			<el-form-item label="PASSWORD" prop="password">
				<el-input v-model="ruleForm.password" type="password" show-password placeholder="비밀번호를 입력하세요." />
			</el-form-item>
			<el-form-item>
				<el-button style="width: 100%" type="primary" @click="onSubmit">로그인</el-button>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-model="autoId"> 아이디 저장 </el-checkbox>
			</el-form-item>
		</el-form>
	</div>
</template>
