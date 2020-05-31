/**
 * @prettier
 */

const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const rimraf = require("rimraf");
const { mkdir } = require("./util");

const POKEDEX_TS_BASE_DIR = path.resolve(__dirname, "../../pokemon-showdown/data/");
const POKEDEX_MODDED_TS_BASE_DIR = path.resolve(POKEDEX_TS_BASE_DIR, "mods");
const CURRENT_GEN_TS_IN_PATH = path.resolve(POKEDEX_TS_BASE_DIR, "pokedex.ts");
const CURRENT_GEN = 8;

const TMP_DIR = path.resolve(__dirname, "tmp");
const POKEDEX_TS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.ts");
const POKEDEX_JS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.js");

const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const POKEMON_OUT_JSON_FILE = path.resolve(OUT_DATA_DIR, "pokemon.json");

const POKEMON_NAME_BLACKLIST = /(-(Mega|Gmax|Galar|Primal|Origin|Complete|10|Totem|Minior|Busted|Low-Key|Antique|Noice|Hangry|Crowned|Black|White|Ash|Large|Small|Super|Striped))|(^Pokestar.*)|(Pikachu-)|(Oricorio-)|(Arceus-)|(Silvally-)|(Type:)/;

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
    fs.copyFileSync(CURRENT_GEN_TS_IN_PATH, POKEDEX_TS_TEMP_PATH);

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
        .filter(([key, pokemonData]) => pokemonFilter(pokemonData.name))
        .sort((entry1, entry2) => entry1[1].name.localeCompare(entry2[1].name))
        .reduce((pokemonNameMap, entry) => {
            const pokemonKey = entry[0];
            const pokemonData = entry[1];

            const normalizedName = pokemonData.name.toLowerCase();
            pokemonNameMap[normalizedName] = {
                name: pokemonData.name,
                gen: earliestPokemonGens[pokemonKey],
            };

            return pokemonNameMap;
        }, {});

    return sortedPokemonDataByName;
}

function pokemonFilter(name) {
    //TODO find better way to filter out different variants
    const include = !POKEMON_NAME_BLACKLIST.test(name);
    if (!include) console.log("Excluding", name);
    return include;
};

function shell(cmd) {
    child_process.execSync(cmd, { stdio: "inherit" });
}
