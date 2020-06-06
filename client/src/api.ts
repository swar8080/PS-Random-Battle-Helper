/**
 * @prettier
 */

import qs from "qs";

const API_URL = process.env.REACT_APP_API_URL;

interface API {
    getPokemonSummary(
        search: Common.PokemonSummarySearchInputs
    ): Promise<Common.APIResponse<Common.PokemonSummary>>;
}

const api: API = {
    getPokemonSummary: (search) => {
        const searchParams = qs.stringify(search, { addQueryPrefix: false });
        const requestUrl: string = `${API_URL}?${searchParams}`;
        return fetch(requestUrl).then((response) => response.json());
    },
};

export default api;
