const http = require("http");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { streamToString, mkdir } = require("./util");

const SOURCE_SPRITE_URL = "http://play.pokemonshowdown.com/sprites/";
const SOURCE_SPRITE_DIRS = [
    "categories",
    "types",
    "itemicons",
    "gen1",
    "gen2",
    "gen3",
    "gen4",
    "gen5",
    "gen6",
    "dex",
];
const SPRITE_PNG_PATTERN = /href="(.*?\.png)"/g;
const TARGET_SPITE_DIR = path.resolve(__dirname, "../sprites");

const MAX_CONCURRENT_DOWNLOADS = 10;
const DELAY_BETWEEN_DOWNLOADS_MS = 500;
const downloadQueue = [];

rimraf(TARGET_SPITE_DIR, (err) => {
    if (err) throw err;

    mkdir(TARGET_SPITE_DIR);

    const collectDownloads = SOURCE_SPRITE_DIRS.map(collectSpritesToDownload);
    Promise.all(collectDownloads).then(downloadSprites);
});

function collectSpritesToDownload(fileIndexRelPath) {
    const sourceDirectoryUrl = `${SOURCE_SPRITE_URL}${fileIndexRelPath}/`;
    console.log("Collecting sprites at " + sourceDirectoryUrl);

    return new Promise((resolve, reject) => {
        http.get(sourceDirectoryUrl, async (res) => {
            try {
                if (res.statusCode !== 200) {
                    throw new Error(
                        `Unexpected status code downloading index.html for ${fileIndexRelPath}: ${res.statusCode}`
                    );
                }

                const indexHtml = await streamToString(res);

                const targetDir = path.resolve(TARGET_SPITE_DIR, fileIndexRelPath);
                mkdir(targetDir);

                const spriteMatcher = new RegExp(SPRITE_PNG_PATTERN);
                let match;
                while ((match = spriteMatcher.exec(indexHtml)) !== null) {
                    const spriteFileName = match[1];

                    const spriteUrl = `${sourceDirectoryUrl}${spriteFileName}`;
                    const targetFileName = path.resolve(targetDir, spriteFileName);
                    downloadQueue.push({
                        spriteUrl,
                        targetFileName,
                    });
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}

function downloadSprites() {
    if (downloadQueue.length > 0) {
        const nextBatch = downloadQueue.splice(0, MAX_CONCURRENT_DOWNLOADS);
        setTimeout(() => {
            nextBatch.forEach(({ spriteUrl, targetFileName }) => {
                console.log("Downloading " + spriteUrl);
                http.get(spriteUrl, (res) => {
                    if (res.statusCode !== 200) {
                        throw new Error(
                            `Unexpected status code when downloading ${spriteUrl}: ${res.statusCode}`
                        );
                    }

                    let outStream;
                    try {
                        outStream = fs.createWriteStream(targetFileName);
                        res.pipe(outStream);
                    } catch (err) {
                        if (outStream != null) {
                            outStream.end();
                        }
                        throw err;
                    }
                });
            });

            downloadSprites();
        }, DELAY_BETWEEN_DOWNLOADS_MS);
    }
}
