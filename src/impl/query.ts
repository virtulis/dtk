function invokeQuery(
	el: Element,
	all: boolean,
	trs: string | string[]
): Element | Element[] | null {

	const joined = typeof trs == 'string';

	if (trs[0] != '>') {
		const jtrs = joined ? trs as string : (trs as string[]).join(' ');
		return all
			? [].slice.call(el.querySelectorAll(jtrs)) as Element[]
			: el.querySelector(jtrs) as Element | null;
	}

	let out: Element[] = [];

	const split = joined ? (trs as string).substr(1).trim().split(' ') : (trs as string[]).slice(1);
	const top = split[0];
	const rest = split.length > 1 ? split.slice(1) : null;
	const children = el.children;

	for (let l = children.length, i = 0; i < l; i++) {
		const child = children[i];
		if (!child.matches(top)) continue;
		if (!rest) {
			if (!all) return child as Element;
			out.push(child as Element);
		}
		else {
			const match = invokeQuery(child, all, rest);
			if (!match) continue;
			if (all) for (let gc of (match as Element[])) out.push(gc);
			else return match;
		}
	}

	return all ? out : null;

}

export function query(
	all: true,
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
): Element[];
export function query(
	all: false,
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
): Element | null;
export function query(
	all: boolean,
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
) {

	let el: Element;
	let tag: string | void;
	let sel: string | void;

	if (!arg1) {
		el = document.body;
	}
	else if (typeof arg1 == 'string') {
		el = document.body;
		tag = arg1;
		sel = arg2;
	}
	else {
		el = arg1;
		tag = arg2;
		sel = arg3;
	}

	const ress: Element[][] = [];

	let either;
	if (tag && sel) {

		const lctag = tag.toLowerCase();
		const ssels = sel.split(',').map(s => s.trim())

		for (let ssel of ssels) {

			const sparts = ssel.split(/\s+/g);
			const lidx = sparts.length - 1;
			const last = sparts[lidx];

			const ltm = last.match(/^(\*|\w+)/);
			const ltag = ltm && ltm[0];
			if (!ltag) sparts[lidx] = tag + last;
			else if (ltag == '*') sparts[lidx] = tag;
			else if (ltag.toLowerCase() != lctag) throw new Error('Tag was passed (' + tag + ') but selector begins with other tag (' + ltag + ')');

			const res = invokeQuery(el, all, sparts);
			if (!all && res) return res;

			if (res && (res as Element[]).length) ress.push(res as Element[]);

		}

	}
	else if (either = tag || sel) {

		const ssels = either.split(',').map(s => s.trim());

		for (let ssel of ssels) {

			const res = invokeQuery(el, all, ssel);
			if (!all && res) return res;

			if (res && (res as Element[]).length) ress.push(res as Element[]);

		}

	}
	else {

		return invokeQuery(el, all, '*');

	}

	if (!all) return null;

	if (ress.length == 1) return ress[0];
	if (!ress.length) return [];
	
	return ([] as Element[]).concat(...ress).filter(function (x, i, a) {
		return a.indexOf(x) == i;
	});

}
