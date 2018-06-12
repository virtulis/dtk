import { svgTags } from './data/svgtags';
import { prop, PropMap } from './prop';
import { append, Appendable } from './append';

const svgNS = 'http://www.w3.org/2000/svg';

export function create<
	TN extends keyof SVGElementTagNameMap,
	T extends SVGElementTagNameMap[TN]
>(
	tag: TN,
	clsOrProps?: string | PropMap<T>,
	...children: Appendable[]
): SVGElementTagNameMap[TN];
export function create<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	tag: TN,
	clsOrProps?: string | PropMap<T>,
	...children: Appendable[]
): HTMLElementTagNameMap[TN];
export function create(
	tag: string,
	clsOrProps?: string | PropMap<any>,
	...children: Appendable[]
): HTMLElement;
export function create<
	TN extends keyof (HTMLElementTagNameMap & SVGElementTagNameMap),
	T extends (HTMLElementTagNameMap & SVGElementTagNameMap)[TN]
>(
	tag: TN,
	clsOrProps?: string | PropMap<T>,
	...children: Appendable[]
) {

	const svg = svgTags[tag];
	const el = (svg ? document.createElementNS(svgNS, tag) : document.createElement(tag)) as T;

	if (typeof clsOrProps == 'string') el.setAttribute('class', clsOrProps);
	else if (clsOrProps) prop(el, clsOrProps);

	const txt = !svg && children.length == 1 && children[0];
	if (typeof txt == 'string') (el as HTMLElement).innerText = txt;
	else append(el, ...children);

	return el as T;

}
