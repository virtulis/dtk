import { query } from './impl/query';
import { DTKElement } from './impl/element';

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
): DTKElement | null {
	return query(false, arg1, arg2, arg3);
}
