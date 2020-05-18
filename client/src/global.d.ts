/// <reference path='../../shared-types/index.d.ts' />
/// <reference types="react-scripts" />

declare namespace Client {
    type PokemonSummarySearchInputs = {
        pokemonName: string,
        generation: Common.Generation,
        isLead: boolean
    }

    type APIResponseResult = Omit<APIResponse, "data">;
}

interface Window {
    ga: any
}