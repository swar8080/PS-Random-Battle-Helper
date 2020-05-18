/**
 * @prettier
 */

import * as React from "react";
import { getTypeLabelSpriteUrl } from "../util/sprites";
import "./PokemonTypeEffectiveness.scss";

interface PokemonTypeEffectivnessProps {
    pokemonType1: string;
    pokemonType2?: string;
    typeEffectivenessList: Record<Common.TypeEffectiveness, string[]>;
}

const PokemonTypeEffectivness: React.FC<PokemonTypeEffectivnessProps> = ({
    pokemonType1,
    pokemonType2,
    typeEffectivenessList,
}) => {
    return (
        <div className="typeEffectiveness">
            <div className='typeEffectiveness__container'>
                <div className="typeEffectiveness__heading">
                    <div>Type Effectiveness vs.</div>
                    <div className="typeEffectiveness__pokemonTypes">
                        <PokemonTypeLabel typeName={pokemonType1} />
                        {pokemonType2 && <PokemonTypeLabel typeName={pokemonType2} />}
                    </div>
                </div>
                <div className="typeEffectiveness__lists">
                    <TypeEffectivenessList multiplier={0.25} types={typeEffectivenessList[0.25]} />
                    <TypeEffectivenessList multiplier={0.5} types={typeEffectivenessList[0.5]} />
                    <TypeEffectivenessList multiplier={0} types={typeEffectivenessList[0]} />
                    <TypeEffectivenessList multiplier={2} types={typeEffectivenessList[2]} />
                    <TypeEffectivenessList multiplier={4} types={typeEffectivenessList[4]} />
                </div>
            </div>
        </div>
    );
};

interface TypeEffectivnessListProps {
    multiplier: Common.TypeEffectiveness;
    types: string[];
}

const TypeEffectivenessList: React.FC<TypeEffectivnessListProps> = ({ multiplier, types }) => {
    if (types && types.length > 0) {
        return (
            <div className="typeEffectiveness__list">
                <div>{`${multiplier}x damage:`}</div>
                {types.map((type) => (
                    <PokemonTypeLabel typeName={type} key={type} />
                ))}
            </div>
        );
    } else {
        return null;
    }
};

interface PokemonTypeLabel {
    typeName: string;
}
const PokemonTypeLabel: React.FC<PokemonTypeLabel> = ({ typeName }) => {
    return <img src={getTypeLabelSpriteUrl(typeName)} alt="" className={"pokemon-type-label"} />;
};

export default PokemonTypeEffectivness;
