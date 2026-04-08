import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const uiRegistryRoot = path.resolve(import.meta.dirname, '..');
const manifestsDir = path.join(uiRegistryRoot, 'manifests');
const generatedRoot = path.join(uiRegistryRoot, '.generated');
const publicRoot = path.join(uiRegistryRoot, 'public');
const canonicalManifestFile = 'registry.registry.json';
const allowedExtensions = new Set(['.ts', '.tsx', '.css']);
const excludedDirectories = new Set(['__screenshots__', '__fixtures__']);

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function toNamespace(manifestFileName) {
  return manifestFileName.replace(/^registry\./, '').replace(/\.json$/, '');
}

function rewriteImportPath(specifier) {
  return specifier;
}

function rewriteImports(source) {
  return source
    .replace(/from\s+["']([^"']+)["']/g, (full, specifier) => {
      return `from '${rewriteImportPath(specifier)}'`;
    })
    .replace(/import\s+["']([^"']+)["']/g, (full, specifier) => {
      return `import '${rewriteImportPath(specifier)}'`;
    });
}

function normalizeToPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isExcludedFile(relativePath) {
  if (relativePath.endsWith('.d.ts')) return true;
  if (relativePath.includes('/__screenshots__/')) return true;
  if (relativePath.includes('/__fixtures__/')) return true;
  if (/\.(test|spec)\.[jt]sx?$/.test(relativePath)) return true;
  return false;
}

function inferFileType(relativePath, fallbackType) {
  if (relativePath.endsWith('.css')) return 'registry:style';
  return fallbackType ?? 'registry:item';
}

function resolveDiscoverTarget(discoverConfig, relativePath) {
  const target = discoverConfig?.target;
  if (!target) {
    const discoverDir = discoverConfig?.dir;
    if (typeof discoverDir !== 'string') return null;

    const discoverDirPosix = normalizeToPosix(discoverDir);
    const srcIndex = discoverDirPosix.lastIndexOf('/src/');
    if (srcIndex === -1) return null;

    const targetBase = discoverDirPosix.slice(srcIndex + 1);
    return normalizeToPosix(path.join(targetBase, relativePath));
  }

  if (typeof target === 'string') {
    return target;
  }

  if (typeof target === 'object' && target !== null) {
    const byRelativePath = target[relativePath];
    if (typeof byRelativePath === 'string') return byRelativePath;

    const byFileName = target[path.basename(relativePath)];
    if (typeof byFileName === 'string') return byFileName;
  }

  return null;
}

function extractImportSpecifiers(source) {
  const specifiers = new Set();

  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    specifiers.add(match[1]);
  }

  for (const match of source.matchAll(/import\s+["']([^"']+)["']/g)) {
    specifiers.add(match[1]);
  }

  return [...specifiers];
}

function toPackageName(specifier) {
  if (
    specifier.startsWith('.') ||
    specifier.startsWith('@/') ||
    specifier.startsWith('@workspace/') ||
    specifier.startsWith('@masan-group/') ||
    specifier.startsWith('~/') ||
    specifier.startsWith('/') ||
    specifier.startsWith('node:')
  ) {
    return null;
  }

  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  }

  return specifier.split('/')[0] ?? null;
}

/**
 * Resolve an `@/` import specifier to a registry item name.
 * Returns null if the specifier is not an internal component reference.
 *
 * Examples:
 *   "@/components/ui/actions/button"    → "button"
 *   "@/components/ui/feedback/alert-dialog" → "alert-dialog"
 *   "@/hooks/use-mobile"        → "use-mobile"
 *   "@/lib/utils"               → "utils"
 *   "@/lib/chart-colors"        → "chart-colors"
 *   "@/types/whatever"          → "shared-ui-types"
 *   "./spinner"                 → "spinner" (within same directory)
 *   "../input-group"            → "input-group" (resolved from importer path)
 *   "../../overlays/dialog"     → "dialog" (resolved from importer path)
 */
function resolveInternalRegistryDep(specifier, knownItems, importerRelativePath = null) {
  // Handle @/components/ui/<group>/<name> → <name>
  const groupedUiMatch = specifier.match(
    /^@\/components\/ui\/(?:actions|forms|overlays|feedback|display)\/([^/]+)$/
  );
  if (groupedUiMatch) {
    const name = groupedUiMatch[1];
    return knownItems.has(name) ? name : null;
  }

  // Handle legacy @/components/ui/<name> → <name>
  const uiMatch = specifier.match(/^@\/components\/ui\/([^/]+)$/);
  if (uiMatch) {
    const name = uiMatch[1];
    return knownItems.has(name) ? name : null;
  }

  // Handle @/hooks/<name> → <name>
  const hookMatch = specifier.match(/^@\/hooks\/(.+)$/);
  if (hookMatch) {
    return hookMatch[1];
  }

  // Handle @/lib/<name> → <name>
  const libMatch = specifier.match(/^@\/lib\/(.+)$/);
  if (libMatch) {
    return libMatch[1];
  }

  // Handle @/types/<name> → "shared-ui-types" (single bundled types registry item)
  const typesMatch = specifier.match(/^@\/types\/(.+)$/);
  if (typesMatch) {
    return 'shared-ui-types';
  }

  // Handle relative imports (./, ../, ../../...) using importer location when available.
  if (specifier.startsWith('.')) {
    const normalizedSpecifier = normalizeToPosix(specifier).replace(/\.(tsx?|jsx?)$/, '');

    // Backward-compatible behavior for same-directory imports.
    const sameDirName = normalizedSpecifier.replace(/^\.\//, '');
    if (knownItems.has(sameDirName)) {
      return sameDirName;
    }

    if (typeof importerRelativePath === 'string' && importerRelativePath.length > 0) {
      const importerDir = path.posix.dirname(normalizeToPosix(importerRelativePath));
      const resolvedPath = path.posix.normalize(path.posix.join(importerDir, normalizedSpecifier));
      const resolvedBaseName = path.posix.basename(resolvedPath);

      // Grouped UI mode items are keyed by component name (e.g., "dialog").
      if (knownItems.has(resolvedBaseName)) {
        return resolvedBaseName;
      }

      // Fallback mode items can be keyed by full relative path (e.g., "foo/bar").
      if (knownItems.has(resolvedPath)) {
        return resolvedPath;
      }
    }

    // Last resort: basename matching when importer path isn't available.
    const baseName = path.posix.basename(normalizedSpecifier);
    if (knownItems.has(baseName)) {
      return baseName;
    }
  }

  return null;
}

function isUrlDependency(value) {
  return /^https?:\/\//.test(value);
}

function normalizeRegistryDependencyName(dependency, knownItemNames, namespacePrefix) {
  if (typeof dependency !== 'string' || dependency.length === 0) {
    return dependency;
  }

  if (isUrlDependency(dependency)) {
    return dependency;
  }

  if (dependency.startsWith(`${namespacePrefix}/`)) {
    return dependency;
  }

  // Convert legacy namespaced refs (e.g. @masan-group-lib/shared-ui-lib) to unified namespace
  if (dependency.startsWith('@')) {
    const slashIndex = dependency.indexOf('/');
    if (slashIndex > 1) {
      const itemName = dependency.slice(slashIndex + 1);
      if (knownItemNames.has(itemName)) {
        return `${namespacePrefix}/${itemName}`;
      }
    }
    return dependency;
  }

  // If this dependency points to an item in the same manifest, namespace it explicitly.
  if (knownItemNames.has(dependency)) {
    return `${namespacePrefix}/${dependency}`;
  }

  return dependency;
}

function normalizeManifestRegistryDependencies(manifest, namespacePrefix) {
  const knownItemNames = new Set(
    (manifest.items ?? []).map((item) => item?.name).filter((name) => typeof name === 'string')
  );

  manifest.items = (manifest.items ?? []).map((item) => {
    if (!Array.isArray(item.registryDependencies) || item.registryDependencies.length === 0) {
      return item;
    }

    const normalizedRegistryDependencies = [
      ...new Set(
        item.registryDependencies.map((dependency) =>
          normalizeRegistryDependencyName(dependency, knownItemNames, namespacePrefix)
        )
      ),
    ];

    return {
      ...item,
      registryDependencies: normalizedRegistryDependencies,
    };
  });
}

async function collectDiscoverFiles(sourceDir, currentDir = sourceDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) {
        continue;
      }

      const nestedFiles = await collectDiscoverFiles(sourceDir, path.join(currentDir, entry.name));
      files.push(...nestedFiles);
      continue;
    }

    if (!entry.isFile()) continue;

    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = normalizeToPosix(path.relative(sourceDir, absolutePath));
    const extension = path.extname(entry.name);

    if (!allowedExtensions.has(extension)) continue;
    if (isExcludedFile(relativePath)) continue;

    files.push({ absolutePath, relativePath });
  }

  const preferredFiles = new Map();

  for (const file of files) {
    const stem = file.relativePath.replace(/\.(tsx|ts|css)$/, '');
    const existing = preferredFiles.get(stem);

    if (!existing) {
      preferredFiles.set(stem, file);
      continue;
    }

    const existingExt = path.extname(existing.relativePath);
    const incomingExt = path.extname(file.relativePath);

    if (existingExt === '.ts' && incomingExt === '.tsx') {
      preferredFiles.set(stem, file);
    }
  }

  return [...preferredFiles.values()].sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function ensurePathExists(filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error(`Expected a file but got non-file path: ${filePath}`);
    }
  } catch (error) {
    throw new Error(`Missing manifest source file: ${filePath}`);
  }
}

/**
 * Process a standard "discover" item (group mode — existing behavior).
 * All discovered files become part of ONE registry item.
 */
async function processDiscoverGroup(item, itemBaseDir, namespaceGeneratedRoot) {
  const generatedItem = { ...item, files: [] };
  const discoveredDependencies = new Set(generatedItem.dependencies ?? []);

  const discoverDir = path.resolve(uiRegistryRoot, item.discover.dir);
  const discoveredFiles = await collectDiscoverFiles(discoverDir);

  if (discoveredFiles.length === 0) {
    throw new Error(`No source files discovered for item "${item.name}" in ${discoverDir}`);
  }

  for (const discoveredFile of discoveredFiles) {
    const generatedRelativePath = normalizeToPosix(
      path.join(itemBaseDir, discoveredFile.relativePath)
    );
    const generatedAbsolutePath = path.join(namespaceGeneratedRoot, generatedRelativePath);
    const sourceContent = await readFile(discoveredFile.absolutePath, 'utf8');
    const transformedContent = rewriteImports(sourceContent);

    for (const specifier of extractImportSpecifiers(transformedContent)) {
      const packageName = toPackageName(specifier);
      if (packageName && packageName !== 'react' && packageName !== 'react-dom') {
        discoveredDependencies.add(packageName);
      }
    }

    await mkdir(path.dirname(generatedAbsolutePath), { recursive: true });
    await writeFile(generatedAbsolutePath, transformedContent, 'utf8');

    const discoveredFileType = inferFileType(discoveredFile.relativePath, item.discover.fileType);
    const discoveredFileTarget = resolveDiscoverTarget(item.discover, discoveredFile.relativePath);
    const fileEntry = {
      path: generatedRelativePath,
      type: discoveredFileType,
    };

    if (discoveredFileTarget) {
      fileEntry.target = discoveredFileTarget;
    }

    generatedItem.files.push(fileEntry);
  }

  delete generatedItem.discover;
  generatedItem.dependencies = [...discoveredDependencies].sort();
  return [generatedItem];
}

/**
 * Process a "discoverIndividual" item.
 * Each file becomes its OWN registry item with auto-resolved dependencies.
 */
async function processDiscoverIndividual(item, namespaceGeneratedRoot) {
  const config = item.discoverIndividual;
  const sourceDir = path.resolve(uiRegistryRoot, config.dir);
  const discoveredFiles = await collectDiscoverFiles(sourceDir);

  if (discoveredFiles.length === 0) {
    throw new Error(`No source files discovered for discoverIndividual in ${sourceDir}`);
  }

  // Grouped UI mode: src/components/ui/<group>/<name>/{component.tsx,index.ts}
  const groupedUiComponents = new Map();
  for (const file of discoveredFiles) {
    const match = file.relativePath.match(
      /^(actions|forms|overlays|feedback|display)\/([^/]+)\/(component|index)\.(tsx|ts)$/
    );
    if (!match) continue;
    const [, group, name, kind] = match;
    const key = `${group}/${name}`;
    const entry = groupedUiComponents.get(key) ?? {
      name,
      group,
      indexFile: null,
      componentFile: null,
    };
    if (kind === 'index') entry.indexFile = file;
    if (kind === 'component') entry.componentFile = file;
    groupedUiComponents.set(key, entry);
  }

  if (groupedUiComponents.size > 0) {
    const components = [...groupedUiComponents.values()].filter(
      (entry) => entry.indexFile && entry.componentFile
    );
    const knownItems = new Set(components.map((component) => component.name));
    const generatedItems = [];

    for (const component of components) {
      const itemName = component.name;
      const itemBaseDir = path.join('registry', 'new-york', itemName);
      const npmDependencies = new Set();
      const registryDependencies = new Set(config.baseRegistryDependencies ?? []);
      const fileEntries = [];

      for (const discoveredFile of [component.indexFile, component.componentFile]) {
        const generatedRelativePath = normalizeToPosix(
          path.join(itemBaseDir, path.basename(discoveredFile.relativePath))
        );
        const generatedAbsolutePath = path.join(namespaceGeneratedRoot, generatedRelativePath);
        const sourceContent = await readFile(discoveredFile.absolutePath, 'utf8');
        const transformedContent = rewriteImports(sourceContent);

        for (const specifier of extractImportSpecifiers(transformedContent)) {
          const packageName = toPackageName(specifier);
          if (packageName && packageName !== 'react' && packageName !== 'react-dom') {
            npmDependencies.add(packageName);
          }

          if (config.resolveInternalDeps) {
            const internalDep = resolveInternalRegistryDep(
              specifier,
              knownItems,
              discoveredFile.relativePath
            );
            if (internalDep && internalDep !== itemName) {
              registryDependencies.add(internalDep);
            }
          }
        }

        await mkdir(path.dirname(generatedAbsolutePath), { recursive: true });
        await writeFile(generatedAbsolutePath, transformedContent, 'utf8');

        const discoveredFileType = inferFileType(discoveredFile.relativePath, config.fileType);
        const discoverDirPosix = normalizeToPosix(config.dir);
        const srcIndex = discoverDirPosix.lastIndexOf('/src/');
        let targetPath = null;
        if (srcIndex !== -1) {
          const targetBase = discoverDirPosix.slice(srcIndex + 1);
          targetPath = normalizeToPosix(path.join(targetBase, discoveredFile.relativePath));
        }

        const fileEntry = {
          path: generatedRelativePath,
          type: discoveredFileType,
        };
        if (targetPath) {
          fileEntry.target = targetPath;
        }
        fileEntries.push(fileEntry);
      }

      generatedItems.push({
        name: itemName,
        type: config.fileType || 'registry:ui',
        files: fileEntries,
        dependencies: [...npmDependencies].sort(),
        registryDependencies: [...registryDependencies].sort(),
      });
    }

    return generatedItems;
  }

  // Fallback mode: one file = one item (used by hooks and legacy flat directories)
  const knownItems = new Set();
  for (const file of discoveredFiles) {
    const itemName = file.relativePath.replace(/\.(tsx|ts)$/, '');
    knownItems.add(itemName);
  }

  const generatedItems = [];
  for (const discoveredFile of discoveredFiles) {
    const itemName = discoveredFile.relativePath.replace(/\.(tsx|ts)$/, '');
    const itemBaseDir = path.join('registry', 'new-york', itemName);
    const generatedRelativePath = normalizeToPosix(
      path.join(itemBaseDir, discoveredFile.relativePath)
    );
    const generatedAbsolutePath = path.join(namespaceGeneratedRoot, generatedRelativePath);
    const sourceContent = await readFile(discoveredFile.absolutePath, 'utf8');
    const transformedContent = rewriteImports(sourceContent);

    const npmDependencies = new Set();
    const registryDependencies = new Set(config.baseRegistryDependencies ?? []);

    for (const specifier of extractImportSpecifiers(transformedContent)) {
      const packageName = toPackageName(specifier);
      if (packageName && packageName !== 'react' && packageName !== 'react-dom') {
        npmDependencies.add(packageName);
      }

      if (config.resolveInternalDeps) {
        const internalDep = resolveInternalRegistryDep(
          specifier,
          knownItems,
          discoveredFile.relativePath
        );
        if (internalDep && internalDep !== itemName) {
          registryDependencies.add(internalDep);
        }
      }
    }

    await mkdir(path.dirname(generatedAbsolutePath), { recursive: true });
    await writeFile(generatedAbsolutePath, transformedContent, 'utf8');

    const discoveredFileType = inferFileType(discoveredFile.relativePath, config.fileType);
    const discoverDirPosix = normalizeToPosix(config.dir);
    const srcIndex = discoverDirPosix.lastIndexOf('/src/');
    let targetPath = null;
    if (srcIndex !== -1) {
      const targetBase = discoverDirPosix.slice(srcIndex + 1);
      targetPath = normalizeToPosix(path.join(targetBase, discoveredFile.relativePath));
    }

    const fileEntry = {
      path: generatedRelativePath,
      type: discoveredFileType,
    };
    if (targetPath) {
      fileEntry.target = targetPath;
    }

    generatedItems.push({
      name: itemName,
      type: config.fileType || 'registry:ui',
      files: [fileEntry],
      dependencies: [...npmDependencies].sort(),
      registryDependencies: [...registryDependencies].sort(),
    });
  }

  return generatedItems;
}

/**
 * Process an explicit "files" item (single-file or multi-file component).
 */
async function processExplicitFiles(item, itemBaseDir, namespaceGeneratedRoot) {
  const generatedItem = { ...item, files: [] };
  const discoveredDependencies = new Set(generatedItem.dependencies ?? []);

  for (const file of item.files ?? []) {
    if (!file.path) continue;

    const sourcePath = path.resolve(uiRegistryRoot, file.path);
    await ensurePathExists(sourcePath);

    const generatedRelativePath = normalizeToPosix(
      path.join(itemBaseDir, path.basename(file.path))
    );
    const generatedAbsolutePath = path.join(namespaceGeneratedRoot, generatedRelativePath);
    const sourceContent = await readFile(sourcePath, 'utf8');
    const transformedContent = rewriteImports(sourceContent);

    for (const specifier of extractImportSpecifiers(transformedContent)) {
      const packageName = toPackageName(specifier);
      if (packageName && packageName !== 'react' && packageName !== 'react-dom') {
        discoveredDependencies.add(packageName);
      }
    }

    await mkdir(path.dirname(generatedAbsolutePath), { recursive: true });
    await writeFile(generatedAbsolutePath, transformedContent, 'utf8');

    generatedItem.files.push({
      ...file,
      path: generatedRelativePath,
    });
  }

  generatedItem.dependencies = [...discoveredDependencies].sort();
  return [generatedItem];
}

async function buildNamespace(manifestFileName) {
  const namespace = toNamespace(manifestFileName);
  const manifestPath = path.join(manifestsDir, manifestFileName);
  const manifestRaw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestRaw);

  const namespaceGeneratedRoot = path.join(generatedRoot, namespace);
  const namespaceOutputRoot = path.join(publicRoot, namespace, 'r');

  await rm(namespaceGeneratedRoot, { force: true, recursive: true });
  await rm(namespaceOutputRoot, { force: true, recursive: true });
  await mkdir(namespaceGeneratedRoot, { recursive: true });

  const generatedManifest = { ...manifest, items: [] };

  for (const item of manifest.items ?? []) {
    // Route to the appropriate processor
    if (item.discoverIndividual) {
      const items = await processDiscoverIndividual(item, namespaceGeneratedRoot);
      generatedManifest.items.push(...items);
      continue;
    }

    const itemBaseDir = path.join('registry', 'new-york', item.name);

    if (item.discover?.dir) {
      const items = await processDiscoverGroup(item, itemBaseDir, namespaceGeneratedRoot);
      generatedManifest.items.push(...items);
      continue;
    }

    if (item.files?.length > 0) {
      const items = await processExplicitFiles(item, itemBaseDir, namespaceGeneratedRoot);
      generatedManifest.items.push(...items);
      continue;
    }

    // Pass through items with no files/discover (e.g., pure metadata)
    generatedManifest.items.push(item);
  }

  if (namespace === 'registry') {
    normalizeManifestRegistryDependencies(generatedManifest, '@masan-group');
  }

  const generatedManifestPath = path.join(namespaceGeneratedRoot, 'registry.json');
  await writeFile(generatedManifestPath, `${JSON.stringify(generatedManifest, null, 2)}\n`, 'utf8');

  console.log(`[${namespace}] Generated ${generatedManifest.items.length} registry items`);

  await mkdir(path.dirname(namespaceOutputRoot), { recursive: true });

  const command = spawnSync(
    'pnpm',
    [
      'exec',
      'shadcn',
      'build',
      'registry.json',
      '--output',
      namespaceOutputRoot,
      '--cwd',
      namespaceGeneratedRoot,
    ],
    {
      cwd: uiRegistryRoot,
      stdio: 'inherit',
    }
  );

  if (command.status !== 0) {
    throw new Error(`shadcn build failed for namespace "${namespace}"`);
  }

  console.log(`[${namespace}] Built to ${path.relative(uiRegistryRoot, namespaceOutputRoot)}/`);
}

async function main() {
  const namespaceFilter = getArg('--namespace');
  const manifestFiles = [canonicalManifestFile];

  try {
    await stat(path.join(manifestsDir, canonicalManifestFile));
  } catch {
    throw new Error(
      `Missing canonical registry manifest: ${path.join(manifestsDir, canonicalManifestFile)}`
    );
  }

  const selectedManifests = namespaceFilter
    ? manifestFiles.filter((fileName) => toNamespace(fileName) === namespaceFilter)
    : manifestFiles;

  if (selectedManifests.length === 0) {
    throw new Error(`Namespace "${namespaceFilter}" not found in manifests.`);
  }

  await mkdir(generatedRoot, { recursive: true });

  for (const manifestFileName of selectedManifests) {
    await buildNamespace(manifestFileName);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
