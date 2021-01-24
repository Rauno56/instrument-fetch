(function () {
	window.addEventListener('load', () => {
		document.getElementById('random').addEventListener('click', () => {
			fetch('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new')
				.then((res) => res.text())
				.then(console.log);
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
	});
})();
