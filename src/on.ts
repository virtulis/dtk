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
