import { svgTags } from './data/svgtags';
import { prop, PropMap } from './prop';
import { append, Appendable } from './append';
import { DTKElementTagNameMap } from './impl/types';

const svgNS = 'http://www.w3.org/2000/svg';

export function create<
	TN extends keyof DTKElementTagNameMap | string,
	T extends (TN extends keyof DTKElementTagNameMap ? DTKElementTagNameMap[TN] : Element)
>(
	tag: TN,
	clsOrProps?: string | PropMap<T>,
	...children: Appendable[]
): T {

	const svg = svgTags[tag];
	const el = (svg ? document.createElementNS(svgNS, tag) : document.createElement(tag)) as T;

	if (typeof clsOrProps == 'string') el.setAttribute('class', clsOrProps);
	else if (clsOrProps) prop(el, clsOrProps);

	const txt = !svg && children.length == 1 && children[0];
	if (typeof txt == 'string') (el as HTMLElement).innerText = txt;
	else append(el, ...children);

	return el as T;

}
