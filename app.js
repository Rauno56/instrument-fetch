(function () {
	window.addEventListener('load', () => {
		document.getElementById('random').addEventListener('click', () => {
			fetch('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new')
				.then((res) => res.text())
				.then(console.log.bind(console, 'number:'));
		});

		// fetch('goals.json')
		// 	.then((res) => res.json())
		// 	.then((goals) => {
		// 		const app = document.getElementById('app');
		// 		app.innerHTML = '<ul></ul>';

		// 		goals.forEach(({ desc, done }) => {
		// 			const el = app.children[0].appendChild(document.createElement('li'));

		// 			const doneNode = el.appendChild(document.createElement('input'));
		// 			doneNode.type = 'checkbox';
		// 			doneNode.checked = done;

		// 			const descNode = el.appendChild(document.createElement('span'));
		// 			descNode.innerText = desc;
		// 		});
		// 	});


		// fetch('./no-exist.html')
		// 	.catch((err) => {
		// 		console.log('request failed:', err);
		// 	});


		// fetch('http-totallyinvalid:#@[oops.com{')
		// 	.catch((err) => {
		// 		console.log('request failed:', err);
		// 	});


		// fetch('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')
		// 	.then((res) => {
		// 		return res.text();
		// 	})
		// 	.then((body) => {
		// 		const expecting = 'Hello, World!';
		// 		if (body !== expecting) {
		// 			throw new Error(`Expected friendlier response: "${body}" !== "${expecting}"`);
		// 		}
		// 	});

		const REQ_COUNT = 15;

		const diffs = [];
		const avg = (...nrs) => {
			if (!nrs.length) {
				return null;
			}
			return nrs.reduce((acc, nr) => (acc + nr), 0) / nrs.length;
		};

		const handleTest = (span, body) => {
			const spanTime = ((span.end - span.start) >> 0);
			const took = parseInt(body.took);
			const diff = spanTime - took;
			diffs.push(diff);
			console.log('Span: ', span.url, `${spanTime - took}ms diff`, diffs.length, span);
			if (diffs.length === REQ_COUNT) {
				console.log('ALL DONE', {
					min: Math.min(...diffs),
					max: Math.max(...diffs),
					avg: avg(...diffs),
				});
			}
		}

		const reportSpan = async ({ detail: span }) => {
			if (span.result && span.result.json) {
				const body = await span.result.clone().json();
				if (body.took) {
					return handleTest(span, body);
				}
			}
			console.log('Span: ', span.url, `${(span.end - span.start) >> 0}ms`, span);
		};

		agent.addEventListener('span-end', reportSpan);

		let L = REQ_COUNT;
		while (L--) {
			fetch('http://localhost:8081/?resp_time_rand=100,3000')
				.then((res) => res.clone().json())
				.then(console.log.bind(console, 'rand resp time fetch:'))
		}
	});
})();
