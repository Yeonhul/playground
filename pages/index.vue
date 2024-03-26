<script setup>
import { useEventListener } from "@vueuse/core";
import typingData from "@/assets/json/typing.json";
const nuxtApp = useNuxtApp();
const inputRef = ref(null);
// const typingText = ref("두려움이 있음에도 불구하고, 계속하기 위해 용기를 가져라.");
const count = ref(0);
const text = ref("");
const isComposition = ref(false);
const startTime = ref(null);
const lastTime = ref(null);
const keyStorkes = ref(0);
const cpm = ref(0);
const typingList = ref([]);
const keyBanList = [
	{ code: 8, key: "Backspace" },
	{ code: 9, key: "Tab" },
	// { code: 13, key: "Enter" },
	{ code: 16, key: "Shift" },
	{ code: 17, key: "Control" },
	{ code: 18, key: "Alt" },
	{ code: 20, key: "CapsLock" },
	{ code: 27, key: "Escape" },
	{ code: 33, key: "PageUp" },
	{ code: 34, key: "PageDown" },
	{ code: 35, key: "End" },
	{ code: 36, key: "Home" },
	{ code: 37, key: "ArrowLeft" },
	{ code: 38, key: "ArrowUp" },
	{ code: 39, key: "ArrowRight" },
	{ code: 40, key: "ArrowDown" },
	{ code: 45, key: "Insert" },
	{ code: 46, key: "Delete" },
	{ code: 91, key: "Meta (Left)" },
	{ code: 93, key: "Meta (Right)" },
	{ code: 112, key: "F1" },
	{ code: 113, key: "F2" },
	{ code: 114, key: "F3" },
	{ code: 115, key: "F4" },
	{ code: 116, key: "F5" },
	{ code: 117, key: "F6" },
	{ code: 118, key: "F7" },
	{ code: 119, key: "F8" },
	{ code: 120, key: "F9" },
	{ code: 121, key: "F10" },
	{ code: 122, key: "F11" },
	{ code: 123, key: "F12" },
	{ code: 144, key: "NumLock" },
	{ code: 145, key: "ScrollLock" }
];
const classText = computed(() => {
	const marked = [];
	nuxtApp.$_.forEach(text.value, (value, index) => {
		// 1. 유니코드비교하여 글자가 동일하지 않을 때,
		// 2. 마지막 입력값일 땐 상시 체크하며, 그렇지 않을 땐 입력이 끝난 뒤 체크
		if (
			value?.charCodeAt(0) !== typingText.value[index]?.charCodeAt(0) &&
			(text.value.length === typingText.value.length || text.value.length - 1 !== index)
		) {
			marked.push(index);
		}
	});
	return marked;
});

const typingText = computed(() => {
	return typingList.value[count.value]?.content;
});

const splitTypingText = computed(() => typingText.value?.split(""));

const acc = computed(() => {
	if (!startTime.value) return 0;
	return nuxtApp.$_.floor(((typingText.value.length - classText.value.length) * 100) / typingText.value.length) || 0;
});

const inputStart = e => {
	isComposition.value = true;
};

const inputEnd = e => {
	isComposition.value = false;
};

let intervalCPM = null;
let countAnimate = null;

const calcCPM = () => {
	// 천천히 증가하는 기능
	const elapsedTime = Date.now() - startTime.value;
	const newCPM = nuxtApp.$_.floor((keyStorkes.value / elapsedTime) * 60000);
	if (countAnimate?.isRunning()) countAnimate.stop();
	else cpm.value = newCPM;
	countAnimate = countAnimateCreater(newCPM);
};

const countAnimateCreater = count => {
	const interval = new Interval(() => {
		if (count === cpm.value) return interval.stop();
		else if (count > cpm.value) cpm.value++;
		else if (count < cpm.value) cpm.value--;
	}, 12);
	interval.start();
	return interval;
};

const submit = () => {
	if (acc.value !== 100) return; // ACC가 100이 아닐 때,
	console.log("CPM : ", cpm.value);
	count.value++;
	cpm.value = 0;
	text.value = "";
	startTime.value = null;
	keyStorkes.value = 0;
	intervalCPM.stop();
};

onMounted(() => {
	// 양방향 바인딩 필요
	useEventListener(inputRef.value.ref, "input", e => {
		text.value = e.currentTarget.value;
	});

	useEventListener(inputRef.value.ref, "keydown", e => {
		if (nuxtApp.$_.find(keyBanList, { code: e.keyCode })) return;
		if (e.keyCode === 13) {
			return submit();
		}
		keyStorkes.value++;
		if (!startTime.value) {
			startTime.value = Date.now();
			if (!intervalCPM) intervalCPM = new Interval(calcCPM, 200);
			intervalCPM.start();
		}
	});

	typingList.value = nuxtApp.$_.shuffle(typingData);
});
</script>
<template>
	<div style="margin-top: 40px">
		<div style="margin-bottom: 20px">
			<span v-for="(item, index) in splitTypingText" :key="index" :class="{ error: classText.includes(index), classText: true }">
				{{ item }}
			</span>
			<br />
			<p>CPM: {{ cpm }}</p>
			<p>ACC: {{ acc }}</p>
			<p>CNT: {{ count }}</p>
		</div>
		<el-input ref="inputRef" v-model="text" spellcheck="false" @compositionstart="inputStart" @compositionend="inputEnd" />
	</div>
</template>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
	padding: 1px 0px;
}

.classText {
	&.error {
		/* color: red; */
		position: relative;
		&::after {
			content: "*";
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			color: red;
		}
	}
}
</style>
