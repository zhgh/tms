import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

const getTypescriptplugin = (tsconfigOverride = {}) => {
    return typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride
    });
};
const plugins = [
    babel({
        presets: [
            ['es2015-rollup'],
            'stage-0'
        ],
        plugins: [
            'transform-object-assign'
        ]
    })
];

export default [
    // tms
    {
        input: 'src/index.ts',
        output: {
            name: 'Tms',
            file: 'dist/tms.js',
            format: 'umd'
        },
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            name: 'Tms',
            file: 'dist/tms.min.js',
            format: 'umd'
        },
        plugins: [
            getTypescriptplugin(),
            ...plugins,
            uglify()
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/tms.esm.js',
            format: 'es'
        },
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/tms.common.js',
            format: 'cjs'
        },
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    // vue-tms
    {
        input: 'packages/vue-tms/src/index.ts',
        output: {
            name: 'VueTms',
            file: 'packages/vue-tms/dist/vue-tms.js',
            format: 'umd'
        },
        external: ['vue', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'packages/vue-tms/src/index.ts',
        output: {
            name: 'VueTms',
            file: 'packages/vue-tms/dist/vue-tms.min.js',
            format: 'umd'
        },
        external: ['vue', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins,
            uglify()
        ]
    },
    {
        input: 'packages/vue-tms/src/index.ts',
        output: {
            file: 'packages/vue-tms/dist/vue-tms.esm.js',
            format: 'es'
        },
        external: ['vue', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'packages/vue-tms/src/index.ts',
        output: {
            file: 'packages/vue-tms/dist/vue-tms.common.js',
            format: 'cjs'
        },
        external: ['vue', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    // react-tms
    {
        input: 'packages/react-tms/src/index.ts',
        output: {
            name: 'ReactTms',
            file: 'packages/react-tms/dist/react-tms.js',
            format: 'umd'
        },
        external: ['react', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'packages/react-tms/src/index.ts',
        output: {
            name: 'ReactTms',
            file: 'packages/react-tms/dist/react-tms.min.js',
            format: 'umd'
        },
        external: ['react', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins,
            uglify()
        ]
    },
    {
        input: 'packages/react-tms/src/index.ts',
        output: {
            file: 'packages/react-tms/dist/react-tms.esm.js',
            format: 'es'
        },
        external: ['react', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    },
    {
        input: 'packages/react-tms/src/index.ts',
        output: {
            file: 'packages/react-tms/dist/react-tms.common.js',
            format: 'cjs'
        },
        external: ['react', 'tms'],
        plugins: [
            getTypescriptplugin(),
            ...plugins
        ]
    }
];
