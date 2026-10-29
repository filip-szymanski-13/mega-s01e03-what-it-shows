import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  resolve: { alias: { '#lib': path.join(root, 'src/lib') } },
  plugins: [svelte({
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: path.join(root, 'src/lib/layouts/runbook.svelte') },
    }),
    emitCss: false,
  })],
});

try {
  const { render } = await server.ssrLoadModule('svelte/server');
  const page = await server.ssrLoadModule('/src/routes/kb/incidents/4471/+page.svx');
  const result = render(page.default);
  assert.match(result.body, /379/);
  assert.match(result.body, /33/);
  assert.match(result.body, /DR-[0-9A-Z]{4}-[0-9A-Z]{4}/);
  assert.doesNotMatch(result.body, /no desk ref/);
  await mkdir(path.join(root, 'rendered'), { recursive: true });
  await writeFile(path.join(root, 'rendered/4471.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${result.head}</head><body>${result.body}</body></html>\n`);
  console.log('Rendered incident page with live counts and signature stamp.');
  for (const [source, output] of [
    ['triage/dedupe', 'triage.html'],
    ['decisions/0002-dedupe-by-cause', 'decision-0002.html'],
    ['', 'index.html'],
  ]) {
    const module = await server.ssrLoadModule(`/src/routes/kb/${source ? `${source}/` : ''}+page.svx`);
    const rendered = render(module.default);
    if (source) assert.match(rendered.body, /DR-[0-9A-Z]{4}-[0-9A-Z]{4}/);
    await writeFile(path.join(root, 'rendered', output), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${rendered.head}</head><body>${rendered.body}</body></html>\n`);
    console.log(`Rendered ${output}.`);
  }
} finally {
  await server.close();
}