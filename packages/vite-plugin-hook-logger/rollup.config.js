import pkg from './package.json' assert { type: 'json' };
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: [
    {
      format: "es",
      file: pkg.main,
      sourcemap: true
    },
  ],

  plugins: [typescript()],
};
