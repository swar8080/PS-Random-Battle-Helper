/**
 * @prettier
 */

import * as React from "react";
import { getPokemonSpriteUrl } from "../util/sprites";
import './PokemonSummaryHeading.scss';

interface PokemonSummaryHeadingProps {
    pokemonDisplayName: string;
    generation: Common.Generation;
    isDoubles: boolean;
}

const PokemonSummaryHeading: React.FC<PokemonSummaryHeadingProps> = ({
    pokemonDisplayName,
    generation,
    isDoubles
}) => {
    const spriteUrl: string = getPokemonSpriteUrl(pokemonDisplayName, generation);
    const text: string  = `${pokemonDisplayName} (Gen ${generation}${isDoubles? " - Doubles" : ""})`;

    return (
        <div className="pokemonSummaryHeading">
            <img
                className="pokemonSummaryHeading__sprite"
                src={spriteUrl}
                alt={pokemonDisplayName}
            />
            <div className='pokemonSummaryHeading__text'>{text}</div>
        </div>
    );
};

export default PokemonSummaryHeading;
