import * as fs from 'fs';

process.chdir(__dirname);

const dts = fs.readFileSync(require.resolve('typescript/lib/lib.esnext.full.d.ts'), { encoding: 'utf-8' });
const fstr = 'SVGElementTagNameMap {';
const from = dts.indexOf(fstr) + fstr.length;
const to = dts.indexOf('}', from);
const lines = dts.substring(from, to).split('\n').filter(s => s.trim());

const tags: { [_: string]: boolean } = {};
for (let line of lines) {
	tags[line.match(/"(.*?)"/)![1]] = true;
}

const out = `export const svgTags: { [_: string]: boolean } = ${JSON.stringify(tags, null, '\t')};`;

fs.writeFileSync('../src/data/svgtags.ts', out + '\n');
