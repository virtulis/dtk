function invokeQuery(
	el: Element,
	all: boolean,
	trs: string
) {

	if (trs[0] != '>') {
		return all ? Array.from(el.querySelectorAll(trs)) as HTMLElement[] : el.querySelector(trs) as HTMLElement;
	}

	let out: HTMLElement[] = [];

	// FIXME multiple selectors

	const split = trs.substr(1).trim().split(' ');
	const top = split[0];
	const rest = split.length > 1 ? split.slice(1).join(' ') : null;
	const children = el.children;

	for (let l = children.length, i = 0; i < l; i++) {
		const child = children[i];
		if (!child.matches(top)) continue;
		if (!rest) {
			if (!all) return child as HTMLElement;
			out.push(child as HTMLElement);
		}
		else {
			const matches = child.querySelectorAll(rest);
			for (let mi = 0, ml = matches.length; mi < ml; mi++) {
				if (!all) return matches[i] as HTMLElement;
				out.push(matches[i] as HTMLElement);
			}
		}
	}

	return all ? out : null;

}

export function query(
	all: boolean,
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
) {

	const fn = all ? 'querySelector' : 'querySelectorAll';

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

	if (!tag) return invokeQuery(el, all, '*'); // This will break if a falsy tag is passed, don't care

	if (!sel) return invokeQuery(el, all, tag); // Note that "tag" might also contain a selector here which will work too

	const trs = sel.trim();

	if (trs.match(/^\w/)) return invokeQuery(el, all, trs);

	if (trs[0] == '>') return invokeQuery(el, all, trs); // FIXME

	return invokeQuery(el, all, tag + trs);

}
