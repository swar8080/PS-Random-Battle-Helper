/**
 * @prettier
 */

const { lambdaHandler } = require("../src/app");

describe("Pokemon Summary Endpoint", () => {
    beforeAll(() => {
        process.env.SET_COUNT = "1";
    });

    const runHandler = async (
        pokemonName: string,
        gen: Common.Generation
    ): Promise<Common.PokemonSummary> => {
        const apiResponse = await lambdaHandler({
            queryStringParameters: {
                pokemonName,
                gen,
            },
        });
        const response: Common.APIResponse<Common.PokemonSummary> = JSON.parse(apiResponse.body);

        expect(response.successful).toBe(true);
        return response.data;
    };

    //handles some random set generators requiring Dex to be available as a global
    test("Gen 7 pokemon without a random move pool", async () => {
        return await runHandler("Golbat", "7");
    });

    //handles random set generator for gen 2 has a different method signature
    test("Gen 2 pokemon", async () => {
        return await runHandler("Gengar", "2");
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
});
