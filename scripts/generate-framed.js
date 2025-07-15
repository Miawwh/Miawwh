import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function main() {
  const username = 'Miawwh'; // Ganti dengan username-mu
  const framePath = path.join(process.cwd(), 'res/frame.svg');
  const outPath   = path.join(process.cwd(), 'docs/framed-stats.svg');

  // 1. Baca frame template
  let frameSvg = fs.readFileSync(framePath, 'utf8');

  // 2. Fetch stats SVG
  let statsSvg = await fetch(
    `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true`
  ).then(res => res.text());

  // 3. Strip header & <svg>…</svg> dari statsSvg
  statsSvg = statsSvg
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<!DOCTYPE.*?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '');

  // 4. Sisipkan ke akhir frameSvg, sebelum </svg>
  const combined = frameSvg.replace(
    '</svg>',
    statsSvg + '</svg>'
  );

  // 5. Tulis output
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, combined, 'utf8');
  console.log('Generated:', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
