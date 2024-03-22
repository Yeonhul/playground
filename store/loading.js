import { defineStore } from "pinia";
export const useLoadingStore = defineStore("loading", () => {
	const isLoading = ref(false);

	const setLoading = value => {
		isLoading.value = value;
	};

	const showLoading = () => (isLoading.value = true);

	const closeLoading = () => (isLoading.value = false);

	const toggleLoading = () => (isLoading.value = !isLoading.value);

	return { isLoading, setLoading, showLoading, closeLoading, toggleLoading };
});
