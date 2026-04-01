import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = dir + '/' + file;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) results = results.concat(walk(filePath));
    else if (filePath.endsWith('.tsx')) results.push(filePath);
  });
  return results;
}

const files = walk('./src');
let matchedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/className=(["`])([^"`]+)\1/g, (match, quote, classNames) => {
    if ((classNames.includes('bg-card') || classNames.includes('bg-white')) && classNames.includes('border')) {
      // It's a card! Let's clean it up and add global-card
      let newClasses = classNames
        .replace(/\bbg-white\b/g, '')
        .replace(/\bbg-card\b/g, '')
        .replace(/\bborder-[a-z-]+\b/g, '') // remove border colors except strict ones
        .replace(/\bborder\b/g, '')
        .replace(/\brounded-[a-z0-9-]+\b/g, '')
        .replace(/\bshadow-[a-z0-9-]+\b/g, '')
        .replace(/\bp-[0-9]+\b/g, '')
        .replace(/\bpx-[0-9]+\b/g, '')
        .replace(/\bpy-[0-9]+\b/g, '')
        .replace(/\bhover:shadow-[a-z0-9-]+\b/g, '')
        .replace(/\bhover:-translate-y-\d+\b/g, '')
        .replace(/\btransition-[a-z0-9-]+\b/g, '')
        .replace(/\bduration-\d+\b/g, '')
        .replace(/\bease-[a-z0-9-]+\b/g, '')
        .replace(/\boverflow-hidden\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        
      if (!newClasses.includes('global-card')) {
        newClasses = 'global-card ' + newClasses;
      }
      matchedCount++;
      return `className=${quote}${newClasses.trim()}${quote}`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log("Updated cards:", matchedCount);
