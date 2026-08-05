import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { extname } from 'node:path';

const TEXT_EXTS = new Set(['.yaml', '.yml', '.md']);
const JS_TO_TS = { '.js': '.ts', '.mjs': '.mts', '.cjs': '.cts' };

export function resolve(specifier, context, nextResolve) {
  if (TEXT_EXTS.has(extname(specifier))) {
    const url = new URL(specifier, context.parentURL || pathToFileURL('./')).href;
    return { url, shortCircuit: true };
  }

  const tsSuffix = JS_TO_TS[extname(specifier)];
  if (tsSuffix && context.parentURL && specifier.startsWith('.')) {
    const resolved = new URL(specifier, context.parentURL);
    const tsUrl = resolved.href.replace(new RegExp(`${extname(specifier)}$`), tsSuffix);
    if (existsSync(fileURLToPath(tsUrl))) {
      return { url: tsUrl, shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  const ext = extname(new URL(url).pathname);

  if (TEXT_EXTS.has(ext)) {
    const text = readFileSync(fileURLToPath(url), 'utf-8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(text)};`,
    };
  }

  return nextLoad(url, context);
}
