/**
 * @prettier
 */

import * as React from "react";
import "./PokemonAbilities.scss";

interface PokemonAbilitiesProps {
    abilityOccurences: Common.AbilityOccurence[];
}

const PokemonAbilities: React.FC<PokemonAbilitiesProps> = ({ abilityOccurences }) => {
    const abilityItems = abilityOccurences.map((ability) => (
        <div
            className="abilityOccurences__ability"
            title={ability.description}
            key={ability.abilityDisplayName}
        >
            <div className="abilityOccurences__name">
                <span className="tooltip">{ability.abilityDisplayName}</span>
                <span>:</span>
            </div>
            <div className="abilityOccurences__percentage">{ability.occurences} occurrences</div>
        </div>
    ));

    return (
        <div className={"abilityOccurences"}>
            <div className="abilityOccurences__heading">Abilities</div>
            {abilityItems}
        </div>
    );
};

export default PokemonAbilities;
