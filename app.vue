<script setup>
import { ElLoading } from "element-plus";
const nuxtApp = useNuxtApp();
const isLoading = computed(() => nuxtApp.$store.loading.isLoading);
ElLoading.service({ fullscreen: true, background: "rgba(0, 0, 0, 0.3)", visible: isLoading });
</script>

<template>
	<div>
		<!-- <NuxtLoadingIndicator /> -->
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
