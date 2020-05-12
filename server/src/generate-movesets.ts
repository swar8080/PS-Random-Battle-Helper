/**
 * @prettier
 */

import { Dex, PRNG } from "./pokemon-showdown-lib/sim";
import { RandomTeams } from "./pokemon-showdown-lib/.data-dist/random-teams";

export function generateMoveSets(
    pokemonName: string,
    gen: Generation,
    setCount: number
): RandomTeamsTypes.RandomSet[] {
    const formatName = `gen${gen}randombattle`;
    const teamGenerator = Dex.getTeamGenerator(formatName, new PRNG()) as RandomTeams;

    const sets: RandomTeamsTypes.RandomSet[] = [];
    for (let i = 0; i < setCount; i++) {
        sets.push(teamGenerator.randomSet(pokemonName));
    }
    return sets;
}
