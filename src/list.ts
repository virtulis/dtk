import { query } from './impl/query';
import { DTKElementTagNameMap } from './impl/types';

export function list<
	TN extends keyof DTKElementTagNameMap | string,
	T extends (TN extends keyof DTKElementTagNameMap ? DTKElementTagNameMap[TN] : Element)
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
	TN extends keyof DTKElementTagNameMap | string,
	T extends (TN extends keyof DTKElementTagNameMap ? DTKElementTagNameMap[TN] : Element)
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
): Element[] {
	return query(true, arg1, arg2, arg3);
}
