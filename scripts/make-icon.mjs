import sharp from "sharp";
import { writeFileSync } from "fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 128 128">
  <g font-family="Georgia, Times New Roman, serif" font-style="italic" font-weight="700">
    <text x="6" y="98" font-size="82" fill="#ff4d8d">M</text>
    <text x="54" y="70" font-size="40" font-weight="700" fill="#ffd24a">&amp;</text>
    <text x="74" y="98" font-size="82" fill="#3db8ff">Z</text>
  </g>
</svg>`;

const buf = Buffer.from(svg);
await sharp(buf).png().toFile("src/app/icon.png");
await sharp(buf).resize(180, 180).png().toFile("src/app/apple-icon.png");
writeFileSync(
  "src/app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <g font-family="Georgia, 'Times New Roman', Times, serif" font-style="italic" font-weight="700">
    <text x="6" y="98" font-size="82" fill="#ff4d8d">M</text>
    <text x="54" y="70" font-size="40" font-weight="700" fill="#ffd24a">&amp;</text>
    <text x="74" y="98" font-size="82" fill="#3db8ff">Z</text>
  </g>
</svg>
`,
);
console.log("vivid transparent M&Z icons ready");
