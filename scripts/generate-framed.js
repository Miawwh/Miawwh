import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function main() {
  const username = 'Miawwh';
  const framePath = path.join(process.cwd(), 'res/frame.svg');
  const outPath   = path.join(process.cwd(), 'docs/framed-stats.svg');

  // 1. Baca template frame
  const frameSvg = fs.readFileSync(framePath, 'utf8');

  // 2. Fetch raw stats SVG
  let statsSvg = await fetch(
    `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true`
  ).then(res => res.text());

  // 3. Strip <svg>…</svg> wrapper
  statsSvg = statsSvg
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<!DOCTYPE.*?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '');

  // 4. Gabungkan frame + stats
  const combined = frameSvg.replace(
    '</svg>',
    statsSvg + '</svg>'
  );

  // 5. Tulis ke docs/
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, combined, 'utf8');
  console.log('Generated:', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
