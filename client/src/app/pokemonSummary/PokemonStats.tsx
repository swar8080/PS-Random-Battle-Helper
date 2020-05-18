/**
 * @prettier
 */

import * as React from "react";
import "./PokemonStats.scss";

interface PokemonStatsProps {
    stats: Common.BaseStats;
}

const STAT_LABELS: Record<keyof Common.BaseStats, string> = {
    atk: "Attack",
    spa: "Special Attack",
    def: "Defense",
    spd: "Special Defense",
    spe: "Speed",
    hp: "HP",
};

const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
    const getStatsInDescendingOrder = () => {
        return Object.entries(stats)
            .sort((keyValue1, keyValue2) => -(keyValue1[1] - keyValue2[1]))
            .map(([statKey, statValue]) => (
                <Stat
                    statLabel={STAT_LABELS[statKey as keyof Common.BaseStats]}
                    value={statValue}
                    key={statKey}
                />
            ));
    };

    return (
        <div className="pokemonStats">
            <div className="pokemonStats__heading">Base Stats</div>
            <div className="pokemonStats__statList">{getStatsInDescendingOrder()}</div>
        </div>
    );
};

interface StatProps {
    statLabel: string;
    value: number;
}

const Stat: React.FC<StatProps> = ({ statLabel, value }) => {
    return (
        <div className={`pokemonStats__stat`}>
            <div className="pokemonStats__statLabel">{statLabel}</div>
            <div className="pokemonStats__statValue">{value}</div>
        </div>
    );
};

export default PokemonStats;
