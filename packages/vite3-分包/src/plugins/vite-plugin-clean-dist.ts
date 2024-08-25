import { Plugin } from 'vite';
import { rm } from 'fs/promises';
import { resolve } from 'path';

interface CleanDistOptions {
  outDir?: string;
}

/**
 * Vite Plugin to clean the output directory before build.
 * @param {CleanDistOptions} options - Plugin options.
 * @returns Vite Plugin configuration.
 */
export default function cleanDist(options: CleanDistOptions = {}): Plugin {
  const { outDir = 'dist' } = options;

  return {
    name: 'vite-plugin-clean-dist',
    buildStart: async () => {
      const resolvedPath = resolve(process.cwd(), outDir);
      await rm(resolvedPath, { recursive: true, force: true });
      console.log(`Cleaned: ${resolvedPath}`);
    }
  };
}
