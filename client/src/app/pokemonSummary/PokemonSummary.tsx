/**
 * @prettier
 */

import React, { useEffect, useReducer } from "react";
import cn from "classnames";
import PokemonSelectorForm, { PokemonSelectorFormInputs } from "./PokemonSelectorForm";
import PokemonSummaryHeading from "./PokemonSummaryHeading";
import PokemonMovesets from "./PokemonMovesets";
import PokemonItems from "./PokemonItems";
import PokemonAbilities from "./PokemonAbilities";
import PokemonStats from "./PokemonStats";
import PokemonTypeEffectivness from "./PokemonTypeEffectivness";
import Api from "../../api";
import "./PokemonSummary.scss";
import "./common.scss";
import "./spinner.css";
import { trackException } from "../useAnalytics";

export interface PokemonSummaryProps {
    initialSearch: Client.PokemonSummarySearchInputs;
    onSearchChange?: (search: Client.PokemonSummarySearchInputs) => void;
}

type PokemonSummaryWithGeneration = Common.PokemonSummary & { generation: Common.Generation };
type State = {
    pokemonSummary?: PokemonSummaryWithGeneration;
    isLoading: boolean;
    lastSubmitResult: Client.APIResponseResult;
};

type Action =
    | { type: "loadingSummary" }
    | { type: "loadedSummary"; pokemonSummary: PokemonSummaryWithGeneration }
    | { type: "loadingSummaryError"; errorMsg?: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "loadingSummary":
            return {
                ...state,
                isLoading: true,
            };
        case "loadedSummary":
            return {
                ...state,
                pokemonSummary: action.pokemonSummary,
                isLoading: false,
                lastSubmitResult: { successful: true },
            };
        case "loadingSummaryError":
            return {
                ...state,
                isLoading: false,
                lastSubmitResult: { successful: false, errorMsg: action.errorMsg },
            };
        default:
            return state;
    }
}

const PokemonSummary: React.FC<PokemonSummaryProps> = ({ initialSearch, onSearchChange }) => {
    const [state, dispatch] = useReducer(reducer, {
        isLoading: true,
        lastSubmitResult: { successful: true },
    });

    useEffect(() => {
        if (initialSearch && initialSearch.pokemonName) {
            loadPokemonSummary(initialSearch);
        }
    }, [initialSearch]);

    const loadPokemonSummary = (inputs: PokemonSelectorFormInputs) => {
        dispatch({ type: "loadingSummary" });
        return Api.getPokemonSummary(inputs.pokemonName, inputs.generation)
            .then((res) => {
                if (res.successful) {
                    dispatch({
                        type: "loadedSummary",
                        pokemonSummary: {
                            ...res.data,
                            generation: inputs.generation,
                        },
                    });
                    onSearchChange && onSearchChange(inputs);
                } else {
                    dispatch({
                        type: "loadingSummaryError",
                        errorMsg: res.errorMsg,
                    });
                }
            })
            .catch((err) => {
                dispatch({ type: "loadingSummaryError" });
                trackException(err, false);
            });
    };

    return (
        <div className="pokemonSummary">
            <div className="pokemonSummary__form">
                <PokemonSelectorForm
                    onSubmit={loadPokemonSummary}
                    isLoading={state.isLoading}
                    lastSubmitResult={state.lastSubmitResult}
                    initialValues={initialSearch}
                />
            </div>
            <div
                className={cn({
                    "pokemonSummary__resultsContainer--loading": state.isLoading,
                })}
            >
                {state.isLoading && <LoadingIndicator />}
                {!!state.pokemonSummary && (
                    <div className="pokemonSummary__results">
                        <div className="pokemonSummary__heading">
                            <PokemonSummaryHeading
                                pokemonDisplayName={state.pokemonSummary.displayName}
                                generation={state.pokemonSummary.generation}
                            />
                        </div>
                        <div className="pokemonSummary__data">
                            <div className="pokemonSummary__simulation">
                                <div className="pokemonSummary__simulationDataHeading">
                                    Simulation Results
                                </div>
                                <div className="pokemonSummary__simulationSubheading">
                                    (Based on {state.pokemonSummary.simulationResult.setsGenerated}{" "}
                                    randomly generated configurations for{" "}
                                    {state.pokemonSummary.displayName})
                                </div>
                                <div className="pokemonSummary__simulationData">
                                    <div className="pokemonSummary__movesets">
                                        <PokemonMovesets
                                            moveOccurences={
                                                state.pokemonSummary.simulationResult
                                                    .moveOccurrences
                                            }
                                        />
                                    </div>
                                    <div className="pokemonSummary__abilities">
                                        <PokemonAbilities
                                            abilityOccurences={
                                                state.pokemonSummary.simulationResult
                                                    .abilityOccurences
                                            }
                                        />
                                    </div>
                                    <div className="pokemonSummary__items">
                                        <PokemonItems
                                            itemOccurences={
                                                state.pokemonSummary.simulationResult.itemOccurences
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pokemonSummary_generalInfo">
                                <div className="pokemonSummary__stats">
                                    <PokemonStats stats={state.pokemonSummary.baseStats} />
                                </div>
                                <div className="pokemonSummary__typeEffectiveness">
                                    <PokemonTypeEffectivness
                                        pokemonType1={state.pokemonSummary.type1}
                                        pokemonType2={state.pokemonSummary.type2}
                                        typeEffectivenessList={
                                            state.pokemonSummary.typeEffectiveness
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoadingIndicator: React.FC = () => {
    return (
        <div className="pokemonSummary__spinnerContainer">
            <div className="pokemonSummary__spinner sk-fading-circle">
                <div className="sk-circle1 sk-circle"></div>
                <div className="sk-circle2 sk-circle"></div>
                <div className="sk-circle3 sk-circle"></div>
                <div className="sk-circle4 sk-circle"></div>
                <div className="sk-circle5 sk-circle"></div>
                <div className="sk-circle6 sk-circle"></div>
                <div className="sk-circle7 sk-circle"></div>
                <div className="sk-circle8 sk-circle"></div>
                <div className="sk-circle9 sk-circle"></div>
                <div className="sk-circle10 sk-circle"></div>
                <div className="sk-circle11 sk-circle"></div>
                <div className="sk-circle12 sk-circle"></div>
            </div>
        </div>
    );
};

export default PokemonSummary;
