/* eslint-disable import/default */
import lodash from "lodash-es";
export default defineNuxtPlugin(nuxtApp => {
	return {
		provide: {
			_: lodash
		}
	};
});
