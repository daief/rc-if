import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = output => ({
  input: './src/index.ts',
  output: {
    ...output,
  },
  plugins: [typescript(), output.format === 'umd' && terser()].filter(Boolean),
  external: ['react'],
});

export default [
  {
    file: pkg['umd:main'],
    format: 'umd',
    name: 'RcIF',
    sourcemap: true,
    globals: {
      react: 'React',
    },
  },
  {
    file: pkg.main,
    format: 'cjs',
  },
  {
    file: pkg.module,
    format: 'es',
  },
].map(_ => config(_));
