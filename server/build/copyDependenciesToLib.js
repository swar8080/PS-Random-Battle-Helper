const path = require('path');
const fs = require('fs-extra');
const walk = require('walk');
const prepend = require('prepend-file');

const PS_SOURCE_DIR = path.resolve(__dirname, '../../pokemon-showdown/');
const TARGET_DIR = path.resolve(__dirname,'../src/pokemon-showdown-lib/');

copyDirectory('data', '.data-dist');

copyDirectory('sim', 'sim').then(() => {
	console.log(`renaming sim types file to index.d.ts`);
	fs.rename(
		path.resolve(TARGET_DIR, "sim/global-variables.d.ts"),
		path.resolve(TARGET_DIR, "sim/index.d.ts"),
	);
});

copyDirectory('lib', 'lib');
copyDirectory('config', 'config').then(() => filterFiles('config', /datacenters\.csv/, false));

async function copyDirectory(source, target){
	const sourcePath = path.resolve(PS_SOURCE_DIR, source);
	const targetPath = path.resolve(TARGET_DIR, target);
	
	try {
		console.log(`copying ${sourcePath} -> ${targetPath}`);
		await fs.ensureDir(targetPath);
		await fs.copy(sourcePath, targetPath);
		
		const walker = walk.walk(targetPath);
		walker.on('file', async (root, fileStats, next) => {
			if (fileStats.name.endsWith(".ts")){
				console.log(`adding @ts-nocheck to ${fileStats.name}`)
				prepend(path.resolve(root, fileStats.name), "//@ts-nocheck\n");
			}
			next();
		});
	}
	catch (err){
		console.log(`failed to copy ${sourcePath} -> ${targetPath}`);
		throw err;
	}
}

async function filterFiles(targetLibDir, filter, isWhitelist){
	const dirPath = path.resolve(TARGET_DIR, targetLibDir);

	const dir = await fs.promises.opendir(dirPath);
	for await (const dirent of dir) {
		if (!!dirent.name.match(filter) ^ isWhitelist){
			const fullPath = path.resolve(dirPath, dirent.name);
			console.log(`deleting ${fullPath}`);
			await fs.remove(fullPath);
		}
	}
}

