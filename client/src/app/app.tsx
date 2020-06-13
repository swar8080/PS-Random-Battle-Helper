/**
 * @prettier
 */
import React from "react";
import PokemonSummary from "./pokemonSummary/PokemonSummary";
import "./App.scss";
import AppHeader from "./AppHeader";
import AppFooter from './AppFooter';
import useSavedSearch from "./useSavedSearch";
import { useAnalytics } from "./useAnalytics";

const App = () => {
    const { initialSearch, saveSearch } = useSavedSearch();
    const { trackSearchChange } = useAnalytics();

    const onSearchChange = (search: Common.PokemonSummarySearchInputs) => {
        trackSearchChange(search);
        saveSearch(search);
    };

    return (
        <div className='app'>
            <AppHeader />
            <PokemonSummary initialSearch={initialSearch} onSearchChange={onSearchChange} />
            <AppFooter />
        </div>
    );
};

export default App;
