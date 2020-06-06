/**
 * @prettier
 */
import { Dex } from "./pokemon-showdown-lib/sim";
import { generateMovesets } from "./RandomSetGenerator";
import CustomError from "./customError";

type RequestParams = Partial<Common.PokemonSummarySearchInputs>;

const SET_COUNT_DEFAULT = "100";
const SET_COUNT = parseInt(process.env.SET_COUNT || SET_COUNT_DEFAULT);

exports.lambdaHandler = async (
    event: AWSLambda.APIGatewayEvent,
    context: AWSLambda.APIGatewayEventRequestContext
) => {
    let res: Common.APIResponse<Common.PokemonSummary>;
    try {
        const params: RequestParams = event.queryStringParameters;

        if (params.pokemonName && params.generation) {
            const search: Common.PokemonSummarySearchInputs = {
                pokemonName: params.pokemonName,
                generation: params.generation,
                isDoubles: String(params.isDoubles) === "true",
                isLead: String(params.isLead) === "true",
            };
            const pokemonSummary = getPokemonSummary(search);

            res = {
                successful: true,
                data: pokemonSummary,
            };
        } else {
            throw new Error("Invalid parameters");
        }
    } catch (err) {
        console.log(err);
        res = { successful: false, data: undefined };
        if (err instanceof CustomError) {
            res.errorMsg = err.message;
        }
    }

    return {
        statusCode: res.successful ? 200 : 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(res),
    };
};

function getPokemonSummary(search: Common.PokemonSummarySearchInputs): Common.PokemonSummary {
    const metadata: ModdedDex = Dex.forGen(parseInt(search.generation));

    const sets: RandomTeamsTypes.RandomSet[] = generateMovesets(search, metadata, SET_COUNT);
    const species: Species = metadata.getSpecies(search.pokemonName);

    const summary: Common.PokemonSummary = {
        displayName: species.name,
        type1: species.types[0],
        type2: species.types.length > 1 ? species.types[1] : null,
        simulationResult: {
            moveOccurrences: getMoveOccurences(sets, metadata),
            abilityOccurences: getAbilityOccurences(sets, metadata, species),
            itemOccurences: getItemOccurences(sets, metadata, species),
            setsGenerated: SET_COUNT,
        },
        baseStats: species.baseStats,
        typeEffectiveness: getTypeEffectiveness(species, metadata),
    };

    return summary;
}

function getMoveOccurences(
    sets: RandomTeamsTypes.RandomSet[],
    metadata: ModdedDex
): Common.MovesWithOccurences {
    //remove duplicates for pokemon that can have less than 4 moves
    const extractUniqueMoveKeysFromSet = (set: RandomTeamsTypes.RandomSet) =>
        Array.from(new Set(set.moves));

    return getOccurenceCounts(sets, extractUniqueMoveKeysFromSet)
        .map(([moveId, occurences]) => {
            const move = metadata.getMove(moveId);
            return {
                name: move.name,
                moveType: move.type,
                description: move.desc || move.shortDesc,
                effectType: move.category,
                occurences,
            };
        })
        .sort(sortByOccurencesDesc);
}

function getAbilityOccurences(
    sets: RandomTeamsTypes.RandomSet[],
    metadata: ModdedDex,
    species: Species
): Common.AbilityOccurence[] {
    if (species.isMega || species.isPrimal) {
        //simulation results are for the base species, so need to explicitly handle different formes' abilities
        const formeAbility = metadata.getAbility(species.abilities[0]);
        return [
            {
                abilityDisplayName: formeAbility.name,
                description: formeAbility.desc || formeAbility.shortDesc,
                occurences: SET_COUNT,
            },
        ];
    } else {
        return getOccurenceCounts(sets, (set) => [set.ability])
            .map(([abilityId, occurences]) => {
                const ability = metadata.getAbility(abilityId);
                return {
                    abilityDisplayName: ability.name,
                    description: ability.desc || ability.shortDesc,
                    occurences,
                };
            })
            .sort(sortByOccurencesDesc);
    }
}

function getItemOccurences(
    sets: RandomTeamsTypes.RandomSet[],
    metadata: ModdedDex,
    species: Species
): Common.ItemOccurence[] {
    if (species.requiredItem) {
        const requiredItem = metadata.getSpecies(species.requiredItem);
        return [
            {
                itemDisplayName: requiredItem.name,
                description: requiredItem.desc || requiredItem.shortDesc,
                occurences: SET_COUNT,
            },
        ];
    } else {
        return getOccurenceCounts(sets, (set) => [set.item])
            .map(([itemId, occurences]) => {
                const item = metadata.getItem(itemId);
                return {
                    itemDisplayName: item.name,
                    description: item.desc || item.shortDesc,
                    occurences,
                };
            })
            .sort(sortByOccurencesDesc);
    }
}

function getOccurenceCounts<T>(sets: T[], keyExtractor: (set: T) => string[]): [string, number][] {
    let countByKey: Record<string, number> = {};
    countByKey = sets.reduce((occurences, set) => {
        const keys: string[] = keyExtractor(set);
        keys.forEach((key) => {
            if (key) {
                if (occurences[key] !== undefined) {
                    occurences[key]++;
                } else {
                    occurences[key] = 1;
                }
            }
        });
        return occurences;
    }, countByKey);
    return Object.entries(countByKey);
}

type HasOccurences = { occurences: number };
function sortByOccurencesDesc(a1: HasOccurences, a2: HasOccurences) {
    return -(a1.occurences - a2.occurences);
}

// 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
type DamageEnum = 0 | 1 | 2 | 3;
const DAMAGE_MULTIPLIERS = {
    0: 1,
    1: 2,
    2: 0.5,
    3: 0,
};

function getTypeEffectiveness(
    pokemonMeta: SpeciesData,
    metadata: ModdedDex
): Record<Common.TypeEffectiveness, string[]> {
    const typeEffectiveness: Record<Common.TypeEffectiveness, string[]> = {
        [0]: [],
        [0.25]: [],
        [0.5]: [],
        [1]: [],
        [2]: [],
        [4]: [],
    };

    const sortedTypes = pokemonMeta.types.sort((type1, type2) => type1.localeCompare(type2));
    const type1Info: TypeInfo = metadata.getType(sortedTypes[0]);
    const type2Info: TypeInfo | null =
        sortedTypes.length > 1 ? metadata.getType(sortedTypes[1]) : null;

    Object.entries(type1Info.damageTaken)
        .filter(([typeName]) => {
            const type: TypeInfo = metadata.getType(typeName);
            return type && type.exists;
        })
        .forEach(([typeName, damageEnum]) => {
            let damageMultiplier: number = DAMAGE_MULTIPLIERS[damageEnum as DamageEnum];
            if (type2Info) {
                damageMultiplier *=
                    DAMAGE_MULTIPLIERS[type2Info.damageTaken[typeName] as DamageEnum];
            }
            typeEffectiveness[damageMultiplier as Common.TypeEffectiveness].push(typeName);
        });

    Object.values(typeEffectiveness).forEach((typeList) => typeList.sort());
    return typeEffectiveness;
}
