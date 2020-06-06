/**
 * @prettier
 */

import { PRNG } from "./pokemon-showdown-lib/sim";
import { RandomTeams } from "./pokemon-showdown-lib/.data-dist/random-teams";
import RandomGen2Teams from "./pokemon-showdown-lib/.data-dist/mods/gen2/random-teams";
import CustomError from "./customError";

type RandomSetGenerator = () => RandomTeamsTypes.RandomSet;

export function generateMovesets(
    { pokemonName, generation, isDoubles, isLead }: Common.PokemonSummarySearchInputs,
    dex: ModdedDex,
    setCount: number
): RandomTeamsTypes.RandomSet[] {
    const species: Species = getElligibleSpeciesForMoveGeneration(dex, pokemonName);
    
    let randomSetGenerator: RandomSetGenerator;
    if (generation === "8") {
        randomSetGenerator = getGen8SetGenerator(species, isDoubles, isLead, dex);
    } else if (generation === "2") {
        randomSetGenerator = getGen2SetGenerator(species, dex);
    } else {
        randomSetGenerator = getGeneratorForGenaration(species, generation, isLead, dex);
    }

    const sets: RandomTeamsTypes.RandomSet[] = [];
    try {
        runWithGlobalDex(dex, () => {
            for (let i = 0; i < setCount; i++) {
                sets.push(randomSetGenerator());
            }
        });
    } catch (err) {
        console.log("Error generating simulation results", err);
        throw new CustomError(
            "Simulation results are unavailable for this pokemon and/or format"
        );
    }

    return sets;
}

function getGen8SetGenerator(
    species: Species,
    isDoubles: boolean,
    isLead: boolean,
    dex: ModdedDex
): RandomSetGenerator {
    const formatName = getFormatName("8");
    const teamGenerator = dex.getTeamGenerator(formatName, new PRNG()) as RandomTeams;
    return () => teamGenerator.randomSet(species, {}, isLead, isDoubles);
}

function getGen2SetGenerator(species: Species, dex: ModdedDex): RandomSetGenerator {
    const formatName = getFormatName("2");
    const teamGenerator = dex.getTeamGenerator(formatName, new PRNG()) as RandomGen2Teams;

    const restrictMoves = {};
    return () => teamGenerator.randomSet(species, restrictMoves);
}

function getGeneratorForGenaration(
    species: Species,
    generation: Common.Generation,
    isLead: boolean,
    dex: ModdedDex
): RandomSetGenerator {
    const formatName = getFormatName(generation);
    const teamGenerator = dex.getTeamGenerator(formatName, new PRNG()) as RandomTeams;
    return () => teamGenerator.randomSet(species, {}, isLead);
}

function getFormatName(gen: Common.Generation) {
    return `gen${gen}randombattle`;
}

function getElligibleSpeciesForMoveGeneration(dex: ModdedDex, pokemonName: string): Species {
    let species = dex.getSpecies(pokemonName);
    if (species.isMega || species.isPrimal) {
        species = dex.getSpecies(species.baseSpecies);
    }
    return species;
}

//Some RandomTeams implementation rely on a global Dex variable to be available
function runWithGlobalDex(dex: ModdedDex, runnable: Function) {
    const currentGlobal = global.Dex;
    try {
        global.Dex = dex;
        runnable();
    }
    finally {
        global.Dex = currentGlobal;
    }
}
