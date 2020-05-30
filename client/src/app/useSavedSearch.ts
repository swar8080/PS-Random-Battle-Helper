/**
 * @prettier
 */

import * as React from "react";
import qs from "qs";
import { isValidPokemonName, isValidGen } from "./util/pokemonMetadataUtil";

type SearchUrlParams = {
    pokemon?: string;
    gen?: Common.Generation;
};
const SEARCH_STORAGE_KEY = "pokemonshowdown-random-battle-helper__search";
const DEFAULT_SEARCH: Client.PokemonSummarySearchInputs = {
    pokemonName: "Pikachu",
    generation: "8",
    isLead: false,
};

const useSavedSearch = () => {
    const localStorageSearch = React.useRef(
        getUrlParamSearch() || getLocalStorageSearch() || DEFAULT_SEARCH
    );
    return {
        savedSearch: localStorageSearch.current,
        saveSearch,
    };
};

function getUrlParamSearch(): Client.PokemonSummarySearchInputs | null {
    const params: SearchUrlParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    if (
        params.pokemon &&
        isValidPokemonName(params.pokemon) &&
        params.gen &&
        isValidGen(params.gen)
    ) {
        return {
            pokemonName: params.pokemon,
            generation: params.gen,
            isLead: false,
        };
    }
    return null;
}

function getLocalStorageSearch(): Client.PokemonSummarySearchInputs | null {
    try {
        if (window && window.localStorage) {
            const savedSearch = window.localStorage.getItem(SEARCH_STORAGE_KEY);
            if (savedSearch) {
                return JSON.parse(savedSearch);
            }
        }
    } catch (err) {
        console.log(err);
    }
    return null;
}

function saveSearch(search: Client.PokemonSummarySearchInputs) {
    saveSearchToUrlParams(search);
    saveSearchToLocalStorage(search);
}

function saveSearchToUrlParams(search: Client.PokemonSummarySearchInputs) {
    const params: SearchUrlParams = { pokemon: search.pokemonName, gen: search.generation };
    const urlParams = qs.stringify(params, { addQueryPrefix: true });
    window.history.replaceState({}, "", urlParams);
}

function saveSearchToLocalStorage(search: Client.PokemonSummarySearchInputs) {
    try {
        window.localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(search));
    } catch (err) {
        console.log(err);
    }
}

export default useSavedSearch;
