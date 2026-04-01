import fs from 'fs';

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
let updated = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let startC = content;
  
  // Inject placeholder=" " safely into inputs
  content = content.replace(/<input(?![^>]*placeholder=)([^>]*?)(\/?)>/g, '<input placeholder=" "$1$2>');
  // Inject into textareas
  content = content.replace(/<textarea(?![^>]*placeholder=)([^>]*?)>/g, '<textarea placeholder=" "$1>');

  if (startC !== content) {
    fs.writeFileSync(file, content);
    updated++;
  }
});
console.log(`Updated ${updated} files with empty placeholders.`);
