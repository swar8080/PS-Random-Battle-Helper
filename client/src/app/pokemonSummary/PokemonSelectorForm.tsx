/**
 * @prettier
 */

import cn from "classnames";
import { Formik } from "formik";
import * as React from "react";
import { onEnterKeyPressed } from "../util/keyboardUtil";
import { isValidPokemonDisplayName, doesLeadAffectSimulation } from "../util/showdownMetadataUtil";
import PokemonAutoSuggestInput from "./PokemonAutoSuggestInput";
import "./PokemonSelectorForm.scss";

interface PokemonSelectorFormProps {
    onSubmit: (inputs: Common.PokemonSummarySearchInputs) => Promise<any>;
    isLoading: boolean;
    initialSearch: Common.PokemonSummarySearchInputs;
    lastSubmitResult: Client.APIResponseResult;
}

export type PokemonSelectorFormInputs = {
    pokemonName: string;
    format: BattleFormat;
    isLead: boolean;
};

const DOUBLES_FORMAT = "8-doubles";
type BattleFormat = Common.Generation | "8-doubles";
const getGenForFormat = (format: BattleFormat): Common.Generation =>
    format === DOUBLES_FORMAT ? "8" : format;

const DEFAULT_SUBMIT_ERR_MSG = "Error retrieving results";

const PokemonSelectorForm: React.FC<PokemonSelectorFormProps> = ({
    onSubmit,
    isLoading,
    initialSearch,
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

    const initialFormInputs: PokemonSelectorFormInputs = {
        ...initialSearch,
        format:
            initialSearch.generation === "8" && initialSearch.isDoubles
                ? DOUBLES_FORMAT
                : initialSearch.generation,
    };

    return (
        <Formik
            initialValues={initialFormInputs}
            onSubmit={(values, { setSubmitting }) => {
                const generation: Common.Generation = getGenForFormat(values.format);
                const search: Common.PokemonSummarySearchInputs = {
                    pokemonName: values.pokemonName,
                    generation: generation,
                    isDoubles: values.format === DOUBLES_FORMAT,
                    isLead: doesLeadAffectSimulation(generation) && values.isLead,
                };

                onSubmit(search).then(() => {
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
                const gen: Common.Generation = getGenForFormat(values.format);
                const hasValidPokemon = isValidPokemonDisplayName(values.pokemonName, gen);
                const canSubmit: boolean = !isLoading && hasValidPokemon;
                const hasLeadOption: boolean = doesLeadAffectSimulation(gen);

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
                    if (canSubmit) {
                        onEnterKeyPressed(event, handleSubmit);
                    }
                };

                return (
                    <div className="pokemonSelectorForm">
                        <div className="pokemonSelectorForm__inputs">
                            <label>Pokemon:</label>
                            <div className="pokemonSelectorForm__nameInputContainer">
                                <PokemonAutoSuggestInput
                                    value={values.pokemonName}
                                    currentGen={gen}
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
                                    name="format"
                                    value={values.format}
                                    onChange={handleChange}
                                    className="pokemonSelectorForm-input"
                                >
                                    <option value="8">Gen 8 Random Battle</option>
                                    <option value={DOUBLES_FORMAT}>
                                        Gen 8 Random Doubles Battle
                                    </option>
                                    <option value="7">Gen 7 Random Battle</option>
                                    <option value="6">Gen 6 Random Battle</option>
                                    <option value="5">Gen 5 Random Battle</option>
                                    <option value="4">Gen 4 Random Battle</option>
                                    <option value="3">Gen 3 Random Battle</option>
                                    <option value="2">Gen 2 Random Battle</option>
                                    <option value="1">Gen 1 Random Battle</option>
                                </select>
                            </div>
                            {hasLeadOption && (
                                <div
                                    className="pokemonSelectorForm__leadContainer pokemonSelectorForm-input"
                                    title="Lead Pokemon in Team"
                                >
                                    <label>Lead?</label>
                                    <input
                                        type="checkbox"
                                        name="isLead"
                                        checked={values.isLead}
                                        onChange={handleChange}
                                        className="pokemonSelectorForm__leadCheckbox"
                                    />
                                </div>
                            )}
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
