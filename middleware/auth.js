export default defineNuxtRouteMiddleware(async (to, from) => {
	const nuxtApp = useNuxtApp();
	if (process.server) return;
	const check = await nuxtApp.$_fetch.get("/api/token/check");
	if (check.code !== "S") return;
	console.log("체크", check);
	nuxtApp.$router.replace("/");
});
