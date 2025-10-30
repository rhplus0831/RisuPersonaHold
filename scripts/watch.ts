import * as esbuild from 'esbuild';
import {spawn} from 'child_process';

esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'iife',
    legalComments: 'none',
    loader: {'.html': 'text', '.css': 'text'},
    define: {},
    outfile: 'dist/index.js',
    plugins: [{
        name: 'add-headers-plugin',
        setup(build) {
            build.onEnd(() => {
                console.log('Build complete, adding headers...');
                const child = spawn('tsx', ['scripts/add-headers.ts'], {
                    stdio: 'inherit',
                    shell: true
                });
                child.on('exit', (code) => {
                    if (code === 0) {
                        console.log('Headers added successfully');
                    } else {
                        console.error('Failed to add headers');
                    }
                });
            });
        }
    }]
}).then((ctx) => {
    ctx.watch().then(() => {
        console.log("Watching for changes...");
    })
});