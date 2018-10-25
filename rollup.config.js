
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './src/index.js',
  external: ['jquery'],
  output: {
    file: './dist/jquery.email-autocomplete.js',
    format: 'umd',
    name: 'jqueryEmailAutocomplete',
    globals: {
      'jquery': 'jQuery'
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      only: [/^(?!jquery).*$/],
      preferBuiltins: true
    }),
    commonjs()
  ]
}
