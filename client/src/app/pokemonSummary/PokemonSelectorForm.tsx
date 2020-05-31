/**
 * @prettier
 */

import * as React from "react";
import { Formik } from "formik";
import cn from "classnames";
import "./PokemonSelectorForm.scss";
import PokemonAutoSuggestInput from "./PokemonAutoSuggestInput";
import { isValidPokemonDisplayName } from "../util/pokemonMetadataUtil";
import { onEnterKeyPressed } from "../util/keyboardUtil";

interface PokemonSelectorFormProps {
    onSubmit: (inputs: PokemonSelectorFormInputs) => Promise<any>;
    isLoading: boolean;
    initialValues: PokemonSelectorFormInputs;
    lastSubmitResult: Client.APIResponseResult;
}

export type PokemonSelectorFormInputs = {
    pokemonName: string;
    generation: Common.Generation;
    isLead: boolean;
};

const DEFAULT_SUBMIT_ERR_MSG = "Error retrieving results";

const PokemonSelectorForm: React.FC<PokemonSelectorFormProps> = ({
    onSubmit,
    isLoading,
    initialValues,
    lastSubmitResult,
}) => {
    const pokemonNameInputRef = React.useRef<HTMLInputElement>();

    //select name input on initial render
    React.useEffect(() => {
        pokemonNameInputRef.current && pokemonNameInputRef.current.select();
    }, []);

    //re-focus on the name input whenever the user comes back to the page or clicks on the input
    React.useEffect(() => {
        const nameInput = pokemonNameInputRef.current;

        if (nameInput) {
            const selectNameInput = () => nameInput.select();

            window.addEventListener("focus", selectNameInput);
            nameInput.addEventListener("click", selectNameInput);
            return () => {
                window.removeEventListener("focus", selectNameInput);
                nameInput.removeEventListener("click", selectNameInput);
            };
        }
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values).then(() => {
                    setSubmitting(false);

                    //Reset the tab indexes. That way, if the user loses focus on the input, they can press tab to immediately re-select it
                    document.body.tabIndex = 0;
                    document.body.focus();
                    document.body.tabIndex = -1;

                    //Immediately re-select the input's text so that the user can more quickly clear it for the next pokemon
                    pokemonNameInputRef.current && pokemonNameInputRef.current.select();

                    window.scrollTo(0, 0);
                });
            }}
            children={({ values, handleSubmit, handleChange, setFieldValue, isSubmitting }) => {
                const hasValidPokemon = isValidPokemonDisplayName(values.pokemonName, values.generation);
                const canSubmit: boolean = !isLoading && hasValidPokemon;

                const getSubmitButtonTooltip = (): string => {
                    return !hasValidPokemon && !isLoading ? "Enter a valid pokemon name" : "";
                };

                const submitButtonClass = cn({
                    "pokemonSelectorForm__submitButton--loading": isLoading,
                    "pokemonSelectorForm__submitButton--invalidPokemon": !hasValidPokemon,
                });

                const handleSuggestionSelected = (pokemonName: string) => {
                    setFieldValue("pokemonName", pokemonName);
                    handleSubmit();
                };

                const submitIfEnterPressed = (event: React.KeyboardEvent) => {
                    if (canSubmit){
                        onEnterKeyPressed(event, handleSubmit);
                    }
                }

                return (
                    <div className="pokemonSelectorForm">
                        <div className="pokemonSelectorForm__inputs">
                            <label>Pokemon:</label>
                            <div className="pokemonSelectorForm__nameInputContainer">
                                <PokemonAutoSuggestInput
                                    value={values.pokemonName}
                                    currentGen={values.generation}
                                    handleChange={handleChange}
                                    onSuggestionSelected={handleSuggestionSelected}
                                    inputProps={{
                                        name: "pokemonName",
                                        className: "pokemonSelectorForm-input",
                                        onKeyPress: submitIfEnterPressed,
                                        disabled: isSubmitting,
                                    }}
                                    inputRef={pokemonNameInputRef}
                                />
                            </div>
                            <div>
                                <label>Format:</label>
                                <select
                                    name="generation"
                                    value={values.generation}
                                    onChange={handleChange}
                                    className="pokemonSelectorForm-input"
                                >
                                    <option value="1">Gen 1 Random Battle</option>
                                    <option value="2">Gen 2 Random Battle</option>
                                    <option value="3">Gen 3 Random Battle</option>
                                    <option value="4">Gen 4 Random Battle</option>
                                    <option value="5">Gen 5 Random Battle</option>
                                    <option value="6">Gen 6 Random Battle</option>
                                    <option value="7">Gen 7 Random Battle</option>
                                    <option value="8">Gen 8 Random Battle</option>
                                </select>
                            </div>
                            <button
                                onClick={() => handleSubmit()}
                                disabled={!canSubmit}
                                className={submitButtonClass}
                                title={getSubmitButtonTooltip()}
                            >
                                Submit
                            </button>
                        </div>
                        {!isLoading && !lastSubmitResult.successful && (
                            <div className="pokemonSelectorForm__submitError">
                                {lastSubmitResult.errorMsg || DEFAULT_SUBMIT_ERR_MSG}
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
};

export default PokemonSelectorForm;
