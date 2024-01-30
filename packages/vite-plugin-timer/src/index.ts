import { Plugin } from 'vite';

const viteBuildTimer = (): Plugin => {
  let startTime: number;

  return {
    name: 'vite-build-timer',
    buildStart() {
      startTime = Date.now();
      console.log('Build started...');
    },
    buildEnd() {
      const endTime = Date.now();
      console.log(`Build finished in ${endTime - startTime}ms`);
    }
  };
};

export default viteBuildTimer;
