import fs from 'fs';
import path from 'path';

// LAW 4 Gaps Map
// We want to replace standard gap classes on grids with responsive gap classes.
// 3-col grids usually look like: className="... grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-X ..."
// 2-col grids: className="... grid-cols-1 md:grid-cols-2 gap-X ..."
// 4-col grids: className="... grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-X ..."

const threeColGaps = "gap-3 md:gap-4 lg:gap-6";
const twoColGaps = "gap-5 lg:gap-8";
const fourColGaps = "gap-3 lg:gap-5";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // LAW 1: Single container width. Replace max-w-[Xpx] with max-w-[1240px] if X > 1200 or X < 1300. Actually, user asked for max-width: 1200px.
  // max-w-[1100px], max-w-[1240px], max-w-[1000px], max-width-7xl etc... -> max-w-[1200px]
  content = content.replace(/max-w-\[1[0-9]{3}px\]/g, 'max-w-[1200px]');
  content = content.replace(/max-w-7xl/g, 'max-w-[1200px]');

  // LAW 4: Grid Gaps
  // Find grid containers and swap their gap classes.
  // 3-col:
  content = content.replace(/(grid\s+.*?lg:grid-cols-3.*?)gap-\d+/g, `$1 ${threeColGaps}`);
  // 4-col:
  content = content.replace(/(grid\s+.*?lg:grid-cols-4.*?)gap-\d+/g, `$1 ${fourColGaps}`);
  // 2-col (matches grid-cols-2 but NOT grid-cols-3 or grid-cols-4)
  // We'll just do a simpler search for grid-cols-2 without lg:grid-cols-3/4
  content = content.replace(/(grid\s+.*?md:grid-cols-2(?!.*?lg:grid-cols-[34]).*?)gap-\d+/g, `$1 ${twoColGaps}`);
  content = content.replace(/(grid\s+.*?lg:grid-cols-2(?!.*?lg:grid-cols-[34]).*?)gap-\d+/g, `$1 ${twoColGaps}`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated layout gaps and max-width in ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir('./src');
console.log('Layout laws applied across grids and containers.');
