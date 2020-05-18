/**
 * @prettier
 */
import React from "react";
import PokemonSummary from "./pokemonSummary/PokemonSummary";
import "./App.scss";
import AppHeader from "./AppHeader";
import useSavedSearch from "./useSavedSearch";
import { useAnalytics } from "./useAnalytics";

const App = () => {
    const { savedSearch, saveSearch } = useSavedSearch();
    const { trackSearchChange } = useAnalytics();

    const onSearchChange = (search: Client.PokemonSummarySearchInputs) => {
        trackSearchChange(search);
        saveSearch(search);
    };

    return (
        <>
            <AppHeader />
            <PokemonSummary initialSearch={savedSearch} onSearchChange={onSearchChange} />
        </>
    );
};

export default App;
