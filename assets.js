/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, join } = require('path');
const {
    readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, lstatSync
} = require('fs');

const files = [];

function copyFiles(path) {
    const newPath = path || resolve(__dirname, 'src');
    const stats = lstatSync(newPath);

    if (!stats.isDirectory()) {
        if (/\/*\.ts/g.test(newPath)) return;

        files.push(newPath);
        return;
    }

    for (const p of readdirSync(newPath)) {
        copyFiles(resolve(newPath, p));
    }
}

function writeFiles() {
    for (const p of files) {
        const data = readFileSync(p, {
            encoding: 'utf-8'
        });

        const path = join(__dirname, 'public', resolve(__dirname, 'public', p.slice(`${__dirname} src`.length, p.length)));

        const dirPath = resolve(path, '..');

        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, {
                recursive: true
            });
        }

        writeFileSync(path, data, {
            flag: 'w'
        });
    }
}

copyFiles();
writeFiles(files);
