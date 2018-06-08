export type Appendable = Element | Element[] | string;

export function append(el: Element, ...children: Appendable[]) {
	for (let child of children) {
		if (typeof child == 'string') {
			el.appendChild(document.createTextNode(child));
		}
		else if (Array.isArray(child)) {
			for (let cc of child) {
				if (cc) el.appendChild(cc);
			}
		}
		else if (child) {
			el.appendChild(child);
		}
	}
}
