import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
export default defineConfig([
    {
        input: './src/main.ts',
        output: [
            {
                file: './dist/simply-ellipsis.js',
                format: 'umd',
                name: 'ellipsis',
            },
            {
                file: './dist/simply-ellipsis.min.js',
                format: 'umd',
                name: 'ellipsis',
            },
        ],
        plugins: [
            typescript({
                exclude: 'node_modules/**',
                typescript: require('typescript'),
            }),
            sourceMaps(),
        ],
    },
    {
        input: './src/main.ts',
        output: [
            {
                file: './dist/simply-ellipsis.d.ts',
                format: 'umd',
                name: 'ellipsis',
            },
        ],
        plugins: [
            dts(),
        ],
    },
])
