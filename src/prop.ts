import { attr, AttrMap } from './attr';
import { DTKElement } from './impl/element';

export type AttrProp = { $?: AttrMap };
export type PropMap<T> = ({ [key in keyof T]?: T[key] } & AttrProp);

export function prop<
	T extends DTKElement,
	K extends keyof T
>(
	el: T,
	prop: K,
	val: T[K]
): void;
export function prop<
	T extends DTKElement,
	K extends keyof T
>(
	el: T,
	prop: K
): T[K];
export function prop<
	T extends DTKElement
>(
	el: T,
	prop: string,
	val: any
): void
export function prop<
	T extends DTKElement
	>(
	el: T,
	prop: string
): any;
export function prop<
	T extends DTKElement
>(
	el: T,
	props: PropMap<T>,
): void;
export function prop<
	T extends DTKElement
>(
	el: T,
	props: { [_: string]: any }
): void;
export function prop<
	T extends DTKElement
>(
	el: T,
	props: string | PropMap<T>,
	val?: any
) {

	if (typeof props == 'string') {
		if (arguments.length == 2) return el[props as keyof T];
		el[props as keyof T] = val;
		return;
	}

	const attrs = props.$;
	if (attrs) attr(el, attrs);

	for (let key in props) {
		if (key != '$') el[key as keyof T] = (props as any)[key];
	}

}
