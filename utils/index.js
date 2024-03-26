export function Interval(fn, time) {
	let running = false;
	this.start = function () {
		if (!this.isRunning()) running = setInterval(fn, time);
	};
	this.stop = function () {
		clearInterval(running);
		running = false;
	};
	this.isRunning = function () {
		return running !== false;
	};
}
