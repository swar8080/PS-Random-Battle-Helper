/**
 * @prettier
 */

import * as React from "react";
import "./move-type-backgrounds.css";
import "./PokemonMovesets.scss";
import { getMoveEffectTypeSpriteUrl, getTypeLabelSpriteUrl } from "../util/sprites";

interface PokemonMovesetsProps {
    moveOccurences: Common.MovesWithOccurences;
}

const PokemonMovesets: React.FC<PokemonMovesetsProps> = ({ moveOccurences }) => {
    const moveEntries = moveOccurences.map((move) => (
        <div key={move.name} className={`movesets__moveset move-type-background-${move.moveType}`}>
            <MoveDetails move={move} key={move.name} />
            <div className="movesets__moveOccurrences">{move.occurences}</div>
        </div>
    ));
    return (
        <div className="movesets">
            <div className="movesets__columnHeaders">
                <div>Move</div>
                <div>Move Occurrences</div>
            </div>
            {moveEntries}
        </div>
    );
};

interface MoveProps {
    move: Common.Move;
}

const MoveDetails: React.FC<MoveProps> = ({ move }) => {
    const [isHovering, setIsHovering] = React.useState(false);

    const additionalDetailsStyle = {
        display: isHovering ? "initial" : "none",
    };

    return (
        <div
            className="movesets__moveDetails tooltip"
            title={move.description}
            onMouseOver={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="movesets__moveName">{move.name}</div>
            <img
                src={getTypeLabelSpriteUrl(move.moveType)}
                className="movesets__moveType"
                style={additionalDetailsStyle}
                alt=""
            />
            <img
                src={getMoveEffectTypeSpriteUrl(move.effectType)}
                className="movesets__moveEffectType"
                style={additionalDetailsStyle}
                alt=""
            />
        </div>
    );
};

export default PokemonMovesets;
