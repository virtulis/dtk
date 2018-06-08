export type AttrVal = string | number | undefined | null | boolean;
export type AttrMap = { [_: string]: AttrVal };

export function setAttr(el: Element, attr: string, val: AttrVal) {
	if (val === false || val === undefined || val === null || val === '') {
		el.removeAttribute(attr);
	}
	else {
		el.setAttribute(attr, val === true ? attr : String(val));
	}
}

export function attr(
	el: Element,
	attr: string,
	val: AttrVal
): void;
export function attr(
	el: Element,
	attr: string
): string | null;
export function attr(
	el: Element,
	attrs: AttrMap,
): void;
export function attr(
	el: Element,
	attrs: string | AttrMap,
	val?: AttrVal
) {

	if (typeof attrs == 'string') {
		if (arguments.length == 2) return el.getAttribute(attrs);
		return setAttr(el, attrs, val);
	}

	for (let key in attrs) setAttr(el, key, attrs[key]);

}
