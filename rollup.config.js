//Plugins
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json'

//Consts
const outputFileName = 'index'
const name = 'atir-jsonvalidator'

//Other
import pack from './package.json'
const banner = `// ${pack.name} v${pack.version} Copyright (c) ${new Date().getFullYear()} ${
  pack.author
}`

//Remove dist folder if it exists, so building is clean.
import fs from 'fs'
if (fs.existsSync('./dist') && fs.readdirSync('./dist').length) {
  fs.rmSync('./dist', { recursive: true, force: true })
}

const defaultConfig =   {
  input: './src/index.js',
  output: {
    file: `./dist/esm/index.js`,
    format: 'esm',
    exports: 'auto',
    preferConst: true,
    banner,
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
  ],
}

export default [
  defaultConfig
]
