<script setup>
import { useEventListener } from "@vueuse/core";
const nuxtApp = useNuxtApp();
const inputRef = ref(null);
const typingText = ref("두려움이 있음에도 불구하고, 계속하기 위해 용기를 가져라.");
const text = ref("");
const isComposition = ref(false);

const markedText_test = computed(() => {
	let marked = "";
	for (let i = 0; i < text.value.length; i++) {
		if (text.value[i] !== typingText.value[i]) {
			marked += `<mark>${text.value[i]}</mark>`;
		} else {
			marked += text.value[i];
		}
	}
	return marked;
});

const markedText = computed(() => {
	let marked = "";
	nuxtApp.$_.forEach(text.value, (value, index) => {
		const lastIndex = text.value.length - 1;
		if (value !== typingText.value[index] && lastIndex !== index) {
			// marked += `<mark>${value}</mark>`;
			if (typingText.value[index] === " ") {
				marked += " ";
			} else {
				marked += `<span style="color: red;">${value}</span>`;
			}
		} else {
			marked += value;
		}
	});
	return marked;
});

const classText = computed(() => {
	const marked = [];
	nuxtApp.$_.forEach(text.value, (value, index) => {
		if (value !== typingText.value[index] && text.value.length - 1 !== index) {
			marked.push(index);
		}
	});
	return marked;
});

const splitTypingText = computed(() => typingText.value.split(""));

const inputStart = e => {
	isComposition.value = true;
};

const inputEnd = e => {
	isComposition.value = false;
};

onMounted(() => {
	// 양방향 바인딩 필요
	useEventListener(inputRef.value.ref, "input", e => {
		text.value = e.currentTarget.value;
	});
});
</script>
<template>
	<div style="margin-top: 40px">
		<div style="margin-bottom: 20px">
			<div style="position: relative">
				<div style="position: absolute; top: 0; left: 0">{{ typingText }}</div>
				<!-- <div style="position: absolute; top: 0; left: 0; background-color: #fff" v-html="markedText" /> -->
			</div>
			<br />
			<br />
			<span
				v-for="(item, index) in splitTypingText"
				:key="index"
				:class="{ error: classText.includes(index), classText: true, gap: item === ' ' }"
			>
				{{ item }}
			</span>
			<br />
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
		color: red;
		&.gap {
			position: relative;
			padding-right: 0px;
			&::after {
				position: absolute;
				content: "_";
				color: red;
				bottom: 0;
				left: 0;
			}
		}
	}
}
</style>
