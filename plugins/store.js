import { useLoadingStore } from "@/store/loading";
export default defineNuxtPlugin(nuxtApp => {
	const _pinia = nuxtApp.$pinia;
	if (!_pinia) return;

	return {
		provide: {
			store: {
				loading: useLoadingStore(_pinia)
			}
		}
	};
});
