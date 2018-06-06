export function create<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	tag: TN,
	clsOrProps?: string | { [key in keyof T]?: T[key] },
	children?: Element[] | string
) {
	const el = document.createElement(tag) as T;
	if (typeof clsOrProps == 'string') el.className = clsOrProps;
	if (children) {
		if (typeof children == 'string') el.innerText = children;
		else for (let child of children) if (child) el.appendChild(child);
	}
	if (clsOrProps && typeof clsOrProps == 'object') for (let key in clsOrProps) {
		(el as any)[key] = clsOrProps[key];
	}
	return el as T;
}


export function get<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	el: Element,
	tag: TN,
	selectors?: string
): T | null;
export function get(
	el: Element,
	selectors?: string
): HTMLElement | null;

export function get<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	tag: TN,
	selectors?: string
): T | null;
export function get(
	selectors?: string
): HTMLElement | null;

export function get(
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
) {
	return query(false, arg1, arg2, arg3);
}

export function list<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	el: Element,
	tag: TN,
	selectors?: string
): T[];
export function list(
	el: Element,
	selectors?: string
): HTMLElement[];

export function list<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	tag: TN,
	selectors?: string
): T[];
export function list(
	selectors?: string
): HTMLElement[];

export function list(
	arg1?: Element | string,
	arg2?: string,
	arg3?: string
) {
	return query(true, arg1, arg2, arg3);
}

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

function query(
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

export interface EventTargetFix {
	target: HTMLElement;
}

export type EventWithFixedTarget = Event & EventTargetFix;

export type BasicHandler = (e: EventWithFixedTarget) => void;
export type HandlerRemover = () => void;

export interface HandlerOptions extends AddEventListenerOptions {
	prevent?: boolean;
	stop?: boolean;
}

export function on<
	EN extends keyof HTMLElementEventMap,
	ET extends HTMLElementEventMap[EN]
>(
	el: HTMLElement,
	event: EN,
	handler: (e: ET & EventTargetFix) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EN extends keyof HTMLElementEventMap,
	ET extends HTMLElementEventMap[EN]
>(
	el: HTMLElement,
	event: EN,
	object: object,
	method: (e: ET & EventTargetFix) => void | string,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EN extends keyof HTMLElementEventMap,
	ET extends HTMLElementEventMap[EN]
>(
	el: HTMLElement,
	event: EN,
	filter: string,
	handler: (e: ET & EventTargetFix) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EN extends keyof HTMLElementEventMap,
	ET extends HTMLElementEventMap[EN]
>(
	el: HTMLElement,
	event: EN,
	filter: string,
	object: object,
	method: (e: ET & EventTargetFix) => void | string,
	options?: HandlerOptions
): HandlerRemover;
export function on(
	el: HTMLElement,
	event: string,
	handler: BasicHandler,
	options?: HandlerOptions
): HandlerRemover;
export function on(
	el: HTMLElement,
	event: string,
	object: object,
	handler: BasicHandler | string,
	options?: HandlerOptions
): HandlerRemover;
export function on(
	el: HTMLElement,
	event: string,
	filter: string,
	handler: BasicHandler,
	options?: HandlerOptions
): HandlerRemover;
export function on(
	el: HTMLElement,
	event: string,
	filter: string,
	object: object,
	handler: BasicHandler | string,
	options?: HandlerOptions
): HandlerRemover;
export function on(
	el: HTMLElement,
	event: string,
	arg1?: string | BasicHandler | object,
	arg2?: BasicHandler | object | string | HandlerOptions,
	arg3?: BasicHandler | string | HandlerOptions,
	arg4?: HandlerOptions
): HandlerRemover {

	const filter = typeof arg1 == 'string' ? arg1 : void 0;
	const [handler, options] = filter != void 0 ? makeHandler(arg2, arg3, arg4) : makeHandler(arg1, arg2, arg3);

	let final: BasicHandler;
	if (filter) {
		final = function (e: EventWithFixedTarget) {
			if (!(e.target instanceof HTMLElement)) return; // FIXME
			if (!e.target.closest(filter)) return;
			if (options && options.stop) e.stopPropagation();
			if (options && options.prevent) e.preventDefault();
			handler(e);
		};
	}
	else if (options && (options.prevent || options.stop)) {
		final = function (e: EventWithFixedTarget) {
			if (options.stop) e.stopPropagation();
			if (options.prevent) e.preventDefault();
			handler(e);
		};
	}
	else {
		final = handler;
	}

	const enames = event.split(' ').map(e => e.trim());

	for (let e of enames) {
		el.addEventListener(e, final as EventListener, options || false); // TODO add opts arg maybe
	}

	return function () {
		for (let e of enames) {
			el.removeEventListener(e, final as EventListener, options || false);
		}
	}

}

type MakeHandlerArg = BasicHandler | object | void | string | HandlerOptions;
function makeHandler(arg1: MakeHandlerArg, arg2: MakeHandlerArg, arg3?: MakeHandlerArg): [BasicHandler, HandlerOptions | undefined] {
	if (!arg1) throw new TypeError('No handler passed to on()');
	if (typeof arg1 == 'function') return [arg1, arg2 as HandlerOptions || undefined];
	if (!arg2) throw new TypeError('Just the object passed to on()');
	const hdl = typeof arg2 == 'string' ? (arg1 as any)[arg2] : arg2;
	if (typeof hdl != 'function') throw new TypeError('Invalid handler passed to on()');
	return [hdl.bind(arg1), arg3 as HandlerOptions || undefined];
}



export type FormJSONEntry = string | boolean | string[] | null;
export type FormJSON = { [key: string ]: FormJSONEntry };

export function formToJSON(form: HTMLFormElement) {
	const out: FormJSON = {};
	for (let input of Array.from(form.querySelectorAll('input, select, textarea'))) {
		if (input instanceof HTMLSelectElement) {
			const so = Array.from(input.querySelectorAll<HTMLOptionElement>('option')).filter(o => o.selected);
			if (input.multiple) out[input.name] = so.map(o => o.value);
			else if (so.length) out[input.name] = so[0].value;
			else out[input.name] = null;
		}
		else if (input instanceof HTMLInputElement && input.type == 'checkbox') {
			out[input.name] = input.checked;
		}
		else if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
			out[input.name] = input.value.trim();
		}
	}
	return out;
}

