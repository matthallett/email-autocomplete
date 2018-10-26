
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

const plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  commonjs()
]

const name = 'emailautocomplete'

const base = {
  input: './src/index.js',
  output: {
    file: './dist/email-autocomplete.js',
    format: 'umd'
  },
  plugins
}

export default [
  Object.assign({}, base, {
    output: [
      { file: './dist/email-autocomplete.js', format: 'umd', name },
      { file: './dist/email-autocomplete.es.js', format: 'es', name }
    ]
  }),
  Object.assign({}, base, {
    output: [
      { file: './dist/email-autocomplete.min.js', format: 'umd', name }
    ],
    plugins: base.plugins.concat([
      uglify()
    ])
  })
]
