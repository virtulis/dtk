import { query } from './impl/query';
import { DTKElement } from './impl/element';

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
): DTKElement[] {
	return query(true, arg1, arg2, arg3);
}
