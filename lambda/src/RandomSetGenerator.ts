/**
 * @prettier
 */

import { PRNG } from "./pokemon-showdown-lib/sim";
import { RandomTeams } from "./pokemon-showdown-lib/.data-dist/random-teams";
import RandomGen2Teams from "./pokemon-showdown-lib/.data-dist/mods/gen2/random-teams";
import CustomError from './customError';

export interface RandomSetGenerator {
    generateSets: (
        dex: ModdedDex,
        gen: Common.Generation,
        pokemonName: string,
        setCount: number
    ) => RandomTeamsTypes.RandomSet[];
}

export function getRandomSetGenerator(gen: Common.Generation): RandomSetGenerator {
    if (gen === "2") {
        return Gen2RandomSetGenerator;
    } else {
        return DefaultRandomSetGenerator;
    }
}

const DefaultRandomSetGenerator: RandomSetGenerator = {
    generateSets: (
        dex: ModdedDex,
        gen: Common.Generation,
        pokemonName: string,
        setCount: number
    ) => {
        const formatName = getFormatName(gen);
        const teamGenerator = dex.getTeamGenerator(formatName, new PRNG()) as RandomTeams;
        const species: Species = getElligibleSpeciesForMoveGeneration(dex, pokemonName);

        const sets: RandomTeamsTypes.RandomSet[] = [];

        try {
            runWithGlobalDex(dex, () => {
                for (let i = 0; i < setCount; i++) {
                    sets.push(teamGenerator.randomSet(species));
                }
            });
        }
        catch (err){
            console.log("Error generating simulation results", err);
            throw new CustomError("Simulation results are unavailable for this pokemon and/or generation")
        }

        return sets;
    },
};

//Gen 2 has a different method signature that expected a {string:boolean} restrict moves object
const Gen2RandomSetGenerator: RandomSetGenerator = {
    generateSets: (
        dex: ModdedDex,
        gen: Common.Generation,
        pokemonName: string,
        setCount: number
    ) => {
        const formatName = getFormatName("2");
        const teamGenerator = dex.getTeamGenerator(formatName, new PRNG()) as RandomGen2Teams;
        const species: Species = getElligibleSpeciesForMoveGeneration(dex, pokemonName);

        const sets: RandomTeamsTypes.RandomSet[] = [];
        const restrictMoves = {};

        try {
            runWithGlobalDex(dex, () => {
                for (let i = 0; i < setCount; i++) {
                    sets.push(teamGenerator.randomSet(species, restrictMoves));
                }
            });
        }
        catch (err){
            console.log("Error generating simulation results", err);
            throw new CustomError("Simulation results are unavailable for this pokemon and/or generation")
        }


        return sets;
    },
};

function getFormatName(gen: Common.Generation) {
    return `gen${gen}randombattle`;
}

function getElligibleSpeciesForMoveGeneration(dex: ModdedDex, pokemonName: string): Species{
    let species = dex.getSpecies(pokemonName)
    if (species.isMega || species.isPrimal){
        species = dex.getSpecies(species.baseSpecies);
    }
    return species;
}

//Some RandomTeams implementation rely on a global Dex variable to be available
function runWithGlobalDex(dex: ModdedDex, runnable: Function) {
    const currentGlobal = global.Dex;
    global.Dex = dex;
    runnable();
    global.Dex = currentGlobal;
}
