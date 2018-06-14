import * as dtk from '../src/dtk';
const { create, get, list, on, append, attr, prop } = dtk;
(window as any).dtk = dtk; // so you can play in console

const lol = create('p', 'lol', 'lol');
append(document.body, lol);

const kek = create('a', { className: 'kek', href: '/' }, 'kek');
const btn = create('button', {}, 'show me');
append(lol, kek, btn);

on(btn, 'click', () => {

	const examples = [
		get('div'),
		list('div'),
		list('div.foo'),
		list('div', '.foo'),
		list('div', '.foo, .oof'),
		list('div', '> *'),
		list(get('div')!, '> *'),
		list('div > *'),
		list('> div > *, script, p, h1'),
		get('> div > *, script, p, h1'),
		list()
	];
	const show = (el: Element) => {
		const cls = el.className as any;
		return el.tagName.toLowerCase() + '.' + (cls instanceof SVGAnimatedString ? cls.baseVal : cls || '*');
	};
	for (let ex of examples) {
		const txt = Array.isArray(ex)
			? '[' + ex.map(show).join(', ') + ']'
			: show(ex!);
		append(lol, create('pre', {}, txt));
	}

}, { once: true });

on(window, 'mouseover', 'pre', e => {
	e.target.classList.add('red');
});
on(window, 'mouseout', 'pre', e => {
	e.target.classList.remove('red');
});

const colors = ['red', 'green', 'blue'];
append(lol, create(
	'svg',
	{ $: { width: 60, height: 20 } },
	colors.map((c, i) => create('circle', { $: {
		cx: 10 + 20 * i,
		cy: 10,
		r: 8,
		stroke: 'black',
		'stroke-width': 1,
		fill: c
	}}))
));
on('click', 'circle', e => {
	attr(
		e.target,
		'fill',
		colors[(colors.indexOf(attr(e.target, 'fill')!) + 1) % 3]
	);
});
