const fs = require('fs');
const path = require('path');
const dir = 'src/pages/interactions/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && f !== 'proyecto-final.astro');

let fixed = 0;
files.forEach(file => {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // 1. Replace "const codeFiles = [" -> "const tabs = ["
  content = content.replace(/const codeFiles = \[/, 'const tabs = [');

  // 2. Replace the objects: {name: "...", language: "...", icon: "...", content: `...`}
  //    to {id: "...", label: "...", code: `...`}
  //    We need to transform each object
  content = content.replace(
    /\{\s*\n\s*name: "(.*?)",\s*\n\s*language: ".*?",\s*\n\s*icon: ".*?",\s*\n\s*content: (`[\s\S]*?`)\s*\n\s*\}/g,
    (match, name, codeContent) => {
      // generate an id from the file name (strip extension, replace dots with dashes)
      const id = name.replace(/\./g, '-');
      return `{\n    id: "${id}",\n    label: "${name}",\n    code: ${codeContent}\n  }`;
    }
  );

  // 3. Replace "<TabbedCodeBlock files={codeFiles} />" -> "<TabbedCodeBlock tabs={tabs} />"
  content = content.replace(/<TabbedCodeBlock files=\{codeFiles\} \/>/g, '<TabbedCodeBlock tabs={tabs} />');

  if (content !== original) {
    fs.writeFileSync(fp, content);
    fixed++;
    console.log('Fixed: ' + file);
  } else {
    console.log('No change needed: ' + file);
  }
});
console.log('Done. Fixed ' + fixed + ' files.');
