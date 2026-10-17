import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { demoAlbumWorks as albumWorks, demoLibrary as library } from '../shared/demo-catalogue';
import { parse } from 'dotenv';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes("connect-src 'none'") || !html.includes('/Kinora/assets/'))
  throw Error('Static-only CSP or Pages base path missing.');
for (const route of [
  'explore',
  'album',
  ...library.map((c) => `collections/${c.slug}`),
  ...albumWorks.map((w) => `works/${w.id}`),
]) {
  const directory = path.join(root, route);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, 'index.html'), html);
}
copyFileSync(path.join(root, 'index.html'), path.join(root, '404.html'));
writeFileSync(path.join(root, '.nojekyll'), '');
const app = fileURLToPath(new URL('../', import.meta.url));
const notices = [
  ['Kinora (MIT)', readFileSync(new URL('../../../LICENSE', import.meta.url), 'utf8')],
  ...[
    'react',
    'react-dom',
    'scheduler',
    'zod',
    'lucide-react',
    '@fontsource/dm-sans',
    '@fontsource/fraunces',
    '@fontsource/caveat',
  ].map((name) => [name, readFileSync(path.join(app, 'node_modules', name, 'LICENSE'), 'utf8')]),
  [
    'Illustration & catalogue',
    'Original generated scrapbook illustration, not a real family photograph. Original editorial summaries. Factual and duration sources are linked on each work page. Recordings, films, lyrics and posters are not redistributed.',
  ],
];
writeFileSync(
  path.join(root, 'licenses.txt'),
  notices.map(([name, license]) => `${name}\n${license}`).join('\n\n'),
);

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory() ? files(path.join(dir, f.name)) : [path.join(dir, f.name)],
  );
}
const published = files(root);
const secretValues: string[] = [];
for (const directory of [
  fileURLToPath(new URL('../../../', import.meta.url)),
  fileURLToPath(new URL('../', import.meta.url)),
]) {
  for (const name of readdirSync(directory).filter(
    (name) => /^\.env(?:\.|$)/.test(name) && name !== '.env.example',
  )) {
    for (const [key, value] of Object.entries(parse(readFileSync(path.join(directory, name)))))
      if (/key|token|secret|password/i.test(key) && value.length >= 8) secretValues.push(value);
  }
}
const allow =
  /^(?:index\.html|404\.html|licenses\.txt|\.nojekyll|(?:explore|album|collections\/[a-z0-9-]+|works\/[a-z0-9-]+)\/index\.html|images\/shared-memories\.png|assets\/[a-zA-Z0-9_.-]+\.(?:js|css|woff2?))$/;
for (const file of published) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  if (!allow.test(relative)) throw Error(`Unexpected publish file: ${relative}`);
  if (/\.(?:html|css|js)$/.test(file)) {
    const contents = readFileSync(file, 'utf8');
    if (secretValues.some((value) => contents.includes(value)))
      throw Error(`Local credential found in ${relative}`);
    if (
      /\bfetch\s*\(|XMLHttpRequest|new WebSocket|sendBeacon|AIza[\w-]{30,}|gh[pousr]_[\w]{25,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
        contents,
      )
    )
      throw Error(`Network primitive or credential signature in ${relative}`);
  }
}
console.log(
  `Static publish audit passed: ${published.length} allowlisted files, no network primitives or credential signatures. Only dist/ is publishable.`,
);
