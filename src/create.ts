export function create<
	TN extends keyof HTMLElementTagNameMap,
	T extends HTMLElementTagNameMap[TN]
>(
	tag: TN,
	clsOrProps?: string | { [key in keyof T]?: T[key] },
	children?: Element[] | string
) {
	const el = document.createElement(tag) as T;
	if (typeof clsOrProps == 'string') el.className = clsOrProps;
	if (children) {
		if (typeof children == 'string') el.innerText = children;
		else for (let child of children) if (child) el.appendChild(child);
	}
	if (clsOrProps && typeof clsOrProps == 'object') for (let key in clsOrProps) {
		(el as any)[key] = clsOrProps[key];
	}
	return el as T;
}
