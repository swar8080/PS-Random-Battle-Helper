/**
 * @prettier
 */

import { Dex, PRNG } from "../lib/pokemon-showdown/sim";
import { RandomTeams } from "../lib/pokemon-showdown/.data-dist/random-teams";

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
