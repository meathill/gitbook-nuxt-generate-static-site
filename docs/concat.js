const {promises: {readFile, writeFile}} = require('fs');

(async () => {
  const summary = await readFile('./SUMMARY.md', 'utf8');
  const reg = /\((.*).md\)/g;
  let files = [];
  while ((result = reg.exec(summary)) !== null) {
    const [match, file] = result;
    files.push(`${file}.md`);
  }
  files = files.map(file => readFile(file));
  files = await Promise.all(files);
  const md = files.join('\n--------\n\n');
  await writeFile('index.md', md, 'utf8');
  console.log('ok');
})()
