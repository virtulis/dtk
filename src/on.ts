export type EventName<ElT> = (keyof (ElT extends SVGElement ? SVGElementEventMap : HTMLElementEventMap)) | string;

export type EventTargetFix = { target: Element };
export type EventType<EvN> = (EvN extends keyof HTMLElementEventMap
	? HTMLElementEventMap[EvN]
	: (EvN extends keyof SVGElementEventMap ? SVGElementEventMap[EvN] : Event)
) & EventTargetFix;

export type BasicHandler = (e: Event) => void;
export type HandlerRemover = () => void;

export interface HandlerOptions extends AddEventListenerOptions {
	prevent?: boolean;
	stop?: boolean;
}

function isEventTarget(el: any): el is EventTarget {
	return typeof el.addEventListener == 'function';
}

// 2 * 2 * 3 = 12 overloads
// (el | no el) * (filter | no filter) * (object + string | object + method | handler)

// el, filter
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	el: ElT,
	event: EvN,
	filter: string,
	object: OT,
	method: keyof OT,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	el: ElT,
	event: EvN,
	filter: string,
	object: OT,
	method: (this: OT, e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
>(
	el: ElT,
	event: EvN,
	filter: string,
	handler: (e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;

// el, no filter
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	el: ElT,
	event: EvN,
	object: OT,
	method: keyof OT,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	el: ElT,
	event: EvN,
	object: OT,
	method: (this: OT, e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	ElT extends EventTarget,
	EvN extends EventName<ElT>,
	EvT extends EventType<EvN>,
>(
	el: ElT,
	event: EvN,
	handler: (e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;

// no el, filter
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	event: EvN,
	filter: string,
	object: OT,
	method: keyof OT,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	event: EvN,
	filter: string,
	object: OT,
	method: (this: OT, e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
>(
	event: EvN,
	filter: string,
	handler: (e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;

// no el, no filter
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	event: EvN,
	object: OT,
	method: keyof OT,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
	OT extends object,
>(
	event: EvN,
	object: OT,
	method: (this: OT, e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;
export function on<
	EvN extends (keyof HTMLElementEventMap) | string,
	EvT extends EventType<EvN>,
>(
	event: EvN,
	handler: (e: EvT) => void,
	options?: HandlerOptions
): HandlerRemover;

export function on(...args: any[]): HandlerRemover {

	const el = isEventTarget(args[0]) ? args.shift() as EventTarget : window;
	const event = args.shift() as string;
	const filter = typeof args[0] == 'string' ? args.shift() as string : null;
	const [handler, options] = makeHandler(args[0], args[1], args[2]);

	let final: BasicHandler;
	if (filter) {
		final = function (e: Event) {
			if (!(e.target as Element)?.closest?.(filter)) return;
			if (options && options.stop) e.stopPropagation();
			if (options && options.prevent) e.preventDefault();
			handler(e);
		};
	}
	else if (options && (options.prevent || options.stop)) {
		final = function (e: Event) {
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
	if (typeof arg1 == 'function') return [arg1 as BasicHandler, arg2 as HandlerOptions || undefined];
	if (!arg2) throw new TypeError('Just the object passed to on()');
	const hdl = typeof arg2 == 'string' ? (arg1 as any)[arg2] : arg2;
	if (typeof hdl != 'function') throw new TypeError('Invalid handler passed to on()');
	return [hdl.bind(arg1), arg3 as HandlerOptions || undefined];
}
