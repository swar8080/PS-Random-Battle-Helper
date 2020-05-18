/**
 * @prettier
 */

import * as React from "react";
import {getItemSpriteUrl} from '../util/sprites';
import "./PokemonItems.scss";

interface PokemonItemsProps {
    itemOccurences: Common.ItemOccurence[];
}

const PokemonItems: React.FC<PokemonItemsProps> = ({ itemOccurences }) => {
    const itemEntries = itemOccurences.map((item) => (
        <div className='itemOccurences__itemOccurence' key={item.itemDisplayName}>
            <div className='tooltip' title={item.description}>
                <img src={getItemSpriteUrl(item.itemDisplayName)} alt=''/>
                <span>{item.itemDisplayName}</span>
                <span>:</span>
            </div>
            <div>{item.occurences} occurrences</div>
        </div>
    ));

    return (
        <div className="itemOccurences">
            <div className="itemOccurences__heading">Items</div>
            {itemEntries}
        </div>
    );
};

export default PokemonItems;
