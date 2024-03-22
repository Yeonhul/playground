export default defineNuxtPlugin(nuxtApp => {
	const options = method => {
		return {
			// baseURL: "",
			method,
			onRequest({ request, options }) {
				nuxtApp.$store.loading.showLoading();
			},
			onResponse({ request, options, response }) {
				const token = response._data?.data?.reissue;
				if (request === "/api/token/check" && token) {
					useCookie("accessToken").value = token;
				}

				nuxtApp.$store.loading.closeLoading();
				console.log(request);
			},
			onRequestError({ request, options }) {
				nuxtApp.$store.loading.closeLoading();
			}
		};
	};

	return {
		provide: {
			_fetch: {
				get: $fetch.create({ ...options("GET") }),
				post: $fetch.create({ ...options("POST") }),
				delete: $fetch.create({ ...options("DELETE") })
			}
		}
	};
});
