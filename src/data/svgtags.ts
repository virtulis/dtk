export function isSvgTag(tag: string) {
	return !!tag.match(/^(circle|clippath|defs|desc|ellipse|fe(blend|(color|convolve)matrix|componenttransfer|composite|(diffuse|specular)lighting|displacementmap|(distant|point|spot)light|flood|func[abgr]|gaussianblur|image|merge(node)?|morphology|offset|tile|turbulence)|filter|foreignobject|g|image|line|(linear|radial)gradient|marker|mask|metadata|path|pattern|poly(gon|line)|rect|stop|svg|switch|symbol|text(path)?|tspan|use|view)$/);
}
