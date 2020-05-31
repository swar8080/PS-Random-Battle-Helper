/**
 * @prettier
 */

import * as React from "react";
import Autosuggest from "react-autosuggest";
import "./PokemonAutoSuggestInput.scss";
import { displayNameToPokemonId, getSortedPokemonIdsReleasedInGen, pokemonIdToDisplayName } from "../util/pokemonMetadataUtil";

interface PokemonAutoSuggestInputProps {
    value: string;
    currentGen: Common.Generation;
    handleChange(e: React.ChangeEvent<any>): void;
    onSuggestionSelected(newNameValue: string): void;
    inputProps: Partial<React.InputHTMLAttributes<any>>;
    inputRef: React.MutableRefObject<HTMLInputElement | undefined>;
}

const SUGGESTION_LIMIT = 7;

const PokemonAutoSuggestInput: React.FC<PokemonAutoSuggestInputProps> = ({
    value,
    currentGen,
    handleChange,
    onSuggestionSelected,
    inputProps,
    inputRef,
}) => {
    const displayNamesInGen: string[] = React.useMemo(() => getSortedPokemonIdsReleasedInGen(currentGen), [currentGen]);
    const suggestions: string[] = React.useMemo(() => getSuggestions(value, displayNamesInGen, SUGGESTION_LIMIT), [
        value,
        displayNamesInGen,
    ]);

    return (
        <Autosuggest
            inputProps={{
                ...inputProps,
                value,
                onChange: handleChange,
            }}
            suggestions={suggestions}
            getSuggestionValue={(name) => name}
            renderSuggestion={(name) => <span key={name}>{name}</span>}
            onSuggestionSelected={(event, { suggestionValue }) =>
                onSuggestionSelected(suggestionValue)
            }
            onSuggestionsFetchRequested={() => {}}
            //@ts-ignore
            renderInputComponent={(props) => <input {...props} ref={inputRef} />}
            onSuggestionsClearRequested={() => {}}
            highlightFirstSuggestion
        />
    );
};

function getSuggestions(searchString: string, displayNames: string[], limit: number): string[] {
    let suggestions: string[] = [];
    if (searchString) {
        searchString = displayNameToPokemonId(searchString);
        const firstMatchingIndex = findFirstMatchingIndex(searchString, displayNames);
        if (firstMatchingIndex !== -1) {
            suggestions = displayNames
                .slice(firstMatchingIndex, firstMatchingIndex + limit)
                .filter(pokemonId => pokemonId.startsWith(searchString))
                .map(pokemonIdToDisplayName)
        }
    }
    return suggestions;
}

export function findFirstMatchingIndex(searchString: string, sortedNames: string[]): number {
    //edge case for matching on the first name
    if (sortedNames[0].startsWith(searchString)) {
        return 0;
    }

    let lowestMatchingIndex = -1;

    let low = 0;
    let high = sortedNames.length - 1;
    let mid = Math.floor(high / 2);

    while (mid > low && mid < sortedNames.length) {
        const nameAtMid = sortedNames[mid];
        const prefixAtMid = nameAtMid.substring(0, Math.min(nameAtMid.length, searchString.length));

        if (searchString === prefixAtMid) {
            lowestMatchingIndex = mid;
        }

        if (searchString.localeCompare(nameAtMid) <= 0) {
            //might be a lower match to the left
            high = mid;
            mid = Math.floor((mid + low) / 2);
        } else if (lowestMatchingIndex === -1 || mid < lowestMatchingIndex) {
            //a lower match may still be to the right
            low = mid;
            mid = Math.ceil((mid + high) / 2);
        } else {
            //already found a lower match, do not look to the right for more
            break;
        }
    }

    return lowestMatchingIndex;
}

export default PokemonAutoSuggestInput;
