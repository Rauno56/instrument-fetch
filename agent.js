agent = (function () {
	class Agent extends EventTarget {
		emitSpanStart(span) {
			this.dispatchEvent(new CustomEvent('span-start', { detail: span }));
		}
		emitSpanEnd(span) {
			this.dispatchEvent(new CustomEvent('span-end', { detail: span }));
		}
	}

	const agent = new Agent();

	const observer = new PerformanceObserver((list, observer) => {
		list.getEntries().forEach(handlePerformanceEntry);
	});
	observer.observe({
		type: 'resource',
		buffered: !true,
	});
	const handlePerformanceEntry = (entry) => {
		// console.error('PO', entry.entryType, entry.name, entry);
		if (entry.entryType !== 'resource' || entry.initiatorType !== 'fetch') {
			return;
		}
		const span = unsentSpans.take(entry.name);
		span.resTimings = entry;
	};
	const toAbsoluteUrl = (url) => {
		return (new URL(url, window.origin)).toString();
	};

	const unsentSpans = (() => {
		const map = new Map();
		return {
			take: (url, start, end) => {
				const spans = map.get(toAbsoluteUrl(url));
				if (!spans || spans.length === 0) {
					console.error('could not find span for', url);
					return null;
				}
				// TODO: use start and end to distinguish fetches to same resource
				return spans.pop();
			},
			add: (span) => {
				const url = toAbsoluteUrl(span.url);

				if (map.has(url)) {
					const spans = map.get(url);
					spans.push(span);
				} else {
					map.set(url, [span]);
				}
			},
		};
	})();

	const PATCHED = Symbol.for('PATCHED');
	const originalFetch = window.fetch;
	const patchedFetch = (...args) => {
		const [url, options = {}] = args;
		const resTimings = {};
		const span = {
			url,
			options,
			start: performance.now(),
			resTimings,
		};

		agent.emitSpanStart(span);
		unsentSpans.add(span);

		return originalFetch(...args)
			.then((result) => {
				span.status = result.status;
				span.result = result;
				return result;
			})
			.catch((err) => {
				span.error = err;
				return Promise.reject(err);
			})
			.finally(() => {
				span.end = performance.now();
				// Required for PerformanceObserver to finish it's (micro)task
				setTimeout(() => agent.emitSpanEnd(span));
			});
	};
	patchedFetch[PATCHED] = true;

	if (window.fetch && !window.fetch[PATCHED]) {
		window.fetch = patchedFetch;
	}

	return agent;
})();
