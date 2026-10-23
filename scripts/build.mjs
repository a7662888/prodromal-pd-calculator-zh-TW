import {mkdir,readFile,writeFile} from 'node:fs/promises';
const assets = ['index.html','styles.css','app.js','calculator.js','data.js','favicon.svg'];
const check = process.argv.includes('--check');
await mkdir(new URL('../docs/',import.meta.url),{recursive:true});
for (const file of assets) {
  const source = await readFile(new URL(`../${file}`,import.meta.url));
  const target = new URL(`../docs/${file}`,import.meta.url);
  if (check) {
    if (!source.equals(await readFile(target))) throw new Error(`Stale published asset: ${file}`);
  } else await writeFile(target,source);
}
if (!check) await writeFile(new URL('../docs/.nojekyll',import.meta.url),'');
console.log(check ? 'Published assets match source.' : 'Static assets synchronized to docs/.');
