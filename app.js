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
	});
})();
