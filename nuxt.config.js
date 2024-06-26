// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/getting-started/configuration#nuxt-configuration
const lifecycle = process.env.npm_lifecycle_event;
export default defineNuxtConfig({
	devtools: { enabled: true },
	nitro: {
		compressPublicAssets: true, // 빌드시 정적파일을 압축하여 파일의 크기를 줄여서, 페이지 로딩 개선
		routeRules: {
			// 라우트 규칙을 정의하는데 사용 (웹 성능 최적화, 캐싱전략, 동적처리 등)
			// "/_nuxt/**": { headers: { "cache-control": "max-age=31536000" } }, // Set generated files cache to 1 year
		}
	},
	runtimeConfig: {
		// 외부에 선언될 경우 서버에서만 사용 가능
		// SECRET_KEY: process.env.SECRET_KEY,
		// public에 들어가면 클라이언트에서 확인이 가능
		public: {
			// SECRET_KEY: process.env,
		}
	},
	experimental: {
		// appManifest: false
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use '@/assets/css/utils/global.scss'; @use "@/assets/css/utils/element-plus.scss" as *;`
				}
			}
		}
	},
	css: ["~/assets/css/main.scss"],
	modules: [
		"@nuxtjs/eslint-module",
		"@vueuse/nuxt", // https://vueuse.org/guide/#nuxt
		"@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
		"@element-plus/nuxt" // https://nuxt.com/modules/element-plus | https://element-plus.org/en-US
	],
	elementPlus: {
		/* options */
		importStyle: "scss",
		components: [] // 자동으로 가져오지 않는 컴포넌트의 경우, 이 곳에 선언
		// https://nuxt.com/modules/element-plus#options
	}
});
