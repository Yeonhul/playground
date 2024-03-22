export function formValidate(formEl) {
	if (!formEl) return;
	return formEl.validate(valid => {
		return valid;
	});
}
