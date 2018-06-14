import { query } from './impl/query';
import { DTKElementTagNameMap } from './impl/types';

export function get<
	TN extends keyof DTKElementTagNameMap | string,
	T extends (TN extends keyof DTKElementTagNameMap ? DTKElementTagNameMap[TN] : Element)
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
	TN extends keyof DTKElementTagNameMap | string,
	T extends (TN extends keyof DTKElementTagNameMap ? DTKElementTagNameMap[TN] : Element)
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
): Element | null {
	return query(false, arg1, arg2, arg3);
}
