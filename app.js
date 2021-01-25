(function () {
	const noop = () => {};
	const warn = () => {
		console.error('Should not see this');
	};

	window.addEventListener('load', () => {
		document.getElementById('random').addEventListener('click', () => {
			fetch('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new')
				.then((res) => res.text())
				.then(console.log.bind(console, 'number:'));
		});

		agent.addEventListener('span-end', async ({ detail: span }) => {
			console.log('Span: ', span.data.url, `${(span.end - span.start) >> 0}ms`, span);
		});

		fetch('goals.json')
			.then((res) => res.json())
			.then((goals) => {
				const app = document.getElementById('app');
				app.innerHTML = '<ul></ul>';

				goals.forEach(({ desc, done }) => {
					const el = app.children[0].appendChild(document.createElement('li'));

					const doneNode = el.appendChild(document.createElement('input'));
					doneNode.type = 'checkbox';
					doneNode.checked = done;

					const descNode = el.appendChild(document.createElement('span'));
					descNode.innerText = desc;
				});
			})
			.catch(warn);


		fetch('./no-exist.html')
			.catch(warn);


		fetch('http-totallyinvalid:#@[oops.com{')
			.then(warn)
			.catch(noop);


		fetch('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')
			.then((res) => {
				return res.text();
			})
			.then((body) => {
				const expecting = 'Hello, World!';
				if (body !== expecting) {
					throw new Error(`Expected friendlier response: "${body}" !== "${expecting}"`);
				}
			})
			.catch(warn);

		fetch(new Request('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
				title: 'foo',
				body: 'bar',
				userId: 1,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}))
			.catch(warn);

		/*
		// This tests rapid requests to same exact url to make sure the agent is not
		// glueless about which span connects to which resTiming
		const REQ_COUNT = 20;

		const diffs = {
			span: [],
			res: [],
		};
		const avg = (...nrs) => {
			if (!nrs.length) {
				return null;
			}
			return nrs.reduce((acc, nr) => (acc + nr), 0) / nrs.length;
		};

		const handleTest = (span, body) => {
			const spanTime = ((span.end - span.start) >> 0);
			const resTime = ((span.resTimings.responseEnd - span.resTimings.requestStart) >> 0);
			const took = parseInt(body.took);
			const diff = spanTime - took;
			span.took = took;
			span.time = spanTime;
			diffs.span.push(diff);
			diffs.res.push(resTime - took);
			console.log('Span: ', span.url, `${spanTime - took}ms diff`, diffs.span.length, span);
			if (diffs.span.length === REQ_COUNT) {
				console.log('ALL DONE', {
					min: Math.min(...diffs.span),
					max: Math.max(...diffs.span),
					avg: avg(...diffs.span),
					list: diffs.span,
				});
				console.log('ALL DONE RES', {
					min: Math.min(...diffs.res),
					max: Math.max(...diffs.res),
					avg: avg(...diffs.res),
					list: diffs.res,
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
		*/
	});
})();
