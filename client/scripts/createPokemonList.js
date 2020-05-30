/**
 * @prettier
 */

const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const rimraf = require("rimraf");
const {mkdir} = require("./util");

const POKEDEX_TS_IN_PATH = path.resolve(__dirname, "../../pokemon-showdown/data/pokedex.ts");
const TMP_DIR = path.resolve(__dirname, "tmp");
const POKEDEX_TS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.ts");
const POKEDEX_JS_TEMP_PATH = path.resolve(TMP_DIR, "pokedex.js");
const OUT_DATA_DIR = path.resolve(__dirname, "../src/data");
const OUT_JSON_FILE = path.resolve(OUT_DATA_DIR, "pokemon.json");

const BLACKLIST = /(-(Mega|Gmax|Galar|Primal|Origin|Complete|10|Totem|Minior|Busted|Low-Key|Antique|Noice|Hangry|Crowned|Black|White|Ash|Large|Small|Super|Striped))|(^Pokestar.*)|(Pikachu-)|(Oricorio-)|(Arceus-)|(Silvally-)|(Type:)/;
const pokemonFilter = (name) => {
    //TODO find better way to filter out different variants
    const include = !BLACKLIST.test(name);
    if (!include) console.log("Excluding", name);
    return include;
};

mkdir(TMP_DIR);
fs.copyFileSync(POKEDEX_TS_IN_PATH, POKEDEX_TS_TEMP_PATH);
shell(`npx sucrase --out-dir ${TMP_DIR} --transforms typescript,imports ${TMP_DIR}`);

const pokedex = require(POKEDEX_JS_TEMP_PATH).BattlePokedex;
const sortedPokemonNames = Object.entries(pokedex)
    .filter(([key, pokemonData]) => pokemonFilter(pokemonData.name))
    .sort((entry1, entry2) => entry1[1].name.localeCompare(entry2[1].name))
    .reduce((pokemonNameMap, entry) => {
        const normalizedName = entry[1].name.toLowerCase();
        pokemonNameMap[normalizedName] = entry[1].name;
        return pokemonNameMap;
    }, {});

mkdir(OUT_DATA_DIR);
fs.writeFileSync(OUT_JSON_FILE, JSON.stringify(sortedPokemonNames));

rimraf.sync(TMP_DIR);

function shell(cmd) {
    child_process.execSync(cmd, { stdio: "inherit" });
}
