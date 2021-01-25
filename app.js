(function () {
	window.addEventListener('load', () => {
		document.getElementById('random').addEventListener('click', () => {
			fetch('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new')
				.then((res) => res.text())
				.then(console.log.bind(console, 'number:'));
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
			});


		fetch('./no-exist.html')
			.catch((err) => {
				console.log('request failed:', err);
			});


		fetch('http-totallyinvalid:#@[oops.com{')
			.catch((err) => {
				console.log('request failed:', err);
			});


		fetch('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')
			.then((res) => {
				return res.text();
			})
			.then((body) => {
				const expecting = 'Hello, World!';
				if (body !== expecting) {
					throw new Error(`Expected friendlier response: "${body}" !== "${expecting}"`);
				}
			});
	});
})();
