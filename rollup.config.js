import { uglify } from 'rollup-plugin-uglify';
export default {
    input: './src/main.js',
    output: {
        file: './dist/simply-ellipsis.js',
        format: 'umd',
        name: 'ellipsis'
    },
    plugins: [
        uglify()
    ]
};