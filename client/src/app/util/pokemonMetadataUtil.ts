import _PokemonData from '../../data/pokemon.json';

type PokemonMetadata = {
    name: string,
    gen: Common.Generation,
    spriteOverride?: string
}
//@ts-ignore
const PokemonData: Record<string, PokemonMetadata> = _PokemonData;

const VALID_GENS = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);


export function displayNameToPokemonId(name: string){
    if (name){
        return name.toLowerCase();
    }
    return name;
}

export function pokemonIdToDisplayName(pokemonId: string){
    const metadata = PokemonData[pokemonId];
    if (metadata){
        return metadata.name;
    }
    return pokemonId;
}

export function isValidPokemonDisplayName(displayName: string, gen: Common.Generation){
    const pokemonId = displayNameToPokemonId(displayName);
    const pokemon: PokemonMetadata = PokemonData[pokemonId];
    return pokemon && gen >= pokemon.gen;
}

export function getSortedPokemonIdsReleasedInGen(gen: Common.Generation): string[] {
    return Object.entries(PokemonData)
        .filter(entry => gen >= entry[1].gen)
        .map(entry => entry[0]);
}

export function isValidGen(gen: string){
    return VALID_GENS.has(gen);
}

export function getDisplayedTypeName(typeName: string){
    //treat moves like curse which have ??? type as ghost
    return typeName !== "???"? typeName : "Ghost";
}

export function getSpriteOverrideForDisplayName(displayName: string): string | undefined{
    const metadata = PokemonData[displayNameToPokemonId(displayName)];
    return metadata && metadata.spriteOverride;
}
