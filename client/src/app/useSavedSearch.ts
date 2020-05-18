/**
 * @prettier
 */

import * as React from "react";

const SEARCH_STORAGE_KEY = "pokemonshowdown-random-battle-helper__search";
const DEFAULT_SEARCH: Client.PokemonSummarySearchInputs = {
    pokemonName: "Pikachu",
    generation: "8",
    isLead: false,
};

const useSavedSearch = () => {
    const localStorageSearch = React.useRef(getLocalStorageSearch());
    return {
        savedSearch: localStorageSearch.current,
        saveSearch,
    };
};

function getLocalStorageSearch(): Client.PokemonSummarySearchInputs {
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

    return DEFAULT_SEARCH;
}

function saveSearch(search: Client.PokemonSummarySearchInputs) {
    try {
        window.localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(search));
    } catch (err) {
        console.log(err);
    }
}

export default useSavedSearch;
