/**
 * @prettier
 */

import * as React from "react";
import cn from "classnames";
import "./move-type-backgrounds.css";
import "./PokemonMovesets.scss";
import { getMoveEffectTypeSpriteUrl, getTypeLabelSpriteUrl } from "../util/sprites";
import { getDisplayedTypeName } from "../util/showdownMetadataUtil";

interface PokemonMovesetsProps {
    moveOccurences: Common.MoveWithOccurences[];
}

const PokemonMovesets: React.FC<PokemonMovesetsProps> = ({ moveOccurences }) => {
    return (
        <div className="movesets">
            <div className="movesets__columnHeaders">
                <div>Move</div>
                <div>Move Occurrences</div>
            </div>
            {moveOccurences.map((move) => (
                <MoveRow move={move} key={move.name} />
            ))}
        </div>
    );
};

interface MoveRowProps {
    move: Common.MoveWithOccurences;
}

const MoveRow: React.FC<MoveRowProps> = ({ move }) => {
    const [isHovering, setIsHovering] = React.useState(false);

    const className = cn(
        'movesets__movesetRow',
        `move-type-background-${getDisplayedTypeName(move.moveType)}`,
    );

    return (
        <div
            title={move.description}
            className={className}
            onMouseOver={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <MoveDetails move={move} showAdditionalDetails={isHovering} />
            <div className="movesets__moveOccurrences">{move.occurences}</div>
        </div>
    );
};

interface MoveDetailsProps {
    move: Common.Move;
    showAdditionalDetails: boolean;
}

const MoveDetails: React.FC<MoveDetailsProps> = ({ move, showAdditionalDetails }) => {
    return (
        <div className="movesets__moveDetails">
            <div className="movesets__mainDetails">
                <div className="movesets__moveName tooltip">{move.name}</div>
                {showAdditionalDetails && (
                    <>
                        <img
                            src={getTypeLabelSpriteUrl(move.moveType)}
                            className="movesets__moveType"
                            alt=""
                        />
                        <img
                            src={getMoveEffectTypeSpriteUrl(move.effectType)}
                            className="movesets__moveEffectType"
                            alt=""
                        />
                    </>
                )}
            </div>
            {showAdditionalDetails && (
                <div className="movesets__additionalDetails">
                    {!!move.damage && <div>Power: {move.damage}</div>}
                    {move.accuracy && <div>Accuracy: {move.accuracy}%</div>}
                    <div>{move.pp}PP</div>
                </div>
            )}
        </div>
    );
};

export default PokemonMovesets;
