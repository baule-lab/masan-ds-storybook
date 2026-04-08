import { rm } from 'node:fs/promises';
import path from 'node:path';

const uiRegistryRoot = path.resolve(import.meta.dirname, '..');

async function main() {
  await rm(path.join(uiRegistryRoot, '.generated'), { force: true, recursive: true });
  await rm(path.join(uiRegistryRoot, 'public'), { force: true, recursive: true });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
