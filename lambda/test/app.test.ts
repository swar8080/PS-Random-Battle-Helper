/**
 * @prettier
 */
/// <reference path='index.d.ts' />

const { lambdaHandler } = require("../src/app");

describe("Pokemon Summary Endpoint", () => {
    beforeAll(() => {
        process.env.SET_COUNT = "1";
    });

    const runHandler = async (
        pokemonName: string,
        generation: Common.Generation,
        isDoubles: boolean = false,
        isLead: boolean = false
    ): Promise<Common.PokemonSummary> => {
        const apiResponse = await lambdaHandler({
            queryStringParameters: {
                pokemonName,
                generation,
                isDoubles,
                isLead
            },
        });
        const response: Common.APIResponse<Common.PokemonSummary> = JSON.parse(apiResponse.body);

        expect(response.successful).toBe(true);
        return response.data;
    };

    describe("different generations", () => {
        test("Gen 1", async () => {
            await runHandler("Gengar", "1");
            return await runHandler("Gengar", "1", true, true);
        });

        //handles random set generator for gen 2 has a different method signature
        test("Gen 2", async () => {
            await runHandler("Gengar", "2");
            return await runHandler("Gengar", "2", true, true);
        });

        test("Gen 3", async () => {
            await runHandler("Gengar", "3");
            return await runHandler("Gengar", "3", true, true);
        });

        test("Gen 4", async () => {
            await runHandler("Gengar", "4");
            return await runHandler("Gengar", "4", true, true);
        });

        test("Gen 5", async () => {
            await runHandler("Gengar", "5");
            return await runHandler("Gengar", "5", true, true);
        });

        test("Gen 6", async () => {
            await runHandler("Gengar", "6");
            return await runHandler("Gengar", "6", true, true);
        });
        
        test("Gen 7", async () => {
            await runHandler("Gengar", "7");
            return await runHandler("Gengar", "7", true, true);
        });

        test("Gen 8", async () => {
            await runHandler("Gengar", "8");
            return await runHandler("Gengar", "8", true, true);
        });
    });

    describe("Pokemon formes", () => {
        test("mega", async () => {
            const megaX: Common.PokemonSummary = await runHandler("Mewtwo-Mega-X", "8");
            expect(megaX.displayName).toBe("Mewtwo-Mega-X");
            expect(megaX.type1).toBe("Psychic");
            expect(megaX.type2).toBe("Fighting");
            expect(megaX.baseStats.atk).toBe(190);
            expect(megaX.simulationResult.abilityOccurences[0].abilityDisplayName).toBe(
                "Steadfast"
            );
            expect(megaX.simulationResult.itemOccurences[0].itemDisplayName).toBe("Mewtwonite X");

            const base: Common.PokemonSummary = await runHandler("Mewtwo", "8");
            expect(base.displayName).toBe("Mewtwo");
            expect(base.type1).toBe("Psychic");
            expect(base.type2).toBeNull();
            expect(base.baseStats.atk).toBe(110);
            expect(base.simulationResult.abilityOccurences[0].abilityDisplayName).not.toBe(
                "Steadfast"
            );
            expect(base.simulationResult.itemOccurences[0].itemDisplayName).not.toBe(
                "Mewtwonite X"
            );
        });

        test("primal", async () => {
            const primal: Common.PokemonSummary = await runHandler("Groudon-Primal", "8");
            expect(primal.displayName).toBe("Groudon-Primal");
            expect(primal.type1).toBe("Ground");
            expect(primal.type2).toBe("Fire");
            expect(primal.baseStats.atk).toBe(180);
            expect(primal.simulationResult.abilityOccurences[0].abilityDisplayName).toBe(
                "Desolate Land"
            );
            expect(primal.simulationResult.itemOccurences[0].itemDisplayName).toBe("Red Orb");

            const base: Common.PokemonSummary = await runHandler("Groudon", "8");
            expect(base.displayName).toBe("Groudon");
            expect(base.type1).toBe("Ground");
            expect(base.type2).toBeNull();
            expect(base.baseStats.atk).toBe(150);
            expect(base.simulationResult.abilityOccurences[0].abilityDisplayName).not.toBe(
                "Desolate Land"
            );
            expect(base.simulationResult.itemOccurences[0].itemDisplayName).not.toBe("Red Orb");
        });

        test("gmax", async () => {
            const gmax = await runHandler("Meowth-Gmax", "8");
        });

        test("galar", async () => {
            const gmax = await runHandler("Zigzagoon-Galar", "8");
        });
    });

    describe("type effectiveness", () => {
        test("all multipliers", async () => {
            const result = await runHandler("Aggron", "8");

            expect(result.typeEffectiveness[0.25]).toEqual(["Flying", "Normal"]);
            expect(result.typeEffectiveness[0.5]).toEqual([
                "Bug",
                "Dragon",
                "Fairy",
                "Ice",
                "Psychic",
                "Rock",
            ]);
            expect(result.typeEffectiveness[0]).toEqual(["Poison"]);
            expect(result.typeEffectiveness[1]).toEqual([
                "Dark",
                "Electric",
                "Fire",
                "Ghost",
                "Grass",
                "Steel",
            ]);
            expect(result.typeEffectiveness[2]).toEqual(["Water"]);
            expect(result.typeEffectiveness[4]).toEqual(["Fighting", "Ground"]);
        });

        test("type effectiveness is aware of types available in the generation", async () => {
            const gen3Result = await runHandler("Salamence", "3");
            expect(gen3Result.typeEffectiveness[2]).toEqual(expect.not.arrayContaining(["Fairy"]));

            const gen8Result = await runHandler("Salamence", "8");
            expect(gen8Result.typeEffectiveness[2]).toEqual(expect.arrayContaining(["Fairy"]));
        });

        test("filter out effect type resistance like sandstorm", async () => {
            const result = await runHandler("Golem", "3");
            expect(result.typeEffectiveness[0]).toEqual(expect.not.arrayContaining(["sandstorm"]));
        });
    });

    describe("Move metadata", () => {
        test('move without damage or accuracy', async () => {
            const result = await runHandler("Ditto", "1");
            expect(result.simulationResult.moveOccurrences[0].damage).toBeUndefined();
            expect(result.simulationResult.moveOccurrences[0].accuracy).toBeUndefined();
            expect(result.simulationResult.moveOccurrences[0].pp).toBe(10);
        })
    })

    test("Error when simulation results unavailable for pokemon", async () => {
        const apiResponse = await lambdaHandler({
            queryStringParameters: {
                pokemonName: "Charizard-Gmax",
                generation: "8",
            },
        });
        const response: Common.APIResponse<Common.PokemonSummary> = JSON.parse(apiResponse.body);

        expect(response.successful).toBe(false);
        expect(response.errorMsg).toBe(
            "Simulation results are unavailable for this pokemon and/or format"
        );
    });

    test("Unexpected error", async () => {
        const apiResponse = await lambdaHandler({
            queryStringParameters: {
                pokemonName: "invalid",
                gen: "100",
            },
        });
        const response: Common.APIResponse<Common.PokemonSummary> = JSON.parse(apiResponse.body);

        expect(response.successful).toBe(false);
        expect(response.errorMsg).toBeUndefined();
    });
});
