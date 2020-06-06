/**
 * @prettier
 */

import * as React from "react";
import qs from "qs";
import { isValidPokemonDisplayName, isValidGen, isDoublesValid } from "./util/showdownMetadataUtil";

type SearchUrlParams = {
    pokemon?: string;
    gen?: Common.Generation;
    doubles?: boolean,
    lead?: boolean
};
const SEARCH_STORAGE_KEY = "pokemonshowdown-random-battle-helper__search";
const DEFAULT_SEARCH: Common.PokemonSummarySearchInputs = {
    pokemonName: "Pikachu",
    generation: "8",
    isDoubles: false,
    isLead: false,
};

const useSavedSearch = () => {
    const initialSearch = React.useRef(
        getUrlParamSearch() || getLocalStorageSearch() || DEFAULT_SEARCH
    );

    const handleOnSaveSearch = (search: Common.PokemonSummarySearchInputs) => {
        saveSearchToUrlParams(search);
        saveSearchToLocalStorage(search);
    };

    return {
        initialSearch: initialSearch.current,
        saveSearch: handleOnSaveSearch,
    };
};

function getUrlParamSearch(): Common.PokemonSummarySearchInputs | null {
    const params: SearchUrlParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    if (
        params.gen &&
        isValidGen(params.gen) &&
        params.pokemon &&
        isValidPokemonDisplayName(params.pokemon, params.gen)
    ) {
        return {
            pokemonName: params.pokemon,
            generation: params.gen,
            isDoubles: isDoublesValid(params.gen, params.doubles),
            isLead: false,
        };
    }
    return null;
}

function getLocalStorageSearch(): Common.PokemonSummarySearchInputs | null {
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

function saveSearchToUrlParams(search: Common.PokemonSummarySearchInputs) {
    const params: SearchUrlParams = { pokemon: search.pokemonName, gen: search.generation };
    if (isDoublesValid(search.generation, search.isDoubles)){
        params.doubles = true;
    }

    const urlParams = qs.stringify(params, { addQueryPrefix: true });
    window.history.replaceState({}, "", urlParams);
}

function saveSearchToLocalStorage(search: Common.PokemonSummarySearchInputs) {
    try {
        window.localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(search));
    } catch (err) {
        console.log(err);
    }
}

export default useSavedSearch;
