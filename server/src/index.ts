/**
 * @prettier
 */
import { generateMoveSets } from "./generate-movesets";

const sets: RandomTeamsTypes.RandomSet[] = generateMoveSets("Mewtwo", "3", 10);
console.log(JSON.stringify(sets));
