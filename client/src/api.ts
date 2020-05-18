const API_URL = process.env.REACT_APP_API_URL;

interface API {
    getPokemonSummary(
        pokemonName: string,
        gen: Common.Generation
    ): Promise<Common.APIResponse<Common.PokemonSummary>>;
}

const api: API = {
    getPokemonSummary: (pokemonName: string, gen: Common.Generation) => {
        const requestUrl: string = `${API_URL}?pokemonName=${pokemonName}&gen=${gen}`;
        return fetch(requestUrl).then((response) => response.json());
    },
};

export default api;
