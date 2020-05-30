import PokemonNames from '../../data/pokemon.json';

export const POKEMON_NAME_IDS: string[] = Object.keys(PokemonNames);
const VALID_GENS = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);

export function displayNameToPokemonId(name: string){
    if (name){
        return name.toLowerCase();
    }
    return name;
}

export function isValidPokemonName(name: string){
    return displayNameToPokemonId(name) in PokemonNames;
}

export function getPokemonDisplayNameByIndex(index: number): string{
    const nameId = POKEMON_NAME_IDS[index];
    //@ts-ignore
    return PokemonNames[nameId];
}

export function isValidGen(gen: string){
    return VALID_GENS.has(gen);
}
