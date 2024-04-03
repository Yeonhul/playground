<script setup>
import { useEventListener } from "@vueuse/core";
import typingData from "@/assets/json/typing.json";
import typingAudio from "@/assets/sounds/typing.mp3";
import enterAudio from "@/assets/sounds/enter.mp3";
const nuxtApp = useNuxtApp();
const inputRef = ref(null);
// const typingText = ref("두려움이 있음에도 불구하고, 계속하기 위해 용기를 가져라.");
const count = ref(0);
const text = ref("");
const isComposition = ref(false);
const startTime = ref(null);
const keyStorkes = ref(0);
const displayCPM = ref(0);
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
const completeList = ref([]);

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

const cpm = ref(0);

const calcCPM = () => {
	// 천천히 증가하는 기능
	const elapsedTime = Date.now() - startTime.value;
	const newCPM = nuxtApp.$_.floor((keyStorkes.value / elapsedTime) * 60000);
	cpm.value = newCPM;

	if (!countAnimate?.isRunning()) {
		displayCPM.value = newCPM;
		countAnimate = countAnimateCreater();
	}
};

const countAnimateCreater = () => {
	const interval = new Interval(() => {
		// if (count === cpm.value) return interval.stop();
		if (cpm.value - displayCPM.value > 50 || cpm.value - displayCPM.value < -50) displayCPM.value = cpm.value;
		else if (cpm.value > displayCPM.value) displayCPM.value++;
		else if (cpm.value < displayCPM.value) displayCPM.value--;
	}, 25);
	interval.start();
	return interval;
};

const submit = () => {
	if (acc.value !== 100) return; // ACC가 100이 아닐 때,
	if (completeList.value.length === 10) completeList.value = [];

	completeList.value.push(typingText.value);
	count.value++;
	displayCPM.value = 0; // CPM 초가화
	cpm.value = 0; // CPM 초가화
	text.value = ""; // 입력값 초기화
	startTime.value = null; // 시작시간 초기화
	keyStorkes.value = 0; // 입력한 타수 초기화
	intervalCPM.stop(); // CPM 체크함수 중지
	countAnimate.stop(); // CPM 애니메이션 함수 중지
};

onMounted(() => {
	// 양방향 바인딩 필요
	useEventListener(inputRef.value.ref, "input", e => {
		text.value = e.currentTarget.value;
	});

	useEventListener(inputRef.value.ref, "keydown", e => {
		if (nuxtApp.$_.find(keyBanList, { code: e.keyCode })) return;
		const enterSound = new Audio(enterAudio);
		const keySound = new Audio(typingAudio);
		if (e.keyCode === 13) {
			enterSound.play();
			return submit();
		}

		keySound.play();
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
	<div class="wrap">
		<div class="contentBox">
			<div class="chatBox itemBox">
				<div v-auto-animate :data-paper="completeList.length" :class="{ paper: true, stacked1: count > 10, stacked2: count > 20 }">
					<!-- <div class="page"></div> -->
					<span v-for="(item, index) in completeList" :key="index"> {{ item }}</span>
				</div>
				<div class="print">
					<span
						v-for="(item, index) in splitTypingText"
						:key="index"
						:class="{ error: classText.includes(index), classText: true }"
					>
						{{ item }}
					</span>
				</div>
				<el-input ref="inputRef" v-model="text" spellcheck="false" @compositionstart="inputStart" @compositionend="inputEnd" />
			</div>
			<div class="infoBox itemBox">
				<p>CPM: {{ displayCPM }}</p>
				<p>ACC: {{ acc }}</p>
				<p>CNT: {{ count }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
	padding: 1px 0px;
	border-radius: 0;
	box-shadow: none;
	border-bottom: 1px dashed #8c846d;
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

.wrap {
	max-width: 1260px;
	min-height: 100vh;
	position: relative;
	margin: 0 auto;
	.contentBox {
		position: absolute;
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.itemBox {
			/* background-color: #fff; */
			background-color: rgba($color: #fff, $alpha: 1);
			border-radius: 10px;
			padding: 30px;
			width: 100%;
			box-sizing: border-box;
		}
		.infoBox {
			position: relative;
			z-index: 1;
			padding: 15px 30px;
			display: flex;
			justify-content: space-around;
			/* gap: 0.5rem; */
		}
		.chatBox {
			position: relative;
			transform-style: preserve-3d;
			.print {
				position: relative;
				padding-bottom: 12px;
			}
		}
	}

	.paper {
		box-sizing: border-box;
		background-color: #e0d2af;
		padding: 20px 30px;
		display: flex;
		flex-direction: column;
		width: 90%;
		gap: 1rem;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, calc(-100% + 0px)) !important;
		&[data-paper="0"] {
			padding: 0;
		}
		transform-style: preserve-3d;
		&::before,
		&::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 98%;
			z-index: -1;
		}
		&.stacked1::before {
			background-color: #c4b2a1;
			top: 4px;
			left: -5px;
			transform: translateZ(-1px) rotate(-2.5deg);
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
		}
		&.stacked2::after {
			background-color: #c4b2a1;
			top: 1px;
			right: -5px;
			transform: translateZ(-1px) rotate(1.4deg);
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
		}
	}
}
</style>
