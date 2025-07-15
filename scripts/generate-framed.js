import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function main() {
  const username = 'Miawwh';
  const framePath = path.join(process.cwd(), 'res/frame.svg');
  const outPath   = path.join(process.cwd(), 'docs/framed-stats.svg');

  let frameSvg = fs.readFileSync(framePath, 'utf8');
  let statsSvg = await fetch(
    `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true`
  ).then(res => res.text());

  statsSvg = statsSvg
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<!DOCTYPE.*?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '');

  const combined = frameSvg.replace(
    '</svg>',
    statsSvg + '</svg>'
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, combined, 'utf8');
  console.log('Generated:', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
