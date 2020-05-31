/**
 * @prettier
 */

const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const rimraf = require("rimraf");
const { mkdir } = require("./util");

const CURRENT_GEN = 8;

const DATA_BASE_DIR = path.resolve(__dirname, "../../pokemon-showdown/data/");
const POKEDEX_SRC_PATH = path.resolve(DATA_BASE_DIR, "pokedex.ts");
const POKEDEX_MODDED_TS_BASE_DIR = path.resolve(DATA_BASE_DIR, "mods");

const TMP_DIR = path.resolve(__dirname, "tmp");
const POKEDEX_TS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.ts");
const POKEDEX_JS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.js");

const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const POKEMON_OUT_JSON_FILE = path.resolve(OUT_DATA_DIR, "pokemon.json");

const POKEMON_NAME_BLACKLIST = /(-(Origin|Complete|10|Minior|Low-Key|Noice|Black|White|Antique|Ash|Large|Small|Super|Striped))|(^Pokestar.*)|(Pikachu-)|(Oricorio-)|(Type:)/;

const SPRITE_BASE_DIR = path.resolve(__dirname, "../sprites");

createPokemonList();
function createPokemonList() {
    mkdir(TMP_DIR);

    copyPokedexFilesToJs();
    const currentPokedex = require(POKEDEX_JS_TEMP_PATH).BattlePokedex;

    const earliestPokemonGens = getEarliestGenOfPokemon(currentPokedex);

    const sortedPokemonDataByName = buildPokemonData(currentPokedex, earliestPokemonGens);

    mkdir(OUT_DATA_DIR);
    fs.writeFileSync(POKEMON_OUT_JSON_FILE, JSON.stringify(sortedPokemonDataByName));
    rimraf.sync(TMP_DIR);
}

function copyPokedexFilesToJs() {
    fs.copyFileSync(POKEDEX_SRC_PATH, POKEDEX_TS_TEMP_PATH);

    for (i = 1; i < CURRENT_GEN; i++) {
        const genPokedexPath = path.resolve(POKEDEX_MODDED_TS_BASE_DIR, `gen${i}/formats-data.ts`);
        const outPathTs = path.resolve(TMP_DIR, `gen${i}.ts`);
        fs.copyFileSync(genPokedexPath, outPathTs);
    }

    shell(`npx sucrase --out-dir ${TMP_DIR} --transforms typescript,imports ${TMP_DIR}`);
}

function getEarliestGenOfPokemon(currentPokedex) {
    const pokemonEarliestGens = {};

    for (gen = 1; gen < CURRENT_GEN; gen++) {
        const genPokedexPath = path.resolve(TMP_DIR, `gen${gen}.js`);
        const genPokedex = require(genPokedexPath).BattleFormatsData;
        trackGenOfPokemon(genPokedex, gen);
    }
    trackGenOfPokemon(currentPokedex, CURRENT_GEN);

    function trackGenOfPokemon(pokedex, gen) {
        Object.keys(pokedex).forEach((pokemon) => {
            if (!(pokemon in pokemonEarliestGens)) {
                pokemonEarliestGens[pokemon] = gen.toString();
            }
        });
    }

    return pokemonEarliestGens;
}

function buildPokemonData(pokedex, earliestPokemonGens) {
    const sortedPokemonDataByName = Object.entries(pokedex)
        .filter(([pokemonId, pokemonData]) => pokemonFilter(pokemonData.name))
        .sort((entry1, entry2) => entry1[1].name.localeCompare(entry2[1].name))
        .reduce((pokemonMetadata, entry) => {
            const pokemonKey = entry[0];
            const pokemonData = entry[1];

            const normalizedName = pokemonData.name.toLowerCase();
            pokemonMetadata[normalizedName] = {
                name: pokemonData.name,
                gen: earliestPokemonGens[pokemonKey],
            };

            const spriteOverride = getSpriteOverride(
                pokemonData.name,
                earliestPokemonGens[pokemonKey]
            );
            if (spriteOverride) {
                pokemonMetadata[normalizedName].spriteOverride = spriteOverride;
            }

            return pokemonMetadata;
        }, {});

    return sortedPokemonDataByName;
}

function pokemonFilter(name) {
    if (POKEMON_NAME_BLACKLIST.test(name)) {
        console.log(`Excluding (name blacklist): ${name}`);
        return false;
    }
    return true;
}

function getSpriteOverride(name, gen) {
    const expectedSpriteFileName = name.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
    const expectedSpriteLocation = path.resolve(
        SPRITE_BASE_DIR,
        getRelSpritePath(expectedSpriteFileName, gen)
    );

    if (!fs.existsSync(expectedSpriteLocation)) {
        const possibleOverrides = getPossibleSpriteLocations(expectedSpriteFileName, gen);

        let spriteOverride;
        let done;
        do {
            const override = possibleOverrides.next();
            if (override.value && fs.existsSync(path.resolve(SPRITE_BASE_DIR, override.value))) {
                spriteOverride = override.value;
            }
            done = override.done;
        } while (!done && !spriteOverride);

        if (!spriteOverride) {
            console.log(`Missing sprite for ${expectedSpriteFileName} gen${gen}`);
        }
        return spriteOverride;
    }
}

function* getPossibleSpriteLocations(name, gen) {
    //some names remove dashes, others don't (ex: ho-oh -> hooh);
    yield getRelSpritePath(name.replace("-", ""), gen);

    //search in previous gen sprite folders
    for (let g = CURRENT_GEN; g >= 1; g--) {
        yield getRelSpritePath(name, g);
    }

    //stored as mewtwo-megax
    if (/-Mega-(X|Y)$/i.test(name)) {
        const parts = name.split("-");
        yield getRelSpritePath(parts[0] + "-" + parts[1] + parts[2], gen);
    }

    //fallback to base-species
    yield getRelSpritePath(name.split("-")[0], gen);
}

function getRelSpritePath(name, gen) {
    return `${getDirForGen(gen)}/${name}.png`;
}

function getDirForGen(gen) {
    return gen >= "7" ? "dex" : `gen${gen}`;
}

function shell(cmd) {
    child_process.execSync(cmd, { stdio: "inherit" });
}
