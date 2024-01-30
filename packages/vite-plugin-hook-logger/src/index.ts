import { Plugin } from 'vite';

function viteHookLogger(): Plugin {
  return {
    name: 'vite-hook-logger',
    // Vite-specific hooks
    configureServer(server) {
      console.log('configureServer called');
    },
    config(config, { command }) {
      console.log(`config called, command: ${command}`);
    },
    configResolved(resolvedConfig) {
      console.log('configResolved called');
    },
    transformIndexHtml(html) {
      console.log('transformIndexHtml called');
    },
    handleHotUpdate(ctx) {
      console.log('handleHotUpdate called');
      return ctx.modules; // Just return the existing modules
    },

    // Rollup hooks
    options(opts) {
      console.log('options called');
      return opts; // Return the options object
    },
    buildStart(inputOptions) {
      console.log('buildStart called');
    },
    resolveId(source, importer, options) {
      console.log(`resolveId called, source: ${source}, importer: ${importer}`);
      return null; // Indicate that we don't resolve this id
    },
    load(id) {
      console.log(`load called, id: ${id}`);
      return null; // Indicate that we don't load this id
    },
    transform(code, id) {
      // console.log(`transform called, id: ${id}`);
      if (id.startsWith('/src/')) {
        console.log(`transforming file: ${id}`);
      }
      return null; // Just return null
    },
    buildEnd(err) {
      if (err) console.log(`buildEnd called, error: ${err}`);
      else console.log('buildEnd called without error');
    },
    renderStart(outputOptions, inputOptions) {
      console.log('renderStart called');
    },
    renderChunk(code, chunk, options) {
      console.log(`renderChunk called, chunk: ${chunk.fileName}`);
      return null;
    },
    generateBundle(options, bundle, isWrite) {
      console.log('generateBundle called');
    },
    writeBundle(bundle) {
      console.log('writeBundle called');
    },
    closeBundle() {
      console.log('closeBundle called');
    }
  };
}

export default viteHookLogger;
